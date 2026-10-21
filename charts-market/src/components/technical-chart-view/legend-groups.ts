import type {MarketTime, OhlcBar, SuppliedCalculationResults, TechnicalChartViewState} from '../../core';
import {volumeProfileColors} from '../../engine/volume-profile-layer';
import type {VolumeProfileResult} from '../../engine/volume-profile';
import {studyValueAt} from './study-presentation';
import type {StudyLegendGroup} from './study-legend';

/** Display-only host names and optional already-supplied drawing samples; never request identities. */
export interface TechnicalChartLegendMetadata {
  drawings?: Readonly<Record<string, {label?: string; points?: readonly {time: MarketTime; value: number | null}[]}>>;
  profiles?: Readonly<Record<string, {label?: string; upLabel?: string; downLabel?: string}>>;
}
export function supplementaryLegendGroups(state: TechnicalChartViewState, paneId: string, time: MarketTime | undefined, bar: OhlcBar | undefined,
  results: SuppliedCalculationResults, profiles: Record<string, VolumeProfileResult>, metadata?: TechnicalChartLegendMetadata, allowMetadataPoints = false): StudyLegendGroup[] {
  const groups: StudyLegendGroup[] = [];
  if (state.panes.find(pane => pane.id === paneId)?.showVolume) groups.push({id: `bar-volume:${paneId}`, label: 'Bar volume', description: 'Rising/falling refers to close versus open, not buyer/seller-initiated volume.',
    lines: [{label: 'Rising bar', color: 'hsl(var(--positive))', style: 'histogram', showValue: false, value: null},
      {label: 'Falling bar', color: 'hsl(var(--negative))', style: 'histogram', showValue: false, value: null},
      {label: 'Count', color: 'transparent', value: bar?.volume ?? null}]});
  for (const drawing of state.drawings.filter(item => item.visible && (item.paneId ?? 'price') === paneId && ['session-vwap', 'anchored-vwap'].includes(item.type))) {
    const result = results[drawing.id], supplied = result ? result.kind === 'drawing' && ['available', 'partial'].includes(result.status) ? result.points : [] : allowMetadataPoints ? metadata?.drawings?.[drawing.id]?.points ?? [] : [];
    groups.push({id: `drawing:${drawing.id}`, label: metadata?.drawings?.[drawing.id]?.label ?? drawing.name ?? (drawing.type === 'session-vwap' ? 'Session VWAP' : 'Anchored VWAP'), result,
      lines: [{label: 'VWAP', color: typeof drawing.parameters.color === 'string' ? drawing.parameters.color : 'hsl(var(--primary))', value: studyValueAt(supplied, time)}]});
  }
  if (paneId === 'price') for (const profile of state.profiles.filter(item => item.visible)) {
    const result = profiles[profile.id], colors = volumeProfileColors(profile), names = metadata?.profiles?.[profile.id];
    const approximate = result?.provenance === 'bar-derived-approximation';
    const split = profile.splitVolume && result?.rows.some(row => row.volume == null);
    const totalOnly = !split || result?.rows.some(row => row.volume != null);
    const rows = typeof profile.rows === 'number' ? `${profile.rows} rows` : `${profile.rows.ticksPerRow} ticks/row`;
    const name = names?.label ?? (profile.range === 'visible' ? 'Visible profile' : profile.range === 'session' ? 'Session profile' : 'Anchored profile');
    const lines: StudyLegendGroup['lines'] = [];
    if (totalOnly) lines.push({label: 'Total volume', color: colors.up, style: 'histogram', showValue: false, value: null});
    if (split) lines.push({label: names?.upLabel ?? (approximate ? 'Rising bar estimate' : 'Supplied up segment'), color: colors.up, style: 'histogram', showValue: false, value: null},
      {label: names?.downLabel ?? (approximate ? 'Falling bar estimate' : 'Supplied down segment'), color: colors.down, style: 'histogram', showValue: false, value: null});
    if (profile.showPoc) lines.push({label: 'POC', color: colors.poc, value: result?.poc ?? null});
    if (profile.showValueArea) lines.push({label: 'VAH', color: 'hsl(var(--foreground))', style: 'dashed', value: result?.vah ?? null}, {label: 'VAL', color: 'hsl(var(--foreground))', style: 'dashed', value: result?.val ?? null});
    groups.push({id: `profile:${profile.id}`, label: `${name} · ${rows} · ${profile.valueAreaPercent}% VA`, valueContext: 'range', result: results[profile.id],
      description: approximate ? 'Bar-derived approximation. Rising/falling bar segments are estimates, not measured buyer/seller-initiated volume.' : 'Supplied volume levels; directional classification is owned by the producer.', lines});
  }
  const counts = new Map<string, number>(); groups.forEach(group => counts.set(group.label, (counts.get(group.label) ?? 0) + 1));
  const seen = new Map<string, number>();
  return groups.map(group => {const n = (seen.get(group.label) ?? 0) + 1; seen.set(group.label, n); return counts.get(group.label)! > 1 ? {...group, label: `${group.label} · ${n}`} : group;});
}
