import { useEffect } from 'react';

// Ventana modal generica (la usan los formularios de crear/editar y la de confirmacion)
function Modal({ titulo, subtitulo, onCerrar, children, ancho = 520 }) {
  // Con Escape se cierra
  useEffect(() => {
    function alTeclear(e) {
      if (e.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [onCerrar]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={titulo} style={{ maxWidth: ancho }}>
        <div className="modal-header">
          <div>
            <h2>{titulo}</h2>
            {subtitulo && <p>{subtitulo}</p>}
          </div>
          <button type="button" className="modal-close" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
