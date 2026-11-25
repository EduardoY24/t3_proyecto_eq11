import { useState } from 'react';
import Campo from '../components/Campo';
import useFormulario from '../hooks/useFormulario';

// Recordatorio con notificacion del navegador (la API de Eduardo todavia no define
// endpoints de recordatorios; cuando existan, aqui se cambia por una peticion al backend).
function RecordatoriosPage() {
  const [mensaje, setMensaje] = useState('');
  const f = useFormulario(
    { texto: '', minutos: '1' },
    {
      texto: (v) => (String(v).trim() === '' ? 'Escribe qué quieres que te recuerde' : String(v).length > 100 ? 'Máximo 100 caracteres' : ''),
      minutos: (v) => {
        const n = Number(v);
        if (v === '' || Number.isNaN(n)) return 'Escribe los minutos';
        if (!Number.isInteger(n) || n < 1 || n > 1440) return 'Debe ser un número entero entre 1 y 1440';
        return '';
      },
    },
  );

  async function enviar(e) {
    e.preventDefault();
    setMensaje('');
    if (!f.validar()) return;
    if (!('Notification' in window)) {
      setMensaje('Tu navegador no soporta notificaciones.');
      return;
    }
    const permiso = await Notification.requestPermission();
    if (permiso !== 'granted') {
      setMensaje('Para recibir el aviso, permite las notificaciones en tu navegador.');
      return;
    }
    const texto = f.valores.texto.trim();
    const minutos = Number(f.valores.minutos);
    setTimeout(() => new Notification('Hábitos', { body: texto }), minutos * 60 * 1000);
    setMensaje(`Listo, te aviso en ${minutos} minuto(s). No cierres la pestaña.`);
    f.reiniciar({ texto: '', minutos: String(minutos) });
  }

  return (
    <form className="tarjeta formulario-simple" onSubmit={enviar} noValidate>
      <h2>Nuevo recordatorio</h2>
      <Campo id="texto" label="¿Qué te recuerdo?" placeholder="Ej. Tomar agua"
        value={f.valores.texto} onChange={f.alCambiar('texto')} onBlur={f.alSalir('texto')} error={f.errores.texto} />
      <Campo id="minutos" label="¿En cuántos minutos?" type="number" min="1"
        value={f.valores.minutos} onChange={f.alCambiar('minutos')} onBlur={f.alSalir('minutos')} error={f.errores.minutos} />
      <button type="submit" className="boton boton-primario">Programar recordatorio</button>
      {mensaje && <p className="aviso aviso-info" role="status">{mensaje}</p>}
    </form>
  );
}

export default RecordatoriosPage;
