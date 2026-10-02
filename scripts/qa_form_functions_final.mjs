import { onRequestPost as booking } from '../functions/api/booking.js';
import { onRequestPost as contact } from '../functions/api/contact.js';

const host = 'https://staging.example.com';
const baseEnv = {
  TURNSTILE_SECRET_KEY: 'turnstile-secret',
  TCFR_BOOKING_WEBAPP_URL: 'https://upstream.example.com/booking',
  TCFR_CONTACT_WEBAPP_URL: 'https://upstream.example.com/contact',
  TCFR_CF_GATE_SECRET: 'server-gate-secret'
};
const results = [];

function request(route, body, origin = host) {
  return new Request(host + route, {
    method: 'POST',
    headers: { 'content-type': 'application/json', Origin: origin },
    body: JSON.stringify(body)
  });
}

async function run(name, handler, body, env, verify, assertions) {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), body: String(options.body || '') });
    if (String(url).includes('siteverify')) return Response.json(verify);
    return Response.json({ ok: true, received: true });
  };
  try {
    const response = await handler({ request: request(handler === booking ? '/api/booking' : '/api/contact', body), env });
    const data = await response.json();
    const pass = assertions({ response, data, calls });
    results.push({ name, pass, status: response.status, data, calls: calls.map(call => call.url) });
  } finally { globalThis.fetch = originalFetch; }
}

const validBooking = {
  'cf-turnstile-response': 'token', first_name: 'QA', last_name: 'Audit', email: 'qa@example.com',
  phone_number: '+1 555 010 2026', date_start: '2026-12-15', date_end: '2026-12-17',
  number_of_guests: '2', message: 'Automated QA only', cf_secret: 'client-value-must-not-pass'
};
const validContact = {
  'cf-turnstile-response': 'token', first_name: 'QA', last_name: 'Audit', email: 'qa@example.com',
  inquiry_type: 'Whole-house rental', message: 'Automated QA only', cf_secret: 'client-value-must-not-pass'
};
const verifiedBooking = { success: true, action: 'booking_submit', hostname: 'staging.example.com' };
const verifiedContact = { success: true, action: 'contact_submit', hostname: 'staging.example.com' };

await run('booking missing token', booking, {}, baseEnv, {}, ({ response, calls }) => response.status === 400 && calls.length === 0);
await run('contact missing token', contact, {}, baseEnv, {}, ({ response, calls }) => response.status === 400 && calls.length === 0);
await run('booking missing secret', booking, validBooking, { ...baseEnv, TURNSTILE_SECRET_KEY: '' }, {}, ({ response, calls }) => response.status === 500 && calls.length === 0);
await run('contact missing secret', contact, validContact, { ...baseEnv, TURNSTILE_SECRET_KEY: '' }, {}, ({ response, calls }) => response.status === 500 && calls.length === 0);
await run('booking invalid action', booking, validBooking, baseEnv, { ...verifiedBooking, action: 'contact_submit' }, ({ response, calls }) => response.status === 403 && calls.length === 1);
await run('contact invalid hostname', contact, validContact, baseEnv, { ...verifiedContact, hostname: 'evil.example.com' }, ({ response, calls }) => response.status === 403 && calls.length === 1);
await run('booking invalid email', booking, { ...validBooking, email: 'invalid' }, baseEnv, verifiedBooking, ({ response, calls }) => response.status === 400 && calls.length === 1);
await run('contact invalid email', contact, { ...validContact, email: 'invalid' }, baseEnv, verifiedContact, ({ response, calls }) => response.status === 400 && calls.length === 1);
await run('booking invalid dates', booking, { ...validBooking, date_end: '2026-12-14' }, baseEnv, verifiedBooking, ({ response, calls }) => response.status === 400 && calls.length === 1);
await run('booking invalid guests', booking, { ...validBooking, number_of_guests: '12' }, baseEnv, verifiedBooking, ({ response, calls }) => response.status === 400 && calls.length === 1);
await run('booking success', booking, validBooking, baseEnv, verifiedBooking, ({ response, data, calls }) => response.status === 200 && data.ok === true && calls.length === 2 && calls[1].body.includes('cf_secret=server-gate-secret') && !calls[1].body.includes('client-value-must-not-pass'));
await run('contact success', contact, validContact, baseEnv, verifiedContact, ({ response, data, calls }) => response.status === 200 && data.ok === true && calls.length === 2 && calls[1].body.includes('cf_secret=server-gate-secret') && calls[1].body.includes('inquiry_type=Whole-house+rental') && calls[1].body.includes('message=%5BInquiry+type%3A+Whole-house+rental%5D%0A%0AAutomated+QA+only') && !calls[1].body.includes('client-value-must-not-pass'));
await run('contact Spanish inquiry', contact, { ...validContact, lang: 'es' }, baseEnv, verifiedContact, ({ response, data, calls }) => response.status === 200 && data.ok === true && calls.length === 2 && calls[1].body.includes('message=%5BTipo+de+consulta%3A+Alquiler+de+casa+completa%5D%0A%0AAutomated+QA+only'));

const failed = results.filter(result => !result.pass);
console.log(JSON.stringify({ cases: results.length, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
if (failed.length) process.exitCode = 1;
