export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const origin = request.headers.get("Origin") || "";
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

    // Verify Turnstile
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY || "",
          response: token,
          remoteip: getIpBestEffort(request) || "",
        }),
      }
    );

    const verifyJson = await verifyRes.json().catch(() => ({}));
    if (!verifyJson.success) {
      return json(
        { ok: false, message: "Turnstile verification failed.", details: verifyJson },
        403,
        origin
      );
    }

    // Normalize fields expected by Apps Script
    const first_name = String(data.first_name || "").trim();
    const last_name = String(data.last_name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || data.phone_number || "").trim();
    const message = String(data.message || "").trim();
    const how_did_you_hear_about_us = String(data.how_did_you_hear_about_us || "").trim();

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
    body.set("message", message);
    body.set("how_did_you_hear_about_us", how_did_you_hear_about_us);

    body.set("source_page", source_page);
    body.set("user_agent", user_agent);
    body.set("ip-best-effort", ip_best_effort);

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
    "access-control-allow-origin": origin || "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "Content-Type",
  };
  return new Response(JSON.stringify(payload), { status, headers });
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
