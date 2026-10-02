import fs from "node:fs/promises";

const pages = [
  {
    path: "booking/index.html", lang: "en", type: "booking", pageType: "booking_page",
    title: "Request Availability | The Cloud Forest Retreat Near Quito",
    description: "Request availability at The Cloud Forest Retreat in Pichincha, Ecuador. Share dates, room preferences, transportation needs, and trip details.",
    canonical: "https://thecloudforestretreat.com/booking/", counterpart: "https://thecloudforestretreat.com/es/reservas/",
    home: "/", current: "Booking", eyebrow: "Direct booking with personal support", h1: "Plan your cloud forest stay",
    lead: "Share your preferred dates, room interests, and travel details. A host will review your request and reply with availability and clear next steps.",
    assurances: ["No payment is collected with this request", "Your information goes directly to the retreat team", "Transportation and activity questions are welcome"],
    image: "/assets/images/pages/tcfr_booking_hero.jpg", imageAlt: "The Cloud Forest Retreat in the mountains of Pichincha, Ecuador",
    caption: ["A private mountainside retreat near Quito", "Comfortable rooms, broad views, and direct help planning your arrival."],
    introEyebrow: "Check availability", introTitle: "Tell us what would make the stay work for you.", intro: "This request gives the team enough context to confirm dates, recommend a room, and answer practical questions in one reply.",
    formEyebrow: "Your stay details", formTitle: "Request availability", formIntro: "Fields marked with an asterisk are required. Submitting this form does not create a charge or confirmed reservation.",
    asideEyebrow: "Before you submit", asideTitle: "A clear path from request to arrival.", asideIntro: "We use the details you share to respond with the most useful options.",
    asideItems: [["Room options", "Compare the rooms and shared spaces before choosing."], ["Travel planning", "Ask about transportation from Quito and arrival timing."], ["Direct support", "Continue by email or WhatsApp after availability is reviewed."]],
    asideLink: ["View the rooms →", "/rooms/"], asideImage: "/assets/images/pages/tcfr_booking_01.jpg", asideAlt: "Guest room at The Cloud Forest Retreat",
    stepsEyebrow: "What happens next", stepsTitle: "From request to confirmed stay", stepsIntro: "The process stays personal, clear, and easy to follow.",
    steps: [["Share your plans", "Send preferred dates, guest count, and room interests."], ["Review the options", "We reply with availability, recommendations, and next steps."], ["Confirm your stay", "Complete the agreed booking step and receive arrival guidance."]],
    faqEyebrow: "Questions before booking", faqTitle: "Helpful booking details", faqIntro: "Clear answers for the decisions travelers usually make before requesting availability.",
    faqs: [["Does this form confirm my reservation?", "No. It starts a direct availability conversation. A reservation is confirmed only after the team verifies the details and you complete the agreed booking step."], ["Can I ask about transportation from Quito?", "Yes. Include your starting point, approximate arrival time, and number of travelers so the team can discuss practical options."], ["What if I am unsure which room to choose?", "Choose the option asking for a recommendation and explain what matters most to you. The team can clarify the room differences."], ["When will I receive arrival information?", "Confirmed guests receive the location details and practical guidance needed to reach the retreat."]],
    related: [["Explore the rooms", "/rooms/"], ["Getting here", "/quito-to-cloud-forest-distance/"], ["Contact the retreat", "/contact/"], ["Cloud Forest Lodge Near Quito", "/cloud-forest-lodge-near-quito/"], ["Nature activities", "/nature-activities-quito/"], ["About the retreat", "/about/"], ["About the whole-house stay", "/whole-house-rental-near-quito/", "Whole-house stay"]]
  },
  {
    path: "es/reservas/index.html", lang: "es", type: "booking", pageType: "booking_page",
    title: "Solicitar Disponibilidad | The Cloud Forest Retreat",
    description: "Solicita disponibilidad en The Cloud Forest Retreat en Pichincha, Ecuador. Comparte fechas, habitación, transporte y detalles del viaje.",
    canonical: "https://thecloudforestretreat.com/es/reservas/", counterpart: "https://thecloudforestretreat.com/booking/",
    home: "/es/", current: "Reservas", eyebrow: "Reserva directa con atención personal", h1: "Planifica tu estadía en el bosque nublado",
    lead: "Comparte tus fechas, habitación y detalles del viaje. Un anfitrión revisará la solicitud y responderá con disponibilidad y próximos pasos claros.",
    assurances: ["No se cobra ningún pago con esta solicitud", "Tu información llega directamente al equipo", "Puedes preguntar sobre transporte y actividades"],
    image: "/assets/images/pages/tcfr_booking_hero.jpg", imageAlt: "The Cloud Forest Retreat en las montañas de Pichincha, Ecuador",
    caption: ["Un refugio privado de montaña cerca de Quito", "Habitaciones cómodas, vistas amplias y ayuda directa para planificar tu llegada."],
    introEyebrow: "Consultar disponibilidad", introTitle: "Cuéntanos qué necesitas para tu estadía.", intro: "La información permite confirmar fechas, recomendar una habitación y responder preguntas prácticas en un solo mensaje.",
    formEyebrow: "Detalles de tu estadía", formTitle: "Solicitar disponibilidad", formIntro: "Los campos con asterisco son obligatorios. Enviar el formulario no genera un cobro ni una reserva confirmada.",
    asideEyebrow: "Antes de enviar", asideTitle: "Un proceso claro desde la solicitud hasta la llegada.", asideIntro: "Usamos los detalles que compartes para responder con opciones útiles.",
    asideItems: [["Habitaciones", "Compara las habitaciones y áreas compartidas antes de elegir."], ["Planificación del viaje", "Pregunta por transporte desde Quito y horarios de llegada."], ["Atención directa", "Continúa por email o WhatsApp después de revisar disponibilidad."]],
    asideLink: ["Ver las habitaciones →", "/es/habitaciones/"], asideImage: "/assets/images/pages/tcfr_booking_01.jpg", asideAlt: "Habitación para huéspedes en The Cloud Forest Retreat",
    stepsEyebrow: "Qué sucede después", stepsTitle: "De la solicitud a la estadía confirmada", stepsIntro: "El proceso es personal, claro y fácil de seguir.",
    steps: [["Comparte tus planes", "Envía fechas, número de huéspedes e interés de habitación."], ["Revisa las opciones", "Respondemos con disponibilidad, recomendaciones y próximos pasos."], ["Confirma tu estadía", "Completa el paso acordado y recibe orientación para llegar."]],
    faqEyebrow: "Preguntas antes de reservar", faqTitle: "Información útil para reservar", faqIntro: "Respuestas claras para las decisiones habituales antes de solicitar disponibilidad.",
    faqs: [["¿Este formulario confirma mi reserva?", "No. Inicia una conversación directa sobre disponibilidad. La reserva se confirma después de verificar los detalles y completar el paso acordado."], ["¿Puedo preguntar por transporte desde Quito?", "Sí. Indica tu punto de partida, hora aproximada y número de viajeros para conversar sobre opciones prácticas."], ["¿Qué hago si no sé qué habitación elegir?", "Selecciona la opción para recibir una recomendación y explica qué es importante para ti. El equipo puede aclarar las diferencias."], ["¿Cuándo recibiré la información para llegar?", "Los huéspedes confirmados reciben la ubicación y la orientación práctica necesaria para llegar al refugio."]],
    related: [["Explorar habitaciones", "/es/habitaciones/"], ["Cómo llegar", "/es/distancia-quito-bosque-nublado/"], ["Contactar al refugio", "/es/contacto/"], ["Lodge cerca de Quito", "/es/lodge-bosque-nublado-cerca-de-quito/"], ["Actividades de naturaleza", "/es/actividades-naturaleza-quito/"], ["Sobre el refugio", "/es/sobre-nosotros/"], ["Conoce la casa completa", "/es/alquiler-casa-completa-cerca-de-quito/", "Casa completa"]]
  },
  {
    path: "contact/index.html", lang: "en", type: "contact", pageType: "contact_page",
    title: "Contact The Cloud Forest Retreat | Pichincha, Ecuador",
    description: "Contact The Cloud Forest Retreat about rooms, availability, transportation from Quito, nature activities, or an upcoming stay in Pichincha, Ecuador.",
    canonical: "https://thecloudforestretreat.com/contact/", counterpart: "https://thecloudforestretreat.com/es/contacto/",
    home: "/", current: "Contact", eyebrow: "Direct answers from the retreat", h1: "Ask us about your cloud forest stay",
    lead: "Share your questions about rooms, dates, transportation, activities, or the property. A host will reply with practical information for your plans.",
    assurances: ["Your message goes directly to the retreat team", "Questions in English or Spanish are welcome", "Use the booking page when you already have dates"],
    image: "/assets/images/pages/tcfr_contact_hero.jpg", imageAlt: "Mountain landscape surrounding The Cloud Forest Retreat",
    caption: ["Plan with local context", "Ask about the property, travel time, seasonal conditions, and your preferred pace."],
    introEyebrow: "Contact the retreat", introTitle: "One place for the questions that shape your stay.", intro: "Tell us what you are considering and we will point you to the most relevant rooms, activities, and planning information.",
    formEyebrow: "Your message", formTitle: "Send a message", formIntro: "Fields marked with an asterisk are required. You will receive a confirmation after a successful submission.",
    asideEyebrow: "Already have dates?", asideTitle: "Request availability with the details in one place.", asideIntro: "The booking form is the fastest way to share dates, room needs, guest count, and transportation questions.",
    asideItems: [["Booking questions", "Use the availability form when your travel window is known."], ["Getting here", "Ask about travel time and transportation from your starting point."], ["Stay planning", "We can help connect rooms, activities, and practical expectations."]],
    asideLink: ["Request availability →", "/booking/"], asideImage: "/assets/images/pages/tcfr_contact_01.jpg", asideAlt: "Cloud forest view near The Cloud Forest Retreat",
    stepsEyebrow: "What happens next", stepsTitle: "A useful answer, without unnecessary back-and-forth", stepsIntro: "A little context helps us give you a more complete first response.",
    steps: [["Send your question", "Include dates or priorities when they are relevant."], ["A host reviews it", "The retreat team answers with current, practical information."], ["Choose the next step", "Continue by email, WhatsApp, or the availability form as needed."]],
    faqEyebrow: "Contact questions", faqTitle: "Before you send a message", faqIntro: "Quick answers about response, reservations, transportation, and languages.",
    faqs: [["Can I reserve through the contact form?", "For availability, dates, and room requests, use the booking form. The contact form is best for general questions and planning help."], ["Can I ask about transportation from Quito?", "Yes. Share your starting point, approximate timing, and group size so the team can discuss practical options."], ["Can I write in Spanish?", "Yes. The retreat welcomes messages in English or Spanish."], ["Where is the exact property location?", "The retreat is in Pichincha, approximately two hours from Quito. Confirmed guests receive exact location and arrival guidance."]],
    related: [["Request availability", "/booking/"], ["Explore the rooms", "/rooms/"], ["Getting here", "/quito-to-cloud-forest-distance/"], ["About the retreat", "/about/"], ["Nature activities", "/nature-activities-quito/"], ["Travel planning guides", "/blog/"]]
  },
  {
    path: "es/contacto/index.html", lang: "es", type: "contact", pageType: "contact_page",
    title: "Contacto | The Cloud Forest Retreat, Pichincha",
    description: "Contacta a The Cloud Forest Retreat sobre habitaciones, disponibilidad, transporte desde Quito, actividades o una futura estadía en Pichincha, Ecuador.",
    canonical: "https://thecloudforestretreat.com/es/contacto/", counterpart: "https://thecloudforestretreat.com/contact/",
    home: "/es/", current: "Contacto", eyebrow: "Respuestas directas del refugio", h1: "Pregúntanos sobre tu estadía en el bosque nublado",
    lead: "Comparte tus preguntas sobre habitaciones, fechas, transporte, actividades o la propiedad. Un anfitrión responderá con información práctica.",
    assurances: ["Tu mensaje llega directamente al equipo", "Puedes escribir en español o inglés", "Usa reservas si ya tienes fechas posibles"],
    image: "/assets/images/pages/tcfr_contact_hero.jpg", imageAlt: "Paisaje de montaña alrededor de The Cloud Forest Retreat",
    caption: ["Planifica con contexto local", "Pregunta por la propiedad, tiempo de viaje, condiciones y el ritmo que prefieres."],
    introEyebrow: "Contacta al refugio", introTitle: "Un solo lugar para las preguntas que definen tu estadía.", intro: "Cuéntanos qué estás considerando y te orientaremos hacia las habitaciones, actividades e información más relevantes.",
    formEyebrow: "Tu mensaje", formTitle: "Enviar un mensaje", formIntro: "Los campos con asterisco son obligatorios. Recibirás una confirmación después de un envío exitoso.",
    asideEyebrow: "¿Ya tienes fechas?", asideTitle: "Solicita disponibilidad con todos los detalles en un lugar.", asideIntro: "El formulario de reservas es la forma más rápida de compartir fechas, habitación, huéspedes y transporte.",
    asideItems: [["Preguntas de reserva", "Usa disponibilidad cuando ya conoces tu ventana de viaje."], ["Cómo llegar", "Pregunta por tiempo de viaje y transporte desde tu punto de partida."], ["Planificación", "Podemos conectar habitaciones, actividades y expectativas prácticas."]],
    asideLink: ["Solicitar disponibilidad →", "/es/reservas/"], asideImage: "/assets/images/pages/tcfr_contact_01.jpg", asideAlt: "Vista de bosque nublado cerca de The Cloud Forest Retreat",
    stepsEyebrow: "Qué sucede después", stepsTitle: "Una respuesta útil, sin intercambios innecesarios", stepsIntro: "Un poco de contexto nos ayuda a dar una respuesta inicial más completa.",
    steps: [["Envía tu pregunta", "Incluye fechas o prioridades cuando sean relevantes."], ["Un anfitrión la revisa", "El equipo responde con información actual y práctica."], ["Elige el siguiente paso", "Continúa por email, WhatsApp o reservas según necesites."]],
    faqEyebrow: "Preguntas de contacto", faqTitle: "Antes de enviar un mensaje", faqIntro: "Respuestas breves sobre reservas, transporte, ubicación e idiomas.",
    faqs: [["¿Puedo reservar con el formulario de contacto?", "Para disponibilidad, fechas y habitación, usa el formulario de reservas. Contacto es mejor para preguntas generales y planificación."], ["¿Puedo preguntar por transporte desde Quito?", "Sí. Comparte tu punto de partida, horario aproximado y número de viajeros para conversar sobre opciones prácticas."], ["¿Puedo escribir en inglés?", "Sí. El refugio recibe mensajes en español o inglés."], ["¿Dónde está la ubicación exacta?", "El refugio está en Pichincha, aproximadamente a dos horas de Quito. Los huéspedes confirmados reciben la ubicación exacta y orientación para llegar."]],
    related: [["Solicitar disponibilidad", "/es/reservas/"], ["Explorar habitaciones", "/es/habitaciones/"], ["Cómo llegar", "/es/distancia-quito-bosque-nublado/"], ["Sobre el refugio", "/es/sobre-nosotros/"], ["Actividades de naturaleza", "/es/actividades-naturaleza-quito/"], ["Guías de viaje", "/es/blog/"]]
  }
];

