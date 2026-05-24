import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { LanguageSwitch } from '../components/ui/LanguageSwitch';
import { Sparkles, Calculator, PieChart, ShieldCheck } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-between items-center max-w-[1180px] mx-auto w-full">
        <div className="flex items-center gap-2 text-brand-primary">
          <Sparkles className="w-6 h-6" />
          <span className="font-bold text-xl">{t('app.name')}</span>
        </div>
        <LanguageSwitch />
      </header>

      <PageContainer className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        <div className="flex-1 max-w-lg text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
            {t('welcome.headline')}
          </h1>
          <p className="text-lg text-text-secondary mb-10">
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

        <div className="flex-1 w-full max-w-md">
          <div className="bg-surface p-6 md:p-8 rounded-2xl shadow-floating border border-border">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-soft text-brand-primary rounded-xl">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{t('welcome.benefitFast')}</h3>
                  <p className="text-sm text-text-secondary mt-1">Tanpa ribet, langsung tahu hasil.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-status-goodBg text-status-good rounded-xl">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{t('welcome.benefitClear')}</h3>
                  <p className="text-sm text-text-secondary mt-1">Rincian modal dan untung transparan.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-status-okayBg text-status-okay rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{t('welcome.benefitFriendly')}</h3>
                  <p className="text-sm text-text-secondary mt-1">Cocok untuk pemula yang baru jualan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
