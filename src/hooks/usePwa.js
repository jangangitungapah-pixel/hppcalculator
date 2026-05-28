import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { shouldShowInstallBanner, dismissInstallBanner } from '../lib/pwa/pwaPrefs';

export function usePwa() {
  useEffect(() => {
    if (!import.meta.env.DEV || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch((error) => console.warn('Failed to unregister dev service workers', error));

    if ('caches' in window) {
      caches.keys()
        .then((cacheKeys) => Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey))))
        .catch((error) => console.warn('Failed to clear dev caches', error));
    }
  }, []);

  // PWA Service Worker Hook
  const {
    needRefresh: [updateAvailable, setUpdateAvailable],
    updateServiceWorker: applyUpdate,
  } = useRegisterSW({
    onRegistered(r) {
      // Auto-check for updates every hour if needed
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  // Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    // Re-evaluate banner visibility when states change
    const shouldShow = shouldShowInstallBanner({ canInstall, isInstalled });
    setShowBanner(shouldShow);
  }, [canInstall, isInstalled]);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissBanner = useCallback(() => {
    dismissInstallBanner();
    setShowBanner(false);
  }, []);

  return {
    isInstalled,
    canInstall,
    showBanner,
    updateAvailable,
    promptInstall,
    applyUpdate,
    dismissInstallPrompt: handleDismissBanner
  };
}
