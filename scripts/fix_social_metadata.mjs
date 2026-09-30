import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://thecloudforestretreat.com';
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

function capture(html, regex, label) {
  const match = html.match(regex);
  if (!match) throw new Error(`Missing ${label}`);
  return match[1].trim();
}

function replaceMeta(html, key, value, attribute = 'property') {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s+content="[^"]*"\\s*\\/>`, 'i');
  if (pattern.test(html)) return html.replace(pattern, `<meta ${attribute}="${key}" content="${value}" />`);
  if (attribute === 'property' && key === 'og:image:alt') {
    return html.replace(/(<meta\s+property="og:image"\s+content="[^"]*"\s*\/>)/i, `$1\n    <meta property="og:image:alt" content="${value}" />`);
  }
  throw new Error(`Missing ${attribute}=${key}`);
}

const rows = parseCsv(await fs.readFile(roadmap, 'utf8'));
const routes = [...new Set(rows.slice(1).map(row => row[8]).filter(route => /^\//.test(route)))];
const changed = [];
for (const route of routes) {
  const file = route === '/' ? path.join(root, 'index.html') : path.join(root, route.slice(1), 'index.html');
  let html = await fs.readFile(file, 'utf8');
  const before = html;
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i, `${route} title`);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]*)"\s*\/>/i, `${route} description`);
  const canonical = capture(html, /<link\s+rel="canonical"\s+href="([^"]*)"\s*\/>/i, `${route} canonical`);
  const hero = html.match(/<main[\s\S]*?<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/i);
  const image = new URL(hero?.[1] || '/assets/images/pages/home/tcfr_images_home_hero-01.jpg', origin + route).href;
  const imageAlt = (hero?.[2] || 'The Cloud Forest Retreat').trim();
  html = replaceMeta(html, 'og:title', title);
  html = replaceMeta(html, 'og:description', description);
  html = replaceMeta(html, 'og:url', canonical);
  html = replaceMeta(html, 'og:image', image);
  html = replaceMeta(html, 'og:image:alt', imageAlt);
  html = replaceMeta(html, 'twitter:title', title, 'name');
  html = replaceMeta(html, 'twitter:description', description, 'name');
  html = replaceMeta(html, 'twitter:image', image, 'name');
  if (html !== before) { await fs.writeFile(file, html); changed.push(route); }
}
console.log(JSON.stringify({ routes: routes.length, changed: changed.length }));
