import { describe, it, expect, beforeEach } from 'vitest';
import { getModuleHealth } from '../lib/dataPortability/storageHealth';
import { mergeArrayById } from '../lib/dataPortability/backupImporter';
import { buildCalculationsCsvRows } from '../lib/dataPortability/csvExportCenter';

describe('Data Portability: Health Checks', () => {
  it('correctly counts business records and invalid records', () => {
    const mockAppData = {
      calculations: [
        { id: '1', productName: 'Valid A' },
        { id: '2', productName: 'Valid B' },
        { productName: 'Invalid No ID' }, // invalid
        null // invalid
      ],
      ingredients: [],
      recipes: [
        { id: '3', name: 'Valid Recipe' }
      ],
      products: [],
      channelProfiles: [],
      pricingSimulations: [],
      bundleSimulations: []
    };

    const health = getModuleHealth(mockAppData);
    
    expect(health.totalBusinessRecords).toBe(5); // 4 in calc, 1 in recipes
    expect(health.totalInvalidRecords).toBe(2);
    expect(health.modules.calculations.count).toBe(4);
    expect(health.modules.calculations.invalidCount).toBe(2);
  });
});

describe('Data Portability: Backup Importer', () => {
  it('merges arrays by ID correctly, skipping duplicates', () => {
    const current = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];
    const incoming = [
      { id: '2', name: 'Item 2 Updated' }, // should be skipped in merge
      { id: '3', name: 'Item 3' }
    ];

    const merged = mergeArrayById(current, incoming);
    
    expect(merged.length).toBe(3);
    expect(merged[0].name).toBe('Item 1');
    expect(merged[1].name).toBe('Item 2'); // Original kept
    expect(merged[2].name).toBe('Item 3'); // New added
  });
});

describe('Data Portability: CSV Exporter', () => {
  it('formats calculation rows correctly', () => {
    const calc = [{
      id: '123',
      productName: 'Kopi Susu',
      createdAt: '2023-10-01',
      result: {
        hppPerUnit: 5000,
        sellingPrice: 15000,
        profitPerUnit: 10000,
        totalProfit: 100000,
        marginPercent: 66.67,
        status: 'Good'
      }
    }];

    const rows = buildCalculationsCsvRows(calc);
    
    expect(rows.length).toBe(1);
    expect(rows[0].productName).toBe('Kopi Susu');
    expect(rows[0].marginPercent).toBe(66.67);
  });
});
