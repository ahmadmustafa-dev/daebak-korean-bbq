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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hide, { once: true });
  } else {
    requestAnimationFrame(hide);
  }
  setTimeout(hide, 700);
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
    qsa(".reveal, .reveal-left").forEach((el) => {
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

function setupCleanLinks() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = id === "#top" ? document.body : qs(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced.matches ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  });
}

setYear();
setupPreloader();
setupNav();
setupReveal();
setupCleanLinks();
