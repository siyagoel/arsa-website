const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const experienceItems = document.querySelectorAll(".experience-list li");
const carousel = document.querySelector("[data-carousel]");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
}

function closeMenu() {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
syncHeader();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  experienceItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 90}ms`;
    observer.observe(item);
  });
} else {
  experienceItems.forEach((item) => item.classList.add("is-visible"));
}

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const prevBtn = carousel.querySelector("[data-prev]");
  const nextBtn = carousel.querySelector("[data-next]");
  const dotsWrap = carousel.querySelector("[data-dots]");
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show slide ${i + 1}`);
    dot.addEventListener("click", () => showSlide(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".carousel-dot"));

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.toggleAttribute("hidden", !active);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  prevBtn.addEventListener("click", () => showSlide(index - 1));
  nextBtn.addEventListener("click", () => showSlide(index + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(index + 1);
    }
  });

  let touchStartX = 0;
  carousel.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );
  carousel.addEventListener(
    "touchend",
    (event) => {
      const delta = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) < 40) return;
      showSlide(delta > 0 ? index - 1 : index + 1);
    },
    { passive: true }
  );

  showSlide(0);
}
