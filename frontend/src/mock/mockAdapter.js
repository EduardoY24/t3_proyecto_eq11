// API SIMULADA (solo para desarrollo mientras el backend no esta listo).
// Responde con el MISMO formato que definio Eduardo en el chat, asi al cambiar
// VITE_USE_MOCK=false el frontend funciona igual con la API real.
// Los datos viven en memoria: al recargar la pagina vuelven a los datos iniciales.
import { AxiosError } from 'axios';
import { validarEmail, validarPassword, validarTelefono } from '../utils/validaciones';

const ROLES = ['ADMIN', 'COACH', 'USUARIO'];

const categorias = [
  { id: 1, nombre: 'Salud', color: '#2E9E6B' },
  { id: 2, nombre: 'Ejercicio', color: '#E4572E' },
  { id: 3, nombre: 'Estudio', color: '#3B6FD8' },
  { id: 4, nombre: 'Mañana', color: '#F2B134' },
  { id: 5, nombre: 'Noche', color: '#5B4B8A' },
  { id: 6, nombre: 'Lectura', color: '#8C5E3C' },
  { id: 7, nombre: 'Mindfulness', color: '#4FB0C6' },
  { id: 8, nombre: 'Alimentación', color: '#7CB342' },
  { id: 9, nombre: 'Finanzas', color: '#2F4858' },
  { id: 10, nombre: 'Productividad', color: '#D81B60' },
];

const usuarios = [
  { id: 1, nombre: 'Administrador', email: 'admin@habitos.com', password: 'Admin123!', telefono: '+520000000001', rol: 'ADMIN', activo: true, coachId: null },
  { id: 2, nombre: 'Laura Coach', email: 'coach1@habitos.com', password: 'Coach123!', telefono: '+520000000002', rol: 'COACH', activo: true, coachId: null },
  { id: 3, nombre: 'Marco Coach', email: 'coach2@habitos.com', password: 'Coach123!', telefono: '+520000000003', rol: 'COACH', activo: true, coachId: null },
  { id: 4, nombre: 'Ana López', email: 'ana@habitos.com', password: 'Usuario123!', telefono: '+520000000004', rol: 'USUARIO', activo: true, coachId: 2 },
  { id: 5, nombre: 'Luis Pérez', email: 'luis@habitos.com', password: 'Usuario123!', telefono: '+520000000005', rol: 'USUARIO', activo: true, coachId: 2 },
  { id: 6, nombre: 'María Gómez', email: 'maria@habitos.com', password: 'Usuario123!', telefono: '+520000000006', rol: 'USUARIO', activo: true, coachId: 2 },
  { id: 7, nombre: 'Carlos Ruiz', email: 'carlos@habitos.com', password: 'Usuario123!', telefono: '+520000000007', rol: 'USUARIO', activo: true, coachId: 2 },
  { id: 8, nombre: 'Sofía Díaz', email: 'sofia@habitos.com', password: 'Usuario123!', telefono: '+520000000008', rol: 'USUARIO', activo: true, coachId: 3 },
  { id: 9, nombre: 'Jorge Torres', email: 'jorge@habitos.com', password: 'Usuario123!', telefono: '+520000000009', rol: 'USUARIO', activo: true, coachId: 3 },
  { id: 10, nombre: 'Valeria Cruz', email: 'valeria@habitos.com', password: 'Usuario123!', telefono: '+520000000010', rol: 'USUARIO', activo: true, coachId: 3 },
  { id: 11, nombre: 'Diego Morales', email: 'diego@habitos.com', password: 'Usuario123!', telefono: '+520000000011', rol: 'USUARIO', activo: false, coachId: 3 },
  { id: 12, nombre: 'Fernanda Ríos', email: 'fernanda@habitos.com', password: 'Usuario123!', telefono: '+520000000012', rol: 'USUARIO', activo: true, coachId: null },
];

