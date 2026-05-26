import { describe, it, expect } from 'vitest';
import { compareRecordFreshness, resolveRecordConflict } from '../lib/sync/conflictResolution';

describe('conflictResolution', () => {
  it('should prefer record with latest updatedAt', () => {
    const local = { localUpdatedAt: '2023-01-02T00:00:00Z' };
    const cloud = { localUpdatedAt: '2023-01-01T00:00:00Z' };
    
    expect(compareRecordFreshness(local, cloud)).toBe('local');
    expect(compareRecordFreshness(cloud, local)).toBe('cloud');
    
    const winner = resolveRecordConflict(local, cloud);
    expect(winner).toBe(local);
  });

  it('should prefer local when timestamps are exactly equal', () => {
    const local = { localUpdatedAt: '2023-01-01T00:00:00Z', testVal: 'L' };
    const cloud = { localUpdatedAt: '2023-01-01T00:00:00Z', testVal: 'C' };
    
    expect(compareRecordFreshness(local, cloud)).toBe('local');
  });

  it('should handle missing timestamps safely', () => {
    const local = { localUpdatedAt: null };
    const cloud = { localUpdatedAt: '2023-01-01T00:00:00Z' };
    
    expect(compareRecordFreshness(local, cloud)).toBe('cloud');
  });

  it('should respect deletedAt over updatedAt', () => {
    // Cloud deleted it after local updated it
    const local = { localUpdatedAt: '2023-01-02T00:00:00Z', deletedAt: null };
    const cloud = { localUpdatedAt: '2023-01-01T00:00:00Z', deletedAt: '2023-01-03T00:00:00Z' };
    
    expect(compareRecordFreshness(local, cloud)).toBe('cloud');
  });

  it('should prefer latest deletedAt if both are deleted', () => {
    const local = { deletedAt: '2023-01-02T00:00:00Z' };
    const cloud = { deletedAt: '2023-01-01T00:00:00Z' };
    
    expect(compareRecordFreshness(local, cloud)).toBe('local');
  });

  it('should merge active record payloads on conflict', () => {
    const local = {
      recordType: 'recipes',
      localUpdatedAt: '2023-01-02T00:00:00Z',
      payload: {
        name: 'Donat Coklat',
        ingredients: [
          { id: '1', ingredientId: 'ing-1', usedQuantity: 100 }
        ],
        extraCosts: []
      }
    };
    const cloud = {
      recordType: 'recipes',
      localUpdatedAt: '2023-01-01T00:00:00Z',
      payload: {
        name: 'Donat Coklat Enak',
        ingredients: [
          { id: '2', ingredientId: 'ing-2', usedQuantity: 200 }
        ],
        extraCosts: [
          { id: 'cost-1', name: 'Gas', amount: 5000 }
        ]
      }
    };

    const result = resolveRecordConflict(local, cloud);
    // Should merge the ingredient lists (containing both ing-1 and ing-2)
    expect(result.payload.ingredients.length).toBe(2);
    expect(result.payload.ingredients.some(i => i.ingredientId === 'ing-1')).toBe(true);
    expect(result.payload.ingredients.some(i => i.ingredientId === 'ing-2')).toBe(true);
    
    // Should merge extraCosts
    expect(result.payload.extraCosts.length).toBe(1);
    expect(result.payload.extraCosts[0].name).toBe('Gas');

    // Should preserve name from local as it is newer
    expect(result.payload.name).toBe('Donat Coklat');
  });
});
