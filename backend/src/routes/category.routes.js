const express = require('express');
const router = express.Router();
const { authMiddleware, validateRequest } = require('../middlewares');
const categoryController = require('../controllers/category.controller');

// Autenticação obrigatória em todas as rotas
router.use(authMiddleware);

/**
 * GET /api/categories
 * Lista todas as categorias do usuário
 */
router.get('/', categoryController.list);

/**
 * GET /api/categories/:id
 * Busca uma categoria específica
 */
router.get('/:id', categoryController.getOne);

/**
 * POST /api/categories
 * Cria nova categoria
 * Body: { name, icon?, color? }
 */
router.post(
  '/',
  validateRequest(['name']), // nome é obrigatório
  categoryController.create
);

/**
 * PUT /api/categories/:id
 * Atualiza categoria
 * Body: { name?, icon?, color? }
 */
router.put('/:id', categoryController.update);

/**
 * DELETE /api/categories/:id
 * Deleta categoria
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;