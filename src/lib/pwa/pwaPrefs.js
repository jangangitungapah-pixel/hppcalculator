const PWA_PREFS_KEY = 'modalin:v1:pwaPrefs';

const defaultPrefs = {
  installBannerDismissedAt: null,
  installBannerDismissCount: 0,
  lastUpdatePromptAt: null
};

export function getPwaPrefs() {
  try {
    const raw = localStorage.getItem(PWA_PREFS_KEY);
    if (!raw) return { ...defaultPrefs };
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Failed to read PWA prefs:', error);
    return { ...defaultPrefs };
  }
}

export function updatePwaPrefs(partial) {
  try {
    const current = getPwaPrefs();
    const updated = { ...current, ...partial };
    localStorage.setItem(PWA_PREFS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to update PWA prefs:', error);
  }
}

export function dismissInstallBanner() {
  const current = getPwaPrefs();
  updatePwaPrefs({
    installBannerDismissedAt: new Date().toISOString(),
    installBannerDismissCount: (current.installBannerDismissCount || 0) + 1
  });
}

export function shouldShowInstallBanner({ canInstall, isInstalled }) {
  if (isInstalled || !canInstall) return false;

  const prefs = getPwaPrefs();
  if (!prefs.installBannerDismissedAt) return true;

  const dismissedAt = new Date(prefs.installBannerDismissedAt);
  const now = new Date();
  const diffTime = Math.abs(now - dismissedAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  // Show again after 7 days if dismissed
  return diffDays >= 7;
}
