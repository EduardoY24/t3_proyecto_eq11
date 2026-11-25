import { useState } from 'react';
import Modal from '../../components/Modal';
import Campo from '../../components/Campo';
import useFormulario from '../../hooks/useFormulario';
import api, { leerError } from '../../services/api';
import { validarEmail, validarNombre, validarPassword, validarTelefono } from '../../utils/validaciones';

// ADMIN: crear (POST /admin/usuarios) o editar (PUT /admin/usuarios/{id}) un usuario
function UsuarioModal({ usuario, coaches, onCerrar, onGuardado }) {
  const editando = !!usuario;
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const f = useFormulario(
    {
      nombre: usuario?.nombre || '',
      email: usuario?.email || '',
      password: '',
      telefono: usuario?.telefono || '',
      rol: usuario?.rol || 'USUARIO',
      activo: usuario ? usuario.activo : true,
      coachId: usuario?.coach ? String(usuario.coach.id) : '',
    },
    {
      nombre: validarNombre,
      email: validarEmail,
      // al editar la contraseña es opcional; al crear es obligatoria
      password: (v) => (editando && !v ? '' : validarPassword(v)),
      telefono: (v) => validarTelefono(v, false),
      rol: (v) => (['ADMIN', 'COACH', 'USUARIO'].includes(v) ? '' : 'Elige un rol'),
    },
  );

  async function enviar(e) {
    e.preventDefault();
    setErrorGeneral('');
    if (!f.validar()) return;
    const cuerpo = {
      nombre: f.valores.nombre.trim(),
      email: f.valores.email.trim(),
      telefono: f.valores.telefono.trim(),
      rol: f.valores.rol,
      activo: f.valores.activo,
      coachId: f.valores.rol === 'USUARIO' && f.valores.coachId ? Number(f.valores.coachId) : null,
    };
    if (f.valores.password) cuerpo.password = f.valores.password;
    try {
      setGuardando(true);
      if (editando) await api.put(`/admin/usuarios/${usuario.id}`, cuerpo);
      else await api.post('/admin/usuarios', cuerpo);
      onGuardado(editando ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
    } catch (err) {
      const info = leerError(err);
      f.setErroresServidor(info.campos);
      setErrorGeneral(info.general);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal titulo={editando ? 'Editar usuario' : 'Nuevo usuario'} onCerrar={guardando ? () => {} : onCerrar}>
      <form onSubmit={enviar} noValidate className="form-modal">
        <Campo id="u-nombre" label="Nombre completo"
          value={f.valores.nombre} onChange={f.alCambiar('nombre')} onBlur={f.alSalir('nombre')} error={f.errores.nombre} />
        <Campo id="u-email" label="Correo electrónico" type="email"
          value={f.valores.email} onChange={f.alCambiar('email')} onBlur={f.alSalir('email')} error={f.errores.email} />
        <Campo id="u-password" label={editando ? 'Contraseña nueva (opcional)' : 'Contraseña'} type="password" autoComplete="new-password"
          ayuda="Mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
          value={f.valores.password} onChange={f.alCambiar('password')} onBlur={f.alSalir('password')} error={f.errores.password} />
        <Campo id="u-telefono" label="Teléfono (opcional)" type="tel" placeholder="+529511234567"
          value={f.valores.telefono} onChange={f.alCambiar('telefono')} onBlur={f.alSalir('telefono')} error={f.errores.telefono} />
        <Campo id="u-rol" label="Rol" as="select" value={f.valores.rol} onChange={f.alCambiar('rol')} error={f.errores.rol}>
          <option value="USUARIO">Usuario</option>
          <option value="COACH">Coach</option>
          <option value="ADMIN">Administrador</option>
        </Campo>
        {f.valores.rol === 'USUARIO' && (
          <Campo id="u-coach" label="Coach asignado (opcional)" as="select" value={f.valores.coachId} onChange={f.alCambiar('coachId')} error={f.errores.coachId}>
            <option value="">Sin coach</option>
            {coaches.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </Campo>
        )}
        <label className="campo-check">
          <input type="checkbox" checked={f.valores.activo} onChange={f.alCambiar('activo')} />
          Cuenta activa
        </label>

        {errorGeneral && <p className="aviso aviso-error" role="alert">{errorGeneral}</p>}

        <div className="modal-botones">
          <button type="button" className="boton boton-secundario" onClick={onCerrar} disabled={guardando}>Cancelar</button>
          <button type="submit" className="boton boton-primario" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default UsuarioModal;
