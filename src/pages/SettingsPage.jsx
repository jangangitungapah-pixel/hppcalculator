import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { LanguageSwitch } from '../components/ui/LanguageSwitch';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';

export const SettingsPage = () => {
  const { t } = useLanguage();
  const { settings, updateSettings, clearDraft, calculatorDraft } = useAppData();
  const { addToast } = useToast();
  
  const [showClearDraftConfirm, setShowClearDraftConfirm] = useState(false);

  const handleRoundingChange = (e) => {
    updateSettings({ roundingStep: parseInt(e.target.value, 10) });
    addToast({
      type: 'success',
      title: t('toasts.settingsUpdatedTitle')
    });
  };

  const handleClearDraft = () => {
    clearDraft();
    setShowClearDraftConfirm(false);
    addToast({
      type: 'info',
      title: t('toasts.draftClearedTitle')
    });
  };

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">{t('settings.title')}</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 text-text-primary">{t('settings.language')}</h2>
          <LanguageSwitch />
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 text-text-primary">Pengaturan Kalkulator</h2>
          
          <div className="flex flex-col gap-4">
            <Select 
              label={t('settings.currency')}
              options={[
                { value: 'IDR', label: 'Rupiah (Rp)' },
              ]}
              value={settings.currency || 'IDR'}
              disabled
              helperText="Currency lain akan ditambahkan nanti"
            />
            
            <Select 
              label={t('settings.roundingStep')}
              options={[
                { value: '500', label: t('settings.rounding500') },
                { value: '1000', label: t('settings.rounding1000') },
                { value: '5000', label: t('settings.rounding5000') },
              ]}
              value={String(settings.roundingStep || 500)}
              onChange={handleRoundingChange}
            />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 text-text-primary">Data</h2>
          <div className="flex flex-col gap-4">
            <Button 
              variant="secondary" 
              disabled={!calculatorDraft}
              onClick={() => setShowClearDraftConfirm(true)}
            >
              {t('settings.clearDraft')}
            </Button>
            <div className="flex flex-col gap-2 opacity-50 pointer-events-none">
              <Button variant="secondary">{t('settings.exportDataFuture')}</Button>
              <Button variant="secondary">{t('settings.importDataFuture')}</Button>
              <Button variant="destructive">{t('settings.deleteAllData')}</Button>
            </div>
          </div>
        </div>

        <Alert type="info">
          {t('settings.localStorageNote')}
        </Alert>

      </div>

      <ConfirmDialog 
        open={showClearDraftConfirm}
        title={t('settings.clearDraftConfirmTitle')}
        description={t('settings.clearDraftConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={handleClearDraft}
        onCancel={() => setShowClearDraftConfirm(false)}
      />
    </PageContainer>
  );
};
