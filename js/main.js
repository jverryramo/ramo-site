/* ============================================
   RAMO.ECO — Main JavaScript
   Text animations, scroll reveals, counters
   Enhanced with bold "wow" effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Hero video: ping-pong (forward+reverse) is baked into the MP4 file
  // Native HTML5 loop attribute handles seamless looping

  // --- Text Split Animations (enhanced with 3D) ---
  function splitText() {
    document.querySelectorAll('[data-animate="chars"]').forEach((el, elIndex) => {
      const text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-label', text);

      [...text].forEach((char, i) => {
        const wrapper = document.createElement('span');
        wrapper.className = 'char-wrapper';
        wrapper.style.perspective = '600px';
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${0.3 + (elIndex * 0.3) + (i * 0.04)}s`;
        wrapper.appendChild(span);
        el.appendChild(wrapper);
      });
    });

    document.querySelectorAll('[data-animate="words"]').forEach(el => {
      const text = el.textContent;
      const words = text.split(' ');
      el.textContent = '';
      el.setAttribute('aria-label', text);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.word').forEach(w => {
              w.style.animationPlayState = 'running';
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      words.forEach((word, i) => {
        const wrapper = document.createElement('span');
        wrapper.className = 'word-wrapper';
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        span.style.animationDelay = `${i * 0.1}s`;
        span.style.animationPlayState = 'paused';
        wrapper.appendChild(span);
        el.appendChild(wrapper);
      });

      observer.observe(el);
    });

    // Line reveal animations
    document.querySelectorAll('[data-animate="lines"]').forEach(el => {
      const text = el.innerHTML;
      const lines = text.split('<br>');
      el.innerHTML = '';

      lines.forEach((line, i) => {
        const outer = document.createElement('span');
        outer.className = 'line-reveal scroll-reveal';
        outer.dataset.delay = String(i * 120);
        const inner = document.createElement('span');
        inner.className = 'line-reveal-inner';
        inner.innerHTML = line.trim();
        outer.appendChild(inner);
        el.appendChild(outer);
      });
    });
  }
  splitText();

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenu.setAttribute('aria-hidden', !isActive);
      menuToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header hide/show on scroll ---
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
    } else {
      header.classList.remove('header--hidden');
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });

  // --- Scroll Reveal (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.scroll-reveal, .solution-card, .blur-in, .anim-hr');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Counter Animation (with pop effect) ---
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    if (isNaN(target)) return;
    const duration = target > 100 ? 2200 : 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString('fr-CA');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 500);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Parallax Effects (enhanced with depth) ---
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');
  const featureBg = document.querySelector('.feature-bg');

  function updateParallax() {
    const scrolled = window.scrollY;

    if (heroBg && scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroBg.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }

    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }

    if (featureBg) {
      const rect = featureBg.parentElement.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        featureBg.style.transform = `translateY(${(progress - 0.5) * 60}px) scale(1.05)`;
      }
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  }, { passive: true });

  // --- Scroll-driven text breathing (blur-to-clear + fade) ---
  const breathElements = document.querySelectorAll('.scroll-breathe');

  function updateBreathe() {
    const viewH = window.innerHeight;
    breathElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Start animating when element enters bottom 85% of viewport
      const start = viewH * 0.85;
      const end = viewH * 0.35;

      if (rect.top < start && rect.top > end) {
        const progress = 1 - (rect.top - end) / (start - end);
        const eased = progress * progress * (3 - 2 * progress); // smoothstep
        const blur = (1 - eased) * 8;
        const opacity = 0.15 + eased * 0.85;
        const translateY = (1 - eased) * 30;
        el.style.filter = `blur(${blur}px)`;
        el.style.opacity = opacity;
        el.style.transform = `translateY(${translateY}px)`;
      } else if (rect.top <= end) {
        el.style.filter = 'blur(0px)';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      } else {
        el.style.filter = 'blur(8px)';
        el.style.opacity = 0.15;
        el.style.transform = 'translateY(30px)';
      }
    });
  }

  if (breathElements.length > 0) {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateBreathe);
    }, { passive: true });
    updateBreathe();
  }

  // --- Horizontal Slider ---
  document.querySelectorAll('.h-slider').forEach(slider => {
    const track = slider.querySelector('.h-slider-track');
    const prevBtn = slider.querySelector('.h-slider-prev');
    const nextBtn = slider.querySelector('.h-slider-next');
    if (!track) return;

    const scrollAmount = 360;

    if (nextBtn) nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Update arrow visibility
    function updateArrows() {
      if (prevBtn) prevBtn.style.opacity = track.scrollLeft > 20 ? '1' : '0.3';
      if (nextBtn) nextBtn.style.opacity =
        track.scrollLeft < track.scrollWidth - track.clientWidth - 20 ? '1' : '0.3';
    }
    track.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
  });

  // --- Magnetic hover effect on chars ---
  document.querySelectorAll('.hero-title .char').forEach(char => {
    char.addEventListener('mouseenter', () => {
      char.style.transform = 'translateY(-8px) scale(1.1)';
      char.style.transition = 'all 0.2s ease';
    });
    char.addEventListener('mouseleave', () => {
      char.style.transform = '';
      char.style.transition = 'all 0.4s var(--ease-out)';
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Lazy load images with smooth fade ---
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    img.style.transform = 'scale(1.02)';
    if (img.complete) {
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      });
    }
  });

  // --- Photo Slider ---
  document.querySelectorAll('.sol-slider').forEach(slider => {
    const track = slider.querySelector('.sol-slider-track');
    const slides = slider.querySelectorAll('.sol-slider-slide');
    const prevBtn = slider.querySelector('.sol-slider-btn--prev');
    const nextBtn = slider.querySelector('.sol-slider-btn--next');
    const dotsContainer = slider.parentElement.querySelector('.sol-slider-dots');
    let current = 0;
    const total = slides.length;
    if (total <= 1) return;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'sol-slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Photo ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.sol-slider-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch/swipe support
    let startX = 0, startY = 0, isDragging = false, dragOffset = 0;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      track.classList.add('grabbing');
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        dragOffset = dx;
        const pct = -(current * 100) + (dx / slider.offsetWidth) * 100;
        track.style.transform = `translateX(${pct}%)`;
      }
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDragging = false;
      track.classList.remove('grabbing');
      if (Math.abs(dragOffset) > 50) {
        goTo(dragOffset < 0 ? current + 1 : current - 1);
      } else {
        goTo(current);
      }
      dragOffset = 0;
    });

    // Mouse drag support (desktop)
    track.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
      track.classList.add('grabbing');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      dragOffset = e.clientX - startX;
      const pct = -(current * 100) + (dragOffset / slider.offsetWidth) * 100;
      track.style.transform = `translateX(${pct}%)`;
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('grabbing');
      if (Math.abs(dragOffset) > 50) {
        goTo(dragOffset < 0 ? current + 1 : current - 1);
      } else {
        goTo(current);
      }
      dragOffset = 0;
    });

    // Keyboard nav
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Auto-advance every 5s (pause on hover/touch)
    let autoTimer = setInterval(() => goTo(current + 1), 5000);
    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    });
    slider.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true });
  });

  // --- Cursor glow follower (desktop only) ---
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; width: 300px; height: 300px;
      border-radius: 50%; pointer-events: none; z-index: 0;
      background: radial-gradient(circle, rgba(124,198,141,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.3s ease, top 0.3s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* Page transition removed — caused navigation blocking */

  /* Custom cursor removed — caused cross-browser issues */

  /* --- Scroll Progress Bar --- */
  (function() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  })();

  /* --- FAQ Accordion (one open at a time) --- */
  document.addEventListener('click', function(e) {
    const summary = e.target.closest('.faq-question');
    if (!summary) return;
    const current = summary.parentElement;
    current.closest('.faq-list').querySelectorAll('details[open]').forEach(function(d) {
      if (d !== current) d.removeAttribute('open');
    });
  });

  /* --- Animated Counters --- */
  (function() {
    function parseNumber(text) {
      // Handle formats: "18M", "20+", "111 880", "10 000", "5", "30", etc.
      text = text.trim();
      let suffix = '';
      let num = 0;

      if (text.endsWith('M')) {
        suffix = 'M';
        num = parseFloat(text.replace(/\s/g, '').replace('M', ''));
      } else if (text.endsWith('+')) {
        suffix = '+';
        num = parseFloat(text.replace(/\s/g, '').replace('+', ''));
      } else {
        num = parseFloat(text.replace(/\s/g, ''));
      }

      return { num: num, suffix: suffix, original: text };
    }

    function formatNumber(value, parsed) {
      if (parsed.suffix === 'M') {
        return Math.round(value) + 'M';
      }
      // Format with spaces as thousands separator (French style)
      let formatted = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return formatted + parsed.suffix;
    }

    function animateCounter(el, parsed, duration) {
      const start = 0;
      const end = parsed.num;
      const startTime = performance.now();

      el.classList.add('counting');

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;

        el.textContent = formatNumber(current, parsed);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.classList.remove('counting');
        }
      }

      requestAnimationFrame(update);
    }

    // Observe ticker numbers and stat numbers
    const counterEls = document.querySelectorAll('.ticker-number, .stat-number');
    if (counterEls.length > 0) {
      const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            const parsed = parseNumber(entry.target.textContent);
            if (!isNaN(parsed.num) && parsed.num > 0) {
              animateCounter(entry.target, parsed, 2000);
            }
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counterEls.forEach(function(el) {
        counterObserver.observe(el);
      });
    }
  })();

  /* --- Floating CTA Mobile --- */
  (function() {
    // Don't show on contact page itself
    if (window.location.pathname.includes('contact')) return;

    const cta = document.createElement('div');
    cta.className = 'floating-cta';
    cta.setAttribute('aria-hidden', 'true');

    // Determine correct path
    const isSubfolder = window.location.pathname.split('/').filter(Boolean).length > 2;
    const prefix = isSubfolder ? '../' : '';

    cta.innerHTML = '<div class="floating-cta-inner"><a href="' + prefix + 'contact.html" class="btn btn--primary" style="display:inline-flex;align-items:center;gap:8px;justify-content:center;width:100%;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>Nous joindre</a></div>';
    document.body.appendChild(cta);

    // Show after scrolling past hero
    let shown = false;
    window.addEventListener('scroll', function() {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 400 && !shown) {
        shown = true;
        cta.classList.add('visible');
      } else if (scrollY <= 400 && shown) {
        shown = false;
        cta.classList.remove('visible');
      }
    }, { passive: true });
  })();

});
