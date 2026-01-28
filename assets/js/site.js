/* /assets/js/site.js
   The Cloud Forest Retreat (TCFR)
   - Injects header/footer fragments into #siteHeader / #siteFooter
   - Initializes hamburger + mobile accordions
   - Sticky + scrolled state
   - GA4 loader: G-D3W4SP5MGX

   Design goals:
   - Never inject a full HTML document into the header mount (prevents "duplicate page" bugs)
   - Never leave the mobile menu stuck open after load
   - Works with Cloudflare Pages "pretty URLs" (header may live at /assets/includes/header)
*/
(function () {
  "use strict";

  var GA_ID = "G-D3W4SP5MGX";

  // Prevent double-running (can happen if the script is included twice)
  if (window.__TCFR_SITE_JS_BOOTED__) return;
  window.__TCFR_SITE_JS_BOOTED__ = true;

  // Do not run on fragment URLs themselves (prevents recursion if someone visits the fragment directly)
  (function guardFragmentRoutes() {
    var p = String(window.location.pathname || "/");
    if (p.indexOf("/assets/includes/") === 0) {
      window.__TCFR_SITE_JS_NOBOOT__ = true;
    }
  })();
  if (window.__TCFR_SITE_JS_NOBOOT__) return;

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
    window.gtag("config", GA_ID, {
      anonymize_ip: true,
      send_page_view: true
    });
  }

  /* =========================
     Tiny DOM helpers
     ========================= */
  function qs(root, sel) {
    return root ? root.querySelector(sel) : null;
  }
  function qsa(root, sel) {
    return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : [];
  }

  function isValidHeaderFragment(html) {
    var t = String(html || "");
    var lower = t.toLowerCase();

    // If a full document comes back, do NOT inject it
    if (lower.indexOf("<!doctype") !== -1) return false;
    if (lower.indexOf("<html") !== -1) return false;
    if (lower.indexOf("<body") !== -1) return false;

    // Must contain our header marker or class
    if (t.indexOf("data-tcfr-header") !== -1) return true;
    if (t.indexOf('class="tcfr-header"') !== -1) return true;
    if (t.indexOf("tcfr-header") !== -1) return true;

    return false;
  }

  function isValidFooterFragment(html) {
    var t = String(html || "");
    var lower = t.toLowerCase();

    if (lower.indexOf("<!doctype") !== -1) return false;
    if (lower.indexOf("<html") !== -1) return false;
    if (lower.indexOf("<body") !== -1) return false;

    // Footer is optional. If you do not have one yet, we allow empty.
    // If a footer exists, it should include a tcfr-footer class or data attribute later.
    return true;
  }

  async function fetchText(url) {
    try {
      var res = await fetch(url, { cache: "no-store", redirect: "follow" });
      if (!res || !res.ok) return null;
      return await res.text();
    } catch (e) {
      return null;
    }
  }

  async function injectFragment(mountId, candidates, validator) {
    var el = document.getElementById(mountId);
    if (!el) return null;

    // Hard guard: do not append; always replace.
    el.innerHTML = "";

    for (var i = 0; i < candidates.length; i++) {
      var url = candidates[i];
      var html = await fetchText(url);
      if (!html) continue;

      if (validator && !validator(html)) {
        continue;
      }

      el.innerHTML = html;
      return el;
    }

    // Leave empty if nothing valid
    el.innerHTML = "";
    return null;
  }

  /* =========================
     Header behavior
     ========================= */
  function initHeaderFromMount(mountEl) {
    if (!mountEl) return;

    var header = qs(mountEl, "[data-tcfr-header]") || qs(mountEl, ".tcfr-header") || qs(mountEl, "header");
    if (!header) return;

    if (header.__tcfrInit) return;
    header.__tcfrInit = true;

    // Force sticky (defensive: if a CSS override breaks it)
    header.style.position = "sticky";
    header.style.top = "0";
    header.style.zIndex = "5000";

    var burger = qs(header, ".tcfr-burger");
    var closeBtn = qs(header, ".tcfr-close");
    var panel = qs(header, ".tcfr-mobilePanel");
    var overlay = qs(header, ".tcfr-mobileOverlay");

    function setLocked(locked) {
      document.documentElement.classList.toggle("tcfr-navOpen", locked);
      document.body.style.overflow = locked ? "hidden" : "";
      document.body.style.touchAction = locked ? "none" : "";
    }

    function collapseAccordions() {
      qsa(header, ".tcfr-mGroup").forEach(function (btn) {
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        btn.setAttribute("aria-expanded", "false");
        if (sub) sub.hidden = true;
      });
    }

    function closeMenu() {
      // Ensure closed state, even if markup accidentally shipped open
      if (burger) burger.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
      if (overlay) overlay.hidden = true;
      setLocked(false);
      collapseAccordions();
    }

    function openMenu() {
      if (!panel || !overlay || !burger) return;
      panel.hidden = false;
      overlay.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      setLocked(true);
    }

    // Always start CLOSED to avoid "stuck open" on load
    closeMenu();

    if (burger) {
      burger.addEventListener("click", function () {
        var isOpen = burger.getAttribute("aria-expanded") === "true";
        if (isOpen) closeMenu();
        else openMenu();
      });
    }
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // Accordion toggles
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

    // Close on any mobile link click
    qsa(header, ".tcfr-navMobile a[href]").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
      });
    });

    
  // Language switch: keep user on the equivalent page when possible
  try{
    var i18n = window.TCFR_I18N || null;
    var path = window.location.pathname || "/";
    var alt = i18n && i18n.getAltPath ? i18n.getAltPath(path) : null;

    // Desktop toggle
    var langWrap = header.querySelector(".tcfr-lang");
    if (langWrap){
      var enLink = langWrap.querySelector('a[data-lang="en"]');
      var esLink = langWrap.querySelector('a[data-lang="es"]');
      if (enLink && (path.indexOf("/es/") === 0 || path === "/es")){
        enLink.setAttribute("href", alt || "/");
      }
      if (esLink && !(path.indexOf("/es/") === 0 || path === "/es")){
        esLink.setAttribute("href", alt || "/es/inicio/");
      }
    }

    // Mobile toggle
    var mLang = header.querySelector(".tcfr-mobileLang");
    if (mLang){
      var mEn = mLang.querySelector('a[data-lang="en"]');
      var mEs = mLang.querySelector('a[data-lang="es"]');
      if (mEn && (path.indexOf("/es/") === 0 || path === "/es")){
        mEn.setAttribute("href", alt || "/");
      }
      if (mEs && !(path.indexOf("/es/") === 0 || path === "/es")){
        mEs.setAttribute("href", alt || "/es/inicio/");
      }
    }
  }catch(e){}
