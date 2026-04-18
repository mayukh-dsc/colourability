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
