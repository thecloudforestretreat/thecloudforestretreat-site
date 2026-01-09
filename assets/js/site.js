/* /assets/js/site.js
   The Cloud Forest Retreat (TCFR)
   - Injects /assets/includes/header.html into #siteHeader (only if it is a real header include)
   - Injects /assets/includes/footer.html into #siteFooter ONLY if it is a real footer include
   - Initializes mobile hamburger + accordions
   - Sticky "is-scrolled" state
   - GA4 loader: G-D3W4SP5MGX

   Key safeguards:
   1) Never inject a generic error page into the mounts (prevents "duplicate page" look).
   2) Always force-close mobile nav on boot (prevents "menu stuck open").
   3) Works whether header is injected OR already present in the DOM.
*/
(function () {
  "use strict";

  var GA_ID = "G-D3W4SP5MGX";

  /* =========================
     GA4 (global)
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
     DOM helpers
     ========================= */
  function qs(root, sel) {
    return root ? root.querySelector(sel) : null;
  }
  function qsa(root, sel) {
    return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : [];
  }

  function forceCloseNavState() {
    // If this class ever persists (cache / previous JS), it will force the menu visible.
    document.documentElement.classList.remove("tcfr-navOpen");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  /* =========================
     Safe include injection
     ========================= */
  function looksLikeFullHtmlDoc(htmlText) {
    var t = String(htmlText || "").slice(0, 800).toLowerCase();
    return t.indexOf("<!doctype") !== -1 || t.indexOf("<html") !== -1 || t.indexOf("<head") !== -1;
  }

  async function fetchText(url) {
    try {
      var res = await fetch(url, { cache: "no-store" });
      // Some platforms return 200 with an error body, so we still validate content below.
      var text = await res.text();
      return { ok: res.ok, status: res.status, text: text };
    } catch (e) {
      return { ok: false, status: 0, text: "" };
    }
  }

  async function injectHeaderIfValid() {
    var mount = document.getElementById("siteHeader");
    if (!mount) return null;

    // If a header already exists in the mount, do nothing.
    var existing = qs(mount, "[data-tcfr-header]") || qs(mount, ".tcfr-header") || qs(mount, "header");
    if (existing) return mount;

    var r = await fetchText("/assets/includes/header.html");
    if (!r.text) return null;

    // Reject full HTML documents (prevents error page injection).
    if (looksLikeFullHtmlDoc(r.text)) return null;

    // Must include the marker from your header include.
    if (r.text.indexOf("data-tcfr-header") === -1 && r.text.indexOf("tcfr-header") === -1) return null;

    mount.innerHTML = r.text;
    return mount;
  }

  async function injectFooterIfValid() {
    var mount = document.getElementById("siteFooter");
    if (!mount) return null;

    // If footer include does not exist yet, do not inject (prevents duplication).
    var r = await fetchText("/assets/includes/footer.html");
    if (!r.text) return null;

    // Reject full HTML documents (prevents error page injection).
    if (looksLikeFullHtmlDoc(r.text)) return null;

    // Require a footer marker. If you have not built a footer yet, it will safely do nothing.
    if (r.text.indexOf("data-tcfr-footer") === -1 && r.text.indexOf("tcfr-footer") === -1) return null;

    mount.innerHTML = r.text;
    return mount;
  }

  /* =========================
     Header behavior
     ========================= */
  function initHeaderFromMount(mount) {
    if (!mount) return;

    var header = qs(mount, "[data-tcfr-header]") || qs(mount, ".tcfr-header") || qs(mount, "header");
    if (!header) return;

    // Prevent double init
    if (header.__tcfrInit) return;
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

      // Collapse all accordions
      qsa(header, ".tcfr-mGroup").forEach(function (btn) {
        btn.setAttribute("aria-expanded", "false");
        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        if (sub) sub.hidden = true;
      });
    }

    // Always start closed (fixes "stuck open" states)
    forceCloseNavState();
    if (panel) panel.hidden = true;
    if (overlay) overlay.hidden = true;
    if (burger) burger.setAttribute("aria-expanded", "false");

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
  }

  function tryInitHeaderWithoutInjection() {
    // If the header is already in DOM (no injection), initialize it.
    var header = document.querySelector("[data-tcfr-header]") || document.querySelector(".tcfr-header");
    if (!header) return false;
    initHeaderFromMount(header.parentNode || document.body);
    return true;
  }

  /* =========================
     Boot
     ========================= */
  async function boot() {
    initGA4();
    forceCloseNavState();

    // Try init if header already present
    tryInitHeaderWithoutInjection();

    // Inject header if needed
    var headerMount = await injectHeaderIfValid();
    if (headerMount) initHeaderFromMount(headerMount);

    // Inject footer only if a real footer include exists (with marker)
    await injectFooterIfValid();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
