import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSync } from '../hooks/useSync';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Store, LogOut, Cloud } from 'lucide-react';
import { FadeIn } from '../components/motion/FadeIn';

export const AccountPage = () => {
  const { user, profile, businessProfile, isGuest, signOut, updateBusinessProfile, isLoading } = useAuth();
  const { syncStatus } = useSync();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    businessName: businessProfile?.businessName || '',
    businessType: businessProfile?.businessType || '',
    city: businessProfile?.city || '',
    notes: businessProfile?.notes || ''
  });
  const [saving, setSaving] = useState(false);

  // Update formData when businessProfile loads
  React.useEffect(() => {
    if (businessProfile) {
      setFormData({
        businessName: businessProfile.businessName || '',
        businessType: businessProfile.businessType || '',
        city: businessProfile.city || '',
        notes: businessProfile.notes || ''
      });
    }
  }, [businessProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateBusinessProfile(formData);
    setSaving(false);
    setEditMode(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  if (isGuest) {
    return (
      <PageContainer maxWidth="max-w-3xl" className="account-page">
        <section className="app-page-hero account-hero">
          <div className="app-page-hero-main">
            <div className="app-page-eyebrow">
              <User className="w-4 h-4" aria-hidden="true" />
              Mode Lokal
            </div>
            <h2 className="app-page-title">Akun & Profil</h2>
            <p className="app-page-subtitle">Kelola identitas bisnis dan opsi sinkronisasi cloud.</p>
          </div>
        </section>
        <Card className="p-8 text-center bg-gradient-to-br from-surface to-brand-soft/20">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Kamu Menggunakan Mode Lokal</h2>
          <p className="text-text-secondary mb-6 max-w-sm mx-auto">
            Semua data tersimpan aman di perangkat ini. Login untuk menyinkronkan data ke cloud agar bisa diakses dari perangkat lain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => navigate('/login')} className="w-full sm:w-auto">Masuk / Daftar</Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-3xl" className="account-page">
      <section className="app-page-hero account-hero">
        <div className="app-page-hero-main">
          <div className="app-page-eyebrow">
            <User className="w-4 h-4" aria-hidden="true" />
            Profil Bisnis
          </div>
          <h2 className="app-page-title">Akun & Profil Bisnis</h2>
          <p className="app-page-subtitle">Pantau akun, status cloud, dan identitas bisnis dalam satu tempat.</p>
        </div>
      </section>

      <div className="space-y-6">
        <FadeIn>
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary text-xl font-bold">
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{profile?.fullName || 'Pengguna Modalin'}</h2>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-error hover:bg-error-50 hover:text-error">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-lg">Status Cloud Sync</h3>
              </div>
              <div className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-brand-primary/10 text-brand-primary">
                {syncStatus === 'synced' ? 'Tersinkron' : syncStatus === 'syncing' ? 'Menyinkronkan...' : syncStatus === 'offline' ? 'Offline' : syncStatus}
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Data kamu otomatis disinkronkan ke cloud agar aman.
            </p>
            <Button variant="outline" onClick={() => navigate('/sync')} className="w-full">
              Buka Pusat Sinkronisasi
            </Button>
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-lg">Profil Bisnis</h3>
              </div>
              {!editMode && (
                <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>Edit</Button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label="Nama Bisnis"
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  placeholder="Contoh: Kopi Senja"
                />
                <Input
                  label="Jenis Bisnis"
                  value={formData.businessType}
                  onChange={e => setFormData({...formData, businessType: e.target.value})}
                  placeholder="Contoh: Kedai Kopi"
                />
                <Input
                  label="Kota"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  placeholder="Contoh: Jakarta"
                />
                <Input
                  label="Catatan Singkat (Opsional)"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Berdiri sejak..."
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="ghost" type="button" onClick={() => setEditMode(false)} disabled={saving}>Batal</Button>
                  <Button type="submit" isLoading={saving}>Simpan Profil</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Nama Bisnis</div>
                  <div className="font-medium">{businessProfile?.businessName || '-'}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Jenis Bisnis</div>
                    <div className="font-medium">{businessProfile?.businessType || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Kota</div>
                    <div className="font-medium">{businessProfile?.city || '-'}</div>
                  </div>
                </div>
                {businessProfile?.notes && (
                  <div>
                    <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Catatan</div>
                    <div className="text-sm">{businessProfile.notes}</div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </FadeIn>
      </div>
    </PageContainer>
  );
};
