document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".project-card img, .smyle-gallery img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("closeBtn");
  let lastFocusedImage = null;

  if (!lightbox || !lightboxImg || images.length === 0) return;

  const closeLightbox = () => {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "Vergrote projectafbeelding";
    lastFocusedImage?.focus?.();
  };

  images.forEach((img) => {
    img.tabIndex = 0;

    img.addEventListener("click", () => {
      lastFocusedImage = img;
      lightbox.style.display = "flex";
      lightbox.setAttribute("aria-hidden", "false");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "Vergrote projectafbeelding";
      closeBtn?.focus();
    });

    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        img.click();
      }
    });
  });

  closeBtn?.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
});
