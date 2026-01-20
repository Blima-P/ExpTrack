import { useState, useEffect } from 'react';
import { useAuth } from '../context/ContextoAutenticacao';
import { expenseService, categoryService } from '../services/api';
import Navbar from '../components/BarraNavegacao';
import ExpenseList from '../components/ListaDespesas';
import ExpenseForm from '../components/FormularioDespesa';
import CategoryManager from '../components/GerenciadorCategorias';
import GraficoGastos from '../components/GraficoGastos';
import { IconeAviso, IconeMais, IconeX, IconeRelogio, IconeCelebrar, IconeDinheiro, IconeGrafico, IconeEtiqueta, IconeCategorias } from '../components/Icones';

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('📥 Carregando despesas com filtro:', selectedCategory);
      const [expensesRes, categoriesRes] = await Promise.all([
        expenseService.getExpenses(selectedCategory),
        categoryService.getCategories(),
      ]);

      console.log('✅ Resposta do servidor:', expensesRes.data);
      console.log('📊 Despesas recebidas:', expensesRes.data.data);
      
      setExpenses(expensesRes.data.data || []);
      setTotal(expensesRes.data.total || 0);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('❌ Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleExpenseCreated = () => {
    setShowExpenseForm(false);
    loadData();
  };

  const handleExpenseDeleted = () => {
    loadData();
  };

  const handleCategoryCreated = () => {
    setShowCategoryManager(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold text-white tracking-tight mb-2">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-xl text-indigo-200 font-light">
            Gerencie seus gastos com elegância e simplicidade
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-2xl mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <IconeAviso size={20} cor="#FCA5A5" />
              {error}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 font-light">Total de Gastos</p>
                <p className="text-4xl font-bold mt-3 tracking-tight">
                  R$ {total.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="opacity-20"><IconeDinheiro size={48} cor="white" /></div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-violet-900 to-violet-800 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 font-light">Número de Gastos</p>
                <p className="text-4xl font-bold mt-3 tracking-tight">
                  {expenses.length}
                </p>
              </div>
              <div className="opacity-20"><IconeGrafico size={48} cor="white" /></div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-900 to-purple-800 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-light">Categorias</p>
                <p className="text-4xl font-bold mt-3 tracking-tight">
                  {categories.length}
                </p>
              </div>
              <div className="opacity-20"><IconeEtiqueta size={48} cor="white" /></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 mb-12 flex-wrap">
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="btn-primary flex items-center gap-3"
          >
            {showExpenseForm ? <><IconeX size={20} /> Cancelar</> : <><IconeMais size={20} /> Novo Gasto</>}
          </button>
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="btn-secondary flex items-center gap-3"
          >
            {showCategoryManager ? <><IconeX size={20} /> Cancelar</> : <><IconeCategorias size={20} /> Gerenciar Categorias</>}
          </button>
        </div>

        {/* Expense Form Modal */}
        {showExpenseForm && (
          <div className="mb-12 animate-slide-in">
            <ExpenseForm
              categories={categories}
              onExpenseCreated={handleExpenseCreated}
            />
          </div>
        )}

        {/* Category Manager Modal */}
        {showCategoryManager && (
          <div className="mb-12 animate-slide-in">
            <CategoryManager
              categories={categories}
              onCategoryCreated={handleCategoryCreated}
            />
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-white mb-6">Filtrar por Categoria</h3>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'text-white shadow-md shadow-indigo-500/50'
                      : 'hover:opacity-80 border-2'
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === cat.id ? cat.color : '#334155',
                    borderColor: cat.color,
                    color: selectedCategory === cat.id ? '#fff' : '#CBD5E1',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart */}
        {!loading && expenses.length > 0 && (
          <div className="mb-12">
            <GraficoGastos expenses={expenses} categories={categories} />
          </div>
        )}

        {/* Expense List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block mb-4"><IconeRelogio size={40} cor="#9CA3AF" /></div>
            <p className="text-gray-400 text-lg font-light">Carregando gastos...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="card text-center py-20">
            <div className="inline-block mb-6"><IconeCelebrar size={48} cor="#9CA3AF" /></div>
            <p className="text-gray-400 text-lg font-light">
              {selectedCategory
                ? 'Nenhum gasto nesta categoria'
                : 'Nenhum gasto registrado. Comece adicionando um novo!'}
            </p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            categories={categories}
            onExpenseDeleted={handleExpenseDeleted}
          />
        )}
      </div>
    </div>
  );
}
