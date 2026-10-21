import type { MarketTime, MarketTimeAxis, VisibleRange } from "../core";
import { marketTimeKey, validateMarketTimeGeometry } from "../core";
import type { IndexedOhlcStore } from "./data-store";

export interface LogicalRange { from: number; to: number }

/** Display coordinates are independent of the OHLC store in host-controlled modes. */
export class LogicalTimeScale {
  private axis: MarketTimeAxis = { mode: "compressed" };
  private grid: number[] = [];
  get isCalendar(): boolean { return this.axis.mode !== "compressed"; }
  get maximum(): number {
    if (this.axis.mode === "calendar") return Math.max(1, this.grid.length - 1);
    if (this.axis.mode === "utc") return (marketTimeKey(this.axis.domain.to) - marketTimeKey(this.axis.domain.from)) / this.axis.intervalSeconds;
    return Math.max(1, this.store.length - 1 + this.offset);
  }
  get isRealtime(): boolean { return this.range.to >= this.maximum - 0.5; }
  setAxis(axis: MarketTimeAxis = { mode: "compressed" }): void {
    const errors = validateMarketTimeGeometry(axis);
    if (errors.length) throw new Error(errors.join(" "));
    this.axis = axis;
    this.grid = axis.mode === "calendar" ? axis.times.map(marketTimeKey) : [];
    this.resetToLatest();
  }
  private leftInset = 0;
  setLeftInset(inset: number): void { this.leftInset = Math.max(0, inset); }
  private offset = 0;
  setRightOffset(bars = 0, minimum = 0, maximum = 150): void { const next = Math.max(0, minimum, Math.min(Math.max(minimum, maximum), Number.isFinite(bars) ? bars : 0)); const delta = next - this.offset; this.offset = next; if (!this.isCalendar) { this.range.to += delta; this.clamp(); } }
  get rightOffsetBars(): number { return this.offset; }
  private range: LogicalRange = { from: 0, to: 1 };
  constructor(private store: IndexedOhlcStore, private width = 1, private rightInset = 72) { this.resetToLatest(); }

  setStore(store: IndexedOhlcStore): void { this.store = store; this.clamp(); }
  setWidth(width: number): void { this.width = Math.max(1, width); }
  setRightInset(inset: number): void { this.rightInset = Math.max(0, inset); }
  get visible(): LogicalRange { return { ...this.range }; }
  get plotWidth(): number { return Math.max(1, this.width - this.rightInset - this.leftInset); }
  get barSpacing(): number { return this.plotWidth / Math.max(Number.EPSILON, this.range.to - this.range.from); }

