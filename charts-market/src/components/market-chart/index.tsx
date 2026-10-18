"use client";

import * as React from "react";
import {useMarketDataRevision} from "./use-data-revision";
import type {MarketChartPresentation, MarketChartChangeMetadata, MarketDataRevision, MarketDataAcceptance} from "../../core";
import type {MarketDrawingCommand, MarketDrawingCommandRequest, MarketDrawingHistorySnapshot} from "../../drawings";
import type { CalculationMode, SuppliedCalculationResults } from "../../core";
import { Button, cn } from "aapaetsch-ui-kit";

import type {
  TechnicalPaneState, MarketViewportOptions, MarketScaleOptions,
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
import { marketTimeKey, reportMarketDataIssues, validateMarketTimeGeometry, type MarketTimeAxis, type MarketTimeGap } from "../../core";
import { MarketChartControls } from "../../controls";
import {
  builtInDrawingRenderers,
  builtInDrawingTools,
  createDrawingHistory,
  defaultDrawingInteraction,
  drawingDocumentsEqual,
  DrawingLayer,
  DrawingObjectTree,
  DrawingToolbar,
  applyDrawingDefaults,
  duplicateDrawings,
  groupDrawings,
  parseDrawingClipboard,
  reorderDrawing,
  serializeDrawingClipboard,
  setAllDrawingLock,
  setAllDrawingVisibility,
  ungroupDrawings,
  reduceDrawingHistory,
  stripTransientDrawingState,
  type DrawingChangeMetadata,
  type DrawingInteractionConfig,
  type DrawingPreferences,
} from "../../drawings";
import { builtInIndicators } from "../../indicators";
import { createMarketChartEngine } from "../../engine";

export interface MarketChartHandle {
  resetScale():void;
  executeDrawingCommand(command:MarketDrawingCommand):void;
  getDrawingHistory():MarketDrawingHistorySnapshot;
  appendOrUpdate(bar: OhlcBar): void;
  fitContent(metadata?:MarketChartChangeMetadata): void;
  scrollToRealtime(metadata?:MarketChartChangeMetadata): void;
  setVisibleRange(range: VisibleRange,metadata?:MarketChartChangeMetadata): void;
  setCrosshairPosition(time: MarketTime, price: number): void;
  clearCrosshairPosition(): void;
  getSnapshot(): MarketChartSnapshot | null;
  coordinateForTime(time: MarketTime): number | null;
}

export interface MarketChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: OhlcBar[];
  /** Revisioned full snapshots require an explicit current dataIdentity. */
  dataIdentity?:string;
  dataRevision?:MarketDataRevision;
  onDataAcceptance?:(receipt:MarketDataAcceptance)=>void;
  presentation?:MarketChartPresentation;
  drawingToolIds?:readonly string[];
  drawingCommand?:MarketDrawingCommandRequest;
  onDrawingHistoryChange?:(history:MarketDrawingHistorySnapshot)=>void;
  /** Runtime host-owned display geometry; not persisted by chart serializers. */
  timeAxis?: MarketTimeAxis;
  discontinuities?: readonly MarketTimeGap[];
  /** Supplied mode bypasses all indicator runtimes and derived drawing callbacks. */
  calculationMode?: CalculationMode;
  suppliedIndicatorSeries?: IndicatorRenderSeries[];
  /** Already key-matched results; TechnicalChartView performs request identity validation. */
  suppliedDrawingResults?: SuppliedCalculationResults;
  /** Re-read scoped CSS colors after the host changes its palette. */
  themeRevision?: string;
  /** Composed surfaces can supply controlled geometry while legacy props remain supported. */
  panes?: TechnicalPaneState[];
  viewport?: MarketViewportOptions;
  scale?: MarketScaleOptions;
  onViewportChange?: (viewport: MarketViewportOptions, metadata?:MarketChartChangeMetadata) => void;
  onScaleChange?: (scale: MarketScaleOptions, metadata?:MarketChartChangeMetadata) => void;
  showSummary?: boolean;
  showDrawingToolbar?: boolean;
  drawingToolbarOrientation?: 'horizontal' | 'vertical';
  drawingToolbarClassName?: string;
  renderSurfaceOverlay?: (snapshot: MarketChartSnapshot | null, series: IndicatorRenderSeries[]) => React.ReactNode;
  chartDescription?: string;
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
  onPaneSizesChange?: (sizes: Record<string, number>, metadata?:MarketChartChangeMetadata) => void;
  renderLayers?: MarketRenderLayer[];
  drawings?: DrawingState[];
  drawingTools?: DrawingToolDefinition[];
  drawingRenderers?: DrawingRendererDefinition[];
  drawingInteraction?: Partial<DrawingInteractionConfig>;
  activeDrawingTool?: string;
  selectedDrawingIds?: string[];
  drawingPreferences?: Partial<DrawingPreferences>;
  showDrawingObjectTree?: boolean;
  overlays?: ChartOverlayState[];
  extendedSessions?: MarketSessionRange[];
  locale?: string;
  timeZone?: string;
  onSymbolChange?: (symbol: string) => void;
  onIntervalChange?: (interval: string) => void;
  onChartTypeChange?: (chartType: MarketChartType) => void;
  onScaleModeChange?: (scaleMode: MarketScaleMode) => void;
  onVisibleRangeChange?: (range: VisibleRange | null, metadata?:MarketChartChangeMetadata) => void;
  onCurrentBarChange?: (snapshot: CurrentBarSnapshot | null) => void;
  onCrosshairChange?: (snapshot: MarketCrosshairSnapshot | null) => void;
  onDrawingsChange?: (drawings: DrawingState[], metadata?: DrawingChangeMetadata) => void;
  onSelectedDrawingIdsChange?: (drawingIds: string[]) => void;
  onActiveDrawingToolChange?: (toolId: string | undefined) => void;
  onDrawingPreferencesChange?: (preferences: Partial<DrawingPreferences>) => void;
  onCreateDrawingAlert?: (drawingId: string) => void;
  /** Primarily for adapter contract tests and alternative engines. */
  engineFactory?: MarketChartEngineFactory;
}

