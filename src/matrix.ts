/**
 * BT.709 luminance grayscale in linearRGB (via feColorMatrix + color-interpolation-filters="linearRGB").
 */
export const GRAYSCALE =
  '0.2126 0.7152 0.0722 0 0 ' +
  '0.2126 0.7152 0.0722 0 0 ' +
  '0.2126 0.7152 0.0722 0 0 ' +
  '0 0 0 1 0';

/**
 * Viénot, Brettel & Mollon (1999) — dichromacy simulation in linear RGB.
 * Source: DaltonLens / libDaltonLens (protanopia, deuteranopia).
 */
export const SIMULATE_MATRICES = {
  protanopia:
    '0.10889 0.89111 -0.00000 0 0 ' +
    '0.10889 0.89111 0.00000 0 0 ' +
    '0.00447 -0.00447 1.00000 0 0 ' +
    '0 0 0 1 0',
  deuteranopia:
    '0.29031 0.70969 -0.00000 0 0 ' +
    '0.29031 0.70969 -0.00000 0 0 ' +
    '-0.02197 0.02197 1.00000 0 0 ' +
    '0 0 0 1 0',
  /** Machado et al. (2009) single-matrix tritanopia approximation (not Brettel’s two-plane model). */
  tritanopia:
    '0.95 0.05 0 0 0 ' +
    '0 0.433 0.567 0 0 ' +
    '0 0.475 0.525 0 0 ' +
    '0 0 0 1 0',
} as const;

/**
 * Linear compensation heuristic: M_dal = 2I − M_sim (same RGB row structure as simulation).
 * Amplifies contrast along confusion lines; not a full LMS daltonize pipeline.
 */
export const DALTONIZE_MATRICES = {
  protanopia:
    '1.89111 -0.89111 0 0 0 ' +
    '-0.10889 1.10889 0 0 0 ' +
    '-0.00447 0.00447 1 0 0 ' +
    '0 0 0 1 0',
  deuteranopia:
    '1.70969 -0.70969 0 0 0 ' +
    '-0.29031 1.29031 0 0 0 ' +
    '0.02197 -0.02197 1 0 0 ' +
    '0 0 0 1 0',
  tritanopia:
    '1.05 -0.05 0 0 0 ' +
    '0 1.567 -0.567 0 0 ' +
    '0 -0.475 1.475 0 0 ' +
    '0 0 0 1 0',
} as const;

/** 20-value row-major identity feColorMatrix. */
export const IDENTITY_MATRIX =
  '1 0 0 0 0 ' + '0 1 0 0 0 ' + '0 0 1 0 0 ' + '0 0 0 1 0';

/** Preset name → feColorMatrix `values` string (20 coefficients). */
export const FILTERS: Record<string, string> = {
  grayscale: GRAYSCALE,
  'simulate-protanopia': SIMULATE_MATRICES.protanopia,
  'simulate-deuteranopia': SIMULATE_MATRICES.deuteranopia,
  'simulate-tritanopia': SIMULATE_MATRICES.tritanopia,
  'daltonize-protanopia': DALTONIZE_MATRICES.protanopia,
  'daltonize-deuteranopia': DALTONIZE_MATRICES.deuteranopia,
  'daltonize-tritanopia': DALTONIZE_MATRICES.tritanopia,
};

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
      throw new TypeError('overlay-filter: internal matrix index error');
    }
    out.push(a + (b - a) * tt);
  }
  return formatMatrixValues(out);
}
