// src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

/**
 * Rotas públicas (sem autenticação)
 */

/**
 * POST /api/auth/register
 * Registra novo usuário
 * Body: { email, password, name }
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Faz login do usuário
 * Body: { email, password }
 */
router.post('/login', authController.login);

/**
 * Rotas protegidas (com autenticação)
 */

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 */
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
