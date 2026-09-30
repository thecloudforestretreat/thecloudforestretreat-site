import {render} from './build_feature_batch.mjs';

const pairs = {
  flora: {
    en: {
      path: '/features/flora/', alt: '/es/caracteristicas/flora/', name: 'Cloud Forest Flora',
      title: 'Cloud Forest Flora in Ecuador | Plants Near Quito',
      description: 'Explore cloud forest flora around The Cloud Forest Retreat, including bromeliads, native trees and seasonal plants, with responsible observation guidance.',
      home: '/', book: '/booking/', contact: '/contact/', hero: 'flora/tcfr_features_flora_hero.jpg',
      kicker: 'Read the forest through its plants',
      lead: 'Moisture, elevation and light shape the plant life around the retreat. Notice forest layers and seasonal changes while staying on appropriate paths and leaving every plant where it grows.',
      facts: [['Forest layers', 'Canopy, understory and ground'], ['Seasonal change', 'Flowers and fruit vary'], ['Care', 'Observe without collecting']],
      intro: 'Notice relationships, not just species',
      introText: 'Plants create shelter, food and moisture for the wider ecosystem. A slow walk can reveal how trees, epiphytes, flowers and insects connect, even when individual species are difficult to identify.',
      cards: [
        ['Bromeliads', 'Plants adapted to humid forest conditions', 'Look for their shapes and water-holding leaves without touching or removing them.', 'flora/tcfr_features_flora_bromelias.jpg', '/cloud-forest-ecuador/'],
        ['Algarrobo', 'A resilient tree with ecological value', 'Local names and species identification can vary, so use a knowledgeable guide for certainty.', 'flora/tcfr_features_flora_algarrobo.jpg', '/cloud-forest-hiking-ecuador/'],
        ['Campeche', 'Flowers and structure within the landscape', 'Appreciate plants visually and avoid assuming that an unfamiliar species is edible or medicinal.', 'flora/tcfr_features_flora_campeche.jpg', '/features/choco-andino-de-pichincha/'],
        ['Guayabilla', 'Fruit and habitat change with the season', 'Availability and wildlife activity around fruiting plants are never guaranteed.', 'flora/tcfr_features_flora_guayabilla.jpg', '/features/fauna/']
      ],
      faqs: [
        ['What plants can guests see near the retreat?', 'The landscape can include native and cultivated trees, bromeliads, flowering plants and other cloud forest vegetation. What is visible varies by route and season.'],
        ['Are orchids or flowers always blooming?', 'No. Flowering depends on species, season, elevation, rainfall and recent weather, so a particular bloom cannot be guaranteed.'],
        ['Can guests collect plants or fruit?', 'Do not collect wild plants. Ask the host before touching or harvesting anything cultivated, because availability and permission vary.'],
        ['How can I explore the flora responsibly?', 'Stay on suitable paths, avoid damaging leaves or roots, do not remove specimens and use local guidance when identification matters.']
      ],
      related: [['Cloud Forest Ecuador', '/cloud-forest-ecuador/'], ['Cloud forest hiking', '/cloud-forest-hiking-ecuador/'], ['Fauna', '/features/fauna/'], ['Booking', '/booking/']]
    },
    es: {
      path: '/es/caracteristicas/flora/', alt: '/features/flora/', name: 'Flora del Bosque Nublado',
      title: 'Flora del Bosque Nublado de Ecuador | Cerca de Quito',
      description: 'Explora la flora alrededor de The Cloud Forest Retreat: bromelias, árboles nativos y plantas estacionales, con orientación para observar responsablemente.',
      home: '/es/', book: '/es/reservas/', contact: '/es/contacto/', hero: 'flora/tcfr_features_flora_hero.jpg',
      kicker: 'Lee el bosque a través de sus plantas',
      lead: 'La humedad, elevación y luz definen la vegetación alrededor del refugio. Observa las capas del bosque y sus cambios estacionales sin salir de rutas apropiadas ni retirar plantas.',
      facts: [['Capas del bosque', 'Dosel, sotobosque y suelo'], ['Cambios estacionales', 'Flores y frutos varían'], ['Cuidado', 'Observa sin recolectar']],
      intro: 'Observa relaciones, no solo especies',
      introText: 'Las plantas crean refugio, alimento y humedad para el ecosistema. Una caminata lenta permite ver cómo árboles, epífitas, flores e insectos se relacionan, incluso sin identificar cada especie.',
      cards: [
        ['Bromelias', 'Plantas adaptadas a la humedad del bosque', 'Observa sus formas y hojas que retienen agua sin tocarlas ni retirarlas.', 'flora/tcfr_features_flora_bromelias.jpg', '/es/bosque-nublado-ecuador/'],
        ['Algarrobo', 'Un árbol resistente con valor ecológico', 'Los nombres locales y la identificación pueden variar; consulta a un guía para mayor certeza.', 'flora/tcfr_features_flora_algarrobo.jpg', '/es/senderismo-bosque-nublado-ecuador/'],
        ['Campeche', 'Flores y estructura dentro del paisaje', 'Aprecia las plantas visualmente y no asumas que una especie desconocida es comestible o medicinal.', 'flora/tcfr_features_flora_campeche.jpg', '/es/caracteristicas/choco-andino-de-pichincha/'],
        ['Guayabilla', 'Frutos y hábitat cambian con la temporada', 'La disponibilidad y actividad de fauna alrededor de los frutos nunca están garantizadas.', 'flora/tcfr_features_flora_guayabilla.jpg', '/es/caracteristicas/fauna/']
      ],
      faqs: [
        ['¿Qué plantas pueden ver los huéspedes cerca del refugio?', 'El paisaje puede incluir árboles nativos y cultivados, bromelias, flores y otra vegetación de bosque nublado. Lo visible varía según ruta y temporada.'],
        ['¿Siempre hay orquídeas o flores?', 'No. La floración depende de la especie, temporada, elevación, lluvia y clima reciente; no se puede garantizar una flor particular.'],
        ['¿Los huéspedes pueden recolectar plantas o frutos?', 'No recolectes plantas silvestres. Consulta al anfitrión antes de tocar o cosechar algo cultivado, porque la disponibilidad y el permiso varían.'],
        ['¿Cómo puedo explorar la flora responsablemente?', 'Usa rutas apropiadas, evita dañar hojas o raíces, no retires ejemplares y busca orientación local cuando la identificación sea importante.']
      ],
      related: [['Bosque nublado de Ecuador', '/es/bosque-nublado-ecuador/'], ['Senderismo en bosque nublado', '/es/senderismo-bosque-nublado-ecuador/'], ['Fauna', '/es/caracteristicas/fauna/'], ['Reservas', '/es/reservas/']]
    }
  },
  gallery: {
    en: {
      path: '/features/gallery/', alt: '/es/caracteristicas/galeria/', name: 'Cloud Forest Retreat Gallery',
      title: 'Cloud Forest Retreat Gallery | Rooms, Views & Nature',
      description: 'Browse real rooms, shared spaces, cloud forest views and nature scenes from The Cloud Forest Retreat near Quito, then compare rooms and plan your stay.',
      home: '/', book: '/booking/', contact: '/contact/', hero: '../gallery/tcfr_gallery_hero.jpg',
      kicker: 'See the stay before you choose',
      lead: 'Explore real images of the retreat and its immediate landscape. Use them to compare atmosphere and spaces, then review the room pages for current layouts, bathroom arrangements and inclusions.',
      facts: [['Real property', 'Retreat and nearby landscape'], ['Room context', 'Compare dedicated room pages'], ['Conditions', 'Light and weather naturally change']],
      intro: 'Rooms, views and nature in context',
      introText: 'Images help you understand the character of the stay, but they do not replace practical details. Follow the links to compare rooms, shared areas and the wider cloud forest setting.',
      cards: [
        ['Retreat in the valley', 'See the property within its mountain setting', 'Clouds, visibility and light change throughout the day.', '../gallery/tcfr_gallery_07.jpg', '/cloud-forest-lodge-near-quito/'],
        ['Property details', 'Gardens and architecture shape the arrival', 'Review the dedicated room pages for interior layouts and bathrooms.', '../gallery/tcfr_gallery_05.jpg', '/rooms/'],
        ['Guest moments', 'A personal stay in a real place', 'The retreat supports small groups and quiet time together.', '../gallery/tcfr_gallery_03.jpg', '/about/'],
        ['Forest exploration', 'Dense vegetation rewards slower attention', 'Use suitable routes and respect the surrounding habitat.', '../gallery/tcfr_gallery_09.jpg', '/cloud-forest-hiking-ecuador/'],
        ['Changing weather', 'Mist and sun shape every view', 'Bring flexible expectations and suitable layers.', '../gallery/tcfr_gallery_06.jpg', '/blog/best-time-to-visit-cloud-forest/'],
        ['Horseback riding', 'A coordinated outdoor activity', 'Confirm providers, experience requirements, weather and timing first.', '../gallery/tcfr_gallery_02.jpg', '/features/activities/']
      ],
      faqs: [
        ['Are these photos from the retreat?', 'The gallery presents the retreat and its immediate landscape. Individual views, vegetation, light and weather naturally change over time.'],
        ['Which room appears in each image?', 'Use the linked room pages to compare the Panoramic Suite, Sunrise Room and Sunset Room, including their current layouts and bathroom arrangements.'],
        ['Will the weather look the same during my stay?', 'No. Cloud forest light, mist, rain and visibility can change quickly by season, day and hour.'],
        ['Can I use these images to choose a room?', 'Yes, as visual context. Confirm current room details, occupancy, inclusions and availability on the room and booking pages before deciding.']
      ],
      related: [['Rooms', '/rooms/'], ['Booking', '/booking/'], ['Cloud Forest Lodge Near Quito', '/cloud-forest-lodge-near-quito/'], ['Common Areas', '/rooms/common-areas/']]
    },
    es: {
      path: '/es/caracteristicas/galeria/', alt: '/features/gallery/', name: 'Galería del Refugio',
      title: 'Galería del Refugio | Habitaciones, Vistas y Naturaleza',
      description: 'Mira habitaciones reales, espacios compartidos, vistas y naturaleza de The Cloud Forest Retreat cerca de Quito; compara opciones y planifica tu estadía.',
      home: '/es/', book: '/es/reservas/', contact: '/es/contacto/', hero: '../gallery/tcfr_gallery_hero.jpg',
      kicker: 'Conoce la estadía antes de elegir',
      lead: 'Explora imágenes reales del refugio y su paisaje inmediato. Úsalas para comparar ambientes y espacios; luego revisa cada habitación para confirmar distribución, baños e inclusiones.',
      facts: [['Propiedad real', 'Refugio y paisaje cercano'], ['Contexto de cuartos', 'Compara páginas específicas'], ['Condiciones', 'La luz y el clima cambian']],
      intro: 'Habitaciones, vistas y naturaleza en contexto',
      introText: 'Las imágenes ayudan a comprender el carácter de la estadía, pero no reemplazan los detalles prácticos. Sigue los enlaces para comparar habitaciones, áreas comunes y el entorno.',
      cards: [
        ['Refugio en el valle', 'La propiedad dentro de su entorno montañoso', 'Las nubes, visibilidad y luz cambian durante el día.', '../gallery/tcfr_gallery_07.jpg', '/es/lodge-bosque-nublado-cerca-de-quito/'],
        ['Detalles de la propiedad', 'Los jardines y la arquitectura definen la llegada', 'Revisa cada habitación para conocer interiores y baños.', '../gallery/tcfr_gallery_05.jpg', '/es/habitaciones/'],
        ['Momentos de huéspedes', 'Una estadía personal en un lugar real', 'El refugio ofrece espacio para grupos pequeños y tiempo tranquilo.', '../gallery/tcfr_gallery_03.jpg', '/es/sobre-nosotros/'],
        ['Exploración del bosque', 'La vegetación densa recompensa una mirada lenta', 'Usa rutas adecuadas y respeta el hábitat.', '../gallery/tcfr_gallery_09.jpg', '/es/senderismo-bosque-nublado-ecuador/'],
        ['Clima cambiante', 'La neblina y el sol definen cada vista', 'Lleva expectativas flexibles y capas adecuadas.', '../gallery/tcfr_gallery_06.jpg', '/es/blog/mejor-epoca-visitar-bosque-nublado/'],
        ['Cabalgatas', 'Una actividad al aire libre coordinada', 'Confirma proveedores, experiencia requerida, clima y horarios.', '../gallery/tcfr_gallery_02.jpg', '/es/caracteristicas/actividades/']
      ],
      faqs: [
        ['¿Estas fotos son del refugio?', 'La galería presenta el refugio y su paisaje inmediato. Las vistas, vegetación, luz y clima cambian naturalmente con el tiempo.'],
        ['¿Qué habitación aparece en cada imagen?', 'Usa las páginas enlazadas para comparar la Suite Panorámica, Habitación Amanecer y Habitación Atardecer, con su distribución y baños actuales.'],
        ['¿El clima se verá igual durante mi estadía?', 'No. La luz, neblina, lluvia y visibilidad del bosque nublado pueden cambiar rápidamente según temporada, día y hora.'],
        ['¿Puedo usar las imágenes para elegir habitación?', 'Sí, como contexto visual. Confirma detalles actuales, capacidad, inclusiones y disponibilidad en las páginas de habitaciones y reservas.']
      ],
      related: [['Habitaciones', '/es/habitaciones/'], ['Reservas', '/es/reservas/'], ['Lodge de bosque nublado cerca de Quito', '/es/lodge-bosque-nublado-cerca-de-quito/'], ['Áreas comunes', '/es/habitaciones/areas-comunes/']]
    }
  },
  produce: {
    en: {
      path: '/features/produce/', alt: '/es/caracteristicas/productos-locales/', name: 'Local Produce',
      title: 'Local Produce at a Cloud Forest Retreat Near Quito',
      description: 'Learn how seasonal fruit, herbs and garden produce can connect to a stay at The Cloud Forest Retreat, with clear guidance about availability and meals.',
      home: '/', book: '/booking/', contact: '/contact/', hero: 'produce/tcfr_features_produce_hero_01.jpg',
      kicker: 'Seasonal ingredients from the surrounding land',
      lead: 'Garden produce can add a local connection to the stay, but harvests and meal arrangements change. Treat this as context, then confirm what is available, included or possible for your dates.',
      facts: [['Seasonal', 'Harvests naturally change'], ['Local context', 'Fruit, herbs and garden crops'], ['Confirm', 'Meals, access and dietary needs']],
      intro: 'Let the season set expectations',
      introText: 'Rain, temperature, plant cycles and current operations affect what may be harvested or served. Ask before arrival if meals, a garden visit or a particular dietary request matters to your stay.',
      cards: [
        ['Seasonal fruit', 'What is ripe changes through the year', 'Expect variation rather than a fixed list of fruit.', 'produce/tcfr_features_produce_seasonal_fruits_chirimoya_01.jpg', '/features/'],
        ['Herbs and greens', 'Garden ingredients shaped by current growth', 'Availability depends on the garden and recent conditions.', 'produce/tcfr_features_produce_herbs.jpg', '/features/amenities/'],
        ['Garden harvest', 'A direct connection to the property', 'Ask whether any garden experience is available during your dates.', 'produce/tcfr_features_produce_garden_harvest_01.jpg', '/weekend-getaway-from-quito/'],
        ['Meals and requests', 'Plan dietary needs before arrival', 'Confirm meal service, inclusions, allergies and restrictions directly with the host.', 'produce/tcfr_features_produce_garden_to_table_01.jpg', '/contact/']
      ],
      faqs: [
        ['Is local produce always available?', 'No. Harvests depend on season, weather, plant cycles and current operations, so specific ingredients cannot be guaranteed.'],
        ['Are meals included with every stay?', 'Do not assume meals are included. Review the booking details and confirm current meal arrangements and pricing for your dates.'],
        ['Can dietary needs be accommodated?', 'Some requests may be possible with advance notice. Share allergies, restrictions and preferences before booking so the host can confirm.'],
        ['Can guests visit or harvest from the garden?', 'Garden access or harvesting should not be assumed. Ask the host what is appropriate and available during your stay.']
      ],
      related: [['Features', '/features/'], ['Weekend getaway from Quito', '/weekend-getaway-from-quito/'], ['Amenities', '/features/amenities/'], ['Booking', '/booking/']]
    },
    es: {
      path: '/es/caracteristicas/productos-locales/', alt: '/features/produce/', name: 'Productos Locales',
      title: 'Productos Locales en un Refugio Cerca de Quito',
      description: 'Conoce cómo frutas, hierbas y productos de temporada pueden formar parte de la estadía, con orientación clara sobre disponibilidad y comidas.',
      home: '/es/', book: '/es/reservas/', contact: '/es/contacto/', hero: 'produce/tcfr_features_produce_hero_01.jpg',
      kicker: 'Ingredientes estacionales del entorno',
      lead: 'Los productos del jardín pueden conectar la estadía con el lugar, pero las cosechas y comidas cambian. Usa esta información como contexto y confirma qué está disponible o incluido.',
      facts: [['Estacional', 'Las cosechas cambian'], ['Contexto local', 'Frutas, hierbas y cultivos'], ['Confirma', 'Comidas, acceso y dieta']],
      intro: 'Deja que la temporada defina las expectativas',
      introText: 'La lluvia, temperatura, ciclos de las plantas y operación actual afectan lo que puede cosecharse o servirse. Consulta antes si las comidas, el jardín o una necesidad dietética importan.',
      cards: [
        ['Frutas de temporada', 'Lo que está maduro cambia durante el año', 'Espera variedad en lugar de una lista fija.', 'produce/tcfr_features_produce_seasonal_fruits_chirimoya_01.jpg', '/es/caracteristicas/'],
        ['Hierbas y hojas', 'Ingredientes definidos por el crecimiento actual', 'La disponibilidad depende del jardín y las condiciones recientes.', 'produce/tcfr_features_produce_herbs.jpg', '/es/caracteristicas/amenidades/'],
        ['Cosecha del jardín', 'Una conexión directa con la propiedad', 'Pregunta si existe alguna experiencia de jardín para tus fechas.', 'produce/tcfr_features_produce_garden_harvest_01.jpg', '/es/escapada-fin-de-semana-quito/'],
        ['Comidas y solicitudes', 'Planifica necesidades dietéticas antes de llegar', 'Confirma servicio, inclusiones, alergias y restricciones con el anfitrión.', 'produce/tcfr_features_produce_garden_to_table_01.jpg', '/es/contacto/']
      ],
      faqs: [
        ['¿Siempre hay productos locales disponibles?', 'No. Las cosechas dependen de temporada, clima, ciclos de plantas y operación actual; no se garantizan ingredientes específicos.'],
        ['¿Las comidas están incluidas en toda estadía?', 'No asumas que están incluidas. Revisa los detalles de reserva y confirma las opciones y precios vigentes para tus fechas.'],
        ['¿Pueden atender necesidades dietéticas?', 'Algunas solicitudes pueden ser posibles con anticipación. Comparte alergias, restricciones y preferencias antes de reservar para confirmarlas.'],
        ['¿Los huéspedes pueden visitar o cosechar del jardín?', 'No se debe asumir acceso o cosecha. Pregunta al anfitrión qué es apropiado y está disponible durante tu estadía.']
      ],
      related: [['Características', '/es/caracteristicas/'], ['Escapada desde Quito', '/es/escapada-fin-de-semana-quito/'], ['Amenidades', '/es/caracteristicas/amenidades/'], ['Reservas', '/es/reservas/']]
    }
  }
};

for (const [type, pair] of Object.entries(pairs)) {
  for (const page of Object.values(pair)) await render(page, type);
}
