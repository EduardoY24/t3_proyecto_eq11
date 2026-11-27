import { useEffect, useState } from 'react';
import usePaginado from '../hooks/usePaginado';
import api, { leerError } from '../services/api';
import TablaPaginada from './TablaPaginada';
import BuscadorServidor from './BuscadorServidor';
import HabitoModal from './HabitoModal';
import ModalConfirmacion from './ModalConfirmacion';
import Toast from './Toast';

// Tabla de habitos con paginacion y filtros en el servidor.
// Se usa en "Mis habitos" / "Todos los habitos" (admin) y en el detalle de usuario del coach.
function HabitosTabla({
  urlListado = '/habitos',
  urlCrear = '/habitos',
  permitirEditar = true,
  mostrarUsuario = false,
  conFiltros = true,
  textoNuevo = 'Nuevo hábito',
}) {
  const estado = usePaginado(urlListado, conFiltros ? ['categoriaId', 'activo'] : []);
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(null); // null | { habito: obj|null }
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviandoId, setEnviandoId] = useState(null); // id del habito cuyo recordatorio se esta enviando

  useEffect(() => {
    api.get('/categorias').then(({ data }) => setCategorias(data)).catch(() => {});
  }, []);

  async function eliminar() {
    try {
      setEliminando(true);
      setErrorEliminar('');
      await api.delete(`/habitos/${aEliminar.id}`);
      setAEliminar(null);
      setMensaje('Hábito eliminado');
      estado.recargar();
    } catch (err) {
      setErrorEliminar(leerError(err).general);
    } finally {
      setEliminando(false);
    }
  }

  // Pide al backend que mande el recordatorio por WhatsApp (Twilio). Responde { enviado: true|false }.
  async function enviarRecordatorio(habito) {
    try {
      setEnviandoId(habito.id);
      const { data } = await api.post(`/habitos/${habito.id}/recordatorio`);
      setMensaje(data.enviado ? 'Recordatorio enviado por WhatsApp' : 'No se pudo enviar (Twilio no configurado)');
    } catch (err) {
      setMensaje(leerError(err).general || 'No se pudo enviar el recordatorio');
    } finally {
      setEnviandoId(null);
    }
  }

  const columnas = [
    { titulo: 'Nombre', render: (h) => (<><strong>{h.nombre}</strong>{h.descripcion && <span className="texto-suave bloque">{h.descripcion}</span>}</>) },
    { titulo: 'Frecuencia', render: (h) => (h.frecuencia === 'DIARIO' ? 'Diario' : 'Semanal') },
    {
      titulo: 'Categorías',
      render: (h) => (
        <div className="chips">
          {h.categorias.map((c) => (
            <span key={c.id} className="chip" style={{ background: `${c.color}22`, color: c.color, borderColor: `${c.color}66` }}>{c.nombre}</span>
          ))}
        </div>
      ),
    },
    { titulo: 'Estado', render: (h) => <span className={h.activo ? 'etiqueta etiqueta-ok' : 'etiqueta etiqueta-off'}>{h.activo ? 'Activo' : 'Inactivo'}</span> },
  ];
  if (mostrarUsuario) columnas.splice(1, 0, { titulo: 'Usuario', render: (h) => h.usuario?.nombre });
  if (permitirEditar) {
    columnas.push({
      titulo: 'Acciones',
      render: (h) => (
        <div className="acciones">
          <button
            type="button"
            className="boton boton-chico boton-whatsapp"
            disabled={enviandoId === h.id}
            onClick={() => enviarRecordatorio(h)}
          >
            {enviandoId === h.id ? 'Enviando...' : 'Recordatorio WhatsApp'}
          </button>
          <button type="button" className="boton boton-chico boton-editar" onClick={() => setModal({ habito: h })}>Editar</button>
          <button type="button" className="boton boton-chico boton-peligro" onClick={() => { setErrorEliminar(''); setAEliminar(h); }}>Eliminar</button>
        </div>
      ),
    });
  }

  return (
    <>
      <div className="barra-herramientas">
        {conFiltros && (
          <>
            <BuscadorServidor valor={estado.busqueda} onBuscar={estado.setBusqueda} placeholder="Buscar por nombre o descripción..." />
            <select className="campo-input" value={estado.extras.categoriaId} onChange={(e) => estado.setFiltro('categoriaId', e.target.value)} aria-label="Filtrar por categoría">
              <option value="">Todas las categorías</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <select className="campo-input" value={estado.extras.activo} onChange={(e) => estado.setFiltro('activo', e.target.value)} aria-label="Filtrar por estado">
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </>
        )}
        <button type="button" className="boton boton-primario barra-derecha" onClick={() => setModal({ habito: null })}>+ {textoNuevo}</button>
      </div>

      <TablaPaginada columnas={columnas} estado={estado} vacio="No se encontraron hábitos con esos filtros." />

      {modal && (
        <HabitoModal
          habito={modal.habito}
          categorias={categorias}
          urlCrear={urlCrear}
          onCerrar={() => setModal(null)}
          onGuardado={(msg) => { setModal(null); setMensaje(msg); estado.recargar(); }}
        />
      )}

      {aEliminar && (
        <ModalConfirmacion
          titulo="Eliminar hábito"
          mensaje={`¿Seguro que quieres eliminar "${aEliminar.nombre}"? Esta acción no se puede deshacer.`}
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

export default HabitosTabla;
