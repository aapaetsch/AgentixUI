import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {layoutMovingAverageLabels, movingAverageValueText, type MovingAverageLabel} from './moving-average-labels';
import {createMarketChartEngine} from '.';
import {validateMarketPresentation, type IndicatorRenderSeries, type MarketChartEngine, type MarketChartPresentation} from '../core';

const theme = {background: '#fff', text: '#111', grid: '#ddd', border: '#aaa', positive: '#080', negative: '#800', primary: '#00a'};
const candidate = (id: string, y: number | null, value: number | null = 100): MovingAverageLabel => ({id, label: 'SMA 50', color: '#04a', value, time: 8, status: 'available', anchorY: y, anchorX: 20});
describe('all-visible moving-average label layout', () => {
  it('stacks coincident values within bounds without mutating or discarding any row', () => {
    const labels = ['a','b','c','d'].map(id => candidate(id, 80)); const before = JSON.stringify(labels);
    const result = layoutMovingAverageLabels(labels, 20, 160);
    expect(result.overflow).toBe(false); expect(result.labels).toHaveLength(4);
    expect(result.labels.every((label, i, rows) => label.y >= 36 && label.y <= 164 && (!i || label.y - rows[i - 1].y >= 32))).toBe(true);
    expect(result.labels.some(label => label.displaced)).toBe(true); expect(JSON.stringify(labels)).toBe(before);
  });
  it('retains off-scale, invalid-log and missing rows; overflow is explicit even in tiny panes', () => {
    const labels = [candidate('above', -100), candidate('below', 900), candidate('log', null, -1), candidate('null', null, null)];
    const placed = layoutMovingAverageLabels(labels, 0, 160).labels;
    expect(placed.find(x => x.id === 'above')?.edge).toBe('above'); expect(placed.find(x => x.id === 'below')?.edge).toBe('below');
    expect(placed.find(x => x.id === 'log')?.edge).toBe('undefined'); expect(placed.find(x => x.id === 'null')?.edge).toBeUndefined();
    for (const height of [0, 1, 90]) {const result = layoutMovingAverageLabels(labels, 0, height); expect(result.overflow).toBe(true); expect(result.labels.map(x => x.id).sort()).toEqual(labels.map(x => x.id).sort());}
    expect(movingAverageValueText(null)).toBe('—'); expect(movingAverageValueText(.0000001234)).toContain('e-7'); expect(movingAverageValueText(101.12345678)).toBe('101.12346');
    expect(movingAverageValueText(-1.23456789e308)).toContain('e+308'); expect(movingAverageValueText(-1.23456789e308).length).toBeLessThanOrEqual(9);
  });
  it('rejects an unsupported mode without changing presentation', () => {
    expect(() => validateMarketPresentation({badges: {movingAverages: 'nearest'}} as unknown as MarketChartPresentation)).toThrow('movingAverages');
  });
});

