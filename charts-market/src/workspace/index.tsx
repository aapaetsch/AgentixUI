"use client";

import * as React from "react";
import { Button, cn } from "aapaetsch-ui-kit";

import { MarketChart, type MarketChartHandle, type MarketChartProps } from "../components/market-chart";

import type { MultiChartPreset } from "./state";

export interface MultiChartLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  preset: MultiChartPreset;
  charts: Array<{ id: string; content: React.ReactNode }>;
  activeChartId?: string;
  onActiveChartChange?: (chartId: string) => void;
  syncSymbol?: boolean;
  syncInterval?: boolean;
  syncVisibleRange?: boolean;
  syncCrosshair?: boolean;
}

const layoutClasses: Record<MultiChartPreset, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 lg:grid-cols-2",
  3: "grid-cols-1 lg:grid-cols-2 [&>*:first-child]:lg:row-span-2",
  4: "grid-cols-1 md:grid-cols-2",
  6: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  8: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

/** Controlled one-to-eight chart layout. Synchronization flags are exposed as state contracts. */
export function MultiChartLayout({
  preset,
  charts,
  activeChartId,
  onActiveChartChange,
  syncSymbol = false,
  syncInterval = false,
  syncVisibleRange = false,
  syncCrosshair = false,
  className,
  ...props
}: MultiChartLayoutProps) {
  return (
    <div
      className={cn("grid min-h-0 gap-px overflow-hidden bg-border", layoutClasses[preset], className)}
      data-sync-symbol={syncSymbol || undefined}
      data-sync-interval={syncInterval || undefined}
      data-sync-visible-range={syncVisibleRange || undefined}
      data-sync-crosshair={syncCrosshair || undefined}
      {...props}
    >
      {charts.slice(0, preset).map((chart) => (
        <section
          key={chart.id}
          aria-label={`Chart ${chart.id}`}
          data-active={chart.id === activeChartId || undefined}
          className="min-h-0 bg-background outline-none ring-inset focus-within:ring-2 focus-within:ring-ring data-[active]:ring-2 data-[active]:ring-primary"
          onPointerDown={() => onActiveChartChange?.(chart.id)}
        >
          {chart.content}
        </section>
      ))}
    </div>
  );
}

export interface SynchronizedMarketChartSpec { id: string; props: MarketChartProps }
export interface SynchronizedMarketChartsProps extends Omit<MultiChartLayoutProps, "charts"> {
  charts: SynchronizedMarketChartSpec[];
}

/** Ready-to-use multi-chart composition with independently synchronized symbol, interval, range and crosshair. */
export function SynchronizedMarketCharts({ charts, syncSymbol = false, syncInterval = false, syncVisibleRange = false, syncCrosshair = false, ...layoutProps }: SynchronizedMarketChartsProps) {
  const refs = React.useRef(new Map<string, MarketChartHandle>());
  const synchronizing = React.useRef(false);
  const [sharedSymbol, setSharedSymbol] = React.useState(charts[0]?.props.symbol);
  const [sharedInterval, setSharedInterval] = React.useState(charts[0]?.props.interval);
  const releaseLock = () => queueMicrotask(() => { synchronizing.current = false; });
  return <MultiChartLayout
    {...layoutProps}
    syncSymbol={syncSymbol} syncInterval={syncInterval} syncVisibleRange={syncVisibleRange} syncCrosshair={syncCrosshair}
    charts={charts.map((spec) => ({ id: spec.id, content: <MarketChart
      {...spec.props}
      ref={(handle) => { if (handle) refs.current.set(spec.id, handle); else refs.current.delete(spec.id); }}
      symbol={syncSymbol ? sharedSymbol : spec.props.symbol}
      interval={syncInterval ? sharedInterval : spec.props.interval}
      onSymbolChange={(symbol) => { if (syncSymbol) setSharedSymbol(symbol); spec.props.onSymbolChange?.(symbol); }}
      onIntervalChange={(interval) => { if (syncInterval) setSharedInterval(interval); spec.props.onIntervalChange?.(interval); }}
      onVisibleRangeChange={(range) => {
        spec.props.onVisibleRangeChange?.(range);
        if (!syncVisibleRange || !range || synchronizing.current) return;
        synchronizing.current = true; refs.current.forEach((handle, id) => { if (id !== spec.id) handle.setVisibleRange(range); }); releaseLock();
      }}
      onCurrentBarChange={(snapshot) => {
        spec.props.onCurrentBarChange?.(snapshot);
        if (!syncCrosshair || synchronizing.current) return;
        synchronizing.current = true; refs.current.forEach((handle, id) => { if (id !== spec.id) { if (snapshot) handle.setCrosshairPosition(snapshot.bar.time, snapshot.bar.close); else handle.clearCrosshairPosition(); } }); releaseLock();
      }}
    /> }))}
  />;
}

