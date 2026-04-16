import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import OverlayFilter from '../index.js';

describe('OverlayFilter', () => {
  let filter: OverlayFilter;

  beforeEach(() => {
    document.documentElement.style.filter = '';
    filter = new OverlayFilter();
  });

  afterEach(() => {
    filter.remove();
    document.documentElement.style.filter = '';
  });

  it('apply sets filter url on documentElement', () => {
    document.documentElement.style.filter = 'blur(1px)';
    filter.apply('grayscale');
    expect(document.documentElement.style.filter).toContain('url(#');
    expect(filter.getState().active).toBe('grayscale');
  });

  it('remove restores previous filter', () => {
    document.documentElement.style.filter = 'blur(2px)';
    filter.apply('grayscale');
    filter.remove();
    expect(document.documentElement.style.filter).toBe('blur(2px)');
    expect(filter.getState().active).toBeNull();
  });

  it('list returns 7 names', () => {
    expect(filter.list().length).toBe(7);
  });

  it('throws on unknown filter', () => {
    expect(() => filter.apply('nope')).toThrow(/Unknown filter/);
  });

  it('setIntensity is no-op when inactive', () => {
    expect(filter.setIntensity(0.5)).toBe(filter);
  });

  it('setIntensity updates matrix after apply', () => {
    filter.apply('grayscale', { intensity: 1 });
    filter.setIntensity(0.5);
    expect(filter.getState().options).toEqual({ intensity: 0.5 });
  });

  it('apply respects intensity option', () => {
    filter.apply('grayscale', { intensity: 0 });
    expect(filter.getState().options).toEqual({ intensity: 0 });
  });
});
