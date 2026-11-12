import type { MarketTime, MarketTimeAxis, VisibleRange } from "../core";
import { marketTimeKey, marketFutureDisplayEnd, validateMarketTimeGeometry } from "../core";
import type { IndexedOhlcStore } from "./data-store";

export interface LogicalRange { from: number; to: number }

/** Display coordinates are independent of the OHLC store in host-controlled modes. */
export class LogicalTimeScale {
  private axis: MarketTimeAxis = { mode: "compressed" };
  private grid: number[] = [];
  private futureCache?: { key: string; value: NonNullable<LogicalTimeScale['futureDisplayBounds']> };
  get isCalendar(): boolean { return this.axis.mode !== "compressed"; }
  get hasFutureDisplay(): boolean { return this.axis.futureDisplay != null; }
  /** Seam preserves all known coordinates, including explicitly supplied future earnings. */
  get futureDisplayBounds(): { time: number; logical: number; end: number; maximum: number; intervalSeconds: number } | null {
    const policy = this.axis.futureDisplay;
    if (!policy) return null;
    const time = this.axis.mode === 'calendar' ? this.grid.at(-1) : this.axis.mode === 'utc' ? marketTimeKey(this.axis.domain.to) : this.store.latest ? marketTimeKey(this.store.latest.time) : policy.emptyOrigin == null ? undefined : marketTimeKey(policy.emptyOrigin);
    if (time == null) return null;
    const logical = this.axis.mode === 'calendar' ? this.grid.length - 1 : this.axis.mode === 'utc' ? this.maximum : Math.max(0, this.store.length - 1);
    const key = `${time}/${logical}/${policy.intervalSeconds}/${policy.horizonMonths ?? 12}`;
    if (this.futureCache?.key === key) return this.futureCache.value;
    const end = marketFutureDisplayEnd(time, policy.horizonMonths);
    if (!Number.isFinite(end)) return null;
    const value = { time, logical, end, maximum: logical + (end - time) / policy.intervalSeconds, intervalSeconds: policy.intervalSeconds };
    this.futureCache = { key, value }; return value;
  }
  isFutureTime(time: MarketTime): boolean { const bounds = this.futureDisplayBounds, key = marketTimeKey(time); return !!bounds && key > bounds.time && key <= bounds.end; }
  get maximum(): number {
    if (this.axis.mode === "calendar") return Math.max(1, this.grid.length - 1);
    if (this.axis.mode === "utc") return (marketTimeKey(this.axis.domain.to) - marketTimeKey(this.axis.domain.from)) / this.axis.intervalSeconds;
    return Math.max(1, this.store.length - 1 + this.offset);
  }
  get isRealtime(): boolean { return this.workspacePadding || this.hasTimeline || this.hasFutureDisplay ? Math.abs(this.range.to-this.fitMaximum)<0.5 : this.range.to >= this.maximum - 0.5; }
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
  private workspacePadding = false;
  private timelinePadding: number | undefined;
  get hasTimeline(): boolean { return this.timelinePadding != null; }
  /** Presentation space is independent of the supplied calendar/domain. */
  setTimelinePadding(bars?: number): void {
    const next = bars == null ? undefined : Math.max(0, Math.min(150, bars));
    if (next === this.timelinePadding) return;
    this.timelinePadding = next;
    if (!this.isCalendar && next != null) this.setRightOffset(next);
    this.clamp();
  }
  private get fitMaximum(): number { const fit=this.maximum + (this.isCalendar ? this.timelinePadding ?? 0 : 0); return Math.min(fit,this.futureDisplayBounds?.maximum??fit); }
  /** Opt-in compressed padding; calendars retain their host domain exactly. */
  setWorkspacePadding(bars: number): void { this.workspacePadding = true; this.setRightOffset(Math.max(0,Math.min(150,Number.isFinite(bars)?bars:10)),0,150); }
  clearWorkspacePadding(): void {this.workspacePadding=false;this.clamp();}
  private get panMaximum(): number { return this.futureDisplayBounds?.maximum ?? (this.hasTimeline ? (this.isCalendar ? this.maximum : Math.max(1,this.store.length-1)) + 150 : this.workspacePadding && !this.isCalendar ? Math.max(1,this.store.length-1+150) : this.maximum); }
  setRightOffset(bars = 0, minimum = 0, maximum = 150): void { minimum=Number.isFinite(minimum)?Math.max(0,Math.min(150,minimum)):0;maximum=Number.isFinite(maximum)?Math.max(minimum,Math.min(150,maximum)):150; const next = Math.max(0, minimum, Math.min(Math.max(minimum, maximum), Number.isFinite(bars) ? bars : 0)); const delta = next - this.offset; this.offset = next; if (!this.isCalendar) { this.range.to += delta; this.clamp(); } }
  get rightOffsetBars(): number { return this.offset; }
  private range: LogicalRange = { from: 0, to: 1 };
  constructor(private store: IndexedOhlcStore, private width = 1, private rightInset = 72) { this.resetToLatest(); }

