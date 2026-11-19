import * as React from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {TechnicalChartView, type TechnicalChartTheme} from '.';
import {createTechnicalChartViewState, type MarketChartType, type OhlcBar} from '../../core';

export default {title: 'Market Charts/Price series thickness', component: TechnicalChartView, parameters: {layout: 'fullscreen', controls: {disable: true}}} satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
const start = 1790985600;
// Synthetic host-authored observations; the chart only renders these supplied coordinates.
const bars: OhlcBar[] = Array.from({length: 256}, (_, i) => ({time: start + i * 60, open: 100 + Math.sin(i / 5), close: 100.3 + Math.sin(i / 5), high: 101 + Math.sin(i / 5), low: 99 + Math.sin(i / 5)}));
function Fixture({type, thick, theme, data, gaps}: {type: MarketChartType; thick: boolean; theme: TechnicalChartTheme; data: OhlcBar[]; gaps?: boolean}) {
  const [state, setState] = React.useState(() => {
    const value = createTechnicalChartViewState('price-only'); value.chartType = type;
    value.panes = [{id: 'price', order: 0, size: 1, minimumSize: 160, studyIds: [], showVolume: false}];
    value.viewport = {visibleRange: {from: data[0].time, to: data.at(-1)!.time}, rightOffsetBars: 0};
    return value;
  });
  return <section className="min-w-0 space-y-1" aria-label={`${type} ${thick ? 'thick' : 'thin'}`}>
    <h2 className="text-sm font-medium">{type} · {thick ? 'Thick · 3px' : 'Thin · 1px'}</h2>
    <TechnicalChartView symbol="SYNTHETIC" interval="1m" data={data} state={state} onStateChange={setState}
      calculationMode="supplied" calculationIdentity="synthetic-price-widths" theme={theme}
      timeAxis={{mode: 'calendar', times: bars.map(bar => bar.time)}}
      discontinuities={gaps ? [{from: bars[2].time, to: bars[6].time}, {from: bars[6].time, to: bars[9].time}] : undefined}
      appearance={{height: 260, line: {width: thick ? 3 : 1}, candles: {widthMode: 'adaptive', gap: thick ? 1 : 6, wickWidth: thick ? 3 : 1}, suppliedStatus: 'compact', legends: 'compact'}}
      features={{header: false, commands: false, drawingRail: false, footer: false}} rangeShortcuts={[]}/>
  </section>;
}
function Comparison({theme = 'dark', narrow = false, dense = false, single = false, gaps = false}: {theme?: TechnicalChartTheme; narrow?: boolean; dense?: boolean; single?: boolean; gaps?: boolean}) {
  const data = single ? bars.slice(0, 1) : dense ? bars : gaps ? [bars[0], bars[2], bars[6], bars[9], bars[12]] : bars.slice(0, 16);
  return <div className={`grid max-w-full grid-cols-1 gap-3 p-3 ${narrow ? '' : 'min-[700px]:grid-cols-2'}`} style={{width: narrow ? 390 : 1200}}>
    {(['line', 'candlestick', 'bar'] as const).flatMap(type => [false, true].map(thick => <Fixture key={`${type}-${thick}`} {...{type, thick, theme, data, gaps}}/>))}
  </div>;
}
export const Dark: Story = {render: () => <Comparison/>};
export const Light: Story = {render: () => <Comparison theme="light"/>};
export const Midnight: Story = {render: () => <Comparison theme="midnight"/>};
export const Narrow390: Story = {render: () => <Comparison narrow/>};
export const Dense: Story = {render: () => <Comparison dense/>};
export const DenseNarrow: Story = {render: () => <Comparison dense narrow/>};
export const SinglePoints: Story = {render: () => <Comparison single/>};
export const SuppliedGaps: Story = {render: () => <Comparison gaps/>};
export const SuppliedGapsNarrow: Story = {render: () => <Comparison gaps narrow theme="light"/>};
