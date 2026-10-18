import type { MarketScaleMode, MarketScaleSnapshot } from "../core";

export class PriceScale {
  private minimum = 0;
  private maximum = 1;
  private anchor?: number;

  constructor(
    public mode: MarketScaleMode = "normal",
    private top = 0,
    private height = 1,
  ) {}
  setGeometry(top: number, height: number): void {
    this.top = top;
    this.height = Math.max(1, height);
  }
  setMode(mode: MarketScaleMode): void {
    this.mode = mode;
  }
  get snapshot(): MarketScaleSnapshot {
    return {
      mode: this.mode,
      minimum: this.minimum,
      maximum: this.maximum,
      anchor: this.anchor,
    };
  }

  autoscale(
    values: readonly number[],
    anchor?: number,
    fixedDomain?: readonly [number, number],
    margin = 0.08,
  ): string | null {
    this.anchor = anchor;
    if (this.mode === "logarithmic" && values.some((value) => value <= 0))
      return "Logarithmic scale requires positive visible prices.";
    let transformed = values
      .filter(Number.isFinite)
      .map((value) => this.transform(value));
    if (fixedDomain)
      transformed = [
        this.transform(fixedDomain[0]),
        this.transform(fixedDomain[1]),
      ];
    if (!transformed.length) {
      this.minimum = 0;
      this.maximum = 1;
      return null;
    }
    let minimum = transformed.reduce((a, b) => Math.min(a, b), Infinity);
    let maximum = transformed.reduce((a, b) => Math.max(a, b), -Infinity);
    const padding = Math.max(
      (maximum - minimum) * margin,
      Math.abs(maximum || 1) * 0.001,
    );
    if (!fixedDomain) {
      minimum -= padding;
      maximum += padding;
    }
    if (minimum === maximum) {
      minimum -= 1;
      maximum += 1;
    }
    this.minimum = minimum;
    this.maximum = maximum;
    return null;
  }
  setRange(range: { minimum: number; maximum: number; anchor?: number }): void {
    if (
      Number.isFinite(range.minimum) &&
      Number.isFinite(range.maximum) &&
      range.maximum > range.minimum
    ) {
      this.minimum = range.minimum;
      this.maximum = range.maximum;
      this.anchor = range.anchor;
    }
  }
  /** Round ticks in the displayed domain; return raw prices for coordinate conversion. */
  ticks(count = 5): number[] {
    const rough = (this.maximum - this.minimum) / Math.max(1, count - 1);
    const power = 10 ** Math.floor(Math.log10(rough));
    const fraction = rough / power;
    const step =
      [1, 2, 2.5, 5, 10].reduce((best, candidate) =>
        Math.abs(candidate - fraction) < Math.abs(best - fraction)
          ? candidate
          : best,
      ) * power;
    const ticks: number[] = [];
    for (
      let value = Math.ceil(this.minimum / step) * step;
      value <= this.maximum + step * 1e-8 && ticks.length < 20;
      value += step
    ) {
      const raw = this.inverse(value);
      if (raw != null) ticks.push(raw);
    }
    return ticks;
  }
  formatPrice(value: number, precision = 2): string {
    const transformed = this.transform(value);
    return this.mode === "percentage"
      ? transformed.toFixed(precision) + "%"
      : (this.mode === "logarithmic" ? value : transformed).toFixed(precision);
  }
  toCoordinate(value: number): number | null {
    const transformed = this.transform(value);
    if (!Number.isFinite(transformed)) return null;
    return (
      this.top +
      ((this.maximum - transformed) / (this.maximum - this.minimum)) *
        this.height
    );
  }
  fromCoordinate(y: number): number | null {
    const transformed =
      this.maximum -
      ((y - this.top) / this.height) * (this.maximum - this.minimum);
    return this.inverse(transformed);
  }
  format(value: number): string {
    if (this.mode === "logarithmic") value = Math.exp(value);
    if (this.mode === "percentage") return `${value.toFixed(2)}%`;
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 4,
    }).format(value);
  }

  private transform(value: number): number {
    if (this.mode === "logarithmic")
      return value > 0 ? Math.log(value) : Number.NaN;
    if (this.mode === "percentage")
      return this.anchor ? (value / this.anchor - 1) * 100 : 0;
    if (this.mode === "indexedTo100")
      return this.anchor ? (value / this.anchor) * 100 : 100;
    return value;
  }
  private inverse(value: number): number | null {
    if (this.mode === "logarithmic") return Math.exp(value);
    if (this.mode === "percentage")
      return this.anchor ? this.anchor * (1 + value / 100) : null;
    if (this.mode === "indexedTo100")
      return this.anchor ? (this.anchor * value) / 100 : null;
    return value;
  }
}