  setStore(store: IndexedOhlcStore): void { this.store = store; this.clamp(); }
  setWidth(width: number): void { this.width = Math.max(1, width); }
  setRightInset(inset: number): void { this.rightInset = Math.max(0, inset); }
  get visible(): LogicalRange { return { ...this.range }; }
  get plotWidth(): number { return Math.max(1, this.width - this.rightInset - this.leftInset); }
  get barSpacing(): number { return this.plotWidth / Math.max(Number.EPSILON, this.range.to - this.range.from); }

  fitContent(): void { this.range = { from: 0, to: this.fitMaximum }; }
  resetToLatest(maximumBars = 120): void { if (this.isCalendar) { this.fitContent(); return; } const last = this.maximum; const span = Math.min(last, maximumBars - 1); this.range = { from: Math.max(0, last - span), to: last }; }
  scrollToRealtime(): void {
    if(this.hasTimeline&&!this.store.length){this.fitContent();return;}
    const span = this.range.to - this.range.from;
    this.range = { from: Math.max(0, this.fitMaximum - span), to: this.fitMaximum };
  }
  setVisibleTimes(from: MarketTime, to: MarketTime): void {
    if (this.isCalendar || this.hasFutureDisplay) {
      const a = this.timeToLogical(from), b = this.timeToLogical(to);
      if (a == null || b == null || b < a) return;
      this.range = b === a ? { from: a - 0.5, to: a + 0.5 } : { from: a, to: b };
      this.clamp(); return;
    }
    const fromIndex = this.store.nearestIndex(from); const toIndex = this.store.nearestIndex(to);
    if (fromIndex < 0 || toIndex < 0) return;
    if(this.workspacePadding){const a=Math.min(fromIndex,toIndex),b=Math.max(fromIndex,toIndex);this.range={from:a===b?a-.5:a,to:(a===b?b+.5:b)+(b===this.store.length-1?this.offset:0)};this.clamp();return;}
    this.range = { from: Math.min(fromIndex, toIndex), to: Math.max(fromIndex + 1, toIndex) + this.offset }; this.clamp();
  }
  setLogicalRange(range: LogicalRange): void { if (!Number.isFinite(range.from) || !Number.isFinite(range.to) || range.to <= range.from) return; this.range = { ...range }; this.clamp(); }
  panPixels(delta: number): void { if(!Number.isFinite(delta))return; const logical = delta / this.barSpacing; this.range = { from: this.range.from - logical, to: this.range.to - logical }; this.clamp(); }
  zoomAt(x: number, factor: number): void {
    if(!Number.isFinite(x)||!Number.isFinite(factor)||factor<=0)return;
    const anchor = this.coordinateToLogical(x); const span = Math.max(Math.min(this.maximum, this.isCalendar ? 0.01 : 4), Math.min(this.isCalendar && !this.hasTimeline ? this.maximum : Math.max(4, this.panMaximum), (this.range.to - this.range.from) * factor));
    const ratio = (anchor - this.range.from) / (this.range.to - this.range.from);
    this.range = { from: anchor - span * ratio, to: anchor + span * (1 - ratio) }; this.clamp();
  }
  private lowerBound(key: number): number {
    let low = 0, high = this.grid.length;
    while (low < high) { const mid = (low + high) >>> 1; if (this.grid[mid] < key) low = mid + 1; else high = mid; }
    return low;
  }
  timeToLogical(time: MarketTime): number | null {
    const key = marketTimeKey(time);
    if (!Number.isFinite(key)) return null;
    const future = this.futureDisplayBounds;
    if (future && key >= future.time) return key <= future.end ? future.logical + (key - future.time) / future.intervalSeconds : null;
    if (!this.isCalendar) {
      const index = this.store.indexOf(time); if (index >= 0) return index;
      if (!future || !this.store.length) return null;
      let low=0, high=this.store.length;
      while(low<high){const middle=(low+high)>>>1;if(marketTimeKey(this.store.at(middle)!.time)<key)low=middle+1;else high=middle;}
      if (!low || low >= this.store.length) return null;
      const a=marketTimeKey(this.store.at(low-1)!.time),b=marketTimeKey(this.store.at(low)!.time);
      return low-1+(key-a)/(b-a);
    }
    if (this.axis.mode === "utc") return (key - marketTimeKey(this.axis.domain.from)) / this.axis.intervalSeconds;
    const next = this.lowerBound(key);
    if (this.grid[next] === key) return next;
    if (!next || next === this.grid.length) return null;
    return next - 1 + (key - this.grid[next - 1]) / (this.grid[next] - this.grid[next - 1]);
  }
  private logicalToTime(logical: number): MarketTime | null {
    const future = this.futureDisplayBounds;
    if (future && logical >= future.logical) return logical <= future.maximum + 1e-9 ? Math.min(future.end, future.time + (logical - future.logical) * future.intervalSeconds) : null;
    if (future && !this.isCalendar) {
      if (logical < 0) return null;
      const index=Math.floor(logical),a=this.store.at(index),b=this.store.at(index+1);
      return a ? marketTimeKey(a.time)+(logical-index)*(b?marketTimeKey(b.time)-marketTimeKey(a.time):0) : null;
    }
    if (this.hasTimeline && (logical < 0 || logical > (this.axis.mode === 'calendar' ? this.grid.length - 1 : this.isCalendar ? this.maximum : this.store.length - 1))) return null;
    if (this.axis.mode === "utc") return marketTimeKey(this.axis.domain.from) + logical * this.axis.intervalSeconds;
    if (this.axis.mode === "calendar") {
      const bounded = Math.max(0, Math.min(this.grid.length - 1, logical));
      const index = Math.floor(bounded);
      return this.grid[index] + (bounded - index) * ((this.grid[index + 1] ?? this.grid[index]) - this.grid[index]);
    }
    if(this.workspacePadding && (logical < -.5 || logical > this.store.length-.5))return null;
    return this.store.at(Math.max(0, Math.min(this.store.length - 1, Math.round(logical))))?.time ?? null;
  }
  coordinateToTime(x: number): MarketTime | null { return this.logicalToTime(this.coordinateToLogical(x)); }
  /** Known display bounds only; used by labels, never extrapolates the blank extension. */
  visibleDisplayTimes(): VisibleRange | null {
    if (this.futureDisplayBounds) {
      const from = this.logicalToTime(Math.max(0, this.range.from)), to = this.logicalToTime(Math.min(this.panMaximum, this.range.to));
      return from == null || to == null ? null : {from, to};
    }
    const maximum=this.axis.mode==='calendar'?this.grid.length-1:this.isCalendar?this.maximum:this.store.length-1;
    if(maximum<0||this.range.from>maximum||this.range.to<0)return null;
    const from=this.logicalToTime(Math.max(0,this.range.from)),to=this.logicalToTime(Math.min(maximum,this.range.to));
    return from==null||to==null?null:{from,to};
  }
  visibleTimes(): VisibleRange | null {
    // Only accepted observations are economic bounds in the new presentation mode.
    // Calendar coordinates (including supplied future earnings) remain drawable separately.
    if (this.hasTimeline || this.hasFutureDisplay) {
      const indexes = this.visibleIndexes(0), first = this.store.at(indexes.from), last = this.store.at(indexes.to - 1);
      return first && last && indexes.to > indexes.from ? {from: first.time, to: last.time} : null;
    }
    if (this.isCalendar) { const from = this.logicalToTime(this.range.from), to = this.logicalToTime(this.range.to); return from == null || to == null ? null : { from, to }; }
    const indexes = this.visibleIndexes(0), first = this.store.at(indexes.from), last = this.store.at(Math.max(indexes.from, indexes.to - 1));
    return first && last && indexes.to>indexes.from ? { from: first.time, to: last.time } : null;
  }
  shiftTime(time: MarketTime, steps: number): MarketTime | null { const logical = this.timeToLogical(time); return logical == null ? null : this.logicalToTime(logical + steps); }
  timeToCoordinate(time: MarketTime): number | null { const logical = this.timeToLogical(time); return logical == null ? null : this.logicalToCoordinate(logical); }
  indexToCoordinate(index: number): number { const bar = this.store.at(index); return bar ? this.timeToCoordinate(bar.time) ?? Number.NaN : Number.NaN; }
  logicalToCoordinate(index: number): number { return this.leftInset + (index - this.range.from) * this.barSpacing; }
  coordinateToLogical(x: number): number { return this.range.from + (x - this.leftInset) / this.barSpacing; }
  coordinateToIndex(x: number): number {
    const pointerTime = this.hasFutureDisplay ? this.coordinateToTime(x) : null;
    if (pointerTime != null && (!this.store.latest || marketTimeKey(pointerTime) > marketTimeKey(this.store.latest.time))) return -1;
    if (this.hasFutureDisplay && this.coordinateToLogical(x) > (this.axis.mode === 'compressed' ? this.store.length - 1 : this.futureDisplayBounds?.logical ?? this.maximum)) return -1;
    if (!this.isCalendar) { const logical=this.coordinateToLogical(x); return (this.hasTimeline ? logical<0||logical>this.store.length-1 : this.workspacePadding&&(logical<-.5||logical>this.store.length-.5)) ? -1 : Math.max(0,Math.min(this.store.length-1,Math.round(logical))); }
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
    if((this.workspacePadding||this.hasTimeline||this.hasFutureDisplay)&&overscan===0)return {from:Math.min(this.store.length,Math.max(0,Math.ceil(this.range.from))),to:Math.max(0,Math.min(this.store.length,Math.floor(this.range.to)+1))};
    return { from: Math.max(0, Math.floor(this.range.from) - overscan), to: Math.min(this.store.length, Math.ceil(this.range.to) + overscan + 1) };
  }

  private clamp(): void {
    if (this.isCalendar || this.futureDisplayBounds) {
      const span = Math.min(this.panMaximum, Math.max(0.000001, this.range.to - this.range.from));
      const from = Math.max(0, Math.min(this.panMaximum - span, this.range.from));
      this.range = { from, to: from + span }; return;
    }
    if (!this.store.length && !this.futureDisplayBounds) { this.range = { from: 0, to: 1 }; return; }
    const span = Math.max(1, Math.min(this.range.to - this.range.from, Math.max(1, this.panMaximum)));
    let from = this.range.from; let to = from + span;
    if (to > this.panMaximum) { to = this.panMaximum; from = to - span; }
    if (from < 0) { from = 0; to = Math.min(this.panMaximum, span); }
    this.range = { from, to: Math.max(from + 1, to) };
  }
}
