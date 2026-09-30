import fs from "node:fs/promises";

const preview = await fs.readFile("design-preview/home-cluster/index.html", "utf8");
const currentEn = await fs.readFile("index.html", "utf8");
const currentEs = await fs.readFile("es/index.html", "utf8");

const mainMatch = preview.match(/<main class="homePreview">([\s\S]*?)<\/main>/);
if (!mainMatch) throw new Error("Home preview main content not found");

const mainEn = `<main class="homePreview" aria-label="The Cloud Forest Retreat home">${mainMatch[1]
  .replace(/\n\s*<aside class="homePreview__notice"[\s\S]*?<\/aside>\n/, "\n")
  .replaceAll("home-preview-title", "home-title")}</main>`;

const translations = new Map([
  ["The Cloud Forest Retreat home", "Inicio de The Cloud Forest Retreat"],
  ["Private mountainside stay near Quito", "Estadía privada en la montaña cerca de Quito"],
  ["Wake up inside the cloud forest.", "Despierta dentro del bosque nublado."],
  ["A quiet, owner-hosted retreat with broad valley views, comfortable rooms, fresh food, and nature at the door—close enough to become part of an Ecuador itinerary.", "Un refugio tranquilo atendido por sus propietarios, con amplias vistas al valle, habitaciones cómodas, comida fresca y naturaleza a la puerta; lo bastante cerca para integrarlo en un itinerario por Ecuador."],
  ["Check availability", "Consultar disponibilidad"],
  ["Explore the rooms", "Explorar las habitaciones"],
  ["Retreat highlights", "Aspectos destacados del refugio"],
  ["Near Quito", "Cerca de Quito"],
  ["A private nature escape about two hours away, depending on the route", "Una escapada privada en la naturaleza a unas dos horas, según la ruta"],
  ["Made for slower travel", "Pensado para viajar sin prisa"],
  ["Space for couples, birders, wellness travelers, and restorative stays", "Espacio para parejas, observadores de aves, viajeros de bienestar y estadías reparadoras"],
  ["Direct local support", "Ayuda local directa"],
  ["Plan rooms, transportation, and arrival details with a real host", "Planifica habitaciones, transporte y llegada directamente con un anfitrión"],
  ["The retreat at a glance", "El refugio de un vistazo"],
  ["A private cloud forest stay in Pichincha, Ecuador.", "Una estadía privada en el bosque nublado de Pichincha, Ecuador."],
  ["The Cloud Forest Retreat is an intimate mountainside bed and breakfast in Pichincha, Ecuador. The rooms, shared spaces, meals, views, and nearby nature belong to one connected experience: peaceful enough to reset, practical enough to plan, and personal enough to remember.", "The Cloud Forest Retreat es un bed and breakfast íntimo de montaña en Pichincha, Ecuador. Las habitaciones, los espacios compartidos, las comidas, las vistas y la naturaleza cercana forman una experiencia conectada: tranquila para renovarte, práctica para planificar y personal para recordar."],
  ["Stay characteristics", "Características de la estadía"],
  ["Real property", "Propiedad real"],
  ["Every image shows the retreat or its immediate landscape.", "Cada imagen muestra el refugio o su paisaje inmediato."],
  ["Clear expectations", "Expectativas claras"],
  ["Room details, arrival guidance, and what is included.", "Detalles de las habitaciones, orientación para llegar y lo que está incluido."],
  ["Human planning", "Planificación personal"],
  ["Questions answered by people who know the stay.", "Respuestas de personas que conocen la estadía."],
  ["Choose your room", "Elige tu habitación"],
  ["Two perspectives on the same remarkable valley.", "Dos perspectivas del mismo valle extraordinario."],
  ["Compare light, outlook, sleeping arrangements, and practical details before choosing.", "Compara la luz, las vistas, la distribución para dormir y los detalles prácticos antes de elegir."],
  ["Compare all room details →", "Comparar todos los detalles →"],
  ["Sunrise Room at The Cloud Forest Retreat", "Habitación Amanecer en The Cloud Forest Retreat"],
  ["Morning light", "Luz de la mañana"],
  ["Sunrise Room", "Habitación Amanecer"],
  ["A calm, private room designed for slow mornings and mountain air.", "Una habitación privada y tranquila para mañanas lentas y aire de montaña."],
  ["View room details →", "Ver detalles →"],
  ["Sunset Room at The Cloud Forest Retreat", "Habitación Atardecer en The Cloud Forest Retreat"],
  ["Evening views", "Vistas al atardecer"],
  ["Sunset Room", "Habitación Atardecer"],
  ["A restorative room that settles into the changing light across the valley.", "Una habitación reparadora que acompaña la luz cambiante sobre el valle."],
  ["Make the stay your own", "Haz tuya la estadía"],
  ["Come for the quiet. Follow what draws you outside.", "Ven por la tranquilidad. Sigue lo que te invita a salir."],
  ["Build the stay around your pace, with practical information and direct routes to the experiences that matter most.", "Organiza la estadía a tu ritmo, con información práctica y rutas directas hacia las experiencias que más te interesan."],
  ["Birdlife", "Aves"],
  ["Birding from a quieter base", "Avistamiento desde una base tranquila"],
  ["Explore hummingbirds, cloud forest species, and what makes the Chocó Andino special.", "Descubre colibríes, especies del bosque nublado y lo que hace especial al Chocó Andino."],
  ["Plan a birding stay →", "Planificar una estadía de aves →"],
  ["Your pace", "Tu ritmo"],
  ["Nature, movement, and rest", "Naturaleza, movimiento y descanso"],
  ["Balance outdoor time, nearby attractions, and unhurried hours at the retreat.", "Equilibra tiempo al aire libre, atracciones cercanas y horas sin prisa en el refugio."],
  ["Explore activities →", "Explorar actividades →"],
  ["Comfort", "Comodidad"],
  ["Thoughtful details for the stay", "Detalles pensados para tu estadía"],
  ["Understand the shared spaces, meals, amenities, and practical comforts available.", "Conoce los espacios compartidos, comidas, amenidades y comodidades disponibles."],
  ["See amenities →", "Ver amenidades →"],
  ["Guest reassurance and arrival guidance", "Reseñas de huéspedes y orientación para llegar"],
  ["Guests love their stay", "A los huéspedes les encanta su estadía"],
  ["Reassurance from people who came before you.", "Confianza de quienes ya nos visitaron."],
  ["Google review", "Reseña de Google"],
  ["Read reviews", "Leer reseñas"],
  ["Write a review", "Escribir una reseña"],
  ["Arrival with confidence", "Llegada con confianza"],
  ["Know what to expect before you leave Quito.", "Sabe qué esperar antes de salir de Quito."],
  ["Rural mountain travel is easier when timing, transportation, weather, and access are discussed first.", "Viajar por la montaña es más sencillo cuando se conversa antes sobre horarios, transporte, clima y acceso."],
  ["About two hours from Quito", "A unas dos horas de Quito"],
  ["Actual time depends on your starting point, traffic, weather, and route.", "El tiempo real depende del punto de partida, tráfico, clima y ruta."],
  ["Transportation support", "Ayuda con transporte"],
  ["Share your plans so practical options can be discussed before arrival.", "Comparte tus planes para conversar sobre opciones prácticas antes de llegar."],
  ["Confirmed guest guidance", "Orientación para huéspedes confirmados"],
  ["Detailed location and arrival instructions are provided after confirmation.", "La ubicación detallada y las instrucciones de llegada se comparten después de confirmar."],
  ["Helpful before you choose", "Información útil antes de elegir"],
  ["The first questions, answered clearly.", "Las primeras preguntas, respondidas con claridad."],
  ["These concise answers support trip planning; room and booking pages provide the detailed next step.", "Estas respuestas ayudan a planificar; las páginas de habitaciones y reservas ofrecen el siguiente paso detallado."],
  ["How far is The Cloud Forest Retreat from Quito?", "¿A qué distancia está The Cloud Forest Retreat de Quito?"],
  ["The retreat is about two hours from Quito, but travel time varies with your origin, traffic, weather, road conditions, and route.", "El refugio está a unas dos horas de Quito, pero el tiempo varía según el punto de partida, tráfico, clima, camino y ruta."],
  ["What kind of traveler is the retreat best for?", "¿Para qué tipo de viajero es ideal el refugio?"],
  ["It is especially well suited to couples, nature travelers, birders, wellness travelers, and guests who prefer a quieter private base.", "Es ideal para parejas, viajeros de naturaleza, observadores de aves, viajeros de bienestar y quienes prefieren una base privada y tranquila."],
  ["Can you help with transportation and arrival planning?", "¿Pueden ayudar con el transporte y la llegada?"],
  ["Yes. Share your dates, starting point, group size, and approximate arrival time so practical options can be discussed.", "Sí. Comparte tus fechas, punto de partida, tamaño del grupo y hora aproximada de llegada para conversar sobre opciones prácticas."],
  ["How do I check current room availability?", "¿Cómo consulto la disponibilidad actual?"],
  ["Use the availability request or WhatsApp button. A host can confirm dates, room fit, current pricing, and the details needed to plan your stay.", "Usa la solicitud de disponibilidad o el botón de WhatsApp. Un anfitrión puede confirmar fechas, habitación, precio actual y los detalles para planificar tu estadía."]
]);

