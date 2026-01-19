/**
 * Middleware para validar campos obrigatórios no body
 * 
 * Uso:
 * router.post('/', validateRequest(['campo1', 'campo2']), controller.create);
 * 
 * @param {Array} requiredFields - Lista de campos obrigatórios
 * @returns {Function} Middleware function
 */
function validateRequest(requiredFields) {
    return (req, res, next) => {
      const missingFields = [];
      const emptyFields = [];
  
      requiredFields.forEach(field => {
        // Verificar se campo existe
        if (!(field in req.body)) {
          missingFields.push(field);
        }
        // Verificar se campo não está vazio
        else if (
          req.body[field] === null ||
          req.body[field] === undefined ||
          req.body[field] === ''
        ) {
          emptyFields.push(field);
        }
      });
  
      if (missingFields.length > 0 || emptyFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validação falhou',
          errors: {
            ...(missingFields.length > 0 && { missing: missingFields }),
            ...(emptyFields.length > 0 && { empty: emptyFields }),
          },
        });
      }
  
      next();
    };
  }
  
  /**
   * Validar formato de email
   */
  function validateEmail(req, res, next) {
    const { email } = req.body;
  
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido',
      });
    }
  
    next();
  }
  
  /**
   * Validar que userId na rota corresponde ao token
   * Previne que usuário acesse dados de outro usuário via URL
   * 
   * Uso:
   * router.get('/users/:userId', authMiddleware, validateOwnership, controller.get);
   */
  function validateOwnership(req, res, next) {
    const userIdFromRoute = req.params.userId;
  
    if (userIdFromRoute && userIdFromRoute !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado: você não tem permissão para acessar este recurso',
      });
    }
  
    next();
  }
  
  /**
   * Validar tipos de dados
   */
  function validateTypes(validations) {
    return (req, res, next) => {
      const errors = [];
  
      Object.entries(validations).forEach(([field, expectedType]) => {
        const value = req.body[field];
  
        if (value === undefined || value === null) {
          return; // Campo não existe, já tratado por validateRequest
        }
  
        switch (expectedType) {
          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push(`${field} deve ser um número`);
            }
            break;
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${field} deve ser uma string`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`${field} deve ser um boolean`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`${field} deve ser um array`);
            }
            break;
          case 'object':
            if (typeof value !== 'object' || Array.isArray(value)) {
              errors.push(`${field} deve ser um objeto`);
            }
            break;
        }
      });
  
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Tipos de dados inválidos',
          errors,
        });
      }
  
      next();
    };
  }
  
  /**
   * Validar valores numéricos (min, max, positive)
   */
  function validateNumber(field, options = {}) {
    return (req, res, next) => {
      const value = req.body[field];
  
      if (value === undefined || value === null) {
        return next();
      }
  
      const num = Number(value);
  
      if (isNaN(num)) {
        return res.status(400).json({
          success: false,
          message: `${field} deve ser um número válido`,
        });
      }
  
      if (options.positive && num <= 0) {
        return res.status(400).json({
          success: false,
          message: `${field} deve ser um número positivo`,
        });
      }
  
      if (options.min !== undefined && num < options.min) {
        return res.status(400).json({
          success: false,
          message: `${field} deve ser maior ou igual a ${options.min}`,
        });
      }
  
      if (options.max !== undefined && num > options.max) {
        return res.status(400).json({
          success: false,
          message: `${field} deve ser menor ou igual a ${options.max}`,
        });
      }
  
      next();
    };
  }
  
  // === Helper Functions ===
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  module.exports = {
    validateRequest,
    validateEmail,
    validateOwnership,
    validateTypes,
    validateNumber,
  };