const { verificar } = require('./jwt');
const res = require('./response');

// Roles válidos para trabajadores (excluye 'cliente')
const ROLES_TRABAJADOR = ['cocinero', 'empacador', 'repartidor', 'admin'];

/**
 * Extrae y valida el JWT del header Authorization.
 * Retorna el payload si el token es válido y pertenece a un trabajador.
 * Retorna una respuesta HTTP de error si no es válido.
 *
 * Uso en un handler:
 *   const auth = requireWorker(event);
 *   if (auth.statusCode) return auth; // es una respuesta de error
 *   const { email, role } = auth;     // es el payload del JWT
 */
const requireWorker = (event) => {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader) return res.unauthorized('Se requiere token de autenticación.');

  const token = authHeader.replace('Bearer ', '');
  const payload = verificar(token);
  if (!payload) return res.unauthorized('Token inválido o expirado.');

  if (!ROLES_TRABAJADOR.includes(payload.role)) {
    return res.forbidden('Solo los trabajadores pueden acceder a este recurso.');
  }

  return payload;
};

module.exports = { requireWorker };
