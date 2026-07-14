// ===== Configuración de conexión al backend (API Gateway) =====
// Reemplaza esta URL por la que te entregue "serverless deploy" (output HttpApiUrl).
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://TU-API-ID.execute-api.us-east-1.amazonaws.com';

const KEY_TOKEN = 'mrsushi_token';

export const guardarToken = (token) => localStorage.setItem(KEY_TOKEN, token);
export const obtenerToken = () => localStorage.getItem(KEY_TOKEN);
export const borrarToken = () => localStorage.removeItem(KEY_TOKEN);

// Wrapper de fetch: arma la URL, agrega el JWT si existe y parsea la respuesta como JSON.
export const apiFetch = async (path, options = {}) => {
  const token = obtenerToken();

  const respuesta = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(data.error || 'Ocurrió un error al conectar con el servidor.');
  }

  return data;
};
