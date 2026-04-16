import { describe, expect, it } from 'vitest';
import {
  FILTERS,
  GRAYSCALE,
  IDENTITY_MATRIX,
  interpolateMatrix,
  parseMatrixValues,
} from '../matrix.js';

describe('FILTERS', () => {
  it('has exactly 7 presets', () => {
    expect(Object.keys(FILTERS).length).toBe(7);
  });

  it.each(Object.keys(FILTERS))('%s has 20 valid coefficients', (name) => {
    const m = FILTERS[name];
    if (m === undefined) {
      throw new Error(`missing preset ${name}`);
    }
    const coeffs = parseMatrixValues(m);
    expect(coeffs.length).toBe(20);
  });
});

describe('interpolateMatrix', () => {
  it('returns identity at t=0', () => {
    expect(interpolateMatrix(GRAYSCALE, 0)).toBe(IDENTITY_MATRIX);
  });

  it('returns original matrix at t=1', () => {
    expect(parseMatrixValues(interpolateMatrix(GRAYSCALE, 1))).toEqual(
      parseMatrixValues(GRAYSCALE),
    );
  });

  it('clamps t outside 0–1', () => {
    expect(interpolateMatrix(GRAYSCALE, -1)).toBe(IDENTITY_MATRIX);
    expect(interpolateMatrix(GRAYSCALE, 2)).toBe(GRAYSCALE);
  });
});

describe('parseMatrixValues', () => {
  it('rejects wrong length', () => {
    expect(() => parseMatrixValues('1 0 0')).toThrow(TypeError);
  });

  it('rejects NaN', () => {
    expect(() => parseMatrixValues(`${'0 '.repeat(19)}x`)).toThrow(TypeError);
  });
});