const hiddenAttribution = `<input type="hidden" name="attribution_first_source" value="" />
              <input type="hidden" name="attribution_first_medium" value="" />
              <input type="hidden" name="attribution_first_campaign" value="" />
              <input type="hidden" name="attribution_first_landing_page" value="" />
              <input type="hidden" name="attribution_last_source" value="" />
              <input type="hidden" name="attribution_last_medium" value="" />
              <input type="hidden" name="attribution_last_campaign" value="" />
              <input type="hidden" name="attribution_last_landing_page" value="" />
              <input type="hidden" name="attribution_click_id" value="" />`;

function analytics(event, location, pageType) { return `data-analytics-event="${event}" data-analytics-location="${location}" data-analytics-page-type="${pageType}"`; }

function bookingForm(p) {
  const es = p.lang === "es";
  return `<form id="tcfrBookingForm" data-analytics-form="booking_form" data-attribution-ready="true">
              ${hiddenAttribution}
              <input id="source_page" name="source_page" type="hidden" value="" />
              <input id="user_agent" name="user_agent" type="hidden" value="" />
              <input id="dates_of_visit" name="dates_of_visit" type="hidden" value="" />
              <input name="lang" type="hidden" value="${p.lang}" />
              <div class="conversionFields">
                ${field("first_name", es ? "Nombre" : "First name", "text", true, es ? "Tu nombre" : "First name", "given-name")}
                ${field("last_name", es ? "Apellido" : "Last name", "text", true, es ? "Tu apellido" : "Last name", "family-name")}
                ${field("email", "Email", "email", true, es ? "tu@ejemplo.com" : "you@example.com", "email")}
                ${field("phone_number", es ? "Teléfono o WhatsApp" : "Phone or WhatsApp", "tel", true, es ? "+593 ..." : "+1 305 ...", "tel")}
                ${field("date_start", es ? "Fecha de llegada" : "Arrival date", "date", true)}
                ${field("date_end", es ? "Fecha de salida" : "Departure date", "date", false)}
                ${select("number_of_guests", es ? "Huéspedes" : "Guests", [["", es ? "Selecciona" : "Choose"], ["1", es ? "1 huésped" : "1 guest"], ["2", es ? "2 huéspedes" : "2 guests"], ["3", es ? "3 huéspedes" : "3 guests"], ["4+", es ? "4 o más" : "4 or more"]], true)}
                ${select("room_preference", es ? "Habitación" : "Room preference", [["", es ? "Recomiéndame una habitación" : "Recommend a room"], ["Panoramic Suite", "Panoramic Suite"], ["Sunrise Room", "Sunrise Room"], ["Sunset Room", "Sunset Room"], ["Entire house", es ? "Casa completa" : "Entire house"]])}
                ${select("transportation_needed", es ? "¿Necesitas transporte?" : "Transportation needed?", [["", es ? "Selecciona" : "Choose"], ["Yes", es ? "Sí" : "Yes"], ["No", "No"]])}
                ${select("how_did_you_hear_about_us", es ? "¿Cómo nos encontraste?" : "How did you hear about us?", [["", es ? "Selecciona" : "Choose"], ["Referral", es ? "Recomendación" : "Referral"], ["Google Search", "Google Search"], ["Google Maps", "Google Maps"], ["Instagram", "Instagram"], ["TikTok", "TikTok"], ["YouTube", "YouTube"], ["Other", es ? "Otro" : "Other"]])}
                <div class="conversionField conversionField--wide">
                  <label for="message">${es ? "Preguntas o detalles del viaje" : "Questions or trip details"} <span>*</span></label>
                  <textarea id="message" name="message" required maxlength="2000" placeholder="${es ? "Cuéntanos sobre transporte, actividades, horarios o cualquier detalle útil." : "Tell us about transportation, activities, timing, or anything else that would help."}"></textarea>
                </div>
              </div>
              <div class="conversionFormFooter">
                <div data-tcfr-turnstile aria-label="${es ? "Verificación segura" : "Secure verification"}"></div>
                <button class="conversionSubmit" id="tcfrSubmitBtn" type="submit" ${analytics("booking_form_submit_click", "booking_form", p.pageType)}>${es ? "Enviar solicitud de disponibilidad" : "Send availability request"}</button>
              </div>
              <section class="conversionStatus" id="tcfrStatusCard" role="status" aria-live="polite" hidden>
                <strong id="tcfrStatusTitle"></strong>
                <span id="tcfrStatusText"></span>
              </section>
            </form>`;
}

