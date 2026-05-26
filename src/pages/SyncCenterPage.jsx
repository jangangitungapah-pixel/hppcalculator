import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSync } from '../hooks/useSync';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Cloud, WifiOff, UploadCloud, DownloadCloud, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { FadeIn } from '../components/motion/FadeIn';
import { getActiveScopeBusinessDataCounts } from '../lib/storage/scopeDataInspection';

export const SyncCenterPage = () => {
  const { isGuest, isFirebaseReady, isAuthenticated } = useAuth();
  const { 
    syncStatus, 
    lastSyncAt, 
    isSyncing, 
    syncNow, 
    pushLocalToCloud, 
    pullCloudToLocal,
    showInitialPrompt,
    initialPromptMode,
    promptInitialSync,
    dismissInitialSyncPrompt,
    autoSyncEnabled,
    setAutoSyncEnabled,
    syncSummary
  } = useSync();
  const navigate = useNavigate();

  if (!isFirebaseReady) {
    return (
      <PageContainer maxWidth="max-w-2xl">
        <Alert type="warning" title="Cloud Sync Belum Dikonfigurasi">
          Fitur cloud sync belum diaktifkan di environment ini. Modalin tetap bisa digunakan 100% secara lokal.
        </Alert>
      </PageContainer>
    );
  }

  if (isGuest) {
    return (
      <PageContainer maxWidth="max-w-2xl">
        <div className="page-header">
          <h1 className="page-title">Pusat Sinkronisasi</h1>
        </div>
        <Card className="p-8 text-center bg-gradient-to-br from-surface to-brand-soft/20">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
            <Cloud className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Mode lokal aktif. Login untuk sinkronisasi cloud.</h2>
          <p className="text-text-secondary mb-6 max-w-sm mx-auto">
            Masuk ke akun Anda untuk mulai mencadangkan data secara otomatis ke cloud dan mengaksesnya dari perangkat lain.
          </p>
          <Button onClick={() => navigate('/login')}>Masuk untuk Sync</Button>
        </Card>
      </PageContainer>
    );
  }

  const activeCounts = getActiveScopeBusinessDataCounts();
  const hasNoData = activeCounts.total === 0;

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Pusat Sinkronisasi</h1>
        <p className="text-text-secondary mt-1">Kelola data cloud dan lokal Anda</p>
      </div>

      <div className="space-y-6">
        {showInitialPrompt && (
          <FadeIn>
            <Card className="p-6 border-brand-primary bg-brand-primary/5">
              <h3 className="text-lg font-bold text-brand-primary mb-2">
                {initialPromptMode === 'import_guest_data' 
                  ? 'Kamu punya data Guest yang belum masuk akun ini.' 
                  : 'Kamu punya data lokal di akun ini yang belum disinkronkan.'}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {initialPromptMode === 'import_guest_data'
                  ? 'Kamu punya data lokal sebagai Guest. Mau salin ke akun ini dan sinkronkan ke cloud?'
                  : 'Kamu punya data lokal di akun ini. Mau sinkronkan ke cloud?'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={promptInitialSync}>
                  {initialPromptMode === 'import_guest_data' ? 'Salin Guest ke Akun & Sync' : 'Upload ke Cloud'}
                </Button>
                <Button variant="outline" onClick={dismissInitialSyncPrompt}>Nanti Saja</Button>
              </div>
            </Card>
          </FadeIn>
        )}

        {isAuthenticated && hasNoData && (
          <FadeIn>
            <Alert type="info">
              Belum ada data untuk disinkronkan. Data baru akan otomatis disiapkan untuk cloud sync.
            </Alert>
          </FadeIn>
        )}

        {syncStatus === 'offline' && (
          <Alert type="warning" icon={<WifiOff />} title="Anda Sedang Offline">
            Perubahan lokal akan disimpan sementara dan akan disinkronkan saat koneksi kembali online.
          </Alert>
        )}

        <FadeIn>
          <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                syncStatus === 'synced' ? 'bg-success-50 text-success-600' :
                syncStatus === 'error' ? 'bg-error-50 text-error-600' :
                syncStatus === 'local_unapproved' ? 'bg-warning-50 text-warning-600' :
                'bg-brand-primary/10 text-brand-primary'
              }`}>
                {syncStatus === 'synced' ? <CheckCircle2 className="w-6 h-6" /> :
                 syncStatus === 'error' ? <AlertTriangle className="w-6 h-6" /> :
                 <RefreshCw className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {
                    syncStatus === 'synced' ? 'Data akun ini tersinkron' :
                    syncStatus === 'syncing' ? 'Menyinkronkan...' :
                    syncStatus === 'error' ? 'Gagal Sinkron' :
                    syncStatus === 'offline' ? 'Menunggu Koneksi' :
                    syncStatus === 'local_unapproved' ? 'Belum Disetujui' : 'Siap Sinkron'
                  }
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Terakhir: {lastSyncAt ? new Date(lastSyncAt).toLocaleString('id-ID') : 'Belum pernah'}
                </p>
              </div>
            </div>
            <Button onClick={() => syncNow()} isLoading={isSyncing} disabled={syncStatus === 'offline'}>
              Sinkronkan Sekarang
            </Button>
          </Card>
        </FadeIn>

        {syncSummary && (
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-text-primary">{syncSummary.pushedCount || 0}</div>
                <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Diunggah</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-text-primary">{syncSummary.pulledCount || 0}</div>
                <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Diunduh</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-warning-600">{syncSummary.conflictCount || 0}</div>
                <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Konflik</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-error-600">{syncSummary.errors?.length || 0}</div>
                <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">Error</div>
              </Card>
            </div>
          </FadeIn>
        )}

        <FadeIn>
          <Card className="p-6">
            <h3 className="font-bold mb-4">Kontrol Sinkronisasi Manual</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={pushLocalToCloud} isLoading={isSyncing}>
                <UploadCloud className="w-4 h-4 mr-3 text-brand-primary" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Unggah Lokal ke Cloud</div>
                  <div className="text-xs text-text-secondary font-normal">Paksa menimpa data cloud dengan data di perangkat ini</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={pullCloudToLocal} isLoading={isSyncing}>
                <DownloadCloud className="w-4 h-4 mr-3 text-brand-primary" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Unduh Cloud ke Lokal</div>
                  <div className="text-xs text-text-secondary font-normal">Paksa menarik data terbaru dari cloud</div>
                </div>
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Auto Sinkronisasi</div>
                <div className="text-xs text-text-secondary">Sinkronisasi ringan otomatis saat data berubah</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={autoSyncEnabled} onChange={(e) => setAutoSyncEnabled(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          </Card>
        </FadeIn>

        <Alert type="info">
          Cloud sync tidak menggantikan pencadangan lokal seutuhnya. Sebaiknya tetap lakukan Export JSON dari menu Kelola Data.
        </Alert>
      </div>
    </PageContainer>
  );
};
