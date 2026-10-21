import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createMarketChartEngine} from '.';
import {builtInSeriesRenderers} from './series-renderers';
import type {MarketChartEngine, MarketChartEngineOptions, MarketChartPresentation, MarketSeriesRendererContext, MarketTimeAxis, OhlcBar} from '../core';

const theme = {background: '#fff', text: '#111', grid: '#ddd', border: '#aaa', positive: '#080', negative: '#800', primary: '#00a'};
const sample = (time: number, i = 0): OhlcBar => ({time, open: 100, close: i % 2 ? 98 : 103, high: 106, low: 97, volume: 1000 + i});
const bars = Array.from({length: 9}, (_, i) => sample(i + 1, i));
const adaptive: MarketChartPresentation = {candles: {widthMode: 'adaptive', gap: 2, bodyRatio: .1, maximumWidth: 1}, volume: {widthMode: 'adaptive', gap: 2}, badges: {visible: false}};
interface Rectangle {x: number; y: number; width: number; height: number; color: string; alpha: number; kind: 'fill' | 'stroke'}
let rectangles: Rectangle[], frames: number, context: CanvasRenderingContext2D;
beforeEach(() => {
  rectangles = []; frames = 0;
  let state = {fillStyle: '', strokeStyle: '', globalAlpha: 1, lineWidth: 1};
  const stack: typeof state[] = [];
  const methods = {
    clearRect: () => {rectangles = []; frames++;},
    measureText: (text: string) => ({width: text.length * 6}),
    save: () => stack.push({...state}), restore: () => {state = stack.pop() ?? state;},
    fillRect: (x: number, y: number, width: number, height: number) => rectangles.push({x, y, width, height, color: state.fillStyle, alpha: state.globalAlpha, kind: 'fill'}),
    strokeRect: (x: number, y: number, width: number, height: number) => rectangles.push({x: x - state.lineWidth / 2, y: y - state.lineWidth / 2, width: width + state.lineWidth, height: height + state.lineWidth, color: state.strokeStyle, alpha: state.globalAlpha, kind: 'stroke'}),
  };
  context = new Proxy(methods, {get: (target, key) => key in target ? Reflect.get(target, key) : key in state ? Reflect.get(state, key) : vi.fn(), set: (_target, key, value) => {Reflect.set(state, key, value); return true;}}) as unknown as CanvasRenderingContext2D;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
});
afterEach(() => {vi.restoreAllMocks(); vi.unstubAllGlobals();});
function chart(options: Partial<MarketChartEngineOptions> = {}) {
  const host = document.createElement('div');
  const engine = createMarketChartEngine(host, {data: bars, chartType: 'candlestick', height: 600, showVolume: false, scaleMode: 'normal', markers: [], theme,
    panes: [{id: 'price', order: 0, size: 4, studyIds: [], showVolume: true}, {id: 'volume', order: 1, size: 1, studyIds: [], showVolume: true}],
    viewport: {rightOffsetBars: 0, visibleRange: {from: 1, to: 9}}, presentation: adaptive, ...options});
  return {host, engine};
}
const colored = () => rectangles.filter(rect => rect.color === theme.positive || rect.color === theme.negative);
const bodies = () => colored().filter(rect => rect.alpha === 1);
const volumes = () => colored().filter(rect => rect.alpha === .25);
async function painted(action?: () => void) {
  const prior = frames; action?.(); await vi.waitFor(() => expect(frames).toBeGreaterThan(prior));
}
function assertMatched(engine: MarketChartEngine, data: readonly OhlcBar[], expectedWidth?: number) {
  for (const bar of data) {
    const x = engine.coordinateForTime?.(bar.time); if (x == null) continue;
    const body = bodies().find(rect => Math.abs(rect.x + rect.width / 2 - x) < 1e-7);
    expect(body, `body at ${bar.time}`).toBeDefined();
    if (expectedWidth != null) expect(body!.width).toBeCloseTo(expectedWidth, 8);
    const matching = volumes().filter(rect => Math.abs(rect.x + rect.width / 2 - x) < 1e-7);
    expect(matching).toHaveLength(2);
    matching.forEach(volume => {expect(volume.x).toBeCloseTo(body!.x, 8); expect(volume.width).toBeCloseTo(body!.width, 8); expect(volume.height).toBeGreaterThan(0);});
  }
}

