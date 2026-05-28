import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calculator, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { FadeIn } from '../motion/FadeIn';

export const DashboardEmptyState = ({ onLoadDemo }) => {
  const navigate = useNavigate();

  return (
    <FadeIn>
      <div className="relative rounded-3xl border border-border/60 bg-surface overflow-hidden mb-6">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />

        <div className="relative p-6 sm:p-8">
          {/* Top badge */}
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full border border-orange-200 mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Mulai Sekarang — Gratis
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary leading-tight mb-3">
            Mulai dari produk pertamamu <span className="text-brand-primary">🚀</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
            Hitung HPP, tentukan harga jual yang tepat, lalu pantau profitmu. Tanpa login, data tersimpan lokal.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-2.5 mb-7 max-w-xs">
            {[
              { n: '1', text: 'Input bahan baku & biaya produksi' },
              { n: '2', text: 'Hitung HPP & margin otomatis' },
              { n: '3', text: 'Simpan & pantau semua produk' },
            ].map(step => (
              <div key={step.n} className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {step.n}
                </span>
                {step.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => navigate('/calculator')} className="gap-2 h-11 px-6">
              <Calculator className="w-4 h-4" />
              Hitung HPP Sekarang
            </Button>
            <Button variant="secondary" onClick={onLoadDemo} className="gap-2 h-11 px-5">
              <Sparkles className="w-4 h-4" />
              Coba Data Demo
            </Button>
          </div>

          <p className="text-xs text-text-muted mt-4 font-medium">
            Bisa dipakai tanpa login. Cloud sync opsional.
          </p>
        </div>

        {/* Right decorative panel */}
        <div className="absolute right-8 bottom-6 hidden lg:flex flex-col gap-2">
          {[
            { label: 'HPP / Unit',   val: 'Rp 4.500',  cls: 'text-text-primary' },
            { label: 'Margin',       val: '35%',        cls: 'text-emerald-600' },
            { label: 'Harga Ideal',  val: 'Rp 8.000',  cls: 'text-brand-primary' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface border border-border/60 rounded-xl px-4 py-2.5 shadow-sm min-w-[140px]">
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-0.5">{stat.label}</div>
              <div className={`text-lg font-extrabold tabular-nums ${stat.cls}`}>{stat.val}</div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
};
