import type { MarketTime, OhlcBar } from "../core";
import { marketTimeKey } from "../core";

/** Sorted OHLC store with binary-search lookup and O(1) realtime append/update. */
export class IndexedOhlcStore {
  private bars: OhlcBar[] = [];
  private keys: number[] = [];

  constructor(data: readonly OhlcBar[] = []) { this.replace(data); }

  get length(): number { return this.bars.length; }
  get first(): OhlcBar | undefined { return this.bars[0]; }
  get latest(): OhlcBar | undefined { return this.bars[this.bars.length - 1]; }

  replace(data: readonly OhlcBar[]): void {
    this.bars = data.slice();
    this.keys = this.bars.map((bar) => marketTimeKey(bar.time));
  }

  appendOrUpdate(bar: OhlcBar): void {
    const key = marketTimeKey(bar.time);
    const latestKey = this.keys[this.keys.length - 1];
    if (latestKey == null || key > latestKey) { this.keys.push(key); this.bars.push(bar); return; }
    if (key === latestKey) { this.bars[this.bars.length - 1] = bar; return; }
    const index = this.lowerBound(key);
    if (this.keys[index] === key) { this.bars[index] = bar; return; }
    this.keys.splice(index, 0, key);
    this.bars.splice(index, 0, bar);
  }

  indexOf(time: MarketTime): number { const index = this.lowerBound(marketTimeKey(time)); return this.keys[index] === marketTimeKey(time) ? index : -1; }
  nearestIndex(time: MarketTime): number {
    if (!this.length) return -1;
    const key = marketTimeKey(time); const index = this.lowerBound(key);
    if (index <= 0) return 0;
    if (index >= this.length) return this.length - 1;
    return key - this.keys[index - 1] <= this.keys[index] - key ? index - 1 : index;
  }
  at(index: number): OhlcBar | undefined { return this.bars[index]; }
  range(from: number, to: number): readonly OhlcBar[] { return this.bars.slice(Math.max(0, from), Math.min(this.length, to)); }
  toArray(): OhlcBar[] { return this.bars.slice(); }

  private lowerBound(key: number): number {
    let low = 0; let high = this.keys.length;
    while (low < high) { const middle = (low + high) >>> 1; if (this.keys[middle] < key) low = middle + 1; else high = middle; }
    return low;
  }
}
