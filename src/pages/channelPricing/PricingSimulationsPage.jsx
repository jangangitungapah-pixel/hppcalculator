import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { usePricingSimulations } from '../../hooks/usePricingSimulations';

import { SimulationCard } from '../../components/pricing/SimulationCard';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { Plus, Calculator } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';

export const PricingSimulationsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    pricingSimulations, 
    bundleSimulations, 
    hasSimulations, 
    deletePricingSimulation,
    deleteBundleSimulation
  } = usePricingSimulations();
  
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id, isBundle) => {
    if (window.confirm('Hapus simulasi ini?')) {
      if (isBundle) {
        deleteBundleSimulation(id);
      } else {
        deletePricingSimulation(id);
      }
      showToast('Simulasi berhasil dihapus');
    }
  };

  const handleCardClick = (simulation) => {
    // In a full app, this would open a detail view
    // For now, we'll just show a toast or we could navigate to the calculator with the data
    showToast('Mode lihat detail akan segera hadir', 'info');
  };

  const allSimulations = [
    ...pricingSimulations,
    ...bundleSimulations
  ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <PageContainer maxWidth="max-w-4xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-text-secondary text-sm">
            Riwayat simulasi harga jual Anda.
          </p>
          <Button 
            variant="primary" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => navigate('/channel-pricing')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Simulasi Baru</span>
          </Button>
        </div>

        {!hasSimulations ? (
          <Card className="p-8 text-center bg-white border-dashed">
            <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Belum ada simulasi</h3>
            <p className="text-text-tertiary mb-6 max-w-md mx-auto">
              Mulai buat simulasi harga jual untuk berbagai channel penjualan agar profit Anda tetap aman.
            </p>
            <Button onClick={() => navigate('/channel-pricing')}>
              Buat Simulasi Pertama
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allSimulations.map(sim => (
              <SimulationCard 
                key={sim.id} 
                simulation={sim} 
                onClick={handleCardClick}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </PageContainer>
  );
};
