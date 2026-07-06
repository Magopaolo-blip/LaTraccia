# Trova la Traccia — v9 Android Tracker

Versione configurata per il progetto Firebase `trova-la-traccia`.

## File da caricare su GitHub

- `index.html`
- `track.html`
- `firebase-config.js`
- `firebase-rules-template.json`
- `README.md`

## Link pubblici

Sito:

`https://magopaolo-blip.github.io/LaTraccia/`

Tracker Android:

`https://magopaolo-blip.github.io/LaTraccia/track.html`

## Passi Firebase ancora necessari

1. Attivare Realtime Database.
2. Attivare Authentication anonima.
3. Aprire `track.html` dal telefono Android.
4. Copiare l'UID generato.
5. Inserire l'UID nelle Rules Firebase.
6. Avviare la geolocalizzazione dal telefono.

## Regole provvisorie

Il file `firebase-rules-template.json` contiene il modello sicuro da usare dopo aver copiato l'UID Android.
