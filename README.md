# Trova la Traccia — prototipo sito

Prima versione pubblicabile su GitHub Pages.

## Cosa contiene

- Home essenziale con data e ora grandi.
- Mappa `Il viaggio della Traccia` con Leaflet + OpenStreetMap.
- Posizione pubblica approssimata a 50 metri.
- Schede Tracce.
- Pannello della singola Traccia con Carta d’Identità, Passaporto e Diario.
- Flusso `Ho incontrato questa Traccia` con geolocalizzazione browser opzionale.
- Salvataggio demo dei passaggi in `localStorage`.

## Come pubblicarlo su GitHub Pages

1. Crea un repository GitHub, per esempio `trova-la-traccia`.
2. Carica questi file nella root del repository:
   - `index.html`
   - `assets/styles.css`
   - `assets/app.js`
   - `README.md`
3. Vai in **Settings → Pages**.
4. In **Build and deployment**, scegli:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salva.

Dopo qualche minuto GitHub mostrerà l’URL pubblico.

## Nota tecnica importante

Questa versione è un front-end statico, adatta a GitHub Pages.

Per collegare veri tracker GPS serve una fase successiva con backend/API, per esempio:

- Supabase
- Firebase
- Vercel/Netlify Functions
- server Node.js

Il backend dovrà ricevere i dati dai dispositivi, salvarli nel database e fornire al sito solo la posizione pubblica approssimata.

## File principale da modificare

Per cambiare le Tracce demo, modifica l’array `TRACE_DATA` dentro:

`assets/app.js`
