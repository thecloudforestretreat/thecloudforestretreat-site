/* /assets/js/site.js
   The Cloud Forest Retreat

   Fix goals:
   - Prevent duplicate header/footer injection
   - Never inject HTML error pages (which can look like "double pages")
   - Deterministic hamburger open/close (no stuck-open overlays)
   - Sticky scrolled state class

   GA4: G-D3W4SP5MGX
*/
(function () {
  "use strict";

  var GA_ID = "G-D3W4SP5MGX";

  function initGA4() {
    if (window.__TCFR_GA4_LOADED__) return;
    window.__TCFR_GA4_LOADED__ = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
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

  function looksLikeFullHtmlDocument(text) {
    if (!text) return true;
    var t = String(text).toLowerCase();

    // If Cloudflare returns a 404/HTML page, do NOT inject it into the DOM.
    if (t.indexOf("<!doctype html") !== -1) return true;
    if (t.indexOf("<html") !== -1) return true;
    if (t.indexOf("<head") !== -1) return true;
    if (t.indexOf("<body") !== -1) return true;

    return false;
  }

  async function safeInject(mountId, url, mustContainSelector) {
    var mount = document.getElementById(mountId);
    if (!mount) return null;

    // If we already have a valid injected element inside, do nothing.
    if (mustContainSelector && qs(mount, mustContainSelector)) {
      return mount;
    }

    try {
      var res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;

      var text = await res.text();

      // Block error pages / full documents.
      if (looksLikeFullHtmlDocument(text)) return null;

      // If we expect a specific marker and it's not present, do not inject.
      if (mustContainSelector) {
        // Quick string check before DOM parse
        if (text.indexOf("data-tcfr-header") === -1 && mustContainSelector === "[data-tcfr-header]") {
          return null;
        }
      }

      mount.innerHTML = text;

      // Verify injection actually produced the expected marker
      if (mustContainSelector && !qs(mount, mustContainSelector)) {
        // Roll back to avoid weird "duplicate page" artifacts
        mount.innerHTML = "";
        return null;
      }

      return mount;
    } catch (e) {
      return null;
    }
  }

  function initHeader(headerMount) {
    var headerEl = qs(headerMount, "[data-tcfr-header]") || qs(headerMount, ".tcfr-header") || qs(headerMount, "header");
    if (!headerEl) return;

    if (headerEl.__tcfrInit) return;
    headerEl.__tcfrInit = true;

    var burger = qs(headerEl, ".tcfr-burger");
    var closeBtn = qs(headerEl, ".tcfr-close");
    var panel = qs(headerEl, ".tcfr-mobilePanel");
    var overlay = qs(headerEl, ".tcfr-mobileOverlay");

    function setLocked(locked) {
      document.documentElement.classList.toggle("tcfr-navOpen", locked);
      document.body.style.overflow = locked ? "hidden" : "";
      document.body.style.touchAction = locked ? "none" : "";
    }

    function collapseAccordions() {
      qsa(headerEl, ".tcfr-mGroup").forEach(function (btn) {
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        btn.setAttribute("aria-expanded", "false");
        if (sub) sub.hidden = true;
      });
    }

    function openMenu() {
      if (!panel || !overlay || !burger) return;
      panel.hidden = false;
      overlay.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      setLocked(true);
    }

    function closeMenu() {
      if (!panel || !overlay || !burger) return;
      panel.hidden = true;
      overlay.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      collapseAccordions();
      setLocked(false);
    }

    // Force closed on init, always
    closeMenu();

    if (burger) burger.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu();
      else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeMenu();
    });

    if (overlay) overlay.addEventListener("click", function (e) {
      e.preventDefault();
      closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // Mobile accordion toggles
    qsa(headerEl, ".tcfr-mGroup").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        if (!sub) return;

        var isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
        sub.hidden = isOpen ? true : false;
      });
    });

    // Close menu on any mobile link click
    qsa(headerEl, ".tcfr-navMobile a[href]").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Sticky scroll style
    function onScroll() {
      var y = window.scrollY || 0;
      headerEl.classList.toggle("is-scrolled", y > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // If switching to desktop, force-close mobile
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 901) closeMenu();
    });
  }

  async function boot() {
    initGA4();

    // Inject header/footer safely (and only once)
    var headerMount = await safeInject("siteHeader", "/assets/includes/header.html", "[data-tcfr-header]");
    await safeInject("siteFooter", "/assets/includes/footer.html", null);

    // Initialize header behavior only if header exists (injected or pre-rendered)
    var mount = document.getElementById("siteHeader");
    if (mount) initHeader(mount);
    else if (headerMount) initHeader(headerMount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
