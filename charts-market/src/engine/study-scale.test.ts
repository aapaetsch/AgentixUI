import {describe, expect, it} from 'vitest';
import {automaticStudyDomain, layoutStudyTicks, tickPrecision, studyTickLabels} from './study-scale';
import {layoutAxisBadges} from './axis-badges';
import {PriceScale} from './price-scale';
describe('reference-aware study display scales', () => {
  it('fits all visible DI/ADX values and the reference without a fixed upper cap', () => {
    expect(automaticStudyDomain([12, 19, 35], [25])).toEqual([10.16, 36.84]);
    const strong = automaticStudyDomain([12, 71, 62], [25]);
    expect(strong[0]).toBeLessThan(12); expect(strong[1]).toBeGreaterThan(71);
    const low = automaticStudyDomain([12, 15, 17], [25]); expect(low[1]).toBeGreaterThan(25);
  });
  it('defines empty, null-filtered, zero/constant and opt-out reference domains explicitly', () => {
    const empty = automaticStudyDomain([], []); expect(empty[0]).toBeCloseTo(-.08); expect(empty[1]).toBeCloseTo(1.08);
    expect(automaticStudyDomain([0, 0], [])).toEqual([-.58, .58]);
    const referencedEmpty = automaticStudyDomain([NaN], [25]); expect(referencedEmpty[0]).toBeCloseTo(-2); expect(referencedEmpty[1]).toBeCloseTo(27);
    expect(automaticStudyDomain([12, 17], [25], {includeReferences: false})[1]).toBeLessThan(25);
    expect(() => automaticStudyDomain([1], [], {padding: -1})).toThrow();
    expect(() => automaticStudyDomain([], [], {emptyDomain: [1, 1]})).toThrow();
    for (const values of [[-Number.MAX_VALUE, Number.MAX_VALUE], [Number.MAX_VALUE], [Number.MIN_VALUE]]) {
      const bounds = automaticStudyDomain(values, []); expect(bounds.every(Number.isFinite)).toBe(true); expect(bounds[0]).toBeLessThan(bounds[1]);
      values.forEach(value => {expect(bounds[0]).toBeLessThanOrEqual(value); expect(bounds[1]).toBeGreaterThanOrEqual(value);});
    }
  });
  it('keeps fixed bounded oscillators unchanged and chooses distinct tick precision', () => {
    const scale = new PriceScale(); scale.autoscale([12, 35], undefined, [0, 100]);
    expect(scale.snapshot).toMatchObject({minimum: 0, maximum: 100});
    expect(tickPrecision([.01, .02, .03])).toBe(2);
    expect(tickPrecision([20, 25, 30])).toBe(0);
    expect(tickPrecision([0, 2.5, 5])).toBe(1);
  });
  it('keeps tiny nonzero automatic ticks distinguishable without changing supplied values', () => {
    for (const values of [[0, 1e-12, 2e-12, 2.5e-12], [-2e-20, -1e-20, 0], [Number.MIN_VALUE, Number.MIN_VALUE * 2], [1.000000000001, 1.000000000002]]) {
      const original = [...values], labels = studyTickLabels(values);
      expect(new Set(labels).size).toBe(values.length);
      values.forEach((value, index) => {if (value !== 0) expect(Number(labels[index])).not.toBe(0);});
      expect(values).toEqual(original);
    }
    expect(studyTickLabels([0, 2.5, 5])).toEqual(['0.0', '2.5', '5.0']);
    expect(studyTickLabels([1e-12])).toEqual(['1.00e-12']);
  });
  it('prioritizes reference labels without colliding ticks or latest badges', () => {
    const ticks = layoutStudyTicks([0, 5, 10, 15, 20, 25, 30], [25], value => 100 - value * 2, 28, 100, 22);
    expect(ticks.some(tick => tick.value === 25)).toBe(true);
    ticks.slice(1).forEach((tick, i) => expect(tick.y - ticks[i].y).toBeGreaterThanOrEqual(22));
    const badges = layoutAxisBadges([{id: 'a', y: 51, text: 'a', color: 'red', priority: 10}, {id: 'last', y: 52, text: 'last', color: 'blue', priority: 100}], 28, 110, 19, [{y: 50, height: 19}]);
    expect(badges.some(badge => badge.id === 'last')).toBe(true);
    badges.forEach(badge => expect(Math.abs(badge.y - 50)).toBeGreaterThanOrEqual(20));
    expect(layoutAxisBadges([{id: 'a', y: 5, text: '', color: '', priority: 1}], 0, 5, 19, [{y: 5, height: 20}])).toEqual([]);
  });
});