export interface WorkspaceLayoutOption { id: string; name: string }
export interface WorkspaceLayoutManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  layouts: WorkspaceLayoutOption[];
  value?: string;
  onValueChange?: (id: string) => void;
  onCreate?: () => void;
  onRename?: (layout: WorkspaceLayoutOption) => void;
  onDuplicate?: (layout: WorkspaceLayoutOption) => void;
  onDelete?: (layout: WorkspaceLayoutOption) => void;
}

export function WorkspaceLayoutManager({ layouts, value, onValueChange, onCreate, onRename, onDuplicate, onDelete, className, ...props }: WorkspaceLayoutManagerProps) {
  const selected = layouts.find((layout) => layout.id === value);
  return <div className={cn("flex flex-wrap items-center gap-1 border-b border-border p-2", className)} {...props}>
    <select aria-label="Workspace layout" className="h-10 min-w-44 rounded-[var(--radius)] border-2 border-border bg-background px-3 text-sm" value={value ?? ""} onChange={(event) => onValueChange?.(event.target.value)}><option value="" disabled>Load layout</option>{layouts.map((layout) => <option key={layout.id} value={layout.id}>{layout.name}</option>)}</select>
    <Button size="sm" colorStyle="outlined" onClick={onCreate}>Create</Button>
    {selected ? <><Button size="sm" colorStyle="ghost" onClick={() => onRename?.(selected)}>Rename</Button><Button size="sm" colorStyle="ghost" onClick={() => onDuplicate?.(selected)}>Duplicate</Button><Button size="sm" colorStyle="text" onClick={() => onDelete?.(selected)}>Delete</Button></> : null}
  </div>;
}

export interface TechnicalWorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
  watchlist?: React.ReactNode;
  details?: React.ReactNode;
  news?: React.ReactNode;
  lowerPanel?: React.ReactNode;
  lowerPanelOpen?: boolean;
  onLowerPanelOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/** Composable technical-trading shell. Consumers provide all data-backed panels. */
export function TechnicalWorkspace({ watchlist, details, news, lowerPanel, lowerPanelOpen = true, onLowerPanelOpenChange, children, className, ...props }: TechnicalWorkspaceProps) {
  return (
    <div className={cn("grid min-h-[36rem] grid-cols-1 overflow-hidden rounded-[var(--radius)] border border-border bg-background lg:grid-cols-[14rem_minmax(0,1fr)_18rem]", className)} {...props}>
      {watchlist ? <aside aria-label="Watchlist" className="min-h-0 border-b border-border lg:border-b-0 lg:border-r">{watchlist}</aside> : null}
      <main className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto]">
        {children}
        {lowerPanel ? <section aria-label="Lower panel" className="border-t border-border"><div className="flex justify-end border-b border-border p-1"><Button size="xs" colorStyle="ghost" aria-expanded={lowerPanelOpen} onClick={() => onLowerPanelOpenChange?.(!lowerPanelOpen)}>{lowerPanelOpen ? "Collapse" : "Expand"}</Button></div>{lowerPanelOpen ? lowerPanel : null}</section> : null}
      </main>
      {details || news ? <aside aria-label="Symbol details and news" className="min-h-0 divide-y divide-border border-t border-border lg:border-l lg:border-t-0">{details ? <section aria-label="Symbol details">{details}</section> : null}{news ? <section aria-label="News">{news}</section> : null}</aside> : null}
    </div>
  );
}

export {
  migrateWorkspaceState,
  parseWorkspaceState,
  serializeWorkspaceState,
} from "./state";
export type {
  AnyTechnicalWorkspaceState,
  IndicatorInstanceState,
  MultiChartPreset,
  TechnicalChartState,
  TechnicalWorkspaceState,
  TechnicalWorkspaceStateV1,
  TechnicalWorkspaceStateV2,
} from "./state";
