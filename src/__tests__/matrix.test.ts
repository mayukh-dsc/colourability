import { describe, expect, it } from 'vitest';
import { FILTERS } from '../filters/index.js';
import {
  GRAYSCALE,
  IDENTITY_MATRIX,
  interpolateMatrix,
  parseMatrixValues,
} from '../matrix.js';

describe('FILTERS', () => {
  it('has expected built-in count', () => {
    expect(Object.keys(FILTERS).length).toBe(9);
  });

  it.each(Object.keys(FILTERS))('%s has 20 valid coefficients', (name) => {
    const m = FILTERS[name];
    if (m === undefined) {
      throw new Error(`missing preset ${name}`);
    }
    const coeffs = parseMatrixValues(m);
    expect(coeffs.length).toBe(20);
  });

  it('uses namespaced ids (category/subname)', () => {
    for (const key of Object.keys(FILTERS)) {
      expect(key).toMatch(/^[a-zA-Z]+\/[a-zA-Z0-9]+$/u);
    }
  });
});

describe('interpolateMatrix', () => {
  it('returns identity at t=0', () => {
    expect(interpolateMatrix(GRAYSCALE, 0)).toBe(IDENTITY_MATRIX);
  });

  it('returns original matrix at t=1', () => {
    expect(parseMatrixValues(interpolateMatrix(GRAYSCALE, 1))).toEqual(parseMatrixValues(GRAYSCALE));
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
