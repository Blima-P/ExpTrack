import { useState } from 'react';
import { expenseService } from '../services/api';

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
      value: expense.value,
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
          className="card flex items-center justify-between hover:shadow-lg transition"
        >
          {editingId === expense.id ? (
            // Edit Mode
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="input-field"
              />
              <input
                type="number"
                value={editForm.value}
                onChange={(e) =>
                  setEditForm({ ...editForm, value: e.target.value })
                }
                className="input-field"
                step="0.01"
              />
              <select
                value={editForm.categoryId}
                onChange={(e) =>
                  setEditForm({ ...editForm, categoryId: e.target.value })
                }
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditSubmit(expense.id)}
                  className="btn-secondary"
                >
                  ✅ Salvar
                </button>
                <button
                  onClick={handleEditCancel}
                  className="btn-danger"
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
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {expense.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getCategoryName(expense.categoryId)} •{' '}
                      {new Date(expense.createdAt?.seconds * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right mr-4">
                <p className="text-2xl font-bold text-gray-900">
                  R$ {expense.value.toFixed(2).replace('.', ',')}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditStart(expense)}
                  className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                  className="btn-danger"
                >
                  {deletingId === expense.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
