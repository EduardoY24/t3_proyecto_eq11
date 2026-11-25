// Configuracion general del frontend (se lee de .env.development / .env.production)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const STORAGE_KEY = 'habitos_sesion';
