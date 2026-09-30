import { buildRoomPair } from './render_room_pair.mjs';

const paths = { en: '/rooms/sunrise-room/', es: '/es/habitaciones/habitacion-amanecer/' };
const copy = {
  en: {
    name: 'Sunrise Room', title: 'Sunrise Room near Quito | The Cloud Forest Retreat',
    description: 'Explore the east-facing Sunrise Room near Quito. See room photos, morning views and the bathroom shared with Sunset Room, then check availability.',
    home: '/', hub: '/rooms/', booking: '/booking/', contact: '/contact/', common: '/rooms/common-areas/',
    homeLabel: 'Home', hubLabel: 'Rooms', kicker: 'Morning light. A quieter start.',
    heroImage: 'tcfr_images_rooms_sunrise_01.jpg', heroAlt: 'Sunrise Room bedroom with large windows overlooking the valley',
    lead: 'An east-facing private bedroom for guests who enjoy morning light and valley views. Its full bathroom is in the hallway, just outside the room, and shared only with the Sunset Room.',
    book: 'Check room availability', compare: 'Compare all rooms', ask: 'Ask a question',
    highlights: [['East-facing', 'Morning light and valley views'], ['Private bedroom', 'A quiet place to return to'], ['Shared bathroom', 'Hallway access; two rooms only']],
    featuresTitle: 'What to expect from the Sunrise Room',
    featuresIntro: 'Choose this room for its morning outlook and a comfortable base between time outdoors. Review the room layout and shared bathroom before deciding.',
    features: [
      ['A view toward the morning', 'The east-facing windows look out over the valley. Light, mist and visibility change with the weather; a clear sunrise is not guaranteed.'],
      ['Your own bedroom', 'The private room offers a place to rest between walks, birdwatching or time in the common areas. The photos show the current room layout and views.'],
      ['A shared hallway bathroom', 'Sunrise and Sunset share one full bathroom in the hallway, just outside the bedrooms. It is reserved for guests of these two rooms, rather than being an en-suite bathroom.']
    ],
    galleryTitle: 'See the room and its outlook', galleryIntro: 'Two views of the Sunrise Room show the sleeping space, windows and surrounding landscape.',
    photos: [['tcfr_images_rooms_sunrise_01.jpg', 'Sunrise Room bed and windows seen from the doorway', 'The bedroom layout'], ['tcfr_images_rooms_sunrise_02.jpg', 'Valley and trees through the Sunrise Room windows', 'The outlook from the room']],
    fitTitle: 'A natural fit for early starts',
    fitText: 'The Sunrise Room suits travelers who enjoy a calm morning before breakfast or an outing. If birdwatching is part of your trip, ask the host about planning around your dates and interests. Wildlife activity varies, so choose the room for its setting and light rather than a promised sighting.',
    sharedTitle: 'Compare the space you need',
    sharedText: 'The Sunset Room offers a different time-of-day atmosphere and uses the same hallway bathroom. The Panoramic Suite provides a more spacious, open layout with a private terrace. The shared living and kitchen areas offer additional places to spend time; confirm current access and meal arrangements with your host.',
    sharedLink: 'Explore the common areas',
    practicalTitle: 'Plan with clear expectations', practicalIntro: 'Send your dates, guest count and room preference to receive current availability and pricing from the host.',
    practical: [['Beds and capacity', 'Confirm the sleeping arrangement and guest capacity for your party. Mention any additional bedding or access needs.'], ['Bathroom arrangements', 'The full bathroom is outside the bedroom and shared with Sunset Room guests. Consider whether that arrangement suits your stay.'], ['Rates and meals', 'Ask what the quoted rate includes, including meals, amenities and any extra services. Use the host’s response for current details.'], ['Arrival and outings', 'Discuss transport, arrival time and current road guidance. Ask about early outings before planning a fixed schedule.']],
    faqTitle: 'Sunrise Room questions', faqIntro: 'Practical answers about the room, bathroom and booking process.',
    faqs: [
      ['Does the Sunrise Room have a private bathroom?', 'No. The Sunrise and Sunset rooms share a full bathroom in the hallway, just outside the bedrooms. It is reserved for guests staying in those two rooms.'],
      ['Does the Sunrise Room face the morning light?', 'Yes. The room faces east and has windows overlooking the valley. The amount of morning light and visibility depend on weather conditions.'],
      ['Who is this room best suited to?', 'The Sunrise Room suits early risers and nature travelers who value a private bedroom, morning views and a calm base. Guests should be comfortable sharing the hallway bathroom with the Sunset Room.'],
      ['How do I confirm availability, capacity and inclusions?', 'Send your dates, number of guests and Sunrise Room preference through the availability form. The host can confirm capacity, bed setup, rates and inclusions. Sending the request does not confirm a reservation.']
    ],
    relatedTitle: 'Plan your morning and the rest of your stay',
    related: [['Panoramic Suite', '/rooms/panoramic-suite/'], ['Sunset Room', '/rooms/sunset-room/'], ['Common Areas', '/rooms/common-areas/'], ['Birdwatching at the retreat', '/birdwatching-lodge-ecuador/'], ['Cloud Forest Lodge Near Quito', '/cloud-forest-lodge-near-quito/'], ['Birdwatching near Quito', '/blog/birdwatching-near-quito/'], ['What to pack', '/what-to-pack-cloud-forest-ecuador/'], ['Getting to the retreat', '/blog/how-to-get-to-cloud-forest-retreat/']],
    reviewTitle: 'Guests share their retreat experience', reviewIntro: 'These reviews describe stays at the retreat; they are not specific to the Sunrise Room.',
    photosLabel: 'Room photos', featuresLabel: 'Inside the room', planningLabel: 'Before you arrive', faqLabel: 'Helpful answers', relatedLabel: 'Continue exploring',
    bathroomTitle: 'A full bathroom shared by two rooms', bathroomText: 'The bathroom is in the hallway, just outside the Sunrise and Sunset bedrooms, and reserved for their guests. The photos show the shower, toilet and washbasin. If you need a bathroom inside your accommodation, discuss another room option with the host before booking.',
    bathCaptions: ['Shower, toilet and washbasin', 'The shared bathroom washbasin'],
    bathAlts: ['Shared hallway bathroom with shower, toilet and washbasin', 'Washbasin and wooden counter in the shared bathroom'],
    videoLabel: 'Watch the Sunrise Room video',
    amenities: ['Shared hallway bathroom', 'East-facing windows']
  },
  es: {
    name: 'Habitación Amanecer', title: 'Habitación Amanecer cerca de Quito | The Cloud Forest Retreat',
    description: 'Conoce la Habitación Amanecer cerca de Quito: vistas al este, fotos y baño compartido con Atardecer. Consulta disponibilidad y detalles para tus fechas.',
    home: '/es/', hub: '/es/habitaciones/', booking: '/es/reservas/', contact: '/es/contacto/', common: '/es/habitaciones/areas-comunes/',
    homeLabel: 'Inicio', hubLabel: 'Habitaciones', kicker: 'Luz de mañana. Un comienzo tranquilo.',
    heroImage: 'tcfr_images_rooms_sunrise_01.jpg', heroAlt: 'Habitación Amanecer con amplias ventanas hacia el valle',
    lead: 'Una habitación privada orientada al este para quienes disfrutan de la luz de la mañana y las vistas al valle. El baño completo está en el pasillo, justo afuera, y se comparte únicamente con la Habitación Atardecer.',
    book: 'Consultar disponibilidad', compare: 'Comparar habitaciones', ask: 'Hacer una pregunta',
    highlights: [['Orientación al este', 'Luz de mañana y vistas al valle'], ['Habitación privada', 'Un lugar tranquilo al regresar'], ['Baño compartido', 'En el pasillo; solo dos habitaciones']],
    featuresTitle: 'Qué esperar de la Habitación Amanecer', featuresIntro: 'Elige esta habitación por sus vistas de la mañana y como base cómoda entre salidas. Revisa la distribución y el baño compartido antes de decidir.',
    features: [
      ['Vistas hacia la luz de la mañana', 'Las ventanas orientadas al este miran al valle. La luz, la neblina y la visibilidad cambian con el clima; no se garantiza un amanecer despejado.'],
      ['Tu propia habitación', 'La habitación privada ofrece un lugar para descansar entre caminatas, avistamiento de aves o tiempo en las áreas comunes. Las fotos muestran la distribución y las vistas actuales.'],
      ['Baño compartido en el pasillo', 'Amanecer y Atardecer comparten un baño completo en el pasillo, justo afuera de las habitaciones. Está reservado para sus huéspedes y no es un baño dentro de la habitación.']
    ],
    galleryTitle: 'Conoce la habitación y sus vistas', galleryIntro: 'Dos fotos de la Habitación Amanecer muestran el espacio para dormir, las ventanas y el paisaje.',
    photos: [['tcfr_images_rooms_sunrise_01.jpg', 'Cama y ventanas de la Habitación Amanecer desde la puerta', 'La distribución de la habitación'], ['tcfr_images_rooms_sunrise_02.jpg', 'Valle y árboles desde las ventanas de la Habitación Amanecer', 'Las vistas desde la habitación']],
    fitTitle: 'Una opción para comenzar temprano',
    fitText: 'La Habitación Amanecer es una opción para quienes disfrutan de una mañana tranquila antes del desayuno o de una salida. Si quieres observar aves, consulta con el anfitrión cómo planificar según tus fechas e intereses. La actividad de la fauna varía: elige la habitación por su entorno y su luz, sin esperar un avistamiento garantizado.',
    sharedTitle: 'Compara el espacio que necesitas',
    sharedText: 'La Habitación Atardecer ofrece otro ambiente al final del día y utiliza el mismo baño del pasillo. La Suite Panorámica tiene una distribución abierta más espaciosa y terraza privada. La sala y la cocina compartidas ofrecen otros lugares para disfrutar del refugio; confirma el acceso actual y las opciones de comida con tu anfitrión.',
    sharedLink: 'Explorar las áreas comunes',
    practicalTitle: 'Planifica con expectativas claras', practicalIntro: 'Envía tus fechas, número de huéspedes y habitación preferida para recibir disponibilidad y precios actuales del anfitrión.',
    practical: [['Camas y capacidad', 'Confirma la distribución para dormir y la capacidad para tu grupo. Menciona cualquier necesidad adicional de camas o acceso.'], ['Uso del baño', 'El baño completo está fuera de la habitación y se comparte con los huéspedes de Atardecer. Considera si esta distribución se adapta a tu estadía.'], ['Tarifas y comidas', 'Consulta qué incluye el precio, como comidas, amenidades y servicios adicionales. La respuesta del anfitrión te dará los detalles actuales.'], ['Llegada y salidas', 'Conversa sobre transporte, hora de llegada e indicaciones actuales del camino. Consulta las salidas tempranas antes de fijar un horario.']],
    faqTitle: 'Preguntas sobre la Habitación Amanecer', faqIntro: 'Respuestas prácticas sobre la habitación, el baño y la reserva.',
    faqs: [
      ['¿La Habitación Amanecer tiene baño privado?', 'No. Las habitaciones Amanecer y Atardecer comparten un baño completo en el pasillo, justo afuera de las habitaciones. Está reservado para los huéspedes de estas dos habitaciones.'],
      ['¿La Habitación Amanecer recibe luz de la mañana?', 'Sí. La habitación está orientada al este y tiene ventanas hacia el valle. La cantidad de luz y la visibilidad dependen del clima.'],
      ['¿Para quién es ideal esta habitación?', 'La Habitación Amanecer es una opción para madrugadores y viajeros de naturaleza que valoran una habitación privada, vistas de la mañana y una base tranquila. Deben sentirse cómodos compartiendo el baño del pasillo con la Habitación Atardecer.'],
      ['¿Cómo confirmo disponibilidad, capacidad e inclusiones?', 'Envía tus fechas, número de huéspedes y preferencia por Amanecer mediante la solicitud de disponibilidad. El anfitrión confirmará capacidad, camas, tarifas e inclusiones. Enviar la solicitud no confirma una reserva.']
    ],
    relatedTitle: 'Planifica tu mañana y el resto de la estadía',
    related: [['Suite Panorámica', '/es/habitaciones/suite-panoramica/'], ['Habitación Atardecer', '/es/habitaciones/habitacion-atardecer/'], ['Áreas comunes', '/es/habitaciones/areas-comunes/'], ['Avistamiento de aves en el refugio', '/es/lodge-avistamiento-aves-ecuador/'], ['Lodge de bosque nublado cerca de Quito', '/es/lodge-bosque-nublado-cerca-de-quito/'], ['Avistamiento cerca de Quito', '/es/blog/avistamiento-aves-cerca-de-quito/'], ['Qué llevar', '/es/que-llevar-bosque-nublado-ecuador/'], ['Cómo llegar al refugio', '/es/blog/como-llegar-cloud-forest-retreat/']],
    reviewTitle: 'Los huéspedes cuentan su experiencia', reviewIntro: 'Estas reseñas describen estadías en el refugio; no corresponden específicamente a la Habitación Amanecer.',
    photosLabel: 'Fotos de la habitación', featuresLabel: 'Dentro de la habitación', planningLabel: 'Antes de llegar', faqLabel: 'Respuestas útiles', relatedLabel: 'Sigue explorando',
    bathroomTitle: 'Un baño completo para dos habitaciones', bathroomText: 'El baño está en el pasillo, justo afuera de Amanecer y Atardecer, y reservado para sus huéspedes. Las fotos muestran la ducha, el inodoro y el lavabo. Si necesitas un baño dentro de tu alojamiento, consulta otra opción con el anfitrión antes de reservar.',
    bathCaptions: ['Ducha, inodoro y lavabo', 'El lavabo del baño compartido'],
    bathAlts: ['Baño compartido del pasillo con ducha, inodoro y lavabo', 'Lavabo y encimera de madera del baño compartido'],
    videoLabel: 'Ver el video de la Habitación Amanecer',
    amenities: ['Baño compartido en el pasillo', 'Ventanas orientadas al este']
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
        <a class="roomsTextLink" href="https://www.youtube.com/watch?v=_VGh3YEdYl4" target="_blank" rel="noopener" data-analytics-event="video_click" data-analytics-location="room_video" data-analytics-page-type="room_detail_page" data-analytics-label="Sunrise Room video">${p.videoLabel} →</a>
      </section>`;
}
await buildRoomPair(copy, paths, 'sunrise-room');
