import Spinner from './Spinner';
import ErrorRed from './ErrorRed';
import Pagination from './Pagination';

// Tabla generica: muestra cargando / error / vacio / datos + paginacion del servidor
// columnas = [{ titulo, render: (fila) => contenido }]
function TablaPaginada({ columnas, estado, vacio = 'No hay registros para mostrar.' }) {
  const { filas, info, cargando, error, page, size, setPage, setSize, recargar } = estado;

  return (
    <div className="tabla-tarjeta">
      {error ? (
        <ErrorRed mensaje={error.general} onReintentar={recargar} />
      ) : (
        <>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>{columnas.map((c) => <th key={c.titulo}>{c.titulo}</th>)}</tr>
              </thead>
              <tbody>
                {!cargando && filas.length === 0 && (
                  <tr><td colSpan={columnas.length} className="tabla-vacia">{vacio}</td></tr>
                )}
                {filas.map((fila) => (
                  <tr key={fila.id} className={cargando ? 'fila-cargando' : ''}>
                    {columnas.map((c) => <td key={c.titulo} data-label={c.titulo}>{c.render(fila)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {cargando && filas.length === 0 && <Spinner bloque texto="Cargando datos..." />}
          </div>
          <Pagination
            page={page}
            size={size}
            totalElements={info.totalElements}
            totalPages={info.totalPages}
            onPageChange={setPage}
            onSizeChange={setSize}
          />
        </>
      )}
    </div>
  );
}

export default TablaPaginada;
