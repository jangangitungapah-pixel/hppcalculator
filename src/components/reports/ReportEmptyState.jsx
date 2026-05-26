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
    <Card className="p-8 border-dashed border-2 border-border flex flex-col items-center justify-center text-center bg-surface-muted/30">
      <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center text-brand-primary mb-4">
        <BarChart3 className="w-8 h-8" />
      </div>
      
      <h2 className="text-xl font-bold text-text-primary mb-2">
        {t('reports.emptyTitle')}
      </h2>
      
      <p className="text-text-secondary text-sm max-w-sm mb-6">
        {t('reports.emptyBody')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          onClick={() => navigate('/calculator')}
          leftIcon={<Calculator className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          {t('dashboard.startCalculating')}
        </Button>
        
        {onLoadDemo && (
          <Button
            variant="outline"
            onClick={onLoadDemo}
            leftIcon={<Download className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {t('dashboard.loadDemoData')}
          </Button>
        )}
      </div>
    </Card>
  );
};