function cssToken(style: CSSStyleDeclaration, token: string, fallback: string): string {
  const value = style.getPropertyValue(token).trim();
  return value ? `hsl(${value})` : fallback;
}

function readTheme(host:HTMLElement) {
  const style = getComputedStyle(host);
  const theme = {
    background: cssToken(style, "--background", "#ffffff"),
    text: cssToken(style, "--muted-foreground", "#64748b"),
    border: cssToken(style, "--border", "#e2e8f0"),
    grid: cssToken(style, "--border", "#e2e8f0"),
    positive: cssToken(style, "--positive", "#10b981"),
    negative: cssToken(style, "--negative", "#e11d48"),
    primary: cssToken(style, "--primary", "#0f172a"),
  };

  if (typeof matchMedia === 'function' && matchMedia('(forced-colors: active)').matches) Object.assign(theme, { background: 'Canvas', text: 'CanvasText', border: 'CanvasText', grid: 'GrayText', positive: 'CanvasText', negative: 'CanvasText', primary: 'LinkText' });
  return theme;
}

function snapshotForBar(bar: OhlcBar, calculationMode: CalculationMode = "internal"): CurrentBarSnapshot {
  if (calculationMode === "supplied") return { bar, change: NaN, changePercent: NaN };
  const change = bar.close - bar.open;
  return { bar, change, changePercent: bar.open === 0 ? 0 : (change / bar.open) * 100 };
}

function formatTime(time: MarketTime, locale?: string, timeZone?: string): string {
  const timestamp = marketTimeKey(time);
  if (!Number.isFinite(timestamp)) return String(time);
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: typeof time === "number" ? "short" : undefined, timeZone }).format(timestamp * 1000);
}

