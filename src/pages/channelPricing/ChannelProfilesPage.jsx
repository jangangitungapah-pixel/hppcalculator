import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelProfiles } from '../../hooks/useChannelProfiles';

import { ChannelProfileCard } from '../../components/pricing/ChannelProfileCard';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { Plus, HelpCircle, Store } from 'lucide-react';

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
    // In a full implementation, this would open a modal to edit the profile
    showToast('Fitur edit akan segera hadir', 'info');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col pb-20">

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-text-secondary text-sm">
            Kelola profil biaya untuk berbagai channel penjualan Anda.
          </p>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Profil</span>
          </Button>
        </div>

        {!hasProfiles ? (
          <Card className="p-8 text-center bg-white border-dashed">
            <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Belum ada profil channel</h3>
            <p className="text-text-tertiary mb-6 max-w-md mx-auto">
              Muat profil bawaan (preset) untuk mulai menghitung harga jual di berbagai channel seperti GoFood, GrabFood, atau Reseller.
            </p>
            <Button onClick={() => {
              loadPresetChannelProfiles();
              showToast('Preset berhasil dimuat');
            }}>
              Muat Preset Channel
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
