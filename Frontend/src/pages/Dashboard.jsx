import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseService, categoryService } from '../services/api';
import Navbar from '../components/Navbar';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import CategoryManager from '../components/CategoryManager';

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
      const [expensesRes, categoriesRes] = await Promise.all([
        expenseService.getExpenses(selectedCategory),
        categoryService.getCategories(),
      ]);

      setExpenses(expensesRes.data.data || []);
      setTotal(expensesRes.data.total || 0);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
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
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Controle seus gastos e categorias com facilidade
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-lg font-semibold opacity-90">Total de Gastos</h2>
          <p className="text-5xl font-bold mt-2">
            R$ {total.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-blue-100 mt-2">
            {expenses.length} {expenses.length === 1 ? 'gasto' : 'gastos'} registrado(s)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="btn-primary"
          >
            {showExpenseForm ? '❌ Cancelar' : '➕ Novo Gasto'}
          </button>
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="btn-secondary"
          >
            {showCategoryManager ? '❌ Cancelar' : '🏷️ Gerenciar Categorias'}
          </button>
        </div>

        {/* Expense Form Modal */}
        {showExpenseForm && (
          <div className="mb-8">
            <ExpenseForm
              categories={categories}
              onExpenseCreated={handleExpenseCreated}
            />
          </div>
        )}

        {/* Category Manager Modal */}
        {showCategoryManager && (
          <div className="mb-8">
            <CategoryManager
              categories={categories}
              onCategoryCreated={handleCategoryCreated}
            />
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'text-white'
                    : 'text-gray-700 hover:opacity-80'
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === cat.id ? cat.color : `${cat.color}20`,
                  color: selectedCategory === cat.id ? '#fff' : cat.color,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Expense List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Carregando gastos...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
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
