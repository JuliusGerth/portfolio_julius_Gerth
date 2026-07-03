// Zelf-vertellende demo — gedeeld door projectpagina's met een demo-GIF (api.html, hackathon.html).
// Progressive enhancement: zonder dit script blijft de <ol> een gewone genummerde lijst
// naast de (statische) screenshot. Met 'reduced motion' aan doen we bewust niets —
// de GIF valt dan al terug op de screenshot via <picture>, en de lijst vertelt het verhaal.
//
// Gebruik: <figure data-demo data-loop="<luslengte in s>"> met .demo-beats <li data-start="<s>">.
// De luslengte lees je uit de GIF zelf (som van de frame-delays).
(function () {
  var fig = document.querySelector('[data-demo]');
  if (!fig) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce && reduce.matches) return;

  // Luslengte is verplicht: zonder echte duur kunnen we niet synchroon vertellen.
  var loop = parseFloat(fig.getAttribute('data-loop'));
  if (!loop || loop <= 0) return;

  var stage = fig.querySelector('.demo-stage');
  var caption = fig.querySelector('.demo-caption');
  var capNum = fig.querySelector('.demo-caption__num');
  var capText = fig.querySelector('.demo-caption__text');
  var track = fig.querySelector('.demo-track');
  var fill = fig.querySelector('.demo-track__fill');
  var items = Array.prototype.slice.call(fig.querySelectorAll('.demo-beats li'));
  if (!stage || !caption || !track || !fill || !items.length) return;

  var beats = items.map(function (li) {
    return {
      start: parseFloat(li.getAttribute('data-start')) || 0,
      li: li,
      html: li.innerHTML, // bevat beide taal-spans; de lang-CSS toont de juiste
      dot: null
    };
  });

  // Beat-punten op de voortgangsbalk plaatsen, op hun echte tijdstip.
  beats.forEach(function (b) {
    var dot = document.createElement('span');
    dot.className = 'demo-track__dot';
    dot.style.left = (b.start / loop * 100) + '%';
    b.dot = dot;
    track.appendChild(dot);
  });

  // Vanaf hier stuurt JS de demo aan → overlay + balk zichtbaar maken.
  fig.classList.add('is-live');

  var current = -1;
  function setActive(i) {
    if (i === current) return;
    current = i;
    var b = beats[i];
    capNum.textContent = i + 1;
    capText.innerHTML = b.html;
    // korte in-animatie opnieuw afspelen
    caption.classList.remove('is-swap');
    void caption.offsetWidth;
    caption.classList.add('is-swap');
    beats.forEach(function (x, j) {
      x.li.classList.toggle('is-active', j === i);
      x.dot.classList.toggle('is-active', j === i);
    });
  }

  function beatAt(t) {
    var idx = 0;
    for (var i = 0; i < beats.length; i++) if (t >= beats[i].start) idx = i;
    return idx;
  }

  // GIF terug naar frame 0 door de <img> te klonen en te vervangen. Werkt binnen <picture>
  // en gebruikt de cache (geen netwerk), zodat demo en verhaal samen op t=0 starten.
  function restartGif() {
    var img = stage.querySelector('img');
    if (img) img.replaceWith(img.cloneNode(true));
  }

  var startTs = 0;
  var rafId = 0;
  var running = false;

  function frame(ts) {
    if (!running) return;
    if (!startTs) startTs = ts;
    var t = ((ts - startTs) / 1000) % loop;
    fill.style.width = (t / loop * 100) + '%';
    setActive(beatAt(t));
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    startTs = 0;
    restartGif();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function inView() {
    var r = fig.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  // Alleen laten lopen als de demo in beeld is (en resync bij terugkeren in beeld).
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.35 }).observe(fig);
  } else {
    start();
  }

  // Pauzeer op een verborgen tab; hervat als de demo weer zichtbaar is.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (inView()) start();
  });
})();
