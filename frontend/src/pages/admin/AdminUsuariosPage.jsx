import { useEffect, useState } from 'react';
import usePaginado from '../../hooks/usePaginado';
import api, { leerError } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TablaPaginada from '../../components/TablaPaginada';
import BuscadorServidor from '../../components/BuscadorServidor';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import Toast from '../../components/Toast';
import UsuarioModal from './UsuarioModal';

const NOMBRE_ROL = { ADMIN: 'Administrador', COACH: 'Coach', USUARIO: 'Usuario' };

// ADMIN: CRUD de usuarios con paginacion y filtros (busqueda + rol) en el servidor
function AdminUsuariosPage() {
  const { usuario: yo } = useAuth();
  const estado = usePaginado('/admin/usuarios', ['rol']);
  const [coaches, setCoaches] = useState([]);
  const [modal, setModal] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Lista de coaches para el select del formulario (peticion filtrada por rol)
  useEffect(() => {
    api.get('/admin/usuarios', { params: { page: 0, size: 50, rol: 'COACH' } })
      .then(({ data }) => setCoaches(data.content))
      .catch(() => {});
  }, []);

  async function eliminar() {
    try {
      setEliminando(true);
      setErrorEliminar('');
      await api.delete(`/admin/usuarios/${aEliminar.id}`);
      setAEliminar(null);
      setMensaje('Usuario eliminado');
      estado.recargar();
    } catch (err) {
      setErrorEliminar(leerError(err).general);
    } finally {
      setEliminando(false);
    }
  }

  const columnas = [
    { titulo: 'Nombre', render: (u) => <strong>{u.nombre}</strong> },
    { titulo: 'Correo', render: (u) => u.email },
    { titulo: 'Teléfono', render: (u) => u.telefono || '—' },
    { titulo: 'Rol', render: (u) => NOMBRE_ROL[u.rol] || u.rol },
    { titulo: 'Coach', render: (u) => u.coach?.nombre || '—' },
    { titulo: 'Estado', render: (u) => <span className={u.activo ? 'etiqueta etiqueta-ok' : 'etiqueta etiqueta-off'}>{u.activo ? 'Activo' : 'Inactivo'}</span> },
    {
      titulo: 'Acciones',
      render: (u) => (
        <div className="acciones">
          <button type="button" className="boton boton-chico boton-editar" onClick={() => setModal({ usuario: u })}>Editar</button>
          <button
            type="button"
            className="boton boton-chico boton-peligro"
            disabled={u.id === yo.id}
            title={u.id === yo.id ? 'No puedes eliminar tu propia cuenta' : ''}
            onClick={() => { setErrorEliminar(''); setAEliminar(u); }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="barra-herramientas">
        <BuscadorServidor valor={estado.busqueda} onBuscar={estado.setBusqueda} placeholder="Buscar por nombre o correo..." />
        <select className="campo-input" value={estado.extras.rol} onChange={(e) => estado.setFiltro('rol', e.target.value)} aria-label="Filtrar por rol">
          <option value="">Todos los roles</option>
          <option value="ADMIN">Administrador</option>
          <option value="COACH">Coach</option>
          <option value="USUARIO">Usuario</option>
        </select>
        <button type="button" className="boton boton-primario barra-derecha" onClick={() => setModal({ usuario: null })}>+ Nuevo usuario</button>
      </div>

      <TablaPaginada columnas={columnas} estado={estado} vacio="No se encontraron usuarios con esos filtros." />

      {modal && (
        <UsuarioModal
          usuario={modal.usuario}
          coaches={coaches}
          onCerrar={() => setModal(null)}
          onGuardado={(msg) => { setModal(null); setMensaje(msg); estado.recargar(); }}
        />
      )}

      {aEliminar && (
        <ModalConfirmacion
          titulo="Eliminar usuario"
          mensaje={`¿Seguro que quieres eliminar a ${aEliminar.nombre}? También se borrarán sus hábitos. Esta acción no se puede deshacer.`}
          textoConfirmar="Sí, eliminar"
          peligro
          cargando={eliminando}
          error={errorEliminar}
          onConfirmar={eliminar}
          onCancelar={() => setAEliminar(null)}
        />
      )}

      <Toast mensaje={mensaje} onCerrar={() => setMensaje('')} />
    </>
  );
}

export default AdminUsuariosPage;
