const jwt = require("jsonwebtoken");
const { auth } = require("../config/firebase.admin");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

/**
 * Middleware para validar token JWT do Firebase
 *
 * Fluxo:
 * 1. Extrai token do header Authorization
 * 2. Valida token com Firebase Admin SDK
 * 3. Extrai userId (UID) do token
 * 4. Anexa userId ao request (req.userId)
 * 5. Passa para próximo middleware/controller
 *
 * Header esperado:
 * Authorization: Bearer
 */
async function authMiddleware(req, res, next) {
  try {
    // 1. Extrair token do header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token de autenticação não fornecido",
        hint: "Inclua o header: Authorization: Bearer ",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    let decodedToken;

    // 2. Tentar validar JWT próprio primeiro (mais simples para o frontend)
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      // 3. Se falhar, tenta validar como ID Token do Firebase
      decodedToken = await auth.verifyIdToken(token);
    }

    // 4. Anexar dados do usuário ao request
    req.userId = decodedToken.uid;
    req.userEmail = decodedToken.email;

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    // Log em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log(`🔐 Usuário autenticado: ${req.userEmail} (${req.userId})`);
    }

    // 5. Continuar para o próximo middleware/controller
    next();
  } catch (error) {
    console.error("❌ Erro na autenticação:", error.message);

    // Tratar erros específicos do Firebase
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
        hint: "Faça login novamente para obter um novo token",
      });
    }

    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        success: false,
        message: "Token malformado",
      });
    }

    if (error.code === "auth/invalid-credential") {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    // Erro genérico de autenticação
    return res.status(401).json({
      success: false,
      message: "Falha na autenticação",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

module.exports = authMiddleware;
