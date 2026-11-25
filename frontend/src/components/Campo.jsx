// Input con su etiqueta y el mensaje de error DEBAJO (nada de alert)
// "as" puede ser 'input' (por defecto), 'select' o 'textarea'
function Campo({ id, label, error, ayuda, as: Etiqueta = 'input', children, ...resto }) {
  const idError = `${id}-error`;
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <Etiqueta
        id={id}
        className={error ? 'campo-input con-error' : 'campo-input'}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? idError : undefined}
        {...resto}
      >
        {children}
      </Etiqueta>
      {ayuda && !error && <p className="campo-ayuda">{ayuda}</p>}
      {error && <p id={idError} className="campo-error" role="alert">{error}</p>}
    </div>
  );
}

export default Campo;
