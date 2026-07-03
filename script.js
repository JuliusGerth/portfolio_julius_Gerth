// Portfolio Julius Gerth
// De letter-animatie, roterende tagline en scroll-voortgangsbalk zijn pure CSS;
// hier staat alleen wat écht JavaScript nodig heeft (muispositie en observers).
(function () {
  // Respecteer de animatie-voorkeur van de bezoeker.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Hero: blobs volgen de muis subtiel ───────────
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if (hero && heroBg && !reducedMotion) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroBg.style.transform = `translate(${(x * 26).toFixed(1)}px, ${(y * 18).toFixed(1)}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroBg.style.transform = '';
    });
  }

  // ── Projectkaarten: 3D-tilt met de muis ──────────
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(800px) translateY(-4px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

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

  // Voortgangsbalk is scroll-gedreven CSS; alleen bijspringen
  // in browsers die animation-timeline nog niet kennen.
  const scrollProgress = document.getElementById('scrollProgress');
  const progressNeedsJs = scrollProgress &&
    !(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()'));

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    backTop.classList.toggle('visible', window.scrollY > 300);
    if (progressNeedsJs) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
})();
