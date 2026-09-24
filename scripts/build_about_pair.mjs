import fs from "node:fs/promises";

const pages = {
  en: {
    lang: "en",
    title: "About The Cloud Forest Retreat | Our Story and Setting",
    description: "Learn the story, mountain setting, values, and owner-hosted approach behind The Cloud Forest Retreat near Quito, Ecuador.",
    canonical: "https://thecloudforestretreat.com/about/",
    alternate: "https://thecloudforestretreat.com/es/sobre-nosotros/",
    home: "/",
    rooms: "/rooms/",
    booking: "/booking/",
    contact: "/contact/",
    features: "/features/",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "About",
    roomsLabel: "Explore rooms",
    bookingLabel: "Book your stay",
    kicker: "Owner-hosted cloud forest retreat",
    h1: "A retreat created for quieter, more connected stays.",
    lead: "The Cloud Forest Retreat brings comfortable rooms, mountain views, fresh food, and personal planning support together in one private Pichincha setting.",
    overviewEyebrow: "The setting",
    overviewTitle: "A mountainside base for nature, rest, and time together.",
    overviewText: "Set within the Chocó Andino de Pichincha, the retreat is designed for slow mornings, broad valley views, and practical access to the cloud forest experiences guests come to Ecuador to enjoy.",
    facts: [
      ["Setting", "Cloud forest mountainside"],
      ["Hosting", "Direct, owner-hosted support"],
      ["Stay style", "Private, comfortable, unhurried"],
      ["Best suited to", "Couples, families, birders, and nature travelers"]
    ],
    storyEyebrow: "Our story",
    storyTitle: "Built from a long-term connection to this landscape.",
    storyParagraphs: [
      "The Cloud Forest Retreat began with a straightforward idea: make it possible for guests to experience this remarkable setting without giving up comfort, privacy, or reliable help planning the stay.",
      "Mist moves through the valley, birds pass through the canopy, and the pace naturally slows. The property was developed to let those qualities remain central—from the rooms and shared spaces to meals, excursions, and arrival guidance."
    ],
    quote: "We want guests to feel cared for while still having the space and quiet to experience the forest on their own terms.",
    storyCaption: "The retreat within its mountain setting",
    mediaEyebrow: "See the retreat",
    mediaTitle: "A closer look at the property and valley.",
    mediaCaption: "An owner-hosted stay surrounded by mountain views",
    videoTitle: "The Cloud Forest Retreat overview video",
    offerEyebrow: "What guests can expect",
    offerTitle: "Comfort and nature, planned as one stay.",
    offerText: "Each part of the experience is presented clearly so guests can decide what fits their travel style before booking.",
    offers: [
      ["Comfortable rooms", "Private rooms with warmth, practical details, and views that keep the landscape present."],
      ["Fresh meals", "Food prepared with garden ingredients and products sourced from nearby growers when available."],
      ["Wellness by request", "Yoga, meditation, and restorative sessions can be discussed before the stay."],
      ["Nature experiences", "Birdwatching, guided walks, nearby waterfalls, and other outings can be planned around conditions."],
      ["Arrival support", "Transportation questions, timing, and route expectations are handled directly before arrival."],
      ["Camping options", "Guests who want a simpler outdoor experience can ask about current camping possibilities."]
    ],
    commitmentEyebrow: "Our commitment",
    commitmentTitle: "Thoughtful hosting in a globally important ecosystem.",
    commitmentText: "The retreat sits within the Chocó Andino de Pichincha, a UNESCO Biosphere Reserve region. Decisions about the property and guest experience are made with the surrounding habitat, water, energy, and local community in mind.",
    practices: ["Lower-impact property decisions", "Responsible water and energy use", "Local sourcing where practical", "Respect for wildlife and surrounding habitat"],
    ctaTitle: "Ready to plan your cloud forest stay?",
    ctaText: "Share your dates, room needs, transportation questions, and the experiences you are considering. A host will help you work through the details.",
    contactLabel: "Ask a question",
    featuresLabel: "Explore experiences",
    faqEyebrow: "Helpful before you plan",
    faqTitle: "Questions about the retreat",
    faqIntro: "Clear answers about the setting, travel time, who the stay fits, and how to begin planning.",
    faqs: [
      ["What is The Cloud Forest Retreat?", "The Cloud Forest Retreat is an intimate, owner-hosted mountainside bed and breakfast in Pichincha, Ecuador, created for quiet stays, nature experiences, and direct personal planning support."],
      ["How far is the retreat from Quito?", "The retreat is approximately two hours from Quito. Travel time depends on your starting point, traffic, weather, road conditions, and route."],
      ["Who is the retreat best for?", "It is especially well suited to couples, nature travelers, birders, wellness travelers, families, and guests who prefer a quieter base near Quito."],
      ["How can I plan a stay?", "Use the availability request, contact page, or WhatsApp widget to share your possible dates, room needs, transportation questions, and travel plans."]
    ],
    relatedEyebrow: "Continue exploring",
    relatedTitle: "Plan your cloud forest stay",
    related: [["Romantic Getaway Near Quito", "/romantic-getaway-quito/"], ["Wellness Retreat Near Quito", "/wellness-retreat-quito/"], ["Cloud Forest Lodge Near Quito", "/cloud-forest-lodge-near-quito/"], ["Eco Lodge Quito Ecuador", "/eco-lodge-quito-ecuador/"], ["Weekend Getaway from Quito", "/weekend-getaway-from-quito/"], ["Cloud Forest Quito Ecuador", "/cloud-forest-quito-ecuador/"]]
  },
  es: {
    lang: "es",
    title: "Sobre The Cloud Forest Retreat | Historia y Entorno",
    description: "Conoce la historia, el entorno de montaña, los valores y la atención de anfitriones de The Cloud Forest Retreat cerca de Quito, Ecuador.",
    canonical: "https://thecloudforestretreat.com/es/sobre-nosotros/",
    alternate: "https://thecloudforestretreat.com/about/",
    home: "/es/",
    rooms: "/es/habitaciones/",
    booking: "/es/reservas/",
    contact: "/es/contacto/",
    features: "/es/caracteristicas/",
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Sobre nosotros",
    roomsLabel: "Explorar habitaciones",
    bookingLabel: "Reservar estadía",
    kicker: "Refugio de bosque nublado atendido por sus propietarios",
    h1: "Un refugio creado para estadías tranquilas y conectadas.",
    lead: "The Cloud Forest Retreat reúne habitaciones cómodas, vistas de montaña, comida fresca y ayuda personal para planificar en un entorno privado de Pichincha.",
    overviewEyebrow: "El entorno",
    overviewTitle: "Una base de montaña para la naturaleza, el descanso y el tiempo juntos.",
    overviewText: "Ubicado en el Chocó Andino de Pichincha, el refugio está pensado para mañanas lentas, amplias vistas al valle y acceso práctico a las experiencias de bosque nublado que atraen a los viajeros a Ecuador.",
    facts: [["Entorno", "Ladera de bosque nublado"], ["Atención", "Ayuda directa de los propietarios"], ["Estilo", "Privado, cómodo y sin prisa"], ["Ideal para", "Parejas, familias, observadores de aves y viajeros de naturaleza"]],
    storyEyebrow: "Nuestra historia",
    storyTitle: "Nacido de una conexión duradera con este paisaje.",
    storyParagraphs: [
      "The Cloud Forest Retreat comenzó con una idea directa: permitir que los huéspedes vivan este entorno extraordinario sin renunciar a la comodidad, la privacidad ni la ayuda confiable para planificar.",
      "La neblina se mueve por el valle, las aves pasan por el dosel y el ritmo baja de forma natural. La propiedad fue desarrollada para mantener esas cualidades en el centro, desde las habitaciones y espacios compartidos hasta las comidas, excursiones y orientación para llegar."
    ],
    quote: "Queremos que los huéspedes se sientan atendidos y, al mismo tiempo, tengan el espacio y la tranquilidad para vivir el bosque a su manera.",
    storyCaption: "El refugio dentro de su entorno de montaña",
    mediaEyebrow: "Conoce el refugio",
    mediaTitle: "Una mirada más cercana a la propiedad y al valle.",
    mediaCaption: "Una estadía atendida por sus propietarios y rodeada de montañas",
    videoTitle: "Video de The Cloud Forest Retreat",
    offerEyebrow: "Lo que pueden esperar los huéspedes",
    offerTitle: "Comodidad y naturaleza, planificadas como una sola estadía.",
    offerText: "Cada parte de la experiencia se presenta con claridad para que puedas decidir qué se adapta a tu viaje antes de reservar.",
    offers: [["Habitaciones cómodas", "Habitaciones privadas con calidez, detalles prácticos y vistas que mantienen presente el paisaje."], ["Comidas frescas", "Alimentos preparados con ingredientes de la huerta y productos de agricultores cercanos cuando están disponibles."], ["Bienestar a pedido", "Yoga, meditación y sesiones reparadoras se pueden conversar antes de la estadía."], ["Experiencias de naturaleza", "Avistamiento de aves, caminatas guiadas, cascadas cercanas y otras salidas según las condiciones."], ["Ayuda para llegar", "Las preguntas de transporte, horarios y ruta se atienden directamente antes de la llegada."], ["Opciones de camping", "Quienes buscan una experiencia sencilla al aire libre pueden consultar las posibilidades actuales."]],
    commitmentEyebrow: "Nuestro compromiso",
    commitmentTitle: "Hospitalidad consciente en un ecosistema de importancia mundial.",
    commitmentText: "El refugio se encuentra en el Chocó Andino de Pichincha, una región reconocida como Reserva de Biosfera por la UNESCO. Las decisiones sobre la propiedad y la experiencia consideran el hábitat, el agua, la energía y la comunidad local.",
    practices: ["Decisiones de menor impacto", "Uso responsable de agua y energía", "Abastecimiento local cuando es práctico", "Respeto por la fauna y el hábitat"],
    ctaTitle: "¿Listo para planificar tu estadía?",
    ctaText: "Comparte fechas, habitación, transporte y las experiencias que estás considerando. Un anfitrión te ayudará a organizar los detalles.",
    contactLabel: "Hacer una pregunta",
    featuresLabel: "Explorar experiencias",
    faqEyebrow: "Información útil antes de planificar",
    faqTitle: "Preguntas sobre el refugio",
    faqIntro: "Respuestas claras sobre el entorno, el tiempo de viaje, para quién es ideal y cómo comenzar a planificar.",
    faqs: [["¿Qué es The Cloud Forest Retreat?", "The Cloud Forest Retreat es un bed and breakfast íntimo de montaña atendido por sus propietarios en Pichincha, Ecuador, creado para estadías tranquilas, naturaleza y ayuda personal para planificar."], ["¿A qué distancia está el refugio de Quito?", "El refugio está aproximadamente a dos horas de Quito. El tiempo depende del punto de partida, tráfico, clima, condiciones del camino y ruta."], ["¿Para quién es ideal el refugio?", "Es especialmente adecuado para parejas, viajeros de naturaleza, observadores de aves, viajeros de bienestar, familias y quienes prefieren una base tranquila cerca de Quito."], ["¿Cómo puedo planificar una estadía?", "Usa la solicitud de disponibilidad, la página de contacto o el botón de WhatsApp para compartir fechas posibles, habitación, transporte y planes de viaje."]],
    relatedEyebrow: "Sigue explorando",
    relatedTitle: "Planifica tu estadía en el bosque nublado",
    related: [["Escapada romántica cerca de Quito", "/es/escapada-romantica-quito/"], ["Retiro de bienestar cerca de Quito", "/es/retiro-bienestar-quito/"], ["Lodge de bosque nublado cerca de Quito", "/es/lodge-bosque-nublado-cerca-de-quito/"], ["Eco lodge Quito Ecuador", "/es/eco-lodge-quito-ecuador/"], ["Escapada de fin de semana desde Quito", "/es/escapada-fin-de-semana-quito/"], ["Bosque nublado cerca de Quito, Ecuador", "/es/bosque-nublado-quito-ecuador/"]]
  }
};

