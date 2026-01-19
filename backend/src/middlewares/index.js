/**
 * Exportação centralizada de todos os middlewares
 * Facilita imports nos controllers e rotas
 */

const authMiddleware = require('./auth.middleware');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const {
  validateRequest,
  validateEmail,
  validateOwnership,
  validateTypes,
  validateNumber,
} = require('./validateRequest');

module.exports = {
  // Autenticação
  authMiddleware,
  
  // Tratamento de erros
  errorHandler,
  notFoundHandler,
  
  // Validações
  validateRequest,
  validateEmail,
  validateOwnership,
  validateTypes,
  validateNumber,
};