import React from 'react';
import { Download, CheckCircle2, Smartphone } from 'lucide-react';
import { usePwaContext } from '../../contexts/PwaContext';
import { useLanguage } from '../../hooks/useLanguage';

export const InstallAppCard = () => {
  const { isInstalled, canInstall, promptInstall } = usePwaContext();
  const { t } = useLanguage();

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
      <div className="p-4 sm:p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-text-primary mb-1">
            {t('pwa.installTitle')}
          </h3>
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            {t('pwa.installBody')}
          </p>
          
          {isInstalled ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-50 text-success-700 rounded-lg text-sm font-medium border border-success-200">
              <CheckCircle2 className="w-4 h-4" />
              {t('pwa.installed')}
            </div>
          ) : canInstall ? (
            <button
              onClick={promptInstall}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              {t('pwa.installCta')}
            </button>
          ) : (
            <div className="text-xs text-text-tertiary bg-surface-alt p-3 rounded-lg border border-border">
              Jika browser Anda mendukung, gunakan menu browser (Add to Home Screen / Install) untuk menambahkan Modalin ke layar utama perangkat Anda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
