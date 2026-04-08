/* ======================================================
   GWÉNAEL BRAMBATTI — PORTFOLIO
   JavaScript : Scroll Reveal + Navigation + Hamburger
   ====================================================== */

(function () {
  'use strict';

  // -------- DOM ELEMENTS --------
  const header = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('[data-reveal]');
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const heroSubtitle = document.getElementById('hero-subtitle');

  // -------- PAGE LOAD FADE-IN --------
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    if (heroSubtitle) {
      setTimeout(startTypingEffect, 600);
    }
  });

  // -------- TYPING EFFECT --------
  function startTypingEffect() {
    const text = heroSubtitle.getAttribute('data-text');
    if (!text) return;
    
    let i = 0;
    heroSubtitle.textContent = '';
    heroSubtitle.classList.add('typing-cursor');

    function type() {
      if (i < text.length) {
        heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(type, 45); // Adjust typing speed here
      } else {
        // finished typing
      }
    }
    type();
  }

  // -------- HAMBURGER TOGGLE --------
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  // -------- HAMBURGER TOGGLE --------
  function toggleMenu(forceClose) {
    const shouldClose = forceClose === true || hamburgerBtn.classList.contains('open');

    hamburgerBtn.classList.toggle('open', !shouldClose);
    mainNav.classList.toggle('open', !shouldClose);
    overlay.classList.toggle('show', !shouldClose);
    hamburgerBtn.setAttribute('aria-expanded', String(!shouldClose));

    // Prevent body scroll when menu is open
    document.body.style.overflow = shouldClose ? '' : 'hidden';
  }

  hamburgerBtn.addEventListener('click', function () {
    toggleMenu();
  });

  overlay.addEventListener('click', function () {
    toggleMenu(true);
  });

  // Close menu when a nav link is clicked (mobile)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(true);
    });
  });

  // -------- HEADER SCROLL & SCROLL-TO-TOP --------
  function onScroll() {
    const scrollY = window.scrollY;
    
    // Header shadow
    if (scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (scrollToTopBtn) {
      if (scrollY > 400) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------- INTERSECTION OBSERVER — SCROLL REVEAL --------
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05,
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Manually check if elements are already in view on load (esp. for hash links)
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
          revealObserver.unobserve(el);
        }
      });
    }, 150);

  } else {
    // Fallback: reveal everything immediately for older browsers
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // -------- ESCAPE KEY CLOSES MOBILE MENU --------
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  // -------- INITIAL SCROLL CHECK --------
  onScroll();

  // -------- IMAGE ZOOM LIGHTBOX --------
  const projectImages = document.querySelectorAll('.section-projets .project-img');
  
  // Create overlay dynamically
  const zoomOverlay = document.createElement('div');
  zoomOverlay.classList.add('zoom-overlay');
  document.body.appendChild(zoomOverlay);

  const zoomImg = document.createElement('img');
  zoomOverlay.appendChild(zoomImg);

  projectImages.forEach(function (img) {
    img.addEventListener('click', function () {
      zoomImg.src = this.src;
      zoomImg.alt = this.alt;
      zoomOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scroll
    });
  });

  // Close on click anywhere in the overlay
  zoomOverlay.addEventListener('click', function () {
    zoomOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  });
})();

