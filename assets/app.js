const TRACE_DATA = [
  {
    id: "aurora",
    code: "TLT-A017",
    name: "Aurora",
    born: "6 luglio 2026",
    birthplace: "Roma",
    status: "In viaggio",
    age: "In cammino",
    lastStop: "Roma",
    lastSignal: "18 minuti fa",
    distanceKm: 84,
    people: 12,
    lat: 41.9028,
    lng: 12.4964,
    path: [
      [41.9028, 12.4964],
      [41.9102, 12.4663],
      [41.9218, 12.5152]
    ],
    passport: [
      { city: "Roma", date: "6 luglio 2026", note: "Prima partenza" },
      { city: "Prati", date: "6 luglio 2026", note: "Primo passaggio" },
      { city: "Monte Mario", date: "6 luglio 2026", note: "Nuova custodia" }
    ],
    diary: [
      { date: "6 luglio 2026", place: "Roma", text: "L’ho trovata in una mattina chiara. Sembrava già pronta a ripartire." }
    ]
  },
  {
    id: "nomade",
    code: "TLT-M004",
    name: "Nomade",
    born: "2 luglio 2026",
    birthplace: "Firenze",
    status: "In custodia",
    age: "Esploratrice",
    lastStop: "Firenze",
    lastSignal: "2 ore fa",
    distanceKm: 213,
    people: 31,
    lat: 43.7696,
    lng: 11.2558,
    path: [
      [43.7696, 11.2558],
      [43.7792, 11.2462],
      [43.7904, 11.2811]
    ],
    passport: [
      { city: "Firenze", date: "2 luglio 2026", note: "Nascita" },
      { city: "Fiesole", date: "3 luglio 2026", note: "Prima salita" },
      { city: "Firenze", date: "6 luglio 2026", note: "Ritorno in città" }
    ],
    diary: [
      { date: "6 luglio 2026", place: "Firenze", text: "È rimasta con noi per un aperitivo. Domani forse cambierà mano." }
    ]
  },
  {
    id: "elia",
    code: "TLT-X112",
    name: "Elia",
    born: "5 luglio 2026",
    birthplace: "Napoli",
    status: "Appena nata",
    age: "Appena partita",
    lastStop: "Napoli",
    lastSignal: "ieri",
    distanceKm: 18,
    people: 4,
    lat: 40.8518,
    lng: 14.2681,
    path: [
      [40.8518, 14.2681],
      [40.8399, 14.2520]
    ],
    passport: [
      { city: "Napoli", date: "5 luglio 2026", note: "Prima pagina" },
      { city: "Chiaia", date: "5 luglio 2026", note: "Primo incontro" }
    ],
    diary: [
      { date: "5 luglio 2026", place: "Napoli", text: "Piccola, pesante, silenziosa. L’ho lasciata dove potesse essere notata." }
    ]
  }
];

let map;
let activeTraceId = null;
const markers = new Map();

const italianDateFormatter = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  day: "numeric",
  month: "long",
  year: "numeric"
});

const italianTimeFormatter = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  hour: "2-digit",
  minute: "2-digit"
});

function updateClock() {
  const now = new Date();
  document.getElementById("current-date").textContent = italianDateFormatter.format(now).toUpperCase();
  document.getElementById("current-hour").textContent = italianTimeFormatter.format(now);
}

function approximateCoordinate(lat, lng, meters = 50) {
  const latStep = meters / 111111;
  const lngStep = meters / (111111 * Math.cos(lat * Math.PI / 180));
  return {
    lat: Math.round(lat / latStep) * latStep,
    lng: Math.round(lng / lngStep) * lngStep
  };
}

function getEncounters() {
  try {
    return JSON.parse(localStorage.getItem("tlt_encounters") || "[]");
  } catch (error) {
    return [];
  }
}

function saveEncounter(encounter) {
  const encounters = getEncounters();
  encounters.unshift(encounter);
  localStorage.setItem("tlt_encounters", JSON.stringify(encounters.slice(0, 50)));
}

function getTraceById(id) {
  return TRACE_DATA.find(trace => trace.id === id);
}

function markerHtml() {
  return `<div class="trace-marker" aria-hidden="true"></div>`;
}

function popupHtml(trace) {
  return `
    <h3 class="popup-title">${trace.name}</h3>
    <p class="popup-meta">${trace.status}</p>
    <p class="popup-meta">Ultima tappa: ${trace.lastStop}</p>
    <p class="popup-meta">${trace.lastSignal}</p>
    <a class="popup-link" href="#traccia-${trace.id}" data-open-trace="${trace.id}">Segui il viaggio →</a>
  `;
}

