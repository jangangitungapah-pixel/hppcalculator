import { describe, it, expect } from 'vitest';
import { preciseAdd, preciseSubtract, preciseMultiply, preciseDivide } from '../lib/calculations/rounding';
import { convertBetweenUnits, canConvertUnits } from '../lib/units/unitConversion';

describe('High-Precision Math & Unit Conversion', () => {
  describe('Precise Math Helpers', () => {
    it('avoids standard floating-point addition bugs (e.g. 0.1 + 0.2)', () => {
      expect(0.1 + 0.2).not.toBe(0.3); // standard JS fails this
      expect(preciseAdd(0.1, 0.2)).toBe(0.3); // our helper passes this
    });

    it('avoids standard floating-point subtraction bugs', () => {
      expect(0.3 - 0.2).not.toBe(0.1);
      expect(preciseSubtract(0.3, 0.2)).toBe(0.1);
    });

    it('avoids standard floating-point multiplication bugs', () => {
      expect(0.1 * 0.2).not.toBe(0.02);
      expect(preciseMultiply(0.1, 0.2)).toBe(0.02);
    });

    it('avoids standard floating-point division bugs', () => {
      expect(0.3 / 0.1).not.toBe(3); // standard JS fails this (returns 2.9999999999999996)
      expect(preciseDivide(0.3, 0.1)).toBe(3);
    });
  });

  describe('Culinary Unit Conversions', () => {
    it('converts between standard weight units (kg and grams)', () => {
      expect(convertBetweenUnits(1.5, 'kg', 'gram')).toBe(1500);
      expect(convertBetweenUnits(500, 'gram', 'kg')).toBe(0.5);
    });

    it('converts between weight ounces (oz) and grams', () => {
      expect(convertBetweenUnits(1, 'oz', 'gram')).toBe(28.3495);
      expect(convertBetweenUnits(28.3495, 'gram', 'oz')).toBe(1);
    });

    it('converts volume units (liter, ml, tbsp, tsp, cup, fl_oz)', () => {
      // 1 liter = 1000 ml
      expect(convertBetweenUnits(1, 'liter', 'ml')).toBe(1000);
      // 1 tbsp = 15 ml
      expect(convertBetweenUnits(2, 'tbsp', 'ml')).toBe(30);
      // 1 tsp = 5 ml
      expect(convertBetweenUnits(3, 'tsp', 'ml')).toBe(15);
      // 1 cup = 240 ml
      expect(convertBetweenUnits(2, 'cup', 'ml')).toBe(480);
      // 1 fl_oz = 29.5735 ml
      expect(convertBetweenUnits(10, 'fl_oz', 'ml')).toBe(295.735);
    });
  });

  describe('Density Weight-to-Volume Cross Conversions', () => {
    it('validates conversion compatibility based on density', () => {
      // Cannot convert kg to ml without density
      expect(canConvertUnits('kg', 'ml')).toBe(false);
      expect(canConvertUnits('kg', 'ml', null)).toBe(false);
      // Can convert with density
      expect(canConvertUnits('kg', 'ml', 0.92)).toBe(true);
      // Cannot convert count units (pcs) to weight/volume even with density
      expect(canConvertUnits('pcs', 'gram', 1.0)).toBe(false);
    });

    it('converts mass to volume using density (e.g. grams to ml)', () => {
      // Oil: density = 0.92 g/mL. 92 grams = 100 ml (Vol = Mass / Density)
      expect(convertBetweenUnits(92, 'gram', 'ml', 0.92)).toBe(100);
    });

    it('converts volume to mass using density (e.g. ml to grams)', () => {
      // Honey: density = 1.4 g/mL. 100 ml = 140 grams (Mass = Vol * Density)
      expect(convertBetweenUnits(100, 'ml', 'gram', 1.4)).toBe(140);
    });

    it('handles default density if null/invalid density is supplied', () => {
      // Should default to 1.0. 100 ml of water = 100 grams
      expect(convertBetweenUnits(100, 'ml', 'gram')).toBe(100);
    });
  });
});
