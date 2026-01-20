const { db } = require('../config/firebaseAdmin');
const { collectionToArray, docToObject, getCurrentTimestamp } = require('../utils/firestoreHelpers');

/**
 * Criar novo gasto
 * POST /api/expenses
 */
const createExpense = async (req, res) => {
  try {
    const { value, description, categoryId } = req.body;
    const userId = req.userId;

    // Validação
    if (!value || value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor deve ser maior que zero'
      });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Descrição é obrigatória'
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Categoria é obrigatória'
      });
    }

    // Verificar se a categoria existe e pertence ao usuário
    const categoryDoc = await db.collection('categories').doc(categoryId).get();
    
    if (!categoryDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    if (categoryDoc.data().userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Categoria não pertence ao usuário'
      });
    }

    // Criar gasto no Firestore
    const expenseData = {
      value: parseFloat(value),
      description: description.trim(),
      categoryId: categoryId,
      userId: userId,
      createdAt: getCurrentTimestamp()
    };

    const expenseRef = await db.collection('expenses').add(expenseData);

    res.status(201).json({
      success: true,
      message: 'Gasto criado com sucesso',
      data: {
        id: expenseRef.id,
        ...expenseData
      }
    });
  } catch (error) {
    console.error('Erro ao criar gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar gasto',
      error: error.message
    });
  }
};

/**
 * Listar gastos do usuário
 * GET /api/expenses
 */
const getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    let { categoryId } = req.query;

    console.log('========== GETEXPENSES ==========');
    console.log('userId:', userId);
    console.log('categoryId from query:', categoryId, 'tipo:', typeof categoryId);
    console.log('Full req.query:', req.query);

    // Converter "null" string para null real
    if (categoryId === 'null' || categoryId === '') {
      categoryId = null;
    }

    console.log('categoryId após conversão:', categoryId);

    // Query base: buscar apenas gastos do usuário ordenados por data
    console.log('Executando query...');
    const query = db.collection('expenses')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    let expenses = collectionToArray(snapshot);

    console.log('📊 Total de despesas do usuário:', expenses.length);
    console.log('Primeiras 2 despesas:', JSON.stringify(expenses.slice(0, 2)));

    // Filtro opcional por categoria (feito em memória para evitar problema de índice)
    if (categoryId && categoryId !== 'null') {
      console.log('🔍 Filtrando por categoria:', categoryId);
      expenses = expenses.filter(expense => {
        console.log('  Comparando:', expense.categoryId, '===', categoryId, '?', expense.categoryId === categoryId);
        return expense.categoryId === categoryId;
      });
      console.log('📊 Despesas após filtro:', expenses.length);
    }

    console.log('Mapeando para incluir categoria...');
    // Buscar informações das categorias
    const expensesWithCategory = await Promise.all(
      expenses.map(async (expense) => {
        const categoryDoc = await db.collection('categories').doc(expense.categoryId).get();
        return {
          ...expense,
          category: categoryDoc.exists ? { id: categoryDoc.id, ...categoryDoc.data() } : null
        };
      })
    );

    // Calcular total
    const total = expenses.reduce((sum, expense) => sum + expense.value, 0);
    const totalRounded = Number(total.toFixed(2));

    console.log('✅ Retornando', expensesWithCategory.length, 'despesas com total:', totalRounded);
    console.log('========== FIM GETEXPENSES ==========');

    res.status(200).json({
      success: true,
      count: expenses.length,
      total: totalRounded,
      data: expensesWithCategory
    });
  } catch (error) {
    console.error('========== ERRO GETEXPENSES ==========');
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
    console.error('========== FIM ERRO ==========');
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar gastos',
      error: error.message
    });
  }
};

/**
 * Atualizar gasto
 * PUT /api/expenses/:id
 */
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, description, categoryId } = req.body;
    const userId = req.userId;

    // Buscar gasto
    const expenseRef = db.collection('expenses').doc(id);
    const expenseDoc = await expenseRef.get();

    if (!expenseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Gasto não encontrado'
      });
    }

    // Verificar se o gasto pertence ao usuário
    const expenseData = expenseDoc.data();
    if (expenseData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar este gasto'
      });
    }

    // Preparar dados para atualização
    const updateData = {};

    if (value !== undefined) {
      if (value <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor deve ser maior que zero'
        });
      }
      updateData.value = parseFloat(value);
    }

    if (description !== undefined) {
      if (description.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Descrição não pode ser vazia'
        });
      }
      updateData.description = description.trim();
    }

    if (categoryId !== undefined) {
      // Verificar se a categoria existe e pertence ao usuário
      const categoryDoc = await db.collection('categories').doc(categoryId).get();
      
      if (!categoryDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      if (categoryDoc.data().userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Categoria não pertence ao usuário'
        });
      }

      updateData.categoryId = categoryId;
    }

    // Atualizar gasto
    await expenseRef.update(updateData);

    // Buscar gasto atualizado
    const updatedDoc = await expenseRef.get();
    const updatedExpense = docToObject(updatedDoc);

    res.status(200).json({
      success: true,
      message: 'Gasto atualizado com sucesso',
      data: updatedExpense
    });
  } catch (error) {
    console.error('Erro ao atualizar gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar gasto',
      error: error.message
    });
  }
};

/**
 * Deletar gasto
 * DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Buscar gasto
    const expenseRef = db.collection('expenses').doc(id);
    const expenseDoc = await expenseRef.get();

    if (!expenseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Gasto não encontrado'
      });
    }

    // Verificar se o gasto pertence ao usuário
    const expenseData = expenseDoc.data();
    if (expenseData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar este gasto'
      });
    }

    // Deletar gasto
    await expenseRef.delete();

    res.status(200).json({
      success: true,
      message: 'Gasto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar gasto',
      error: error.message
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};