/* /assets/js/head.js
   Head-only hooks for TCFR.
   - Inject header/footer includes
   - Activate EN/ES language switch
*/
(function () {
  "use strict";

  function normalizePath(p){
    if (!p) return "/";
    p = p.replace(/\/{2,}/g, "/");
    if (p.charAt(0) !== "/") p = "/" + p;
    return p;
  }

  function isSpanishPath(pathname){
    return /^\/es(\/|$)/i.test(pathname || "");
  }

  var ROUTES = {
    "/": "/es/",
    "/contact/": "/es/contacto/",
    "/booking/": "/es/reservas/",
    "/rooms/": "/es/habitaciones/",
    "/rooms/panoramic-suite/": "/es/habitaciones/suite-panoramica/",
    "/rooms/mountain-suite/": "/es/habitaciones/suite-de-montana/",
    "/rooms/forest-suite/": "/es/habitaciones/suite-del-bosque/",

    "/features/": "/es/caracteristicas/",
    "/features/amenities/": "/es/caracteristicas/amenidades/",
    "/features/activities/": "/es/caracteristicas/actividades/",
    "/features/attractions/": "/es/caracteristicas/atracciones/",
    "/features/produce/": "/es/caracteristicas/productos/",
    "/features/flora/": "/es/caracteristicas/flora/",
    "/features/fauna/": "/es/caracteristicas/fauna/",
    "/features/choco-andino-de-pichincha/": "/es/caracteristicas/choco-andino-de-pichincha/",
    "/features/pululahua/": "/es/features/pululahua/",
    "/features/rio-guayllabamba/": "/es/features/rio-guayllabamba/",
    "/gallery/": "/es/galeria/"
  };

  var ROUTES_REV = {};
  (function(){
    for (var k in ROUTES){
      if (!Object.prototype.hasOwnProperty.call(ROUTES, k)) continue;
      ROUTES_REV[ROUTES[k]] = k;
    }
  })();

  function getAltPath(pathname, toLang){
    var p = normalizePath(pathname || "/");
    if (p.length > 1 && p.charAt(p.length - 1) !== "/") p = p + "/";

    var fromIsEs = isSpanishPath(p);

    if (toLang === "es"){
      if (fromIsEs) return p;
      if (ROUTES[p]) return ROUTES[p];
      return "/es" + (p === "/" ? "/" : p);
    }

    if (!fromIsEs) return p;
    if (ROUTES_REV[p]) return ROUTES_REV[p];
    return p.replace(/^\/es/i, "") || "/";
  }

  function setLangSwitchLinks(){
    var enBtn = document.getElementById("langEn");
    var esBtn = document.getElementById("langEs");
    if (!enBtn || !esBtn) return;

    var path = normalizePath(window.location.pathname || "/");
    if (path.length > 1 && path.charAt(path.length - 1) !== "/") path += "/";

    var onEs = isSpanishPath(path);

    var enHref = getAltPath(path, "en");
    var esHref = getAltPath(path, "es");

    enBtn.setAttribute("href", enHref);
    esBtn.setAttribute("href", esHref);

    enBtn.classList.toggle("is-active", !onEs);
    esBtn.classList.toggle("is-active", onEs);

    enBtn.setAttribute("aria-current", !onEs ? "page" : "false");
    esBtn.setAttribute("aria-current", onEs ? "page" : "false");

    enBtn.style.pointerEvents = "auto";
    esBtn.style.pointerEvents = "auto";
  }

  function fetchText(url){
    return fetch(url, { cache: "no-store" }).then(function(r){
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    });
  }

  function inject(selector, html){
    var el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = html;
  }

  function initIncludes(){
    var path = normalizePath(window.location.pathname || "/");
    var useEs = isSpanishPath(path);

    var headerUrl = useEs ? "/assets/includes/header-es.html" : "/assets/includes/header.html";
    var footerUrl = "/assets/includes/footer.html";

    fetchText(headerUrl)
      .then(function(html){
        inject("#siteHeader", html);
        setLangSwitchLinks();
      })
      .catch(function(){
        setLangSwitchLinks();
      });

    fetchText(footerUrl)
      .then(function(html){
        inject("#siteFooter", html);
      })
      .catch(function(){});
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initIncludes);
  } else {
    initIncludes();
  }
})();
