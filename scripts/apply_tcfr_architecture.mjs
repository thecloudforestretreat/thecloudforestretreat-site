import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const roadmapPath = path.join(root, "audit_inputs", "TCFR_SiteMap - sitemap_enriched.csv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { value += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else value += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(value); value = ""; }
    else if (char === "\n") { row.push(value.replace(/\r$/, "")); rows.push(row); row = []; value = ""; }
    else value += char;
  }
  if (value || row.length) { row.push(value.replace(/\r$/, "")); rows.push(row); }
  const headers = rows.shift() || [];
  return rows.filter((item) => item.some(Boolean)).map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] || ""])));
}

function normalizeRoute(route) {
  if (!route || route === "/") return "/";
  return `/${route.replace(/^\/+|\/+$/g, "")}/`;
}

function fileForRoute(route) {
  const normalized = normalizeRoute(route);
  return normalized === "/" ? path.join(root, "index.html") : path.join(root, normalized.slice(1), "index.html");
}

function clusterFor(row) {
  const type = row.page_type || "";
  const topic = (row.topic_cluster || "").toLowerCase();
  if (type === "home_page") return "home";
  if (type.includes("room")) return "rooms";
  if (type.includes("feature") || type === "gallery_page") return "features";
  if (type === "booking_page" || type === "contact_page") return "conversion";
  if (type === "legal_page") return "legal";
  if (type.includes("blog")) return "editorial";
  if (topic.includes("bird") || topic.includes("regional") || topic.includes("nature authority")) return "nature-birding";
  if (type === "planning_page" || type === "destination_support_page" || type === "comparison_page" || type === "info_page") return "planning";
  return "stay";
}

