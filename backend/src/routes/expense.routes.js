const express = require('express');
const router = express.Router();
const {
  authMiddleware,
  validateRequest,
  validateNumber,
} = require('../middlewares');
const expenseController = require('../controllers/expense.controller');

// Autenticação obrigatória em todas as rotas
router.use(authMiddleware);

/**
 * IMPORTANTE: /stats DEVE vir ANTES de /:id
 * Senão "stats" seria interpretado como um ID
 */

/**
 * GET /api/expenses/stats
 * Retorna estatísticas de despesas
 * Query params: month?, year?
 */
router.get('/stats', expenseController.getStats);

/**
 * GET /api/expenses
 * Lista despesas do usuário
 * Query params: categoryId?, startDate?, endDate?, limit?
 */
router.get('/', expenseController.list);

/**
 * GET /api/expenses/:id
 * Busca uma despesa específica
 */
router.get('/:id', expenseController.getOne);

/**
 * POST /api/expenses
 * Cria nova despesa
 * Body: { amount, description, categoryId, date? }
 */
router.post(
  '/',
  validateRequest(['amount', 'description', 'categoryId']),
  validateNumber('amount', { positive: true }),
  expenseController.create
);

/**
 * PUT /api/expenses/:id
 * Atualiza despesa
 * Body: { amount?, description?, categoryId?, date? }
 */
router.put('/:id', expenseController.update);

/**
 * DELETE /api/expenses/:id
 * Deleta despesa
 */
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;