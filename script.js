const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setYear() {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function setupPreloader() {
  const preloader = qs(".preloader");
  if (!preloader) return;

  const hide = () => preloader.classList.add("hidden");
  window.addEventListener("load", () => {
    window.setTimeout(hide, 2100);
  });
}

function setupNav() {
  const nav = qs("nav");
  const hamburger = qs(".hamburger");
  const links = qs(".nav-links");
  if (!nav || !hamburger || !links) return;

  const setScrolled = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  };
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  const closeMenu = () => {
    hamburger.classList.remove("active");
    links.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    hamburger.classList.add("active");
    links.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = links.classList.contains("open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  qsa("a", links).forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

function setupReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReduced.matches) {
    qsa(".reveal, .reveal-left, .menu-card").forEach((el) => {
      el.classList.add("visible");
    });
    return;
  }

  const targets = qsa(".reveal, .reveal-left");
  if (!targets.length) return;
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );

  targets.forEach((el) => io.observe(el));
}

function setupMenuTabs() {
  const tabs = qsa(".menu-tab");
  const cards = qsa(".menu-card");
  const grid = qs(".menu-grid");
  if (!tabs.length || !cards.length || !grid) return;
  grid.classList.add("enhanced");

  const setActiveTab = (active) => {
    tabs.forEach((t) => {
      const isActive = t === active;
      t.classList.toggle("active", isActive);
      t.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const applyFilter = (filter) => {
    cards.forEach((card) => {
      card.classList.remove("visible");
      const match = filter === "all" || card.dataset.category === filter;
      card.style.display = match ? "" : "none";
    });

    const visibleCards = cards.filter((c) => c.style.display !== "none");
    visibleCards.forEach((card, idx) => {
      window.setTimeout(() => card.classList.add("visible"), 80 + idx * 70);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab);
      applyFilter(tab.dataset.filter || "all");
    });
  });

  applyFilter("all");
}

setYear();
setupPreloader();
setupNav();
setupReveal();
setupMenuTabs();
