import {createCalculationRequests, createTechnicalChartViewState, type IndicatorDefinition, type SuppliedCalculationResults, type TechnicalChartViewState} from '../../core';
import {suppliedStudyDefinitions} from '../../indicators';

export const movingAverageBars = Array.from({length: 36}, (_, i) => ({time: 1790985600 + i * 86400, open: 100, close: 100.25, high: 102, low: 98, volume: 1_000_000, incomplete: i === 35}));
export type MovingAverageFixture = 'normal' | 'equal' | 'offscale' | 'null' | 'sparse' | 'warmup' | 'unavailable' | 'duplicates' | 'many' | 'custom' | 'empty' | 'log-invalid';
export const movingAverageDefinitions: IndicatorDefinition[] = [...suppliedStudyDefinitions, {
  id: 'host-ma', version: 1, label: 'Host custom moving average', placement: 'overlay', axisLabelKind: 'moving-average',
  defaultParameters: {period: 37}, formatParameters: parameters => `${parameters.period} custom`, lines: [{id: 'host', label: 'Host MA', color: '#e879a8'}],
  calculate: () => {throw Error('Synthetic supplied-only fixture forbids calculations');},
}];
export function movingAverageState(variant: MovingAverageFixture = 'normal'): TechnicalChartViewState {
  const state = createTechnicalChartViewState('price-only');
  state.chrome = {...state.chrome, drawingRail: false};
  state.indicators = [20,50,150,200].map((period, index) => ({id: `opaque-ma-${index}`, definitionId: index ? 'sma' : 'ema', version: 1, parameters: {period}, visible: true, colors: {[index ? 'sma' : 'ema']: ['#34b8d8','#c18cff','#eab75e','#ee809c'][index]}}));
  if (variant === 'duplicates') state.indicators.push({...state.indicators[1], id: 'opaque-duplicate', colors: {sma: '#3ec9a7'}});
  if (variant === 'many') state.indicators = Array.from({length: 24}, (_, index) => ({...state.indicators[index % 4], id: `opaque-many-${index}`, parameters: {period: 20 + index}}));
  if (variant === 'custom') state.indicators.push({id: 'opaque-host-custom', definitionId: 'host-ma', version: 1, parameters: {period: 37}, visible: true, colors: {host: '#ef8f59'}});
  state.panes = [{id: 'price', order: 0, size: 1, minimumSize: 260, studyIds: state.indicators.map(item => item.id), scaleSide: 'right'}];
  state.viewport = {visibleRange: {from: movingAverageBars[0].time, to: movingAverageBars.at(-1)!.time}, rightOffsetBars: 0};
  if (variant === 'offscale' || variant === 'log-invalid') state.scale = {mode: variant === 'log-invalid' ? 'logarithmic' : 'normal', autoScale: false, manualRange: {minimum: variant === 'log-invalid' ? Math.log(98) : 98, maximum: variant === 'log-invalid' ? Math.log(102) : 102}};
  return state;
}
/** Literal synthetic producer samples. These values are independent of the OHLC sequence and are not moving-average formulas. */
export function movingAverageResults(state: TechnicalChartViewState, variant: MovingAverageFixture = 'normal', identity = 'synthetic-ma', revision = 0): SuppliedCalculationResults {
  const samples = [99.875, 100.125, 100.25, 100.375, 100.5, 100.625];
  return Object.fromEntries(createCalculationRequests(identity, 'SYNTHETIC', '1D', state).filter(request => request.kind === 'indicator').map(request => {
    const index = state.indicators.findIndex(item => item.id === request.instanceId), instance = state.indicators[index];
    const key = instance.definitionId === 'host-ma' ? 'host' : instance.definitionId;
    const points = movingAverageBars.filter((_, i) => variant !== 'sparse' || i !== 35).map((bar, i) => ({time: bar.time, values: {[key]: variant === 'warmup' || variant === 'null' && i === 35 ? null : variant === 'equal' ? 100.125 : variant === 'offscale' ? [108,94,104,96][index % 4] : variant === 'log-invalid' && index === 0 ? -1 : samples[Math.floor(i / 6)] + [0,.00001,.00002,.00003][index % 4] + (i === 35 ? revision * .25 : 0)}}));
    return [request.instanceId, {kind: 'indicator' as const, requestKey: request.requestKey, status: variant === 'unavailable' ? 'unavailable' as const : 'partial' as const, stale: true,
      provenanceLabel: 'Static synthetic supplied output; no market source', warning: 'Synthetic coverage warning retained in source evidence', coverageSummary: '36 static daily samples', points}];
  }));
}
