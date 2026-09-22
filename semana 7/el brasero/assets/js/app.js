/* ==========================================================================
   El Brasero — lógica de presentación compartida
   --------------------------------------------------------------------------
   Responsabilidades: cabecera y pie comunes, sesión simulada, pedido en
   curso, formatos (moneda y fecha), validaciones de entrada y utilidades
   de render. No contiene reglas de negocio: en la solución final éstas
   residen en la capa intermedia y se consumen por Web Services.
   ========================================================================== */

/* ------------------------------------------------------- almacenamiento --- */
/* sessionStorage se usa sólo como comodidad del prototipo; toda lectura y
   escritura va protegida para que la página funcione igual si no está
   disponible (ventana privada, datos bloqueados). */

const Memoria = {
  leer(clave, porDefecto) {
    try {
      const bruto = sessionStorage.getItem("brasero:" + clave);
      return bruto ? JSON.parse(bruto) : porDefecto;
    } catch (e) { return porDefecto; }
  },
  escribir(clave, valor) {
    try { sessionStorage.setItem("brasero:" + clave, JSON.stringify(valor)); } catch (e) { /* sin persistencia */ }
  }
};

/* --------------------------------------------------------------- formato --- */

const Formato = {
  pesos(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-CL", { maximumFractionDigits: 0 });
  },
  numero(valor) {
    return Number(valor || 0).toLocaleString("es-CL");
  },
  fecha(iso) {
    const [a, m, d] = String(iso).slice(0, 10).split("-");
    return `${d}-${m}-${a}`;
  },
  fechaLarga(iso) {
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const f = new Date(String(iso).slice(0, 10) + "T12:00:00");
    return `${dias[f.getDay()]} ${f.getDate()} de ${meses[f.getMonth()]}`;
  }
};

/* --------------------------------------------------------------- sesión --- */

const Sesion = {
  actual() {
    return Memoria.leer("sesion", null);
  },
  iniciar(datos) {
    Memoria.escribir("sesion", datos);
  },
  cerrar() {
    Memoria.escribir("sesion", null);
    Memoria.escribir("pedido", []);
  }
};

/* ---------------------------------------------------------- pedido (RF 1) --- */

const Pedido = {
  lineas() {
    const guardado = Memoria.leer("pedido", null);
    return Array.isArray(guardado) ? guardado : [];
  },
  guardar(lineas) {
    Memoria.escribir("pedido", lineas);
    Pedido.refrescarIndicador();
  },
  agregar(codigo, cantidad = 1) {
    const producto = BRASERO.productos.find(p => p.codigo === codigo);
    if (!producto || !producto.disponible) return false;
    const lineas = Pedido.lineas();
    const existente = lineas.find(l => l.codigo === codigo);
    if (existente) existente.cantidad += cantidad;
    else lineas.push({ codigo, nombre: producto.nombre, precio: producto.precio, cantidad });
    Pedido.guardar(lineas);
    return true;
  },
  cambiarCantidad(codigo, delta) {
    const lineas = Pedido.lineas();
    const linea = lineas.find(l => l.codigo === codigo);
    if (!linea) return;
    linea.cantidad += delta;
    Pedido.guardar(lineas.filter(l => l.cantidad > 0));
  },
  quitar(codigo) {
    Pedido.guardar(Pedido.lineas().filter(l => l.codigo !== codigo));
  },
  vaciar() {
    Pedido.guardar([]);
  },
  unidades() {
    return Pedido.lineas().reduce((t, l) => t + l.cantidad, 0);
  },
  total() {
    return Pedido.lineas().reduce((t, l) => t + l.precio * l.cantidad, 0);
  },
  refrescarIndicador() {
    const conteo = document.querySelector("#conteo-pedido");
    if (conteo) conteo.textContent = Pedido.unidades();
  }
};

/* ------------------------------------------------------------ validación --- */

