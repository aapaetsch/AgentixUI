import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createMarketChartEngine} from '.';
import {layoutMovingAverageLabels, type MovingAverageLabel} from './moving-average-labels';
import {validateMarketPresentation, type IndicatorRenderSeries, type MarketChartEngine, type MarketChartPresentation, type MarketRenderLayerContext} from '../core';
import {endpointBars, endpointResults, endpointState} from '../components/technical-chart-view/endpoint-fixtures';
import {suppliedStudyDefinitions} from '../indicators';

const theme = {background: '#fff', text: '#111', grid: '#ddd', border: '#aaa', positive: '#080', negative: '#800', primary: '#00a'};
const label = (id: string, anchorY: number): MovingAverageLabel => ({id, label: id, color: '#04a', value: 10, status: 'supplied', anchorY, anchorX: 80});
const frame = () => new Promise(resolve => setTimeout(resolve, 40));
const engines: MarketChartEngine[] = [];
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(new Proxy({}, {get: () => vi.fn()}) as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1440);
});
afterEach(() => {engines.splice(0).forEach(engine => engine.destroy()); document.body.replaceChildren(); vi.restoreAllMocks();});
function fixture() {
  const state = endpointState(), results = endpointResults(state), host = document.createElement('div'); document.body.appendChild(host);
  let context: MarketRenderLayerContext | undefined;
  const series: IndicatorRenderSeries[] = state.indicators.flatMap(instance => {
    const definition = suppliedStudyDefinitions.find(item => item.id === instance.definitionId)!;
    const result = results[instance.id];
    const pane = state.panes.find(item => item.studyIds.includes(instance.id))!;
    return definition.lines.map(line => ({id: `${instance.id}:${line.id}`, paneId: pane.id, placement: definition.placement, style: line.style ?? 'line', color: line.color ?? '#04a', fixedDomain: definition.fixedDomain, referenceLines: definition.referenceLines,
      axisLabel: {kind: 'study' as const, label: `${definition.label} ${Object.values(instance.parameters).join(', ')} · ${line.label}`, shortLabel: line.label, status: 'partial · synthetic warning'},
      points: result?.kind === 'indicator' ? result.points.map(point => ({time: point.time, value: point.values[line.id] ?? null})) : []}));
  });
  const engine = createMarketChartEngine(host, {data: endpointBars, chartType: 'candlestick', height: 1500, scaleMode: 'normal', showVolume: false, markers: [], theme, panes: state.panes,
    presentation: {badges: {endpointValues: 'all-visible'}, paneHeaderHeights: {price: 28, rsi: 28, macd: 28, stochastic: 28, adx: 28}}, renderLayers: [{id: 'public-coordinate-proof', zIndex: 200, draw: value => {context = value;}}]});
  engine.setIndicatorSeries(series); engine.fitContent(); engines.push(engine);
  return {engine, host, state, series, context: () => context!};
}
describe('minimum endpoint displacement', () => {
  it('keeps feasible anchors exact and centers coincident rows rather than biasing one direction', () => {
    expect(layoutMovingAverageLabels([label('a', 40), label('b', 90), label('c', 150)], 0, 200).labels.map(item => item.y)).toEqual([40, 90, 150]);
    expect(layoutMovingAverageLabels([label('a', 80), label('b', 80), label('c', 80)], 0, 200).labels.map(item => item.y)).toEqual([48, 80, 112]);
  });
  it('preserves crossing endpoint order, bounds and minimum squared movement against exhaustive feasible placements', () => {
    for (const targets of [[8, 2, 5], [5, 5, 5], [-10, 9, 11], [2, 3, 4]]) {
      const inputs = targets.map((value, i) => label(String(i), value)), before = JSON.stringify(inputs), rows = layoutMovingAverageLabels(inputs, 0, 10, 2).labels;
      const cost = rows.reduce((sum, row) => sum + (row.y - row.anchorY!) ** 2, 0);
      const sorted = [...targets].sort((a, b) => a - b);
      let best = Infinity;
      for (let a = 1; a <= 5; a++) for (let b = a + 2; b <= 7; b++) for (let c = b + 2; c <= 9; c++) best = Math.min(best, (a - sorted[0]) ** 2 + (b - sorted[1]) ** 2 + (c - sorted[2]) ** 2);
      expect(cost).toBeLessThanOrEqual(best + 1e-10); expect(rows.every((row, i) => row.y >= 1 && row.y <= 9 && (!i || row.y - rows[i - 1].y >= 2 - 1e-10))).toBe(true); expect(JSON.stringify(inputs)).toBe(before);
    }
  });
});
describe('per-pane non-occluding all-output gutter', () => {
  it('matches every true public pane coordinate including RSI above price and every histogram/line output', async () => {
    const {engine, host, series, context} = fixture(); await frame();
    const notes = [...host.querySelectorAll<HTMLElement>('[data-endpoint-label]')]; expect(notes).toHaveLength(14);
    expect(notes.every(note => note.querySelectorAll('span').length === 1 && !/SMA|EMA|RSI|MACD|Price|Histogram|Signal|DI/.test(note.textContent ?? ''))).toBe(true);
    expect(notes.find(note => note.dataset.endpointLabel === 'opaque-macd:histogram')?.title).toContain('Histogram');
    expect(engine.getSnapshot().panes[0].id).toBe('rsi');
    for (const item of series) {
      const note = notes.find(node => node.dataset.endpointLabel === item.id)!;
      const value = item.points.at(-1)!.value!;
      expect(Number(note.dataset.endpointAnchorY)).toBeCloseTo(context().priceToCoordinate(value, item.placement === 'overlay' ? 'price' : item.paneId)!);
      expect(Number(note.dataset.endpointAnchorX)).toBeCloseTo(context().timeToCoordinate(endpointBars.at(-1)!.time)!);
      expect(note.dataset.endpointTime).toBe(String(endpointBars.at(-1)!.time)); expect(note.getAttribute('aria-label')).toContain('synthetic warning');
    }
    expect(Number(host.querySelector<HTMLElement>('[data-endpoint-label="price"]')!.dataset.endpointAnchorY)).toBeCloseTo(engine.coordinateFor({time: endpointBars.at(-1)!.time, price: 100.25})!.y);
    expect(context().plotBounds!.width).toBe(1440 - 72 - 100);
    Object.values(context().axisBounds ?? {}).forEach(axis => expect(axis.x).toBe(1440 - 72));
    host.querySelectorAll<HTMLElement>('[data-endpoint-pane]').forEach(region => {
      const pane = engine.getSnapshot().panes.find(item => item.id === region.dataset.endpointPane)!;
      expect(Number.parseFloat(region.style.left)).toBeGreaterThanOrEqual(context().plotBounds!.width);
      const boxes = [...region.querySelectorAll<HTMLElement>('[data-endpoint-label]')];
      for (let i = 0; i < boxes.length; i++) {
        const y = Number(boxes[i].dataset.endpointCenterY), h = Number.parseFloat(boxes[i].style.height);
        expect(y - h / 2).toBeGreaterThanOrEqual(pane.top + 28); expect(y + h / 2).toBeLessThanOrEqual(pane.top + pane.height - 4);
        if (i) expect(y - Number(boxes[i - 1].dataset.endpointCenterY)).toBeGreaterThanOrEqual(h);
      }
    });
  });
  it('retains exact endpoints through reorder, collapse, resize, historical pan, independent hover and accepted revisions', async () => {
    const {engine, host, state, series, context} = fixture(); await frame();
    const original = JSON.stringify([endpointBars, series]);
    engine.setPanes?.(state.panes.map(pane => ({...pane, order: 4 - pane.order, collapsed: pane.id === 'macd'}))); engine.resize(390, 1400); await frame();
    expect(host.querySelector('[data-endpoint-pane="macd"]')).toBeNull(); expect(host.querySelectorAll('[data-endpoint-label]')).toHaveLength(11);
    engine.setViewport?.({logicalRange: {from: 2.1, to: 11.999999}}); await frame();
    expect([...host.querySelectorAll<HTMLElement>('[data-endpoint-label]')].every(node => node.dataset.endpointTime === String(endpointBars[11].time))).toBe(true);
    engine.setCrosshairPosition(endpointBars[5].time, 100); await frame();
    expect(host.querySelector('[data-endpoint-label="price"]')?.getAttribute('data-endpoint-time')).toBe(String(endpointBars[11].time));
    const revised = series.map(item => ({...item, points: item.points.map(point => point.time === endpointBars[11].time ? {...point, value: 1.23456789} : point)}));
    engine.setIndicatorSeries(revised); await frame();
    const note = host.querySelector<HTMLElement>('[data-endpoint-label="opaque-rsi:rsi"]')!;
    expect(note.dataset.endpointValue).toBe('1.23456789'); expect(Number(note.dataset.endpointAnchorY)).toBeCloseTo(context().priceToCoordinate(1.23456789, 'rsi')!);
    expect(JSON.stringify([endpointBars, series])).toBe(original);
  });
  it('separates price/study toggles, handles nonnumeric/log/offscale rows and leaves manual range intact', async () => {
    const {engine, host, series} = fixture();
    engine.setScale?.({mode: 'logarithmic', autoScale: false, manualRange: {minimum: Math.log(99), maximum: Math.log(101)}});
    const revised = series.map((item, i) => i === 0 ? {...item, points: item.points.map(point => ({...point, value: -1}))} : i === 1 ? {...item, points: []} : item);
    engine.setIndicatorSeries(revised); await frame(); const scale = engine.getSnapshot().scale;
    expect(host.querySelector('[data-endpoint-edge="undefined"]')?.getAttribute('aria-label')).toContain('nonpositive log');
    expect(host.querySelector('[data-endpoint-label="opaque-ma-1:sma"]')?.textContent).toContain('missing');
    engine.setPresentation?.({badges: {endpointValues: 'all-visible', lastPrice: false}}); await frame(); expect(host.querySelectorAll('[data-endpoint-label]')).toHaveLength(13);
    engine.setPresentation?.({badges: {endpointValues: 'all-visible', studyValues: false}}); await frame(); expect(host.querySelectorAll('[data-endpoint-label]')).toHaveLength(1);
    engine.setPresentation?.({badges: {endpointValues: 'all-visible', visible: false}}); await frame(); expect(host.querySelectorAll('[data-endpoint-label]')).toHaveLength(0);
    expect(engine.getSnapshot().scale).toEqual(scale); expect(engine.getSnapshot().panes.find(pane => pane.id === 'price')!.width).toBe(1440 - 72);
    expect(() => validateMarketPresentation({badges: {endpointValues: 'nearest'}} as unknown as MarketChartPresentation)).toThrow('endpointValues');
  });
});
