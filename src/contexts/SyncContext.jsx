import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppData } from '../hooks/useAppData';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getSyncPrefs, updateSyncPrefs, shouldShowInitialSyncPrompt, markLocalUploadApproved, dismissInitialSyncPrompt } from '../lib/sync/syncPrefs';
import { collectLocalSyncRecords } from '../lib/sync/syncMapper';
import { fetchCloudRecords, upsertCloudRecords, fetchSyncState, updateSyncState } from '../lib/sync/firebaseSyncService';
import { resolveSyncConflicts } from '../lib/sync/conflictResolution';
import { applyCloudRecordsToLocalStorage } from '../lib/sync/applyCloudData';
import { useToast } from '../hooks/useToast';

export const SyncContext = createContext(null);

export const SyncProvider = ({ children }) => {
  const { user, isAuthenticated, isFirebaseReady, isGuest } = useAuth();
  const { refreshData, ...appData } = useAppData();
  const { isOnline } = useNetworkStatus();
  const { addToast } = useToast();

  const [syncStatus, setSyncStatus] = useState('offline'); // guest, offline, not_configured, ready, syncing, synced, error, conflict_warning
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [lastPushAt, setLastPushAt] = useState(null);
  const [lastPullAt, setLastPullAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState(null);
  const [syncPrefs, setSyncPrefsState] = useState(getSyncPrefs());
  
  const [showInitialPrompt, setShowInitialPrompt] = useState(false);
  const initialDataCheckDone = useRef(false);

  // Status computation
  useEffect(() => {
    if (!isFirebaseReady) {
      setSyncStatus('not_configured');
      return;
    }
    if (isGuest) {
      setSyncStatus('guest');
      return;
    }
    if (!isOnline) {
      setSyncStatus('offline');
      return;
    }
    if (isSyncing) {
      setSyncStatus('syncing');
      return;
    }
    // If we have a recent sync (last 5 mins) we can say synced
    if (lastSyncAt) {
      const diff = new Date() - new Date(lastSyncAt);
      if (diff < 5 * 60 * 1000) {
        setSyncStatus('synced');
        return;
      }
    }
    setSyncStatus('ready');
  }, [isFirebaseReady, isGuest, isOnline, isSyncing, lastSyncAt]);

  // Fetch sync state when user changes
  useEffect(() => {
    if (user && isOnline) {
      fetchSyncState(user.uid).then(state => {
        if (state) {
          setLastSyncAt(state.lastSyncAt);
          setLastPushAt(state.lastPushAt);
          setLastPullAt(state.lastPullAt);
        }
      });
    }
  }, [user, isOnline]);

  // Initial Sync Prompt Logic
  useEffect(() => {
    if (user && !initialDataCheckDone.current) {
      initialDataCheckDone.current = true;
      const localRecords = collectLocalSyncRecords(appData);
      const hasLocalData = localRecords.length > 0;
      
      if (shouldShowInitialSyncPrompt({ isAuthenticated: true, hasLocalData })) {
        setShowInitialPrompt(true);
      }
    }
  }, [user, appData]);

  const handleDismissInitialPrompt = () => {
    dismissInitialSyncPrompt();
    setSyncPrefsState(getSyncPrefs());
    setShowInitialPrompt(false);
  };

  const handleApproveLocalUpload = async () => {
    markLocalUploadApproved();
    setSyncPrefsState(getSyncPrefs());
    setShowInitialPrompt(false);
    await syncNow({ mode: 'push' });
  };

  const setAutoSyncEnabled = (enabled) => {
    updateSyncPrefs({ autoSyncEnabled: enabled });
    setSyncPrefsState(getSyncPrefs());
  };

  const syncNow = async ({ mode = 'bidirectional' } = {}) => {
    if (!user || !isOnline || !isFirebaseReady || isSyncing) return { success: false };
    
    setIsSyncing(true);
    let summary = { pushedCount: 0, pulledCount: 0, conflictCount: 0, errors: [] };

    try {
      const localRecords = collectLocalSyncRecords(appData);
      
      if (mode === 'push') {
        const res = await upsertCloudRecords(user.uid, localRecords);
        if (res.success) {
          summary.pushedCount = localRecords.length;
          setLastPushAt(new Date().toISOString());
        }
      } else if (mode === 'pull') {
        const cloudRecords = await fetchCloudRecords(user.uid);
        const hasChanges = applyCloudRecordsToLocalStorage(cloudRecords);
        if (hasChanges) {
          refreshData(); // trigger AppDataContext reload
        }
        summary.pulledCount = cloudRecords.length;
        setLastPullAt(new Date().toISOString());
      } else {
        // bidirectional
        const cloudRecords = await fetchCloudRecords(user.uid);
        const { resolvedToCloud, resolvedToLocal, conflictCount } = resolveSyncConflicts(localRecords, cloudRecords);
        
        summary.conflictCount = conflictCount;
        
        if (resolvedToCloud.length > 0) {
          await upsertCloudRecords(user.uid, resolvedToCloud);
          summary.pushedCount = resolvedToCloud.length;
          setLastPushAt(new Date().toISOString());
        }
        
        if (resolvedToLocal.length > 0) {
          const hasChanges = applyCloudRecordsToLocalStorage(resolvedToLocal);
          if (hasChanges) refreshData();
          summary.pulledCount = resolvedToLocal.length;
          setLastPullAt(new Date().toISOString());
        }
      }

      const now = new Date().toISOString();
      setLastSyncAt(now);
      await updateSyncState(user.uid, { lastSyncAt: now });
      
      summary.success = true;
      setSyncSummary(summary);
      
      if (summary.conflictCount > 0) {
        setSyncStatus('conflict_warning');
      }

      return summary;
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      summary.errors.push(error.message);
      summary.success = false;
      setSyncSummary(summary);
      return summary;
    } finally {
      setIsSyncing(false);
    }
  };

  // Light Auto Sync (Debounced)
  const debounceTimer = useRef(null);
  useEffect(() => {
    if (!user || !isOnline || !syncPrefs.autoSyncEnabled || !syncPrefs.localUploadApprovedAt) return;
    
    // We only trigger auto-sync if we are not already syncing
    if (isSyncing) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      // Background bidirectional sync
      syncNow({ mode: 'push' }).catch(err => console.warn('Auto sync failed', err));
    }, 5000); // 5 seconds debounce

    return () => clearTimeout(debounceTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appData, user, isOnline, syncPrefs.autoSyncEnabled, syncPrefs.localUploadApprovedAt]);

  const value = {
    syncStatus,
    lastSyncAt,
    lastPushAt,
    lastPullAt,
    isSyncing,
    syncSummary,
    syncNow,
    pushLocalToCloud: () => syncNow({ mode: 'push' }),
    pullCloudToLocal: () => syncNow({ mode: 'pull' }),
    showInitialPrompt,
    promptInitialSync: handleApproveLocalUpload,
    dismissInitialSyncPrompt: handleDismissInitialPrompt,
    autoSyncEnabled: syncPrefs.autoSyncEnabled,
    setAutoSyncEnabled
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};
