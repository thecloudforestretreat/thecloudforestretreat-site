(function () {
  "use strict";

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  function qsa(root, sel) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function ensureOverlay() {
    var o = qs(document, ".tcfr-mobileOverlay") || qs(document, ".mOverlay");
    if (o) return o;

    o = document.createElement("div");
    o.className = "tcfr-mobileOverlay";
    o.hidden = true;

    // No blur here (blur was causing the "blurry menu" feel on iOS).
    o.style.position = "fixed";
    o.style.inset = "0";
    o.style.background = "rgba(11,26,16,0.35)";
    o.style.zIndex = "9998";

    document.body.appendChild(o);
    return o;
  }

  function getPanelFromToggle(toggle) {
    if (!toggle) return null;

    var id = toggle.getAttribute("aria-controls");
    if (id) {
      var p = document.getElementById(id);
      if (p) return p;
    }

    return (
      document.getElementById("tcfrMobilePanel") ||
      qs(document, "#mobileNav") ||
      qs(document, ".tcfr-mobilePanel")
    );
  }

  function initMobileNav() {
    var headerRoot =
      qs(document, "#siteHeader [data-tcfr-header]") ||
      qs(document, "#siteHeader .tcfr-header") ||
      qs(document, "#siteHeader header") ||
      qs(document, "#siteHeader");

    if (!headerRoot) return;

    var toggle =
      qs(headerRoot, ".tcfr-burger") ||
      qs(headerRoot, ".mToggle") ||
      qs(headerRoot, '[data-action="toggle-menu"]') ||
      qs(headerRoot, 'button[aria-label="Open menu"]') ||
      qs(headerRoot, 'button[aria-label="Menu"]');

    var panel = getPanelFromToggle(toggle);
    if (!toggle || !panel) return;

    var overlay = ensureOverlay();

    var closeBtn =
      qs(panel, '[data-action="close"]') ||
      qs(panel, ".tcfr-close") ||
      qs(panel, 'button[aria-label="Close menu"]') ||
      qs(panel, 'button[aria-label="Close"]');

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      overlay.hidden = !open;

      document.documentElement.classList.toggle("tcfr-navOpen", open);
      document.body.style.overflow = open ? "hidden" : "";
      document.body.style.touchAction = open ? "none" : "";
    }

    function isOpen() {
      return panel.hidden === false;
    }

    // Always start closed to prevent "open on refresh"
    setOpen(false);

    function onToggle(e) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!isOpen());
    }

    if ("onpointerdown" in window) {
      toggle.addEventListener("pointerdown", onToggle, { passive: false });
    }
    toggle.addEventListener("click", onToggle);

    overlay.addEventListener("click", function () {
      setOpen(false);
    });

    if (closeBtn) {
      if ("onpointerdown" in window) {
        closeBtn.addEventListener(
          "pointerdown",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          },
          { passive: false }
        );
      }
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    qsa(panel, "a").forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });

    // Optional drilldown support (only if markup includes these classes)
    var main = qs(panel, ".mMain") || qs(panel, '[data-view="main"]');

    function showMain() {
      if (main) main.hidden = false;
      qsa(panel, ".mSub").forEach(function (s) {
        s.hidden = true;
      });
    }

    showMain();

    qsa(panel, ".mNext").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var target = btn.getAttribute("data-target");
        if (!target) return;
        var sub = qs(panel, target) || qs(document, target);
        if (!sub) return;

        if (main) main.hidden = true;
        qsa(panel, ".mSub").forEach(function (s) {
          s.hidden = true;
        });
        sub.hidden = false;
      });
    });

    qsa(panel, ".mBack").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        showMain();
      });
    });

    // Guard against hash-only links
    qsa(panel, 'a[href="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileNav);
  } else {
    initMobileNav();
  }
})();
