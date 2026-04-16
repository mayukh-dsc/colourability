import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  ensureFilterSvg,
  FILTER_ID,
  removeFilterSvg,
  setMatrixValues,
  SVG_ROOT_ID,
} from '../overlay.js';
import { IDENTITY_MATRIX } from '../matrix.js';

describe('overlay', () => {
  beforeEach(() => {
    document.documentElement.style.filter = '';
  });

  afterEach(() => {
    removeFilterSvg(document);
    document.documentElement.style.filter = '';
  });

  it('injects a single hidden svg in head with linearRGB', () => {
    ensureFilterSvg(IDENTITY_MATRIX, document);
    const svg = document.getElementById(SVG_ROOT_ID);
    expect(svg).not.toBeNull();
    expect(svg?.parentElement).toBe(document.head);
    const filterEl = document.getElementById(FILTER_ID);
    expect(filterEl?.getAttribute('color-interpolation-filters')).toBe('linearRGB');
  });

  it('is idempotent — updates values in place', () => {
    ensureFilterSvg(IDENTITY_MATRIX, document);
    const first = document.querySelector('feColorMatrix');
    ensureFilterSvg('2 0 0 0 0 0 2 0 0 0 0 0 2 0 0 0 0 0 1 0', document);
    const second = document.querySelector('feColorMatrix');
    expect(first).toBe(second);
    expect(document.querySelectorAll(`#${SVG_ROOT_ID}`).length).toBe(1);
  });

  it('removeFilterSvg drops the svg node', () => {
    ensureFilterSvg(IDENTITY_MATRIX, document);
    removeFilterSvg(document);
    expect(document.getElementById(SVG_ROOT_ID)).toBeNull();
  });

  it('setMatrixValues throws if SVG was not injected', () => {
    expect(() => setMatrixValues(IDENTITY_MATRIX, document)).toThrow(/SVG not injected/);
  });

  it('ensureFilterSvg throws if feColorMatrix is missing', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', SVG_ROOT_ID);
    document.head.appendChild(svg);
    expect(() => ensureFilterSvg(IDENTITY_MATRIX, document)).toThrow(/feColorMatrix missing/);
    svg.remove();
  });

  it('setMatrixValues throws if feColorMatrix was removed', () => {
    ensureFilterSvg(IDENTITY_MATRIX, document);
    const root = document.getElementById(SVG_ROOT_ID);
    expect(root).not.toBeNull();
    root?.querySelector('feColorMatrix')?.remove();
    expect(() => setMatrixValues(IDENTITY_MATRIX, document)).toThrow(/feColorMatrix missing/);
  });
});
