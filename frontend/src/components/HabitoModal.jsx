import { useState } from 'react';
import Modal from './Modal';
import Campo from './Campo';
import useFormulario from '../hooks/useFormulario';
import api, { leerError } from '../services/api';
import { requerido, validarMaximo } from '../utils/validaciones';

// Formulario (en modal) para crear o editar un habito
// habito = null -> crear (POST urlCrear)   |   habito = {...} -> editar (PUT /habitos/{id})
function HabitoModal({ habito, categorias, urlCrear = '/habitos', onCerrar, onGuardado }) {
  const editando = !!habito;
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const f = useFormulario(
    {
      nombre: habito?.nombre || '',
      descripcion: habito?.descripcion || '',
      frecuencia: habito?.frecuencia || 'DIARIO',
      activo: habito ? habito.activo : true,
      categoriaIds: habito ? habito.categorias.map((c) => c.id) : [],
    },
    {
      nombre: (v) => requerido(v, 'El nombre es obligatorio') || validarMaximo(v, 100, 'El nombre'),
      descripcion: (v) => validarMaximo(v, 255, 'La descripción'),
      frecuencia: (v) => (['DIARIO', 'SEMANAL'].includes(v) ? '' : 'Elige una frecuencia'),
      categoriaIds: (v) => (v.length === 0 ? 'Elige al menos una categoría' : ''),
    },
  );

  function alternarCategoria(id) {
    const actuales = f.valores.categoriaIds;
    f.cambiar('categoriaIds', actuales.includes(id) ? actuales.filter((x) => x !== id) : [...actuales, id]);
  }

  async function enviar(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!f.validar()) return;
    const cuerpo = {
      nombre: f.valores.nombre.trim(),
      descripcion: f.valores.descripcion.trim(),
      frecuencia: f.valores.frecuencia,
      activo: f.valores.activo,
      categoriaIds: f.valores.categoriaIds,
    };
    try {
      setGuardando(true);
      if (editando) await api.put(`/habitos/${habito.id}`, cuerpo);
      else await api.post(urlCrear, cuerpo);
      onGuardado(editando ? 'Hábito actualizado correctamente' : 'Hábito creado correctamente');
    } catch (err) {
      const info = leerError(err);
      f.setErroresServidor(info.campos);
      setErrorGeneral(info.general);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal titulo={editando ? 'Editar hábito' : 'Nuevo hábito'} onCerrar={guardando ? () => {} : onCerrar}>
      <form onSubmit={enviar} noValidate className="form-modal">
        <Campo id="h-nombre" label="Nombre" placeholder="Ej. Beber 2 litros de agua"
          value={f.valores.nombre} onChange={f.alCambiar('nombre')} onBlur={f.alSalir('nombre')} error={f.errores.nombre} />
        <Campo id="h-descripcion" label="Descripción (opcional)" as="textarea" rows={2}
          value={f.valores.descripcion} onChange={f.alCambiar('descripcion')} onBlur={f.alSalir('descripcion')} error={f.errores.descripcion} />
        <Campo id="h-frecuencia" label="Frecuencia" as="select"
          value={f.valores.frecuencia} onChange={f.alCambiar('frecuencia')} error={f.errores.frecuencia}>
          <option value="DIARIO">Diario</option>
          <option value="SEMANAL">Semanal</option>
        </Campo>

        <fieldset className="campo">
          <legend>Categorías</legend>
          <div className="chips-seleccion">
            {categorias.map((c) => (
              <label key={c.id} className={f.valores.categoriaIds.includes(c.id) ? 'chip-opcion marcada' : 'chip-opcion'}>
                <input type="checkbox" checked={f.valores.categoriaIds.includes(c.id)} onChange={() => alternarCategoria(c.id)} />
                <span className="chip-punto" style={{ background: c.color }} />
                {c.nombre}
              </label>
            ))}
          </div>
          {f.errores.categoriaIds && <p className="campo-error" role="alert">{f.errores.categoriaIds}</p>}
        </fieldset>

        <label className="campo-check">
          <input type="checkbox" checked={f.valores.activo} onChange={f.alCambiar('activo')} />
          Hábito activo
        </label>

        {errorGeneral && <p className="aviso aviso-error" role="alert">{errorGeneral}</p>}

        <div className="modal-botones">
          <button type="button" className="boton boton-secundario" onClick={onCerrar} disabled={guardando}>Cancelar</button>
          <button type="submit" className="boton boton-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default HabitoModal;
