import { describe, expect, it } from 'vitest';
import { buildModalinBackup } from '../lib/dataPortability/backupBuilder';
import { importModalinBackup } from '../lib/dataPortability/backupImporter';
import { validateBackupFile } from '../lib/dataPortability/backupValidator';

describe('inventory backup', () => {
  it('backup include inventory', () => {
    const backup = buildModalinBackup({
      calculations: [],
      ingredients: [],
      recipes: [],
      products: [],
      channelProfiles: [],
      pricingSimulations: [],
      bundleSimulations: [],
      inventorySettings: [{ ingredientId: 'ing-1', stockUnit: 'kg', minimumStock: 2 }],
      stockMovements: [{ id: 'mov-1', ingredientId: 'ing-1', type: 'stock_in', quantity: 2, unit: 'kg' }],
      settings: { currency: 'IDR' }
    });

    expect(backup.data.inventorySettings).toHaveLength(1);
    expect(backup.data.stockMovements).toHaveLength(1);
    expect(backup.metadata.modules.inventorySettings).toBe(1);
    expect(backup.metadata.modules.stockMovements).toBe(1);
    expect(validateBackupFile(backup).isValid).toBe(true);
  });

  it('import merge memakai ingredientId untuk inventorySettings', () => {
    const result = importModalinBackup(
      { data: { inventorySettings: [{ ingredientId: 'ing-new', stockUnit: 'kg', minimumStock: 1 }] } },
      { inventorySettings: [{ ingredientId: 'ing-old', stockUnit: 'kg', minimumStock: 2 }] },
      { mode: 'merge', includeSettings: false }
    );

    expect(result.success).toBe(true);
    expect(result.importedCounts.inventorySettings).toBe(1);
  });
});
