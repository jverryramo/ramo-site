// --- Bandeau de contexte mini-site ---
// 1. Se replie au scroll vers le bas, réapparaît en haut de page
// 2. Bouton ✕ : fermé pour le reste de la session (sessionStorage)
(function () {
  var band = document.querySelector('.ms-site-band');
  if (!band) return;

  // Fermé plus tôt dans la session ?
  try {
    if (sessionStorage.getItem('ramo_ms_band') === 'off') {
      document.body.classList.add('ms-band-off');
      return;
    }
  } catch (e) {}

  // Bouton fermer
  var btn = document.createElement('button');
  btn.className = 'ms-site-band-close';
  btn.setAttribute('aria-label', 'Masquer ce bandeau');
  btn.textContent = '✕';
  band.appendChild(btn);
  btn.addEventListener('click', function () {
    try { sessionStorage.setItem('ramo_ms_band', 'off'); } catch (e) {}
    document.body.classList.add('ms-band-off');
  });

  // Repli au scroll (avec hystérésis pour éviter le clignotement)
  function update() {
    if (window.scrollY > 80) band.classList.add('is-collapsed');
    else if (window.scrollY < 30) band.classList.remove('is-collapsed');
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
