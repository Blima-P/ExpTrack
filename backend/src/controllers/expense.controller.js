// src/controllers/expense.controller.js
const { db } = require('../config/firebase.admin');
const {
    getUserDocuments,
    createUserDocument,
    updateUserDocument,
    deleteUserDocument,
  } = require('../utils/firestore.helpers');
  const { successResponse, errorResponse } = require('../utils/response.helpers');
  
  const COLLECTION = 'expenses';
  
  /**
   * GET /api/expenses
   * Lista despesas com filtros opcionais
   * Query params: categoryId?, startDate?, endDate?, limit?
   */
  async function list(req, res, next) {
    try {
      const { userId } = req;
      const { categoryId, startDate, endDate, limit } = req.query;
  
      // Filtros base
      const filters = {};
      if (categoryId) filters.categoryId = categoryId;
  
      let expenses = await getUserDocuments(COLLECTION, userId, filters);
  
      // Filtrar por data (em memória, pois Firestore tem limitações)
      if (startDate || endDate) {
        expenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          if (startDate && expenseDate < new Date(startDate)) return false;
          if (endDate && expenseDate > new Date(endDate)) return false;
          return true;
        });
      }
  
      // Ordenar por data (mais recente primeiro)
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      // Limitar resultados (se especificado)
      if (limit && !isNaN(limit)) {
        expenses = expenses.slice(0, parseInt(limit));
      }
  
      // Calcular total
      const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  
      return res.json({
        success: true,
        data: expenses,
        total: total,
        count: expenses.length,
        message: `${expenses.length} despesa(s) encontrada(s)`
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/expenses/:id
   * Busca uma despesa específica
   */
  async function getOne(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;
  
      const expenseRef = await db.collection(COLLECTION).doc(id).get();
  
      if (!expenseRef.exists) {
        return errorResponse(res, 'Despesa não encontrada', 404);
      }
  
      // Verificar ownership
      if (expenseRef.data().userId !== userId) {
        return errorResponse(res, 'Acesso negado', 403);
      }
  
      const expense = {
        id: expenseRef.id,
        ...expenseRef.data(),
      };
  
      return successResponse(res, expense, 'Despesa encontrada');
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * POST /api/expenses
   * Cria nova despesa
   * Body: { amount, description, categoryId, date? }
   */
  async function create(req, res, next) {
    try {
      const { userId } = req;
      const { amount, description, categoryId, date } = req.body;
  
      // Validações adicionais
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return errorResponse(res, 'Valor deve ser um número positivo', 400);
      }
  
      if (description.trim().length === 0) {
        return errorResponse(res, 'Descrição não pode ser vazia', 400);
      }
  
      if (description.length > 200) {
        return errorResponse(res, 'Descrição muito longa (máx 200 caracteres)', 400);
      }
  
      // Verificar se categoria existe (opcional mas recomendado)
      // const categoryExists = await db.collection('categories').doc(categoryId).get();
      // if (!categoryExists.exists) {
      //   return errorResponse(res, 'Categoria não encontrada', 400);
      // }
  
      const expenseData = {
        amount: numAmount,
        description: description.trim(),
        categoryId,
        date: date || new Date().toISOString(),
      };
  
      const newExpense = await createUserDocument(COLLECTION, userId, expenseData);
  
      return successResponse(res, newExpense, 'Despesa criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * PUT /api/expenses/:id
   * Atualiza despesa
   * Body: { amount?, description?, categoryId?, date? }
   */
  async function update(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;
      const { amount, description, categoryId, date } = req.body;
  
      const updateData = {};
  
      if (amount !== undefined) {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
          return errorResponse(res, 'Valor deve ser um número positivo', 400);
        }
        updateData.amount = numAmount;
      }
  
      if (description !== undefined) {
        if (description.trim().length === 0) {
          return errorResponse(res, 'Descrição não pode ser vazia', 400);
        }
        if (description.length > 200) {
          return errorResponse(res, 'Descrição muito longa (máx 200 caracteres)', 400);
        }
        updateData.description = description.trim();
      }
  
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (date !== undefined) updateData.date = date;
  
      if (Object.keys(updateData).length === 0) {
        return errorResponse(res, 'Nenhum campo para atualizar', 400);
      }
  
      const updatedExpense = await updateUserDocument(COLLECTION, id, userId, updateData);
  
      return successResponse(res, updatedExpense, 'Despesa atualizada com sucesso');
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return errorResponse(res, 'Despesa não encontrada', 404);
      }
      if (error.message.includes('permissão')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }
  
  /**
   * DELETE /api/expenses/:id
   * Deleta despesa
   */
  async function deleteExpense(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;
  
      await deleteUserDocument(COLLECTION, id, userId);
  
      return successResponse(res, { id }, 'Despesa deletada com sucesso');
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return errorResponse(res, 'Despesa não encontrada', 404);
      }
      if (error.message.includes('permissão')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }
  
  /**
   * GET /api/expenses/stats
   * Retorna estatísticas de despesas
   * Query params: month?, year?
   */
  async function getStats(req, res, next) {
    try {
      const { userId } = req;
      const { month, year } = req.query;
  
      const expenses = await getUserDocuments(COLLECTION, userId);
  
      // Filtrar por mês/ano se fornecido
      let filteredExpenses = expenses;
      
      if (month && year) {
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === parseInt(month) - 1 &&
            expenseDate.getFullYear() === parseInt(year)
          );
        });
      } else if (year) {
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === parseInt(year);
        });
      }
  
      // Calcular estatísticas
      const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const count = filteredExpenses.length;
      const average = count > 0 ? total / count : 0;
  
      // Agrupar por categoria
      const byCategory = filteredExpenses.reduce((acc, exp) => {
        if (!acc[exp.categoryId]) {
          acc[exp.categoryId] = {
            total: 0,
            count: 0,
            expenses: [],
          };
        }
        acc[exp.categoryId].total += exp.amount;
        acc[exp.categoryId].count += 1;
        acc[exp.categoryId].expenses.push(exp.id);
        return acc;
      }, {});
  
      // Encontrar maior e menor despesa
      const highest = filteredExpenses.length > 0
        ? filteredExpenses.reduce((max, exp) => (exp.amount > max.amount ? exp : max))
        : null;
      
      const lowest = filteredExpenses.length > 0
        ? filteredExpenses.reduce((min, exp) => (exp.amount < min.amount ? exp : min))
        : null;
  
      const stats = {
        total: parseFloat(total.toFixed(2)),
        count,
        average: parseFloat(average.toFixed(2)),
        byCategory,
        highest: highest ? { id: highest.id, amount: highest.amount, description: highest.description } : null,
        lowest: lowest ? { id: lowest.id, amount: lowest.amount, description: lowest.description } : null,
        period: {
          month: month || null,
          year: year || null,
        },
      };
  
      return successResponse(res, stats, 'Estatísticas calculadas com sucesso');
    } catch (error) {
      next(error);
    }
  }
  
  module.exports = {
    list,
    getOne,
    create,
    update,
    deleteExpense,
    getStats,
  };