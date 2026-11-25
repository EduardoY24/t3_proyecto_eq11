import { useCallback, useEffect, useState } from 'react';
import api, { leerError } from '../../services/api';
import Modal from '../../components/Modal';
import Campo from '../../components/Campo';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import Spinner from '../../components/Spinner';
import ErrorRed from '../../components/ErrorRed';
import Toast from '../../components/Toast';
import useFormulario from '../../hooks/useFormulario';
import { requerido, validarMaximo } from '../../utils/validaciones';

function CategoriaModal({ categoria, onCerrar, onGuardado }) {
  const editando = !!categoria;
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const f = useFormulario(
    { nombre: categoria?.nombre || '', color: categoria?.color || '#4F46E5' },
    {
      nombre: (v) => requerido(v, 'El nombre es obligatorio') || validarMaximo(v, 50, 'El nombre'),
      color: (v) => (/^#[0-9A-Fa-f]{6}$/.test(v) ? '' : 'Elige un color válido'),
    },
  );

  async function enviar(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!f.validar()) return;
    const cuerpo = { nombre: f.valores.nombre.trim(), color: f.valores.color };
    try {
      setGuardando(true);
      if (editando) await api.put(`/admin/categorias/${categoria.id}`, cuerpo);
      else await api.post('/admin/categorias', cuerpo);
      onGuardado(editando ? 'Categoría actualizada' : 'Categoría creada');
    } catch (err) {
      const info = leerError(err);
      f.setErroresServidor(info.campos);
      setErrorGeneral(info.general);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal titulo={editando ? 'Editar categoría' : 'Nueva categoría'} onCerrar={guardando ? () => {} : onCerrar} ancho={420}>
      <form onSubmit={enviar} noValidate className="form-modal">
        <Campo id="c-nombre" label="Nombre" value={f.valores.nombre} onChange={f.alCambiar('nombre')} onBlur={f.alSalir('nombre')} error={f.errores.nombre} />
        <Campo id="c-color" label="Color" type="color" value={f.valores.color} onChange={f.alCambiar('color')} error={f.errores.color} />
        {errorGeneral && <p className="aviso aviso-error" role="alert">{errorGeneral}</p>}
        <div className="modal-botones">
          <button type="button" className="boton boton-secundario" onClick={onCerrar} disabled={guardando}>Cancelar</button>
          <button type="submit" className="boton boton-primario" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  );
}

// ADMIN: CRUD de categorias (GET /categorias es la lista corta, sin paginacion segun la API)
function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState(null);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const { data } = await api.get('/categorias');
      setCategorias(data);
    } catch (e) {
      setError(leerError(e));
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargar(); }, [cargar]);

  async function eliminar() {
    try {
      setEliminando(true);
      setErrorEliminar('');
      await api.delete(`/admin/categorias/${aEliminar.id}`);
      setAEliminar(null);
      setMensaje('Categoría eliminada');
      cargar();
    } catch (err) {
      setErrorEliminar(leerError(err).general);
    } finally {
      setEliminando(false);
    }
  }

  if (error) return <ErrorRed mensaje={error.general} onReintentar={cargar} />;
  if (!categorias) return <Spinner bloque texto="Cargando categorías..." />;

  return (
    <>
      <div className="barra-herramientas">
        <button type="button" className="boton boton-primario barra-derecha" onClick={() => setModal({ categoria: null })}>+ Nueva categoría</button>
      </div>
      <div className="tabla-tarjeta">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Color</th><th>Nombre</th><th>Acciones</th></tr></thead>
            <tbody>
              {categorias.length === 0 && <tr><td colSpan={3} className="tabla-vacia">Aún no hay categorías.</td></tr>}
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td data-label="Color"><span className="muestra-color" style={{ background: c.color }} title={c.color} /></td>
                  <td data-label="Nombre"><strong>{c.nombre}</strong></td>
                  <td data-label="Acciones">
                    <div className="acciones">
                      <button type="button" className="boton boton-chico boton-editar" onClick={() => setModal({ categoria: c })}>Editar</button>
                      <button type="button" className="boton boton-chico boton-peligro" onClick={() => { setErrorEliminar(''); setAEliminar(c); }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <CategoriaModal
          categoria={modal.categoria}
          onCerrar={() => setModal(null)}
          onGuardado={(msg) => { setModal(null); setMensaje(msg); cargar(); }}
        />
      )}
      {aEliminar && (
        <ModalConfirmacion
          titulo="Eliminar categoría"
          mensaje={`¿Seguro que quieres eliminar la categoría "${aEliminar.nombre}"? Se quitará de los hábitos que la usan.`}
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

export default AdminCategoriasPage;
