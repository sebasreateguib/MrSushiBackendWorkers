import logo from '../assets/logo.png';

// ===== Header: Nivel 1 (logo y menú), Nivel 2 (ubicación/carrito) y Nivel 3 (buscador + categorías) =====
function Header({ categorias, categoriaActiva, onIrACategoria, onAbrirMenu, scrollRef, sesion, onAbrirLogin, onCerrarSesion, onAbrirCarrito, totalCarrito, pedidoActivo, onVerPedido }) {
  return (
    <>
      {/* NIVEL 1: Logo y Menú Principal */}
      <div style={{ backgroundColor: '#fff', color: '#000', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <img src={logo} alt="Mr Sushi Logo" style={{ height: '45px', objectFit: 'contain' }} />
          <span style={{ fontSize: '0.9rem', cursor: 'pointer' }}>INICIO</span>
          <button style={{ backgroundColor: '#E52127', color: '#fff', border: 'none', borderRadius: '25px', padding: '8px 18px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>
            ¡PEDIR AQUÍ!
          </button>
          <span style={{ fontSize: '0.9rem', cursor: 'pointer' }}>LOCALES & COBERTURA</span>
        </div>

        {/* ===== Sección de sesión ===== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {sesion ? (
            // Usuario autenticado: muestra nombre y botón de cerrar sesión
            <>
              <span style={{ fontSize: '0.85rem', color: '#333' }}>
                Hola, <strong>{sesion.nombre.split(' ')[0]}</strong>
              </span>
              <button
                onClick={onCerrarSesion}
                style={{
                  background: 'none', border: '1px solid #ccc', borderRadius: '20px',
                  padding: '5px 14px', fontSize: '0.8rem', cursor: 'pointer', color: '#555'
                }}
              >
                Salir
              </button>
            </>
          ) : (
            // Sin sesión: muestra botón de login con ícono
            <button
              onClick={onAbrirLogin}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
              aria-label="Iniciar sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m10 17 5-5-5-5"></path>
                <path d="M15 12H3"></path>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* NIVEL 2: Ubicación y Carrito */}
      <div style={{ backgroundColor: '#222', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', position: 'sticky', top: 0, zIndex: 101 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <span>¿Dónde quieres pedir? </span>
          <span style={{ fontSize: '0.7rem' }}>▼</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Botón pedido activo en la barra sticky */}
          {pedidoActivo && (
            <button
              onClick={onVerPedido}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: '#E52127', color: '#fff',
                border: 'none', borderRadius: '20px',
                padding: '5px 14px', fontSize: '0.78rem', fontWeight: 'bold',
                cursor: 'pointer', animation: 'pulse-order 2s ease-in-out infinite',
                flexShrink: 0,
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
              Ver mi pedido
            </button>
          )}

          <div
            onClick={onAbrirCarrito}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', backgroundColor: '#fff', color: '#000', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}
          >
            <span>S/ {totalCarrito.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* NIVEL 3: Buscador y Categorías */}
      <div style={{ backgroundColor: '#fff', color: '#000', padding: '10px 20px 0px', position: 'sticky', top: '49px', zIndex: 100, borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', flexShrink: 0 }}>
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>

          <div ref={scrollRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', whiteSpace: 'nowrap', flex: 1 }}>
            {categorias.map((cat, index) => (
              <span
                key={index}
                onClick={() => onIrACategoria(index)}
                style={{
                  cursor: 'pointer',
                  fontWeight: categoriaActiva === index ? 'bold' : 'normal',
                  fontSize: '0.95rem',
                  borderBottom: categoriaActiva === index ? '2px solid #000' : 'none',
                  paddingBottom: '5px',
                  flexShrink: 0
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          <button onClick={onAbrirMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#000', flexShrink: 0 }}>
            ⋮
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;