import type { IndicatorDefinition, SerializableParameters } from "../core";
import {
  calculateAtr,
  calculateBollingerBands,
  calculateEma,
  calculateMacd,
  calculateRsi,
  calculateSma,
  calculateVwap,
} from "./calculations";
import { createAtrRuntime, createBollingerRuntime, createEmaRuntime, createMacdRuntime, createRsiRuntime, createSmaRuntime, createVwapRuntime } from "./incremental";

type PeriodParameters = SerializableParameters & { period: number };
type BollingerParameters = SerializableParameters & { period: number; standardDeviations: number };
type MacdParameters = SerializableParameters & { fastPeriod: number; slowPeriod: number; signalPeriod: number };

export const smaIndicator: IndicatorDefinition<PeriodParameters> = {
  id: "sma", version: 1, label: "Simple moving average", placement: "overlay",
  defaultParameters: { period: 20 }, lines: [{ id: "sma", label: "SMA", color: "hsl(var(--chart-1))" }],
  calculate: (data, parameters) => calculateSma(data, parameters.period),
  createRuntime: (parameters) => createSmaRuntime(parameters.period),
};

export const emaIndicator: IndicatorDefinition<PeriodParameters> = {
  id: "ema", version: 1, label: "Exponential moving average", placement: "overlay",
  defaultParameters: { period: 20 }, lines: [{ id: "ema", label: "EMA", color: "hsl(var(--chart-2))" }],
  calculate: (data, parameters) => calculateEma(data, parameters.period),
  createRuntime: (parameters) => createEmaRuntime(parameters.period),
};

export const vwapIndicator: IndicatorDefinition = {
  id: "vwap", version: 1, label: "Volume-weighted average price", placement: "overlay",
  defaultParameters: {}, lines: [{ id: "vwap", label: "VWAP", color: "hsl(var(--chart-3))" }],
  calculate: calculateVwap,
  createRuntime: createVwapRuntime,
};

export const bollingerBandsIndicator: IndicatorDefinition<BollingerParameters> = {
  id: "bollinger-bands", version: 1, label: "Bollinger Bands", placement: "overlay",
  defaultParameters: { period: 20, standardDeviations: 2 },
  lines: [
    { id: "upper", label: "Upper", color: "hsl(var(--chart-4))" },
    { id: "middle", label: "Middle", color: "hsl(var(--chart-1))" },
    { id: "lower", label: "Lower", color: "hsl(var(--chart-4))" },
  ],
  calculate: (data, parameters) => calculateBollingerBands(data, parameters.period, parameters.standardDeviations),
  createRuntime: (parameters) => createBollingerRuntime(parameters.period, parameters.standardDeviations),
};

export const rsiIndicator: IndicatorDefinition<PeriodParameters> = {
  id: "rsi", version: 1, label: "Relative strength index", placement: "pane",
  defaultParameters: { period: 14 }, lines: [{ id: "rsi", label: "RSI", color: "hsl(var(--chart-2))" }],
  fixedDomain: [0, 100], referenceLines: [{ value: 30, label: "Oversold" }, { value: 70, label: "Overbought" }], formatValue: (value) => value.toFixed(2),
  calculate: (data, parameters) => calculateRsi(data, parameters.period),
  createRuntime: (parameters) => createRsiRuntime(parameters.period),
};

export const macdIndicator: IndicatorDefinition<MacdParameters> = {
  id: "macd", version: 1, label: "MACD", placement: "pane",
  defaultParameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  lines: [
    { id: "macd", label: "MACD", color: "hsl(var(--chart-1))" },
    { id: "signal", label: "Signal", color: "hsl(var(--chart-2))" },
    { id: "histogram", label: "Histogram", style: "histogram", color: "hsl(var(--chart-3))" },
  ],
  calculate: (data, parameters) => calculateMacd(data, parameters.fastPeriod, parameters.slowPeriod, parameters.signalPeriod),
  createRuntime: (parameters) => createMacdRuntime(parameters.fastPeriod, parameters.slowPeriod, parameters.signalPeriod),
};

export const atrIndicator: IndicatorDefinition<PeriodParameters> = {
  id: "atr", version: 1, label: "Average true range", placement: "pane",
  defaultParameters: { period: 14 }, lines: [{ id: "atr", label: "ATR", color: "hsl(var(--chart-5))" }],
  calculate: (data, parameters) => calculateAtr(data, parameters.period),
  createRuntime: (parameters) => createAtrRuntime(parameters.period),
};

export const stochasticIndicator: IndicatorDefinition = {
  createRuntime(parameters) { let bars: import('../core').OhlcBar[]=[]; const calculate=()=>stochasticIndicator.calculate(bars,parameters); return { reset(data) { bars=Array.from(data); return calculate(); }, appendOrUpdate(bar) { if(bars.at(-1)?.time===bar.time) bars[bars.length-1]=bar; else bars.push(bar); const count=Number(parameters.period??14)+Number(parameters.smooth??3); return stochasticIndicator.calculate(bars.slice(-count),parameters).at(-1)!; } }; },
  id: 'stochastic', version: 1, label: 'Stochastic', placement: 'pane', defaultParameters: { period: 14, smooth: 3 }, fixedDomain: [0,100], referenceLines: [{value:20,label:'Lower band'},{value:80,label:'Upper band'}], lines: [{id:'k',label:'%K',color:'hsl(var(--chart-1))'},{id:'d',label:'%D',color:'hsl(var(--chart-2))'}],
  calculate(data, parameters) { const period=Math.max(1,Math.floor(Number(parameters.period)||14)); const smooth=Math.max(1,Math.floor(Number(parameters.smooth)||3)); const ks: Array<number|null>=[]; return data.map((bar,i)=>{ if(i<period-1) {ks.push(null); return {time:bar.time,values:{k:null,d:null}};} const window=data.slice(i-period+1,i+1); const high=window.reduce((n,b)=>Math.max(n,b.high),-Infinity); const low=window.reduce((n,b)=>Math.min(n,b.low),Infinity); const k=high===low?50:100*(bar.close-low)/(high-low); ks.push(k); const values=ks.slice(-smooth); return {time:bar.time,values:{k,d:values.length===smooth && values.every(v=>v!=null)?values.reduce<number>((a,b)=>a+(b??0),0)/smooth:null}}; }); }
};
export const builtInIndicators: IndicatorDefinition[] = [
  stochasticIndicator,
  smaIndicator,
  emaIndicator,
  vwapIndicator,
  bollingerBandsIndicator,
  rsiIndicator,
  macdIndicator,
  atrIndicator,
] as IndicatorDefinition[];
