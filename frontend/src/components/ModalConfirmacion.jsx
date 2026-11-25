import Modal from './Modal';

// Modal para confirmar acciones destructivas o pasos importantes (NUNCA confirm() del navegador)
function ModalConfirmacion({
  titulo = '¿Estás seguro?',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  peligro = false,
  cargando = false,
  error = '',
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal titulo={titulo} onCerrar={cargando ? () => {} : onCancelar} ancho={440}>
      <p className="modal-mensaje">{mensaje}</p>
      {error && <p className="campo-error" role="alert">{error}</p>}
      <div className="modal-botones">
        <button type="button" className="boton boton-secundario" onClick={onCancelar} disabled={cargando}>
          {textoCancelar}
        </button>
        <button
          type="button"
          className={peligro ? 'boton boton-peligro' : 'boton boton-primario'}
          onClick={onConfirmar}
          disabled={cargando}
        >
          {cargando ? 'Procesando...' : textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}

export default ModalConfirmacion;
