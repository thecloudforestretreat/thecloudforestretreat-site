(function(){
  "use strict";

  function qs(root, sel){ return (root || document).querySelector(sel); }
  function qsa(root, sel){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function ensureOverlay(){
    var o = qs(document, ".mOverlay") || qs(document, ".tcfr-mobileOverlay");
    if (o) return o;

    o = document.createElement("div");
    o.className = "mOverlay";
    o.hidden = true;

    // Keep it simple: no blur, no filters.
    o.style.position = "fixed";
    o.style.inset = "0";
    o.style.background = "rgba(11,26,16,0.35)";
    o.style.zIndex = "4999";

    document.body.appendChild(o);
    return o;
  }

  function initMobileNav(){
    // Current TCFR header markup uses .mToggle + #mobileNav + .mMain/.mSub drilldown.
    // Older variants used .tcfr-burger + .tcfr-mobilePanel. Support both.
    var toggle =
      qs(document, ".mToggle") ||
      qs(document, '[data-action="toggle-menu"]') ||
      qs(document, ".tcfr-burger") ||
      qs(document, 'button[aria-label="Open menu"]') ||
      qs(document, 'button[aria-label="Menu"]');

    var nav =
      qs(document, "#mobileNav") ||
      qs(document, ".tcfr-mobilePanel");

    if (!toggle || !nav) return;

    var overlay = ensureOverlay();

    function setOpen(open){
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.hidden = !open;
      overlay.hidden = !open;

      // Lock scroll when open (no blur).
      document.documentElement.classList.toggle("navOpen", open);
      document.body.style.overflow = open ? "hidden" : "";
      document.body.style.touchAction = open ? "none" : "";
    }

    function isOpen(){ return !nav.hidden; }

    // Always start closed to avoid "menu opens on refresh".
    setOpen(false);

    // Click hamburger
    toggle.addEventListener("click", function(e){
      e.preventDefault();
      setOpen(!isOpen());
    });

    // Click outside
    overlay.addEventListener("click", function(){
      setOpen(false);
    });

    // Esc closes
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") setOpen(false);
    });

    // Close on any nav link click (so menu does not stay open).
    qsa(nav, "a").forEach(function(a){
      a.addEventListener("click", function(){
        setOpen(false);
      });
    });

    // Drilldown (Rooms/Features -> submenus)
    var main = qs(nav, ".mMain") || qs(nav, '[data-view="main"]');

    function showMain(){
      if (main) main.hidden = false;
      qsa(nav, ".mSub").forEach(function(s){ s.hidden = true; });
    }

    // Ensure initial drilldown state is sane
    showMain();

    qsa(nav, ".mNext").forEach(function(btn){
      btn.addEventListener("click", function(){
        var target = btn.getAttribute("data-target");
        if (!target) return;

        // data-target is like "#m-rooms"
        var sub = qs(nav, target) || qs(document, target);
        if (!sub) return;

        if (main) main.hidden = true;
        qsa(nav, ".mSub").forEach(function(s){ s.hidden = true; });
        sub.hidden = false;
      });
    });

    qsa(nav, ".mBack").forEach(function(btn){
      btn.addEventListener("click", function(){
        // back buttons in this markup use data-back="main"
        showMain();
      });
    });

    // Prevent any stray hash-only navigation that some mobile buttons could trigger.
    // If a button is mis-marked as <a href="#">, keep it inert.
    qsa(nav, 'a[href="#"]').forEach(function(a){
      a.addEventListener("click", function(e){ e.preventDefault(); });
    });
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initMobileNav);
  } else {
    initMobileNav();
  }
})();
