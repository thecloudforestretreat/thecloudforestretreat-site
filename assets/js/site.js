/* /assets/js/site.js
   TCFR: Header behaviors (mobile menu + submenus + language switch).
   Defensive bindings: works with injected headers and avoids double-binding.
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
    var attr = "data-once-" + key;
    if (el.hasAttribute(attr)) return false;
    el.setAttribute(attr, "1");
    return true;
  }

  function escId(id){ return String(id || "").replace(/[^a-zA-Z0-9_-]/g, ""); }

  function setHidden(el, hidden){
    if (!el) return;
    if (hidden){
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
    }else{
      el.removeAttribute("hidden");
      el.setAttribute("aria-hidden", "false");
    }
  }

  function lockScroll(lock){
    // Prevent background scrolling while the panel is open.
    if (lock){
      document.documentElement.classList.add("tcfr-menu-open");
      document.body.classList.add("tcfr-menu-open");
    }else{
      document.documentElement.classList.remove("tcfr-menu-open");
      document.body.classList.remove("tcfr-menu-open");
    }
  }

  function initMobileSubmenus(panel){
    if (!panel) return;

    var groups = $all("button.tcfr-mGroup[aria-controls]", panel);

    function getSub(group){
      var id = group.getAttribute("aria-controls");
      if (!id) return null;
      // Submenus are inside the panel, so prefer scoped lookup.
      return $("#" + escId(id), panel) || document.getElementById(id);
    }

    // Initialize states
    groups.forEach(function(g){
      if (!once(g, "tcfr-submenu")) return;

      var sub = getSub(g);
      // Default closed unless explicitly open
      g.setAttribute("aria-expanded", g.getAttribute("aria-expanded") === "true" ? "true" : "false");
      if (sub){
        var shouldOpen = g.getAttribute("aria-expanded") === "true";
        setHidden(sub, !shouldOpen);
      }

      g.addEventListener("click", function(e){
        e.preventDefault();

        var thisSub = getSub(g);
        if (!thisSub) return;

        var willOpen = thisSub.hasAttribute("hidden");
        // Close others
        groups.forEach(function(other){
          if (other === g) return;
          var otherSub = getSub(other);
          other.setAttribute("aria-expanded", "false");
          if (otherSub) setHidden(otherSub, true);
        });

        g.setAttribute("aria-expanded", willOpen ? "true" : "false");
        setHidden(thisSub, !willOpen);
      });
    });
  }

  function initHeaderBehaviors(root){
    // Root can be document (fallback) or the injected header container.
    var burger = $("button.tcfr-burger[aria-controls]", root) || $(".tcfr-burger", root);
    var panelId = burger ? burger.getAttribute("aria-controls") : null;

    var panel = panelId ? document.getElementById(panelId) : $("#tcfrMobilePanel", root) || document.getElementById("tcfrMobilePanel");
    var overlay = $(".tcfr-mobileOverlay", root) || document.querySelector(".tcfr-mobileOverlay");
    var closeBtn = panel ? $(".tcfr-mClose", panel) : null;

    if (!burger || !panel) return;

    if (!once(burger, "tcfr-menu")) return;

    // Ensure hidden by default
    setHidden(overlay, true);
    setHidden(panel, true);
    burger.setAttribute("aria-expanded", "false");

    function closeMenu(){
      setHidden(overlay, true);
      setHidden(panel, true);
      burger.setAttribute("aria-expanded", "false");
      lockScroll(false);
      // Close any open submenus when closing panel
      var openGroups = $all("button.tcfr-mGroup[aria-controls][aria-expanded='true']", panel);
      openGroups.forEach(function(g){
        g.setAttribute("aria-expanded", "false");
        var id = g.getAttribute("aria-controls");
        if (!id) return;
        var sub = $("#" + escId(id), panel) || document.getElementById(id);
        if (sub) setHidden(sub, true);
      });
    }

    function openMenu(){
      setHidden(overlay, false);
      setHidden(panel, false);
      burger.setAttribute("aria-expanded", "true");
      lockScroll(true);
    }

    function toggleMenu(){
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu();
      else openMenu();
    }

    on(burger, "click", function(e){
      e.preventDefault();
      toggleMenu();
    });

    on(overlay, "click", function(e){
      e.preventDefault();
      closeMenu();
    });

    on(closeBtn, "click", function(e){
      e.preventDefault();
      closeMenu();
    });

    on(document, "keydown", function(e){
      if (e.key === "Escape") closeMenu();
    });

    // Close menu on navigation within panel
    on(panel, "click", function(e){
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      // Allow submenu toggles that might be anchors; our submenu toggles are buttons.
      closeMenu();
    });

    // Initialize submenus
    initMobileSubmenus(panel);

    // Re-check submenus after injection changes (rare, but safe)
    // This is cheap and prevents stale states.
    setTimeout(function(){ initMobileSubmenus(panel); }, 0);

    // Safety: if viewport grows past mobile, close panel
    on(window, "resize", function(){
      if (window.matchMedia && window.matchMedia("(min-width: 901px)").matches){
        closeMenu();
      }
    }, { passive: true });
  }

  // If your site injects header/footer via head.js, wait for it.
  function boot(){
    // Try within #siteHeader first to avoid binding to stale markup.
    var siteHeader = document.getElementById("siteHeader");
    if (siteHeader){
      initHeaderBehaviors(siteHeader);
    }
    // Also attempt document fallback in case header is not injected.
    initHeaderBehaviors(document);
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }
})();
