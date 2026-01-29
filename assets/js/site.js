/* /assets/js/site.js
   TCFR: Mobile menu + language switch helpers.
   This script is defensive: it binds after header injection and avoids double-binding.
*/
(function(){
  "use strict";

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function on(el, evt, fn, opts){
    if (!el) return;
    el.addEventListener(evt, fn, opts || false);
  }

  function once(el, key){
    if (!el) return false;
    var attr = "data-bound-" + key;
    if (el.getAttribute(attr) === "1") return false;
    el.setAttribute(attr, "1");
    return true;
  }

  function lockScroll(lock){
    try{
      document.documentElement.classList.toggle("tcfr-scrollLock", !!lock);
      document.body.classList.toggle("tcfr-scrollLock", !!lock);
      document.body.style.overflow = lock ? "hidden" : "";
      document.body.style.touchAction = lock ? "none" : "";
    }catch(e){}
  }

  function initMobileMenu(){
    var headerHost = document.getElementById("siteHeader");
    if (!headerHost) return;

    // Markup (from header include):
    // button.tcfr-burger[aria-controls="tcfrMobilePanel"]
    // div.tcfr-mobileOverlay#tcfrMobileOverlay
    // aside.tcfr-mobilePanel#tcfrMobilePanel
    var burger = $(".tcfr-burger", headerHost);
    var panel  = $("#tcfrMobilePanel", headerHost) || $(".tcfr-mobilePanel", headerHost);
    var overlay = $("#tcfrMobileOverlay", headerHost) || $(".tcfr-mobileOverlay", headerHost);
    var closeBtn = $(".tcfr-close", headerHost);

    if (!burger || !panel) return;

    // Only bind once per actual elements.
    if (!once(burger, "burger")) return;

    // Ensure overlay exists (optional).
    if (overlay && once(overlay, "overlay") === false){
      // ok
    }

    var isOpen = false;

    function setHidden(el, hidden){
      if (!el) return;
      if (hidden){
        el.setAttribute("hidden", "");
        el.setAttribute("aria-hidden", "true");
        el.style.display = "";
      }else{
        el.removeAttribute("hidden");
        el.setAttribute("aria-hidden", "false");
        // Some CSS may rely on display; keep it safe:
        if (!el.style.display) el.style.display = "";
      }
    }

    function openMenu(){
      if (isOpen) return;
      isOpen = true;

      burger.setAttribute("aria-expanded", "true");
      setHidden(panel, false);
      setHidden(overlay, false);

      // Guarantee stacking and visibility even if other CSS interferes.
      if (overlay){
        overlay.style.position = overlay.style.position || "fixed";
        overlay.style.inset = overlay.style.inset || "0";
        overlay.style.zIndex = overlay.style.zIndex || "6000";
      }
      panel.style.position = panel.style.position || "fixed";
      panel.style.zIndex = panel.style.zIndex || "7000";

      lockScroll(true);
      document.documentElement.classList.add("tcfr-menuOpen");
    }

    function closeMenu(){
      if (!isOpen) return;
      isOpen = false;

      burger.setAttribute("aria-expanded", "false");
      setHidden(panel, true);
      setHidden(overlay, true);

      lockScroll(false);
      document.documentElement.classList.remove("tcfr-menuOpen");
    }

    function toggleMenu(e){
      if (e){
        // Prevent the same click from immediately triggering outside-click close.
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
      }
      if (isOpen) closeMenu();
      else openMenu();
    }

    // Click / tap
    on(burger, "click", toggleMenu, { passive: false });
    on(burger, "touchend", toggleMenu, { passive: false });

    // Close button inside panel
    if (closeBtn){
      on(closeBtn, "click", function(e){
        if (e && e.preventDefault) e.preventDefault();
        closeMenu();
      });
      on(closeBtn, "touchend", function(e){
        if (e && e.preventDefault) e.preventDefault();
        closeMenu();
      }, { passive: false });
    }

    // Overlay click closes
    if (overlay){
      on(overlay, "click", function(e){
        if (e && e.preventDefault) e.preventDefault();
        closeMenu();
      });
      on(overlay, "touchend", function(e){
        if (e && e.preventDefault) e.preventDefault();
        closeMenu();
      }, { passive: false });
    }

    // Close on Escape
    on(document, "keydown", function(e){
      if (!isOpen) return;
      var key = e && (e.key || e.code);
      if (key === "Escape" || key === "Esc"){
        closeMenu();
      }
    });

    // Close if clicking outside panel/burger (capture to beat other handlers)
    on(document, "click", function(e){
      if (!isOpen) return;
      var t = e && e.target;
      if (!t) return;
      if (panel.contains(t) || burger.contains(t)) return;
      closeMenu();
    }, true);

    // Close after navigating via a link inside the panel
    on(panel, "click", function(e){
      var t = e && e.target;
      if (!t) return;
      var a = t.closest ? t.closest("a") : null;
      if (!a) return;
      // Allow in-page anchors to work; still close.
      closeMenu();
    });

    // Ensure initial state is closed
    burger.setAttribute("aria-expanded", "false");
    setHidden(panel, true);
    setHidden(overlay, true);
  }

  // Re-run init after header injection, and also on DOM ready.
  function boot(){
    initMobileMenu();
  }

  // If you have a header-injection script that dispatches a custom event, we support it.
  on(document, "tcfr:header:ready", boot);
  on(document, "DOMContentLoaded", boot);

  // Also retry shortly after load to handle async include injectors.
  on(window, "load", function(){
    window.setTimeout(boot, 50);
    window.setTimeout(boot, 250);
    window.setTimeout(boot, 750);
  });
})();
