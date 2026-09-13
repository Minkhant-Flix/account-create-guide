/**
 * MMovie User Guide — Standalone script
 * - Lightbox for screenshots
 * - Smooth scroll for TOC anchors
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var root = document.getElementById('guide');
    if (!root) return;

    var links = Array.prototype.slice.call(
      root.querySelectorAll('[data-lightbox]')
    );
    if (!links.length) return;

    var lb      = document.getElementById('ugLightbox');
    var lbImg   = document.getElementById('ugLightboxImg');
    var lbCap   = document.getElementById('ugLightboxCap');
    var lbClose = document.getElementById('ugLightboxClose');
    var lbPrev  = document.getElementById('ugLightboxPrev');
    var lbNext  = document.getElementById('ugLightboxNext');
    if (!lb || !lbImg) return;

    var current = 0;

    function show(index) {
      if (index < 0) index = links.length - 1;
      if (index >= links.length) index = 0;
      current = index;

      var a = links[current];
      lbImg.src = a.getAttribute('data-lightbox') || a.getAttribute('href') || '';
      lbImg.alt = a.getAttribute('data-caption') || '';
      lbCap.textContent = a.getAttribute('data-caption') || '';

      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function hide() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
      document.body.style.overflow = '';
    }

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
      });
    });

    if (lbClose) lbClose.addEventListener('click', hide);
    if (lbPrev)  lbPrev.addEventListener('click', function () { show(current - 1); });
    if (lbNext)  lbNext.addEventListener('click', function () { show(current + 1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) hide();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') hide();
      else if (e.key === 'ArrowLeft')  show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });

    // Smooth scroll for TOC
    var reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.querySelectorAll('.ug-toc a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'start'
        });
        if (history.replaceState) history.replaceState(null, '', '#' + id);
      });
    });
  });
})();