import { DALTONIZE_MATRICES } from './daltonizeColorBlindness.js';
import { FUN_MATRICES } from './fun.js';
import { SIMULATE_MATRICES } from './simulateColorBlindness.js';
import { GRAYSCALE } from './visual.js';

/** Built-in preset id → 20-coefficient feColorMatrix `values` string (namespaced ids). */
export const FILTERS: Record<string, string> = {
  'visual/grayscale': GRAYSCALE,
  'simulateColorBlindness/protanopia': SIMULATE_MATRICES.protanopia,
  'simulateColorBlindness/deuteranopia': SIMULATE_MATRICES.deuteranopia,
  'simulateColorBlindness/tritanopia': SIMULATE_MATRICES.tritanopia,
  'daltonizeColorBlindness/protanopia': DALTONIZE_MATRICES.protanopia,
  'daltonizeColorBlindness/deuteranopia': DALTONIZE_MATRICES.deuteranopia,
  'daltonizeColorBlindness/tritanopia': DALTONIZE_MATRICES.tritanopia,
  'fun/sepia': FUN_MATRICES.sepia,
  'fun/invert': FUN_MATRICES.invert,
};

export { GRAYSCALE } from './visual.js';
export { DALTONIZE_MATRICES } from './daltonizeColorBlindness.js';
export { FUN_MATRICES } from './fun.js';
export { SIMULATE_MATRICES } from './simulateColorBlindness.js';
