const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const brand = document.querySelector(".brand");

brand?.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.history.replaceState(null, "", "#top");
});

navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
  navToggle.textContent = open ? "×" : "☰";
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    if (navToggle) navToggle.textContent = "☰";
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();

const facilityCards = [...document.querySelectorAll(".facility-card")];
let facilityIndex = 0;
let facilityTimer = null;
let facilityPaused = false;

function updateFacilityCards(activeIndex) {
  facilityCards.forEach((card, index) => {
    const isActive = index === activeIndex;
    card.classList.toggle("is-active", isActive);
    card.classList.toggle("is-dimmed", !isActive);
    card.classList.toggle("is-hovered", false);
  });
}

function startFacilityCycle() {
  clearInterval(facilityTimer);
  facilityTimer = setInterval(() => {
    if (facilityPaused) return;
    facilityIndex = (facilityIndex + 1) % facilityCards.length;
    updateFacilityCards(facilityIndex);
  }, 1800);
}

if (facilityCards.length) {
  updateFacilityCards(facilityIndex);
  startFacilityCycle();

  facilityCards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      facilityPaused = true;
      clearInterval(facilityTimer);
      facilityIndex = index;
      facilityCards.forEach((item, itemIndex) => {
        const isActive = itemIndex === index;
        item.classList.toggle("is-active", isActive);
        item.classList.toggle("is-dimmed", !isActive);
        item.classList.toggle("is-hovered", isActive);
      });
    });

    card.addEventListener("mouseleave", () => {
      facilityPaused = false;
      facilityIndex = index;
      updateFacilityCards(facilityIndex);
      startFacilityCycle();
    });
  });
}

const yearsServedElements = document.querySelectorAll(".years-served");

function calculateYearsSince(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  const startDate = new Date(year, month - 1, day);
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  const hasNotReachedAnniversary =
    now.getMonth() < startDate.getMonth() ||
    (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate());

  if (hasNotReachedAnniversary) {
    years -= 1;
  }

  return years;
}

function animateCounter(el, target) {
  if (!el) return;

  const start = 0;
  const duration = 1200;
  const startTime = performance.now();

  function updateFrame(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(start + (target - start) * eased);

    el.textContent = `${currentValue}+`;

    if (progress < 1) {
      requestAnimationFrame(updateFrame);
    }
  }

  requestAnimationFrame(updateFrame);
}

const startDate = "20/09/2017";
yearsServedElements.forEach((el) => animateCounter(el, calculateYearsSince(startDate)));

const form = document.getElementById("contactForm");
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name")?.trim();
  const phone = data.get("phone")?.trim() || "Not provided";
  const email = data.get("email")?.trim();
  const message = data.get("message")?.trim();

  const subject = encodeURIComponent(`Website enquiry from ${name}`);
  const body = encodeURIComponent(
`Hello Peridot Foundation,

My name is ${name}.
Phone: ${phone}
Email: ${email}

Message:
${message}

Sent from the Peridot Foundation website.`
  );

  window.location.href =
    `mailto:peridotfoundationrehab@gmail.com?subject=${subject}&body=${body}`;

  const status = form.querySelector(".form-status");
  if (status) {
    status.textContent = "Your email application should open shortly.";
  }
});
