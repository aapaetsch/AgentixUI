import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {TechnicalChartView, type TechnicalChartTheme} from '.';
import {readabilityBars, readabilityDefinitions, readabilityResults, readabilityState} from './readability-fixtures';
import {marketDataCalculationIdentity, type MarketChartSnapshot, type SuppliedCalculationResults} from '../../core';
import type {MarketChartHandle} from '../market-chart';

export default {title: 'Market Charts/Readability', component: TechnicalChartView, parameters: {layout: 'fullscreen', controls: {disable: true}}} satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
function Readability({theme = 'dark', width, variant = 'normal', height = 700, allOutputs = false, longLabels = false, empty = false, interactive = false, custom = false}: {theme?: TechnicalChartTheme; width?: number; variant?: Parameters<typeof readabilityResults>[1]; height?: number; allOutputs?: boolean; longLabels?: boolean; empty?: boolean; interactive?: boolean; custom?: boolean}) {
  const [state, setState] = React.useState(() => {
    const value = readabilityState();
    if (height < 500) value.panes[0].minimumSize = 280;
    if (allOutputs) {
      for (const id of ['bb', 'macd', 'rsi', 'stochastic']) {
        const definition = readabilityDefinitions.find(item => item.id === id)!;
        const instanceId = `opaque:${id}`;
        value.indicators.push({id: instanceId, definitionId: id, version: 1, visible: true, parameters: definition.defaultParameters});
        if (definition.placement === 'overlay') value.panes[0].studyIds.push(instanceId);
        else value.panes.push({id: instanceId, order: value.panes.length, size: 1, minimumSize: 112, studyIds: [instanceId]});
      }
      value.profiles.push({...value.profiles[0], id: 'session-profile', range: 'session', timeRange: value.viewport.visibleRange, placement: 'right', widthPercent: 10, splitVolume: false, upColor: '#9684d8'},
        {...value.profiles[0], id: 'anchored-profile', range: 'fixed', timeRange: value.viewport.visibleRange, placement: 'right', widthPercent: 7, upColor: '#5fafb3', downColor: '#b47762', pocColor: '#9853b1'});
      value.indicators.push({...value.indicators[0], id: 'same-parameters-duplicate', colors: {sma: '#cb8ca8'}}); value.panes[0].studyIds.push('same-parameters-duplicate');
    }
    return value;
  });
  const [revision, setRevision] = React.useState(0), [snapshot, setSnapshot] = React.useState<MarketChartSnapshot | null>(null);
  const api = React.useRef<MarketChartHandle>(null);
  const data = React.useMemo(() => empty ? [] : readabilityBars.map((bar, i) => i === readabilityBars.length - 1 && revision ? {...bar, close: bar.close + revision / 10, high: bar.high + revision / 10, volume: (bar.volume ?? 0) + revision * 100} : bar), [empty, revision]);
  const identity = marketDataCalculationIdentity('synthetic-readability', revision, 'synthetic-bars');
  const results = React.useMemo<SuppliedCalculationResults>(() => readabilityResults(state, variant, identity, data), [state, variant, identity, data]);
  const definitions = React.useMemo(() => longLabels ? readabilityDefinitions.map(definition => ({...definition, label: `${definition.label} · Custom host-defined descriptive study label with the complete name available through Legend`, formatParameters: () => 'Host parameters'})) : readabilityDefinitions, [longLabels]);
  const minimum = state.panes.filter(pane => pane.visible !== false).reduce((sum, pane) => sum + (pane.collapsed ? 28 : pane.minimumSize ?? 0), 28);
  return <div style={{width, maxWidth: '100%'}} className="min-w-0 p-2">
    <TechnicalChartView chartApiRef={api} symbol="SYNTHETIC" interval="5m" data={data} state={state} onStateChange={setState}
      dataIdentity="synthetic-bars" dataRevision={{identity: 'synthetic-bars', revision}}
      calculationMode="supplied" calculationIdentity="synthetic-readability" suppliedResults={results} availableIndicators={definitions}
      theme={theme} style={custom ? {'--background': '235 36% 8%', '--foreground': '42 34% 93%', '--positive': '168 70% 55%', '--negative': '20 85% 65%', '--border': '235 20% 28%'} as React.CSSProperties : undefined}
      dataAvailability={{status: 'stale', description: 'Static synthetic cache; no source requests'}}
      legendMetadata={longLabels ? {profiles: {'opaque:profile': {label: 'Host-named profile with complete provenance and unchanged supplied identity'}}} : undefined}
      appearance={{height, heightMode: 'available', minimumPlotHeight: minimum, suppliedStatus: 'compact', legends: 'compact', navigation: 'integrated', candles: {bodyRatio: .7, maximumWidth: 9}, grid: {opacity: .3}, badges: {style: 'outline'}, axis: {minimumTickSpacing: 48, timeTickSpacing: 160}}}
      rangeShortcuts={[]} features={{header: false, commands: false, drawingRail: false, dataTable: false}}/>
    {interactive ? <div className="flex flex-wrap gap-2 p-2"><button onClick={() => api.current?.setCrosshairPosition(readabilityBars[75].time, readabilityBars[75].close)}>Inspect sample 75</button><button onClick={() => api.current?.clearCrosshairPosition()}>Follow latest</button><button onClick={() => setRevision(value => value + 1)}>Update supplied bar</button><button onClick={() => setSnapshot(api.current?.getSnapshot() ?? null)}>Read public snapshot</button><output aria-label="Public chart snapshot" className="w-full break-all text-xs">{JSON.stringify(snapshot)}</output></div> : null}
  </div>;
}
export const Dark: Story = {render: () => <Readability/>};
export const Light: Story = {render: () => <Readability theme="light"/>};
export const Narrow390: Story = {render: () => <Readability width={390} height={820}/>};
export const Narrow320: Story = {render: () => <Readability width={320} height={716}/>};
export const StrongAdx: Story = {render: () => <Readability variant="strong" interactive/>};
export const SubReference: Story = {render: () => <Readability variant="sub25" interactive/>};
export const ZeroConstant: Story = {render: () => <Readability variant="constant"/>};
export const Warmup: Story = {render: () => <Readability variant="warmup"/>};
export const Unavailable: Story = {render: () => <Readability variant="unavailable"/>};
export const FourCharts: Story = {render: () => <div className="grid grid-cols-1 gap-1 min-[700px]:grid-cols-2">{[0,1,2,3].map(i => <Readability key={i} theme={i % 2 ? 'light' : 'dark'} height={434}/>)}</div>};
export const AllOutputs: Story = {render: () => <Readability allOutputs height={1080}/>};
export const LongLabels: Story = {render: () => <Readability width={390} longLabels/>};
export const CustomTheme: Story = {render: () => <Readability custom/>};
export const Empty: Story = {render: () => <Readability empty/>};
export const ShortPane: Story = {render: () => <Readability height={330}/>};
export const CurrentBarRevision: Story = {render: () => <Readability interactive/>};
