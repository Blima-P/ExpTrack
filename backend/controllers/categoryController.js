const { db } = require('../config/firebaseAdmin');
const { collectionToArray, getCurrentTimestamp } = require('../utils/firestoreHelpers');

// Validação simples de cor HEX
const isValidHexColor = (color) =>
  /^#([0-9A-F]{3}){1,2}$/i.test(color);

/**
 * Criar nova categoria
 * POST /api/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.userId;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome da categoria é obrigatório'
      });
    }

    const categoryColor = color ? color.trim() : '#000000';

    if (color && !isValidHexColor(categoryColor)) {
      return res.status(400).json({
        success: false,
        message: 'Cor inválida. Use formato HEX (#RRGGBB)'
      });
    }

    const normalizedName = name.trim().toLowerCase();

    // 🔒 Verifica duplicidade por usuário
    const existingCategorySnapshot = await db
      .collection('categories')
      .where('userId', '==', userId)
      .where('nameNormalized', '==', normalizedName)
      .limit(1)
      .get();

    if (!existingCategorySnapshot.empty) {
      return res.status(409).json({
        success: false,
        message: 'Você já possui uma categoria com esse nome'
      });
    }

    const categoryData = {
      name: name.trim(),
      nameNormalized: normalizedName, // 🔑 campo chave
      color: categoryColor,
      userId,
      createdAt: getCurrentTimestamp()
    };

    const categoryRef = await db.collection('categories').add(categoryData);

    res.status(201).json({
      success: true,
      message: 'Categoria criada com sucesso',
      data: {
        id: categoryRef.id,
        ...categoryData
      }
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar categoria',
      error: error.message
    });
  }
};


/**
 * Listar categorias do usuário
 * GET /api/categories
 */
const getCategories = async (req, res) => {
  try {
    const userId = req.userId;

    const snapshot = await db.collection('categories')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const categories = collectionToArray(snapshot);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar categorias',
      error: error.message
    });
  }
};

/**
 * Atualizar categoria
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.userId;

    // Validação básica
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome da categoria é obrigatório'
      });
    }

    if (color && !isValidHexColor(color.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Cor inválida. Use formato HEX (#RRGGBB)'
      });
    }

    const categoryRef = db.collection('categories').doc(id);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    const categoryData = categoryDoc.data();

    // Segurança: categoria pertence ao usuário?
    if (categoryData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar esta categoria'
      });
    }

    const normalizedName = name.trim().toLowerCase();

    // 🔒 Verificar duplicidade (exceto a própria categoria)
    const duplicateSnapshot = await db
      .collection('categories')
      .where('userId', '==', userId)
      .where('nameNormalized', '==', normalizedName)
      .get();

    const hasDuplicate = duplicateSnapshot.docs.some(
      doc => doc.id !== id
    );

    if (hasDuplicate) {
      return res.status(409).json({
        success: false,
        message: 'Você já possui outra categoria com esse nome'
      });
    }

    // Atualização final
    const updatedData = {
      name: name.trim(),
      nameNormalized: normalizedName,
      color: color ? color.trim() : categoryData.color
    };

    await categoryRef.update(updatedData);

    res.status(200).json({
      success: true,
      message: 'Categoria atualizada com sucesso',
      data: {
        id,
        ...updatedData,
        userId,
        createdAt: categoryData.createdAt
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar categoria',
      error: error.message
    });
  }
};


/**
 * Deletar categoria
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const categoryRef = db.collection('categories').doc(id);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    const categoryData = categoryDoc.data();

    if (categoryData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar esta categoria'
      });
    }

    const expensesSnapshot = await db.collection('expenses')
      .where('categoryId', '==', id)
      .limit(1)
      .get();

    if (!expensesSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar categoria com gastos associados'
      });
    }

    await categoryRef.delete();

    res.status(200).json({
      success: true,
      message: 'Categoria deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar categoria',
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
