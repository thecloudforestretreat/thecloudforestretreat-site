/* /assets/js/contact-form.js
   The Cloud Forest Retreat contact form handler
   CSP-safe external script. No inline JavaScript required.
   v2: treats any 2xx response as success unless the API explicitly returns failure.
*/
(function(){
  "use strict";

  var COPY = {
    en: {
      sending: "Sending...",
      submit: "Submit",
      missingTokenTitle: "Something went wrong",
      missingTokenMsg: "Turnstile token missing. Please complete the verification and try again.",
      unableTitle: "Unable to send",
      defaultError: "Submission failed. Please try again.",
      networkError: "Network error. Please try again.",
      successTitle: "Message sent",
      successMsg: "Thank you. We received your message and sent a confirmation email. If you do not see it, please check your spam or promotions folder."
    },
    es: {
      sending: "Enviando...",
      submit: "Enviar",
      missingTokenTitle: "Algo salió mal",
      missingTokenMsg: "Falta la verificación de Turnstile. Complétala e intenta nuevamente.",
      unableTitle: "No se pudo enviar",
      defaultError: "No se pudo enviar el mensaje. Intenta nuevamente.",
      networkError: "Error de red. Intenta nuevamente.",
      successTitle: "Mensaje enviado",
      successMsg: "Gracias. Recibimos tu mensaje y te enviamos un email de confirmación. Si no lo ves, revisa spam o promociones."
    }
  };

  function ready(fn){
    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    }else{
      fn();
    }
  }

  function getLang(form){
    var input = form.querySelector('input[name="lang"]');
    var lang = input && input.value ? input.value : document.documentElement.lang || document.body.getAttribute("data-page-language") || "en";
    lang = String(lang).toLowerCase().slice(0, 2);
    return lang === "es" ? "es" : "en";
  }

  function capFirstOnly(value){
    var s = String(value || "").trim();
    if(!s) return "";
    s = s.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function capMessageFirstChar(value){
    var s = String(value || "");
    if(!s) return "";
    var i = 0;
    while(i < s.length && /\s/.test(s.charAt(i))){ i++; }
    if(i >= s.length) return s;
    return s.slice(0, i) + s.charAt(i).toUpperCase() + s.slice(i + 1);
  }

  function getStatusElements(){
    var statusBox = document.getElementById("tcfrStatus") || document.getElementById("tcfrStatusBox") || document.getElementById("tcfrContactStatusCard");
    var statusTitle = document.getElementById("tcfrStatusTitle");
    var statusMsg = document.getElementById("tcfrStatusMsg");

    if(statusBox && !statusTitle){
      statusTitle = statusBox.querySelector(".statusTitle") || statusBox.querySelector("h3");
    }
    if(statusBox && !statusMsg){
      statusMsg = statusBox.querySelector(".statusMsg") || statusBox.querySelector(".statusText") || statusBox.querySelector(".statusBody") || statusBox.querySelector("p");
    }

    return { box: statusBox, title: statusTitle, msg: statusMsg };
  }

  function setStatus(status, kind, title, msg){
    if(!status || !status.box) return;

    status.box.hidden = false;
    status.box.classList.add("show");
    status.box.setAttribute("role", kind === "error" ? "alert" : "status");
    status.box.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");

    if(status.title){ status.title.textContent = title || ""; }
    if(status.msg){ status.msg.textContent = msg || ""; }

    status.box.style.borderColor = kind === "error" ? "rgba(185,28,28,.25)" : "rgba(13,89,37,.22)";
    status.box.style.background = kind === "error" ? "rgba(254,226,226,.66)" : "rgba(220,252,231,.58)";
    if(status.title){ status.title.style.color = kind === "error" ? "#991b1b" : "#0D5925"; }
  }

  function track(eventName, params){
    params = params || {};
    params.page_type = document.body.getAttribute("data-page-type") || "contact_page";
    params.page_language = document.body.getAttribute("data-page-language") || document.documentElement.lang || "en";

    if(typeof window.gtag === "function"){
      window.gtag("event", eventName, params);
    }
  }

  function normalizeFields(form){
    var firstNameEl = form.querySelector("#first_name");
    var lastNameEl = form.querySelector("#last_name");
    var messageEl = form.querySelector("#message");

    if(firstNameEl) firstNameEl.value = capFirstOnly(firstNameEl.value);
    if(lastNameEl) lastNameEl.value = capFirstOnly(lastNameEl.value);
    if(messageEl) messageEl.value = capMessageFirstChar(messageEl.value);
  }

  async function readResponse(res){
    var contentType = res.headers.get("content-type") || "";

    if(contentType.indexOf("application/json") !== -1){
      return await res.json().catch(function(){ return {}; });
    }

    var text = await res.text().catch(function(){ return ""; });
    if(!text) return {};

    try{
      return JSON.parse(text);
    }catch(_err){
      return { message: text.slice(0, 300) };
    }
  }

  function getBackendMessage(data, fallback){
    if(!data) return fallback;
    return data.message || data.error || data.detail || data.reason || fallback;
  }

  function isExplicitFailure(data){
    if(!data || typeof data !== "object") return false;
    if(data.ok === false) return true;
    if(data.success === false) return true;
    if(String(data.status || "").toLowerCase() === "error") return true;
    if(String(data.status || "").toLowerCase() === "failed") return true;
    if(data.error) return true;
    return false;
  }

  ready(function(){
    var form = document.getElementById("tcfrContactForm");
    if(!form) return;

    var lang = getLang(form);
    var copy = COPY[lang];
    var status = getStatusElements();
    var submitBtn = form.querySelector('button[type="submit"]') || document.getElementById("tcfrSubmitBtn") || document.getElementById("tcfrContactSubmitBtn");
    var sourcePageEl = form.querySelector('input[name="source_page"]');

    if(sourcePageEl){ sourcePageEl.value = window.location.href; }

    ["#first_name", "#last_name"].forEach(function(selector){
      var el = form.querySelector(selector);
      if(el){
        el.addEventListener("blur", function(){ el.value = capFirstOnly(el.value); });
      }
    });

    var messageEl = form.querySelector("#message");
    if(messageEl){
      messageEl.addEventListener("blur", function(){ messageEl.value = capMessageFirstChar(messageEl.value); });
    }

    form.addEventListener("submit", async function(event){
      event.preventDefault();
      event.stopPropagation();

      if(!form.isConnected) return;
      normalizeFields(form);

      if(typeof form.reportValidity === "function" && !form.reportValidity()) return;

      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.textContent = copy.sending;
      }

      if(status.box){
        status.box.hidden = true;
        status.box.classList.remove("show");
      }

      try{
        var fd = new FormData(form);
        var token = fd.get("cf-turnstile-response");

        if(!token){
          setStatus(status, "error", copy.missingTokenTitle, copy.missingTokenMsg);
          track("form_submit_error", {
            event_label: "Turnstile token missing",
            label: "Turnstile token missing",
            form_name: "contact_form"
          });
          return;
        }

        var payload = {
          cf_secret: fd.get("cf_secret") || "",
          "cf-turnstile-response": token,
          first_name: fd.get("first_name") || "",
          last_name: fd.get("last_name") || "",
          email: fd.get("email") || "",
          phone: fd.get("phone") || "",
          message: fd.get("message") || "",
          how_did_you_hear_about_us: fd.get("how_did_you_hear_about_us") || "",
          source_page: fd.get("source_page") || window.location.href,
          lang: fd.get("lang") || lang
        };

        var res = await fetch("/api/contact", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        var data = await readResponse(res);

        /* Important: many simple contact endpoints return HTTP 200/204 with an empty body.
           That is success. Only treat the submission as failed when the HTTP status is not 2xx
           or when the API explicitly returns a failure flag. */
        var success = res.ok && !isExplicitFailure(data);

        if(!success){
          var backendMsg = getBackendMessage(data, copy.defaultError + " HTTP " + res.status + ".");
          setStatus(status, "error", copy.unableTitle, backendMsg);
          track("form_submit_error", {
            event_label: backendMsg,
            label: backendMsg,
            form_name: "contact_form",
            http_status: res.status
          });
          return;
        }

        setStatus(status, "success", copy.successTitle, copy.successMsg);
        track("form_submit_success", {
          event_label: "Contact form submitted",
          label: "Contact form submitted",
          form_name: "contact_form",
          http_status: res.status
        });

        if(window.turnstile && typeof window.turnstile.reset === "function"){
          try{ window.turnstile.reset(); }catch(_err){}
        }
      }catch(err){
        setStatus(status, "error", copy.unableTitle, copy.networkError);
        track("form_submit_error", {
          event_label: "Network error",
          label: "Network error",
          form_name: "contact_form"
        });
      }finally{
        if(submitBtn){
          submitBtn.disabled = false;
          submitBtn.textContent = copy.submit;
        }
      }
    });
  });
})();
