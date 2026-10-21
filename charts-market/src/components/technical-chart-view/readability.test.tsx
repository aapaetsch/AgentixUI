import * as React from 'react';
import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TechnicalChartView} from '.';
import {createMarketChartEngine} from '../../engine';
import {createCalculationRequests} from '../../core';
import type {MarketChartHandle} from '../market-chart';
import {readabilityBars, readabilityDefinitions, readabilityResults, readabilityState} from './readability-fixtures';
import {SuppliedStatus} from './supplied-status';
import {StudyLegend} from './study-legend';
import {supplementaryLegendGroups} from './legend-groups';

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(new Proxy({}, {get: () => vi.fn()}) as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1440);
});
afterEach(() => {cleanup(); vi.restoreAllMocks();});
describe('supplied chart readability and visible color keys', () => {
  it.each(['bb', 'macd', 'stochastic'] as const)('maps every %s output and histogram style through public definition labels', async id => {
    const state = readabilityState(), definition = readabilityDefinitions.find(item => item.id === id)!;
    state.indicators = [{id: 'opaque:mapped-output', definitionId: id, version: 1, visible: true, parameters: definition.defaultParameters}];
    state.panes[0].studyIds = definition.placement === 'overlay' ? ['opaque:mapped-output'] : [];
    state.panes = [state.panes[0], ...(definition.placement === 'pane' ? [{id: 'outputs', order: 1, size: 1, studyIds: ['opaque:mapped-output']}] : [])];
    state.profiles = []; state.drawings = [];
    render(<TechnicalChartView symbol="SYNTHETIC" interval="5m" data={readabilityBars} state={state} onStateChange={() => {}} calculationMode="supplied" calculationIdentity="synthetic-readability" suppliedResults={readabilityResults(state)} availableIndicators={readabilityDefinitions} appearance={{legends: 'compact'}} features={{header: false, commands: false, drawingRail: false}}/>);
    const line = await screen.findByRole('button', {name: new RegExp(`^${definition.label}.*\\. Study details$`)});
    for (const output of definition.lines) {
      expect(line).toHaveAccessibleName(expect.stringContaining(output.label));
      const swatch = line.querySelector(`[data-legend-swatch="${output.label}"]`);
      expect(swatch).not.toBeNull(); expect(swatch).toHaveStyle({background: output.color});
      if (output.style === 'histogram') expect(swatch).toHaveClass('h-2');
    }
  });
  it('shows human instance/output labels with actual overrides, no formula calls or identity changes', async () => {
    const sourceFetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No source requests allowed'));
    const state = readabilityState(), results = readabilityResults(state), formula = vi.fn(() => {throw Error('No formula allowed');}), runtime = vi.fn(() => {throw Error('No runtime allowed');});
    const definitions = readabilityDefinitions.map(definition => ({...definition, calculate: formula, createRuntime: runtime}));
    const factory = vi.fn(createMarketChartEngine), requests = vi.fn(), change = vi.fn();
    const props = {symbol: 'SYNTHETIC', interval: '5m', data: readabilityBars, state, onStateChange: change, calculationMode: 'supplied' as const, calculationIdentity: 'synthetic-readability', suppliedResults: results,
      availableIndicators: definitions, onCalculationRequest: requests, engineFactory: factory, appearance: {legends: 'compact' as const, suppliedStatus: 'compact' as const}, features: {header: false, commands: false, drawingRail: false}};
    const view = render(<TechnicalChartView {...props}/>);
    await screen.findByLabelText('ADX 14 pane legend');
    const sma = screen.getByRole('button', {name: /^SMA 20: SMA /});
    expect(sma.querySelector('[data-legend-swatch="SMA"]')).toHaveStyle({background: '#22b8cf'});
    expect(screen.getByRole('button', {name: /^ADX 14: ADX .*\+DI .*−DI /})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /^Session VWAP: VWAP /})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /^Anchored VWAP: VWAP /})).toBeInTheDocument();
    expect(screen.getByText('Rising bar estimate')).toBeVisible(); expect(screen.getByText('Falling bar estimate')).toBeVisible();
    expect(view.container.textContent).not.toContain('opaque:');
    const keys = requests.mock.calls.map(([request]) => request.requestKey);
    expect(keys).toEqual(createCalculationRequests('synthetic-readability', 'SYNTHETIC', '5m', state).map(request => request.requestKey));
    view.rerender(<TechnicalChartView {...props} availableIndicators={definitions.map(definition => ({...definition, label: `Renamed ${definition.label}`}))}/>);
    await screen.findByLabelText('Renamed ADX 14 pane legend');
    expect(requests.mock.calls.map(([request]) => request.requestKey)).toEqual(keys);
    expect(formula).not.toHaveBeenCalled(); expect(runtime).not.toHaveBeenCalled(); expect(factory).toHaveBeenCalledTimes(1); expect(change).not.toHaveBeenCalled();
    expect(sourceFetch).not.toHaveBeenCalled();
  });
  it('aligns every line to the inspected observation and keeps missing latest samples unavailable', async () => {
    const state = readabilityState(), results = readabilityResults(state), ref = React.createRef<MarketChartHandle>();
    const props = {symbol: 'SYNTHETIC', interval: '5m', data: readabilityBars, state, onStateChange: vi.fn(), calculationMode: 'supplied' as const, calculationIdentity: 'synthetic-readability', suppliedResults: results,
      availableIndicators: readabilityDefinitions, chartApiRef: ref, appearance: {legends: 'compact' as const}, features: {header: false, commands: false, drawingRail: false}};
    const view = render(<TechnicalChartView {...props}/>);
    await screen.findByLabelText('ADX 14 pane legend');
    await act(async () => ref.current!.setCrosshairPosition(readabilityBars[75].time, readabilityBars[75].close));
    const adx = results['opaque:adx']!; expect(adx.kind).toBe('indicator');
    const expected = adx.kind === 'indicator' ? adx.points[75].values : {};
    expect(screen.getByRole('button', {name: new RegExp(`^ADX 14: ADX ${expected.adx}, \\+DI ${expected.plus_di}, −DI ${expected.minus_di}`)})).toHaveAttribute('title', expect.stringContaining('Inspect'));
    const vwap = results['opaque:session']!;
    expect(screen.getByRole('button', {name: /^Session VWAP:/})).toHaveAccessibleName(expect.stringContaining(String(vwap.kind === 'drawing' ? vwap.points[75].value : '')));
    await act(async () => ref.current!.clearCrosshairPosition());
    const sma = results['opaque:sma:one']!;
    const sparse = sma.kind === 'indicator' ? {...sma, points: sma.points.slice(0, -1)} : sma;
    view.rerender(<TechnicalChartView {...props} suppliedResults={{...results, 'opaque:sma:one': sparse}}/>);
    await waitFor(() => expect(screen.getByRole('button', {name: /^SMA 20:/})).toHaveAccessibleName('SMA 20: SMA No supplied sample. Study details'));
  });
  it.each(['missing', 'rejected'] as const)('keeps %s supplied VWAP unavailable despite host metadata samples', async condition => {
    const state = readabilityState(), results = readabilityResults(state), last = readabilityBars.at(-1)!;
    const incoming = {...results, 'opaque:session': condition === 'missing' ? undefined : {...results['opaque:session']!, requestKey: 'superseded'}};
    render(<TechnicalChartView symbol="SYNTHETIC" interval="5m" data={readabilityBars} state={state} onStateChange={() => {}} calculationMode="supplied" calculationIdentity="synthetic-readability" suppliedResults={incoming}
      legendMetadata={{drawings: {'opaque:session': {label: 'Host session', points: [{time: last.time, value: 999}]}}}} availableIndicators={readabilityDefinitions} appearance={{legends: 'compact'}} features={{header: false, commands: false, drawingRail: false}}/>);
    expect(await screen.findByRole('button', {name: 'Host session: VWAP No supplied sample. Study details'})).toBeInTheDocument();
  });
  it('offers a named keyboard/touch Legend disclosure with complete profiles and host source evidence', async () => {
    const state = readabilityState(), results = readabilityResults(state), profile = results['opaque:profile'];
    const groups = supplementaryLegendGroups(state, 'price', readabilityBars[0].time, readabilityBars[0], results, {'opaque:profile': profile?.kind === 'profile' ? profile.profile : null!});
    const sourceEvidence = vi.fn();
    render(<StudyLegend groups={groups} width={200} timeLabel="Inspect synthetic sample" showIdentity onRequestEvidence={sourceEvidence}/>);
    const trigger = screen.getByRole('button', {name: /^Legend: all/});
    trigger.focus(); await userEvent.setup().keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', {name: 'Chart legend and values'});
    expect(dialog).toHaveTextContent('Session VWAP'); expect(dialog).toHaveTextContent('Anchored VWAP');
    expect(dialog).toHaveTextContent('Chart display values'); expect(dialog).not.toHaveTextContent('Exact supplied values');
    fireEvent.click(within(dialog).getByRole('button', {name: 'Complete source evidence'})); expect(sourceEvidence).toHaveBeenCalledOnce();
    expect(dialog).toHaveTextContent('Rising bar'); expect(dialog).toHaveTextContent('Falling bar estimate');
    expect(dialog).toHaveTextContent('not measured buyer/seller-initiated volume'); expect(dialog).toHaveTextContent('Range summary');
    expect(dialog).toHaveTextContent('100.6'); expect(dialog).toHaveTextContent('180 synthetic five-minute observations');
    expect(dialog.querySelector('[data-legend-swatch="POC"]')).toHaveStyle({background: '#ef4444'});
    await userEvent.setup().keyboard('{Escape}'); await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
  it('aggregates status once per result and retains all warnings, including rejected evidence in host details', () => {
    const state = readabilityState(), results = readabilityResults(state), requests = createCalculationRequests('synthetic-readability', 'SYNTHETIC', '5m', state), host = vi.fn();
    const incoming = {...results, 'opaque:adx': {...results['opaque:adx']!, requestKey: 'superseded', warning: 'Rejected original warning'}};
    const matched = {...results, 'opaque:adx': undefined};
    render(<SuppliedStatus requests={requests} results={matched} incoming={incoming} missingIdentity={false} compact labels={{'opaque:sma:one': 'SMA 20'}} onRequestDetails={host}/>);
    const status = screen.getByLabelText('Supplied calculation status');
    expect(status).toHaveTextContent('Stale response rejected'); expect(status).toHaveTextContent('Approximate'); expect(status).toHaveTextContent('Warning');
    expect(status.textContent).not.toContain('opaque:');
    fireEvent.click(screen.getByRole('button', {name: 'Supplied calculation details'}));
    expect(host.mock.calls[0][0].results).toBe(matched);
    expect(host.mock.calls[0][0].rejectedResults['opaque:adx'].warning).toBe('Rejected original warning');
    expect(host.mock.calls[0][0].results['opaque:sma:one'].warning).toBe(results['opaque:sma:one']!.warning);
  });
  it('consolidates public navigation and exact-data slots while retaining user origin and one engine', async () => {
    const state = readabilityState(), results = readabilityResults(state), range = vi.fn(), factory = vi.fn(createMarketChartEngine), details = vi.fn();
    render(<TechnicalChartView symbol="SYNTHETIC" interval="5m" data={readabilityBars} state={state} onStateChange={() => {}} calculationMode="supplied" calculationIdentity="synthetic-readability" suppliedResults={results}
      availableIndicators={readabilityDefinitions} engineFactory={factory} onVisibleRangeChange={range} footerActions={<button onClick={details}>Exact supplied data</button>}
      appearance={{navigation: 'integrated', suppliedStatus: 'compact'}} features={{header: false, commands: false, drawingRail: false}} rangeShortcuts={[]}/>);
    await screen.findByLabelText('ADX 14 pane legend'); range.mockClear();
    const footer = screen.getByLabelText('Range and status');
    expect(within(footer).getByLabelText('Supplied calculation status')).toBeInTheDocument();
    fireEvent.click(within(footer).getByRole('button', {name: 'Zoom in'}));
    await waitFor(() => expect(range).toHaveBeenCalledWith(expect.anything(), {source: 'user', gesture: 'keyboard'}));
    fireEvent.click(within(footer).getByRole('button', {name: 'Exact supplied data'})); expect(details).toHaveBeenCalledOnce(); expect(factory).toHaveBeenCalledOnce();
  });
});
