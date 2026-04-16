export interface FilterOptions {
  intensity?: number;
}

export interface FilterState {
  active: string | null;
  options: FilterOptions;
}