function initMap() {
  map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: false
  }).setView([42.7, 12.7], 6);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  TRACE_DATA.forEach(trace => {
    const approx = approximateCoordinate(trace.lat, trace.lng, 50);
    const icon = L.divIcon({
      className: "",
      html: markerHtml(),
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    L.circle([approx.lat, approx.lng], {
      radius: 50,
      color: "#7d2f25",
      weight: 1,
      fillColor: "#9b7a39",
      fillOpacity: 0.10
    }).addTo(map);

    if (trace.path.length > 1) {
      const approxPath = trace.path.map(point => {
        const p = approximateCoordinate(point[0], point[1], 50);
        return [p.lat, p.lng];
      });
      L.polyline(approxPath, {
        color: "#7d2f25",
        weight: 2,
        opacity: 0.58,
        dashArray: "6 8"
      }).addTo(map);
    }

    const marker = L.marker([approx.lat, approx.lng], { icon })
      .addTo(map)
      .bindPopup(popupHtml(trace));

    marker.on("popupopen", () => {
      const link = document.querySelector(`[data-open-trace="${trace.id}"]`);
      if (link) {
        link.addEventListener("click", event => {
          event.preventDefault();
          openTracePanel(trace.id);
        });
      }
    });

    markers.set(trace.id, marker);
  });
}

function renderArchive() {
  const grid = document.getElementById("trace-grid");
  grid.innerHTML = TRACE_DATA.map(trace => `
    <article class="trace-card" tabindex="0" role="button" data-card-trace="${trace.id}" aria-label="Apri il viaggio di ${trace.name}">
      <div>
        <h3>${trace.name}</h3>
        <span class="status">${trace.status}</span>
      </div>
      <dl>
        <div>
          <dt>Ultima tappa</dt>
          <dd>${trace.lastStop}</dd>
        </div>
        <div>
          <dt>Segnale</dt>
          <dd>${trace.lastSignal}</dd>
        </div>
        <div>
          <dt>Età del viaggio</dt>
          <dd>${trace.age}</dd>
        </div>
        <div>
          <dt>Incontri</dt>
          <dd>${trace.people}</dd>
        </div>
      </dl>
    </article>
  `).join("");

  document.querySelectorAll("[data-card-trace]").forEach(card => {
    const id = card.getAttribute("data-card-trace");
    card.addEventListener("click", () => openTracePanel(id));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openTracePanel(id);
      }
    });
  });
}

function renderPanelContent(trace) {
  const encounters = getEncounters().filter(item => item.traceId === trace.id);
  const encounterEntries = encounters.map(item => ({
    date: item.dateLabel,
    place: item.place || "Tappa registrata",
    text: item.message || "Passaggio aggiunto al viaggio della Traccia."
  }));
  const diary = [...encounterEntries, ...trace.diary];

  return `
    <h2 id="panel-title" class="panel-title">${trace.name}</h2>
    <p class="panel-subtitle">Ogni passaggio lascia un segno.</p>

    <button class="button button-primary" type="button" data-open-encounter="${trace.id}">Ho incontrato questa Traccia</button>

    <section class="identity-grid" aria-label="Carta d’identità della Traccia">
      <div class="identity-item"><span>Codice</span><strong>${trace.code}</strong></div>
      <div class="identity-item"><span>Stato</span><strong>${trace.status}</strong></div>
      <div class="identity-item"><span>Nata il</span><strong>${trace.born}</strong></div>
      <div class="identity-item"><span>Luogo di nascita</span><strong>${trace.birthplace}</strong></div>
      <div class="identity-item"><span>Età del viaggio</span><strong>${trace.age}</strong></div>
      <div class="identity-item"><span>Ultima tappa</span><strong>${trace.lastStop}</strong></div>
      <div class="identity-item"><span>Distanza</span><strong>${trace.distanceKm} km</strong></div>
      <div class="identity-item"><span>Persone incontrate</span><strong>${trace.people + encounters.length}</strong></div>
    </section>

    <section class="passport">
      <h3 class="panel-section-title">Passaporto</h3>
      <div class="passport-grid">
        ${trace.passport.map(stamp => `
          <div class="stamp">
            <div class="stamp-city">${stamp.city}</div>
            <div class="stamp-date">${stamp.date}</div>
            <div class="stamp-note">${stamp.note}</div>
          </div>
        `).join("")}
        ${encounters.map(item => `
          <div class="stamp">
            <div class="stamp-city">${item.place || "Nuova tappa"}</div>
            <div class="stamp-date">${item.dateLabel}</div>
            <div class="stamp-note">${item.actionLabel}</div>
          </div>
        `).join("")}
      </div>
    </section>

    <section class="diary">
      <h3 class="panel-section-title">Diario</h3>
      ${diary.map(entry => `
        <article class="diary-entry">
          <time>${entry.place} · ${entry.date}</time>
          <p>${entry.text}</p>
        </article>
      `).join("")}
    </section>
  `;
}

function openTracePanel(traceId) {
  const trace = getTraceById(traceId);
  if (!trace) return;
  activeTraceId = traceId;
  document.getElementById("panel-content").innerHTML = renderPanelContent(trace);
  document.getElementById("trace-panel").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const encounterButton = document.querySelector(`[data-open-encounter="${traceId}"]`);
  if (encounterButton) {
    encounterButton.addEventListener("click", () => openEncounterModal(traceId));
  }
}

