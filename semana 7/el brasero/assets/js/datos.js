/* ==========================================================================
   El Brasero — datos de demostración (capa de presentación)
   --------------------------------------------------------------------------
   En la solución definitiva estos datos provienen de la capa de negocio
   mediante Web Services (REST/SOAP) sobre la base de datos Oracle.
   Aquí se mantienen en memoria para poder validar el front end.
   ========================================================================== */

const BRASERO = {
  local: {
    nombre: "Pollos Asados El Brasero",
    lema: "Pollos a las brasas y acompañamientos",
    direccion: "Av. Los Pajaritos 2145, Maipú",
    telefono: "+56 2 2745 1180",
    correo: "pedidos@elbrasero.cl",
    rut: "76.845.220-9",
    radioDespacho: 3,
    horario: "Martes a domingo, 11:30 a 22:00",
    comunasReparto: ["Maipú", "Cerrillos", "Estación Central", "Pudahuel"]
  },

  /* --- Catálogo (RF 7: disponibilidad administrable) ------------------- */
  productos: [
    { codigo: "PA-001", nombre: "Pollo entero a las brasas", categoria: "Pollos", precio: 9990, unidad: "1 pollo (aprox. 1,4 kg)", descripcion: "Pollo entero al asador, adobado 12 horas y dorado sobre carbón de espino.", disponible: true, stock: 38, icono: "pollo" },
    { codigo: "PA-002", nombre: "Medio pollo a las brasas", categoria: "Pollos", precio: 5490, unidad: "1/2 pollo", descripcion: "Media presa al asador, con jugos de cocción y sal de mar.", disponible: true, stock: 52, icono: "pollo" },
    { codigo: "PA-003", nombre: "Cuarto de pollo", categoria: "Pollos", precio: 3290, unidad: "1/4 pollo", descripcion: "Cuarto de pierna o pechuga, a elección según disponibilidad.", disponible: true, stock: 64, icono: "pollo" },
    { codigo: "PA-004", nombre: "Pollo arvejado familiar", categoria: "Pollos", precio: 11490, unidad: "Fuente 4 personas", descripcion: "Pollo a la brasa desmenuzado en salsa de arvejas y zanahoria.", disponible: false, stock: 0, icono: "pollo" },

    { codigo: "AC-001", nombre: "Papas fritas grandes", categoria: "Acompañamientos", precio: 3490, unidad: "500 g", descripcion: "Corte bastón, fritas al momento y saladas a la salida.", disponible: true, stock: 80, icono: "papas" },
    { codigo: "AC-002", nombre: "Papas doradas al horno", categoria: "Acompañamientos", precio: 2990, unidad: "450 g", descripcion: "Papas en gajos horneadas bajo el asador con el jugo del pollo.", disponible: true, stock: 45, icono: "papas" },
    { codigo: "AC-003", nombre: "Ensalada chilena", categoria: "Acompañamientos", precio: 2290, unidad: "350 g", descripcion: "Tomate, cebolla pluma, cilantro y aliño de la casa.", disponible: true, stock: 40, icono: "ensalada" },
    { codigo: "AC-004", nombre: "Ensalada surtida", categoria: "Acompañamientos", precio: 2690, unidad: "400 g", descripcion: "Lechuga, betarraga, zanahoria y choclo.", disponible: true, stock: 30, icono: "ensalada" },
    { codigo: "AC-005", nombre: "Arroz graneado", categoria: "Acompañamientos", precio: 2190, unidad: "400 g", descripcion: "Arroz graneado con un toque de mantequilla.", disponible: true, stock: 35, icono: "arroz" },
    { codigo: "AC-006", nombre: "Pan amasado (4 unidades)", categoria: "Acompañamientos", precio: 1890, unidad: "4 unidades", descripcion: "Pan amasado del día, horneado en casa.", disponible: true, stock: 60, icono: "pan" },

    { codigo: "CB-001", nombre: "Combo Brasero", categoria: "Combos", precio: 13990, unidad: "2 a 3 personas", descripcion: "Pollo entero + papas fritas grandes + ensalada chilena + 1,5 L de bebida.", disponible: true, stock: 25, icono: "combo" },
    { codigo: "CB-002", nombre: "Combo Familiar", categoria: "Combos", precio: 22490, unidad: "4 a 5 personas", descripcion: "Dos pollos enteros + papas fritas + dos ensaladas + 3 L de bebida.", disponible: true, stock: 14, icono: "combo" },
    { codigo: "CB-003", nombre: "Combo Individual", categoria: "Combos", precio: 6490, unidad: "1 persona", descripcion: "Cuarto de pollo + papas fritas medianas + bebida en lata.", disponible: true, stock: 48, icono: "combo" },

    { codigo: "SA-001", nombre: "Pebre de la casa", categoria: "Salsas", precio: 990, unidad: "150 g", descripcion: "Cilantro, cebolla, ajo y ají cacho de cabra.", disponible: true, stock: 70, icono: "salsa" },
    { codigo: "SA-002", nombre: "Ají verde molido", categoria: "Salsas", precio: 990, unidad: "120 g", descripcion: "Ají verde molido en piedra, picante medio.", disponible: true, stock: 55, icono: "salsa" },
    { codigo: "SA-003", nombre: "Mayonesa casera", categoria: "Salsas", precio: 890, unidad: "120 g", descripcion: "Mayonesa preparada en el local, sin conservantes.", disponible: false, stock: 0, icono: "salsa" },

    { codigo: "BE-001", nombre: "Bebida 1,5 L", categoria: "Bebidas", precio: 2190, unidad: "1,5 litros", descripcion: "Línea Pepsi o Andina, según disponibilidad.", disponible: true, stock: 90, icono: "bebida" },
    { codigo: "BE-002", nombre: "Bebida en lata", categoria: "Bebidas", precio: 1290, unidad: "350 ml", descripcion: "Lata individual, línea completa.", disponible: true, stock: 120, icono: "bebida" },
    { codigo: "BE-003", nombre: "Jugo natural 1 L", categoria: "Bebidas", precio: 2490, unidad: "1 litro", descripcion: "Jugo de frambuesa o durazno preparado en el día.", disponible: true, stock: 22, icono: "bebida" }
  ],

  /* --- Clientes registrados (RF 5 y 6) -------------------------------- */
  clientes: [
    { run: "16.482.905-3", nombre: "Camila Andrea Reyes Fuentes", direccion: "Pasaje El Molino 431", comuna: "Maipú", provincia: "Santiago", region: "Metropolitana de Santiago", nacimiento: "1987-04-12", sexo: "Femenino", correo: "camila.reyes@correo.cl", telefono: "+56 9 8742 1190", correoValidado: true, alta: "2026-03-14" },
    { run: "19.771.043-K", nombre: "Matías Ignacio Soto Bravo", direccion: "Av. Tres Poniente 5120, depto. 42", comuna: "Maipú", provincia: "Santiago", region: "Metropolitana de Santiago", nacimiento: "1998-09-30", sexo: "Masculino", correo: "matias.soto@correo.cl", telefono: "+56 9 6611 2087", correoValidado: true, alta: "2026-05-02" },
    { run: "12.098.554-1", nombre: "Rosa Elena Cárdenas Muñoz", direccion: "Camino Melipilla 8790", comuna: "Cerrillos", provincia: "Santiago", region: "Metropolitana de Santiago", nacimiento: "1974-01-22", sexo: "Femenino", correo: "rosa.cardenas@correo.cl", telefono: "+56 9 9012 4455", correoValidado: true, alta: "2026-06-18" },
    { run: "21.334.882-7", nombre: "Diego Alonso Vera Pinto", direccion: "Los Cerezos 118", comuna: "Estación Central", provincia: "Santiago", region: "Metropolitana de Santiago", nacimiento: "2003-11-05", sexo: "Masculino", correo: "diego.vera@correo.cl", telefono: "+56 9 5578 3321", correoValidado: false, alta: "2026-09-19" }
  ],

  /* --- Usuarios internos y perfiles (RF 10 y 12) ---------------------- */
  usuarios: [
    { usuario: "jlagos", nombre: "Jorge Lagos Bustos", perfil: "Administrador", correo: "jlagos@elbrasero.cl", estado: "Activo", ultimoAcceso: "2026-09-21 11:04" },
    { usuario: "pmeneses", nombre: "Paula Meneses Ríos", perfil: "Cajero virtual", correo: "pmeneses@elbrasero.cl", estado: "Activo", ultimoAcceso: "2026-09-21 12:38" },
    { usuario: "rquinteros", nombre: "Rodrigo Quinteros Alarcón", perfil: "Encargado de despacho", correo: "rquinteros@elbrasero.cl", estado: "Activo", ultimoAcceso: "2026-09-21 12:51" },
    { usuario: "mvaldes", nombre: "Marcela Valdés Soto", perfil: "Dueño", correo: "mvaldes@elbrasero.cl", estado: "Activo", ultimoAcceso: "2026-09-20 21:15" },
    { usuario: "cflores", nombre: "Cristián Flores Peña", perfil: "Cajero virtual", correo: "cflores@elbrasero.cl", estado: "Bloqueado", ultimoAcceso: "2026-08-30 19:42" }
  ],

  perfiles: [
    { nombre: "Cliente", descripcion: "Arma pedidos, paga, revisa boletas y solicita anulaciones.", pantallas: ["Carta", "Mi pedido", "Mi cuenta"] },
    { nombre: "Cajero virtual", descripcion: "Confirma el pago, registra la venta y emite la boleta digital.", pantallas: ["Caja virtual"] },
    { nombre: "Encargado de despacho", descripcion: "Obtiene e imprime las órdenes de despacho para cocina.", pantallas: ["Despacho"] },
    { nombre: "Administrador", descripcion: "Mantenedores de productos, usuarios y clientes; anulaciones.", pantallas: ["Productos", "Clientes y usuarios", "Reportes"] },
    { nombre: "Dueño", descripcion: "Consulta reportes de venta por período y disponibilidad del menú.", pantallas: ["Reportes", "Productos"] }
  ],

  /* --- Pedidos (RF 1, 2, 3, 4, 13) ------------------------------------ */
  pedidos: [
    {
      folio: "P-2609", cliente: "Camila Andrea Reyes Fuentes", run: "16.482.905-3",
      fecha: "2026-09-21 12:18", comuna: "Maipú", direccion: "Pasaje El Molino 431",
      distancia: 1.4, medioPago: "Servipag", estado: "Pagado", boleta: null,
      lineas: [
        { codigo: "CB-001", nombre: "Combo Brasero", cantidad: 1, precio: 13990 },
        { codigo: "SA-001", nombre: "Pebre de la casa", cantidad: 2, precio: 990 }
      ]
    },
    {
      folio: "P-2610", cliente: "Matías Ignacio Soto Bravo", run: "19.771.043-K",
      fecha: "2026-09-21 12:35", comuna: "Maipú", direccion: "Av. Tres Poniente 5120, depto. 42",
      distancia: 2.2, medioPago: "Depósito bancario", estado: "Pagado", boleta: null,
      lineas: [
        { codigo: "PA-002", nombre: "Medio pollo a las brasas", cantidad: 2, precio: 5490 },
        { codigo: "AC-001", nombre: "Papas fritas grandes", cantidad: 1, precio: 3490 },
        { codigo: "BE-001", nombre: "Bebida 1,5 L", cantidad: 1, precio: 2190 }
      ]
    },
    {
      folio: "P-2611", cliente: "Rosa Elena Cárdenas Muñoz", run: "12.098.554-1",
      fecha: "2026-09-21 12:47", comuna: "Cerrillos", direccion: "Camino Melipilla 8790",
      distancia: 2.8, medioPago: "Servipag", estado: "En preparación", boleta: "B-8841",
      lineas: [
        { codigo: "CB-002", nombre: "Combo Familiar", cantidad: 1, precio: 22490 },
        { codigo: "AC-006", nombre: "Pan amasado (4 unidades)", cantidad: 2, precio: 1890 }
      ]
    },
    {
      folio: "P-2612", cliente: "Camila Andrea Reyes Fuentes", run: "16.482.905-3",
      fecha: "2026-09-21 13:02", comuna: "Maipú", direccion: "Pasaje El Molino 431",
      distancia: 1.4, medioPago: "Servipag", estado: "En ruta", boleta: "B-8842",
      chofer: "Luis Paredes", lineas: [
        { codigo: "PA-003", nombre: "Cuarto de pollo", cantidad: 4, precio: 3290 },
        { codigo: "AC-003", nombre: "Ensalada chilena", cantidad: 2, precio: 2290 }
      ]
    },
    {
      folio: "P-2605", cliente: "Diego Alonso Vera Pinto", run: "21.334.882-7",
      fecha: "2026-09-20 20:41", comuna: "Estación Central", direccion: "Los Cerezos 118",
      distancia: 2.9, medioPago: "Depósito bancario", estado: "Entregado", boleta: "B-8836",
      chofer: "Luis Paredes", lineas: [
        { codigo: "PA-001", nombre: "Pollo entero a las brasas", cantidad: 1, precio: 9990 },
        { codigo: "AC-002", nombre: "Papas doradas al horno", cantidad: 1, precio: 2990 }
      ]
    },
    {
      folio: "P-2604", cliente: "Matías Ignacio Soto Bravo", run: "19.771.043-K",
      fecha: "2026-09-20 19:55", comuna: "Maipú", direccion: "Av. Tres Poniente 5120, depto. 42",
      distancia: 2.2, medioPago: "Servipag", estado: "Anulado", boleta: "B-8835",
      motivoAnulacion: "El cliente no se encontraba en el domicilio al momento de la entrega.",
      lineas: [
        { codigo: "CB-003", nombre: "Combo Individual", cantidad: 2, precio: 6490 }
      ]
    }
  ],

  /* --- Ventas por día, para el reporte del dueño (RF 9) --------------- */
  ventasDiarias: [
    { fecha: "2026-09-15", documentos: 24, unidades: 61, monto: 412700 },
    { fecha: "2026-09-16", documentos: 19, unidades: 47, monto: 331500 },
    { fecha: "2026-09-17", documentos: 31, unidades: 88, monto: 574200 },
    { fecha: "2026-09-18", documentos: 44, unidades: 126, monto: 861300 },
    { fecha: "2026-09-19", documentos: 52, unidades: 149, monto: 1042800 },
    { fecha: "2026-09-20", documentos: 47, unidades: 131, monto: 918400 },
    { fecha: "2026-09-21", documentos: 28, unidades: 74, monto: 512600 }
  ],

  /* --- Requerimientos funcionales del caso (trazabilidad) ------------- */
  requerimientos: [
    { id: "RF 1",  texto: "Armar un pedido con los productos disponibles del menú.", pantalla: "Carta y Mi pedido", archivo: "menu.html" },
    { id: "RF 2",  texto: "La orden se prepara sólo una vez confirmado el pago.", pantalla: "Mi pedido y Caja virtual", archivo: "carrito.html" },
    { id: "RF 3",  texto: "Anular una compra indicando el motivo de la anulación.", pantalla: "Mi cuenta", archivo: "mi-cuenta.html" },
    { id: "RF 4",  texto: "Registrar la venta de pedidos de clientes registrados, asociada a la caja del cajero virtual.", pantalla: "Caja virtual", archivo: "caja-virtual.html" },
    { id: "RF 5",  texto: "Registro de clientes con run, nombre, dirección, comuna, provincia, región, fecha de nacimiento, sexo, correo y teléfono.", pantalla: "Registro", archivo: "registro.html" },
    { id: "RF 6",  texto: "El registro puede hacerlo el cliente en la web o el administrador en el local.", pantalla: "Registro y Clientes", archivo: "admin-clientes.html" },
    { id: "RF 7",  texto: "Consultar y actualizar la disponibilidad de cada producto del menú.", pantalla: "Productos", archivo: "admin-productos.html" },
    { id: "RF 8",  texto: "Emitir boleta digital por cada venta y enviarla al correo del cliente.", pantalla: "Caja virtual", archivo: "caja-virtual.html" },
    { id: "RF 9",  texto: "Reporte de ventas realizadas según período de consulta.", pantalla: "Reportes", archivo: "reportes.html" },
    { id: "RF 10", texto: "Mantenedores de maestro de datos para productos, usuarios y clientes.", pantalla: "Productos y Clientes/Usuarios", archivo: "admin-clientes.html" },
    { id: "RF 11", texto: "Validar que el correo exista y esté activo mediante API de mensajería.", pantalla: "Registro", archivo: "registro.html" },
    { id: "RF 12", texto: "Autenticación de usuarios y acceso según perfil asignado.", pantalla: "Ingreso", archivo: "login.html" },
    { id: "RF 13", texto: "Imprimir las órdenes de despacho en el orden en que van llegando.", pantalla: "Despacho", archivo: "despacho.html" }
  ],

  casosUso: [
    { id: "CU1", nombre: "Autenticar usuarios",        rf: "RF 12",        actores: "Administrador, Cliente, Encargado de despacho, Dueño", archivo: "login.html" },
    { id: "CU2", nombre: "Administrar usuarios",       rf: "RF 10",        actores: "Administrador", archivo: "admin-clientes.html" },
    { id: "CU3", nombre: "Administrar clientes",       rf: "RF 5, 6, 10",  actores: "Administrador, Cliente", archivo: "admin-clientes.html" },
    { id: "CU4", nombre: "Administrar productos",      rf: "RF 7",         actores: "Administrador, Dueño", archivo: "admin-productos.html" },
    { id: "CU5", nombre: "Generar pedido",             rf: "RF 1",         actores: "Cliente", archivo: "menu.html" },
    { id: "CU6", nombre: "Realizar venta",             rf: "RF 4, 8",      actores: "Cajero virtual", archivo: "caja-virtual.html" },
    { id: "CU7", nombre: "Anular compra",              rf: "RF 3",         actores: "Cliente, Administrador", archivo: "mi-cuenta.html" },
    { id: "CU8", nombre: "Generar reporte de ventas",  rf: "RF 9",         actores: "Administrador, Dueño", archivo: "reportes.html" },
    { id: "CU9", nombre: "Obtener orden de despacho",  rf: "RF 13",        actores: "Encargado de despacho", archivo: "despacho.html" }
  ]
};
