import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { LanguageSwitch } from '../components/ui/LanguageSwitch';
import { Sparkles, Calculator, PieChart, ShieldCheck } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageTransition } from '../components/motion/PageTransition';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <PageTransition className="app-root flex-col welcome-hero-bg">
      <header className="p-4 flex justify-between items-center max-w-[1180px] mx-auto w-full">
        <div className="flex items-center gap-2 text-brand-primary">
          <Sparkles className="w-6 h-6" />
          <span className="font-bold text-xl">{t('app.name')}</span>
        </div>
        <LanguageSwitch />
      </header>

      <PageContainer className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        <div className="flex-1 max-w-lg text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 leading-tight tracking-tight text-gradient">
            {t('welcome.headline')}
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-lg mx-auto lg:mx-0">
            {t('welcome.subheadline')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" onClick={() => navigate('/calculator')}>
              {t('welcome.startCalculating')}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
              {t('welcome.goToDashboard')}
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md relative">
          {/* Decorative background element */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-soft to-transparent rounded-3xl transform rotate-3 scale-105 -z-10 opacity-70"></div>
          
          <div className="bg-surface-glass backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-floating border border-white/40">
            <div className="mb-6 pb-6 border-b border-border flex justify-between items-center">
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-1">Total Modal</p>
                <p className="text-xl font-bold text-text-primary">Rp 45.000</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-1">HPP / Unit</p>
                <p className="text-xl font-bold text-brand-primary">Rp 4.500</p>
              </div>
            </div>

            <StaggerContainer className="space-y-6">
              <FadeIn direction="up">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-soft text-brand-primary rounded-2xl shadow-sm">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary tracking-tight">{t('welcome.benefitFast')}</h3>
                    <p className="text-sm text-text-secondary mt-1">Tanpa ribet, langsung tahu hasil.</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="up">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-status-goodBg text-status-good rounded-2xl shadow-sm">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary tracking-tight">{t('welcome.benefitClear')}</h3>
                    <p className="text-sm text-text-secondary mt-1">Rincian modal dan untung transparan.</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="up">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-status-okayBg text-status-okay rounded-2xl shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary tracking-tight">{t('welcome.benefitFriendly')}</h3>
                    <p className="text-sm text-text-secondary mt-1">Cocok untuk pemula yang baru jualan.</p>
                  </div>
                </div>
              </FadeIn>
            </StaggerContainer>
          </div>
        </div>
      </PageContainer>
    </PageTransition>
  );
};
