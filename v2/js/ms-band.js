// --- Bandeau de contexte mini-site ---
// Affiché seulement quand le visiteur arrive du site principal :
//  - marqueur de session posé par les pages du site principal (main.js), ou
//  - referrer même origine qui n'est pas une page de l'univers ms (filet)
// Une fois affiché : se replie au scroll, ✕ le ferme pour la session.
(function () {
  var band = document.querySelector('.ms-site-band');
  if (!band) return;

  var state = null, cameFromMain = false;
  try {
    state = sessionStorage.getItem('ramo_ms_band'); // 'on' | 'off' | null
    cameFromMain = sessionStorage.getItem('ramo_universe') === 'main';
    sessionStorage.setItem('ramo_universe', 'ms');
  } catch (e) {}

  if (state === 'off') return; // fermé manuellement plus tôt dans la session

  // Filet de sécurité : referrer même origine hors univers ms
  if (state !== 'on' && !cameFromMain && document.referrer) {
    try {
      var ref = new URL(document.referrer);
      var MS_PAGES = [
        '/murs-antibruit-clotures-ecrans/', 'le-pilebyg', 'le-hf1',
        'murs-antibruit.html', 'clotures-naturelles-saule-ecorce',
        'malartic', 'boucherville', 'lavaltrie',
        'saint-hubert', 'sherbrooke', 'saint-constant'
      ];
      var isMs = MS_PAGES.some(function (s) { return ref.pathname.indexOf(s) !== -1; });
      if (ref.origin === location.origin && !isMs) cameFromMain = true;
    } catch (e) {}
  }

  if (state !== 'on' && !cameFromMain) return; // arrivée directe : pas de bandeau

  try { sessionStorage.setItem('ramo_ms_band', 'on'); } catch (e) {}
  document.body.classList.add('ms-band-on');

  // Bouton fermer (pour la session)
  var btn = document.createElement('button');
  btn.className = 'ms-site-band-close';
  btn.setAttribute('aria-label', 'Masquer ce bandeau');
  btn.textContent = '✕';
  band.appendChild(btn);
  btn.addEventListener('click', function () {
    try { sessionStorage.setItem('ramo_ms_band', 'off'); } catch (e) {}
    document.body.classList.remove('ms-band-on');
  });

  // Repli au scroll (avec hystérésis pour éviter le clignotement)
  function update() {
    if (window.scrollY > 80) band.classList.add('is-collapsed');
    else if (window.scrollY < 30) band.classList.remove('is-collapsed');
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// --- Menu mobile mini-site : backdrop + fermeture (clic dehors / Échap / lien) ---
(function () {
  var nav = document.querySelector('.ms-nav');
  var toggle = document.querySelector('.ms-nav-toggle');
  if (!nav || !toggle) return;

  var bd = document.createElement('div');
  bd.className = 'ms-nav-backdrop';
  document.body.appendChild(bd);

  function sync() { bd.classList.toggle('is-on', nav.classList.contains('is-open')); }
  function close() { nav.classList.remove('is-open'); bd.classList.remove('is-on'); }

  // L'ouverture/fermeture est pilotée par le onclick inline du bouton ; on synchronise le backdrop après.
  toggle.addEventListener('click', function () { setTimeout(sync, 0); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a[href]').forEach(function (a) { a.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
  });
})();
