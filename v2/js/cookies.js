/**
 * Bannière de consentement aux témoins (Loi 25 Québec)
 * Granulaire : Essentiels (obligatoires) · Analytique · Marketing
 *
 * Fonctionnement :
 *  - Premier visit → bannière en bas avec 3 boutons (Refuser / Personnaliser / Accepter tout)
 *  - "Personnaliser" → modal avec toggles par catégorie
 *  - Choix sauvegardé dans localStorage (1 an)
 *  - Footer : lien "Préférences témoins" pour modifier le consentement plus tard
 *  - L'événement 'ramoConsentChange' est déclenché quand le consentement change.
 *    À écouter pour activer/désactiver les outils tiers (GA, FB Pixel, etc.).
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'ramo_consent_v1';
  const CONSENT_VERSION = 1;

  // ---------- État ----------
  function getConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (e) { return null; }
  }

  function saveConsent(prefs) {
    const data = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      essentiels: true,                   // toujours true
      analytique: !!prefs.analytique,
      marketing: !!prefs.marketing
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    document.dispatchEvent(new CustomEvent('ramoConsentChange', { detail: data }));
    return data;
  }

  function withdrawConsent() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    document.dispatchEvent(new CustomEvent('ramoConsentChange', { detail: null }));
  }

  // ---------- Styles ----------
  const STYLES = `
    .rcc-banner, .rcc-modal-bg { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    .rcc-banner {
      position: fixed; left: 16px; right: 16px; bottom: 16px;
      background: #003c38; color: #fff; border: 1px solid rgba(220,242,30,0.22);
      border-radius: 16px; padding: 22px 24px;
      max-width: 760px; margin: 0 auto;
      box-shadow: 0 18px 50px rgba(0,0,0,0.35);
      z-index: 999998; opacity: 0; transform: translateY(12px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .rcc-banner.is-visible { opacity: 1; transform: translateY(0); }
    .rcc-banner-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px; font-weight: 500; margin: 0 0 8px;
      letter-spacing: -0.005em;
    }
    .rcc-banner-text {
      font-size: 13.5px; line-height: 1.55; color: rgba(255,255,255,0.78); margin: 0 0 18px;
    }
    .rcc-banner-text a { color: #DCF21E; text-decoration: underline; text-underline-offset: 2px; }
    .rcc-banner-actions { display: flex; flex-wrap: wrap; gap: 10px; }
    .rcc-btn {
      font-family: inherit; font-size: 13px; font-weight: 600; letter-spacing: 0.02em;
      padding: 10px 18px; border-radius: 100px; cursor: pointer;
      border: none; transition: all 0.25s ease;
    }
    .rcc-btn-primary { background: #DCF21E; color: #003c38; }
    .rcc-btn-primary:hover { background: #fff; transform: translateY(-1px); }
    .rcc-btn-secondary {
      background: transparent; color: #fff;
      border: 1px solid rgba(255,255,255,0.32);
    }
    .rcc-btn-secondary:hover { border-color: #DCF21E; color: #DCF21E; }
    .rcc-btn-tertiary { background: transparent; color: rgba(255,255,255,0.65); padding: 10px 12px; }
    .rcc-btn-tertiary:hover { color: #DCF21E; }

    /* Modal */
    .rcc-modal-bg {
      position: fixed; inset: 0; background: rgba(0,42,39,0.72);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      z-index: 999999; display: flex; align-items: center; justify-content: center;
      padding: 20px; opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .rcc-modal-bg.is-visible { opacity: 1; pointer-events: auto; }
    .rcc-modal {
      background: #003c38; color: #fff; border-radius: 18px;
      padding: clamp(28px, 4vw, 44px); max-width: 580px; width: 100%;
      max-height: 90vh; overflow-y: auto;
      border: 1px solid rgba(220,242,30,0.18);
      transform: translateY(12px) scale(0.98); transition: transform 0.35s ease;
    }
    .rcc-modal-bg.is-visible .rcc-modal { transform: translateY(0) scale(1); }
    .rcc-modal-eyebrow {
      font-size: 11.5px; font-weight: 600; letter-spacing: 0.16em;
      text-transform: uppercase; color: #DCF21E; margin: 0 0 12px;
    }
    .rcc-modal-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(24px, 3vw, 30px); font-weight: 500;
      margin: 0 0 10px; letter-spacing: -0.01em;
    }
    .rcc-modal-text {
      font-size: 13.5px; line-height: 1.6; color: rgba(255,255,255,0.78); margin: 0 0 22px;
    }
    .rcc-modal-text a { color: #DCF21E; }
    .rcc-cat {
      display: flex; align-items: flex-start; gap: 16px;
      padding: 18px 0; border-top: 1px solid rgba(220,242,30,0.12);
    }
    .rcc-cat:last-of-type { border-bottom: 1px solid rgba(220,242,30,0.12); margin-bottom: 24px; }
    .rcc-cat-text { flex: 1; }
    .rcc-cat-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 17px; font-weight: 500; margin: 0 0 4px;
    }
    .rcc-cat-desc { font-size: 12.5px; line-height: 1.55; color: rgba(255,255,255,0.65); margin: 0; }
    .rcc-cat-required {
      font-size: 11px; color: #DCF21E; font-weight: 600;
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    /* Switch */
    .rcc-switch {
      position: relative; width: 44px; height: 24px; flex-shrink: 0;
      cursor: pointer;
    }
    .rcc-switch input { position: absolute; opacity: 0; pointer-events: none; }
    .rcc-switch-track {
      position: absolute; inset: 0; background: rgba(255,255,255,0.16);
      border-radius: 100px; transition: background 0.25s;
    }
    .rcc-switch-thumb {
      position: absolute; top: 3px; left: 3px;
      width: 18px; height: 18px; border-radius: 50%; background: #fff;
      transition: transform 0.25s ease;
    }
    .rcc-switch input:checked ~ .rcc-switch-track { background: #DCF21E; }
    .rcc-switch input:checked ~ .rcc-switch-thumb { transform: translateX(20px); background: #003c38; }
    .rcc-switch input:disabled ~ .rcc-switch-track { background: rgba(220,242,30,0.4); cursor: not-allowed; }
    .rcc-switch input:disabled ~ .rcc-switch-thumb { background: rgba(0,60,56,0.6); transform: translateX(20px); cursor: not-allowed; }

    .rcc-modal-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
    .rcc-modal-actions .rcc-btn-secondary { color: #fff; border-color: rgba(255,255,255,0.3); }

    /* Footer link */
    .rcc-footer-link {
      position: fixed; bottom: 14px; left: 14px;
      background: rgba(0,60,56,0.85); backdrop-filter: blur(6px);
      color: rgba(255,255,255,0.78); padding: 7px 14px; border-radius: 100px;
      font-size: 11.5px; font-weight: 500; cursor: pointer;
      border: 1px solid rgba(220,242,30,0.2);
      z-index: 999997; opacity: 0.7; transition: opacity 0.25s;
    }
    .rcc-footer-link:hover { opacity: 1; color: #DCF21E; }

    @media (max-width: 600px) {
      .rcc-banner { left: 8px; right: 8px; bottom: 8px; padding: 18px 18px; }
      .rcc-banner-actions { flex-direction: column-reverse; }
      .rcc-btn { width: 100%; justify-content: center; }
      .rcc-footer-link { display: none; } /* Trop encombrant sur mobile */
    }
  `;

  function injectStyles() {
    if (document.getElementById('rcc-styles')) return;
    const s = document.createElement('style');
    s.id = 'rcc-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  // ---------- UI ----------
  function renderBanner() {
    const banner = document.createElement('aside');
    banner.className = 'rcc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Avis de consentement aux témoins');
    banner.innerHTML = `
      <h3 class="rcc-banner-title">Témoins de connexion (cookies)</h3>
      <p class="rcc-banner-text">Ramo utilise des témoins essentiels au fonctionnement du site, et — avec votre accord — d'autres pour mesurer l'audience et améliorer l'expérience. Conformément à la Loi 25 du Québec, vous gardez le contrôle. <a href="#" data-rcc-action="open-modal">En savoir plus et personnaliser</a>.</p>
      <div class="rcc-banner-actions">
        <button class="rcc-btn rcc-btn-tertiary" data-rcc-action="reject">Refuser tout</button>
        <button class="rcc-btn rcc-btn-secondary" data-rcc-action="open-modal">Personnaliser</button>
        <button class="rcc-btn rcc-btn-primary" data-rcc-action="accept-all">Tout accepter</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));

    banner.addEventListener('click', (e) => {
      const action = e.target.closest('[data-rcc-action]')?.dataset.rccAction;
      if (!action) return;
      e.preventDefault();
      if (action === 'accept-all') { saveConsent({ analytique: true, marketing: true }); banner.remove(); injectFooterLink(); }
      else if (action === 'reject') { saveConsent({ analytique: false, marketing: false }); banner.remove(); injectFooterLink(); }
      else if (action === 'open-modal') { banner.remove(); openModal(); }
    });
  }

  function openModal(currentPrefs) {
    const prefs = currentPrefs || getConsent() || { analytique: false, marketing: false };
    const overlay = document.createElement('div');
    overlay.className = 'rcc-modal-bg';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Préférences de témoins');
    overlay.innerHTML = `
      <div class="rcc-modal">
        <span class="rcc-modal-eyebrow">Conformité Loi 25</span>
        <h3 class="rcc-modal-title">Vos préférences de témoins.</h3>
        <p class="rcc-modal-text">Choisissez précisément ce que Ramo peut activer sur votre appareil. Vous pouvez modifier ces choix à tout moment via le lien <em>Préférences témoins</em> au bas du site.</p>

        <div class="rcc-cat">
          <div class="rcc-cat-text">
            <div class="rcc-cat-title">Témoins essentiels</div>
            <p class="rcc-cat-desc">Strictement nécessaires au fonctionnement du site (sécurité, navigation, mémorisation de vos préférences). Ne peuvent pas être désactivés.</p>
            <span class="rcc-cat-required">Toujours actifs</span>
          </div>
          <label class="rcc-switch">
            <input type="checkbox" checked disabled>
            <span class="rcc-switch-track"></span>
            <span class="rcc-switch-thumb"></span>
          </label>
        </div>

        <div class="rcc-cat">
          <div class="rcc-cat-text">
            <div class="rcc-cat-title">Mesure d'audience</div>
            <p class="rcc-cat-desc">Statistiques de visite anonymisées : pages les plus consultées, temps passé, parcours d'achat. Aide Ramo à améliorer l'expérience. Aucune donnée personnelle identifiable n'est partagée à des tiers.</p>
          </div>
          <label class="rcc-switch">
            <input type="checkbox" data-rcc-cat="analytique" ${prefs.analytique ? 'checked' : ''}>
            <span class="rcc-switch-track"></span>
            <span class="rcc-switch-thumb"></span>
          </label>
        </div>

        <div class="rcc-cat">
          <div class="rcc-cat-text">
            <div class="rcc-cat-title">Marketing &amp; personnalisation</div>
            <p class="rcc-cat-desc">Ciblage publicitaire et personnalisation des contenus selon votre intérêt (LinkedIn, Meta, etc.). Permet à Ramo de vous proposer des contenus pertinents lorsque vous naviguez ailleurs.</p>
          </div>
          <label class="rcc-switch">
            <input type="checkbox" data-rcc-cat="marketing" ${prefs.marketing ? 'checked' : ''}>
            <span class="rcc-switch-track"></span>
            <span class="rcc-switch-thumb"></span>
          </label>
        </div>

        <div class="rcc-modal-actions">
          <button class="rcc-btn rcc-btn-tertiary" data-rcc-action="reject-modal">Refuser tout</button>
          <button class="rcc-btn rcc-btn-secondary" data-rcc-action="save-modal">Enregistrer mes choix</button>
          <button class="rcc-btn rcc-btn-primary" data-rcc-action="accept-modal">Tout accepter</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-visible'));

    overlay.addEventListener('click', (e) => {
      const action = e.target.closest('[data-rcc-action]')?.dataset.rccAction;
      if (action === 'reject-modal') {
        saveConsent({ analytique: false, marketing: false });
        closeModal(overlay);
      } else if (action === 'accept-modal') {
        saveConsent({ analytique: true, marketing: true });
        closeModal(overlay);
      } else if (action === 'save-modal') {
        const a = overlay.querySelector('[data-rcc-cat="analytique"]').checked;
        const m = overlay.querySelector('[data-rcc-cat="marketing"]').checked;
        saveConsent({ analytique: a, marketing: m });
        closeModal(overlay);
      } else if (e.target === overlay) {
        // clicked outside modal - do nothing (force a choice)
      }
    });
  }

  function closeModal(overlay) {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 300);
    injectFooterLink();
  }

  function injectFooterLink() {
    if (document.getElementById('rcc-footer-link')) return;
    const link = document.createElement('button');
    link.id = 'rcc-footer-link';
    link.className = 'rcc-footer-link';
    link.setAttribute('aria-label', 'Modifier les préférences de témoins');
    link.innerHTML = '🍪 Préférences témoins';
    link.addEventListener('click', () => openModal());
    document.body.appendChild(link);
  }

  // ---------- Init ----------
  function init() {
    injectStyles();
    const consent = getConsent();
    if (consent) {
      // Already gave consent — just show the footer link in case they want to change
      injectFooterLink();
    } else {
      renderBanner();
    }
  }

  // Expose minimal API for other scripts (e.g. to gate analytics)
  window.RamoCookies = {
    get: getConsent,
    open: () => openModal(),
    withdraw: withdrawConsent,
    /**
     * Gate a function on a category. Usage:
     *   RamoCookies.onConsent('analytique', () => { gtag('consent','update',...); });
     */
    onConsent: function(category, callback) {
      const c = getConsent();
      if (c && c[category]) callback();
      document.addEventListener('ramoConsentChange', (e) => {
        if (e.detail && e.detail[category]) callback();
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
