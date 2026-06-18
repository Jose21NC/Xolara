import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onBack, onLoginSuccess }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-primary/5 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-4 pb-6">
        <button
          onClick={onBack}
          className="bg-white/90 backdrop-blur-sm text-brand-text-dark border border-brand-primary/10 rounded-full p-2.5 shadow-ios transition-apple tap-feedback"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 flex flex-col justify-center pb-20">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-scale-in">
          <h1 className="font-serif text-4xl font-bold text-brand-primary mb-2">Xolara</h1>
          <p className="text-sm text-brand-text-muted">Descubre Nicaragua auténtica</p>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex gap-2 mb-6 p-1 bg-white rounded-full shadow-ios">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-apple ${
              isLogin
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-text-muted'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-apple ${
              !isLogin
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-text-muted'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative animate-slide-down">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-brand-primary/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-brand-text-dark outline-none shadow-sm focus:border-brand-primary transition-apple"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-brand-primary/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-brand-text-dark outline-none shadow-sm focus:border-brand-primary transition-apple"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-brand-primary/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-brand-text-dark outline-none shadow-sm focus:border-brand-primary transition-apple"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted tap-feedback"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl animate-scale-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-2xl shadow-ios hover:shadow-ios-lg transition-apple tap-feedback disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          {isLogin && (
            <button className="text-xs text-brand-primary font-semibold hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>

        {/* Social Login (Optional) */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-primary/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gradient-to-br from-brand-bg via-white to-brand-primary/5 text-brand-text-muted">
                O continúa con
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-white border border-brand-primary/10 rounded-xl py-3 shadow-sm hover:shadow-md transition-apple tap-feedback">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-semibold text-brand-text-dark">Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 bg-white border border-brand-primary/10 rounded-xl py-3 shadow-sm hover:shadow-md transition-apple tap-feedback">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs font-semibold text-brand-text-dark">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
