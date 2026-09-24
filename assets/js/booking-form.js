(function () {
  "use strict";

  var COPY = {
    en: {
      sending: "Sending...",
      submit: "Send availability request",
      required: "Please complete all required fields.",
      verification: "Please complete the security verification.",
      errorTitle: "We could not send your request.",
      error: "Please try again or contact us on WhatsApp.",
      successTitle: "Your request has been sent.",
      success: "We will review the details and reply with availability and next steps."
    },
    es: {
      sending: "Enviando...",
      submit: "Enviar solicitud de disponibilidad",
      required: "Completa todos los campos obligatorios.",
      verification: "Completa la verificación de seguridad.",
      errorTitle: "No pudimos enviar tu solicitud.",
      error: "Intenta de nuevo o contáctanos por WhatsApp.",
      successTitle: "Tu solicitud fue enviada.",
      success: "Revisaremos los detalles y responderemos con disponibilidad y próximos pasos."
    }
  };

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function track(name, data) {
    if (typeof window.gtag === "function") window.gtag("event", name, data || {});
  }

  ready(function () {
    var form = document.getElementById("tcfrBookingForm");
    if (!form || form.dataset.bookingFormBound === "true") return;
    form.dataset.bookingFormBound = "true";

    var lang = (form.querySelector('[name="lang"]') || {}).value === "es" ? "es" : "en";
    var copy = COPY[lang];
    var button = document.getElementById("tcfrSubmitBtn");
    var status = document.getElementById("tcfrStatusCard");
    var title = document.getElementById("tcfrStatusTitle");
    var message = document.getElementById("tcfrStatusText");
    var start = document.getElementById("date_start");
    var end = document.getElementById("date_end");
    var dates = document.getElementById("dates_of_visit");
    var source = document.getElementById("source_page");
    var agent = document.getElementById("user_agent");

    function today() {
      var now = new Date();
      var pad = function (value) { return String(value).padStart(2, "0"); };
      return now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    }

    function syncDates() {
      if (start) start.min = today();
      if (end) {
        end.min = start && start.value ? start.value : today();
        if (end.value && end.value < end.min) end.value = "";
      }
      if (dates) {
        var first = start ? start.value : "";
        var last = end && end.value ? end.value : first;
        dates.value = first ? first + " to " + last : "";
      }
    }

    function show(kind, heading, text) {
      if (!status) return;
      status.hidden = false;
      status.classList.toggle("is-error", kind === "error");
      if (title) title.textContent = heading;
      if (message) message.textContent = text;
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (start) start.addEventListener("change", syncDates);
    if (end) end.addEventListener("change", syncDates);
    syncDates();
    if (source) source.value = window.location.href;
    if (agent) agent.value = navigator.userAgent;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      syncDates();
      if (!form.reportValidity()) {
        show("error", copy.errorTitle, copy.required);
        return;
      }

      var payload = new FormData(form);
      if (!String(payload.get("cf-turnstile-response") || "").trim()) {
        show("error", copy.errorTitle, copy.verification);
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = copy.sending;
      }

      try {
        var config = window.TCFR_CONFIG || {};
        var endpoint = (config.forms && config.forms.bookingEndpoint) || "/api/booking";
        var response = await fetch(endpoint, { method: "POST", body: payload, credentials: "same-origin" });
        var data = await response.json().catch(function () { return {}; });
        if (!response.ok || data.ok === false) throw new Error(data.message || data.error || copy.error);
        show("success", copy.successTitle, copy.success);
        track("form_submit_success", { form_name: "booking_form", page_language: lang, http_status: response.status });
        form.reset();
        syncDates();
        if (source) source.value = window.location.href;
        if (agent) agent.value = navigator.userAgent;
        if (window.turnstile && typeof window.turnstile.reset === "function") window.turnstile.reset();
      } catch (error) {
        show("error", copy.errorTitle, error && error.message ? error.message : copy.error);
        track("form_submit_error", { form_name: "booking_form", page_language: lang });
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = copy.submit;
        }
      }
    });
  });
})();