  fitContent(): void { this.range = { from: 0, to: this.maximum }; }
  resetToLatest(maximumBars = 120): void { if (this.isCalendar) { this.fitContent(); return; } const last = this.maximum; const span = Math.min(last, maximumBars - 1); this.range = { from: Math.max(0, last - span), to: last }; }
  scrollToRealtime(): void {
    const span = this.range.to - this.range.from;
    this.range = { from: Math.max(0, this.maximum - span), to: this.maximum };
  }
  setVisibleTimes(from: MarketTime, to: MarketTime): void {
    if (this.isCalendar) {
      const a = this.timeToLogical(from), b = this.timeToLogical(to);
      if (a == null || b == null || b < a) return;
      this.range = b === a ? { from: a - 0.5, to: a + 0.5 } : { from: a, to: b };
      this.clamp(); return;
    }
    const fromIndex = this.store.nearestIndex(from); const toIndex = this.store.nearestIndex(to);
    if (fromIndex < 0 || toIndex < 0) return;
    this.range = { from: Math.min(fromIndex, toIndex), to: Math.max(fromIndex + 1, toIndex) + this.offset }; this.clamp();
  }
  setLogicalRange(range: LogicalRange): void { if (!Number.isFinite(range.from) || !Number.isFinite(range.to) || range.to <= range.from) return; this.range = { ...range }; this.clamp(); }
  panPixels(delta: number): void { const logical = delta / this.barSpacing; this.range = { from: this.range.from - logical, to: this.range.to - logical }; this.clamp(); }
  zoomAt(x: number, factor: number): void {
    const anchor = this.coordinateToLogical(x); const span = Math.max(Math.min(this.maximum, this.isCalendar ? 0.01 : 4), Math.min(this.isCalendar ? this.maximum : Math.max(4, this.maximum), (this.range.to - this.range.from) * factor));
    const ratio = (anchor - this.range.from) / (this.range.to - this.range.from);
    this.range = { from: anchor - span * ratio, to: anchor + span * (1 - ratio) }; this.clamp();
  }
  private lowerBound(key: number): number {
    let low = 0, high = this.grid.length;
    while (low < high) { const mid = (low + high) >>> 1; if (this.grid[mid] < key) low = mid + 1; else high = mid; }
    return low;
  }
  timeToLogical(time: MarketTime): number | null {
    if (!this.isCalendar) { const index = this.store.indexOf(time); return index < 0 ? null : index; }
    const key = marketTimeKey(time);
    if (!Number.isFinite(key)) return null;
    if (this.axis.mode === "utc") return (key - marketTimeKey(this.axis.domain.from)) / this.axis.intervalSeconds;
    const next = this.lowerBound(key);
    if (this.grid[next] === key) return next;
    if (!next || next === this.grid.length) return null;
    return next - 1 + (key - this.grid[next - 1]) / (this.grid[next] - this.grid[next - 1]);
  }
  private logicalToTime(logical: number): MarketTime | null {
    if (this.axis.mode === "utc") return marketTimeKey(this.axis.domain.from) + logical * this.axis.intervalSeconds;
    if (this.axis.mode === "calendar") {
      const bounded = Math.max(0, Math.min(this.grid.length - 1, logical));
      const index = Math.floor(bounded);
      return this.grid[index] + (bounded - index) * ((this.grid[index + 1] ?? this.grid[index]) - this.grid[index]);
    }
    return this.store.at(Math.max(0, Math.min(this.store.length - 1, Math.round(logical))))?.time ?? null;
  }
  coordinateToTime(x: number): MarketTime | null { return this.logicalToTime(this.coordinateToLogical(x)); }
  visibleTimes(): VisibleRange | null {
    if (this.isCalendar) { const from = this.logicalToTime(this.range.from), to = this.logicalToTime(this.range.to); return from == null || to == null ? null : { from, to }; }
    const indexes = this.visibleIndexes(0), first = this.store.at(indexes.from), last = this.store.at(Math.max(indexes.from, indexes.to - 1));
    return first && last ? { from: first.time, to: last.time } : null;
  }
  shiftTime(time: MarketTime, steps: number): MarketTime | null { const logical = this.timeToLogical(time); return logical == null ? null : this.logicalToTime(logical + steps); }
  timeToCoordinate(time: MarketTime): number | null { const logical = this.timeToLogical(time); return logical == null ? null : this.logicalToCoordinate(logical); }
  indexToCoordinate(index: number): number { const bar = this.store.at(index); return bar ? this.timeToCoordinate(bar.time) ?? Number.NaN : Number.NaN; }
  logicalToCoordinate(index: number): number { return this.leftInset + (index - this.range.from) * this.barSpacing; }
  coordinateToLogical(x: number): number { return this.range.from + (x - this.leftInset) / this.barSpacing; }
  coordinateToIndex(x: number): number {
    if (!this.isCalendar) return Math.max(0, Math.min(this.store.length - 1, Math.round(this.coordinateToLogical(x))));
    const time = this.coordinateToTime(x); if (time == null) return -1;
    const index = this.store.nearestIndex(time), bar = this.store.at(index);
    const logical = bar && this.timeToLogical(bar.time);
    return logical != null && Math.abs(logical - this.coordinateToLogical(x)) <= 0.5 ? index : -1;
  }
  visibleIndexes(overscan = 2): { from: number; to: number } {
    if (this.isCalendar) {
      const bound = (position: number, after = false) => { let low = 0, high = this.store.length; while (low < high) { const mid = (low + high) >>> 1; const logical = this.timeToLogical(this.store.at(mid)!.time) ?? (marketTimeKey(this.store.at(mid)!.time) < (this.grid[0] ?? -Infinity) ? -Infinity : Infinity); if (logical < position || after && logical === position) low = mid + 1; else high = mid; } return low; };
      return { from: Math.max(0, bound(this.range.from) - overscan), to: Math.min(this.store.length, bound(this.range.to, true) + overscan) };
    }
    return { from: Math.max(0, Math.floor(this.range.from) - overscan), to: Math.min(this.store.length, Math.ceil(this.range.to) + overscan + 1) };
  }

  private clamp(): void {
    if (this.isCalendar) {
      const span = Math.min(this.maximum, Math.max(0.000001, this.range.to - this.range.from));
      const from = Math.max(0, Math.min(this.maximum - span, this.range.from));
      this.range = { from, to: from + span }; return;
    }
    if (!this.store.length) { this.range = { from: 0, to: 1 }; return; }
    const span = Math.max(1, Math.min(this.range.to - this.range.from, Math.max(1, this.store.length - 1 + this.offset)));
    let from = this.range.from; let to = from + span;
    if (to > this.store.length - 1 + this.offset) { to = this.store.length - 1 + this.offset; from = to - span; }
    if (from < 0) { from = 0; to = Math.min(this.store.length - 1 + this.offset, span); }
    this.range = { from, to: Math.max(from + 1, to) };
  }
}
