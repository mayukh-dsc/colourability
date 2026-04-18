import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import Colourability from '../index.js';
import { IDENTITY_MATRIX } from '../matrix.js';

describe('Colourability', () => {
  let filter: Colourability;

  beforeEach(() => {
    document.documentElement.style.filter = '';
    filter = new Colourability();
  });

  afterEach(() => {
    filter.remove();
    document.documentElement.style.filter = '';
  });

  it('apply sets filter url on documentElement', () => {
    document.documentElement.style.filter = 'blur(1px)';
    filter.apply('visual/grayscale');
    expect(document.documentElement.style.filter).toContain('url(#');
    expect(filter.getState().active).toBe('visual/grayscale');
    expect(filter.getState().customMatrix).toBeNull();
  });

  it('remove restores previous filter', () => {
    document.documentElement.style.filter = 'blur(2px)';
    filter.apply('visual/grayscale');
    filter.remove();
    expect(document.documentElement.style.filter).toBe('blur(2px)');
    expect(filter.getState().active).toBeNull();
    expect(filter.getState().customMatrix).toBeNull();
  });

  it('list returns all built-in names', () => {
    expect(filter.list().length).toBe(9);
  });

  it('throws on unknown filter', () => {
    expect(() => filter.apply('nope')).toThrow(/Unknown filter/);
  });

  it('throws on legacy flat preset name', () => {
    expect(() => filter.apply('grayscale')).toThrow(/Unknown filter/);
  });

  it('setIntensity is no-op when inactive', () => {
    expect(filter.setIntensity(0.5)).toBe(filter);
  });

  it('setIntensity updates matrix after apply', () => {
    filter.apply('visual/grayscale', { intensity: 1 });
    filter.setIntensity(0.5);
    expect(filter.getState().options).toEqual({ intensity: 0.5 });
  });

  it('apply respects intensity option', () => {
    filter.apply('visual/grayscale', { intensity: 0 });
    expect(filter.getState().options).toEqual({ intensity: 0 });
  });

  it('applyMatrix validates matrix and sets customMatrix state', () => {
    filter.applyMatrix(IDENTITY_MATRIX);
    expect(filter.getState().active).toBeNull();
    expect(filter.getState().customMatrix).toBe(
      '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0',
    );
    expect(filter.getState().options).toEqual({ intensity: 1 });
  });

  it('applyMatrix throws on invalid matrix', () => {
    expect(() => filter.applyMatrix('1 0 0')).toThrow(TypeError);
  });

  it('setIntensity works after applyMatrix', () => {
    filter.applyMatrix(IDENTITY_MATRIX, { intensity: 1 });
    filter.setIntensity(0.25);
    expect(filter.getState().options).toEqual({ intensity: 0.25 });
  });

  it('apply clears customMatrix', () => {
    filter.applyMatrix(IDENTITY_MATRIX);
    filter.apply('fun/sepia');
    expect(filter.getState().customMatrix).toBeNull();
    expect(filter.getState().active).toBe('fun/sepia');
  });

  it('applyMatrix clears active preset', () => {
    filter.apply('visual/grayscale');
    filter.applyMatrix(IDENTITY_MATRIX);
    expect(filter.getState().active).toBeNull();
    expect(filter.getState().customMatrix).not.toBeNull();
  });
});
