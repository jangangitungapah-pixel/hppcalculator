import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSwitch = ({ className = '' }) => {
  const { lang, setLanguage } = useLanguage();

  return (
    <div 
      className={`language-switch ${className}`} 
      role="group" 
      aria-label="Pilih Bahasa / Select Language"
    >
      <button
        onClick={() => setLanguage('id')}
        aria-pressed={lang === 'id'}
        className={`language-switch-option ${lang === 'id' ? 'language-switch-option-active' : ''}`}
      >
        ID
      </button>
      <button
        onClick={() => setLanguage('en')}
        aria-pressed={lang === 'en'}
        className={`language-switch-option ${lang === 'en' ? 'language-switch-option-active' : ''}`}
      >
        EN
      </button>
    </div>
  );
};
