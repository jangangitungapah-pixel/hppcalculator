import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelProfiles } from '../../hooks/useChannelProfiles';

import { ChannelProfileCard } from '../../components/pricing/ChannelProfileCard';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { Plus, Store } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const ChannelProfilesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    channelProfiles, 
    loadPresetChannelProfiles, 
    hasProfiles, 
    deleteChannelProfile,
    saveChannelProfile,
    updateChannelProfile
  } = useChannelProfiles();
  
  const [toast, setToast] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: 'marketplace',
    commissionPercent: 0,
    paymentFeePercent: 0,
    paymentFeeFixed: 0,
    additionalPackagingCost: 0,
    sellerPromoPercent: 0,
    sellerPromoFixed: 0,
    consignmentFeePercent: 0,
    fixedChannelCost: 0,
    notes: ''
  });
  const [errors, setErrors] = useState({});

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
    setEditingProfile(profile);
    setForm({
      name: profile.name || '',
      type: profile.type || 'marketplace',
      commissionPercent: profile.commissionPercent || 0,
      paymentFeePercent: profile.paymentFeePercent || 0,
      paymentFeeFixed: profile.paymentFeeFixed || 0,
      additionalPackagingCost: profile.additionalPackagingCost || 0,
      sellerPromoPercent: profile.sellerPromoPercent || 0,
      sellerPromoFixed: profile.sellerPromoFixed || 0,
      consignmentFeePercent: profile.consignmentFeePercent || 0,
      fixedChannelCost: profile.fixedChannelCost || 0,
      notes: profile.notes || ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProfile(null);
    setForm({
      name: '',
      type: 'marketplace',
      commissionPercent: 0,
      paymentFeePercent: 0,
      paymentFeeFixed: 0,
      additionalPackagingCost: 0,
      sellerPromoPercent: 0,
      sellerPromoFixed: 0,
      consignmentFeePercent: 0,
      fixedChannelCost: 0,
      notes: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Nama profil wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Ada data yang belum lengkap', 'error');
      return;
    }

    const profileData = {
      name: form.name.trim(),
      type: form.type,
      commissionPercent: Number(form.commissionPercent) || 0,
      paymentFeePercent: Number(form.paymentFeePercent) || 0,
      paymentFeeFixed: Number(form.paymentFeeFixed) || 0,
      additionalPackagingCost: Number(form.additionalPackagingCost) || 0,
      sellerPromoPercent: Number(form.sellerPromoPercent) || 0,
      sellerPromoFixed: Number(form.sellerPromoFixed) || 0,
      consignmentFeePercent: Number(form.consignmentFeePercent) || 0,
      fixedChannelCost: Number(form.fixedChannelCost) || 0,
      notes: form.notes.trim()
    };

    if (editingProfile) {
      updateChannelProfile(editingProfile.id, profileData);
      showToast('Profil berhasil diperbarui');
    } else {
      saveChannelProfile(profileData);
      showToast('Profil baru berhasil disimpan');
    }

    setIsModalOpen(false);
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
              onClick={handleAddClick}
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

      {/* Modal Dialog */}
      {isModalOpen && createPortal(
        <div className="dialog-overlay bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-floating z-50 overflow-y-auto max-h-[90vh] flex flex-col gap-4 border border-border">
            <div className="flex justify-between items-center border-b border-border-soft pb-3">
              <h2 className="text-xl font-bold text-text-primary">
                {editingProfile ? 'Edit Profil Channel' : 'Tambah Profil Channel'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary text-xl font-bold p-1 rounded-lg hover:bg-surface-muted transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 py-2 flex-grow overflow-y-auto pr-1">
              <Input
                label="Nama Profil"
                placeholder="Cth: ShopeeFood Custom, Toko Kelontong A"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
              />
              
              <Select
                label="Jenis Channel"
                value={form.type}
                onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                options={[
                  { value: 'marketplace', label: 'Marketplace' },
                  { value: 'reseller', label: 'Reseller & Grosir' },
                  { value: 'consignment', label: 'Titip Jual (Konsinyasi)' },
                  { value: 'offline', label: 'Offline / Direct' },
                  { value: 'custom', label: 'Kustom / Lainnya' }
                ]}
              />

              {form.type === 'marketplace' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Komisi Platform (%)"
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      placeholder="0"
                      value={form.commissionPercent}
                      onChange={(e) => setForm(prev => ({ ...prev, commissionPercent: e.target.value }))}
                    />
                    <Input
                      label="Biaya Layanan (%)"
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      placeholder="0"
                      value={form.paymentFeePercent}
                      onChange={(e) => setForm(prev => ({ ...prev, paymentFeePercent: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Biaya Transaksi Tetap (Rp)"
                      type="number"
                      min="0"
                      prefix="Rp"
                      placeholder="0"
                      value={form.paymentFeeFixed}
                      onChange={(e) => setForm(prev => ({ ...prev, paymentFeeFixed: e.target.value }))}
                    />
                    <Input
                      label="Biaya Kemasan Ekstra (Rp)"
                      type="number"
                      min="0"
                      prefix="Rp"
                      placeholder="0"
                      value={form.additionalPackagingCost}
                      onChange={(e) => setForm(prev => ({ ...prev, additionalPackagingCost: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Subsidi Promo (%)"
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      placeholder="0"
                      value={form.sellerPromoPercent}
                      onChange={(e) => setForm(prev => ({ ...prev, sellerPromoPercent: e.target.value }))}
                    />
                    <Input
                      label="Subsidi Promo Tetap (Rp)"
                      type="number"
                      min="0"
                      prefix="Rp"
                      placeholder="0"
                      value={form.sellerPromoFixed}
                      onChange={(e) => setForm(prev => ({ ...prev, sellerPromoFixed: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {form.type === 'consignment' && (
                <div className="space-y-4">
                  <Input
                    label="Bagi Hasil Toko (%)"
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="0"
                    value={form.consignmentFeePercent}
                    onChange={(e) => setForm(prev => ({ ...prev, consignmentFeePercent: e.target.value }))}
                  />
                  <Input
                    label="Biaya Titip/Sewa Tetap (Rp)"
                    type="number"
                    min="0"
                    prefix="Rp"
                    placeholder="0"
                    value={form.fixedChannelCost}
                    onChange={(e) => setForm(prev => ({ ...prev, fixedChannelCost: e.target.value }))}
                  />
                </div>
              )}

              {(form.type === 'reseller' || form.type === 'offline' || form.type === 'custom') && (
                <div className="space-y-4">
                  <Input
                    label="Biaya Kemasan Ekstra (Rp)"
                    type="number"
                    min="0"
                    prefix="Rp"
                    placeholder="0"
                    value={form.additionalPackagingCost}
                    onChange={(e) => setForm(prev => ({ ...prev, additionalPackagingCost: e.target.value }))}
                  />
                  <Input
                    label="Biaya Operasional Tetap (Rp)"
                    type="number"
                    min="0"
                    prefix="Rp"
                    placeholder="0"
                    value={form.fixedChannelCost}
                    onChange={(e) => setForm(prev => ({ ...prev, fixedChannelCost: e.target.value }))}
                  />
                </div>
              )}

              <Input
                label="Catatan / Info Tambahan"
                placeholder="Cth: Kontrak khusus dengan ojol, dll (opsional)"
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end gap-3 border-t border-border-soft pt-3 mt-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Simpan
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </PageContainer>
  );
};
