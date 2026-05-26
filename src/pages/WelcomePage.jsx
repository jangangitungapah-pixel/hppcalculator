import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { InteractiveDemoCalculator } from '../components/welcome/InteractiveDemoCalculator';
import { LandingHeader } from '../components/welcome/LandingHeader';
import { motion, AnimatePresence } from 'framer-motion';
import RawCountUp from 'react-countup';
const CountUp = typeof RawCountUp === 'function' ? RawCountUp : (RawCountUp.default || RawCountUp);
import { 
  Sparkles, 
  Calculator, 
  PieChart, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  ShoppingBag, 
  Database,
  ArrowRight,
  ChevronDown,
  Globe,
  RefreshCcw,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loadDemoData } = useAppData();
  const { addToast } = useToast();
  
  // Accordion active index state
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Triggers loading the full demo workspace and navigates to dashboard
  const handleLoadDemoWorkspace = () => {
    try {
      loadDemoData();
      
      // Fire confetti burst!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6A00', '#00A650', '#2EBF91', '#F5A623']
      });

      addToast({
        type: 'success',
        title: t('toasts.demoLoadedTitle', 'Workspace Contoh Dimuat'),
        message: t('toasts.demoLoadedMessage', 'Workspace Anda kini berisi contoh bahan baku, resep, dan simulasi.')
      });

      // Redirect user to dashboard to see their demo workspace
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (e) {
      console.error(e);
      addToast({
        type: 'error',
        title: t('toasts.errorTitle', 'Terjadi Kesalahan'),
        message: e.message
      });
    }
  };

  // Helper arrays for timeline steps
  const timelineSteps = [
    {
      icon: <Database className="w-6 h-6 text-brand-primary" />,
      title: t('welcome.step1Title'),
      desc: t('welcome.step1Desc')
    },
    {
      icon: <Layers className="w-6 h-6 text-brand-secondary" />,
      title: t('welcome.step2Title'),
      desc: t('welcome.step2Desc')
    },
    {
      icon: <Calculator className="w-6 h-6 text-status-okay" />,
      title: t('welcome.step3Title'),
      desc: t('welcome.step3Desc')
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-accent-gold" />,
      title: t('welcome.step4Title'),
      desc: t('welcome.step4Desc')
    }
  ];

  // Helper arrays for features list
  const features = [
    {
      icon: <Calculator className="w-7 h-7 text-brand-primary" />,
      bg: 'bg-brand-soft',
      title: t('welcome.featureQuickTitle'),
      desc: t('welcome.featureQuickDesc')
    },
    {
      icon: <Layers className="w-7 h-7 text-brand-secondary" />,
      bg: 'bg-brand-softGreen',
      title: t('welcome.featureRecipeTitle'),
      desc: t('welcome.featureRecipeDesc')
    },
    {
      icon: <ShoppingBag className="w-7 h-7 text-status-okay" />,
      bg: 'bg-status-okayBg',
      title: t('welcome.featurePricingTitle'),
      desc: t('welcome.featurePricingDesc')
    },
    {
      icon: <PieChart className="w-7 h-7 text-accent-gold" />,
      bg: 'bg-status-lowBg',
      title: t('welcome.featureReportTitle'),
      desc: t('welcome.featureReportDesc')
    },
    {
      icon: <Database className="w-7 h-7 text-accent-mint" />,
      bg: 'bg-teal-50',
      title: t('welcome.featureDataTitle'),
      desc: t('welcome.featureDataDesc')
    }
  ];

  // Helper arrays for FAQ list
  const faqs = [
    { q: t('welcome.faq1Q'), a: t('welcome.faq1A') },
    { q: t('welcome.faq2Q'), a: t('welcome.faq2A') },
    { q: t('welcome.faq3Q'), a: t('welcome.faq3A') },
    { q: t('welcome.faq4Q'), a: t('welcome.faq4A') }
  ];

  return (
    <div className="app-root flex-col min-h-screen bg-background relative overflow-x-hidden">
      
      {/* Moving Background Mesh Blobs */}
      <div className="mesh-bg-container">
        <div className="mesh-blob mesh-blob-orange"></div>
        <div className="mesh-blob mesh-blob-green"></div>
        <div className="mesh-blob mesh-blob-gold"></div>
      </div>

      {/* Frosted Glass Floating & Morphing Navigation Header */}
      <LandingHeader />

      {/* 1. Hero Section */}
      <section id="hero" className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-28 pb-12 md:pt-36 md:pb-20 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        
        {/* Left Copy Column */}
        <div className="flex-1 text-center lg:text-left max-w-xl">
          {/* Highlight Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-soft border border-brand-primary/10 rounded-full text-brand-primary text-xs font-bold mb-6 tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>💡 Kalkulator HPP & Simulasi Harga #1 untuk UMKM</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 leading-[1.1] tracking-tight">
            {t('welcome.headline')}
          </h1>
          
          <p className="text-base md:text-lg text-text-secondary mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
            {t('welcome.subheadline')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
            <Button 
              size="lg" 
              variant="premium"
              onClick={() => navigate('/calculator')}
              iconRight={<ArrowRight className="w-5 h-5" />}
            >
              {t('welcome.startCalculating')}
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={handleLoadDemoWorkspace}
            >
              {t('welcome.tryExample')}
            </Button>
          </div>

          {/* Social Proof Counter Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-border/60 pt-8">
            <div className="stat-counter-card">
              <p className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                <CountUp end={5000} duration={2.5} separator="." suffix="+" />
              </p>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">{t('welcome.statsUmkm')}</p>
            </div>
            <div className="stat-counter-card">
              <p className="text-2xl md:text-3xl font-black text-brand-primary tracking-tight">
                <CountUp end={99} duration={2.5} decimals={1} suffix="%" />
              </p>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">{t('welcome.statsAccuracy')}</p>
            </div>
            <div className="stat-counter-card">
              <p className="text-2xl md:text-3xl font-black text-brand-secondary tracking-tight">
                Rp 0
              </p>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">{t('welcome.statsCost')}</p>
            </div>
          </div>
        </div>

        {/* Right Interactive Demo Column */}
        <div id="demo" className="flex-1 w-full max-w-md relative">
          {/* Decorative background shadow cards */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-soft to-transparent rounded-3xl transform rotate-3 scale-105 -z-10 opacity-70"></div>
          <div className="absolute inset-0 bg-white/20 rounded-3xl transform -rotate-2 scale-102 -z-10 backdrop-blur-sm border border-white/20"></div>
          
          <InteractiveDemoCalculator />
        </div>
      </section>

      {/* 2. Features Showcase Section */}
      <section id="features" className="w-full bg-surface-cream border-y border-border/50 py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-4">
              {t('welcome.featuresTitle')}
            </h2>
            <p className="text-sm md:text-base text-text-secondary font-medium">
              {t('welcome.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="premium-feature-card">
                <div className={`feature-icon-box ${feature.bg} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-extrabold text-text-primary tracking-tight mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Visual Workflow Section */}
      <section id="workflow" className="w-full py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-4">
              {t('welcome.howItWorksTitle')}
            </h2>
            <p className="text-sm md:text-base text-text-secondary font-medium">
              {t('welcome.howItWorksSubtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Step Connecting Line (Desktop only) */}
            <div className="timeline-line hidden lg:block"></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 relative z-10">
              {timelineSteps.map((step, i) => (
                <div key={i} className="timeline-step-node group">
                  <div className="timeline-step-badge group-hover:border-brand-primary text-text-secondary font-black mb-4">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-text-primary tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion Section */}
      <section id="faq" className="w-full bg-surface-cream border-t border-border/50 py-16 md:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-4">
              {t('welcome.faqTitle')}
            </h2>
            <p className="text-sm md:text-base text-text-secondary font-medium">
              {t('welcome.faqSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-accordion-item">
                <button
                  onClick={() => toggleFaq(i)}
                  className="faq-accordion-trigger"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 faq-chevron ${activeFaq === i ? 'transform rotate-180 text-brand-primary' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-xs md:text-sm text-text-secondary leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Banner */}
      <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="cta-banner-container">
          <div className="cta-banner-glow"></div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex p-3 bg-brand-primary/10 text-brand-primary rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              {t('welcome.ctaTitle')}
            </h2>
            
            <p className="text-sm md:text-base text-zinc-400 mb-10 max-w-lg font-medium">
              {t('welcome.ctaSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Button 
                size="lg" 
                variant="premium"
                onClick={() => navigate('/calculator')}
                iconRight={<ArrowRight className="w-5 h-5" />}
              >
                {t('welcome.ctaStart')}
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                onClick={handleLoadDemoWorkspace}
              >
                {t('welcome.ctaLoadDemo')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer className="w-full border-t border-border/50 py-8 bg-surface-cream text-center text-xs text-text-muted font-bold">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {t('app.name')}. {t('app.tagline')}</p>
          <div className="flex items-center gap-1 text-[10px] text-brand-secondary bg-status-goodBg px-2.5 py-1 rounded-full border border-status-good/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Local Browser Database Safe</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
