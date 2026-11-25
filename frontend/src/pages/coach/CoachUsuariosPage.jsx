import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { leerError } from '../../services/api';
import Avatar from '../../components/Avatar';
import Spinner from '../../components/Spinner';
import ErrorRed from '../../components/ErrorRed';

// COACH: lista de los usuarios que tiene asignados (GET /coach/usuarios)
function CoachUsuariosPage() {
  const [usuarios, setUsuarios] = useState(null);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setError(null);
    setUsuarios(null);
    try {
      const { data } = await api.get('/coach/usuarios');
      setUsuarios(data);
    } catch (e) {
      setError(leerError(e));
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargar(); }, [cargar]);

  if (error) return <ErrorRed mensaje={error.general} onReintentar={cargar} />;
  if (!usuarios) return <Spinner bloque texto="Cargando tus usuarios..." />;
  if (usuarios.length === 0) return <p className="texto-suave">Todavía no tienes usuarios asignados.</p>;

  return (
    <div className="lista-tarjetas">
      {usuarios.map((u) => (
        <Link key={u.id} to={`/coach/usuarios/${u.id}`} state={{ nombre: u.nombre }} className="tarjeta tarjeta-usuario">
          <Avatar nombre={u.nombre} tamano={52} />
          <div>
            <strong>{u.nombre}</strong>
            <span className="texto-suave bloque">{u.email}</span>
            {u.telefono && <span className="texto-suave bloque">{u.telefono}</span>}
          </div>
          <span className={u.activo ? 'etiqueta etiqueta-ok' : 'etiqueta etiqueta-off'}>{u.activo ? 'Activo' : 'Inactivo'}</span>
        </Link>
      ))}
    </div>
  );
}

export default CoachUsuariosPage;
