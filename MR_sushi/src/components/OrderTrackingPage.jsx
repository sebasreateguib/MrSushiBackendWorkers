import { useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  Bike,
  ChefHat,
  CircleCheck,
  ClipboardList,
  Home,
  MapPin,
  Package,
  Store,
  Check,
} from 'lucide-react';
import logo from '../assets/logo.png';
import { obtenerPedido } from '../utils/orders';

const RESTAURANT = [-12.1100, -77.0282];

const PASOS = [
  { key: 'PEDIDO_RECIBIDO', label: 'Recibido', Icon: ClipboardList },
  { key: 'EN_COCINA', label: 'Preparando', Icon: ChefHat },
  { key: 'EN_EMPAQUE', label: 'Empacando', Icon: Package },
  { key: 'EN_CAMINO', label: 'En camino', Icon: Bike },
  { key: 'ENTREGADO', label: 'Entregado', Icon: CircleCheck },
];

const normalizeStatus = (s) => (s === 'EN_EMPACADO' ? 'EN_EMPAQUE' : s);

const STATUS_LABEL = {
  PEDIDO_RECIBIDO: 'Pedido recibido',
  EN_COCINA: 'Preparando tu pedido',
  EN_EMPAQUE: 'Empacando tu pedido',
  EN_EMPACADO: 'Empacando tu pedido',
  EN_CAMINO: 'En camino',
  ENTREGADO: '¡Tu pedido llegó!',
};

const iconToHtml = (Icon, { size = 22, color = '#fff', strokeWidth = 2 } = {}) =>
  renderToStaticMarkup(<Icon size={size} color={color} strokeWidth={strokeWidth} />);

const markerHtml = (Icon, bg, border, iconColor = '#fff') =>
  `<div style="width:48px;height:48px;border-radius:50%;background:${bg};border:3px solid ${border};display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 8px rgba(229,33,39,0.2),0 4px 16px rgba(0,0,0,0.5);">${iconToHtml(Icon, { size: 22, color: iconColor })}</div>`;

