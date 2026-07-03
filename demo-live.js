// Live 'probeer het zelf'-demo (Browser Tech) — vinkt functies af terwijl je ze gebruikt.
// Event-gedreven variant van de zelf-vertellende demo (demo-narrate.js is de klok-gedreven).
// Progressive enhancement: zonder dit script is de lijst een gewone genummerde lijst en
// werkt het formulier-fragment gewoon door — dat is precies het punt van dit project.
(function () {
  var fig = document.querySelector('[data-demo-live]');
  if (!fig) return;

  var form = fig.querySelector('.demo-form');
  var items = fig.querySelectorAll('.demo-beats li[data-beat]');
  if (!form || !items.length) return;

  var beats = {};
  Array.prototype.forEach.call(items, function (li) {
    beats[li.getAttribute('data-beat')] = li;
  });

  // Vanaf hier vinkt JS mee → checklist-styling aanzetten.
  fig.classList.add('is-live');

  function done(name) {
    var li = beats[name];
    if (!li || li.classList.contains('is-done')) return;
    li.classList.add('is-done');
  }

  // 1. Semantiek: zodra je een veld focust, gebruik je de labels/fieldsets.
  form.addEventListener('focusin', function () { done('semantics'); });

  // 2. Progressive disclosure: 'Ja' aankruisen laat de vervolgvraag verschijnen (puur CSS).
  var ja = document.getElementById('demo-kids-ja');
  if (ja) {
    ja.addEventListener('change', function () {
      if (ja.checked) done('disclosure');
    });
  }

  // 3. Validatie: typen in het BSN-veld geeft live HTML/CSS-feedback (:user-invalid/:user-valid).
  var bsn = document.getElementById('demo-bsn');
  if (bsn) {
    bsn.addEventListener('input', function () {
      if (bsn.value) done('validation');
    });
  }
})();
