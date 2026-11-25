import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Campo from '../../components/Campo';
import useFormulario from '../../hooks/useFormulario';
import api, { leerError } from '../../services/api';
import { validarPassword } from '../../utils/validaciones';

// Paso 2: el usuario llega desde el correo con /restablecer?token=...
function RestablecerPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navegar = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [listo, setListo] = useState(false);

  const f = useFormulario(
    { password: '', confirmar: '' },
    {
      password: validarPassword,
      confirmar: (v, todos) => (v === todos.password ? '' : 'Las contraseñas no coinciden'),
    },
  );

  async function enviar(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!f.validar()) return;
    try {
      setCargando(true);
      await api.post('/auth/restablecer', { token, password: f.valores.password });
      setListo(true);
      setTimeout(() => navegar('/login', { replace: true }), 2500);
    } catch (err) {
      const info = leerError(err);
      f.setErroresServidor(info.campos);
      setErrorGeneral(info.general);
    } finally {
      setCargando(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout titulo="Enlace no válido" pie={<Link to="/recuperar">Pedir un enlace nuevo</Link>}>
        <p className="aviso aviso-error" role="alert">Este enlace no es válido. Pide uno nuevo desde “Recuperar contraseña”.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      titulo="Nueva contraseña"
      subtitulo="Elige una contraseña segura para tu cuenta."
      pie={<Link to="/login">Volver a iniciar sesión</Link>}
    >
      {listo ? (
        <p className="aviso aviso-exito" role="status">Contraseña actualizada. Te llevamos al inicio de sesión...</p>
      ) : (
        <form onSubmit={enviar} noValidate className="auth-form">
          <Campo id="password" label="Contraseña nueva" type="password" placeholder="••••••••" autoComplete="new-password"
            ayuda="Mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
            value={f.valores.password} onChange={f.alCambiar('password')} onBlur={f.alSalir('password')} error={f.errores.password} />
          <Campo id="confirmar" label="Confirmar contraseña" type="password" placeholder="••••••••" autoComplete="new-password"
            value={f.valores.confirmar} onChange={f.alCambiar('confirmar')} onBlur={f.alSalir('confirmar')} error={f.errores.confirmar} />
          {errorGeneral && <p className="aviso aviso-error" role="alert">{errorGeneral}</p>}
          <button type="submit" className="boton boton-primario boton-grande" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default RestablecerPage;
