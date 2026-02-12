export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const origin = request.headers.get("Origin") || "";
    const contentType = request.headers.get("content-type") || "";
    const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");

    let data = {};
    if (isForm) {
      const form = await request.formData();
      for (const [k, v] of form.entries()) data[k] = String(v || "");
    } else {
      data = await request.json().catch(() => ({}));
    }

    // Turnstile token (Cloudflare uses "cf-turnstile-response")
    const token =
      (data["cf-turnstile-response"] || data["turnstile_token"] || "").trim();

    if (!token) {
      return json({ ok: false, message: "Turnstile token missing." }, 400, origin);
    }

    // Verify Turnstile
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY || "",
        response: token,
        remoteip: getIpBestEffort(request) || ""
      })
    });

    const verifyJson = await verifyRes.json().catch(() => ({}));
    if (!verifyJson.success) {
      return json({ ok: false, message: "Turnstile verification failed.", details: verifyJson }, 403, origin);
    }

    // Normalize fields to match Google Sheet headers
    const first_name = (data.first_name || "").trim();
    const last_name = (data.last_name || "").trim();
    const email = (data.email || "").trim();
    const phone_number = (data.phone_number || data.phone || "").trim();

    const visit_start = (data.visit_start || data.date_start || "").trim();
    const visit_end = (data.visit_end || data.date_end || "").trim();
    const dates_of_visit = buildIsoRange(visit_start, visit_end);

    const number_of_days_interested = (data.number_of_days_interested || "").trim();
    const number_of_guests = (data.number_of_guests || "").trim();

    const message = (data.message || "").trim();

    const how_did_you_hear_about_us = (data.how_did_you_hear_about_us || "").trim();
    const transportation_needed = (data.transportation_needed || "").trim();
    const room_preference = (data.room_preference || "").trim();

    const source_page = (data.source_page || request.url || "").trim();
    const user_agent = (data.user_agent || request.headers.get("User-Agent") || "").trim();
    const ip_best_effort = getIpBestEffort(request) || "";

    // Basic required checks (keep aligned with Apps Script)
    if (!first_name || !last_name || !email || !phone_number || !dates_of_visit || !message) {
      return json({
        ok: false,
        message: "Missing required fields. Please fill First Name, Last Name, Email, Phone, Dates of Visit, and Message."
      }, 400, origin);
    }

    // Post to Apps Script Web App
    const webAppUrl = env.TCFR_BOOKING_WEBAPP_URL || "";
    const cfSecret = env.TCFR_CF_GATE_SECRET || "";

    if (!webAppUrl) return json({ ok: false, message: "Server misconfigured: TCFR_BOOKING_WEBAPP_URL missing." }, 500, origin);
    if (!cfSecret) return json({ ok: false, message: "Server misconfigured: TCFR_CF_GATE_SECRET missing." }, 500, origin);

    const body = new URLSearchParams();
    body.set("cf_secret", cfSecret);

    body.set("first_name", first_name);
    body.set("last_name", last_name);
    body.set("email", email);
    body.set("phone_number", phone_number);

    body.set("dates_of_visit", dates_of_visit);
    body.set("number_of_days_interested", number_of_days_interested);
    body.set("number_of_guests", number_of_guests);

    body.set("message", message);
    body.set("how_did_you_hear_about_us", how_did_you_hear_about_us);
    body.set("transportation_needed", transportation_needed);
    body.set("room_preference", room_preference);

    body.set("source_page", source_page);
    body.set("user_agent", user_agent);
    body.set("ip_best-effort", ip_best_effort);

    // Optional: language hint if you ever use /es/
    if (data.lang) body.set("lang", String(data.lang));

    const upstream = await fetch(webAppUrl, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });

    const upstreamText = await upstream.text();
    let upstreamJson = {};
    try { upstreamJson = JSON.parse(upstreamText); } catch (e) { upstreamJson = { ok: false, message: "Apps Script returned non-JSON.", raw: upstreamText }; }

    const status = upstream.ok ? 200 : (upstream.status || 500);
    return json(upstreamJson, status, origin);

  } catch (err) {
    return json({ ok: false, message: "Server error", error: String(err && err.message ? err.message : err) }, 500);
  }
}

function json(payload, status = 200, origin = "") {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  };

  // CORS (keep permissive for your site)
  headers["access-control-allow-origin"] = origin || "*";
  headers["access-control-allow-methods"] = "POST, OPTIONS";
  headers["access-control-allow-headers"] = "Content-Type";

  return new Response(JSON.stringify(payload), { status, headers });
}

function getIpBestEffort(request) {
  // Best effort in this order
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    request.headers.get("X-Real-IP") ||
    ""
  ).split(",")[0].trim();
}

function isIsoDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());
}

function buildIsoRange(start, end) {
  const a = String(start || "").trim();
  const b = String(end || "").trim();

  if (isIsoDate(a) && isIsoDate(b)) return `${a} to ${b}`;
  if (isIsoDate(a) && !b) return `${a} to ${a}`;
  return "";
}
