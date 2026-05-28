import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';

const SEVERITY_STYLES = {
  danger:  { border: 'border-red-200 bg-red-50',    icon: 'bg-red-100 text-red-600',     Icon: AlertTriangle },
  warning: { border: 'border-amber-200 bg-amber-50', icon: 'bg-amber-100 text-amber-600',  Icon: AlertTriangle },
  success: { border: 'border-emerald-200 bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', Icon: CheckCircle2 },
  info:    { border: 'border-blue-200 bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   Icon: Info },
};

export const DashboardRecommendations = ({ recommendations }) => {
  const navigate = useNavigate();
  const recs = recommendations || [];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">Rekomendasi</h2>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      {recs.length === 0 ? (
        <FadeIn>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-800">Keadaan Aman</div>
              <div className="text-xs text-emerald-600 mt-0.5">Belum ada rekomendasi penting. Bisnis terlihat aman.</div>
            </div>
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="space-y-2">
          {recs.slice(0, 3).map((rec) => {
            const severity = rec.severity || 'warning';
            const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES.warning;
            const { Icon } = s;
            return (
              <FadeIn key={rec.id}>
                <div className={`flex items-start gap-3 border rounded-2xl px-4 py-3.5 ${s.border}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${s.icon}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text-primary">{rec.titleId || rec.titleEn}</div>
                    <div className="text-xs text-text-secondary mt-0.5 leading-relaxed">{rec.messageId || rec.messageEn}</div>
                    <button
                      className="mt-1.5 text-xs font-bold text-brand-primary hover:underline flex items-center gap-0.5"
                      onClick={() => navigate(rec.actionRoute || '/reports')}
                    >
                      {rec.actionLabelId || 'Lihat Detail'} <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
};
