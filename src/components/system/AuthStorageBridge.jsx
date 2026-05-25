import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { setActiveStorageScope } from '../../lib/storage/storageScope';
import { migrateGlobalDataToGuestScope } from '../../lib/storage/scopeMigration';

export const AuthStorageBridge = () => {
  const { user, isFirebaseReady } = useAuth();
  const { refreshData } = useAppData();

  useEffect(() => {
    // 1. Always ensure migration runs at least once per session on startup
    migrateGlobalDataToGuestScope();

    // 2. Set Active Scope based on Auth User
    if (user && user.uid) {
      setActiveStorageScope({ type: 'user', uid: user.uid });
    } else {
      setActiveStorageScope({ type: 'guest', uid: null });
    }

    // 3. Force AppData to reload from the new active scope's localStorage
    refreshData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, isFirebaseReady]);

  // This is a logic-only component, it renders nothing
  return null;
};
