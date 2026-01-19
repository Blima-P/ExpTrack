const admin = require('firebase-admin');

// Carrega credenciais a partir de variáveis de ambiente ou do arquivo local
const getCredentials = () => {
  // Preferência: chave base64 em env (não precisa de arquivo no disco)
  if (process.env.FIREBASE_ADMIN_KEY_BASE64) {
    const decoded = Buffer.from(process.env.FIREBASE_ADMIN_KEY_BASE64, 'base64').toString('utf8');
    return JSON.parse(decoded);
  }

  // Alternativa: GOOGLE_APPLICATION_CREDENTIALS padrão
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return null; // use applicationDefault abaixo
  }

  // Fallback: arquivo local serviceAccountKey.json
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require('../serviceAccountKey.json');
  } catch (err) {
    throw new Error(
      'Credenciais do Firebase Admin não encontradas. Defina FIREBASE_ADMIN_KEY_BASE64 ou coloque serviceAccountKey.json em backend/.'
    );
  }
};

const credentials = getCredentials();

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: credentials
    ? admin.credential.cert(credentials)
    : admin.credential.applicationDefault()
});

// Exportar instâncias do Firestore e Auth
const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };