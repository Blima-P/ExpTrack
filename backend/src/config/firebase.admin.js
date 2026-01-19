const admin = require("firebase-admin");

/**
 * Inicializa Firebase Admin SDK
 * Evita inicialização duplicada
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Substituir \n literal por quebra de linha real
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

  console.log("✅ Firebase Admin SDK inicializado");
  console.log(`📁 Projeto: ${process.env.FIREBASE_PROJECT_ID}`);
} else {
  console.log("⚠️  Firebase Admin já estava inicializado");
}

// Exportar instâncias prontas para uso
const db = admin.firestore();
const auth = admin.auth();

// Configurações opcionais do Firestore
db.settings({
  ignoreUndefinedProperties: true, // Ignora campos undefined
});

module.exports = {
  admin, // Instância completa do Firebase Admin
  db, // Firestore Database
  auth, // Firebase Auth
};
