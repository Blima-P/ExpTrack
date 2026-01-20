import { useState } from 'react';
import { categoryService } from '../services/api';
import { IconeAviso, IconeCarregando, IconeLixeira, IconeMais } from './Icones';
import ColorPicker from './ColorPicker';

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
      console.log('Criando categoria:', { name, color });
      await categoryService.createCategory(name.trim(), color);
      setName('');
      setColor('#3B82F6');
      onCategoryCreated();
      console.log('Categoria criada com sucesso');
    } catch (err) {
      console.error('Erro completo ao criar categoria:', err);
      console.error('Detalhes da resposta:', err.response);
      setError(err.response?.data?.message || err.message || 'Erro ao criar categoria');
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
      setError('');
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      setError(error.response?.data?.message || 'Erro ao deletar categoria');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card bg-white border border-gray-200 p-8 max-w-3xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Gerenciar Categorias</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
          <IconeAviso size={20} cor="#EF4444" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mb-10 pb-10 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Alimentação"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Cor
            </label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading && <IconeCarregando size={20} cor="white" />}
              {loading ? 'Salvando...' : <><IconeMais size={20} /> Adicionar</>}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 text-lg mb-6">Categorias Existentes</h4>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8 font-light">Nenhuma categoria criada ainda</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-6 rounded-xl border-2 flex items-center justify-between hover:shadow-md transition-all duration-300"
                style={{ borderColor: cat.color, backgroundColor: `${cat.color}15` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 font-semibold text-sm flex items-center gap-2"
                >
                  {deletingId === cat.id ? <IconeCarregando size={16} cor="white" /> : <IconeLixeira size={16} cor="white" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
