const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../lib/dynamo');
const { requireWorker } = require('../../lib/authMiddleware');
const res = require('../../lib/response');

const TENANT_ID    = process.env.TENANT_ID;
const ORDERS_TABLE = process.env.ORDERS_TABLE;

const PASOS_VALIDOS = ['cocina', 'empaque', 'entrega'];

// Qué rol puede iniciar qué paso
const ROL_REQUERIDO = {
  cocina:  ['cocinero', 'admin'],
  empaque: ['empacador', 'admin'],
  entrega: ['repartidor', 'admin'],
};

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
      `Tu rol (${auth.role}) no puede iniciar el paso "${step}". Requiere: ${ROL_REQUERIDO[step].join(' o ')}.`
    );
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return res.badRequest('JSON inválido');
  }

  // El workerId viene del JWT directamente (no del body, para evitar suplantación)
  const workerId    = auth.email;
  const workerNombre = auth.nombre;

  try {
    const { Item: orden } = await docClient.send(
      new GetCommand({ TableName: ORDERS_TABLE, Key: { tenantId: TENANT_ID, orderId } })
    );

    if (!orden) return res.notFound('Pedido no encontrado');

    const pasoActual = orden.steps?.[step];
    if (pasoActual?.status !== 'DISPONIBLE') {
      return res.badRequest(
        `El paso "${step}" no está disponible para iniciar. Estado actual: ${pasoActual?.status || 'PENDIENTE'}.`
      );
    }

    await docClient.send(
      new UpdateCommand({
        TableName: ORDERS_TABLE,
        Key: { tenantId: TENANT_ID, orderId },
        UpdateExpression:
          'SET steps.#step.#status = :enProceso, steps.#step.startedAt = :now, steps.#step.startedBy = :worker, updatedAt = :now',
        ExpressionAttributeNames: { '#step': step, '#status': 'status' },
        ExpressionAttributeValues: {
          ':enProceso': 'EN_PROCESO',
          ':now':       new Date().toISOString(),
          ':worker':    { workerId, workerNombre },
        },
      })
    );

    return res.ok({ orderId, step, status: 'EN_PROCESO', startedBy: workerNombre });
  } catch (err) {
    console.error('iniciarPaso error:', err);
    return res.serverError('No se pudo iniciar el paso.');
  }
};
