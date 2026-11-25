import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Campo from '../../components/Campo';
import useFormulario from '../../hooks/useFormulario';
import api, { leerError } from '../../services/api';
import { validarEmail } from '../../utils/validaciones';

// Paso 1 de recuperar contraseña: se manda el correo con el enlace
function RecuperarPage() {
  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviado, setEnviado] = useState(false);

  const f = useFormulario({ email: '' }, { email: validarEmail });

  async function enviar(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!f.validar()) return;
    try {
      setCargando(true);
      await api.post('/auth/recuperar', { email: f.valores.email.trim() });
      setEnviado(true);
    } catch (err) {
      const info = leerError(err);
      f.setErroresServidor(info.campos);
      setErrorGeneral(info.general);
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout
      titulo="Recuperar contraseña"
      subtitulo="Te enviaremos un correo con un enlace para crear una contraseña nueva."
      pie={<Link to="/login">Volver a iniciar sesión</Link>}
    >
      {enviado ? (
        <p className="aviso aviso-exito" role="status">
          Si el correo está registrado, te enviamos las instrucciones. Revisa tu bandeja de entrada (y el spam).
        </p>
      ) : (
        <form onSubmit={enviar} noValidate className="auth-form">
          <Campo id="email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" autoComplete="email"
            value={f.valores.email} onChange={f.alCambiar('email')} onBlur={f.alSalir('email')} error={f.errores.email} />
          {errorGeneral && <p className="aviso aviso-error" role="alert">{errorGeneral}</p>}
          <button type="submit" className="boton boton-primario boton-grande" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default RecuperarPage;
