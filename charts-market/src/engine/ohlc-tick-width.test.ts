import {describe, expect, it} from 'vitest';
import {validateMarketPresentation, type MarketChartPresentation, type MarketSeriesRendererContext, type MarketChartType, type OhlcBar} from '../core';
import {builtInSeriesRenderers} from './series-renderers';

const theme = {background: 'white', text: 'black', grid: 'gray', border: 'silver', positive: 'green', negative: 'red', primary: 'blue'};
const bars: OhlcBar[] = [
  {time: 1, open: 10, high: 15, low: 8, close: 12},
  {time: 2, open: 10, high: 12, low: 8, close: 12}, // No upper wick.
  {time: 3, open: 12, high: 12, low: 10, close: 10}, // No outer wicks.
  {time: 4, open: 10, high: 15, low: 10, close: 10}, // Equal open/close, no lower wick.
  {time: 5, open: 10, high: 10, low: 10, close: 10, incomplete: true},
];
type LineCap = 'butt' | 'round' | 'square';
interface Stroke {width: number; cap: LineCap; color: string; dash: number[]; points: number[][]}
function draw(presentation?: MarketChartPresentation, spacing = 12, pixelRatio = 1, type: MarketChartType = 'bar', data = bars) {
  const strokes: Stroke[] = [], rectangles: number[][] = [];
  let state = {width: 7, cap: 'round' as LineCap, color: '', dash: [] as number[]}, points: number[][] = [];
  const stack: typeof state[] = [];
  const context = {
    get lineWidth() {return state.width;}, set lineWidth(v: number) {state.width = v;},
    get lineCap() {return state.cap;}, set lineCap(v: LineCap) {state.cap = v;},
    get strokeStyle() {return state.color;}, set strokeStyle(v: string) {state.color = v;},
    fillStyle: '', globalAlpha: 1,
    save: () => {stack.push({...state, dash: [...state.dash]});}, restore: () => {state = stack.pop()!;},
    setLineDash: (v: number[]) => {state.dash = [...v];}, beginPath: () => {points = [];},
    moveTo: (x: number, y: number) => {points.push([x, y]);}, lineTo: (x: number, y: number) => {points.push([x, y]);},
    stroke: () => {strokes.push({...state, dash: [...state.dash], points: [...points]});},
    fillRect: (...args: number[]) => {rectangles.push(args);}, strokeRect: (...args: number[]) => {rectangles.push(args);},
  } as unknown as CanvasRenderingContext2D;
  const x = (i: number) => 10.625 + i * spacing;
  builtInSeriesRenderers.find(r => r.id === type)!.draw({context, presentation, visible: data, startIndex: 0, barSpacing: spacing, pixelRatio,
    logicalToCoordinate: x, timeToCoordinate: t => x(Number(t) - 1), scale: {toCoordinate: price => price * 2.125},
    pane: {id: 'price', top: 0, height: 200, width: 500}, theme} as MarketSeriesRendererContext);
  return {strokes, rectangles, context, x};
}
describe('OHLC tick width', () => {
  it.each([NaN, Infinity, -Infinity, 0, .49, 5.01, '2'])('rejects invalid explicit width %s', tickWidth => {
    expect(() => validateMarketPresentation({bars: {tickWidth}} as MarketChartPresentation)).toThrow('Invalid chart presentation bars tickWidth');
  });
  it.each([undefined, .5, 1, 2, 5])('accepts omission/bounded width %s', tickWidth => {
    expect(() => validateMarketPresentation({bars: {tickWidth}})).not.toThrow();
  });
  it.each([1, 2])('retains supplied wick/tick prices, directions and nonzero half-slots at DPR %s', pixelRatio => {
    for (const spacing of [100, 12, 1.5, 1, .25]) for (const tickWidth of [.5, 1, 2, 5]) {
      const before = structuredClone(bars), {strokes, context, x} = draw({candles: {widthMode: 'adaptive', gap: 1, wickWidth: 1}, bars: {tickWidth}}, spacing, pixelRatio);
      const width = Math.min(spacing, Math.max(1 / pixelRatio, spacing - 1));
      expect(strokes).toHaveLength(bars.length * 2);
      bars.forEach((bar, i) => {
        const stem = strokes[i * 2], ticks = strokes[i * 2 + 1], center = x(i);
        expect(stem).toMatchObject({width: Math.min(1, width), points: [[center, bar.high * 2.125], [center, bar.low * 2.125]]});
        expect(ticks).toEqual({width: tickWidth, cap: 'butt', color: bar.close >= bar.open ? theme.positive : theme.negative, dash: bar.incomplete ? [3, 3] : [],
          points: [[center - width / 2, bar.open * 2.125], [center, bar.open * 2.125], [center, bar.close * 2.125], [center + width / 2, bar.close * 2.125]]});
        expect(ticks.points[1][0] - ticks.points[0][0]).toBeGreaterThan(0);
        expect(ticks.points[3][0] - ticks.points[2][0]).toBeGreaterThan(0);
      });
      expect(bars).toEqual(before); expect(context.lineCap).toBe('round');
    }
  });
  it('keeps exact legacy omission paths, widths and caps for proportional and dense adaptive bars', () => {
    for (const adaptive of [false, true]) for (const spacing of [12, 1, .25]) {
      const candles: MarketChartPresentation['candles'] = {widthMode: adaptive ? 'adaptive' : 'proportional', gap: 1, wickWidth: 3};
      const {strokes, x} = draw({candles}, spacing);
      const width = adaptive ? Math.min(spacing, Math.max(1, spacing - 1)) : Math.max(1, Math.floor(Math.min(14, spacing * .7)));
      const stemWidth = adaptive ? Math.min(3, width) : 3;
      bars.forEach((bar, i) => {
        const center = x(i), stem = adaptive ? center : Math.round(center) + .5;
        expect(strokes[i * 2]).toMatchObject({width: stemWidth, cap: 'round', points: [[stem, bar.high * 2.125], [stem, bar.low * 2.125]]});
        expect(strokes[i * 2 + 1]).toMatchObject({width: stemWidth, cap: 'round', points: [[center - width / 2 + (adaptive ? stemWidth / 2 : 0), bar.open * 2.125], [center, bar.open * 2.125], [center, bar.close * 2.125], [center + width / 2 - (adaptive ? stemWidth / 2 : 0), bar.close * 2.125]]});
      });
      expect(draw({candles, bars: {}}, spacing).strokes).toEqual(strokes);
    }
  });
  it('aligns explicit proportional ticks with the unchanged snapped high-low stem', () => {
    const {strokes, x} = draw({candles: {wickWidth: 1}, bars: {tickWidth: 2}}, 1);
    bars.forEach((_, i) => {
      const center = Math.round(x(i)) + .5;
      expect(strokes[i * 2].points.map(([point]) => point)).toEqual([center, center]);
      expect(strokes[i * 2 + 1].points.map(([point]) => point)).toEqual([center - .5, center, center, center + .5]);
    });
  });
  it('does not change candle bodies/wicks or published line strokes, and handles empty observations', () => {
    for (const type of ['candlestick', 'line'] as const) {
      const base = {candles: {widthMode: 'adaptive' as const, gap: 1, wickWidth: 1}, line: {width: 3}};
      const prior = draw(base, 12, 2, type), next = draw({...base, bars: {tickWidth: 5}}, 12, 2, type);
      expect(next.strokes).toEqual(prior.strokes); expect(next.rectangles).toEqual(prior.rectangles);
    }
    expect(draw({bars: {tickWidth: 2}}, 12, 1, 'bar', []).strokes).toEqual([]);
  });
});
