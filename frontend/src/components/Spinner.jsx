// Indicador de carga. "bloque" lo centra y le da espacio (para llenar una seccion)
function Spinner({ texto = 'Cargando...', bloque = false }) {
  return (
    <div className={bloque ? 'spinner-bloque' : 'spinner-linea'} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  );
}

export default Spinner;
