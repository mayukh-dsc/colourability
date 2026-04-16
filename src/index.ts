import { FILTERS, interpolateMatrix } from './matrix.js';
import { FILTER_ID, ensureFilterSvg, removeFilterSvg, setMatrixValues } from './overlay.js';
import type { FilterOptions, FilterState } from './types.js';

export type { FilterOptions, FilterState } from './types.js';

export default class Colourability {
  private readonly doc: Document;

  private previousFilter: string | null = null;

  private active: string | null = null;

  private intensity = 1;

  public constructor(doc?: Document) {
    this.doc = doc ?? globalThis.document;
  }

  public apply(name: string, options?: FilterOptions): this {
    const base = FILTERS[name];
    if (base === undefined) {
      throw new Error(`Unknown filter: ${name}`);
    }

    const nextIntensity = options?.intensity ?? 1;
    this.intensity = Math.min(1, Math.max(0, nextIntensity));
    const matrix = interpolateMatrix(base, this.intensity);

    if (this.active === null) {
      this.previousFilter = this.doc.documentElement.style.filter;
    }

    ensureFilterSvg(matrix, this.doc);
    this.doc.documentElement.style.filter = `url(#${FILTER_ID})`;
    this.active = name;
    return this;
  }

  public setIntensity(value: number): this {
    if (this.active !== null) {
      /* `active` is only ever set from apply() after a successful FILTERS lookup. */
      const base = FILTERS[this.active]!;
      this.intensity = Math.min(1, Math.max(0, value));
      const matrix = interpolateMatrix(base, this.intensity);
      setMatrixValues(matrix, this.doc);
    }
    return this;
  }

  public remove(): this {
    if (this.previousFilter === null) {
      this.doc.documentElement.style.filter = '';
    } else {
      this.doc.documentElement.style.filter = this.previousFilter;
    }
    removeFilterSvg(this.doc);
    this.previousFilter = null;
    this.active = null;
    this.intensity = 1;
    return this;
  }

  public list(): string[] {
    return Object.keys(FILTERS);
  }

  public getState(): FilterState {
    const opts: FilterOptions =
      this.active === null ? {} : { intensity: this.intensity };
    return {
      active: this.active,
      options: opts,
    };
  }
}
