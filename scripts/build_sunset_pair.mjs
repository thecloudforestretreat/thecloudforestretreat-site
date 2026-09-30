import { buildRoomPair } from './render_room_pair.mjs';

const paths = { en: '/rooms/sunset-room/', es: '/es/habitaciones/habitacion-atardecer/' };
const copy = {
  en: {
    name: 'Sunset Room', title: 'Sunset Room near Quito | The Cloud Forest Retreat',
    description: 'Explore the west-facing Sunset Room near Quito. See room photos, evening views and the bathroom shared with Sunrise Room, then check availability.',
    home: '/', hub: '/rooms/', booking: '/booking/', contact: '/contact/', common: '/rooms/common-areas/',
    homeLabel: 'Home', hubLabel: 'Rooms', kicker: 'Evening light. A slower end to the day.',
    heroImage: 'tcfr_images_rooms_sunset_01.jpg', heroAlt: 'Sunset Room bedroom with large windows overlooking the valley',
    lead: 'A west-facing private bedroom for guests who enjoy evening light and valley views. Its full bathroom is in the hallway, just outside the room, and shared only with the Sunrise Room.',
    book: 'Check room availability', compare: 'Compare all rooms', ask: 'Ask a question',
    highlights: [['West-facing', 'Evening light and valley views'], ['Private bedroom', 'A quiet place to return to'], ['Shared bathroom', 'Hallway access; two rooms only']],
    featuresTitle: 'What to expect from the Sunset Room',
    featuresIntro: 'Choose this room for its evening outlook and a comfortable base between time outdoors. Review the room layout and shared bathroom before deciding.',
    features: [
      ['A view toward the evening', 'The west-facing windows look out over the valley. Light, mist and visibility change with the weather; a clear sunset is not guaranteed.'],
      ['Your own bedroom', 'The private room offers a place to rest between walks, birdwatching or time in the common areas. The photos show the current room layout and views.'],
      ['A shared hallway bathroom', 'Sunset and Sunrise share one full bathroom in the hallway, just outside the bedrooms. It is reserved for guests of these two rooms, rather than being an en-suite bathroom.']
    ],
    galleryTitle: 'See the room and its outlook', galleryIntro: 'Two views of the Sunset Room show the sleeping space, windows and surrounding landscape.',
    photos: [['tcfr_images_rooms_sunset_01.jpg', 'Sunset Room bed and windows seen from the doorway', 'The bedroom layout'], ['tcfr_images_rooms_sunset_02.jpg', 'Valley and trees through the Sunset Room windows', 'The outlook from the room']],
    fitTitle: 'A place to settle in after exploring',
    fitText: 'The Sunset Room suits travelers who want a private place to unwind after time outdoors. Its west-facing outlook brings the changing evening light into the room. Plan your return from walks or outings with your host if you would like to spend the end of the day here.',
    sharedTitle: 'Compare the space you need',
    sharedText: 'The Sunrise Room offers morning light and uses the same hallway bathroom. The Panoramic Suite provides a more spacious, open layout with a private terrace. The shared living and kitchen areas offer additional places to spend time; confirm current access and meal arrangements with your host.',
    sharedLink: 'Explore the common areas',
    practicalTitle: 'Plan with clear expectations', practicalIntro: 'Send your dates, guest count and room preference to receive current availability and pricing from the host.',
    practical: [['Beds and capacity', 'Confirm the sleeping arrangement and guest capacity for your party. Mention any additional bedding or access needs.'], ['Bathroom arrangements', 'The full bathroom is outside the bedroom and shared with Sunrise Room guests. Consider whether that arrangement suits your stay.'], ['Rates and meals', 'Ask what the quoted rate includes, including meals, amenities and any extra services. Use the host’s response for current details.'], ['Arrival and outings', 'Discuss transport, arrival time and current road guidance. Allow time for the return journey if you want to be at the retreat for sunset.']],
    faqTitle: 'Sunset Room questions', faqIntro: 'Practical answers about the room, bathroom and booking process.',
    faqs: [
      ['Does the Sunset Room have a private bathroom?', 'No. The Sunset and Sunrise rooms share a full bathroom in the hallway, just outside the bedrooms. It is reserved for guests staying in those two rooms.'],
      ['Does the Sunset Room face the evening light?', 'Yes. The room faces west and has windows overlooking the valley. The amount of evening light and visibility depend on weather conditions.'],
      ['Who is this room best suited to?', 'The Sunset Room suits travelers who value a private bedroom, evening views and a calm place to unwind after exploring. Guests should be comfortable sharing the hallway bathroom with the Sunrise Room.'],
      ['How do I confirm availability, capacity and inclusions?', 'Send your dates, number of guests and Sunset Room preference through the availability form. The host can confirm capacity, bed setup, rates and inclusions. Sending the request does not confirm a reservation.']
    ],
    relatedTitle: 'Plan your evening and the rest of your stay',
    related: [['Panoramic Suite', '/rooms/panoramic-suite/'], ['Sunrise Room', '/rooms/sunrise-room/'], ['Common Areas', '/rooms/common-areas/'], ['Birdwatching at the retreat', '/birdwatching-lodge-ecuador/'], ['Cloud Forest Lodge Near Quito', '/cloud-forest-lodge-near-quito/'], ['Birdwatching near Quito', '/blog/birdwatching-near-quito/'], ['What to pack', '/what-to-pack-cloud-forest-ecuador/'], ['Getting to the retreat', '/blog/how-to-get-to-cloud-forest-retreat/']],
    reviewTitle: 'Guests share their retreat experience', reviewIntro: 'These reviews describe stays at the retreat; they are not specific to the Sunset Room.',
    photosLabel: 'Room photos', featuresLabel: 'Inside the room', planningLabel: 'Before you arrive', faqLabel: 'Helpful answers', relatedLabel: 'Continue exploring',
    bathroomTitle: 'A full bathroom shared by two rooms', bathroomText: 'The bathroom is in the hallway, just outside the Sunset and Sunrise bedrooms, and reserved for their guests. The photos show the shower, toilet and washbasin. If you need a bathroom inside your accommodation, discuss another room option with the host before booking.',
    bathCaptions: ['Shower, toilet and washbasin', 'The shared bathroom washbasin'],
    bathAlts: ['Shared hallway bathroom with shower, toilet and washbasin', 'Washbasin and wooden counter in the shared bathroom'],
    videoLabel: 'Watch the Sunset Room video',
    amenities: ['Shared hallway bathroom', 'West-facing windows']
  },
  es: {
    name: 'Habitación Atardecer', title: 'Habitación Atardecer cerca de Quito | The Cloud Forest Retreat',
    description: 'Conoce la Habitación Atardecer cerca de Quito: vistas al oeste, fotos y baño compartido con Amanecer. Consulta disponibilidad y detalles para tus fechas.',
    home: '/es/', hub: '/es/habitaciones/', booking: '/es/reservas/', contact: '/es/contacto/', common: '/es/habitaciones/areas-comunes/',
    homeLabel: 'Inicio', hubLabel: 'Habitaciones', kicker: 'Luz de tarde. Un final tranquilo.',
    heroImage: 'tcfr_images_rooms_sunset_01.jpg', heroAlt: 'Habitación Atardecer con amplias ventanas hacia el valle',
    lead: 'Una habitación privada orientada al oeste para quienes disfrutan de la luz de la tarde y las vistas al valle. El baño completo está en el pasillo, justo afuera, y se comparte únicamente con la Habitación Amanecer.',
    book: 'Consultar disponibilidad', compare: 'Comparar habitaciones', ask: 'Hacer una pregunta',
    highlights: [['Orientación al oeste', 'Luz de tarde y vistas al valle'], ['Habitación privada', 'Un lugar tranquilo al regresar'], ['Baño compartido', 'En el pasillo; solo dos habitaciones']],
    featuresTitle: 'Qué esperar de la Habitación Atardecer', featuresIntro: 'Elige esta habitación por sus vistas de la tarde y como base cómoda entre salidas. Revisa la distribución y el baño compartido antes de decidir.',
    features: [
      ['Vistas hacia la luz de la tarde', 'Las ventanas orientadas al oeste miran al valle. La luz, la neblina y la visibilidad cambian con el clima; no se garantiza un atardecer despejado.'],
      ['Tu propia habitación', 'La habitación privada ofrece un lugar para descansar entre caminatas, avistamiento de aves o tiempo en las áreas comunes. Las fotos muestran la distribución y las vistas actuales.'],
      ['Baño compartido en el pasillo', 'Atardecer y Amanecer comparten un baño completo en el pasillo, justo afuera de las habitaciones. Está reservado para sus huéspedes y no es un baño dentro de la habitación.']
    ],
    galleryTitle: 'Conoce la habitación y sus vistas', galleryIntro: 'Dos fotos de la Habitación Atardecer muestran el espacio para dormir, las ventanas y el paisaje.',
    photos: [['tcfr_images_rooms_sunset_01.jpg', 'Cama y ventanas de la Habitación Atardecer desde la puerta', 'La distribución de la habitación'], ['tcfr_images_rooms_sunset_02.jpg', 'Valle y árboles desde las ventanas de la Habitación Atardecer', 'Las vistas desde la habitación']],
    fitTitle: 'Un lugar para descansar después de explorar',
    fitText: 'La Habitación Atardecer es una opción para quienes buscan un lugar privado donde descansar después de disfrutar del entorno. Sus vistas al oeste permiten apreciar los cambios de luz de la tarde. Coordina el regreso de caminatas o salidas con tu anfitrión si quieres terminar el día aquí.',
    sharedTitle: 'Compara el espacio que necesitas',
    sharedText: 'La Habitación Amanecer ofrece luz de la mañana y utiliza el mismo baño del pasillo. La Suite Panorámica tiene una distribución abierta más espaciosa y terraza privada. La sala y la cocina compartidas ofrecen otros lugares para disfrutar del refugio; confirma el acceso actual y las opciones de comida con tu anfitrión.',
    sharedLink: 'Explorar las áreas comunes',
    practicalTitle: 'Planifica con expectativas claras', practicalIntro: 'Envía tus fechas, número de huéspedes y habitación preferida para recibir disponibilidad y precios actuales del anfitrión.',
    practical: [['Camas y capacidad', 'Confirma la distribución para dormir y la capacidad para tu grupo. Menciona cualquier necesidad adicional de camas o acceso.'], ['Uso del baño', 'El baño completo está fuera de la habitación y se comparte con los huéspedes de Amanecer. Considera si esta distribución se adapta a tu estadía.'], ['Tarifas y comidas', 'Consulta qué incluye el precio, como comidas, amenidades y servicios adicionales. La respuesta del anfitrión te dará los detalles actuales.'], ['Llegada y salidas', 'Conversa sobre transporte, hora de llegada e indicaciones actuales del camino. Calcula el tiempo de regreso si quieres estar en el refugio al atardecer.']],
    faqTitle: 'Preguntas sobre la Habitación Atardecer', faqIntro: 'Respuestas prácticas sobre la habitación, el baño y la reserva.',
    faqs: [
      ['¿La Habitación Atardecer tiene baño privado?', 'No. Las habitaciones Atardecer y Amanecer comparten un baño completo en el pasillo, justo afuera de las habitaciones. Está reservado para los huéspedes de estas dos habitaciones.'],
      ['¿La Habitación Atardecer recibe luz de la tarde?', 'Sí. La habitación está orientada al oeste y tiene ventanas hacia el valle. La cantidad de luz y la visibilidad dependen del clima.'],
      ['¿Para quién es ideal esta habitación?', 'La Habitación Atardecer es una opción para viajeros que valoran una habitación privada, vistas de la tarde y un lugar tranquilo donde descansar. Deben sentirse cómodos compartiendo el baño del pasillo con la Habitación Amanecer.'],
      ['¿Cómo confirmo disponibilidad, capacidad e inclusiones?', 'Envía tus fechas, número de huéspedes y preferencia por Atardecer mediante la solicitud de disponibilidad. El anfitrión confirmará capacidad, camas, tarifas e inclusiones. Enviar la solicitud no confirma una reserva.']
    ],
    relatedTitle: 'Planifica tu tarde y el resto de la estadía',
    related: [['Suite Panorámica', '/es/habitaciones/suite-panoramica/'], ['Habitación Amanecer', '/es/habitaciones/habitacion-amanecer/'], ['Áreas comunes', '/es/habitaciones/areas-comunes/'], ['Avistamiento de aves en el refugio', '/es/lodge-avistamiento-aves-ecuador/'], ['Lodge de bosque nublado cerca de Quito', '/es/lodge-bosque-nublado-cerca-de-quito/'], ['Avistamiento cerca de Quito', '/es/blog/avistamiento-aves-cerca-de-quito/'], ['Qué llevar', '/es/que-llevar-bosque-nublado-ecuador/'], ['Cómo llegar al refugio', '/es/blog/como-llegar-cloud-forest-retreat/']],
    reviewTitle: 'Los huéspedes cuentan su experiencia', reviewIntro: 'Estas reseñas describen estadías en el refugio; no corresponden específicamente a la Habitación Atardecer.',
    photosLabel: 'Fotos de la habitación', featuresLabel: 'Dentro de la habitación', planningLabel: 'Antes de llegar', faqLabel: 'Respuestas útiles', relatedLabel: 'Sigue explorando',
    bathroomTitle: 'Un baño completo para dos habitaciones', bathroomText: 'El baño está en el pasillo, justo afuera de Atardecer y Amanecer, y reservado para sus huéspedes. Las fotos muestran la ducha, el inodoro y el lavabo. Si necesitas un baño dentro de tu alojamiento, consulta otra opción con el anfitrión antes de reservar.',
    bathCaptions: ['Ducha, inodoro y lavabo', 'El lavabo del baño compartido'],
    bathAlts: ['Baño compartido del pasillo con ducha, inodoro y lavabo', 'Lavabo y encimera de madera del baño compartido'],
    videoLabel: 'Ver el video de la Habitación Atardecer',
    amenities: ['Baño compartido en el pasillo', 'Ventanas orientadas al oeste']
  }
};
for (const p of Object.values(copy)) {
  p.extraSection = `      <section class="roomsSection roomsGuidance roomBathroom" aria-labelledby="room-bathroom-title" data-analytics-section="shared_bathroom">
        <header class="roomsSectionHeading">
          <p class="roomsEyebrow roomsEyebrow--dark">${p.planningLabel}</p>
          <h2 id="room-bathroom-title">${p.bathroomTitle}</h2>
          <p>${p.bathroomText}</p>
        </header>
        <div class="suiteGallery roomGallery--two">
          <figure>
            <img src="/assets/images/pages/rooms/tcfr_rooms_shared_bathroom_01.jpg" alt="${p.bathAlts[0]}" loading="lazy" decoding="async" />
            <figcaption>${p.bathCaptions[0]}</figcaption>
          </figure>
          <figure>
            <img src="/assets/images/pages/rooms/tcfr_rooms_shared_bathroom_02.jpg" alt="${p.bathAlts[1]}" loading="lazy" decoding="async" />
            <figcaption>${p.bathCaptions[1]}</figcaption>
          </figure>
        </div>
        <a class="roomsTextLink" href="https://www.youtube.com/watch?v=1Djnf3UnF4g" target="_blank" rel="noopener" data-analytics-event="video_click" data-analytics-location="room_video" data-analytics-page-type="room_detail_page" data-analytics-label="Sunset Room video">${p.videoLabel} →</a>
      </section>`;
}
await buildRoomPair(copy, paths, 'sunset-room');
