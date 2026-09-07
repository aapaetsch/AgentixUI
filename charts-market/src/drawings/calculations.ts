import type { DrawingCoordinate, DrawingPoint, MarketTime, OhlcBar } from "../core";
import { marketTimeKey } from "../core";

export type DrawingPriceSource = "open" | "high" | "low" | "close" | "hl2" | "hlc3" | "ohlc4";

export function sourceValue(bar: OhlcBar, source: DrawingPriceSource = "hlc3"): number {
  if (source === "hl2") return (bar.high + bar.low) / 2;
  if (source === "hlc3") return (bar.high + bar.low + bar.close) / 3;
  if (source === "ohlc4") return (bar.open + bar.high + bar.low + bar.close) / 4;
  return bar[source];
}

export function resolveInclusiveRange(data: readonly OhlcBar[], first: DrawingPoint, second: DrawingPoint): readonly OhlcBar[] {
  const left = marketTimeKey(first.time);
  const right = marketTimeKey(second.time);
  const minimum = Math.min(left, right);
  const maximum = Math.max(left, right);
  return data.filter((bar) => {
    const key = marketTimeKey(bar.time);
    return key >= minimum && key <= maximum;
  });
}

export function elapsedMilliseconds(first: MarketTime, second: MarketTime): number {
  return Math.abs(marketTimeKey(second) - marketTimeKey(first)) * 1_000;
}

export function formatDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds)) return "Unavailable";
  const seconds = Math.round(milliseconds / 1_000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export interface RangeMeasurement {
  absoluteChange: number;
  percentageChange: number | null;
  bars: number;
  durationMs: number;
}

export function calculateRangeMeasurement(data: readonly OhlcBar[], first: DrawingPoint, second: DrawingPoint): RangeMeasurement {
  const absoluteChange = second.price - first.price;
  return {
    absoluteChange,
    percentageChange: first.price === 0 ? null : (absoluteChange / first.price) * 100,
    bars: resolveInclusiveRange(data, first, second).length,
    durationMs: elapsedMilliseconds(first.time, second.time),
  };
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  deviation: number;
  values: number[];
}

export function calculateLinearRegression(bars: readonly OhlcBar[], source: DrawingPriceSource = "close"): RegressionResult | null {
  if (bars.length < 2) return null;
  const values = bars.map((bar) => sourceValue(bar, source));
  const meanX = (bars.length - 1) / 2;
  const meanY = values.reduce((sum, value) => sum + value, 0) / values.length;
  let numerator = 0;
  let denominator = 0;
  values.forEach((value, index) => {
    numerator += (index - meanX) * (value - meanY);
    denominator += (index - meanX) ** 2;
  });
  if (denominator === 0) return null;
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  const fitted = values.map((_, index) => intercept + slope * index);
  const deviation = Math.sqrt(values.reduce((sum, value, index) => sum + (value - fitted[index]) ** 2, 0) / values.length);
  return { slope, intercept, deviation, values: fitted };
}

export interface VwapPoint {
  time: MarketTime;
  value: number;
  standardDeviation: number;
}

export interface VwapResult {
  available: boolean;
  reason?: string;
  points: VwapPoint[];
}

export function calculateDrawingVwap(bars: readonly OhlcBar[], source: DrawingPriceSource = "hlc3"): VwapResult {
  if (bars.some((bar) => bar.volume == null)) {
    return { available: false, reason: "VWAP is unavailable because volume is missing in the selected range.", points: [] };
  }
  let volume = 0;
  let weightedPrice = 0;
  let weightedSquare = 0;
  const points: VwapPoint[] = [];
  for (const bar of bars) {
    const price = sourceValue(bar, source);
    const weight = bar.volume ?? 0;
    volume += weight;
    weightedPrice += price * weight;
    weightedSquare += price * price * weight;
    if (volume === 0) continue;
    const value = weightedPrice / volume;
    points.push({ time: bar.time, value, standardDeviation: Math.sqrt(Math.max(0, weightedSquare / volume - value * value)) });
  }
  return { available: true, points };
}

export function calculatePosition(points: readonly DrawingPoint[], direction: "long" | "short", accountSize?: number, riskPercent?: number, quantity?: number) {
  if (points.length < 3) return null;
  const [entry, target, stop] = points;
  const reward = direction === "long" ? target.price - entry.price : entry.price - target.price;
  const risk = direction === "long" ? entry.price - stop.price : stop.price - entry.price;
  const calculatedQuantity = quantity ?? (accountSize && riskPercent && risk > 0 ? accountSize * (riskPercent / 100) / risk : null);
  return {
    entry: entry.price,
    target: target.price,
    stop: stop.price,
    reward,
    rewardPercent: entry.price === 0 ? null : reward / entry.price * 100,
    risk,
    riskPercent: entry.price === 0 ? null : risk / entry.price * 100,
    riskReward: risk > 0 ? reward / risk : null,
    quantity: calculatedQuantity,
  };
}

function perpendicularDistance(point: DrawingCoordinate, first: DrawingCoordinate, last: DrawingCoordinate): number {
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - first.x, point.y - first.y);
  return Math.abs(dy * point.x - dx * point.y + last.x * first.y - last.y * first.x) / Math.hypot(dx, dy);
}

/** Deterministic Ramer-Douglas-Peucker simplification for brush/highlighter input. */
export function simplifyCoordinates(points: readonly DrawingCoordinate[], tolerance = 1.5): DrawingCoordinate[] {
  if (points.length <= 2) return points.slice();
  let maximum = 0;
  let split = 0;
  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = perpendicularDistance(points[index], points[0], points.at(-1)!);
    if (distance > maximum) { maximum = distance; split = index; }
  }
  if (maximum <= tolerance) return [points[0], points.at(-1)!];
  const left = simplifyCoordinates(points.slice(0, split + 1), tolerance);
  const right = simplifyCoordinates(points.slice(split), tolerance);
  return [...left.slice(0, -1), ...right];
}
