// Wacht tot de pagina klaar is, anders vindt JavaScript de HTML nog niet.
document.addEventListener("DOMContentLoaded", () => {
  // Pak de contactlinks en het formulier.
  const whatsappLink = document.querySelector('a[href*="wa.me"]');
  const links = document.querySelectorAll(".social-link");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const messageTime = document.getElementById("messageTime");

  // Als iemand op WhatsApp klikt, wordt het nummer ook gekopieerd.
  if (whatsappLink) {
    whatsappLink.addEventListener("click", async () => {
      try {
        await navigator.clipboard?.writeText("5978734186");
      } catch {
        console.warn("Clipboard API not supported or permission denied.");
      }
    });
  }

  // Laat de social links een voor een rustig verschijnen.
  links.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(10px)";

    setTimeout(() => {
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, index * 120);
  });

  // Zet een bericht onder het formulier.
  const setStatus = (message, type) => {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove("success", "error");
    formStatus.classList.add(type);
  };

  // Check of de EmailJS codes al zijn ingevuld.
  const hasEmailJsConfig = () => {
    const publicKey = form?.dataset.emailjsPublicKey;
    const serviceId = form?.dataset.emailjsServiceId;
    const templateId = form?.dataset.emailjsTemplateId;

    return (
      window.emailjs &&
      publicKey &&
      serviceId &&
      templateId &&
      !publicKey.startsWith("YOUR_") &&
      !serviceId.startsWith("YOUR_") &&
      !templateId.startsWith("YOUR_")
    );
  };

  // Als EmailJS nog niet is ingesteld, opent de mailapp als backup.
  const openMailApp = () => {
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const recipient = form.dataset.email || "niquille5@gmail.com";
    const subject = encodeURIComponent(`Portfolio bericht van ${name}`);
    const body = encodeURIComponent(`Naam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}`);

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    setStatus("Je mailapp wordt geopend met je bericht.", "success");
  };

  // Als het formulier wordt verzonden, probeert de website eerst EmailJS.
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Check of alle verplichte velden goed zijn ingevuld.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Deze tijd kan in je EmailJS template gebruikt worden.
    if (messageTime) {
      messageTime.value = new Date().toLocaleString("nl-NL");
    }

    // Zonder ingevulde EmailJS codes blijft het formulier werken via mailapp.
    if (!hasEmailJsConfig()) {
      openMailApp();
      form.reset();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const publicKey = form.dataset.emailjsPublicKey;
    const serviceId = form.dataset.emailjsServiceId;
    const templateId = form.dataset.emailjsTemplateId;

    try {
      if (submitButton) submitButton.disabled = true;
      setStatus("Bericht wordt verzonden...", "success");

      // Stuur het formulier direct via EmailJS naar je inbox.
      await emailjs.sendForm(serviceId, templateId, form, { publicKey });

      form.reset();
      setStatus("Je bericht is verzonden.", "success");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("Verzenden lukt niet. Probeer het later opnieuw.", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});
