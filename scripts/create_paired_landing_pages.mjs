import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pages = [
  {
    route: "/romantic-getaway-quito/", lang: "en", alternate: "/es/escapada-romantica-quito/",
    title: "Romantic Getaway Near Quito | The Cloud Forest Retreat",
    description: "Plan a private romantic getaway near Quito with cloud forest views, quiet rooms, nature walks, and an easy path to availability.",
    h1: "A Romantic Getaway Near Quito, Surrounded by Cloud Forest",
    eyebrow: "Quiet time for two",
    intro: "Trade city noise for mountain air, wide green views, and unhurried time together. The Cloud Forest Retreat offers couples a private nature-first base within reach of Quito—without promising a packaged resort experience.",
    hero: "/assets/images/pages/rooms/tcfr_rooms_ps_hero_01.jpg",
    labels: { home: "Home", booking: "Check availability", rooms: "View rooms", related: "Plan your stay" },
    sections: [
      ["Why couples choose the cloud forest", "A romantic trip does not need a crowded itinerary. Here, the setting does the work: changing mist, birdsong, mountain light, and space to slow down. Spend the morning over coffee, explore nearby nature, or simply enjoy the view together."],
      ["A private stay, not a resort package", "The retreat is best understood as a quiet mountain stay. We do not advertise fixed romance packages, spa treatments, or restaurant service that may not be available. Instead, you choose the room and rhythm that fit your visit, then confirm practical details directly before booking."],
      ["Build a simple two-person itinerary", "Pair your stay with birdwatching, a waterfall visit, a scenic drive, or time in the Chocó Andino. Leave room for weather and rest. Our planning pages can help you compare nearby experiences without turning your getaway into a checklist."],
      ["Choose the right room", "Review the Panoramic Suite, Sunrise Room, and Sunset Room to compare space, views, and shared areas. If privacy, timing, or a particular room feature matters to you, ask before confirming so expectations are clear."],
      ["Getting here from Quito", "Travel time varies with traffic, weather, and your departure point. Review our route guidance, plan to arrive in daylight when possible, and confirm the latest directions before the trip."],
      ["Ready to plan your escape?", "Send your preferred dates and number of guests. We will help you confirm availability and decide whether the retreat is the right fit for the kind of quiet getaway you want."]
    ],
    faq: [
      ["Is this an all-inclusive romantic package?", "No. The Cloud Forest Retreat is a private nature stay, not an all-inclusive resort. Confirm current inclusions before booking."],
      ["Can we book for a weekend?", "Availability and minimum-stay requirements can change. Send your dates through the booking page for the current answer."],
      ["Which room is best for couples?", "Each room has a different layout and view. Compare the room pages, then ask us about the details that matter most to you."]
    ]
  },
  {
    route: "/es/escapada-romantica-quito/", lang: "es", alternate: "/romantic-getaway-quito/",
    title: "Escapada romántica cerca de Quito | The Cloud Forest Retreat",
    description: "Planifica una escapada romántica privada cerca de Quito con vistas al bosque nublado, habitaciones tranquilas y contacto directo.",
    h1: "Una escapada romántica cerca de Quito, rodeada de bosque nublado",
    eyebrow: "Tiempo tranquilo para dos",
    intro: "Cambia el ruido de la ciudad por aire de montaña, amplias vistas verdes y tiempo sin prisa. The Cloud Forest Retreat ofrece a las parejas una base privada en la naturaleza, al alcance de Quito y sin presentarse como un resort con paquetes prediseñados.",
    hero: "/assets/images/pages/rooms/tcfr_rooms_ps_hero_01.jpg",
    labels: { home: "Inicio", booking: "Consultar disponibilidad", rooms: "Ver habitaciones", related: "Planifica tu estadía" },
    sections: [
      ["Por qué las parejas eligen el bosque nublado", "Una escapada romántica no necesita un itinerario lleno. Aquí el entorno marca el ritmo: neblina cambiante, canto de aves, luz de montaña y espacio para bajar la velocidad. Pueden tomar café con calma, explorar la naturaleza cercana o simplemente compartir la vista."],
      ["Una estadía privada, no un paquete de resort", "El retiro es una estadía tranquila en la montaña. No anunciamos paquetes románticos fijos, tratamientos de spa ni servicio de restaurante que podrían no estar disponibles. Ustedes eligen la habitación y el ritmo de la visita y confirman los detalles prácticos antes de reservar."],
      ["Armen un itinerario sencillo para dos", "Combinen la estadía con observación de aves, una cascada, un recorrido escénico o tiempo en el Chocó Andino. Dejen espacio para el clima y el descanso. Nuestras guías ayudan a comparar experiencias cercanas sin convertir la escapada en una lista de tareas."],
      ["Elijan la habitación adecuada", "Revisen la Suite Panorámica, la Habitación Amanecer y la Habitación Atardecer para comparar espacio, vistas y áreas compartidas. Si la privacidad, el horario o alguna característica es importante, consúltenos antes de confirmar."],
      ["Cómo llegar desde Quito", "El tiempo de viaje cambia según el tráfico, el clima y el punto de salida. Revisa nuestra guía de ruta, intenta llegar con luz de día y confirma las indicaciones más recientes antes del viaje."],
      ["¿Listos para planificar la escapada?", "Envíen sus fechas preferidas y número de huéspedes. Les ayudaremos a confirmar disponibilidad y decidir si el retiro encaja con el tipo de experiencia tranquila que buscan."]
    ],
    faq: [
      ["¿Es un paquete romántico todo incluido?", "No. The Cloud Forest Retreat es una estadía privada en la naturaleza, no un resort todo incluido. Confirma las inclusiones actuales antes de reservar."],
      ["¿Podemos reservar para un fin de semana?", "La disponibilidad y los requisitos de estadía mínima pueden cambiar. Envía tus fechas mediante la página de reservas."],
      ["¿Qué habitación es mejor para parejas?", "Cada habitación tiene una distribución y vista diferente. Compara las páginas de habitaciones y pregúntanos por los detalles importantes para ustedes."]
    ]
  },
  {
    route: "/wellness-retreat-quito/", lang: "en", alternate: "/es/retiro-bienestar-quito/",
    title: "Wellness Retreat Near Quito | The Cloud Forest Retreat",
    description: "Create a restorative wellness retreat near Quito with cloud forest quiet, flexible nature time, comfortable rooms, and direct booking support.",
    h1: "A Restorative Wellness Retreat Near Quito",
    eyebrow: "Rest, reset, reconnect",
    intro: "Wellness can be simple: deeper rest, fresh air, gentle movement, and fewer demands on your attention. The Cloud Forest Retreat gives you a quiet setting to create your own restorative stay near Quito.",
    hero: "/assets/images/pages/features/activities/tcfr_activities_yoga_01.jpg",
    labels: { home: "Home", booking: "Check availability", rooms: "View rooms", related: "Plan your stay" },
    sections: [
      ["A setting that supports a slower pace", "The cloud forest naturally invites you to pause. Cooler air, layered mountain views, bird activity, and changing weather create a strong sense of place. You decide whether your day includes a walk, reading, journaling, stretching, photography, or uninterrupted rest."],
      ["Self-directed wellness, clearly described", "This page describes the setting for a personal wellness stay. It does not promise medical care, therapy, scheduled classes, spa treatments, or a hosted retreat program. If you need a specific service, ask us before booking so we can give you an accurate answer."],
      ["Shape a balanced daily rhythm", "Start slowly, choose one nearby nature activity, and protect time to recover. A flexible plan works better than a rigid agenda in a living cloud forest, where rain and mist are part of the experience."],
      ["Comfort and common spaces", "Compare our rooms and common areas to understand the layout, views, and shared facilities. The best choice depends on your group, desired privacy, and the way you plan to use the space."],
      ["Prepare for the environment", "Bring layers, rain protection, suitable footwear, sun protection, and any personal wellness items you rely on. Review our packing and safety guides, and speak with a health professional when planning around a medical condition."],
      ["Plan a stay that fits you", "Tell us your dates, group size, and what a restorative trip means to you. We can confirm availability and practical details without overselling services that are not part of the stay."]
    ],
    faq: [
      ["Do you run scheduled wellness retreats?", "Not as a standard promise on this page. The property supports a self-directed restorative stay; ask about any current hosted activities before booking."],
      ["Are yoga or spa services included?", "Do not assume they are included. Contact us for current availability and any arrangements that may be possible."],
      ["Is the retreat suitable for medical recovery?", "We do not provide medical care. Discuss travel and activity with a qualified health professional and confirm accessibility needs with us before booking."]
    ]
  },
  {
    route: "/es/retiro-bienestar-quito/", lang: "es", alternate: "/wellness-retreat-quito/",
    title: "Retiro de bienestar cerca de Quito | The Cloud Forest Retreat",
    description: "Crea un retiro de bienestar cerca de Quito con calma de bosque nublado, tiempo flexible en la naturaleza y apoyo directo para reservar.",
    h1: "Un retiro restaurador de bienestar cerca de Quito",
    eyebrow: "Descansa, renueva, reconecta",
    intro: "El bienestar puede ser sencillo: descansar mejor, respirar aire fresco, moverse con suavidad y reducir las demandas sobre tu atención. The Cloud Forest Retreat ofrece un entorno tranquilo para crear tu propia estadía restauradora cerca de Quito.",
    hero: "/assets/images/pages/features/activities/tcfr_activities_yoga_01.jpg",
    labels: { home: "Inicio", booking: "Consultar disponibilidad", rooms: "Ver habitaciones", related: "Planifica tu estadía" },
    sections: [
      ["Un entorno que favorece un ritmo más lento", "El bosque nublado invita naturalmente a hacer una pausa. El aire fresco, las vistas de montaña, la actividad de las aves y el clima cambiante crean una fuerte conexión con el lugar. Tú decides si el día incluye caminar, leer, escribir, estirar, fotografiar o simplemente descansar."],
      ["Bienestar autoguiado, descrito con claridad", "Esta página presenta el entorno para una estadía personal de bienestar. No promete atención médica, terapia, clases programadas, tratamientos de spa ni un programa guiado. Si necesitas un servicio específico, consúltanos antes de reservar."],
      ["Crea un ritmo diario equilibrado", "Comienza despacio, elige una actividad cercana y protege tiempo para recuperarte. Un plan flexible funciona mejor que una agenda rígida en un bosque vivo, donde la lluvia y la neblina forman parte de la experiencia."],
      ["Comodidad y áreas comunes", "Compara nuestras habitaciones y áreas comunes para conocer la distribución, las vistas y los espacios compartidos. La mejor opción depende de tu grupo, la privacidad deseada y cómo piensas usar el espacio."],
      ["Prepárate para el entorno", "Lleva capas de ropa, protección para la lluvia, calzado apropiado, protección solar y tus artículos personales de bienestar. Revisa nuestras guías de equipaje y seguridad y consulta a un profesional de salud si existe una condición médica."],
      ["Planifica una estadía a tu medida", "Cuéntanos tus fechas, el tamaño del grupo y qué significa para ti un viaje restaurador. Podemos confirmar disponibilidad y detalles prácticos sin prometer servicios que no forman parte de la estadía."]
    ],
    faq: [
      ["¿Organizan retiros de bienestar programados?", "No se promete un programa fijo en esta página. La propiedad favorece una estadía restauradora autoguiada; pregunta por actividades vigentes antes de reservar."],
      ["¿Se incluyen yoga o servicios de spa?", "No debes asumir que están incluidos. Contáctanos para conocer la disponibilidad actual y posibles coordinaciones."],
      ["¿El retiro es adecuado para recuperación médica?", "No ofrecemos atención médica. Consulta a un profesional de salud y confirma con nosotros cualquier necesidad de accesibilidad antes de reservar."]
    ]
  }
];

