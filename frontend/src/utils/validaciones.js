// Validaciones del frontend. Cada una regresa un texto de error o '' si esta bien.
// (El backend vuelve a validar todo con Bean Validation.)

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Minimo 8 caracteres, una mayuscula, un numero y un caracter especial
export const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function requerido(valor, mensaje = 'Este campo es obligatorio') {
  return String(valor ?? '').trim() === '' ? mensaje : '';
}

export function validarEmail(valor) {
  if (String(valor ?? '').trim() === '') return 'El correo es obligatorio';
  return REGEX_EMAIL.test(valor.trim()) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com';
}

export function validarPassword(valor) {
  if (!valor) return 'La contraseña es obligatoria';
  if (valor.length < 8) return 'Debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(valor)) return 'Debe incluir al menos una mayúscula';
  if (!/\d/.test(valor)) return 'Debe incluir al menos un número';
  if (!/[^A-Za-z0-9]/.test(valor)) return 'Debe incluir al menos un carácter especial (por ejemplo ! @ # $)';
  return '';
}

export function validarTelefono(valor, obligatorio = false) {
  const t = String(valor ?? '').trim();
  if (t === '') return obligatorio ? 'El teléfono es obligatorio' : '';
  return /^\+?\d{10,15}$/.test(t) ? '' : 'Usa solo números (10 a 15 dígitos), opcionalmente con + al inicio';
}

export function validarMaximo(valor, max, nombre = 'Este campo') {
  return String(valor ?? '').length > max ? `${nombre} no puede pasar de ${max} caracteres` : '';
}

export function validarNombre(valor) {
  const t = String(valor ?? '').trim();
  if (t === '') return 'El nombre es obligatorio';
  if (t.length < 3) return 'El nombre debe tener al menos 3 caracteres';
  if (t.length > 100) return 'El nombre no puede pasar de 100 caracteres';
  return '';
}
