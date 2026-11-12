import {marketTimeKey, type IndicatorDefinition, type IndicatorRenderSeries, type MarketTime, type TechnicalChartViewState} from '../../core';
import {indicatorDisplayLabel, uniqueIndicatorLabels} from '../../core/indicator-labels';

type Study = TechnicalChartViewState['indicators'][number];
/** Use public definition metadata, never parse an instance ID into visible copy. */
export function studyLabel(instance: Study, definition?: IndicatorDefinition): string {
  return indicatorDisplayLabel(instance.parameters, definition);
}
export function studyLabels(instances: readonly Study[], definitions: readonly IndicatorDefinition[]): Map<string, string> {
  return uniqueIndicatorLabels(instances.map(instance => ({
    id: instance.id,
    label: studyLabel(instance, definitions.find(definition => definition.id === instance.definitionId)),
  })));
}
/** Exact-time binary lookup. Sparse/missing samples remain unavailable, never carried forward. */
export function studyValueAt(points: Readonly<IndicatorRenderSeries['points']>, time?: MarketTime): number | null {
  if (time == null) return null;
  const key = marketTimeKey(time); let low = 0, high = points.length;
  while (low < high) {const mid = (low + high) >>> 1; if (marketTimeKey(points[mid].time) < key) low = mid + 1; else high = mid;}
  const point = points[low];
  return point && marketTimeKey(point.time) === key && point.value != null && Number.isFinite(point.value) ? point.value : null;
}
export function readableValue(value: number | null, locale?: string, formatter?: (value: number) => string): string {
  return value == null ? '—' : formatter?.(value) ?? new Intl.NumberFormat(locale, {maximumFractionDigits: 4, maximumSignificantDigits: 6}).format(value);
}
/** Compact display only. Keep the original accepted text in the accessible name/title. */
export function compactReadoutValue(value:number|null|undefined,locale?:string,volume=false):string{
  if(value==null||!Number.isFinite(value))return '—';
  const magnitude=Math.abs(value);
  const options:Intl.NumberFormatOptions=volume||magnitude>=1e4?{notation:'compact',maximumFractionDigits:2}:magnitude>0&&magnitude<.001?{notation:'scientific',maximumFractionDigits:2}:magnitude>0&&magnitude<1?{maximumSignificantDigits:3}:{minimumFractionDigits:2,maximumFractionDigits:2};
  const text=new Intl.NumberFormat(locale,{useGrouping:false,...options}).format(value);
  return text.length<=7?text:new Intl.NumberFormat(locale,{useGrouping:false,notation:'scientific',maximumFractionDigits:0}).format(value);
}
