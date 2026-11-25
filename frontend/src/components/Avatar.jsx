// Foto de perfil; si el usuario no tiene, se muestra un avatar por defecto con sus iniciales
function Avatar({ nombre = '', url, tamano = 40 }) {
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?';

  if (url) {
    return <img src={url} alt={`Foto de ${nombre}`} className="avatar" style={{ width: tamano, height: tamano }} />;
  }
  return (
    <span
      className="avatar avatar-defecto"
      style={{ width: tamano, height: tamano, fontSize: tamano * 0.4 }}
      aria-label={`Avatar de ${nombre}`}
    >
      {iniciales}
    </span>
  );
}

export default Avatar;
