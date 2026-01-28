(function(){
  "use strict";

  function normPath(p){
    if (!p) return "/";
    try { p = decodeURIComponent(p); } catch (e) {}
    if (p === "") return "/";
    // keep trailing slash if present, otherwise normalize to trailing slash for directory paths
    if (p.length > 1 && !p.endsWith("/")) p = p + "/";
    return p;
  }

  var EN_TO_ES = {
  "/": "/es/",
  "/rooms/": "/es/habitaciones/",
  "/rooms/panoramic-suite/": "/es/habitaciones/suite-panoramica/",
  "/rooms/sunrise-room/": "/es/habitaciones/habitacion-amanecer/",
  "/rooms/sunset-room/": "/es/habitaciones/habitacion-atardecer/",
  "/rooms/common-areas/": "/es/habitaciones/areas-comunes/",
  "/features/": "/es/caracteristicas/",
  "/features/amenities/": "/es/caracteristicas/amenidades/",
  "/features/activities/": "/es/caracteristicas/actividades/",
  "/features/attractions/": "/es/caracteristicas/atracciones/",
  "/features/produce/": "/es/caracteristicas/productos-locales/",
  "/features/flora/": "/es/caracteristicas/flora/",
  "/features/fauna/": "/es/caracteristicas/fauna/",
  "/features/choco-andino-de-pichincha/": "/es/caracteristicas/choco-andino-de-pichincha/",
  "/features/pululahua/": "/es/features/pululahua/",
  "/features/rio-guayllabamba/": "/es/features/rio-guayllabamba/",
  "/booking/": "/es/reservas/",
  "/contact/": "/es/contacto/",
  "/about/": "/es/nosotros/",
  "/blog/": "/es/blog/",
  "/gallery/": "/es/galeria/"
};
  var ES_TO_EN = {
  "/es/": "/",
  "/es/habitaciones/": "/rooms/",
  "/es/habitaciones/suite-panoramica/": "/rooms/panoramic-suite/",
  "/es/habitaciones/habitacion-amanecer/": "/rooms/sunrise-room/",
  "/es/habitaciones/habitacion-atardecer/": "/rooms/sunset-room/",
  "/es/habitaciones/areas-comunes/": "/rooms/common-areas/",
  "/es/caracteristicas/": "/features/",
  "/es/caracteristicas/amenidades/": "/features/amenities/",
  "/es/caracteristicas/actividades/": "/features/activities/",
  "/es/caracteristicas/atracciones/": "/features/attractions/",
  "/es/caracteristicas/productos-locales/": "/features/produce/",
  "/es/caracteristicas/flora/": "/features/flora/",
  "/es/caracteristicas/fauna/": "/features/fauna/",
  "/es/caracteristicas/choco-andino-de-pichincha/": "/features/choco-andino-de-pichincha/",
  "/es/features/pululahua/": "/features/pululahua/",
  "/es/features/rio-guayllabamba/": "/features/rio-guayllabamba/",
  "/es/reservas/": "/booking/",
  "/es/contacto/": "/contact/",
  "/es/nosotros/": "/about/",
  "/es/blog/": "/blog/",
  "/es/galeria/": "/gallery/"
};

  function isEs(pathname){
    return pathname.indexOf("/es/") === 0;
  }

  function mapPath(pathname, targetLang){
    pathname = normPath(pathname || "/");
    var currentIsEs = isEs(pathname);

    if (targetLang === "es"){
      if (currentIsEs) return pathname;
      return EN_TO_ES[pathname] || "/es/";
    }

    if (!currentIsEs) return pathname;
    return ES_TO_EN[pathname] || "/";
  }

  function setLangSwitchLinks(pathname){
    var enHref = mapPath(pathname, "en");
    var esHref = mapPath(pathname, "es");

    var enBtn = document.querySelector('[data-lang="en"]');
    var esBtn = document.querySelector('[data-lang="es"]');

    if (enBtn) enBtn.setAttribute("href", enHref);
    if (esBtn) esBtn.setAttribute("href", esHref);

    var current = isEs(pathname) ? "es" : "en";
    if (enBtn){
      enBtn.classList.toggle("is-active", current === "en");
      enBtn.setAttribute("aria-current", current === "en" ? "page" : "false");
    }
    if (esBtn){
      esBtn.classList.toggle("is-active", current === "es");
      esBtn.setAttribute("aria-current", current === "es" ? "page" : "false");
    }
  }

  function loadInclude(targetId, url, onDone){
    var el = document.getElementById(targetId);
    if (!el) { if (onDone) onDone(); return; }

    fetch(url, { cache: "no-store" })
      .then(function(r){ return r.text(); })
      .then(function(html){
        el.innerHTML = html;
        if (onDone) onDone();
      })
      .catch(function(){
        if (onDone) onDone();
      });
  }

  function init(){
    var pathname = normPath(location.pathname || "/");
    var headerUrl = isEs(pathname) ? "/assets/includes/header-es.html" : "/assets/includes/header.html";

    loadInclude("siteHeader", headerUrl, function(){
      setLangSwitchLinks(pathname);
    });

    loadInclude("siteFooter", "/assets/includes/footer.html");
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
