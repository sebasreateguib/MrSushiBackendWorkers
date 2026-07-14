import ProductCard from './ProductCard';

// ===== Todas las secciones de productos (grids) =====
function ProductSections({ secciones, onAbrirProducto }) {
  return (
    <main style={{ padding: '20px 12px', maxWidth: '1300px', margin: '0 auto' }}>
      {secciones.map((seccion) => (
        <div key={seccion.id} id={seccion.id} style={{ marginBottom: '45px' }}>
          <h2 style={{ marginBottom: '20px', paddingLeft: '4px' }}>{seccion.titulo}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {seccion.productos.map((prod) => (
              <ProductCard
                key={prod.id}
                producto={prod}
                tipoSeccion={seccion.tipo}
                onAbrirProducto={onAbrirProducto}
              />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

export default ProductSections;
