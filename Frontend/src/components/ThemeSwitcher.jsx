import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { currentTheme, changeTheme, themes } = useTheme();

  const themeOptions = [
    { id: 'default', icon: '🌈', label: 'Padrão' },
    { id: 'light', icon: '☀️', label: 'Claro' },
    { id: 'dark', icon: '🌙', label: 'Escuro' },
    { id: 'gremio', icon: '⚽', label: 'Grêmio' }
  ];

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-800/50 border border-slate-700">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => changeTheme(option.id)}
            className={`
              px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300
              flex items-center gap-2
              ${currentTheme === option.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }
            `}
            title={option.label}
          >
            <span className="text-lg">{option.icon}</span>
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
