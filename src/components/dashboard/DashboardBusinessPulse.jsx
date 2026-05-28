import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../motion/FadeIn';

export const DashboardBusinessPulse = ({ summary }) => {
  const navigate = useNavigate();
  if (!summary) return null;

  const total = (summary.healthyCount || 0) + (summary.lowCount || 0) + (summary.lossCount || 0);
  const hp = total > 0 ? (summary.healthyCount / total) * 100 : 0;
  const lp = total > 0 ? (summary.lowCount / total) * 100 : 0;
  const lsp = total > 0 ? (summary.lossCount / total) * 100 : 0;

  const overallHealth =
    summary.lossCount > 0 ? { label: 'Perlu Perhatian', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' } :
    summary.averageMargin >= 25 ? { label: 'Bisnis Sehat', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' } :
    { label: 'Perlu Ditingkatkan', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };

  return (
    <FadeIn>
      <div className={`rounded-2xl border p-5 mb-6 ${overallHealth.bg} ${overallHealth.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Business Pulse</div>
            <div className={`text-base font-bold ${overallHealth.color}`}>{overallHealth.label}</div>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs font-bold text-brand-primary hover:underline"
          >
            Laporan Detail →
          </button>
        </div>

        {/* Segmented bar */}
        <div className="h-3 rounded-full overflow-hidden flex gap-0.5 mb-4">
          {hp > 0 && <div className="bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${hp}%` }} />}
          {lp > 0 && <div className="bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${lp}%` }} />}
          {lsp > 0 && <div className="bg-red-500 rounded-full transition-all duration-700" style={{ width: `${lsp}%` }} />}
          {total === 0 && <div className="w-full bg-border-soft rounded-full" />}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {[
            { dot: 'bg-emerald-500', label: 'Sehat', count: summary.healthyCount || 0, pct: hp },
            { dot: 'bg-amber-400', label: 'Tipis', count: summary.lowCount || 0, pct: lp },
            { dot: 'bg-red-500', label: 'Rugi', count: summary.lossCount || 0, pct: lsp },
          ].map(seg => (
            <div key={seg.label} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className={`w-2 h-2 rounded-full ${seg.dot}`} />
              <span className="font-medium">{seg.label}</span>
              <span className="font-bold text-text-primary">{seg.count}</span>
              <span className="text-text-muted">({Math.round(seg.pct)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
};
