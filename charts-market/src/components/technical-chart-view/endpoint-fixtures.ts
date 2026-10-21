import {createCalculationRequests, type SuppliedCalculationResults, type TechnicalChartViewState} from '../../core';
import {suppliedStudyDefinitions} from '../../indicators';
import {movingAverageBars, movingAverageState} from './moving-average-fixtures';

export const endpointBars = movingAverageBars;
export const endpointDefinitions = suppliedStudyDefinitions.map(definition => ({...definition,
  calculate: () => {throw Error('Supplied-only endpoint fixture forbids financial calculations');},
  createRuntime: () => {throw Error('Supplied-only endpoint fixture forbids runtimes');},
}));
export type EndpointFixture = 'normal' | 'equal' | 'crossing' | 'offscale' | 'missing' | 'sparse' | 'unavailable' | 'dense' | 'log';
export function endpointState(variant: EndpointFixture = 'normal'): TechnicalChartViewState {
  const state = movingAverageState(variant === 'dense' ? 'many' : 'normal');
  const overlays = state.indicators.map(item => item.id);
  for (const id of ['rsi', 'macd', 'stochastic', 'adx']) {
    const definition = suppliedStudyDefinitions.find(item => item.id === id)!;
    state.indicators.push({id: `opaque-${id}`, definitionId: id, version: 1, parameters: {...definition.defaultParameters}, visible: true,
      colors: Object.fromEntries(definition.lines.map((line, index) => [line.id, ['#38b8d8', '#eab75e', '#ee809c'][index]]))});
  }
  state.panes = [
    {id: 'rsi', order: 0, size: 1, minimumSize: 200, studyIds: ['opaque-rsi'], scaleSide: 'right'},
    {id: 'price', order: 1, size: 1.6, minimumSize: 300, studyIds: overlays, scaleSide: 'right'},
    ...['macd', 'stochastic', 'adx'].map((id, index) => ({id, order: index + 2, size: 1.2, minimumSize: 240, studyIds: [`opaque-${id}`], scaleSide: 'right' as const})),
  ];
  if (variant === 'offscale') state.scale = {mode: 'normal', autoScale: false, manualRange: {minimum: 99, maximum: 101}};
  if (variant === 'log') state.scale = {mode: 'logarithmic', autoScale: false, manualRange: {minimum: Math.log(99), maximum: Math.log(101)}};
  return state;
}
/** Static independent producer samples; no financial formula or source access. */
export function endpointResults(state: TechnicalChartViewState, variant: EndpointFixture = 'normal', identity = 'synthetic-endpoint', revision = 0): SuppliedCalculationResults {
  const normal: Record<string, number[]> = {ema: [100.1250001], sma: [100.1250002], rsi: [70.123456789], macd: [.00000123456789, .00000123456788, -.000000000123456789], stochastic: [50.1250001, 50.1250002], adx: [25.0000001, 25.0000002, 25.0000003]};
  return Object.fromEntries(createCalculationRequests(identity, 'SYNTHETIC', '1D', state).filter(request => request.kind === 'indicator').map(request => {
    const instance = state.indicators.find(item => item.id === request.instanceId)!;
    const definition = endpointDefinitions.find(item => item.id === instance.definitionId)!;
    return [instance.id, {kind: 'indicator' as const, requestKey: request.requestKey, status: variant === 'unavailable' ? 'unavailable' as const : 'partial' as const, stale: true,
      warning: 'Synthetic endpoint warning; retain complete evidence', provenanceLabel: 'Static independent supplied fixture',
      points: endpointBars.flatMap((bar, barIndex) => variant === 'sparse' && barIndex === 35 ? [] : [{time: bar.time, values: Object.fromEntries(definition.lines.map((line, lineIndex) => [line.id,
        variant === 'missing' && barIndex === 35 ? null : variant === 'equal' ? instance.definitionId === 'macd' ? .000001 : instance.definitionId === 'sma' || instance.definitionId === 'ema' ? 100.25 : 50
          : variant === 'offscale' && definition.placement === 'overlay' ? 108
          : variant === 'log' && instance.definitionId === 'ema' ? -1
          : variant === 'crossing' && instance.definitionId === 'stochastic' ? (barIndex < 18 ? [20.125, 80.125] : [80.125, 20.125])[lineIndex]
          : normal[instance.definitionId][lineIndex] + (barIndex === 35 ? revision * .125 : 0)]))}]),
    }];
  }));
}
