(function(){
  "use strict";

  // Detect language from URL.
  // English pages live at /..., Spanish pages live at /es/...
  var path = (window.location && window.location.pathname) ? window.location.pathname : "/";
  var pathLower = String(path || "/").toLowerCase();
  var isEs = pathLower === "/es" || pathLower.indexOf("/es/") === 0;

  // Set <html lang=""> for SEO and accessibility.
  try {
    document.documentElement.lang = isEs ? "es" : "en";
  } catch(e) {}

  // Map between EN and ES slugs.
  function ensureTrailingSlash(p){
    if (!p) return "/";
    return p.endsWith("/") ? p : (p + "/");
  }

  function normalizePath(p){
    // keep leading slash, remove query/hash (already pathname), collapse multiple slashes
    p = String(p || "/");
    if (!p.startsWith("/")) p = "/" + p;
    p = p.replace(/\/{2,}/g, "/");
    return p;
  }

  function stripEsPrefix(p){
    p = normalizePath(p);
    if (p.toLowerCase() === "/es") return "/";
    if (p.toLowerCase().indexOf("/es/") === 0) return "/" + p.slice(4);
    return p;
  }

  function addEsPrefix(p){
    p = normalizePath(p);
    if (p === "/") return "/es/";
    if (p.toLowerCase().indexOf("/es/") === 0) return ensureTrailingSlash(p);
    return "/es" + (p.startsWith("/") ? p : ("/" + p));
  }

  // Feature slug mapping (EN -> ES).
  var featureMapEnToEs = {
    "/features/": "/es/caracteristicas/",
    "/features/amenities/": "/es/caracteristicas/amenidades/",
    "/features/activities/": "/es/caracteristicas/actividades/",
    "/features/attractions/": "/es/caracteristicas/atracciones/",
    "/features/produce/": "/es/caracteristicas/productos/",
    "/features/gallery/": "/es/caracteristicas/galeria/",
    "/features/flora/": "/es/caracteristicas/flora/",
    "/features/fauna/": "/es/caracteristicas/fauna/",
    "/features/choco-andino-de-pichincha/": "/es/caracteristicas/choco-andino-de-pichincha/",
    "/features/pululahua/": "/es/caracteristicas/pululahua/",
    "/features/rio-guayllabamba/": "/es/caracteristicas/rio-guayllabamba/"
  };

  // Reverse map (ES -> EN).
  var featureMapEsToEn = {};
  Object.keys(featureMapEnToEs).forEach(function(k){
    featureMapEsToEn[featureMapEnToEs[k]] = k;
  });

  // Common top-level pages (best-effort). Adjust later if your Spanish slugs differ.
  var pageMapEnToEs = {
    "/": "/es/",
    "/rooms/": "/es/habitaciones/",
    "/booking/": "/es/reservas/",
    "/contact/": "/es/contacto/",
    "/about/": "/es/acerca/",
    "/blog/": "/es/blog/"
  };

  var pageMapEsToEn = {};
  Object.keys(pageMapEnToEs).forEach(function(k){
    pageMapEsToEn[pageMapEnToEs[k]] = k;
  });

  function mapToEs(currentPath){
    var p = ensureTrailingSlash(normalizePath(currentPath));
    // features first
    if (featureMapEnToEs[p]) return featureMapEnToEs[p];
    // top pages
    if (pageMapEnToEs[p]) return pageMapEnToEs[p];
    // fallback: prefix /es and keep rest
    return addEsPrefix(stripEsPrefix(p));
  }

  function mapToEn(currentPath){
    var p = ensureTrailingSlash(normalizePath(currentPath));
    // features first
    if (featureMapEsToEn[p]) return featureMapEsToEn[p];
    // top pages
    if (pageMapEsToEn[p]) return pageMapEsToEn[p];
    // fallback: remove /es prefix
    return ensureTrailingSlash(stripEsPrefix(p));
  }

  function setLangSwitchLinks(){
    var langBtns = document.querySelectorAll(".tcfr-langBtn[data-lang]");
    if (!langBtns || !langBtns.length) return;

    var current = ensureTrailingSlash(normalizePath(pathLower));
    var enHref = isEs ? mapToEn(current) : ensureTrailingSlash(stripEsPrefix(current));
    var esHref = isEs ? ensureTrailingSlash(addEsPrefix(current)) : mapToEs(current);

    for (var i = 0; i < langBtns.length; i++){
      var btn = langBtns[i];
      var lang = (btn.getAttribute("data-lang") || "").toLowerCase();

      if (lang === "en"){
        btn.setAttribute("href", enHref);
        btn.classList.toggle("is-active", !isEs);
        if (!isEs) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      } else if (lang === "es"){
        btn.setAttribute("href", esHref);
        btn.classList.toggle("is-active", isEs);
        if (isEs) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      }
    }
  }

  // Run after header injection (head.js is deferred; injection may happen in site.js).
  // Retry a few times in case the header arrives slightly later.
  (function retrySet(){
    var tries = 0;
    function tick(){
      tries++;
      setLangSwitchLinks();
      if (document.querySelector(".tcfr-langBtn[data-lang]") || tries >= 20) return;
      window.setTimeout(tick, 120);
    }
    tick();
  })();
})();
