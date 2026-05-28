import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Cloud, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { cn } from '../../lib/ui/cn';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export const LoginPanel = ({ className, compact = false, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, isFirebaseReady, isLoading } = useAuth();

  const finish = () => {
    if (onSuccess) {
      onSuccess();
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const res = await signIn({ email, password });
    if (res.success) finish();
  };

  const handleGoogleLogin = async () => {
    const res = await signInWithGoogle();
    if (res.success) finish();
  };

  if (!isFirebaseReady) {
    return (
      <Card className={cn('login-panel p-5 sm:p-6', className)}>
        <div className="login-panel-status is-warning">
          <AlertCircle className="w-4 h-4" />
          Cloud Sync belum aktif
        </div>
        <h2 className="login-panel-title">Masuk nanti, mulai sekarang.</h2>
        <p className="login-panel-copy">
          Environment ini belum memakai Firebase Auth. Modalin tetap bisa digunakan dalam mode lokal.
        </p>
        <Button fullWidth onClick={() => navigate('/dashboard')} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Lanjut Mode Lokal
        </Button>
      </Card>
    );
  }

  return (
    <Card className={cn('login-panel p-5 sm:p-6', compact && 'login-panel-compact', className)}>
      <div className="login-panel-status">
        <Cloud className="w-4 h-4" />
        Cloud Sync siap
      </div>

      <div className="mb-4">
        <h2 className="login-panel-title">Masuk ke Modalin</h2>
        <p className="login-panel-copy">
          Sinkronkan data bisnis, backup cloud, dan lanjutkan hitungan dari perangkat mana pun.
        </p>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          prefix={<Mail className="w-4 h-4" />}
          required
        />
        <Input
          label="Kata sandi"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
          prefix={<LockKeyhole className="w-4 h-4" />}
          required
        />
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-text-muted">Login opsional, data lokal tetap aman.</span>
          <Link to="/forgot-password" className="login-panel-inline-link font-extrabold text-brand-primary hover:underline">
            Lupa?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={isLoading} disabled={!email || !password}>
          Masuk
        </Button>
      </form>

      <div className="login-panel-divider">
        <span>atau</span>
      </div>

      <Button variant="outline" fullWidth onClick={handleGoogleLogin} disabled={isLoading} leftIcon={<GoogleIcon />}>
        Masuk dengan Google
      </Button>

      <div className="mt-4 text-center text-sm">
        <span className="text-text-secondary">Belum punya akun? </span>
        <Link to="/register" className="login-panel-inline-link font-extrabold text-brand-primary hover:underline">
          Daftar
        </Link>
      </div>
    </Card>
  );
};
