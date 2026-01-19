// src/controllers/user.controller.js
const { db } = require('../config/firebase.admin');
const {
  successResponse,
  errorResponse,
  notFoundResponse,
} = require('../utils/response.helpers');

const USERS_COLLECTION = 'users';

/**
 * GET /api/users/profile
 * Busca perfil do usuário autenticado
 */
async function getProfile(req, res, next) {
  try {
    const { userId } = req; // Vem do authMiddleware

    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();

    if (!userDoc.exists) {
      // Usuário existe no Auth mas não tem perfil no Firestore
      return notFoundResponse(
        res,
        'Perfil não encontrado. Crie um perfil primeiro.'
      );
    }

    const userData = {
      id: userDoc.id,
      ...userDoc.data(),
    };

    return successResponse(res, userData, 'Perfil carregado com sucesso');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/users/profile
 * Cria perfil inicial do usuário
 * Chamado após registro no frontend
 */
async function createProfile(req, res, next) {
  try {
    const { userId, userEmail } = req; // Vem do authMiddleware
    const { displayName, photoURL, phoneNumber } = req.body;

    // Verificar se já existe perfil
    const existingUser = await db.collection(USERS_COLLECTION).doc(userId).get();
    
    if (existingUser.exists) {
      return errorResponse(res, 'Perfil já existe', 400);
    }

    // Criar perfil
    const userData = {
      email: userEmail,
      displayName: displayName || '',
      photoURL: photoURL || '',
      phoneNumber: phoneNumber || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection(USERS_COLLECTION).doc(userId).set(userData);

    return successResponse(
      res,
      { id: userId, ...userData },
      'Perfil criado com sucesso',
      201
    );
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/profile
 * Atualiza perfil do usuário autenticado
 */
async function updateProfile(req, res, next) {
  try {
    const { userId } = req;
    const { displayName, photoURL, phoneNumber } = req.body;

    // Validar se tem pelo menos um campo para atualizar
    if (!displayName && !photoURL && !phoneNumber) {
      return errorResponse(res, 'Nenhum campo para atualizar', 400);
    }

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    // Adicionar apenas campos fornecidos
    if (displayName !== undefined) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    
    // Verificar se perfil existe
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return notFoundResponse(res, 'Perfil não encontrado');
    }

    // Atualizar
    await userRef.update(updateData);

    // Buscar dados atualizados
    const updatedDoc = await userRef.get();
    const userData = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    return successResponse(res, userData, 'Perfil atualizado com sucesso');
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/users/profile
 * Deleta perfil do usuário (soft delete)
 */
async function deleteProfile(req, res, next) {
  try {
    const { userId } = req;

    // Deletar perfil do Firestore
    await db.collection(USERS_COLLECTION).doc(userId).delete();

    // Nota: O usuário ainda existe no Firebase Auth
    // Para deletar completamente, use: admin.auth().deleteUser(userId)
    // Mas isso requer cuidado e confirmação do usuário

    return successResponse(res, null, 'Perfil deletado com sucesso');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
};