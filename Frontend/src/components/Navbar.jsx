import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container-custom py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-blue-600">💰 ExpTrack</h1>
        </div>

        {user && (
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
