import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { Card } from '../ui/Card';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

export const PricingResultSummary = ({ result, showRecommended = true, error = null }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex gap-2 items-start text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="p-8 text-center bg-gray-50 border-gray-100 border-dashed rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6 text-text-tertiary" />
        </div>
        <p className="text-sm text-text-tertiary">Masukkan data harga & HPP untuk melihat hasil simulasi</p>
      </Card>
    );
  }

  const isLoss = result.profit < 0;
  const status = result.status || (isLoss ? 'loss' : result.marginPercent < 25 ? 'low' : 'good');
  
  let heroClass = 'profit-good';
  let badgeClass = 'status-good';
  let badgeText = 'Sehat';
  let barColor = 'bg-status-good';

  if (status === 'loss') {
    heroClass = 'profit-loss';
    badgeClass = 'status-loss';
    badgeText = 'Rugi';
    barColor = 'bg-status-loss';
  } else if (status === 'low') {
    heroClass = 'profit-low';
    badgeClass = 'status-low';
    badgeText = 'Rendah';
    barColor = 'bg-status-low';
  }

  // Cap margin percent for the visual progress bar between 0 and 100
  const visualMarginPercent = Math.max(0, Math.min(100, result.marginPercent || 0));

  // Short recommendations based on margin
  let recommendationText = '';
  if (status === 'loss') {
    recommendationText = 'Harga jual di bawah modal! Naikkan harga jual atau kurangi biaya platform.';
  } else if (status === 'low') {
    recommendationText = 'Margin tipis. Coba naikkan harga sedikit ke target margin ideal (minimal 30%).';
  } else {
    recommendationText = 'Margin sehat! Harga jual ini aman dan profitabel untuk dijalankan.';
  }

  return (
    <div className="space-y-4">
      {/* Result Hero */}
      <div className={`pricing-result-hero ${heroClass}`}>
        <div className="text-xs font-semibold opacity-85 uppercase tracking-wider mb-1">
          Profit Bersih {result.quantity > 1 ? `(${result.quantity} unit)` : ''}
        </div>
        <div className="text-3xl font-extrabold tracking-tight mb-2">
          {formatCurrency(result.profit, lang, currency)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className={`pricing-status-badge ${badgeClass}`}>
            {badgeText}
          </span>
          <span className="text-sm font-bold">
            Margin {formatPercent(result.marginPercent, lang)}
          </span>
        </div>
      </div>

      {/* Margin Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-text-secondary mb-1">
          <span>Margin Margin</span>
          <span>{formatPercent(result.marginPercent, lang)}</span>
        </div>
        <div className="pricing-margin-bar">
          <div 
            className={`pricing-margin-bar-fill ${barColor}`} 
            style={{ width: `${visualMarginPercent}%` }}
          />
        </div>
      </div>

      {/* Metrics List */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 mt-2">
        <div className="pricing-result-metric">
          <span className="text-xs text-text-secondary">Harga Jual Kotor</span>
          <span className="text-sm font-semibold text-text-primary">
            {formatCurrency(result.grossRevenue || 0, lang, currency)}
          </span>
        </div>
        <div className="pricing-result-metric">
          <span className="text-xs text-text-secondary">Total HPP Produk</span>
          <span className="text-sm font-medium text-text-secondary">
            {formatCurrency(result.totalHpp || 0, lang, currency)}
          </span>
        </div>
        {result.totalFees !== undefined && (
          <div className="pricing-result-metric">
            <span className="text-xs text-text-secondary">Total Potongan Channel</span>
            <span className="text-sm font-medium text-text-secondary">
              {formatCurrency(result.totalFees, lang, currency)}
            </span>
          </div>
        )}
        {result.totalAdditionalPackaging !== undefined && result.totalAdditionalPackaging > 0 && (
          <div className="pricing-result-metric">
            <span className="text-xs text-text-secondary">Biaya Kemasan Tambahan</span>
            <span className="text-sm font-medium text-text-secondary">
              {formatCurrency(result.totalAdditionalPackaging, lang, currency)}
            </span>
          </div>
        )}
        <div className="pricing-result-metric pt-3 mt-1 border-t border-zinc-200">
          <span className="text-xs font-bold text-text-primary">Pendapatan Bersih</span>
          <span className="text-sm font-extrabold text-brand-primary">
            {formatCurrency(result.netRevenue || 0, lang, currency)}
          </span>
        </div>
      </div>

      {/* Recommendation Section */}
      <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs text-text-secondary flex gap-2 items-start">
        <CheckCircle className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${isLoss ? 'text-status-loss' : status === 'low' ? 'text-status-low' : 'text-status-good'}`} />
        <span>{recommendationText}</span>
      </div>

      {/* Recommended Price (Target Margin) */}
      {showRecommended && result.recommendedPrice && (
        <div className="p-3 bg-brand-soft rounded-xl border border-brand-primary/20 flex justify-between items-center text-xs">
          <span className="font-semibold text-brand-primary">{t('pricing.recommendedPrice')}</span>
          <span className="font-bold text-brand-primary text-sm">{formatCurrency(result.recommendedPrice, lang, currency)}</span>
        </div>
      )}
    </div>
  );
};
