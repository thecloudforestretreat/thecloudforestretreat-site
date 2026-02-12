/**
 * /functions/api/contact.js
 *
 * Cloudflare Pages Function:
 * - Verifies Turnstile token
 * - Forwards sanitized fields to Google Apps Script Web App
 *
 * Required env vars in Cloudflare Pages:
 * - TURNSTILE_SECRET_KEY
 * - TCFR_CONTACT_WEBAPP_URL
 * - TCFR_CF_GATE_SECRET
 */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function bad(message, status = 400) {
  return json({ ok: false, message }, status);
}

async function parseBody(request) {
  const ct = request.headers.get("content-type") || "";

  if (ct.includes("application/json")) {
    try {
      return await request.json();
    } catch (e) {
      return {};
    }
  }

  // Default: form data
  try {
    const fd = await request.formData();
    const obj = {};
    for (const [k, v] of fd.entries()) obj[k] = v;
    return obj;
  } catch (e) {
    return {};
  }
}

function s(v) {
  return (v == null) ? "" : String(v).trim();
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env || !env.TURNSTILE_SECRET_KEY || !env.TCFR_CONTACT_WEBAPP_URL || !env.TCFR_CF_GATE_SECRET) {
    return bad("Server config error: missing env vars.", 500);
  }

  const payload = await parseBody(request);

  // Turnstile token
  const token = s(payload["cf-turnstile-response"] || payload["cf_turnstile_response"] || payload["turnstile_token"]);
  if (!token) return bad("Turnstile token missing.", 400);

  // Verify Turnstile
  try {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET_KEY);
    form.append("response", token);

    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) form.append("remoteip", ip);

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form
    });

    const verifyJson = await verifyRes.json();
    if (!verifyJson || verifyJson.success !== true) {
      return bad("Turnstile verification failed.", 403);
    }
  } catch (e) {
    return bad("Turnstile verification error.", 500);
  }

  // Collect + sanitize fields
  const first_name = s(payload.first_name);
  const last_name = s(payload.last_name);
  const email = s(payload.email);
  const phone = s(payload.phone);
  const message = s(payload.message);
  const how_did_you_hear_about_us = s(payload.how_did_you_hear_about_us);
  const source_page = s(payload.source_page);
  const user_agent = s(payload.user_agent);
  const lang = s(payload.lang);

  if (!first_name || !last_name || !email || !message) {
    return bad("Missing required fields.", 400);
  }

  // Forward to Apps Script as form-urlencoded compatible
  const forward = new URLSearchParams();
  forward.set("cf_secret", env.TCFR_CF_GATE_SECRET);
  forward.set("first_name", first_name);
  forward.set("last_name", last_name);
  forward.set("email", email);
  forward.set("phone", phone);
  forward.set("message", message);
  forward.set("how_did_you_hear_about_us", how_did_you_hear_about_us);
  forward.set("source_page", source_page);
  forward.set("user_agent", user_agent);
  forward.set("ip-best-effort", request.headers.get("CF-Connecting-IP") || "");
  forward.set("lang", lang);

  try {
    const resp = await fetch(env.TCFR_CONTACT_WEBAPP_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: forward.toString()
    });

    const txt = await resp.text();
    let out = null;
    try { out = JSON.parse(txt); } catch (e) { out = null; }

    if (!resp.ok || !out || out.ok !== true) {
      return bad((out && out.message) ? out.message : "Upstream error.", 502);
    }

    return json({ ok: true, warning: out.warning || "" }, 200);
  } catch (e) {
    return bad("Unable to submit at this time.", 502);
  }
}
