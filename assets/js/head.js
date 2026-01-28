/* assets/js/head.js
   Language + header helpers for TCFR
   - Injects correct EN/ES header include (already handled by includes.js if present)
   - Keeps EN/ES switch working and sets active state
*/
(function(){
  "use strict";

  function normPath(p){
    p = (p || "/").trim();
    // strip query/hash if accidentally passed
    p = p.split("?")[0].split("#")[0];
    // ensure leading slash
    if (p.charAt(0) !== "/") p = "/" + p;
    // remove index.html
    p = p.replace(/index\.html$/i, "");
    // collapse multiple slashes
    p = p.replace(/\/{2,}/g, "/");
    // ensure trailing slash for "directory" paths
    if (!/\.[a-z0-9]+$/i.test(p) && p.slice(-1) !== "/") p += "/";
    return p;
  }

  function isSpanishPath(pathname){
    return /^\/es(\/|$)/i.test(pathname || "");
  }

  // EN -> ES routes (canonical slugs from sitemap)
  var ROUTES = {
    "/": "/es/",

    "/about/": "/es/sobre-nosotros/",
    "/contact/": "/es/contacto/",
    "/booking/": "/es/reservas/",

    "/rooms/": "/es/habitaciones/",
    "/rooms/panoramic-suite/": "/es/habitaciones/suite-panoramica/",
    "/rooms/sunrise-room/": "/es/habitaciones/habitacion-amanecer/",
    "/rooms/sunset-room/": "/es/habitaciones/habitacion-atardecer/",
    "/rooms/common-areas/": "/es/habitaciones/areas-comunes/",

    "/features/": "/es/caracteristicas/",
    "/features/activities/": "/es/caracteristicas/actividades/",
    // keep both spellings in case one exists in production
    "/features/amenities/": "/es/caracteristicas/amenidades/",
    "/features/ammenities/": "/es/caracteristicas/amenidades/",
    "/features/attractions/": "/es/caracteristicas/atracciones/",
    "/features/choco-andino-de-pichincha/": "/es/caracteristicas/choco-andino-de-pichincha/",
    "/features/fauna/": "/es/caracteristicas/fauna/",
    "/features/flora/": "/es/caracteristicas/flora/",
    "/features/produce/": "/es/caracteristicas/productos-locales/",
    "/features/pululahua/": "/es/caracteristicas/pululahua/",
    "/features/rio-guayllabamba/": "/es/caracteristicas/rio-guayllabamba/",

    "/gallery/": "/es/caracteristicas/galeria/",

    "/privacy-policy/": "/es/politica-de-privacidad/",
    "/terms-of-service/": "/es/terminos-de-servicio/"
  };

  // ES -> EN reverse map
  var REV = {};
  (function(){
    for (var k in ROUTES){
      if (!Object.prototype.hasOwnProperty.call(ROUTES, k)) continue;
      REV[ROUTES[k]] = k;
    }
  })();

  function getCounterpart(pathname, targetLang){
    var p = normPath(pathname);

    if (targetLang === "es"){
      // already ES
      if (isSpanishPath(p)) return p;
      return ROUTES[p] || (p === "/" ? "/es/" : "/es/");
    }

    // target EN
    if (!isSpanishPath(p)) return p;
    return REV[p] || "/";
  }

  function setLangSwitch(){
    var enLink = document.getElementById("langEn");
    var esLink = document.getElementById("langEs");
    if (!enLink || !esLink) return;

    var here = normPath(window.location.pathname);
    var lang = isSpanishPath(here) ? "es" : "en";

    var enTarget = getCounterpart(here, "en");
    var esTarget = getCounterpart(here, "es");

    // always provide usable hrefs (no "#")
    enLink.setAttribute("href", enTarget);
    esLink.setAttribute("href", esTarget);

    // active styles
    enLink.classList.toggle("is-active", lang === "en");
    esLink.classList.toggle("is-active", lang === "es");
    if (lang === "en"){
      enLink.setAttribute("aria-current", "page");
      esLink.removeAttribute("aria-current");
    } else {
      esLink.setAttribute("aria-current", "page");
      enLink.removeAttribute("aria-current");
    }

    // JS-driven navigation to ensure we never land on "/#"
    enLink.addEventListener("click", function(e){
      e.preventDefault();
      window.location.href = enTarget;
    });

    esLink.addEventListener("click", function(e){
      e.preventDefault();
      window.location.href = esTarget;
    });
  }

  // Run after header is injected
  function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    setLangSwitch();
  });

  // If your include loader dispatches an event, react to it as well
  document.addEventListener("tcfr:header:loaded", function(){
    setLangSwitch();
  });
})();
