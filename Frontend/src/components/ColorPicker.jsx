import { useState } from 'react';
import { IconeX } from './Icones';

const COLORS = [
  // Tons vermelhos
  '#EF4444', '#DC2626', '#B91C1C', '#7F1D1D', '#FCA5A5', '#FECACA',
  // Tons laranjas
  '#F97316', '#EA580C', '#C2410C', '#92400E', '#FED7AA', '#FDEDD4',
  // tons amarelados
  '#EAB308', '#DCBF2A', '#B45309', '#854D0E', '#FEFCE8', '#FEF3C7',
  // verdes
  '#22C55E', '#16A34A', '#15803D', '#14532D', '#DCFCE7', '#F0FDF4',
  // azul estranhos
  '#14B8A6', '#0D9488', '#115E59', '#134E4A', '#CCFBF1', '#F0FDFA',
  // Azuls(Gremio)
  '#003D7A', '#1B5BA0', '#0084D8', '#2563EB', '#1E40AF', '#1E3A8A',
  '#DBEAFE', '#EFF6FF', '#BFDBFE',
  // Indigos
  '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#C7D2FE', '#E0E7FF',
  // tons roxos
  '#A855F7', '#9333EA', '#7E22CE', '#581C87', '#E9D5FF', '#F3E8FF',
  // rosas
  '#EC4899', '#DB2777', '#BE185D', '#831843', '#FBCFE8', '#FDF2F8',
  // cinzas
  '#6B7280', '#4B5563', '#374151', '#1F2937', '#D1D5DB', '#F3F4F6',
];

export default function ColorPicker({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#3B82F6');

  const handleColorClick = (color) => {
    onChange(color);
    setShowPicker(false);
  };

  const handleCustomColorChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative">
      {/* Button to open picker */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all w-full"
      >
        <span
          className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: value || '#3B82F6' }}
        />
        <span className="text-gray-700 font-medium text-sm">{value || '#3B82F6'}</span>
      </button>

      {/* Picker dropdown */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 w-80">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 text-sm">Escolher cor</h4>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <IconeX size={16} cor="#6B7280" />
            </button>
          </div>

          {/* Predefined colors grid */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorClick(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                  value === color ? 'border-gray-900 shadow-md' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Custom color input */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Cor personalizada</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onChange(e.target.value);
                }}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
