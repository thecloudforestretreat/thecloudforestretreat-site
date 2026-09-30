import fs from 'node:fs/promises';

// Reuse the approved Rooms shell and review cards; author room-specific content below.
const origin = 'https://thecloudforestretreat.com';
const paths = { en: '/rooms/panoramic-suite/', es: '/es/habitaciones/suite-panoramica/' };
const imageBase = '/assets/images/pages/rooms/';
const copy = {
  en: {
    name: 'Panoramic Suite', title: 'Panoramic Suite near Quito | The Cloud Forest Retreat',
    description: 'Explore the Panoramic Suite near Quito: broad valley views, panoramic windows and a private terrace. See photos and request availability for your dates.',
    home: '/', hub: '/rooms/', booking: '/booking/', contact: '/contact/', common: '/rooms/common-areas/',
    homeLabel: 'Home', hubLabel: 'Rooms', kicker: 'Space to settle in. Views to linger over.',
    lead: 'Our most spacious room combines an open layout, panoramic windows and a private terrace overlooking the valley. Choose it for quiet time together, photography, or an unhurried stay near Quito.',
    book: 'Check suite availability', compare: 'Compare all rooms', ask: 'Ask a question',
    highlights: [['Open layout', 'More space to settle in'], ['Panoramic windows', 'Broad valley views'], ['Private terrace', 'Time outdoors at your pace']],
    featuresTitle: 'What makes this suite different', featuresIntro: 'The space and outlook are the reasons to choose this room. Use the photos to explore the layout, then ask a host to confirm the practical details for your stay.',
    features: [['An open, spacious layout', 'The suite is the retreat’s most spacious room. Its open layout suits guests who want room to read, rest and spend time together between outings.'], ['Windows facing the landscape', 'Panoramic windows bring the valley into view from inside the suite. Light, mist and visibility change with the weather and time of day.'], ['Your own terrace', 'The private terrace gives you an outdoor place to pause and enjoy the setting. It is a natural extension of the suite for guests who want time with the view.']],
    galleryTitle: 'Take a closer look', galleryIntro: 'Explore the suite’s interior, terrace and open layout before choosing your room.',
    photos: [['tcfr_rooms_ps_c_01.jpg', 'Mountain valley viewed from the Panoramic Suite', 'The valley outlook'], ['tcfr_rooms_ps_c_03.jpg', 'Bathtub beside panoramic windows in the suite', 'Windows facing the landscape'], ['tcfr_rooms_ps_hero_01.jpg', 'Open suite layout with bedroom and bathroom areas', 'The suite’s open layout']],
    fitTitle: 'A room for time at the retreat', fitText: 'The Panoramic Suite suits couples and solo travelers who value space, privacy and the landscape. Birders and photographers can enjoy watching the changing light; wildlife sightings depend on natural conditions. If early starts or evening light matter more than space, compare the Sunrise and Sunset rooms too.',
    sharedTitle: 'Beyond your private suite', sharedText: 'The shared living and kitchen areas provide other places to spend time at the retreat. Review the common areas alongside the room photos, and ask your host about access, meal arrangements and any guidelines for your dates.', sharedLink: 'Explore the common areas',
    practicalTitle: 'Confirm the details before you book', practicalIntro: 'Send your dates, number of guests and preferred room in one availability request. The team can confirm the current options before you decide.',
    practical: [['Sleeping arrangements', 'Confirm guest capacity, bed setup and any additional sleeping needs directly with the host.'], ['Rates and inclusions', 'Ask for the current rate and what it includes, including meals, amenities and any additional services.'], ['Arrival and access', 'Discuss your arrival time, transport, current road guidance and any mobility or access needs before confirming.'], ['Your room preference', 'Mention the Panoramic Suite and any alternatives. Availability is confirmed by the host’s response, not by sending the request.']],
    faqTitle: 'Panoramic Suite questions', faqIntro: 'Room details and booking guidance to help you plan.',
    faqs: [['Does the Panoramic Suite have a private terrace?', 'Yes. The suite has a private terrace, panoramic windows and an open layout overlooking the valley.'], ['Who is the Panoramic Suite best suited to?', 'It suits couples and solo travelers who prioritize space, privacy and broad views. Birders and photographers may also appreciate time with the landscape; wildlife sightings are not guaranteed.'], ['How many guests can stay, and what is included?', 'Ask the host to confirm capacity, bed setup, current amenities, meals and inclusions for your dates. Include your group size and any specific needs in the availability request.'], ['How do I confirm the price and availability?', 'Send an availability request with your dates, guest count and Panoramic Suite preference. A host will reply with current options and pricing. Submitting the request does not confirm a reservation.']],
    relatedTitle: 'Plan the rest of your stay', related: [['Sunrise Room', '/rooms/sunrise-room/'], ['Sunset Room', '/rooms/sunset-room/'], ['Common Areas', '/rooms/common-areas/'], ['A romantic getaway near Quito', '/romantic-getaway-quito/'], ['Choosing an eco lodge near Quito', '/best-eco-lodge-quito/'], ['Cloud Forest Lodge Near Quito', '/cloud-forest-lodge-near-quito/'], ['What to pack', '/what-to-pack-cloud-forest-ecuador/'], ['Getting to the retreat', '/blog/how-to-get-to-cloud-forest-retreat/']],
    reviewTitle: 'Guests share their retreat experience', reviewIntro: 'These reviews describe stays at the retreat; they are not specific to the Panoramic Suite.',
    photosLabel: 'Suite photos', featuresLabel: 'Inside the suite', planningLabel: 'Before you arrive', faqLabel: 'Helpful answers', relatedLabel: 'Continue exploring'
  },
  es: {
    name: 'Suite Panorámica', title: 'Suite Panorámica cerca de Quito | The Cloud Forest Retreat',
    description: 'Conoce la Suite Panorámica cerca de Quito: vistas del valle, ventanales y terraza privada. Mira las fotos y consulta disponibilidad para tus fechas.',
    home: '/es/', hub: '/es/habitaciones/', booking: '/es/reservas/', contact: '/es/contacto/', common: '/es/habitaciones/areas-comunes/',
    homeLabel: 'Inicio', hubLabel: 'Habitaciones', kicker: 'Espacio para descansar. Tiempo para el paisaje.',
    lead: 'Nuestra habitación más espaciosa combina una distribución abierta, ventanales panorámicos y una terraza privada con vistas al valle. Elígela para pasar tiempo en pareja, hacer fotografía o disfrutar una estadía sin prisa cerca de Quito.',
    book: 'Consultar disponibilidad', compare: 'Comparar habitaciones', ask: 'Hacer una pregunta',
    highlights: [['Distribución abierta', 'Más espacio para descansar'], ['Ventanales panorámicos', 'Vistas amplias del valle'], ['Terraza privada', 'Tiempo al aire libre a tu ritmo']],
    featuresTitle: 'Qué distingue a esta suite', featuresIntro: 'El espacio y las vistas son las razones para elegir esta habitación. Conoce la distribución en las fotos y consulta con un anfitrión los detalles prácticos de tu estadía.',
    features: [['Espacio y distribución abierta', 'Es la habitación más espaciosa del refugio. Su distribución abierta permite leer, descansar y pasar tiempo juntos entre salidas.'], ['Ventanales hacia el paisaje', 'Los ventanales panorámicos permiten contemplar el valle desde la suite. La luz, la neblina y la visibilidad cambian con el clima y la hora del día.'], ['Tu propia terraza', 'La terraza privada ofrece un lugar al aire libre para hacer una pausa y disfrutar del entorno. Es una extensión de la suite para quienes quieren pasar tiempo con el paisaje.']],
    galleryTitle: 'Conoce la suite en detalle', galleryIntro: 'Explora el interior, la terraza y la distribución abierta antes de elegir tu habitación.',
    photos: [['tcfr_rooms_ps_c_01.jpg', 'Valle montañoso visto desde la Suite Panorámica', 'El paisaje del valle'], ['tcfr_rooms_ps_c_03.jpg', 'Bañera junto a los ventanales panorámicos de la suite', 'Ventanales hacia el paisaje'], ['tcfr_rooms_ps_hero_01.jpg', 'Distribución abierta de la suite con dormitorio y baño', 'La distribución abierta de la suite']],
    fitTitle: 'Una habitación para disfrutar del refugio', fitText: 'La Suite Panorámica es una opción para parejas y viajeros solos que valoran el espacio, la privacidad y el paisaje. Observadores de aves y fotógrafos pueden disfrutar de la luz cambiante; los avistamientos dependen de las condiciones naturales. Si priorizas madrugar o la luz de la tarde sobre el espacio, compara también las habitaciones Amanecer y Atardecer.',
    sharedTitle: 'Más allá de tu suite privada', sharedText: 'La sala y la cocina compartidas ofrecen otros espacios para disfrutar del refugio. Revisa las áreas comunes junto con las fotos de la habitación y consulta el acceso, las opciones de comida y las pautas para tus fechas.', sharedLink: 'Explorar las áreas comunes',
    practicalTitle: 'Confirma los detalles antes de reservar', practicalIntro: 'Envía tus fechas, número de huéspedes y habitación preferida en una sola solicitud. El equipo podrá confirmar las opciones actuales antes de que decidas.',
    practical: [['Distribución para dormir', 'Confirma con el anfitrión la capacidad, las camas y cualquier necesidad adicional para dormir.'], ['Tarifas e inclusiones', 'Consulta el precio actual y lo que incluye, como comidas, amenidades y servicios adicionales.'], ['Llegada y acceso', 'Conversa sobre la hora de llegada, el transporte, las indicaciones actuales del camino y cualquier necesidad de movilidad o acceso antes de confirmar.'], ['Tu habitación preferida', 'Menciona la Suite Panorámica y otras opciones que considerarías. La disponibilidad se confirma en la respuesta del anfitrión, no al enviar la solicitud.']],
    faqTitle: 'Preguntas sobre la Suite Panorámica', faqIntro: 'Detalles de la habitación y orientación para planificar tu reserva.',
    faqs: [['¿La Suite Panorámica tiene terraza privada?', 'Sí. La suite tiene una terraza privada, ventanales panorámicos y una distribución abierta con vistas al valle.'], ['¿Para quién es ideal la Suite Panorámica?', 'Es una opción para parejas y viajeros solos que priorizan el espacio, la privacidad y las vistas amplias. Observadores de aves y fotógrafos también pueden disfrutar del paisaje; los avistamientos no están garantizados.'], ['¿Cuántas personas pueden alojarse y qué está incluido?', 'Consulta con el anfitrión la capacidad, las camas, las amenidades actuales, las comidas y las inclusiones para tus fechas. Indica el tamaño de tu grupo y tus necesidades en la solicitud de disponibilidad.'], ['¿Cómo confirmo el precio y la disponibilidad?', 'Envía una solicitud con tus fechas, número de huéspedes y preferencia por la Suite Panorámica. Un anfitrión responderá con opciones y precios actuales. Enviar la solicitud no confirma una reserva.']],
    relatedTitle: 'Planifica el resto de tu estadía', related: [['Habitación Amanecer', '/es/habitaciones/habitacion-amanecer/'], ['Habitación Atardecer', '/es/habitaciones/habitacion-atardecer/'], ['Áreas comunes', '/es/habitaciones/areas-comunes/'], ['Escapada romántica cerca de Quito', '/es/escapada-romantica-quito/'], ['Elegir un eco lodge cerca de Quito', '/es/mejor-eco-lodge-quito/'], ['Lodge de bosque nublado cerca de Quito', '/es/lodge-bosque-nublado-cerca-de-quito/'], ['Qué llevar', '/es/que-llevar-bosque-nublado-ecuador/'], ['Cómo llegar al refugio', '/es/blog/como-llegar-cloud-forest-retreat/']],
    reviewTitle: 'Los huéspedes cuentan su experiencia', reviewIntro: 'Estas reseñas describen estadías en el refugio; no corresponden específicamente a la Suite Panorámica.',
    photosLabel: 'Fotos de la suite', featuresLabel: 'Dentro de la suite', planningLabel: 'Antes de llegar', faqLabel: 'Respuestas útiles', relatedLabel: 'Sigue explorando'
  }
};
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const track = (event, location, label) => `data-analytics-event="${event}" data-analytics-location="${location}" data-analytics-page-type="room_detail_page" data-analytics-label="${esc(label)}"`;
const link = (url, label, location, classes = '', event = 'internal_link_click') => `<a${classes ? ` class="${classes}"` : ''} href="${url}" ${track(event, location, label)}>${esc(label)}</a>`;
const heading = (id, eyebrow, title, intro) => `        <header class="roomsSectionHeading">
          <p class="roomsEyebrow roomsEyebrow--dark">${esc(eyebrow)}</p>
          <h2 id="${id}">${esc(title)}</h2>
          <p>${esc(intro)}</p>
        </header>`;