export const MarketChart = React.forwardRef<MarketChartHandle, MarketChartProps>(function MarketChart({
  data:incomingData, dataIdentity, dataRevision, onDataAcceptance, presentation, drawingToolIds, drawingCommand, onDrawingHistoryChange, timeAxis, discontinuities,
  calculationMode = "internal", suppliedIndicatorSeries = [], suppliedDrawingResults, themeRevision,
  panes, viewport, scale, onViewportChange, onScaleChange,
  showSummary = true, showDrawingToolbar = true, drawingToolbarOrientation = 'horizontal', drawingToolbarClassName, renderSurfaceOverlay, chartDescription,
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
  drawingTools:requestedDrawingTools = builtInDrawingTools,
  drawingRenderers = builtInDrawingRenderers,
  drawingInteraction,
  activeDrawingTool,
  selectedDrawingIds: controlledSelectedDrawingIds,
  drawingPreferences,
  showDrawingObjectTree = false,
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
  onDrawingPreferencesChange,
  onCreateDrawingAlert,
  engineFactory = createMarketChartEngine,
  className,
  ...props
}, forwardedRef) {
  const accepted=useMarketDataRevision(incomingData,dataIdentity,dataRevision,onDataAcceptance);
  const data=React.useMemo(()=>Array.from(accepted.data),[accepted.data]);
  const drawingTools=React.useMemo(()=>drawingToolIds?requestedDrawingTools.filter(tool=>drawingToolIds.includes(tool.id)):requestedDrawingTools,[requestedDrawingTools,drawingToolIds]);
  const commandRef=React.useRef<(command:MarketDrawingCommand)=>void>(()=>{});
  const historySnapshotRef=React.useRef<MarketDrawingHistorySnapshot>({canUndo:false,canRedo:false,selectedIds:[],drawingCount:0});
  const [cancelDrawingRevision,setCancelDrawingRevision]=React.useState(0);
  const retainedSnapshot=React.useRef<MarketChartSnapshot|null>(null);
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
  const [viewportRevision, setViewportRevision] = React.useState(0);
  const [currentBar, setCurrentBar] = React.useState<OhlcBar | null>(data.at(-1) ?? null);
  const [crosshairSnapshot, setCrosshairSnapshot] = React.useState<MarketCrosshairSnapshot | null>(null);
  const [internalSelectedDrawingIds, setInternalSelectedDrawingIds] = React.useState<string[]>(() => drawings.filter((drawing) => drawing.selected).map((drawing) => drawing.id));
  const [drawingStylePreview, setDrawingStylePreview] = React.useState<Record<string, string | number> | null>(null);
  const [drawingHistoryRevision, setDrawingHistoryRevision] = React.useState(0);
  const [geometrySnapshot, setGeometrySnapshot] = React.useState<MarketChartSnapshot | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const geometryKeyRef = React.useRef('');
  const technicalCallbacks = React.useRef({ onViewportChange, onScaleChange }); technicalCallbacks.current = { onViewportChange, onScaleChange };
  const issues = React.useMemo(() => reportMarketDataIssues(data), [data]);
  const geometryErrors = React.useMemo(() => validateMarketTimeGeometry(timeAxis, discontinuities), [timeAxis, discontinuities]);
  const geometryValid = geometryErrors.length === 0;
  const renderData = React.useMemo(() => issues.length ? [] : data, [data, issues.length]);
  const engineOptionsRef = React.useRef({ presentation, timeAxis, discontinuities, chartType, renderData, height, showVolume, scaleMode, markers, extendedSessions, locale, timeZone, paneSizes, renderLayers, panes, viewport, scale });
  const historyLimit = drawingInteraction?.historyLimit ?? defaultDrawingInteraction.historyLimit;
  const drawingHistoryRef = React.useRef(createDrawingHistory(drawings, historyLimit));
  const indicatorRuntimeRef = React.useRef(new Map<string, IndicatorRuntime>());
  const indicatorsRef = React.useRef(indicators);
  const indicatorSeriesRef = React.useRef<IndicatorRenderSeries[]>([]);
  const calculatedSeries = React.useMemo<IndicatorRenderSeries[]>(() => {
    if (calculationMode === "supplied") { indicatorRuntimeRef.current.clear(); return suppliedIndicatorSeries; }
    return indicators.filter((instance) => instance.visible).flatMap((instance) => {
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
  }); }, [indicators, renderData, calculationMode, suppliedIndicatorSeries]);
  const indicatorSeries = React.useMemo<IndicatorRenderSeries[]>(() => panes ? calculatedSeries.map(series => { const pane = panes.find(p=>p.studyIds.includes(series.paneId)); return {...series,paneId:pane?.id ?? series.paneId,placement:pane?.id==='price'?'overlay':'pane'}; }) : calculatedSeries, [calculatedSeries, panes]);
  const barsByTime = React.useMemo(()=>new Map(data.map(bar=>[marketTimeKey(bar.time),bar])),[data]);
  const barsByTimeRef = React.useRef(barsByTime); barsByTimeRef.current=barsByTime;

  dataRef.current = data;
  visibleRangeCallbackRef.current = onVisibleRangeChange;
  currentBarCallbackRef.current = onCurrentBarChange;
  crosshairCallbackRef.current = onCrosshairChange;
  paneSizesCallbackRef.current = onPaneSizesChange;
  heightRef.current = height;
  indicatorsRef.current = indicators;
  indicatorSeriesRef.current = indicatorSeries;
  engineOptionsRef.current = { presentation, timeAxis, discontinuities, chartType, renderData, height, showVolume, scaleMode, markers, extendedSessions, locale, timeZone, paneSizes, renderLayers, panes, viewport, scale };

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
    if (!host) return;
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let restorationFrame:number|undefined;
    const initial = engineOptionsRef.current;
    const theme=readTheme(host);
    Promise.resolve().then(() => engineFactory(host, {
      presentation:initial.presentation,
      timeAxis: geometryValid ? initial.timeAxis : undefined, discontinuities: geometryValid ? initial.discontinuities : undefined,
      chartType: initial.chartType, data: initial.renderData, height: initial.height, showVolume: initial.showVolume,
      scaleMode: initial.scaleMode, markers: initial.markers, locale: initial.locale, timeZone: initial.timeZone, theme,
      paneSizes: initial.paneSizes, renderLayers: initial.renderLayers, panes: initial.panes, viewport: initial.viewport ?? retainedSnapshot.current?.viewport, scale: initial.scale ?? retainedSnapshot.current?.scale,
      extendedSessions: initial.extendedSessions,
      onVisibleRangeChange: (range,metadata) => { setViewportRevision((value) => value + 1); visibleRangeCallbackRef.current?.(range,metadata); },
      onCrosshairMove: (time) => {
        const bar = time == null ? engineOptionsRef.current.timeAxis && engineOptionsRef.current.timeAxis.mode !== "compressed" ? null : dataRef.current.at(-1) ?? null : barsByTimeRef.current.get(marketTimeKey(time)) ?? null;
        setCurrentBar(bar);
        currentBarCallbackRef.current?.(bar ? snapshotForBar(bar, calculationMode) : null);
      },
      onCrosshairChange: (snapshot) => { setCrosshairSnapshot(snapshot); crosshairCallbackRef.current?.(snapshot); },
      onPaneSizesChange: (sizes,metadata) => paneSizesCallbackRef.current?.(sizes,metadata),
      onViewportChange: (next,metadata) => technicalCallbacks.current.onViewportChange?.(next,metadata),
      onScaleChange: (next,metadata) => technicalCallbacks.current.onScaleChange?.(next,metadata),
      onSnapshotChange: snapshot => { const key = JSON.stringify([snapshot.panes, snapshot.scales, snapshot.visibleRange]); if (geometryKeyRef.current !== key) { geometryKeyRef.current = key; setGeometrySnapshot(snapshot); } },
      onKeyboardInspect: snapshot => setAnnouncement(formatTime(snapshot.time, initial.locale, initial.timeZone) + ', close ' + snapshot.bar.close),
      onError: (message) => setEngineError(message),
    })).then((engine) => {
      if (cancelled) { engine.destroy(); return; }
      engineRef.current = engine;
      setEngineError(null);
      setEngineRevision((value) => value + 1);
      const inspection=retainedSnapshot.current?.crosshair;
      if(inspection)restorationFrame=requestAnimationFrame(()=>{if(!cancelled)engine.setCrosshairPosition(inspection.time,inspection.bar.close);});
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
      if(restorationFrame!=null)cancelAnimationFrame(restorationFrame);
      if(engineRef.current)retainedSnapshot.current=engineRef.current.getSnapshot();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
    // The adapter is created once per host/factory; controlled values are reconciled below.
  }, [engineFactory, calculationMode]);

  React.useEffect(()=>{const host=chartHostRef.current;if(host){engineRef.current?.setTheme?.(readTheme(host));engineRef.current?.setIndicatorSeries(indicatorSeriesRef.current);}},[themeRevision,engineRevision]);
  React.useEffect(()=>{engineRef.current?.setPresentation?.(presentation??{});},[presentation,engineRevision]);
  React.useEffect(() => { if (geometryValid) { engineRef.current?.setTimeAxis?.(timeAxis); setViewportRevision(value => value + 1); } }, [timeAxis, geometryValid, engineRevision]);
  React.useEffect(() => { if (geometryValid) { engineRef.current?.setDiscontinuities?.(discontinuities ?? []); setViewportRevision(value => value + 1); } }, [discontinuities, geometryValid, engineRevision]);
  React.useEffect(() => { engineRef.current?.setData(renderData); }, [renderData, engineRevision]);
  React.useEffect(() => { if(panes) engineRef.current?.setPanes?.(panes); }, [panes, engineRevision]);
  React.useEffect(() => { if(viewport) engineRef.current?.setViewport?.(viewport); }, [viewport, engineRevision]);
  React.useEffect(() => { if(scale) engineRef.current?.setScale?.(scale); }, [scale, engineRevision]);
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
    executeDrawingCommand:command=>commandRef.current(command),
    getDrawingHistory:()=>historySnapshotRef.current,
    appendOrUpdate(bar) {
      barsByTimeRef.current.set(marketTimeKey(bar.time),bar);
      engineRef.current?.appendOrUpdate(bar);
      if(calculationMode==="supplied"){const inspected=engineRef.current?.getSnapshot().crosshair?.bar??bar;setCurrentBar(inspected);currentBarCallbackRef.current?.(snapshotForBar(inspected,calculationMode));return;}
      const nextSeries = indicatorSeriesRef.current.map((series) => ({ ...series, points: series.points.slice() }));
      if (calculationMode === "internal") indicatorsRef.current.filter((instance) => instance.visible).forEach((instance) => {
        const point = indicatorRuntimeRef.current.get(instance.id)?.appendOrUpdate(bar); if (!point) return;
        instance.definition.lines.forEach((line) => { const series = nextSeries.find((item) => item.id === `${instance.id}:${line.id}`); if (!series) return; const nextPoint = { time: point.time, value: point.values[line.id] ?? null }; if (series.points.length && marketTimeKey(series.points.at(-1)!.time) === marketTimeKey(point.time)) series.points[series.points.length - 1] = nextPoint; else series.points.push(nextPoint); });
      });
      indicatorSeriesRef.current = nextSeries; engineRef.current?.setIndicatorSeries(nextSeries);
      setCurrentBar(bar);
      currentBarCallbackRef.current?.(snapshotForBar(bar, calculationMode));
    },
    resetScale:()=>engineRef.current?.resetScale?.(),
    fitContent: metadata => engineRef.current?.fitContent(metadata),
    scrollToRealtime: metadata => engineRef.current?.scrollToRealtime(metadata),
    setVisibleRange: (range,metadata) => engineRef.current?.setVisibleRange(range,metadata),
    setCrosshairPosition: (time, price) => engineRef.current?.setCrosshairPosition(time, price),
    clearCrosshairPosition: () => engineRef.current?.clearCrosshairPosition(),
    getSnapshot: () => engineRef.current?.getSnapshot() ?? null,
    coordinateForTime: (time) => engineRef.current?.coordinateForTime?.(time) ?? null,
  }), [calculationMode]);

  const visibleError = error ?? geometryErrors[0] ?? (issues.length ? issues[0].message : engineError);
  const snapshot = currentBar ? snapshotForBar(currentBar, calculationMode) : null;
  const numberFormatter = React.useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }), [locale]);
  const showTable = dataTable === "always" || (dataTable === "toggle" && tableOpen);
  const usesLegacySelection = controlledSelectedDrawingIds === undefined && onSelectedDrawingIdsChange === undefined;
  const effectiveSelectedDrawingIds = usesLegacySelection ? drawings.filter((drawing) => drawing.selected).map((drawing) => drawing.id) : controlledSelectedDrawingIds ?? internalSelectedDrawingIds;
  const selectedDrawingSet = new Set(effectiveSelectedDrawingIds);
  const displayedDrawings = drawingStylePreview ? drawings.map((drawing) => selectedDrawingSet.has(drawing.id) ? { ...drawing, parameters: { ...drawing.parameters, ...drawingStylePreview } } : drawing) : drawings;
  const selectedDrawings = drawings.filter((drawing) => selectedDrawingSet.has(drawing.id));
  const selectedDrawing = selectedDrawings[0];
  const selectedToolDefinition = drawingTools.find((tool) => tool.id === activeDrawingTool);
  const selectedTool = selectedToolDefinition ? applyDrawingDefaults(selectedToolDefinition, drawingPreferences?.defaults?.[selectedToolDefinition.id]) : undefined;
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

  const historySnapshot:MarketDrawingHistorySnapshot={canUndo:drawingHistoryRef.current.past.length>0,canRedo:drawingHistoryRef.current.future.length>0,selectedIds:effectiveSelectedDrawingIds,drawingCount:drawingHistoryRef.current.present.length};
  historySnapshotRef.current=historySnapshot;
  const historyCallback=React.useRef(onDrawingHistoryChange);historyCallback.current=onDrawingHistoryChange;
  const historySignature=JSON.stringify(historySnapshot);
  React.useEffect(()=>{historyCallback.current?.(historySnapshotRef.current);},[historySignature,drawingHistoryRevision]);
  commandRef.current=command=>{
    if(!onDrawingsChange)return;
    if(command.type==="undo")undoDrawings();else if(command.type==="redo")redoDrawings();
    else if(command.type==="select")changeSelection(command.ids.filter(id=>drawings.some(d=>d.id===id)));
    else if(command.type==="cancel"){setCancelDrawingRevision(v=>v+1);setDrawingStylePreview(null);onActiveDrawingToolChange?.(undefined);changeSelection([]);}
    else if(command.type==="delete"){commitDrawings(drawings.filter(d=>!selectedDrawingSet.has(d.id)),{type:"delete",drawingIds:effectiveSelectedDrawingIds});changeSelection([]);}
    else if(command.type==="style")commitDrawings(drawings.map(d=>selectedDrawingSet.has(d.id)?{...d,parameters:{...d.parameters,...command.parameters}}:d),{type:"style",drawingIds:effectiveSelectedDrawingIds});
  };
  const processedCommand=React.useRef<string|number|undefined>(undefined);
  React.useEffect(()=>{if(drawingCommand&&processedCommand.current!==drawingCommand.id){processedCommand.current=drawingCommand.id;commandRef.current(drawingCommand.command);}},[drawingCommand]);
  React.useEffect(()=>{if(activeDrawingTool&&drawingToolIds&&!drawingToolIds.includes(activeDrawingTool))commandRef.current({type:"cancel"});},[activeDrawingTool,drawingToolIds]);
  return (
    <div className={cn("overflow-hidden rounded-[var(--radius)] border border-border bg-background text-foreground", className)} {...props}>
      {showControls ? (
        <MarketChartControls
          symbol={symbol} interval={interval} intervalOptions={intervalOptions} chartType={chartType} scaleMode={scaleMode}
          onSymbolChange={onSymbolChange} onIntervalChange={onIntervalChange} onChartTypeChange={onChartTypeChange}
          onScaleModeChange={onScaleModeChange} onFitContent={() => engineRef.current?.fitContent({source:"user",gesture:"reset"})}
          onScrollToRealtime={() => engineRef.current?.scrollToRealtime({source:"user",gesture:"reset"})}
        />
      ) : null}
      {onDrawingsChange && showDrawingToolbar ? <DrawingToolbar
        orientation={drawingToolbarOrientation} className={drawingToolbarClassName} style={drawingToolbarOrientation==="vertical"?{maxHeight:height,overflowY:"auto"}:undefined}
        tools={drawingTools} activeToolId={activeDrawingTool} selectedDrawing={selectedDrawing} selectedDrawings={selectedDrawings}
        canUndo={drawingHistoryRef.current.past.length > 0} canRedo={drawingHistoryRef.current.future.length > 0}
        onActiveToolChange={(toolId) => { onActiveDrawingToolChange?.(toolId); if (toolId) onDrawingPreferencesChange?.({ ...drawingPreferences, recentToolIds: [toolId, ...(drawingPreferences?.recentToolIds ?? []).filter((id) => id !== toolId)].slice(0, 8) }); }} onUndo={undoDrawings} onRedo={redoDrawings}
        favoriteToolIds={drawingPreferences?.favoriteToolIds} recentToolIds={drawingPreferences?.recentToolIds} keepDrawingMode={drawingPreferences?.keepDrawingMode ?? drawingInteraction?.keepDrawingMode}
        onToggleFavorite={(toolId) => { const favorites = drawingPreferences?.favoriteToolIds ?? []; onDrawingPreferencesChange?.({ ...drawingPreferences, favoriteToolIds: favorites.includes(toolId) ? favorites.filter((id) => id !== toolId) : [...favorites, toolId] }); }}
        onKeepDrawingModeChange={(enabled) => onDrawingPreferencesChange?.({ ...drawingPreferences, keepDrawingMode: enabled })}
        onLockAll={() => commitDrawings(setAllDrawingLock(drawings, true), { type: "lock", drawingIds: drawings.map((drawing) => drawing.id) })}
        onHideAll={() => { commitDrawings(setAllDrawingVisibility(drawings, false), { type: "visibility", drawingIds: drawings.map((drawing) => drawing.id) }); changeSelection([]); }}
        onRemoveAll={() => { commitDrawings([], { type: "clear", drawingIds: drawings.map((drawing) => drawing.id) }); changeSelection([]); }}
        onCreateAlert={onCreateDrawingAlert && selectedDrawing && (["lines", "channels", "volume"].includes(drawingTools.find((tool) => tool.id === selectedDrawing.type)?.category ?? "") || selectedDrawing.type === "rectangle") ? () => onCreateDrawingAlert?.(selectedDrawing.id) : undefined}
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
      {snapshot && showSummary ? (
        <div role="status" aria-live="off" className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-3 py-2 font-mono text-xs tabular-nums">
          <span className="font-sans font-semibold">{symbol ?? "Current bar"}</span>
          <span className="text-muted-foreground">O <b className="text-foreground">{numberFormatter.format(snapshot.bar.open)}</b></span>
          <span className="text-muted-foreground">H <b className="text-foreground">{numberFormatter.format(snapshot.bar.high)}</b></span>
          <span className="text-muted-foreground">L <b className="text-foreground">{numberFormatter.format(snapshot.bar.low)}</b></span>
          <span className="text-muted-foreground">C <b className="text-foreground">{numberFormatter.format(snapshot.bar.close)}</b></span>
          <span className={snapshot.change >= 0 ? "text-[hsl(var(--positive))]" : "text-[hsl(var(--negative))]"}>
            {calculationMode === "supplied" ? "Change unavailable (supplied mode)" : <>{snapshot.change >= 0 ? "+" : ""}{numberFormatter.format(snapshot.change)} ({snapshot.changePercent.toFixed(2)}%)</>}
          </span>
        </div>
      ) : null}
      <div className={cn(showDrawingObjectTree && "flex min-w-0")}><div
        ref={chartSurfaceRef}
        className={cn("relative min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60", activeDrawingTool && "cursor-crosshair")}
        style={{ minHeight: height }}
        tabIndex={onDrawingsChange ? 0 : undefined}
        aria-label={chartDescription ?? (onDrawingsChange ? "Interactive market chart" : undefined)}
        onKeyDownCapture={(event) => {
          if((event.target as HTMLElement).closest?.("input,textarea,select,[contenteditable=true]"))return;
          if (!(event.ctrlKey || event.metaKey)) return;
          if (event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redoDrawings() : undoDrawings(); }
          else if (event.key.toLowerCase() === "y") { event.preventDefault(); redoDrawings(); }
          else if (event.key.toLowerCase() === "c" && effectiveSelectedDrawingIds.length && navigator.clipboard) { event.preventDefault(); void navigator.clipboard.writeText(serializeDrawingClipboard(drawings.filter((drawing) => selectedDrawingSet.has(drawing.id)))); }
          else if (event.key.toLowerCase() === "v" && navigator.clipboard) { event.preventDefault(); void navigator.clipboard.readText().then((text) => { const pasted = parseDrawingClipboard(text).map((drawing, index) => ({ ...drawing, id: `pasted-${Date.now()}-${index}`, name: drawing.name ? `${drawing.name} copy` : undefined })); commitDrawings([...drawings, ...pasted], { type: "clipboard", drawingIds: pasted.map((drawing) => drawing.id) }); changeSelection(pasted.map((drawing) => drawing.id)); }).catch(() => undefined); }
        }}
      >
        <div ref={chartHostRef} style={{ height }} />
        <span className="sr-only" aria-live="polite">{announcement}</span>
        {renderSurfaceOverlay?.(geometrySnapshot ? { ...geometrySnapshot, crosshair: crosshairSnapshot } : null, indicatorSeries)}
        {!renderSurfaceOverlay && crosshairSnapshot && crosshairLegendSeries.length ? <div aria-label="Pane indicator legend" className="pointer-events-none absolute left-2 top-2 z-10 flex max-w-[calc(100%-5rem)] flex-wrap gap-x-4 rounded-[var(--radius)] border border-border/70 bg-background/85 px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground shadow-sm backdrop-blur-sm">
          {crosshairLegendSeries.map((series) => <span key={series.id} style={{ color: series.color }}>{series.id} {crosshairSnapshot.values[series.id] == null ? "—" : (series.formatValue?.(crosshairSnapshot.values[series.id]!) ?? numberFormatter.format(crosshairSnapshot.values[series.id]!))}</span>)}
        </div> : null}
        {engineRef.current && onDrawingsChange ? <DrawingLayer
          cancelRevision={cancelDrawingRevision}
          discontinuities={discontinuities}
          calculationMode={calculationMode}
          suppliedResults={suppliedDrawingResults}
          engine={engineRef.current}
          coordinateRevision={`${viewportRevision}:${geometryKeyRef.current}`} clipToPricePane={Boolean(panes)}
          data={renderData}
          drawings={displayedDrawings}
          tools={drawingTools}
          renderers={drawingRenderers}
          activeTool={selectedTool}
          selectedDrawingIds={effectiveSelectedDrawingIds}
          interaction={{ ...drawingInteraction, keepDrawingMode: drawingPreferences?.keepDrawingMode ?? drawingInteraction?.keepDrawingMode }}
          interactionTargetRef={chartSurfaceRef}
          onDrawingsChange={commitDrawings}
          onSelectedDrawingIdsChange={changeSelection}
          onActiveToolComplete={() => onActiveDrawingToolChange?.(undefined)}
          aria-label="Chart drawings"
        /> : null}
        {loading ? <div role="status" className="absolute inset-0 grid place-items-center bg-background"><div className="h-24 w-[70%] animate-pulse motion-reduce:animate-none rounded bg-muted" role="img" aria-label="Loading market chart" /></div> : null}
        {!loading && visibleError ? <div role="alert" className="absolute inset-0 grid place-items-center bg-background p-6 text-center text-sm text-foreground">{visibleError}</div> : null}
        {!loading && !visibleError && data.length === 0 ? <div className="absolute inset-0 grid place-items-center bg-background p-6 text-center text-sm text-muted-foreground">{emptyMessage}</div> : null}
      </div>{showDrawingObjectTree && onDrawingsChange ? <DrawingObjectTree drawings={drawings} selectedDrawingIds={effectiveSelectedDrawingIds} onSelectedDrawingIdsChange={changeSelection} onRename={(id, name) => commitDrawings(drawings.map((drawing) => drawing.id === id ? { ...drawing, name } : drawing), { type: "rename", drawingIds: [id] })} onReorder={(id, direction) => commitDrawings(reorderDrawing(drawings, id, direction), { type: "reorder", drawingIds: [id] })} onToggleVisibility={(id) => commitDrawings(drawings.map((drawing) => drawing.id === id ? { ...drawing, visible: !drawing.visible } : drawing), { type: "visibility", drawingIds: [id] })} onToggleLock={(id) => commitDrawings(drawings.map((drawing) => drawing.id === id ? { ...drawing, locked: !drawing.locked } : drawing), { type: "lock", drawingIds: [id] })} onDuplicate={(id) => commitDrawings(duplicateDrawings(drawings, [id], () => `duplicate-${Date.now()}`), { type: "duplicate", drawingIds: [id] })} onDelete={(id) => commitDrawings(drawings.filter((drawing) => drawing.id !== id), { type: "delete", drawingIds: [id] })} onGroup={(ids) => commitDrawings(groupDrawings(drawings, ids, `group-${Date.now()}`), { type: "group", drawingIds: ids })} onUngroup={(ids) => commitDrawings(ungroupDrawings(drawings, ids), { type: "ungroup", drawingIds: ids })} /> : null}</div>
      <div className={cn(dataTable === "none" && "hidden", "flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-xs text-muted-foreground")}>
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
