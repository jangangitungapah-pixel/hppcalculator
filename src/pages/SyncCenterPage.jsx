import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSync } from '../hooks/useSync';
import { useLanguage } from '../hooks/useLanguage';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Cloud, WifiOff, UploadCloud, DownloadCloud, RefreshCw, CheckCircle2, AlertTriangle, Info, ShieldAlert, Check } from 'lucide-react';
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
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  if (!isFirebaseReady) {
    return (
      <PageContainer maxWidth="max-w-xl">
        <FadeIn>
          <Card className="p-8 text-center border-amber-500/15 bg-amber-500/[0.02] rounded-3xl shadow-xs">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4.5 text-amber-600">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-text-primary mb-2.5 tracking-tight">
              {t('sync.notConfigured', 'Cloud Sync Belum Aktif')}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-text-secondary mb-6 max-w-sm mx-auto leading-relaxed">
              {t('auth.setupRequiredBody', 'Sistem otentikasi belum disiapkan pada environment ini. Modalin tetap bisa digunakan dalam mode lokal.')}
            </p>
            <div className="p-4 bg-surface-cream border border-border-soft rounded-2xl text-left text-xs font-semibold text-text-secondary leading-relaxed flex gap-3">
              <Info className="w-4.5 h-4.5 text-brand-primary shrink-0 mt-0.5" />
              <span>
                {t('auth.localModeNote', 'Modalin tetap bisa dipakai tanpa login. Data otomatis tersimpan di perangkat ini.')}
              </span>
            </div>
          </Card>
        </FadeIn>
      </PageContainer>
    );
  }

  if (isGuest) {
    return (
      <PageContainer maxWidth="max-w-xl">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-text-primary mb-1 tracking-tight">
            {t('sync.title', 'Pusat Sinkronisasi')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-secondary">
            {t('sync.subtitle', 'Kelola data cloud dan lokal Anda')}
          </p>
        </div>

        <FadeIn>
          <Card className="p-8 text-center bg-gradient-to-br from-surface to-brand-soft/20 border-border/80 rounded-3xl shadow-xs">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 text-brand-primary shadow-sm border border-brand-primary/10">
              <Cloud className="w-8 h-8" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-text-primary mb-3 tracking-tight">
              {t('sync.guestMode', 'Mode lokal aktif. Login untuk sinkronisasi cloud.')}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-text-secondary mb-6 max-w-sm mx-auto leading-relaxed">
              {t('sync.loginRequired', 'Masuk ke akun Anda untuk mulai mencadangkan data secara otomatis ke cloud dan mengaksesnya dari perangkat lain.')}
            </p>

            <div className="bg-surface/50 border border-border-soft rounded-2xl p-4.5 text-left text-xs font-semibold text-text-secondary space-y-2.5 mb-6.5 max-w-sm mx-auto">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'id' ? 'Cadangkan data secara otomatis & aman' : 'Backup data automatically & securely'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'id' ? 'Sinkronisasi langsung antar perangkat' : 'Instant synchronization between devices'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'id' ? 'Akses aman di mana saja via browser' : 'Secure access anywhere via browser'}</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto h-11 px-6 font-bold rounded-xl shadow-md shadow-orange-500/10"
            >
              {t('auth.login', 'Masuk')} / {t('auth.register', 'Daftar')}
            </Button>
          </Card>
        </FadeIn>
      </PageContainer>
    );
  }

  const activeCounts = getActiveScopeBusinessDataCounts();
  const hasNoData = activeCounts.total === 0;

  const getStatusToneConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          bg: 'bg-emerald-500/5 border-emerald-500/15',
          text: 'text-emerald-905',
          title: t('sync.synced', 'Tersinkron'),
          icon: CheckCircle2,
          iconColor: 'text-emerald-600 bg-emerald-500/10'
        };
      case 'syncing':
        return {
          bg: 'bg-orange-500/5 border-orange-500/15',
          text: 'text-brand-primary',
          title: t('sync.syncing', 'Menyinkronkan...'),
          icon: RefreshCw,
          iconColor: 'text-brand-primary bg-orange-500/10'
        };
      case 'error':
        return {
          bg: 'bg-red-500/5 border-red-500/15',
          text: 'text-red-905',
          title: t('sync.error', 'Gagal Sinkron'),
          icon: AlertTriangle,
          iconColor: 'text-red-600 bg-red-500/10'
        };
      case 'offline':
        return {
          bg: 'bg-amber-500/5 border-amber-500/15',
          text: 'text-amber-905',
          title: t('sync.offline', 'Offline'),
          icon: WifiOff,
          iconColor: 'text-amber-600 bg-amber-500/10'
        };
      case 'local_unapproved':
        return {
          bg: 'bg-amber-500/5 border-amber-500/15',
          text: 'text-amber-905',
          title: t('sync.conflictWarning', 'Konflik Data'),
          icon: AlertTriangle,
          iconColor: 'text-amber-600 bg-amber-500/10'
        };
      case 'ready':
      default:
        return {
          bg: 'bg-surface border-border/80',
          text: 'text-text-primary',
          title: t('sync.ready', 'Siap Sinkron'),
          icon: RefreshCw,
          iconColor: 'text-brand-primary bg-brand-soft/50'
        };
    }
  };

  const statusConfig = getStatusToneConfig();
  const StatusIcon = statusConfig.icon;

  const formatSyncDate = (dateString) => {
    if (!dateString) return t('sync.neverSynced', 'Belum pernah');
    try {
      return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-text-primary mb-1 tracking-tight">
          {t('sync.title', 'Pusat Sinkronisasi')}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-text-secondary">
          {t('sync.subtitle', 'Kelola data cloud dan lokal Anda')}
        </p>
      </div>

      <div className="space-y-6">
        {showInitialPrompt && (
          <FadeIn>
            <Card className="p-5 sm:p-6 border-brand-primary bg-orange-500/[0.02] rounded-3xl shadow-xs">
              <h3 className="text-base sm:text-lg font-black text-brand-primary mb-1.5 tracking-tight">
                {initialPromptMode === 'import_guest_data' 
                  ? t('sync.initialPromptTitle', 'Sinkronkan Data Lokal?') 
                  : t('sync.initialPromptTitle', 'Sinkronkan Data Lokal?')}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-text-secondary mb-5 leading-relaxed">
                {initialPromptMode === 'import_guest_data'
                  ? t('sync.initialPromptBody', 'Kami mendeteksi Anda memiliki data bisnis di perangkat ini. Apakah Anda ingin mengunggahnya ke cloud sekarang?')
                  : t('sync.initialPromptBody', 'Kami mendeteksi Anda memiliki data bisnis di perangkat ini. Apakah Anda ingin mengunggahnya ke cloud sekarang?')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={promptInitialSync}
                  className="h-10 text-xs font-bold rounded-xl shadow-md shadow-orange-500/10"
                >
                  {initialPromptMode === 'import_guest_data' ? t('sync.syncLocalNow', 'Ya, Unggah ke Cloud') : t('sync.syncLocalNow', 'Ya, Unggah ke Cloud')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={dismissInitialSyncPrompt}
                  className="h-10 text-xs font-bold border border-border bg-surface text-text-secondary hover:bg-border/20 rounded-xl"
                >
                  {t('sync.later', 'Nanti Saja')}
                </Button>
              </div>
            </Card>
          </FadeIn>
        )}

        {isAuthenticated && hasNoData && (
          <FadeIn>
            <div className="p-4 bg-sky-500/5 border border-sky-500/10 text-sky-850 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed flex gap-3 items-start">
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                {t('sync.noData', 'Belum ada data untuk disinkronkan. Data baru akan otomatis disiapkan untuk cloud sync.')}
              </div>
            </div>
          </FadeIn>
        )}

        {syncStatus === 'offline' && (
          <FadeIn>
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 text-amber-850 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed flex gap-3 items-start">
              <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold text-amber-955 block mb-0.5">{t('sync.offline', 'Offline')}</strong>
                {lang === 'id' ? 'Perubahan lokal akan disimpan sementara dan akan disinkronkan saat koneksi kembali online.' : 'Local changes will be saved temporarily and synced when you go back online.'}
              </div>
            </div>
          </FadeIn>
        )}

        <FadeIn>
          <Card className={`p-5 sm:p-6 border rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4.5 ${statusConfig.bg}`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${statusConfig.iconColor}`}>
                <StatusIcon className={`w-6 h-6 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">{t('sync.status', 'Status Cloud Sync')}</p>
                <h3 className={`font-black text-base sm:text-lg tracking-tight ${statusConfig.text}`}>
                  {statusConfig.title}
                </h3>
                <p className="text-[11px] font-semibold text-text-secondary mt-0.5">
                  {t('sync.lastSync', 'Terakhir')}: {formatSyncDate(lastSyncAt)}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => syncNow()} 
              isLoading={isSyncing} 
              disabled={syncStatus === 'offline'}
              className="h-11 px-5 font-bold rounded-xl shadow-md shadow-orange-500/10 transition-all shrink-0 w-full sm:w-auto"
            >
              {t('sync.syncNow', 'Sinkronkan Sekarang')}
            </Button>
          </Card>
        </FadeIn>

        {syncSummary && (
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <Card className="p-4 border-border-soft rounded-2xl shadow-xs text-center">
                <div className="text-2xl font-black text-text-primary tracking-tight">{syncSummary.pushedCount || 0}</div>
                <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">{t('sync.pushed', 'Diunggah')}</div>
              </Card>
              <Card className="p-4 border-border-soft rounded-2xl shadow-xs text-center">
                <div className="text-2xl font-black text-text-primary tracking-tight">{syncSummary.pulledCount || 0}</div>
                <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">{t('sync.pulled', 'Diunduh')}</div>
              </Card>
              <Card className="p-4 border-border-soft rounded-2xl shadow-xs text-center">
                <div className="text-2xl font-black text-amber-600 tracking-tight">{syncSummary.conflictCount || 0}</div>
                <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">{t('sync.conflicts', 'Konflik')}</div>
              </Card>
              <Card className="p-4 border-border-soft rounded-2xl shadow-xs text-center">
                <div className="text-2xl font-black text-red-600 tracking-tight">{syncSummary.errors?.length || 0}</div>
                <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">Error</div>
              </Card>
            </div>
          </FadeIn>
        )}

        <FadeIn>
          <Card className="p-5 sm:p-6 border-border/80 rounded-3xl shadow-xs">
            <h3 className="font-extrabold text-base sm:text-lg text-text-primary mb-4 pb-2 border-b border-border-soft">
              {lang === 'id' ? 'Kontrol Sinkronisasi Manual' : 'Manual Sync Controls'}
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={pushLocalToCloud} 
                disabled={isSyncing || syncStatus === 'offline'}
                className="w-full p-4 border border-border-soft bg-surface hover:border-brand-primary/40 rounded-2xl text-left flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none group"
              >
                <div className="p-2 bg-orange-500/10 text-brand-primary rounded-xl shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <UploadCloud className="w-5.5 h-5.5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-text-primary">{t('sync.uploadLocal', 'Unggah Lokal ke Cloud')}</div>
                  <div className="text-xs font-semibold text-text-secondary mt-0.5 leading-relaxed">
                    {lang === 'id' ? 'Paksa menimpa data cloud dengan data di perangkat ini' : 'Force overwrite cloud data with data on this device'}
                  </div>
                </div>
              </button>

              <button 
                onClick={pullCloudToLocal} 
                disabled={isSyncing || syncStatus === 'offline'}
                className="w-full p-4 border border-border-soft bg-surface hover:border-brand-primary/40 rounded-2xl text-left flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none group"
              >
                <div className="p-2 bg-orange-500/10 text-brand-primary rounded-xl shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <DownloadCloud className="w-5.5 h-5.5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-text-primary">{t('sync.downloadCloud', 'Unduh Cloud ke Lokal')}</div>
                  <div className="text-xs font-semibold text-text-secondary mt-0.5 leading-relaxed">
                    {lang === 'id' ? 'Paksa menarik data terbaru dari cloud' : 'Force pull the latest data from the cloud'}
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-border-soft flex items-center justify-between">
              <div>
                <div className="font-extrabold text-sm text-text-primary">{t('sync.autoSync', 'Auto Sinkronisasi')}</div>
                <div className="text-xs font-semibold text-text-secondary mt-0.5 leading-relaxed">{t('sync.cloudSyncNote', 'Sinkronisasi ringan otomatis saat data berubah')}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={autoSyncEnabled} 
                  onChange={(e) => setAutoSyncEnabled(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          </Card>
        </FadeIn>

        <div className="p-4 bg-sky-500/5 border border-sky-500/10 text-sky-850 rounded-2xl text-xs sm:text-sm leading-relaxed flex gap-3 items-start">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            {t('sync.backupStillRecommended')}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
