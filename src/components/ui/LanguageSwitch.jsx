import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { motion } from 'framer-motion';

export const LanguageSwitch = ({ className = '' }) => {
  const { lang, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Pilih Bahasa / Select Language"
      className={`relative flex items-center p-1 rounded-full border select-none gap-0.5
        bg-white/70 border-zinc-200/80 shadow-sm backdrop-blur-sm
        ${className}`}
    >
      {/* Sliding background indicator */}
      <button
        onClick={() => setLanguage('id')}
        aria-pressed={lang === 'id'}
        aria-label="Bahasa Indonesia"
        className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 focus-visible:ring-offset-1 z-10 cursor-pointer
          ${lang === 'id' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
      >
        {lang === 'id' && (
          <motion.span
            layoutId="activeLangBg"
            className="absolute inset-0 bg-brand-primary/10 border border-brand-primary/20 rounded-full -z-10 shadow-sm"
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        )}
        <span aria-hidden="true" className="text-sm leading-none">🇮🇩</span>
        <span>ID</span>
      </button>

      <button
        onClick={() => setLanguage('en')}
        aria-pressed={lang === 'en'}
        aria-label="English"
        className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 focus-visible:ring-offset-1 z-10 cursor-pointer
          ${lang === 'en' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
      >
        {lang === 'en' && (
          <motion.span
            layoutId="activeLangBg"
            className="absolute inset-0 bg-brand-primary/10 border border-brand-primary/20 rounded-full -z-10 shadow-sm"
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        )}
        <span aria-hidden="true" className="text-sm leading-none">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
