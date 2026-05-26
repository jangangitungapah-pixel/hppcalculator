import React from 'react';
import { Sparkles, Download, X } from 'lucide-react';
import { usePwaContext } from '../../contexts/PwaContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';

export const InstallAppBanner = () => {
  const { showBanner, promptInstall, dismissInstallPrompt } = usePwaContext();
  const { t } = useLanguage();

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-br from-surface to-orange-50 border border-primary/20 rounded-2xl shadow-premium p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in 
slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-coral flex items-center justify-center flex-shrink-0 text-white shadow-glow-primary">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-text-primary text-sm sm:text-base">
            {t('pwa.installTitle')}
          </h3>
          <p className="text-text-secondary text-xs sm:text-sm mt-0.5 leading-snug">
            {t('pwa.installBody')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:self-center ml-13 sm:ml-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={dismissInstallPrompt}
        >
          {t('pwa.dismiss')}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={promptInstall}
          leftIcon={<Download className="w-4 h-4" />}
        >
          {t('pwa.installCta')}
        </Button>
      </div>
    </div>
  );
};
