import { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from 'recharts';

// Util: formata valores para BRL
const formatCurrency = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;

// Tooltip customizado
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const p = payload[0];
    const item = p.payload;
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-md">
        <div className="font-semibold text-white mb-1">{item.description || label}</div>
        <div className="text-sm text-slate-100">
          <div>Valor: <span className="font-semibold text-white">{formatCurrency(item.value)}</span></div>
          {item.categoryName && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || '#9CA3AF' }}
              />
              <span className="text-white">Categoria: {item.categoryName}</span>
            </div>
          )}
          {item.dateLabel && (
            <div className="mt-1 text-slate-300">{item.dateLabel}</div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default function GraficoGastos({ expenses = [], categories = [] }) {
  const [modo, setModo] = useState('por-despesa'); // 'por-despesa' | 'por-categoria'
  const { theme, currentTheme } = useTheme();
  const totalGeral = useMemo(() => expenses.reduce((acc, e) => acc + Number(e.amount || e.value || 0), 0), [expenses]);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(c.id, { name: c.name, color: c.color }));
    return map;
  }, [categories]);

  // Dados por despesa (cada barra uma despesa, cor da categoria)
  const dataPorDespesa = useMemo(() => {
    return expenses.map((e) => {
      const cat = categoryMap.get(e.categoryId) || {};
      const date = e.createdAt?.seconds
        ? new Date(e.createdAt.seconds * 1000)
        : (e.createdAt ? new Date(e.createdAt) : null);
      const dateLabel = date ? date.toLocaleDateString('pt-BR') : '';
      return {
        id: e.id,
        description: e.description,
        value: e.amount || e.value,
        categoryId: e.categoryId,
        categoryName: cat.name,
        color: cat.color || '#003D7A',
        dateLabel,
      };
    });
  }, [expenses, categoryMap]);

  // Dados por categoria (soma total por categoria)
  const dataPorCategoria = useMemo(() => {
    const acc = new Map();
    expenses.forEach((e) => {
      const cat = categoryMap.get(e.categoryId) || {};
      const key = e.categoryId || 'sem-categoria';
      const current = acc.get(key) || { name: cat.name || 'Sem categoria', value: 0, color: cat.color || '#9CA3AF' };
      current.value += Number(e.amount || e.value || 0);
      acc.set(key, current);
    });
    return Array.from(acc.values());
  }, [expenses, categoryMap]);

  const hasData = (modo === 'por-despesa' ? dataPorDespesa.length : dataPorCategoria.length) > 0;

  return (
    <div
      className={`card ${theme.colors.bgCard} ${theme.colors.borderPrimary} p-8 shadow-2xl ${theme.colors.shadowColor}`}
      data-scroll-animation="default"
      style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}
    >
      <div className="flex items-center justify-between mb-6 gap-6 flex-wrap">
        <div>
          <h3 className={`text-2xl font-bold ${currentTheme === 'light' ? 'text-black' : theme.colors.textPrimary}`}>Visão de Gastos</h3>
          <p className={`font-light ${currentTheme === 'light' ? 'text-slate-700' : theme.colors.textSecondary}`}>Interativo, responsivo e com cores por categoria</p>
            <div className={`mt-3 flex items-center gap-3 text-sm ${currentTheme === 'light' ? 'text-slate-700' : theme.colors.textSecondary}`}>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 border ${currentTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-slate-800/70 border-slate-700'}`}>
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Total: <strong className={currentTheme === 'light' ? 'text-black' : 'text-white'}>{formatCurrency(totalGeral)}</strong>
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 border ${currentTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-slate-800/70 border-slate-700'}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Gastos: <strong className={currentTheme === 'light' ? 'text-black' : 'text-white'}>{expenses.length}</strong>
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 border ${currentTheme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-slate-800/70 border-slate-700'}`}>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Categorias: <strong className={currentTheme === 'light' ? 'text-black' : 'text-white'}>{categories.length}</strong>
              </span>
          </div>
        </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModo('por-despesa')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${
                modo === 'por-despesa'
                  ? `${theme.colors.btnPrimary} text-white shadow-md ${theme.colors.shadowColor}`
                  : `${currentTheme === 'light' ? 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200' : 'text-slate-200 hover:bg-slate-800 border-slate-700'}`
              }`}
            >
              Por despesa
            </button>
            <button
              onClick={() => setModo('por-categoria')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${
                modo === 'por-categoria'
                  ? `${theme.colors.btnPrimary} text-white shadow-md ${theme.colors.shadowColor}`
                  : `${currentTheme === 'light' ? 'bg-gray-100 text-black border-gray-200 hover:bg-gray-200' : 'text-slate-200 hover:bg-slate-800 border-slate-700'}`
              }`}
            >
              Por categoria
            </button>
          </div>
      </div>

      {!hasData ? (
        <div className="text-center py-16" data-scroll-animation="fade">
          <p className="text-gray-400 text-lg font-light">Nenhum dado para exibir ainda</p>
        </div>
      ) : modo === 'por-despesa' ? (
        <div
          key="chart-por-despesa"
          className={`w-full rounded-xl p-4 shadow-inner ${
            currentTheme === 'light' 
              ? 'bg-white border border-gray-200 shadow-gray-200/20' 
              : 'bg-slate-950/60 border border-slate-800 shadow-indigo-900/20'
          }`}
          style={{ height: 450 }}
          data-scroll-animation="default"
        >
          <ResponsiveContainer width="100%" height={410}>
            <BarChart data={dataPorDespesa} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={currentTheme === 'light' ? '#e5e7eb' : '#475569'} 
              />
              <XAxis 
                dataKey="description" 
                tick={{ fill: currentTheme === 'light' ? '#1f2937' : '#E2E8F0', fontSize: 13, fontWeight: 500 }} 
                angle={-45}
                textAnchor="end"
                height={100}
                hide={dataPorDespesa.length > 8} 
              />
              <YAxis 
                tickFormatter={(v) => `R$ ${v}`} 
                tick={{ fill: currentTheme === 'light' ? '#1f2937' : '#E2E8F0', fontSize: 13, fontWeight: 500 }} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Legend wrapperStyle={{ color: currentTheme === 'light' ? '#1f2937' : '#F1F5F9', fontSize: 14, fontWeight: 500 }} />
              <Bar dataKey="value" name="Valor do gasto" radius={[8, 8, 0, 0]}>
                {dataPorDespesa.map((item) => (
                  <Cell key={`cell-${item.id}`} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          key="chart-por-categoria"
          className={`w-full rounded-xl p-4 ${
            currentTheme === 'light' 
              ? 'bg-white border border-gray-200 shadow-gray-200/20' 
              : 'bg-slate-950/60 border border-slate-800 shadow-indigo-900/20'
          } shadow-inner`}
          style={{ height: 400 }}
          data-scroll-animation="default"
        >
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={dataPorCategoria}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={70}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                labelLine={false}
              >
                {dataPorCategoria.map((entry, idx) => (
                  <Cell key={`slice-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Legend wrapperStyle={{ color: currentTheme === 'light' ? '#1f2937' : '#E2E8F0', fontSize: 14, fontWeight: 500 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legenda customizada (mostra cores das categorias) */}
      {modo === 'por-despesa' && categories.length > 0 && (
        <div className="mt-6">
          <h4 className={`text-sm font-semibold mb-3 ${currentTheme === 'light' ? 'text-black' : 'text-white'}`}>Categorias</h4>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: cat.color || '#9CA3AF' }}
                />
                <span className={`text-sm ${currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
