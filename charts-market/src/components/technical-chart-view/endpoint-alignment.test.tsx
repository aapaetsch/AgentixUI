import * as React from 'react';
import {cleanup, render, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TechnicalChartView} from '.';
import type {MarketChartHandle} from '../market-chart';
import {createCalculationRequests, serializeTechnicalChartViewState} from '../../core';
import {endpointBars, endpointDefinitions, endpointResults, endpointState} from './endpoint-fixtures';

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(new Proxy({}, {get: () => vi.fn()}) as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1440);
});
afterEach(() => {cleanup(); vi.restoreAllMocks();});
describe('public supplied-only all-output endpoint contract', () => {
  it('preserves economic data, identities, saved documents and request calls through opt-in presentation, reorder and font changes', async () => {
    const state = endpointState(), results = endpointResults(state), before = JSON.stringify([endpointBars, results]), saved = serializeTechnicalChartViewState(state);
    const calculate = vi.fn(() => {throw Error('Forbidden formula');}), runtime = vi.fn(() => {throw Error('Forbidden runtime');}), fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(Error('Forbidden source'));
    const definitions = endpointDefinitions.map(item => ({...item, calculate, createRuntime: runtime}));
    const request = vi.fn(), change = vi.fn(), api = React.createRef<MarketChartHandle>();
    const props = {state, onStateChange: change, data: endpointBars, suppliedResults: results, calculationIdentity: 'synthetic-endpoint', calculationMode: 'supplied' as const, availableIndicators: definitions, symbol: 'SYNTHETIC', interval: '1D', onCalculationRequest: request, chartApiRef: api, features: {header: false, commands: false, drawingRail: false}};
    const view = render(<TechnicalChartView {...props} appearance={{height: 1500, badges: {endpointValues: 'all-visible'}, legends: 'compact'}}/>);
    await waitFor(() => expect(view.container.querySelectorAll('[data-endpoint-label]')).toHaveLength(14));
    const keys = request.mock.calls.map(([item]) => item.requestKey), scale = api.current!.getSnapshot()!.scale;
    const reordered = {...state, panes: state.panes.map(pane => ({...pane, order: 4 - pane.order}))};
    view.rerender(<TechnicalChartView {...props} state={reordered} theme="light" appearance={{height: 1500, badges: {endpointValues: 'all-visible', fontSize: 16.5}, legends: 'compact'}}/>);
    await waitFor(() => expect(api.current!.getSnapshot()!.panes[0].id).toBe('adx'));
    expect(view.container.querySelectorAll('[data-endpoint-label]')).toHaveLength(14);
    expect(request.mock.calls.map(([item]) => item.requestKey)).toEqual(keys); expect(createCalculationRequests('synthetic-endpoint', 'SYNTHETIC', '1D', state).map(item => item.requestKey)).toEqual(keys);
    expect(JSON.stringify([endpointBars, results])).toBe(before); expect(serializeTechnicalChartViewState(state)).toBe(saved); expect(api.current!.getSnapshot()!.scale).toEqual(scale); expect(change).not.toHaveBeenCalled();
    expect(calculate).not.toHaveBeenCalled(); expect(runtime).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  it('retains every unavailable, sparse and explicit-null output without nearby-value substitution', async () => {
    for (const variant of ['unavailable', 'sparse', 'missing'] as const) {
      const state = endpointState(variant);
      const view = render(<TechnicalChartView data={endpointBars} state={state} onStateChange={() => {}} symbol="SYNTHETIC" interval="1D" calculationMode="supplied" calculationIdentity="synthetic-endpoint" suppliedResults={endpointResults(state, variant)} availableIndicators={endpointDefinitions} appearance={{height: 1500, badges: {endpointValues: 'all-visible'}}}/>);
      await waitFor(() => expect(view.container.querySelectorAll('[data-endpoint-label]')).toHaveLength(14));
      const notes = [...view.container.querySelectorAll<HTMLElement>('[data-endpoint-label]')].filter(node => node.dataset.endpointLabel !== 'price');
      expect(notes).toHaveLength(13); expect(notes.every(node => node.dataset.endpointValue === '' && node.textContent?.includes('missing'))).toBe(true);
      expect(notes.every(node => node.getAttribute('aria-label')?.includes('Synthetic endpoint warning'))).toBe(true);
      if (variant === 'unavailable') expect(notes.every(node => node.getAttribute('aria-label')?.includes('unavailable'))).toBe(true);
      view.unmount();
    }
  });
});
