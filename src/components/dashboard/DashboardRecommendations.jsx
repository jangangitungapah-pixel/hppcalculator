import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { AlertTriangle, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';

export const DashboardRecommendations = ({ recommendations }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const recs = recommendations || [];

  return (
    <div className="dashboard-recommendations">
      <div className="dashboard-section-header">
        <div>
          <h2 className="dashboard-section-header-title">Rekomendasi Bisnis</h2>
          <p className="dashboard-section-header-subtitle">Insight otomatis untuk optimasi profit menu Anda</p>
        </div>
      </div>

      {recs.length === 0 ? (
        <FadeIn>
          <div className="recommendation-preview-card success">
            <div className="recommendation-severity-icon success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="recommendation-preview-content">
              <h4 className="recommendation-preview-title">Keadaan Aman</h4>
              <p className="recommendation-preview-message">
                Belum ada rekomendasi penting. Data terlihat aman sejauh ini.
              </p>
            </div>
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recs.slice(0, 2).map((rec) => {
            const severity = rec.severity || 'warning'; // danger, warning, success, info
            
            // Map severity to icon
            let Icon = AlertTriangle;
            if (severity === 'danger') Icon = AlertTriangle;
            else if (severity === 'success') Icon = CheckCircle2;
            else if (severity === 'info') Icon = Info;

            return (
              <FadeIn key={rec.id}>
                <div className={`recommendation-preview-card ${severity}`}>
                  <div className={`recommendation-severity-icon ${severity}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="recommendation-preview-content">
                    <h4 className="recommendation-preview-title">
                      {rec.titleId || rec.titleEn}
                    </h4>
                    <p className="recommendation-preview-message">
                      {rec.messageId || rec.messageEn}
                    </p>
                    <button 
                      className="recommendation-preview-action"
                      onClick={() => navigate(rec.actionRoute || '/reports')}
                    >
                      {rec.actionLabelId || 'Lihat Detail'} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
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
