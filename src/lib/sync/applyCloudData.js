import { SYNC_RECORD_TYPES_TO_MODULE, SYNC_RECORD_TYPES } from './syncTypes';
import { mapSyncRecordToLocal } from './syncMapper';
import { getScopedJson, setScopedJson } from '../storage/localStorageClient';
import { getActiveStorageScope } from '../storage/storageScope';

export const mergeModuleRecords = (localRecords, incomingRecords) => {
  const localMap = new Map(localRecords.map(r => [r.id, r]));
  
  incomingRecords.forEach(inc => {
    const payload = mapSyncRecordToLocal(inc);
    // If it's marked as deleted, we either soft delete it locally or just omit it
    // For Phase 13, we soft delete it if it exists
    if (inc.deletedAt) {
      if (localMap.has(inc.recordId)) {
        const existing = localMap.get(inc.recordId);
        localMap.set(inc.recordId, { ...existing, deletedAt: inc.deletedAt });
      }
    } else {
      localMap.set(inc.recordId, payload);
    }
  });

  return Array.from(localMap.values());
};

export const applyCloudRecordsToLocalStorage = (resolvedToLocalRecords, { expectedUid } = {}) => {
  if (!resolvedToLocalRecords || resolvedToLocalRecords.length === 0) return false;

  const scope = getActiveStorageScope();
  if (scope.type !== 'user' || !scope.uid || scope.uid !== expectedUid) {
    console.warn(`[Sync] applyCloudRecordsToLocalStorage aborted: scope mismatch. Active scope:`, scope, `Expected uid:`, expectedUid);
    return false;
  }

  let hasChanges = false;

  // Group by type
  const grouped = resolvedToLocalRecords.reduce((acc, record) => {
    if (!acc[record.recordType]) acc[record.recordType] = [];
    acc[record.recordType].push(record);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([recordType, records]) => {
    if (recordType === SYNC_RECORD_TYPES.SETTINGS) {
      const settingsRecord = records[0]; // should only be one
      if (settingsRecord && !settingsRecord.deletedAt) {
        setScopedJson('modalin:v1:settings', settingsRecord.payload);
        hasChanges = true;
      }
    } else {
      const moduleName = SYNC_RECORD_TYPES_TO_MODULE[recordType];
      if (moduleName) {
        const storageKey = `modalin:v1:${moduleName}`;
        const existing = getScopedJson(storageKey, []);
        
        const merged = mergeModuleRecords(existing, records);
        setScopedJson(storageKey, merged);
        hasChanges = true;
      }
    }
  });

  return hasChanges;
};
