document.addEventListener("DOMContentLoaded", () => {
  const pages = [
    { file: "index.html", label: "Home" },
    { file: "blog.html", label: "Blog" },
    { file: "work.html", label: "Projecten" },
    { file: "contact.html", label: "Contact" },
  ];

  const themeToggle = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("portfolioTheme");

  const setTheme = (theme) => {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    if (themeToggle) {
      themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Light mode aanzetten" : "Dark mode aanzetten");
    }
  };

  setTheme(savedTheme === "dark" ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem("portfolioTheme", nextTheme);
    setTheme(nextTheme);
  });

  const skillButtons = document.querySelectorAll(".skill-button");
  const skillDescription = document.getElementById("skillDescription");

  skillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      skillButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      if (skillDescription) {
        skillDescription.textContent = button.dataset.skill || "";
      }
    });
  });

  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const currentIndex = pages.findIndex((page) => page.file === currentFile);

  if (currentIndex === -1) return;

  const previousPage = pages[(currentIndex - 1 + pages.length) % pages.length];
  const nextPage = pages[(currentIndex + 1) % pages.length];
  const pager = document.createElement("nav");
  pager.className = "page-nav";
  pager.setAttribute("aria-label", "Pagina navigatie");
  pager.innerHTML = `
    <a href="${previousPage.file}" data-slide="prev" aria-label="Ga terug naar ${previousPage.label}">
      <span class="page-nav-copy">
        <span>Back</span>
        <strong>${previousPage.label}</strong>
      </span>
    </a>
    <a href="${nextPage.file}" data-slide="next" aria-label="Ga naar ${nextPage.label}">
      <span class="page-nav-copy">
        <span>Next</span>
        <strong>${nextPage.label}</strong>
      </span>
    </a>
  `;

  const footer = document.querySelector(".footer");

  if (footer) {
    footer.before(pager);
  } else {
    document.body.appendChild(pager);
  }

  pager.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.add(link.dataset.slide === "next" ? "slide-out-next" : "slide-out-prev");
      setTimeout(() => {
        window.location.href = link.href;
      }, 260);
    });
  });
});
