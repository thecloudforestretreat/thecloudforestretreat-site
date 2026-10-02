export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const origin = allowedOrigin(request);
    const contentType = request.headers.get("content-type") || "";
    const isForm =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");

    let data = {};
    if (isForm) {
      const form = await request.formData();
      for (const [k, v] of form.entries()) data[k] = String(v || "");
    } else {
      data = await request.json().catch(() => ({}));
    }

    // Turnstile token (Cloudflare uses "cf-turnstile-response")
    const token = String(
      (data["cf-turnstile-response"] || data["turnstile_token"] || "")
    ).trim();

    if (!token) {
      return json({ ok: false, message: "Turnstile token missing." }, 400, origin);
    }

    const turnstileSecret = String(env.TURNSTILE_SECRET_KEY || "").trim();
    if (!turnstileSecret) {
      return json({ ok: false, message: "Server misconfigured: TURNSTILE_SECRET_KEY missing." }, 500, origin);
    }

    // Verify Turnstile
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: token,
          remoteip: getIpBestEffort(request) || "",
        }),
      }
    );

    const verifyJson = await verifyRes.json().catch(() => ({}));
    const requestHost = new URL(request.url).hostname;
    if (!verifyJson.success || verifyJson.action !== "contact_submit" || verifyJson.hostname !== requestHost) {
      return json(
        { ok: false, message: "Turnstile verification failed." },
        403,
        origin
      );
    }

    // Normalize fields expected by Apps Script
    const first_name = clean(data.first_name, 80);
    const last_name = clean(data.last_name, 80);
    const email = clean(data.email, 254);
    const phone = clean(data.phone || data.phone_number, 50);
    const inquiryRaw = clean(data.inquiry_type, 100);
    const inquiryTypes = ["General question", "Whole-house rental", "Existing booking", "Transportation and arrival", "Activities and stay planning", "Partnerships or other"];
    const inquiry_type = inquiryTypes.includes(inquiryRaw) ? inquiryRaw : "";
    const inquiryLabelsEs = {
      "General question": "Pregunta general",
      "Whole-house rental": "Alquiler de casa completa",
      "Existing booking": "Reserva existente",
      "Transportation and arrival": "Transporte y llegada",
      "Activities and stay planning": "Actividades y planificación",
      "Partnerships or other": "Colaboraciones u otro",
    };
    const isSpanish = String(data.lang || "").toLowerCase() === "es";
    const inquiryLabel = isSpanish ? inquiryLabelsEs[inquiry_type] : inquiry_type;
    const message = clean(data.message, 2000);
    const how_did_you_hear_about_us = clean(data.how_did_you_hear_about_us, 100);

    const source_page = String(data.source_page || request.url || "").trim();
    const user_agent = String(data.user_agent || request.headers.get("User-Agent") || "").trim();
    const ip_best_effort = getIpBestEffort(request) || "";

    // Required checks (aligned with Apps Script)
    if (!first_name || !last_name || !email || !message) {
      return json(
        {
          ok: false,
          message:
            "Missing required fields. Please fill First Name, Last Name, Email, and Message.",
        },
        400,
        origin
      );
    }
    if (!isEmail(email)) return json({ ok: false, message: "Enter a valid email address." }, 400, origin);

    // Post to Apps Script Web App
    // Prefer TCFR_CONTACT_WEBAPP_URL; fallback to TCFR_BOOKING_WEBAPP_URL if you reused one
    const webAppUrl = env.TCFR_CONTACT_WEBAPP_URL || env.TCFR_BOOKING_WEBAPP_URL || "";
    const cfSecret = env.TCFR_CF_GATE_SECRET || "";

    if (!webAppUrl)
      return json(
        { ok: false, message: "Server misconfigured: TCFR_CONTACT_WEBAPP_URL missing." },
        500,
        origin
      );
    if (!cfSecret)
      return json(
        { ok: false, message: "Server misconfigured: TCFR_CF_GATE_SECRET missing." },
        500,
        origin
      );

    const body = new URLSearchParams();
    body.set("cf_secret", cfSecret);

    body.set("first_name", first_name);
    body.set("last_name", last_name);
    body.set("email", email);
    body.set("phone", phone);
    body.set("inquiry_type", inquiry_type);
    // The current Apps Script sheet predates inquiry_type. Prefix the upstream
    // message so its sheet and notification emails retain the selection.
    body.set("message", inquiry_type ? `[${isSpanish ? "Tipo de consulta" : "Inquiry type"}: ${inquiryLabel}]\n\n${message}` : message);
    body.set("how_did_you_hear_about_us", how_did_you_hear_about_us);

    body.set("source_page", source_page);
    body.set("user_agent", user_agent);
    body.set("ip-best-effort", ip_best_effort);

    [
      "attribution_first_source", "attribution_first_medium", "attribution_first_campaign",
      "attribution_first_landing_page", "attribution_last_source", "attribution_last_medium",
      "attribution_last_campaign", "attribution_last_landing_page", "attribution_click_id"
    ].forEach((field) => body.set(field, String(data[field] || "").slice(0, 500)));

    // Optional language hint if you ever pass it from /es/
    if (data.lang) body.set("lang", String(data.lang));

    const upstream = await fetch(webAppUrl, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });

    const upstreamText = await upstream.text();
    let upstreamJson = {};
    try {
      upstreamJson = JSON.parse(upstreamText);
    } catch (e) {
      upstreamJson = { ok: false, message: "Apps Script returned non-JSON.", raw: upstreamText };
    }

    const status = upstream.ok ? 200 : upstream.status || 500;
    return json(upstreamJson, status, origin);
  } catch (err) {
    return json(
      {
        ok: false,
        message: "Server error",
        error: String(err && err.message ? err.message : err),
      },
      500
    );
  }
}

function json(payload, status = 200, origin = "") {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "Content-Type",
    "x-content-type-options": "nosniff",
  };
  if (origin) headers["access-control-allow-origin"] = origin;
  return new Response(JSON.stringify(payload), { status, headers });
}

function allowedOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  try { return origin && origin === new URL(request.url).origin ? origin : ""; }
  catch (_error) { return ""; }
}

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getIpBestEffort(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    request.headers.get("X-Real-IP") ||
    ""
  )
    .split(",")[0]
    .trim();
}