for (const lang of ['en', 'es']) {
  const p = copy[lang];
  const hub = await fs.readFile(`${p.hub.slice(1)}index.html`, 'utf8');
  const canonical = origin + paths[lang];
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': ['LodgingBusiness', 'BedAndBreakfast'], '@id': `${origin}/#lodging`, name: 'The Cloud Forest Retreat', url: origin + '/', address: { '@type': 'PostalAddress', addressRegion: 'Pichincha', addressCountry: 'EC' } },
      { '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical, name: p.title, description: p.description, inLanguage: lang, mainEntity: { '@id': canonical + '#room' }, breadcrumb: { '@id': canonical + '#breadcrumb' } },
      { '@type': 'HotelRoom', '@id': canonical + '#room', name: p.name, description: p.lead, url: canonical, image: p.photos.map(([file]) => origin + imageBase + file), containedInPlace: { '@id': `${origin}/#lodging` } },
      { '@type': 'BreadcrumbList', '@id': canonical + '#breadcrumb', itemListElement: [[p.homeLabel, p.home], [p.hubLabel, p.hub], [p.name, paths[lang]]].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: origin + path })) },
      { '@type': 'FAQPage', '@id': canonical + '#faq', inLanguage: lang, mainEntity: p.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) }
    ]
  };
  let head = hub.slice(0, hub.indexOf('  <body'));
  head = head.replace(/<title>.*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(p.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/(<link rel="alternate" hreflang="(en|es|x-default)" href=")[^"]*/g, (_, start, code) => start + origin + paths[code === 'x-default' ? 'en' : code])
    .replace(/(<meta (?:property|name)="(?:og|twitter):title" content=")[^"]*/g, `$1${esc(p.title)}`)
    .replace(/(<meta (?:property|name)="(?:og|twitter):description" content=")[^"]*/g, `$1${esc(p.description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${canonical}`)
    .replaceAll('tcfr_images_rooms_hero.jpg', 'tcfr_rooms_ps_c_02.jpg')
    .replace(/(<meta property="og:image:alt" content=")[^"]*/, `$1${esc(p.name)}`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2).split('\n').map(line => '      ' + line).join('\n')}\n    </script>`)
    .replace('rooms.css?v=7', 'rooms.css?v=8');
  const reviewsMatch = hub.match(/      <section class="roomsSection roomsReviews"[\s\S]*?      <\/section>/);
  if (!reviewsMatch) throw new Error('Approved Rooms reviews section not found.');
  const reviews = reviewsMatch[0].replace(/(<h2 id="rooms-reviews-title">).*?(<\/h2>)/, `$1${esc(p.reviewTitle)}$2`)
    .replace('        <div class="roomsReviews__grid">', `        <p class="suiteReviewContext">${esc(p.reviewIntro)}</p>\n        <div class="roomsReviews__grid">`)
    .replace('<strong>5.0</strong>', '<strong data-tcfr-config-text="reputation.googleRating"></strong>')
    .replace(/<small>\(.*?<\/small>/, `<small><span data-tcfr-config-text="reputation.googleReviewCount"></span> ${lang === 'en' ? 'reviews' : 'reseñas'}</small>`)
    .replace('href="https://g.page/r/CQq5wBqKgv0DEAE"', 'href="#rooms-reviews-title" data-tcfr-config-href="reputation.googleReviewsReadUrl"')
    .replace('href="https://g.page/r/CQq5wBqKgv0DEAE/review"', 'href="#rooms-reviews-title" data-tcfr-config-href="reputation.googleReviewsWriteUrl"')
    .replaceAll('data-analytics-page-type="rooms_hub"', 'data-analytics-page-type="room_detail_page"');
  const html = `${head}  <body data-page-language="${lang}" data-page-type="room_detail_page" data-tcfr-cluster="rooms" data-tcfr-template="premium-rooms" data-room="panoramic-suite">
    <div id="siteHeader" data-current-lang="${lang}"></div>
    <nav class="rawLangLinks" aria-label="${lang === 'en' ? 'Language switch' : 'Selector de idioma'}">
