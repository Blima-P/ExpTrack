// src/controllers/auth.controller.js
const { getAuth } = require('firebase-admin/auth');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase.admin');
const { successResponse, errorResponse } = require('../utils/response.helpers');

const auth = getAuth();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * POST /api/auth/register
 * Registra novo usuário
 */
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    // Validações
    if (!email || !password || !name) {
      return errorResponse(res, 'Email, senha e nome são obrigatórios', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Senha deve ter no mínimo 6 caracteres', 400);
    }

    // Criar usuário no Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Criar documento do usuário no Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Gerar token JWT próprio (mais simples para o frontend)
    const token = jwt.sign({ uid: userRecord.uid, email, name }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return successResponse(
      res,
      {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        token,
      },
      'Usuário registrado com sucesso',
      201
    );
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return errorResponse(res, 'Email já cadastrado', 400);
    }
    if (error.code === 'auth/invalid-email') {
      return errorResponse(res, 'Email inválido', 400);
    }
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Faz login do usuário
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return errorResponse(res, 'Email e senha são obrigatórios', 400);
    }

    // Buscar usuário por email
    const userRecord = await auth.getUserByEmail(email);

    // Buscar dados do usuário no Firestore (antes de gerar o token para ter o nome)
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Gerar token JWT próprio
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email, name: userRecord.displayName || userData.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return successResponse(res, {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || userData.name,
      token,
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return errorResponse(res, 'Usuário não encontrado', 401);
    }
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 */
async function getMe(req, res, next) {
  try {
    const { userId } = req; // Vem do authMiddleware

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return errorResponse(res, 'Usuário não encontrado', 404);
    }

    const userData = userDoc.data();

    return successResponse(res, {
      uid: userId,
      email: userData.email,
      name: userData.name,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};
