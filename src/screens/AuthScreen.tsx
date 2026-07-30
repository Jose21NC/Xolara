import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useT } from '../contexts/I18nContext';
import { Loader2, Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function AuthScreen() {
  const { t } = useT();
  const { signIn, signUp, error, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('traveler');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError(t('auth.err_required'));
      return;
    }
    if (password.length < 6) {
      setLocalError(t('auth.err_password_length'));
      return;
    }
    if (mode === 'signup' && !displayName.trim()) {
      setLocalError(t('auth.err_name_required'));
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, displayName.trim(), role);
      }
    } catch {
      // error is set via AuthContext
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setLocalError(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-brand-text-dark">Xolara</h1>
          <p className="text-sm text-brand-text-muted mt-2 font-medium">
            {mode === 'signin' ? t('auth.welcome_back') : t('auth.discover')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
          <div className="flex mb-6 bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin' ? 'bg-white shadow-sm text-brand-text-dark' : 'text-brand-text-muted'
              }`}
            >
              {t('auth.signin')}
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white shadow-sm text-brand-text-dark' : 'text-brand-text-muted'
              }`}
            >
              {t('auth.signup')}
            </button>
          </div>

          {(error || localError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <span className="text-[11px] text-red-600 font-medium">{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
            {mode === 'signup' && (
              <div>
                <label className="text-[9px] font-black tracking-widest uppercase text-brand-text-muted mb-1.5 block">
                  {t('auth.full_name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t('auth.name_placeholder')}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[9px] font-black tracking-widest uppercase text-brand-text-muted mb-1.5 block">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.email_placeholder')}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black tracking-widest uppercase text-brand-text-muted mb-1.5 block">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.pwd_placeholder')}
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-[9px] font-black tracking-widest uppercase text-brand-text-muted mb-1.5 block">
                  {t('auth.user_type')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'traveler', label: t('auth.traveler') },
                    { value: 'guide', label: t('auth.guide') },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                        role === opt.value
                          ? 'bg-brand-primary/10 border-brand-primary/60 text-brand-primary'
                          : 'bg-surface border-black/8 text-brand-text-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand-primary hover:bg-brand-primary/95 text-white py-3.5 rounded-xl font-semibold text-sm shadow-ios transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'signin' ? (
                t('auth.signin_btn')
              ) : (
                t('auth.create_account')
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={switchMode}
              className="text-[11px] text-brand-primary font-bold hover:underline"
            >
              {mode === 'signin' ? t('auth.no_account') : t('auth.has_account')}
            </button>
          </div>
        </div>

        <p className="text-[9px] text-brand-text-muted text-center mt-6 leading-relaxed max-w-[260px] mx-auto">
          {t('auth.footer_text')}
        </p>
      </div>
    </div>
  );
}
