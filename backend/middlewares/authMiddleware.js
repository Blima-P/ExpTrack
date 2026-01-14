const { auth } = require('../config/firebaseAdmin');

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    const idToken = header.split('Bearer ')[1];

    // Verifica e decodifica o token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Salva o UID para uso nos controllers
    req.userId = decodedToken.uid;

    next();
  } catch (error) {
    console.error('Erro no authMiddleware:', error);
    res.status(401).json({ success: false, message: 'Token inválido', error: error.message });
  }
};

module.exports = authMiddleware;
