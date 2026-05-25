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
        <div className="data-list">
          {calculations.map((item) => (
            <Card key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/history/${item.id}`)}>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-text-primary hover:text-brand-primary transition-colors">{item.productName}</h3>
                  <Badge variant={item.result.profitStatus.key}>{t(`result.status.${item.result.profitStatus.key}`)}</Badge>
                  {item.source === 'demo' && (
                    <Badge variant="neutral" className="ml-2 text-[10px] py-0 px-1.5">{t('history.sourceDemo')}</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-text-secondary mt-2 max-w-sm">
                  <span>HPP: {formatCurrency(item.result.hppPerUnit, lang, settings.currency)}</span>
                  <span>Jual: {formatCurrency(item.result.sellingPrice, lang, settings.currency)}</span>
                  <span>Untung: {formatCurrency(item.result.profitPerUnit, lang, settings.currency)}</span>
                  <span>Margin: {formatPercent(item.result.marginPercent, lang)}</span>
                </div>
              </div>
              
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  className="flex-1 sm:flex-none"
                  onClick={() => navigate(`/history/${item.id}`)}
                >
                  {t('history.viewDetail')}
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 sm:flex-none text-status-loss hover:bg-status-lossBg border border-transparent hover:border-status-loss/20"
                  onClick={() => setDeleteId(item.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('history.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
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

