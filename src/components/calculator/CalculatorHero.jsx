import React from 'react';
import { Calculator, Zap } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const CalculatorHero = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 shadow-lg border border-orange-400/10">
      {/* Decorative orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl" />

      <div className="relative px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex-1">
          {/* Badge */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20">
              <Zap className="w-3 h-3 text-yellow-200" /> {lang === 'en' ? 'Quick HPP' : 'Kalkulator HPP'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Hitung <span className="opacity-95 text-yellow-100">HPP Produk</span>
          </h2>
          <p className="text-white/80 text-sm mt-2 max-w-lg font-medium leading-relaxed">
            {t('calculator.pageSubtitle', 'Masukkan biaya produksi, jumlah hasil, dan harga jual untuk melihat modal per produk, profit, margin, dan saran harga.')}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-colors">
              🟢 Cocok untuk F&B
            </span>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-colors">
              📶 Bisa Offline
            </span>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-colors">
              ⭐ Local-First
            </span>
          </div>
        </div>

        {/* Visual Icon */}
        <div className="shrink-0 hidden md:flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm shadow-inner transition-transform duration-300 hover:scale-105">
          <Calculator className="w-9 h-9 text-white" />
        </div>
      </div>
    </div>
  );
};
