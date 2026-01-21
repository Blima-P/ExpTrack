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
    <div className="card bg-gradient-to-br from-slate-950 to-slate-900 border border-indigo-800/30 p-8 max-w-3xl rounded-2xl shadow-2xl shadow-indigo-900/30 hover-glow" data-scroll-animation="default" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
      <h3 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent" data-scroll-animation="slide-left">Gerenciar Categorias</h3>

      {error && (
        <div className="bg-red-950 border border-red-800 text-red-100 px-6 py-4 rounded-xl mb-6 flex items-center gap-3" data-scroll-animation="slide-left">
          <IconeAviso size={20} cor="#FCA5A5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mb-10 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-indigo-200 mb-3">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Ex: Alimentação"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-200 mb-3">
              Cor
            </label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50"
            >
              {loading && <IconeCarregando size={20} cor="white" />}
              {loading ? 'Salvando...' : <><IconeMais size={20} /> Adicionar</>}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <h4 className="font-bold text-white text-lg mb-6 bg-gradient-to-r from-indigo-300 to-white bg-clip-text text-transparent" data-scroll-animation="slide-left">Categorias Existentes</h4>
        {categories.length === 0 ? (
          <p className="text-slate-400 text-center py-8 font-light" data-scroll-animation="fade">Nenhuma categoria criada ainda</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className="p-6 rounded-xl border-2 flex items-center gap-6 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover-lift hover-glow bg-slate-800/40"
                style={{ borderColor: cat.color }}
                data-scroll-animation="scale"
                data-delay={Math.min(Math.ceil(index / 3) + 1, 6)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="font-bold text-white text-lg truncate">{cat.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-red-500/30 flex-shrink-0"
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