${['en', 'es'].map(code => `      <a href="${paths[code]}" lang="${code}" hreflang="${code}" ${track('language_switch_click', 'language_switch', code)}${code === lang ? ' aria-current="page"' : ''}>${code === 'en' ? 'English' : 'Español'}</a>`).join('\n')}
    </nav>
    <main class="roomsPreview suiteDetail">
      <nav class="roomsPreview__crumbs" aria-label="${lang === 'en' ? 'Breadcrumb' : 'Migas de pan'}">
        ${link(p.home, p.homeLabel, 'breadcrumb')}
        <span aria-hidden="true">/</span>
        ${link(p.hub, p.hubLabel, 'breadcrumb')}
        <span aria-hidden="true">/</span>
        <span aria-current="page">${p.name}</span>
      </nav>
      <section class="roomsShowcase" aria-labelledby="suite-title" data-analytics-section="suite_hero">
        <div class="roomsShowcase__copy">
          <p class="roomsEyebrow">${p.kicker}</p>
          <h1 id="suite-title">${p.name}</h1>
          <p class="roomsShowcase__lead">${p.lead}</p>
          <div class="roomsShowcase__actions">
            ${link(p.booking, p.book, 'suite_hero', 'btn primary', 'booking_cta_click')}
            ${link(p.hub, p.compare, 'suite_hero', 'btn roomsButtonLight')}
          </div>
        </div>
        <div class="roomsShowcase__media">
          <img src="${imageBase}tcfr_rooms_ps_c_02.jpg" alt="${p.name}" loading="eager" fetchpriority="high" decoding="async" />
          <div class="roomsShowcase__note">
