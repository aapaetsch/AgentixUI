import type { MarketScaleMode, MarketScaleSnapshot } from "../core";

export class PriceScale {
  private minimum = 0;
  private maximum = 1;
  private anchor?: number;

  constructor(public mode: MarketScaleMode = "normal", private top = 0, private height = 1) {}
  setGeometry(top: number, height: number): void { this.top = top; this.height = Math.max(1, height); }
  setMode(mode: MarketScaleMode): void { this.mode = mode; }
  get snapshot(): MarketScaleSnapshot { return { mode: this.mode, minimum: this.minimum, maximum: this.maximum, anchor: this.anchor }; }

  autoscale(values: readonly number[], anchor?: number, fixedDomain?: readonly [number, number]): string | null {
    this.anchor = anchor;
    if (this.mode === "logarithmic" && values.some((value) => value <= 0)) return "Logarithmic scale requires positive visible prices.";
    let transformed = values.filter(Number.isFinite).map((value) => this.transform(value));
    if (fixedDomain) transformed = [this.transform(fixedDomain[0]), this.transform(fixedDomain[1])];
    if (!transformed.length) { this.minimum = 0; this.maximum = 1; return null; }
    let minimum = Math.min(...transformed); let maximum = Math.max(...transformed);
    const padding = Math.max((maximum - minimum) * 0.08, Math.abs(maximum || 1) * 0.001);
    if (!fixedDomain) { minimum -= padding; maximum += padding; }
    if (minimum === maximum) { minimum -= 1; maximum += 1; }
    this.minimum = minimum; this.maximum = maximum;
    return null;
  }
  toCoordinate(value: number): number | null {
    const transformed = this.transform(value); if (!Number.isFinite(transformed)) return null;
    return this.top + ((this.maximum - transformed) / (this.maximum - this.minimum)) * this.height;
  }
  fromCoordinate(y: number): number | null {
    const transformed = this.maximum - ((y - this.top) / this.height) * (this.maximum - this.minimum);
    return this.inverse(transformed);
  }
  format(value: number): string {
    if (this.mode === "percentage") return `${value.toFixed(2)}%`;
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(value);
  }

  private transform(value: number): number {
    if (this.mode === "logarithmic") return value > 0 ? Math.log(value) : Number.NaN;
    if (this.mode === "percentage") return this.anchor ? ((value / this.anchor) - 1) * 100 : 0;
    if (this.mode === "indexedTo100") return this.anchor ? (value / this.anchor) * 100 : 100;
    return value;
  }
  private inverse(value: number): number | null {
    if (this.mode === "logarithmic") return Math.exp(value);
    if (this.mode === "percentage") return this.anchor ? this.anchor * (1 + value / 100) : null;
    if (this.mode === "indexedTo100") return this.anchor ? this.anchor * value / 100 : null;
    return value;
  }
}
