import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const output = process.env.QA_OUTPUT || '/tmp/tcfr-pair008-qa';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const routes = ['/rooms/sunset-room/', '/es/habitaciones/habitacion-atardecer/'];
const origin = 'https://thecloudforestretreat.com';
const reports = [];
for (const width of [390, 768, 1440]) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`http://127.0.0.1:4173${route}?utm_source=pair008_qa&utm_medium=test`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#siteFooter .tcfr-related, #siteFooter footer');
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => img.loading = 'eager');
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
      await document.fonts.ready;
    });
    const result = await page.evaluate(() => {
      const graph = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s => JSON.parse(s.textContent)['@graph']);
      const faq = [...document.querySelectorAll('.roomsFaq details')].map(d => [d.querySelector('summary').textContent.trim(), d.querySelector('p').textContent.trim()]);
      const schemaFaq = graph.find(n => n['@type'] === 'FAQPage').mainEntity.map(q => [q.name, q.acceptedAnswer.text]);
      const groups = ['.roomsGuidance__card', '.roomsInclusion', '.roomsReview'].map(selector => {
        const heights = [...document.querySelectorAll(selector)].map(e => e.getBoundingClientRect().height);
        return { selector, delta: Math.max(...heights) - Math.min(...heights) };
      });
      return {
        compareRows: ['h2', '.roomsShowcase__actions'].map(s => [...document.querySelectorAll('.roomCompareAligned .roomsCompare__intro')].map(e => e.querySelector(s).getBoundingClientRect().top)),
        bathroom: document.querySelector('.roomBathroom')?.textContent,
        video: document.querySelector('[data-analytics-event="video_click"]')?.href,
        h1: document.querySelectorAll('h1').length,
        canonical: document.querySelector('[rel="canonical"]').href,
        title: document.title,
        description: document.querySelector('[name="description"]').content,
        alternates: [...document.querySelectorAll('[hreflang][rel="alternate"]')].map(e => [e.hreflang, e.href]),
        faqMatches: JSON.stringify(faq) === JSON.stringify(schemaFaq), faqCount: faq.length,
        room: graph.find(n => n['@type'] === 'HotelRoom'),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        groups,
        currentLanguage: document.querySelector('#siteHeader .tcfr-langBtn[aria-current="page"]')?.dataset.lang,
        languageLinks: [...document.querySelectorAll('#siteHeader .tcfr-langBtn')].map(a => [a.dataset.lang, new URL(a.href).pathname]),
        headerLoaded: document.querySelector('#siteHeader').textContent.length > 50,
        footerLoaded: document.querySelector('#siteFooter').textContent.length > 50,
        brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
        untracked: [...document.querySelectorAll('main a, .rawLangLinks a')].filter(a => !a.dataset.analyticsEvent).map(a => a.href),
        links: [...document.querySelectorAll('main a, .rawLangLinks a')].map(a => a.getAttribute('href')),
        configRating: document.querySelector('[data-tcfr-config-text="reputation.googleRating"]').textContent === window.TCFR_CONFIG.reputation.googleRating,
        configReview: document.querySelector('[data-tcfr-config-href="reputation.googleReviewsReadUrl"]').href === window.TCFR_CONFIG.reputation.googleReviewsReadUrl,
        pageTop: getComputedStyle(document.documentElement).getPropertyValue('--tcfr-page-top').trim(),
        scripts: [...document.scripts].map(s => s.src),
        styles: [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href),
        attribution: Object.fromEntries(Object.entries(localStorage).filter(([key]) => /tcfr/i.test(key)))
      };
    });
    const brokenLinks = [];
    for (const href of new Set(result.links)) {
      const url = new URL(href, origin + route);
      if (url.origin !== origin) continue;
      const filename = path.join(process.cwd(), decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
      try { await fs.access(filename); } catch { brokenLinks.push(url.pathname); }
    }
    const lang = route.startsWith('/es/') ? 'es' : 'en';
    const checks = {
      heading: result.h1 === 1,
      alignment: width < 981 || result.compareRows.every(a => Math.max(...a)-Math.min(...a) <= 1),
      bathroom: /Sunset.*Sunrise|Atardecer.*Amanecer/s.test(result.bathroom) && result.room.amenityFeature.some(a => /Shared hallway bathroom|Baño compartido en el pasillo/.test(a.name)),
      video: result.video === 'https://www.youtube.com/watch?v=1Djnf3UnF4g',
      canonical: result.canonical === origin + route,
      alternates: JSON.stringify(result.alternates) === JSON.stringify([['en', origin + routes[0]], ['es', origin + routes[1]], ['x-default', origin + routes[0]]]),
      faq: result.faqCount === 4 && result.faqMatches,
      room: result.room.url === origin + route && result.room.containedInPlace['@id'] === origin + '/#lodging',
      responsive: !result.overflow && (width < 981 || result.groups.every(g => g.delta <= 1)),
      language: result.currentLanguage === lang && result.languageLinks.every(([code, href]) => href === routes[code === 'en' ? 0 : 1]),
      includes: result.headerLoaded && result.footerLoaded,
      assets: result.brokenImages.length === 0,
      links: brokenLinks.length === 0,
      hooks: result.untracked.length === 0,
      config: result.configRating && result.configReview,
      attribution: JSON.stringify(result.attribution).includes('pair008_qa'),
      sharedAssets: ['site-config.js', 'head.js', 'attribution.js', 'site.js'].every(s => result.scripts.some(url => url.includes('/assets/js/' + s))) && ['global.css', 'clusters/rooms.css', 'components/faq.css'].every(s => result.styles.some(url => url.includes('/assets/css/' + s))),
      spacing: result.pageTop === (width <= 760 ? '12px' : '18px'),
      errors: errors.length === 0
    };
    await page.screenshot({ path: `${output}/${lang}-${width}.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${lang}-${width}-top.png` });
    // A visible question must open by keyboard, retaining no horizontal overflow.
    await page.locator('.roomsFaq summary').first().focus();
    await page.keyboard.press('Enter');
    checks.faqKeyboard = await page.locator('.roomsFaq details').first().evaluate(e => e.open);
    const report = { route, width, pass: Object.values(checks).every(Boolean), checks, errors, brokenLinks, result };
    reports.push(report);
    console.log(JSON.stringify({ route, width, pass: report.pass, checks, errors, brokenLinks, brokenImages: result.brokenImages, currentLanguage: result.currentLanguage }));
    await page.close();
  }
}
await browser.close();
await fs.writeFile(`${output}/results.json`, JSON.stringify(reports, null, 2));
if (reports.some(r => !r.pass)) process.exitCode = 1;
