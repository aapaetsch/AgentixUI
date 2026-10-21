import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {TechnicalChartView, type TechnicalChartTheme} from '.';
import {createTechnicalChartViewState, type MarketChartEngineOptions, type MarketTimeAxis, type OhlcBar} from '../../core';
import {createMarketChartEngine} from '../../engine';
import {builtInSeriesRenderers} from '../../engine/series-renderers';
import type {MarketChartHandle} from '../market-chart';

export default {title: 'Market Charts/Adaptive widths', component: TechnicalChartView, parameters: {layout: 'fullscreen', controls: {disable: true}}} satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
const start = 1790985600;
/** Static synthetic observations, authored upstream of the renderer; no source/calculation callbacks. */
const samples = (length: number): OhlcBar[] => Array.from({length}, (_, i) => {
  const open = 100 + Math.sin(i / 4) * 3, close = open + (i % 2 ? -.8 : .9);
  return {time: start + i * 60, open, close, high: Math.max(open, close) + .5, low: Math.min(open, close) - .5,
    volume: i === 3 ? 0 : i === 7 ? undefined : 1_000_000 + i % 11 * 130_000};
});
const regular = samples(24), dense = samples(2048), sparseGrid = samples(10);
const sparse = [sparseGrid[0], sparseGrid[3], sparseGrid[8], sparseGrid[9]];
const irregularTimes = sparseGrid.map((bar, i) => (bar.time as number) + (i >= 5 ? 2 * 86400 : 0));
const irregularSparse = [0, 3, 8, 9].map(i => ({...sparseGrid[i], time: irregularTimes[i]}));

