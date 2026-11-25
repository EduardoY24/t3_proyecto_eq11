import { useEffect } from 'react';

// Mensaje corto de exito (reemplaza al alert). Desaparece solo a los 3.5 segundos.
function Toast({ mensaje, onCerrar }) {
  useEffect(() => {
    if (!mensaje) return undefined;
    const t = setTimeout(onCerrar, 3500);
    return () => clearTimeout(t);
  }, [mensaje, onCerrar]);

  if (!mensaje) return null;
  return <div className="toast" role="status">{mensaje}</div>;
}

export default Toast;
