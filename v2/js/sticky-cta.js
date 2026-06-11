// --- CTA sticky : pages avec <body data-sticky-cta data-sticky-href data-sticky-label data-sticky-btn> ---
// Apparaît après ~1,2 écran de scroll, se masque à l'approche du footer.
(function () {
  var body = document.body;
  if (!body.hasAttribute('data-sticky-cta')) return;

  var href = body.getAttribute('data-sticky-href') || 'nous-joindre.html';
  var label = body.getAttribute('data-sticky-label') || 'Un projet en tête ?';
  var btnText = body.getAttribute('data-sticky-btn') || 'Contactez-nous';

  var bar = document.createElement('div');
  bar.className = 'sticky-cta';
  bar.innerHTML =
    '<span class="sticky-cta-label"></span>' +
    '<a class="sticky-cta-btn" href="">' +
    '<span></span>' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
    '</a>';
  bar.querySelector('.sticky-cta-label').textContent = label;
  var btn = bar.querySelector('.sticky-cta-btn');
  btn.setAttribute('href', href);
  if (/^https?:\/\//.test(href)) {
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  }
  btn.querySelector('span').textContent = btnText;
  document.body.appendChild(bar);

  var footer = document.querySelector('footer');
  var footerVisible = false;
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      footerVisible = entries[0].isIntersecting;
      update();
    }, { rootMargin: '0px 0px 120px 0px' }).observe(footer);
  }

  function update() {
    var past = window.scrollY > window.innerHeight * 1.2;
    bar.classList.toggle('is-visible', past && !footerVisible);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
