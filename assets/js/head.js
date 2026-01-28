(function(){
  "use strict";

  function qs(sel, root){ return (root || document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function normalizePath(p){
    if (!p) return "/";
    try { p = decodeURIComponent(p); } catch(e) {}
    p = p.split("#")[0].split("?")[0];
    if (p[0] !== "/") p = "/" + p;
    return p;
  }

  function isSpanishPath(pathname){
    var p = normalizePath(pathname || window.location.pathname);
    return p === "/es" || p.indexOf("/es/") === 0;
  }

  function getAlternateHref(lang){
    var link = qs('link[rel="alternate"][hreflang="' + lang + '"]');
    if (link && link.getAttribute("href")) return link.getAttribute("href");

    if (lang === "en"){
      var canon = qs('link[rel="canonical"]');
      if (canon && canon.getAttribute("href")) return canon.getAttribute("href");
      return "/";
    }
    return "/es/";
  }

  function toSameOriginPath(href){
    try{
      var u = new URL(href, window.location.origin);
      return u.pathname + (u.search || "") + (u.hash || "");
    }catch(e){
      return href;
    }
  }

  function setLangActive(isEs){
    qsa(".tcfr-langBtn[data-lang]").forEach(function(a){
      var lang = a.getAttribute("data-lang");
      var active = (lang === "es") ? isEs : !isEs;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
      a.removeAttribute("aria-disabled");
    });
  }

  function wireLanguageLinks(){
    var isEs = isSpanishPath();
    setLangActive(isEs);

    qsa(".tcfr-langBtn[data-lang]").forEach(function(a){
      var lang = a.getAttribute("data-lang");
      var href = toSameOriginPath(getAlternateHref(lang));
      a.setAttribute("href", href);

      a.addEventListener("click", function(e){
        var already = (lang === "es") ? isSpanishPath() : !isSpanishPath();
        if (already){
          e.preventDefault();
          return;
        }
        e.preventDefault();
        window.location.href = href;
      });
    });
  }

  function injectIncludes(){
    var headerHost = qs("#siteHeader");
    var footerHost = qs("#siteFooter");

    var isEs = isSpanishPath();
    var headerUrl = isEs ? "/assets/includes/header-es.html" : "/assets/includes/header.html";

    function fetchInto(url, host){
      if (!host) return Promise.resolve();
      return fetch(url, { cache: "no-store" })
        .then(function(r){ return r.ok ? r.text() : ""; })
        .then(function(markup){
          if (!markup) return;
          host.innerHTML = markup;
          if (host && host.id === "siteHeader"){
            try{ document.dispatchEvent(new CustomEvent("tcfr:header-ready")); }catch(e){}
            if (window.TCFR_bindHeader) { try{ window.TCFR_bindHeader(); }catch(e){} }
          }
        })
        .catch(function(){});
    }

    return fetchInto(headerUrl, headerHost)
      .then(function(){
        return fetchInto("/assets/includes/footer.html", footerHost);
      })
      .then(function(){
        wireLanguageLinks();
        if (window.TCFR_bindHeader) { try{ window.TCFR_bindHeader(); }catch(e){} }
      });
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", injectIncludes);
  }else{
    injectIncludes();
  }
})();
