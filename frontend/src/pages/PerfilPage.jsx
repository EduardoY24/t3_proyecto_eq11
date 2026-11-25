import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

const ROLES = { ADMIN: 'Administrador', COACH: 'Coach', USUARIO: 'Usuario' };

// Datos de la cuenta que inicio sesion
function PerfilPage() {
  const { usuario } = useAuth();
  return (
    <div className="tarjeta perfil">
      <Avatar nombre={usuario.nombre} url={usuario.avatarUrl} tamano={88} />
      <div>
        <h2>{usuario.nombre}</h2>
        <p className="texto-suave">{usuario.email}</p>
        <p><span className="etiqueta etiqueta-ok">{ROLES[usuario.rol] || usuario.rol}</span></p>
      </div>
    </div>
  );
}

export default PerfilPage;
