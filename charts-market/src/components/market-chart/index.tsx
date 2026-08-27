"use client";

import * as React from "react";
import { Button, cn } from "aapaetsch-ui-kit";

import type {
  CurrentBarSnapshot,
  ChartOverlayState,
  DrawingState,
  DrawingRendererDefinition,
  DrawingToolDefinition,
  IndicatorInstance,
  IndicatorDefinition,
  IndicatorRuntime,
  IndicatorRenderSeries,
  MarketChartEngine,
  MarketChartEngineFactory,
  MarketChartType,
  MarketChartSnapshot,
  MarketCrosshairSnapshot,
  MarketRenderLayer,
  MarketMarker,
  MarketSessionRange,
  MarketScaleMode,
  MarketTime,
  OhlcBar,
  VisibleRange,
} from "../../core";
import { marketTimeKey, reportMarketDataIssues } from "../../core";
import { MarketChartControls } from "../../controls";
import {
  builtInDrawingRenderers,
  builtInDrawingTools,
  createDrawingHistory,
  defaultDrawingInteraction,
  drawingDocumentsEqual,
  DrawingLayer,
  DrawingToolbar,
  reduceDrawingHistory,
  stripTransientDrawingState,
  type DrawingChangeMetadata,
  type DrawingInteractionConfig,
} from "../../drawings";
import { builtInIndicators } from "../../indicators";
import { createMarketChartEngine } from "../../engine";

export interface MarketChartHandle {
  appendOrUpdate(bar: OhlcBar): void;
  fitContent(): void;
  scrollToRealtime(): void;
  setVisibleRange(range: VisibleRange): void;
  setCrosshairPosition(time: MarketTime, price: number): void;
  clearCrosshairPosition(): void;
  getSnapshot(): MarketChartSnapshot | null;
}

export interface MarketChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: OhlcBar[];
  chartType?: MarketChartType;
  scaleMode?: MarketScaleMode;
  height?: number;
  symbol?: string;
  interval?: string;
  intervalOptions?: string[];
  showVolume?: boolean;
  showControls?: boolean;
  dataTable?: "none" | "toggle" | "always";
  loading?: boolean;
  error?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  markers?: MarketMarker[];
  availableIndicators?: IndicatorDefinition[];
  indicators?: IndicatorInstance[];
  onIndicatorsChange?: (indicators: IndicatorInstance[]) => void;
  paneSizes?: Record<string, number>;
  onPaneSizesChange?: (sizes: Record<string, number>) => void;
  renderLayers?: MarketRenderLayer[];
  drawings?: DrawingState[];
  drawingTools?: DrawingToolDefinition[];
  drawingRenderers?: DrawingRendererDefinition[];
  drawingInteraction?: Partial<DrawingInteractionConfig>;
  activeDrawingTool?: string;
  selectedDrawingIds?: string[];
  overlays?: ChartOverlayState[];
  extendedSessions?: MarketSessionRange[];
  locale?: string;
  timeZone?: string;
  onSymbolChange?: (symbol: string) => void;
  onIntervalChange?: (interval: string) => void;
  onChartTypeChange?: (chartType: MarketChartType) => void;
  onScaleModeChange?: (scaleMode: MarketScaleMode) => void;
  onVisibleRangeChange?: (range: VisibleRange | null) => void;
  onCurrentBarChange?: (snapshot: CurrentBarSnapshot | null) => void;
  onCrosshairChange?: (snapshot: MarketCrosshairSnapshot | null) => void;
  onDrawingsChange?: (drawings: DrawingState[], metadata?: DrawingChangeMetadata) => void;
  onSelectedDrawingIdsChange?: (drawingIds: string[]) => void;
  onActiveDrawingToolChange?: (toolId: string | undefined) => void;
  /** Primarily for adapter contract tests and alternative engines. */
  engineFactory?: MarketChartEngineFactory;
}

function cssToken(style: CSSStyleDeclaration, token: string, fallback: string): string {
  const value = style.getPropertyValue(token).trim();
  return value ? `hsl(${value})` : fallback;
}

function snapshotForBar(bar: OhlcBar): CurrentBarSnapshot {
  const change = bar.close - bar.open;
  return { bar, change, changePercent: bar.open === 0 ? 0 : (change / bar.open) * 100 };
}

