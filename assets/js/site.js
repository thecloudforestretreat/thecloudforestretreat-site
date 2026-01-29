(function(){
  "use strict";

  function qs(sel, root){ return (root || document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function markBound(el, key){
    if (!el) return false;
    var attr = "data-" + key + "-bound";
    if (el.hasAttribute(attr)) return true;
    el.setAttribute(attr, "1");
    return false;
  }

  function bindMobileNav(){
    var burger = qs(".tcfr-burger");
    var panel = qs("#tcfrMobilePanel");
    var overlay = qs("#tcfrMobileOverlay");
    var closeBtn = qs(".tcfr-m-close");
    if (!burger || !panel || !overlay) return;

    if (markBound(burger, "tcfr")) return; // already bound

    function open(){
      burger.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      overlay.hidden = false;

      // Remove backdrop blur on iOS/Safari (it can blur the menu panel too)
      try {
        overlay.style.backdropFilter = "none";
        overlay.style.webkitBackdropFilter = "none";
        overlay.style.background = "rgba(0,0,0,0.35)";
      } catch (e) {}

      document.documentElement.classList.add("tcfr-navOpen");
      document.body.classList.add("tcfr-navOpen");
    }

    function close(){
      burger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      overlay.hidden = true;
      document.documentElement.classList.remove("tcfr-navOpen");
      document.body.classList.remove("tcfr-navOpen");
    }

    burger.addEventListener("click", function(){
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      if (isOpen) close();
      else open();
    });

    overlay.addEventListener("click", close);
    if (closeBtn) closeBtn.addEventListener("click", close);

    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") close();
    });

    // Ensure closed by default
    close();
  }

  function bindDesktopDropdowns(){
    var triggers = qsa(".tcfr-dd-btn");
    if (!triggers.length) return;

    triggers.forEach(function(btn){
      if (markBound(btn, "tcfrdd")) return;

      var li = btn.closest ? btn.closest(".tcfr-navItem") : null;
      var menu = li ? li.querySelector(".tcfr-dd") : null;
      if (!li || !menu) return;

      function open(){
        li.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
      function close(){
        li.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        var openNow = li.classList.contains("is-open");
        qsa(".tcfr-navItem.is-open").forEach(function(x){
          if (x !== li) x.classList.remove("is-open");
        });
        if (openNow) close();
        else open();
      });

      document.addEventListener("click", function(e){
        if (!li.contains(e.target)) close();
      });

      li.addEventListener("mouseleave", close);

      btn.addEventListener("keydown", function(e){
        if (e.key === "Escape") close();
      });

      close();
    });
  }

  // Expose a single init hook that head.js can call after injecting header
  window.TCFR_bindHeader = function(){
    bindMobileNav();
    bindDesktopDropdowns();
  };

  function onReady(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(function(){
    // If header is already present (non-injected or cached), bind immediately
    window.TCFR_bindHeader();
  });

  // Also bind whenever head.js announces that it injected header markup
  document.addEventListener("tcfr:header-ready", function(){
    window.TCFR_bindHeader();
  });
})();
