import type { IndicatorPoint, IndicatorRuntime, OhlcBar } from "../core";
import { marketTimeKey } from "../core";

type Step<TState> = (state: TState, bar: OhlcBar) => Record<string, number | null>;

function runtime<TState>(createState: () => TState, step: Step<TState>): IndicatorRuntime {
  let state = createState(); let bars: OhlcBar[] = []; let points: IndicatorPoint[] = [];
  const append = (bar: OhlcBar) => { const result = { time: bar.time, values: step(state, bar) }; bars.push(bar); points.push(result); return result; };
  const reset = (data: readonly OhlcBar[]) => { state = createState(); bars = []; points = []; data.forEach(append); return points.slice(); };
  return { reset, appendOrUpdate(bar) { if (bars.length && marketTimeKey(bars.at(-1)!.time) === marketTimeKey(bar.time)) return reset([...bars.slice(0, -1), bar]).at(-1)!; return append(bar); } };
}

export function createSmaRuntime(period: number): IndicatorRuntime {
  return runtime(() => ({ values: [] as number[], sum: 0 }), (state, bar) => { state.values.push(bar.close); state.sum += bar.close; if (state.values.length > period) state.sum -= state.values.shift()!; return { sma: state.values.length === period ? state.sum / period : null }; });
}

interface EmaState { count: number; seed: number; value: number | null }
function updateEma(state: EmaState, value: number, period: number): number | null { state.count += 1; if (state.count <= period) state.seed += value; if (state.count === period) state.value = state.seed / period; else if (state.count > period) state.value = (value - state.value!) * (2 / (period + 1)) + state.value!; return state.value; }
const emaState = (): EmaState => ({ count: 0, seed: 0, value: null });

export function createEmaRuntime(period: number): IndicatorRuntime { return runtime(emaState, (state, bar) => ({ ema: updateEma(state, bar.close, period) })); }

export function createVwapRuntime(): IndicatorRuntime {
  return runtime(() => ({ priceVolume: 0, volume: 0 }), (state, bar) => { const volume = bar.volume ?? 0; state.priceVolume += ((bar.high + bar.low + bar.close) / 3) * volume; state.volume += volume; return { vwap: state.volume ? state.priceVolume / state.volume : null }; });
}

export function createBollingerRuntime(period: number, deviations: number): IndicatorRuntime {
  return runtime(() => ({ values: [] as number[], sum: 0, squared: 0 }), (state, bar) => { state.values.push(bar.close); state.sum += bar.close; state.squared += bar.close ** 2; if (state.values.length > period) { const removed = state.values.shift()!; state.sum -= removed; state.squared -= removed ** 2; } if (state.values.length < period) return { upper: null, middle: null, lower: null }; const middle = state.sum / period; const deviation = Math.sqrt(Math.max(0, state.squared / period - middle ** 2)) * deviations; return { upper: middle + deviation, middle, lower: middle - deviation }; });
}

export function createRsiRuntime(period: number): IndicatorRuntime {
  return runtime(() => ({ previous: null as number | null, changes: 0, gains: 0, losses: 0, averageGain: 0, averageLoss: 0 }), (state, bar) => { if (state.previous == null) { state.previous = bar.close; return { rsi: null }; } const change = bar.close - state.previous; state.previous = bar.close; const gain = Math.max(change, 0); const loss = Math.max(-change, 0); state.changes += 1; if (state.changes <= period) { state.gains += gain; state.losses += loss; if (state.changes < period) return { rsi: null }; state.averageGain = state.gains / period; state.averageLoss = state.losses / period; } else { state.averageGain = (state.averageGain * (period - 1) + gain) / period; state.averageLoss = (state.averageLoss * (period - 1) + loss) / period; } return { rsi: state.averageLoss === 0 ? 100 : 100 - 100 / (1 + state.averageGain / state.averageLoss) }; });
}

export function createMacdRuntime(fastPeriod: number, slowPeriod: number, signalPeriod: number): IndicatorRuntime {
  return runtime(() => ({ fast: emaState(), slow: emaState(), signal: emaState() }), (state, bar) => { const fast = updateEma(state.fast, bar.close, fastPeriod); const slow = updateEma(state.slow, bar.close, slowPeriod); const macd = fast == null || slow == null ? null : fast - slow; const signal = macd == null ? null : updateEma(state.signal, macd, signalPeriod); return { macd, signal, histogram: macd == null || signal == null ? null : macd - signal }; });
}

export function createAtrRuntime(period: number): IndicatorRuntime {
  return runtime(() => ({ previous: null as number | null, count: 0, seed: 0, value: null as number | null }), (state, bar) => { const range = state.previous == null ? bar.high - bar.low : Math.max(bar.high - bar.low, Math.abs(bar.high - state.previous), Math.abs(bar.low - state.previous)); state.previous = bar.close; state.count += 1; if (state.count <= period) state.seed += range; if (state.count === period) state.value = state.seed / period; else if (state.count > period) state.value = (state.value! * (period - 1) + range) / period; return { atr: state.value }; });
}
