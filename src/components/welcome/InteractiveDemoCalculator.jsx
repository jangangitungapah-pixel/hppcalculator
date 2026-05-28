import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { Calculator, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const InteractiveDemoCalculator = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // State values for demo inputs
  const [productName, setProductName] = useState('Es Kopi Susu Aren');
  const [ingredientCost, setIngredientCost] = useState(4500);
  const [packagingCost, setPackagingCost] = useState(1500);
  const [operationalCost, setOperationalCost] = useState(1000);
  const [sellingPrice, setSellingPrice] = useState(15000);

  // Reference to keep track of previous profitability status to trigger confetti only when transitioning into good status
  const prevStatusRef = useRef(null);

  // Derived calculation values
  const totalHpp = Number(ingredientCost || 0) + Number(packagingCost || 0) + Number(operationalCost || 0);
  const profitPerUnit = Number(sellingPrice || 0) - totalHpp;
  const profitMargin = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0;

  // Determine status category and badge styling
  let status = 'neutral';
  let statusColor = 'text-text-muted bg-surface-muted border-border';
  let statusLabel = 'N/A';
  let statusDescription = '';
  let statusIcon = null;

  if (sellingPrice > 0) {
    if (profitMargin <= 0) {
      status = 'loss';
      statusColor = 'text-status-loss bg-status-lossBg border-status-loss/20';
      statusLabel = t('result.summaryLoss');
      statusDescription = t('result.summaryLoss');
      statusIcon = <AlertTriangle className="w-4 h-4 text-status-loss shrink-0" />;
    } else if (profitMargin < 25) {
      status = 'low';
      statusColor = 'text-status-low bg-status-lowBg border-status-low/20';
      statusLabel = t('result.summaryLow');
      statusDescription = t('result.summaryLow');
      statusIcon = <AlertTriangle className="w-4 h-4 text-status-low shrink-0" />;
    } else {
      status = 'good';
      statusColor = 'text-status-good bg-status-goodBg border-status-good/20 shadow-glow-success/10';
      statusLabel = t('result.summaryGood');
      statusDescription = t('result.summaryGood');
      statusIcon = <ShieldCheck className="w-4 h-4 text-status-good shrink-0" />;
    }
  }

  // Trigger celebration confetti when profit margin transitions into healthy state (> 25%)
  useEffect(() => {
    if (prevStatusRef.current && status === 'good' && prevStatusRef.current !== 'good') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF6A00', '#00A650', '#2EBF91', '#F5A623']
      });
      addToast({
        type: 'success',
        title: t('toasts.sentToCalculator', 'Laba Sehat Ditemukan!'),
        message: `${profitMargin.toFixed(1)}% margin keuntungan. Sangat bagus!`
      });
    }
    prevStatusRef.current = status;
  }, [status, profitMargin, addToast, t]);

  // Navigate to full calculator with prefilled form
  const handleOpenInFullCalculator = () => {
    const formValue = {
      productName: productName || 'Es Kopi Susu Aren',
      costItems: [
        { id: '1', name: t('calculator.costDefaultIngredients', 'Biaya Bahan'), category: 'Bahan', amount: String(ingredientCost || 0) },
        { id: '2', name: t('calculator.costDefaultPackaging', 'Biaya Kemasan'), category: 'Kemasan', amount: String(packagingCost || 0) },
        { id: '3', name: t('calculator.costDefaultLabor', 'Biaya Tenaga Kerja'), category: 'Tenaga Kerja', amount: '0' },
        { id: '4', name: t('calculator.costDefaultOperational', 'Biaya Operasional'), category: 'Operasional', amount: String(operationalCost || 0) },
      ],
      outputQuantity: '1',
      failedQuantity: '0',
      sellingUnit: 'pcs',
      sellingPrice: String(sellingPrice || 0)
    };

    // Redirect to calculator with hydration state
    navigate('/calculator', { state: { useAgainForm: formValue } });
  };

  // Safe formatting helper
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-surface-glass border border-white/40 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-floating relative overflow-hidden flex flex-col gap-5 w-full">
      {/* Decorative Top Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-primary/10 rounded-full blur-xl pointer-events-none"></div>
      
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-soft text-brand-primary rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-text-primary tracking-tight">{t('welcome.demoTitle')}</h4>
            <p className="text-[10px] text-text-secondary mt-0.5">{t('welcome.demoSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-3">
        {/* Row 1: Product Name */}
        <div>
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">
            {t('welcome.demoProdName')}
          </label>
          <input
            type="text"
            className="w-full text-xs font-bold text-text-primary bg-surface/50 border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl px-3 py-2 transition-all"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Cth: Es Kopi Susu Aren"
          />
        </div>

        {/* Row 2: Costs split */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block truncate">
              {t('calculator.costDefaultIngredients')}
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full text-xs font-bold text-text-primary bg-surface/50 border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl pl-2 pr-1 py-2 transition-all"
                value={ingredientCost || ''}
                onChange={(e) => setIngredientCost(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block truncate">
              {t('calculator.costDefaultPackaging')}
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full text-xs font-bold text-text-primary bg-surface/50 border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl pl-2 pr-1 py-2 transition-all"
                value={packagingCost || ''}
                onChange={(e) => setPackagingCost(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block truncate">
              {t('calculator.costDefaultOperational')}
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full text-xs font-bold text-text-primary bg-surface/50 border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl pl-2 pr-1 py-2 transition-all"
                value={operationalCost || ''}
                onChange={(e) => setOperationalCost(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Target Selling Price */}
        <div>
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">
            {t('welcome.demoTargetPrice')}
          </label>
          <input
            type="number"
            className="w-full text-xs font-bold text-text-primary bg-surface/50 border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl px-3 py-2 transition-all"
            value={sellingPrice || ''}
            onChange={(e) => setSellingPrice(Math.max(0, parseInt(e.target.value) || 0))}
          />
        </div>
      </div>

      {/* Output Results */}
      <div className="bg-surface/80 rounded-2xl p-4 border border-border/50 flex flex-col gap-4 mt-1">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/30">
          <div>
            <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mb-0.5">{t('welcome.demoHppLabel')}</p>
            <p className="text-sm font-black text-text-primary transition-all">{formatRupiah(totalHpp)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mb-0.5">{t('welcome.demoProfitLabel')}</p>
            <p className={`text-sm font-black transition-all ${profitPerUnit < 0 ? 'text-status-loss' : 'text-brand-primary'}`}>
              {formatRupiah(profitPerUnit)}
            </p>
          </div>
        </div>

        {/* Margin Meter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">{t('welcome.demoMarginLabel')}</p>
            <p className={`text-xs font-black ${profitPerUnit < 0 ? 'text-status-loss' : 'text-brand-primary'}`}>
              {profitMargin.toFixed(1)}%
            </p>
          </div>
          <div className="demo-calc-gauge-container">
            <div 
              className={`demo-calc-gauge-fill ${
                profitMargin <= 0 
                  ? 'bg-status-loss' 
                  : profitMargin < 25 
                    ? 'bg-status-low' 
                    : profitMargin < 40 
                      ? 'bg-status-okay' 
                      : 'bg-status-good'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, profitMargin))}%` }}
            ></div>
          </div>
        </div>

        {/* Status Indicator */}
        {sellingPrice > 0 && (
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-[10px] font-bold leading-tight transition-all duration-300 ${statusColor}`}>
            {statusIcon}
            <span>
              {status === 'loss' && (t('result.summaryLoss') || 'Harga jual di bawah HPP! Berpotensi rugi.')}
              {status === 'low' && (t('result.summaryLow') || 'Margin tipis. Harap pantau biaya tambahan.')}
              {status === 'good' && (t('result.summaryGood') || 'Margin sehat dan aman untuk operasional UMKM.')}
            </span>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={handleOpenInFullCalculator}
          aria-label={t('welcome.demoSaveDraft')}
          className="instant-calculator-primary-cta"
        >
          <span>{t('welcome.demoSaveDraft')}</span>
          <ArrowRight className="instant-calculator-primary-cta-icon shrink-0" />
        </button>
        <p className="instant-calculator-hint">
          {t('welcome.demoOpenHint')}
        </p>
      </div>
    </div>
  );
};
