export interface FilterOptions {
  intensity?: number;
}

export interface FilterState {
  /** Namespaced preset id when `apply` is active; `null` when none or when `applyMatrix` is active. */
  active: string | null;
  /**
   * Raw base matrix string when `applyMatrix` is active (same string passed in, before intensity).
   * `null` when a built-in preset or no filter is active.
   */
  customMatrix: string | null;
  options: FilterOptions;
}
