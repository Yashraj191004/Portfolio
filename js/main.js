// ---- custom cursor ----
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  document.querySelectorAll('a, button, input, .proj-card, .build-tab, .map-node').forEach(el => {
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

// ---- hero spotlight ----
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
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
  help: () => "commands: about, mode, projects, work, contact, sudo hire-me",
  about: () => "Penn State '26, IT major, builds full-stack + automation + occasional embedded C++.",
  mode: () => "current mode: build small, learn fast, automate the boring parts, then polish until it feels human.",
  projects: () => "AI Study Assistant, Job Agent, Momentum Trading System, Facebook Clone, CarBase, CS50 Chat, Bank Management System, Dino Game, PetStore - scroll down ↓",
  work: () => "Research Assistant @ Penn State (now) · Automation Intern @ PNT Robotics (2024)",
  contact: () => "phadtareyashraj@gmail.com - fastest way to reach me.",
  "sudo hire-me": () => "permission granted. → scroll to 'say hi' and send an email.",
  whoami: () => "you, currently typing into a portfolio terminal instead of scrolling. respect.",
};

// ---- build mode switcher ----
const buildModes = {
  learn: {
    path: "~/yashraj/mode/learn",
    title: "I turn curiosity into working demos.",
    copy: "Give me a new API, messy docs, or a half-formed idea and I will usually come back with a small thing that runs."
  },
  automate: {
    path: "~/yashraj/mode/automate",
    title: "I get suspicious of repeated clicks.",
    copy: "If a task feels boring by the third time, I start thinking about scripts, dashboards, browser extensions, and small tools that remove the drag."
  },
  ship: {
    path: "~/yashraj/mode/ship",
    title: "I like complete little systems.",
    copy: "Frontend, backend, database, auth, scraping, sockets, deployment notes. I care about the connective tissue that makes a project feel real."
  },
  debug: {
    path: "~/yashraj/mode/debug",
    title: "I can sit with weird bugs.",
    copy: "Firmware timing, flaky scraping, slow Python, broken state. I am patient with problems that do not explain themselves politely."
  }
};

const buildTabs = document.querySelectorAll('.build-tab');
const buildPath = document.getElementById('buildPath');
const buildTitle = document.getElementById('buildTitle');
const buildCopy = document.getElementById('buildCopy');

buildTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const mode = buildModes[tab.dataset.build];
    if (!mode || !buildPath || !buildTitle || !buildCopy) return;
    buildTabs.forEach(item => item.classList.remove('is-active'));
    tab.classList.add('is-active');
    buildPath.textContent = mode.path;
    buildTitle.textContent = mode.title;
    buildCopy.textContent = mode.copy;
  });
});

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

// ---- nav: glass on scroll + active section highlight ----
const navEl = document.querySelector('nav');
const allNavLinks = document.querySelectorAll('.nav-links a');
const allAnchors = document.querySelectorAll('[id]');

window.addEventListener('scroll', () => {
  navEl.classList.toggle('nav-scrolled', window.scrollY > 50);

  let current = '';
  allAnchors.forEach(el => {
    if (window.scrollY >= el.offsetTop - 220) current = el.id;
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('nav-active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// ---- 3d tilt on project cards ----
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 3}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ---- magnetic cta buttons ----
document.querySelectorAll('.btn-line').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.28;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});
