(() => {
  'use strict';

  /* ─── NAVBAR ─── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ─── REVEAL ON SCROLL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ─── PARTICLES ─── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let pts = [];

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const rand = (min, max) => Math.random() * (max - min) + min;

    const init = () => {
      pts = Array.from({ length: 55 }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        r: rand(0.8, 2.2),
        o: rand(0.15, 0.55),
        phase: rand(0, Math.PI * 2)
      }));
    };

    init();

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.018;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const alpha = p.o * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(76,175,130,${alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(76,175,130,${0.1 * (1 - d / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(tick);
    };

    tick();
  }

  /* ─── TYPEWRITER ─── */
  const h1 = document.querySelector('.hero h1');
  if (h1) {
    const line1 = 'Tu negocio atiende clientes';
    const line2 = 'mientras tú descansas';
    let i = 0;
    let phase = 0;

    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';

    const gradSpan = document.createElement('span');
    gradSpan.className = 'gradient-text';

    const write = () => {
      if (phase === 0) {
        h1.textContent = line1.slice(0, i);
        h1.appendChild(cursor);
        if (i < line1.length) { i++; setTimeout(write, 55); }
        else { phase = 1; i = 0; setTimeout(write, 400); }
      } else if (phase === 1) {
        h1.textContent = line1 + '\n';
        h1.style.whiteSpace = 'pre-line';
        gradSpan.textContent = line2.slice(0, i);
        h1.appendChild(gradSpan);
        h1.appendChild(cursor);
        if (i < line2.length) { i++; setTimeout(write, 55); }
        else { cursor.style.animation = 'none'; cursor.style.opacity = '0'; }
      }
    };

    setTimeout(write, 900);
  }

  /* ─── CHAT MOCKUP ─── */
  const msgBox = document.getElementById('mockup-messages');
  if (msgBox) {
    const convos = [
      { type: 'bot', text: '¡Hola! Soy el asistente de Clínica Dental Sonríe. ¿En qué puedo ayudarte?' },
      { type: 'user', text: '¿Aceptáis Sanitas?' },
      { type: 'bot', text: 'Sí, trabajamos con Sanitas, Adeslas, Asisa, DKV y Mapfre. ¿Quieres pedir cita?' },
      { type: 'user', text: 'Sí, me interesa' },
      { type: 'bot', text: '¿Me dices tu nombre y te llamamos hoy para confirmarlo?' },
    ];

    let ci = 0;

    const typing = (cb) => {
      const el = document.createElement('div');
      el.className = 'chat-typing';
      [1, 2, 3].forEach(() => {
        const d = document.createElement('div');
        d.className = 'typing-dot';
        el.appendChild(d);
      });
      msgBox.appendChild(el);
      msgBox.scrollTop = msgBox.scrollHeight;
      setTimeout(() => { el.remove(); cb(); }, 950);
    };

    const next = () => {
      if (ci >= convos.length) {
        setTimeout(() => { msgBox.innerHTML = ''; ci = 0; setTimeout(next, 600); }, 3000);
        return;
      }
      const m = convos[ci];
      const go = () => {
        const b = document.createElement('div');
        b.className = `chat-bubble ${m.type}`;
        b.textContent = m.text;
        msgBox.appendChild(b);
        msgBox.scrollTop = msgBox.scrollHeight;
        ci++;
        setTimeout(next, m.type === 'bot' ? 1700 : 1100);
      };
      m.type === 'bot' ? typing(go) : go();
    };

    const visual = document.querySelector('.hero-visual');
    if (visual) {
      let started = false;
      const vo = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !started) { started = true; setTimeout(next, 1200); }
      }, { threshold: 0.3 });
      vo.observe(visual);
    }
  }

  /* ─── FAQ ─── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ─── 3D CARD TILT ─── */
  document.querySelectorAll('.pain-card, .demo-card, .step-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = '800px';

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.08s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  /* ─── STAT COUNTER ─── */
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    let counted = false;
    const so = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        counted = true;
        statsEl.querySelectorAll('.stat strong').forEach(el => {
          const txt = el.textContent;
          if (!txt.includes('%')) return;
          const end = 80;
          const dur = 1600;
          const start = performance.now();
          const run = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = '+' + Math.round(end * ease) + '%';
            if (p < 1) requestAnimationFrame(run);
          };
          requestAnimationFrame(run);
        });
      }
    }, { threshold: 0.5 });
    so.observe(statsEl);
  }

})();
