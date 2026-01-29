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
  function initHeaderFromMount(root){
    if (!root) return;

    // Support both "tcfr-*" and legacy header markup classes/ids
    var burger = root.querySelector(".tcfr-burger") || root.querySelector(".hamburger");
    var panel = root.querySelector(".tcfr-mobilePanel") || root.querySelector("#mobileNav");
    var overlay = root.querySelector(".tcfr-overlay");

    // If we have no mobile elements, nothing to bind
    if (!burger || !panel) return;

    // Ensure overlay exists (some header versions do not include it)
    if (!overlay){
      overlay = document.createElement("div");
      overlay.className = "tcfr-overlay";
      overlay.hidden = true;
      // Minimal inline styles so we are not dependent on CSS ordering/caches
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.background = "rgba(0,0,0,0.22)";
      // Keep overlay UNDER the menu panel. If overlay sits above, it will blur/dim the menu itself.
      overlay.style.zIndex = "9998";
      overlay.style.backdropFilter = "blur(2px)";
      overlay.style.webkitBackdropFilter = "blur(2px)";
      document.body.appendChild(overlay);
    }

    // Ensure the panel is above the overlay (fixes "blurry" mobile menu when overlay stacks on top).
    try {
      panel.style.position = panel.style.position || "fixed";
      panel.style.zIndex = "9999";
    } catch(e) {}

    // Ensure overlay stays below panel.
    try { overlay.style.zIndex = "9998"; } catch(e) {}

    // Normalize ARIA
    burger.setAttribute("aria-expanded", "false");
    if (!burger.getAttribute("aria-controls")){
      // best-effort: use existing id or assign one
      if (!panel.id) panel.id = "tcfrMobileNav";
      burger.setAttribute("aria-controls", panel.id);
    }

    // Normalize hidden state
    if (typeof panel.hidden !== "boolean") panel.hidden = true;

    function closeMenu(){
      panel.hidden = true;
      overlay.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("tcfr-navOpen");
    }

    function openMenu(){
      panel.hidden = false;
      overlay.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("tcfr-navOpen");

      // Always reset to main view if drill-down structure is present
      var main = panel.querySelector(".mPanel") || panel.querySelector(".m-main");
      var subs = panel.querySelectorAll(".mSub, .m-submenu");
      if (main) main.hidden = false;
      for (var i = 0; i < subs.length; i++) subs[i].hidden = true;
    }

    function toggleMenu(){
      if (panel.hidden) openMenu();
      else closeMenu();
    }

    // Avoid double-binding if includes are re-injected
    if (burger.__tcfrBound) return;
    burger.__tcfrBound = true;

    burger.addEventListener("click", function(e){
      e.preventDefault();
      toggleMenu();
    });

    // Some iOS versions need touchstart to feel responsive
    burger.addEventListener("touchstart", function(){ /* no-op: improves tap responsiveness */ }, { passive: true });

    overlay.addEventListener("click", function(){ closeMenu(); });

    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") closeMenu();
    });

    // Close when clicking any link inside the panel
    panel.addEventListener("click", function(e){
      var a = e.target && (e.target.closest ? e.target.closest("a") : null);
      if (a) closeMenu();
    });

    // Drill-down navigation (ExperienceEcuador-style or tcfr-style)
    panel.addEventListener("click", function(e){
      var nextBtn = e.target && (e.target.closest ? e.target.closest(".mNext, .m-next") : null);
      var backBtn = e.target && (e.target.closest ? e.target.closest(".mBack, .m-back") : null);

      if (nextBtn){
        e.preventDefault();
        var target = nextBtn.getAttribute("data-target");
        if (!target) return;

        var main = panel.querySelector(".mPanel") || panel.querySelector(".m-main");
        var sub = panel.querySelector(target);
        if (!sub) return;

        if (main) main.hidden = true;
        sub.hidden = false;
        return;
      }

      if (backBtn){
        e.preventDefault();
        var backTarget = backBtn.getAttribute("data-back");
        // If backTarget is specified, go there; otherwise go to main
        var main2 = panel.querySelector(".mPanel") || panel.querySelector(".m-main");
        var subs2 = panel.querySelectorAll(".mSub, .m-submenu");
        for (var j = 0; j < subs2.length; j++) subs2[j].hidden = true;

        if (backTarget){
          var backView = panel.querySelector(backTarget);
          if (backView){ backView.hidden = false; return; }
        }
        if (main2) main2.hidden = false;
      }
    });

    // If the viewport is resized to desktop, ensure menu is closed
    window.addEventListener("resize", function(){
      if (window.matchMedia && window.matchMedia("(min-width: 901px)").matches){
        closeMenu();
      }
    }, { passive: true });
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