describe('rendered adaptive candle and volume geometry', () => {
  it('keeps exact historical defaults when modes are omitted or explicitly proportional', async () => {
    const {engine} = chart({presentation: {badges: {visible: false}}});
    try {
      await painted(); expect(bodies().every(rect => rect.width === 14)).toBe(true); expect(volumes().every(rect => rect.width === 12)).toBe(true);
      const prior = structuredClone(colored());
      await painted(() => engine.setPresentation?.({candles: {widthMode: 'proportional', gap: 10}, volume: {widthMode: 'proportional', gap: 32}, badges: {visible: false}}));
      expect(colored()).toEqual(prior);
    } finally {engine.destroy();}
  });
  it('matches overlay and dedicated volume to uncapped candle bodies and preserves heights/colors/opacity', async () => {
    const {engine} = chart({presentation: {badges: {visible: false}}});
    try {
      await painted(); const oldHeights = volumes().map(({height, y, color, alpha}) => ({height, y, color, alpha}));
      await painted(() => engine.setPresentation?.(adaptive));
      assertMatched(engine, bars, 114);
      expect(volumes().map(({height, y, color, alpha}) => ({height, y, color, alpha}))).toEqual(oldHeights);
      const first = bodies()[1], next = bodies()[2]; expect(next.x - first.x - first.width).toBeCloseTo(2, 10);
    } finally {engine.destroy();}
  });
  it.each([1, 2, 3])('uses matching dense/subpixel boundaries at DPR %s', async ratio => {
    vi.stubGlobal('devicePixelRatio', ratio);
    const dense = Array.from({length: 1024}, (_, i) => sample(i + 1, i));
    const {engine, host} = chart({data: dense, viewport: {rightOffsetBars: 0, visibleRange: {from: 1, to: 1024}}});
    try {
      await painted(); const slot = 928 / 1023;
      assertMatched(engine, dense.slice(500, 503), Math.min(slot, 1 / ratio));
      expect(bodies()[501].x - bodies()[500].x - bodies()[500].width).toBeGreaterThanOrEqual(-1e-8);
      await painted(() => engine.resize(200, 600)); assertMatched(engine, dense.slice(500, 503), 128 / 1023);
      expect(host.querySelector('canvas')!.width).toBe(200 * ratio);
    } finally {engine.destroy();}
  });
  it.each(['calendar', 'utc'] as const)('sizes sparse %s bars against slots rather than the next observation', async mode => {
    const grid = Array.from({length: 10}, (_, i) => 1000 + i * 60), sparse = [0, 3, 8, 9].map(i => sample(grid[i], i));
    const timeAxis: MarketTimeAxis = mode === 'calendar' ? {mode, times: grid} : {mode, domain: {from: grid[0], to: grid[9]}, intervalSeconds: 60};
    const {engine} = chart({data: sparse, timeAxis, viewport: {visibleRange: {from: grid[0], to: grid[9]}, rightOffsetBars: 0}});
    try {
      await painted(); const slot = 928 / 9; assertMatched(engine, sparse, slot - 2);
      expect(engine.coordinateForTime?.(grid[3])! - engine.coordinateForTime?.(grid[0])!).toBeCloseTo(slot * 3);
      expect(bodies()[1].width).toBeLessThan(slot);
      await painted(() => engine.setVisibleRange({from: grid[2], to: grid[4]}));
      expect(bodies().find(rect => Math.abs(rect.x + rect.width / 2 - engine.coordinateForTime!(grid[3])!) < 1e-8)?.width).toBeCloseTo(462);
    } finally {engine.destroy();}
  });
  it('repaints runtime gap/range/resize/keyboard zoom and pan changes without changing economic values or identities', async () => {
    const original = structuredClone(bars), onRange = vi.fn(); const {engine, host} = chart({onVisibleRangeChange: onRange});
    try {
      await painted(); const range = engine.getSnapshot().visibleRange, scales = engine.getSnapshot().scales; onRange.mockClear();
      await painted(() => engine.setPresentation?.({...adaptive, candles: {widthMode: 'adaptive', gap: 4}, volume: {widthMode: 'adaptive', gap: 4}}));
      assertMatched(engine, bars, 112); expect(onRange).not.toHaveBeenCalled(); expect(engine.getSnapshot().visibleRange).toEqual(range); expect(engine.getSnapshot().scales).toEqual(scales);
      await painted(() => engine.setPresentation?.(adaptive));
      await painted(() => engine.setViewport?.({logicalRange: {from: 2, to: 6}, rightOffsetBars: 0})); assertMatched(engine, bars.slice(2, 7), 230);
      await painted(() => engine.resize(601.5, 600)); assertMatched(engine, bars.slice(2, 7), 130.375);
      await painted(() => engine.setVisibleRange({from: 1, to: 9})); assertMatched(engine, bars, 64.1875);
      const canvas = host.querySelector('canvas')!; const before = bodies()[4].width;
      await painted(() => canvas.dispatchEvent(new KeyboardEvent('keydown', {key: '+', cancelable: true})));
      expect(bodies()[4].width).toBeGreaterThan(before);
      await painted(() => canvas.dispatchEvent(new KeyboardEvent('keydown', {key: '+', cancelable: true})));
      expect(onRange).toHaveBeenLastCalledWith(expect.anything(), {source: 'user', gesture: 'keyboard'});
      const width = bodies()[4].width;
      await painted(() => canvas.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', shiftKey: true, cancelable: true})));
      expect(bodies()[4].width).toBeCloseTo(width); expect(bars).toEqual(original);
      const oldBodies = bodies().map(({x, width}) => ({x, width}));
      await painted(() => engine.setTheme?.({...theme, background: '#111', text: '#fff'})); expect(bodies().map(({x, width}) => ({x, width}))).toEqual(oldBodies);
    } finally {engine.destroy();}
  });
  it('keeps missing/zero volume absent, line-chart volume adaptive and empty/single/revised bars finite', async () => {
    const data = bars.map((bar, i) => ({...bar, volume: i === 0 ? 0 : i === 1 ? undefined : bar.volume}));
    const {engine} = chart({data, chartType: 'line'});
    try {
      await painted(); expect(bodies()).toHaveLength(0); expect(volumes()).toHaveLength((data.length - 2) * 2); expect(volumes().every(rect => rect.width === 114)).toBe(true);
      await painted(() => engine.appendOrUpdate({...data.at(-1)!, volume: 5000})); expect(volumes().every(rect => rect.width === 114)).toBe(true);
      await painted(() => engine.setData([])); expect(volumes()).toHaveLength(0);
      await painted(() => engine.setData([sample(1)])); expect(volumes()).toHaveLength(2); expect(volumes().every(rect => rect.width > 100 && Number.isFinite(rect.width))).toBe(true);
      expect(() => engine.setPresentation?.({volume: {widthMode: 'adaptive', gap: -1}})).toThrow(/gap/);
      expect(() => engine.setPresentation?.({candles: {widthMode: 'adaptive', gap: Infinity}})).toThrow(/gap/);
    } finally {engine.destroy();}
  });
  it('retains dense flat hollow/incomplete bodies within the shared volume boundaries', () => {
    const visible = [{time: 1, open: 100, close: 100, high: 100, low: 100, incomplete: true}];
    const draw = builtInSeriesRenderers.find(renderer => renderer.id === 'candlestick')!;
    draw.draw({context, visible, startIndex: 0, barSpacing: 1.5, pixelRatio: 1, logicalToCoordinate: () => 10.125, scale: {toCoordinate: value => value}, pane: {id: 'price', top: 0, height: 200, width: 100}, theme, presentation: adaptive} as MarketSeriesRendererContext);
    expect(bodies()).toContainEqual(expect.objectContaining({kind: 'fill', x: 9.625, width: 1, height: 1}));
    rectangles = [];
    draw.draw({context, visible: [{...visible[0], close: 104, high: 106}], startIndex: 0, barSpacing: 1.5, pixelRatio: 2, logicalToCoordinate: () => 10.125, scale: {toCoordinate: value => value}, pane: {id: 'price', top: 0, height: 200, width: 100}, theme, presentation: adaptive} as MarketSeriesRendererContext);
    expect(bodies()[0]).toMatchObject({kind: 'stroke', x: 9.875, width: .5, height: 4});
  });
});
