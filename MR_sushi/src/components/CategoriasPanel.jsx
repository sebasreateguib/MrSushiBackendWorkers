// ===== Panel de categorías (overlay que abre el botón ⋮) =====
function CategoriasPanel({ categorias, abierto, onCerrar, onIrACategoria }) {
  if (!abierto) return null;

  return (
    <div
      onClick={onCerrar}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: '#111', width: '100%', maxWidth: '900px', marginTop: '110px', borderRadius: '10px 10px 0 0', padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}
      >
        {categorias.map((cat, index) => (
          <div
            key={index}
            onClick={() => onIrACategoria(index)}
            style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.3rem', padding: '14px 5px', cursor: 'pointer' }}
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriasPanel;
