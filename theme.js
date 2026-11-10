// Thema-wissel onthouden (licht / donker) — gedeeld over alle pagina's.
// Het wisselen zelf is pure CSS (checkbox + :has()); dit script onthoudt alleen
// de keuze. Het staat als gewoon <script> direct ná de checkbox, zodat de opgeslagen
// stand er al staat vóór de pagina rendert (geen flits van het verkeerde thema).
(function () {
  var KEY = 'theme-switch';
  var input = document.getElementById(KEY);
  if (!input) return;

  try {
    if (localStorage.getItem(KEY) === '1') input.checked = true;
  } catch (e) {}

  input.addEventListener('change', function () {
    try { localStorage.setItem(KEY, input.checked ? '1' : '0'); } catch (e) {}
  });
})();
