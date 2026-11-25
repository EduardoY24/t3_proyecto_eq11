import './Auth.css';
import ilustracion from '../../assets/ilustracion-login.png';

// Pantalla de dos columnas que comparten Login, Registro, Recuperar y Restablecer
function AuthLayout({ titulo, subtitulo, children, pie }) {
  return (
    <div className="login-page">
      <section className="login-left">
        <div className="login-logo">
          <span className="login-logo-icon">✓</span>
          <span>Hábitos</span>
        </div>
        <h1>Gestiona tus hábitos y mantén el ritmo cada día.</h1>
        <p>Organiza tus rutinas, recibe recordatorios y deja que tu coach te acompañe en el proceso.</p>
        <img src={ilustracion} alt="Ilustración de hábitos" className="login-ilustracion" />
      </section>

      <section className="login-right">
        <div className="login-card">
          <div>
            <h2>{titulo}</h2>
            {subtitulo && <p className="login-subtitle">{subtitulo}</p>}
          </div>
          {children}
          {pie && <p className="auth-pie">{pie}</p>}
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;
