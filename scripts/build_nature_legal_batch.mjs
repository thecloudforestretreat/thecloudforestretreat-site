import fs from 'node:fs/promises';

const origin = 'https://thecloudforestretreat.com';
const imageBase = '/assets/images/pages/';
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const track = (event, location, label, pageType) => `data-analytics-event="${event}" data-analytics-location="${location}" data-analytics-page-type="${pageType}" data-analytics-label="${esc(label)}"`;

function schema(p) {
  const canonical = origin + p.path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LodgingBusiness', 'BedAndBreakfast'],
        '@id': origin + '/#lodging',
        name: 'The Cloud Forest Retreat',
        url: origin + '/',
        address: {'@type': 'PostalAddress', addressRegion: 'Pichincha', addressCountry: 'EC'}
      },
      {
        '@type': 'WebPage',
        '@id': canonical + '#webpage',
        url: canonical,
        name: p.title,
        description: p.description,
        inLanguage: p.lang,
        about: {'@id': origin + '/#lodging'},
        breadcrumb: {'@id': canonical + '#breadcrumb'}
      },
      {
        '@type': 'BreadcrumbList',
        '@id': canonical + '#breadcrumb',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: p.lang === 'es' ? 'Inicio' : 'Home', item: origin + p.home},
          {'@type': 'ListItem', position: 2, name: p.name, item: canonical}
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': canonical + '#faq',
        mainEntity: p.faqs.map(([name, text]) => ({'@type': 'Question', name, acceptedAnswer: {'@type': 'Answer', text}}))
      }
    ]
  };
}

