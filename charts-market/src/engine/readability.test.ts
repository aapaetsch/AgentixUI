import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createMarketChartEngine} from '.';
const theme = {background: '#fff', text: '#111', grid: '#ddd', border: '#aaa', positive: '#080', negative: '#800', primary: '#00a'};
beforeEach(() => {vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(new Proxy({}, {get: () => vi.fn()}) as unknown as CanvasRenderingContext2D); vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);});
afterEach(() => vi.restoreAllMocks());
describe('visible supplied domains survive navigation and independent price scales', () => {
  it('fits exact visible lines/references, excludes offscreen extremes, retains identity and does not echo layout ranges', async () => {
    const bars = Array.from({length: 20}, (_, i) => ({time: i + 1, open: 100, high: 101, low: 99, close: 100}));
    const onRange = vi.fn(), host = document.createElement('div');
    const engine = createMarketChartEngine(host, {chartType: 'line', data: bars, height: 500, showVolume: false, scaleMode: 'normal', markers: [], theme,
      panes: [{id: 'price', order: 0, size: 2, studyIds: []}, {id: 'trend', order: 1, size: 1, minimumSize: 144, studyIds: ['a']}], onVisibleRangeChange: onRange});
    const ids = ['a:adx', 'a:plus_di', 'a:minus_di'];
    engine.setIndicatorSeries(ids.map((id, line) => ({id, paneId: 'trend', placement: 'pane', style: 'line', color: '#a0a', referenceLines: [{value: 25, label: 'Trend reference'}], points: bars.map((bar, i) => ({time: bar.time, value: i < 10 ? 12 + line : 65 + line}))})));
    engine.setVisibleRange({from: 1, to: 9}); await new Promise(resolve => setTimeout(resolve, 40));
    const first = engine.getSnapshot(); expect(first.scales.trend.maximum).toBeGreaterThan(25); expect(first.scales.trend.maximum).toBeLessThan(35); expect(first.scales.price.minimum).toBeGreaterThan(90);
    engine.setVisibleRange({from: 12, to: 20}, {source: 'user', gesture: 'keyboard'}); await new Promise(resolve => setTimeout(resolve, 40));
    expect(engine.getSnapshot().scales.trend.maximum).toBeGreaterThan(67); expect(engine.getSnapshot().scales.trend.minimum).toBeLessThan(25);
    engine.setScaleMode('logarithmic'); await new Promise(resolve => setTimeout(resolve, 40)); expect(engine.getSnapshot().scales.trend.mode).toBe('normal');
    onRange.mockClear(); engine.setPresentation?.({paneHeaderHeights: {price: 70, trend: 56}}); await new Promise(resolve => setTimeout(resolve, 40));
    expect(onRange).not.toHaveBeenCalled(); expect(engine.getSnapshot().visibleRange).toEqual({from: 12, to: 20});
    engine.setCrosshairPosition(15, 100); expect(Object.keys(engine.getSnapshot().crosshair!.values)).toEqual(expect.arrayContaining(ids));
    expect(engine.getSnapshot().crosshair!.values['a:adx']).toBe(65); engine.destroy();
  });
});