function contactForm(p) {
  const es = p.lang === "es";
  return `<form id="tcfrContactForm" data-analytics-form="contact_form" data-attribution-ready="true">
              ${hiddenAttribution}
              <input name="form_type" type="hidden" value="contact" />
              <input name="lang" type="hidden" value="${p.lang}" />
              <input name="source_page" type="hidden" value="" />
              <div class="conversionFields">
                ${field("first_name", es ? "Nombre" : "First name", "text", true, es ? "Tu nombre" : "First name", "given-name")}
                ${field("last_name", es ? "Apellido" : "Last name", "text", true, es ? "Tu apellido" : "Last name", "family-name")}
                ${field("email", "Email", "email", true, es ? "tu@ejemplo.com" : "you@example.com", "email")}
                ${field("phone", es ? "Teléfono o WhatsApp" : "Phone or WhatsApp", "tel", false, es ? "+593 ..." : "+1 305 ...", "tel")}
                ${select("inquiry_type", es ? "Tipo de consulta" : "Inquiry type", [["", es ? "Selecciona" : "Choose"], ["General question", es ? "Pregunta general" : "General question"], ["Whole-house rental", es ? "Alquiler de casa completa" : "Whole-house rental"], ["Existing booking", es ? "Reserva existente" : "Existing booking"], ["Transportation and arrival", es ? "Transporte y llegada" : "Transportation and arrival"], ["Activities and stay planning", es ? "Actividades y planificación" : "Activities and stay planning"], ["Partnerships or other", es ? "Colaboraciones u otro" : "Partnerships or other"]])}
                ${select("how_did_you_hear_about_us", es ? "¿Cómo nos encontraste?" : "How did you hear about us?", [["", es ? "Selecciona" : "Choose"], ["Referral", es ? "Recomendación" : "Referral"], ["Google Search", "Google Search"], ["Google Maps", "Google Maps"], ["Instagram", "Instagram"], ["TikTok", "TikTok"], ["YouTube", "YouTube"], ["Other", es ? "Otro" : "Other"]])}
                <div class="conversionField conversionField--wide">
                  <label for="message">${es ? "Mensaje" : "Message"} <span>*</span></label>
                  <textarea id="message" name="message" required maxlength="2000" placeholder="${es ? "Cuéntanos qué quieres saber o planificar." : "Tell us what you would like to know or plan."}"></textarea>
                </div>
              </div>
              <div class="conversionFormFooter">
                <div data-tcfr-turnstile aria-label="${es ? "Verificación segura" : "Secure verification"}"></div>
                <button class="conversionSubmit" id="tcfrSubmitBtn" type="submit" ${analytics("contact_form_submit_click", "contact_form", p.pageType)}>${es ? "Enviar mensaje" : "Send message"}</button>
              </div>
              <section class="conversionStatus" id="tcfrStatus" aria-live="polite" hidden>
                <strong id="tcfrStatusTitle"></strong>
                <span id="tcfrStatusMsg"></span>
              </section>
            </form>`;
}