async function headFor(p, cluster) {
  const source = await fs.readFile((p.lang === 'es' ? 'es/habitaciones/' : 'rooms/') + 'index.html', 'utf8');
  const canonical = origin + p.path;
  return source.slice(0, source.indexOf('  <body'))
    .replace(/<title>.*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(p.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/(<link rel="alternate" hreflang="(en|es|x-default)" href=")[^"]*/g, (_, a, code) => a + origin + (code === 'es' ? (p.lang === 'es' ? p.path : p.alt) : (p.lang === 'es' ? p.alt : p.path)))
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema(p))}</script>`)
    .replace(/clusters\/rooms.css\?v=\d+/, `clusters/${cluster}.css?v=6`);
}

const naturePages = [
  {
    lang: 'en', path: '/features/pululahua/', alt: '/es/caracteristicas/pululahua/', home: '/', book: '/booking/', contact: '/contact/',
    name: 'Pululahua', title: 'Pululahua Near Quito | Volcanic Landscape and Nature',
    description: 'Discover Pululahua near Quito, its volcanic caldera, changing cloud cover and practical planning considerations for a nature-focused stay in Pichincha.',
    eyebrow: 'A volcanic landscape near Quito', h1: 'Pululahua near Quito',
    lead: 'Pululahua is a volcanic caldera whose ridges, cultivated floor and fast-changing cloud cover create a distinctive landscape. Use this guide for context, then confirm access, timing, weather and transport for your dates.',
    hero: 'features/pululahua/tcfr_features_pululahua_93.jpg', caption: 'Visibility can shift quickly as cloud moves across the caldera.',
    notes: ['Volcanic caldera and inhabited landscape', 'Weather and road conditions can change', 'Access and activities require confirmation'],
    sectionEyebrow: 'Read the landscape', sectionTitle: 'What makes Pululahua distinctive', sectionText: 'The caldera combines steep volcanic walls, agricultural areas and variable mountain weather. A responsible visit starts with realistic timing and current local guidance.',
    cards: [
      ['Volcanic form', 'Caldera walls', 'The surrounding ridges reveal the scale and shape of the collapsed volcanic landscape.', 'features/pululahua/tcfr_features_pululahua_94.jpg'],
      ['Living landscape', 'Cultivated floor', 'Fields and residences make this more than a viewpoint; respect local roads, property and daily life.', 'features/pululahua/tcfr_features_pululahua_95.jpg'],
      ['Changing conditions', 'Cloud and visibility', 'Mist may reveal or conceal the view within minutes, so avoid planning around a guaranteed panorama.', 'features/pululahua/tcfr_features_pululahua_96.jpg']
    ],
    guideEyebrow: 'Plan before leaving', guideTitle: 'Build a realistic visit', guideText: 'Mountain roads, daylight and weather influence the experience. Confirm current conditions rather than relying only on a fixed online itinerary.',
    guide: [['01', 'Check access', 'Ask about road conditions, opening information and any current restrictions.'], ['02', 'Allow flexible time', 'Cloud and travel times can change, so avoid tightly stacking several distant stops.'], ['03', 'Choose appropriate activity', 'Confirm trail difficulty, transport, equipment and guide needs before committing.']],
    landscapeTitle: 'Connect Pululahua to the wider region', landscapeText: 'Continue with nearby nature guides that explain waterfalls, cloud forest geography and a balanced short stay.',
    relatedCards: [
      ['Nearby outings', 'Waterfalls near Quito', 'Compare route conditions and access before adding a waterfall.', 'attractions/tcfr_features_attractions_waterfall_01.jpg', '/waterfalls-near-quito/'],
      ['Regional planning', 'Nearby attractions', 'Place Pululahua alongside other outings without overloading the itinerary.', 'features/tcfr_features_card_attractions_01.png', '/features/attractions/'],
      ['Short stay', 'Weekend getaway', 'Combine one main outing with time to enjoy the retreat.', 'gallery/tcfr_gallery_07.jpg', '/weekend-getaway-from-quito/']
    ],
    observeEyebrow: 'Travel with care', observeTitle: 'Treat the caldera as a living place', observeText: 'Respect residents, stay on suitable routes and adapt to current conditions.',
    observe: [['01 · ROUTES', 'Use appropriate access', 'Follow signs and current local guidance.'], ['02 · WEATHER', 'Prepare for change', 'Carry layers and make conservative choices when visibility drops.'], ['03 · COMMUNITY', 'Respect local life', 'Keep noise low and avoid entering private land.']],
    faqs: [['How far is Pululahua from the retreat?', 'Travel time depends on the route, road conditions and the exact access point. Ask the host for current planning guidance rather than relying on a fixed estimate.'], ['Can I hike inside the Pululahua caldera?', 'Routes and conditions vary. Confirm current access, difficulty, daylight, equipment and whether a guide is appropriate before hiking.'], ['Is the crater view guaranteed?', 'No. Mist, rain and cloud can reduce visibility quickly, which is a normal part of the mountain environment.'], ['Can Pululahua be combined with other attractions?', 'It may fit with another nearby stop, but travel time and weather matter. Plan one priority outing and confirm what is realistic for the day.']],
    related: [['Waterfalls near Quito', '/waterfalls-near-quito/'], ['Nearby attractions', '/features/attractions/'], ['Weekend getaway', '/weekend-getaway-from-quito/'], ['Booking', '/booking/']]
  },
  {
    lang: 'es', path: '/es/caracteristicas/pululahua/', alt: '/features/pululahua/', home: '/es/', book: '/es/reservas/', contact: '/es/contacto/',
    name: 'Pululahua', title: 'Pululahua Cerca de Quito | Paisaje Volcánico y Naturaleza',
    description: 'Descubre Pululahua cerca de Quito, su caldera volcánica, nubosidad cambiante y detalles prácticos para una estadía de naturaleza en Pichincha.',
    eyebrow: 'Un paisaje volcánico cerca de Quito', h1: 'Pululahua cerca de Quito',
    lead: 'Pululahua es una caldera volcánica con laderas, áreas cultivadas y nubosidad cambiante. Usa esta guía como contexto y confirma acceso, horarios, clima y transporte para tus fechas.',
    hero: 'features/pululahua/tcfr_features_pululahua_93.jpg', caption: 'La visibilidad puede cambiar rápidamente cuando las nubes cruzan la caldera.',
    notes: ['Caldera volcánica y paisaje habitado', 'El clima y los caminos pueden cambiar', 'Confirma acceso y actividades'],
    sectionEyebrow: 'Lee el paisaje', sectionTitle: 'Qué hace especial a Pululahua', sectionText: 'La caldera combina paredes volcánicas, zonas agrícolas y clima variable. Una visita responsable comienza con tiempos realistas y orientación local actualizada.',
    cards: [
      ['Forma volcánica', 'Paredes de la caldera', 'Las laderas muestran la escala y forma del paisaje volcánico colapsado.', 'features/pululahua/tcfr_features_pululahua_94.jpg'],
      ['Paisaje vivo', 'Fondo cultivado', 'Los campos y viviendas exigen respeto por caminos, propiedad y vida cotidiana.', 'features/pululahua/tcfr_features_pululahua_95.jpg'],
      ['Condiciones cambiantes', 'Nubes y visibilidad', 'La neblina puede ocultar la vista en minutos; no planifiques esperando un panorama garantizado.', 'features/pululahua/tcfr_features_pululahua_96.jpg']
    ],
    guideEyebrow: 'Planifica antes de salir', guideTitle: 'Construye una visita realista', guideText: 'Los caminos, la luz del día y el clima influyen. Confirma las condiciones actuales en lugar de depender únicamente de un itinerario fijo.',
    guide: [['01', 'Confirma el acceso', 'Consulta caminos, horarios e indicaciones o restricciones actuales.'], ['02', 'Deja tiempo flexible', 'Las nubes y viajes cambian; evita acumular paradas lejanas.'], ['03', 'Elige una actividad adecuada', 'Confirma dificultad, transporte, equipo y necesidad de guía.']],
    landscapeTitle: 'Conecta Pululahua con la región', landscapeText: 'Continúa con guías sobre cascadas, geografía del bosque nublado y una escapada equilibrada.',
    relatedCards: [
      ['Salidas cercanas', 'Cascadas cerca de Quito', 'Compara caminos y acceso antes de agregar una cascada.', 'attractions/tcfr_features_attractions_waterfall_01.jpg', '/es/cascadas-cerca-de-quito/'],
      ['Planificación regional', 'Atracciones cercanas', 'Combina Pululahua con otras salidas sin sobrecargar el itinerario.', 'features/tcfr_features_card_attractions_01.png', '/es/caracteristicas/atracciones/'],
      ['Estadía corta', 'Escapada de fin de semana', 'Combina una salida principal con tiempo en el refugio.', 'gallery/tcfr_gallery_07.jpg', '/es/escapada-fin-de-semana-quito/']
    ],
    observeEyebrow: 'Viaja con cuidado', observeTitle: 'Trata la caldera como un lugar vivo', observeText: 'Respeta a los residentes, usa rutas adecuadas y adáptate a las condiciones.',
    observe: [['01 · RUTAS', 'Usa accesos apropiados', 'Sigue señales y orientación local vigente.'], ['02 · CLIMA', 'Prepárate para cambios', 'Lleva capas y toma decisiones conservadoras con poca visibilidad.'], ['03 · COMUNIDAD', 'Respeta la vida local', 'Reduce el ruido y no ingreses a propiedad privada.']],
    faqs: [['¿A qué distancia está Pululahua del refugio?', 'El tiempo depende de la ruta, caminos y punto de acceso. Consulta orientación actual en lugar de depender de una estimación fija.'], ['¿Puedo caminar dentro de la caldera de Pululahua?', 'Las rutas y condiciones varían. Confirma acceso, dificultad, luz, equipo y si conviene un guía antes de caminar.'], ['¿Está garantizada la vista del cráter?', 'No. La neblina, lluvia y nubosidad pueden reducir la visibilidad rápidamente; es parte normal del entorno.'], ['¿Puedo combinar Pululahua con otras atracciones?', 'Puede combinarse con otra parada cercana, pero importan el viaje y el clima. Elige una prioridad y confirma qué es realista.']],
    related: [['Cascadas cerca de Quito', '/es/cascadas-cerca-de-quito/'], ['Atracciones cercanas', '/es/caracteristicas/atracciones/'], ['Escapada desde Quito', '/es/escapada-fin-de-semana-quito/'], ['Reservas', '/es/reservas/']]
  },
  {
    lang: 'en', path: '/features/rio-guayllabamba/', alt: '/es/caracteristicas/rio-guayllabamba/', home: '/', book: '/booking/', contact: '/contact/',
    name: 'Guayllabamba River', title: 'Guayllabamba River | Cloud Forest Context Near Quito',
    description: 'Learn how the Guayllabamba River and its valley connect water, elevation and cloud forest habitats near The Cloud Forest Retreat in Pichincha, Ecuador.',
    eyebrow: 'Water, elevation and valley geography', h1: 'Guayllabamba River',
    lead: 'The Guayllabamba River helps define the valley below the retreat and connects a larger watershed across Pichincha. Understand its role in the landscape while treating steep terrain and changing water conditions with care.',
    hero: 'features/rio/tcfr_rio_hero_01.jpg', caption: 'The river corridor is best understood as part of a wider watershed and steep valley system.',
    notes: ['Regional watershed context', 'Steep terrain limits casual access', 'Water conditions can change quickly'],
    sectionEyebrow: 'Follow the watershed', sectionTitle: 'How the river shapes the valley', sectionText: 'Water, geology and elevation interact across the landscape. The river is an important geographic feature, but this page does not imply direct recreational access from the retreat.',
    cards: [
      ['Valley geography', 'A river below steep slopes', 'Elevation changes help explain the layered views and different vegetation zones.', 'features/rio/tcfr_rio_carousel-86.jpg'],
      ['Moving water', 'Conditions vary with recent weather', 'Flow, color and safety can change after rain; never assume a crossing or swimming area is safe.', 'features/rio/tcfr_rio_carousel-87.jpg'],
      ['Living corridor', 'Vegetation follows water and terrain', 'The watershed connects habitats without guaranteeing any particular wildlife sighting.', 'features/rio/tcfr_rio_carousel-89.jpg']
    ],
    guideEyebrow: 'Understand before approaching', guideTitle: 'View the river with safe expectations', guideText: 'Steep slopes, private land and changing flow mean access must be confirmed. Scenic context is different from a maintained visitor site.',
    guide: [['01', 'Ask about access', 'Confirm whether any route is appropriate, open and permitted for your dates.'], ['02', 'Respect water conditions', 'Do not enter moving water or attempt crossings without qualified local guidance.'], ['03', 'Protect the watershed', 'Carry out waste and avoid disturbing banks, vegetation or private property.']],
    landscapeTitle: 'Place the river in its regional context', landscapeText: 'Use the related guides to connect the valley with the Chocó Andino, cloud forest and a planned stay.',
    relatedCards: [
      ['Regional landscape', 'Chocó Andino', 'Understand the wider biodiversity and watershed context.', 'features/choco/tcfr_features_choco_hero.jpg', '/features/choco-andino-de-pichincha/'],
      ['Forest system', 'Cloud Forest Ecuador', 'Learn how moisture and elevation create cloud forest conditions.', 'features/flora/tcfr_features_flora_hero.jpg', '/cloud-forest-ecuador/'],
      ['Stay planning', 'Book the retreat', 'Use the retreat as a base and confirm realistic outings.', 'gallery/tcfr_gallery_07.jpg', '/booking/']
    ],
    observeEyebrow: 'Context before access', observeTitle: 'A river view is not an invitation to enter', observeText: 'Use local guidance and conservative judgment around steep ground and moving water.',
    observe: [['01 · TERRAIN', 'Expect steep slopes', 'Do not improvise routes toward the river.'], ['02 · WATER', 'Conditions change', 'Rain upstream can affect flow and visibility.'], ['03 · ACCESS', 'Confirm permission', 'Respect private land and current route guidance.']],
    faqs: [['What is the Guayllabamba River?', 'It is a major river and watershed feature in Pichincha that connects valleys, slopes and downstream landscapes across the region.'], ['Can guests walk directly to the river from the retreat?', 'Do not assume direct or casual access. Terrain can be steep and routes may cross private land, so ask the host for current guidance.'], ['Can guests swim in the river?', 'Swimming should not be assumed safe or permitted. Flow, depth, water quality, access and weather can change; follow qualified local guidance.'], ['Why does the river matter to a cloud forest stay?', 'The watershed helps explain the valley, elevation changes, moisture and connected habitats visible around the retreat.']],
    related: [['Chocó Andino', '/features/choco-andino-de-pichincha/'], ['Cloud Forest Ecuador', '/cloud-forest-ecuador/'], ['Nature activities', '/nature-activities-quito/'], ['Booking', '/booking/']]
  },
  {
    lang: 'es', path: '/es/caracteristicas/rio-guayllabamba/', alt: '/features/rio-guayllabamba/', home: '/es/', book: '/es/reservas/', contact: '/es/contacto/',
    name: 'Río Guayllabamba', title: 'Río Guayllabamba | Contexto del Bosque Cerca de Quito',
    description: 'Conoce cómo el río Guayllabamba conecta agua, elevación y hábitats del bosque nublado cerca de The Cloud Forest Retreat en Pichincha, Ecuador.',
    eyebrow: 'Agua, elevación y geografía del valle', h1: 'Río Guayllabamba',
    lead: 'El río Guayllabamba define el valle bajo el refugio y forma parte de una cuenca más amplia de Pichincha. Comprende su papel en el paisaje y trata el terreno y el agua cambiante con cuidado.',
    hero: 'features/rio/tcfr_rio_hero_01.jpg', caption: 'El corredor del río forma parte de una cuenca y un sistema de valle con fuertes pendientes.',
    notes: ['Contexto regional de cuenca', 'El terreno limita el acceso casual', 'El agua puede cambiar rápidamente'],
    sectionEyebrow: 'Sigue la cuenca', sectionTitle: 'Cómo el río define el valle', sectionText: 'El agua, la geología y la elevación interactúan. El río es una referencia geográfica importante, pero esta página no implica acceso recreativo directo desde el refugio.',
    cards: [
      ['Geografía del valle', 'Un río bajo fuertes pendientes', 'La elevación explica las vistas en capas y distintas zonas de vegetación.', 'features/rio/tcfr_rio_carousel-86.jpg'],
      ['Agua en movimiento', 'Las condiciones dependen del clima', 'El caudal, color y seguridad cambian tras la lluvia; no asumas que cruzar o nadar es seguro.', 'features/rio/tcfr_rio_carousel-87.jpg'],
      ['Corredor vivo', 'La vegetación sigue el agua y el terreno', 'La cuenca conecta hábitats sin garantizar avistamientos de fauna.', 'features/rio/tcfr_rio_carousel-89.jpg']
    ],
    guideEyebrow: 'Comprende antes de acercarte', guideTitle: 'Observa el río con expectativas seguras', guideText: 'Las pendientes, propiedad privada y caudal cambiante exigen confirmar el acceso. El contexto visual no equivale a un sitio turístico mantenido.',
    guide: [['01', 'Pregunta por el acceso', 'Confirma si alguna ruta es apropiada, abierta y permitida.'], ['02', 'Respeta las condiciones', 'No entres al agua ni intentes cruzar sin orientación local calificada.'], ['03', 'Protege la cuenca', 'Retira residuos y no perturbes riberas, vegetación o propiedad privada.']],
    landscapeTitle: 'Ubica el río en su contexto regional', landscapeText: 'Conecta el valle con el Chocó Andino, el bosque nublado y una estadía planificada.',
    relatedCards: [
      ['Paisaje regional', 'Chocó Andino', 'Comprende el contexto amplio de biodiversidad y cuencas.', 'features/choco/tcfr_features_choco_hero.jpg', '/es/caracteristicas/choco-andino-de-pichincha/'],
      ['Sistema forestal', 'Bosque nublado de Ecuador', 'Conoce cómo humedad y elevación crean este entorno.', 'features/flora/tcfr_features_flora_hero.jpg', '/es/bosque-nublado-ecuador/'],
      ['Planifica la estadía', 'Reserva el refugio', 'Usa el refugio como base y confirma salidas realistas.', 'gallery/tcfr_gallery_07.jpg', '/es/reservas/']
    ],
    observeEyebrow: 'Contexto antes del acceso', observeTitle: 'Una vista del río no invita a ingresar', observeText: 'Usa orientación local y decisiones conservadoras cerca de pendientes y agua.',
    observe: [['01 · TERRENO', 'Espera pendientes', 'No improvises rutas hacia el río.'], ['02 · AGUA', 'Las condiciones cambian', 'La lluvia aguas arriba puede afectar el caudal.'], ['03 · ACCESO', 'Confirma el permiso', 'Respeta propiedad privada y orientación vigente.']],
    faqs: [['¿Qué es el río Guayllabamba?', 'Es un río y elemento de cuenca importante en Pichincha que conecta valles, laderas y paisajes aguas abajo.'], ['¿Los huéspedes pueden caminar directamente al río?', 'No asumas acceso directo. El terreno puede ser empinado y las rutas pueden cruzar propiedad privada; consulta orientación actual.'], ['¿Se puede nadar en el río?', 'No se debe asumir que nadar es seguro o permitido. El caudal, profundidad, calidad del agua, acceso y clima cambian.'], ['¿Por qué importa el río en una estadía de bosque nublado?', 'La cuenca ayuda a comprender el valle, los cambios de elevación, la humedad y los hábitats conectados alrededor del refugio.']],
    related: [['Chocó Andino', '/es/caracteristicas/choco-andino-de-pichincha/'], ['Bosque nublado de Ecuador', '/es/bosque-nublado-ecuador/'], ['Actividades de naturaleza', '/es/actividades-naturaleza-quito/'], ['Reservas', '/es/reservas/']]
  }
];

async function renderNature(p) {
  const head = await headFor(p, 'nature-birding');
  const es = p.lang === 'es', pageType = 'destination_support_page';
  const species = p.cards.map(([meta, title, text, image]) => `        <article class="natureSpecies__card"><div class="natureSpecies__image"><img src="${imageBase + image}" alt="${esc(title)}" loading="lazy" decoding="async" /></div><div class="natureSpecies__body"><span class="natureSpecies__meta">${meta}</span><h3>${title}</h3><p>${text}</p></div></article>`).join('\n');
  const guide = p.guide.map(([n, title, text]) => `          <article class="natureFieldGuide__item"><span>${n}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join('\n');
  const landscapes = p.relatedCards.map(([meta, title, text, image, href]) => `        <a class="natureLandscape__card" href="${href}" ${track('internal_link_click', 'regional_context', title, pageType)}><img src="${imageBase + image}" alt="${esc(title)}" loading="lazy" decoding="async" /><div class="natureLandscape__body"><span>${meta}</span><h3>${title}</h3><p>${text}</p><strong>${es ? 'Explorar' : 'Explore'} →</strong></div></a>`).join('\n');
  const observe = p.observe.map(([meta, title, text]) => `          <article class="natureObserve__item"><span>${meta}</span><h3>${title}</h3><p>${text}</p></article>`).join('\n');
  const faq = p.faqs.map(([q, a]) => `          <details><summary>${q}</summary><p>${a}</p></details>`).join('\n');
  const related = p.related.map(([label, href]) => `          <a class="tcfr-related__link" href="${href}" ${track('internal_link_click', 'related_content', label, pageType)}>${label}</a>`).join('\n');
  const html = `${head}  <body data-page-language="${p.lang}" data-page-type="${pageType}" data-tcfr-cluster="nature-birding" data-tcfr-template="premium-nature-birding">
    <div id="siteHeader" data-current-lang="${p.lang}"></div>
    <nav class="rawLangLinks" aria-label="${es ? 'Selector de idioma' : 'Language switch'}"><a href="${es ? p.alt : p.path}" lang="en" hreflang="en" ${!es ? 'aria-current="page"' : ''} ${track('language_switch_click', 'language_switch', 'English', pageType)}>English</a><a href="${es ? p.path : p.alt}" lang="es" hreflang="es" ${es ? 'aria-current="page"' : ''} ${track('language_switch_click', 'language_switch', 'Español', pageType)}>Español</a></nav>
    <main class="naturePreview">
      <nav class="naturePreview__crumbs" aria-label="${es ? 'Migas de pan' : 'Breadcrumb'}"><a href="${p.home}" ${track('internal_link_click', 'breadcrumb', es ? 'Inicio' : 'Home', pageType)}>${es ? 'Inicio' : 'Home'}</a><span>/</span><span>${p.name}</span></nav>
      <section class="natureHero" aria-labelledby="nature-title"><div class="natureHero__copy"><p class="natureEyebrow">${p.eyebrow}</p><h1 id="nature-title">${p.h1}</h1><p class="natureHero__lead">${p.lead}</p><div class="natureHero__actions"><a class="btn primary" href="#nature-guide" ${track('internal_link_click', 'hero', es ? 'Planificar' : 'Plan', pageType)}>${es ? 'Cómo planificar' : 'How to plan'}</a><a class="btn natureButtonLight" href="${p.book}" ${track('booking_cta_click', 'hero', p.name, pageType)}>${es ? 'Consultar disponibilidad' : 'Check availability'}</a></div><div class="natureHero__notes">${p.notes.map(x => `<span>${x}</span>`).join('')}</div></div><div class="natureHero__visual"><img src="${imageBase + p.hero}" alt="${esc(p.h1)}" loading="eager" decoding="async" /><p class="natureHero__caption">${p.caption}</p></div></section>
      <section class="natureSection" id="nature-species"><header class="natureHeading"><p class="natureEyebrow natureEyebrow--dark">${p.sectionEyebrow}</p><h2>${p.sectionTitle}</h2><p>${p.sectionText}</p></header><div class="natureSpecies">${species}</div></section>
      <section class="natureSection natureFieldGuide" id="nature-guide"><div class="natureFieldGuide__copy"><p class="natureEyebrow natureEyebrow--dark">${p.guideEyebrow}</p><h2>${p.guideTitle}</h2><p>${p.guideText}</p></div><div class="natureFieldGuide__list">${guide}</div></section>
      <section class="natureSection" id="nature-landscape"><header class="natureHeading"><p class="natureEyebrow natureEyebrow--dark">${es ? 'Contexto regional' : 'Regional context'}</p><h2>${p.landscapeTitle}</h2><p>${p.landscapeText}</p></header><div class="natureLandscape">${landscapes}</div></section>
      <section class="natureSection natureObserve"><div class="natureObserve__intro"><p class="natureEyebrow">${p.observeEyebrow}</p><h2>${p.observeTitle}</h2><p>${p.observeText}</p></div><div class="natureObserve__grid">${observe}</div></section>
      <section class="natureSection natureFaq tcfrFaq" id="faq"><div class="tcfrFaq__intro"><p class="natureEyebrow natureEyebrow--dark">FAQ</p><h2>${es ? 'Preguntas para planificar' : 'Planning questions'}</h2><p>${es ? 'Respuestas claras antes de incluir este paisaje en tu estadía.' : 'Clear answers before adding this landscape to your stay.'}</p></div><div class="tcfrFaq__list">${faq}</div></section>
      <section class="tcfr-related"><p class="tcfr-related__eyebrow">${es ? 'Sigue explorando' : 'Continue exploring'}</p><h2 class="tcfr-related__title">${es ? 'Planifica tu estadía' : 'Plan your stay'}</h2><div class="tcfr-related__grid">${related}</div></section>
    </main>
    <div id="siteFooter"></div><script src="/assets/js/attribution.js?v=1"></script><script src="/assets/js/site.js?v=8"></script>
  </body></html>\n`;
  await fs.writeFile(p.path.slice(1) + 'index.html', html);
}

