import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppData } from '../hooks/useAppData';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getSyncPrefs, updateSyncPrefs, markLocalUploadApproved, dismissInitialSyncPrompt } from '../lib/sync/syncPrefs';
import { collectLocalSyncRecords } from '../lib/sync/syncMapper';
import { fetchCloudRecords, upsertCloudRecords, fetchSyncState, updateSyncState } from '../lib/sync/firebaseSyncService';
import { importGuestDataToActiveUser } from '../lib/storage/scopeMigration';
import { resolveSyncConflicts } from '../lib/sync/conflictResolution';
import { applyCloudRecordsToLocalStorage } from '../lib/sync/applyCloudData';
import { useToast } from '../hooks/useToast';
import { getActiveStorageScope } from '../lib/storage/storageScope';
import { hasActiveScopeBusinessData, hasGuestBusinessData } from '../lib/storage/scopeDataInspection';

export const SyncContext = createContext(null);

export const SyncProvider = ({ children }) => {
  const { user, isAuthenticated, isFirebaseReady, isGuest } = useAuth();
  const { refreshData, ...appData } = useAppData();
  const { isOnline } = useNetworkStatus();
  const { addToast } = useToast();

  const [syncStatus, setSyncStatus] = useState('offline'); // guest, offline, not_configured, ready, syncing, synced, error, conflict_warning, local_unapproved
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [lastPushAt, setLastPushAt] = useState(null);
  const [lastPullAt, setLastPullAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState(null);
  const [syncPrefs, setSyncPrefsState] = useState(getSyncPrefs());
  
  const [showInitialPrompt, setShowInitialPrompt] = useState(false);
  const [initialPromptMode, setInitialPromptMode] = useState(null); // null, "upload_user_data", "import_guest_data"

  // Reset initial check when user changes
  useEffect(() => {
    setShowInitialPrompt(false);
    setInitialPromptMode(null);
    setSyncPrefsState(getSyncPrefs());
  }, [user?.uid]);

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

    // Check if logged in but not approved yet
    if (isAuthenticated && !syncPrefs.localUploadApprovedAt) {
      setSyncStatus('local_unapproved');
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
  }, [isFirebaseReady, isGuest, isAuthenticated, isOnline, isSyncing, lastSyncAt, syncPrefs.localUploadApprovedAt]);

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

  // Initial Sync Prompt / Auto-approve Logic
  useEffect(() => {
    if (user && isFirebaseReady) {
      const scope = getActiveStorageScope();
      // Ensure scope has switched to user.uid before running checks
      if (scope.type !== 'user' || scope.uid !== user.uid) {
        return;
      }

      const prefs = getSyncPrefs();
      if (prefs.localUploadApprovedAt || prefs.initialSyncPromptDismissedAt) {
        setShowInitialPrompt(false);
        setInitialPromptMode(null);
        return;
      }

      const hasUser = hasActiveScopeBusinessData();
      const hasGuest = hasGuestBusinessData();

      if (hasUser) {
        setInitialPromptMode('upload_user_data');
        setShowInitialPrompt(true);
      } else if (hasGuest) {
        setInitialPromptMode('import_guest_data');
        setShowInitialPrompt(true);
      } else {
        // Both are empty! Auto-approve if online
        if (isOnline) {
          markLocalUploadApproved();
          setSyncPrefsState(getSyncPrefs());
          setShowInitialPrompt(false);
          setInitialPromptMode(null);
          if (import.meta.env.DEV) {
            console.debug('[Sync] Auto-approved empty user scope for future sync.');
          }
        }
      }
    }
  }, [user, isFirebaseReady, isOnline, syncPrefs.localUploadApprovedAt, syncPrefs.initialSyncPromptDismissedAt]);

  const handleDismissInitialPrompt = () => {
    dismissInitialSyncPrompt();
    setSyncPrefsState(getSyncPrefs());
    setShowInitialPrompt(false);
    setInitialPromptMode(null);
  };

  const handleApproveLocalUpload = async () => {
    if (initialPromptMode === 'import_guest_data') {
      importGuestDataToActiveUser(); // Safely merges guest data to active user
      refreshData(); // Refresh appData to reflect merged data
    }
    
    markLocalUploadApproved();
    setSyncPrefsState(getSyncPrefs());
    setShowInitialPrompt(false);
    setInitialPromptMode(null);
    
    // Slight delay to ensure appData is refreshed before push
    setTimeout(() => syncNow({ mode: 'push' }), 500);
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
      const scope = getActiveStorageScope();
      if (scope.type !== 'user' || scope.uid !== user.uid) {
        const errorMsg = `Scope mismatch: active scope uid (${scope.uid || 'null'}) does not match user uid (${user.uid})`;
        console.error('[Sync] Sync aborted:', errorMsg);
        summary.errors.push(errorMsg);
        summary.success = false;
        setSyncSummary(summary);
        setSyncStatus('error');
        setIsSyncing(false);
        return summary;
      }

      const localRecords = collectLocalSyncRecords(appData);

      if (import.meta.env.DEV) {
        console.debug('[Sync] Sync details:', {
          activeScope: scope.type,
          uid: scope.uid,
          localRecordCount: localRecords.length,
          mode
        });
      }
      
      if (mode === 'push') {
        const res = await upsertCloudRecords(user.uid, localRecords);
        if (res.success) {
          summary.pushedCount = localRecords.length;
          setLastPushAt(new Date().toISOString());
        }
      } else if (mode === 'pull') {
        const cloudRecords = await fetchCloudRecords(user.uid);
        const hasChanges = applyCloudRecordsToLocalStorage(cloudRecords, { expectedUid: user.uid });
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
          const hasChanges = applyCloudRecordsToLocalStorage(resolvedToLocal, { expectedUid: user.uid });
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

      if (import.meta.env.DEV) {
        console.debug('[Sync] Sync completed successfully:', {
          pushedCount: summary.pushedCount,
          pulledCount: summary.pulledCount,
          conflictCount: summary.conflictCount
        });
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
    let skipReason = null;

    if (!user) skipReason = 'user not authenticated';
    else if (!user.uid) skipReason = 'uid missing';
    else if (!isFirebaseReady) skipReason = 'Firebase not ready';
    else if (!isOnline) skipReason = 'network offline';
    else if (!syncPrefs.autoSyncEnabled) skipReason = 'autoSyncEnabled false';
    else if (!syncPrefs.localUploadApprovedAt) skipReason = 'localUploadApprovedAt missing';
    else if (isSyncing) skipReason = 'already syncing';
    else {
      const scope = getActiveStorageScope();
      if (scope.type !== 'user') skipReason = 'active scope is not user';
      else if (scope.uid !== user.uid) skipReason = 'active scope uid mismatch';
    }

    if (skipReason) {
      if (import.meta.env.DEV) {
        console.debug('[Sync] Auto sync skipped:', skipReason);
      }
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      if (import.meta.env.DEV) {
        console.debug('[Sync] Triggering auto sync (push)...');
      }
      syncNow({ mode: 'push' }).catch(err => console.warn('Auto sync failed', err));
    }, 5000); // 5 seconds debounce

    return () => clearTimeout(debounceTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appData, user, isOnline, syncPrefs.autoSyncEnabled, syncPrefs.localUploadApprovedAt, isFirebaseReady]);

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
    initialPromptMode,
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