function esc(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function relatedTargets(row, allRows) {
  const language = row.language;
  const cluster = clusterFor(row);
  const same = allRows.filter((candidate) => candidate.language === language && normalizeRoute(candidate.page_path) !== normalizeRoute(row.page_path));
  const sameCluster = same.filter((candidate) => clusterFor(candidate) === cluster);
  const priorityRank = { Core: 0, High: 1, Medium: 2, Low: 3 };
  sameCluster.sort((a, b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9) || Number(a.review_order || 999) - Number(b.review_order || 999));

  const route = normalizeRoute(row.page_path);
  const index = sameCluster.findIndex((candidate) => normalizeRoute(candidate.page_path) > route);
  const rotated = index > 0 ? sameCluster.slice(index).concat(sameCluster.slice(0, index)) : sameCluster;
  const essentials = language === "es"
    ? ["/es/lodge-bosque-nublado-cerca-de-quito/", "/es/reservas/", "/es/sobre-nosotros/", "/es/contacto/"]
    : ["/cloud-forest-lodge-near-quito/", "/booking/", "/about/", "/contact/"];
  const selected = [];
  for (const candidate of rotated) {
    if (selected.length >= 6) break;
    selected.push(candidate);
  }
  for (const essential of essentials) {
    const candidate = same.find((item) => normalizeRoute(item.page_path) === essential);
    if (candidate && !selected.some((item) => normalizeRoute(item.page_path) === essential)) selected.push(candidate);
  }
  const sourceRoute = normalizeRoute(row.page_path);
  const spotlightSources = language === "es"
    ? new Set(["/es/", "/es/sobre-nosotros/", "/es/habitaciones/", "/es/retiro-naturaleza-quito/", "/es/escapada-fin-de-semana-quito/"])
    : new Set(["/", "/about/", "/rooms/", "/nature-retreat-quito/", "/weekend-getaway-from-quito/"]);
  const spotlights = language === "es"
    ? ["/es/escapada-romantica-quito/", "/es/retiro-bienestar-quito/"]
    : ["/romantic-getaway-quito/", "/wellness-retreat-quito/"];
  if (spotlightSources.has(sourceRoute)) {
    for (const spotlight of spotlights.reverse()) {
      const candidate = same.find((item) => normalizeRoute(item.page_path) === spotlight);
      if (!candidate) continue;
      const existingIndex = selected.findIndex((item) => normalizeRoute(item.page_path) === spotlight);
      if (existingIndex >= 0) selected.splice(existingIndex, 1);
      selected.unshift(candidate);
    }
  }
  return selected.slice(0, 8);
}

function relatedModule(row, targets) {
  const es = row.language === "es";
  const links = targets.map((target) => {
    const label = target.h1 || target.seo_title || target.primary_keyword || target.page_path;
    return `      <a class="tcfr-related__link" href="${esc(normalizeRoute(target.page_path))}" data-analytics-event="internal_link_click" data-analytics-location="related_content" data-analytics-section="related_content">${esc(label)}</a>`;
  }).join("\n");
  const booking = es ? "/es/reservas/" : "/booking/";
  const contact = es ? "/es/contacto/" : "/contact/";
  return `\n<!-- TCFR_ARCHITECTURE_START -->\n<section class="tcfr-related" aria-labelledby="tcfr-related-title" data-analytics-section="related_content">\n  <p class="tcfr-related__eyebrow">${es ? "Sigue explorando" : "Continue exploring"}</p>\n  <h2 class="tcfr-related__title" id="tcfr-related-title">${es ? "Planifica tu estadía en el bosque nublado" : "Plan your cloud forest stay"}</h2>\n  <div class="tcfr-related__grid">\n${links}\n  </div>\n  <div class="tcfr-related__cta">\n    <a class="btn primary" href="${booking}" data-analytics-event="booking_cta_click" data-analytics-location="related_content">${es ? "Consultar disponibilidad" : "Check availability"}</a>\n    <a class="btn secondary" href="${contact}" data-analytics-event="contact_cta_click" data-analytics-location="related_content">${es ? "Hacer una pregunta" : "Ask a question"}</a>\n  </div>\n</section>\n<!-- TCFR_ARCHITECTURE_END -->\n`;
}

function ensureHeadAssets(html, cluster) {
  html = html.replace(/<script[^>]+src=["']\/assets\/js\/head\.js[^"']*["'][^>]*><\/script>/gi, "");
  html = html.replace(/\s*<link[^>]+href=["']\/assets\/css\/(?:global|footer)\.css[^"']*["'][^>]*\/?\s*>/gi, "");
  html = html.replace(/\s*<link[^>]+href=["']\/assets\/css\/clusters\/[a-z-]+\.css[^"']*["'][^>]*\/?\s*>/gi, "");
  const cssBlock = `<link href="/assets/css/global.css?v=1" rel="stylesheet"/>\n<link href="/assets/css/footer.css?v=5" rel="stylesheet"/>\n<link href="/assets/css/clusters/${cluster}.css?v=2" rel="stylesheet"/>`;
  html = html.replace(/<\/head>/i, `${cssBlock}\n</head>`);
  if (!html.includes("/assets/js/site-config.js")) html = html.replace(/<\/head>/i, `<script src="/assets/js/site-config.js"></script>\n<script defer src="/assets/js/head.js?v=2"></script>\n</head>`);
  else html = html.replace(/<\/head>/i, `<script defer src="/assets/js/head.js?v=2"></script>\n</head>`);
  return html;
}

function repairLegacyLinks(html) {
  const replacements = new Map([
    ["/es/sobre/", "/es/sobre-nosotros/"],
    ["/cloud-forest-weekend-escape/", "/weekend-getaway-from-quito/"],
    ["/what-makes-a-cloud-forest-stay-different/", "/cloud-forest-ecuador/"],
    ["/best-time-to-visit-ecuador-cloud-forest/", "/blog/best-time-to-visit-cloud-forest/"],
    ["/es/escapada-fin-de-semana-bosque-nublado/", "/es/escapada-fin-de-semana-quito/"],
    ["/es/que-hace-diferente-estadia-bosque-nublado/", "/es/bosque-nublado-ecuador/"],
    ["/es/mejor-epoca-visitar-bosque-nublado-ecuador/", "/es/blog/mejor-epoca-visitar-bosque-nublado/"],
    ["/es/pol%C3%ADtica-de-privacidad/", "/es/politica-de-privacidad/"],
    ["/es/política-de-privacidad/", "/es/politica-de-privacidad/"],
    ["/es/caractersiticas/amenidades/", "/es/caracteristicas/amenidades/"],
    ["/es/caracter%C3%ADsticas/fauna/", "/es/caracteristicas/fauna/"],
    ["/es/características/fauna/", "/es/caracteristicas/fauna/"],
    ["/es/habitaci%C3%B3nes/", "/es/habitaciones/"],
    ["/es/habitaciónes/", "/es/habitaciones/"]
  ]);
  for (const [oldRoute, newRoute] of replacements) html = html.split(oldRoute).join(newRoute);
  return html;
}

function ensureBottomAssets(html) {
  if (!html.includes("/assets/js/attribution.js")) {
    const attribution = `<script src="/assets/js/attribution.js?v=1"></script>`;
    if (/<script[^>]+src=["']\/assets\/js\/site\.js/.test(html)) html = html.replace(/(<script[^>]+src=["']\/assets\/js\/site\.js[^>]*><\/script>)/i, `${attribution}$1`);
    else html = html.replace(/<\/body>/i, `${attribution}<script src="/assets/js/site.js?v=4"></script></body>`);
  }
  return html;
}

function ensureBodyCluster(html, cluster) {
  return html.replace(/<body\b([^>]*)>/i, (match, attrs) => {
    const without = attrs.replace(/\sdata-tcfr-cluster=("[^"]*"|'[^']*')/i, "");
    return `<body${without} data-tcfr-cluster="${cluster}">`;
  });
}

function ensureAttributionInputs(html) {
  const hidden = [
    "attribution_first_source", "attribution_first_medium", "attribution_first_campaign", "attribution_first_landing_page",
    "attribution_last_source", "attribution_last_medium", "attribution_last_campaign", "attribution_last_landing_page", "attribution_click_id"
  ].map((name) => `<input type="hidden" name="${name}" value=""/>`).join("");
  return html.replace(/<form\b([^>]*)>/gi, (match, attrs) => match.includes("data-attribution-ready") ? match : `<form${attrs} data-attribution-ready="true">${hidden}`);
}

function ensureRelated(html, module) {
  html = html.replace(/\n?<!-- TCFR_ARCHITECTURE_START -->[\s\S]*?<!-- TCFR_ARCHITECTURE_END -->\n?/g, "\n");
  if (/<(?:div|footer)[^>]+id=["']siteFooter["']/i.test(html)) return html.replace(/(<(?:div|footer)[^>]+id=["']siteFooter["'][^>]*>)/i, `${module}$1`);
  return html.replace(/<\/body>/i, `${module}</body>`);
}

const rows = parseCsv(await fs.readFile(roadmapPath, "utf8"));
let updated = 0;
const missing = [];

for (const row of rows) {
  const file = fileForRoute(row.page_path);
  let html;
  try { html = await fs.readFile(file, "utf8"); }
  catch (_error) { missing.push(row.page_path); continue; }
  const cluster = clusterFor(row);
  html = ensureHeadAssets(html, cluster);
  html = repairLegacyLinks(html);
  html = ensureBottomAssets(html);
  html = ensureBodyCluster(html, cluster);
  html = ensureAttributionInputs(html);
  html = ensureRelated(html, relatedModule(row, relatedTargets(row, rows)));
  await fs.writeFile(file, html);
  updated += 1;
}

console.log(JSON.stringify({ updated, missing }, null, 2));
