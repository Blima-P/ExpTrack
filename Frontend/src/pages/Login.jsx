import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/ContextoAutenticacao';
import { IconeAviso, IconeCarregando } from '../components/Icones';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentando fazer login:', { email });
      const response = await authService.login(email, password);
      console.log('Resposta do login:', response);
      const { data } = response.data;

      login(
        {
          uid: data.uid,
          email: data.email,
          name: data.name,
        },
        data.token
      );

      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      console.error('Detalhes do erro:', err.response);
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {/* Elementos decorativos subtle */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50 rounded-full opacity-40 blur-3xl -mr-36 -mt-36"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full opacity-40 blur-3xl -ml-48 -mb-48"></div>

      <div className="w-full max-w-md relative z-10 animate-slide-in">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">💰</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            ExpTrack
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Controle seus gastos com elegância
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-fade-in">
            <div className="flex items-start gap-3">
              <IconeAviso size={20} cor="#EF4444" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-900 font-semibold mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 font-semibold mb-3">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
          >
            {loading && <IconeCarregando size={20} cor="white" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-1 border-t border-gray-200"></div>
          <div className="px-4 text-sm text-gray-500 font-medium">ou</div>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Links */}
        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            Não tem conta?{' '}
            <Link to="/register" className="text-blue-900 hover:text-blue-700 font-semibold">
              Crie uma agora
            </Link>
          </p>
          <Link 
            to="/reset-password" 
            className="block text-gray-500 hover:text-blue-900 text-sm font-medium"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
