const form = document.querySelector('#cateringForm');
const formStatus = document.querySelector('#formStatus');
const packageSelect = document.querySelector('#packageSelect');
const eventType = document.querySelector('#eventType');
const packageSummary = document.querySelector('#packageSummary');
const weddingOnly = document.querySelectorAll('.wedding-only');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

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
  const isWedding = type === 'wedding';
  packageSelect.value = isWedding ? 'wedding' : 'regular';

  weddingOnly.forEach((el) => {
    el.classList.toggle('is-hidden', !isWedding);
  });

  const summary = summaries[isWedding ? 'wedding' : 'regular'];
  packageSummary.innerHTML = `<strong>${summary.title}</strong><span>${summary.copy}</span>`;
}

packageSelect.addEventListener('change', (event) => setPackage(event.target.value));

eventType.addEventListener('change', (event) => {
  if (event.target.value === 'wedding') setPackage('wedding');
});

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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.classList.remove('error');

  if (!form.checkValidity()) {
    formStatus.textContent = 'Please complete the required fields before submitting.';
    formStatus.classList.add('error');
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Catering quote request:', data);

  formStatus.textContent =
    'Thank you — your catering request has been received. Our team will follow up with a personalized quote.';

  // For a real deployment, replace the demo behavior above with a POST request.
  // Example using your own endpoint:
  // fetch('/api/catering-request', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
});

// Subtle hero parallax for a more premium feel.
const hero = document.querySelector('.hero');

if (hero && window.matchMedia('(pointer: fine)').matches) {
  let rafId = null;

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 16;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 12;

    if (rafId) cancelAnimationFrame(rafId);

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

// Reveal elements smoothly while scrolling.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});