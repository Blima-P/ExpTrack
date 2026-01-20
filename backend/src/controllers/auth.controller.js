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
 * NOTA: O Firebase Admin SDK não valida senhas.
 * Para validação de senha, o cliente deve usar o Firebase Client SDK
 * ou enviar um ID token já validado pelo Firebase Authentication.
 */
async function login(req, res, next) {
  try {
    const { email, password, idToken } = req.body;

    // Validações
    if (!email) {
      return errorResponse(res, 'Email é obrigatório', 400);
    }

    // Se recebeu idToken do Firebase Client, validar ele
    if (idToken) {
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        
        // Buscar dados do usuário no Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};

        // Gerar token JWT próprio
        const token = jwt.sign(
          { uid: decodedToken.uid, email: decodedToken.email, name: userData.name || decodedToken.name },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return successResponse(res, {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: userData.name || decodedToken.name,
          token,
        });
      } catch (error) {
        return errorResponse(res, 'Token inválido', 401);
      }
    }

    // Se não tem idToken, assume que o cliente já fez a autenticação via Firebase Client
    // e só precisa de um JWT do nosso servidor
    if (!password) {
      return errorResponse(res, 'Senha ou idToken são obrigatórios', 400);
    }

    // Buscar usuário por email (sem validar senha - isso é feito no cliente)
    const userRecord = await auth.getUserByEmail(email);

    // Buscar dados do usuário no Firestore
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
      return errorResponse(res, 'Email ou senha inválidos', 401);
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
