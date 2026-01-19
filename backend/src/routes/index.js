const express = require('express');
const router = express.Router();

// Importar rotas
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const expenseRoutes = require('./expense.routes');

/**
 * Rota de health check (sem autenticação)
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Rota de informações da API (sem autenticação)
 * GET /api
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'Expense Tracker API',
    version: '2.0.0',
    description: 'Backend API com Node.js, Express e Firebase',
    endpoints: {
      health: 'GET /api/health',
      user: {
        getProfile: 'GET /api/users/profile',
        createProfile: 'POST /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        deleteProfile: 'DELETE /api/users/profile',
      },
      categories: {
        list: 'GET /api/categories',
        getOne: 'GET /api/categories/:id',
        create: 'POST /api/categories',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id',
      },
      expenses: {
        list: 'GET /api/expenses',
        getOne: 'GET /api/expenses/:id',
        create: 'POST /api/expenses',
        update: 'PUT /api/expenses/:id',
        delete: 'DELETE /api/expenses/:id',
        stats: 'GET /api/expenses/stats',
      },
    },
  });
});

// Aplicar rotas com prefixos
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);

module.exports = router;