function formatTime(time: MarketTime, locale?: string, timeZone?: string): string {
  const timestamp = marketTimeKey(time);
  if (!Number.isFinite(timestamp)) return String(time);
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: typeof time === "number" ? "short" : undefined, timeZone }).format(timestamp * 1000);
}

export const MarketChart = React.forwardRef<MarketChartHandle, MarketChartProps>(function MarketChart({
  data,
  chartType = "candlestick",
  scaleMode = "normal",
  height = 480,
  symbol,
  interval,
  intervalOptions,
  showVolume = true,
  showControls = true,
  dataTable = "toggle",
  loading = false,
  error,
  emptyMessage = "No market data is available for this range.",
  markers = [],
  availableIndicators = builtInIndicators,
  indicators = [],
  onIndicatorsChange,
  paneSizes,
  onPaneSizesChange,
  renderLayers = [],
  drawings = [],
  drawingTools = builtInDrawingTools,
  drawingRenderers = builtInDrawingRenderers,
  drawingInteraction,
  activeDrawingTool,
  selectedDrawingIds: controlledSelectedDrawingIds,
  overlays = [],
  extendedSessions = [],
  locale,
  timeZone,
  onSymbolChange,
  onIntervalChange,
  onChartTypeChange,
  onScaleModeChange,
  onVisibleRangeChange,
  onCurrentBarChange,
  onCrosshairChange,
  onDrawingsChange,
  onSelectedDrawingIdsChange,
  onActiveDrawingToolChange,
  engineFactory = createMarketChartEngine,
  className,
  ...props
}, forwardedRef) {
  const chartHostRef = React.useRef<HTMLDivElement>(null);
  const chartSurfaceRef = React.useRef<HTMLDivElement>(null);
  const indicatorSelectId = React.useId();
  const engineRef = React.useRef<MarketChartEngine | null>(null);
  const dataRef = React.useRef(data);
  const visibleRangeCallbackRef = React.useRef(onVisibleRangeChange);
  const currentBarCallbackRef = React.useRef(onCurrentBarChange);
  const crosshairCallbackRef = React.useRef(onCrosshairChange);
  const paneSizesCallbackRef = React.useRef(onPaneSizesChange);
  const heightRef = React.useRef(height);
  const [engineRevision, setEngineRevision] = React.useState(0);
  const [engineError, setEngineError] = React.useState<React.ReactNode>(null);
  const [tableOpen, setTableOpen] = React.useState(dataTable === "always");
  const [, setViewportRevision] = React.useState(0);
  const [currentBar, setCurrentBar] = React.useState<OhlcBar | null>(data.at(-1) ?? null);
  const [crosshairSnapshot, setCrosshairSnapshot] = React.useState<MarketCrosshairSnapshot | null>(null);
  const [internalSelectedDrawingIds, setInternalSelectedDrawingIds] = React.useState<string[]>(() => drawings.filter((drawing) => drawing.selected).map((drawing) => drawing.id));
  const [drawingStylePreview, setDrawingStylePreview] = React.useState<Record<string, string | number> | null>(null);
  const [, setDrawingHistoryRevision] = React.useState(0);
  const issues = React.useMemo(() => reportMarketDataIssues(data), [data]);
  const renderData = React.useMemo(() => issues.length ? [] : data, [data, issues.length]);
  const engineOptionsRef = React.useRef({ chartType, renderData, height, showVolume, scaleMode, markers, extendedSessions, locale, timeZone, paneSizes, renderLayers });
  const historyLimit = drawingInteraction?.historyLimit ?? defaultDrawingInteraction.historyLimit;
  const drawingHistoryRef = React.useRef(createDrawingHistory(drawings, historyLimit));
  const indicatorRuntimeRef = React.useRef(new Map<string, IndicatorRuntime>());
  const indicatorsRef = React.useRef(indicators);
  const indicatorSeriesRef = React.useRef<IndicatorRenderSeries[]>([]);
  const indicatorSeries = React.useMemo<IndicatorRenderSeries[]>(() => indicators.filter((instance) => instance.visible).flatMap((instance) => {
    const runtime = instance.definition.createRuntime?.(instance.parameters);
    const calculated = runtime ? runtime.reset(renderData) : instance.definition.calculate(renderData, instance.parameters);
    if (runtime) indicatorRuntimeRef.current.set(instance.id, runtime); else indicatorRuntimeRef.current.delete(instance.id);
    return instance.definition.lines.map((line) => ({
      id: `${instance.id}:${line.id}`,
      paneId: instance.id,
      placement: instance.definition.placement,
      style: line.style ?? "line",
      color: instance.colors?.[line.id] ?? line.color ?? "#64748b",
      fixedDomain: instance.definition.fixedDomain,
      referenceLines: instance.definition.referenceLines,
      formatValue: instance.definition.formatValue,
      points: calculated.map((item) => ({ time: item.time, value: item.values[line.id] ?? null })),
    }));
  }), [indicators, renderData]);

  dataRef.current = data;
  visibleRangeCallbackRef.current = onVisibleRangeChange;
  currentBarCallbackRef.current = onCurrentBarChange;
  crosshairCallbackRef.current = onCrosshairChange;
  paneSizesCallbackRef.current = onPaneSizesChange;
  heightRef.current = height;
  indicatorsRef.current = indicators;
  indicatorSeriesRef.current = indicatorSeries;
  engineOptionsRef.current = { chartType, renderData, height, showVolume, scaleMode, markers, extendedSessions, locale, timeZone, paneSizes, renderLayers };

  React.useEffect(() => {
    const history = drawingHistoryRef.current;
    if (history.limit !== historyLimit) {
      const nextLimit = Math.max(0, Math.floor(historyLimit));
      drawingHistoryRef.current = { ...history, limit: nextLimit, past: nextLimit === 0 ? [] : history.past.slice(-nextLimit) };
      setDrawingHistoryRevision((value) => value + 1);
    }
    if (!drawingDocumentsEqual(drawingHistoryRef.current.present, drawings)) {
      drawingHistoryRef.current = reduceDrawingHistory(drawingHistoryRef.current, { type: "rebase", drawings });
      setDrawingHistoryRevision((value) => value + 1);
    }
  }, [drawings, historyLimit]);

  React.useEffect(() => {
    setCurrentBar(data.at(-1) ?? null);
  }, [data]);

  React.useEffect(() => {
    const host = chartHostRef.current;
    if (!host || loading || error) return;
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    const style = getComputedStyle(host);
    const initial = engineOptionsRef.current;
    const theme = {
      background: cssToken(style, "--background", "#ffffff"),
      text: cssToken(style, "--muted-foreground", "#64748b"),
      border: cssToken(style, "--border", "#e2e8f0"),
      grid: cssToken(style, "--border", "#e2e8f0"),
      positive: cssToken(style, "--positive", "#10b981"),
      negative: cssToken(style, "--negative", "#e11d48"),
      primary: cssToken(style, "--primary", "#0f172a"),
    };

    Promise.resolve(engineFactory(host, {
      chartType: initial.chartType, data: initial.renderData, height: initial.height, showVolume: initial.showVolume,
      scaleMode: initial.scaleMode, markers: initial.markers, locale: initial.locale, timeZone: initial.timeZone, theme,
      paneSizes: initial.paneSizes, renderLayers: initial.renderLayers,
      extendedSessions: initial.extendedSessions,
      onVisibleRangeChange: (range) => { setViewportRevision((value) => value + 1); visibleRangeCallbackRef.current?.(range); },
      onCrosshairMove: (time) => {
        const bar = time == null ? dataRef.current.at(-1) ?? null : dataRef.current.find((item) => marketTimeKey(item.time) === marketTimeKey(time)) ?? null;
        setCurrentBar(bar);
        currentBarCallbackRef.current?.(bar ? snapshotForBar(bar) : null);
      },
      onCrosshairChange: (snapshot) => { setCrosshairSnapshot(snapshot); crosshairCallbackRef.current?.(snapshot); },
      onPaneSizesChange: (sizes) => paneSizesCallbackRef.current?.(sizes),
      onError: (message) => setEngineError(message),
    })).then((engine) => {
      if (cancelled) { engine.destroy(); return; }
      engineRef.current = engine;
      setEngineError(null);
      setEngineRevision((value) => value + 1);
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(([entry]) => engine.resize(entry.contentRect.width, heightRef.current));
        resizeObserver.observe(host);
      } else {
        engine.resize(host.clientWidth, heightRef.current);
      }
    }).catch((reason: unknown) => {
      if (!cancelled) setEngineError(reason instanceof Error ? reason.message : "The chart engine could not be initialized.");
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
    // The adapter is created once per host/factory; controlled values are reconciled below.
  }, [engineFactory, error, loading]);

  React.useEffect(() => { engineRef.current?.setData(renderData); }, [renderData, engineRevision]);
  React.useEffect(() => { engineRef.current?.setChartType(chartType); }, [chartType, engineRevision]);
  React.useEffect(() => { engineRef.current?.setScaleMode(scaleMode); }, [scaleMode, engineRevision]);
  React.useEffect(() => { engineRef.current?.setVolumeVisible(showVolume); }, [showVolume, engineRevision]);
  React.useEffect(() => { engineRef.current?.setMarkers(markers); }, [markers, engineRevision]);
  React.useEffect(() => { engineRef.current?.setExtendedSessions(extendedSessions); }, [extendedSessions, engineRevision]);
  React.useEffect(() => { engineRef.current?.setIndicatorSeries(indicatorSeries); }, [indicatorSeries, engineRevision]);
  React.useEffect(() => { engineRef.current?.setOverlays(overlays); }, [overlays, engineRevision]);
  React.useEffect(() => { engineRef.current?.setRenderLayers(renderLayers); }, [renderLayers, engineRevision]);
  React.useEffect(() => { if (paneSizes) engineRef.current?.setPaneSizes(paneSizes); }, [paneSizes, engineRevision]);
  React.useEffect(() => { engineRef.current?.resize(chartHostRef.current?.clientWidth ?? 1, height); }, [height, engineRevision]);

  React.useImperativeHandle(forwardedRef, () => ({
    appendOrUpdate(bar) {
      engineRef.current?.appendOrUpdate(bar);
      const nextSeries = indicatorSeriesRef.current.map((series) => ({ ...series, points: series.points.slice() }));
      indicatorsRef.current.filter((instance) => instance.visible).forEach((instance) => {
        const point = indicatorRuntimeRef.current.get(instance.id)?.appendOrUpdate(bar); if (!point) return;
        instance.definition.lines.forEach((line) => { const series = nextSeries.find((item) => item.id === `${instance.id}:${line.id}`); if (!series) return; const nextPoint = { time: point.time, value: point.values[line.id] ?? null }; if (series.points.length && marketTimeKey(series.points.at(-1)!.time) === marketTimeKey(point.time)) series.points[series.points.length - 1] = nextPoint; else series.points.push(nextPoint); });
      });
      indicatorSeriesRef.current = nextSeries; engineRef.current?.setIndicatorSeries(nextSeries);
      setCurrentBar(bar);
      currentBarCallbackRef.current?.(snapshotForBar(bar));
    },
    fitContent: () => engineRef.current?.fitContent(),
    scrollToRealtime: () => engineRef.current?.scrollToRealtime(),
    setVisibleRange: (range) => engineRef.current?.setVisibleRange(range),
    setCrosshairPosition: (time, price) => engineRef.current?.setCrosshairPosition(time, price),
    clearCrosshairPosition: () => engineRef.current?.clearCrosshairPosition(),
    getSnapshot: () => engineRef.current?.getSnapshot() ?? null,
  }), []);

  const visibleError = error ?? (issues.length ? issues[0].message : engineError);
  const snapshot = currentBar ? snapshotForBar(currentBar) : null;
  const numberFormatter = React.useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }), [locale]);
  const showTable = dataTable === "always" || (dataTable === "toggle" && tableOpen);
  const usesLegacySelection = controlledSelectedDrawingIds === undefined && onSelectedDrawingIdsChange === undefined;
  const effectiveSelectedDrawingIds = usesLegacySelection ? drawings.filter((drawing) => drawing.selected).map((drawing) => drawing.id) : controlledSelectedDrawingIds ?? internalSelectedDrawingIds;
  const selectedDrawingSet = new Set(effectiveSelectedDrawingIds);
  const displayedDrawings = drawingStylePreview ? drawings.map((drawing) => selectedDrawingSet.has(drawing.id) ? { ...drawing, parameters: { ...drawing.parameters, ...drawingStylePreview } } : drawing) : drawings;
  const selectedDrawings = drawings.filter((drawing) => selectedDrawingSet.has(drawing.id));
  const selectedDrawing = selectedDrawings[0];
  const selectedTool = drawingTools.find((tool) => tool.id === activeDrawingTool);
  const crosshairLegendSeries = crosshairSnapshot ? indicatorSeries.filter((series) => series.paneId === crosshairSnapshot.paneId || (crosshairSnapshot.paneId === "price" && series.placement === "overlay")) : [];
  const addIndicator = (definitionId: string) => {
    const definition = availableIndicators.find((item) => item.id === definitionId); if (!definition) return;
    const id = `${definition.id}-${Date.now()}`;
    onIndicatorsChange?.([...indicators, { id, definition, parameters: { ...definition.defaultParameters }, visible: true }]);
  };
  const withLegacySelection = (document: DrawingState[], ids = effectiveSelectedDrawingIds) => usesLegacySelection
    ? document.map((drawing) => ({ ...drawing, selected: ids.includes(drawing.id) || undefined }))
    : document;
  const changeSelection = (ids: string[]) => {
    if (usesLegacySelection) onDrawingsChange?.(withLegacySelection(drawingHistoryRef.current.present, ids), { type: "selection", drawingIds: ids });
    else {
      if (controlledSelectedDrawingIds === undefined) setInternalSelectedDrawingIds(ids);
      onSelectedDrawingIdsChange?.(ids);
    }
  };
  const commitDrawings = (next: DrawingState[], metadata: DrawingChangeMetadata = { type: "style", drawingIds: effectiveSelectedDrawingIds }) => {
    const history = reduceDrawingHistory(drawingHistoryRef.current, { type: "commit", drawings: stripTransientDrawingState(next), metadata });
    if (history === drawingHistoryRef.current) return;
    drawingHistoryRef.current = history;
    setDrawingHistoryRevision((value) => value + 1);
    onDrawingsChange?.(withLegacySelection(history.present), metadata);
  };
  const undoDrawings = () => {
    const history = reduceDrawingHistory(drawingHistoryRef.current, { type: "undo" }); if (history === drawingHistoryRef.current) return;
    drawingHistoryRef.current = history; setDrawingHistoryRevision((value) => value + 1);
    onDrawingsChange?.(withLegacySelection(history.present), { type: "undo", drawingIds: history.present.map((drawing) => drawing.id) });
  };
  const redoDrawings = () => {
    const history = reduceDrawingHistory(drawingHistoryRef.current, { type: "redo" }); if (history === drawingHistoryRef.current) return;
    drawingHistoryRef.current = history; setDrawingHistoryRevision((value) => value + 1);
    onDrawingsChange?.(withLegacySelection(history.present), { type: "redo", drawingIds: history.present.map((drawing) => drawing.id) });
  };

  return (
    <div className={cn("overflow-hidden rounded-[var(--radius)] border border-border bg-background text-foreground", className)} {...props}>
      {showControls ? (
        <MarketChartControls
          symbol={symbol} interval={interval} intervalOptions={intervalOptions} chartType={chartType} scaleMode={scaleMode}
          onSymbolChange={onSymbolChange} onIntervalChange={onIntervalChange} onChartTypeChange={onChartTypeChange}
          onScaleModeChange={onScaleModeChange} onFitContent={() => engineRef.current?.fitContent()}
          onScrollToRealtime={() => engineRef.current?.scrollToRealtime()}
        />
      ) : null}
      {onDrawingsChange ? <DrawingToolbar
        tools={drawingTools} activeToolId={activeDrawingTool} selectedDrawing={selectedDrawing} selectedDrawings={selectedDrawings}
        canUndo={drawingHistoryRef.current.past.length > 0} canRedo={drawingHistoryRef.current.future.length > 0}
        onActiveToolChange={onActiveDrawingToolChange} onUndo={undoDrawings} onRedo={redoDrawings}
        onStylePreview={setDrawingStylePreview}
        onStyleCommit={(changes) => { setDrawingStylePreview(null); commitDrawings(drawings.map((drawing) => selectedDrawingSet.has(drawing.id) ? { ...drawing, parameters: { ...drawing.parameters, ...changes } } : drawing), { type: "style", drawingIds: effectiveSelectedDrawingIds, transactionId: `style-${Date.now()}` }); }}
        onDelete={() => { commitDrawings(drawings.filter((drawing) => !selectedDrawingSet.has(drawing.id)), { type: "delete", drawingIds: effectiveSelectedDrawingIds }); changeSelection([]); }}
        onToggleVisibility={() => commitDrawings(drawings.map((drawing) => selectedDrawingSet.has(drawing.id) ? { ...drawing, visible: !drawing.visible } : drawing), { type: "visibility", drawingIds: effectiveSelectedDrawingIds })}
        onToggleLock={() => commitDrawings(drawings.map((drawing) => selectedDrawingSet.has(drawing.id) ? { ...drawing, locked: !drawing.locked } : drawing), { type: "lock", drawingIds: effectiveSelectedDrawingIds })}
      /> : null}
      {onIndicatorsChange ? <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-3 py-2 text-xs">
        <label className="font-medium" htmlFor={indicatorSelectId}>Indicators</label>
        <select id={indicatorSelectId} aria-label="Add indicator" className="h-8 rounded-[var(--radius)] border border-border bg-background px-2" defaultValue="" onChange={(event) => { addIndicator(event.target.value); event.target.value = ""; }}>
          <option value="">Add indicator…</option>{availableIndicators.map((definition) => <option key={definition.id} value={definition.id}>{definition.label}</option>)}
        </select>
        {indicators.map((instance) => <div key={instance.id} className="flex items-center gap-1 rounded-[var(--radius)] border border-border px-2 py-1">
          <button type="button" className="font-medium" aria-pressed={instance.visible} onClick={() => onIndicatorsChange(indicators.map((item) => item.id === instance.id ? { ...item, visible: !item.visible } : item))}>{instance.definition.label}</button>
          {Object.entries(instance.parameters).filter((entry): entry is [string, number] => typeof entry[1] === "number").map(([key, value]) => <label key={key} className="flex items-center gap-1 text-muted-foreground">{key}<input aria-label={`${instance.definition.label} ${key}`} className="h-7 w-16 rounded border border-border bg-background px-1 font-mono" type="number" value={value} onChange={(event) => onIndicatorsChange(indicators.map((item) => item.id === instance.id ? { ...item, parameters: { ...item.parameters, [key]: Number(event.target.value) } } : item))} /></label>)}
          {instance.definition.lines.map((line) => <input key={line.id} type="color" aria-label={`${instance.definition.label} ${line.label} color`} className="size-6" value={instance.colors?.[line.id] ?? (line.color?.startsWith("#") ? line.color : "#64748b")} onChange={(event) => onIndicatorsChange(indicators.map((item) => item.id === instance.id ? { ...item, colors: { ...item.colors, [line.id]: event.target.value } } : item))} />)}
          <button type="button" aria-label={`Remove ${instance.definition.label}`} className="px-1 text-muted-foreground hover:text-destructive" onClick={() => onIndicatorsChange(indicators.filter((item) => item.id !== instance.id))}>×</button>
        </div>)}
      </div> : null}
      {snapshot ? (
        <div role="status" aria-live="polite" className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-3 py-2 font-mono text-xs tabular-nums">
          <span className="font-sans font-semibold">{symbol ?? "Current bar"}</span>
          <span className="text-muted-foreground">O <b className="text-foreground">{numberFormatter.format(snapshot.bar.open)}</b></span>
          <span className="text-muted-foreground">H <b className="text-foreground">{numberFormatter.format(snapshot.bar.high)}</b></span>
          <span className="text-muted-foreground">L <b className="text-foreground">{numberFormatter.format(snapshot.bar.low)}</b></span>
          <span className="text-muted-foreground">C <b className="text-foreground">{numberFormatter.format(snapshot.bar.close)}</b></span>
          <span className={snapshot.change >= 0 ? "text-[hsl(var(--positive))]" : "text-[hsl(var(--negative))]"}>
            {snapshot.change >= 0 ? "+" : ""}{numberFormatter.format(snapshot.change)} ({snapshot.changePercent.toFixed(2)}%)
          </span>
        </div>
      ) : null}
      <div
        ref={chartSurfaceRef}
        className={cn("relative outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60", activeDrawingTool && "cursor-crosshair")}
        style={{ minHeight: height }}
        tabIndex={onDrawingsChange ? 0 : undefined}
        aria-label={onDrawingsChange ? "Interactive market chart" : undefined}
        onKeyDownCapture={(event) => {
          if (!(event.ctrlKey || event.metaKey)) return;
          if (event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redoDrawings() : undoDrawings(); }
          else if (event.key.toLowerCase() === "y") { event.preventDefault(); redoDrawings(); }
        }}
      >
        <div ref={chartHostRef} aria-hidden="true" style={{ height }} />
        {crosshairSnapshot && crosshairLegendSeries.length ? <div aria-label="Pane indicator legend" className="pointer-events-none absolute left-2 top-2 z-10 flex max-w-[calc(100%-5rem)] flex-wrap gap-x-4 rounded-[var(--radius)] border border-border/70 bg-background/85 px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground shadow-sm backdrop-blur-sm">
          {crosshairLegendSeries.map((series) => <span key={series.id} style={{ color: series.color }}>{series.id} {crosshairSnapshot.values[series.id] == null ? "—" : (series.formatValue?.(crosshairSnapshot.values[series.id]!) ?? numberFormatter.format(crosshairSnapshot.values[series.id]!))}</span>)}
        </div> : null}
        {engineRef.current && onDrawingsChange ? <DrawingLayer
          engine={engineRef.current}
          data={renderData}
          drawings={displayedDrawings}
          tools={drawingTools}
          renderers={drawingRenderers}
          activeTool={selectedTool}
          selectedDrawingIds={effectiveSelectedDrawingIds}
          interaction={drawingInteraction}
          interactionTargetRef={chartSurfaceRef}
          onDrawingsChange={commitDrawings}
          onSelectedDrawingIdsChange={changeSelection}
          onActiveToolComplete={() => onActiveDrawingToolChange?.(undefined)}
          aria-label="Chart drawings"
        /> : null}
        {loading ? <div role="status" className="absolute inset-0 grid place-items-center bg-background"><div className="h-24 w-[70%] animate-pulse rounded bg-muted" aria-label="Loading market chart" /></div> : null}
        {!loading && visibleError ? <div role="alert" className="absolute inset-0 grid place-items-center bg-background p-6 text-center text-sm text-destructive">{visibleError}</div> : null}
        {!loading && !visibleError && data.length === 0 ? <div className="absolute inset-0 grid place-items-center bg-background p-6 text-center text-sm text-muted-foreground">{emptyMessage}</div> : null}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-xs text-muted-foreground">
        {dataTable === "toggle" ? <Button type="button" colorStyle="text" size="xs" onClick={() => setTableOpen((value) => !value)}>{tableOpen ? "Hide data" : "View data"}</Button> : <span />}
      </div>
      {showTable ? (
        <div className="max-h-72 overflow-auto border-t border-border">
          <table className="w-full min-w-[40rem] text-left text-xs">
            <caption className="sr-only">Market price data</caption>
            <thead className="sticky top-0 bg-muted text-muted-foreground"><tr>
              {['Time', 'Open', 'High', 'Low', 'Close', 'Volume'].map((label) => <th key={label} scope="col" className="px-3 py-2 font-medium">{label}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">{data.map((bar) => <tr key={marketTimeKey(bar.time)}>
              <th scope="row" className="whitespace-nowrap px-3 py-2 font-medium">{formatTime(bar.time, locale, timeZone)}</th>
              {[bar.open, bar.high, bar.low, bar.close, bar.volume].map((value, index) => <td key={index} className="px-3 py-2 font-mono tabular-nums">{value == null ? "—" : numberFormatter.format(value)}</td>)}
            </tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
});

MarketChart.displayName = "MarketChart";
