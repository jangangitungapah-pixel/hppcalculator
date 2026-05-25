import React, { createContext, useContext } from 'react';
import { usePwa } from '../hooks/usePwa';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const PwaContext = createContext(null);

export function PwaProvider({ children }) {
  const pwaState = usePwa();
  const networkState = useNetworkStatus();

  return (
    <PwaContext.Provider value={{ ...pwaState, ...networkState }}>
      {children}
    </PwaContext.Provider>
  );
}

export function usePwaContext() {
  const context = useContext(PwaContext);
  if (!context) {
    // Provide a safe fallback if used outside provider
    return {
      isInstalled: false,
      canInstall: false,
      showBanner: false,
      updateAvailable: false,
      promptInstall: async () => {},
      applyUpdate: () => {},
      dismissInstallPrompt: () => {},
      isOnline: true,
      isOffline: false
    };
  }
  return context;
}
