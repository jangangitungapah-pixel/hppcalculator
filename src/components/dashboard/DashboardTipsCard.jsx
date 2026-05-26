import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Sparkles, ChevronRight } from 'lucide-react';
import { FadeIn } from '../motion/FadeIn';
import { Button } from '../ui/Button';

export const DashboardTipsCard = ({ hasAnyData }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <FadeIn>
      <div className="dashboard-tip-card">
        <div className="dashboard-tip-icon">
          <Sparkles className="w-5 h-5" />
        </div>
        
        <div className="dashboard-tip-content">
          <h4 className="dashboard-tip-title">Tips Pemula</h4>
          <p className="dashboard-tip-message">
            {t('dashboard.beginnerTip')}
          </p>
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate(hasAnyData ? '/reports' : '/calculator')}
            className="dashboard-tip-action p-0 h-auto border-none inline-flex items-center text-xs font-bold text-brand-primary"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            {hasAnyData ? 'Lihat Laporan Bisnis' : 'Mulai Hitung HPP'}
          </Button>
        </div>
      </div>
    </FadeIn>
  );
};
