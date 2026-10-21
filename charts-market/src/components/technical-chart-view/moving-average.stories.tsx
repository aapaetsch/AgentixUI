import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {TechnicalChartView, type TechnicalChartTheme} from '.';
import {marketDataCalculationIdentity, type MarketChartSnapshot} from '../../core';
import type {MarketChartHandle} from '../market-chart';
import {movingAverageBars, movingAverageDefinitions, movingAverageResults, movingAverageState, type MovingAverageFixture} from './moving-average-fixtures';

export default {title: 'Market Charts/Moving Average Axis Boxes', component: TechnicalChartView, parameters: {layout: 'fullscreen', controls: {disable: true}}} satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
function MovingAverages({variant = 'normal', theme = 'dark', width, height = 760, log = false, legacy = false, customTheme = false}: {variant?: MovingAverageFixture; theme?: TechnicalChartTheme; width?: number; height?: number; log?: boolean; legacy?: boolean; customTheme?: boolean}) {
  const [state, setState] = React.useState(() => {const value = movingAverageState(variant); if (log) value.scale.mode = 'logarithmic'; if (height < 300) value.panes[0].minimumSize = 64; return value;});
  const [revision, setRevision] = React.useState(0), [snapshot, setSnapshot] = React.useState<MarketChartSnapshot | null>(null);
  const api = React.useRef<MarketChartHandle>(null);
  const identity = marketDataCalculationIdentity('synthetic-ma', revision, 'synthetic-ma-bars');
  const results = React.useMemo(() => movingAverageResults(state, variant, identity, revision), [state, variant, identity, revision]);
  const data = React.useMemo(() => variant === 'empty' ? [] : movingAverageBars.map((bar, i) => i === 35 ? {...bar, close: bar.close + revision * .25, high: bar.high + revision * .25} : bar), [variant, revision]);
  return <div className="min-w-0 p-2" style={{width, maxWidth: '100%'}}>
    <TechnicalChartView chartApiRef={api} state={state} onStateChange={setState} data={data} symbol="SYNTHETIC" interval="1D"
      dataIdentity="synthetic-ma-bars" dataRevision={{identity: 'synthetic-ma-bars', revision}} calculationMode="supplied" calculationIdentity="synthetic-ma" suppliedResults={results} availableIndicators={movingAverageDefinitions}
      theme={theme} style={customTheme ? {'--background': '232 30% 10%', '--foreground': '45 40% 94%', '--border': '232 25% 30%'} as React.CSSProperties : undefined}
      appearance={{height, heightMode: 'available', minimumPlotHeight: height < 300 ? 90 : 260, legends: 'compact', suppliedStatus: 'compact', navigation: 'integrated',
        badges: {style: 'outline', movingAverages: legacy ? undefined : 'all-visible'}, candles: {widthMode: 'adaptive', gap: 2}, volume: {widthMode: 'adaptive', gap: 2}}}
      rangeShortcuts={[]} features={{header: false, commands: false, drawingRail: false, dataTable: false}}/>
    <div className="flex flex-wrap gap-2 p-2 text-xs">
      <button className="border px-2 py-1" onClick={() => api.current?.setVisibleRange({from: movingAverageBars[2].time, to: movingAverageBars[11].time})}>Historical window</button>
      <button className="border px-2 py-1" onClick={() => api.current?.fitContent()}>Fit</button>
      <button className="border px-2 py-1" onClick={() => api.current?.setCrosshairPosition(movingAverageBars[5].time, 100)}>Inspect earlier bar</button>
      <button className="border px-2 py-1" onClick={() => api.current?.clearCrosshairPosition()}>Clear inspection</button>
      <button className="border px-2 py-1" onClick={() => setRevision(value => value + 1)}>Revise supplied current bar</button>
      <button className="border px-2 py-1" onClick={() => setSnapshot(api.current?.getSnapshot() ?? null)}>Read public snapshot</button>
      <output aria-label="Moving-average public snapshot" className="w-full break-all">{snapshot ? JSON.stringify(snapshot) : ''}</output>
    </div>
  </div>;
}
export const Dark: Story = {render: () => <MovingAverages/>};
export const Light: Story = {render: () => <MovingAverages theme="light"/>};
export const Narrow390: Story = {render: () => <MovingAverages width={390} height={748}/>};
export const Narrow320: Story = {render: () => <MovingAverages width={320} height={660}/>};
export const EqualValues: Story = {render: () => <MovingAverages variant="equal"/>};
export const Logarithmic: Story = {render: () => <MovingAverages log/>};
export const OffScale: Story = {render: () => <MovingAverages variant="offscale"/>};
export const LogInvalid: Story = {render: () => <MovingAverages variant="log-invalid"/>};
export const SparseFinal: Story = {render: () => <MovingAverages variant="sparse"/>};
export const NullFinal: Story = {render: () => <MovingAverages variant="null"/>};
export const Warmup: Story = {render: () => <MovingAverages variant="warmup"/>};
export const Unavailable: Story = {render: () => <MovingAverages variant="unavailable"/>};
export const Duplicates: Story = {render: () => <MovingAverages variant="duplicates"/>};
export const ManyInstances: Story = {render: () => <MovingAverages variant="many"/>};
export const TinyPane: Story = {render: () => <MovingAverages variant="duplicates" height={230}/>};
export const CustomDefinition: Story = {render: () => <MovingAverages variant="custom"/>};
export const CustomTheme: Story = {render: () => <MovingAverages customTheme/>};
export const Empty: Story = {render: () => <MovingAverages variant="empty"/>};
export const LegacyDefault: Story = {render: () => <MovingAverages legacy/>};
