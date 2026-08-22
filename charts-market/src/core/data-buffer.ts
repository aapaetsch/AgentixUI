import type { OhlcBar } from "./types";
import { marketTimeKey } from "./validation";

/** Mutable O(1) append/update store intended for engine adapters and streaming tests. */
export class MarketDataBuffer {
  private bars: OhlcBar[];

  constructor(initial: readonly OhlcBar[] = []) { this.bars = initial.slice(); }

  get length(): number { return this.bars.length; }
  get latest(): OhlcBar | undefined { return this.bars[this.bars.length - 1]; }

  replace(data: readonly OhlcBar[]): void { this.bars = data.slice(); }

  appendOrUpdate(bar: OhlcBar): void {
    const latest = this.latest;
    if (!latest) { this.bars.push(bar); return; }
    const comparison = marketTimeKey(bar.time) - marketTimeKey(latest.time);
    if (comparison < 0) throw new Error("Streaming bars must not precede the latest timestamp.");
    if (comparison === 0) this.bars[this.bars.length - 1] = bar;
    else this.bars.push(bar);
  }

  toArray(): OhlcBar[] { return this.bars.slice(); }
}
