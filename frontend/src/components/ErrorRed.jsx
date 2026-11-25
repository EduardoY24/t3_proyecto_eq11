// Mensaje claro cuando falla algo (red o servidor) con boton para reintentar
function ErrorRed({ mensaje, onReintentar }) {
  return (
    <div className="error-red" role="alert">
      <p>{mensaje || 'Ocurrió un error. Intenta de nuevo.'}</p>
      {onReintentar && (
        <button type="button" className="boton boton-secundario" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export default ErrorRed;
