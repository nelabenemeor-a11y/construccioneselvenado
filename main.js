// Enlaces de WhatsApp con mensaje inicial (se arman aquí para tenerlos en un solo lugar)
(function () {
  var num = '584166131486';
  var msg = 'Hola, quisiera solicitar una visita de inspección.';
  var url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);
  document.querySelectorAll('.wa-link').forEach(function (a) {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();

// Movimiento: menú, encabezado, paralaje, franja de clientes, apariciones y contador
(function () {
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var btn = document.querySelector('.top__menu');
  var nav = document.getElementById('menu');
  function abrirMenu(abrir) {
    nav.classList.toggle('is-open', abrir);
    btn.setAttribute('aria-expanded', String(abrir));
    btn.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
  }
  btn.addEventListener('click', function () { abrirMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') abrirMenu(false); });

  var top = document.querySelector('.top');
  var hero = document.querySelector('.hero');
  var heroImg = document.querySelector('.hero__img');
  var pendiente = false;
  function alDesplazar() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 8);
    if (!quieto && y < hero.offsetHeight) heroImg.style.transform = 'translate3d(0,' + (y * 0.3) + 'px,0)';
    pendiente = false;
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alDesplazar); }
  }, { passive: true });
  alDesplazar();

  // La lista se duplica para que el desfile no tenga cortes
  var lista = document.querySelector('.clients__list');
  if (!quieto && lista) {
    lista.innerHTML += lista.innerHTML.replace(/<li>/g, '<li aria-hidden="true">');
    lista.classList.add('is-marquee');
  }

  if (quieto || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');

  var sel = '.fundador, .sec h2, .sec__lead, .card, .all, .gallery li, .video, #nosotros p, .why li, .steps li, .contact .btn, .data';
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll(sel).forEach(function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = Math.min(i, 4) * 90 + 'ms';
    el.classList.add('reveal');
    obs.observe(el);
  });

  var cifra = document.querySelector('[data-count]');
  if (cifra) {
    var fin = +cifra.dataset.count;
    var corriendo = false;
    function contar() {
      if (corriendo) return;
      corriendo = true;
      var t0 = performance.now();
      (function paso(t) {
        var p = Math.min((t - t0) / 2000, 1);
        cifra.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(paso); else corriendo = false;
      })(t0);
    }
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) contar();
    }, { threshold: 0.6 }).observe(cifra);
    cifra.closest('li').addEventListener('mouseenter', contar);
  }
})();

