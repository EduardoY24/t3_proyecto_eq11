import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USE_MOCK } from '../config';

const ICONOS = {
  inicio: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  habitos: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  recordatorios: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  perfil: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  usuarios: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  categorias: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
};

// Opciones del menu segun el rol (los permisos reales los valida el backend)
function opcionesPorRol(rol) {
  const comunes = [
    { to: '/', texto: 'Inicio', icono: ICONOS.inicio, fin: true },
    { to: '/habitos', texto: rol === 'ADMIN' ? 'Todos los hábitos' : 'Mis hábitos', icono: ICONOS.habitos },
    { to: '/recordatorios', texto: 'Recordatorios', icono: ICONOS.recordatorios },
  ];
  const extra = [];
  if (rol === 'COACH') extra.push({ to: '/coach/usuarios', texto: 'Mis usuarios', icono: ICONOS.usuarios });
  if (rol === 'ADMIN') {
    extra.push({ to: '/admin/usuarios', texto: 'Usuarios', icono: ICONOS.usuarios });
    extra.push({ to: '/admin/categorias', texto: 'Categorías', icono: ICONOS.categorias });
  }
  return [...comunes, ...extra, { to: '/perfil', texto: 'Perfil', icono: ICONOS.perfil }];
}

function Sidebar({ abierto, onCerrar }) {
  const { usuario } = useAuth();

  return (
    <aside className={abierto ? 'sidebar abierto' : 'sidebar'}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">✓</span>
        <span>Hábitos</span>
      </div>

      <nav className="sidebar-menu" aria-label="Menú principal">
        {opcionesPorRol(usuario.rol).map((o) => (
          <NavLink
            key={o.to}
            to={o.to}
            end={o.fin}
            onClick={onCerrar}
            className={({ isActive }) => (isActive ? 'sidebar-item activo' : 'sidebar-item')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={o.icono} />
            </svg>
            {o.texto}
          </NavLink>
        ))}
      </nav>

      {USE_MOCK && <p className="sidebar-demo">Modo demo: API simulada</p>}
    </aside>
  );
}

export default Sidebar;
