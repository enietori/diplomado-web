/* ============================================================
   script.js — Diplomado IA Aplicada a la Educación
   ============================================================ */

/* ── 1. CANVAS NEURAL NETWORK ANIMATION ─────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, animId;
  const NODE_COUNT = 60;
  const MAX_DIST = 140;
  const SPEED = 0.4;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 2 + 1,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, createNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
      grad.addColorStop(0, 'rgba(0,212,255,0.9)');
      grad.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    loop();
  });

  init();
  loop();
})();


/* ── 2. STICKY NAVBAR ────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();


/* ── 3. HAMBURGER MOBILE MENU ────────────────────────────── */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close menu when a nav link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      btn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
})();


/* ── 4. SMOOTH SCROLL FOR NAV LINKS ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 5. INTERSECTION OBSERVER — FADE-IN ANIMATIONS ──────── */
(function initFadeIn() {
  const items = document.querySelectorAll('.anim-slide-up');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(el => observer.observe(el));
})();


/* ── 6. ANIMATED STAT COUNTERS ───────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isFloat = String(target).includes('.');
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isFloat
        ? current.toFixed(1)
        : Math.floor(current).toLocaleString();
    }, step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ── 7. PROGRESS BAR ANIMATIONS ─────────────────────────── */
(function initBars() {
  const bars = document.querySelectorAll('.bar-fill[data-w]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.w + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* ── 8. ACCORDION TOGGLE ─────────────────────────────────── */
function toggleAcc(el) {
  const item = el.closest('.module-item');
  const body = item.querySelector('.module-body');
  const icon = el.querySelector('.acc-icon');
  const isOpen = item.classList.contains('open');

  // Close all other open accordions
  document.querySelectorAll('.module-item.open').forEach(openItem => {
    if (openItem !== item) {
      openItem.classList.remove('open');
      const b = openItem.querySelector('.module-body');
      const ic = openItem.querySelector('.acc-icon');
      if (b) b.style.maxHeight = null;
      if (ic) ic.style.transform = 'rotate(0deg)';
    }
  });

  if (isOpen) {
    item.classList.remove('open');
    body.style.maxHeight = null;
    if (icon) icon.style.transform = 'rotate(0deg)';
  } else {
    item.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}


/* ── 9. SCROLL-TO-TOP BUTTON ─────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 10. ACTIVE NAV LINK ON SCROLL (SCROLLSPY) ───────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navMenu a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── 11. OPEN FIRST ACCORDION BY DEFAULT ─────────────────── */
(function openFirstModule() {
  const first = document.querySelector('.module-item');
  if (first) {
    const header = first.querySelector('.module-header');
    if (header) toggleAcc(header);
  }
})();


/* ── 12. COUNTDOWN TIMER ─────────────────────────────────── */
(function initCountdown() {
  const target = new Date('2026-04-06T19:30:00-05:00'); // 7:30 pm hora Perú (UTC-5)

  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const container = document.getElementById('countdown');

  if (!daysEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent    = '00';
      hoursEl.textContent   = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (container) container.classList.add('finished');
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent    = pad(days);
    hoursEl.textContent   = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ── 13. FAQ ACCORDION ───────────────────────────────────── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
  });

  if (!isOpen) {
    item.classList.add('open');
  }
}
