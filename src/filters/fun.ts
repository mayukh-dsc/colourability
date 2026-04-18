/**
 * Stylized looks (linearRGB). Sepia uses a common sRGB sepia recipe; invert is RGB′ = 1 − RGB in filter linear space.
 */
export const FUN_MATRICES = {
  /** Warm brown cast (classic 3×3 sepia weights on RGB rows). */
  sepia:
    '0.393 0.769 0.189 0 0 ' +
    '0.349 0.686 0.168 0 0 ' +
    '0.272 0.534 0.131 0 0 ' +
    '0 0 0 1 0',
  /** Full RGB invert with per-channel +1 offset. */
  invert: '-1 0 0 0 1 ' + '0 -1 0 0 1 ' + '0 0 -1 0 1 ' + '0 0 0 1 0',
} as const;
