import { describe, it, expect } from 'vitest';
import { 
  collectLocalSyncRecords, 
  mapLocalModuleToSyncRecords, 
  groupSyncRecordsByType,
  mapSettingsToSyncRecord
} from '../lib/sync/syncMapper';
import { SYNC_RECORD_TYPES } from '../lib/sync/syncTypes';

describe('syncMapper', () => {
  it('should map local module to sync records', () => {
    const mockCalculations = [
      { id: 'calc_1', result: {}, updatedAt: '2023-01-01T00:00:00Z' }
    ];
    
    const records = mapLocalModuleToSyncRecords('calculations', mockCalculations);
    
    expect(records).toHaveLength(1);
    expect(records[0].recordType).toBe(SYNC_RECORD_TYPES.CALCULATION);
    expect(records[0].recordId).toBe('calc_1');
    expect(records[0].localUpdatedAt).toBe('2023-01-01T00:00:00Z');
    expect(records[0].payload).toEqual(mockCalculations[0]);
  });

  it('should properly map settings', () => {
    const mockSettings = { currency: 'IDR', roundingStep: 500, updatedAt: '2023-01-01T00:00:00Z' };
    const record = mapSettingsToSyncRecord(mockSettings);
    
    expect(record.recordType).toBe(SYNC_RECORD_TYPES.SETTINGS);
    expect(record.recordId).toBe('settings');
    expect(record.localUpdatedAt).toBe('2023-01-01T00:00:00Z');
    expect(record.payload).toEqual(mockSettings);
  });

  it('should collect local sync records skipping unknown modules', () => {
    const appData = {
      calculations: [{ id: '1' }],
      ingredients: [{ id: '2' }],
      settings: { currency: 'IDR' },
      draft: { someDraft: true } // should be skipped
    };

    const records = collectLocalSyncRecords(appData);
    
    // 1 calc + 1 ingredient + 1 settings = 3 records
    expect(records).toHaveLength(3);
    
    const types = records.map(r => r.recordType);
    expect(types).toContain(SYNC_RECORD_TYPES.CALCULATION);
    expect(types).toContain(SYNC_RECORD_TYPES.INGREDIENT);
    expect(types).toContain(SYNC_RECORD_TYPES.SETTINGS);
  });

  it('should group sync records by type', () => {
    const records = [
      { recordType: SYNC_RECORD_TYPES.CALCULATION, recordId: '1' },
      { recordType: SYNC_RECORD_TYPES.CALCULATION, recordId: '2' },
      { recordType: SYNC_RECORD_TYPES.INGREDIENT, recordId: '3' }
    ];

    const grouped = groupSyncRecordsByType(records);
    
    expect(grouped[SYNC_RECORD_TYPES.CALCULATION]).toHaveLength(2);
    expect(grouped[SYNC_RECORD_TYPES.INGREDIENT]).toHaveLength(1);
  });
});
