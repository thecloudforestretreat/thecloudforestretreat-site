(function(){
  "use strict";

  // TCFR language switch + header/footer include loader.
  // Assumptions:
  // - English pages live at /...
  // - Spanish pages live at /es/...
  // - Header includes:
  //     /assets/includes/header.html
  //     /assets/includes/header-es.html
  // - Footer include (agnostic):
  //     /assets/includes/footer.html

  var LANG_MAP = {
    "/": "/es/",
    "/booking/": "/es/reservas/",
    "/rooms/": "/es/habitaciones/",
    "/rooms/panoramic-suite/": "/es/habitaciones/suite-panoramica/",
    "/rooms/mountain-suite/": "/es/habitaciones/habitacion-amanecer/",
    "/rooms/forest-suite/": "/es/habitaciones/habitacion-atardecer/",
    "/features/": "/es/caracteristicas/",
    "/features/ammenities/": "/es/caracteristicas/amenidades/",
    "/features/amenities/": "/es/caracteristicas/amenidades/",
    "/features/activities/": "/es/caracteristicas/actividades/",
    "/features/attractions/": "/es/caracteristicas/atracciones/",
    "/features/produce/": "/es/caracteristicas/productos/",
    "/features/flora/": "/es/caracteristicas/flora/",
    "/features/fauna/": "/es/caracteristicas/fauna/",
    "/features/choco-andino-de-pichincha/": "/es/caracteristicas/choco-andino-de-pichincha/",
    "/features/pululahua/": "/es/caracteristicas/pululahua/",
    "/features/rio-guayllabamba/": "/es/caracteristicas/rio-guayllabamba/",
    "/gallery/": "/es/galeria/",
    "/about/": "/es/nosotros/",
    "/contact/": "/es/contacto/",
    "/blog/": "/es/blog/"
  };

  // Build reverse map
  var REV_MAP = {};
  (function(){
    var k;
    for (k in LANG_MAP){
      if (!Object.prototype.hasOwnProperty.call(LANG_MAP, k)) continue;
      REV_MAP[LANG_MAP[k]] = k;
    }
  })();

  function normalizePath(p){
    if (!p) return "/";
    // strip origin if present
    p = String(p);
    var i = p.indexOf("://");
    if (i !== -1){
      try { p = new URL(p).pathname; } catch(e) {}
    }
    // remove hash/query if included
    p = p.split("#")[0].split("?")[0];
    if (p === "") p = "/";
    if (p[0] !== "/") p = "/" + p;
    if (p.length > 1 && p[p.length - 1] !== "/") p += "/";
    return p;
  }

  function isSpanishPath(p){
    return p === "/es/" || p.indexOf("/es/") === 0;
  }

  function toSpanishPath(enPath){
    enPath = normalizePath(enPath);
    if (LANG_MAP[enPath]) return LANG_MAP[enPath];
    // fallback: prefix, but keep sane
    if (enPath === "/") return "/es/";
    return "/es" + enPath;
  }

  function toEnglishPath(esPath){
    esPath = normalizePath(esPath);
    if (REV_MAP[esPath]) return REV_MAP[esPath];
    if (esPath === "/es/") return "/";
    if (esPath.indexOf("/es/") === 0) return esPath.slice(3); // drop "/es"
    return "/";
  }

  function setLangLinks(){
    var path = normalizePath(window.location.pathname);
    var onEs = isSpanishPath(path);

    var enHref = onEs ? toEnglishPath(path) : path;
    var esHref = onEs ? path : toSpanishPath(path);

    var enBtns = document.querySelectorAll('a[data-lang="en"]');
    var esBtns = document.querySelectorAll('a[data-lang="es"]');

    for (var i = 0; i < enBtns.length; i++){
      enBtns[i].setAttribute("href", enHref);
      enBtns[i].classList.toggle("is-active", !onEs);
      enBtns[i].setAttribute("aria-current", !onEs ? "page" : "false");
    }
    for (var j = 0; j < esBtns.length; j++){
      esBtns[j].setAttribute("href", esHref);
      esBtns[j].classList.toggle("is-active", onEs);
      esBtns[j].setAttribute("aria-current", onEs ? "page" : "false");
    }
  }

  function injectInclude(targetId, url){
    var el = document.getElementById(targetId);
    if (!el) return;

    fetch(url, { cache: "no-store" })
      .then(function(r){ return r.ok ? r.text() : ""; })
      .then(function(html){
        if (!html) return;
        el.innerHTML = html;
        setLangLinks();
      })
      .catch(function(){});
  }

  function bootIncludes(){
    var path = normalizePath(window.location.pathname);
    var headerUrl = isSpanishPath(path) ? "/assets/includes/header-es.html" : "/assets/includes/header.html";
    injectInclude("siteHeader", headerUrl);
    injectInclude("siteFooter", "/assets/includes/footer.html");
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){
      bootIncludes();
      setLangLinks();
    });
  } else {
    bootIncludes();
    setLangLinks();
  }
})();
