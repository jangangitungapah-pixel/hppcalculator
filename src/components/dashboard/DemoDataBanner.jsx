import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';
import { useToast } from '../../hooks/useToast';
import { Info, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export const DemoDataBanner = () => {
  const { t } = useLanguage();
  const { hasDemoData, clearDemoDataOnly } = useAppData();
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!hasDemoData()) return null;

  const handleClearDemo = () => {
    clearDemoDataOnly();
    setShowConfirm(false);
    addToast({
      type: 'success',
      title: t('toasts.demoClearedToast')
    });
  };

  return (
    <>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white rounded-full text-amber-600 shrink-0">
            <Info size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-800 mb-1">
              {t('settings.clearDemoDataConfirmTitle')}
            </h4>
            <p className="text-sm text-text-secondary">
              {t('settings.clearDemoDataConfirmBody')}
            </p>
          </div>
          <div className="shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-200 text-status-loss hover:bg-status-loss/5"
              onClick={() => setShowConfirm(true)}
              leftIcon={<Trash2 size={16} />}
            >
              {t('settings.clearDemoData')}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        open={showConfirm}
        title={t('settings.clearDemoDataConfirmTitle')}
        description={t('settings.clearDemoDataConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={handleClearDemo}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
