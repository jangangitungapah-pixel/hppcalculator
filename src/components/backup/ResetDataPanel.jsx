import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';
import { useToast } from '../../hooks/useToast';
import { Card } from '../ui/Card';
import { Trash2, AlertOctagon } from 'lucide-react';
import { ResetModuleCard } from './ResetModuleCard';
import { StrongConfirmDialog } from './StrongConfirmDialog';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Button } from '../ui/Button';

export const ResetDataPanel = ({ modules, onResetModule, onResetAll, onResetDraft }) => {
  const { t } = useLanguage();
  const { hasDemoData, clearDemoDataOnly } = useAppData();
  const { addToast } = useToast();
  
  const [strongConfirmOpen, setStrongConfirmOpen] = useState(false);
  const [moduleConfirmOpen, setModuleConfirmOpen] = useState(false);
  const [moduleToReset, setModuleToReset] = useState(null);
  const [demoConfirmOpen, setDemoConfirmOpen] = useState(false);

  const confirmResetModule = (moduleName) => {
    setModuleToReset(moduleName);
    setModuleConfirmOpen(true);
  };

  const handleModuleConfirm = () => {
    if (moduleToReset === 'draft') {
      onResetDraft();
    } else if (moduleToReset) {
      onResetModule(moduleToReset);
    }
    setModuleConfirmOpen(false);
    setModuleToReset(null);
  };

  return (
    <>
      {hasDemoData() && (
        <Card className="p-5 sm:p-6 border-amber-500/15 bg-amber-500/5 mb-6 rounded-3xl shadow-xs">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="p-2 bg-amber-500/15 text-amber-600 rounded-xl shrink-0 flex items-center justify-center">
              <AlertOctagon className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-amber-850">
                {t('settings.clearDemoData')}
              </h3>
              <p className="text-xs font-semibold text-amber-800/80 mt-1 leading-relaxed">
                {t('settings.clearDemoDataConfirmBody')}
              </p>
            </div>
          </div>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 px-4 bg-red-500/10 hover:bg-red-500/15 text-red-750 border border-red-500/10 rounded-xl text-xs font-bold transition-all"
              onClick={() => setDemoConfirmOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5 mr-1" />}
            >
              {t('settings.clearDemoData')}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-5 sm:p-6 border-red-500/15 bg-red-500/[0.01] rounded-3xl shadow-xs">
        <div className="flex items-center gap-3.5 mb-6 pb-3 border-b border-border-soft">
          <div className="p-2 bg-red-500/10 text-red-600 rounded-xl shrink-0 flex items-center justify-center">
            <Trash2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-red-600">
              {t('dataBackup.dangerZone', 'Danger Zone')}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-0.5 leading-relaxed">
              {t('dataBackup.resetDataDesc', 'Hapus data secara permanen dari perangkat ini.')}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <ResetModuleCard 
            title={t('dataBackup.resetDraft', 'Hapus Draft Kalkulator')} 
            description={t('dataBackup.resetDraftDesc', 'Menghapus data sementara di Quick Calculator.')} 
            onReset={() => confirmResetModule('draft')} 
          />
          <ResetModuleCard 
            title={t('dataBackup.resetProducts', 'Hapus Semua Produk')} 
            description={t('dataBackup.resetProductsDesc', 'Menghapus semua produk/menu dan simulasinya.')} 
            onReset={() => confirmResetModule('products')} 
          />
          <ResetModuleCard 
            title={t('dataBackup.resetRecipes', 'Hapus Semua Resep & Bahan')} 
            description={t('dataBackup.resetRecipesDesc', 'Menghapus data resep dan daftar bahan baku.')} 
            onReset={() => {
              confirmResetModule('recipes');
            }} 
          />
          <ResetModuleCard 
            title={t('dataBackup.resetSimulations', 'Hapus Semua Simulasi')} 
            description={t('dataBackup.resetSimulationsDesc', 'Menghapus simulasi channel, diskon, dan bundle.')} 
            onReset={() => confirmResetModule('pricingSimulations')} 
          />
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4.5">
          <div className="flex items-start gap-3.5 mb-4">
            <AlertOctagon className="w-5.5 h-5.5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm text-red-850">{t('dataBackup.resetAllBusinessData', 'Hapus Semua Data Bisnis')}</h4>
              <p className="text-xs font-semibold text-red-750 mt-1 leading-relaxed">
                {t('dataBackup.resetAllWarning', 'Tindakan ini akan MENGHAPUS SEMUA data kalkulasi, resep, produk, bahan, dan simulasi dari perangkat ini secara permanen. Pengaturan tidak akan terhapus.')}
              </p>
            </div>
          </div>
          <Button 
            variant="danger" 
            size="md"
            fullWidth
            onClick={() => setStrongConfirmOpen(true)}
            className="h-11 text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-red-500/10 transition-all"
            leftIcon={<Trash2 className="w-4 h-4 mr-1.5" />}
          >
            {t('dataBackup.resetAllData', 'HAPUS SEMUA DATA')}
          </Button>
        </div>
      </Card>

      <StrongConfirmDialog 
        open={strongConfirmOpen}
        title={t('dataBackup.resetAllBusinessData', 'Hapus Semua Data Bisnis')}
        description={t('dataBackup.resetAllWarning', 'Tindakan ini permanen dan tidak dapat dibatalkan.')}
        requiredText="HAPUS"
        onConfirm={() => {
          onResetAll();
          setStrongConfirmOpen(false);
        }}
        onCancel={() => setStrongConfirmOpen(false)}
      />

      <ConfirmDialog 
        open={moduleConfirmOpen}
        title={t('dataBackup.resetModuleTitle', 'Konfirmasi Hapus Modul')}
        description={t('dataBackup.resetModuleWarning', 'Apakah Anda yakin ingin menghapus data modul ini? Tindakan ini tidak dapat dibatalkan.')}
        confirmLabel={t('delete', 'Hapus')}
        cancelLabel={t('cancel', 'Batal')}
        onConfirm={handleModuleConfirm}
        onCancel={() => setModuleConfirmOpen(false)}
      />

      <ConfirmDialog 
        open={demoConfirmOpen}
        title={t('settings.clearDemoDataConfirmTitle')}
        description={t('settings.clearDemoDataConfirmBody')}
        confirmLabel={t('delete', 'Hapus')}
        cancelLabel={t('cancel', 'Batal')}
        onConfirm={() => {
          clearDemoDataOnly();
          addToast({ type: 'success', title: t('toasts.demoClearedToast') });
          setDemoConfirmOpen(false);
        }}
        onCancel={() => setDemoConfirmOpen(false)}
      />
    </>
  );
};
