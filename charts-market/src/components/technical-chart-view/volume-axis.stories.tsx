import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {TechnicalChartView, type TechnicalChartTheme} from '.';
import {createTechnicalChartViewState, type MarketChartEngine, type MarketChartSnapshot, type TechnicalChartViewState} from '../../core';
import {createMarketChartEngine} from '../../engine';

export default {title: 'Market Charts/Volume axis', component: TechnicalChartView, parameters: {layout: 'fullscreen', controls: {disable: true}}} satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
declare global {interface Window {marketVolumeAxis: {snapshot: () => MarketChartSnapshot | null}}}
const bars = Array.from({length: 32}, (_, i) => ({time: 1790985600 + i * 86400, open: 100, high: 106, low: 99, close: 102,
  volume: i % 2 ? 3_430_018.81 : 1_715_009.405}));
function VolumeAxis({theme = 'dark', width}: {theme?: TechnicalChartTheme; width?: number}) {
  const [state, setState] = React.useState<TechnicalChartViewState>(() => {
    const initial = createTechnicalChartViewState('price-only');
    return {...initial, panes: [...initial.panes, {id: 'volume', order: 1, size: 2, minimumSize: 96, studyIds: [], showVolume: true}],
      viewport: {visibleRange: {from: bars[0].time, to: bars.at(-1)!.time}, rightOffsetBars: 0}};
  });
  const engine = React.useRef<MarketChartEngine | null>(null);
  const factory = React.useCallback((host: HTMLElement, options: Parameters<typeof createMarketChartEngine>[1]) => {
    const current = createMarketChartEngine(host, options); engine.current = current; return current;
  }, []);
  React.useEffect(() => {window.marketVolumeAxis = {snapshot: () => engine.current?.getSnapshot() ?? null};}, []);
  return <div className="min-w-0 p-2" style={{width, maxWidth: '100%'}}>
    <TechnicalChartView symbol="SYNTHETIC" interval="1D" data={bars} state={state} onStateChange={setState}
      calculationMode="supplied" calculationIdentity="volume-axis-synthetic" engineFactory={factory} theme={theme}
      dataAvailability={{status: 'synthetic', description: 'Supplied volume counts; no acquired market data'}}
      appearance={{height: 540, heightMode: 'available', suppliedStatus: 'compact', legends: 'expanded'}}
      features={{header: false, commands: false, drawingRail: false, footer: false}}/>
  </div>;
}
export const VolumeCounts: Story = {render: () => <VolumeAxis/>};
export const VolumeCountsLight: Story = {render: () => <VolumeAxis theme="light"/>};
export const VolumeCounts320: Story = {render: () => <VolumeAxis width={320}/>};
