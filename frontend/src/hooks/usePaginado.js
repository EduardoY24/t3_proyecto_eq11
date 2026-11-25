import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { leerError } from '../services/api';

// Tabla con paginacion y filtros del LADO DEL SERVIDOR.
// Cada cambio de pagina, tamano o filtro hace una peticion nueva:
//   GET url?page=0&size=10&busqueda=...&otroFiltro=...
// La pagina/filtros se guardan en la URL del navegador (?page=2&size=20&busqueda=ana).
// filtrosExtra: nombres de otros filtros ademas de "busqueda", ej. ['rol'] o ['categoriaId','activo']
export default function usePaginado(url, filtrosExtra = [], fijos = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(Number(searchParams.get('page')) || 0, 0);
  let size = Number(searchParams.get('size')) || 10;
  if (![10, 20, 40, 50].includes(size)) size = 10;
  const busqueda = searchParams.get('busqueda') || '';
  const extras = {};
  for (const nombre of filtrosExtra) extras[nombre] = searchParams.get(nombre) || '';

  const [datos, setDatos] = useState({ content: [], page: { size, number: 0, totalElements: 0, totalPages: 0 } });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const contador = useRef(0);

  const clave = JSON.stringify([url, page, size, busqueda, extras, fijos]);

  useEffect(() => {
    const numero = ++contador.current;
    const parametros = { page, size, ...fijos };
    if (busqueda) parametros.busqueda = busqueda;
    for (const [k, v] of Object.entries(extras)) if (v !== '') parametros[k] = v;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargando(true);
    setError(null);
    api.get(url, { params: parametros })
      .then(({ data }) => {
        if (numero !== contador.current) return; // llego una respuesta vieja, se ignora
        setDatos(data);
        // si la pagina ya no existe (ej. se borraron registros) regresamos a la ultima
        if (data.page.totalPages > 0 && page >= data.page.totalPages) {
          const params = new URLSearchParams(searchParams);
          params.set('page', String(data.page.totalPages - 1));
          setSearchParams(params, { replace: true });
        }
      })
      .catch((e) => {
        if (numero !== contador.current) return;
        setError(leerError(e));
      })
      .finally(() => {
        if (numero === contador.current) setCargando(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, version]);

  const cambiarParams = useCallback((cambios) => {
    const params = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(cambios)) {
      if (v === '' || v === null || v === undefined) params.delete(k);
      else params.set(k, String(v));
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  return {
    filas: datos.content,
    info: datos.page,
    cargando,
    error,
    page,
    size,
    busqueda,
    extras,
    setPage: (p) => cambiarParams({ page: p }),
    setSize: (s) => cambiarParams({ size: s, page: 0 }),
    setBusqueda: (b) => cambiarParams({ busqueda: b, page: 0 }),
    setFiltro: (nombre, valor) => cambiarParams({ [nombre]: valor, page: 0 }),
    recargar: () => setVersion((v) => v + 1),
  };
}