function MapaTracking({ status }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: RESTAURANT,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.marker(RESTAURANT, {
      icon: L.divIcon({
        html: markerHtml(Store, '#E52127', '#fff'),
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        className: '',
      }),
    })
      .addTo(map)
      .bindPopup('<b>Mr Sushi</b><br>Tu restaurante');

    if (status === 'EN_CAMINO') {
      const riderPos = [RESTAURANT[0] + 0.009, RESTAURANT[1] - 0.013];

      L.polyline([RESTAURANT, riderPos], {
        color: '#E52127',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 8',
      }).addTo(map);

      L.marker(riderPos, {
        icon: L.divIcon({
          html: markerHtml(Bike, '#fff', '#E52127', '#E52127'),
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          className: '',
        }),
      })
        .addTo(map)
        .bindPopup('Tu repartidor');

      map.fitBounds([RESTAURANT, riderPos], { padding: [60, 60] });
    } else if (status === 'ENTREGADO') {
      const clientePos = [RESTAURANT[0] + 0.004, RESTAURANT[1] - 0.006];

      L.marker(clientePos, {
        icon: L.divIcon({
          html: markerHtml(Home, '#16a34a', '#fff'),
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          className: '',
        }),
      }).addTo(map);

      L.polyline([RESTAURANT, clientePos], {
        color: '#16a34a',
        weight: 4,
        opacity: 0.75,
      }).addTo(map);

      map.fitBounds([RESTAURANT, clientePos], { padding: [60, 60] });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [status]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

function Timeline({ status }) {
  const currentIdx = PASOS.findIndex((p) => p.key === status);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0 }}>
      {PASOS.map((paso, i) => {
        const completado = i < currentIdx;
        const activo = i === currentIdx;
        const { Icon } = paso;

        return (
          <div key={paso.key} style={{ display: 'flex', alignItems: 'center', flex: i < PASOS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '64px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: completado ? '#E52127' : activo ? '#fff' : '#1a1a1a',
                border: activo ? '3px solid #E52127' : completado ? '3px solid #E52127' : '3px solid #2a2a2a',
                boxShadow: activo ? '0 0 0 6px rgba(229,33,39,0.2)' : 'none',
              }}>
                {completado ? (
                  <Check size={20} color="#fff" strokeWidth={2.5} />
                ) : (
                  <Icon
                    size={20}
                    color={activo ? '#E52127' : '#666'}
                    strokeWidth={2}
                  />
                )}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: activo ? 700 : 500,
                color: completado ? '#E52127' : activo ? '#fff' : '#555',
                textAlign: 'center',
              }}>
                {paso.label}
              </span>
            </div>

            {i < PASOS.length - 1 && (
              <div style={{
                flex: 1,
                height: '3px',
                marginBottom: '28px',
                background: completado ? '#E52127' : '#222',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LeyendaItem({ Icon, label, color = '#ccc' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color }}>
      <Icon size={14} strokeWidth={2} />
      <span>{label}</span>
    </div>
  );
}

function OrderTrackingPage({ orderId, onVolver, onEntregado }) {
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    let activo = true;
    let intervalo;

    const consultar = async () => {
      try {
        const data = await obtenerPedido(orderId);
        if (!activo) return;
        setPedido(data);
        if (data.status === 'ENTREGADO') {
          clearInterval(intervalo);
          setTimeout(() => onEntregado?.(), 8000);
        }
      } catch (err) {
        if (activo) setError(err.message);
      }
    };

    consultar();
    intervalo = setInterval(consultar, 5000);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [orderId, onEntregado]);

  const status = normalizeStatus(pedido?.status ?? 'PEDIDO_RECIBIDO');
  const label = STATUS_LABEL[pedido?.status] ?? pedido?.status ?? 'Pedido recibido';
  const entregado = status === 'ENTREGADO';
  const enCamino = status === 'EN_CAMINO';

  const totalPedido = pedido?.items?.reduce(
    (acc, item) => acc + item.precio * item.cantidad, 0
  ) ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#111', borderBottom: '1px solid #222',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onVolver}
            style={{
              background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px',
              padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Volver al menú
          </button>
          <img src={logo} alt="Mr Sushi" style={{ height: '32px', objectFit: 'contain' }} />
        </div>

        <div style={{
          background: entregado ? 'rgba(22,163,74,0.15)' : 'rgba(229,33,39,0.12)',
          color: entregado ? '#4ade80' : '#E52127',
          border: `1px solid ${entregado ? 'rgba(22,163,74,0.3)' : 'rgba(229,33,39,0.25)'}`,
          borderRadius: '99px', padding: '6px 14px',
          fontSize: '12px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          {!entregado && (
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E52127', display: 'inline-block' }} />
          )}
          {label}
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <section style={{ height: 'min(50vh, 420px)', position: 'relative', background: '#111', flexShrink: 0 }}>
          {pedido ? (
            <MapaTracking status={status} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
              Cargando mapa…
            </div>
          )}

          {(enCamino || entregado) && (
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px',
              background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
              borderRadius: '12px', padding: '10px 14px',
              display: 'flex', flexDirection: 'column', gap: '8px',
              border: '1px solid rgba(255,255,255,0.08)', zIndex: 1000,
            }}>
              <LeyendaItem Icon={Store} label="Mr Sushi (restaurante)" />
              {enCamino && <LeyendaItem Icon={Bike} label="Tu repartidor" />}
              {entregado && <LeyendaItem Icon={Home} label="Dirección de entrega" color="#4ade80" />}
            </div>
          )}
        </section>

        <section style={{ flex: 1, padding: '24px 20px 40px', maxWidth: '900px', width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Seguimiento del pedido
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>
            {label}
          </h1>
          <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace', marginBottom: '28px' }}>
            #{pedido?.orderId?.slice(0, 8).toUpperCase() ?? orderId?.slice(0, 8).toUpperCase() ?? '···'}
          </p>

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>{error}</p>
          )}

          {!pedido && !error && (
            <p style={{ color: '#555', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>Cargando estado…</p>
          )}

          {pedido && (
            <>
              <div style={{
                background: '#111', borderRadius: '16px', padding: '24px',
                border: '1px solid #1a1a1a', marginBottom: '24px',
              }}>
                <Timeline status={status} />
              </div>

              {pedido.items && (
                <div style={{
                  background: '#111', borderRadius: '16px', padding: '20px',
                  border: '1px solid #1a1a1a',
                }}>
                  <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Tu pedido
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pedido.items.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 16px', background: '#0d0d0d', borderRadius: '10px',
                        border: '1px solid #1a1a1a',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '13px', fontWeight: 700, color: '#E52127',
                          }}>
                            {item.cantidad}×
                          </span>
                          <span style={{ fontSize: '14px', color: '#ddd' }}>{item.nombre}</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>
                          S/ {(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: '16px', padding: '14px 16px',
                    background: 'rgba(229,33,39,0.1)', borderRadius: '10px',
                    border: '1px solid rgba(229,33,39,0.2)',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#999' }}>Total pagado</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#E52127' }}>
                      S/ {pedido.total?.toFixed(2) ?? totalPedido.toFixed(2)}
                    </span>
                  </div>

                  {pedido.direccion && (
                    <div style={{
                      marginTop: '12px', padding: '12px 16px',
                      background: '#0d0d0d', borderRadius: '10px',
                      border: '1px solid #1a1a1a',
                      display: 'flex', gap: '10px', alignItems: 'flex-start',
                    }}>
                      <MapPin size={16} color="#888" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{pedido.direccion}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default OrderTrackingPage;
