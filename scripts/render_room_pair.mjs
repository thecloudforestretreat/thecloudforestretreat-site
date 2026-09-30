import fs from 'node:fs/promises';
const origin = 'https://thecloudforestretreat.com';
const imageBase = '/assets/images/pages/rooms/';
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const track = (event, location, label) => `data-analytics-event="${event}" data-analytics-location="${location}" data-analytics-page-type="room_detail_page" data-analytics-label="${esc(label)}"`;
const link = (url, label, location, classes = '', event = 'internal_link_click') => `<a${classes ? ` class="${classes}"` : ''} href="${url}" ${track(event, location, label)}>${esc(label)}</a>`;
const heading = (id, eyebrow, title, intro) => `        <header class="roomsSectionHeading">
          <p class="roomsEyebrow roomsEyebrow--dark">${esc(eyebrow)}</p>
          <h2 id="${id}">${esc(title)}</h2>
          <p>${esc(intro)}</p>
        </header>`;

export async function buildRoomPair(copy, paths, slug) {
for (const lang of ['en', 'es']) {
  const p = copy[lang];
  const hub = await fs.readFile(`${p.hub.slice(1)}index.html`, 'utf8');
  const canonical = origin + paths[lang];
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': ['LodgingBusiness', 'BedAndBreakfast'], '@id': `${origin}/#lodging`, name: 'The Cloud Forest Retreat', url: origin + '/', address: { '@type': 'PostalAddress', addressRegion: 'Pichincha', addressCountry: 'EC' } },
      { '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical, name: p.title, description: p.description, inLanguage: lang, mainEntity: { '@id': canonical + '#room' }, breadcrumb: { '@id': canonical + '#breadcrumb' } },
      { '@type': 'HotelRoom', '@id': canonical + '#room', name: p.name, description: p.lead, url: canonical, image: p.photos.map(([file]) => origin + imageBase + file), containedInPlace: { '@id': `${origin}/#lodging` }, ...(p.amenities ? { amenityFeature: p.amenities.map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true })) } : {}) },
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
    .replaceAll('tcfr_images_rooms_hero.jpg', p.heroImage || 'tcfr_rooms_ps_c_02.jpg')
    .replace(/(<meta property="og:image:alt" content=")[^"]*/, `$1${esc(p.name)}`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2).split('\n').map(line => '      ' + line).join('\n')}\n    </script>`)
    .replace('rooms.css?v=7', 'rooms.css?v=9');
  const reviewsMatch = hub.match(/      <section class="roomsSection roomsReviews"[\s\S]*?      <\/section>/);
  if (!reviewsMatch) throw new Error('Approved Rooms reviews section not found.');
  const reviews = reviewsMatch[0].replace(/(<h2 id="rooms-reviews-title">).*?(<\/h2>)/, `$1${esc(p.reviewTitle)}$2`)
    .replace('        <div class="roomsReviews__grid">', `        <p class="suiteReviewContext">${esc(p.reviewIntro)}</p>\n        <div class="roomsReviews__grid">`)
    .replace('<strong>5.0</strong>', '<strong data-tcfr-config-text="reputation.googleRating"></strong>')
    .replace(/<small>\(.*?<\/small>/, `<small><span data-tcfr-config-text="reputation.googleReviewCount"></span> ${lang === 'en' ? 'reviews' : 'reseñas'}</small>`)
    .replace('href="https://g.page/r/CQq5wBqKgv0DEAE"', 'href="#rooms-reviews-title" data-tcfr-config-href="reputation.googleReviewsReadUrl"')
    .replace('href="https://g.page/r/CQq5wBqKgv0DEAE/review"', 'href="#rooms-reviews-title" data-tcfr-config-href="reputation.googleReviewsWriteUrl"')
    .replaceAll('data-analytics-page-type="rooms_hub"', 'data-analytics-page-type="room_detail_page"');
  const html = `${head}  <body data-page-language="${lang}" data-page-type="room_detail_page" data-tcfr-cluster="rooms" data-tcfr-template="premium-rooms" data-room="${slug}">
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
          <img src="${imageBase}${p.heroImage || 'tcfr_rooms_ps_c_02.jpg'}" alt="${p.heroAlt || p.name}" loading="eager" fetchpriority="high" decoding="async" />
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
        <div class="suiteGallery${p.photos.length === 2 ? ' roomGallery--two' : ''}">
${p.photos.map(([file, alt, caption]) => `          <figure>
            <img src="${imageBase + file}" alt="${alt}" loading="lazy" decoding="async" />
            <figcaption>${caption}</figcaption>
          </figure>`).join('\n')}
        </div>
      </section>
${p.extraSection || ''}
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
}
