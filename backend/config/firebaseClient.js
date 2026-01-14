const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

// Configuração do Firebase Client SDK
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Inicializar Firebase Client
const app = initializeApp(firebaseConfig);
const clientAuth = getAuth(app);

module.exports = { clientAuth };