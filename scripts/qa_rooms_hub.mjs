import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/juangranda/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const routes = ["rooms/", "es/habitaciones/"];
const sizes = [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }];
let failed = false;

for (const viewport of sizes) {
  const page = await browser.newPage({ viewport });
  for (const route of routes) {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(400);
    const result = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".roomsChoice")].map((card) => card.getBoundingClientRect().height);
      const graph = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((script) => JSON.parse(script.textContent))
        .flatMap((schema) => schema["@graph"] || [schema]);
      return {
        h1: document.querySelectorAll("h1").length,
        faq: document.querySelectorAll(".roomsFaq details").length,
        rooms: cards.length,
        reviews: document.querySelectorAll(".roomsReview").length,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        language: document.querySelector('.rawLangLinks [aria-current="page"]')?.getAttribute("lang") || "",
        pageTop: getComputedStyle(document.documentElement).getPropertyValue("--tcfr-page-top").trim(),
        cardDelta: cards.length ? Math.max(...cards) - Math.min(...cards) : null,
        faqSchema: graph.find((item) => item["@type"] === "FAQPage")?.mainEntity?.length || 0,
        roomSchema: graph.find((item) => item["@type"] === "ItemList")?.itemListElement?.length || 0,
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        alternates: document.querySelectorAll('link[rel="alternate"][hreflang]').length
      };
    });
    const expectedTop = viewport.width <= 760 ? "12px" : "18px";
    const expectedLanguage = route.startsWith("es/") ? "es" : "en";
    const cardsAligned = viewport.width < 981 || (result.cardDelta !== null && result.cardDelta <= 1);
    const canonicalMatches = result.canonical === `https://thecloudforestretreat.com/${route}`;
    const pass = result.h1 === 1 && result.faq === 4 && result.rooms === 3 && result.reviews === 3 && result.faqSchema === 4 && result.roomSchema === 3 && result.alternates === 3 && canonicalMatches && !result.overflow && result.language === expectedLanguage && result.pageTop === expectedTop && cardsAligned && errors.length === 0;
    console.log(JSON.stringify({ viewport: viewport.width, route, pass, ...result, errors }));
    if (!pass) failed = true;
  }
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
