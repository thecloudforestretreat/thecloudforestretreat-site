import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
const root = process.cwd();
const output = "/tmp/tcfr-whole-house-home-contact-qa";
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };

await fs.mkdir(output, { recursive: true });
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith("/")) file = path.join(file, "index.html");
    const body = await fs.readFile(file);
    response.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const reports = [];

for (const item of [
  { route: "/", lang: "en", page: "/whole-house-rental-near-quito/", booking: "/booking/?stay=entire-house", heading: "Reserve the whole retreat together." },
  { route: "/es/", lang: "es", page: "/es/alquiler-casa-completa-cerca-de-quito/", booking: "/es/reservas/?stay=entire-house", heading: "Reserva todo el refugio para tu grupo." }
]) for (const width of [390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.protocol === "https:") route.abort();
    else route.continue();
  });
  await page.goto(origin + item.route, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".homeWholeHouse");
  await page.locator(".homeWholeHouse").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const image = document.querySelector(".homeWholeHouse__image");
    return image?.complete && image.naturalWidth > 0;
  });
  const result = await page.evaluate(expected => {
    const card = document.querySelector(".homeWholeHouse");
    const image = card.querySelector(".homeWholeHouse__image");
    const content = card.querySelector(".homeWholeHouse__content");
    const links = [...card.querySelectorAll("a")];
    const imageRect = image.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    return {
      heading: card.querySelector("h2")?.textContent.trim(),
      imageLoaded: image.complete && image.naturalWidth > 0,
      pageHref: links[0]?.getAttribute("href"),
      bookingHref: links[1]?.getAttribute("href"),
      tracked: links.every(link => link.dataset.analyticsEvent && link.dataset.analyticsLocation === "home_whole_house"),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      desktopAligned: innerWidth < 981 || Math.abs(imageRect.top - contentRect.top) < 2,
      mobileStacked: innerWidth >= 981 || imageRect.bottom <= contentRect.top + 2,
      expected
    };
  }, item);
  const pass = result.heading === item.heading && result.imageLoaded && result.pageHref === item.page && result.bookingHref === item.booking && result.tracked && !result.overflow && result.desktopAligned && result.mobileStacked && errors.length === 0;
  reports.push({ kind: "home", route: item.route, width, pass, result, errors });
  await page.screenshot({ path: path.join(output, `home-${item.lang}-${width}.png`), fullPage: true });
  await page.close();
}

for (const item of [
  { route: "/contact/?topic=whole-house", lang: "en", label: "Inquiry type", option: "Whole-house rental" },
  { route: "/es/contacto/?topic=whole-house", lang: "es", label: "Tipo de consulta", option: "Alquiler de casa completa" }
]) for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 } });
  const errors = [], requests = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.protocol === "https:") route.abort();
    else route.continue();
  });
  await page.route("**/api/contact", async route => {
    requests.push(JSON.parse(route.request().postData() || "{}"));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto(origin + item.route, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#tcfrContactForm")?.dataset.contactFormBound === "true");
  const initial = await page.evaluate(() => ({
    value: document.querySelector("#inquiry_type")?.value,
    text: document.querySelector("#inquiry_type")?.selectedOptions[0]?.textContent.trim(),
    label: document.querySelector('label[for="inquiry_type"]')?.textContent.trim(),
    textareaEmpty: document.querySelector("#message")?.value === "",
    overflow: document.documentElement.scrollWidth > innerWidth + 1
  }));
  await page.fill("#first_name", "test");
  await page.fill("#last_name", "guest");
  await page.fill("#email", "qa@example.com");
  await page.fill("#message", "whole house question");
  await page.locator("#tcfrContactForm").evaluate(form => {
    const token = document.createElement("input");
    token.type = "hidden";
    token.name = "cf-turnstile-response";
    token.value = "qa-token";
    form.appendChild(token);
    form.requestSubmit();
  });
  await page.waitForFunction(() => document.body.innerText.includes(document.documentElement.lang === "es" ? "Mensaje enviado" : "Message sent"));
  const pass = initial.value === "Whole-house rental" && initial.text === item.option && initial.label === item.label && initial.textareaEmpty && !initial.overflow && requests.length === 1 && requests[0].inquiry_type === "Whole-house rental" && errors.length === 0;
  reports.push({ kind: "contact", route: item.route, width, pass, initial, requests, errors });
  await page.screenshot({ path: path.join(output, `contact-${item.lang}-${width}.png`), fullPage: true });
  await page.close();
}

for (const item of [
  ["/whole-house-rental-near-quito/", "/contact/?topic=whole-house"],
  ["/es/alquiler-casa-completa-cerca-de-quito/", "/es/contacto/?topic=whole-house"]
]) {
  const page = await browser.newPage();
  await page.goto(origin + item[0], { waitUntil: "domcontentloaded" });
  const href = await page.locator('.stayFinal a[data-analytics-event="contact_cta_click"]').getAttribute("href");
  reports.push({ kind: "whole-house-link", route: item[0], pass: href === item[1], href });
  await page.close();
}

await browser.close();
await new Promise(resolve => server.close(resolve));
const failed = reports.filter(report => !report.pass);
await fs.writeFile(path.join(output, "results.json"), JSON.stringify(reports, null, 2));
console.log(JSON.stringify({ cases: reports.length, passed: reports.length - failed.length, failed: failed.length, failures: failed }, null, 2));
if (failed.length) process.exitCode = 1;
