import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Trash2, AlertOctagon } from 'lucide-react';
import { ResetModuleCard } from './ResetModuleCard';
import { StrongConfirmDialog } from './StrongConfirmDialog';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export const ResetDataPanel = ({ modules, onResetModule, onResetAll, onResetDraft }) => {
  const { t } = useLanguage();
  
  const [strongConfirmOpen, setStrongConfirmOpen] = useState(false);
  
  const [moduleConfirmOpen, setModuleConfirmOpen] = useState(false);
  const [moduleToReset, setModuleToReset] = useState(null);

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
    <Card className="p-6 border-red-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <Trash2 size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-red-600">
            {t('dangerZone', 'Danger Zone')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('resetDataDesc', 'Hapus data secara permanen dari perangkat ini.')}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <ResetModuleCard 
          title={t('resetDraft', 'Hapus Draft Kalkulator')} 
          description={t('resetDraftDesc', 'Menghapus data sementara di Quick Calculator.')} 
          onReset={() => confirmResetModule('draft')} 
        />
        <ResetModuleCard 
          title={t('resetProducts', 'Hapus Semua Produk')} 
          description={t('resetProductsDesc', 'Menghapus semua produk/menu dan simulasinya.')} 
          onReset={() => confirmResetModule('products')} 
        />
        <ResetModuleCard 
          title={t('resetRecipes', 'Hapus Semua Resep & Bahan')} 
          description={t('resetRecipesDesc', 'Menghapus data resep dan daftar bahan baku.')} 
          onReset={() => {
            confirmResetModule('recipes');
            // We should ideally reset ingredients too or warn. For now, just recipes as an example.
          }} 
        />
        <ResetModuleCard 
          title={t('resetSimulations', 'Hapus Semua Simulasi')} 
          description={t('resetSimulationsDesc', 'Menghapus simulasi channel, diskon, dan bundle.')} 
          onReset={() => confirmResetModule('pricingSimulations')} 
        />
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <AlertOctagon size={24} className="text-red-600 shrink-0" />
          <div>
            <h4 className="font-bold text-red-700">{t('resetAllBusinessData', 'Hapus Semua Data Bisnis')}</h4>
            <p className="text-sm text-red-600 mt-1">
              {t('resetAllWarning', 'Tindakan ini akan MENGHAPUS SEMUA data kalkulasi, resep, produk, bahan, dan simulasi dari perangkat ini secara permanen. Pengaturan tidak akan terhapus.')}
            </p>
          </div>
        </div>
        <button 
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          onClick={() => setStrongConfirmOpen(true)}
        >
          {t('resetAllData', 'HAPUS SEMUA DATA')}
        </button>
      </div>

      <StrongConfirmDialog 
        open={strongConfirmOpen}
        title={t('resetAllBusinessData', 'Hapus Semua Data Bisnis')}
        description={t('resetAllWarning', 'Tindakan ini permanen dan tidak dapat dibatalkan.')}
        requiredText="HAPUS"
        onConfirm={() => {
          onResetAll();
          setStrongConfirmOpen(false);
        }}
        onCancel={() => setStrongConfirmOpen(false)}
      />

      <ConfirmDialog 
        isOpen={moduleConfirmOpen}
        title={t('resetModuleTitle', 'Konfirmasi Hapus Modul')}
        message={t('resetModuleWarning', 'Apakah Anda yakin ingin menghapus data modul ini? Tindakan ini tidak dapat dibatalkan.')}
        confirmText={t('delete', 'Hapus')}
        cancelText={t('cancel', 'Batal')}
        onConfirm={handleModuleConfirm}
        onCancel={() => setModuleConfirmOpen(false)}
      />
    </Card>
  );
};
