import { useState } from 'react';
import { expenseService } from '../services/api';

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
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Novo Gasto</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-field"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
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
          <label className="block text-gray-700 font-semibold mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field resize-none"
            placeholder="Descreva o gasto..."
            rows="3"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? '⏳ Salvando...' : '💰 Adicionar Gasto'}
        </button>
      </form>
    </div>
  );
}
