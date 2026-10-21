import type {IndicatorDefinition} from './extensions';
import type {SerializableParameters} from './types';

/** Public-definition copy only; opaque instance IDs never become user-facing text. */
export function indicatorDisplayLabel(parameters: SerializableParameters, definition?: IndicatorDefinition): string {
  if (!definition) return 'Unavailable study';
  const values = definition.formatParameters?.(parameters) ?? Object.values(parameters)
    .filter(value => ['number', 'string', 'boolean'].includes(typeof value)).map(String).join(', ');
  return [definition.label, values].filter(Boolean).join(' ');
}
export function uniqueIndicatorLabels(items: readonly {id: string; label: string}[]): Map<string, string> {
  const totals = new Map<string, number>(), seen = new Map<string, number>();
  items.forEach(item => totals.set(item.label, (totals.get(item.label) ?? 0) + 1));
  return new Map(items.map(item => {
    const ordinal = (seen.get(item.label) ?? 0) + 1; seen.set(item.label, ordinal);
    return [item.id, totals.get(item.label)! > 1 ? `${item.label} · ${ordinal}` : item.label];
  }));
}
