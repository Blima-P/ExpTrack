/**
 * Middleware global para tratamento de erros
 *
 * Este middleware DEVE ser o ÚLTIMO no app.js
 * Captura todos os erros que não foram tratados
 */
function errorHandler(err, req, res, next) {
  // Log detalhado do erro
  console.error("\n❌ Erro capturado pelo Error Handler:");
  console.error("   Mensagem:", err.message);
  console.error("   Rota:", req.method, req.path);
  console.error("   Body:", JSON.stringify(req.body));

  if (process.env.NODE_ENV === "development") {
    console.error("   Stack:", err.stack);
  }
  console.error("");

  // Erros do Firestore
  if (err.code && err.code.toString().startsWith("firestore/")) {
    return res.status(400).json({
      success: false,
      message: "Erro ao acessar banco de dados",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Erros do Firebase Auth
  if (err.code && err.code.toString().startsWith("auth/")) {
    return res.status(401).json({
      success: false,
      message: "Erro de autenticação",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Erros customizados com statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Erro genérico 500
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}

/**
 * Middleware para rotas não encontradas (404)
 *
 * Deve vir ANTES do errorHandler no app.js
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`,
    availableRoutes: {
      health: "GET /api/health",
      users: "GET /api/users/profile",
      categories: "GET /api/categories",
      expenses: "GET /api/expenses",
    },
  });
}

module.exports = { errorHandler, notFoundHandler };
