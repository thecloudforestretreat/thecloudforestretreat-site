import fs from "node:fs/promises";

const pages = {
  en: {
    lang: "en",
    title: "Rooms at The Cloud Forest Retreat | Near Quito, Ecuador",
    description: "Compare the Panoramic Suite, Sunrise Room, Sunset Room, and shared spaces at The Cloud Forest Retreat near Quito, Ecuador.",
    canonical: "https://thecloudforestretreat.com/rooms/",
    alternate: "https://thecloudforestretreat.com/es/habitaciones/",
    home: "/",
    booking: "/booking/",
    contact: "/contact/",
    commonAreas: "/rooms/common-areas/",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Rooms",
    kicker: "Rest, framed by the landscape",
    h1: "Choose the room that fits your rhythm.",
    lead: "Three distinct rooms share the same cloud forest setting. Compare their light, space, and atmosphere, then choose the one that feels right for your trip.",
    exploreLabel: "Explore the rooms",
    bookingLabel: "Check availability",
    highlights: [["Three room styles", "Choose by view, light, and pace"], ["Shared retreat", "Comfort with common spaces nearby"], ["Direct support", "Ask a host before booking"]],
    choicesEyebrow: "Three ways to wake up here",
    choicesTitle: "A different point of view for every stay",
    choicesIntro: "Each room has its own mood. Compare the options here, then open the room page for photos and the practical details that help you decide.",
    rooms: [
      { name: "Panoramic Suite", href: "/rooms/panoramic-suite/", image: "/assets/images/pages/rooms/tcfr_images_rooms_pano_01.jpg", alt: "Panoramic Suite at The Cloud Forest Retreat", label: "Most spacious", text: "For travelers who want broad views, more room to settle in, and an elevated sense of privacy. It is a strong fit when reading, photography, quiet conversation, and time enjoying the outlook are part of the stay.", tags: ["Wide views", "Private terrace feel"], cta: "Explore the suite" },
      { name: "Sunrise Room", href: "/rooms/sunrise-room/", image: "/assets/images/pages/rooms/tcfr_images_rooms_sunrise_01.jpg", alt: "Sunrise Room at The Cloud Forest Retreat", label: "Morning light", text: "For early risers, birders, and guests who enjoy beginning the day with soft light and a quiet pace. It supports mornings that start gently before breakfast, bird activity, a nature outing, or an unhurried day at the retreat.", tags: ["Early light", "Calm mornings"], cta: "Explore the room" },
      { name: "Sunset Room", href: "/rooms/sunset-room/", image: "/assets/images/pages/rooms/tcfr_images_rooms_sunset_01.jpg", alt: "Sunset Room at The Cloud Forest Retreat", label: "Evening calm", text: "For slow evenings, restful nights, and an easy return after a day exploring the surrounding landscape. It suits travelers who want late-day light and a calm room to come back to after waterfalls, walking, or time in nature.", tags: ["Evening light", "Restful atmosphere"], cta: "Explore the room" }
    ],
    compareEyebrow: "Compare with confidence",
    compareTitle: "Start with how you want the stay to feel.",
    compareText: "The right choice depends on the view, light, space, and daily rhythm you prefer. If you are unsure, share your dates and priorities and a host can recommend the best fit.",
    compareRows: [["Panoramic Suite", "Space and expansive scenery", "Couples and slower stays"], ["Sunrise Room", "Early light and quiet starts", "Birders and morning-focused travelers"], ["Sunset Room", "Evening atmosphere and rest", "Nature escapes and relaxed itineraries"]],
    sharedEyebrow: "Beyond your room",
    sharedTitle: "Space to gather, pause, and feel at home.",
    sharedText: "The common areas complete the stay with places for coffee, conversation, meals, and a quiet reset between time outdoors. Explore the shared spaces before choosing how you want to use the retreat. Seeing them alongside the bedrooms also helps families, couples, and longer-stay guests understand where they can spend time beyond their private room.",
    sharedLink: "Explore the common areas",
    guidanceEyebrow: "Choose for the way you travel",
    guidanceTitle: "The best room is the one that supports your days.",
    guidanceIntro: "A room choice is about more than the bed. Think about when you like to wake, how much time you expect to spend at the retreat, and whether your itinerary is built around birds, nearby nature, or quiet time together.",
    guidance: [
      ["Begin with light and daily rhythm", "The Sunrise Room suits guests who value early light and a calm start before breakfast, birding, or time outdoors. The Sunset Room shifts the emphasis toward late-day atmosphere and a restful return. Neither choice is universally better; the right one depends on the hours you most want the landscape to shape."],
      ["Balance private space and common areas", "Choose the Panoramic Suite when broader views and more room to settle in matter most. Whichever room you select, the shared living and kitchen areas add places to gather, eat, talk, or pause. Reviewing both the room and common-area pages gives you a more complete picture of the stay."],
      ["Confirm the details for your dates", "Availability, current pricing, sleeping arrangements, meal options, and transportation planning can depend on the dates and needs of your trip. Send one availability request with your preferred room and alternatives. A host can confirm the current fit and help you avoid choosing from assumptions alone."]
    ],
    inclusionsEyebrow: "What to confirm before booking",
    inclusionsTitle: "Choose with clear expectations",
    inclusions: [["01", "Sleeping details", "Review the current guest capacity, sleeping arrangement, room layout, and privacy information on each room page."], ["02", "Shared spaces", "See which common areas support meals, conversation, work, or a quiet pause during the stay."], ["03", "Current inclusions", "Use the room page and availability response to confirm amenities, meals, services, and current pricing."], ["04", "Arrival planning", "Discuss transportation, timing, road conditions, and arrival guidance directly with the retreat team."]],
    reviewsEyebrow: "Guests love their stay",
    reviewsTitle: "Real reassurance before you choose",
    ratingLabel: "9 reviews",
    reviews: [["V Arguello", "Fantastic place to disconnect and get in touch with nature. This unique experience can be as customized as you want."], ["Abigail Martin", "Absolutely magical experience at the cloud forest retreat. The views are incredible. The hosts are attentive, friendly, and welcoming."], ["Pauline Witzke", "Beautiful accommodations and meals with a lovely host and views that cannot be beat. Highly recommend."]],
    readReviews: "Read reviews",
    writeReview: "Write a review",
    faqEyebrow: "Helpful before you choose",
    faqTitle: "The practical answers that make choosing easy",
    faqIntro: "Start with the questions guests ask most often, then open a room page or contact us for details tied to your dates.",
    faqs: [["Which room has the best view?", "The Panoramic Suite is the strongest fit for travelers prioritizing broad views and more space. The Sunrise and Sunset rooms offer different light and atmosphere."], ["Can you help me choose the right room?", "Yes. Share your dates, group size, and preferred atmosphere through the availability form or WhatsApp, and a host can recommend the best fit."], ["Are common areas included with the stay?", "The common-areas page shows the shared spaces at the retreat. Your availability response can confirm current access and any practical guidelines for your stay."], ["How do I confirm current availability and pricing?", "Use the availability request for exact dates and room preferences. A host will reply with current options, pricing, and the information needed to plan your stay."]],
    relatedEyebrow: "Continue exploring",
    relatedTitle: "Plan your cloud forest stay",
    related: [["Panoramic Suite", "/rooms/panoramic-suite/"], ["Sunrise Room", "/rooms/sunrise-room/"], ["Sunset Room", "/rooms/sunset-room/"], ["Common Areas", "/rooms/common-areas/"], ["Cloud Forest Lodge Near Quito", "/cloud-forest-lodge-near-quito/"], ["Best Eco Lodge Near Quito", "/best-eco-lodge-quito/"], ["Where to Stay Near Quito for Nature", "/where-to-stay-near-quito-nature/"], ["What to Pack for the Cloud Forest", "/what-to-pack-cloud-forest-ecuador/"]],
    contactLabel: "Ask a question"
  },
  es: {
    lang: "es",
    title: "Habitaciones de The Cloud Forest Retreat | Cerca de Quito",
    description: "Compara la Suite Panorámica, Habitación Amanecer, Habitación Atardecer y áreas comunes de The Cloud Forest Retreat cerca de Quito.",
    canonical: "https://thecloudforestretreat.com/es/habitaciones/",
    alternate: "https://thecloudforestretreat.com/rooms/",
    home: "/es/",
    booking: "/es/reservas/",
    contact: "/es/contacto/",
    commonAreas: "/es/habitaciones/areas-comunes/",
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Habitaciones",
    kicker: "Descanso enmarcado por el paisaje",
    h1: "Elige la habitación que se adapta a tu ritmo.",
    lead: "Tres habitaciones distintas comparten el mismo entorno de bosque nublado. Compara su luz, espacio y ambiente, y elige la que se siente adecuada para tu viaje.",
    exploreLabel: "Explorar las habitaciones",
    bookingLabel: "Consultar disponibilidad",
    highlights: [["Tres estilos", "Elige según vistas, luz y ritmo"], ["Refugio compartido", "Comodidad y áreas comunes cercanas"], ["Ayuda directa", "Consulta con un anfitrión antes de reservar"]],
    choicesEyebrow: "Tres maneras de despertar aquí",
    choicesTitle: "Una perspectiva diferente para cada estadía",
    choicesIntro: "Cada habitación tiene su propio ambiente. Compara las opciones y abre su página para ver fotos y detalles prácticos antes de decidir.",
    rooms: [
      { name: "Suite Panorámica", href: "/es/habitaciones/suite-panoramica/", image: "/assets/images/pages/rooms/tcfr_images_rooms_pano_01.jpg", alt: "Suite Panorámica en The Cloud Forest Retreat", label: "Más espaciosa", text: "Para quienes buscan vistas amplias, más espacio para instalarse y una mayor sensación de privacidad. Es una buena opción cuando la lectura, la fotografía, la conversación tranquila y el tiempo disfrutando el paisaje forman parte de la estadía.", tags: ["Vistas amplias", "Sensación de terraza privada"], cta: "Explorar la suite" },
      { name: "Habitación Amanecer", href: "/es/habitaciones/habitacion-amanecer/", image: "/assets/images/pages/rooms/tcfr_images_rooms_sunrise_01.jpg", alt: "Habitación Amanecer en The Cloud Forest Retreat", label: "Luz de mañana", text: "Para quienes madrugan, observadores de aves y huéspedes que disfrutan comenzar el día con luz suave y tranquilidad. Acompaña mañanas pausadas antes del desayuno, la actividad de las aves, una salida de naturaleza o un día sin prisa en el refugio.", tags: ["Luz temprana", "Mañanas tranquilas"], cta: "Explorar la habitación" },
      { name: "Habitación Atardecer", href: "/es/habitaciones/habitacion-atardecer/", image: "/assets/images/pages/rooms/tcfr_images_rooms_sunset_01.jpg", alt: "Habitación Atardecer en The Cloud Forest Retreat", label: "Calma al atardecer", text: "Para tardes pausadas, noches reparadoras y un regreso tranquilo después de explorar el paisaje. Funciona para viajeros que valoran la luz al final del día y una habitación serena después de cascadas, caminatas o tiempo en la naturaleza.", tags: ["Luz de tarde", "Ambiente reparador"], cta: "Explorar la habitación" }
    ],
    compareEyebrow: "Compara con confianza",
    compareTitle: "Comienza por cómo quieres vivir la estadía.",
    compareText: "La elección depende de las vistas, la luz, el espacio y el ritmo diario que prefieres. Si tienes dudas, comparte tus fechas y prioridades para recibir una recomendación.",
    compareRows: [["Suite Panorámica", "Espacio y paisaje amplio", "Parejas y estadías pausadas"], ["Habitación Amanecer", "Luz temprana y comienzos tranquilos", "Observadores de aves y madrugadores"], ["Habitación Atardecer", "Ambiente de tarde y descanso", "Escapadas de naturaleza e itinerarios relajados"]],
    sharedEyebrow: "Más allá de tu habitación",
    sharedTitle: "Espacio para reunirse, pausar y sentirse en casa.",
    sharedText: "Las áreas comunes completan la estadía con lugares para café, conversación, comidas y una pausa entre momentos al aire libre. Conoce estos espacios antes de decidir cómo quieres disfrutar el refugio. Verlos junto con las habitaciones también ayuda a familias, parejas y huéspedes de estadías largas a entender dónde pueden pasar tiempo fuera de su espacio privado.",
    sharedLink: "Explorar las áreas comunes",
    guidanceEyebrow: "Elige según tu forma de viajar",
    guidanceTitle: "La mejor habitación es la que acompaña tus días.",
    guidanceIntro: "Elegir una habitación implica más que la cama. Piensa a qué hora prefieres despertar, cuánto tiempo pasarás en el refugio y si tu itinerario gira alrededor de aves, naturaleza cercana o momentos tranquilos en pareja.",
    guidance: [
      ["Comienza por la luz y el ritmo diario", "La Habitación Amanecer funciona para quienes valoran la luz temprana y un comienzo tranquilo antes del desayuno, el avistamiento o una salida. La Habitación Atardecer pone el énfasis en el ambiente de la tarde y un regreso reparador. La mejor opción depende de las horas en que quieres sentir más el paisaje."],
      ["Equilibra el espacio privado y las áreas comunes", "Elige la Suite Panorámica cuando las vistas amplias y el espacio para instalarte sean prioritarios. En cualquier habitación, la sala y la cocina compartidas ofrecen lugares para reunirse, comer, conversar o pausar. Revisar la habitación y las áreas comunes permite entender la estadía completa."],
      ["Confirma los detalles para tus fechas", "La disponibilidad, el precio actual, la distribución para dormir, las comidas y el transporte pueden depender de las fechas y necesidades del viaje. Envía una sola solicitud con tu habitación preferida y alternativas. Un anfitrión confirmará la opción actual para que no tengas que decidir basándote en suposiciones."]
    ],
    inclusionsEyebrow: "Qué confirmar antes de reservar",
    inclusionsTitle: "Elige con expectativas claras",
    inclusions: [["01", "Detalles para dormir", "Revisa en cada página la capacidad actual, distribución para dormir, espacio y privacidad de la habitación."], ["02", "Espacios compartidos", "Conoce las áreas comunes para comidas, conversación, trabajo o una pausa tranquila durante la estadía."], ["03", "Inclusiones actuales", "Usa la página de la habitación y la respuesta de disponibilidad para confirmar amenidades, comidas, servicios y precio."], ["04", "Planificación de llegada", "Conversa directamente con el equipo sobre transporte, horarios, camino y orientación para llegar."]],
    reviewsEyebrow: "A los huéspedes les encanta su estadía",
    reviewsTitle: "Confianza real antes de elegir",
    ratingLabel: "9 reseñas",
    reviews: [["V Arguello", "Un lugar fantástico para desconectarse y estar en contacto con la naturaleza. Esta experiencia única se puede personalizar como quieras."], ["Abigail Martin", "Una experiencia absolutamente mágica en The Cloud Forest Retreat. Las vistas son increíbles y los anfitriones son atentos, amables y acogedores."], ["Pauline Witzke", "Hermosas habitaciones y comidas con una anfitriona encantadora y vistas inigualables. Muy recomendado."]],
    readReviews: "Leer reseñas",
    writeReview: "Escribir una reseña",
    faqEyebrow: "Información útil antes de elegir",
    faqTitle: "Respuestas prácticas para elegir con facilidad",
    faqIntro: "Comienza con las preguntas más frecuentes y abre la página de una habitación o contáctanos para detalles según tus fechas.",
    faqs: [["¿Qué habitación tiene la mejor vista?", "La Suite Panorámica es la opción más indicada para quienes priorizan vistas amplias y mayor espacio. Las habitaciones Amanecer y Atardecer ofrecen luces y ambientes diferentes."], ["¿Pueden ayudarme a elegir la habitación adecuada?", "Sí. Comparte fechas, número de huéspedes y ambiente preferido mediante la solicitud de disponibilidad o WhatsApp para recibir una recomendación."], ["¿Las áreas comunes están incluidas en la estadía?", "La página de áreas comunes muestra los espacios compartidos del refugio. La respuesta de disponibilidad puede confirmar el acceso actual y las pautas prácticas para tu estadía."], ["¿Cómo confirmo disponibilidad y precio actuales?", "Usa la solicitud de disponibilidad con fechas y preferencias. Un anfitrión responderá con opciones, precios actuales e información para planificar."]],
    relatedEyebrow: "Sigue explorando",
    relatedTitle: "Planifica tu estadía en el bosque nublado",
    related: [["Suite Panorámica", "/es/habitaciones/suite-panoramica/"], ["Habitación Amanecer", "/es/habitaciones/habitacion-amanecer/"], ["Habitación Atardecer", "/es/habitaciones/habitacion-atardecer/"], ["Áreas comunes", "/es/habitaciones/areas-comunes/"], ["Lodge de bosque nublado cerca de Quito", "/es/lodge-bosque-nublado-cerca-de-quito/"], ["Mejor eco lodge cerca de Quito", "/es/mejor-eco-lodge-quito/"], ["Dónde alojarse cerca de Quito para naturaleza", "/es/donde-alojarse-cerca-de-quito-naturaleza/"], ["Qué llevar al bosque nublado", "/es/que-llevar-bosque-nublado-ecuador/"]],
    contactLabel: "Hacer una pregunta"
  }
};

