import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const origin = (process.env.TCFR_QA_ORIGIN || 'http://127.0.0.1:4173').replace(/\/$/, '');
const output = process.env.QA_OUTPUT || '/tmp/tcfr-forms-final-qa';
const cases = [
  { route: '/booking/', lang: 'en', kind: 'booking', form: '#tcfrBookingForm', success: 'Your request has been sent.', error: 'QA simulated backend rejection.' },
  { route: '/es/reservas/', lang: 'es', kind: 'booking', form: '#tcfrBookingForm', success: 'Tu solicitud fue enviada.', error: 'QA simulated backend rejection.' },
  { route: '/contact/', lang: 'en', kind: 'contact', form: '#tcfrContactForm', success: 'Message sent', error: 'QA simulated backend rejection.' },
  { route: '/es/contacto/', lang: 'es', kind: 'contact', form: '#tcfrContactForm', success: 'Mensaje enviado', error: 'QA simulated backend rejection.' }
];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const reports = [];

for (const item of cases) for (const width of [390, 768, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 } });
  const page = await context.newPage();
  const errors = [], requests = [], events = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__qaEvents = [];
    window.dataLayer = window.dataLayer || [];
    const originalPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = (...args) => { window.__qaEvents.push(...args); return originalPush(...args); };
  });
  await page.route('**/*', route => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.protocol === 'https:' && requestUrl.origin !== origin) route.abort();
    else route.continue();
  });
  await page.goto(`${origin}${item.route}?utm_source=final_qa&utm_medium=automation&utm_campaign=preproduction`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(item.form);
  await page.waitForFunction(
    ({ formSelector, action }) => document.querySelector(`${formSelector} .cf-turnstile[data-sitekey][data-action="${action}"]`),
    { formSelector: item.form, action: `${item.kind}_submit` },
    { timeout: 10000 }
  );
  await page.click('[data-tcfr-consent="accept"]');
  const initial = await page.evaluate(({ formSelector, kind }) => {
    const form = document.querySelector(formSelector);
    const labels = [...form.querySelectorAll('label[for]')];
    const required = [...form.querySelectorAll('[required]')];
    return {
      bound: kind === 'booking' ? form.dataset.bookingFormBound : form.getAttribute('data-contact-form-bound'),
      labelTargets: labels.every(label => !!document.getElementById(label.htmlFor)),
      requiredCount: required.length,
      secret: !!form.querySelector('[name="cf_secret"]') || document.documentElement.innerHTML.includes('TCFR_CF_GATE_'),
      turnstileNode: form.querySelector('.cf-turnstile[data-sitekey]')?.dataset.action || '',
      turnstileScript: !!document.querySelector('#tcfr-turnstile-loader'),
      messageStartsEmpty: form.querySelector('#message')?.value === '',
      attribution: Object.fromEntries([...form.querySelectorAll('input[name^="attribution_"]')].map(input => [input.name, input.value])),
      overflow: document.documentElement.scrollWidth > innerWidth + 1
    };
  }, { formSelector: item.form, kind: item.kind });

  await page.locator(item.form).evaluate(form => form.requestSubmit());
  const emptyInvalid = await page.locator(item.form).evaluate(form => !form.checkValidity());
  await page.fill('#first_name', 'qa'); await page.fill('#last_name', 'audit');
  await page.fill('#email', 'invalid-email');
  if (item.kind === 'booking') {
    await page.fill('#phone_number', '+1 555 010 2026');
    await page.fill('#date_start', '2026-12-15');
    await page.fill('#date_end', '2026-12-17');
    await page.selectOption('#number_of_guests', { index: 1 });
  }
  await page.fill('#message', 'qa automated form validation test');
  const invalidEmail = await page.locator('#email').evaluate(input => !input.checkValidity());
  await page.fill('#email', `qa+${item.lang}-${item.kind}@example.com`);
  await page.locator(item.form).evaluate(form => form.requestSubmit());
  const missingToken = await page.locator('body').evaluate(body => /verification|verificación|Turnstile/i.test(body.innerText));

  const endpoint = item.kind === 'booking' ? '/api/booking' : '/api/contact';
  await page.route(`**${endpoint}`, async route => {
    const postData = route.request().postData() || '';
    requests.push(postData);
    await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ ok: false, message: item.error }) });
  });
  await page.locator(item.form).evaluate(form => {
    let token = form.querySelector('[name="cf-turnstile-response"]');
    if (!token) { token = document.createElement('input'); token.type = 'hidden'; token.name = 'cf-turnstile-response'; form.appendChild(token); }
    token.value = 'qa-token';
    form.requestSubmit();
  });
  await page.waitForFunction(text => document.body.innerText.includes(text), item.error);
  const errorShown = await page.locator('body').evaluate((body, text) => body.innerText.includes(text), item.error);
  await page.unroute(`**${endpoint}`);
  await page.route(`**${endpoint}`, async route => {
    const postData = route.request().postData() || '';
    requests.push(postData);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, message: 'accepted' }) });
  });
  await page.locator(item.form).evaluate(form => {
    const token = form.querySelector('[name="cf-turnstile-response"]'); token.value = 'qa-token-2'; form.requestSubmit();
  });
  await page.waitForFunction(text => document.body.innerText.includes(text), item.success);
  const final = await page.evaluate(({ successText, formSelector, kind }) => {
    const form = document.querySelector(formSelector);
    const eventNames = (window.dataLayer || []).filter(item => item && item[0] === 'event').map(item => item[1]);
    return {
      successShown: document.body.innerText.includes(successText),
      buttonEnabled: !form.querySelector('button[type="submit"]').disabled,
      eventNames,
      dateRange: kind === 'booking' ? form.querySelector('[name="dates_of_visit"]').value : null,
      sourcePage: form.querySelector('[name="source_page"]').value,
      language: form.querySelector('[name="lang"]').value
    };
  }, { successText: item.success, formSelector: item.form, kind: item.kind });
  events.push(...final.eventNames);
  const checks = {
    bound: initial.bound === 'true', labels: initial.labelTargets, required: initial.requiredCount >= (item.kind === 'booking' ? 7 : 4),
    noSecret: !initial.secret, turnstile: initial.turnstileNode === `${item.kind}_submit` && initial.turnstileScript,
    messageStartsEmpty: initial.messageStartsEmpty,
    attribution: initial.attribution.attribution_first_source === 'final_qa' && initial.attribution.attribution_last_campaign === 'preproduction',
    responsive: !initial.overflow, emptyValidation: emptyInvalid, emailValidation: invalidEmail, missingToken,
    errorResponse: errorShown, successResponse: final.successShown, buttonRestored: final.buttonEnabled,
    analytics: events.includes('form_submit_attempt') && events.includes('form_submit_error') && events.includes('form_submit_success'),
    language: final.language === item.lang, sourcePage: final.sourcePage.includes(item.route),
    dateSync: item.kind !== 'booking' || final.dateRange === '',
    requests: requests.length === 2 && requests.every(body => body.includes('final_qa')),
    runtime: errors.length === 0
  };
  const report = { ...item, width, pass: Object.values(checks).every(Boolean), checks, initial, final, errors, requestCount: requests.length };
  reports.push(report);
  await page.screenshot({ path: path.join(output, `${item.kind}-${item.lang}-${width}.png`), fullPage: true });
  console.log(JSON.stringify({ route: item.route, width, pass: report.pass, failed: Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name) }));
  await context.close();
}
await browser.close();
const summary = { date: new Date().toISOString(), origin, cases: reports.length, passed: reports.filter(r => r.pass).length, failed: reports.filter(r => !r.pass).length, failures: reports.filter(r => !r.pass) };
await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(reports, null, 2));
await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
if (summary.failed) process.exitCode = 1;
