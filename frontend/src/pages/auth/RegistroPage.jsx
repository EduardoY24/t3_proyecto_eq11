import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Campo from '../../components/Campo';
import { useAuth } from '../../context/AuthContext';
import useFormulario from '../../hooks/useFormulario';
import { leerError } from '../../services/api';
import { validarEmail, validarNombre, validarPassword, validarTelefono } from '../../utils/validaciones';

function RegistroPage() {
  const { registro, estaAutenticado } = useAuth();
  const navegar = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const f = useFormulario(
    { nombre: '', email: '', telefono: '', password: '', confirmar: '' },
    {
      nombre: validarNombre,
      email: validarEmail,
      telefono: (v) => validarTelefono(v, false),
      password: validarPassword,
      confirmar: (v, todos) => (v === todos.password ? '' : 'Las contraseñas no coinciden'),
    },
  );

  if (estaAutenticado) return <Navigate to="/" replace />;

  async function enviar(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!f.validar()) return;
    try {
      setCargando(true);
      await registro({
        nombre: f.valores.nombre.trim(),
        email: f.valores.email.trim(),
        password: f.valores.password,
        telefono: f.valores.telefono.trim(),
      });
      navegar('/', { replace: true });
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
      titulo="Crear cuenta"
      subtitulo="Regístrate para empezar a seguir tus hábitos."
      pie={<>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>}
    >
      <form onSubmit={enviar} noValidate className="auth-form">
        <Campo id="nombre" label="Nombre completo" placeholder="Ej. Ana López" autoComplete="name"
          value={f.valores.nombre} onChange={f.alCambiar('nombre')} onBlur={f.alSalir('nombre')} error={f.errores.nombre} />
        <Campo id="email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" autoComplete="email"
          value={f.valores.email} onChange={f.alCambiar('email')} onBlur={f.alSalir('email')} error={f.errores.email} />
        <Campo id="telefono" label="Teléfono (opcional)" type="tel" placeholder="+529511234567" autoComplete="tel"
          ayuda="Lo usaremos para enviarte recordatorios por SMS o WhatsApp."
          value={f.valores.telefono} onChange={f.alCambiar('telefono')} onBlur={f.alSalir('telefono')} error={f.errores.telefono} />
        <Campo id="password" label="Contraseña" type="password" placeholder="••••••••" autoComplete="new-password"
          ayuda="Mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
          value={f.valores.password} onChange={f.alCambiar('password')} onBlur={f.alSalir('password')} error={f.errores.password} />
        <Campo id="confirmar" label="Confirmar contraseña" type="password" placeholder="••••••••" autoComplete="new-password"
          value={f.valores.confirmar} onChange={f.alCambiar('confirmar')} onBlur={f.alSalir('confirmar')} error={f.errores.confirmar} />

        {errorGeneral && <p className="aviso aviso-error" role="alert">{errorGeneral}</p>}

        <button type="submit" className="boton boton-primario boton-grande" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegistroPage;
