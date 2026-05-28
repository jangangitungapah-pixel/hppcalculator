import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Cloud, Database, ShieldCheck, TrendingUp } from 'lucide-react';
import { LoginPanel } from '../../components/auth/LoginPanel';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/motion/FadeIn';

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className="auth-page-shell">
      <div className="auth-page-nav">
        <button className="auth-back-button" onClick={() => navigate('/')} aria-label="Kembali ke landing page">
          <ArrowLeft className="w-4 h-4" />
          Landing
        </button>
      </div>

      <FadeIn className="auth-page-grid">
        <section className="auth-story-panel" aria-labelledby="login-story-title">
          <div className="auth-brand-mark">
            <Calculator className="w-6 h-6" />
          </div>
          <p className="auth-kicker">Modalin Cloud Workspace</p>
          <h1 id="login-story-title" className="auth-title">
            Satu akun untuk harga, margin, laporan, dan backup bisnis.
          </h1>
          <p className="auth-subtitle">
            Masuk untuk menjaga data tetap sinkron. Tetap bisa lanjut lokal saat sedang offline atau belum ingin memakai cloud.
          </p>

          <div className="auth-proof-grid">
            <div className="auth-proof-item">
              <ShieldCheck className="w-5 h-5" />
              <span>Rules per user</span>
            </div>
            <div className="auth-proof-item">
              <Cloud className="w-5 h-5" />
              <span>Cloud sync</span>
            </div>
            <div className="auth-proof-item">
              <Database className="w-5 h-5" />
              <span>Local-first</span>
            </div>
            <div className="auth-proof-item">
              <TrendingUp className="w-5 h-5" />
              <span>Margin tracker</span>
            </div>
          </div>

          <div className="auth-demo-strip">
            <div>
              <span className="auth-demo-label">Contoh margin</span>
              <strong>37.5%</strong>
            </div>
            <div>
              <span className="auth-demo-label">Harga aman</span>
              <strong>Rp 18.500</strong>
            </div>
            <div>
              <span className="auth-demo-label">Status</span>
              <strong>Sehat</strong>
            </div>
          </div>

          <Button variant="outline" className="auth-local-button" onClick={() => navigate('/dashboard')}>
            Lanjut tanpa login
          </Button>
        </section>

        <section className="auth-form-wrap" aria-label="Panel login">
          <LoginPanel />
        </section>
      </FadeIn>
    </main>
  );
};
