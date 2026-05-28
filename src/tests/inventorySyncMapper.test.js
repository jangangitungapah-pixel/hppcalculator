import { describe, expect, it } from 'vitest';
import { collectLocalSyncRecords, mapLocalModuleToSyncRecords } from '../lib/sync/syncMapper';
import { SYNC_RECORD_TYPES } from '../lib/sync/syncTypes';

describe('inventory sync mapper', () => {
  it('menghasilkan record inventorySetting dan stockMovement', () => {
    const settingRecords = mapLocalModuleToSyncRecords('inventorySettings', [
      { ingredientId: 'ing-1', stockUnit: 'kg', updatedAt: '2026-05-01T00:00:00.000Z' }
    ]);
    const movementRecords = mapLocalModuleToSyncRecords('stockMovements', [
      { id: 'mov-1', ingredientId: 'ing-1', type: 'stock_in', quantity: 2, unit: 'kg' }
    ]);

    expect(settingRecords[0].recordType).toBe(SYNC_RECORD_TYPES.INVENTORY_SETTING);
    expect(settingRecords[0].recordId).toBe('ing-1');
    expect(movementRecords[0].recordType).toBe(SYNC_RECORD_TYPES.STOCK_MOVEMENT);
    expect(movementRecords[0].recordId).toBe('mov-1');
  });

  it('collectLocalSyncRecords include inventory modules', () => {
    const records = collectLocalSyncRecords({
      inventorySettings: [{ ingredientId: 'ing-1' }],
      stockMovements: [{ id: 'mov-1' }],
      settings: { currency: 'IDR' }
    });

    const types = records.map(record => record.recordType);
    expect(types).toContain(SYNC_RECORD_TYPES.INVENTORY_SETTING);
    expect(types).toContain(SYNC_RECORD_TYPES.STOCK_MOVEMENT);
  });
});
