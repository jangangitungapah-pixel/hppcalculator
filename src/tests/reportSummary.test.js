import { describe, it, expect } from 'vitest';
import {
  calculateAverageMargin,
  countByStatus,
  getBestMarginItems,
  getWorstMarginItems,
  calculateReportSummary
} from '../lib/reports/reportSummary';

describe('Report Summary', () => {
  const mockItems = [
    { id: 1, marginPercent: 50, statusKey: 'excellent' },
    { id: 2, marginPercent: 10, statusKey: 'low' },
    { id: 3, marginPercent: -5, statusKey: 'loss' },
    { id: 4, marginPercent: null, statusKey: 'unknown' },
  ];

  it('calculates average margin correctly, ignoring nulls', () => {
    const avg = calculateAverageMargin(mockItems);
    expect(avg).toBe((50 + 10 - 5) / 3);
  });

  it('counts by status correctly', () => {
    const counts = countByStatus(mockItems);
    expect(counts.excellent).toBe(1);
    expect(counts.low).toBe(1);
    expect(counts.loss).toBe(1);
    expect(counts.unknown).toBe(1);
    expect(counts.okay).toBe(0);
  });

  it('gets best margin items sorted', () => {
    const best = getBestMarginItems(mockItems, 2);
    expect(best.length).toBe(2);
    expect(best[0].id).toBe(1);
    expect(best[1].id).toBe(2);
  });

  it('gets worst margin items sorted', () => {
    const worst = getWorstMarginItems(mockItems, 2);
    expect(worst.length).toBe(2);
    expect(worst[0].id).toBe(3);
    expect(worst[1].id).toBe(2);
  });

  it('handles empty arrays safely', () => {
    expect(calculateAverageMargin([])).toBe(0);
    const summary = calculateReportSummary([], {});
    expect(summary.totalItems).toBe(0);
    expect(summary.averageMargin).toBe(0);
  });
});
