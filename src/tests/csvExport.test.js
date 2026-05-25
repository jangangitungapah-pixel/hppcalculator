import { describe, it, expect } from 'vitest';
import {
  escapeCsvValue,
  convertRowsToCsv,
  buildProfitabilityCsvRows
} from '../lib/reports/csvExport';

describe('CSV Export', () => {
  it('escapes CSV values correctly', () => {
    expect(escapeCsvValue('Normal String')).toBe('Normal String');
    expect(escapeCsvValue('String, with comma')).toBe('"String, with comma"');
    expect(escapeCsvValue('String\nwith newline')).toBe('"String\nwith newline"');
    expect(escapeCsvValue('String with "quotes"')).toBe('"String with ""quotes"""');
    expect(escapeCsvValue(null)).toBe('');
    expect(escapeCsvValue(undefined)).toBe('');
    expect(escapeCsvValue(123)).toBe('123');
  });

  it('converts rows to CSV string', () => {
    const rows = [
      ['Name', 'Price'],
      ['Apple', 1000],
      ['"Special" Banana', 2000]
    ];
    
    const csv = convertRowsToCsv(rows);
    expect(csv).toContain('Name,Price');
    expect(csv).toContain('Apple,1000');
    expect(csv).toContain('"""Special"" Banana",2000');
  });

  it('builds profitability rows with correct headers', () => {
    const items = [
      { 
        type: 'product', 
        name: 'Test', 
        category: 'Food', 
        hppPerUnit: 100, 
        sellingPrice: 200, 
        profitPerUnit: 100, 
        marginPercent: 50, 
        statusKey: 'excellent' 
      }
    ];
    
    const rows = buildProfitabilityCsvRows(items);
    
    expect(rows.length).toBe(2); // header + 1 item
    expect(rows[0][0]).toBe('Tipe'); // check header
    expect(rows[1][0]).toBe('product');
    expect(rows[1][1]).toBe('Test');
    expect(rows[1][6]).toBe('50.00'); // margin formatted
  });

  it('handles empty data safely', () => {
    expect(convertRowsToCsv([])).toBe('');
    expect(buildProfitabilityCsvRows([])).toEqual([]);
  });
});
