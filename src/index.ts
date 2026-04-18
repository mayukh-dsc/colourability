import { FILTERS } from './filters/index.js';
import { interpolateMatrix, parseMatrixValues } from './matrix.js';
import { FILTER_ID, ensureFilterSvg, removeFilterSvg, setMatrixValues } from './overlay.js';
import type { FilterOptions, FilterState } from './types.js';

export type { FilterOptions, FilterState } from './types.js';

export default class Colourability {
  private readonly doc: Document;

  private previousFilter: string | null = null;

  private activePreset: string | null = null;

  private customBaseMatrix: string | null = null;

  private intensity = 1;

  public constructor(doc?: Document) {
    this.doc = doc ?? globalThis.document;
  }

  public apply(name: string, options?: FilterOptions): this {
    const base = FILTERS[name];
    if (base === undefined) {
      throw new Error(`Unknown filter: ${name}`);
    }

    if (this.activePreset === null && this.customBaseMatrix === null) {
      this.previousFilter = this.doc.documentElement.style.filter;
    }

    const nextIntensity = options?.intensity ?? 1;
    this.intensity = Math.min(1, Math.max(0, nextIntensity));
    this.customBaseMatrix = null;
    this.activePreset = name;
    const matrix = interpolateMatrix(base, this.intensity);

    ensureFilterSvg(matrix, this.doc);
    this.doc.documentElement.style.filter = `url(#${FILTER_ID})`;
    return this;
  }

  /**
   * Apply a raw 20-coefficient feColorMatrix string (same format as built-in presets).
   * `setIntensity` interpolates toward identity from this base matrix.
   */
  public applyMatrix(matrix: string, options?: FilterOptions): this {
    const normalized = matrix.trim().replace(/\s+/g, ' ');
    parseMatrixValues(normalized);

    if (this.activePreset === null && this.customBaseMatrix === null) {
      this.previousFilter = this.doc.documentElement.style.filter;
    }

    const nextIntensity = options?.intensity ?? 1;
    this.intensity = Math.min(1, Math.max(0, nextIntensity));
    this.activePreset = null;
    this.customBaseMatrix = normalized;
    const applied = interpolateMatrix(normalized, this.intensity);

    ensureFilterSvg(applied, this.doc);
    this.doc.documentElement.style.filter = `url(#${FILTER_ID})`;
    return this;
  }

  public setIntensity(value: number): this {
    const base = this.resolveBaseMatrix();
    if (base === null) {
      return this;
    }
    this.intensity = Math.min(1, Math.max(0, value));
    const matrix = interpolateMatrix(base, this.intensity);
    setMatrixValues(matrix, this.doc);
    return this;
  }

  private resolveBaseMatrix(): string | null {
    if (this.activePreset !== null) {
      const preset = FILTERS[this.activePreset];
      return preset ?? null;
    }
    return this.customBaseMatrix;
  }

  public remove(): this {
    if (this.previousFilter === null) {
      this.doc.documentElement.style.filter = '';
    } else {
      this.doc.documentElement.style.filter = this.previousFilter;
    }
    removeFilterSvg(this.doc);
    this.previousFilter = null;
    this.activePreset = null;
    this.customBaseMatrix = null;
    this.intensity = 1;
    return this;
  }

  public list(): string[] {
    return Object.keys(FILTERS);
  }

  public getState(): FilterState {
    const hasFilter = this.activePreset !== null || this.customBaseMatrix !== null;
    const opts: FilterOptions = hasFilter ? { intensity: this.intensity } : {};
    return {
      active: this.activePreset,
      customMatrix: this.customBaseMatrix,
      options: opts,
    };
  }
}
