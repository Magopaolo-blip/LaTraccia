const trace = {
  name: 'Aurora',
  city: 'Roma',
  coords: [41.902782, 12.496366],
  directionPoint: [41.875, 12.58],
  publicRadius: 50,
};

let mapInstance;

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
  const target = document.getElementById('traceMap');
  if (!window.L || !target) return;

  mapInstance = L.map('traceMap', {
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: true,
  }).setView([41.895, 12.515], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(mapInstance);

  const icon = L.divIcon({
    className: '',
    html: '<div class="custom-trace-icon" aria-hidden="true"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  L.polyline([trace.coords, trace.directionPoint], {
    color: '#ad812d',
    weight: 3,
    opacity: 0.72,
    dashArray: '2 12',
    lineCap: 'round',
  }).addTo(mapInstance);

  L.circle(trace.coords, {
    radius: trace.publicRadius,
    color: '#ad812d',
    weight: 1,
    fillColor: '#ad812d',
    fillOpacity: 0.18,
  }).addTo(mapInstance);

  L.marker(trace.coords, { icon }).addTo(mapInstance);
}

function initCenterButton() {
  const button = document.querySelector('[data-center-map]');
  if (!button) return;
  button.addEventListener('click', () => {
    if (mapInstance) mapInstance.setView([41.895, 12.515], 11, { animate: true });
  });
}

function initEncounterForm() {
  const form = document.getElementById('encounterForm');
  const useLocation = document.getElementById('useLocation');
  const formNote = document.getElementById('formNote');
  const counter = document.getElementById('meeting-count');
  let meetings = Number(localStorage.getItem('auroraMeetings') || '1');
  if (counter) counter.textContent = meetings;

  if (useLocation && formNote && form) {
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

  if (form && formNote) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      meetings += 1;
      localStorage.setItem('auroraMeetings', String(meetings));
      if (counter) counter.textContent = meetings;
      form.reset();
      formNote.textContent = 'Passaggio aggiunto nella demo. Con il backend sarà salvato nel Diario reale della Traccia.';
    });
  }
}

function initReveals() {
  const targets = document.querySelectorAll('.aurora-feature, .journey-card, .passport, .diary-section, .about-section, .encounter-section');
  targets.forEach((target) => target.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  targets.forEach((target) => observer.observe(target));
}

updateClock();
setInterval(updateClock, 30_000);
initEncounterForm();
initReveals();
window.addEventListener('load', () => {
  initMap();
  initCenterButton();
});
