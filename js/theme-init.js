(() => {
  const getSavedTheme = () => {
    try {
      return localStorage.getItem("portfolioTheme");
    } catch {
      return null;
    }
  };

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = getSavedTheme() || systemTheme;

  try {
    const isIncomingPageTransition = sessionStorage.getItem("portfolioPageTransition") === "true";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isIncomingPageTransition && !reduceMotion) {
      document.documentElement.classList.add("page-transition-incoming");
    }
  } catch {
    // Theme setup should never block the page if storage is unavailable.
  }
})();
