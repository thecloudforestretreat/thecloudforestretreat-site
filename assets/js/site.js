/* /assets/js/site.js (TCFR)
   Goals:
   - Never inject twice
   - Never initialize twice
   - If something else injected/duplicated (e.g., head.js), clean duplicates safely
*/
(function () {
  "use strict";

  // Global lock (prevents double boot even if script is included twice)
  if (window.__TCFR_SITE_BOOTED__) return;
  window.__TCFR_SITE_BOOTED__ = true;

  function qs(root, sel) { return root ? root.querySelector(sel) : null; }
  function qsa(root, sel) { return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : []; }

  function removeAllButFirst(nodes) {
    for (var i = 1; i < nodes.length; i++) {
      if (nodes[i] && nodes[i].parentNode) nodes[i].parentNode.removeChild(nodes[i]);
    }
  }

  function cleanupDuplicates() {
    // If header was injected multiple times, keep first
    var headers = qsa(document, "[data-tcfr-header]");
    removeAllButFirst(headers);

    // If siteHeader mount contains multiple headers (nested), keep first header
    var mountHeader = document.getElementById("siteHeader");
    if (mountHeader) {
      var insideHeaders = qsa(mountHeader, "[data-tcfr-header]");
      removeAllButFirst(insideHeaders);
    }

    // If there are multiple "main.wrap" blocks (this is the "double page" symptom)
    var mains = qsa(document, "main.wrap");
    removeAllButFirst(mains);

    // If there are multiple footer mounts/content (future-proof)
    var mountFooter = document.getElementById("siteFooter");
    if (mountFooter) {
      // If your footer include later adds a marker, this will still be safe
      // For now just prevent duplicate direct children that look like a full footer wrapper
      // (Nothing destructive if empty)
    }
  }

  function setLocked(locked) {
    document.documentElement.classList.toggle("tcfr-navOpen", locked);
    document.body.style.overflow = locked ? "hidden" : "";
    document.body.style.touchAction = locked ? "none" : "";
  }

  function initHeader(header) {
    if (!header || header.__tcfrInit) return;
    header.__tcfrInit = true;

    var burger = qs(header, ".tcfr-burger");
    var closeBtn = qs(header, ".tcfr-close");
    var panel = qs(header, ".tcfr-mobilePanel");
    var overlay = qs(header, ".tcfr-mobileOverlay");

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

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 901) closeMenu();
    });
  }

  async function injectMount(mountId, url) {
    var mount = document.getElementById(mountId);
    if (!mount) return;

    // If something already injected, do not inject again.
    // We treat any non-whitespace content as "already injected".
    var already = (mount.innerHTML || "").replace(/\s+/g, "");
    if (already.length > 0) return;

    var res = await fetch(url, { cache: "no-store" });
    var html = await res.text();

    // Replace (not append)
    mount.innerHTML = html;
  }

  async function boot() {
    // First: clean up any duplicates that might already exist
    cleanupDuplicates();

    // Inject only if mounts are empty
    try { await injectMount("siteHeader", "/assets/includes/header.html"); } catch (e) {}
    try { await injectMount("siteFooter", "/assets/includes/footer.html"); } catch (e) {}

    // Clean again (in case another script injected at the same time)
    cleanupDuplicates();

    // Init header
    var header = qs(document, "[data-tcfr-header]");
    if (header) initHeader(header);

    // Observe: if some other injector runs later, we still clean and init once
    var mount = document.getElementById("siteHeader");
    if (mount) {
      var mo = new MutationObserver(function () {
        cleanupDuplicates();
        var h = qs(document, "[data-tcfr-header]");
        if (h) initHeader(h);
      });
      mo.observe(mount, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
