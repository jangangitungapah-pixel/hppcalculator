import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildModalinBackup } from '../lib/dataPortability/backupBuilder';
import { applyImportedData } from '../lib/dataPortability/backupImporter';
import { validateBackupFile } from '../lib/dataPortability/backupValidator';
import { setActiveStorageScope } from '../lib/storage/storageScope';
import { getScopedJson } from '../lib/storage/localStorageClient';
import { STORAGE_KEYS } from '../lib/storage/storageKeys';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(global, 'window', { value: { localStorage: localStorageMock }, writable: true });

describe('purchaseBackup', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('includes supplier and purchase data in backup exports and restores them on import', () => {
    const appData = {
      suppliers: [{ id: 'sup-1', name: 'Toko A', type: 'market' }],
      purchaseLogs: [{ id: 'log-1', supplierId: 'sup-1', totalAmount: 10000 }],
      purchaseItems: [{ id: 'item-1', purchaseLogId: 'log-1', ingredientId: 'ing-1', quantity: 1, totalPrice: 10000 }]
    };

    // 1. Export
    const backup = buildModalinBackup(appData);
    expect(backup.data.suppliers.length).toBe(1);
    expect(backup.data.purchaseLogs.length).toBe(1);
    expect(backup.data.purchaseItems.length).toBe(1);

    // 2. Validate
    const validation = validateBackupFile(backup);
    expect(validation.isValid).toBe(true);

    // 3. Import
    const result = applyImportedData(backup.data, 'replace', false, {});
    expect(result.replacedCounts.suppliers).toBe(1);
    expect(result.replacedCounts.purchaseLogs).toBe(1);
    expect(result.replacedCounts.purchaseItems).toBe(1);

    // Verify localStorage has the restored data
    const restoredSuppliers = getScopedJson(STORAGE_KEYS.SUPPLIERS);
    expect(restoredSuppliers.length).toBe(1);
    expect(restoredSuppliers[0].name).toBe('Toko A');
  });
});
