const opcionesLimite = [10, 20, 40, 50];

// Controles de abajo de la tabla. Recibe la pagina del servidor (empieza en 0)
// y avisa cuando se cambia de pagina o de tamano: el padre hace una peticion nueva.
function Pagination({ page, size, totalElements, totalPages, onPageChange, onSizeChange }) {
  const paginaActual = page + 1;
  const desde = totalElements === 0 ? 0 : page * size + 1;
  const hasta = Math.min((page + 1) * size, totalElements);

  const numeros = [];
  const inicio = Math.max(1, paginaActual - 2);
  const fin = Math.min(totalPages, inicio + 4);
  for (let n = inicio; n <= fin; n++) numeros.push(n);

  return (
    <div className="pagination">
      <div className="pagination-limite">
        Mostrar
        <select value={size} onChange={(e) => onSizeChange(Number(e.target.value))} aria-label="Registros por página">
          {opcionesLimite.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        registros
      </div>

      <p className="pagination-info">Mostrando {desde}–{hasta} de {totalElements}</p>

      <div className="pagination-paginas">
        <button type="button" className="pagination-boton" disabled={page <= 0} onClick={() => onPageChange(page - 1)} aria-label="Página anterior">‹</button>
        {numeros.map((n) => (
          <button
            type="button"
            key={n}
            className={n === paginaActual ? 'pagination-boton actual' : 'pagination-boton'}
            onClick={() => onPageChange(n - 1)}
          >
            {n}
          </button>
        ))}
        <button type="button" className="pagination-boton" disabled={paginaActual >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Página siguiente">›</button>
      </div>
    </div>
  );
}

export default Pagination;
