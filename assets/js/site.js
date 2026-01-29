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

    var header =
      mountEl.querySelector("[data-tcfr-header]") ||
      mountEl.querySelector(".topbar") ||
      mountEl.querySelector("header") ||
      mountEl.firstElementChild;

    if (!header) return;

    // Sticky helper (purely visual)
    function onScroll() {
      header.classList.toggle("is-stuck", window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile menu compatibility (supports both the newer TCFR markup and your current deployed header markup)
    var burger =
      header.querySelector(".tcfr-burger") ||
      header.querySelector(".hamburger") ||
      header.querySelector('[aria-controls="mobileNav"]') ||
      header.querySelector('[data-action="menu"]');

    var panel =
      header.querySelector(".tcfr-menuPanel") ||
      header.querySelector("#mobileNav") ||
      document.getElementById("mobileNav") ||
      header.querySelector(".mNav");

    var overlay =
      header.querySelector(".tcfr-menuOverlay") ||
      header.querySelector(".menuOverlay") ||
      header.querySelector(".mOverlay");

    function isOpen() {
      if (!panel) return false;
      return panel.hidden === false;
    }

    function resetDrilldown() {
      if (!panel) return;
      var main = panel.querySelector(".mMain");
      var subs = panel.querySelectorAll(".mSub");
      if (main) main.hidden = false;
      for (var i = 0; i < subs.length; i++) subs[i].hidden = true;
    }

    function setOpen(open) {
      if (!panel || !burger) return;

      panel.hidden = !open;
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      burger.setAttribute("aria-expanded", open ? "true" : "false");

      header.classList.toggle("menu-open", open);
      document.documentElement.classList.toggle("tcfr-menu-open", open);

      if (overlay) overlay.hidden = !open;

      if (!open) resetDrilldown();
    }

    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setOpen(!isOpen());
    }

    function closeMenu() {
      setOpen(false);
    }

    // If the markup isn't present, do nothing (prevents errors on pages without injected header)
    if (burger && panel) {
      // Ensure closed state on load
      if (panel.hidden !== true && panel.hidden !== false) panel.hidden = true;
      closeMenu();

      burger.addEventListener("click", toggleMenu);

      // Overlay closes menu
      if (overlay) overlay.addEventListener("click", closeMenu);

      // Click outside closes menu
      document.addEventListener("click", function (e) {
        if (!isOpen()) return;
        var t = e.target;
        if (!t) return;
        if (panel.contains(t) || burger.contains(t)) return;
        closeMenu();
      });

      // Escape closes menu
      document.addEventListener("keydown", function (e) {
        if (!isOpen()) return;
        if (e.key === "Escape") closeMenu();
      });

      // Drilldown submenus (supports .mNext + data-target and [data-back] back buttons)
      panel.addEventListener("click", function (e) {
        var t = e.target;
        if (!t) return;

        var next = t.closest ? t.closest(".mNext") : null;
        if (next && next.getAttribute) {
          var sel = next.getAttribute("data-target");
          if (sel) {
            var target = panel.querySelector(sel);
            var main = panel.querySelector(".mMain");
            if (target) {
              if (main) main.hidden = true;
              var subs = panel.querySelectorAll(".mSub");
              for (var i = 0; i < subs.length; i++) subs[i].hidden = true;
              target.hidden = false;
            }
          }
          e.preventDefault();
          return;
        }

        var back = t.closest ? t.closest("[data-back]") : null;
        if (back) {
          resetDrilldown();
          e.preventDefault();
          return;
        }
      });

      // If switching to desktop, force-close mobile
      window.addEventListener("resize", function () {
        if (window.innerWidth >= 901) closeMenu();
      });
      window.addEventListener("orientationchange", closeMenu);
    }
  }

  /* =========================
     Boot
     ========================= */
  async function boot() {
    initGA4();

    // IMPORTANT: Cloudflare Pages often uses "pretty URLs" and redirects *.html -> no extension.
    // We try both, and only inject when we confirm it is a fragment (not a full HTML doc).
    var headerMount = await injectFragment(
      "siteHeader",
      ["/assets/includes/header", "/assets/includes/header.html"],
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
