/* assets/js/site.js
   TCFR site interactions:
   - Desktop dropdown nav (Rooms, Features)
   - Mobile hamburger menu + drill-down submenus

   Markup expected (from your deployed header include):
     - Desktop dropdown buttons: button[data-dd] + menu div[data-dd-menu="<key>"][hidden]
     - Mobile: button.hamburger controls nav#mobileNav[hidden]
       - Main list container: .mPanel
       - Submenus: .mSub (each has id like "m-rooms", "m-features") and [hidden]
       - Drilldown triggers: button.mNext[data-target="#m-rooms"]
       - Back buttons: button.mBack[data-back]
*/

(function(){
  "use strict";

  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function isMobileNavOpen(nav){
    return !!nav && !nav.hasAttribute("hidden");
  }

  function setHidden(el, hidden){
    if (!el) return;
    if (hidden) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  function initDesktopDropdowns(){
    var btns = qa('button[data-dd]');
    if (!btns.length) return;

    function closeAll(exceptKey){
      for (var i = 0; i < btns.length; i++){
        var b = btns[i];
        var key = b.getAttribute("data-dd");
        var menu = q('[data-dd-menu="' + key + '"]');
        var keep = (exceptKey && key === exceptKey);
        b.setAttribute("aria-expanded", keep ? "true" : "false");
        setHidden(menu, !keep);
      }
    }

    function toggle(key){
      var b = q('button[data-dd="' + key + '"]');
      var menu = q('[data-dd-menu="' + key + '"]');
      if (!b || !menu) return;

      var isOpen = b.getAttribute("aria-expanded") === "true" && !menu.hasAttribute("hidden");
      if (isOpen) closeAll(null);
      else closeAll(key);
    }

    for (var i = 0; i < btns.length; i++){
      (function(){
        var b = btns[i];
        var key = b.getAttribute("data-dd");
        b.addEventListener("click", function(e){
          e.preventDefault();
          e.stopPropagation();
          toggle(key);
        });
      })();
    }

    document.addEventListener("click", function(e){
      // Close if clicking outside any dropdown menu or button
      var inside = false;
      for (var i = 0; i < btns.length; i++){
        var b = btns[i];
        var key = b.getAttribute("data-dd");
        var menu = q('[data-dd-menu="' + key + '"]');
        if ((b && b.contains(e.target)) || (menu && menu.contains(e.target))){
          inside = true;
          break;
        }
      }
      if (!inside) closeAll(null);
    }, { passive: true });

    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") closeAll(null);
    });
  }

  function initMobileMenu(){
    var burger = q("button.hamburger");
    var nav = q("#mobileNav");
    if (!burger || !nav) return;

    var panel = q(".mPanel", nav);
    var subs = qa(".mSub", nav);

    function showPanel(){
      if (panel) setHidden(panel, false);
      for (var i = 0; i < subs.length; i++) setHidden(subs[i], true);
    }

    function openNav(){
      setHidden(nav, false);
      burger.setAttribute("aria-expanded", "true");
      showPanel();
      document.documentElement.classList.add("navOpen");
    }

    function closeNav(){
      setHidden(nav, true);
      burger.setAttribute("aria-expanded", "false");
      showPanel();
      document.documentElement.classList.remove("navOpen");
    }

    function toggleNav(){
      if (isMobileNavOpen(nav)) closeNav();
      else openNav();
    }

    burger.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      toggleNav();
    });

    // Drill-down handlers
    var nextBtns = qa("button.mNext[data-target]", nav);
    for (var i = 0; i < nextBtns.length; i++){
      nextBtns[i].addEventListener("click", function(e){
        e.preventDefault();
        var targetSel = this.getAttribute("data-target");
        if (!targetSel) return;
        var target = q(targetSel, nav) || q(targetSel);
        if (!target) return;

        if (panel) setHidden(panel, true);
        for (var j = 0; j < subs.length; j++) setHidden(subs[j], true);
        setHidden(target, false);
      });
    }

    var backBtns = qa("button.mBack[data-back]", nav);
    for (var k = 0; k < backBtns.length; k++){
      backBtns[k].addEventListener("click", function(e){
        e.preventDefault();
        showPanel();
      });
    }

    // Close when clicking any link in the mobile nav
    nav.addEventListener("click", function(e){
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      closeNav();
    });

    // Close on Escape
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") closeNav();
    });

    // Close if resizing up to desktop
    window.addEventListener("resize", function(){
      if (window.innerWidth > 900) closeNav();
    }, { passive: true });

    // Click outside to close (only when open)
    document.addEventListener("click", function(e){
      if (!isMobileNavOpen(nav)) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeNav();
    }, { passive: true });

    // Start closed
    closeNav();
  }

  document.addEventListener("DOMContentLoaded", function(){
    initDesktopDropdowns();
    initMobileMenu();
  });
})();
