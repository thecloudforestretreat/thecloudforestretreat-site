/* /assets/js/site.js (TCFR)
   - Injects header/footer once (if mounts exist)
   - Initializes hamburger open/close
   - Mobile accordion toggles
   - Sticky scroll class
*/
(function () {
  "use strict";

  function qs(root, sel) { return root ? root.querySelector(sel) : null; }
  function qsa(root, sel) { return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : []; }

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

  async function injectOnce(mountId, url, markerAttr) {
    var mount = document.getElementById(mountId);
    if (!mount) return;

    // Prevent double injection
    if (mount.getAttribute(markerAttr) === "1") return;
    mount.setAttribute(markerAttr, "1");

    var res = await fetch(url, { cache: "no-store" });
    var html = await res.text();

    // Clear then inject
    mount.innerHTML = html;
  }

  async function boot() {
    // If your page has mounts, inject includes
    var hasHeaderMount = !!document.getElementById("siteHeader");
    var hasFooterMount = !!document.getElementById("siteFooter");

    if (hasHeaderMount) {
      try { await injectOnce("siteHeader", "/assets/includes/header.html", "data-tcfr-injected"); }
      catch (e) {}
    }
    if (hasFooterMount) {
      try { await injectOnce("siteFooter", "/assets/includes/footer.html", "data-tcfr-injected"); }
      catch (e) {}
    }

    // Init header after injection or if already present
    var header = qs(document, "[data-tcfr-header]");
    if (header) initHeader(header);

    // Observe in case header arrives later
    var mount = document.getElementById("siteHeader");
    if (mount) {
      var mo = new MutationObserver(function () {
        var h = qs(document, "[data-tcfr-header]");
        if (h) {
          initHeader(h);
          mo.disconnect();
        }
      });
      mo.observe(mount, { childList: true, subtree: true });
    }
  }

  boot();
})();
