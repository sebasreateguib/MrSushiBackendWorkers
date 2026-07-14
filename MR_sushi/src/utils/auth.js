// ===== Autenticación real contra el backend (API Gateway + Lambda + DynamoDB) =====
// Antes esto vivía solo en localStorage. Ahora el localStorage solo cachea
// la sesión (nombre/email) y el token JWT; la fuente de verdad es DynamoDB.

import { apiFetch, guardarToken, borrarToken } from './api';

const KEY_SESION = 'mrsushi_sesion';

// ===== Registro =====
// Devuelve { ok: true, usuario } o { ok: false, error }
export const registrarUsuario = async ({ nombre, email, password }) => {
  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    });
    guardarToken(data.token);
    guardarSesionLocal(data.usuario);
    return { ok: true, usuario: data.usuario };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

// ===== Login =====
export const iniciarSesion = async ({ email, password }) => {
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    guardarToken(data.token);
    guardarSesionLocal(data.usuario);
    return { ok: true, usuario: data.usuario };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

// ===== Sesión =====
const guardarSesionLocal = (usuario) => {
  localStorage.setItem(KEY_SESION, JSON.stringify(usuario));
};

export const obtenerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY_SESION)) || null;
  } catch {
    return null;
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem(KEY_SESION);
  borrarToken();
};
