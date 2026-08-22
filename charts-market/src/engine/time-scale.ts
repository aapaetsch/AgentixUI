import type { MarketTime } from "../core";
import type { IndexedOhlcStore } from "./data-store";

export interface LogicalRange { from: number; to: number }

/** Session-compressed scale: bar indexes are logical positions while timestamps remain untouched. */
export class LogicalTimeScale {
  private range: LogicalRange = { from: 0, to: 1 };
  constructor(private store: IndexedOhlcStore, private width = 1, private rightInset = 72) { this.resetToLatest(); }

  setStore(store: IndexedOhlcStore): void { this.store = store; this.clamp(); }
  setWidth(width: number): void { this.width = Math.max(1, width); }
  get visible(): LogicalRange { return { ...this.range }; }
  get plotWidth(): number { return Math.max(1, this.width - this.rightInset); }
  get barSpacing(): number { return this.plotWidth / Math.max(1, this.range.to - this.range.from); }

  fitContent(): void { this.range = { from: 0, to: Math.max(1, this.store.length - 1) }; }
  resetToLatest(maximumBars = 120): void { const last = Math.max(1, this.store.length - 1); const span = Math.min(last, maximumBars - 1); this.range = { from: Math.max(0, last - span), to: last }; }
  scrollToRealtime(): void {
    const span = Math.max(1, this.range.to - this.range.from);
    this.range = { from: Math.max(0, this.store.length - 1 - span), to: Math.max(1, this.store.length - 1) };
  }
  setVisibleTimes(from: MarketTime, to: MarketTime): void {
    const fromIndex = this.store.nearestIndex(from); const toIndex = this.store.nearestIndex(to);
    if (fromIndex < 0 || toIndex < 0) return;
    this.range = { from: Math.min(fromIndex, toIndex), to: Math.max(fromIndex + 1, toIndex) }; this.clamp();
  }
  panPixels(delta: number): void { const logical = delta / this.barSpacing; this.range = { from: this.range.from - logical, to: this.range.to - logical }; this.clamp(); }
  zoomAt(x: number, factor: number): void {
    const anchor = this.coordinateToLogical(x); const span = Math.max(4, Math.min(Math.max(4, this.store.length - 1), (this.range.to - this.range.from) * factor));
    const ratio = (anchor - this.range.from) / Math.max(1, this.range.to - this.range.from);
    this.range = { from: anchor - span * ratio, to: anchor + span * (1 - ratio) }; this.clamp();
  }
  timeToCoordinate(time: MarketTime): number | null { const index = this.store.indexOf(time); return index < 0 ? null : this.logicalToCoordinate(index); }
  logicalToCoordinate(index: number): number { return (index - this.range.from) * this.barSpacing; }
  coordinateToLogical(x: number): number { return this.range.from + x / this.barSpacing; }
  coordinateToIndex(x: number): number { return Math.max(0, Math.min(this.store.length - 1, Math.round(this.coordinateToLogical(x)))); }
  visibleIndexes(overscan = 2): { from: number; to: number } {
    return { from: Math.max(0, Math.floor(this.range.from) - overscan), to: Math.min(this.store.length, Math.ceil(this.range.to) + overscan + 1) };
  }

  private clamp(): void {
    if (!this.store.length) { this.range = { from: 0, to: 1 }; return; }
    const span = Math.max(1, Math.min(this.range.to - this.range.from, Math.max(1, this.store.length - 1)));
    let from = this.range.from; let to = from + span;
    if (to > this.store.length - 1) { to = this.store.length - 1; from = to - span; }
    if (from < 0) { from = 0; to = Math.min(this.store.length - 1, span); }
    this.range = { from, to: Math.max(from + 1, to) };
  }
}
