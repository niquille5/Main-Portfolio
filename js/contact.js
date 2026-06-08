document.addEventListener("DOMContentLoaded", () => {
  const whatsappLink = document.querySelector('a[href*="wa.me"]');
  const links = document.querySelectorAll(".social-link");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const messageTime = document.getElementById("messageTime");

  if (whatsappLink) {
    whatsappLink.addEventListener("click", async () => {
      try {
        await navigator.clipboard?.writeText("5978734186");
      } catch {
        console.warn("Clipboard API not supported or permission denied.");
      }
    });
  }

  links.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(10px)";

    setTimeout(() => {
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, index * 120);
  });

  const setStatus = (message, type) => {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove("success", "error");
    formStatus.classList.add(type);
  };

  const setSubmitLoading = (button, isLoading) => {
    if (!button) return;

    if (!button.dataset.defaultText) {
      button.dataset.defaultText = button.textContent;
    }

    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
    button.setAttribute("aria-busy", String(isLoading));
    button.textContent = isLoading ? "Verzenden..." : button.dataset.defaultText;
  };

  const hasEmailJsConfig = () => {
    const publicKey = form?.dataset.emailjsPublicKey;
    const serviceId = form?.dataset.emailjsServiceId;
    const templateId = form?.dataset.emailjsTemplateId;

    return (
      window.emailjs &&
      publicKey &&
      serviceId &&
      templateId
    );
  };

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

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (messageTime) {
      messageTime.value = new Date().toLocaleString("nl-NL");
    }

    const submitButton = form.querySelector('button[type="submit"]');

    if (!hasEmailJsConfig()) {
      setSubmitLoading(submitButton, true);
      openMailApp();
      form.reset();
      setSubmitLoading(submitButton, false);
      return;
    }

    const publicKey = form.dataset.emailjsPublicKey;
    const serviceId = form.dataset.emailjsServiceId;
    const templateId = form.dataset.emailjsTemplateId;

    try {
      setSubmitLoading(submitButton, true);
      setStatus("Bericht wordt verzonden...", "success");

      await emailjs.sendForm(serviceId, templateId, form, { publicKey });

      form.reset();
      setStatus("Je bericht is verzonden.", "success");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("Verzenden lukt niet. Probeer het later opnieuw.", "error");
    } finally {
      setSubmitLoading(submitButton, false);
    }
  });
});
