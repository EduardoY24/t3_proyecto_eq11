import { useAuth } from '../context/AuthContext';
import HabitosTabla from '../components/HabitosTabla';

// USUARIO / COACH: sus propios habitos. ADMIN: todos los habitos del sistema.
function HabitosPage() {
  const { usuario } = useAuth();
  return <HabitosTabla mostrarUsuario={usuario.rol === 'ADMIN'} />;
}

export default HabitosPage;
