import {createCalculationRequests, createTechnicalChartViewState, type SuppliedCalculationResults, type TechnicalChartViewState} from '../../core';
import {suppliedStudyDefinitions} from '../../indicators';

/** Static synthetic observations supplied upstream; never calculated by the chart. */
export const readabilityBars = Array.from({length: 180}, (_, i) => ({
  time: 1790985600 + i * 300, open: 100 + Math.sin(i / 12) * 3,
  close: 100 + Math.sin(i / 12) * 3 + (i % 3 - 1) * .4,
  high: 101 + Math.sin(i / 12) * 3, low: 99 + Math.sin(i / 12) * 3,
  volume: 1_000_000 + i % 17 * 100_000, incomplete: i === 179,
}));
export const readabilityDefinitions = suppliedStudyDefinitions.map(definition => {
  if (definition.id !== 'adx') return definition;
  const {fixedDomain: _fixedDomain, ...automatic} = definition;
  return automatic;
});
export function readabilityState(): TechnicalChartViewState {
  const state = createTechnicalChartViewState('price-only');
  state.chrome.drawingRail = false;
  state.viewport = {visibleRange: {from: readabilityBars[60].time, to: readabilityBars.at(-1)!.time}, rightOffsetBars: 0};
  state.panes = [{id: 'price', order: 0, size: 3, minimumSize: 420, showVolume: true, studyIds: ['opaque:sma:one', 'opaque:sma:two', 'opaque:ema']},
    {id: 'trend', order: 1, size: 1.4, minimumSize: 144, studyIds: ['opaque:adx']}];
  state.indicators = [
    {id: 'opaque:sma:one', definitionId: 'sma', version: 1, parameters: {period: 20}, visible: true, colors: {sma: '#22b8cf'}},
    {id: 'opaque:sma:two', definitionId: 'sma', version: 1, parameters: {period: 50}, visible: true, colors: {sma: '#a78bfa'}},
    {id: 'opaque:adx', definitionId: 'adx', version: 1, parameters: {period: 14}, visible: true, colors: {adx: '#a78bfa', plus_di: '#d5a82f', minus_di: '#22b8a8'}},
    {id: 'opaque:ema', definitionId: 'ema', version: 1, parameters: {period: 20}, visible: true, colors: {ema: '#e58c3d'}},
  ];
  state.profiles = [{id: 'opaque:profile', range: 'visible', rows: 8, widthPercent: 14, placement: 'left', valueAreaPercent: 70, showPoc: true, showValueArea: true, splitVolume: true, visible: true}];
  state.drawings = [{id: 'opaque:session', type: 'session-vwap', version: 1, visible: true, locked: true, points: [{time: readabilityBars[0].time, price: 100}], parameters: {color: '#da79ab', lineWidth: 1.5}},
    {id: 'opaque:anchor', type: 'anchored-vwap', version: 1, visible: true, locked: true, points: [{time: readabilityBars[30].time, price: 100}], parameters: {color: '#71ab7d', lineWidth: 1.5}}];
  return state;
}
export function readabilityResults(state: TechnicalChartViewState, variant: 'normal' | 'strong' | 'sub25' | 'constant' | 'warmup' | 'unavailable' = 'normal', identity = 'synthetic-readability', bars = readabilityBars): SuppliedCalculationResults {
  return Object.fromEntries(createCalculationRequests(identity, 'SYNTHETIC', '5m', state).map(request => {
    const metadata = {requestKey: request.requestKey, status: variant === 'unavailable' ? 'unavailable' as const : 'partial' as const,
      stale: true, warning: 'Synthetic cached coverage has a gap; inspect complete source evidence.',
      provenanceLabel: 'Static synthetic supplied observations — no market source', coverageSummary: '180 synthetic five-minute observations'};
    if (request.kind === 'profile') return [request.instanceId, {...metadata, kind: 'profile', approximate: true,
      profile: {rows: Array.from({length: 8}, (_, i) => ({priceFrom: 97 + i * .8, priceTo: 97.8 + i * .8, upVolume: 100_000 + i * 15_000, downVolume: 70_000 + (7 - i) * 20_000})),
        totalVolume: 2_000_000, poc: 100.6, vah: 102.6, val: 98.6, provenance: 'bar-derived-approximation'}}];
    if (request.kind === 'drawing') return [request.instanceId, {...metadata, kind: 'drawing', points: bars.map((bar, i) => ({time: bar.time, value: variant === 'warmup' ? null : 100 + Math.sin(i / 24) * (request.instanceId.includes('session') ? 1.4 : 1.7)}))}];
    const instance = state.indicators.find(item => item.id === request.instanceId)!;
    const points = bars.map((bar, i) => ({time: bar.time, values: instance.definitionId === 'sma'
      ? {sma: variant === 'warmup' ? null : 100 + Math.sin((i - Number(instance.parameters.period) / 2) / 12) * 2.2}
      : instance.definitionId === 'ema' ? {ema: variant === 'warmup' ? null : 100 + Math.sin((i - 8) / 12) * 2.4}
      : instance.definitionId !== 'adx' ? Object.fromEntries(readabilityDefinitions.find(definition => definition.id === instance.definitionId)!.lines.map((line, index) => [line.id, variant === 'warmup' ? null : instance.definitionId === 'bb' ? 104 - index * 4 + Math.sin(i / 12) * 2 : instance.definitionId === 'macd' ? Math.sin(i / 12 + index) * (2 - index / 2) : 35 + index * 8 + Math.sin(i / 12) * 6]))
      : {adx: variant === 'warmup' ? null : variant === 'constant' ? 0 : variant === 'strong' ? 53 + i % 17 : variant === 'sub25' ? 12 + i % 6 : 18 + Math.sin(i / 10) * 6,
        plus_di: variant === 'warmup' ? null : variant === 'constant' ? 0 : variant === 'sub25' ? 13 + Math.sin(i / 14) * 3 : 19 + Math.sin(i / 14) * 7,
        minus_di: variant === 'warmup' ? null : variant === 'constant' ? 0 : variant === 'sub25' ? 18 + Math.cos(i / 13) * 3 : 26 + Math.cos(i / 13) * 8}}));
    return [request.instanceId, {...metadata, kind: 'indicator', points}];
  }));
}