${p.highlights.map(([a, b]) => `            <div>
              <strong>${a}</strong>
              <span>${b}</span>
            </div>`).join('\n')}
          </div>
        </div>
      </section>
      <section class="roomsSection roomsGuidance" aria-labelledby="suite-features-title" data-analytics-section="suite_features">
${heading('suite-features-title', p.featuresLabel, p.featuresTitle, p.featuresIntro)}
        <div class="roomsGuidance__grid">
${p.features.map(([title, text], i) => `          <article class="roomsGuidance__card">
            <span>0${i + 1}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join('\n')}
        </div>
      </section>
      <section class="roomsSection" aria-labelledby="suite-gallery-title" data-analytics-section="suite_gallery">
${heading('suite-gallery-title', p.photosLabel, p.galleryTitle, p.galleryIntro)}
        <div class="suiteGallery">
${p.photos.map(([file, alt, caption]) => `          <figure>
            <img src="${imageBase + file}" alt="${alt}" loading="lazy" decoding="async" />
            <figcaption>${caption}</figcaption>
          </figure>`).join('\n')}
        </div>
      </section>
      <section class="roomsSection roomsCompare" aria-labelledby="suite-fit-title" data-analytics-section="suite_fit">
        <div class="roomsCompare__intro">
          <p class="roomsEyebrow">${p.featuresLabel}</p>
          <h2 id="suite-fit-title">${p.fitTitle}</h2>
          <p>${p.fitText}</p>
          <div class="roomsShowcase__actions">
            ${link(p.hub, p.compare, 'suite_fit', 'btn roomsButtonLight')}
          </div>
        </div>
        <div class="roomsCompare__intro">
          <h2>${p.sharedTitle}</h2>
          <p>${p.sharedText}</p>
          <div class="roomsShowcase__actions">
            ${link(p.common, p.sharedLink, 'suite_fit', 'btn roomsButtonLight')}
          </div>
        </div>
      </section>
      <section class="roomsSection roomsInclusions" aria-labelledby="suite-practical-title" data-analytics-section="suite_planning">
${heading('suite-practical-title', p.planningLabel, p.practicalTitle, p.practicalIntro)}
        <div class="roomsInclusions__grid">
${p.practical.map(([title, text], i) => `          <article class="roomsInclusion">
            <span>0${i + 1}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join('\n')}
        </div>
        <div class="roomsShowcase__actions">
          ${link(p.booking, p.book, 'suite_planning', 'btn primary', 'booking_cta_click')}
          ${link(p.contact, p.ask, 'suite_planning', 'btn secondary', 'contact_cta_click')}
        </div>
      </section>
${reviews}
      <section class="roomsSection roomsFaq tcfrFaq" id="faq" aria-labelledby="suite-faq-title" data-analytics-section="faq">
        <div class="roomsFaq__intro tcfrFaq__intro">
          <p class="roomsEyebrow roomsEyebrow--dark">${p.faqLabel}</p>
          <h2 id="suite-faq-title">${p.faqTitle}</h2>
          <p>${p.faqIntro}</p>
        </div>
        <div class="roomsFaq__list tcfrFaq__list">
${p.faqs.map(([q, a]) => `          <details>
            <summary>${q}</summary>
            <p>${a}</p>
          </details>`).join('\n')}
        </div>
      </section>
      <!-- TCFR_ARCHITECTURE_START -->
      <section class="tcfr-related" aria-labelledby="tcfr-related-title" data-analytics-section="related_content">
        <p class="tcfr-related__eyebrow">${p.relatedLabel}</p>
        <h2 class="tcfr-related__title" id="tcfr-related-title">${p.relatedTitle}</h2>
        <div class="tcfr-related__grid">
${p.related.map(([label, url]) => `          ${link(url, label, 'related_content', 'tcfr-related__link')}`).join('\n')}
        </div>
        <div class="tcfr-related__cta">
          ${link(p.booking, p.book, 'related_content', 'btn primary', 'booking_cta_click')}
          ${link(p.contact, p.ask, 'related_content', 'btn secondary', 'contact_cta_click')}
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
  await fs.writeFile(`${paths[lang].slice(1)}index.html`, html);
  console.log(`Updated ${paths[lang]}`);
}
