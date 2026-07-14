import { useState } from 'react';
import { registrarUsuario, iniciarSesion } from '../utils/auth';

// ===== Popup de autenticación (login / registro) =====
// Se renderiza dentro de la misma app como un overlay tipo popup pequeño,
// igual que haría una ventana emergente externa pero sin depender de ningún servicio.

function AuthPopup({ abierto, onCerrar, onSesionIniciada }) {
  const [modo, setModo] = useState('login'); // 'login' | 'registro'
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  if (!abierto) return null;

  const limpiarFormulario = () => {
    setNombre('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    limpiarFormulario();
  };

  const handleSubmit = async () => {
    setError('');
    setCargando(true);

    const resultado =
      modo === 'registro'
        ? await registrarUsuario({ nombre, email, password })
        : await iniciarSesion({ email, password });

    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    limpiarFormulario();
    onSesionIniciada(resultado.usuario);
    onCerrar();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // ===== Estilos internos =====
  const inputStyle = {
    width: '100%',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '6px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  return (
    // Overlay oscuro de fondo — click afuera cierra
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.75)',
        zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Ventana del popup — click adentro no propaga */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#111',
          color: '#fff',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Cabecera con logo / título */}
        <div style={{
          backgroundColor: '#E52127',
          padding: '24px 28px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
            Mr Sushi
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '4px' }}>
            {modo === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
          </div>
        </div>

        {/* Selector de modo */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #222',
        }}>
          {['login', 'registro'].map((m) => (
            <button
              key={m}
              onClick={() => cambiarModo(m)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: modo === m ? '#fff' : '#666',
                fontWeight: modo === m ? 'bold' : 'normal',
                fontSize: '0.9rem',
                padding: '14px',
                cursor: 'pointer',
                borderBottom: modo === m ? '2px solid #E52127' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {modo === 'registro' && (
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={handleKeyDown}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder={modo === 'registro' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div style={{
              backgroundColor: '#2a0000',
              border: '1px solid #550000',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: '#ff6b6b',
            }}>
              {error}
            </div>
          )}

          {/* Botón principal */}
          <button
            onClick={handleSubmit}
            disabled={cargando}
            style={{
              backgroundColor: cargando ? '#555' : '#E52127',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '4px',
            }}
          >
            {cargando
              ? 'Procesando...'
              : modo === 'login'
                ? 'Entrar'
                : 'Crear cuenta'}
          </button>

          {/* Link para cambiar de modo */}
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', margin: 0 }}>
            {modo === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <span
              onClick={() => cambiarModo(modo === 'login' ? 'registro' : 'login')}
              style={{ color: '#E52127', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </span>
          </p>
        </div>

        {/* Footer: cerrar */}
        <div style={{ padding: '0 28px 20px', textAlign: 'center' }}>
          <button
            onClick={onCerrar}
            style={{
              background: 'none', border: 'none', color: '#444',
              fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPopup;
