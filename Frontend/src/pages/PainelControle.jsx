import { useState, useEffect } from 'react';
import { useAuth } from '../context/ContextoAutenticacao';
import { expenseService, categoryService } from '../services/api';
import Navbar from '../components/BarraNavegacao';
import ExpenseList from '../components/ListaDespesas';
import ExpenseForm from '../components/FormularioDespesa';
import CategoryManager from '../components/GerenciadorCategorias';
import GraficoGastos from '../components/GraficoGastos';
import { IconeAviso, IconeMais, IconeX, IconeRelogio, IconeCelebrar, IconeDinheiro, IconeGrafico, IconeEtiqueta } from '../components/Icones';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-2">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Gerencie seus gastos com elegância e simplicidade
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <IconeAviso size={20} cor="#EF4444" />
              {error}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card bg-gradient-to-br from-blue-900 to-blue-700 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-light">Total de Gastos</p>
                <p className="text-4xl font-bold mt-3 tracking-tight">
                  R$ {total.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="opacity-20"><IconeDinheiro size={48} cor="white" /></div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-gray-800 to-gray-700 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 font-light">Número de Gastos</p>
                <p className="text-4xl font-bold mt-3 tracking-tight">
                  {expenses.length}
                </p>
              </div>
              <div className="opacity-20"><IconeGrafico size={48} cor="white" /></div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-gray-700 to-gray-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 font-light">Categorias</p>
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
            {showCategoryManager ? <><IconeX size={20} /> Cancelar</> : <>🏷️ Gerenciar Categorias</>}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Filtrar por Categoria</h3>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-200'
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
                      ? 'text-white shadow-md'
                      : 'hover:opacity-80 border-2'
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === cat.id ? cat.color : 'white',
                    borderColor: cat.color,
                    color: selectedCategory === cat.id ? '#fff' : cat.color,
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
            <div className="inline-block mb-4"><IconeRelogio size={40} /></div>
            <p className="text-gray-500 text-lg font-light">Carregando gastos...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="card text-center py-20">
            <div className="inline-block mb-6"><IconeCelebrar size={48} /></div>
            <p className="text-gray-600 text-lg font-light">
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
