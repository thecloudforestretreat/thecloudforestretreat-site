import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = process.cwd();
const origin = (process.env.TCFR_QA_ORIGIN || 'http://127.0.0.1:4173').replace(/\/$/, '');
const canonicalOrigin = 'https://thecloudforestretreat.com';
const output = process.env.QA_OUTPUT || '/tmp/tcfr-full-site-final-qa';
const widths = (process.env.TCFR_QA_WIDTHS || '390,768,1440').split(',').map(Number);
const workerCount = Number(process.env.TCFR_QA_WORKERS || 2);
const roadmap = path.join(root, 'outputs/01a0cacb-9307-7181-a26c-990d3a098536/TCFR_site_roadmap_enriched_2026-09-23.csv');

function parseCsv(text) {
  const rows = []; let row = []; let value = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { value += '"'; i++; }
      else if (ch === '"') quoted = false;
      else value += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(value); value = ''; }
    else if (ch === '\n') { row.push(value); rows.push(row); row = []; value = ''; }
    else if (ch !== '\r') value += ch;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  return rows;
}

function graphTypes(node) {
  return Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']];
}

async function localTargetExists(href, route) {
  if (!href || /^(?:mailto:|tel:|javascript:|data:|#)/i.test(href)) return true;
  let url;
  try { url = new URL(href, canonicalOrigin + route); } catch { return false; }
  if (url.origin !== canonicalOrigin) return true;
  if (url.pathname.startsWith('/api/')) return true;
  const decoded = decodeURIComponent(url.pathname);
  const file = path.join(root, decoded, decoded.endsWith('/') ? 'index.html' : '');
  try { const stat = await fs.stat(file); return stat.isFile(); } catch { return false; }
}

await fs.mkdir(output, { recursive: true });
const rows = parseCsv(await fs.readFile(roadmap, 'utf8'));
const routes = rows.slice(1).map(row => row[8]).filter(route => /^\//.test(route));
const uniqueRoutes = [...new Set(routes)];
if (uniqueRoutes.length !== 98) throw new Error(`Expected 98 roadmap routes, found ${uniqueRoutes.length}`);

const pairMap = new Map();
for (let i = 0; i < uniqueRoutes.length; i += 2) {
  const a = uniqueRoutes[i], b = uniqueRoutes[i + 1];
  const en = a.startsWith('/es/') ? b : a;
  const es = a.startsWith('/es/') ? a : b;
  pairMap.set(en, { en, es }); pairMap.set(es, { en, es });
}

const staticResults = [];
const allLinks = new Map();
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const tasks = uniqueRoutes.flatMap(route => widths.map(width => ({ route, width })));
let cursor = 0;

async function worker() {
  while (cursor < tasks.length) {
    const task = tasks[cursor++];
    const { route, width } = task;
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 } });
    const page = await context.newPage();
    const pageErrors = [], consoleErrors = [], requestFailures = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error' && !/ERR_BLOCKED_BY_CLIENT|Failed to load resource/.test(msg.text())) consoleErrors.push(msg.text()); });
    page.on('requestfailed', req => {
      const u = req.url();
      if (u.startsWith(origin) && !/\/api\//.test(u)) requestFailures.push({ url: u, error: req.failure()?.errorText || '' });
    });
    await page.route('**/*', routeObj => {
      const requestUrl = new URL(routeObj.request().url());
      if (requestUrl.protocol === 'https:' && requestUrl.origin !== origin) routeObj.abort();
      else routeObj.continue();
    });
    const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('#siteHeader .tcfr-header, #siteHeader header', { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('#siteFooter footer', { timeout: 10000 }).catch(() => {});
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
      await Promise.race([Promise.all([...document.images].map(img => img.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 5000))]);
      if (document.fonts) await document.fonts.ready;
    });
    const result = await page.evaluate(() => {
      const schemas = [];
      const schemaErrors = [];
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
          const parsed = JSON.parse(script.textContent || '{}');
          schemas.push(...(Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed]));
        } catch (error) { schemaErrors.push(error.message); }
      });
      const faqs = [...document.querySelectorAll('.tcfrFaq details')].map(details => [
        details.querySelector('summary')?.textContent.trim() || '',
        details.querySelector('p')?.textContent.trim() || ''
      ]);
      const schemaFaq = schemas.find(node => node['@type'] === 'FAQPage');
      const schemaFaqs = (schemaFaq?.mainEntity || []).map(question => [question.name || '', question.acceptedAnswer?.text || '']);
      return {
        statusText: document.body.textContent.slice(0, 100),
        title: document.title.trim(),
        description: document.querySelector('meta[name="description"]')?.content.trim() || '',
        h1: document.querySelectorAll('h1').length,
        htmlLang: document.documentElement.lang,
        bodyLang: document.body.dataset.pageLanguage || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        social: {
          title: document.querySelector('meta[property="og:title"]')?.content || '',
          description: document.querySelector('meta[property="og:description"]')?.content || '',
          url: document.querySelector('meta[property="og:url"]')?.content || '',
          image: document.querySelector('meta[property="og:image"]')?.content || '',
          twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content || '',
          twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content || '',
          twitterImage: document.querySelector('meta[name="twitter:image"]')?.content || ''
        },
        alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(link => [link.hreflang, link.href]),
        schemaErrors,
        schemaTypes: schemas.flatMap(node => Array.isArray(node['@type']) ? node['@type'] : [node['@type']]).filter(Boolean),
        faqCount: faqs.length,
        faqParity: !faqs.length || JSON.stringify(faqs) === JSON.stringify(schemaFaqs),
        header: (document.querySelector('#siteHeader')?.textContent || '').trim().length > 50,
        footer: (document.querySelector('#siteFooter')?.textContent || '').trim().length > 50,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        brokenImages: [...document.images].filter(img => img.getAttribute('src') && (!img.complete || img.naturalWidth === 0)).map(img => img.getAttribute('src')),
        links: [...document.querySelectorAll('a[href]')].map(link => link.getAttribute('href')),
        formSecret: !!document.querySelector('input[name="cf_secret"]') || document.documentElement.innerHTML.includes('TCFR_CF_GATE_'),
        scripts: [...document.scripts].map(script => script.src),
        consent: { status: window.__TCFR_CONSENT_STATUS__, defaultDenied: (window.dataLayer || []).some(item => item && item[0] === 'consent' && item[1] === 'default' && item[2]?.analytics_storage === 'denied') }
      };
    });
    if (!allLinks.has(route)) allLinks.set(route, new Set());
    result.links.forEach(link => allLinks.get(route).add(link));
    const pair = pairMap.get(route);
    const expectedAlternates = [['en', canonicalOrigin + pair.en], ['es', canonicalOrigin + pair.es], ['x-default', canonicalOrigin + pair.en]].sort();
    const language = route.startsWith('/es/') ? 'es' : 'en';
    const checks = {
      http: response?.status() === 200,
      h1: result.h1 === 1,
      metadata: result.title.length >= 20 && result.title.length <= 70 && result.description.length >= 70 && result.description.length <= 170,
      language: result.htmlLang.startsWith(language) && result.bodyLang === language,
      canonical: result.canonical === canonicalOrigin + route,
      social: result.social.title === result.title && result.social.description === result.description && result.social.url === result.canonical && result.social.image.startsWith(canonicalOrigin + '/') && result.social.twitterTitle === result.title && result.social.twitterDescription === result.description && result.social.twitterImage === result.social.image,
      alternates: JSON.stringify(result.alternates.slice().sort()) === JSON.stringify(expectedAlternates),
      schema: !result.schemaErrors.length && ['WebPage', 'AboutPage', 'ContactPage', 'CollectionPage', 'BlogPosting'].some(type => result.schemaTypes.includes(type)) && (route === '/' || route === '/es/' || result.schemaTypes.includes('BreadcrumbList')),
      faq: result.faqParity,
      includes: result.header && result.footer,
      responsive: !result.overflow,
      images: !result.brokenImages.length,
      scripts: ['site-config.js', 'head.js', 'site.js'].every(name => result.scripts.some(src => src.includes('/assets/js/' + name))),
      noClientSecret: !result.formSecret,
      consentDefault: result.consent.defaultDenied,
      runtime: !pageErrors.length && !consoleErrors.length && !requestFailures.length
    };
    staticResults.push({ route, width, pass: Object.values(checks).every(Boolean), checks, pageErrors, consoleErrors, requestFailures, result });
    console.log(JSON.stringify({ route, width, pass: Object.values(checks).every(Boolean), failed: Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name) }));
    await context.close();
  }
}

await Promise.all(Array.from({ length: workerCount }, worker));
await browser.close();

const brokenLinks = [];
for (const [route, links] of allLinks) {
  for (const href of links) if (!await localTargetExists(href, route)) brokenLinks.push({ route, href });
}
const sitemap = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapMissing = uniqueRoutes.filter(route => !sitemap.includes(`<loc>${canonicalOrigin}${route}</loc>`));
const summary = {
  date: new Date().toISOString(), origin, routes: uniqueRoutes.length, widths,
  browserCases: staticResults.length,
  passedCases: staticResults.filter(item => item.pass).length,
  failedCases: staticResults.filter(item => !item.pass).length,
  brokenLinks, sitemapMissing,
  failed: staticResults.filter(item => !item.pass).map(item => ({ route: item.route, width: item.width, checks: item.checks, errors: [...item.pageErrors, ...item.consoleErrors], requestFailures: item.requestFailures, brokenImages: item.result.brokenImages }))
};
await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(staticResults, null, 2));
await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
if (summary.failedCases || brokenLinks.length || sitemapMissing.length) process.exitCode = 1;
