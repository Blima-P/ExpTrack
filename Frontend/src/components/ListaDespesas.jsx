import { useState } from 'react';
import { expenseService } from '../services/api';
import { IconeEditar, IconeLixeira, IconeCarregando, IconeVerificacao, IconeCancelar } from './Icones';

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

  const formatCurrency = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;

  const getDateInfo = (date) => {
    const d = new Date(date || new Date());
    const today = new Date();
    const diffTime = Math.abs(today - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    return d.toLocaleDateString('pt-BR');
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
      {expenses.map((expense, index) => (
        <div
          key={expense.id}
          className="card bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-lg shadow-slate-950/50 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover-lift hover-glow rounded-2xl"
          data-scroll-animation="default"
          data-delay={Math.min(Math.ceil(index / 2) + 1, 6)}
          style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}
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
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                value={editForm.value}
                onChange={(e) =>
                  setEditForm({ ...editForm, value: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                step="0.01"
              />
              <select
                value={editForm.categoryId}
                onChange={(e) =>
                  setEditForm({ ...editForm, categoryId: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
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
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-lg transition-all"
                >
                  <IconeVerificacao size={16} cor="white" /> Salvar
                </button>
                <button
                  onClick={handleEditCancel}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-3 rounded-lg transition-all"
                >
                  <IconeCancelar size={16} cor="white" /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 shadow-md"
                      style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                    ></div>
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{
                        backgroundColor: getCategoryColor(expense.categoryId) + '20',
                        borderColor: getCategoryColor(expense.categoryId),
                        color: getCategoryColor(expense.categoryId),
                      }}
                    >
                      {getCategoryName(expense.categoryId)}
                    </span>
                  </div>
                  <p className="font-bold text-white text-xl mb-2">
                    {expense.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">{getDateInfo(expense.date)}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryColor(expense.categoryId) }}></span>
                      {new Date(expense.date || new Date()).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-black text-white tracking-tight">
                    {formatCurrency(expense.amount || expense.value || 0)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Gasto</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleEditStart(expense)}
                  className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <IconeEditar size={18} cor="white" />
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
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
