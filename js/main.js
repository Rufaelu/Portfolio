/* =========================================================
   RUFAEL MELESE // SYS.PORTFOLIO — interaction layer
   ========================================================= */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. BOOT SEQUENCE
     --------------------------------------------------- */
  const boot     = $('#boot');
  const bootLog  = $('#bootLog');
  const bootBar  = $('#bootBar');
  const bootSkip = $('#bootSkip');

  const LINES = [
    ['POST ................................', 'OK'],
    ['PHOSPHOR ARRAY .....................', 'OK'],
    ['LOADING <b>identity.sys</b> .........', 'OK'],
    ['MOUNTING /dev/portfolio ............', 'OK'],
    ['DECRYPTING SUBJECT RECORD ..........', 'OK'],
    ['LINK ESTABLISHED — 2087.09.04 ......', 'OK'],
  ];

  function endBoot() {
    if (!boot || boot.classList.contains('done')) return;
    boot.classList.add('done');
    document.body.style.overflow = '';
    startHero();
    setTimeout(() => boot.remove(), 700);
  }

  function runBoot() {
    if (!boot) return;
    document.body.style.overflow = 'hidden';
    if (reduced) { endBoot(); return; }

    let i = 0;
    const step = () => {
      if (i >= LINES.length) { setTimeout(endBoot, 420); return; }
      const [txt, ok] = LINES[i++];
      const row = document.createElement('div');
      row.innerHTML = `${txt} <span class="ok">[${ok}]</span>`;
      bootLog.appendChild(row);
      bootBar.style.width = (i / LINES.length * 100) + '%';
      setTimeout(step, 230 + Math.random() * 190);
    };
    setTimeout(step, 380);
  }

  bootSkip?.addEventListener('click', endBoot);
  addEventListener('keydown', endBoot, { once: true });
  runBoot();

  /* ---------------------------------------------------
     2. HERO TYPEWRITER
     --------------------------------------------------- */
  const ROLES = [
    'SOFTWARE DEVELOPER',
    'SOFTWARE TESTER',
    'MICROSOFT 365 ADMIN',
    'BUILDER AND BREAKER',
  ];
  let heroStarted = false;

  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    const out = $('#typewriter');
    if (!out) return;
    if (reduced) { out.textContent = ROLES[0]; return; }

    let r = 0, c = 0, deleting = false;
    (function tick() {
      const word = ROLES[r];
      out.textContent = word.slice(0, c);
      if (!deleting && c < word.length) { c++; setTimeout(tick, 55); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1900); }
      else if (c > 0) { c--; setTimeout(tick, 26); }
      else { deleting = false; r = (r + 1) % ROLES.length; setTimeout(tick, 320); }
    })();
  }

  /* ---------------------------------------------------
     3. CLOCK / YEAR / UPTIME
     --------------------------------------------------- */
  const clock = $('#clock');
  const pad = n => String(n).padStart(2, '0');
  setInterval(() => {
    if (!clock) return;
    const d = new Date();
    clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }, 1000);

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const uptime = $('#uptime');
  if (uptime) {
    const START = new Date('2019-01-01T00:00:00');
    const upd = () => {
      const ms = Date.now() - START;
      const days = Math.floor(ms / 864e5);
      const h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
      uptime.textContent = `${days.toLocaleString()}d ${pad(h)}:${pad(m)}:${pad(s)}`;
    };
    upd(); setInterval(upd, 1000);
  }

  /* ---------------------------------------------------
     4. PHOSPHOR TOGGLE — P3 (amber) / P11 (blue)
     The stylesheet keys every colour off channel triples on :root,
     so flipping data-theme reskins the whole tube, portrait included.
     --------------------------------------------------- */
  const phos      = $('#phos');
  const phosLabel = $('#phosLabel');
  const root      = document.documentElement;

  const labelFor = t => (t === 'blue' ? 'P11' : 'P3');
  function setPhosphor(t, persist) {
    if (t === 'blue') root.dataset.theme = 'blue';
    else delete root.dataset.theme;
    if (phosLabel) phosLabel.textContent = labelFor(t);
    phos?.setAttribute('title', t === 'blue' ? 'Blue phosphor — switch to amber'
                                             : 'Amber phosphor — switch to blue');
    if (persist) { try { localStorage.setItem('phosphor', t); } catch (e) {} }
  }
  // the inline head script already applied the stored theme; sync the label
  setPhosphor(root.dataset.theme === 'blue' ? 'blue' : 'amber', false);

  phos?.addEventListener('click', () => {
    const next = root.dataset.theme === 'blue' ? 'amber' : 'blue';
    setPhosphor(next, true);
    // a tube changing guns flickers before it settles
    if (!reduced) {
      document.body.style.filter = 'brightness(1.5) contrast(.8)';
      setTimeout(() => { document.body.style.filter = ''; }, 90);
    }
  });

  /* ---------------------------------------------------
     5. NAV: stuck state, active link, mobile menu
     --------------------------------------------------- */
  const nav      = $('#nav');
  const burger   = $('#burger');
  const navLinks = $('.nav__links');

  burger?.addEventListener('click', () => navLinks.classList.toggle('open'));
  $$('.nav__links a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open')));

  const sections = $$('main section[id]');
  const linkFor  = id => $(`.nav__links a[href="#${id}"]`);

  /* ---------------------------------------------------
     6. SCROLL PROGRESS
     --------------------------------------------------- */
  const fill = $('#scrollbarFill');

  /* ---------------------------------------------------
     7. THE PORTRAIT SCAN  (the scrollable image)
     --------------------------------------------------- */
  const portrait = $('#portrait');
  const figure   = $('#figure');
  const scan     = $('.figure__scan');
  const dim      = $('#figureDim');
  const scanBar  = $('#scanBar');
  const scanPct  = $('#scanPct');
  const huds     = $$('.hud');
  const ptypeA   = $('.ptype--a');
  const ptypeB   = $('.ptype--b');
  const heroGrid = $('.hero__grid');

  function updatePortrait() {
    if (!portrait || !figure) return;
    const rect = portrait.getBoundingClientRect();
    const total = portrait.offsetHeight - innerHeight;
    // 0 → 1 across the pinned scroll distance
    const p = clamp(-rect.top / (total || 1));

    // scan beam sweeps bottom → top over the first 70% of the scroll
    const s = clamp(p / 0.7);
    const pct = s * 100;

    if (scan) {
      scan.style.top = (100 - pct) + '%';
      scan.style.opacity = s > 0.995 ? 0 : 0.9;
    }
    // keep the un-scanned part of the silhouette dark
    if (dim) dim.style.clipPath = `inset(0 0 ${pct}% 0)`;

    if (scanBar) scanBar.style.width = pct + '%';
    if (scanPct) scanPct.textContent = String(Math.round(pct)).padStart(3, '0') + '%';

    // figure drifts up + scales slightly as you scroll through, and fades at
    // both ends so the sticky pin/release never snaps
    const drift = (p - 0.5) * -70;
    figure.style.transform = `translateY(${drift}px) scale(${1 + p * 0.06})`;
    figure.style.opacity = Math.min(clamp(p / 0.04), clamp((1 - p) / 0.06));

    // background type parallaxes in opposite directions
    if (ptypeA) ptypeA.style.transform = `translateX(${(0.5 - p) * 220}px)`;
    if (ptypeB) ptypeB.style.transform = `translateX(${(p - 0.5) * 300}px) translateY(${(p - .5) * 40}px)`;

    // HUD callouts light up in sequence
    huds.forEach((h, i) => h.classList.toggle('on', s > 0.22 + i * 0.2));

    // rgb-split glitch right as the scan completes
    figure.classList.toggle('glitching', s > 0.93 && s < 1);
  }

  /* ---------------------------------------------------
     8. MAIN SCROLL LOOP (rAF-throttled)
     --------------------------------------------------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;

      nav?.classList.toggle('stuck', y > 40);

      if (fill) {
        const max = document.documentElement.scrollHeight - innerHeight;
        fill.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }

      // active nav link
      let current = null;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= innerHeight * 0.4) current = sec.id;
      }
      $$('.nav__links a').forEach(a => a.classList.remove('active'));
      if (current) linkFor(current)?.classList.add('active');

      // hero grid parallax
      if (heroGrid && y < innerHeight) heroGrid.style.transform =
        `perspective(320px) rotateX(66deg) translateY(${y * 0.25}px)`;

      updatePortrait();
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------------------------------------------------
     9. REVEALS, COUNTERS, METERS
     --------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);

      $$('[data-count]', e.target).forEach(runCount);
      if (e.target.hasAttribute('data-count')) runCount(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });

  function runCount(el) {
    const target = +el.dataset.count;
    if (reduced) { el.textContent = target; return; }
    const dur = 1300, t0 = performance.now();
    (function frame(t) {
      const k = clamp((t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(frame);
    })(t0);
  }

  // stack meters
  const meterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bar = $('i', e.target);
      if (bar) bar.style.width = e.target.dataset.val + '%';
      meterIO.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  $$('.meter').forEach(m => meterIO.observe(m));

  /* ---------------------------------------------------
     10. CARD CURSOR GLOW
     --------------------------------------------------- */
  $$('.card').forEach(card => {
    const glow = $('.card__glow', card);
    if (!glow) return;
    card.addEventListener('pointermove', ev => {
      const r = card.getBoundingClientRect();
      glow.style.left = (ev.clientX - r.left) + 'px';
      glow.style.top  = (ev.clientY - r.top)  + 'px';
    });
  });

  /* ---------------------------------------------------
     11. RANDOM CRT DROPOUT — occasional hardware fault
     --------------------------------------------------- */
  if (!reduced) {
    (function schedule() {
      setTimeout(() => {
        document.body.style.filter = 'brightness(1.35) contrast(.85)';
        setTimeout(() => { document.body.style.filter = ''; }, 70);
        schedule();
      }, 9000 + Math.random() * 16000);
    })();
  }
})();
