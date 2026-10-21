// QUADRA — four worlds, one frame
(function () {
  'use strict';

  /* ---------- Braix headline crossfade (like the video: hero swaps every few seconds) ---------- */
  var lines = Array.prototype.slice.call(document.querySelectorAll('.braix-line'));
  var li = 0;
  if (lines.length > 1) {
    setInterval(function () {
      lines[li].classList.remove('is-on');
      li = (li + 1) % lines.length;
      lines[li].classList.add('is-on');
    }, 3400);
  }

  /* ---------- Animated counters (PARROT 96.06 / Braix 90) ---------- */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var start = null, dur = 1800;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Gentle parallax tilt per quadrant (mouse) ---------- */
  var quads = document.querySelectorAll('.quad');
  quads.forEach(function (q) {
    q.addEventListener('mousemove', function (ev) {
      var r = q.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      var inner = q.querySelector('.quad-inner');
      if (inner) inner.style.transform = 'translate(' + (x * 6) + 'px,' + (y * 6) + 'px)';
    });
    q.addEventListener('mouseleave', function () {
      var inner = q.querySelector('.quad-inner');
      if (inner) inner.style.transform = '';
    });
  });

  /* ---------- Click / Enter a quadrant -> expand into its full page ---------- */
  var expander = document.getElementById('expander');
  var expContent = document.getElementById('expanderContent');
  var expClose = document.getElementById('expanderClose');
  function openQuad(name) {
    var tpl = document.getElementById('tpl-' + name);
    if (!tpl) return;
    expContent.innerHTML = '';
    expContent.appendChild(tpl.content.cloneNode(true));
    expander.hidden = false;
    document.body.style.overflow = 'hidden';
    expClose.focus();
  }
  function closeQuad() {
    expander.hidden = true;
    document.body.style.overflow = '';
  }
  quads.forEach(function (q) {
    q.addEventListener('click', function () { openQuad(q.getAttribute('data-quad')); });
    q.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openQuad(q.getAttribute('data-quad')); }
    });
  });
  expClose.addEventListener('click', closeQuad);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !expander.hidden) closeQuad();
  });

  /* ---------- Pause / resume all motion ---------- */
  var toggle = document.getElementById('motionToggle');
  toggle.addEventListener('click', function () {
    var paused = document.body.classList.toggle('paused');
    toggle.textContent = paused ? '▶ Resume motion' : '⏸ Pause motion';
    toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
  });
})();
