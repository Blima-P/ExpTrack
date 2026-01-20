import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/ContextoAutenticacao';
import { IconeAviso, IconeCarregando, LogoExpTrack } from '../components/Icones';

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
      
      // Extrair dados da resposta
      const userData = response.data.data;

      login(
        {
          uid: userData.uid,
          email: userData.email,
          name: userData.name,
        },
        userData.token
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md relative z-10 animate-slide-in">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 flex items-center justify-center">
              <LogoExpTrack size={80} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Criar Conta
          </h1>
          <p className="text-lg text-slate-300 font-light">
            Comece a gerenciar seus gastos agora
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-100 px-6 py-4 rounded-2xl mb-8 animate-fade-in">
            <div className="flex items-start gap-3">
              <IconeAviso size={20} cor="#FCA5A5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-500/20">
          <div>
            <label className="block text-white font-semibold mb-3">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-indigo-500"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-indigo-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">Confirmar Senha</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="input-field w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/30"
          >
            {loading && <IconeCarregando size={20} cor="white" />}
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-1 border-t border-slate-800"></div>
          <div className="px-4 text-sm text-slate-400 font-medium">ou</div>
          <div className="flex-1 border-t border-slate-800"></div>
        </div>

        {/* Links */}
        <div className="text-center">
          <p className="text-slate-300">
            Já tem conta?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
