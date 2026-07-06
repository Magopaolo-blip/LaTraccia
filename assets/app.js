const trace = {
  name: 'Aurora',
  code: 'AUR-0636-01',
  city: 'Roma',
  coords: [41.902782, 12.496366],
  publicRadius: 50,
};

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateClock() {
  const now = new Date();
  const date = now.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  document.getElementById('current-date').textContent = date;
  document.getElementById('current-time').textContent = time;
}

function initMap() {
  if (!window.L) return;
  const map = L.map('traceMap', {
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
  }).setView(trace.coords, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: '<div class="custom-trace-icon" aria-hidden="true"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  L.circle(trace.coords, {
    radius: trace.publicRadius,
    color: '#b89245',
    weight: 1,
    fillColor: '#b89245',
    fillOpacity: 0.18,
  }).addTo(map);

  L.marker(trace.coords, { icon }).addTo(map).bindPopup('Aurora · Roma');
}

function initMenu() {
  const button = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!button || !menu) return;
  button.addEventListener('click', () => menu.classList.toggle('is-open'));
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => menu.classList.remove('is-open'));
  });
}

function initDialog() {
  const dialog = document.querySelector('[data-trace-dialog]');
  const open = document.querySelector('[data-open-trace]');
  const closeButtons = document.querySelectorAll('[data-close-dialog]');
  if (!dialog || !open) return;

  open.addEventListener('click', () => dialog.showModal());
  closeButtons.forEach((button) => button.addEventListener('click', () => dialog.close()));
}

function initEncounterForm() {
  const form = document.getElementById('encounterForm');
  const useLocation = document.getElementById('useLocation');
  const formNote = document.getElementById('formNote');
  const counters = [
    document.getElementById('meeting-count'),
    document.getElementById('identity-meetings'),
    document.getElementById('archive-meetings'),
    document.getElementById('dialog-meetings'),
  ].filter(Boolean);

  let meetings = Number(localStorage.getItem('auroraMeetings') || '1');
  counters.forEach((node) => { node.textContent = meetings; });

  if (useLocation) {
    useLocation.addEventListener('click', () => {
      if (!navigator.geolocation) {
        formNote.textContent = 'Geolocalizzazione non disponibile su questo dispositivo.';
        return;
      }
      formNote.textContent = 'Sto cercando la posizione...';
      navigator.geolocation.getCurrentPosition(
        () => {
          form.place.value = 'Posizione rilevata · approssimata a 50 metri';
          formNote.textContent = 'Posizione acquisita. Nel sito pubblico resterà approssimata.';
        },
        () => {
          formNote.textContent = 'Permesso negato. Puoi inserire il luogo manualmente.';
        },
        { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
      );
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      meetings += 1;
      localStorage.setItem('auroraMeetings', String(meetings));
      counters.forEach((node) => { node.textContent = meetings; });
      form.reset();
      formNote.textContent = 'Il tuo passaggio è stato aggiunto in questa demo. Con il backend sarà salvato nel Diario reale della Traccia.';
    });
  }
}

function initReveals() {
  const targets = document.querySelectorAll('.section-index, .map-heading, .map-wrap, .identity-grid, .passport-shell, .diary-board, .archive-card, .encounter-card');
  targets.forEach((target) => target.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.18 });
  targets.forEach((target) => observer.observe(target));
}

function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

updateClock();
setInterval(updateClock, 30_000);
initMenu();
initDialog();
initEncounterForm();
initReveals();
initCursorGlow();
window.addEventListener('load', initMap);