// Sticky scrolled state
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
    window.addEventListener("orientationchange", function () {
      closeMenu();
    });
  }

  /* =========================
     Boot
     ========================= */
  async function boot() {
    initGA4();

    // IMPORTANT: Cloudflare Pages often uses "pretty URLs" and redirects *.html -> no extension.
    // We try both, and only inject when we confirm it is a fragment (not a full HTML doc).
    var isEs = false;
    try{
      isEs = (window.TCFR_I18N && window.TCFR_I18N.isEsPath) ? window.TCFR_I18N.isEsPath(window.location.pathname) : (window.location.pathname.indexOf("/es/") === 0 || window.location.pathname === "/es");
    }catch(e){ isEs = false; }

    var headerCandidates = isEs
      ? ["/assets/includes/header-es", "/assets/includes/header-es.html", "/assets/includes/header", "/assets/includes/header.html"]
      : ["/assets/includes/header", "/assets/includes/header.html"];

    var headerMount = await injectFragment(
      "siteHeader",
      headerCandidates,
      isValidHeaderFragment
    );

    // Footer is optional; inject if it exists, otherwise leave blank.
    await injectFragment(
      "siteFooter",
      ["/assets/includes/footer", "/assets/includes/footer.html"],
      isValidFooterFragment
    );

    // Initialize behaviors AFTER injection
    initHeaderFromMount(headerMount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
