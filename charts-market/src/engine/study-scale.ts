import type {IndicatorAutomaticDomain} from '../core';

/** Fit display bounds only: no financial calculations and no mutation of supplied points. */
export function automaticStudyDomain(values: readonly number[], references: readonly number[], policy: IndicatorAutomaticDomain = {}): readonly [number, number] {
  const {includeReferences = true, padding = .08, minimumSpan, emptyDomain = [0, 1]} = policy;
  if (!Number.isFinite(padding) || padding < 0 || padding > 1 || minimumSpan != null && (!Number.isFinite(minimumSpan) || minimumSpan <= 0) ||
      emptyDomain.length !== 2 || !emptyDomain.every(Number.isFinite) || emptyDomain[0] >= emptyDomain[1]) throw Error('Invalid indicator automatic domain policy.');
  const finite = values.filter(Number.isFinite);
  const candidates = finite.length ? finite : [...emptyDomain];
  if (includeReferences) references.filter(Number.isFinite).forEach(value => candidates.push(value));
  let min = Infinity, max = -Infinity;
  for (const value of candidates) {min = Math.min(min, value); max = Math.max(max, value);}
  const magnitude = Math.max(Math.abs(min), Math.abs(max));
  const halfSpan = Math.max(max / 2 - min / 2, (minimumSpan ?? (magnitude ? Math.max(Number.MIN_VALUE, magnitude * .02) : 1)) / 2);
  const middle = min / 2 + max / 2;
  const expanded = Math.min(Number.MAX_VALUE, halfSpan * (1 + padding * 2));
  const lower = Math.max(-Number.MAX_VALUE, middle - expanded), upper = Math.min(Number.MAX_VALUE, middle + expanded);
  return lower < upper ? [lower, upper] : min > 0 ? [min / 2, max] : min < 0 ? [min, max / 2] : [-.5, .5];
}

export interface AxisTick {value: number; y: number; reference: boolean}
/** Prioritize reference ticks and omit neighboring labels that cannot fit. */
export function layoutStudyTicks(ticks: readonly number[], references: readonly number[], coordinate: (value: number) => number | null, top: number, bottom: number, spacing: number): AxisTick[] {
  const referenceSet = new Set(references.filter(Number.isFinite));
  const candidates = [...new Set([...referenceSet, ...ticks])].map(value => ({value, y: coordinate(value), reference: referenceSet.has(value)}))
    .filter((tick): tick is AxisTick => tick.y != null && Number.isFinite(tick.y) && tick.y >= top && tick.y <= bottom)
    .sort((a, b) => Number(b.reference) - Number(a.reference) || a.y - b.y);
  const placed: AxisTick[] = [];
  for (const tick of candidates) if (placed.every(other => Math.abs(other.y - tick.y) >= spacing)) placed.push(tick);
  return placed.sort((a, b) => a.y - b.y);
}
export function tickPrecision(values: readonly number[]): number {
  const ordered = [...new Set(values)].sort((a, b) => a - b);
  let step = Infinity;
  for (let i = 1; i < ordered.length; i++) step = Math.min(step, ordered[i] - ordered[i - 1]);
  return Number.isFinite(step) && step > 0 ? Math.min(8, Math.max(0, -Math.floor(Math.log10(step))) + (String(step / 10 ** Math.floor(Math.log10(step))).startsWith('2.5') ? 1 : 0)) : 2;
}

/** Preserve distinct automatic tick labels, including subnormal observations. */
export function studyTickLabels(values: readonly number[]): string[] {
  const precision = tickPrecision(values);
  const fixed = values.map(value => value.toFixed(precision));
  const preservesValues = (labels: readonly string[]) => values.every((value, index) =>
    (value === 0 || Number(labels[index]) !== 0) && labels.every((label, other) => value === values[other] || label !== labels[index]));
  if (preservesValues(fixed)) return fixed;
  for (let digits = 2; digits <= 16; digits++) {
    const scientific = values.map(value => value === 0 ? '0' : value.toExponential(digits));
    if (preservesValues(scientific)) return scientific;
  }
  return values.map(String);
}