const esc = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const origin = "https://thecloudforestretreat.com";

function html(page) {
  const es = page.lang === "es";
  const url = origin + page.route;
  const altUrl = origin + page.alternate;
  const sectionMarkup = page.sections.map(([heading, copy], index) => `<article class="tcfr-landing__card" data-analytics-section="section_${index + 1}"><span class="tcfr-landing__number">${String(index + 1).padStart(2, "0")}</span><h2>${esc(heading)}</h2><p>${esc(copy)}</p></article>`).join("\n");
  const faqMarkup = page.faq.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("\n");
  const faqJson = page.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }));
  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}"/>
<meta name="robots" content="index,follow,max-image-preview:large"/>
<link rel="canonical" href="${url}"/>
<link rel="alternate" hreflang="${page.lang}" href="${url}"/>
<link rel="alternate" hreflang="${es ? "en" : "es"}" href="${altUrl}"/>
<link rel="alternate" hreflang="x-default" href="${es ? altUrl : url}"/>
<meta property="og:type" content="website"/><meta property="og:site_name" content="The Cloud Forest Retreat"/>
<meta property="og:title" content="${esc(page.title)}"/><meta property="og:description" content="${esc(page.description)}"/><meta property="og:url" content="${url}"/><meta property="og:image" content="${origin}${page.hero}"/>
<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(page.title)}"/><meta name="twitter:description" content="${esc(page.description)}"/><meta name="twitter:image" content="${origin}${page.hero}"/>
<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="icon" href="/favicon.svg" type="image/svg+xml"/><link rel="apple-touch-icon" href="/apple-touch-icon.png"/><link rel="manifest" href="/site.webmanifest"/>
<meta name="theme-color" content="#0D5925"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<link href="/assets/css/site.css" rel="stylesheet"/><link href="/assets/css/header.css?v=3" rel="stylesheet"/>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: page.h1, description: page.description, url, inLanguage: page.lang, isPartOf: { "@type": "WebSite", name: "The Cloud Forest Retreat", url: `${origin}/` } })}</script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqJson })}</script>
</head>
<body data-page-type="money_page" data-page-language="${page.lang}">
<div id="siteHeader"></div>
<main class="tcfr-landing">
  <nav class="tcfr-landing__crumbs" aria-label="${es ? "Migas de pan" : "Breadcrumb"}"><a href="${es ? "/es/" : "/"}">${page.labels.home}</a><span aria-hidden="true">/</span><span>${esc(page.h1)}</span></nav>
  <section class="tcfr-landing__hero">
    <img src="${page.hero}" alt="${esc(page.h1)}" width="1600" height="1000" fetchpriority="high"/>
    <div class="tcfr-landing__shade"></div>
    <div class="tcfr-landing__heroContent"><p class="tcfr-landing__eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.h1)}</h1><p>${esc(page.intro)}</p><div class="tcfr-landing__actions"><a class="btn primary" href="${es ? "/es/reservas/" : "/booking/"}" data-analytics-event="booking_cta_click" data-analytics-location="hero">${page.labels.booking}</a><a class="btn secondary" href="${es ? "/es/habitaciones/" : "/rooms/"}" data-analytics-event="rooms_cta_click" data-analytics-location="hero">${page.labels.rooms}</a></div></div>
  </section>
  <section class="tcfr-landing__grid" aria-label="${es ? "Detalles de la estadía" : "Stay details"}">${sectionMarkup}</section>
  <section class="tcfr-landing__faq" data-analytics-section="faq"><p class="tcfr-landing__eyebrow">${es ? "Preguntas frecuentes" : "Frequently asked questions"}</p><h2>${es ? "Antes de reservar" : "Before you book"}</h2>${faqMarkup}</section>
  <section class="tcfr-landing__final" data-analytics-section="final_cta"><h2>${es ? "Confirma los detalles directamente" : "Confirm the details directly"}</h2><p>${es ? "Comparte tus fechas y prioridades para recibir una respuesta clara sobre disponibilidad, inclusiones y condiciones actuales." : "Share your dates and priorities for a clear answer about current availability, inclusions, and conditions."}</p><a class="btn primary" href="${es ? "/es/reservas/" : "/booking/"}" data-analytics-event="booking_cta_click" data-analytics-location="final_cta">${page.labels.booking}</a></section>
</main>
<div id="siteFooter"></div>
<script src="/assets/js/site.js?v=4"></script>
</body></html>\n`;
}

for (const page of pages) {
  const directory = path.join(root, page.route.slice(1));
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, "index.html"), html(page));
}
console.log(JSON.stringify({ created: pages.map((page) => page.route) }, null, 2));
