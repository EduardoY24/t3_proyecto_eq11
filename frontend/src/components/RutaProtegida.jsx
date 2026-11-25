import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ruta privada. Sin sesion -> /login. Con sesion pero sin el rol correcto -> /no-autorizado
// Uso: <Route element={<RutaProtegida roles={['ADMIN']} />}> ...rutas... </Route>
function RutaProtegida({ roles }) {
  const { usuario } = useAuth();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  }
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }
  return <Outlet />;
}

export default RutaProtegida;
