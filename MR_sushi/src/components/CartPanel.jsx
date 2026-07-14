import { useEffect, useState } from 'react';
import { getImagen } from '../utils/imagenes';

// ===== Panel del carrito (overlay oscuro + panel deslizante desde la derecha) =====
function CartPanel({ abierto, onCerrar, items, totalProductos, descuentos, subtotal, onSumar, onEliminar, onEditar, onConfirmarPedido, tiempoEntrega }) {
  // ===== Control de animación: montar/desmontar con transición =====
  const [montado, setMontado] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (abierto) {
      setMontado(true);
      // pequeño delay (1 frame) para que el navegador registre el estado inicial
      // antes de animar hacia "visible" (si no, no se ve la transición de entrada)
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false); // dispara la animación de salida hacia la derecha
      const timer = setTimeout(() => setMontado(false), 300); // espera a que termine la transición
      return () => clearTimeout(timer);
    }
  }, [abierto]);

  if (!montado) return null;

  const hayProductos = items && items.length > 0;
  const totalItems = items.reduce((acc, it) => acc + it.cantidad, 0);

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: visible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        transition: 'background-color 0.3s ease-in-out',
        zIndex: 400,
        display: 'flex', justifyContent: 'flex-end'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#111', color: '#fff', width: '100%', maxWidth: '420px',
          height: '100%', padding: '24px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '20px',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Tu Carrito {hayProductos && `(${totalItems})`}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onCerrar}
              aria-label="Cerrar carrito"
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Selector de ubicación */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          border: '1px solid #444', borderRadius: '8px', padding: '12px 14px', cursor: 'pointer'
        }}>
          <span> ¿Dónde quieres pedir?</span>
          <span style={{ fontSize: '0.8rem' }}>▼</span>
        </div>

        {/* Contenido: vacío o lista de productos */}
        {!hayProductos && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#999', gap: '8px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Tu carrito esta vacío</h3>
            <p style={{ fontSize: '0.9rem' }}>Los productos que agregues aparecerán aquí</p>
          </div>
        )}

        {hayProductos && (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px 0', borderBottom: '1px solid #222' }}>
                  {/* Imagen */}
                  <img
                    src={getImagen(item.producto.id)}
                    alt={item.producto.titulo}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }}
                  />

                  {/* Info + controles */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{item.producto.titulo}</span>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 'bold' }}>S/ {(parseFloat(item.producto.precio) * item.cantidad).toFixed(2)}</div>
                        {item.producto.precioNormal && (
                          <div style={{ textDecoration: 'line-through', color: '#777', fontSize: '0.75rem' }}>
                            S/ {(parseFloat(item.producto.precioNormal) * item.cantidad).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Eliminar + cantidad + sumar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button
                          onClick={() => onEliminar(i)}
                          aria-label="Eliminar producto"
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.95rem' }}
                        >
                          🗑
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          onClick={() => onSumar(i)}
                          aria-label="Aumentar cantidad"
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Editar (solo si el producto es combo, abre el modal con sus sabores) */}
                      {onEditar && item.producto.tipo === "combo" && (
                        <button
                          onClick={() => onEditar(i)}
                          style={{ background: '#333', border: 'none', color: '#fff', borderRadius: '999px', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen de totales */}
            <div style={{ borderTop: '1px solid #333', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.9rem' }}>
                <span>Total Productos</span>
                <span>S/ {totalProductos.toFixed(2)}</span>
              </div>
              {descuentos > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.9rem' }}>
                  <span>Descuentos</span>
                  <span>- S/ {descuentos.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '6px' }}>
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>

              {/* Continuar: crea el pedido en el backend (API Gateway -> Lambda -> DynamoDB -> Step Functions) */}
              <button
                onClick={onConfirmarPedido}
                style={{
                  width: '100%', backgroundColor: '#fff', color: '#000',
                  border: 'none', borderRadius: '8px', padding: '14px',
                  fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPanel;