let mainEs = mainEn;
for (const [english, spanish] of translations) mainEs = mainEs.replaceAll(english, spanish);
mainEs = mainEs
  .replaceAll('href="/booking/"', 'href="/es/reservas/"')
  .replaceAll('href="/rooms/"', 'href="/es/habitaciones/"')
  .replaceAll('href="/rooms/sunrise-room/"', 'href="/es/habitaciones/habitacion-amanecer/"')
  .replaceAll('href="/rooms/sunset-room/"', 'href="/es/habitaciones/habitacion-atardecer/"')
  .replaceAll('href="/birdwatching-lodge-ecuador/"', 'href="/es/lodge-avistamiento-aves-ecuador/"')
  .replaceAll('href="/features/activities/"', 'href="/es/caracteristicas/actividades/"')
  .replaceAll('href="/features/amenities/"', 'href="/es/caracteristicas/amenidades/"');

function architecture(html) {
  return html.match(/<!-- TCFR_ARCHITECTURE_START -->[\s\S]*?<!-- TCFR_ARCHITECTURE_END -->/)?.[0] || "";
}

function schema({ language, url, title, description, questions }) {
  const graph = [
    {
      "@type": ["LodgingBusiness", "Hotel"],
      "@id": "https://thecloudforestretreat.com/#lodgingbusiness",
      name: "The Cloud Forest Retreat",
      url: "https://thecloudforestretreat.com/",
      description,
      image: "https://thecloudforestretreat.com/assets/images/pages/home/tcfr_images_home_hero-01.jpg",
      priceRange: "$$$",
      address: { "@type": "PostalAddress", addressRegion: "Pichincha", addressCountry: "EC" }
    },
    {
      "@type": "WebSite",
      "@id": "https://thecloudforestretreat.com/#website",
      name: "The Cloud Forest Retreat",
      url: "https://thecloudforestretreat.com/",
      inLanguage: ["en", "es"]
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: language,
      isPartOf: { "@id": "https://thecloudforestretreat.com/#website" },
      about: { "@id": "https://thecloudforestretreat.com/#lodgingbusiness" },
      mainEntity: { "@id": `${url}#faq` }
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      inLanguage: language,
      mainEntity: questions.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text }
      }))
    }
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

