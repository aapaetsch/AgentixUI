import {describe, expect, it} from 'vitest';
import {adaptiveBarGeometry} from './bar-geometry';
import {validateMarketPresentation, type MarketChartPresentation} from '../core';

describe('shared adaptive candle/volume slot geometry', () => {
  it('targets the CSS gap with exact fractional timestamp centering and no legacy cap', () => {
    expect(adaptiveBarGeometry(100.125, 20)).toEqual({left: 91.125, width: 18, center: 100.125});
    expect(adaptiveBarGeometry(500, 250)?.width).toBe(248);
    expect(adaptiveBarGeometry(10, 7.25)?.width).toBe(5.25);
    expect(adaptiveBarGeometry(10, 7.25, 0)?.width).toBe(7.25);
    expect(adaptiveBarGeometry(100, 100, 32)?.width).toBe(68);
    for (const ratio of [1, 2, 3]) for (const spacing of [3.125, 7.25, 150.375]) {
      const first = adaptiveBarGeometry(33.125, spacing, 2, ratio)!;
      const next = adaptiveBarGeometry(33.125 + spacing, spacing, 2, ratio)!;
      expect(next.left - (first.left + first.width)).toBeCloseTo(2, 10);
      expect(first.left + first.width / 2).toBe(33.125);
    }
  });
  it.each([1, 2, 3])('degrades deterministically at DPR %s without overlapping adjacent slots', ratio => {
    for (const spacing of [.02, .2, .5, 1.5, 2, 2.25]) {
      const first = adaptiveBarGeometry(20.125, spacing, 2, ratio)!;
      const next = adaptiveBarGeometry(20.125 + spacing, spacing, 2, ratio)!;
      expect(first.width).toBeGreaterThan(0); expect(first.width).toBeLessThanOrEqual(spacing);
      expect(first.width).toBeGreaterThanOrEqual(Math.min(spacing, 1 / ratio));
      expect(next.left - first.left - first.width).toBeGreaterThanOrEqual(-1e-12);
      expect(first).toEqual(adaptiveBarGeometry(20.125, spacing, 2, ratio));
    }
    expect(adaptiveBarGeometry(10, .1, 2, ratio)?.width).toBe(.1);
    expect(adaptiveBarGeometry(10, 1.5, 2, ratio)?.width).toBeCloseTo(1 / ratio);
  });
  it('does not produce geometry for invalid coordinates/slots', () => {
    for (const spacing of [0, -1, Infinity, NaN]) expect(adaptiveBarGeometry(10, spacing)).toBeNull();
    expect(adaptiveBarGeometry(NaN, 10)).toBeNull();
  });
});

describe('public width presentation validation', () => {
  it.each(['candles', 'volume'] as const)('validates %s scalar bounds and mode before rendering', key => {
    for (const gap of [NaN, Infinity, -Infinity, -.01, 32.01]) expect(() => validateMarketPresentation({[key]: {widthMode: 'adaptive', gap}})).toThrow(/gap/);
    for (const gap of [0, 2, 32]) expect(() => validateMarketPresentation({[key]: {widthMode: 'adaptive', gap}})).not.toThrow();
    expect(() => validateMarketPresentation({[key]: {widthMode: 'unsupported'}} as MarketChartPresentation)).toThrow(/widthMode/);
    expect(() => validateMarketPresentation({[key]: {gap: '2'}} as unknown as MarketChartPresentation)).toThrow(/gap/);
    expect(() => validateMarketPresentation({[key]: {widthMode: 'proportional'}})).not.toThrow();
  });
  it('keeps omitted presentation options valid', () => {expect(() => validateMarketPresentation()).not.toThrow();});
});
