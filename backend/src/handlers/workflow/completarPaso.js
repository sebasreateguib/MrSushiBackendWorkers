const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { SFNClient, SendTaskSuccessCommand } = require('@aws-sdk/client-sfn');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { docClient } = require('../../lib/dynamo');
const { requireWorker } = require('../../lib/authMiddleware');
const res = require('../../lib/response');

const TENANT_ID     = process.env.TENANT_ID;
const ORDERS_TABLE  = process.env.ORDERS_TABLE;
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

const PASOS_VALIDOS = ['cocina', 'empaque', 'entrega'];

// El status global del pedido tras completar cada paso
const STATUS_TRAS_PASO = {
  cocina:  'EN_EMPAQUE',
  empaque: 'EN_CAMINO',
  entrega: 'ENTREGADO',
};

// Qué rol puede completar qué paso
const ROL_REQUERIDO = {
  cocina:  ['cocinero', 'admin'],
  empaque: ['empacador', 'admin'],
  entrega: ['repartidor', 'admin'],
};

const sfn         = new SFNClient({});
const eventBridge = new EventBridgeClient({});

exports.handler = async (event) => {
  // Verificar JWT de trabajador
  const auth = requireWorker(event);
  if (auth.statusCode) return auth;

  const { orderId, step } = event.pathParameters || {};

  if (!PASOS_VALIDOS.includes(step)) {
    return res.badRequest(`Paso inválido. Debe ser uno de: ${PASOS_VALIDOS.join(', ')}`);
  }

  // Verificar que el rol del trabajador puede manejar este paso
  if (!ROL_REQUERIDO[step].includes(auth.role)) {
    return res.forbidden(
      `Tu rol (${auth.role}) no puede completar el paso "${step}". Requiere: ${ROL_REQUERIDO[step].join(' o ')}.`
    );
  }

  // El workerId viene del JWT (no del body)
  const workerId     = auth.email;
  const workerNombre = auth.nombre;
  const now          = new Date().toISOString();

  try {
    const { Item: orden } = await docClient.send(
      new GetCommand({ TableName: ORDERS_TABLE, Key: { tenantId: TENANT_ID, orderId } })
    );

    if (!orden) return res.notFound('Pedido no encontrado');

    const pasoActual = orden.steps?.[step];
    if (!pasoActual?.taskToken) {
      return res.badRequest(
        `El paso "${step}" todavía no está listo para completarse (no tiene taskToken).`
      );
    }

    // 1) Avanza el Step Functions — el workflow pasa al siguiente estado
    await sfn.send(
      new SendTaskSuccessCommand({
        taskToken: pasoActual.taskToken,
        output: JSON.stringify({ orderId, step, completedBy: workerId, completedAt: now }),
      })
    );

    // 2) Actualiza el registro del pedido en DynamoDB
    const nuevoStatus = STATUS_TRAS_PASO[step];
    await docClient.send(
      new UpdateCommand({
        TableName: ORDERS_TABLE,
        Key: { tenantId: TENANT_ID, orderId },
        UpdateExpression:
          'SET steps.#step.#status = :completado, steps.#step.finishedAt = :now, steps.#step.finishedBy = :worker, #globalStatus = :nuevoStatus, updatedAt = :now REMOVE steps.#step.taskToken',
        ExpressionAttributeNames: {
          '#step':         step,
          '#status':       'status',
          '#globalStatus': 'status',
        },
        ExpressionAttributeValues: {
          ':completado':  'COMPLETADO',
          ':now':         now,
          ':worker':      { workerId, workerNombre },
          ':nuevoStatus': nuevoStatus,
        },
      })
    );

    // 3) Publica evento de cambio de estado para el dashboard del cliente y notificaciones
    await eventBridge.send(
      new PutEventsCommand({
        Entries: [
          {
            Source:       'mrsushi.orders',
            DetailType:   'OrderStatusChanged',
            EventBusName: EVENT_BUS_NAME,
            Detail: JSON.stringify({
              orderId,
              tenantId: TENANT_ID,
              step,
              stepStatus:    'COMPLETADO',
              globalStatus:  nuevoStatus,
              completedBy:   workerId,
              at:            now,
            }),
          },
        ],
      })
    );

    return res.ok({
      orderId,
      step,
      stepStatus:   'COMPLETADO',
      globalStatus: nuevoStatus,
      completedBy:  workerNombre,
    });
  } catch (err) {
    console.error('completarPaso error:', err);
    return res.serverError('No se pudo completar el paso.');
  }
};
