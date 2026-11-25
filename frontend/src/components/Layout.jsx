import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const TITULOS = {
  '/': 'Inicio',
  '/habitos': 'Hábitos',
  '/recordatorios': 'Recordatorios',
  '/perfil': 'Mi perfil',
  '/coach/usuarios': 'Mis usuarios',
  '/admin/usuarios': 'Usuarios',
  '/admin/categorias': 'Categorías',
};

// Estructura de toda la parte interna: sidebar + navbar arriba + contenido de la pagina
function Layout() {
  const { pathname } = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const titulo = TITULOS[pathname] || (pathname.startsWith('/coach/usuarios/') ? 'Hábitos del usuario' : 'Hábitos');

  return (
    <div className="layout">
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
      {menuAbierto && <div className="layout-fondo" onClick={() => setMenuAbierto(false)} />}
      <div className="layout-derecha">
        <Navbar titulo={titulo} onMenu={() => setMenuAbierto(true)} />
        <main className="layout-contenido">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
