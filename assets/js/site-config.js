(function () {
  "use strict";

  var existing = window.TCFR_CONFIG || {};
  window.TCFR_CONFIG = Object.assign({
    siteName: "The Cloud Forest Retreat",
    canonicalOrigin: "https://thecloudforestretreat.com",
    defaultLanguage: "en",
    supportedLanguages: ["en", "es"],
    whatsappNumber: "13054585402",
    whatsapp: {
      enabled: true,
      number: "13054585402",
      imageDesktop: "/assets/images/icons/tcfr_widget_whatsapp_03.png",
      imageMobile: "/assets/images/icons/tcfr_widget_whatsapp_03.png",
      messages: {
        en: {
          title: "Chat with us on WhatsApp",
          actions: [
            { label: "Check availability", message: "Hi! I want to check availability.\n\nPage: {url}" },
            { label: "Book a reservation", message: "Hi! I want to book a reservation.\n\nPage: {url}" },
            { label: "Transportation", message: "Hi! I have a transportation question.\n\nPage: {url}" },
            { label: "Ask a question", message: "Hi! I have a question.\n\nPage: {url}" }
          ]
        },
        es: {
          title: "Habla con nosotros por WhatsApp",
          actions: [
            { label: "Consultar disponibilidad", message: "Hola. Quiero consultar disponibilidad.\n\nPagina: {url}" },
            { label: "Reservar", message: "Hola. Quiero reservar.\n\nPagina: {url}" },
            { label: "Transporte", message: "Hola. Tengo una pregunta sobre transporte.\n\nPagina: {url}" },
            { label: "Hacer una pregunta", message: "Hola. Tengo una pregunta.\n\nPagina: {url}" }
          ]
        }
      }
    },
    ga4MeasurementId: "G-D3W4SP5MGX",
    gtmContainerId: "GTM-KJ67MZ2C",
    attributionStorageDays: 90,
    analyticsDebug: false,
    reputation: {
      googleRating: "5.0",
      googleReviewCount: "9",
      googleReviewsReadUrl: "https://g.page/r/CQq5wBqKgv0DEAE",
      googleReviewsWriteUrl: "https://g.page/r/CQq5wBqKgv0DEAE/review"
    },
    forms: {
      bookingEndpoint: "/api/booking",
      contactEndpoint: "/api/contact",
      turnstile: {
        enabled: true,
        siteKey: "0x4AAAAAACauNy6DfCUnIJhS",
        scriptUrl: "https://challenges.cloudflare.com/turnstile/v0/api.js"
      }
    },
    bookingProviders: {
      property: {
        airbnb: "",
        booking: "",
        expedia: "https://www.expedia.com/Quito-Hotels-Stay-In-A-UNESCO-Biosphere-Reserve-Nature.h114399386.Hotel-Information"
      },
      panoramicSuite: {
        airbnb: "",
        booking: "",
        expedia: "https://www.expedia.com/Quito-Hotels-Luxurious-Panoramic-Suite-At-The-Cloud-Forest-Retreat-W-Views-Modern-Comforts.h114674195.Hotel-Information"
      },
      sunriseRoom: {
        airbnb: "",
        booking: "",
        expedia: "https://www.expedia.com/Quito-Hotels-Sunrise-Room-At-The-Cloud-Forest-Retreat.h114675896.Hotel-Information"
      },
      sunsetRoom: {
        airbnb: "",
        booking: "",
        expedia: "https://www.expedia.com/Quito-Hotels-Sunset-Room-At-The-Cloud-Forest-Retreat.h114674265.Hotel-Information"
      }
    },
    social: {
      instagram: "https://www.instagram.com/thecloudforestretreat/",
      tiktok: "https://www.tiktok.com/@thecloudforestretreat",
      facebook: "https://www.facebook.com/profile.php?id=61569374962807",
      youtube: "https://youtube.com/@thecloudforestretreat",
      x: "https://x.com/CloudForest___",
      googleReviews: "https://g.page/r/CQq5wBqKgv0DEAE/review"
    }
  }, existing);
})();
