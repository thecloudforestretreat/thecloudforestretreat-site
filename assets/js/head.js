(function () {
  "use strict";

  var config = window.TCFR_CONFIG || {};
  var gtmId = String(config.gtmContainerId || "").trim();
  var ga4Id = String(config.ga4MeasurementId || "").trim();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

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
    window.__TCFR_ANALYTICS_MODE__ = "gtm";
    return;
  }

  if (/^G-[A-Z0-9]+$/.test(ga4Id)) {
    addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id), "tcfr-ga4-loader");
    window.gtag("js", new Date());
    window.gtag("config", ga4Id, { anonymize_ip: true, send_page_view: true });
    window.__TCFR_ANALYTICS_MODE__ = "ga4-direct-fallback";
  }
})();
