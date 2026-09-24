import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "audit_inputs", "TCFR_SiteMap - sitemap_enriched.csv");

function parseCsv(text) {
  const rows = []; let row = [], value = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { value += '"'; i += 1; }
      else if (c === '"') quoted = false;
      else value += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(value); value = ""; }
    else if (c === "\n") { row.push(value.replace(/\r$/, "")); rows.push(row); row = []; value = ""; }
    else value += c;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  const headers = rows.shift();
  return rows.filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] || ""])));
}

const normalize = (p) => p === "/" ? "/" : `/${p.replace(/^\/+|\/+$/g, "")}/`;
const priority = (row) => row.page_type === "home_page" ? "1.0" : row.priority === "Core" ? "0.9" : row.priority === "High" ? "0.8" : row.priority === "Medium" ? "0.7" : "0.6";
const frequency = (row) => row.page_type.includes("blog") ? "monthly" : row.page_type === "legal_page" ? "yearly" : "monthly";
const rows = parseCsv(await fs.readFile(source, "utf8"));
const today = new Date().toISOString().slice(0, 10);
const urls = [];
for (const row of rows) {
  const route = normalize(row.page_path);
  const file = route === "/" ? path.join(root, "index.html") : path.join(root, route.slice(1), "index.html");
  try { await fs.access(file); } catch (_error) { continue; }
  urls.push(`  <url>\n    <loc>https://thecloudforestretreat.com${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${frequency(row)}</changefreq>\n    <priority>${priority(row)}</priority>\n  </url>`);
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
await fs.writeFile(path.join(root, "sitemap.xml"), xml);
console.log(JSON.stringify({ urls: urls.length, output: "sitemap.xml" }));
