import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Layout from './components/Layout';

import LoginPage from './pages/auth/LoginPage';
import RegistroPage from './pages/auth/RegistroPage';
import RecuperarPage from './pages/auth/RecuperarPage';
import RestablecerPage from './pages/auth/RestablecerPage';

import InicioPage from './pages/InicioPage';
import HabitosPage from './pages/HabitosPage';
import RecordatoriosPage from './pages/RecordatoriosPage';
import PerfilPage from './pages/PerfilPage';
import CoachUsuariosPage from './pages/coach/CoachUsuariosPage';
import CoachUsuarioDetallePage from './pages/coach/CoachUsuarioDetallePage';
import AdminUsuariosPage from './pages/admin/AdminUsuariosPage';
import AdminCategoriasPage from './pages/admin/AdminCategoriasPage';
import { NoAutorizadoPage, NoEncontradaPage } from './pages/PaginasEstado';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Publicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/recuperar" element={<RecuperarPage />} />
          <Route path="/restablecer" element={<RestablecerPage />} />

          {/* Privadas: cualquier rol con sesion (navbar + sidebar en todas) */}
          <Route element={<RutaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/" element={<InicioPage />} />
              <Route path="/habitos" element={<HabitosPage />} />
              <Route path="/recordatorios" element={<RecordatoriosPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/no-autorizado" element={<NoAutorizadoPage />} />

              {/* Solo COACH */}
              <Route element={<RutaProtegida roles={['COACH']} />}>
                <Route path="/coach/usuarios" element={<CoachUsuariosPage />} />
                <Route path="/coach/usuarios/:id" element={<CoachUsuarioDetallePage />} />
              </Route>

              {/* Solo ADMIN */}
              <Route element={<RutaProtegida roles={['ADMIN']} />}>
                <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
                <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
              </Route>

              <Route path="*" element={<NoEncontradaPage />} />
            </Route>
          </Route>

          <Route path="/inicio" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
