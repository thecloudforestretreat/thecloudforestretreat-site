/* /assets/js/site.js
   The Cloud Forest Retreat
   Stable header injection + mobile menu behavior
*/
(function () {
  "use strict";

  var GA_ID = "G-D3W4SP5MGX";

  function initGA4() {
    if (window.__TCFR_GA4_LOADED__) return;
    window.__TCFR_GA4_LOADED__ = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    var hasGtag = document.querySelector(
      'script[src^="https://www.googletagmanager.com/gtag/js?id="]'
    );
    if (!hasGtag) {
      var s = document.createElement("script");
      s.async = true;
      s.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(GA_ID);
      document.head.appendChild(s);
    }

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      anonymize_ip: true,
      send_page_view: true
    });
  }

  function qs(root, sel) {
    return root ? root.querySelector(sel) : null;
  }
  function qsa(root, sel) {
    return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : [];
  }

  function isEmpty(el) {
    return !el || !el.innerHTML || !el.innerHTML.trim();
  }

  function forceClosed(header) {
    document.documentElement.classList.remove("tcfr-navOpen");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";

    if (!header) return;

    var burger = qs(header, ".tcfr-burger");
    var panel = qs(header, ".tcfr-mobilePanel");
    var overlay = qs(header, ".tcfr-mobileOverlay");

    if (burger) burger.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
    if (overlay) overlay.hidden = true;

    qsa(header, ".tcfr-mGroup").forEach(function (btn) {
      var id = btn.getAttribute("aria-controls");
      var sub = id ? document.getElementById(id) : null;
      btn.setAttribute("aria-expanded", "false");
      if (sub) sub.hidden = true;
    });
  }

  function initHeader(headerRoot) {
    if (!headerRoot || headerRoot.__tcfrInit) return;
    headerRoot.__tcfrInit = true;

    var burger = qs(headerRoot, ".tcfr-burger");
    var closeBtn = qs(headerRoot, ".tcfr-close");
    var panel = qs(headerRoot, ".tcfr-mobilePanel");
    var overlay = qs(headerRoot, ".tcfr-mobileOverlay");

    function lock(on) {
      document.documentElement.classList.toggle("tcfr-navOpen", on);
      document.body.style.overflow = on ? "hidden" : "";
      document.body.style.touchAction = on ? "none" : "";
    }

    function openMenu() {
      panel.hidden = false;
      overlay.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      lock(true);
    }

    function closeMenu() {
      panel.hidden = true;
      overlay.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      lock(false);
      forceClosed(headerRoot);
    }

    forceClosed(headerRoot);

    if (burger) {
      burger.addEventListener("click", function () {
        var open = burger.getAttribute("aria-expanded") === "true";
        open ? closeMenu() : openMenu();
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    qsa(headerRoot, ".tcfr-mGroup").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        if (!sub) return;
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        sub.hidden = open;
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 901) closeMenu();
    });

    window.addEventListener("scroll", function () {
      headerRoot.classList.toggle("is-scrolled", window.scrollY > 10);
    });
  }

  function inject(id, url) {
    var el = document.getElementById(id);
    if (!el || !isEmpty(el)) return Promise.resolve(el);

    return fetch(url, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        return el;
      });
  }

  function boot() {
    initGA4();

    inject("siteHeader", "/assets/includes/header.html")
      .then(function (el) {
        if (el) initHeader(el.querySelector("header") || el);
      })
      .catch(function () {});

    inject("siteFooter", "/assets/includes/footer.html").catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
