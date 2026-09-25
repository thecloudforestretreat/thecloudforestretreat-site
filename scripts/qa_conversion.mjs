import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/juangranda/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const routes = ["booking/", "es/reservas/", "contact/", "es/contacto/"];
const sizes = [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }];
let failed = false;

for (const viewport of sizes) {
  const page = await browser.newPage({ viewport });
  for (const route of routes) {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => {
      const formCard = document.querySelector(".conversionFormCard")?.getBoundingClientRect();
      const asideCard = document.querySelector(".conversionAside")?.getBoundingClientRect();
      const workspaceDelta = formCard && asideCard ? Math.abs(formCard.bottom - asideCard.bottom) : null;

      return {
        h1: document.querySelectorAll("h1").length,
        faq: document.querySelectorAll(".conversionFaq details").length,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        form: Boolean(document.querySelector("#tcfrBookingForm, #tcfrContactForm")),
        pageTop: getComputedStyle(document.documentElement).getPropertyValue("--tcfr-page-top").trim(),
        language: document.querySelector('.rawLangLinks [aria-current="page"]')?.getAttribute("lang") || "",
        workspaceDelta
      };
    });
    const expectedTop = viewport.width <= 760 ? "12px" : "18px";
    const expectedLanguage = route.startsWith("es/") ? "es" : "en";
    const actionableErrors = errors.filter((message) => !message.includes("[Cloudflare Turnstile] Error: 110200"));
    const workspaceAligned = viewport.width <= 900 || (result.workspaceDelta !== null && result.workspaceDelta <= 1);
    const pass = result.h1 === 1 && result.faq === 4 && !result.overflow && result.form && result.pageTop === expectedTop && result.language === expectedLanguage && workspaceAligned && actionableErrors.length === 0;
    console.log(JSON.stringify({ viewport: viewport.width, route, pass, ...result, errors: actionableErrors }));
    if (!pass) failed = true;
  }
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
