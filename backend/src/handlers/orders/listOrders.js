const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../lib/dynamo');
const { requireWorker } = require('../../lib/authMiddleware');
const res = require('../../lib/response');

const TENANT_ID   = process.env.TENANT_ID;
const ORDERS_TABLE = process.env.ORDERS_TABLE;

// Estados que se consideran "activos" para el panel de trabajadores.
// Los pedidos ENTREGADOS o FALLIDOS no necesitan atención del trabajador.
const ESTADOS_ACTIVOS = [
  'PEDIDO_RECIBIDO',
  'EN_COCINA',
  'EN_EMPAQUE',
  'EN_CAMINO',
];

exports.handler = async (event) => {
  // Verificar JWT de trabajador
  const auth = requireWorker(event);
  if (auth.statusCode) return auth;

  try {
    // Obtiene el query param ?todos=true para ver también entregados/fallidos
    const verTodos = event.queryStringParameters?.todos === 'true';

    // Scan filtrando por tenantId (en producción real se usaría un GSI por status)
    const { Items } = await docClient.send(
      new ScanCommand({
        TableName: ORDERS_TABLE,
        FilterExpression: verTodos
          ? 'tenantId = :tid'
          : 'tenantId = :tid AND #status IN (:s1, :s2, :s3, :s4)',
        ExpressionAttributeNames: verTodos ? undefined : {
          '#status': 'status',
        },
        ExpressionAttributeValues: verTodos
          ? { ':tid': TENANT_ID }
          : {
              ':tid': TENANT_ID,
              ':s1':  ESTADOS_ACTIVOS[0],
              ':s2':  ESTADOS_ACTIVOS[1],
              ':s3':  ESTADOS_ACTIVOS[2],
              ':s4':  ESTADOS_ACTIVOS[3],
            },
      })
    );

    // Ordenar por createdAt más reciente primero
    const ordenados = (Items || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.ok({ pedidos: ordenados, total: ordenados.length });
  } catch (err) {
    console.error('listOrders error:', err);
    return res.serverError('No se pudo obtener la lista de pedidos.');
  }
};
