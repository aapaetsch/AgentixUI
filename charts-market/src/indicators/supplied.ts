import type { IndicatorDefinition } from "../core";

/** Metadata only. These definitions deliberately cannot calculate in internal mode. */
const specifications: Array<Pick<IndicatorDefinition, "id" | "label" | "placement" | "defaultParameters"> & { keys: string[] }> = [
  { id: "sma", label: "SMA", placement: "overlay", defaultParameters: { period: 20 }, keys: ["sma"] },
  { id: "ema", label: "EMA", placement: "overlay", defaultParameters: { period: 20 }, keys: ["ema"] },
  { id: "bb", label: "Bollinger Bands", placement: "overlay", defaultParameters: { period: 20, standard_deviations: "2" }, keys: ["upper", "middle", "lower"] },
  { id: "rsi", label: "RSI", placement: "pane", defaultParameters: { period: 14 }, keys: ["rsi"] },
  { id: "macd", label: "MACD", placement: "pane", defaultParameters: { fast_period: 12, slow_period: 26, signal_period: 9 }, keys: ["macd", "signal", "histogram"] },
  { id: "atr", label: "ATR", placement: "pane", defaultParameters: { period: 14 }, keys: ["atr"] },
  { id: "stochastic", label: "Stochastic", placement: "pane", defaultParameters: { period: 14, smooth_k: 1, smooth_d: 3 }, keys: ["k", "d"] },
  { id: "adx", label: "ADX", placement: "pane", defaultParameters: { period: 14 }, keys: ["adx", "plus_di", "minus_di"] },
];
export const suppliedStudyDefinitions: IndicatorDefinition[] = specifications.map(({ keys, ...definition }) => ({
  ...definition,
  placement: definition.placement as "overlay" | "pane",
  version: 1,
  axisLabelKind: ['sma', 'ema'].includes(definition.id) ? 'moving-average' : undefined,
  fixedDomain: ["rsi", "stochastic"].includes(definition.id) ? [0, 100] as const : undefined,
  formatParameters: parameters => Object.values(parameters).map(String).join(', '),
  referenceLines: definition.id === "rsi" ? [{ value: 30, label: "Lower band" }, { value: 70, label: "Upper band" }] : definition.id === "stochastic" ? [{ value: 20, label: "Lower band" }, { value: 80, label: "Upper band" }] : definition.id === "adx" ? [{ value: 25, label: "Trend reference" }] : definition.id === 'macd' ? [{value: 0, label: 'Zero'}] : undefined,
  lines: keys.map((id, index) => ({ id, label: ({sma: 'SMA', ema: 'EMA', upper: 'Upper', middle: 'Middle', lower: 'Lower', rsi: 'RSI', macd: 'MACD', signal: 'Signal', histogram: 'Histogram', atr: 'ATR', k: '%K', d: '%D', adx: 'ADX', plus_di: '+DI', minus_di: '−DI'} as Record<string, string>)[id] ?? id, style: id === "histogram" ? "histogram" : "line", color: ["#0284c7", "#d97706", "#a855f7"][index % 3] })),
  calculate: () => { throw new Error("This study requires supplied results."); },
}));
