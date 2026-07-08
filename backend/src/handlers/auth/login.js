const bcrypt = require('bcryptjs');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../lib/dynamo');
const { firmar } = require('../../lib/jwt');
const res = require('../../lib/response');

const TENANT_ID    = process.env.TENANT_ID;
const WORKERS_TABLE = process.env.WORKERS_TABLE;

// Roles que se consideran "trabajadores" (nunca 'cliente')
const ROLES_TRABAJADOR = ['cocinero', 'empacador', 'repartidor', 'admin'];

exports.handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return res.badRequest('JSON inválido');
  }

  const { email, password } = body;
  if (!email || !password) {
    return res.badRequest('Completa todos los campos.');
  }

  const emailNormalizado = email.toLowerCase().trim();

  const { Item: worker } = await docClient.send(
    new GetCommand({
      TableName: WORKERS_TABLE,
      Key: { tenantId: TENANT_ID, email: emailNormalizado },
    })
  );

  // No diferenciamos entre "no existe" y "contraseña incorrecta" por seguridad
  if (!worker) {
    return res.unauthorized('Correo o contraseña incorrectos.');
  }

  // Doble verificación: la cuenta debe tener un rol de trabajador
  if (!ROLES_TRABAJADOR.includes(worker.role)) {
    return res.forbidden('Esta cuenta no tiene acceso al panel de trabajadores.');
  }

  const passwordValida = await bcrypt.compare(password, worker.passwordHash);
  if (!passwordValida) {
    return res.unauthorized('Correo o contraseña incorrectos.');
  }

  const token = firmar({
    email:    worker.email,
    nombre:   worker.nombre,
    tenantId: TENANT_ID,
    role:     worker.role,
  });

  return res.ok({
    worker: { nombre: worker.nombre, email: worker.email, role: worker.role },
    token,
  });
};
