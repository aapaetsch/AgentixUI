import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {createMarketChartEngine} from '.';
import type {MarketRenderLayerContext, OhlcBar, TechnicalPaneState} from '../core';

const theme = {background: 'white', text: 'black', border: 'gray', grid: 'lightgray', positive: 'green', negative: 'red', primary: 'blue'};
const bars: OhlcBar[] = [
  {time: 1, open: 100, high: 105, low: 99, close: 102, volume: 1_715_009.405},
  {time: 2, open: 102, high: 106, low: 100, close: 104, volume: 3_430_018.81},
];
let rectangles: Array<{x: number; y: number; width: number; height: number}>;
beforeEach(() => {
  rectangles = [];
  const context = new Proxy({
    measureText: (text: string) => ({width: text.length * 6}),
    clearRect: () => {rectangles = [];},
    fillRect: (x: number, y: number, width: number, height: number) => rectangles.push({x, y, width, height}),
  }, {get: (target, key) => key in target ? Reflect.get(target, key) : vi.fn()});
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800);
});
afterEach(() => vi.restoreAllMocks());

it.each(['volume', 'turnover', 'legacy'])('uses supplied units and one coordinate scale for %s volume bars and axis', async id => {
  const panes: TechnicalPaneState[] | undefined = id === 'legacy' ? undefined : [
    {id: 'price', order: 0, size: 4, studyIds: []},
    {id, order: 1, size: 2, studyIds: [], showVolume: true},
  ];
  let frame: MarketRenderLayerContext | undefined;
  const engine = createMarketChartEngine(document.createElement('div'), {
    data: bars, chartType: 'candlestick', height: 600, showVolume: id === 'legacy',
    scaleMode: 'normal', markers: [], theme, panes,
    viewport: {visibleRange: {from: 1, to: 2}, rightOffsetBars: 0},
    renderLayers: [{id: 'measure', zIndex: 1000, draw: context => {frame = context;}}],
  });
  try {
    await vi.waitFor(() => expect(frame).toBeDefined());
    const paneId = id === 'legacy' ? 'volume' : id;
    const scale = engine.getSnapshot().scales[paneId];
    expect(scale.minimum).toBe(0);
    expect(scale.maximum).toBeGreaterThan(3_430_018.81);
    expect(scale.maximum).toBeLessThan(4_000_000);
    const baseline = frame!.priceToCoordinate(0, paneId)!;
    for (const bar of bars) {
      const y = frame!.priceToCoordinate(bar.volume!, paneId)!;
      expect(rectangles.some(rect => Math.abs(rect.y - y) < 1e-6 && Math.abs(rect.y + rect.height - baseline) < 1e-6 && rect.width <= 12)).toBe(true);
    }
    engine.setScaleMode('logarithmic');
    await new Promise(resolve => setTimeout(resolve, 35));
    expect(engine.getSnapshot().scales[paneId].mode).toBe('normal');
  } finally {engine.destroy();}
});

it('replaces volume bounds with new visible supplied data, without changing any bars or price range', async () => {
  const original = structuredClone(bars);
  const engine = createMarketChartEngine(document.createElement('div'), {data: bars, chartType: 'candlestick', height: 500,
    showVolume: false, scaleMode: 'normal', markers: [], theme,
    panes: [{id: 'price', order: 0, size: 4, studyIds: []}, {id: 'volume', order: 1, size: 1, studyIds: [], showVolume: true}],
    viewport: {visibleRange: {from: 1, to: 2}, rightOffsetBars: 0}});
  try {
    await vi.waitFor(() => expect(engine.getSnapshot().scales.volume.maximum).toBeGreaterThan(3_000_000));
    const price = engine.getSnapshot().scales.price;
    engine.setData(bars.map(bar => ({...bar, volume: bar.volume! / 1000})));
    await vi.waitFor(() => expect(engine.getSnapshot().scales.volume.maximum).toBeLessThan(4000));
    expect(engine.getSnapshot().scales.price).toEqual(price);
    engine.setData(bars.map(bar => ({...bar, volume: undefined})));
    await vi.waitFor(() => expect(engine.getSnapshot().scales.volume.maximum).toBe(1));
    expect(engine.getSnapshot().scales.volume.minimum).toBe(0);
    expect(bars).toEqual(original);
  } finally {engine.destroy();}
});

it('keeps a mixed study pane in its study units and preserves its relative volume overlay', async () => {
  let frame: MarketRenderLayerContext | undefined;
  const engine = createMarketChartEngine(document.createElement('div'), {data: bars, chartType: 'candlestick', height: 500,
    showVolume: false, scaleMode: 'normal', markers: [], theme,
    panes: [{id: 'price', order: 0, size: 4, studyIds: []}, {id: 'volume', order: 1, size: 2, studyIds: ['study'], showVolume: true}],
    renderLayers: [{id: 'measure', zIndex: 1000, draw: context => {frame = context;}}]});
  engine.setIndicatorSeries([{id: 'study:value', paneId: 'volume', placement: 'pane', style: 'line', color: 'blue',
    points: bars.map(bar => ({time: bar.time, value: 50})), fixedDomain: [0, 100]}]);
  try {
    await vi.waitFor(() => expect(frame).toBeDefined());
    const scale = engine.getSnapshot().scales.volume;
    expect(scale.minimum).toBe(0); expect(scale.maximum).toBe(100);
    const pane = engine.getSnapshot().panes.find(item => item.id === 'volume')!;
    const height = (pane.height - 30) * .85;
    expect(rectangles.some(rect => Math.abs(rect.height - height) < 1e-6 && Math.abs(rect.y + rect.height - (pane.top + pane.height)) < 1e-6 && rect.width <= 12)).toBe(true);
  } finally {engine.destroy();}
});
