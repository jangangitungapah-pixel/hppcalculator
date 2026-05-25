import { LOCAL_MODULE_MAP, SYNC_RECORD_TYPES } from './syncTypes';

export const mapLocalModuleToSyncRecords = (moduleName, records) => {
  const recordType = LOCAL_MODULE_MAP[moduleName];
  if (!recordType) return [];

  return records.map(record => {
    // Default fallback dates
    const updatedAt = record.updatedAt || record.createdAt || new Date().toISOString();
    return {
      recordType,
      recordId: record.id,
      payload: record,
      localUpdatedAt: updatedAt,
      deletedAt: record.deletedAt || null
    };
  });
};

export const mapSettingsToSyncRecord = (settings) => {
  const updatedAt = settings.updatedAt || new Date().toISOString();
  return {
    recordType: SYNC_RECORD_TYPES.SETTINGS,
    recordId: 'settings',
    payload: settings,
    localUpdatedAt: updatedAt,
    deletedAt: null
  };
};

export const collectLocalSyncRecords = (appData) => {
  let allRecords = [];

  // Iterate valid modules
  Object.keys(LOCAL_MODULE_MAP).forEach(moduleName => {
    if (moduleName === 'settings') {
      if (appData.settings) {
        allRecords.push(mapSettingsToSyncRecord(appData.settings));
      }
    } else {
      const records = appData[moduleName] || [];
      const syncRecords = mapLocalModuleToSyncRecords(moduleName, records);
      allRecords = [...allRecords, ...syncRecords];
    }
  });

  return allRecords;
};

export const mapSyncRecordToLocal = (syncRecord) => {
  return syncRecord.payload;
};

export const groupSyncRecordsByType = (syncRecords) => {
  return syncRecords.reduce((acc, record) => {
    if (!acc[record.recordType]) {
      acc[record.recordType] = [];
    }
    acc[record.recordType].push(record);
    return acc;
  }, {});
};
