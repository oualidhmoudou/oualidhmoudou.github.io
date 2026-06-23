/* =========================================================
   Oualid Hmoudou — Portfolio · main.js
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scrolled state + scroll progress ---------- */
  const nav = $('#nav');
  const progress = $('#scrollProgress');
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  function closeMenu() {
    if (!links) return;
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-link, .nav-cta', links).forEach((a) => a.addEventListener('click', closeMenu));
  }

  /* ---------- Active link on scroll (scroll-spy) ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  const revObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // light stagger for grouped items
        const delay = e.target.dataset.delay || (i % 4) * 70;
        setTimeout(() => e.target.classList.add('in'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((r) => revObserver.observe(r));

  /* ---------- Animated counters ---------- */
  const counters = $$('.stat-num');
  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => countObs.observe(c));

  /* ---------- Typed roles ---------- */
  const typedEl = $('#typed');
  if (typedEl) {
    const roles = [
      'Développement Logiciel',
      'Data & Business Intelligence',
      'Gestion de Projet',
    ];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      typedEl.textContent = roles.join(' · ');
    } else {
      let r = 0, c = 0, deleting = false;
      function type() {
        const word = roles[r];
        c += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, c);
        let speed = deleting ? 40 : 85;
        if (!deleting && c === word.length) { speed = 1600; deleting = true; }
        else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; speed = 350; }
        setTimeout(type, speed);
      }
      type();
    }
  }

  /* ---------- Project filters ---------- */
  const filterBar = $('#filters');
  if (filterBar) {
    const cards = $$('#projects .project-card');
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      $$('.filter', filterBar).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const match = f === 'all' || (card.dataset.cat || '').split(' ').includes(f);
        card.classList.toggle('hide', !match);
      });
    });
  }
})();
