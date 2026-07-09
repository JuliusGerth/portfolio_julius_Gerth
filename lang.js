// Taalwisselaar (NL / EN) — gedeeld over alle pagina's.
// Draait in <head> zodat de juiste taal al staat vóór de body rendert (geen flits).
(function () {
  var KEY = 'site-lang';
  var stored;
  try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }

  function apply(lang) {
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  // De wisselknop is zonder JS dood en staat daarom standaard verborgen (CSS);
  // deze class op <html> toont hem zodra hij echt werkt.
  document.documentElement.classList.add('lang-js');

  // Begintaal: opgeslagen voorkeur, anders Nederlands.
  apply(stored === 'en' ? 'en' : 'nl');

  // Klik op een taalknop wisselt tussen NL en EN.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.lang-toggle');
    if (!btn) return;
    apply(document.documentElement.lang === 'en' ? 'nl' : 'en');
  });
})();
