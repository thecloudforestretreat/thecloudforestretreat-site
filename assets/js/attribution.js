(function () {
  "use strict";

  var config = window.TCFR_CONFIG || {};
  var key = "tcfr_attribution_v1";
  var params = new URLSearchParams(window.location.search || "");
  var campaignKeys = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"
  ];

  function nowIso() { return new Date().toISOString(); }
  function clean(value) { return String(value || "").trim().slice(0, 500); }
  function read() {
    try { return JSON.parse(window.localStorage.getItem(key) || "{}"); }
    catch (_error) { return {}; }
  }
  function write(value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (_error) {}
  }
  function referrerHost() {
    if (!document.referrer) return "direct";
    try { return new URL(document.referrer).hostname || "direct"; }
    catch (_error) { return "unknown"; }
  }
  function campaignSnapshot() {
    var row = {};
    campaignKeys.forEach(function (name) {
      var value = clean(params.get(name));
      if (value) row[name] = value;
    });
    row.landing_page = clean(window.location.pathname + window.location.search);
    row.referrer = clean(document.referrer);
    row.referrer_host = referrerHost();
    row.captured_at = nowIso();
    return row;
  }
  function hasCampaign(row) {
    return campaignKeys.some(function (name) { return Boolean(row[name]); });
  }
  function isExpired(saved) {
    var days = Number(config.attributionStorageDays || 90);
    var created = Date.parse(saved && saved.first_touch && saved.first_touch.captured_at || "");
    return !created || Date.now() - created > days * 86400000;
  }

  var current = campaignSnapshot();
  var saved = read();
  if (!saved.first_touch || isExpired(saved)) saved.first_touch = current;
  if (hasCampaign(current) || !saved.last_touch) saved.last_touch = current;
  saved.last_page = clean(window.location.pathname + window.location.search);
  saved.updated_at = nowIso();
  write(saved);
  window.TCFR_ATTRIBUTION = saved;

  function valueFor(name) {
    var first = saved.first_touch || {};
    var last = saved.last_touch || {};
    var map = {
      attribution_first_source: first.utm_source || first.referrer_host || "direct",
      attribution_first_medium: first.utm_medium || "referral",
      attribution_first_campaign: first.utm_campaign || "",
      attribution_first_landing_page: first.landing_page || "",
      attribution_last_source: last.utm_source || last.referrer_host || "direct",
      attribution_last_medium: last.utm_medium || "referral",
      attribution_last_campaign: last.utm_campaign || "",
      attribution_last_landing_page: last.landing_page || "",
      attribution_click_id: last.gclid || last.gbraid || last.wbraid || last.fbclid || last.msclkid || last.ttclid || ""
    };
    return map[name] || "";
  }

  function hydrateForms(root) {
    var scope = root || document;
    [
      "attribution_first_source", "attribution_first_medium", "attribution_first_campaign",
      "attribution_first_landing_page", "attribution_last_source", "attribution_last_medium",
      "attribution_last_campaign", "attribution_last_landing_page", "attribution_click_id"
    ].forEach(function (name) {
      Array.prototype.forEach.call(scope.querySelectorAll('input[name="' + name + '"]'), function (input) {
        input.value = valueFor(name);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { hydrateForms(document); }, { once: true });
  } else {
    hydrateForms(document);
  }
  document.addEventListener("tcfr:includes-ready", function () { hydrateForms(document); });
})();
