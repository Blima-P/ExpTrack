// src/controllers/category.controller.js
const { db } = require('../config/firebase.admin');
const {
    getUserDocuments,
    createUserDocument,
    updateUserDocument,
    deleteUserDocument,
  } = require('../utils/firestore.helpers');
  const { successResponse, errorResponse } = require('../utils/response.helpers');
  
  const COLLECTION = 'categories';
  
  /**
   * GET /api/categories
   * Lista todas as categorias do usuário
   */
  async function list(req, res, next) {
    try {
      const { userId } = req;
  
      const categories = await getUserDocuments(COLLECTION, userId);
  
      // Ordenar por nome (opcional)
      categories.sort((a, b) => a.name.localeCompare(b.name));
  
      return successResponse(
        res,
        categories,
        `${categories.length} categoria(s) encontrada(s)`
      );
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/categories/:id
   * Busca uma categoria específica
   */
  async function getOne(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;
  
      const categoryRef = await db.collection(COLLECTION).doc(id).get();
  
      if (!categoryRef.exists) {
        return errorResponse(res, 'Categoria não encontrada', 404);
      }
  
      // Verificar ownership
      if (categoryRef.data().userId !== userId) {
        return errorResponse(res, 'Acesso negado', 403);
      }
  
      const category = {
        id: categoryRef.id,
        ...categoryRef.data(),
      };
  
      return successResponse(res, category, 'Categoria encontrada');
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * POST /api/categories
   * Cria nova categoria
   * Body: { name, icon?, color? }
   */
  async function create(req, res, next) {
    try {
      const { userId } = req;
      const { name, icon, color } = req.body;
  
      // name já é validado pelo validateRequest middleware
      // Validações adicionais (opcional)
      if (name.length > 50) {
        return errorResponse(res, 'Nome da categoria muito longo (máx 50 caracteres)', 400);
      }
  
      const categoryData = {
        name: name.trim(),
        icon: icon || '📁',
        color: color || '#666666',
      };
  
      const newCategory = await createUserDocument(COLLECTION, userId, categoryData);
  
      return successResponse(res, newCategory, 'Categoria criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * PUT /api/categories/:id
   * Atualiza categoria
   * Body: { name?, icon?, color? }
   */
  async function update(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;
      const { name, icon, color } = req.body;
  
      const updateData = {};
      
      if (name !== undefined) {
        if (name.trim().length === 0) {
          return errorResponse(res, 'Nome não pode ser vazio', 400);
        }
        if (name.length > 50) {
          return errorResponse(res, 'Nome muito longo (máx 50 caracteres)', 400);
        }
        updateData.name = name.trim();
      }
      
      if (icon !== undefined) updateData.icon = icon;
      if (color !== undefined) updateData.color = color;
  
      if (Object.keys(updateData).length === 0) {
        return errorResponse(res, 'Nenhum campo para atualizar', 400);
      }
  
      const updatedCategory = await updateUserDocument(COLLECTION, id, userId, updateData);
  
      return successResponse(res, updatedCategory, 'Categoria atualizada com sucesso');
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return errorResponse(res, 'Categoria não encontrada', 404);
      }
      if (error.message.includes('permissão')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }
  
  /**
   * DELETE /api/categories/:id
   * Deleta categoria
   */
  async function deleteCategory(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;
  
      // TODO: Verificar se há despesas usando esta categoria
      // e decidir se deleta ou impede a deleção
  
      await deleteUserDocument(COLLECTION, id, userId);
  
      return successResponse(res, { id }, 'Categoria deletada com sucesso');
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return errorResponse(res, 'Categoria não encontrada', 404);
      }
      if (error.message.includes('permissão')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }
  
  module.exports = {
    list,
    getOne,
    create,
    update,
    deleteCategory,
  };