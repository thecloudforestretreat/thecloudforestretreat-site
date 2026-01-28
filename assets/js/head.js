/* /assets/js/head.js
   Loads the correct header include (EN or ES) + footer include, then wires up language switch URLs.
   ASCII-only.
*/
(function(){
  "use strict";

  function $(sel, root){ return (root || document).querySelector(sel); }

  function normalizePath(p){
    if (!p) return "/";
    // strip query/hash
    p = p.split("?")[0].split("#")[0];
    // ensure leading slash
    if (p.charAt(0) !== "/") p = "/" + p;
    // normalize double slashes
    p = p.replace(/\/{2,}/g, "/");
    // ensure trailing slash for folder-like paths (no file extension)
    if (!/\.[a-z0-9]+$/i.test(p) && p.slice(-1) !== "/") p += "/";
    return p;
  }

  function isSpanishPath(pathname){
    var p = (pathname || "").toLowerCase();
    return p === "/es" || p.indexOf("/es/") === 0;
  }

  // Mapping based on your sitemap slugs.
  // Add more pairs here if you add more pages later.
  var EN_TO_ES = {
    "/": "/es/",
    "/about/": "/es/sobre/",
    "/contact/": "/es/contacto/",
    "/blog/": "/es/blog/",
    "/rooms/": "/es/habitaciones/",
    "/features/": "/es/caracteristicas/",
    "/features/amenities/": "/es/caracteristicas/amenidades/",
    "/features/activities/": "/es/caracteristicas/actividades/",
    "/features/attractions/": "/es/caracteristicas/atracciones/",
    "/features/produce/": "/es/caracteristicas/productos/",
    "/features/flora/": "/es/caracteristicas/flora/",
    "/features/fauna/": "/es/caracteristicas/fauna/",
    "/features/choco-andino-de-pichincha/": "/es/caracteristicas/choco-andino-de-pichincha/",
    "/features/pululahua/": "/es/caracteristicas/pululahua/",
    "/features/rio-guayllabamba/": "/es/caracteristicas/rio-guayllabamba/",
    "/gallery/": "/es/caracteristicas/galeria/"
  };

  var ES_TO_EN = {};
  (function(){
    var k;
    for (k in EN_TO_ES){
      if (Object.prototype.hasOwnProperty.call(EN_TO_ES, k)){
        ES_TO_EN[EN_TO_ES[k]] = k;
      }
    }
  })();

  function toSpanish(pathname){
    var p = normalizePath(pathname);
    if (isSpanishPath(p)) return p;
    return EN_TO_ES[p] || "/es/";
  }

  function toEnglish(pathname){
    var p = normalizePath(pathname);
    if (!isSpanishPath(p)) return p;
    // normalize "/es/" and deeper
    if (p === "/es/" || p === "/es") return "/";
    return ES_TO_EN[p] || "/";
  }

  function fetchInto(el, url){
    return fetch(url, { cache: "no-store" })
      .then(function(r){
        if (!r.ok) throw new Error("Fetch failed: " + r.status);
        return r.text();
      })
      .then(function(html){
        el.innerHTML = html;
        return el;
      });
  }

  function setLangSwitch(root, lang){
    // Desktop switch
    var langWrap = $(".tcfr-lang", root);
    // Mobile switch
    var mLangWrap = $(".tcfr-mLang", root);

    function apply(wrap){
      if (!wrap) return;
      var en = wrap.querySelector('[data-lang="en"]');
      var es = wrap.querySelector('[data-lang="es"]');

      var here = normalizePath(window.location.pathname);

      if (en){
        en.href = toEnglish(here);
        en.classList.toggle("is-active", lang === "en");
        if (lang === "en") en.setAttribute("aria-current", "page");
        else en.removeAttribute("aria-current");
      }

      if (es){
        es.href = toSpanish(here);
        es.classList.toggle("is-active", lang === "es");
        if (lang === "es") es.setAttribute("aria-current", "page");
        else es.removeAttribute("aria-current");
      }
    }

    apply(langWrap);
    apply(mLangWrap);
  }

  function init(){
    var headerHost = document.getElementById("siteHeader");
    var footerHost = document.getElementById("siteFooter");

    var lang = isSpanishPath(window.location.pathname) ? "es" : "en";

    var headerUrl = lang === "es"
      ? "/assets/includes/header-es.html"
      : "/assets/includes/header.html";

    var tasks = [];

    if (headerHost && !headerHost.getAttribute("data-injected")){
      tasks.push(
        fetchInto(headerHost, headerUrl).then(function(){
          headerHost.setAttribute("data-injected", "1");
          setLangSwitch(headerHost, lang);
        })
      );
    } else if (headerHost){
      // If already injected, still ensure lang links are correct.
      setLangSwitch(headerHost, lang);
    }

    if (footerHost && !footerHost.getAttribute("data-injected")){
      tasks.push(
        fetchInto(footerHost, "/assets/includes/footer.html").then(function(){
          footerHost.setAttribute("data-injected", "1");
        })
      );
    }

    return Promise.all(tasks);
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
