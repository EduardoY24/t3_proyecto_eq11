import { Link } from 'react-router-dom';

export function NoAutorizadoPage() {
  return (
    <div className="pagina-estado">
      <h1>403</h1>
      <p>No tienes permiso para ver esta página.</p>
      <Link to="/" className="boton boton-primario">Volver al inicio</Link>
    </div>
  );
}

export function NoEncontradaPage() {
  return (
    <div className="pagina-estado">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="boton boton-primario">Volver al inicio</Link>
    </div>
  );
}