const Validar = {
  /* Módulo 11 sobre el RUN chileno (RF 5) */
  run(valor) {
    const limpio = String(valor || "").replace(/[.\s]/g, "").toUpperCase();
    if (!/^\d{7,8}-[\dK]$/.test(limpio)) return false;
    const [cuerpo, dv] = limpio.split("-");
    let suma = 0, factor = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }
    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return dv === esperado;
  },
  formatoCorreo(valor) {
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(valor || "").trim());
  },
  telefono(valor) {
    return /^\+?56\s?9\s?\d{4}\s?\d{4}$/.test(String(valor || "").trim()) ||
           /^9\d{8}$/.test(String(valor || "").replace(/\s/g, ""));
  },
  mayorDeEdad(iso) {
    if (!iso) return false;
    const nac = new Date(iso + "T12:00:00");
    const hoy = new Date("2026-09-21T12:00:00");
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad >= 18;
  },
  /* RF 11: la comprobación real la hace la API de mensajería vía Web Service.
     Aquí se simula la latencia y la respuesta del servicio. */
  existenciaCorreo(correo) {
    return new Promise(resolve => {
      setTimeout(() => {
        const dominio = String(correo).split("@")[1] || "";
        const dominiosInexistentes = ["correo.inexistente", "test.test", "ejemplo.xyz", "noexiste.cl"];
        resolve({
          existe: !dominiosInexistentes.includes(dominio.toLowerCase()),
          activo: !dominiosInexistentes.includes(dominio.toLowerCase()),
          servicio: "API Mensajería v2 · verificación SMTP",
          dominio
        });
      }, 1400);
    });
  }
};

/* ------------------------------------------------------------- utilidades --- */

function mostrarAviso(contenedor, tipo, texto) {
  const destino = typeof contenedor === "string" ? document.querySelector(contenedor) : contenedor;
  if (!destino) return;
  const marcas = { ok: "✓", error: "!", alerta: "!", info: "i" };
  destino.innerHTML = `<div class="aviso ${tipo}"><span class="icono" aria-hidden="true">${marcas[tipo] || "i"}</span><div>${texto}</div></div>`;
  destino.hidden = false;
}

function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function claseEstado(estado) {
  switch (estado) {
    case "Pagado":          return "info";
    case "En preparación":  return "alerta";
    case "En ruta":         return "alerta";
    case "Entregado":       return "ok";
    case "Anulado":         return "error";
    default:                return "neutro";
  }
}

/* ------------------------------------------------------- iconos (inline) --- */

const Iconos = {
  pollo: `<svg viewBox="0 0 64 64" role="img" aria-label="Pollo a las brasas"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M41 9c8 0 14 6 14 14 0 6-3 10-8 12-4 2-7 1-9-1l-8-8c-2-2-3-6-1-9 3-5 6-8 12-8z" fill="rgba(214,67,27,.18)"/><path d="M32 30 20 42"/><circle cx="15" cy="44" r="6"/><circle cx="22" cy="51" r="6"/></g></svg>`,
  papas: `<svg viewBox="0 0 64 64" role="img" aria-label="Papas fritas"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 30h24l-3 22H23z" fill="rgba(214,67,27,.16)"/><path d="M20 36h24"/><path d="M26 30V14M32 30V10M38 30v-17"/></g></svg>`,
  ensalada: `<svg viewBox="0 0 64 64" role="img" aria-label="Ensalada"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 32h40c0 11-9 19-20 19s-20-8-20-19z" fill="rgba(214,67,27,.16)"/><circle cx="26" cy="26" r="5"/><circle cx="38" cy="24" r="4"/><path d="M16 52h32"/></g></svg>`,
  arroz: `<svg viewBox="0 0 64 64" role="img" aria-label="Arroz"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 34h36c0 10-8 17-18 17s-18-7-18-17z" fill="rgba(214,67,27,.16)"/><path d="M22 28c2-3 6-4 10-4s8 1 10 4"/><path d="M28 20c1-2 3-3 5-3"/></g></svg>`,
  pan: `<svg viewBox="0 0 64 64" role="img" aria-label="Pan amasado"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="34" rx="20" ry="13" fill="rgba(214,67,27,.16)"/><path d="M22 30c3 3 6 4 10 4s7-1 10-4"/><path d="M26 40h12"/></g></svg>`,
  combo: `<svg viewBox="0 0 64 64" role="img" aria-label="Combo"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="24" width="24" height="26" rx="3" fill="rgba(214,67,27,.16)"/><path d="M12 32h24"/><path d="M40 20h12v30H40z"/><path d="M44 20v-6h4v6"/></g></svg>`,
  salsa: `<svg viewBox="0 0 64 64" role="img" aria-label="Salsa"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 26h20l-2 24H24z" fill="rgba(214,67,27,.16)"/><path d="M26 26v-6h12v6"/><path d="M28 14h8"/></g></svg>`,
  bebida: `<svg viewBox="0 0 64 64" role="img" aria-label="Bebida"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 20h16l-2 32H26z" fill="rgba(214,67,27,.16)"/><path d="M26 30h12"/><path d="M28 20v-6h8v6"/></g></svg>`,
  brasa: `<svg viewBox="0 0 64 64" role="img" aria-label="Brasa"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8c6 9 14 12 14 22a14 14 0 1 1-28 0c0-10 8-13 14-22z" fill="rgba(242,160,61,.22)"/><path d="M32 26c3 4 6 6 6 11a6 6 0 1 1-12 0c0-5 3-7 6-11z"/></g></svg>`,
  llama: `<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M16 1c2.6 5.6 9 8 9 16a9 9 0 0 1-18 0c0-4 2-6 4-9 .6 2 1.6 3.2 3 3.8C13.2 8 14.4 4.4 16 1z" fill="#F2842B"/><path d="M16 15c1.8 2.6 4 4 4 7.4a4 4 0 0 1-8 0c0-3 2.2-4.8 4-7.4z" fill="#F7B500"/></svg>`,
  whatsapp: `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1 1.1-3.9-.3-.4c-1.1-1.7-1.6-3.7-1.6-5.6C5.2 10 10 5.2 16 5.2S26.8 10 26.8 16 22 26.6 16 26.6zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2s-.8 1.1-1 1.3c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.2.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4z"/></svg>`
};

