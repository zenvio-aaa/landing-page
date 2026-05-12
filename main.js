/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── SCROLL ANIMATIONS ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      const delay = el.target.dataset.delay || 0;
      setTimeout(() => el.target.classList.add('in-view'), parseInt(delay));
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── CHAT MOCKUP ANIMATION ─── */
const messages = [
  { type: 'bot', text: '¡Hola! Soy el asistente de Clínica Dental Sonríe. ¿En qué puedo ayudarte?' },
  { type: 'user', text: '¿Aceptáis Sanitas?' },
  { type: 'bot', text: 'Sí, trabajamos con Sanitas, Adeslas, Asisa, DKV y Mapfre. ¿Te gustaría pedir cita?' },
  { type: 'user', text: 'Sí, ¿cuándo tenéis hueco?' },
  { type: 'bot', text: 'Perfecto. ¿Me dices tu nombre y te llamamos para confirmarlo hoy mismo?' },
];

const container = document.getElementById('mockup-messages');
let idx = 0;
let started = false;

const addBubble = () => {
  if (idx >= messages.length) {
    setTimeout(() => {
      container.innerHTML = '';
      idx = 0;
      setTimeout(addBubble, 800);
    }, 3000);
    return;
  }
  const m = messages[idx];
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${m.type}`;
  bubble.textContent = m.text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  idx++;
  const delay = m.type === 'bot' ? 1800 : 1200;
  setTimeout(addBubble, delay);
};

/* Start mockup when hero is visible */
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !started) {
    started = true;
    setTimeout(addBubble, 1000);
  }
}, { threshold: 0.3 });

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) heroObserver.observe(heroVisual);

/* ─── SMOOTH SCROLL FOR NAV LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
