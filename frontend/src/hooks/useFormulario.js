import { useCallback, useState } from 'react';

// Maneja un formulario con validaciones DEBAJO de cada input:
//  - en tiempo real (mientras escribe o al salir del campo)
//  - al intentar enviar (se marcan todos los campos)
//  - errores que manda el backend ({campo: "mensaje"})
// validadores = { campo: (valor, todosLosValores) => 'mensaje de error' | '' }
export default function useFormulario(valoresIniciales, validadores) {
  const [valores, setValores] = useState(valoresIniciales);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [erroresServidor, setErroresServidor] = useState({});

  const erroresLocales = {};
  for (const campo of Object.keys(validadores)) {
    erroresLocales[campo] = validadores[campo](valores[campo], valores) || '';
  }

  // El error se ve si el campo ya se toco, si se intento enviar, o si lo mando el servidor
  const errores = {};
  for (const campo of Object.keys(validadores)) {
    const visible = tocados[campo] || intentoEnvio;
    errores[campo] = (visible ? erroresLocales[campo] : '') || erroresServidor[campo] || '';
  }
  // Errores del servidor de campos que no tienen validador local
  for (const campo of Object.keys(erroresServidor)) {
    if (!(campo in errores)) errores[campo] = erroresServidor[campo];
  }

  const cambiar = useCallback((campo, valor) => {
    setValores((previos) => ({ ...previos, [campo]: valor }));
    setTocados((previos) => ({ ...previos, [campo]: true }));
    setErroresServidor((previos) => {
      if (!previos[campo]) return previos;
      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  }, []);

  const alCambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    cambiar(campo, valor);
  };

  const alSalir = (campo) => () => setTocados((previos) => ({ ...previos, [campo]: true }));

  // Marca todos los campos y regresa true si no hay errores locales
  const validar = () => {
    setIntentoEnvio(true);
    return Object.values(erroresLocales).every((e) => !e);
  };

  const reiniciar = (nuevos = valoresIniciales) => {
    setValores(nuevos);
    setTocados({});
    setIntentoEnvio(false);
    setErroresServidor({});
  };

  return { valores, errores, cambiar, alCambiar, alSalir, validar, reiniciar, setErroresServidor };
}
