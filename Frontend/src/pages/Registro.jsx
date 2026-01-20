import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/ContextoAutenticacao';
import { IconeAviso, IconeCarregando } from '../components/Icones';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      console.log('Tentando registrar:', { email, name });
      const response = await authService.register(email, password, name);
      console.log('Resposta do registro:', response);
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
      console.error('Erro ao criar conta:', err);
      console.error('Detalhes do erro:', err.response);
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {/* Elementos decorativos subtle */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full opacity-40 blur-3xl -ml-36 -mt-36"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full opacity-40 blur-3xl -mr-48 -mb-48"></div>

      <div className="w-full max-w-md relative z-10 animate-slide-in">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            ExpTrack
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Comece a gerenciar seus gastos
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
            <label className="block text-gray-900 font-semibold mb-3">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
              placeholder="Seu nome completo"
              required
            />
          </div>

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

          <div>
            <label className="block text-gray-900 font-semibold mb-3">Confirmar Senha</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-1 border-t border-gray-200"></div>
          <div className="px-4 text-sm text-gray-500 font-medium">ou</div>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Links */}
        <div className="text-center">
          <p className="text-gray-600">
            Já tem conta?{' '}
            <Link to="/login" className="text-blue-900 hover:text-blue-700 font-semibold">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
