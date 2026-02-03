/* /assets/js/site.js
   The Cloud Forest Retreat (TCFR)
   - Injects header/footer fragments into #siteHeader / #siteFooter
   - Initializes hamburger + mobile accordions
   - Sticky + scrolled state
   - GA4 loader: G-D3W4SP5MGX
   - WhatsApp Smart CTA widget (EN/ES)

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
      qs(mountEl, "[data-tcfr-header]") ||
      qs(mountEl, ".tcfr-header") ||
      qs(mountEl, "header");
    if (!header) return;

    // The injected header fragment places the overlay + mobile panel as siblings of <header>
    // inside the same mount. Queries must be scoped to the mount, not only the <header>.
    var scope = mountEl;

    if (header.__tcfrInit) return;
    header.__tcfrInit = true;

    // Force sticky (defensive: if a CSS override breaks it)
    header.style.position = "sticky";
    header.style.top = "0";
    header.style.zIndex = "5000";

    var burger =
      qs(header, "#tcfrBurger") ||
      qs(header, ".tcfr-burger") ||
      qs(header, "[data-controls]");
    if (!burger) return;

    var closeBtn = qs(scope, ".tcfr-close") || qs(scope, "[data-action='close']");

    var panelId =
      burger.getAttribute("data-controls") ||
      burger.getAttribute("aria-controls") ||
      "";
    var panel =
      (panelId ? qs(scope, "#" + panelId) : null) ||
      qs(scope, ".tcfr-mobilePanel") ||
      qs(scope, "aside[aria-label='Mobile menu']");
    var overlay = qs(scope, ".tcfr-mobileOverlay") || qs(scope, "#tcfrMobileOverlay");
    if (!panel || !overlay) return;

    function setLocked(locked) {
      document.documentElement.classList.toggle("tcfr-navOpen", locked);
      document.body.style.overflow = locked ? "hidden" : "";
      document.body.style.touchAction = locked ? "none" : "";
    }

    function collapseAccordions() {
      qsa(scope, ".tcfr-mGroup, .tcfr-mToggle").forEach(function (btn) {
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
    qsa(scope, ".tcfr-mGroup, .tcfr-mToggle").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        var id = btn.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        if (!sub) return;

        var isOpen = btn.getAttribute("aria-expanded") === "true";

        // Optional: close others to keep the panel tidy
        qsa(scope, ".tcfr-mGroup, .tcfr-mToggle").forEach(function (other) {
          if (other === btn) return;
          var oid = other.getAttribute("aria-controls");
          var osub = oid ? document.getElementById(oid) : null;
          other.setAttribute("aria-expanded", "false");
          if (osub) osub.hidden = true;
        });

        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
        sub.hidden = isOpen ? true : false;
      });
    });

    // Close on any mobile link click
    qsa(scope, ".tcfr-navMobile a[href]").forEach(function (a) {
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
    window.addEventListener("orientationchange", function () {
      closeMenu();
    });
  }

  /* =========================
     WhatsApp Smart CTA (TCFR)
     ========================= */
  function tcfrNormalizePath(p) {
    p = p || "/";
    if (p.length > 1 && p.charAt(p.length - 1) !== "/") p = p + "/";
    return p;
  }
  function tcfrIsSpanishPath(p) {
    return p === "/es/" || p.indexOf("/es/") === 0;
  }
  function tcfrIsMobileLike() {
    var byWidth = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    var byPointer = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    var byTouch = ("ontouchstart" in window) || (navigator && navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    return !!(byWidth || byPointer || byTouch);
  }
  function tcfrGetInlineWaQuestions() {
    var el = document.getElementById("tcfrWaQuestions");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent || el.innerText || "{}");
    } catch (e) {
      return null;
    }
  }
  function tcfrSetImgForViewport(root) {
    var img = root.querySelector(".tcfrWaImg");
    if (!img) return;

    var d = String(root.getAttribute("data-wa-img-desktop") || "");
    var m = String(root.getAttribute("data-wa-img-mobile") || "");
    var target = tcfrIsMobileLike() ? (m || d) : (d || m);

    if (target && img.getAttribute("src") !== target) img.setAttribute("src", target);
  }
  function tcfrBuildLink(root, template) {
    var numRaw = String(root.getAttribute("data-wa-number") || "");
    var num = numRaw.replace(/[^\d]/g, "");
    if (!num) return "";

    var url = window.location.href;
    var msg = String(template || "").replace("{url}", url);
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
  }
  function tcfrApplyCopy(root) {
    var data = tcfrGetInlineWaQuestions();
    if (!data) return;

    var p = tcfrNormalizePath(window.location.pathname || "/");
    var isEs = tcfrIsSpanishPath(p);

    var row = isEs ? data.default_es : data.default_en;
    if (!row) return;

    var titleEl = root.querySelector(".tcfrWaTitle");
    var actions = Array.prototype.slice.call(root.querySelectorAll(".tcfrWaAction"));

    if (titleEl && row.title) titleEl.textContent = row.title;

    if (actions.length >= 4) {
      actions[0].textContent = row.q1 || actions[0].textContent;
      actions[1].textContent = row.q2 || actions[1].textContent;
      actions[2].textContent = row.q3 || actions[2].textContent;
      actions[3].textContent = row.q4 || actions[3].textContent;

      actions[0].setAttribute("data-wa-template", row.t1 || "");
      actions[1].setAttribute("data-wa-template", row.t2 || "");
      actions[2].setAttribute("data-wa-template", row.t3 || "");
      actions[3].setAttribute("data-wa-template", row.t4 || "");
    }
  }
  function initWhatsAppWidget(root) {
    if (!root || root.__tcfrWaInit) return;
    root.__tcfrWaInit = true;

    var btn = root.querySelector(".tcfrWaBtn");
    if (!btn) return;

    var closeBtn = root.querySelector(".tcfrWaClose");
    var backdrop = root.querySelector(".tcfrWaBackdrop");
    var actions = Array.prototype.slice.call(root.querySelectorAll(".tcfrWaAction"));

    tcfrApplyCopy(root);
    tcfrSetImgForViewport(root);

    function openPanel() {
      root.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
    function closePanel() {
      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
    function goWhatsApp(template) {
      var link = tcfrBuildLink(root, template);
      if (!link) return;
      window.location.href = link;
    }

    function onBtnClick(e) {
      e.preventDefault();

      // Mobile: tap directly to WhatsApp using the first action (availability)
      if (tcfrIsMobileLike()) {
        var data = tcfrGetInlineWaQuestions();
        var p = tcfrNormalizePath(window.location.pathname || "/");
        var row = tcfrIsSpanishPath(p) ? (data && data.default_es) : (data && data.default_en);
        var t1 = row && row.t1 ? row.t1 : "Hi! I want to check availability.\n\nPage: {url}";
        goWhatsApp(t1);
        return;
      }

      if (root.classList.contains("is-open")) closePanel();
      else openPanel();
    }

    btn.addEventListener("click", onBtnClick, { passive: false });
    btn.addEventListener(
      "touchstart",
      function (e) {
        if (!tcfrIsMobileLike()) return;
        e.preventDefault();
        e.stopPropagation();
        onBtnClick(e);
      },
      { passive: false }
    );

    if (closeBtn) closeBtn.addEventListener("click", function (e) { e.preventDefault(); closePanel(); }, { passive: false });
    if (backdrop) backdrop.addEventListener("click", function () { closePanel(); }, { passive: true });

    actions.forEach(function (a) {
      a.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();

          // Mobile: always go directly
          if (tcfrIsMobileLike()) {
            var tplM = a.getAttribute("data-wa-template") || "";
            goWhatsApp(tplM);
            return;
          }

          var template = a.getAttribute("data-wa-template") || "";
          var link = tcfrBuildLink(root, template);
          if (!link) return;

          closePanel();
          window.open(link, "_blank", "noopener,noreferrer");
        },
        { passive: false }
      );
    });

    // Keep copy/image correct on resize
    window.addEventListener("resize", function () {
      tcfrApplyCopy(root);
      tcfrSetImgForViewport(root);
      if (tcfrIsMobileLike()) closePanel();
    }, { passive: true });
  }
  function bootWhatsAppSoon() {
    function bootNow() {
      var nodes = document.querySelectorAll(".tcfrWaFab");
      for (var i = 0; i < nodes.length; i++) initWhatsAppWidget(nodes[i]);
    }

    bootNow();
    window.setTimeout(bootNow, 400);
    window.setTimeout(bootNow, 1200);
    window.setTimeout(bootNow, 2500);

    if (!window.__TCFR_WA_OBSERVER__ && "MutationObserver" in window) {
      window.__TCFR_WA_OBSERVER__ = new MutationObserver(function () {
        bootNow();
      });
      window.__TCFR_WA_OBSERVER__.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
      });
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

    // WhatsApp widget may appear after footer injection
    bootWhatsAppSoon();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
