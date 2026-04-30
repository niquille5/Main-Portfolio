
document.addEventListener("DOMContentLoaded", () => {

  const images = document.querySelectorAll(".project-card img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("closeBtn");


  if (!lightbox || !lightboxImg || images.length === 0) return;

  // Sluit de grote foto.
  const closeLightbox = () => {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  };


  images.forEach((img) => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightbox.setAttribute("aria-hidden", "false");
      lightboxImg.src = img.src;
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
