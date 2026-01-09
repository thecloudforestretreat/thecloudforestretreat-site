/* /assets/js/site.js
   The Cloud Forest Retreat - Global site behavior (TCFR)
   Goals:
   - Always show header on desktop + mobile (no blank header)
   - Never duplicate page content (inject ONLY into #siteHeader/#siteFooter)
   - Mobile hamburger must open/close reliably (never stuck open)
   - Sticky header + scrolled state
   - GA4 loader (G-D3W4SP5MGX)

   This script is safe to include on every page:
   <script src="/assets/js/site.js?v=1" defer></script>
*/
(function () {
  "use strict";

  var GA_ID = "G-D3W4SP5MGX";

  // Prevent double init if script is included twice by mistake
  if (window.__TCFR_SITE_INIT__) return;
  window.__TCFR_SITE_INIT__ = true;

  function qs(root, sel) {
    return root ? root.querySelector(sel) : null;
  }
  function qsa(root, sel) {
    return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : [];
  }

  /* =========================
     GA4
  ========================= */
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
    window.gtag("config", GA_ID, { anonymize_ip: true, send_page_view: true });
  }

  /* =========================
     Header injection (only if needed)
     - Inject ONLY into #siteHeader mount.
     - If fetch fails, fall back to embedded header template.
  ========================= */
  function headerFallbackHtml() {
    // Fallback is intentionally minimal but functional
    return (
      '<header class="tcfr-header" data-tcfr-header>' +
        '<div class="tcfr-shell">' +
          '<a class="tcfr-brand" href="/" aria-label="The Cloud Forest Retreat home">' +
            '<img class="tcfr-logo" src="/assets/images/tcfr_logo_transparent.png" alt="The Cloud Forest Retreat" width="120" height="38" loading="eager" decoding="async"/>' +
            '<span class="tcfr-brandText">The Cloud Forest Retreat</span>' +
          "</a>" +

          '<nav class="tcfr-nav tcfr-navDesktop" aria-label="Primary navigation">' +
            '<a class="tcfr-link" href="/">Home</a>' +

            '<div class="tcfr-dd">' +
              '<button class="tcfr-ddBtn" type="button" aria-haspopup="true" aria-expanded="false">Rooms <span class="tcfr-caret" aria-hidden="true">▾</span></button>' +
              '<div class="tcfr-ddMenu" role="menu" aria-label="Rooms submenu">' +
                '<a role="menuitem" class="tcfr-ddItem" href="/rooms/">All Rooms</a>' +
                '<a role="menuitem" class="tcfr-ddItem" href="/rooms/suites/">Suites</a>' +
                '<a role="menuitem" class="tcfr-ddItem" href="/rooms/family/">Family Rooms</a>' +
              "</div>" +
            "</div>" +

            '<div class="tcfr-dd">' +
              '<button class="tcfr-ddBtn" type="button" aria-haspopup="true" aria-expanded="false">Features <span class="tcfr-caret" aria-hidden="true">▾</span></button>' +
              '<div class="tcfr-ddMenu" role="menu" aria-label="Features submenu">' +
                '<a role="menuitem" class="tcfr-ddItem" href="/features/">Overview</a>' +
                '<a role="menuitem" class="tcfr-ddItem" href="/features/activities/">Activities</a>' +
                '<a role="menuitem" class="tcfr-ddItem" href="/features/dining/">Dining</a>' +
              "</div>" +
            "</div>" +

            '<a class="tcfr-link" href="/booking/">Booking Page</a>' +

            '<div class="tcfr-dd">' +
              '<button class="tcfr-ddBtn" type="button" aria-haspopup="true" aria-expanded="false">About <span class="tcfr-caret" aria-hidden="true">▾</span></button>' +
              '<div class="tcfr-ddMenu" role="menu" aria-label="About submenu">' +
                '<a role="menuitem" class="tcfr-ddItem" href="/about/">Our Story</a>' +
                '<a role="menuitem" class="tcfr-ddItem" href="/about/location/">Location</a>' +
                '<a role="menuitem" class="tcfr-ddItem" href="/about/policies/">Policies</a>' +
              "</div>" +
            "</div>" +

            '<a class="tcfr-link" href="/contact/">Contact</a>' +
            '<a class="tcfr-link" href="/blog/">Blog</a>' +
          "</nav>" +

          '<div class="tcfr-actions">' +
            '<div class="tcfr-lang" aria-label="Language">' +
              '<a class="tcfr-langBtn is-active" href="#" aria-current="page">EN</a>' +
              '<span class="tcfr-langBtn is-disabled" aria-disabled="true" title="Spanish coming soon">ES</span>' +
            "</div>" +
            '<a class="tcfr-cta" href="/booking/">Book Your Stay</a>' +
            '<button class="tcfr-burger" type="button" aria-label="Open menu" aria-controls="tcfrMobilePanel" aria-expanded="false">' +
              '<span class="tcfr-burgerLines" aria-hidden="true"><span></span><span></span><span></span></span>' +
            "</button>" +
          "</div>" +
        "</div>" +

        '<div class="tcfr-mobileOverlay" hidden></div>' +

        '<aside class="tcfr-mobilePanel" id="tcfrMobilePanel" hidden aria-label="Mobile menu">' +
          '<div class="tcfr-mobileTop">' +
            '<div class="tcfr-mobileBrand">' +
              '<div class="tcfr-mobileTitle">The Cloud Forest Retreat</div>' +
            "</div>" +
            '<button class="tcfr-close" type="button" aria-label="Close menu"><span aria-hidden="true">X</span></button>' +
          "</div>" +

          '<nav class="tcfr-navMobile" aria-label="Mobile navigation">' +
            '<a class="tcfr-mLink" href="/">Home</a>' +

            '<button class="tcfr-mGroup" type="button" aria-expanded="false" aria-controls="tcfrMRooms">Rooms <span class="tcfr-caret" aria-hidden="true">▾</span></button>' +
            '<div class="tcfr-mSub" id="tcfrMRooms" hidden>' +
              '<a class="tcfr-mSubLink" href="/rooms/">All Rooms</a>' +
              '<a class="tcfr-mSubLink" href="/rooms/suites/">Suites</a>' +
              '<a class="tcfr-mSubLink" href="/rooms/family/">Family Rooms</a>' +
            "</div>" +

            '<button class="tcfr-mGroup" type="button" aria-expanded="false" aria-controls="tcfrMFeatures">Features <span class="tcfr-caret" aria-hidden="true">▾</span></button>' +
            '<div class="tcfr-mSub" id="tcfrMFeatures" hidden>' +
              '<a class="tcfr-mSubLink" href="/features/">Overview</a>' +
              '<a class="tcfr-mSubLink" href="/features/activities/">Activities</a>' +
              '<a class="tcfr-mSubLink" href="/features/dining/">Dining</a>' +
            "</div>" +

            '<a class="tcfr-mLink" href="/booking/">Booking Page</a>' +

            '<button class="tcfr-mGroup" type="button" aria-expanded="false" aria-controls="tcfrMAbout">About <span class="tcfr-caret" aria-hidden="true">▾</span></button>' +
            '<div class="tcfr-mSub" id="tcfrMAbout" hidden>' +
              '<a class="tcfr-mSubLink" href="/about/">Our Story</a>' +
              '<a class="tcfr-mSubLink" href="/about/location/">Location</a>' +
              '<a class="tcfr-mSubLink" href="/about/policies/">Policies</a>' +
            "</div>" +

            '<a class="tcfr-mLink" href="/contact/">Contact</a>' +
            '<a class="tcfr-mLink" href="/blog/">Blog</a>' +

            '<div class="tcfr-mobileDivider"></div>' +

            '<div class="tcfr-mobileLang" aria-label="Language">' +
              '<div class="tcfr-mobileLangLabel">Language</div>' +
              '<div class="tcfr-lang">' +
                '<a class="tcfr-langBtn is-active" href="#" aria-current="page">EN</a>' +
                '<span class="tcfr-langBtn is-disabled" aria-disabled="true" title="Spanish coming soon">ES</span>' +
              "</div>" +
            "</div>" +

            '<a class="tcfr-mobileCta" href="/booking/">Book Your Stay</a>' +
          "</nav>" +
        "</aside>" +
      "</header>"
    );
  }

  function shouldInjectHeader() {
    // If a tcfr header already exists, do not inject again.
    if (document.querySelector(".tcfr-header")) return false;
    var mount = document.getElementById("siteHeader");
    if (!mount) return false;
    // If mount already has meaningful content, do not inject.
    if ((mount.textContent || "").trim().length > 0) return false;
    return true;
  }

  function injectIntoMount(mountId, html) {
    var el = document.getElementById(mountId);
    if (!el) return null;
    el.innerHTML = html;
    return el;
  }

  function fetchText(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("Fetch failed: " + res.status);
      return res.text();
    });
  }

  function ensureHeader() {
    if (!shouldInjectHeader()) return Promise.resolve(document.querySelector(".tcfr-header"));

    return fetchText("/assets/includes/header.html")
      .then(function (html) {
        injectIntoMount("siteHeader", html);
        return document.querySelector(".tcfr-header");
      })
      .catch(function () {
        // Fallback if fetch fails (keeps site usable)
        injectIntoMount("siteHeader", headerFallbackHtml());
        return document.querySelector(".tcfr-header");
      });
  }

  function ensureFooter() {
    var mount = document.getElementById("siteFooter");
    if (!mount) return Promise.resolve(null);
    if ((mount.textContent || "").trim().length > 0) return Promise.resolve(mount);

    return fetchText("/assets/includes/footer.html")
      .then(function (html) {
        injectIntoMount("siteFooter", html);
        return mount;
      })
      .catch(function () {
        return null;
      });
  }

  /* =========================
     Header behavior
  ========================= */
  function initHeaderBehavior(header) {
    if (!header || header.__tcfrInit) return;
    header.__tcfrInit = true;

    var burger = qs(header, ".tcfr-burger");
    var closeBtn = qs(header, ".tcfr-close");
    var panel = qs(header, ".tcfr-mobilePanel");
    var overlay = qs(header, ".tcfr-mobileOverlay");

    function setLocked(locked) {
      document.documentElement.classList.toggle("tcfr-navOpen", locked);
      document.body.style.overflow = locked ? "hidden" : "";
      document.body.style.touchAction = locked ? "none" : "";
    }

    function forceClosedUi() {
      // Always start closed
      setLocked(false);
      if (panel) panel.hidden = true;
      if (overlay) overlay.hidden = true;
      if (burger) burger.setAttribute("aria-expanded", "false");
      qsa(header, ".tcfr-mGroup").forEach(function (btn) {
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
      setLocked(false);

      // Collapse accordions when closing
      qsa(header, ".tcfr-mGroup").forEach(function (btn) {
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        btn.setAttribute("aria-expanded", "false");
        if (sub) sub.hidden = true;
      });
    }

    // Ensure a sane closed initial state (fixes "stuck open")
    forceClosedUi();

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

    // Sticky scroll class
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

  /* =========================
     Boot
  ========================= */
  function boot() {
    initGA4();

    Promise.all([ensureHeader(), ensureFooter()]).then(function (arr) {
      var header = arr && arr[0] ? arr[0] : document.querySelector(".tcfr-header");
      if (header) initHeaderBehavior(header);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
