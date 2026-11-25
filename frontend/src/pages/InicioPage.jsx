import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { leerError } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorRed from '../components/ErrorRed';

// Tarjetas de resumen. Se piden con size=1 y se lee el total (el servidor cuenta, no traemos todo)
function InicioPage() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    async function cargar() {
      try {
        setError(null);
        setDatos(null);
        const total = (url, params = {}) => api.get(url, { params: { page: 0, size: 1, ...params } }).then((r) => r.data.page.totalElements);
        const [todos, activos, inactivos] = await Promise.all([
          total('/habitos'),
          total('/habitos', { activo: true }),
          total('/habitos', { activo: false }),
        ]);
        const resumen = { todos, activos, inactivos };
        if (usuario.rol === 'ADMIN') resumen.usuarios = await total('/admin/usuarios');
        if (usuario.rol === 'COACH') resumen.misUsuarios = (await api.get('/coach/usuarios')).data.length;
        if (vigente) setDatos(resumen);
      } catch (e) {
        if (vigente) setError(leerError(e));
      }
    }
    cargar();
    return () => { vigente = false; };
  }, [usuario.rol, intento]);

  if (error) return <ErrorRed mensaje={error.general} onReintentar={() => setIntento((n) => n + 1)} />;
  if (!datos) return <Spinner bloque texto="Cargando resumen..." />;

  const tarjetas = [
    { etiqueta: usuario.rol === 'ADMIN' ? 'Hábitos en el sistema' : 'Total de hábitos', numero: datos.todos, clase: 'numero-total' },
    { etiqueta: 'Activos', numero: datos.activos, clase: 'numero-ok' },
    { etiqueta: 'Inactivos', numero: datos.inactivos, clase: 'numero-pendiente' },
  ];
  if (usuario.rol === 'ADMIN') tarjetas.push({ etiqueta: 'Usuarios registrados', numero: datos.usuarios, clase: 'numero-total' });
  if (usuario.rol === 'COACH') tarjetas.push({ etiqueta: 'Usuarios a mi cargo', numero: datos.misUsuarios, clase: 'numero-total' });

  return (
    <>
      <h2 className="saludo">Hola, {usuario.nombre.split(' ')[0]} 👋</h2>
      <p className="texto-suave">Este es el resumen de tu actividad.</p>
      <div className="tarjetas-resumen">
        {tarjetas.map((t) => (
          <div key={t.etiqueta} className="tarjeta-resumen">
            <p className="tarjeta-etiqueta">{t.etiqueta}</p>
            <p className={`tarjeta-numero ${t.clase}`}>{t.numero}</p>
          </div>
        ))}
      </div>
      <p className="atajos">
        <Link to="/habitos" className="boton boton-primario">Ir a mis hábitos</Link>
      </p>
    </>
  );
}

export default InicioPage;
