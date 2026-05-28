import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Plus } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';

export const ReportSectionEmptyState = ({ title, description, actionRoute = '/calculator', actionLabel }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="report-section-empty" role="status">
      <div className="report-section-empty-icon" aria-hidden="true">
        <BarChart3 className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h3 className="report-section-empty-title">{title}</h3>
        <p className="report-section-empty-copy">{description}</p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => navigate(actionRoute)}
        leftIcon={<Plus className="w-4 h-4" />}
        className="report-section-empty-action"
      >
        {actionLabel || t('dashboard.startCalculating')}
      </Button>
    </div>
  );
};
