/**
 * Resposta de sucesso padronizada
 */
function successResponse(res, data, message = "Sucesso", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Resposta de erro padronizada
 */
function errorResponse(res, message = "Erro", statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}

/**
 * Resposta de validação de erro
 */
function validationErrorResponse(res, errors) {
  return errorResponse(res, "Erro de validação", 400, errors);
}

/**
 * Resposta de não autorizado
 */
function unauthorizedResponse(res, message = "Não autorizado") {
  return errorResponse(res, message, 401);
}

/**
 * Resposta de não encontrado
 */
function notFoundResponse(res, message = "Recurso não encontrado") {
  return errorResponse(res, message, 404);
}

/**
 * Resposta de acesso negado
 */
function forbiddenResponse(res, message = "Acesso negado") {
  return errorResponse(res, message, 403);
}

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
  forbiddenResponse,
};
