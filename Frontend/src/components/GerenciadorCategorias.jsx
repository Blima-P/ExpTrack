import { useState } from 'react';
import { categoryService } from '../services/api';

export default function CategoryManager({ categories, onCategoryCreated }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    setLoading(true);

    try {
      await categoryService.createCategory(name.trim(), color);
      setName('');
      setColor('#3B82F6');
      onCategoryCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente deletar esta categoria?')) return;

    setDeletingId(id);
    try {
      await categoryService.deleteCategory(id);
      onCategoryCreated();
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      alert('Erro ao deletar categoria');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Gerenciar Categorias</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 pb-8 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Ex: Alimentação"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Cor
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="input-field flex-1"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-secondary w-full"
            >
              {loading ? '⏳ Salvando...' : '➕ Adicionar'}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 mb-4">Categorias Existentes</h4>
        {categories.length === 0 ? (
          <p className="text-gray-500">Nenhuma categoria criada ainda</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-lg border-2 flex items-center justify-between"
                style={{ borderColor: cat.color, backgroundColor: `${cat.color}10` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="btn-danger text-sm py-1 px-2"
                >
                  {deletingId === cat.id ? '⏳' : '🗑️'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
