import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../services/api';
import { STORAGE_KEY } from '../config';

const AuthContext = createContext(null);

// Lee la sesion guardada (si el usuario ya habia entrado antes)
function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

// Guarda en la sesion los datos que regresa el backend en login/registro
function aSesion(datos) {
  return {
    token: datos.token,
    id: datos.id,
    nombre: datos.nombre,
    email: datos.email,
    rol: datos.rol,
    avatarUrl: datos.avatarUrl || null,
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  const guardar = useCallback((datos) => {
    const sesion = aSesion(datos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
    setUsuario(sesion);
    return sesion;
  }, []);

  // POST /auth/login {email, password}
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return guardar(data);
  }, [guardar]);

  // POST /auth/register {nombre, email, password, telefono}
  const registro = useCallback(async (campos) => {
    const { data } = await api.post('/auth/register', campos);
    return guardar(data);
  }, [guardar]);

  // POST /auth/logout (se invalida el token en el backend) y se borra la sesion local
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // aunque falle la red, cerramos la sesion en este navegador
    }
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, estaAutenticado: !!usuario, login, registro, logout }),
    [usuario, login, registro, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
