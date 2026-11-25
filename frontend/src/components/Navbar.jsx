import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

// Barra superior de TODA la parte interna: nombre, correo, avatar y menu (Perfil / Cerrar sesion)
function Navbar({ titulo, onMenu }) {
  const { usuario, logout } = useAuth();
  const navegar = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const contenedor = useRef(null);

  // Cierra el menu al hacer clic fuera
  useEffect(() => {
    function alClic(e) {
      if (contenedor.current && !contenedor.current.contains(e.target)) setMenuAbierto(false);
    }
    document.addEventListener('mousedown', alClic);
    return () => document.removeEventListener('mousedown', alClic);
  }, []);

  async function cerrarSesion() {
    setMenuAbierto(false);
    await logout();
    navegar('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-izquierda">
        <button type="button" className="navbar-hamburguesa" onClick={onMenu} aria-label="Abrir menú">☰</button>
        <h1 className="navbar-titulo">{titulo}</h1>
      </div>

      <div className="navbar-usuario" ref={contenedor}>
        <button
          type="button"
          className="navbar-boton-usuario"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuAbierto}
        >
          <Avatar nombre={usuario.nombre} url={usuario.avatarUrl} />
          <span className="navbar-datos">
            <span className="navbar-nombre">{usuario.nombre}</span>
            <span className="navbar-email">{usuario.email}</span>
          </span>
          <span className="navbar-rol">{usuario.rol}</span>
        </button>

        {menuAbierto && (
          <div className="navbar-menu" role="menu">
            <button type="button" role="menuitem" onClick={() => { setMenuAbierto(false); navegar('/perfil'); }}>Mi perfil</button>
            <button type="button" role="menuitem" className="peligro" onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
