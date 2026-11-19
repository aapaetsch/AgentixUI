import {afterEach, describe, expect, it, vi} from 'vitest';
import {validateMarketPresentation, crossesMarketTimeGap, type MarketSeriesRendererContext, type MarketChartPresentation} from '../core';
import {builtInSeriesRenderers} from './series-renderers';
import {createMarketChartEngine} from '.';

const theme = {background: 'white', text: 'black', grid: 'gray', border: 'silver', positive: 'green', negative: 'red', primary: 'blue'};
const data = [1, 2, 6, 9, 10].map(time => ({time, open: 10, high: 14, low: 8, close: 11}));
function recorder() {
  const strokes: {width: number; color: unknown; points: number[][]}[] = [], squares: number[][] = [];
  let points: number[][] = [];
  const target = {lineWidth: 1, strokeStyle: '' as unknown,
    beginPath: () => {points = [];}, moveTo: (x: number, y: number) => points.push([x, y]), lineTo: (x: number, y: number) => points.push([x, y]),
    stroke: () => strokes.push({width: target.lineWidth, color: target.strokeStyle, points: [...points]}),
    fillRect: (...args: number[]) => squares.push(args), measureText: (s: string) => ({width: s.length * 6})};
  const context = new Proxy(target, {get: (o, key) => key in o ? Reflect.get(o, key) : vi.fn()}) as unknown as CanvasRenderingContext2D;
  return {context, strokes, squares};
}
afterEach(() => {vi.restoreAllMocks(); vi.unstubAllGlobals();});
describe('public price line width', () => {
  it.each([NaN, Infinity, -Infinity, 0, .49, 5.01, '3'])('rejects invalid width %s', width => {
    expect(() => validateMarketPresentation({line: {width}} as MarketChartPresentation)).toThrow('Invalid chart presentation line width');
  });
  it.each([undefined, .5, 1, 2, 3, 5])('accepts omitted and bounded width %s', width => {
    expect(() => validateMarketPresentation({line: {width}})).not.toThrow();
  });
  it.each(['line', 'area', 'baseline'] as const)('preserves %s coordinates and gap segmentation at every width and DPI', type => {
    for (const pixelRatio of [1, 1.5, 2, 3]) for (const width of [undefined, .5, 1, 2, 3, 5]) {
      const {context, strokes, squares} = recorder();
      const before = structuredClone(data);
      builtInSeriesRenderers.find(renderer => renderer.id === type)!.draw({context, visible: data, startIndex: 0, barSpacing: 50, pixelRatio,
        logicalToCoordinate: () => {throw Error('Use supplied time coordinates');}, timeToCoordinate: t => Number(t) * 10.125,
        isTimeSegmentContinuous: (a, b) => !crossesMarketTimeGap(a, b, [{from: 2, to: 6}, {from: 6, to: 9}]),
        scale: {toCoordinate: value => value}, pane: {id: 'price', top: 0, height: 200, width: 500}, theme, presentation: {line: {width}}} as MarketSeriesRendererContext);
      const w = width ?? 2;
      expect(strokes.filter(stroke => stroke.color === theme.primary)).toEqual([
        {width: w, color: theme.primary, points: [[10.125, 11], [20.25, 11]]},
        {width: w, color: theme.primary, points: [[91.125, 11], [101.25, 11]]},
      ]);
      expect(squares).toEqual([[60.75 - w, 11 - w, w * 2, w * 2]]);
      expect(data).toEqual(before);
      if (type === 'baseline') expect(strokes.at(-1)?.width).toBe(2);
    }
  });
  it('updates actual engine strokes in CSS pixels without changing scale, viewport, inspection or callbacks', async () => {
    const {context, strokes} = recorder();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800);
    vi.stubGlobal('devicePixelRatio', 2);
    const viewport = {visibleRange: {from: 1, to: 10}, rightOffsetBars: 0}, onViewportChange = vi.fn(), onVisibleRangeChange = vi.fn();
    const engine = createMarketChartEngine(document.createElement('div'), {data, theme, chartType: 'line', height: 400, showVolume: false, scaleMode: 'normal', markers: [], viewport, onViewportChange, onVisibleRangeChange});
    try {
      await vi.waitFor(() => expect(strokes.some(s => s.color === theme.primary && s.width === 2)).toBe(true));
      engine.setCrosshairPosition(2, 11);
      const snapshot = engine.getSnapshot(), coordinates = data.map(bar => [engine.coordinateForTime(bar.time), engine.coordinateFor({time: bar.time, price: bar.close})]);
      for (const width of [1, 3, .5, 5, undefined]) {
        strokes.length = 0; engine.setPresentation?.({line: {width}});
        await vi.waitFor(() => expect(strokes.some(s => s.color === theme.primary && s.width === (width ?? 2))).toBe(true));
        expect(data.map(bar => [engine.coordinateForTime(bar.time), engine.coordinateFor({time: bar.time, price: bar.close})])).toEqual(coordinates);
        expect(engine.getSnapshot().visibleRange).toEqual(snapshot.visibleRange);
        expect(engine.getSnapshot().crosshair).toEqual(snapshot.crosshair);
      }
      expect(() => engine.setPresentation?.({line: {width: NaN}})).toThrow('line width');
      expect(onViewportChange).not.toHaveBeenCalled(); expect(onVisibleRangeChange).not.toHaveBeenCalled();
    } finally {engine.destroy();}
  });
});


