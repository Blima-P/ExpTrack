import { useState, useEffect } from 'react';
import { useAuth } from '../context/ContextoAutenticacao';
import { useTheme } from '../context/ThemeContext';
import { expenseService, categoryService } from '../services/api';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Navbar from '../components/BarraNavegacao';
import ExpenseList from '../components/ListaDespesas';
import ExpenseForm from '../components/FormularioDespesa';
import CategoryManager from '../components/GerenciadorCategorias';
import GraficoGastos from '../components/GraficoGastos';
import { IconeAviso, IconeMais, IconeX, IconeRelogio, IconeCelebrar, IconeDinheiro, IconeGrafico, IconeEtiqueta, IconeCategorias } from '../components/Icones';

export default function Dashboard() {
  const { user } = useAuth();
  const { theme, currentTheme } = useTheme();
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
    <div className={`min-h-screen ${theme.colors.bgPrimary}`}>
      <Navbar />

      {/* Header Hero */}
      <div className={`${theme.colors.bgSecondary} border-b ${theme.colors.borderNavbar} shadow-2xl ${theme.colors.shadowColor} relative overflow-hidden`} style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
          <div className="flex items-center justify-between gap-8 flex-wrap">
            {/* Text Content */}
            <div className="flex-1 min-w-[300px]">
              <div className={`mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.colors.badgeBg} ${theme.colors.badgeBorder}`}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className={`text-sm font-semibold ${theme.colors.textSecondary}`}>Bem-vindo ao ExpTrack</span>
              </div>
              <h1 
                className={`text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight ${currentTheme === 'light' ? 'text-black' : theme.colors.textPrimary}`}
                style={{
                  animation: 'slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
                }}
              >
                Bem-vindo, {user?.name}!
              </h1>
              <p 
                className={`text-lg font-light mb-8 ${currentTheme === 'light' ? 'text-black' : theme.colors.textSecondary}`}
                style={{
                  animation: 'slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both'
                }}
              >
                Gerencie seus gastos com elegância e simplicidade
              </p>
              <div 
                className="flex items-center gap-4 text-sm"
                style={{
                  animation: 'slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both'
                }}
              >
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme.colors.chipBg} ${theme.colors.chipBorder}`}>
                  <span className={theme.colors.accentPrimary}>📊</span>
                  <span className={theme.colors.textSecondary}>{expenses.length} despesas registradas</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme.colors.chipBg} ${theme.colors.chipBorder}`}>
                  <span className="text-emerald-400">✨</span>
                  <span className={theme.colors.textSecondary}>{categories.length} categorias</span>
                </div>
              </div>
            </div>

            {/* SVG Icon */}
            <div 
              className="flex-shrink-0 hidden lg:flex"
              style={{
                animation: 'float 3s ease-in-out infinite',
                filter: 'drop-shadow(0 20px 25px rgba(99, 102, 241, 0.2))'
              }}
            >
              <svg viewBox="-20 -20 240 240" width="240" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gradient defs */}
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>

                {/* Outer circle */}
                <circle cx="100" cy="100" r="95" stroke="url(#grad1)" strokeWidth="2" opacity="0.5" />
                <circle cx="100" cy="100" r="90" stroke="url(#grad1)" strokeWidth="1" opacity="0.25" />

                {/* Wallet shape */}
                <rect x="50" y="70" width="100" height="70" rx="12" fill="url(#grad1)" opacity="0.8" />
                <rect x="60" y="85" width="80" height="45" rx="8" fill="#0f172a" />

                {/* Card line */}
                <rect x="60" y="85" width="80" height="4" fill="url(#grad1)" opacity="0.6" />

                {/* Dollar sign */}
                <text x="100" y="110" fontSize="36" fontWeight="bold" fill="url(#grad1)" textAnchor="middle" dominantBaseline="middle">
                  $
                </text>

                {/* Animated circles around */}
                <circle cx="100" cy="35" r="4" fill="#6366f1" opacity="0.6">
                  <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="165" cy="100" r="4" fill="#8b5cf6" opacity="0.6">
                  <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                <circle cx="100" cy="165" r="4" fill="#6366f1" opacity="0.6">
                  <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="1s" />
                </circle>
                <circle cx="35" cy="100" r="4" fill="#8b5cf6" opacity="0.6">
                  <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="1.5s" />
                </circle>
              </svg>
            </div>
          </div>
        </div>

        {/* CSS for animations */}
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {error && (
          <div className={`border px-6 py-4 rounded-2xl mb-8 animate-fade-in flex items-center gap-3 ${
            currentTheme === 'light'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-amber-950/40 border-amber-800/50'
          }`}>
            <div className="flex items-center gap-3">
              <IconeAviso size={20} cor={currentTheme === 'light' ? '#B45309' : '#FCA5A5'} />
              {error}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className={`card p-8 hover-lift hover-glow ${
            currentTheme === 'light'
              ? 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900'
              : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white'
          }`} data-scroll-animation="default" data-delay="1">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-light ${currentTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Total de Gastos</p>
                <p className={`text-4xl font-bold mt-3 tracking-tight ${currentTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  R$ {total.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="opacity-20"><IconeDinheiro size={48} cor={currentTheme === 'light' ? '#374151' : 'white'} /></div>
            </div>
          </div>

          <div className={`card p-8 hover-lift hover-glow ${
            currentTheme === 'light'
              ? 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900'
              : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white'
          }`} data-scroll-animation="default" data-delay="2">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-light ${currentTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Número de Gastos</p>
                <p className={`text-4xl font-bold mt-3 tracking-tight ${currentTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {expenses.length}
                </p>
              </div>
              <div className="opacity-20"><IconeGrafico size={48} cor={currentTheme === 'light' ? '#374151' : 'white'} /></div>
            </div>
          </div>

          <div className={`card p-8 hover-lift hover-glow ${
            currentTheme === 'light'
              ? 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900'
              : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white'
          }`} data-scroll-animation="default" data-delay="3">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-light ${currentTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Categorias</p>
                <p className={`text-4xl font-bold mt-3 tracking-tight ${currentTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
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
            <h3 className={`text-lg font-semibold mb-6 ${currentTheme === 'light' ? 'text-black' : theme.colors.textPrimary}`}>
              Filtrar por Categoria
            </h3>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border ${
                  selectedCategory === null
                    ? `${theme.colors.btnPrimary} text-white shadow-md ${theme.colors.shadowColor}`
                    : `${theme.colors.chipBg} ${theme.colors.chipBorder} ${theme.colors.textSecondary}`
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                    selectedCategory === cat.id
                      ? 'text-white shadow-md shadow-indigo-500/50'
                      : `${theme.colors.textSecondary}`
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === cat.id ? cat.color : (currentTheme === 'light' ? '#ffffff' : '#334155'),
                    borderColor: cat.color,
                    color: selectedCategory === cat.id ? '#fff' : (currentTheme === 'light' ? '#0f172a' : '#CBD5E1'),
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart */}
        {!loading && (
          <div className="mb-12" data-scroll-animation="default">
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
