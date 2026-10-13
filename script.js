/* =====================================================
   CONFIGURACIÓN — cambia estos datos por los tuyos
   ===================================================== */
const CONFIG = {
  nombre: "Vista Pro",          // Nombre de tu negocio
  whatsapp: "9612710375",         // Con código de país, sin + ni espacios (México: 521 + 10 dígitos)
  email: "vistapro.proyectos@gmail.com",                         // Opcional. Déjalo vacío para ocultarlo
  ciudad: "Cancún,Q. roo, México", // Texto del pie de página
  mensajeInicial: "Hola, me interesa una cotización de video con Vista Pro"
};

/* ===================================================== */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Datos del negocio en la página ---------- */
document.querySelectorAll("[data-nombre]").forEach(el => (el.textContent = CONFIG.nombre));
document.title = `${CONFIG.nombre} | Video con dron para lotes, fraccionamientos, casas y locales`;
$("#footCiudad").textContent = CONFIG.ciudad;
$("#year").textContent = new Date().getFullYear();

const waLink = (texto) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = waLink(CONFIG.mensajeInicial);
  a.target = "_blank";
  a.rel = "noopener";
});

if (CONFIG.email) {
  $("#emailLine").hidden = false;
  const m = $("#emailLink");
  m.href = `mailto:${CONFIG.email}`;
  m.textContent = CONFIG.email;
}

/* ---------- Barra de navegación ---------- */
const nav = $("#nav");

/* ---------- Altímetro: 0 m arriba, 120 m al llegar al final ---------- */
const alt = $("#alt");
const altValue = $("#altValue");
const altMarker = $("#altMarker");
const MAX_ALT = 120;

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  altValue.textContent = Math.round(p * MAX_ALT);
  altMarker.style.top = `${p * 100}%`;
  nav.classList.toggle("is-solid", window.scrollY > 40);
}
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => { onScroll(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

/* ---------- Cronómetro "rec" del hero ---------- */
const recTime = $("#recTime");
let seg = 0;
setInterval(() => {
  seg = (seg + 1) % 3600;
  recTime.textContent = String(Math.floor(seg / 60)).padStart(2, "0") + ":" + String(seg % 60).padStart(2, "0");
}, 1000);

/* ---------- Video del hero: si no existe el archivo, usa el fondo de color ---------- */
const heroVideo = $("#heroVideo");
heroVideo.addEventListener("error", () => heroVideo.remove(), true);
heroVideo.querySelector("source").addEventListener("error", () => heroVideo.remove());
if (reduceMotion) heroVideo.pause();

/* ---------- Galería ---------- */
const grid = $("#grid");
const items = Array.isArray(window.GALERIA) ? window.GALERIA : [];

const tituloDe = (src) =>
  decodeURIComponent(src.split("/").pop())
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function crearTile(item) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tile";
  const titulo = item.titulo || tituloDe(item.src);
  btn.setAttribute("aria-label", `${item.tipo === "video" ? "Ver video" : "Ver foto"}: ${titulo}`);

  let media;
  if (item.tipo === "video") {
    media = document.createElement("video");
    media.src = `${item.src}#t=0.5`;
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = "metadata";
  } else {
    media = document.createElement("img");
    media.src = item.src;
    media.alt = titulo;
    media.loading = "lazy";
    media.decoding = "async";
  }
  btn.append(media);

  const cap = document.createElement("span");
  cap.className = "tile__cap";
  cap.textContent = titulo;
  if (item.tipo === "video") {
    const play = document.createElement("span");
    play.className = "tile__play";
    play.setAttribute("aria-hidden", "true");
    cap.append(play);
  }
  btn.append(cap);

  // En computadora, el video se reproduce al pasar el mouse
  if (item.tipo === "video" && window.matchMedia("(hover: hover)").matches && !reduceMotion) {
    btn.addEventListener("mouseenter", () => media.play().catch(() => {}));
    btn.addEventListener("mouseleave", () => { media.pause(); media.currentTime = 0.5; });
  }

  btn.addEventListener("click", () => abrirVisor(item, titulo));
  return btn;
}

if (items.length === 0) {
  for (let i = 0; i < 6; i++) {
    const vacio = document.createElement("div");
    vacio.className = "tile tile--empty";
    vacio.textContent = i === 0
      ? "Aquí van tus trabajos. Guarda tus videos en assets/videos y tus fotos en assets/images, y corre deploy.sh."
      : "Tu video o foto aquí";
    grid.append(vacio);
  }
} else {
  items.forEach(it => grid.append(crearTile(it)));
}

/* ---------- Visor (lightbox) ---------- */
const lb = $("#lb");
const lbBody = $("#lbBody");

function abrirVisor(item, titulo) {
  lbBody.replaceChildren();
  let el;
  if (item.tipo === "video") {
    el = document.createElement("video");
    el.src = item.src;
    el.controls = true;
    el.autoplay = true;
    el.playsInline = true;
  } else {
    el = document.createElement("img");
    el.src = item.src;
    el.alt = titulo;
  }
  lbBody.append(el);
  lb.showModal();
}

function cerrarVisor() {
  const v = lbBody.querySelector("video");
  if (v) v.pause();
  lbBody.replaceChildren();
  if (lb.open) lb.close();
}

$("#lbClose").addEventListener("click", cerrarVisor);
lb.addEventListener("close", () => lbBody.replaceChildren());
lb.addEventListener("click", (e) => { if (e.target === lb) cerrarVisor(); });

/* ---------- Formulario → WhatsApp ---------- */
const form = $("#form");
const formError = $("#formError");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const nombre = (d.get("nombre") || "").toString().trim();
  const tipo = (d.get("tipo") || "").toString();

  if (!nombre || !tipo) {
    formError.hidden = false;
    formError.textContent = "Escribe tu nombre y elige el tipo de propiedad para continuar.";
    return;
  }
  formError.hidden = true;

  const ubicacion = (d.get("ubicacion") || "").toString().trim();
  const mensaje = (d.get("mensaje") || "").toString().trim();

  const lineas = [
    `Hola, soy ${nombre}.`,
    `Quiero cotizar video con dron para: ${tipo}.`,
    ubicacion && `Ubicación: ${ubicacion}.`,
    mensaje && `Detalles: ${mensaje}`
  ].filter(Boolean);

  window.open(waLink(lineas.join("\n")), "_blank", "noopener");
});
