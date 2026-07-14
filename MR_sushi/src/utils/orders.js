import { apiFetch } from './api';

// Convierte el carrito de la app { producto, cantidad } al formato que espera el backend
const mapearCarritoAItems = (carrito) =>
  carrito.map(({ producto, cantidad }) => ({
    productId: producto.id,
    nombre: producto.titulo,
    precio: parseFloat(producto.precio),
    cantidad,
  }));

export const crearPedido = async (carrito, direccion) => {
  const items = mapearCarritoAItems(carrito);
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({ items, direccion, canal: 'web' }),
  });
};

export const obtenerPedido = async (orderId) => apiFetch(`/orders/${orderId}`);

export const listarMisPedidos = async () => apiFetch('/orders');