const legalPages = [
  {
    lang: 'en', path: '/privacy-policy/', alt: '/es/politica-de-privacidad/', home: '/', contact: '/contact/', terms: '/terms-of-service/',
    name: 'Privacy Policy', title: 'Privacy Policy | The Cloud Forest Retreat', description: 'Review how The Cloud Forest Retreat collects, uses, stores and protects website, inquiry, booking, attribution and Instagram publishing information.',
    eyebrow: 'Privacy · trust · transparency', lead: 'This policy explains the information used when you browse the website, contact us, request a booking, or use connected Instagram publishing tools.', updated: 'September 30, 2026',
    intro: 'We collect only the information needed to operate, measure and improve our services, respond to guests, process requests, maintain security and support authorized publishing tools.',
    sections: [
      ['Information we collect', 'We may collect website and device data, referring pages, approximate location derived from IP address, campaign parameters and advertising click identifiers. We also receive information you submit, such as your name, contact details, dates, group details and message. Authorized Instagram tools may access account identifiers, public profile information and publishing metadata through Meta’s Graph API.'],
      ['How we use information', 'We use information to operate and secure the website, respond to inquiries, process booking requests, understand campaign performance, support authorized Instagram publishing, diagnose errors and improve the guest experience.'],
      ['Analytics and attribution', 'The site uses Google Consent Mode with optional analytics denied until you accept. If accepted, Google Analytics 4, Google Tag Manager and campaign attribution may operate; attribution and click identifiers may be stored in your browser for up to 90 days. We do not send booking or contact message content to analytics.'],
      ['Sharing and service providers', 'We may use service providers such as Cloudflare, Google and Meta when needed for hosting, security, forms, analytics or authorized publishing. We do not sell personal information or share it with unauthorized parties for their marketing.'],
      ['Retention and deletion', 'We keep information only as long as reasonably needed for service delivery, support, business records, security and legal obligations. You may request access, correction or deletion by contacting us.'],
      ['Security and choices', 'We use reasonable safeguards, but no internet transmission is completely secure. Use the Privacy control at the bottom of the site to accept, decline or revisit optional analytics. You may also clear browser storage, disconnect Instagram access or revoke connected permissions.']
    ],
    faqs: [['What information is collected when I submit a form?', 'We receive the information you choose to provide, such as contact details, travel dates, group information and your message, together with limited technical and attribution data.'], ['Does the retreat sell personal information?', 'No. The policy states that personal information is not sold or shared with unauthorized parties for their marketing.'], ['How long is campaign attribution stored in my browser?', 'After you accept optional analytics, campaign attribution may be stored in browser local storage for up to 90 days. Declining or changing the choice to decline clears that optional attribution storage.'], ['How can I request access, correction or deletion?', 'Use the contact page to describe your request. Identity or account details may be needed to locate and safely process relevant records.']],
    toc: 'On this page', introTitle: 'How we handle information', questions: 'Privacy questions?', questionText: 'Contact us to ask about this policy or request access, correction or deletion.', contactLabel: 'Contact us', termsLabel: 'Terms of Service'
  },
  {
    lang: 'es', path: '/es/politica-de-privacidad/', alt: '/privacy-policy/', home: '/es/', contact: '/es/contacto/', terms: '/es/terminos-de-servicio/',
    name: 'Política de privacidad', title: 'Política de Privacidad | The Cloud Forest Retreat', description: 'Conoce cómo The Cloud Forest Retreat recopila, usa, guarda y protege datos del sitio, consultas, reservas, atribución y publicación en Instagram.',
    eyebrow: 'Privacidad · confianza · transparencia', lead: 'Esta política explica la información utilizada cuando navegas, nos contactas, solicitas una reserva o usas herramientas conectadas de publicación en Instagram.', updated: '30 de septiembre de 2026',
    intro: 'Recopilamos únicamente la información necesaria para operar, medir y mejorar servicios, responder a huéspedes, procesar solicitudes, mantener seguridad y apoyar herramientas autorizadas.',
    sections: [
      ['Información que recopilamos', 'Podemos recopilar datos del sitio y dispositivo, páginas de referencia, ubicación aproximada derivada de la dirección IP, parámetros de campaña e identificadores publicitarios. También recibimos datos que envías, como nombre, contacto, fechas, grupo y mensaje. Las herramientas autorizadas de Instagram pueden acceder a identificadores, perfil público y metadatos de publicación mediante la API Graph de Meta.'],
      ['Cómo usamos la información', 'Usamos la información para operar y proteger el sitio, responder consultas, procesar solicitudes, comprender campañas, apoyar publicaciones autorizadas en Instagram, diagnosticar errores y mejorar la experiencia.'],
      ['Analítica y atribución', 'El sitio usa el Modo de Consentimiento de Google y mantiene la analítica opcional denegada hasta que aceptas. Si aceptas, pueden operar Google Analytics 4, Google Tag Manager y la atribución de campañas; los identificadores pueden guardarse hasta 90 días. No enviamos el contenido de mensajes a analítica.'],
      ['Proveedores y divulgación', 'Podemos usar proveedores como Cloudflare, Google y Meta cuando sean necesarios para alojamiento, seguridad, formularios, analítica o publicación autorizada. No vendemos información personal ni la compartimos con terceros no autorizados para su marketing.'],
      ['Retención y eliminación', 'Conservamos información solo durante el tiempo razonablemente necesario para prestar servicios, brindar soporte, mantener registros, proteger la seguridad y cumplir obligaciones legales. Puedes solicitar acceso, corrección o eliminación.'],
      ['Seguridad y opciones', 'Aplicamos salvaguardas razonables, pero ninguna transmisión es totalmente segura. Usa el control Privacidad en la parte inferior para aceptar, rechazar o revisar la analítica opcional. También puedes borrar almacenamiento, desconectar Instagram o revocar permisos.']
    ],
    faqs: [['¿Qué información se recopila cuando envío un formulario?', 'Recibimos lo que decides proporcionar, como datos de contacto, fechas, información del grupo y mensaje, junto con datos técnicos y de atribución limitados.'], ['¿El refugio vende información personal?', 'No. La política indica que la información personal no se vende ni se comparte con terceros no autorizados para su marketing.'], ['¿Cuánto tiempo se guarda la atribución en mi navegador?', 'Después de aceptar la analítica opcional, la atribución puede guardarse en el almacenamiento local hasta 90 días. Rechazar o cambiar la opción a rechazo elimina ese almacenamiento opcional.'], ['¿Cómo solicito acceso, corrección o eliminación?', 'Usa la página de contacto para describir tu solicitud. Puede requerirse información de identidad o cuenta para ubicar y procesar registros de forma segura.']],
    toc: 'En esta página', introTitle: 'Cómo tratamos la información', questions: '¿Preguntas sobre privacidad?', questionText: 'Contáctanos para preguntar sobre esta política o solicitar acceso, corrección o eliminación.', contactLabel: 'Contacto', termsLabel: 'Términos de servicio'
  }
];