function page({ language, title, description, canonical, counterpart, main, related, questions }) {
  const es = language === "es";
  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <meta name="author" content="The Cloud Forest Retreat" />
  <meta name="theme-color" content="#0D5925" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="https://thecloudforestretreat.com/" />
  <link rel="alternate" hreflang="es" href="https://thecloudforestretreat.com/es/" />
  <link rel="alternate" hreflang="x-default" href="https://thecloudforestretreat.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${es ? "es_EC" : "en_US"}" />
  <meta property="og:locale:alternate" content="${es ? "en_US" : "es_EC"}" />
  <meta property="og:site_name" content="The Cloud Forest Retreat" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="https://thecloudforestretreat.com/assets/images/pages/home/tcfr_images_home_hero-01.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="https://thecloudforestretreat.com/assets/images/pages/home/tcfr_images_home_hero-01.jpg" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="/assets/css/site.css?v=2" />
  <link rel="stylesheet" href="/assets/css/header.css?v=5" />
  <link rel="stylesheet" href="/assets/css/global.css?v=4" />
  <link rel="stylesheet" href="/assets/css/footer.css?v=10" />
  <link rel="stylesheet" href="/assets/css/clusters/home.css?v=7" />
  <link rel="stylesheet" href="/assets/css/components/faq.css?v=1" />
  <script type="application/ld+json">
${schema({ language, url: canonical, title, description, questions })}
  </script>
  <script src="/assets/js/site-config.js?v=3"></script>
  <script defer src="/assets/js/head.js?v=2"></script>
</head>
<body data-page-language="${language}" data-page-type="home_page" data-tcfr-cluster="home" data-tcfr-template="premium-home">
  <div id="siteHeader" data-current-lang="${language}"></div>
  <nav class="rawLangLinks" aria-label="${es ? "Selector de idioma" : "Language switch"}">
    <a href="https://thecloudforestretreat.com/" lang="en" hreflang="en"${es ? "" : ' aria-current="page"'}>English</a>
    <a href="https://thecloudforestretreat.com/es/" lang="es" hreflang="es"${es ? ' aria-current="page"' : ""}>Español</a>
  </nav>

  ${main}

  ${related}
  <div id="siteFooter"></div>
  <script src="/assets/js/attribution.js?v=1"></script>
  <script src="/assets/js/site.js?v=8"></script>
</body>
</html>
`;
}

const enQuestions = [
  ["How far is The Cloud Forest Retreat from Quito?", "The retreat is about two hours from Quito, but travel time varies with your origin, traffic, weather, road conditions, and route."],
  ["What kind of traveler is the retreat best for?", "It is especially well suited to couples, nature travelers, birders, wellness travelers, and guests who prefer a quieter private base."],
  ["Can you help with transportation and arrival planning?", "Yes. Share your dates, starting point, group size, and approximate arrival time so practical options can be discussed."],
  ["How do I check current room availability?", "Use the availability request or WhatsApp button. A host can confirm dates, room fit, current pricing, and the details needed to plan your stay."]
];
const esQuestions = enQuestions.map(([q, a]) => [translations.get(q), translations.get(a)]);

await fs.writeFile("index.html", page({
  language: "en",
  title: "The Cloud Forest Retreat | Cloud Forest Lodge Near Quito",
  description: "Stay at The Cloud Forest Retreat near Quito for mountain views, comfortable rooms, birdlife, nature activities, fresh meals, and a quieter Ecuador escape.",
  canonical: "https://thecloudforestretreat.com/",
  counterpart: "https://thecloudforestretreat.com/es/",
  main: mainEn,
  related: architecture(currentEn),
  questions: enQuestions
}));

await fs.writeFile("es/index.html", page({
  language: "es",
  title: "The Cloud Forest Retreat | Lodge de Bosque Nublado Cerca de Quito",
  description: "Hospédate en The Cloud Forest Retreat cerca de Quito para disfrutar vistas, habitaciones cómodas, aves, naturaleza, comida fresca y una escapada tranquila.",
  canonical: "https://thecloudforestretreat.com/es/",
  counterpart: "https://thecloudforestretreat.com/",
  main: mainEs,
  related: architecture(currentEs),
  questions: esQuestions
}));
