import React from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../hooks/useLanguage';

export const CalculatorHero = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="calculator-hero">
      <div className="calculator-hero-content">
        <Badge variant="neutral" className="mb-3.5 bg-brand-soft text-brand-primary border-none font-bold uppercase tracking-wider text-xs">
          {lang === 'en' ? 'Quick HPP Calculator' : 'Kalkulator Cepat'}
        </Badge>
        <h1 className="calculator-hero-title">
          Hitung <span>HPP Produk</span>
        </h1>
        <p className="calculator-hero-subtitle">
          {t('calculator.pageSubtitle', 'Masukkan biaya produksi, jumlah hasil, dan harga jual untuk melihat modal per produk, profit, margin, dan saran harga.')}
        </p>
        
        <div className="calculator-hero-pills">
          <span className="calculator-hero-pill green">Cocok untuk F&B</span>
          <span className="calculator-hero-pill">Bisa Offline</span>
          <span className="calculator-hero-pill gold">Local-First</span>
        </div>
      </div>

      <div className="calculator-hero-visual hidden md:flex">
        <div className="calculator-hero-orb"></div>
        <div className="calculator-hero-icon-wrapper">
          <Calculator className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};
