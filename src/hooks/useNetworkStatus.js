import { useState, useEffect } from 'react';
import { useToast } from './useToast';
import { useLanguage } from './useLanguage';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(!navigator.onLine);
  const { addToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        addToast({
          type: 'success',
          title: t('pwa.onlineBack'),
          message: t('pwa.offlineModeBody'),
        });
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      addToast({
        type: 'warning',
        title: t('pwa.offlineModeTitle'),
        message: t('pwa.offlineModeBody'),
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline, addToast, t]);

  return { isOnline, isOffline: !isOnline };
}
