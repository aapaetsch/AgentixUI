import * as React from 'react';
import {cleanup, render, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TechnicalChartView} from '.';
import type {MarketChartHandle} from '../market-chart';
import {createMarketChartEngine} from '../../engine';
import {createCalculationRequests, serializeTechnicalChartViewState, type MarketChartEngineOptions} from '../../core';
import {movingAverageBars, movingAverageDefinitions, movingAverageResults, movingAverageState} from './moving-average-fixtures';

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(new Proxy({}, {get: () => vi.fn()}) as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1440);
});
afterEach(() => {cleanup(); vi.restoreAllMocks();});
describe('supplied-only public moving-average boxes', () => {
  it('forwards all moving-average metadata and uses no formulas, sources or saved/request identity changes', async () => {
    const calculate = vi.fn(() => {throw Error('Forbidden calculation');}), runtime = vi.fn(() => {throw Error('Forbidden runtime');});
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(Error('Forbidden source'));
    const state = movingAverageState('duplicates'), original = serializeTechnicalChartViewState(state), results = movingAverageResults(state, 'duplicates'), originalResults = JSON.stringify(results);
    const definitions = movingAverageDefinitions.map(definition => ({...definition, calculate, createRuntime: runtime}));
    const factory = vi.fn((host: HTMLElement, options: MarketChartEngineOptions) => createMarketChartEngine(host, options));
    const ref = React.createRef<MarketChartHandle>(), onChange = vi.fn(), request = vi.fn();
    const props = {data: movingAverageBars, state, onStateChange: onChange, suppliedResults: results, calculationMode: 'supplied' as const, calculationIdentity: 'synthetic-ma', symbol: 'SYNTHETIC', interval: '1D', availableIndicators: definitions, chartApiRef: ref, engineFactory: factory, onCalculationRequest: request, features: {header: false, commands: false, drawingRail: false}};
    const view = render(<TechnicalChartView {...props} appearance={{badges: {movingAverages: 'all-visible'}, legends: 'compact'}}/>);
    await waitFor(() => expect(view.container.querySelectorAll('[data-endpoint-label]')).toHaveLength(5));
    const labels = [...view.container.querySelectorAll('[data-endpoint-label]')].map(node => node.getAttribute('aria-label'));
    expect(labels.join(' ')).toContain('SMA 50 · 1'); expect(labels.join(' ')).toContain('SMA 50 · 2'); expect(labels.join(' ')).toContain('EMA 20');
    const keys = request.mock.calls.map(([r]) => r.requestKey), history = ref.current!.getDrawingHistory();
    view.rerender(<TechnicalChartView {...props} theme="light" appearance={{badges: {movingAverages: 'all-visible', fontSize: 12}, legends: 'compact'}}/>);
    await waitFor(() => expect(view.container.querySelectorAll('[data-endpoint-label]')).toHaveLength(5));
    expect(factory).toHaveBeenCalledOnce(); expect(onChange).not.toHaveBeenCalled(); expect(request.mock.calls.map(([r]) => r.requestKey)).toEqual(keys);
    expect(createCalculationRequests('synthetic-ma', 'SYNTHETIC', '1D', state).map(r => r.requestKey)).toEqual(keys);
    expect(serializeTechnicalChartViewState(state)).toBe(original); expect(JSON.stringify(results)).toBe(originalResults); expect(ref.current!.getDrawingHistory()).toEqual(history);
    expect(calculate).not.toHaveBeenCalled(); expect(runtime).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  it('makes unavailable/warmup states explicit without numeric boxes and keeps custom definitions eligible', async () => {
    for (const variant of ['warmup', 'unavailable', 'custom'] as const) {
      const state = movingAverageState(variant), results = movingAverageResults(state, variant);
      const view = render(<TechnicalChartView data={movingAverageBars} state={state} onStateChange={() => {}} symbol="SYNTHETIC" interval="1D" calculationMode="supplied" calculationIdentity="synthetic-ma" suppliedResults={results} availableIndicators={movingAverageDefinitions} appearance={{badges: {movingAverages: 'all-visible'}}}/>);
      await waitFor(() => expect(view.container.querySelectorAll('[data-endpoint-label]')).toHaveLength(variant === 'custom' ? 5 : 4));
      if (variant !== 'custom') expect([...view.container.querySelectorAll<HTMLElement>('[data-endpoint-label]')].every(node => node.dataset.endpointValue === '' && node.textContent?.includes('missing'))).toBe(true);
      else expect(view.container.querySelector('[data-endpoint-label="opaque-host-custom:host"]')?.getAttribute('aria-label')).toContain('Host custom moving average 37 custom');
      view.unmount();
    }
  });
  it('discloses a nonpositive log MA without covering valid price data or resetting the manual scale', async () => {
    const state = movingAverageState('log-invalid'), scale = JSON.stringify(state.scale);
    const view = render(<TechnicalChartView data={movingAverageBars} state={state} onStateChange={() => {}} symbol="SYNTHETIC" interval="1D" calculationMode="supplied" calculationIdentity="synthetic-ma" suppliedResults={movingAverageResults(state, 'log-invalid')} availableIndicators={movingAverageDefinitions} appearance={{badges: {movingAverages: 'all-visible'}}}/>);
    await waitFor(() => expect(view.container.querySelector('[data-endpoint-edge="undefined"]')?.getAttribute('aria-label')).toContain('nonpositive log'));
    expect(view.queryByText('Logarithmic scale requires positive visible prices.')).toBeNull();
    expect(view.container.querySelectorAll('[data-endpoint-label]')).toHaveLength(4); expect(JSON.stringify(state.scale)).toBe(scale);
  });
});