function schema(p) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": ["LodgingBusiness", "BedAndBreakfast"], "@id": "https://thecloudforestretreat.com/#lodging", name: "The Cloud Forest Retreat", url: "https://thecloudforestretreat.com/", image: "https://thecloudforestretreat.com/assets/images/pages/tcfr_assets_images_about_hero_01.jpg", address: { "@type": "PostalAddress", addressRegion: "Pichincha", addressCountry: "EC" } },
      { "@type": "AboutPage", "@id": `${p.canonical}#webpage`, url: p.canonical, name: p.title, description: p.description, inLanguage: p.lang, about: { "@id": "https://thecloudforestretreat.com/#lodging" }, breadcrumb: { "@id": `${p.canonical}#breadcrumb` } },
      { "@type": "BreadcrumbList", "@id": `${p.canonical}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: p.breadcrumbHome, item: `https://thecloudforestretreat.com${p.home}` }, { "@type": "ListItem", position: 2, name: p.breadcrumbCurrent, item: p.canonical }] },
      { "@type": "FAQPage", "@id": `${p.canonical}#faq`, inLanguage: p.lang, mainEntity: p.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
    ]
  }, null, 2);
}

function analytics(event, location) {
  return `data-analytics-event="${event}" data-analytics-location="${location}" data-analytics-page-type="about_page"`;
}

