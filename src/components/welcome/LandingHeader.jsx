import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export const LandingHeader = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuItems = [
    { id: 'hero', label: 'Home' },
    { id: 'demo', label: 'Demo' },
    { id: 'features', label: 'Workflow' },
    { id: 'workflow', label: 'Cloud' },
    { id: 'faq', label: 'FAQ' },
  ];

  // Monitor scroll positioning to update header height/styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHeaderOffset = useCallback(() => {
    const header = document.querySelector('[data-landing-header]');
    return (header?.getBoundingClientRect().height || 76) + 24;
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      const probeLine = getHeaderOffset() + 120;
      const visibleSections = menuItems
        .map((item) => {
          const element = document.getElementById(item.id);
          if (!element) return null;
          return {
            id: item.id,
            top: element.getBoundingClientRect().top,
          };
        })
        .filter(Boolean);

      const current = visibleSections
        .filter((section) => section.top <= probeLine)
        .sort((a, b) => b.top - a.top)[0] || visibleSections[0];

      if (current) setActiveSection(current.id);
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [getHeaderOffset]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      setActiveSection(id);
      const offsetPosition = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile menu animation variants
  const drawerVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 sm:px-6">
      <div data-landing-header className={`mx-auto flex justify-between items-center pointer-events-auto border transition-all duration-500 ease-[var(--ease-premium)] ${
        isScrolled 
          ? 'max-w-full w-full mt-0 px-6 py-3 bg-surface-glass border-white/0 border-b-border/60 shadow-md backdrop-blur-md rounded-none' 
          : 'max-w-[1200px] w-[calc(100%-2rem)] mt-4 px-6 py-3.5 bg-white/50 border-white/40 backdrop-blur-lg shadow-floating rounded-2xl'
      }`}>
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2 text-brand-primary cursor-pointer"
          onClick={(e) => handleNavClick(e, 'hero')}
        >
          <div className="p-1.5 bg-brand-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tight text-gradient">{t('app.name')}</span>
        </div>

        {/* Desktop Navigation Links with sliding background pill */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-text-secondary relative">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`relative px-4 py-2 rounded-full transition-colors duration-300 hover:text-text-primary ${
                activeSection === item.id ? 'text-brand-primary font-extrabold' : 'text-text-secondary'
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 bg-brand-primary/8 border border-brand-primary/10 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.8 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitch />
          <button
            onClick={() => navigate('/dashboard')}
            aria-label={t('welcome.goToDashboard')}
            className="welcome-dashboard-cta"
          >
            {t('welcome.goToDashboard')}
            <ArrowRight className="welcome-dashboard-cta-icon shrink-0" />
          </button>
        </div>

        {/* Mobile controls toggle */}
        <div className="flex lg:hidden items-center gap-2.5">
          <LanguageSwitch />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="p-3 bg-white/70 border border-zinc-200/80 hover:border-brand-primary/40 rounded-xl text-text-primary hover:text-brand-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 backdrop-blur-sm shadow-sm"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[65px] bg-zinc-950/20 backdrop-blur-sm z-40 lg:hidden pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="bg-white/95 border-b border-border/60 shadow-floating p-6 flex flex-col gap-6 absolute top-0 left-0 right-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1.5">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.id}
                    variants={itemVariants}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      activeSection === item.id
                        ? 'bg-brand-soft text-brand-primary border-l-4 border-brand-primary'
                        : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </motion.a>
                ))}
              </div>

              <motion.div variants={itemVariants} className="pt-4 border-t border-border/40 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/calculator');
                  }}
                  className="group relative w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-[#FF6A00] to-[#FF8C42] border border-[#FF6A00]/30 shadow-md shadow-brand-primary/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-1 cursor-pointer tracking-wide"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <span className="relative z-10">{t('welcome.startCalculating')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold text-brand-primary bg-brand-primary/6 border border-brand-primary/20 hover:bg-brand-primary/12 hover:border-brand-primary/35 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-1 cursor-pointer"
                >
                  {t('welcome.goToDashboard')}
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
