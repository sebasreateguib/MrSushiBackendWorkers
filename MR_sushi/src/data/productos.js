// ===== Lista completa de categorías (debe ir en el MISMO orden que "secciones") =====
export const categorias = [
  "Promociones", "Promos de la Semana", "Boxes", "Poke", "Makis",
  "Entrada Frías", "Entradas Calientes", "Temakis", "Alitas",
  "Los favoritos de neki", "Meshi", "Sandwich Sushi", "Los Fusionados",
  "Bocaditos (Fusionados)", "Sopas (Fusionados)", "Banquetes",
  "Salsa", "Bebidas", "Merch"
];

// ===== Datos de productos por sección =====
// tipo: "combo" -> al abrir el modal pide elegir sabores (como en la web original)
// tipo: "individual" -> al abrir el modal solo muestra imagen + descripción + contador
export const secciones = [
    {
      id: "promociones",
      titulo: "Promociones",
      tipo: "combo",
      productos: [
        {
          id: 1, titulo: "25 makis + 06 alitas + 02 gaseosas",
          descripcion: "Disfruta de 25 makis + 06 alitas + 02 gaseosas a elección (300 ml)",
          precio: "62.90", precioNormal: "69.90", descuento: "-10%",
          cantidadElegir: 2,
          tituloSeleccion: "Escoge 2 sabores de tus maki:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki", "Inka Maki", "Kani Maki", "Philadelphia Maki"]
        },
        {
          id: 2, titulo: "1 Poke Bowl (a elección) + 1 bebida de 300 ml",
          descripcion: "Disfruta de nuestro Poke bowl (a elección) + bebida de 300 ml",
          precio: "25.00", precioNormal: "33.00", descuento: "-24%",
          cantidadElegir: 1,
          tituloSeleccion: "Escoge 1 Poke Bowl:",
          sabores: ["Poke Salmón Clásico", "Poke Atún Spicy", "Poke Vegetariano"]
        },
        {
          id: 3, titulo: "Pack Llaveros Neki",
          descripcion: "Elige tu Neki favorito y regala un detalle lleno de cariño.",
          precio: "29.90", precioNormal: "49.90", descuento: "-40%",
          cantidadElegir: 1,
          tituloSeleccion: "Escoge tu llavero:",
          sabores: ["Neki Rojo", "Neki Negro", "Neki Blanco"]
        },
        {
          id: 4, titulo: "10 CORTES x S/19.90 😎🔥",
          descripcion: "Disfruta de 1 maki (10 cortes) a S/19.90. Del 15 al 30 de junio 2026.",
          precio: "19.90", precioNormal: "25.90", descuento: "-23%",
          cantidadElegir: 1,
          tituloSeleccion: "Escoge 1 sabor de tu maki:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki"]
        },
        {
          id: 5, titulo: "Box familiar + 12 alitas + 03 gaseosas",
          descripcion: "50 cortes (5 sabores) + 12 alitas (2 sabores) + 03 gaseosas 300ml",
          precio: "89.00", precioNormal: "128.00", descuento: "-30%",
          cantidadElegir: 5,
          tituloSeleccion: "Escoge 5 sabores de tus maki:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki", "Inka Maki", "Kani Maki", "Philadelphia Maki"]
        },
        {
          id: 6, titulo: "Combo Neki Giri",
          descripcion: "Onigiri de mr.sushi + gaseosa (300ml)",
          precio: "11.90", precioNormal: "21.50", descuento: "-45%",
          cantidadElegir: 1,
          tituloSeleccion: "Escoge tu onigiri:",
          sabores: ["Neki Giri Pollo", "Neki Giri Atún"]
        },
      ]
    },
    {
      id: "promos-semana",
      titulo: "Promos de la Semana",
      tipo: "individual",
      productos: [
        { id: 7, titulo: "Llavero Neki", descripcion: "Llavero peluche de Neki, tu gato sushi favorito 🐱🍣", precio: "15.90", precioNormal: "29.90", descuento: "-47%" },
        { id: 8, titulo: "Maki box + Ebi Furai (5 unidades)", descripcion: "Maki Box (20 cortes) + 5 unidades de ebi furai crujientes.", precio: "39.90", precioNormal: "47.50", descuento: "-16%" },
        { id: 9, titulo: "Neki Giri", descripcion: "Onigiri de mr.sushi, arroz de sushi en forma triangular, relleno y envuelto en alga crocante.", precio: "9.90", precioNormal: "16.50", descuento: "-40%" },
      ]
    },
    {
      id: "boxes",
      titulo: "Boxes",
      tipo: "combo",
      productos: [
        {
          id: 10, titulo: "Box Mixto x 30 cortes",
          descripcion: "30 cortes variados a elección entre nuestras mejores combinaciones.",
          precio: "45.90", precioNormal: "55.90", descuento: "-18%",
          cantidadElegir: 3,
          tituloSeleccion: "Escoge 3 sabores:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki"]
        },
        {
          id: 11, titulo: "Box Premium x 40 cortes",
          descripcion: "40 cortes premium + salsa especial de la casa.",
          precio: "69.90", precioNormal: "85.90", descuento: "-19%",
          cantidadElegir: 4,
          tituloSeleccion: "Escoge 4 sabores:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki", "Inka Maki"]
        },
        {
          id: 12, titulo: "Box Familiar x 60 cortes",
          descripcion: "60 cortes ideales para compartir en familia.",
          precio: "99.90", precioNormal: "120.00", descuento: "-17%",
          cantidadElegir: 6,
          tituloSeleccion: "Escoge 6 sabores:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki", "Inka Maki", "Kani Maki"]
        },
      ]
    },
    {
      id: "poke",
      titulo: "Poke",
      tipo: "combo",
      productos: [
        {
          id: 13, titulo: "Poke Salmón Clásico",
          descripcion: "Base de arroz, salmón fresco, palta, pepino y sésamo.",
          precio: "28.90", precioNormal: "34.90", descuento: "-17%",
          cantidadElegir: 2,
          tituloSeleccion: "Escoge 2 toppings:",
          sabores: ["Choclito Americano", "Chifle", "Mango", "Kiuri Encurtido"]
        },
        {
          id: 14, titulo: "Poke Atún Spicy",
          descripcion: "Atún picante, mango, edamame y cebolla crispy.",
          precio: "29.90", precioNormal: "36.90", descuento: "-19%",
          cantidadElegir: 2,
          tituloSeleccion: "Escoge 2 toppings:",
          sabores: ["Choclito Americano", "Chifle", "Mango", "Kiuri Encurtido"]
        },
        {
          id: 15, titulo: "Poke Vegetariano",
          descripcion: "Mix de vegetales frescos, tofu y aderezo de la casa.",
          precio: "24.90", precioNormal: "29.90", descuento: "-17%",
          cantidadElegir: 2,
          tituloSeleccion: "Escoge 2 toppings:",
          sabores: ["Choclito Americano", "Chifle", "Mango", "Kiuri Encurtido"]
        },
      ]
    },
    {
      id: "makis",
      titulo: "Makis",
      tipo: "individual",
      productos: [
        { id: 16, titulo: "Maki Acevichado", descripcion: "10 cortes bañados en salsa acevichada de la casa.", precio: "22.90", precioNormal: "27.90", descuento: "-18%" },
        { id: 17, titulo: "Maki Furai", descripcion: "10 cortes apanados y crocantes con toque oriental.", precio: "21.90", precioNormal: "26.90", descuento: "-19%" },
        { id: 18, titulo: "Maki California", descripcion: "10 cortes clásicos con kanikama, palta y pepino.", precio: "20.90", precioNormal: "24.90", descuento: "-16%" },
      ]
    },
    {
      id: "entradas-frias",
      titulo: "Entrada Frías",
      tipo: "individual",
      productos: [
        { id: 19, titulo: "Tiradito de Salmón", descripcion: "Finas láminas de salmón fresco con salsa de ají amarillo.", precio: "26.90", precioNormal: "32.90", descuento: "-18%" },
        { id: 20, titulo: "Sashimi Mixto", descripcion: "Selección de pescados frescos cortados al estilo japonés.", precio: "32.90", precioNormal: "39.90", descuento: "-18%" },
        { id: 21, titulo: "Ceviche Neki", descripcion: "Ceviche clásico con un toque especial de la casa.", precio: "27.90", precioNormal: "33.90", descuento: "-18%" },
      ]
    },
    {
      id: "entradas-calientes",
      titulo: "Entradas Calientes",
      tipo: "individual",
      productos: [
        { id: 22, titulo: "Gyozas de Pollo", descripcion: "6 unidades de gyozas rellenas y selladas a la plancha.", precio: "18.90", precioNormal: "22.90", descuento: "-17%" },
        { id: 23, titulo: "Wantanes Crocantes", descripcion: "8 unidades de wantanes fritos con salsa agridulce.", precio: "16.90", precioNormal: "20.90", descuento: "-19%" },
        { id: 24, titulo: "Langostinos Apanados", descripcion: "6 langostinos crocantes con salsa especial.", precio: "29.90", precioNormal: "35.90", descuento: "-17%" },
      ]
    },
    {
      id: "temakis",
      titulo: "Temakis",
      tipo: "individual",
      productos: [
        { id: 26, titulo: "Temaki Furai", descripcion: "Cono crocante relleno con langostino apanado.", precio: "18.90", precioNormal: "22.90", descuento: "-17%" },
        { id: 27, titulo: "Temaki Acevichado", descripcion: "Cono bañado en salsa acevichada de la casa.", precio: "17.90", precioNormal: "21.90", descuento: "-18%" },
      ]
    },
    {
      id: "alitas",
      titulo: "Alitas",
      tipo: "individual",
      productos: [
        { id: 28, titulo: "Alitas BBQ x 6", descripcion: "6 alitas glaseadas en salsa BBQ de la casa.", precio: "19.90", precioNormal: "24.90", descuento: "-20%" },
        { id: 29, titulo: "Alitas Picantes x 6", descripcion: "6 alitas con salsa picante estilo oriental.", precio: "19.90", precioNormal: "24.90", descuento: "-20%" },
        { id: 30, titulo: "Alitas Teriyaki x 6", descripcion: "6 alitas bañadas en salsa teriyaki casera.", precio: "19.90", precioNormal: "24.90", descuento: "-20%" },
      ]
    },
    {
      id: "favoritos-neki",
      titulo: "Los favoritos de neki",
      tipo: "individual",
      productos: [
        { id: 31, titulo: "Combo Neki Mix", descripcion: "Selección de los productos más pedidos por nuestros clientes.", precio: "49.90", precioNormal: "59.90", descuento: "-17%" },
        { id: 32, titulo: "Neki Especial Roll", descripcion: "Maki especial creado por nuestros chefs.", precio: "24.90", precioNormal: "29.90", descuento: "-17%" },
        { id: 33, titulo: "Neki Box Sorpresa", descripcion: "Box con una selección sorpresa de productos favoritos.", precio: "39.90", precioNormal: "47.90", descuento: "-17%" },
      ]
    },
    {
      id: "meshi",
      titulo: "Meshi",
      tipo: "individual",
      productos: [
        { id: 34, titulo: "Gohan Especial", descripcion: "Arroz japonés salteado con vegetales y proteína a elección.", precio: "26.90", precioNormal: "31.90", descuento: "-16%" },
        { id: 35, titulo: "Yakimeshi Pollo", descripcion: "Arroz frito al estilo oriental con pollo y vegetales.", precio: "24.90", precioNormal: "29.90", descuento: "-17%" },
        { id: 36, titulo: "Yakimeshi Mariscos", descripcion: "Arroz frito con mezcla de mariscos frescos.", precio: "29.90", precioNormal: "35.90", descuento: "-17%" },
      ]
    },
    {
      id: "sandwich-sushi",
      titulo: "Sandwich Sushi",
      tipo: "individual",
      productos: [
        { id: 37, titulo: "Sandwich Sushi Pollo", descripcion: "Capas de arroz y alga rellenas de pollo crocante.", precio: "16.90", precioNormal: "19.90", descuento: "-15%" },
        { id: 38, titulo: "Sandwich Sushi Salmón", descripcion: "Capas de arroz y alga rellenas de salmón fresco.", precio: "18.90", precioNormal: "22.90", descuento: "-17%" },
        { id: 39, titulo: "Sandwich Sushi Furai", descripcion: "Capas de arroz y alga con relleno crocante apanado.", precio: "17.90", precioNormal: "21.90", descuento: "-18%" },
      ]
    },
    {
      id: "los-fusionados",
      titulo: "Los Fusionados",
      tipo: "individual",
      productos: [
        { id: 40, titulo: "Fusión Criolla Roll", descripcion: "Maki fusión con toques de la cocina criolla peruana.", precio: "25.90", precioNormal: "30.90", descuento: "-16%" },
        { id: 41, titulo: "Fusión Andina Roll", descripcion: "Maki con ingredientes andinos y toque oriental.", precio: "26.90", precioNormal: "31.90", descuento: "-16%" },
        { id: 42, titulo: "Fusión Tropical Roll", descripcion: "Maki con frutas tropicales y pescado fresco.", precio: "24.90", precioNormal: "29.90", descuento: "-17%" },
      ]
    },
    {
      id: "bocaditos-fusionados",
      titulo: "Bocaditos (Fusionados)",
      tipo: "individual",
      productos: [
        { id: 43, titulo: "Bocaditos Mixtos x 12", descripcion: "Selección de 12 bocaditos fusión para compartir.", precio: "22.90", precioNormal: "27.90", descuento: "-18%" },
        { id: 44, titulo: "Bocaditos Picantes x 12", descripcion: "12 bocaditos fusión con un toque picante.", precio: "23.90", precioNormal: "28.90", descuento: "-17%" },
        { id: 45, titulo: "Bocaditos Dulces x 12", descripcion: "12 bocaditos fusión con notas dulces y saladas.", precio: "23.90", precioNormal: "28.90", descuento: "-17%" },
      ]
    },
    {
      id: "sopas-fusionadas",
      titulo: "Sopas (Fusionados)",
      tipo: "individual",
      productos: [
        { id: 46, titulo: "Sopa Wantán", descripcion: "Caldo casero con wantanes y vegetales frescos.", precio: "17.90", precioNormal: "21.90", descuento: "-18%" },
        { id: 47, titulo: "Sopa Miso", descripcion: "Sopa tradicional japonesa con tofu y algas.", precio: "14.90", precioNormal: "17.90", descuento: "-17%" },
        { id: 48, titulo: "Sopa Criolla Fusión", descripcion: "Sopa con ingredientes criollos y toque oriental.", precio: "18.90", precioNormal: "22.90", descuento: "-17%" },
      ]
    },
    {
      id: "banquetes",
      titulo: "Banquetes",
      tipo: "combo",
      productos: [
        {
          id: 49, titulo: "Banquete x 10 personas",
          descripcion: "Selección variada de productos para 10 personas.",
          precio: "189.90", precioNormal: "229.90", descuento: "-17%",
          cantidadElegir: 4,
          tituloSeleccion: "Escoge 4 sabores:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki"]
        },
        {
          id: 50, titulo: "Banquete x 20 personas",
          descripcion: "Selección variada de productos para 20 personas.",
          precio: "349.90", precioNormal: "419.90", descuento: "-17%",
          cantidadElegir: 6,
          tituloSeleccion: "Escoge 6 sabores:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki", "Inka Maki"]
        },
        {
          id: 51, titulo: "Banquete Premium",
          descripcion: "Selección premium con los mejores productos de la carta.",
          precio: "259.90", precioNormal: "309.90", descuento: "-16%",
          cantidadElegir: 5,
          tituloSeleccion: "Escoge 5 sabores:",
          sabores: ["Acevichado Maki", "Furai Maki", "Baby Maki", "Hiroshima Maki", "California Maki", "Inka Maki"]
        },
      ]
    },
    {
      id: "salsa",
      titulo: "Salsa",
      tipo: "individual",
      productos: [
        { id: 52, titulo: "Salsa Acevichada 250ml", descripcion: "Nuestra salsa acevichada original para llevar a casa.", precio: "9.90", precioNormal: "12.90", descuento: "-23%" },
        { id: 53, titulo: "Salsa Anguila 250ml", descripcion: "Salsa de anguila dulce, ideal para acompañar tus makis.", precio: "10.90", precioNormal: "13.90", descuento: "-22%" },
        { id: 54, titulo: "Salsa Picante 250ml", descripcion: "Salsa picante de la casa para los amantes del picor.", precio: "9.90", precioNormal: "12.90", descuento: "-23%" },
      ]
    },
    {
      id: "bebidas",
      titulo: "Bebidas",
      tipo: "individual",
      productos: [
        { id: 55, titulo: "Gaseosa 500ml", descripcion: "Bebida gasificada a elección de 500ml.", precio: "5.90", precioNormal: "7.90", descuento: "-25%" },
        { id: 56, titulo: "Té Helado 500ml", descripcion: "Té helado refrescante en presentación de 500ml.", precio: "6.90", precioNormal: "8.90", descuento: "-22%" },
        { id: 57, titulo: "Agua Mineral 500ml", descripcion: "Agua mineral sin gas, presentación de 500ml.", precio: "4.90", precioNormal: "6.90", descuento: "-29%" },
      ]
    },
    {
      id: "merch",
      titulo: "Merch",
      tipo: "individual",
      productos: [
        { id: 58, titulo: "Polo Neki Edición Especial", descripcion: "Polo oficial de Mr. Sushi con diseño exclusivo de Neki.", precio: "39.90", precioNormal: "49.90", descuento: "-20%" },
        { id: 59, titulo: "Gorra Mr. Sushi", descripcion: "Gorra ajustable con el logo bordado de Mr. Sushi.", precio: "29.90", precioNormal: "39.90", descuento: "-25%" },
        { id: 60, titulo: "Peluche Neki", descripcion: "Peluche coleccionable de Neki, el gato sushi.", precio: "34.90", precioNormal: "44.90", descuento: "-22%" },
      ]
    },
  ];
