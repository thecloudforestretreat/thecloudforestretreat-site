(function(){
  "use strict";

  function onReady(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function qs(root, sel){ return (root || document).querySelector(sel); }
  function qsa(root, sel){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function setScrollLock(lock){
    var b = document.body;
    if (!b) return;
    if (lock){
      if (!b.hasAttribute("data-prev-overflow")) b.setAttribute("data-prev-overflow", b.style.overflow || "");
      b.style.overflow = "hidden";
      b.style.touchAction = "none";
    } else {
      var prev = b.getAttribute("data-prev-overflow");
      b.style.overflow = prev || "";
      b.style.touchAction = "";
      b.removeAttribute("data-prev-overflow");
    }
  }

  function normalizeTargetId(val){
    if (!val) return "";
    if (val.charAt(0) === "#") return val.slice(1);
    return val;
  }

  function bindOneMobileNav(toggleBtn, panel){
    if (!toggleBtn || !panel) return;

    // Prevent double-binding
    if (toggleBtn.getAttribute("data-mnav-bound") === "1") return;
    toggleBtn.setAttribute("data-mnav-bound", "1");

    var main = qs(panel, ".mPanel") || panel;
    var subs = qsa(panel, ".mSub");

    function hideAllSubs(){
      for (var i = 0; i < subs.length; i++){
        subs[i].hidden = true;
      }
    }

    function showMain(){
      if (main) main.hidden = false;
      hideAllSubs();
    }

    function showSub(targetSel){
      var target = null;
      if (targetSel){
        target = qs(panel, targetSel);
      }
      if (!target) return;
      if (main) main.hidden = true;
      hideAllSubs();
      target.hidden = false;
    }

    function isOpen(){
      return panel.hidden === false || panel.getAttribute("aria-hidden") === "false" || panel.classList.contains("is-open");
    }

    function open(){
      // Remove any older classes that caused blur
      document.documentElement.classList.remove("tcfr-navOpen", "navOpen");
      document.body.classList.remove("tcfr-navOpen", "navOpen");

      panel.hidden = false;
      panel.setAttribute("aria-hidden", "false");
      toggleBtn.setAttribute("aria-expanded", "true");

      showMain();
      setScrollLock(true);
    }

    function close(){
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
      toggleBtn.setAttribute("aria-expanded", "false");

      showMain();
      setScrollLock(false);
    }

    function toggle(){
      if (isOpen()) close();
      else open();
    }

    // Toggle click
    toggleBtn.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    // Drill-down: next/back buttons
    qsa(panel, ".mNext[data-target]").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        var t = btn.getAttribute("data-target");
        if (!t) return;
        showSub(t);
      });
    });

    qsa(panel, ".mBack[data-back]").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        showMain();
      });
    });

    // Close on link click
    qsa(panel, "a[href]").forEach(function(a){
      a.addEventListener("click", function(){
        // Let navigation happen
        close();
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && isOpen()) close();
    });

    // Close if clicking outside the panel (but not the toggle)
    document.addEventListener("click", function(e){
      if (!isOpen()) return;
      var t = e.target;
      if (panel.contains(t) || toggleBtn.contains(t)) return;
      close();
    });

    // Ensure initial state
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    showMain();
  }

  function bindMobileNav(){
    // Variant A: current header markup uses button.hamburger[aria-controls]
    qsa(document, "button.hamburger[aria-controls]").forEach(function(btn){
      var id = normalizeTargetId(btn.getAttribute("aria-controls"));
      var panel = id ? document.getElementById(id) : null;
      if (panel) bindOneMobileNav(btn, panel);
    });

    // Variant B: data-nav-toggle="#mobileNav"
    qsa(document, "[data-nav-toggle]").forEach(function(btn){
      var id2 = normalizeTargetId(btn.getAttribute("data-nav-toggle"));
      var panel2 = id2 ? document.getElementById(id2) : null;
      if (panel2) bindOneMobileNav(btn, panel2);
    });

    // Variant C: older builds used .tcfr-burger + #tcfrMobilePanel
    var legacyBtn = qs(document, ".tcfr-burger");
    var legacyPanel = document.getElementById("tcfrMobilePanel");
    if (legacyBtn && legacyPanel) bindOneMobileNav(legacyBtn, legacyPanel);
  }

  function waitForHeaderAndBind(){
    var tries = 0;
    var maxTries = 60; // ~6s at 100ms
    var timer = setInterval(function(){
      tries++;
      var siteHeader = document.getElementById("siteHeader");
      // Header injection complete when it has any child elements
      if (siteHeader && siteHeader.children && siteHeader.children.length){
        clearInterval(timer);
        bindMobileNav();
        return;
      }
      // Also bind if the hamburger already exists in DOM
      if (qs(document, "button.hamburger[aria-controls], [data-nav-toggle], .tcfr-burger")){
        clearInterval(timer);
        bindMobileNav();
        return;
      }
      if (tries >= maxTries){
        clearInterval(timer);
        // Final attempt anyway
        bindMobileNav();
      }
    }, 100);
  }

  onReady(function(){
    waitForHeaderAndBind();
  });
})();
