/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── SCROLL ANIMATIONS ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      const delay = parseInt(el.target.dataset.delay || 0);
      setTimeout(() => el.target.classList.add('in-view'), delay);
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

/* ─── PARTICLE SYSTEM ─── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = canvas.parentElement.offsetHeight;
};

resize();
window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.02;
    this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(76,175,130,${this.currentOpacity})`;
    ctx.fill();
  }
}

const initParticles = () => {
  particles = Array.from({ length: 60 }, () => new Particle());
};

const drawConnections = () => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(76,175,130,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
};

const animateParticles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateParticles);
};

initParticles();
animateParticles();

/* ─── TYPEWRITER EFFECT ─── */
const lines = [
  'Tu negocio atiende clientes',
  'mientras tú descansas'
];

const h1 = document.querySelector('.hero h1');
const gradientSpan = document.createElement('span');
gradientSpan.className = 'gradient-text';
const cursor = document.createElement('span');
cursor.className = 'typewriter-cursor';

let lineIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeDelay = 60;
let phase = 'line1'; // line1 | pause1 | line2 | pause2 | done

const type = () => {
  if (phase === 'line1') {
    const target = lines[0];
    if (!isDeleting) {
      h1.textContent = target.slice(0, charIdx + 1);
      h1.appendChild(cursor);
      charIdx++;
      if (charIdx === target.length) {
        phase = 'pause1';
        setTimeout(type, 500);
        return;
      }
    }
    setTimeout(type, typeDelay);

  } else if (phase === 'pause1') {
    h1.textContent = lines[0] + '\n';
    h1.style.whiteSpace = 'pre-line';
    gradientSpan.textContent = '';
    h1.appendChild(gradientSpan);
    h1.appendChild(cursor);
    charIdx = 0;
    phase = 'line2';
    setTimeout(type, 100);

  } else if (phase === 'line2') {
    const target = lines[1];
    gradientSpan.textContent = target.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === target.length) {
      phase = 'done';
      cursor.style.display = 'none';
      return;
    }
    setTimeout(type, typeDelay);
  }
};

setTimeout(type, 800);

/* ─── CHAT MOCKUP ─── */
const messages = [
  { type: 'bot', text: '¡Hola! Soy el asistente de Clínica Dental Sonríe. ¿En qué puedo ayudarte?' },
  { type: 'user', text: '¿Aceptáis Sanitas?' },
  { type: 'bot', text: 'Sí, trabajamos con Sanitas, Adeslas, Asisa, DKV y Mapfre. ¿Te gustaría pedir cita?' },
  { type: 'user', text: 'Me interesa, ¿cuándo tenéis hueco?' },
  { type: 'bot', text: 'Perfecto. ¿Me dices tu nombre y te llamamos hoy para confirmarlo?' },
];

const msgContainer = document.getElementById('mockup-messages');
let mIdx = 0;

const showTyping = (cb) => {
  const el = document.createElement('div');
  el.className = 'chat-typing';
  [1,2,3].forEach(() => {
    const d = document.createElement('div');
    d.className = 'typing-dot';
    el.appendChild(d);
  });
  msgContainer.appendChild(el);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  setTimeout(() => { el.remove(); cb(); }, 900);
};

const addMsg = () => {
  if (mIdx >= messages.length) {
    setTimeout(() => {
      msgContainer.innerHTML = '';
      mIdx = 0;
      setTimeout(addMsg, 600);
    }, 3500);
    return;
  }
  const m = messages[mIdx];

  const proceed = () => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${m.type}`;
    bubble.textContent = m.text;
    msgContainer.appendChild(bubble);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    mIdx++;
    setTimeout(addMsg, m.type === 'bot' ? 1600 : 1100);
  };

  if (m.type === 'bot') {
    showTyping(proceed);
  } else {
    proceed();
  }
};

// Start when hero visual enters viewport
const heroVisual = document.querySelector('.hero-visual');
let mockupStarted = false;
const heroObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !mockupStarted) {
    mockupStarted = true;
    setTimeout(addMsg, 1400);
  }
}, { threshold: 0.3 });

if (heroVisual) heroObs.observe(heroVisual);

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── CARD MAGNETIC EFFECT ─── */
document.querySelectorAll('.pain-card, .demo-card, .step-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ─── STAT COUNTER ANIMATION ─── */
const animateCounter = (el, target, suffix = '') => {
  const isPercent = suffix === '%';
  const start = 0;
  const duration = 1800;
  const startTime = performance.now();

  const update = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = (isPercent ? '+' : '') + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll('.stat strong');
      stats.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('%')) animateCounter(stat, 80, '%');
        else if (text.includes('€')) { stat.textContent = '0€'; setTimeout(() => { stat.textContent = '0€'; }, 1800); }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
