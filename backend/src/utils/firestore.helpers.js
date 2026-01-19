const { db } = require("../config/firebase.admin");

/**
 * Busca documentos de uma collection filtrados por userId
 * @param {string} collectionName - Nome da collection
 * @param {string} userId - ID do usuário (Firebase UID)
 * @param {Object} filters - Filtros adicionais (opcional)
 * @returns {Promise} Array de documentos
 */
async function getUserDocuments(collectionName, userId, filters = {}) {
  try {
    let query = db.collection(collectionName).where("userId", "==", userId);

    // Aplicar filtros adicionais
    Object.entries(filters).forEach(([field, value]) => {
      query = query.where(field, "==", value);
    });

    const snapshot = await query.get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`❌ Erro ao buscar ${collectionName}:`, error);
    throw new Error(`Erro ao buscar dados: ${error.message}`);
  }
}

/**
 * Cria documento com userId e timestamps automáticos
 * @param {string} collectionName - Nome da collection
 * @param {string} userId - ID do usuário
 * @param {Object} data - Dados do documento
 * @returns {Promise} Documento criado com ID
 */
async function createUserDocument(collectionName, userId, data) {
  try {
    const timestamp = new Date().toISOString();

    const docData = {
      ...data,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await db.collection(collectionName).add(docData);

    return {
      id: docRef.id,
      ...docData,
    };
  } catch (error) {
    console.error(`❌ Erro ao criar ${collectionName}:`, error);
    throw new Error(`Erro ao criar documento: ${error.message}`);
  }
}

/**
 * Atualiza documento verificando ownership (segurança)
 * @param {string} collectionName - Nome da collection
 * @param {string} docId - ID do documento
 * @param {string} userId - ID do usuário (para verificação)
 * @param {Object} data - Dados para atualizar
 * @returns {Promise} Documento atualizado
 */
async function updateUserDocument(collectionName, docId, userId, data) {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Documento não encontrado");
    }

    // SEGURANÇA: Verificar se o documento pertence ao usuário
    if (doc.data().userId !== userId) {
      throw new Error("Sem permissão para atualizar este documento");
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);

    return {
      id: docId,
      ...doc.data(),
      ...updateData,
    };
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${collectionName}:`, error);
    throw error; // Propagar erro original para manter mensagem
  }
}

/**
 * Deleta documento verificando ownership (segurança)
 * @param {string} collectionName - Nome da collection
 * @param {string} docId - ID do documento
 * @param {string} userId - ID do usuário (para verificação)
 * @returns {Promise} Confirmação de deleção
 */
async function deleteUserDocument(collectionName, docId, userId) {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Documento não encontrado");
    }

    // SEGURANÇA: Verificar se o documento pertence ao usuário
    if (doc.data().userId !== userId) {
      throw new Error("Sem permissão para deletar este documento");
    }

    await docRef.delete();

    return { success: true, id: docId };
  } catch (error) {
    console.error(`❌ Erro ao deletar ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Busca um único documento por ID (com verificação de ownership)
 * @param {string} collectionName - Nome da collection
 * @param {string} docId - ID do documento
 * @param {string} userId - ID do usuário (para verificação)
 * @returns {Promise} Documento ou null
 */
async function getUserDocument(collectionName, docId, userId) {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    // SEGURANÇA: Verificar ownership
    if (doc.data().userId !== userId) {
      throw new Error("Sem permissão para acessar este documento");
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error(`❌ Erro ao buscar documento ${collectionName}:`, error);
    throw error;
  }
}

module.exports = {
  getUserDocuments,
  createUserDocument,
  updateUserDocument,
  deleteUserDocument,
  getUserDocument,
};
