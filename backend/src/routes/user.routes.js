const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares');
const userController = require('../controllers/user.controller');

// Todas as rotas de usuário precisam de autenticação
router.use(authMiddleware);

/**
 * GET /api/users/profile
 * Busca perfil do usuário autenticado
 */
router.get('/profile', userController.getProfile);

/**
 * POST /api/users/profile
 * Cria perfil inicial (chamado após registro no frontend)
 */
router.post('/profile', userController.createProfile);

/**
 * PUT /api/users/profile
 * Atualiza perfil do usuário
 */
router.put('/profile', userController.updateProfile);

/**
 * DELETE /api/users/profile
 * Deleta perfil do usuário
 */
router.delete('/profile', userController.deleteProfile);

module.exports = router;