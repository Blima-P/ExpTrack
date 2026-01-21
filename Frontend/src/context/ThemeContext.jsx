import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  default: {
    name: 'Padrão',
    colors: {
      // Backgrounds - PRETO PURO com bege
      bgPrimary: 'bg-black',
      bgSecondary: 'bg-gradient-to-br from-black via-amber-900/20 to-black',
      bgCard: 'bg-gradient-to-br from-black via-amber-950/30 to-black',
      bgCardHover: 'hover:shadow-amber-900/40',
      bgInput: 'bg-black/90',
      bgNavbar: 'bg-gradient-to-r from-black via-amber-950/20 to-black',
      
      // Borders - Bege escuro
      borderPrimary: 'border-amber-700/50',
      borderSecondary: 'border-amber-900/40',
      borderNavbar: 'border-amber-700/50',
      
      // Text - Bege claro
      textPrimary: 'text-amber-100',
      textSecondary: 'text-amber-200',
      textMuted: 'text-amber-800',
      textGradient: 'bg-gradient-to-r from-amber-100 to-yellow-100 bg-clip-text text-transparent',
      
      // Buttons - Tons de bege/ouro
      btnPrimary: 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500',
      btnSecondary: 'bg-amber-900/60 hover:bg-amber-800/70',
      
      // Accents - Tons quentes
      accentPrimary: 'text-amber-300',
      accentSecondary: 'text-amber-200',
      shadowColor: 'shadow-amber-950/70',
      ringColor: 'focus:ring-amber-700',
      badgeBg: 'bg-amber-900/70',
      badgeBorder: 'border-amber-700/60',
      chipBg: 'bg-amber-950/80',
      chipBorder: 'border-amber-800/50',
    }
  },
  
  light: {
    name: 'Claro',
    colors: {
      // Backgrounds
      bgPrimary: 'bg-white',
      bgSecondary: 'bg-gradient-to-br from-white via-sky-50 to-blue-50',
      bgCard: 'bg-gradient-to-br from-white to-sky-50',
      bgCardHover: 'hover:shadow-blue-100',
      bgInput: 'bg-white',
      bgNavbar: 'bg-gradient-to-r from-white via-blue-50 to-white',
      
      // Borders
      borderPrimary: 'border-blue-200',
      borderSecondary: 'border-blue-100',
      borderNavbar: 'border-blue-200',
      
      // Text
      textPrimary: 'text-black',
      textSecondary: 'text-black',
      textMuted: 'text-black',
      textGradient: 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent',
      
      // Buttons
      btnPrimary: 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600',
      btnSecondary: 'bg-blue-50 hover:bg-blue-100 text-slate-900',
      
      // Accents
      accentPrimary: 'text-sky-600',
      accentSecondary: 'text-blue-600',
      shadowColor: 'shadow-blue-200',
      ringColor: 'focus:ring-sky-500',
      badgeBg: 'bg-sky-100',
      badgeBorder: 'border-sky-200',
      chipBg: 'bg-blue-50',
      chipBorder: 'border-blue-100',
    }
  },
  
  dark: {
    name: 'Escuro',
    colors: {
      // Backgrounds - Indigo/Roxo
      bgPrimary: 'bg-slate-950',
      bgSecondary: 'bg-gradient-to-br from-slate-950 to-slate-900',
      bgCard: 'bg-gradient-to-br from-slate-950 to-slate-900',
      bgCardHover: 'hover:shadow-indigo-900/30',
      bgInput: 'bg-slate-800/50',
      bgNavbar: 'bg-gradient-to-r from-slate-950 to-slate-900',
      
      // Borders
      borderPrimary: 'border-indigo-800/30',
      borderSecondary: 'border-slate-700',
      borderNavbar: 'border-indigo-800/50',
      
      // Text
      textPrimary: 'text-white',
      textSecondary: 'text-indigo-200',
      textMuted: 'text-slate-400',
      textGradient: 'bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent',
      
      // Buttons
      btnPrimary: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600',
      btnSecondary: 'bg-slate-700 hover:bg-slate-600',
      
      // Accents
      accentPrimary: 'text-indigo-300',
      accentSecondary: 'text-purple-400',
      shadowColor: 'shadow-indigo-900/30',
      ringColor: 'focus:ring-indigo-500',
      badgeBg: 'bg-indigo-600/20',
      badgeBorder: 'border-indigo-500/40',
      chipBg: 'bg-slate-800/50',
      chipBorder: 'border-slate-700',
    }
  },

  gremio: {
    name: 'Grêmio',
    colors: {
      // Backgrounds - Azul Grêmio com preto
      bgPrimary: 'bg-black',
      bgSecondary: 'bg-gradient-to-br from-black via-cyan-950 to-slate-950',
      bgCard: 'bg-gradient-to-br from-cyan-950 via-slate-950 to-black',
      bgCardHover: 'hover:shadow-cyan-400/30',
      bgInput: 'bg-slate-900/60',
      bgNavbar: 'bg-gradient-to-r from-black via-cyan-950 to-black',
      
      // Borders - Azul Grêmio
      borderPrimary: 'border-cyan-500/50',
      borderSecondary: 'border-slate-800',
      borderNavbar: 'border-cyan-500/60',
      
      // Text
      textPrimary: 'text-white',
      textSecondary: 'text-cyan-200',
      textMuted: 'text-slate-400',
      textGradient: 'bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent',
      
      // Buttons - Azul Grêmio
      btnPrimary: 'bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-600 hover:to-sky-500',
      btnSecondary: 'bg-slate-800 hover:bg-slate-700',
      
      // Accents - Azul claro Grêmio
      accentPrimary: 'text-cyan-300',
      accentSecondary: 'text-sky-300',
      shadowColor: 'shadow-cyan-800/40',
      ringColor: 'focus:ring-cyan-400',
      badgeBg: 'bg-cyan-900/60',
      badgeBorder: 'border-cyan-500/50',
      chipBg: 'bg-slate-900/60',
      chipBorder: 'border-cyan-600/50',
    }
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('exptrack-theme');
    return saved || 'default';
  });

  useEffect(() => {
    localStorage.setItem('exptrack-theme', currentTheme);
  }, [currentTheme]);

  const theme = themes[currentTheme];

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
