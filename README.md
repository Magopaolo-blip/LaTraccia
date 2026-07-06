# Trova la Traccia — v8 con Android Tracker provvisorio

Questa versione permette di usare momentaneamente un cellulare Android come Traccia provvisoria.

## File inclusi

- `index.html` — sito pubblico di Aurora.
- `track.html` — pagina nascosta da aprire sul telefono Android.
- `firebase-config.js` — configurazione Firebase da compilare.
- `firebase-rules-template.json` — regole Firebase Realtime Database da copiare e adattare.

## Cosa fa

Il telefono Android invia una posizione approssimata a 50 metri a Firebase Realtime Database.
Il sito pubblico legge la posizione e aggiorna il viaggio di Aurora.

La posizione precisa del telefono non viene salvata in questa versione: `track.html` arrotonda le coordinate prima di inviarle.

## Procedura

### 1. Crea un progetto Firebase

Vai su Firebase Console e crea un nuovo progetto.

### 2. Aggiungi una Web App

Nel progetto Firebase, aggiungi un'app Web e copia il blocco `firebaseConfig`.

### 3. Crea un Realtime Database

Nel menu Build, apri Realtime Database e crea il database.

### 4. Attiva Authentication anonima

Nel menu Build → Authentication → Sign-in method, abilita il provider `Anonymous`.

### 5. Compila `firebase-config.js`

Sostituisci i valori `INCOLLA_...` con quelli forniti da Firebase.

### 6. Carica i file su GitHub

Carica nel repository:

- `index.html`
- `track.html`
- `firebase-config.js`
- `firebase-rules-template.json`
- `README.md`

### 7. Apri la pagina tracker sul telefono

Apri sul tuo Android:

```text
https://magopaolo-blip.github.io/LaTraccia/track.html
```

La pagina mostrerà un UID anonimo del telefono.

### 8. Inserisci l'UID nelle Rules

Apri Firebase → Realtime Database → Rules.

Copia il contenuto di `firebase-rules-template.json` e sostituisci:

```text
INCOLLA_QUI_UID_DEL_TELEFONO_ANDROID
```

con l'UID mostrato in `track.html`.

Poi pubblica le Rules.

### 9. Avvia il tracker

Dal telefono premi:

```text
Avvia geolocalizzazione
```

Il sito pubblico inizierà ad aggiornarsi.

## Nota importante

Questa è una soluzione provvisoria per testare l'esperienza.

Limiti:

- Android può sospendere il browser in background.
- Il telefono deve restare acceso e la pagina aperta.
- Non è una soluzione definitiva di tracking.

Per il prototipo è sufficiente. Per il prodotto finale servirà un tracker dedicato oppure un'app/servizio più stabile in background.
