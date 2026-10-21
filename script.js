document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // CONFIGURACIÓN DEL EVENTO
  // Cambia aquí la fecha cuando sea necesario.
  // Formato: AAAA-MM-DDTHH:mm:ss-05:00
  // ========================================

  const EVENT_DATE = "2026-12-20T07:00:00-05:00";
  const WHATSAPP_NUMBER = "573001640581";

  const eventDate = new Date(EVENT_DATE);

  // ========================================
  // FECHA DEL EVENTO
  // ========================================

  const eventDateLabel = document.getElementById("eventDateLabel");

  if (!Number.isNaN(eventDate.getTime())) {
    eventDateLabel.textContent = new Intl.DateTimeFormat("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(eventDate);

    // Capitalizar la primera letra.
    eventDateLabel.textContent =
      eventDateLabel.textContent.charAt(0).toUpperCase() +
      eventDateLabel.textContent.slice(1);
  }

  // ========================================
  // CUENTA REGRESIVA
  // ========================================

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const countdownMessage =
    document.getElementById("countdownMessage");

  const pad = (number) => String(number).padStart(2, "0");

  function updateCountdown() {
    if (Number.isNaN(eventDate.getTime())) {
      countdownMessage.textContent =
        "Configura una fecha válida para la carrera.";
      return;
    }

    const now = Date.now();
    const difference = eventDate.getTime() - now;

    if (difference <= 0) {
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      countdownMessage.textContent =
        difference > -86400000
          ? "¡Hoy es el gran día! 💚"
          : "¡Gracias por ser parte de esta causa solidaria!";

      return;
    }

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    daysElement.textContent = pad(days);
    hoursElement.textContent = pad(hours);
    minutesElement.textContent = pad(minutes);
    secondsElement.textContent = pad(seconds);

    countdownMessage.textContent =
      "¡Cada día estamos más cerca de la meta! 💚";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ========================================
  // MENÚ RESPONSIVE PARA CELULARES
  // ========================================

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  function closeMenu() {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.textContent = "☰";
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // ========================================
  // SELECCIÓN RÁPIDA DE CATEGORÍAS
  // ========================================

  const categorySelect = document.getElementById("category");

  document.querySelectorAll("[data-category]").forEach((link) => {
    link.addEventListener("click", () => {
      categorySelect.value = link.dataset.category;
    });
  });

  // ========================================
  // VALIDACIÓN DE FECHA DE NACIMIENTO
  // ========================================

  const birthDateInput = document.getElementById("birthDate");

  const today = new Date();
  const todayLocal = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  birthDateInput.max = todayLocal;

  // ========================================
  // FORMULARIO DE INSCRIPCIÓN
  // ========================================

  const registrationForm =
    document.getElementById("registrationForm");

  const formMessage = document.getElementById("formMessage");

  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formMessage.textContent = "";

    if (!registrationForm.checkValidity()) {
      registrationForm.reportValidity();
      return;
    }

    const formData = new FormData(registrationForm);

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const category = String(formData.get("category") || "");
    const shirtSize = String(formData.get("shirtSize") || "");

    const birthDate = String(formData.get("birthDate") || "");

    if (birthDate && birthDate > todayLocal) {
      formMessage.textContent =
        "La fecha de nacimiento no puede ser futura.";
      birthDateInput.focus();
      return;
    }

    if (!fullName || !email || !phone || !category || !shirtSize) {
      formMessage.textContent =
        "Revisa los campos obligatorios antes de continuar.";
      return;
    }

    // Por privacidad, no se incluyen en el mensaje de WhatsApp
    // el documento de identidad ni la fecha de nacimiento.
    // Tampoco se envían automáticamente el correo ni el teléfono.

    const message = [
      "¡Hola, Fundación Manos Unidas! 💚",
      "",
      "Quiero continuar mi inscripción a la Gran Carrera Solidaria.",
      "",
      "Nombre: " + fullName,
      "Categoría: " + category,
      "Talla de camiseta: " + shirtSize,
      "",
      "Quisiera conocer los pasos siguientes para confirmar mi inscripción.",
      "",
      "¡Gracias!"
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    formMessage.textContent =
      "Abriendo WhatsApp para continuar tu inscripción...";

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });

  // ========================================
  // AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
  // ========================================

  document.getElementById("currentYear").textContent =
    new Date().getFullYear();
});