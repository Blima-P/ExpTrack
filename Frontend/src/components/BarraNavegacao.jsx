import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextoAutenticacao';
import { IconeUsuario, IconeSaida, LogoExpTrack } from './Icones';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 shadow-xl shadow-indigo-900/20" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
            <LogoExpTrack size={40} />
            <h1 className="text-2xl font-bold text-white tracking-tight">ExpTrack</h1>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-6">
              {/* User Info - Hidden on mobile */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-3">
                  <IconeUsuario size={20} cor="#A5B4FC" />
                  <div>
                    <p className="font-semibold text-white text-sm">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
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