// [nombre, descripcion, frecuencia, usuarioId, [categoriaIds]]
const semillaHabitos = [
  ['Beber 2 litros de agua', 'Tomar agua durante el día', 'DIARIO', 4, [1, 8]],
  ['Correr 30 minutos', 'Correr en el parque', 'DIARIO', 4, [1, 2, 4]],
  ['Leer 20 páginas', 'Leer antes de dormir', 'DIARIO', 5, [6, 5]],
  ['Meditar 10 minutos', 'Meditación guiada', 'DIARIO', 5, [7, 4]],
  ['Estudiar inglés', 'Practicar con una app', 'DIARIO', 6, [3]],
  ['Ir al gimnasio', 'Rutina de pesas', 'SEMANAL', 6, [2, 1]],
  ['Dormir 8 horas', 'Acostarse antes de las 11', 'DIARIO', 7, [1, 5]],
  ['Registrar gastos', 'Anotar lo que gasto', 'DIARIO', 7, [9]],
  ['Comer fruta', 'Una fruta en el desayuno', 'DIARIO', 8, [8, 4]],
  ['Caminar 10 mil pasos', 'Caminar durante el día', 'DIARIO', 8, [2, 1]],
  ['Escribir un diario', 'Escribir lo que pasó en el día', 'DIARIO', 9, [7, 5]],
  ['Repasar apuntes', 'Repasar la clase del día', 'SEMANAL', 10, [3]],
  ['Planear el día', 'Hacer lista de pendientes', 'DIARIO', 10, [10, 4]],
  ['Estiramientos', 'Estirar al despertar', 'DIARIO', 11, [1, 4]],
  ['Ahorrar 50 pesos', 'Guardar dinero cada semana', 'SEMANAL', 12, [9]],
  ['Tomar vitaminas', 'Después del desayuno', 'DIARIO', 4, [1, 4]],
  ['Practicar yoga', 'Clase de 20 minutos', 'SEMANAL', 4, [2, 7]],
  ['Leer artículo técnico', 'Un artículo de programación', 'DIARIO', 5, [3, 6]],
  ['Preparar comida de la semana', 'Meal prep del domingo', 'SEMANAL', 6, [8]],
  ['Revisar presupuesto', 'Comparar gastos contra el plan', 'SEMANAL', 7, [9, 10]],
];

let siguienteHabito = 1;
const habitos = semillaHabitos.map(([nombre, descripcion, frecuencia, usuarioId, categoriaIds], i) => ({
  id: siguienteHabito++,
  nombre,
  descripcion,
  frecuencia,
  activo: i % 7 !== 6,
  usuarioId,
  categoriaIds,
}));
let siguienteUsuario = 13;
let siguienteCategoria = 11;

// ---------------------------------------------------------------- utilidades
function respuesta(config, status, data) {
  return { data, status, statusText: String(status), headers: {}, config, request: {} };
}

function falla(config, status, data) {
  const resp = respuesta(config, status, data);
  return new AxiosError(`Request failed with status code ${status}`, 'ERR_BAD_REQUEST', config, {}, resp);
}

function pagina(lista, params) {
  const size = Math.min(Math.max(Number(params.size) || 10, 1), 50);
  const number = Math.max(Number(params.page) || 0, 0);
  const totalElements = lista.length;
  const totalPages = Math.ceil(totalElements / size);
  return {
    content: lista.slice(number * size, number * size + size),
    page: { size, number, totalElements, totalPages },
  };
}

function usuarioAResp(u) {
  const coach = u.coachId ? usuarios.find((x) => x.id === u.coachId) : null;
  return {
    id: u.id, nombre: u.nombre, email: u.email, telefono: u.telefono, rol: u.rol, activo: u.activo,
    coach: coach ? { id: coach.id, nombre: coach.nombre } : null,
  };
}

function habitoAResp(h) {
  const dueno = usuarios.find((u) => u.id === h.usuarioId);
  return {
    id: h.id, nombre: h.nombre, descripcion: h.descripcion, frecuencia: h.frecuencia, activo: h.activo,
    categorias: h.categoriaIds.map((id) => categorias.find((c) => c.id === id)).filter(Boolean),
    usuario: { id: dueno.id, nombre: dueno.nombre },
  };
}

function sesionDeLaPeticion(config) {
  const auth = config.headers?.Authorization || config.headers?.get?.('Authorization') || '';
  const match = /^Bearer mock\.(\d+)$/.exec(auth);
  if (!match) return null;
  return usuarios.find((u) => u.id === Number(match[1]) && u.activo) || null;
}

