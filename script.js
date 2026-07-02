// Portfolio Julius Gerth
(function () {
  // Respecteer de animatie-voorkeur van de bezoeker.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Counter animation ────────────────────────────
  function countUp(el, target) {
    if (reducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  // ── Scroll reveal ────────────────────────────────
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        // Tel de getallen omhoog zodra de stats-strip in beeld komt
        if (e.target.classList.contains('stats-strip')) {
          e.target.querySelectorAll('.stat-number').forEach(el =>
            countUp(el, parseInt(el.textContent))
          );
        }
        revealObserver.unobserve(e.target);
      }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // ── Nav: blur on scroll + active section ─────────
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    backTop.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

  // ── Back to top ──────────────────────────────────
  backTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  );

  // ── Rotating tagline (tweetalig) ─────────────────
  const tagline = document.getElementById('heroTagline');
  const taglineSets = {
    nl: [
      'Communication & Multimedia Design student',
      'UX-designer',
      'Frontend-developer',
      'Creatieve denker'
    ],
    en: [
      'Communication & Multimedia Design student',
      'UX Designer',
      'Frontend Developer',
      'Creative thinker'
    ]
  };
  const phrasesFor = () => taglineSets[document.documentElement.lang] || taglineSets.nl;
  let i = 0;
  tagline.textContent = phrasesFor()[i];
  // Bij wisselen van taal direct de huidige zin in de juiste taal tonen.
  document.addEventListener('langchange', () => {
    tagline.textContent = phrasesFor()[i];
  });
  if (!reducedMotion) {
    setInterval(() => {
      tagline.classList.add('switching');
      setTimeout(() => {
        const phrases = phrasesFor();
        i = (i + 1) % phrases.length;
        tagline.textContent = phrases[i];
        tagline.classList.remove('switching');
      }, 300);
    }, 2800);
  }
})();
