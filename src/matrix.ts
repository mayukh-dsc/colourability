export { FILTERS, GRAYSCALE } from './filters/index.js';

/** 20-value row-major identity feColorMatrix. */
export const IDENTITY_MATRIX =
  '1 0 0 0 0 ' + '0 1 0 0 0 ' + '0 0 1 0 0 ' + '0 0 0 1 0';

const MATRIX_SIZE = 20;

export function parseMatrixValues(matrix: string): number[] {
  const parts = matrix.trim().split(/\s+/).filter((s) => s.length > 0);
  if (parts.length !== MATRIX_SIZE) {
    throw new TypeError(`Expected ${MATRIX_SIZE} matrix coefficients, got ${String(parts.length)}`);
  }
  const out: number[] = [];
  for (let i = 0; i < MATRIX_SIZE; i++) {
    const raw = parts[i];
    if (raw === undefined) {
      throw new TypeError(`Missing matrix coefficient at index ${String(i)}`);
    }
    const v = Number(raw);
    if (Number.isNaN(v)) {
      throw new TypeError(`Invalid matrix coefficient at index ${String(i)}`);
    }
    out.push(v);
  }
  return out;
}

/** Stable string form for SVG `values` (avoids float noise like 0.07220000000000004). */
function formatCoefficient(c: number): string {
  if (Object.is(c, -0)) {
    return '0';
  }
  const rounded = Math.round(c * 1e6) / 1e6;
  return String(rounded);
}

function formatMatrixValues(coeffs: readonly number[]): string {
  return coeffs.map(formatCoefficient).join(' ');
}

/**
 * Interpolates each coefficient between the identity matrix (t=0)
 * and the target matrix (t=1). Used by setIntensity().
 */
export function interpolateMatrix(matrix: string, t: number): string {
  const tt = Math.min(1, Math.max(0, t));
  const target = parseMatrixValues(matrix);
  const identity = parseMatrixValues(IDENTITY_MATRIX);
  const out: number[] = [];
  for (let i = 0; i < MATRIX_SIZE; i++) {
    const a = identity[i];
    const b = target[i];
    if (a === undefined || b === undefined) {
      throw new TypeError('colourability: internal matrix index error');
    }
    out.push(a + (b - a) * tt);
  }
  return formatMatrixValues(out);
}