function analytics(event, location, label = "") {
  return `data-analytics-event="${event}" data-analytics-location="${location}" data-analytics-page-type="rooms_hub"${label ? ` data-analytics-label="${label}"` : ""}`;
}

function schema(p) {
  const roomItems = p.rooms.map((room, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "HotelRoom", name: room.name, description: room.text, url: `https://thecloudforestretreat.com${room.href}`, image: `https://thecloudforestretreat.com${room.image}` } }));
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": ["LodgingBusiness", "BedAndBreakfast"], "@id": "https://thecloudforestretreat.com/#lodging", name: "The Cloud Forest Retreat", url: "https://thecloudforestretreat.com/", image: "https://thecloudforestretreat.com/assets/images/pages/rooms/tcfr_images_rooms_hero.jpg", address: { "@type": "PostalAddress", addressRegion: "Pichincha", addressCountry: "EC" } },
    { "@type": "CollectionPage", "@id": `${p.canonical}#webpage`, url: p.canonical, name: p.title, description: p.description, inLanguage: p.lang, about: { "@id": "https://thecloudforestretreat.com/#lodging" }, mainEntity: { "@id": `${p.canonical}#rooms` }, breadcrumb: { "@id": `${p.canonical}#breadcrumb` } },
    { "@type": "ItemList", "@id": `${p.canonical}#rooms`, name: p.breadcrumbCurrent, itemListElement: roomItems },
    { "@type": "BreadcrumbList", "@id": `${p.canonical}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: p.breadcrumbHome, item: `https://thecloudforestretreat.com${p.home}` }, { "@type": "ListItem", position: 2, name: p.breadcrumbCurrent, item: p.canonical }] },
    { "@type": "FAQPage", "@id": `${p.canonical}#faq`, inLanguage: p.lang, mainEntity: p.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  ] }, null, 2);
}

