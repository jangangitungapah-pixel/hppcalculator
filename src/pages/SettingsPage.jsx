import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { PageContainer } from '../components/layout/PageContainer';
import { LanguageSwitch } from '../components/ui/LanguageSwitch';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';

export const SettingsPage = () => {
  const { t } = useLanguage();

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
              value="IDR"
              disabled
            />
            
            <Select 
              label={t('settings.roundingStep')}
              options={[
                { value: '100', label: '100' },
                { value: '500', label: '500' },
                { value: '1000', label: '1.000' },
              ]}
              value="500"
              disabled
            />
          </div>
        </div>

        <Alert type="info">
          {t('settings.persistenceNote')}
        </Alert>

      </div>
    </PageContainer>
  );
};
