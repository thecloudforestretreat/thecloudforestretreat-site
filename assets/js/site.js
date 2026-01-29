/* TCFR site.js - Mobile menu + submenus (robust, no flicker)
   Drop-in replacement for /assets/js/site.js

   Key behaviors:
   - Hamburger toggles mobile panel reliably (no document-click auto-close to avoid "open then close" flicker)
   - Close via overlay click, close button, or ESC
   - Submenus expand/collapse in-place on mobile (Rooms, Features)
   - Uses [hidden] attribute as the single source of truth
*/

(function () {
  "use strict";

  function qs(root, sel){ return (root || document).querySelector(sel); }
  function qsa(root, sel){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    // HEADER ROOT (injected into #siteHeader)
    var headerRoot = qs(document, "#siteHeader") || document;
    var headerEl = qs(headerRoot, "[data-tcfr-header]") || qs(headerRoot, ".tcfr-header") || qs(headerRoot, "header");
    if (!headerEl) return;

    // Mobile panel + overlay + burger
    var burger = qs(headerEl, ".tcfr-burger") || qs(headerEl, "[aria-controls][aria-label*='menu']");
    var panelId = burger ? burger.getAttribute("aria-controls") : null;
    var panel = panelId ? document.getElementById(panelId) : qs(headerEl, ".tcfr-mobilePanel");
    var overlay = qs(headerEl, ".tcfr-mobileOverlay") || qs(headerEl, "[data-overlay]");

    // Some builds may place overlay/panel as siblings inside header, so re-query globally if needed
    if (!panel) panel = qs(document, ".tcfr-mobilePanel");
    if (!overlay) overlay = qs(document, ".tcfr-mobileOverlay");

    // Close button inside panel
    var closeBtn = panel ? (qs(panel, "[data-action='close']") || qs(panel, ".tcfr-mClose") || qs(panel, "button[aria-label*='Close']")) : null;

    if (!burger || !panel) return;

    function isOpen(){
      return panel.hidden === false;
    }

    function lockScroll(on){
      // Light-touch scroll lock that works well on iOS Safari
      if (on){
        document.documentElement.classList.add("tcfr-scroll-lock");
        document.body.classList.add("tcfr-scroll-lock");
      } else {
        document.documentElement.classList.remove("tcfr-scroll-lock");
        document.body.classList.remove("tcfr-scroll-lock");
      }
    }

    function openMenu(){
      panel.hidden = false;
      if (overlay) overlay.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      headerEl.setAttribute("data-menu-open", "true");
      lockScroll(true);
    }

    function closeMenu(){
      panel.hidden = true;
      if (overlay) overlay.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      headerEl.removeAttribute("data-menu-open");
      lockScroll(false);
      // collapse any open submenu sections for a clean next open
      collapseAllSubmenus();
    }

    function toggleMenu(){
      if (isOpen()) closeMenu();
      else openMenu();
    }

    // Prevent the "flicker" caused by other click handlers:
    // Use pointerdown + click, and stop propagation.
    function onBurgerActivate(e){
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      toggleMenu();
    }

    burger.addEventListener("pointerdown", onBurgerActivate, { passive: false });
    burger.addEventListener("click", onBurgerActivate, { passive: false });

    if (overlay){
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        closeMenu();
      });
      overlay.addEventListener("touchstart", function(){ /* allow iOS tap */ }, { passive: true });
    }

    if (closeBtn){
      closeBtn.addEventListener("click", function(e){
        e.preventDefault();
        closeMenu();
      });
    }

    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && isOpen()) closeMenu();
    });

    // Close if a navigation link is clicked (not submenu toggles)
    if (panel){
      panel.addEventListener("click", function(e){
        var a = e.target && e.target.closest ? e.target.closest("a") : null;
        if (!a) return;

        // If it's a submenu toggle anchor, ignore
        if (a.hasAttribute("data-subtoggle")) return;

        // If it links to '#' only, ignore
        var href = a.getAttribute("href") || "";
        if (href === "#" || href === "#!") return;

        closeMenu();
      });
    }

    // --- Mobile submenus (Rooms / Features) ---
    // Strategy:
    // - In the mobile panel, parent items that have a submenu must be buttons or links with [data-subtoggle]
    // - Their submenu container must have [data-submenu] and start hidden
    // - We toggle hidden + aria-expanded and ensure only one submenu open at a time

    function collapseAllSubmenus(){
      if (!panel) return;
      var toggles = qsa(panel, "[data-subtoggle]");
      for (var i = 0; i < toggles.length; i++){
        toggles[i].setAttribute("aria-expanded", "false");
      }
      var subs = qsa(panel, "[data-submenu]");
      for (var j = 0; j < subs.length; j++){
        subs[j].hidden = true;
      }
    }

    function closeOtherSubmenus(exceptToggle){
      if (!panel) return;
      var toggles = qsa(panel, "[data-subtoggle]");
      for (var i = 0; i < toggles.length; i++){
        var t = toggles[i];
        if (t === exceptToggle) continue;
        t.setAttribute("aria-expanded", "false");
      }
      var subs = qsa(panel, "[data-submenu]");
      for (var j = 0; j < subs.length; j++){
        var sub = subs[j];
        var ownerId = sub.getAttribute("data-owner");
        if (!ownerId) continue;
        if (exceptToggle && exceptToggle.id && ownerId === exceptToggle.id) continue;
        sub.hidden = true;
      }
    }

    function toggleSubmenu(toggleEl){
      if (!panel || !toggleEl) return;

      // Find submenu by aria-controls or by next sibling
      var subId = toggleEl.getAttribute("aria-controls");
      var sub = subId ? document.getElementById(subId) : null;
      if (!sub) {
        // fallback: look for data-submenu within same group
        var group = toggleEl.closest("[data-subgroup]") || toggleEl.parentNode;
        sub = group ? qs(group, "[data-submenu]") : null;
      }
      if (!sub) return;

      // Ensure ownership linkage for closeOtherSubmenus
      if (!toggleEl.id) toggleEl.id = "mSubToggle_" + Math.random().toString(36).slice(2);
      if (!sub.getAttribute("data-owner")) sub.setAttribute("data-owner", toggleEl.id);

      var expanded = toggleEl.getAttribute("aria-expanded") === "true";
      closeOtherSubmenus(toggleEl);

      if (expanded){
        toggleEl.setAttribute("aria-expanded", "false");
        sub.hidden = true;
      } else {
        toggleEl.setAttribute("aria-expanded", "true");
        sub.hidden = false;
      }
    }

    function wireSubmenus(){
      if (!panel) return;

      // Normalize: any element with class tcfr-mGroup that contains a submenu
      // should have a toggle button/link with data-subtoggle.
      var toggles = qsa(panel, "[data-subtoggle]");
      for (var i = 0; i < toggles.length; i++){
        (function(t){
          // Make sure it behaves like a button
          t.setAttribute("role", t.tagName.toLowerCase() === "button" ? "button" : "button");
          if (!t.hasAttribute("aria-expanded")) t.setAttribute("aria-expanded", "false");

          t.addEventListener("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            toggleSubmenu(t);
          });

          t.addEventListener("pointerdown", function(e){
            // prevents click-through/ghost click issues on iOS
            e.preventDefault();
          }, { passive: false });
        })(toggles[i]);
      }

      // Default all submenus hidden on load
      var subs = qsa(panel, "[data-submenu]");
      for (var j = 0; j < subs.length; j++){
        subs[j].hidden = true;
      }
    }

    wireSubmenus();

    // Ensure closed on first load (some builds cache open state)
    closeMenu();

    // Expose minimal debug helpers (optional)
    window.__tcfrMenu = {
      open: openMenu,
      close: closeMenu,
      toggle: toggleMenu
    };
  });
})();
