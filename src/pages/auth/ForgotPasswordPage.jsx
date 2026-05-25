import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Calculator, ArrowLeft, Send } from 'lucide-react';
import { FadeIn } from '../../components/motion/FadeIn';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const { resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return;
    const res = await resetPassword(email);
    if (res.success) {
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <FadeIn className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-brand-primary border border-brand-primary/10">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Lupa Kata Sandi</h1>
          <p className="text-text-secondary mt-2">Kami akan mengirimkan link untuk mereset kata sandi Anda.</p>
        </div>

        <Card className="p-6 md:p-8 shadow-floating border-white/50 bg-white/80 backdrop-blur-md">
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
            
            <Button type="submit" className="w-full mt-2" isLoading={isLoading} disabled={!email}>
              <Send className="w-4 h-4 mr-2" />
              Kirim Link Reset
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-text-secondary hover:text-brand-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Login
            </Link>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};
