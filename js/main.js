// ---- custom cursor ----
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  document.querySelectorAll('a, button, input, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '46px'; ring.style.height = '46px'; ring.style.borderColor = '#ff7a45'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '30px'; ring.style.height = '30px'; ring.style.borderColor = '#a89e8c'; });
  });
  (function loop(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

// ---- scroll progress bar ----
const progressFill = document.getElementById('progressFill');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  if (progressFill) progressFill.style.width = pct + '%';
});

// ---- footer year + "last touched" ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
const lastUpdated = document.getElementById('lastUpdated');
if (lastUpdated) {
  lastUpdated.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ---- mini terminal ----
const termBody = document.getElementById('termBody');
const termInput = document.getElementById('termInput');

const COMMANDS = {
  help: () => "commands: about, projects, work, contact, gpa, sudo hire-me",
  about: () => "Penn State '26, IT major, builds full-stack + automation + occasional embedded C++.",
  projects: () => "AI Study Assistant, Job Agent, Momentum Trading System, Facebook Clone, CarBase, CS50 Chat, Bank Management System, Dino Game, PetStore - scroll down ↓",
  work: () => "Research Assistant @ Penn State (now) · Automation Intern @ PNT Robotics (2024)",
  contact: () => "phadtareyashraj@gmail.com - fastest way to reach me.",
  gpa: () => "4.0 / 4.0. yes, really.",
  "sudo hire-me": () => "permission granted. → scroll to 'say hi' and send an email.",
  whoami: () => "you, currently typing into a portfolio terminal instead of scrolling. respect.",
};

function termPrint(text, isCommand) {
  const line = document.createElement('div');
  line.className = 'term-line';
  line.innerHTML = isCommand ? `$ ${text}` : text;
  termBody.insertBefore(line, termBody.lastElementChild);
  termBody.scrollTop = termBody.scrollHeight;
}

if (termInput) {
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value.trim();
      if (!val) return;
      termPrint(val, true);
      const fn = COMMANDS[val.toLowerCase()];
      termPrint(fn ? fn() : `command not found: ${val} - try "help"`);
      termInput.value = '';
    }
  });
  document.getElementById('terminal').addEventListener('click', () => termInput.focus());
}

// ---- reveal on scroll for sections ----
const revealTargets = document.querySelectorAll('section .wrap');
revealTargets.forEach(el => { el.style.opacity = 0; el.style.transform = 'translateY(18px)'; el.style.transition = 'opacity .6s ease, transform .6s ease'; });
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));
