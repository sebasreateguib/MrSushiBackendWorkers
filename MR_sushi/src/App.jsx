import { useState, useEffect, useRef } from 'react';
import './App.css';

import banner1 from './assets/banner1.jpg';
import banner2 from './assets/banner2.jpg';

import { categorias, secciones } from './data/productos';

import Header from './components/Header';
import CategoriasPanel from './components/CategoriasPanel';
import BannerCarousel from './components/BannerCarousel';
import ProductSections from './components/ProductSections';
import ProductModal from './components/ProductModal';
import CartPanel from './components/CartPanel';
import AuthPopup from './components/AuthPopup';
import OrderTrackingPage from './components/OrderTrackingPage';

import { Bike } from 'lucide-react';
import { obtenerSesion, cerrarSesion } from './utils/auth';
import { crearPedido, listarMisPedidos } from './utils/orders';

function App() {
  // ===== Estados generales =====
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState(0);
  const scrollRef = useRef(null);

  // ===== Estado de sesión =====
  const [sesion, setSesion] = useState(() => obtenerSesion()); // { nombre, email } | null
  const [loginAbierto, setLoginAbierto] = useState(false);

  // ===== Estados del modal de producto =====
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [saboresElegidos, setSaboresElegidos] = useState({});

  // ===== Estado del carrito =====
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [carrito, setCarrito] = useState([]);

  // ===== Estado del pedido en curso (seguimiento) — persiste en localStorage =====
  const [pedidoEnCursoId, setPedidoEnCursoIdRaw] = useState(
    () => localStorage.getItem('mrsushi_pedido_activo') || null
  );
  // El modal empieza CERRADO aunque haya un pedido guardado — el botón flotante lo reabre
  const [trackingVisible, setTrackingVisible] = useState(false);
  const [errorPedido, setErrorPedido] = useState('');

  const setPedidoEnCursoId = (id) => {
    setPedidoEnCursoIdRaw(id);
    if (id) localStorage.setItem('mrsushi_pedido_activo', id);
    else localStorage.removeItem('mrsushi_pedido_activo');
  };

  // Al cargar, busca pedidos activos (no entregados) del usuario autenticado
  useEffect(() => {
    if (!sesion || pedidoEnCursoId) return;
    listarMisPedidos()
      .then((data) => {
        const pedidos = data.pedidos || data.orders || data;
        if (!Array.isArray(pedidos)) return;
        const activo = pedidos.find((p) => p.status !== 'ENTREGADO');
        if (activo) setPedidoEnCursoId(activo.orderId);
      })
      .catch(() => {});
  }, [sesion]);

  const totalProductos = carrito.reduce(
    (acc, item) => acc + parseFloat(item.producto.precioNormal || item.producto.precio) * item.cantidad, 0
  );
  const subtotal = carrito.reduce(
    (acc, item) => acc + parseFloat(item.producto.precio) * item.cantidad, 0
  );
  const descuentos = totalProductos - subtotal;

  const banners = [
    { src: banner1, height: '230px' },
    { src: banner2, height: '230px' }
  ];

  // ===== Carrusel automático =====
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1);

  // ===== Navegación por categorías =====
  const irACategoria = (index) => {
    setCategoriaActiva(index);
    setMenuAbierto(false);

    const seccion = secciones[index];
    if (seccion) {
      const el = document.getElementById(seccion.id);
      if (el) {
        const offset = 110;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  // ===== Scroll-spy =====
  useEffect(() => {
    const handleScrollSpy = () => {
      const offset = 130;
      let activa = 0;
      secciones.forEach((seccion, index) => {
        const el = document.getElementById(seccion.id);
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          activa = index;
        }
      });
      setCategoriaActiva(activa);
    };
    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  // ===== Modal de producto =====
  const abrirProducto = (producto, tipoSeccion) => {
    setProductoSeleccionado({ producto, tipo: tipoSeccion });
    setCantidad(1);
    setSaboresElegidos({});
  };

  const cerrarProducto = () => setProductoSeleccionado(null);

  const totalSaboresElegidos = Object.values(saboresElegidos).reduce((a, b) => a + b, 0);

  const cambiarSabor = (sabor, delta) => {
    const cantidadElegir = productoSeleccionado?.producto?.cantidadElegir || 0;
    setSaboresElegidos((prev) => {
      const actual = prev[sabor] || 0;
      const nuevoValor = actual + delta;
      if (nuevoValor < 0) return prev;
      if (delta > 0 && totalSaboresElegidos >= cantidadElegir) return prev;
      return { ...prev, [sabor]: nuevoValor };
    });
  };

  const puedeAgregar = () => {
    if (!productoSeleccionado) return false;
    if (productoSeleccionado.tipo === "combo") {
      return totalSaboresElegidos === productoSeleccionado.producto.cantidadElegir;
    }
    return true;
  };

  const confirmarAgregar = () => {
    if (!puedeAgregar()) return;
    setCarrito((prev) => {
      const idx = prev.findIndex((item) => item.producto.id === productoSeleccionado.producto.id);
      if (idx !== -1) {
        const copia = [...prev];
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + cantidad };
        return copia;
      }
      return [...prev, { producto: productoSeleccionado.producto, cantidad }];
    });
    cerrarProducto();
  };

  // ===== Carrito =====
  const sumarItemCarrito = (index) => {
    setCarrito((prev) => prev.map((item, i) => i === index ? { ...item, cantidad: item.cantidad + 1 } : item));
  };

  const eliminarItemCarrito = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Confirmar pedido: crea el pedido en el backend y abre el seguimiento =====
  const confirmarPedido = async () => {
    if (!sesion) {
      setCarritoAbierto(false);
      setLoginAbierto(true);
      return;
    }
    if (carrito.length === 0) return;

    setErrorPedido('');
    try {
      const { orderId } = await crearPedido(carrito, null);
      setCarrito([]);
      setCarritoAbierto(false);
      setPedidoEnCursoId(orderId);
      setTrackingVisible(true);
    } catch (err) {
      setErrorPedido(err.message);
    }
  };

  // ===== Auth: sesión =====
  const handleSesionIniciada = (usuario) => {
    setSesion(usuario);
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    setSesion(null);
  };

  // ===== Página de seguimiento (pantalla completa) =====
  if (trackingVisible && pedidoEnCursoId) {
    return (
      <OrderTrackingPage
        orderId={pedidoEnCursoId}
        onVolver={() => setTrackingVisible(false)}
        onEntregado={() => {
          setPedidoEnCursoId(null);
          setTrackingVisible(false);
        }}
      />
    );
  }

  return (
    <div style={{ paddingBottom: '50px' }}>

      <Header
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onIrACategoria={irACategoria}
        onAbrirMenu={() => setMenuAbierto(true)}
        scrollRef={scrollRef}
        sesion={sesion}
        onAbrirLogin={() => setLoginAbierto(true)}
        onCerrarSesion={handleCerrarSesion}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        totalCarrito={subtotal}
        pedidoActivo={pedidoEnCursoId}
        onVerPedido={() => setTrackingVisible(true)}
      />

      <CategoriasPanel
        categorias={categorias}
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        onIrACategoria={irACategoria}
      />

      <BannerCarousel
        banners={banners}
        currentSlide={currentSlide}
        onPrev={prevSlide}
        onNext={nextSlide}
      />

      <ProductSections
        secciones={secciones}
        onAbrirProducto={abrirProducto}
      />

      <ProductModal
        productoSeleccionado={productoSeleccionado}
        cantidad={cantidad}
        setCantidad={setCantidad}
        saboresElegidos={saboresElegidos}
        totalSaboresElegidos={totalSaboresElegidos}
        onCambiarSabor={cambiarSabor}
        puedeAgregar={puedeAgregar}
        onConfirmarAgregar={confirmarAgregar}
        onCerrar={cerrarProducto}
      />

      <CartPanel
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
        items={carrito}
        totalProductos={totalProductos}
        descuentos={descuentos}
        subtotal={subtotal}
        onSumar={sumarItemCarrito}
        onEliminar={eliminarItemCarrito}
        onConfirmarPedido={confirmarPedido}
        tiempoEntrega="75 min"
      />

      {errorPedido && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#2a0000', border: '1px solid #550000', color: '#ff6b6b',
          padding: '12px 20px', borderRadius: '8px', zIndex: 700,
        }}>
          {errorPedido}
        </div>
      )}

      {/* ===== Popup de autenticación (reemplaza al popup externo) ===== */}
      <AuthPopup
        abierto={loginAbierto}
        onCerrar={() => setLoginAbierto(false)}
        onSesionIniciada={handleSesionIniciada}
      />

      {/* ===== Botón flotante de seguimiento (siempre visible cuando hay pedido activo) ===== */}
      {pedidoEnCursoId && !trackingVisible && (
        <button
          onClick={() => setTrackingVisible(true)}
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#E52127', color: '#fff',
            border: '3px solid rgba(255,255,255,0.3)',
            borderRadius: '50px',
            padding: '16px 28px', fontSize: '1rem', fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(229,33,39,0.6)',
            animation: 'pulse-order 2s ease-in-out infinite',
          }}
        >
          <Bike size={20} strokeWidth={2} />
          Ver mi pedido en curso
        </button>
      )}

    </div>
  );
}

export default App;
