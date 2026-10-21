import {marketTimeKey, type MarketTimeAxis, type OhlcBar, type VisibleRange} from '../../core';
export type ChartNavigationIntent = 'left' | 'right' | 'in' | 'out';
/** Display navigation only. Uses the host calendar when provided; never changes source rows. */
export function navigateVisibleRange(range: VisibleRange | null | undefined, bars: readonly OhlcBar[], axis: MarketTimeAxis | undefined, intent: ChartNavigationIntent): VisibleRange | null {
  if (!bars.length) return null;
  if (axis?.mode === 'utc') {
    const min = marketTimeKey(axis.domain.from), max = marketTimeKey(axis.domain.to);
    const from = marketTimeKey(range?.from ?? axis.domain.from), to = marketTimeKey(range?.to ?? axis.domain.to);
    const span = Math.max(axis.intervalSeconds, to - from), nextSpan = Math.min(max - min, intent === 'in' ? span * .8 : intent === 'out' ? span * 1.25 : span);
    const shift = intent === 'left' ? -span / 4 : intent === 'right' ? span / 4 : 0;
    const nextFrom = Math.max(min, Math.min(max - nextSpan, (from + to - nextSpan) / 2 + shift));
    return {from: nextFrom, to: nextFrom + nextSpan};
  }
  const times = axis?.mode === 'calendar' ? axis.times : bars.map(bar => bar.time);
  if (times.length < 2) return null;
  const lowerBound = (key: number) => {let low = 0, high = times.length; while (low < high) {const mid = (low + high) >>> 1; if (marketTimeKey(times[mid]) < key) low = mid + 1; else high = mid;} return Math.min(times.length - 1, low);};
  const from = range ? lowerBound(marketTimeKey(range.from)) : 0, to = range ? lowerBound(marketTimeKey(range.to)) : times.length - 1;
  const span = Math.max(1, to - from), nextSpan = Math.min(times.length - 1, Math.max(1, Math.round(intent === 'in' ? span * .8 : intent === 'out' ? span * 1.25 : span)));
  const shift = intent === 'left' ? -Math.max(1, Math.round(span / 4)) : intent === 'right' ? Math.max(1, Math.round(span / 4)) : 0;
  const start = Math.max(0, Math.min(times.length - 1 - nextSpan, Math.round((from + to - nextSpan) / 2 + shift)));
  return {from: times[start], to: times[start + nextSpan]};
}
