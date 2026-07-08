const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../lib/dynamo');
const { requireWorker } = require('../../lib/authMiddleware');
const res = require('../../lib/response');

const TENANT_ID    = process.env.TENANT_ID;
const ORDERS_TABLE = process.env.ORDERS_TABLE;

exports.handler = async (event) => {
  // Verificar JWT de trabajador
  const auth = requireWorker(event);
  if (auth.statusCode) return auth;

  const { orderId } = event.pathParameters || {};
  if (!orderId) return res.badRequest('Falta orderId');

  try {
    const { Item: orden } = await docClient.send(
      new GetCommand({
        TableName: ORDERS_TABLE,
        Key: { tenantId: TENANT_ID, orderId },
      })
    );

    if (!orden) return res.notFound('Pedido no encontrado');

    // El trabajador ve el pedido completo incluyendo los steps con taskTokens
    // (el cliente no debe ver los taskTokens)
    return res.ok(orden);
  } catch (err) {
    console.error('getOrder error:', err);
    return res.serverError('No se pudo obtener el pedido.');
  }
};
