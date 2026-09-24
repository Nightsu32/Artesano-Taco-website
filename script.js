const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Elegant reveal-on-scroll animation used on both pages.
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Very subtle pointer parallax — no bouncing/cartoon motion.
const hero = document.querySelector('.home-hero, .hero');
if (hero && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let rafId;
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      hero.style.setProperty('--hero-x', `${x}px`);
      hero.style.setProperty('--hero-y', `${y}px`);
    });
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--hero-x', '0px');
    hero.style.setProperty('--hero-y', '0px');
  });
}

// Catering page package behavior.
const form = document.querySelector('#cateringForm');
const formStatus = document.querySelector('#formStatus');
const packageSelect = document.querySelector('#packageSelect');
const eventType = document.querySelector('#eventType');
const packageSummary = document.querySelector('#packageSummary');
const weddingOnly = document.querySelectorAll('.wedding-only');

const summaries = {
  regular: {
    title: 'Regular Catering',
    copy: 'Current minimum $800 + tax • Approximately $20/person • 30–40 guest starting range'
  },
  wedding: {
    title: 'Wedding Catering',
    copy: '$29/person + tax & gratuity • 40-person minimum • Premium upgrades and appetizers available'
  }
};

function setPackage(type) {
  if (!packageSelect) return;
  const isWedding = type === 'wedding';
  packageSelect.value = isWedding ? 'wedding' : 'regular';
  weddingOnly.forEach((el) => el.classList.toggle('is-hidden', !isWedding));

  if (packageSummary) {
    const summary = summaries[isWedding ? 'wedding' : 'regular'];
    packageSummary.innerHTML = `<strong>${summary.title}</strong><span>${summary.copy}</span>`;
  }
}

if (packageSelect) {
  packageSelect.addEventListener('change', (event) => setPackage(event.target.value));
}

if (eventType) {
  eventType.addEventListener('change', (event) => {
    if (event.target.value === 'wedding') setPackage('wedding');
  });
}

const eventDate = form?.querySelector('input[name="eventDate"]');
if (eventDate) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  eventDate.min = `${yyyy}-${mm}-${dd}`;
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus?.classList.remove('error');

    if (!form.checkValidity()) {
      if (formStatus) {
        formStatus.textContent = 'Please complete the required fields before submitting.';
        formStatus.classList.add('error');
      }
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.log('DEMO catering quote request:', data);

    if (formStatus) {
      formStatus.textContent = 'Demo complete — this request is ready to connect to the business email after approval.';
    }
  });
}