function authResp(u) {
  return { token: `mock.${u.id}`, id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, avatarUrl: null };
}

function validarHabito(b) {
  const e = {};
  if (!b.nombre || !String(b.nombre).trim()) e.nombre = 'El nombre es obligatorio';
  else if (String(b.nombre).length > 100) e.nombre = 'El nombre no puede pasar de 100 caracteres';
  if (b.descripcion && String(b.descripcion).length > 255) e.descripcion = 'La descripción no puede pasar de 255 caracteres';
  if (!['DIARIO', 'SEMANAL'].includes(b.frecuencia)) e.frecuencia = 'Elige DIARIO o SEMANAL';
  if (!Array.isArray(b.categoriaIds) || b.categoriaIds.length === 0) e.categoriaIds = 'Elige al menos una categoría';
  return e;
}

function validarUsuario(b, esNuevo) {
  const e = {};
  if (!b.nombre || String(b.nombre).trim().length < 3) e.nombre = 'El nombre debe tener al menos 3 caracteres';
  const eEmail = validarEmail(b.email || '');
  if (eEmail) e.email = eEmail;
  if (esNuevo || b.password) {
    const eP = validarPassword(b.password || '');
    if (eP) e.password = eP;
  }
  const eT = validarTelefono(b.telefono, false);
  if (eT) e.telefono = eT;
  if (!ROLES.includes(b.rol)) e.rol = 'Elige un rol válido';
  return e;
}

