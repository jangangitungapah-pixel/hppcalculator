import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { LanguageSwitch } from '../components/ui/LanguageSwitch';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InstallAppCard } from '../components/pwa/InstallAppCard';
import { Database, Cloud, Trash2 } from 'lucide-react';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';

export const SettingsPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { settings, updateSettings, clearDraft, calculatorDraft, hasDemoData, clearDemoDataOnly } = useAppData();
  const { addToast } = useToast();
  
  const [showClearDraftConfirm, setShowClearDraftConfirm] = useState(false);
  const [showClearDemoConfirm, setShowClearDemoConfirm] = useState(false);

  const handleClearDemo = () => {
    clearDemoDataOnly();
    setShowClearDemoConfirm(false);
    addToast({
      type: 'success',
      title: t('toasts.demoClearedToast')
    });
  };

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
      <div className="page-header">
        <h1 className="page-title">{t('settings.title')}</h1>
      </div>

      <StaggerContainer className="content-stack">
        <FadeIn>
          <InstallAppCard />
        </FadeIn>

        <FadeIn>
          <Card className="p-6 transition-premium hover:shadow-floating border-brand-soft/50">
            <h2 className="text-lg font-bold mb-4 text-text-primary">{t('settings.language')}</h2>
            <LanguageSwitch />
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="p-6 transition-premium hover:shadow-floating border-brand-soft/50">
            <h2 className="text-lg font-bold mb-4 text-text-primary">{lang === 'en' ? 'Calculator Settings' : 'Pengaturan Kalkulator'}</h2>
            
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
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="p-6 transition-premium hover:shadow-floating border-brand-soft/50">
            <h2 className="text-lg font-bold mb-4 text-text-primary">{lang === 'en' ? 'Data Management' : 'Kelola Data'}</h2>
            <div className="flex flex-col gap-4">
              <Button 
                variant="secondary" 
                disabled={!calculatorDraft}
                onClick={() => setShowClearDraftConfirm(true)}
              >
                {t('settings.clearDraft')}
              </Button>
              
              {hasDemoData() && (
                <div className="flex">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 text-status-loss hover:bg-status-loss/5"
                    onClick={() => setShowClearDemoConfirm(true)}
                    leftIcon={<Trash2 size={16} />}
                  >
                    {t('settings.clearDemoData')}
                  </Button>
                </div>
              )}
              
              <div className="border-t pt-4 mt-2 flex">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/data-backup')}
                  leftIcon={<Database size={16} />}
                >
                  {t('settings.manageDataBackup', 'Kelola Data & Backup')}
                </Button>
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="p-6 transition-premium hover:shadow-floating border-brand-soft/50">
            <h2 className="text-lg font-bold mb-4 text-text-primary">Cloud Sync & Akun</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/sync')}
                  leftIcon={<Cloud size={16} />}
                >
                  Buka Pusat Sinkronisasi
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/account')}
                >
                  Kelola Akun & Profil Bisnis
                </Button>
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn>
          <Alert type="info">
            {t('settings.localStorageNote')}
          </Alert>
        </FadeIn>

      </StaggerContainer>

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

      <ConfirmDialog 
        open={showClearDemoConfirm}
        title={t('settings.clearDemoDataConfirmTitle')}
        description={t('settings.clearDemoDataConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={handleClearDemo}
        onCancel={() => setShowClearDemoConfirm(false)}
      />
    </PageContainer>
  );
};
