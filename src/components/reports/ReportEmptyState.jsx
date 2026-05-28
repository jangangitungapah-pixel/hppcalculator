import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart3, Calculator, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReportEmptyState = ({ onLoadDemo }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="report-empty-state">
      <div className="report-empty-icon" aria-hidden="true">
        <BarChart3 className="w-8 h-8" />
      </div>
      
      <h2 className="report-empty-title">
        {t('reports.emptyTitle')}
      </h2>
      
      <p className="report-empty-copy">
        {t('reports.emptyBody')}
      </p>
      
      <div className="report-empty-actions">
        <Button
          type="button"
          onClick={() => navigate('/calculator')}
          leftIcon={<Calculator className="w-4 h-4" />}
          className="report-empty-action"
        >
          {t('dashboard.startCalculating')}
        </Button>
        
        {onLoadDemo && (
          <Button
            type="button"
            variant="outline"
            onClick={onLoadDemo}
            leftIcon={<Download className="w-4 h-4" />}
            className="report-empty-action"
          >
            {t('dashboard.loadDemoData')}
          </Button>
        )}
      </div>
    </Card>
  );
};
