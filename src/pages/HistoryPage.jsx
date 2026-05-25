import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { History as HistoryIcon, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';

export const HistoryPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { settings, calculations, loadDemoData, deleteCalculation } = useAppData();
  const { addToast } = useToast();

  const [deleteId, setDeleteId] = useState(null);

  const handleLoadDemo = () => {
    loadDemoData();
    addToast({
      type: 'success',
      title: t('toasts.demoLoadedTitle'),
      message: t('toasts.demoLoadedMessage')
    });
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCalculation(deleteId);
      addToast({
        type: 'success',
        title: t('toasts.calculationDeletedTitle'),
        message: t('toasts.calculationDeletedMessage')
      });
      setDeleteId(null);
    }
  };

  return (
    <PageContainer>
      <div className="page-header">
        <h1 className="page-title">{t('history.title')}</h1>
        <p className="page-subtitle">{t('history.subtitle')}</p>
      </div>

      {calculations.length > 0 ? (
        <StaggerContainer className="data-list">
          {calculations.map((item) => (
            <FadeIn key={item.id}>
              <Card className="p-0 flex flex-col sm:flex-row sm:items-stretch overflow-hidden transition-all duration-300 hover:shadow-md border-border/50 group bg-surface">
                {/* Status Indicator Bar */}
                <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto ${item.result.profitStatus.key === 'loss' ? 'bg-status-loss' : item.result.profitStatus.key === 'low' ? 'bg-status-low' : item.result.profitStatus.key === 'okay' ? 'bg-status-okay' : 'bg-status-good'}`}></div>
                
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center cursor-pointer" onClick={() => navigate(`/history/${item.id}`)}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-text-primary group-hover:text-brand-primary transition-colors tracking-tight">{item.productName}</h3>
                    <Badge variant={item.result.profitStatus.key}>{t(`result.status.${item.result.profitStatus.key}`)}</Badge>
                    {item.source === 'demo' && (
                      <Badge variant="neutral" className="ml-1 text-[10px] py-0 px-1.5 uppercase font-bold tracking-wider opacity-60">{t('history.sourceDemo')}</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">HPP</span>
                      <span className="font-medium text-text-primary tabular-nums">{formatCurrency(item.result.hppPerUnit, lang, settings.currency)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Jual</span>
                      <span className="font-medium text-text-primary tabular-nums">{formatCurrency(item.result.sellingPrice, lang, settings.currency)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Untung</span>
                      <span className={`font-medium tabular-nums ${item.result.profitPerUnit < 0 ? 'text-status-loss' : 'text-status-good'}`}>{formatCurrency(item.result.profitPerUnit, lang, settings.currency)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Margin</span>
                      <span className="font-bold text-text-primary tabular-nums">{formatPercent(item.result.marginPercent, lang)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex sm:flex-col border-t sm:border-t-0 sm:border-l border-border/50 bg-surface-muted/30 w-full sm:w-20 shrink-0">
                  <button 
                    className="flex-1 sm:h-1/2 flex items-center justify-center text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 transition-colors"
                    onClick={() => navigate(`/history/${item.id}`)}
                    title={t('history.viewDetail')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </button>
                  <button 
                    className="flex-1 sm:h-1/2 flex items-center justify-center text-text-muted hover:text-status-loss hover:bg-status-lossBg transition-colors border-l sm:border-l-0 sm:border-t border-border/50"
                    onClick={() => setDeleteId(item.id)}
                    title={t('history.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </FadeIn>
          ))}
        </StaggerContainer>
      ) : (
        <EmptyState 
          icon={<HistoryIcon className="w-8 h-8" />}
          title={t('history.emptyTitle')}
          description={t('history.emptyBody')}
          action={
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('/calculator')}>
                {t('welcome.startCalculating')}
              </Button>
              <Button variant="secondary" onClick={handleLoadDemo}>
                {t('dashboard.loadDemoData')}
              </Button>
            </div>
          }
        />
      )}

      <ConfirmDialog 
        open={!!deleteId}
        title={t('history.deleteConfirmTitle')}
        description={t('history.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </PageContainer>
  );
};

