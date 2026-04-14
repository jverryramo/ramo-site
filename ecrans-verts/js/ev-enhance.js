/* Ramo Écrans verts — Enhancements
   1. Smooth cross-page fade transitions
   2. Scroll progress indicator (CSS custom property)
   3. Active nav link highlighting
*/
(function () {
  'use strict';

  const ready = (fn) =>
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  ready(() => {
    /* -------- 1. Active nav link (match current page) -------- */
    const here = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header .nav-link, .header .ev-nav-link').forEach((a) => {
      if (a.classList.contains('nav-link--cta')) return;
      const hrefFile = (a.getAttribute('href') || '').split('/').pop();
      if (hrefFile && hrefFile === here) a.classList.add('is-active');
    });

    /* -------- 2. Smooth page transitions (fade + lift) -------- */
    requestAnimationFrame(() => {
      document.body.classList.add('ev-page-loaded');
    });

    const isInternal = (a) => {
      if (!a || !a.href) return false;
      if (a.target === '_blank') return false;
      if (a.hasAttribute('download')) return false;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (url.pathname === window.location.pathname) return false; // hash / same page
      // Only intercept navigation between micro-site pages
      return url.pathname.includes('/ecrans-verts/');
    };

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || !isInternal(a)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.body.classList.add('ev-page-leaving');
      setTimeout(() => {
        window.location.href = a.href;
      }, 320);
    });

    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        document.body.classList.remove('ev-page-leaving');
        document.body.classList.add('ev-page-loaded');
      }
    });

    /* -------- 3. Scroll progress + header auto-hide -------- */
    const body = document.body;
    let lastScroll = 0;
    const setProgress = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? scrolled / max : 0;
      document.documentElement.style.setProperty('--ev-scroll', pct.toFixed(4));

      // Topbar verte : se replie dès qu'on quitte le haut de page
      if (scrolled > 20) {
        body.classList.add('ev-topbar-collapsed');
      } else {
        body.classList.remove('ev-topbar-collapsed');
      }

      // Header beige : disparaît au scroll vers le bas, revient au scroll vers le haut
      const delta = scrolled - lastScroll;
      if (scrolled < 80) {
        body.classList.remove('ev-header-hidden');
      } else if (delta > 4) {
        body.classList.add('ev-header-hidden');
      } else if (delta < -4) {
        body.classList.remove('ev-header-hidden');
      }
      lastScroll = scrolled;
    };
    setProgress();
    window.addEventListener('scroll', setProgress, { passive: true });
    window.addEventListener('resize', setProgress);
  });
})();