function render(p) {
  const es = p.lang === "es";
  const langLinks = `<nav class="rawLangLinks" aria-label="${es ? "Selector de idioma" : "Language switch"}">
    <a href="https://thecloudforestretreat.com/about/" lang="en" hreflang="en" ${analytics("language_switch_click", "language_switch")}${es ? "" : ' aria-current="page"'}>English</a>
    <a href="https://thecloudforestretreat.com/es/sobre-nosotros/" lang="es" hreflang="es" ${analytics("language_switch_click", "language_switch")}${es ? ' aria-current="page"' : ""}>Español</a>
  </nav>`;
  const facts = p.facts.map(([label, value]) => `<div><strong>${label}</strong><span>${value}</span></div>`).join("\n          ");
  const offers = p.offers.map(([title, text], index) => `<article class="aboutOffer"><span>0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join("\n          ");
  const faq = p.faqs.map(([question, answer], index) => `<details><summary>${question}</summary><p>${index === 3 ? answer.replace(es ? "solicitud de disponibilidad" : "availability request", `<a href="${p.booking}">${es ? "solicitud de disponibilidad" : "availability request"}</a>`).replace(es ? "página de contacto" : "contact page", `<a href="${p.contact}">${es ? "página de contacto" : "contact page"}</a>`) : answer}</p></details>`).join("\n          ");
  const related = p.related.map(([label, href]) => `<a class="tcfr-related__link" href="${href}" ${analytics("internal_link_click", "related_content")}>${label}</a>`).join("\n          ");
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
  <link rel="alternate" hreflang="en" href="https://thecloudforestretreat.com/about/" />
  <link rel="alternate" hreflang="es" href="https://thecloudforestretreat.com/es/sobre-nosotros/" />
  <link rel="alternate" hreflang="x-default" href="https://thecloudforestretreat.com/about/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="The Cloud Forest Retreat" />
  <meta property="og:locale" content="${es ? "es_EC" : "en_US"}" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.description}" />
  <meta property="og:url" content="${p.canonical}" />
  <meta property="og:image" content="https://thecloudforestretreat.com/assets/images/pages/tcfr_assets_images_about_hero_01.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.title}" />
  <meta name="twitter:description" content="${p.description}" />
  <meta name="twitter:image" content="https://thecloudforestretreat.com/assets/images/pages/tcfr_assets_images_about_hero_01.jpg" />
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
  <link rel="stylesheet" href="/assets/css/clusters/stay.css?v=8" />
  <link rel="stylesheet" href="/assets/css/components/faq.css?v=2" />
  <script type="application/ld+json">
${schema(p)}
  </script>
  <script src="/assets/js/site-config.js?v=3"></script>
  <script defer src="/assets/js/head.js?v=2"></script>
</head>
<body data-page-language="${p.lang}" data-page-type="about_page" data-tcfr-cluster="stay" data-tcfr-template="premium-stay">
  <div id="siteHeader" data-current-lang="${p.lang}"></div>
  ${langLinks}

  <main class="aboutPage" aria-label="${p.breadcrumbCurrent}">
    <nav class="aboutTop" aria-label="${es ? "Navegación de página" : "Page navigation"}">
      <div class="aboutBreadcrumb"><a href="${p.home}" ${analytics("internal_link_click", "breadcrumb")}>${p.breadcrumbHome}</a><span aria-hidden="true">/</span><span>${p.breadcrumbCurrent}</span></div>
      <div class="aboutTop__actions"><a class="btn secondary" href="${p.rooms}" ${analytics("room_view_click", "top_actions")}>${p.roomsLabel}</a><a class="btn primary" href="${p.booking}" ${analytics("booking_cta_click", "top_actions")}>${p.bookingLabel}</a></div>
    </nav>

    <section class="aboutHero" aria-labelledby="about-title" data-analytics-section="about_hero">
      <img src="/assets/images/pages/tcfr_assets_images_about_hero_01.jpg" alt="The Cloud Forest Retreat in the mountains of Pichincha, Ecuador" loading="eager" decoding="async" />
      <div class="aboutHero__veil" aria-hidden="true"></div>
      <div class="aboutHero__content"><p class="stayEyebrow">${p.kicker}</p><h1 id="about-title">${p.h1}</h1><p>${p.lead}</p></div>
    </section>

    <section class="aboutSection aboutOverview" aria-labelledby="about-overview-title">
      <header class="aboutSection__heading"><p class="stayEyebrow stayEyebrow--dark">${p.overviewEyebrow}</p><h2 id="about-overview-title">${p.overviewTitle}</h2><p>${p.overviewText}</p></header>
      <div class="aboutFacts">${facts}</div>
    </section>

    <section class="aboutSection aboutStory" aria-label="${p.storyEyebrow}">
      <article class="aboutStory__card">
        <p class="stayEyebrow stayEyebrow--dark">${p.storyEyebrow}</p>
        <h2>${p.storyTitle}</h2>
        ${p.storyParagraphs.map((text) => `<p>${text}</p>`).join("\n        ")}
        <blockquote>${p.quote}</blockquote>
        <figure class="aboutStory__figure"><img src="/assets/images/pages/tcfr_assets_images_about_02.jpg" alt="Cloud forest valley and The Cloud Forest Retreat" loading="lazy" decoding="async" /><figcaption>${p.storyCaption}</figcaption></figure>
      </article>
      <aside class="aboutMedia">
        <div><p class="stayEyebrow stayEyebrow--dark">${p.mediaEyebrow}</p><h2>${p.mediaTitle}</h2></div>
        <figure class="aboutMedia__image"><img src="/assets/images/pages/tcfr_about_01.jpg" alt="Guests overlooking the mountain landscape at The Cloud Forest Retreat" loading="lazy" decoding="async" /><figcaption>${p.mediaCaption}</figcaption></figure>
        <div class="aboutMedia__video"><iframe src="https://www.youtube-nocookie.com/embed/OAtzi6Trz84?rel=0&amp;modestbranding=1&amp;playsinline=1" title="${p.videoTitle}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
      </aside>
    </section>

    <section class="aboutSection aboutOffers" aria-labelledby="about-offers-title">
      <header class="aboutSection__heading"><p class="stayEyebrow stayEyebrow--dark">${p.offerEyebrow}</p><h2 id="about-offers-title">${p.offerTitle}</h2><p>${p.offerText}</p></header>
      <div class="aboutOffers__grid">${offers}</div>
    </section>

    <section class="aboutSection aboutCommitment" aria-labelledby="about-commitment-title">
      <div><p class="stayEyebrow">${p.commitmentEyebrow}</p><h2 id="about-commitment-title">${p.commitmentTitle}</h2><p>${p.commitmentText}</p></div>
      <ul>${p.practices.map((item) => `<li>${item}</li>`).join("")}</ul>
    </section>

    <section class="aboutSection aboutCta" aria-labelledby="about-cta-title">
      <div><p class="stayEyebrow stayEyebrow--dark">${es ? "Planifica con nosotros" : "Plan with us"}</p><h2 id="about-cta-title">${p.ctaTitle}</h2><p>${p.ctaText}</p></div>
      <div class="aboutCta__actions"><a class="btn primary" href="${p.booking}" ${analytics("booking_cta_click", "about_cta")}>${p.bookingLabel}</a><a class="btn secondary" href="${p.contact}" ${analytics("contact_cta_click", "about_cta")}>${p.contactLabel}</a><a class="btn secondary" href="${p.features}" ${analytics("internal_link_click", "about_cta")}>${p.featuresLabel}</a></div>
    </section>

    <section class="aboutSection stayFaq tcfrFaq" id="faq" aria-labelledby="about-faq-title" data-analytics-section="faq">
      <div class="tcfrFaq__intro"><p class="stayEyebrow stayEyebrow--dark">${p.faqEyebrow}</p><h2 id="about-faq-title">${p.faqTitle}</h2><p>${p.faqIntro}</p></div>
      <div class="tcfrFaq__list">${faq}</div>
    </section>

    <!-- TCFR_ARCHITECTURE_START -->
    <section class="tcfr-related" aria-labelledby="tcfr-related-title" data-analytics-section="related_content">
      <p class="tcfr-related__eyebrow">${p.relatedEyebrow}</p><h2 class="tcfr-related__title" id="tcfr-related-title">${p.relatedTitle}</h2>
      <div class="tcfr-related__grid">${related}</div>
      <div class="tcfr-related__cta"><a class="btn primary" href="${p.booking}" ${analytics("booking_cta_click", "related_content")}>${es ? "Consultar disponibilidad" : "Check availability"}</a><a class="btn secondary" href="${p.contact}" ${analytics("contact_cta_click", "related_content")}>${p.contactLabel}</a></div>
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

await fs.writeFile("about/index.html", render(pages.en), "utf8");
await fs.writeFile("es/sobre-nosotros/index.html", render(pages.es), "utf8");
