import type { IndicatorPoint, MarketTime, OhlcBar } from "../core";

function point(time: MarketTime, values: Record<string, number | null>): IndicatorPoint {
  return { time, values };
}

function simpleMovingAverage(values: readonly number[], period: number): Array<number | null> {
  const output: Array<number | null> = Array(values.length).fill(null);
  let sum = 0;
  for (let index = 0; index < values.length; index += 1) {
    sum += values[index];
    if (index >= period) sum -= values[index - period];
    if (index >= period - 1) output[index] = sum / period;
  }
  return output;
}

function exponentialMovingAverage(values: readonly number[], period: number): Array<number | null> {
  const output: Array<number | null> = Array(values.length).fill(null);
  if (values.length < period) return output;
  const multiplier = 2 / (period + 1);
  let current = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  output[period - 1] = current;
  for (let index = period; index < values.length; index += 1) {
    current = (values[index] - current) * multiplier + current;
    output[index] = current;
  }
  return output;
}

export function calculateSma(data: readonly OhlcBar[], period: number): IndicatorPoint[] {
  const values = simpleMovingAverage(data.map((bar) => bar.close), period);
  return data.map((bar, index) => point(bar.time, { sma: values[index] }));
}

export function calculateEma(data: readonly OhlcBar[], period: number): IndicatorPoint[] {
  const values = exponentialMovingAverage(data.map((bar) => bar.close), period);
  return data.map((bar, index) => point(bar.time, { ema: values[index] }));
}

export function calculateVwap(data: readonly OhlcBar[]): IndicatorPoint[] {
  let cumulativePriceVolume = 0;
  let cumulativeVolume = 0;
  return data.map((bar) => {
    const volume = bar.volume ?? 0;
    cumulativePriceVolume += ((bar.high + bar.low + bar.close) / 3) * volume;
    cumulativeVolume += volume;
    return point(bar.time, { vwap: cumulativeVolume === 0 ? null : cumulativePriceVolume / cumulativeVolume });
  });
}

export function calculateBollingerBands(
  data: readonly OhlcBar[],
  period: number,
  standardDeviations: number,
): IndicatorPoint[] {
  const closes = data.map((bar) => bar.close);
  const averages = simpleMovingAverage(closes, period);
  return data.map((bar, index) => {
    const middle = averages[index];
    if (middle == null) return point(bar.time, { upper: null, middle: null, lower: null });
    const window = closes.slice(index - period + 1, index + 1);
    const variance = window.reduce((sum, value) => sum + (value - middle) ** 2, 0) / period;
    const deviation = Math.sqrt(variance) * standardDeviations;
    return point(bar.time, { upper: middle + deviation, middle, lower: middle - deviation });
  });
}

export function calculateRsi(data: readonly OhlcBar[], period: number): IndicatorPoint[] {
  const output = data.map((bar) => point(bar.time, { rsi: null }));
  if (data.length <= period) return output;
  let gains = 0;
  let losses = 0;
  for (let index = 1; index <= period; index += 1) {
    const change = data[index].close - data[index - 1].close;
    gains += Math.max(change, 0);
    losses += Math.max(-change, 0);
  }
  let averageGain = gains / period;
  let averageLoss = losses / period;
  const toRsi = () => averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);
  output[period].values.rsi = toRsi();
  for (let index = period + 1; index < data.length; index += 1) {
    const change = data[index].close - data[index - 1].close;
    averageGain = (averageGain * (period - 1) + Math.max(change, 0)) / period;
    averageLoss = (averageLoss * (period - 1) + Math.max(-change, 0)) / period;
    output[index].values.rsi = toRsi();
  }
  return output;
}

export function calculateMacd(
  data: readonly OhlcBar[],
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number,
): IndicatorPoint[] {
  const closes = data.map((bar) => bar.close);
  const fast = exponentialMovingAverage(closes, fastPeriod);
  const slow = exponentialMovingAverage(closes, slowPeriod);
  const macd = closes.map((_, index) => fast[index] == null || slow[index] == null ? null : fast[index]! - slow[index]!);
  const firstMacdIndex = macd.findIndex((value) => value != null);
  const denseMacd = firstMacdIndex < 0 ? [] : macd.slice(firstMacdIndex) as number[];
  const denseSignal = exponentialMovingAverage(denseMacd, signalPeriod);

  return data.map((bar, index) => {
    const macdValue = macd[index];
    const signalIndex = index - firstMacdIndex;
    const signal = signalIndex >= 0 ? denseSignal[signalIndex] ?? null : null;
    return point(bar.time, {
      macd: macdValue,
      signal,
      histogram: macdValue == null || signal == null ? null : macdValue - signal,
    });
  });
}

export function calculateAtr(data: readonly OhlcBar[], period: number): IndicatorPoint[] {
  const output = data.map((bar) => point(bar.time, { atr: null }));
  if (data.length < period) return output;
  const trueRanges = data.map((bar, index) => {
    if (index === 0) return bar.high - bar.low;
    const previousClose = data[index - 1].close;
    return Math.max(bar.high - bar.low, Math.abs(bar.high - previousClose), Math.abs(bar.low - previousClose));
  });
  let current = trueRanges.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  output[period - 1].values.atr = current;
  for (let index = period; index < data.length; index += 1) {
    current = (current * (period - 1) + trueRanges[index]) / period;
    output[index].values.atr = current;
  }
  return output;
}
