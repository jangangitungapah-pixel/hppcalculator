import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Calculator, AlertCircle, LogIn } from 'lucide-react';
import { FadeIn } from '../../components/motion/FadeIn';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, isFirebaseReady, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const res = await signIn({ email, password });
    if (res.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    const res = await signInWithGoogle();
    if (res.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center border-warning-200 bg-warning-50">
          <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Cloud Sync Belum Dikonfigurasi</h2>
          <p className="text-sm text-text-secondary mb-6">
            Sistem otentikasi belum disiapkan pada environment ini. Modalin tetap bisa digunakan dalam mode lokal.
          </p>
          <Button className="w-full" onClick={() => navigate('/dashboard')}>
            Lanjutkan ke Dashboard (Local Mode)
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-primary rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-accent-coral rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      
      <FadeIn className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-brand-primary border border-brand-primary/10">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Masuk ke Modalin</h1>
          <p className="text-text-secondary mt-2">Login opsional untuk sinkronisasi cloud.</p>
        </div>

        <Card className="p-6 md:p-8 shadow-floating border-white/50 bg-white/80 backdrop-blur-md">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
            <Input
              label="Kata Sandi"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-brand-primary font-medium hover:underline">
                Lupa kata sandi?
              </Link>
            </div>
            
            <Button type="submit" className="w-full mt-2" isLoading={isLoading} disabled={!email || !password}>
              <LogIn className="w-4 h-4 mr-2" />
              Masuk
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-text-tertiary">ATAU</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Masuk dengan Google
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-text-secondary">Belum punya akun? </span>
            <Link to="/register" className="text-brand-primary font-bold hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </Card>

        <p className="text-center text-xs text-text-tertiary mt-8 max-w-xs mx-auto leading-relaxed">
          Modalin tetap bisa dipakai tanpa login. Data otomatis tersimpan di perangkat ini.
        </p>
      </FadeIn>
    </div>
  );
};