/* ------------------------------------------------- fotografías del menú --- */
/* Sólo algunos productos tienen fotografía de estudio; el resto usa la
   ilustración de su categoría hasta que se cargue la imagen definitiva. */

const FOTOS = {
  "PA-001": "assets/img/pollo-entero.jpg",
  "PA-002": "assets/img/hero-pollo-papas.jpg",
  "PA-003": "assets/img/cuarto-pollo.jpg",
  "AC-001": "assets/img/papas-fritas.jpg",
  "CB-001": "assets/img/combo-pollo-papas.jpg",
  "CB-002": "assets/img/promo-dos-pollos.jpg",
  "BE-001": "assets/img/bebida.jpg"
};

function graficoProducto(producto) {
  const foto = FOTOS[producto.codigo];
  return foto
    ? `<img src="${foto}" alt="${escaparHTML(producto.nombre)}" loading="lazy">`
    : `${Iconos[producto.icono] || Iconos.brasa}<span class="marca-agua">El Brasero</span>`;
}

/* --------------------------------------------------- cabecera y pie común --- */

const NAVEGACION = [
  { archivo: "index.html",          texto: "Inicio",   grupo: "publico" },
  { archivo: "menu.html",           texto: "Carta",    grupo: "publico" },
  { archivo: "mi-cuenta.html",      texto: "Mi cuenta", grupo: "publico" },
  { archivo: "caja-virtual.html",   texto: "Caja",     grupo: "interno" },
  { archivo: "despacho.html",       texto: "Despacho", grupo: "interno" },
  { archivo: "admin-productos.html", texto: "Productos", grupo: "interno" },
  { archivo: "admin-clientes.html", texto: "Clientes",  grupo: "interno" },
  { archivo: "reportes.html",       texto: "Reportes",  grupo: "interno" }
];

