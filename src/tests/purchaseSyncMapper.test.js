import { describe, it, expect } from 'vitest';
import { mapLocalModuleToSyncRecords } from '../lib/sync/syncMapper';
import { SYNC_RECORD_TYPES } from '../lib/sync/syncTypes';

describe('purchaseSyncMapper', () => {
  it('maps local supplier and purchase objects to sync records', () => {
    const suppliers = [{ id: 'sup-1', name: 'Toko A', updatedAt: '2026-05-29T00:00:00Z' }];
    const logs = [{ id: 'log-1', supplierId: 'sup-1', totalAmount: 10000, updatedAt: '2026-05-29T00:00:00Z' }];
    
    // 1. Suppliers
    const supplierRecords = mapLocalModuleToSyncRecords('suppliers', suppliers);
    expect(supplierRecords.length).toBe(1);
    expect(supplierRecords[0].recordType).toBe(SYNC_RECORD_TYPES.SUPPLIER);
    expect(supplierRecords[0].recordId).toBe('sup-1');
    expect(supplierRecords[0].payload.name).toBe('Toko A');

    // 2. Purchase Logs
    const logRecords = mapLocalModuleToSyncRecords('purchaseLogs', logs);
    expect(logRecords.length).toBe(1);
    expect(logRecords[0].recordType).toBe(SYNC_RECORD_TYPES.PURCHASE_LOG);
    expect(logRecords[0].recordId).toBe('log-1');
    expect(logRecords[0].payload.totalAmount).toBe(10000);
  });
});
