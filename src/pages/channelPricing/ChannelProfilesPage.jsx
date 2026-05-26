import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelProfiles } from '../../hooks/useChannelProfiles';

import { ChannelProfileCard } from '../../components/pricing/ChannelProfileCard';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { Plus, Store } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';

export const ChannelProfilesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { channelProfiles, loadPresetChannelProfiles, hasProfiles, deleteChannelProfile } = useChannelProfiles();
  
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus profil channel ini?')) {
      deleteChannelProfile(id);
      showToast('Profil berhasil dihapus');
    }
  };

  const handleEdit = (profile) => {
    showToast('Fitur edit akan segera hadir', 'info');
  };

  return (
    <PageContainer maxWidth="max-w-5xl">
      <div className="pricing-page space-y-6">
        {/* Page Hero */}
        <div className="pricing-hero">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Profil Channel Penjualan</h1>
              <p className="text-sm text-text-secondary mt-1">
                Kelola profil biaya layanan, komisi marketplace, dan pengemasan untuk setiap channel.
              </p>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => showToast('Fitur tambah profil mandiri akan segera hadir', 'info')}
            >
              Tambah Profil
            </Button>
          </div>
        </div>

        {!hasProfiles ? (
          <div className="pricing-empty-state">
            <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Belum ada profil channel</h3>
            <p className="text-text-tertiary mb-6 max-w-sm mx-auto text-sm">
              Muat profil bawaan (preset) untuk mulai menghitung harga jual di berbagai channel seperti GoFood, GrabFood, atau ShopeeFood.
            </p>
            <Button onClick={() => {
              loadPresetChannelProfiles();
              showToast('Preset berhasil dimuat');
            }}>
              Muat Preset Channel
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {channelProfiles.map(profile => (
                <ChannelProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {channelProfiles.filter(p => p.isPreset).length < 6 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => {
                  loadPresetChannelProfiles();
                  showToast('Preset berhasil diperbarui');
                }}>
                  Muat Ulang Preset Bawaan
                </Button>
              </div>
            )}
          </>
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
