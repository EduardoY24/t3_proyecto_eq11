import axios from 'axios';
import { API_URL, USE_MOCK, STORAGE_KEY } from '../config';
import { mockAdapter } from '../mock/mockAdapter';

// Una sola instancia de axios para toda la app
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Si el backend todavia no esta listo, se usa la API simulada con el mismo formato
if (USE_MOCK) {
  api.defaults.adapter = mockAdapter;
}

// Antes de cada peticion: mandamos el token JWT en el header Authorization
api.interceptors.request.use((config) => {
  try {
    const sesion = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (sesion?.token) {
      config.headers.Authorization = `Bearer ${sesion.token}`;
    }
  } catch {
    // si el localStorage falla simplemente no mandamos token
  }
  return config;
});

// Al recibir la respuesta: si es 401 (sin sesion) borramos la sesion y mandamos al login
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const url = error.config?.url || '';
    const esAuth = url.startsWith('/auth/');
    if (error.response?.status === 401 && !esAuth) {
      localStorage.removeItem(STORAGE_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login?expirada=1');
      }
    }
    return Promise.reject(error);
  },
);

// Convierte un error de axios en algo facil de mostrar:
//  { general: 'mensaje', campos: { email: 'mensaje' }, red: true/false, status }
export function leerError(error) {
  if (!error.response) {
    return {
      red: true,
      status: 0,
      general: 'No se pudo conectar con el servidor. Revisa tu conexión a internet e intenta de nuevo.',
      campos: {},
    };
  }
  const { status, data } = error.response;
  const campos = {};
  let general = '';

  if (data && typeof data === 'object') {
    if (data.error) general = data.error;
    for (const [clave, valor] of Object.entries(data)) {
      if (clave !== 'error' && typeof valor === 'string') campos[clave] = valor;
    }
  }

  if (!general) {
    if (status === 403) general = 'No tienes permiso para realizar esta acción.';
    else if (status === 404) general = 'No se encontró lo que buscabas.';
    else if (status >= 500) general = 'Ocurrió un error en el servidor. Intenta más tarde.';
    else if (status === 400 && Object.keys(campos).length > 0) general = 'Revisa los campos marcados.';
    else general = 'Ocurrió un error inesperado.';
  }
  return { red: false, status, general, campos };
}

export default api;
