import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Campo from '../../components/Campo';
import { useAuth } from '../../context/AuthContext';
import useFormulario from '../../hooks/useFormulario';
import { leerError } from '../../services/api';
import { validarEmail } from '../../utils/validaciones';

function LoginPage() {
  const { login, estaAutenticado } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const expirada = new URLSearchParams(ubicacion.search).get('expirada');

  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const f = useFormulario(
    { email: '', password: '' },
    {
      email: validarEmail,
      password: (v) => (v ? '' : 'La contraseña es obligatoria'),
    },
  );

  if (estaAutenticado) return <Navigate to="/" replace />;

  async function enviar(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!f.validar()) return;
    try {
      setCargando(true);
      await login(f.valores.email.trim(), f.valores.password);
      navegar(ubicacion.state?.desde || '/', { replace: true });
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
      titulo="Iniciar sesión"
      subtitulo="Ingresa tus datos para continuar."
      pie={<>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></>}
    >
      <form onSubmit={enviar} noValidate className="auth-form">
        {expirada && <p className="aviso aviso-info">Tu sesión expiró. Inicia sesión de nuevo.</p>}

        <Campo id="email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" autoComplete="email"
          value={f.valores.email} onChange={f.alCambiar('email')} onBlur={f.alSalir('email')} error={f.errores.email} />

        <Campo id="password" label="Contraseña" type="password" placeholder="••••••••" autoComplete="current-password"
          value={f.valores.password} onChange={f.alCambiar('password')} onBlur={f.alSalir('password')} error={f.errores.password} />

        <Link to="/recuperar" className="login-forgot">¿Olvidaste tu contraseña?</Link>

        {errorGeneral && <p className="aviso aviso-error" role="alert">{errorGeneral}</p>}

        <button type="submit" className="boton boton-primario boton-grande" disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
