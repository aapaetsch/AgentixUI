import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {TechnicalChartView, type TechnicalChartTheme} from '.';
import type {MarketChartHandle} from '../market-chart';
import {marketDataCalculationIdentity, type MarketChartSnapshot} from '../../core';
import {endpointBars, endpointDefinitions, endpointResults, endpointState, type EndpointFixture} from './endpoint-fixtures';

export default {title: 'Market Charts/Endpoint Alignment', component: TechnicalChartView, parameters: {layout: 'fullscreen', controls: {disable: true}}} satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
function Endpoints({variant = 'normal', theme = 'dark', width, fontSize = 11, customTheme = false, compact = false}: {variant?: EndpointFixture; theme?: TechnicalChartTheme; width?: number; fontSize?: number; customTheme?: boolean; compact?: boolean}) {
  const [state, setState] = React.useState(() => endpointState(variant));
  const [revision, setRevision] = React.useState(0), [font, setFont] = React.useState(fontSize), [snapshot, setSnapshot] = React.useState<MarketChartSnapshot | null>(null);
  const api = React.useRef<MarketChartHandle>(null);
  const identity = marketDataCalculationIdentity('synthetic-endpoint', revision, 'synthetic-endpoint-bars');
  const results = React.useMemo(() => endpointResults(state, variant, identity, revision), [state, variant, identity, revision]);
  const data = React.useMemo(() => endpointBars.map((bar, i) => i === 35 ? {...bar, close: bar.close + revision * .125, high: bar.high + revision * .125} : bar), [revision]);
  return <div className="min-w-0 p-2" style={{width, maxWidth: '100%'}}>
    <div className="flex flex-wrap gap-2 pb-2 text-xs">
      <button className="border p-1" onClick={() => api.current?.setVisibleRange({from: endpointBars[2].time, to: endpointBars[11].time})}>Historical window</button>
      <button className="border p-1" onClick={() => api.current?.fitContent()}>Fit</button>
      <button className="border p-1" onClick={() => api.current?.setCrosshairPosition(endpointBars[5].time, 100.125)}>Inspect price</button>
      <button className="border p-1" onClick={() => setRevision(value => value + 1)}>Revise supplied bar</button>
      <button className="border p-1" onClick={() => setState(value => ({...value, panes: value.panes.map(pane => ({...pane, order: 4 - pane.order}))}))}>Reverse pane order</button>
      <button className="border p-1" onClick={() => setState(value => ({...value, panes: value.panes.map(pane => pane.id === 'macd' ? {...pane, collapsed: !pane.collapsed} : pane)}))}>Toggle MACD collapse</button>
      <button className="border p-1" onClick={() => setFont(value => value === 11 ? 16.5 : 11)}>Toggle larger font</button>
      <button className="border p-1" onClick={() => setSnapshot(api.current?.getSnapshot() ?? null)}>Read public snapshot</button>
    </div>
    <TechnicalChartView chartApiRef={api} state={state} onStateChange={setState} data={data} symbol="SYNTHETIC" interval="1D"
      dataIdentity="synthetic-endpoint-bars" dataRevision={{identity: 'synthetic-endpoint-bars', revision}} calculationMode="supplied" calculationIdentity="synthetic-endpoint" suppliedResults={results} availableIndicators={endpointDefinitions}
      theme={theme} style={customTheme ? {'--background': '232 30% 10%', '--foreground': '45 40% 94%', '--border': '232 25% 30%'} as React.CSSProperties : undefined}
      appearance={{height: compact ? 700 : 1540, heightMode: 'available', minimumPlotHeight: compact ? 500 : 1450, legends: 'compact', suppliedStatus: 'compact', navigation: 'integrated', badges: {endpointValues: 'all-visible', style: 'outline', fontSize: font}, candles: {widthMode: 'adaptive', gap: 2}}}
      rangeShortcuts={[]} features={{header: false, commands: false, drawingRail: false, dataTable: false}}/>
    <output aria-label="Endpoint public snapshot" className="block break-all text-xs">{snapshot ? JSON.stringify(snapshot) : ''}</output>
  </div>;
}
export const AllOutputs: Story = {render: () => <Endpoints/>};
export const Light: Story = {render: () => <Endpoints theme="light"/>};
export const Narrow390: Story = {render: () => <Endpoints width={390}/>};
export const Narrow320: Story = {render: () => <Endpoints width={320}/>};
export const EqualValues: Story = {render: () => <Endpoints variant="equal"/>};
export const CrossingLines: Story = {render: () => <Endpoints variant="crossing"/>};
export const DenseCollision: Story = {render: () => <Endpoints variant="dense"/>};
export const ManualOffScale: Story = {render: () => <Endpoints variant="offscale"/>};
export const Logarithmic: Story = {render: () => <Endpoints variant="log"/>};
export const Missing: Story = {render: () => <Endpoints variant="missing"/>};
export const Sparse: Story = {render: () => <Endpoints variant="sparse"/>};
export const Unavailable: Story = {render: () => <Endpoints variant="unavailable"/>};
export const LargerFont: Story = {render: () => <Endpoints width={320} fontSize={16.5}/>};
export const CustomTheme: Story = {render: () => <Endpoints customTheme/>};
export const CompactWorkspace: Story = {render: () => <Endpoints compact/>};
