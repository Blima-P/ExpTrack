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
      <div className="card bg-yellow-50 border border-yellow-200">
        <p className="text-yellow-800">
          ⚠️ Crie uma categoria antes de adicionar gastos
        </p>
      </div>
    );
  }

  return (
    <div className="card bg-white border border-gray-200 p-8 max-w-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Novo Gasto</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
          <IconeAviso size={20} cor="#EF4444" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Valor (R$)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
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
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Descreva o gasto..."
            rows="3"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && <IconeCarregando size={20} cor="white" />}
          {loading ? 'Salvando...' : <>Adicionar Gasto</>}
        </button>
      </form>
    </div>
  );
}