async function renderLegal(p) {
  const head = await headFor(p, 'legal'), es = p.lang === 'es', pageType = 'legal_page';
  const toc = p.sections.map((s, i) => `<a href="#legal-${i + 1}" ${track('internal_link_click', 'legal_toc', s[0], pageType)}>${s[0]}</a>`).join('');
  const sections = p.sections.map(([title, text], i) => `<section class="legalSection" id="legal-${i + 1}"><span class="legalSection__number">0${i + 1}</span><h2>${title}</h2><p>${text}</p></section>`).join('\n');
  const faq = p.faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
  const html = `${head}  <body data-page-language="${p.lang}" data-page-type="${pageType}" data-tcfr-cluster="legal" data-tcfr-template="premium-legal">
    <div id="siteHeader" data-current-lang="${p.lang}"></div>
    <nav class="rawLangLinks" aria-label="${es ? 'Selector de idioma' : 'Language switch'}"><a href="${es ? p.alt : p.path}" lang="en" hreflang="en" ${!es ? 'aria-current="page"' : ''} ${track('language_switch_click', 'language_switch', 'English', pageType)}>English</a><a href="${es ? p.path : p.alt}" lang="es" hreflang="es" ${es ? 'aria-current="page"' : ''} ${track('language_switch_click', 'language_switch', 'Español', pageType)}>Español</a></nav>
    <main class="legalPreview">
      <section class="legalHero"><div><p class="legalEyebrow">${p.eyebrow}</p><h1>${p.name}</h1><p class="legalHero__lead">${p.lead}</p></div><div class="legalHero__meta"><div><strong>${es ? 'Última actualización' : 'Last updated'}</strong><span>${p.updated}</span></div><div><strong>${es ? 'Contacto' : 'Contact'}</strong><span>thecloudforestretreat@gmail.com</span></div><div><strong>${es ? 'Idiomas' : 'Languages'}</strong><span>English · Español</span></div></div></section>
      <section class="legalLayout"><aside class="legalToc"><p class="legalEyebrow">${p.toc}</p><h2>${es ? 'Busca una sección' : 'Find a section'}</h2><nav>${toc}<a href="#legal-faq" ${track('internal_link_click', 'legal_toc', 'FAQ', pageType)}>FAQ</a></nav></aside><article class="legalDocument"><header class="legalDocument__intro"><h2>${p.introTitle}</h2><p>${p.intro}</p></header>${sections}<section class="legalSection tcfrFaq" id="legal-faq"><span class="legalSection__number">FAQ</span><h2>${es ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2><div class="tcfrFaq__list">${faq}</div></section></article></section>
      <section class="legalCallout"><div><h2>${p.questions}</h2><p>${p.questionText}</p></div><div class="legalCallout__links"><a href="${p.contact}" ${track('contact_cta_click', 'legal_callout', p.contactLabel, pageType)}>${p.contactLabel}</a><a href="${p.terms}" ${track('internal_link_click', 'legal_callout', p.termsLabel, pageType)}>${p.termsLabel}</a></div></section>
    </main>
    <div id="siteFooter"></div><script src="/assets/js/attribution.js?v=1"></script><script src="/assets/js/site.js?v=8"></script>
  </body></html>\n`;
  await fs.writeFile(p.path.slice(1) + 'index.html', html);
}

for (const p of naturePages) await renderNature(p);
for (const p of legalPages) await renderLegal(p);
