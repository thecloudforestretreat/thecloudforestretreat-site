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

    const token = (data["cf-turnstile-response"] || data["turnstile_token"] || "").trim();
    if (!token) return json({ ok: false, message: "Turnstile token missing." }, 400, origin);

    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY || "",
        response: token,
        remoteip: getIpBestEffort(request) || ""
      })
    });

    const verifyJson = await verify.json().catch(() => ({}));
    if (!verifyJson.success) {
      return json({ ok: false, message: "Turnstile verification failed.", details: verifyJson }, 403, origin);
    }

    const first_name = (data.first_name || "").trim();
    const last_name = (data.last_name || "").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim(); // optional
    const message = (data.message || "").trim();
    const how_did_you_hear_about_us = (data.how_did_you_hear_about_us || "").trim();

    const source_page = (data.source_page || request.url || "").trim();
    const user_agent = (data.user_agent || request.headers.get("User-Agent") || "").trim();
    const ip_best_effort = getIpBestEffort(request) || "";

    if (!first_name || !last_name || !email || !message) {
      return json({ ok: false, message: "Missing required fields. Please fill First Name, Last Name, Email, and Message." }, 400, origin);
    }

    const webAppUrl = env.TCFR_CONTACT_WEBAPP_URL || "";
    const cfSecret = env.TCFR_CF_GATE_SECRET || "";

    if (!webAppUrl) return json({ ok: false, message: "Server misconfigured: TCFR_CONTACT_WEBAPP_URL missing." }, 500, origin);
    if (!cfSecret) return json({ ok: false, message: "Server misconfigured: TCFR_CF_GATE_SECRET missing." }, 500, origin);

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

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "*";
  return new Response("", {
    status: 204,
    headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "Content-Type",
      "access-control-max-age": "86400"
    }
  });
}

function json(payload, status = 200, origin = "") {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": origin || "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "Content-Type"
    }
  });
}

function getIpBestEffort(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    request.headers.get("X-Real-IP") ||
    ""
  ).split(",")[0].trim();
}
