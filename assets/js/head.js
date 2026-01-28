(function(){
  "use strict";

  function normPath(p){
    if (!p) return "/";
    try{
      p = String(p);
      // drop query/hash
      p = p.split("#")[0].split("?")[0];
      // ensure leading slash
      if (p.charAt(0) !== "/") p = "/" + p;
      // normalize duplicate slashes
      p = p.replace(/\/+/g, "/");
      return p;
    }catch(e){
      return "/";
    }
  }

  // Map EN <-> ES paths (based on current sitemap)
  var EN_TO_ES = {
  "/": "/es/inicio/",
  "/index.html": "/es/inicio/",
  "/rooms/": "/es/habitaciones/",
  "/rooms/panoramic-suite/": "/es/habitaciones/suite-panoramica/",
  "/rooms/sunrise-room/": "/es/habitaciones/habitacion-amanecer/",
  "/rooms/sunset-room/": "/es/habitaciones/habitacion-atardecer/",
  "/booking/": "/es/reservas/",
  "/contact/": "/es/contacto/",
  "/features/": "/es/caracteristicas/",
  "/features/amenities/": "/es/caracteristicas/amenidades/",
  "/features/activities/": "/es/caracteristicas/actividades/",
  "/features/attractions/": "/es/caracteristicas/atracciones/",
  "/features/produce/": "/es/caracteristicas/productos-locales/",
  "/features/flora/": "/es/caracteristicas/flora/",
  "/features/fauna/": "/es/caracteristicas/fauna/",
  "/features/choco-andino-de-pichincha/": "/es/caracteristicas/choco-andino-de-pichincha/",
  "/features/rio-guayllabamba/": "/es/caracteristicas/rio-guayllabamba/",
  "/features/pululahua/": "/es/caracteristicas/pululahua/",
  "/gallery/": "/es/galeria/"
};
  var ES_TO_EN = {
  "/es/inicio/": "/index.html",
  "/es/habitaciones/": "/rooms/",
  "/es/habitaciones/suite-panoramica/": "/rooms/panoramic-suite/",
  "/es/habitaciones/habitacion-amanecer/": "/rooms/sunrise-room/",
  "/es/habitaciones/habitacion-atardecer/": "/rooms/sunset-room/",
  "/es/reservas/": "/booking/",
  "/es/contacto/": "/contact/",
  "/es/caracteristicas/": "/features/",
  "/es/caracteristicas/amenidades/": "/features/amenities/",
  "/es/caracteristicas/actividades/": "/features/activities/",
  "/es/caracteristicas/atracciones/": "/features/attractions/",
  "/es/caracteristicas/productos-locales/": "/features/produce/",
  "/es/caracteristicas/flora/": "/features/flora/",
  "/es/caracteristicas/fauna/": "/features/fauna/",
  "/es/caracteristicas/choco-andino-de-pichincha/": "/features/choco-andino-de-pichincha/",
  "/es/caracteristicas/rio-guayllabamba/": "/features/rio-guayllabamba/",
  "/es/caracteristicas/pululahua/": "/features/pululahua/",
  "/es/galeria/": "/gallery/"
};

  function isEsPath(p){
    p = normPath(p);
    return p === "/es" || p.indexOf("/es/") === 0;
  }

  function toEs(p){
    p = normPath(p);
    return EN_TO_ES[p] || (p === "/" ? "/es/inicio/" : "/es/inicio/");
  }

  function toEn(p){
    p = normPath(p);
    // direct match first
    if (ES_TO_EN[p]) return ES_TO_EN[p];
    // fallback: strip /es prefix
    if (p.indexOf("/es/") === 0){
      var stripped = p.slice(3);
      if (!stripped) stripped = "/";
      return stripped;
    }
    return "/";
  }

  function getAltPath(p){
    return isEsPath(p) ? toEn(p) : toEs(p);
  }

  // expose helpers for site.js
  window.TCFR_I18N = {
    normPath: normPath,
    isEsPath: isEsPath,
    toEs: toEs,
    toEn: toEn,
    getAltPath: getAltPath
  };
})();
