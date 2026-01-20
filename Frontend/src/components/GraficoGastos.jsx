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
} from 'recharts';

// Util: formata valores para BRL
const formatCurrency = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;

// Tooltip customizado
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const p = payload[0];
    const item = p.payload;
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-md">
        <div className="font-semibold text-gray-900 mb-1">{item.description || label}</div>
        <div className="text-sm text-gray-700">
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
            <div className="mt-1 text-gray-500">{item.dateLabel}</div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default function GraficoGastos({ expenses = [], categories = [] }) {
  const [modo, setModo] = useState('por-despesa'); // 'por-despesa' | 'por-categoria'

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
        value: e.value,
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
      current.value += Number(e.value || 0);
      acc.set(key, current);
    });
    return Array.from(acc.values());
  }, [expenses, categoryMap]);

  const hasData = (modo === 'por-despesa' ? dataPorDespesa.length : dataPorCategoria.length) > 0;

  return (
    <div className="card bg-white border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Visão de Gastos</h3>
          <p className="text-gray-600 font-light">Interativo, responsivo e com cores por categoria</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModo('por-despesa')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              modo === 'por-despesa' ? 'bg-blue-900 text-white shadow-md' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Por despesa
          </button>
          <button
            onClick={() => setModo('por-categoria')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              modo === 'por-categoria' ? 'bg-blue-900 text-white shadow-md' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Por categoria
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-light">Nenhum dado para exibir ainda</p>
        </div>
      ) : modo === 'por-despesa' ? (
        <div className="w-full" style={{ height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={dataPorDespesa} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="description" tick={{ fill: '#6B7280' }} hide={dataPorDespesa.length > 8} />
              <YAxis tickFormatter={(v) => `R$ ${v}`} tick={{ fill: '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#374151' }} />
              <Bar dataKey="value" name="Valor do gasto" radius={[8, 8, 0, 0]}>
                {dataPorDespesa.map((item) => (
                  <Cell key={`cell-${item.id}`} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full" style={{ height: 360 }}>
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
              >
                {dataPorCategoria.map((entry, idx) => (
                  <Cell key={`slice-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legenda customizada (mostra cores das categorias) */}
      {modo === 'por-despesa' && categories.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Categorias</h4>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: cat.color || '#9CA3AF' }}
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
