/* TCFR privacy consent + analytics loader.
   Consent defaults are established before GTM or GA4 loads. */
(function () {
  "use strict";

  var config = window.TCFR_CONFIG || {};
  var gtmId = String(config.gtmContainerId || "").trim();
  var ga4Id = String(config.ga4MeasurementId || "").trim();
  var storageKey = "tcfr_consent_v1";
  var consentVersion = 1;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function readChoice() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      if (!parsed || parsed.version !== consentVersion) return null;
      return parsed.choice === "accepted" || parsed.choice === "rejected" ? parsed : null;
    } catch (_error) { return null; }
  }

  function consentState(choice) {
    var optional = choice === "accepted" ? "granted" : "denied";
    return {
      ad_storage: optional,
      analytics_storage: optional,
      ad_user_data: optional,
      ad_personalization: optional,
      personalization_storage: optional,
      functionality_storage: "granted",
      security_storage: "granted"
    };
  }

  var savedChoice = readChoice();
  var initialState = consentState(savedChoice ? savedChoice.choice : "rejected");
  initialState.wait_for_update = savedChoice ? 0 : 500;
  window.gtag("consent", "default", initialState);
  window.gtag("set", "ads_data_redaction", true);
  window.__TCFR_CONSENT_STATUS__ = savedChoice ? savedChoice.choice : "unknown";

  function addScript(src, id) {
    if (id && document.getElementById(id)) return;
    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    if (id) script.id = id;
    document.head.appendChild(script);
  }

  if (/^GTM-[A-Z0-9]+$/.test(gtmId)) {
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    addScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId), "tcfr-gtm-loader");
    window.__TCFR_ANALYTICS_MODE__ = "gtm-consent-mode";
  } else if (/^G-[A-Z0-9]+$/.test(ga4Id)) {
    addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id), "tcfr-ga4-loader");
    window.gtag("js", new Date());
    window.gtag("config", ga4Id, { anonymize_ip: true, send_page_view: true });
    window.__TCFR_ANALYTICS_MODE__ = "ga4-consent-mode";
  }

  function expireCookie(name) {
    var host = window.location.hostname || "";
    var domains = ["", host, "." + host];
    if (host.indexOf("www.") === 0) domains.push("." + host.slice(4));
    domains.forEach(function (domain) {
      document.cookie = name + "=; Max-Age=0; path=/" + (domain ? "; domain=" + domain : "") + "; SameSite=Lax";
    });
  }

  function clearOptionalCookies() {
    (document.cookie || "").split(";").map(function (part) {
      return part.split("=")[0].trim();
    }).filter(function (name) {
      return /^_ga(?:_|$)/.test(name) || name === "_gid" || name === "_gat" || name === "_fbp" || name === "_fbc";
    }).forEach(expireCookie);
    try { window.localStorage.removeItem("tcfr_attribution_v1"); } catch (_error) {}
  }

  function persistChoice(choice) {
    var record = { version: consentVersion, choice: choice, updated_at: new Date().toISOString() };
    try { window.localStorage.setItem(storageKey, JSON.stringify(record)); } catch (_error) {}
  }

  function emitChoice(choice) {
    window.__TCFR_CONSENT_STATUS__ = choice;
    window.gtag("consent", "update", consentState(choice));
    if (choice === "rejected") clearOptionalCookies();
    window.dataLayer.push({ event: "tcfr_consent_update", tcfr_consent_status: choice });
    try { document.dispatchEvent(new CustomEvent("tcfr:consent-update", { detail: { status: choice } })); } catch (_error) {}
  }

  function isSpanish() {
    return /^es(?:-|$)/i.test(document.documentElement.lang || "") || /^\/es(?:\/|$)/i.test(window.location.pathname || "");
  }

  function addStyles() {
    if (document.getElementById("tcfr-consent-styles")) return;
    var style = document.createElement("style");
    style.id = "tcfr-consent-styles";
    style.textContent = [
      ".tcfrConsent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:820px;margin:0 auto;padding:18px;border:1px solid rgba(13,89,37,.22);border-radius:20px;background:#fffdf3;color:#142018;box-shadow:0 16px 44px rgba(3,34,14,.24);font:15px/1.5 Inter,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif}",
      ".tcfrConsent[hidden],.tcfrConsentManage[hidden]{display:none!important}",
      ".tcfrConsent__row{display:flex;align-items:center;gap:20px}",
      ".tcfrConsent__copy{flex:1;min-width:0}",
      ".tcfrConsent__title{margin:0 0 5px;color:#0d5925;font-family:\"Playfair Display\",Georgia,serif;font-size:20px;font-weight:800;line-height:1.15}",
      ".tcfrConsent__text{margin:0;color:#415047}",
      ".tcfrConsent__text a{color:#0d5925;font-weight:800;text-underline-offset:3px}",
      ".tcfrConsent__actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}",
      ".tcfrConsent__button{min-height:44px;padding:10px 17px;border:1px solid #0d5925;border-radius:999px;background:#fff;color:#0d5925;font:inherit;font-weight:850;cursor:pointer}",
      ".tcfrConsent__button--accept{border-color:#b94724;background:#b94724;color:#fff}",
      ".tcfrConsent__button:focus-visible,.tcfrConsentManage:focus-visible{outline:3px solid #f2c94c;outline-offset:3px}",
      ".tcfrConsentManage{position:fixed;left:12px;bottom:12px;z-index:2147482999;padding:8px 12px;border:1px solid rgba(13,89,37,.3);border-radius:999px;background:rgba(255,253,243,.97);color:#0d5925;box-shadow:0 5px 18px rgba(3,34,14,.16);font:800 12px/1 Inter,system-ui,sans-serif;cursor:pointer}",
      "@media(max-width:700px){.tcfrConsent{left:10px;right:10px;bottom:10px;padding:15px;border-radius:17px}.tcfrConsent__row{display:block}.tcfrConsent__actions{margin-top:13px}.tcfrConsent__button{flex:1}.tcfrConsentManage{left:8px;bottom:8px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function buildBanner() {
    if (!document.body || document.getElementById("tcfr-consent")) return;
    addStyles();
    var spanish = isSpanish();
    var banner = document.createElement("section");
    banner.id = "tcfr-consent";
    banner.className = "tcfrConsent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-labelledby", "tcfr-consent-title");
    banner.innerHTML = '<div class="tcfrConsent__row"><div class="tcfrConsent__copy"><h2 class="tcfrConsent__title" id="tcfr-consent-title">' +
      (spanish ? "Tu privacidad" : "Your privacy") + '</h2><p class="tcfrConsent__text">' +
      (spanish ? 'Usamos analítica opcional para mejorar el sitio y medir nuestras campañas. El sitio, WhatsApp y los formularios funcionan aunque rechaces. <a href="/es/politica-de-privacidad/">Política de privacidad</a>.' : 'We use optional analytics to improve the site and measure our campaigns. The site, WhatsApp, and forms still work if you decline. <a href="/privacy-policy/">Privacy policy</a>.') +
      '</p></div><div class="tcfrConsent__actions"><button class="tcfrConsent__button" type="button" data-tcfr-consent="reject">' +
      (spanish ? "Rechazar" : "Decline") + '</button><button class="tcfrConsent__button tcfrConsent__button--accept" type="button" data-tcfr-consent="accept">' +
      (spanish ? "Aceptar" : "Accept") + '</button></div></div>';

    var manage = document.createElement("button");
    manage.type = "button";
    manage.id = "tcfr-consent-manage";
    manage.className = "tcfrConsentManage";
    manage.textContent = spanish ? "Privacidad" : "Privacy";
    manage.setAttribute("aria-label", spanish ? "Cambiar preferencias de privacidad" : "Change privacy preferences");

    function showBanner() { banner.hidden = false; manage.hidden = true; }
    function hideBanner() { banner.hidden = true; manage.hidden = false; }
    banner.addEventListener("click", function (event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-tcfr-consent]") : null;
      if (!button) return;
      var choice = button.getAttribute("data-tcfr-consent") === "accept" ? "accepted" : "rejected";
      persistChoice(choice); emitChoice(choice); hideBanner();
    });
    manage.addEventListener("click", showBanner);
    document.body.appendChild(banner);
    document.body.appendChild(manage);
    if (savedChoice) hideBanner(); else showBanner();
    window.TCFRConsent = {
      version: "1.0.0",
      getStatus: function () { return window.__TCFR_CONSENT_STATUS__ || "unknown"; },
      open: showBanner,
      accept: function () { persistChoice("accepted"); emitChoice("accepted"); hideBanner(); },
      reject: function () { persistChoice("rejected"); emitChoice("rejected"); hideBanner(); }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildBanner);
  else buildBanner();
})();
