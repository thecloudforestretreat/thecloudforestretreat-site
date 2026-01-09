/* /assets/js/site.js
   The Cloud Forest Retreat
   - Injects /assets/includes/header.html into #siteHeader
   - Injects /assets/includes/footer.html into #siteFooter (optional)
   - Initializes mobile hamburger + accordions
   - Sticky scrolled state
   - GA4 loader: G-D3W4SP5MGX
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

  async function inject(mountId, url) {
    var el = document.getElementById(mountId);
    if (!el) return null;

    try {
      var res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      el.innerHTML = await res.text();
      return el;
    } catch (e) {
      return null;
    }
  }

  function initHeader(headerRoot) {
    if (!headerRoot || headerRoot.__tcfrInit) return;
    headerRoot.__tcfrInit = true;

    var header = qs(headerRoot, ".tcfr-header") || qs(headerRoot, "header");
    if (!header) header = headerRoot;

    var burger = qs(header, ".tcfr-burger");
    var closeBtn = qs(header, ".tcfr-close");
    var panel = qs(header, ".tcfr-mobilePanel");
    var overlay = qs(header, ".tcfr-mobileOverlay");

    function setLocked(locked) {
      document.documentElement.classList.toggle("tcfr-navOpen", locked);
      document.body.style.overflow = locked ? "hidden" : "";
      document.body.style.touchAction = locked ? "none" : "";
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
      setLocked(false);

      // Also collapse all accordions when closing
      qsa(header, ".tcfr-mGroup").forEach(function (btn) {
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        btn.setAttribute("aria-expanded", "false");
        if (sub) sub.hidden = true;
      });
    }

    if (burger) burger.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // Mobile accordion toggles
    qsa(header, ".tcfr-mGroup").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        if (!sub) return;

        var isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
        sub.hidden = isOpen ? true : false;
      });
    });

    // Close menu on any mobile link click
    qsa(header, ".tcfr-navMobile a[href]").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Sticky scroll style
    function onScroll() {
      var y = window.scrollY || 0;
      header.classList.toggle("is-scrolled", y > 10);
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

    var headerMount = await inject("siteHeader", "/assets/includes/header.html");
    await inject("siteFooter", "/assets/includes/footer.html");

    // Init header behaviors from injected DOM
    if (headerMount) initHeader(headerMount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
