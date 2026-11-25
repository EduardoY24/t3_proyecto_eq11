import { Link, useLocation, useParams } from 'react-router-dom';
import HabitosTabla from '../../components/HabitosTabla';

// COACH: ver los habitos de un usuario (paginados en el servidor) y asignarle uno nuevo
function CoachUsuarioDetallePage() {
  const { id } = useParams();
  const { state } = useLocation();
  return (
    <>
      <p><Link to="/coach/usuarios">← Volver a mis usuarios</Link></p>
      <h2 className="saludo">{state?.nombre ? `Hábitos de ${state.nombre}` : `Hábitos del usuario #${id}`}</h2>
      <HabitosTabla
        urlListado={`/coach/usuarios/${id}/habitos`}
        urlCrear={`/coach/usuarios/${id}/habitos`}
        permitirEditar={false}
        conFiltros={false}
        textoNuevo="Asignar hábito"
      />
    </>
  );
}

export default CoachUsuarioDetallePage;
