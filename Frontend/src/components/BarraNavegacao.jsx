import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextoAutenticacao';
import { IconeUsuario, IconeSaida } from './Icones';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-xl">💰</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ExpTrack</h1>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-6">
              {/* User Info - Hidden on mobile */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-3">
                  <IconeUsuario size={20} cor="#003D7A" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm flex items-center gap-2"
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
