import { useMemo, useState } from 'react';
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
        <div className="text-sm text-slate-200">
          <div>Valor: <span className="font-semibold">{formatCurrency(item.value)}</span></div>
          {item.categoryName && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || '#9CA3AF' }}
              />
              <span>Categoria: {item.categoryName}</span>
            </div>
          )}
          {item.dateLabel && (
            <div className="mt-1 text-gray-400">{item.dateLabel}</div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default function GraficoGastos({ expenses = [], categories = [] }) {
  const [modo, setModo] = useState('por-despesa'); // 'por-despesa' | 'por-categoria'
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
      className="card bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-8 shadow-2xl shadow-indigo-900/30"
      data-scroll-animation="default"
      style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}
    >
      <div className="flex items-center justify-between mb-6 gap-6 flex-wrap">
        <div>
          <h3 className="text-2xl font-bold text-white">Visão de Gastos</h3>
          <p className="text-slate-300 font-light">Interativo, responsivo e com cores por categoria</p>
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Total: <strong className="text-white">{formatCurrency(totalGeral)}</strong>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Gastos: <strong className="text-white">{expenses.length}</strong>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Categorias: <strong className="text-white">{categories.length}</strong>
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModo('por-despesa')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              modo === 'por-despesa' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            Por despesa
          </button>
          <button
            onClick={() => setModo('por-categoria')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              modo === 'por-categoria' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
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
          className="w-full bg-slate-950/60 rounded-xl p-4 border border-slate-800 shadow-inner shadow-indigo-900/20"
          style={{ height: 450 }}
          data-scroll-animation="default"
        >
          <ResponsiveContainer>
            <BarChart data={dataPorDespesa} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                dataKey="description" 
                tick={{ fill: '#E2E8F0', fontSize: 12 }} 
                angle={-45}
                textAnchor="end"
                height={100}
                hide={dataPorDespesa.length > 8} 
              />
              <YAxis tickFormatter={(v) => `R$ ${v}`} tick={{ fill: '#E2E8F0' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Legend wrapperStyle={{ color: '#F1F5F9' }} />
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
          className="w-full bg-slate-950/60 rounded-xl p-4 border border-slate-800 shadow-inner shadow-indigo-900/20"
          style={{ height: 400 }}
          data-scroll-animation="default"
        >
          <ResponsiveContainer>
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
              <Legend wrapperStyle={{ color: '#E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legenda customizada (mostra cores das categorias) */}
      {modo === 'por-despesa' && categories.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-white mb-3">Categorias</h4>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: cat.color || '#9CA3AF' }}
                />
                <span className="text-sm text-gray-300">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
