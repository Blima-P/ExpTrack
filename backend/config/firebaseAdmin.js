const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Exportar instâncias do Firestore e Auth
const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };