import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Calculator, AlertCircle, UserPlus } from 'lucide-react';
import { FadeIn } from '../../components/motion/FadeIn';
import { useToast } from '../../hooks/useToast';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { signUp, signInWithGoogle, isFirebaseReady, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    if (password !== confirmPassword) {
      addToast({ type: 'error', title: 'Kata sandi tidak cocok' });
      return;
    }

    const res = await signUp({ email, password, fullName });
    if (res.success) {
      navigate('/account', { replace: true });
    }
  };

  const handleGoogleSignup = async () => {
    const res = await signInWithGoogle();
    if (res.success) {
      navigate('/account', { replace: true });
    }
  };

  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center border-warning-200 bg-warning-50">
          <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Cloud Sync Belum Dikonfigurasi</h2>
          <p className="text-sm text-text-secondary mb-6">
            Pendaftaran belum dapat dilakukan. Modalin tetap bisa digunakan dalam mode lokal.
          </p>
          <Button className="w-full" onClick={() => navigate('/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand-primary rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      
      <FadeIn className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-brand-primary border border-brand-primary/10">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Daftar Akun</h1>
          <p className="text-text-secondary mt-2">Daftar opsional untuk sinkronisasi cloud.</p>
        </div>

        <Card className="p-6 md:p-8 shadow-floating border-white/50 bg-white/80 backdrop-blur-md">
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <Input
              label="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Budi Santoso"
              required
            />
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
              placeholder="Minimal 6 karakter"
              required
            />
            <Input
              label="Konfirmasi Kata Sandi"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang kata sandi"
              required
            />
            
            <Button type="submit" className="w-full mt-4" isLoading={isLoading} disabled={!email || !password || !fullName || password !== confirmPassword}>
              <UserPlus className="w-4 h-4 mr-2" />
              Daftar Sekarang
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
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            Masuk dengan Google
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-text-secondary">Sudah punya akun? </span>
            <Link to="/login" className="text-brand-primary font-bold hover:underline">
              Masuk
            </Link>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};
