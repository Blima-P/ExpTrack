/**
 * Middleware de tratamento de erros global
 */
const errorHandler = (err, req, res, next) => {
    console.error('Erro:', err);
  
    // Erro de validação do Firebase
    if (err.code && err.code.startsWith('auth/')) {
      return res.status(400).json({
        success: false,
        message: 'Erro de autenticação',
        error: err.message
      });
    }
  
    // Erro padrão
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  };
  
  module.exports = errorHandler;