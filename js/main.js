/**
 * main.js — Nazmoon artist website
 * Handles navigation toggle, active section highlighting,
 * copyright year, and accessible interactions.
 */

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const ACTIVE_CLASS = 'active';
    const NAV_OPEN_CLASS = 'open';
    const SCROLL_OFFSET = 100; // px from top before a section is considered "active"

    // ===== DOM REFS =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-menu');
    const navLinks  = document.querySelectorAll('.nav-menu a');
    const sections  = document.querySelectorAll('main section[id]');
    const yearSpan  = document.getElementById('copyright-year');

    // ===== TOGGLE MOBILE NAV =====
    function toggleNav(open) {
        if (!navMenu || !navToggle) return;

        const isOpen = (typeof open === 'boolean') ? open : navMenu.classList.toggle(NAV_OPEN_CLASS);

        if (typeof open === 'boolean') {
            if (open) {
                navMenu.classList.add(NAV_OPEN_CLASS);
            } else {
                navMenu.classList.remove(NAV_OPEN_CLASS);
            }
        }

        const expanded = navMenu.classList.contains(NAV_OPEN_CLASS);
        navToggle.setAttribute('aria-expanded', String(expanded));
        navToggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    }

    if (navToggle) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleNav();
        });
    }

    // Close nav when clicking a link (mobile)
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            toggleNav(false);
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
        if (navMenu && navMenu.classList.contains(NAV_OPEN_CLASS)) {
            const isInside = navToggle && navToggle.contains(e.target) || navMenu.contains(e.target);
            if (!isInside) {
                toggleNav(false);
            }
        }
    });

    // ===== ACTIVE SECTION HIGHLIGHTING =====
    function updateActiveLink() {
        let currentId = '';

        sections.forEach(function (section) {
            const rect = section.getBoundingClientRect();
            // Consider a section "active" when its top is within the viewport or above
            if (rect.top <= SCROLL_OFFSET) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.remove(ACTIVE_CLASS);
            link.removeAttribute('aria-current');

            if (href === currentId) {
                link.classList.add(ACTIVE_CLASS);
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // ===== SMOOTH SCROLL (fallback) =====
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===== COPYRIGHT YEAR =====
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }

    // ===== REGISTER EVENTS =====
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink(); // initial state

})();