function render(p) {
  const es = p.lang === "es";
  const roomCards = p.rooms.map((room) => `
          <a class="roomsChoice" href="${room.href}" ${analytics("room_view_click", "room_choices", room.name)}>
            <div class="roomsChoice__image">
              <img src="${room.image}" alt="${room.alt}" loading="lazy" decoding="async" />
              <span class="roomsChoice__label">${room.label}</span>
            </div>
            <div class="roomsChoice__body">
              <h3>${room.name}</h3>
              <p>${room.text}</p>
              <div class="roomsChoice__details">
                ${room.tags.map((tag) => `<span>${tag}</span>`).join("\n                ")}
              </div>
              <strong class="roomsChoice__link">${room.cta} →</strong>
            </div>
          </a>`).join("");
  const reviewCards = p.reviews.map(([name, text]) => `
          <article class="roomsReview">
            <div class="roomsReview__stars" aria-label="${es ? "5 de 5 estrellas" : "5 out of 5 stars"}">★★★★★</div>
            <p>“${text}”</p>
            <footer>
              <strong>${name}</strong>
              <span>${es ? "Reseña de Google" : "Google review"}</span>
            </footer>
          </article>`).join("");
  const faqHtml = p.faqs.map(([question, answer]) => `
          <details>
            <summary>${question}</summary>
            <p>${answer}</p>
          </details>`).join("");
  const related = p.related.map(([label, href]) => `
          <a class="tcfr-related__link" href="${href}" ${analytics("internal_link_click", "related_content", label)}>${label}</a>`).join("");
  const highlights = p.highlights.map(([title, text]) => `
            <div>
              <strong>${title}</strong>
              <span>${text}</span>
            </div>`).join("");
  const compareRows = p.compareRows.map(([name, fit, traveler]) => `
          <div class="roomsCompare__row" role="listitem">
            <strong>${name}</strong>
            <span>${fit}</span>
            <span>${traveler}</span>
          </div>`).join("");
  const inclusions = p.inclusions.map(([number, title, text]) => `
          <article class="roomsInclusion">
            <span>${number}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join("");
  const guidance = p.guidance.map(([title, text], index) => `
          <article class="roomsGuidance__card">
            <span>0${index + 1}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join("");

  return `<!DOCTYPE html>
<html lang="${p.lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title}</title>
    <meta name="description" content="${p.description}" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="theme-color" content="#0D5925" />
    <link rel="canonical" href="${p.canonical}" />
    <link rel="alternate" hreflang="en" href="https://thecloudforestretreat.com/rooms/" />
    <link rel="alternate" hreflang="es" href="https://thecloudforestretreat.com/es/habitaciones/" />
    <link rel="alternate" hreflang="x-default" href="https://thecloudforestretreat.com/rooms/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="The Cloud Forest Retreat" />
    <meta property="og:locale" content="${es ? "es_EC" : "en_US"}" />
    <meta property="og:title" content="${p.title}" />
    <meta property="og:description" content="${p.description}" />
    <meta property="og:url" content="${p.canonical}" />
    <meta property="og:image" content="https://thecloudforestretreat.com/assets/images/pages/rooms/tcfr_images_rooms_hero.jpg" />
    <meta property="og:image:alt" content="${es ? "Habitación con vista al bosque nublado" : "Guest room overlooking the cloud forest"}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${p.title}" />
    <meta name="twitter:description" content="${p.description}" />
    <meta name="twitter:image" content="https://thecloudforestretreat.com/assets/images/pages/rooms/tcfr_images_rooms_hero.jpg" />
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
    <link rel="stylesheet" href="/assets/css/clusters/rooms.css?v=7" />
    <link rel="stylesheet" href="/assets/css/components/faq.css?v=2" />
    <script type="application/ld+json">
${schema(p)}
    </script>
    <script src="/assets/js/site-config.js?v=3"></script>
    <script defer src="/assets/js/head.js?v=2"></script>
  </head>
  <body data-page-language="${p.lang}" data-page-type="rooms_hub" data-tcfr-cluster="rooms" data-tcfr-template="premium-rooms">
    <div id="siteHeader" data-current-lang="${p.lang}"></div>
    <nav class="rawLangLinks" aria-label="${es ? "Selector de idioma" : "Language switch"}">
      <a href="https://thecloudforestretreat.com/rooms/" lang="en" hreflang="en" ${analytics("language_switch_click", "language_switch", "English")}${es ? "" : ' aria-current="page"'}>English</a>
      <a href="https://thecloudforestretreat.com/es/habitaciones/" lang="es" hreflang="es" ${analytics("language_switch_click", "language_switch", "Español")}${es ? ' aria-current="page"' : ""}>Español</a>
    </nav>

    <main class="roomsPreview" aria-label="${p.breadcrumbCurrent}">
      <nav class="roomsPreview__crumbs" aria-label="${es ? "Migas de pan" : "Breadcrumb"}">
        <a href="${p.home}" ${analytics("internal_link_click", "breadcrumb", p.breadcrumbHome)}>${p.breadcrumbHome}</a>
        <span aria-hidden="true">/</span>
        <span>${p.breadcrumbCurrent}</span>
      </nav>

      <section class="roomsShowcase" aria-labelledby="rooms-title" data-analytics-section="rooms_hero">
        <div class="roomsShowcase__copy">
          <p class="roomsEyebrow">${p.kicker}</p>
          <h1 id="rooms-title">${p.h1}</h1>
          <p class="roomsShowcase__lead">${p.lead}</p>
          <div class="roomsShowcase__actions">
            <a class="btn primary" href="#room-options" ${analytics("internal_link_click", "rooms_hero", p.exploreLabel)}>${p.exploreLabel}</a>
            <a class="btn roomsButtonLight" href="${p.booking}" ${analytics("booking_cta_click", "rooms_hero", p.bookingLabel)}>${p.bookingLabel}</a>
          </div>
        </div>
        <div class="roomsShowcase__media">
          <img src="/assets/images/pages/rooms/tcfr_images_rooms_hero.jpg" alt="${es ? "Habitación de The Cloud Forest Retreat con vista al paisaje" : "A welcoming room overlooking the Ecuadorian cloud forest"}" loading="eager" decoding="async" />
          <div class="roomsShowcase__note" aria-label="${es ? "Aspectos de la estadía" : "Stay highlights"}">${highlights}
          </div>
        </div>
      </section>

      <section class="roomsSection" id="room-options" aria-labelledby="room-options-title" data-analytics-section="room_choices">
        <header class="roomsSectionHeading roomsSectionHeading--center">
          <p class="roomsEyebrow roomsEyebrow--dark">${p.choicesEyebrow}</p>
          <h2 id="room-options-title">${p.choicesTitle}</h2>
          <p>${p.choicesIntro}</p>
        </header>
        <div class="roomsChoices">${roomCards}
        </div>
      </section>

      <section class="roomsSection roomsCompare" aria-labelledby="rooms-compare-title" data-analytics-section="room_comparison">
        <div class="roomsCompare__intro">
          <p class="roomsEyebrow">${p.compareEyebrow}</p>
          <h2 id="rooms-compare-title">${p.compareTitle}</h2>
          <p>${p.compareText}</p>
        </div>
        <div class="roomsCompare__rows" role="list" aria-label="${es ? "Comparación de habitaciones" : "Room comparison guidance"}">${compareRows}
        </div>
      </section>

      <section class="roomsSection roomsShared" aria-labelledby="shared-spaces-title" data-analytics-section="common_areas">
        <div class="roomsShared__gallery">
          <img src="/assets/images/pages/rooms/tcfr_rooms_common_area_living_room_01.jpeg" alt="${es ? "Sala común de The Cloud Forest Retreat" : "Common living area at The Cloud Forest Retreat"}" loading="lazy" decoding="async" />
          <img src="/assets/images/pages/rooms/tcfr_rooms_common_area_kitchen_01.jpeg" alt="${es ? "Cocina compartida de The Cloud Forest Retreat" : "Shared kitchen at The Cloud Forest Retreat"}" loading="lazy" decoding="async" />
        </div>
        <div class="roomsShared__copy">
          <p class="roomsEyebrow roomsEyebrow--dark">${p.sharedEyebrow}</p>
          <h2 id="shared-spaces-title">${p.sharedTitle}</h2>
          <p>${p.sharedText}</p>
          <a class="roomsTextLink" href="${p.commonAreas}" ${analytics("internal_link_click", "common_areas", p.sharedLink)}>${p.sharedLink} →</a>
        </div>
      </section>

      <section class="roomsSection roomsGuidance" aria-labelledby="rooms-guidance-title" data-analytics-section="room_selection_guidance">
        <header class="roomsSectionHeading">
          <p class="roomsEyebrow roomsEyebrow--dark">${p.guidanceEyebrow}</p>
          <h2 id="rooms-guidance-title">${p.guidanceTitle}</h2>
          <p>${p.guidanceIntro}</p>
        </header>
        <div class="roomsGuidance__grid">${guidance}
        </div>
      </section>

      <section class="roomsSection roomsInclusions" aria-labelledby="rooms-inclusions-title" data-analytics-section="room_expectations">
        <p class="roomsEyebrow roomsEyebrow--dark">${p.inclusionsEyebrow}</p>
        <h2 id="rooms-inclusions-title">${p.inclusionsTitle}</h2>
        <div class="roomsInclusions__grid">${inclusions}
        </div>
      </section>

      <section class="roomsSection roomsReviews" aria-labelledby="rooms-reviews-title" data-analytics-section="reviews">
        <header class="roomsReviews__head">
          <div>
            <p class="roomsEyebrow roomsEyebrow--dark">${p.reviewsEyebrow}</p>
            <h2 id="rooms-reviews-title">${p.reviewsTitle}</h2>
          </div>
          <div class="roomsRating" aria-label="${es ? "Calificación de Google" : "Google rating"}">
            <strong>5.0</strong>
            <span aria-hidden="true">★★★★★</span>
            <small>(${p.ratingLabel})</small>
          </div>
        </header>
        <div class="roomsReviews__grid">${reviewCards}
        </div>
        <div class="roomsReviews__links">
          <a href="https://g.page/r/CQq5wBqKgv0DEAE" target="_blank" rel="noopener" ${analytics("review_click", "reviews", p.readReviews)}>${p.readReviews}</a>
          <a href="https://g.page/r/CQq5wBqKgv0DEAE/review" target="_blank" rel="noopener" ${analytics("review_click", "reviews", p.writeReview)}>${p.writeReview}</a>
        </div>
      </section>

      <section class="roomsSection roomsFaq tcfrFaq" id="faq" aria-labelledby="rooms-faq-title" data-analytics-section="faq">
        <div class="roomsFaq__intro tcfrFaq__intro">
          <p class="roomsEyebrow roomsEyebrow--dark">${p.faqEyebrow}</p>
          <h2 id="rooms-faq-title">${p.faqTitle}</h2>
          <p>${p.faqIntro}</p>
        </div>
        <div class="roomsFaq__list tcfrFaq__list">${faqHtml}
        </div>
      </section>

      <!-- TCFR_ARCHITECTURE_START -->
      <section class="tcfr-related" aria-labelledby="tcfr-related-title" data-analytics-section="related_content">
        <p class="tcfr-related__eyebrow">${p.relatedEyebrow}</p>
        <h2 class="tcfr-related__title" id="tcfr-related-title">${p.relatedTitle}</h2>
        <div class="tcfr-related__grid">${related}
        </div>
        <div class="tcfr-related__cta">
          <a class="btn primary" href="${p.booking}" ${analytics("booking_cta_click", "related_content", p.bookingLabel)}>${p.bookingLabel}</a>
          <a class="btn secondary" href="${p.contact}" ${analytics("contact_cta_click", "related_content", p.contactLabel)}>${p.contactLabel}</a>
        </div>
      </section>
      <!-- TCFR_ARCHITECTURE_END -->
    </main>

    <div id="siteFooter"></div>
    <script src="/assets/js/attribution.js?v=1"></script>
    <script src="/assets/js/site.js?v=8"></script>
  </body>
</html>
`;
}

await fs.writeFile("rooms/index.html", render(pages.en), "utf8");
await fs.writeFile("es/habitaciones/index.html", render(pages.es), "utf8");
console.log("updated rooms/index.html");
console.log("updated es/habitaciones/index.html");