function construirCabecera() {
  const raiz = document.querySelector("#cabecera");
  if (!raiz) return;
  const pagina = document.body.dataset.pagina || "";
  const sesion = Sesion.actual();

  const enlaces = grupo => NAVEGACION
    .filter(i => i.grupo === grupo)
    .map(i => `<a href="${i.archivo}"${i.archivo === pagina ? ' aria-current="page"' : ""}>${i.texto}</a>`)
    .join("");

  raiz.innerHTML = `
    <div class="banda-horario">
      Martes a jueves de <strong>11:30 a 22:00</strong> · Viernes a domingo de <strong>11:30 a 23:00</strong> · Despacho gratis hasta 3 km
    </div>
    <div class="barra-superior">
      <div class="envoltorio">
        <a class="logotipo" href="index.html">
          <span class="emblema">${Iconos.brasa}</span>
          <span>EL BRASERO<small>POLLOS A LAS BRASAS</small></span>
        </a>
        <nav class="menu-nav" aria-label="Navegación principal">
          ${enlaces("publico")}
          <span class="grupo-nav" role="group" aria-label="Módulos internos">${enlaces("interno")}</span>
          <a class="indicador-carrito" href="carrito.html">Mi pedido
            <span class="conteo" id="conteo-pedido">${Pedido.unidades()}</span>
          </a>
        </nav>
      </div>
    </div>
    <div class="barra-sesion">
      <div class="envoltorio">
        ${sesion
          ? `<span>Sesión activa: <strong>${escaparHTML(sesion.nombre)}</strong></span>
             <span class="pildora info">${escaparHTML(sesion.perfil)}</span>
             <button class="enlace-quitar" id="cerrar-sesion" style="margin-left:auto">Cerrar sesión</button>`
          : `<span>Sin sesión iniciada · el acceso a cada módulo depende del perfil (RF 12)</span>
             <a href="login.html" style="margin-left:auto;font-weight:600">Ingresar</a>
             <a href="registro.html">Registrarme</a>`}
      </div>
    </div>`;

  const boton = document.querySelector("#cerrar-sesion");
  if (boton) boton.addEventListener("click", () => { Sesion.cerrar(); location.href = "index.html"; });
}

function construirPie() {
  const raiz = document.querySelector("#pie");
  if (!raiz) return;
  const l = BRASERO.local;
  raiz.innerHTML = `
    <footer class="pie-pagina">
      <div class="envoltorio">
        <div>
          <h4>El Brasero</h4>
          <p>${l.direccion}<br>${l.horario}</p>
          <p class="mono" style="margin-top:6px">${l.telefono}</p>
        </div>
        <div>
          <h4>Comprar</h4>
          <ul>
            <li><a href="menu.html">Carta completa</a></li>
            <li><a href="carrito.html">Mi pedido</a></li>
            <li><a href="registro.html">Crear cuenta</a></li>
            <li><a href="mi-cuenta.html">Mis pedidos y boletas</a></li>
          </ul>
        </div>
        <div>
          <h4>Módulos internos</h4>
          <ul>
            <li><a href="caja-virtual.html">Caja virtual</a></li>
            <li><a href="despacho.html">Órdenes de despacho</a></li>
            <li><a href="admin-productos.html">Mantenedor de productos</a></li>
            <li><a href="reportes.html">Reporte de ventas</a></li>
          </ul>
        </div>
        <div>
          <h4>Despacho</h4>
          <p>Reparto gratuito hasta ${l.radioDespacho} km del local: ${l.comunasReparto.join(", ")}.</p>
          <p style="margin-top:6px"><a href="trazabilidad.html">Trazabilidad de requerimientos</a></p>
        </div>
        <div class="legal">
          ${l.nombre} · RUT ${l.rut} · ${l.correo}<br>
          Entrega de Front End — Caso "Sistema de Ventas On-line". Prototipo de interfaz: los datos son de demostración y no se persisten en base de datos.
        </div>
      </div>
    </footer>`;
}

function construirWhatsapp() {
  if (document.querySelector(".boton-whatsapp")) return;
  const enlace = document.createElement("a");
  enlace.className = "boton-whatsapp";
  enlace.href = "https://wa.me/56227451180";
  enlace.target = "_blank";
  enlace.rel = "noopener";
  enlace.setAttribute("aria-label", "Escribir a El Brasero por WhatsApp");
  enlace.innerHTML = Iconos.whatsapp;
  document.body.appendChild(enlace);
}

document.addEventListener("DOMContentLoaded", () => {
  construirCabecera();
  construirPie();
  construirWhatsapp();
  Pedido.refrescarIndicador();
});
