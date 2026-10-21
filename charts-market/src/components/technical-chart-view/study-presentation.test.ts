import {describe, expect, it} from 'vitest';
import {createCalculationRequests} from '../../core';
import {readabilityDefinitions, readabilityState, readabilityResults, readabilityBars} from './readability-fixtures';
import {studyLabels, studyValueAt} from './study-presentation';
import {supplementaryLegendGroups} from './legend-groups';
import {navigateVisibleRange} from './navigation';
describe('public study presentation without financial inference', () => {
  it('uses names/parameters and bounded duplicate ordinals without changing request identities', () => {
    const state = readabilityState(), original = createCalculationRequests('id', 'SYN', '5m', state);
    state.indicators.push({...state.indicators[0], id: 'another:opaque/id'});
    const names = studyLabels(state.indicators, readabilityDefinitions);
    expect(names.get('opaque:sma:one')).toBe('SMA 20 · 1');
    expect(names.get('another:opaque/id')).toBe('SMA 20 · 2');
    expect(names.get('opaque:adx')).toBe('ADX 14');
    const renamed = readabilityDefinitions.map(definition => ({...definition, label: 'Host label', formatParameters: () => 'Host parameters'}));
    expect(studyLabels(state.indicators, renamed).get('opaque:adx')).toContain('Host label Host parameters');
    expect(createCalculationRequests('id', 'SYN', '5m', state).slice(0, 3)).toEqual(original.slice(0, 3));
  });
  it('uses exact inspected timestamps, preserving null/zero/missing samples', () => {
    const points = [{time: 1, value: 0}, {time: 3, value: 12}, {time: 5, value: null}];
    expect(studyValueAt(points, 1)).toBe(0); expect(studyValueAt(points, 2)).toBeNull();
    expect(studyValueAt(points, 3)).toBe(12); expect(studyValueAt(points, 5)).toBeNull();
    expect(studyValueAt(points, 9)).toBeNull();
    let reads = 0;
    const history = Array.from({length: 100_000}, (_, i) => ({get time() {reads++; return i + 1;}, value: i}));
    expect(studyValueAt(history, 50_001)).toBe(50_000); expect(reads).toBeLessThan(40);
  });
  it('names visible, session and anchored profile overrides without changing their supplied semantics', () => {
    const state = readabilityState(), incoming = readabilityResults(state), source = incoming['opaque:profile'];
    state.profiles = ['visible', 'session', 'fixed'].map((range, i) => ({...state.profiles[0], id: `profile:${i}`, range: range as 'visible' | 'session' | 'fixed', upColor: `rgb(${20 + i}, 30, 40)`}));
    const result = source!.kind === 'profile' ? source!.profile : null!;
    const profiles = Object.fromEntries(state.profiles.map(profile => [profile.id, result]));
    const groups = supplementaryLegendGroups(state, 'price', readabilityBars[0].time, readabilityBars[0], {}, profiles, {profiles: {'profile:1': {label: 'Host session name'}}});
    expect(groups.map(group => group.label).join(' ')).toContain('Host session name'); expect(groups.map(group => group.label).join(' ')).toContain('Anchored profile');
    for (const profile of state.profiles) expect(groups.find(group => group.id === `profile:${profile.id}`)!.lines[0].color).toBe(profile.upColor);
  });
  it('maps actual custom profile/volume/VWAP colors and preserves bar-direction estimate semantics', () => {
    const state = readabilityState(); state.profiles[0].upColor = '#123456'; state.profiles[0].downColor = '#654321'; state.profiles[0].pocColor = '#aabbcc';
    state.drawings.push({id: 'opaque:vwap', type: 'session-vwap', version: 1, visible: true, locked: true, points: [], parameters: {color: '#f0a010'}});
    const results = readabilityResults(state);
    const time = readabilityBars[5].time;
    const drawingResult = {kind: 'drawing' as const, status: 'available' as const, provenanceLabel: 'Synthetic', requestKey: '', points: [{time, value: 7}, {time: time + 600, value: 8}]};
    const profile = results['opaque:profile']; expect(profile?.kind).toBe('profile');
    const groups = supplementaryLegendGroups(state, 'price', time, readabilityBars[5], {...results, 'opaque:vwap': drawingResult}, {'opaque:profile': profile!.kind === 'profile' ? profile!.profile : null!});
    const profileGroup = groups.find(group => group.id.startsWith('profile:'))!;
    expect(profileGroup.lines.map(line => line.color)).toEqual(['#123456', '#654321', '#aabbcc', 'hsl(var(--foreground))', 'hsl(var(--foreground))']);
    expect(profileGroup.lines[0].label).toBe('Rising bar estimate'); expect(profileGroup.description).toContain('not measured buyer/seller');
    expect(groups.find(group => group.id === 'drawing:opaque:vwap')?.lines[0]).toMatchObject({color: '#f0a010', value: 7});
    expect(supplementaryLegendGroups(state, 'price', time + 300, undefined, {...results, 'opaque:vwap': drawingResult}, {}).find(group => group.id === 'drawing:opaque:vwap')?.lines[0].value).toBeNull();
    expect(groups[0].lines.map(line => line.color)).toContain('hsl(var(--positive))');
  });
  it('permits metadata drawing samples only when internal calculation mode explicitly allows them', () => {
    const state = readabilityState(), bar = readabilityBars[0];
    const metadata = {drawings: {'opaque:session': {label: 'Host session', points: [{time: bar.time, value: 999}]}}};
    expect(supplementaryLegendGroups(state, 'price', bar.time, bar, {}, {}, metadata).find(group => group.id === 'drawing:opaque:session')?.lines[0].value).toBeNull();
    expect(supplementaryLegendGroups(state, 'price', bar.time, bar, {}, {}, metadata, true).find(group => group.id === 'drawing:opaque:session')?.lines[0].value).toBe(999);
  });
  it('navigates host calendar coordinates without changing data or collapsing the window at boundaries', () => {
    const bars = readabilityBars.slice(0, 10), before = JSON.stringify(bars);
    expect(navigateVisibleRange({from: bars[2].time, to: bars[7].time}, bars, undefined, 'right')).toEqual({from: bars[3].time, to: bars[8].time});
    expect(navigateVisibleRange({from: bars[0].time, to: bars[5].time}, bars, undefined, 'left')).toEqual({from: bars[0].time, to: bars[5].time});
    const times = [0, 10, 20, 30, 40];
    expect(navigateVisibleRange({from: 10, to: 30}, bars, {mode: 'calendar', times}, 'in')).toEqual({from: 10, to: 30});
    expect(navigateVisibleRange({from: 10, to: 30}, bars, {mode: 'utc', domain: {from: 0, to: 40}, intervalSeconds: 1}, 'in')).toEqual({from: 12, to: 28});
    expect(JSON.stringify(bars)).toBe(before);
  });
});