// ---------------------------------------------------------------- enrutador
function manejar(config) {
  const metodo = (config.method || 'get').toLowerCase();
  const ruta = (config.url || '').split('?')[0];
  const params = config.params || {};
  let body = {};
  if (config.data) {
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch { body = {}; }
  }
  const ok = (status, data) => respuesta(config, status, data);
  const error = (status, data) => { throw falla(config, status, data); };

  // ---------- AUTH (publico)
  if (ruta === '/auth/login' && metodo === 'post') {
    const u = usuarios.find((x) => x.email.toLowerCase() === String(body.email || '').trim().toLowerCase());
    if (!u || u.password !== body.password || !u.activo) error(401, { error: 'Correo o contraseña incorrectos' });
    return ok(200, authResp(u));
  }
  if (ruta === '/auth/register' && metodo === 'post') {
    const e = {};
    if (!body.nombre || String(body.nombre).trim().length < 3) e.nombre = 'El nombre debe tener al menos 3 caracteres';
    const eE = validarEmail(body.email || ''); if (eE) e.email = eE;
    const eP = validarPassword(body.password || ''); if (eP) e.password = eP;
    const eT = validarTelefono(body.telefono, false); if (eT) e.telefono = eT;
    if (!e.email && usuarios.some((x) => x.email.toLowerCase() === body.email.trim().toLowerCase())) e.email = 'Ya existe una cuenta con este correo';
    if (Object.keys(e).length) error(400, e);
    const nuevo = { id: siguienteUsuario++, nombre: body.nombre.trim(), email: body.email.trim(), password: body.password, telefono: body.telefono || null, rol: 'USUARIO', activo: true, coachId: null };
    usuarios.push(nuevo);
    return ok(201, authResp(nuevo));
  }
  if (ruta === '/auth/recuperar' && metodo === 'post') {
    const eE = validarEmail(body.email || '');
    if (eE) error(400, { email: eE });
    return ok(200, { mensaje: 'Si el correo existe, te enviamos las instrucciones.' });
  }
  if (ruta === '/auth/restablecer' && metodo === 'post') {
    if (!body.token) error(400, { error: 'El enlace no es válido o ya venció' });
    const eP = validarPassword(body.password || '');
    if (eP) error(400, { password: eP });
    return ok(200, { mensaje: 'Contraseña actualizada' });
  }

  // ---------- Todo lo demas requiere sesion
  const yo = sesionDeLaPeticion(config);
  if (!yo) error(401, { error: 'No has iniciado sesión o tu sesión expiró' });
  if (ruta === '/auth/logout' && metodo === 'post') return ok(200, { mensaje: 'Sesión cerrada' });

  const exigir = (...roles) => { if (!roles.includes(yo.rol)) error(403, { error: 'No tienes permiso para realizar esta acción' }); };

  // ---------- CATEGORIAS
  if (ruta === '/categorias' && metodo === 'get') return ok(200, categorias);
  if (ruta === '/admin/categorias' && metodo === 'post') {
    exigir('ADMIN');
    const e = {};
    if (!body.nombre || !String(body.nombre).trim()) e.nombre = 'El nombre es obligatorio';
    else if (String(body.nombre).length > 50) e.nombre = 'El nombre no puede pasar de 50 caracteres';
    else if (categorias.some((c) => c.nombre.toLowerCase() === body.nombre.trim().toLowerCase())) e.nombre = 'Ya existe una categoría con ese nombre';
    if (!/^#[0-9A-Fa-f]{6}$/.test(body.color || '')) e.color = 'El color debe tener formato #RRGGBB';
    if (Object.keys(e).length) error(400, e);
    const c = { id: siguienteCategoria++, nombre: body.nombre.trim(), color: body.color };
    categorias.push(c);
    return ok(201, c);
  }
  let m = /^\/admin\/categorias\/(\d+)$/.exec(ruta);
  if (m) {
    exigir('ADMIN');
    const c = categorias.find((x) => x.id === Number(m[1]));
    if (!c) error(404, { error: 'La categoría no existe' });
    if (metodo === 'put') {
      const e = {};
      if (!body.nombre || !String(body.nombre).trim()) e.nombre = 'El nombre es obligatorio';
      else if (categorias.some((x) => x.id !== c.id && x.nombre.toLowerCase() === body.nombre.trim().toLowerCase())) e.nombre = 'Ya existe una categoría con ese nombre';
      if (!/^#[0-9A-Fa-f]{6}$/.test(body.color || '')) e.color = 'El color debe tener formato #RRGGBB';
      if (Object.keys(e).length) error(400, e);
      c.nombre = body.nombre.trim(); c.color = body.color;
      return ok(200, c);
    }
    if (metodo === 'delete') {
      categorias.splice(categorias.indexOf(c), 1);
      habitos.forEach((h) => { h.categoriaIds = h.categoriaIds.filter((id) => id !== c.id); });
      return ok(200, { mensaje: 'Categoría eliminada' });
    }
  }

  // ---------- HABITOS
  if (ruta === '/habitos' && metodo === 'get') {
    let lista = habitos.filter((h) => yo.rol === 'ADMIN' || h.usuarioId === yo.id);
    const q = String(params.busqueda || '').toLowerCase();
    if (q) lista = lista.filter((h) => h.nombre.toLowerCase().includes(q) || (h.descripcion || '').toLowerCase().includes(q));
    if (params.categoriaId) lista = lista.filter((h) => h.categoriaIds.includes(Number(params.categoriaId)));
    if (params.activo === true || params.activo === 'true') lista = lista.filter((h) => h.activo);
    if (params.activo === false || params.activo === 'false') lista = lista.filter((h) => !h.activo);
    const p = pagina(lista, params);
    return ok(200, { content: p.content.map(habitoAResp), page: p.page });
  }
  if (ruta === '/habitos' && metodo === 'post') {
    const e = validarHabito(body);
    if (Object.keys(e).length) error(400, e);
    const h = { id: siguienteHabito++, nombre: body.nombre.trim(), descripcion: body.descripcion || '', frecuencia: body.frecuencia, activo: body.activo !== false, usuarioId: yo.id, categoriaIds: body.categoriaIds };
    habitos.push(h);
    return ok(201, habitoAResp(h));
  }
  m = /^\/habitos\/(\d+)$/.exec(ruta);
  if (m) {
    const h = habitos.find((x) => x.id === Number(m[1]));
    if (!h) error(404, { error: 'El hábito no existe' });
    if (yo.rol !== 'ADMIN' && h.usuarioId !== yo.id) error(403, { error: 'Ese hábito no es tuyo' });
    if (metodo === 'get') return ok(200, habitoAResp(h));
    if (metodo === 'put') {
      const e = validarHabito(body);
      if (Object.keys(e).length) error(400, e);
      Object.assign(h, { nombre: body.nombre.trim(), descripcion: body.descripcion || '', frecuencia: body.frecuencia, activo: body.activo !== false, categoriaIds: body.categoriaIds });
      return ok(200, habitoAResp(h));
    }
    if (metodo === 'delete') { habitos.splice(habitos.indexOf(h), 1); return ok(200, { mensaje: 'Hábito eliminado' }); }
  }

  // ---------- ADMIN / USUARIOS
  if (ruta === '/admin/usuarios' && metodo === 'get') {
    exigir('ADMIN');
    let lista = usuarios.slice();
    const q = String(params.busqueda || '').toLowerCase();
    if (q) lista = lista.filter((u) => u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    if (params.rol) lista = lista.filter((u) => u.rol === params.rol);
    const p = pagina(lista, params);
    return ok(200, { content: p.content.map(usuarioAResp), page: p.page });
  }
  if (ruta === '/admin/usuarios' && metodo === 'post') {
    exigir('ADMIN');
    const e = validarUsuario(body, true);
    if (!e.email && usuarios.some((x) => x.email.toLowerCase() === body.email.trim().toLowerCase())) e.email = 'Ya existe una cuenta con este correo';
    if (Object.keys(e).length) error(400, e);
    const u = { id: siguienteUsuario++, nombre: body.nombre.trim(), email: body.email.trim(), password: body.password, telefono: body.telefono || null, rol: body.rol, activo: body.activo !== false, coachId: body.coachId || null };
    usuarios.push(u);
    return ok(201, usuarioAResp(u));
  }
  m = /^\/admin\/usuarios\/(\d+)$/.exec(ruta);
  if (m) {
    exigir('ADMIN');
    const u = usuarios.find((x) => x.id === Number(m[1]));
    if (!u) error(404, { error: 'El usuario no existe' });
    if (metodo === 'put') {
      const e = validarUsuario(body, false);
      if (!e.email && usuarios.some((x) => x.id !== u.id && x.email.toLowerCase() === body.email.trim().toLowerCase())) e.email = 'Ya existe una cuenta con este correo';
      if (Object.keys(e).length) error(400, e);
      Object.assign(u, { nombre: body.nombre.trim(), email: body.email.trim(), telefono: body.telefono || null, rol: body.rol, activo: body.activo !== false, coachId: body.coachId || null });
      if (body.password) u.password = body.password;
      return ok(200, usuarioAResp(u));
    }
    if (metodo === 'delete') {
      if (u.id === yo.id) error(400, { error: 'No puedes eliminar tu propia cuenta' });
      usuarios.splice(usuarios.indexOf(u), 1);
      for (let i = habitos.length - 1; i >= 0; i--) if (habitos[i].usuarioId === u.id) habitos.splice(i, 1);
      usuarios.forEach((x) => { if (x.coachId === u.id) x.coachId = null; });
      return ok(200, { mensaje: 'Usuario eliminado' });
    }
  }

  // ---------- COACH
  if (ruta === '/coach/usuarios' && metodo === 'get') {
    exigir('COACH');
    return ok(200, usuarios.filter((u) => u.coachId === yo.id).map(usuarioAResp));
  }
  m = /^\/coach\/usuarios\/(\d+)\/habitos$/.exec(ruta);
  if (m) {
    exigir('COACH');
    const u = usuarios.find((x) => x.id === Number(m[1]));
    if (!u) error(404, { error: 'El usuario no existe' });
    if (u.coachId !== yo.id) error(403, { error: 'Ese usuario no está asignado a ti' });
    if (metodo === 'get') {
      const p = pagina(habitos.filter((h) => h.usuarioId === u.id), params);
      return ok(200, { content: p.content.map(habitoAResp), page: p.page });
    }
    if (metodo === 'post') {
      const e = validarHabito(body);
      if (Object.keys(e).length) error(400, e);
      const h = { id: siguienteHabito++, nombre: body.nombre.trim(), descripcion: body.descripcion || '', frecuencia: body.frecuencia, activo: body.activo !== false, usuarioId: u.id, categoriaIds: body.categoriaIds };
      habitos.push(h);
      return ok(201, habitoAResp(h));
    }
  }

  return error(404, { error: 'Ruta no encontrada' });
}

// Adaptador de axios: simula una espera de red y llama al enrutador
export function mockAdapter(config) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(manejar(config));
      } catch (e) {
        reject(e);
      }
    }, 350);
  });
}
