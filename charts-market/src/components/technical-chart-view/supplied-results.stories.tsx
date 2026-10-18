import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TechnicalChartView, type TechnicalChartTheme } from ".";
import { suppliedBars, suppliedFixtureResults, suppliedFixtureState } from "./supplied-fixtures";
import type { SuppliedResultMetadata, VisibleRange } from "../../core";

export default { title: "Market Charts/Supplied Results", component: TechnicalChartView, parameters: { layout: "fullscreen", controls: { disable: true } } } satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
function Demo({ theme = "light", status = "available", stale = false, narrow = false, compact = false, missingVolume = false, viewport, onRange }: { theme?: TechnicalChartTheme; status?: SuppliedResultMetadata["status"]; stale?: boolean; narrow?: boolean; compact?: boolean; missingVolume?: boolean; viewport?: VisibleRange; onRange?: (range: VisibleRange | null) => void }) {
  const [state, setState] = React.useState(() => suppliedFixtureState(compact));
  const controlledState = viewport ? { ...state, viewport: { ...state.viewport, logicalRange: undefined, visibleRange: viewport } } : state;
  return <div style={{ width: narrow ? "20rem" : "100%", minWidth: 0, padding: compact ? 0 : "0.5rem" }}>
    <TechnicalChartView symbol="MOCK" interval="1D" data={missingVolume ? suppliedBars.map(({ volume: _volume, ...bar }) => bar) : suppliedBars}
      state={controlledState} onStateChange={setState} calculationMode="supplied" calculationIdentity="mock-v1"
      suppliedResults={suppliedFixtureResults(controlledState, missingVolume ? "unavailable" : status, "mock-v1", stale)}
      theme={theme} appearance={{ height: compact ? 160 : 720 }} onVisibleRangeChange={onRange}
      features={compact ? { header: false, commands: false, drawingRail: false, footer: false, indicators: false, profiles: false } : undefined} />
  </div>;
}
export const Valid: Story = { render: () => <Demo /> };
export const Partial: Story = { render: () => <Demo status="partial" /> };
export const Loading: Story = { render: () => <Demo status="loading" /> };
export const Unavailable: Story = { render: () => <Demo status="unavailable" /> };
export const StaleResponse: Story = { render: () => <Demo stale /> };
export const MissingVolume: Story = { render: () => <Demo missingVolume /> };
export const Light: Story = { render: () => <Demo theme="light" /> };
export const Dark: Story = { render: () => <Demo theme="dark" /> };
export const Midnight: Story = { render: () => <Demo theme="midnight" /> };
export const Narrow: Story = { render: () => <Demo narrow /> };
export const ForcedColors: Story = { render: () => <Demo />, parameters: { docs: { description: { story: "Use forced-colors emulation in browser validation." } } } };
export const ReducedMotion: Story = { render: () => <div className="[&_*]:!animate-none [&_*]:!transition-none"><Demo /></div> };
export const Zoom200: Story = { render: () => <div style={{ zoom: 2 }}><Demo narrow /></div> };
export const FourIndependent: Story = { render: () => <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>{(["light", "dark", "midnight", "light"] as const).map((theme, index) => <Demo key={index} theme={theme} />)}</div> };
function Board() {
  const [range, setRange] = React.useState<VisibleRange>();
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>{[0, 1, 2, 3].map(index => <Demo key={index} compact theme="midnight" viewport={range} onRange={next => { if (next) setRange(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next); }} />)}</div>;
}
export const CompactLinkedBoard: Story = { render: () => <Board /> };
