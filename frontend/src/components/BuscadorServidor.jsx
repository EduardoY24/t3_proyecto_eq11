import { useEffect, useState } from 'react';

// Caja de busqueda: espera 400 ms despues de escribir y SOLO entonces le avisa al padre,
// que hace una peticion nueva al servidor con ?busqueda=texto
function BuscadorServidor({ valor, onBuscar, placeholder = 'Buscar...' }) {
  const [texto, setTexto] = useState(valor);

  // Si la URL cambia desde afuera (atras/adelante) sincronizamos el texto
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setTexto(valor); }, [valor]);

  useEffect(() => {
    if (texto === valor) return undefined;
    const t = setTimeout(() => onBuscar(texto.trim()), 400);
    return () => clearTimeout(t);
  }, [texto]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      type="search"
      className="campo-input buscador"
      placeholder={placeholder}
      value={texto}
      onChange={(e) => setTexto(e.target.value)}
      aria-label="Buscar"
    />
  );
}

export default BuscadorServidor;