function WidthFixture({adaptive = true, theme: initialTheme = 'dark', layout = 'both', line = false, width, data: initialData = regular, axis, interactive = false, title, height = 480}: {
  adaptive?: boolean; theme?: TechnicalChartTheme; layout?: 'overlay' | 'standalone' | 'both'; line?: boolean; width?: number;
  data?: OhlcBar[]; axis?: MarketTimeAxis; interactive?: boolean; title?: string; height?: number;
}) {
  const [theme, setTheme] = React.useState(initialTheme), [narrow, setNarrow] = React.useState(false), [revision, setRevision] = React.useState(0);
  const data = React.useMemo(() => initialData.map((bar, i) => i === initialData.length - 1 && revision ? {...bar, volume: (bar.volume ?? 0) + revision * 100, close: bar.close + revision / 10, high: bar.high + revision / 10} : bar), [initialData, revision]);
  const [state, setState] = React.useState(() => {
    const value = createTechnicalChartViewState('price-only'); value.chartType = line ? 'line' : 'candlestick';
    value.panes = [{id: 'price', order: 0, size: 4, minimumSize: 220, studyIds: [], showVolume: layout !== 'standalone'},
      ...(layout !== 'overlay' ? [{id: 'volume', order: 1, size: 1.5, minimumSize: 96, studyIds: [], showVolume: true}] : [])];
    value.viewport = {rightOffsetBars: 0, visibleRange: initialData.length ? {from: initialData[0].time, to: initialData.at(-1)!.time} : undefined};
    return value;
  });
  const api = React.useRef<MarketChartHandle>(null), frame = React.useRef<unknown>(null), creations = React.useRef(0);
  const [diagnostic, setDiagnostic] = React.useState<unknown>(null);
  const factory = React.useCallback((host: HTMLElement, options: MarketChartEngineOptions) => {
    creations.current++;
    return createMarketChartEngine(host, {...options, seriesRenderers: builtInSeriesRenderers.map(renderer => ({...renderer, draw: context => {
      frame.current = {slotSpacing: context.barSpacing, pixelRatio: context.pixelRatio, backingWidth: context.context.canvas.width, cssWidth: host.clientWidth,
        centers: context.visible.slice(0, 4).map(bar => ({time: bar.time, x: context.timeToCoordinate?.(bar.time)}))};
      renderer.draw(context);
    }}))});
  }, []);
  const visibleMinimum = state.panes.reduce((sum, pane) => sum + (pane.minimumSize ?? 0), 28);
  return <section className="min-w-0 space-y-1 p-2" style={{width: narrow ? 390 : width, maxWidth: '100%'}} aria-label={title ?? 'Adaptive width fixture'}>
    {title ? <h2 className="text-sm font-medium">{title}</h2> : null}
    <TechnicalChartView symbol="SYNTHETIC" interval="1m" data={data} state={state} onStateChange={setState} chartApiRef={api} engineFactory={factory}
      timeAxis={axis} calculationMode="supplied" calculationIdentity="synthetic-widths" dataIdentity="width-bars" dataRevision={{identity: 'width-bars', revision}}
      theme={theme} appearance={{height, heightMode: 'available', minimumPlotHeight: visibleMinimum, legends: 'compact', suppliedStatus: 'compact', navigation: 'integrated',
        candles: adaptive ? {widthMode: 'adaptive', gap: 2} : undefined, volume: adaptive ? {widthMode: 'adaptive', gap: 2} : undefined,
        grid: {opacity: .25}, badges: {style: 'outline'}}}
      features={{header: false, commands: false, drawingRail: false}} rangeShortcuts={[]}/>
    {interactive ? <div className="flex flex-wrap gap-2 text-sm">
      <button type="button" className="min-h-8 rounded border px-2" disabled={data.length < 3} onClick={() => api.current?.setVisibleRange({from: data[0].time, to: data[2].time})}>Show three observations</button>
      <button type="button" className="min-h-8 rounded border px-2" onClick={() => api.current?.fitContent()}>Restore full range</button>
      <button type="button" className="min-h-8 rounded border px-2" onClick={() => setNarrow(value => !value)}>Toggle narrow preview</button>
      <button type="button" className="min-h-8 rounded border px-2" onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')}>Toggle theme</button>
      <button type="button" className="min-h-8 rounded border px-2" onClick={() => setRevision(value => value + 1)}>Refresh supplied bar</button>
      <button type="button" className="min-h-8 rounded border px-2" onClick={() => setDiagnostic({frame: frame.current, snapshot: api.current?.getSnapshot(), creations: creations.current, revision, count: data.length, documentVersion: state.version})}>Read chart geometry</button>
      <output aria-label="Public width geometry" className="w-full break-all text-xs">{JSON.stringify(diagnostic)}</output>
    </div> : null}
  </section>;
}
function Comparison({theme = 'dark', data = regular}: {theme?: TechnicalChartTheme; data?: OhlcBar[]}) {
  return <div className="grid min-w-0 grid-cols-1 gap-2 min-[700px]:grid-cols-2">
    <WidthFixture adaptive={false} theme={theme} data={data} title="Historical defaults"/>
    <WidthFixture theme={theme} data={data} title="Adaptive · 2 CSS px target gap"/>
  </div>;
}
export const ComparisonDark: Story = {render: () => <Comparison/>};
export const ComparisonLight: Story = {render: () => <Comparison theme="light"/>};
export const DenseComparison: Story = {render: () => <Comparison data={dense}/>};
export const PriceOverlay: Story = {render: () => <WidthFixture layout="overlay"/>};
export const StandaloneVolume: Story = {render: () => <WidthFixture layout="standalone"/>};
export const LinePrice: Story = {render: () => <WidthFixture line interactive/>};
export const Narrow390: Story = {render: () => <WidthFixture width={390} height={700} interactive/>};
export const Dense390: Story = {render: () => <WidthFixture width={390} height={700} data={dense} interactive/>};
export const SparseCalendar: Story = {render: () => <WidthFixture data={irregularSparse} axis={{mode: 'calendar', times: irregularTimes}} interactive title="Sparse common calendar · missing observations leave slots empty"/>};
export const SparseUtc: Story = {render: () => <WidthFixture data={sparse} axis={{mode: 'utc', domain: {from: sparseGrid[0].time, to: sparseGrid.at(-1)!.time}, intervalSeconds: 60}} interactive/>};
export const FractionalSpacing: Story = {render: () => <WidthFixture width={697.5} data={regular.slice(0, 8)} interactive/>};
export const Empty: Story = {render: () => <WidthFixture data={[]}/>};
export const SingleBar: Story = {render: () => <WidthFixture data={regular.slice(0, 1)} interactive/>};
export const RuntimeAndDpi: Story = {render: () => <WidthFixture interactive title="Runtime / native DPI · use geometry readout after browser DPI or viewport changes"/>};
export const DenseFlatIncomplete: Story = {render: () => <WidthFixture data={dense.map(bar => ({...bar, open: 100, high: 100, low: 100, close: 100, incomplete: true}))} interactive/>};
export const FourCharts: Story = {render: () => <div className="grid min-w-0 grid-cols-1 gap-1 min-[700px]:grid-cols-2">{[0, 1, 2, 3].map(i => <WidthFixture key={i} adaptive={i % 2 === 0} theme={i < 2 ? 'dark' : 'light'} height={400} title={i % 2 ? 'Historical defaults' : 'Adaptive · 2 CSS px target gap'}/>)}</div>};
