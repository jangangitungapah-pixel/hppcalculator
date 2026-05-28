import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  Database,
  Layers,
  PlayCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { LandingHeader } from '../components/welcome/LandingHeader';
import { InteractiveDemoCalculator } from '../components/welcome/InteractiveDemoCalculator';
import { LoginPanel } from '../components/auth/LoginPanel';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loadDemoData } = useAppData();
  const { addToast } = useToast();

  const handleLoadDemoWorkspace = () => {
    try {
      loadDemoData();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.62 },
        colors: ['#FF6A00', '#00A650', '#2EBF91', '#F5A623']
      });
      addToast({
        type: 'success',
        title: t('toasts.demoLoadedTitle'),
        message: t('toasts.demoLoadedMessage')
      });
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (e) {
      addToast({
        type: 'error',
        title: t('toasts.errorTitle'),
        message: e.message
      });
    }
  };

  const workflow = [
    { icon: Database, title: 'Catat bahan', body: 'Simpan harga bahan, satuan, dan stok biaya dasar.' },
    { icon: Layers, title: 'Susun resep', body: 'Gabungkan bahan menjadi modal produksi yang rapi.' },
    { icon: Calculator, title: 'Hitung HPP', body: 'Lihat modal per porsi, profit, dan margin otomatis.' },
    { icon: ShoppingBag, title: 'Simulasi channel', body: 'Bandingkan marketplace, reseller, promo, dan bundle.' }
  ];

  const highlights = [
    { icon: ShieldCheck, label: 'Local-first', value: 'Data tetap bisa jalan offline' },
    { icon: TrendingUp, label: 'Margin sehat', value: 'Harga aman per channel' },
    { icon: BarChart3, label: 'Laporan bisnis', value: 'Insight dari data tersimpan' }
  ];

  return (
    <div className="landing-page">
      <LandingHeader />

      <main>
        <section id="hero" className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-kicker">
              <Sparkles className="w-4 h-4" />
              Kalkulator HPP dan pricing workspace untuk UMKM F&B
            </div>

            <h1>{t('welcome.headline')}</h1>
            <p className="landing-lead">{t('welcome.subheadline')}</p>

            <div className="landing-actions">
              <Button
                size="lg"
                variant="premium"
                onClick={() => navigate('/calculator')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Hitung HPP Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLoadDemoWorkspace}
                leftIcon={<PlayCircle className="w-5 h-5" />}
              >
                Muat Demo
              </Button>
            </div>

            <div className="landing-highlight-grid" aria-label="Ringkasan keunggulan">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="landing-highlight-card" key={item.label}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="landing-login-stack">
            <LoginPanel compact />
            <div className="landing-mini-proof">
              <CheckCircle2 className="w-4 h-4" />
              Login opsional. Mulai lokal dulu, sinkronkan kapan saja.
            </div>
          </div>
        </section>

        <section id="demo" className="landing-demo-band">
          <div className="landing-section-copy">
            <span className="landing-section-eyebrow">Live calculator</span>
            <h2>Uji skenario harga tanpa membuka spreadsheet.</h2>
            <p>
              Masukkan biaya produksi dan harga jual, lalu lihat efeknya pada margin secara langsung.
            </p>
            <div className="landing-demo-points">
              <div><CheckCircle2 className="w-4 h-4" /> HPP per unit dihitung otomatis.</div>
              <div><CheckCircle2 className="w-4 h-4" /> Profit dan margin langsung terlihat.</div>
              <div><CheckCircle2 className="w-4 h-4" /> Hasil bisa dilanjutkan ke kalkulator penuh.</div>
            </div>
          </div>
          <div className="landing-demo-wrap">
            <InteractiveDemoCalculator />
          </div>
        </section>

        <section id="features" className="landing-feature-section">
          <div className="landing-section-copy is-centered">
            <span className="landing-section-eyebrow">Workflow lengkap</span>
            <h2>Dari bahan sampai keputusan harga jual.</h2>
            <p>Semua modul disusun untuk kerja harian yang cepat, padat, dan mudah dibaca.</p>
          </div>

          <div className="landing-workflow-grid">
            {workflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <article className="landing-workflow-card" key={step.title}>
                  <div className="landing-workflow-number">{index + 1}</div>
                  <Icon className="w-6 h-6" />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="workflow" className="landing-ops-section">
          <div className="landing-ops-panel">
            <div>
              <span className="landing-section-eyebrow">Local-first cloud-ready</span>
              <h2>Dipakai langsung tanpa akun, naik kelas dengan cloud sync.</h2>
            </div>
            <div className="landing-ops-list">
              <div><CheckCircle2 className="w-4 h-4" /> Data lokal tetap tersedia saat offline.</div>
              <div><CheckCircle2 className="w-4 h-4" /> Backup JSON dan export CSV tersedia.</div>
              <div><CheckCircle2 className="w-4 h-4" /> Firestore rules membatasi data per user.</div>
            </div>
          </div>
        </section>

        <section id="faq" className="landing-cta-section">
          <h2>Siap rapikan harga jual hari ini?</h2>
          <p>Mulai hitung HPP tanpa login, atau masuk agar data bisnis tersinkron ke cloud.</p>
          <div className="landing-actions is-centered">
            <Button size="lg" variant="premium" onClick={() => navigate('/calculator')}>
              Mulai Hitung
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Buka Halaman Login
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};
