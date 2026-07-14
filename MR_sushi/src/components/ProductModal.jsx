import { getImagenGrande } from '../utils/imagenes';

// ===== Modal de detalle de producto (combo o individual) =====
function ProductModal({
  productoSeleccionado,
  cantidad,
  setCantidad,
  saboresElegidos,
  totalSaboresElegidos,
  onCambiarSabor,
  puedeAgregar,
  onConfirmarAgregar,
  onCerrar
}) {
  if (!productoSeleccionado) return null;

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#000', color: '#fff', width: '100%', maxWidth: '950px',
          maxHeight: '90fpx', borderRadius: '14px', overflow: 'hidden',
          display: 'flex', flexDirection: 'row'
        }}
      >
        {/* Columna izquierda: imagen grande */}
        <div style={{ flex: '0 0 40%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
          <img
            src={getImagenGrande(productoSeleccionado.producto.id)}
            alt={productoSeleccionado.producto.titulo}
            style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '10px' }}
          />
        </div>

        {/* Columna derecha: info + scroll de opciones */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

          {/* Contenido scrolleable */}
          <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{productoSeleccionado.producto.titulo}</h2>
            <p style={{ color: '#999', marginBottom: '20px' }}>{productoSeleccionado.producto.descripcion}</p>

            {/* Si es combo, muestra selector de sabores */}
            {productoSeleccionado.tipo === "combo" && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.05rem' }}>{productoSeleccionado.producto.tituloSeleccion}</h3>
                  <span style={{ backgroundColor: '#fff', color: '#000', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px' }}>
                    Obligatorio
                  </span>
                </div>
                <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Seleccione {productoSeleccionado.producto.cantidadElegir} ({totalSaboresElegidos}/{productoSeleccionado.producto.cantidadElegir})
                </p>

                {productoSeleccionado.producto.sabores.map((sabor, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #222' }}>
                    <span style={{ fontSize: '0.95rem' }}>{sabor}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => onCambiarSabor(sabor, -1)} style={{ background: 'none', border: '1px solid #555', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                      <span style={{ minWidth: '14px', textAlign: 'center' }}>{saboresElegidos[sabor] || 0}</span>
                      <button onClick={() => onCambiarSabor(sabor, 1)} style={{ background: 'none', border: '1px solid #555', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer fijo: contador + botón agregar */}
          <div style={{ padding: '16px 28px', borderTop: '1px solid #222', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#000' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #555', borderRadius: '8px', padding: '6px 12px' }}>
              <button onClick={() => setCantidad((c) => Math.max(1, c - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}>−</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad((c) => c + 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
            </div>

            <button
              onClick={onConfirmarAgregar}
              disabled={!puedeAgregar()}
              style={{
                flex: 1, backgroundColor: puedeAgregar() ? '#fff' : '#555',
                color: puedeAgregar() ? '#000' : '#999',
                border: 'none', borderRadius: '8px', padding: '12px 20px',
                fontWeight: 'bold', fontSize: '1rem', cursor: puedeAgregar() ? 'pointer' : 'not-allowed',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <span>Agregar</span>
              <span>S/ {(parseFloat(productoSeleccionado.producto.precio) * cantidad).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
