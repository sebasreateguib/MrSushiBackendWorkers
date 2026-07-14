import { getImagen } from '../utils/imagenes';

// ===== Tarjeta de producto reutilizable =====
function ProductCard({ producto, tipoSeccion, onAbrirProducto }) {
  return (
    <div
      onClick={() => onAbrirProducto(producto, tipoSeccion)}
      style={{
        backgroundColor: '#1A1A1A', borderRadius: '12px', position: 'relative',
        display: 'flex', cursor: 'pointer', overflow: 'hidden', minHeight: '125px'
      }}
    >
      {producto.descuento && (
        <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#fff', color: '#000', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', zIndex: 2 }}>
          {producto.descuento}
        </span>
      )}

      {/* Imagen: ocupa todo el alto de la tarjeta, sin padding ni bordes propios */}
      <img
        src={getImagen(producto.id)}
        alt={producto.titulo}
        style={{ width: '42%', height: '100%', objectFit: 'cover', flexShrink: 0 }}
      />

      {/* Info del producto */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0, padding: '10px 14px' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '4px', lineHeight: '1.25' }}>{producto.titulo}</h3>
          <p style={{ color: '#ccc', fontSize: '0.8rem', lineHeight: '1.3' }}>{producto.descripcion}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '12px' }}>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>S/ {producto.precio}</span>
            {producto.precioNormal && (
              <span style={{ textDecoration: 'line-through', color: '#777', marginLeft: '10px', fontSize: '0.9rem' }}>
                S/ {producto.precioNormal}
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAbrirProducto(producto, tipoSeccion); }}
            style={{ backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