function closeTracePanel() {
  document.getElementById("trace-panel").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openEncounterModal(traceId) {
  const trace = getTraceById(traceId);
  if (!trace) return;
  activeTraceId = traceId;
  document.getElementById("encounter-content").innerHTML = renderEncounterForm(trace);
  document.getElementById("encounter-modal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const form = document.getElementById("encounter-form");
  const positionButton = document.getElementById("use-position");
  const positionStatus = document.getElementById("position-status");

  positionButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      positionStatus.textContent = "Il dispositivo non consente la geolocalizzazione. Inserisci il luogo manualmente.";
      return;
    }
    positionStatus.textContent = "Sto leggendo la posizione…";
    navigator.geolocation.getCurrentPosition(
      position => {
        const approx = approximateCoordinate(position.coords.latitude, position.coords.longitude, 50);
        document.getElementById("lat").value = approx.lat.toFixed(6);
        document.getElementById("lng").value = approx.lng.toFixed(6);
        positionStatus.textContent = "Posizione acquisita e approssimata a 50 metri.";
      },
      () => {
        positionStatus.textContent = "Posizione non disponibile. Puoi inserire il luogo manualmente.";
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 }
    );
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const action = data.get("action");
    const actionLabel = form.querySelector(`option[value="${action}"]`)?.textContent || "Nuovo passaggio";
    const now = new Date();
    const encounter = {
      traceId,
      place: String(data.get("place") || "").trim(),
      message: String(data.get("message") || "").trim(),
      action,
      actionLabel,
      lat: data.get("lat"),
      lng: data.get("lng"),
      dateLabel: `${italianDateFormatter.format(now)} · ${italianTimeFormatter.format(now)}`,
      createdAt: now.toISOString()
    };
    saveEncounter(encounter);
    renderEncounterSuccess(trace);
    renderArchive();
    if (document.getElementById("trace-panel").getAttribute("aria-hidden") === "false") {
      document.getElementById("panel-content").innerHTML = renderPanelContent(trace);
      const encounterButton = document.querySelector(`[data-open-encounter="${traceId}"]`);
      if (encounterButton) encounterButton.addEventListener("click", () => openEncounterModal(traceId));
    }
  });
}

function renderEncounterForm(trace) {
  return `
    <h2 id="encounter-title" class="panel-title">Hai trovato ${trace.name}</h2>
    <p class="panel-subtitle">Aggiungi una pagina al suo viaggio.</p>

    <div class="notice">
      La posizione usata nel sito pubblico viene approssimata a 50 metri. Puoi anche inserire il luogo manualmente.
    </div>

    <form id="encounter-form" class="encounter-form">
      <div class="field">
        <label for="place">Luogo o città</label>
        <input id="place" name="place" placeholder="Es. Roma, Prati" autocomplete="address-level2" />
      </div>

      <div class="form-row">
        <input type="hidden" id="lat" name="lat" />
        <input type="hidden" id="lng" name="lng" />
        <button id="use-position" class="button button-secondary" type="button">Usa la mia posizione</button>
        <span id="position-status" class="notice" aria-live="polite">Posizione facoltativa.</span>
      </div>

      <div class="field">
        <label for="action">Cosa farai con la Traccia?</label>
        <select id="action" name="action">
          <option value="custody">La custodirò per un po’</option>
          <option value="leave">La lascerò in un nuovo luogo</option>
          <option value="entrust">La affiderò a qualcuno</option>
          <option value="stay">L’ho trovata, ma resterà qui</option>
        </select>
      </div>

      <div class="field">
        <label for="message">Messaggio nel Diario</label>
        <textarea id="message" name="message" placeholder="Dove l’hai trovata? Cosa ti ha colpito? Dove pensi che andrà?"></textarea>
      </div>

      <button class="button button-primary" type="submit">Aggiungi il passaggio</button>
    </form>
  `;
}

function renderEncounterSuccess(trace) {
  document.getElementById("encounter-content").innerHTML = `
    <h2 class="panel-title">Passaggio aggiunto</h2>
    <div class="success-box">
      <p><strong>${trace.name}</strong> ha una nuova pagina nel suo viaggio.</p>
      <p>Quando sarà il momento, aiutala a ripartire.</p>
    </div>
    <div class="hero-actions" style="justify-content:flex-start;margin-top:1rem;">
      <button class="button button-primary" type="button" data-close-encounter>Vedi il viaggio</button>
    </div>
  `;
  document.querySelector("[data-close-encounter]").addEventListener("click", closeEncounterModal);
}

function closeEncounterModal() {
  document.getElementById("encounter-modal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = document.getElementById("trace-panel").getAttribute("aria-hidden") === "false" ? "hidden" : "";
}

function bindGlobalEvents() {
  document.querySelectorAll("[data-close-panel]").forEach(node => {
    node.addEventListener("click", closeTracePanel);
  });
  document.querySelectorAll("[data-close-encounter]").forEach(node => {
    node.addEventListener("click", closeEncounterModal);
  });

  document.querySelector('a[href="#trova"]').addEventListener("click", event => {
    event.preventDefault();
    openEncounterModal(activeTraceId || TRACE_DATA[0].id);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeEncounterModal();
      closeTracePanel();
    }
  });
}

function boot() {
  updateClock();
  setInterval(updateClock, 1000 * 30);
  renderArchive();
  initMap();
  bindGlobalEvents();
}

boot();
