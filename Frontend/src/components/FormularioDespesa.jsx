import { useState } from 'react';
import { expenseService } from '../services/api';
import { IconeAviso, IconeCarregando } from './Icones';

export default function ExpenseForm({ categories, onExpenseCreated }) {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!value || parseFloat(value) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    if (!description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }

    if (!categoryId) {
      setError('Selecione uma categoria');
      return;
    }

    setLoading(true);

    try {
      await expenseService.createExpense(
        parseFloat(value),
        description.trim(),
        categoryId
      );

      setValue('');
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      onExpenseCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar gasto');
    } finally {
      setLoading(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="card bg-amber-950/30 border border-amber-700/50 p-8 rounded-2xl" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
        <p className="text-amber-200 flex items-center gap-3">
          <IconeAviso size={20} cor="#FCD34D" />
          Crie uma categoria antes de adicionar gastos
        </p>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-slate-950 to-slate-900 border border-indigo-800/30 p-8 max-w-2xl rounded-2xl shadow-2xl shadow-indigo-900/30 hover-glow" data-scroll-animation="default" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
      <h3 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">Novo Gasto</h3>

      {error && (
        <div className="bg-red-950/40 border border-red-800/50 text-red-200 px-6 py-4 rounded-xl mb-6 flex items-center gap-3" data-scroll-animation="slide-left">
          <IconeAviso size={20} cor="#FCA5A5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-indigo-200 mb-3">
              Valor (R$)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-200 mb-3">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo-200 mb-3">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
            placeholder="Descreva o gasto..."
            rows="3"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
        >
          {loading && <IconeCarregando size={20} cor="white" />}
          {loading ? 'Salvando...' : <>Adicionar Gasto</>}
        </button>
      </form>
    </div>
  );
}
