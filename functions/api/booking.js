// /functions/api/booking.js
export async function onRequestPost(context) {
  try {
    const req = context.request;
    const env = context.env;

    const form = await req.formData();

    // 1) Verify Turnstile token
    const token = String(form.get("cf_turnstile_response") || form.get("cf-turnstile-response") || "").trim();
    if (!token) {
      return json({ ok: false, message: "Missing Turnstile token." }, 400);
    }

    const ip = req.headers.get("CF-Connecting-IP") || "";
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY || "",
        response: token,
        remoteip: ip
      })
    });

    const verifyJson = await verifyRes.json();
    if (!verifyJson || verifyJson.success !== true) {
      return json({ ok: false, message: "Turnstile verification failed.", details: verifyJson }, 403);
    }

    // 2) Forward to Google Apps Script with cf_secret gate
    const forwardUrl = env.TCFR_BOOKING_WEBAPP_URL || "";
    if (!forwardUrl) {
      return json({ ok: false, message: "Server config error: TCFR_BOOKING_WEBAPP_URL not set." }, 500);
    }

    const sharedSecret = env.TCFR_CF_GATE_SECRET || "";
    if (!sharedSecret) {
      return json({ ok: false, message: "Server config error: TCFR_CF_GATE_SECRET not set." }, 500);
    }

    // Add fields that Apps Script expects
    form.set("cf_secret", sharedSecret);
    form.set("ip_best_effort", ip);

    const forwardRes = await fetch(forwardUrl, {
      method: "POST",
      body: form
    });

    // Apps Script might return text "OK" or JSON later, we pass through safely
    const text = await forwardRes.text();
    return json({ ok: true, upstream_status: forwardRes.status, upstream_body: text }, 200);

  } catch (err) {
    return json({ ok: false, message: "Server error.", error: String(err) }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
