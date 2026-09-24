(function () {
  "use strict";

  var existing = window.TCFR_CONFIG || {};
  window.TCFR_CONFIG = Object.assign({
    siteName: "The Cloud Forest Retreat",
    canonicalOrigin: "https://thecloudforestretreat.com",
    defaultLanguage: "en",
    supportedLanguages: ["en", "es"],
    whatsappNumber: "13054585402",
    ga4MeasurementId: "G-D3W4SP5MGX",
    gtmContainerId: "",
    attributionStorageDays: 90,
    analyticsDebug: false,
    social: {
      instagram: "https://www.instagram.com/thecloudforestretreat/",
      tiktok: "https://www.tiktok.com/@thecloudforestretreat",
      facebook: "https://www.facebook.com/profile.php?id=61569374962807",
      youtube: "https://youtube.com/@thecloudforestretreat",
      x: "https://x.com/CloudForest___",
      googleReviews: "https://g.page/r/CQq5wBqKgv0DEAE/review"
    }
  }, existing);
})();
