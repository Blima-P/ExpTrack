import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextoAutenticacao';
import { useTheme } from '../context/ThemeContext';
import { IconeUsuario, IconeSaida, LogoExpTrack } from './Icones';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`${theme.colors.bgNavbar} border-b ${theme.colors.borderNavbar} shadow-xl ${theme.colors.shadowColor}`} style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
            <LogoExpTrack size={40} />
            <h1 className={`text-2xl font-bold tracking-tight ${theme.colors.textPrimary}`}>ExpTrack</h1>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-6">
              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* User Info - Hidden on mobile */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-3">
                  <IconeUsuario size={20} cor="#A5B4FC" />
                  <div>
                    <p className={`font-semibold text-sm ${theme.colors.textPrimary}`}>{user.name}</p>
                    <p className={`text-xs ${theme.colors.textMuted}`}>{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`px-6 py-2.5 ${theme.colors.btnPrimary} text-white font-semibold rounded-lg transition-all duration-300 text-sm flex items-center gap-2 shadow-lg ${theme.colors.shadowColor}`}
              >
                <IconeSaida size={18} cor="currentColor" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
