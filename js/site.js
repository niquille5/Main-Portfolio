document.addEventListener("DOMContentLoaded", () => {
  const pages = [
    { file: "index.html", label: "Home" },
    { file: "work.html", label: "Projecten" },
    { file: "blog.html", label: "Over mij" },
    { file: "contact.html", label: "Contact" },
  ];
  const siteHeader = document.querySelector(".site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.querySelector(".main-nav");
  const navToggleLabel = document.querySelector(".nav-toggle-label");
  const navLinks = document.querySelectorAll(".main-nav a");
  let headerTicking = false;
  let pageTransitioning = false;
  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const welcomeEnter = document.getElementById("welcomeEnter");
  const welcomeEnterText = welcomeEnter?.querySelector(".welcome-enter-text");
  const welcomeStorage = window.sessionStorage;
  const welcomeStorageKey = "portfolioWelcomeSeen";
  const pageTransitionStorageKey = "portfolioPageTransition";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let welcomeClicked = false;

  const markPageTransition = () => {
    try {
      welcomeStorage.setItem(pageTransitionStorageKey, "true");
    } catch {
      // Navigation should continue even when storage is blocked.
    }
  };

  const clearPageTransition = () => {
    try {
      welcomeStorage.removeItem(pageTransitionStorageKey);
    } catch {
      // Nothing to clear when storage is unavailable.
    }
  };

  const openPortfolio = () => {
    if (!welcomeOverlay || !welcomeEnter || welcomeClicked) return;

    welcomeClicked = true;
    welcomeEnter.disabled = true;
    welcomeEnter.classList.add("is-clicked");
    welcomeEnter.setAttribute("aria-busy", "true");

    if (welcomeEnterText) {
      welcomeEnterText.textContent = "Opening...";
    }

    const finishWelcome = () => {
      try {
        welcomeStorage.setItem(welcomeStorageKey, "true");
      } catch {
        // Keep the welcome screen usable even when storage is blocked.
      }

      welcomeOverlay.hidden = true;
      welcomeOverlay.remove();
      document.body.classList.remove("welcome-active", "portfolio-entering");
    };

    window.setTimeout(() => {
      welcomeOverlay.classList.add("is-leaving", "welcome-leaving");
      document.body.classList.add("portfolio-entering");

      if (reduceMotion) {
        finishWelcome();
        return;
      }

      let finished = false;
      const safeFinish = () => {
        if (finished) return;
        finished = true;
        finishWelcome();
      };

      welcomeOverlay.addEventListener("animationend", (event) => {
        if (event.animationName === "welcome-overlay-cinematic-out") {
          safeFinish();
        }
      }, { once: true });

      window.setTimeout(safeFinish, 1500);
    }, reduceMotion ? 0 : 220);
  };

  if (welcomeOverlay && welcomeEnter) {
    let hasSeenWelcome = false;

    try {
      hasSeenWelcome = welcomeStorage.getItem(welcomeStorageKey) === "true";
    } catch {
      hasSeenWelcome = false;
    }

    if (hasSeenWelcome) {
      welcomeOverlay.hidden = true;
    } else {
      document.body.classList.add("welcome-active");
      window.setTimeout(() => welcomeEnter.focus(), 180);
    }

    welcomeEnter.addEventListener("click", openPortfolio);
    welcomeEnter.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPortfolio();
      }
    });
  }

  let shouldPlayPageArrival = false;

  try {
    shouldPlayPageArrival = welcomeStorage.getItem(pageTransitionStorageKey) === "true";
  } catch {
    shouldPlayPageArrival = false;
  }

  clearPageTransition();

  if (shouldPlayPageArrival && !reduceMotion) {
    document.body.classList.add("page-arriving");
    window.setTimeout(() => {
      document.body.classList.remove("page-arriving");
      document.documentElement.classList.remove("page-transition-incoming");
    }, 720);
  } else {
    document.documentElement.classList.remove("page-transition-incoming");
  }

  const isInternalPageLink = (link) => {
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return false;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    const isHtmlPage = url.pathname.endsWith(".html") || url.pathname.endsWith("/");
    const samePage = url.pathname === window.location.pathname && url.search === window.location.search;

    return isHtmlPage && !samePage;
  };

  const createPageTransitionBlock = () => {
    const block = document.createElement("div");
    block.className = "page-transition-block";
    block.setAttribute("aria-hidden", "true");
    document.body.append(block);
    return block;
  };

  const transitionToPage = (href) => {
    if (pageTransitioning) return;

    pageTransitioning = true;
    const block = createPageTransitionBlock();
    document.body.classList.add("page-transitioning");

    if (reduceMotion) {
      window.location.href = href;
      return;
    }

    let navigated = false;
    const goToPage = () => {
      if (navigated) return;
      navigated = true;
      markPageTransition();
      window.location.href = href;
    };

    block.addEventListener("animationend", (event) => {
      if (event.animationName === "page-transition-slide") {
        goToPage();
      }
    }, { once: true });

    window.setTimeout(goToPage, 820);
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!isInternalPageLink(link)) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (navToggle) {
      navToggle.checked = false;
      updateMobileMenuState();
    }

    transitionToPage(link.href);
  }, true);

  const updateHeaderState = () => {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const requestHeaderUpdate = () => {
    if (headerTicking) return;

    headerTicking = true;
    window.requestAnimationFrame(() => {
      updateHeaderState();
      headerTicking = false;
    });
  };

  const updateMobileMenuState = () => {
    const isOpen = Boolean(navToggle?.checked);

    navToggle?.setAttribute("aria-expanded", String(isOpen));
    navToggleLabel?.setAttribute("aria-expanded", String(isOpen));
    navMenu?.classList.toggle("is-open", isOpen);
    navToggleLabel?.classList.toggle("is-open", isOpen);
  };

  updateHeaderState();
  updateMobileMenuState();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  navToggle?.addEventListener("change", updateMobileMenuState);

  navToggleLabel?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!navToggle) return;

    navToggle.checked = !navToggle.checked;
    updateMobileMenuState();
  });

  navToggleLabel?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();

    if (!navToggle) return;

    navToggle.checked = !navToggle.checked;
    updateMobileMenuState();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navToggle) {
        navToggle.checked = false;
        updateMobileMenuState();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!navToggle?.checked) return;

    const target = event.target;
    const clickedInsideMenu = navMenu?.contains(target);
    const clickedToggle = navToggleLabel?.contains(target);

    if (!clickedInsideMenu && !clickedToggle) {
      navToggle.checked = false;
      updateMobileMenuState();
    }
  });

  const themeToggle = document.querySelector(".theme-toggle");
  const themeToggleText = themeToggle?.querySelector(".theme-toggle-text");
  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const getSystemTheme = () => (systemThemeQuery.matches ? "dark" : "light");
  let themeSwitching = false;

  const getSavedTheme = () => {
    try {
      return localStorage.getItem("portfolioTheme");
    } catch {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem("portfolioTheme", theme);
    } catch {
      return;
    }
  };

  const setTheme = (theme) => {
    const isDark = theme === "dark";

    document.documentElement.dataset.theme = theme;

    if (themeToggle) {
      if (themeToggleText) {
        themeToggleText.textContent = isDark ? "Light mode" : "Dark mode";
      }

      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Light mode aanzetten" : "Dark mode aanzetten");
    }
  };

  const switchThemeWithBlock = (nextTheme) => {
    if (themeSwitching) return;

    themeSwitching = true;
    themeToggle?.setAttribute("disabled", "");
    document.documentElement.classList.add("theme-changing");

    if (reduceMotion) {
      saveTheme(nextTheme);
      setTheme(nextTheme);
      document.documentElement.classList.remove("theme-changing");
      themeToggle?.removeAttribute("disabled");
      themeSwitching = false;
      return;
    }

    const finishThemeSwitch = () => {
      document.documentElement.classList.remove("theme-changing");
      themeToggle?.removeAttribute("disabled");
      themeSwitching = false;
    };

    window.setTimeout(() => {
      saveTheme(nextTheme);
      setTheme(nextTheme);
    }, 90);

    window.setTimeout(finishThemeSwitch, 700);
  };

  setTheme(getSavedTheme() || getSystemTheme());

  themeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme || getSystemTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    switchThemeWithBlock(nextTheme);
  });

  systemThemeQuery.addEventListener("change", () => {
    if (!getSavedTheme()) {
      setTheme(getSystemTheme());
    }
  });

  const revealItems = document.querySelectorAll(
    ".page-hero, .hero-panel, .skills-section, .summary-card, .visual-strip, .blog-container, .blog-sidebar, .about-photo-grid, .photo-wheel-section, .project-overview, .work-container, .project-card, .project-details div, .future-projects, .custom-project-card, .smyle-gallery img, .contact-container, .contact-method"
  );

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const isAlreadyInView = (item) => {
      const rect = item.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    };

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px" }
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal-item");

      if (isAlreadyInView(item)) {
        item.classList.add("is-visible");
        return;
      }

      revealObserver.observe(item);
    });
  }

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

  document.querySelectorAll("[data-photo-wheel]").forEach((slider) => {
    const stage = slider.querySelector(".photo-wheel-stage");
    const slides = Array.from(slider.querySelectorAll(".photo-wheel-slide"));
    const prevButton = slider.querySelector("[data-photo-prev]");
    const nextButton = slider.querySelector("[data-photo-next]");
    const caption = slider.querySelector("[data-photo-caption]");
    const dotsContainer = slider.querySelector("[data-photo-dots]");
    let activeIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    if (!stage || slides.length === 0) return;

    const wrapIndex = (index) => (index + slides.length) % slides.length;

    const updateSlider = () => {
      const previousIndex = wrapIndex(activeIndex - 1);
      const nextIndex = wrapIndex(activeIndex + 1);

      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === activeIndex);
        slide.classList.toggle("is-prev", index === previousIndex);
        slide.classList.toggle("is-next", index === nextIndex);
        slide.classList.toggle("is-far", index !== activeIndex && index !== previousIndex && index !== nextIndex);
        slide.setAttribute("aria-hidden", String(index !== activeIndex));
      });

      const activeCaption = slides[activeIndex].querySelector("figcaption")?.textContent || "";

      if (caption) {
        caption.textContent = activeCaption;
      }

      dotsContainer?.querySelectorAll(".photo-wheel-dot").forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
        dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
      });
    };

    const goToSlide = (index) => {
      activeIndex = wrapIndex(index);
      updateSlider();
    };

    if (dotsContainer) {
      dotsContainer.innerHTML = "";

      slides.forEach((slide, index) => {
        const dot = document.createElement("button");
        const dotLabel = slide.querySelector("figcaption")?.textContent || `Foto ${index + 1}`;

        dot.className = "photo-wheel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Toon ${dotLabel}`);
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.append(dot);
      });
    }

    prevButton?.addEventListener("click", () => goToSlide(activeIndex - 1));
    nextButton?.addEventListener("click", () => goToSlide(activeIndex + 1));

    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(activeIndex + 1);
      }
    });

    stage.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    stage.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;

      goToSlide(activeIndex + (deltaX < 0 ? 1 : -1));
    }, { passive: true });

    updateSlider();
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
