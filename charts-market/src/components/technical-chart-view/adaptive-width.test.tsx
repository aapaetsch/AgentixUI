import * as React from 'react';
import {cleanup, render, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TechnicalChartView} from '.';
import {MarketChart, type MarketChartHandle} from '../market-chart';
import {createMarketChartEngine} from '../../engine';
import {serializeTechnicalChartViewState, type MarketChartEngineOptions, type MarketChartPresentation} from '../../core';
import {readabilityBars, readabilityDefinitions, readabilityResults, readabilityState} from './readability-fixtures';

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(new Proxy({}, {get: () => vi.fn()}) as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1440);
});
afterEach(() => {cleanup(); vi.restoreAllMocks();});
const adaptive: MarketChartPresentation = {candles: {widthMode: 'adaptive', gap: 2}, volume: {widthMode: 'adaptive', gap: 2}};

describe('public adaptive-width presentation forwarding', () => {
  it('forwards composite appearance and in-place updates without changing supplied identities, documents or history', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No source fetch allowed'));
    const calculate = vi.fn(() => {throw Error('No formula allowed');}), runtime = vi.fn(() => {throw Error('No runtime allowed');});
    const state = readabilityState(), serialized = serializeTechnicalChartViewState(state), results = readabilityResults(state), change = vi.fn(), request = vi.fn();
    const definitions = readabilityDefinitions.map(definition => ({...definition, calculate, createRuntime: runtime}));
    const presentationUpdates = vi.fn(); let initial: MarketChartEngineOptions | undefined;
    const factory = vi.fn((host: HTMLElement, options: MarketChartEngineOptions) => {
      initial = options; const engine = createMarketChartEngine(host, options), original = engine.setPresentation!.bind(engine);
      engine.setPresentation = value => {presentationUpdates(value); original(value);}; return engine;
    });
    const ref = React.createRef<MarketChartHandle>();
    const props = {symbol: 'SYNTHETIC', interval: '5m', data: readabilityBars, state, onStateChange: change, calculationMode: 'supplied' as const, calculationIdentity: 'synthetic-readability',
      suppliedResults: results, onCalculationRequest: request, availableIndicators: definitions, engineFactory: factory, chartApiRef: ref, features: {header: false, commands: false, drawingRail: false}};
    const view = render(<TechnicalChartView {...props} appearance={{...adaptive, legends: 'compact', suppliedStatus: 'compact'}}/>);
    await waitFor(() => expect(ref.current).not.toBeNull());
    expect(initial!.presentation).toMatchObject(adaptive);
    const keys = request.mock.calls.map(([value]) => value.requestKey), history = ref.current!.getDrawingHistory();
    view.rerender(<TechnicalChartView {...props} theme="light" appearance={{candles: {widthMode: 'adaptive', gap: 4}, volume: {widthMode: 'adaptive', gap: 4}, legends: 'compact', suppliedStatus: 'compact'}}/>);
    await waitFor(() => expect(presentationUpdates).toHaveBeenLastCalledWith(expect.objectContaining({candles: {widthMode: 'adaptive', gap: 4}, volume: {widthMode: 'adaptive', gap: 4}})));
    expect(factory).toHaveBeenCalledOnce(); expect(change).not.toHaveBeenCalled();
    expect(request.mock.calls.map(([value]) => value.requestKey)).toEqual(keys); expect(serializeTechnicalChartViewState(state)).toBe(serialized);
    expect(ref.current!.getDrawingHistory()).toEqual(history); expect(fetch).not.toHaveBeenCalled(); expect(calculate).not.toHaveBeenCalled(); expect(runtime).not.toHaveBeenCalled();
  });
  it('forwards direct MarketChart presentation updates to its existing engine', async () => {
    let initial: MarketChartEngineOptions | undefined;
    const update = vi.fn(), factory = vi.fn((host: HTMLElement, options: MarketChartEngineOptions) => {
      initial = options; const engine = createMarketChartEngine(host, options), original = engine.setPresentation!.bind(engine);
      engine.setPresentation = value => {update(value); original(value);}; return engine;
    });
    const view = render(<MarketChart data={readabilityBars} engineFactory={factory} calculationMode="supplied" presentation={adaptive}/>);
    await waitFor(() => expect(update).toHaveBeenCalled()); expect(initial!.presentation).toBe(adaptive);
    const next: MarketChartPresentation = {candles: {widthMode: 'proportional'}, volume: {widthMode: 'adaptive', gap: 0}};
    view.rerender(<MarketChart data={readabilityBars} engineFactory={factory} calculationMode="supplied" presentation={next}/>);
    await waitFor(() => expect(update).toHaveBeenLastCalledWith(next)); expect(factory).toHaveBeenCalledOnce();
  });
});
