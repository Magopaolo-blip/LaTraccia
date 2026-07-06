// Trova la Traccia — configurazione Firebase
// 1) Crea un progetto su Firebase
// 2) Aggiungi una Web App
// 3) Copia qui il firebaseConfig che Firebase ti fornisce
//
// ATTENZIONE: questi valori non sono password. La sicurezza vera va nelle Rules del Realtime Database.

export const firebaseConfig = {
  apiKey: "INCOLLA_API_KEY",
  authDomain: "INCOLLA_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://INCOLLA_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "INCOLLA_PROJECT_ID",
  storageBucket: "INCOLLA_PROJECT_ID.appspot.com",
  messagingSenderId: "INCOLLA_MESSAGING_SENDER_ID",
  appId: "INCOLLA_APP_ID"
};

export const TRACE_ID = "aurora";
export const TRACE_NAME = "Aurora";
export const PUBLIC_APPROXIMATION_METERS = 50;