function field(id, label, type, required = false, placeholder = "", autocomplete = "") {
  const max = id === "email" ? 254 : id === "phone" || id === "phone_number" ? 50 : id === "first_name" || id === "last_name" ? 80 : 0;
  const autocapitalize = id === "first_name" || id === "last_name" ? ' autocapitalize="words"' : "";
  return `<div class="conversionField"><label for="${id}">${label}${required ? " <span>*</span>" : ""}</label><input id="${id}" name="${id}" type="${type}"${required ? " required" : ""}${max ? ` maxlength="${max}"` : ""}${placeholder ? ` placeholder="${placeholder}"` : ""}${autocomplete ? ` autocomplete="${autocomplete}"` : ""}${autocapitalize} /></div>`;
}

function select(id, label, options, required = false, extra = "") {
  return `<div class="conversionField ${extra}"><label for="${id}">${label}${required ? " <span>*</span>" : ""}</label><select id="${id}" name="${id}"${required ? " required" : ""}>${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}</select></div>`;
}

function schema(p) {
  const graph = [
    { "@type": ["LodgingBusiness", "BedAndBreakfast"], "@id": "https://thecloudforestretreat.com/#lodging", name: "The Cloud Forest Retreat", url: "https://thecloudforestretreat.com/", address: { "@type": "PostalAddress", addressRegion: "Pichincha", addressCountry: "EC" } },
    { "@type": p.type === "contact" ? "ContactPage" : "WebPage", "@id": `${p.canonical}#webpage`, url: p.canonical, name: p.title, description: p.description, inLanguage: p.lang, about: { "@id": "https://thecloudforestretreat.com/#lodging" } },
    { "@type": "BreadcrumbList", "@id": `${p.canonical}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: p.lang === "es" ? "Inicio" : "Home", item: `https://thecloudforestretreat.com${p.home}` }, { "@type": "ListItem", position: 2, name: p.current, item: p.canonical }] },
    { "@type": "FAQPage", "@id": `${p.canonical}#faq`, inLanguage: p.lang, mainEntity: p.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

function reviews(p) {
  const es = p.lang === "es";
  const quotes = [["Fantastic place to disconnect and get in touch with nature. This unique experience can be as customized as you want.", "V Arguello"], ["Absolutely magical experience at the cloud forest retreat. The views are incredible. The hosts are attentive, friendly, and welcoming.", "Abigail Martin"], ["Beautiful accommodations and meals with a lovely host and views that cannot be beat. Highly recommend.", "Pauline Witzke"]];
  return `<section class="conversionTrustGrid" data-analytics-section="guest_trust">
        <article class="conversionReviews">
          <div class="conversionReviews__head"><div><p class="conversionEyebrow conversionEyebrow--dark">${es ? "Opiniones de huéspedes" : "Guests love their stay"}</p><h2>${es ? "Confianza real antes de reservar" : "Real reassurance before you book"}</h2></div><div class="conversionRating" aria-label="Google rating"><strong data-tcfr-config-text="reputation.googleRating">5.0</strong> <span class="conversionRating__stars" aria-hidden="true">★★★★★</span> <small>(<span data-tcfr-config-text="reputation.googleReviewCount">9</span> ${es ? "reseñas" : "reviews"})</small></div></div>
          <div class="conversionQuotes">${quotes.map(([quote, name]) => `<blockquote class="conversionQuote"><div class="conversionQuote__stars" aria-label="5 out of 5 stars">★★★★★</div><p>“${quote}”</p><footer><strong>${name}</strong><span>Google review</span></footer></blockquote>`).join("")}</div>
          <div class="conversionReviewActions"><a href="https://g.page/r/CQq5wBqKgv0DEAE" data-tcfr-config-href="reputation.googleReviewsReadUrl" target="_blank" rel="noopener noreferrer">${es ? "Leer reseñas" : "Read reviews"}</a><a href="https://g.page/r/CQq5wBqKgv0DEAE/review" data-tcfr-config-href="reputation.googleReviewsWriteUrl" target="_blank" rel="noopener noreferrer">${es ? "Escribir una reseña" : "Write a review"}</a></div>
        </article>
        <aside class="conversionArrival"><p class="conversionEyebrow">${es ? "Cómo llegar" : "Getting here"}</p><h2>${es ? "Una llegada de montaña, planificada con confianza" : "A mountain arrival, planned with confidence"}</h2><p>${es ? "Conservamos la información práctica que los viajeros necesitan antes de comprometerse." : "We retain the practical details travelers need before committing."}</p><ul class="conversionArrival__list"><li><strong>${es ? "A unas dos horas de Quito" : "About two hours from Quito"}</strong><span>${es ? "El tiempo varía según origen, tráfico, clima y camino." : "Travel time varies with your starting point, traffic, weather, and road conditions."}</span></li><li><strong>${es ? "Apoyo con transporte" : "Transportation support"}</strong><span>${es ? "Comparte tus planes para conversar sobre opciones prácticas." : "Share your plans so we can discuss practical options."}</span></li><li><strong>${es ? "Orientación después de confirmar" : "Guidance after confirmation"}</strong><span>${es ? "Los huéspedes confirmados reciben ubicación e indicaciones." : "Confirmed guests receive location details and arrival guidance."}</span></li></ul></aside>
      </section>`;
}

function formatHtml(html) {
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const lines = html.replace(/>\s*</g, ">\n<").split("\n");
  let depth = 0;
  return lines.map((raw) => {
    const line = raw.trim();
    if (!line) return "";
    if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
    const rendered = `${"  ".repeat(depth)}${line}`;
    const opening = line.match(/^<([a-zA-Z][\w:-]*)\b[^>]*>/);
    if (opening) {
      const tag = opening[1].toLowerCase();
      const closesOnLine = new RegExp(`</${tag}>`, "i").test(line);
      if (!voidTags.has(tag) && !closesOnLine && !/\/>$/.test(line) && !/^<!/.test(line)) depth += 1;
    }
    return rendered;
  }).join("\n").replace(/\n{3,}/g, "\n\n").replace(/(<textarea[^>]*>)\s*(<\/textarea>)/g, "$1$2") + "\n";
}

function render(p) {
  const es = p.lang === "es";
  const enUrl = es ? p.counterpart : p.canonical;
  const esUrl = es ? p.canonical : p.counterpart;
  const pageLabel = p.type === "booking" ? (es ? "Reservas" : "Booking") : (es ? "Contacto" : "Contact");
  const form = p.type === "booking" ? bookingForm(p) : contactForm(p);
  const related = p.related.map(([label, href, analyticsLabel]) => `<a class="tcfr-related__link" href="${href}" ${analytics("internal_link_click", "related_content", p.pageType)}${analyticsLabel ? ` data-analytics-label="${analyticsLabel}"` : ""}>${label}</a>`).join("\n          ");
  return formatHtml(`<!DOCTYPE html>
<html lang="${p.lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${p.title}</title>
  <meta name="description" content="${p.description}" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <meta name="theme-color" content="#0D5925" />
  <link rel="canonical" href="${p.canonical}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="es" href="${esUrl}" />
  <link rel="alternate" hreflang="x-default" href="${enUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="The Cloud Forest Retreat" />
  <meta property="og:locale" content="${es ? "es_EC" : "en_US"}" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.description}" />
  <meta property="og:url" content="${p.canonical}" />
  <meta property="og:image" content="https://thecloudforestretreat.com${p.image}" />
  <meta property="og:image:alt" content="${p.imageAlt}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.title}" />
  <meta name="twitter:description" content="${p.description}" />
  <meta name="twitter:image" content="https://thecloudforestretreat.com${p.image}" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="/assets/css/site.css?v=2" />
  <link rel="stylesheet" href="/assets/css/header.css?v=5" />
  <link rel="stylesheet" href="/assets/css/global.css?v=4" />
  <link rel="stylesheet" href="/assets/css/footer.css?v=10" />
  <link rel="stylesheet" href="/assets/css/clusters/conversion.css?v=8" />
  <link rel="stylesheet" href="/assets/css/components/faq.css?v=2" />
  <script type="application/ld+json">
${schema(p)}
  </script>
  <script src="/assets/js/site-config.js?v=3"></script>
  <script defer src="/assets/js/head.js?v=2"></script>
</head>
<body data-page-language="${p.lang}" data-page-type="${p.pageType}" data-tcfr-cluster="conversion" data-tcfr-template="premium-conversion">
  <div id="siteHeader" data-current-lang="${p.lang}"></div>
  <nav class="rawLangLinks" aria-label="${es ? "Selector de idioma" : "Language switch"}">
    <a href="${enUrl}" lang="en" hreflang="en"${es ? "" : ' aria-current="page"'}>English</a>
    <a href="${esUrl}" lang="es" hreflang="es"${es ? ' aria-current="page"' : ""}>Español</a>
  </nav>

  <main class="conversionPage" aria-label="${pageLabel}">
    <nav class="conversionCrumbs" aria-label="Breadcrumb"><a href="${p.home}">${es ? "Inicio" : "Home"}</a><span aria-hidden="true">/</span><span aria-current="page">${p.current}</span></nav>
    <section class="conversionHero" data-analytics-section="${p.type}_hero">
      <div class="conversionHero__copy"><p class="conversionEyebrow">${p.eyebrow}</p><h1>${p.h1}</h1><p class="conversionHero__lead">${p.lead}</p><ul class="conversionHero__assurances">${p.assurances.map((item) => `<li>${item}</li>`).join("")}</ul></div>
      <div class="conversionHero__visual"><img src="${p.image}" alt="${p.imageAlt}" loading="eager" decoding="async" fetchpriority="high" /><div class="conversionHero__caption"><strong>${p.caption[0]}</strong><span>${p.caption[1]}</span></div></div>
    </section>
    <section class="conversionSectionHeading" data-analytics-section="${p.type}_introduction"><p class="conversionEyebrow conversionEyebrow--dark">${p.introEyebrow}</p><h2>${p.introTitle}</h2><p>${p.intro}</p></section>
    <section class="conversionWorkspace" data-analytics-section="${p.type}_form">
      <article class="conversionFormCard"><p class="conversionEyebrow conversionEyebrow--dark">${p.formEyebrow}</p><h2>${p.formTitle}</h2><p>${p.formIntro}</p>${form}</article>
      <aside class="conversionAside"><img class="conversionAside__image" src="${p.asideImage}" alt="${p.asideAlt}" loading="lazy" decoding="async" /><div class="conversionAside__content"><p class="conversionEyebrow conversionEyebrow--dark">${p.asideEyebrow}</p><h2>${p.asideTitle}</h2><p>${p.asideIntro}</p><ul class="conversionSummary">${p.asideItems.map(([title, text]) => `<li><strong>${title}</strong><span>${text}</span></li>`).join("")}</ul><a class="conversionAside__link" href="${p.asideLink[1]}" ${analytics("internal_link_click", "conversion_aside", p.pageType)}>${p.asideLink[0]}</a></div></aside>
    </section>
    ${reviews(p)}
    <section class="conversionSteps" data-analytics-section="${p.type}_process"><p class="conversionEyebrow">${p.stepsEyebrow}</p><h2>${p.stepsTitle}</h2><p>${p.stepsIntro}</p><div class="conversionSteps__grid">${p.steps.map(([title, text], index) => `<article class="conversionStep"><span>0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>
    <section class="conversionFaq tcfrFaq" data-analytics-section="faq"><div class="tcfrFaq__intro"><p class="conversionEyebrow conversionEyebrow--dark">${p.faqEyebrow}</p><h2>${p.faqTitle}</h2><p>${p.faqIntro}</p></div><div class="conversionFaq__list tcfrFaq__list">${p.faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
    <!-- TCFR_ARCHITECTURE_START -->
    <section class="tcfr-related" aria-labelledby="tcfr-related-title" data-analytics-section="related_content"><p class="tcfr-related__eyebrow">${es ? "Sigue explorando" : "Continue exploring"}</p><h2 class="tcfr-related__title" id="tcfr-related-title">${es ? "Planifica tu estadía en el bosque nublado" : "Plan your cloud forest stay"}</h2><div class="tcfr-related__grid">${related}</div><div class="tcfr-related__cta"><a class="btn primary" href="${es ? "/es/reservas/" : "/booking/"}" ${analytics("booking_cta_click", "related_content", p.pageType)}>${es ? "Consultar disponibilidad" : "Check availability"}</a><a class="btn secondary" href="${es ? "/es/contacto/" : "/contact/"}" ${analytics("contact_cta_click", "related_content", p.pageType)}>${es ? "Hacer una pregunta" : "Ask a question"}</a></div></section>
    <!-- TCFR_ARCHITECTURE_END -->
  </main>
  <div id="siteFooter"></div>
  <script src="/assets/js/attribution.js?v=1"></script>
  ${p.type === "booking" ? '<script src="/assets/js/booking-form.js?v=3"></script>' : '<script src="/assets/js/contact-form.js?v=6"></script>'}
  <script src="/assets/js/site.js?v=8"></script>
</body>
</html>`);
}

for (const page of pages) {
  await fs.writeFile(page.path, render(page));
  console.log(`updated ${page.path}`);
}
