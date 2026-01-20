import { useState } from 'react';
import { expenseService } from '../services/api';
import { IconeEditar, IconeLixeira, IconeCarregando } from './Icones';

export default function ExpenseList({ expenses, categories, onExpenseDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Sem categoria';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || '#9CA3AF';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente deletar este gasto?')) return;

    setDeletingId(id);
    try {
      await expenseService.deleteExpense(id);
      onExpenseDeleted();
    } catch (error) {
      console.error('Erro ao deletar gasto:', error);
      alert('Erro ao deletar gasto');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStart = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      value: expense.amount || expense.value,
      description: expense.description,
      categoryId: expense.categoryId,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditSubmit = async (id) => {
    try {
      await expenseService.updateExpense(
        id,
        parseFloat(editForm.value),
        editForm.description,
        editForm.categoryId
      );
      handleEditCancel();
      onExpenseDeleted();
    } catch (error) {
      console.error('Erro ao atualizar gasto:', error);
      alert('Erro ao atualizar gasto');
    }
  };

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="card bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
        >
          {editingId === expense.id ? (
            // Edit Mode
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                value={editForm.value}
                onChange={(e) =>
                  setEditForm({ ...editForm, value: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                step="0.01"
              />
              <select
                value={editForm.categoryId}
                onChange={(e) =>
                  setEditForm({ ...editForm, categoryId: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleEditSubmit(expense.id)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  ✅ Salvar
                </button>
                <button
                  onClick={handleEditCancel}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                  ></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">
                      {expense.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {getCategoryName(expense.categoryId)} •{' '}
                      {new Date(expense.date || new Date()).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right mr-6">
                <p className="text-2xl font-bold text-gray-900">
                  R$ {(expense.amount || expense.value || 0).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEditStart(expense)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <IconeEditar size={18} cor="white" />
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  {deletingId === expense.id ? <IconeCarregando size={18} cor="white" /> : <IconeLixeira size={18} cor="white" />}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
