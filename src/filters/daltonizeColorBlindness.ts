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