const engines: MarketChartEngine[] = [];
const frame = () => new Promise(resolve => setTimeout(resolve, 35));
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(new Proxy({}, {get: () => vi.fn()}) as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800);
});
afterEach(() => {engines.splice(0).forEach(engine => engine.destroy()); document.body.replaceChildren(); vi.restoreAllMocks();});
function fixture(mode = true, height = 400) {
  const host = document.createElement('div'); document.body.appendChild(host);
  const bars = Array.from({length: 20}, (_, i) => ({time: i + 1, open: 100, high: 101, low: 99, close: 100}));
  const series: IndicatorRenderSeries[] = ['a','b','c','d'].map((id, n) => ({id, paneId: 'price', placement: 'overlay', style: 'line', color: ['#04a','#a40','#4a0','#a04'][n], axisLabel: {kind: 'moving-average', label: `SMA 50 · ${n + 1}`, shortLabel: 'SMA 50', status: 'partial · supplied warning'}, points: bars.map(bar => ({time: bar.time, value: bar.time < 10 ? 99.123456789 : 100.7654321}))}));
  const engine = createMarketChartEngine(host, {data: bars, chartType: 'line', height, scaleMode: 'normal', showVolume: false, markers: [], theme,
    panes: [{id: 'price', order: 0, size: 1, studyIds: ['a','b','c','d']}], presentation: mode ? {badges: {movingAverages: 'all-visible'}} : {}});
  engines.push(engine); engine.setIndicatorSeries(series); engine.setViewport?.({logicalRange: {from: .25, to: 7.75}});
  return {host, engine, bars, series};
}
describe('engine endpoint boxes from accepted supplied outputs', () => {
  it('uses exact last visible accepted bar, excludes overscan, and ignores hover inspection', async () => {
    const {host, engine, bars, series} = fixture(), before = JSON.stringify([bars, series]); await frame();
    const notes = () => [...host.querySelectorAll<HTMLElement>('[data-endpoint-label]')];
    expect(notes()).toHaveLength(4); expect(notes().every(node => node.dataset.endpointTime === '8' && node.dataset.endpointValue === '99.123456789')).toBe(true);
    expect(notes()[0].getAttribute('aria-label')).toContain('supplied warning'); expect(notes()[0].getAttribute('aria-label')).not.toContain('opaque');
    engine.setViewport?.({logicalRange: {from: .25, to: 7.999999}}); await frame();
    expect(notes().every(node => node.dataset.endpointTime === '8')).toBe(true);
    engine.setViewport?.({logicalRange: {from: .25, to: 7.75}}); await frame();
    engine.setCrosshairPosition(3, 100); await frame(); expect(notes().every(node => node.dataset.endpointTime === '8')).toBe(true);
    engine.setViewport?.({logicalRange: {from: 10, to: 19}}); await frame(); expect(notes().every(node => node.dataset.endpointTime === '20' && node.dataset.endpointValue === '100.7654321')).toBe(true);
    expect(JSON.stringify([bars, series])).toBe(before);
  });
  it('does not carry a sparse/null sample and reflects current-bar revisions without scale mutation', async () => {
    const {host, engine, series} = fixture();
    series[0] = {...series[0], points: series[0].points.filter(point => point.time !== 8)};
    series[1] = {...series[1], points: series[1].points.map(point => point.time === 8 ? {...point, value: null} : point)};
    engine.setIndicatorSeries(series); engine.setScale?.({mode: 'normal', autoScale: false, manualRange: {minimum: 100, maximum: 101}}); await frame();
    expect(host.querySelector('[data-endpoint-label="a"]')?.textContent).toContain('missing'); expect(host.querySelector('[data-endpoint-label="b"]')?.textContent).toContain('missing');
    expect(host.querySelector('[data-endpoint-label="a"]')?.getAttribute('aria-label')).toContain('Missing sample; unpositioned');
    expect(host.querySelector('[data-endpoint-label="c"]')?.getAttribute('data-endpoint-edge')).toBe('below');
    const scale = engine.getSnapshot().scale;
    series[2] = {...series[2], points: series[2].points.map(point => point.time === 8 ? {...point, value: 120} : point)};
    engine.setIndicatorSeries(series); await frame(); expect(host.querySelector('[data-endpoint-label="c"]')?.getAttribute('data-endpoint-edge')).toBe('above'); expect(engine.getSnapshot().scale).toEqual(scale);
    engine.setScale?.({mode: 'logarithmic', autoScale: false, manualRange: {minimum: Math.log(90), maximum: Math.log(110)}});
    series[3] = {...series[3], points: series[3].points.map(point => point.time === 8 ? {...point, value: -1} : point)}; engine.setIndicatorSeries(series); await frame();
    expect(host.querySelector('[data-endpoint-label="d"]')?.getAttribute('aria-label')).toContain('nonpositive log');
    engine.resize(800, 120); await frame();
    expect(host.querySelector('[data-endpoint-label="d"]')?.getAttribute('aria-label')).toContain('List row, not a price position');
    expect(host.querySelector('[data-endpoint-label="d"]')?.getAttribute('aria-label')).toContain('nonpositive log');
    expect(host.querySelector('[data-endpoint-label="c"]')?.getAttribute('aria-label')).toContain('Above visible scale');
  });
  it('preserves the default, honors visibility, retains overflow and destroys owned DOM', async () => {
    const {host, engine} = fixture(false, 120); await frame(); expect(host.querySelectorAll('[data-endpoint-label]')).toHaveLength(0);
    engine.setPresentation?.({badges: {movingAverages: 'all-visible'}}); await frame(); expect(host.querySelectorAll('[data-endpoint-label]')).toHaveLength(4); expect(host.querySelector('[data-endpoint-overflow]')).not.toBeNull();
    expect((host.querySelector('[data-endpoint-overflow]') as HTMLElement).style.width).toBe('118px');
    expect((host.querySelector('[data-endpoint-overflow]') as HTMLElement).style.left).toBe('681px');
    engine.resize(800, 80); await frame();
    expect([...host.querySelectorAll<HTMLElement>('[data-endpoint-label]')].every(node => node.dataset.endpointEdge === '')).toBe(true);
    engine.setPresentation?.({badges: {movingAverages: 'all-visible', studyValues: false}}); await frame(); expect(host.querySelectorAll('[data-endpoint-label]')).toHaveLength(0);
    engine.destroy(); expect(host.children).toHaveLength(0);
  });
  it('honors exact UTC window bounds and declared gap interiors without inventing an endpoint', async () => {
    const {host, engine} = fixture();
    engine.setTimeAxis?.({mode: 'utc', domain: {from: 1, to: 20}, intervalSeconds: 1});
    engine.setVisibleRange({from: 6.1, to: 8.9}); await frame();
    expect(host.querySelector('[data-endpoint-label="a"]')?.getAttribute('data-endpoint-time')).toBe('8');
    engine.setDiscontinuities?.([{from: 7, to: 9}]); await frame();
    expect(host.querySelector('[data-endpoint-label="a"]')?.getAttribute('data-endpoint-time')).toBe('7');
    engine.setVisibleRange({from: 7.1, to: 8.9}); await frame();
    expect(host.querySelector('[data-endpoint-label="a"]')?.getAttribute('data-endpoint-time')).toBe('');
    expect(host.querySelector('[data-endpoint-label="a"]')?.getAttribute('data-endpoint-value')).toBe('');
  });
});
