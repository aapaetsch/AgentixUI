import type {
  ChartOverlayState,
  DrawingPoint,
  IndicatorRenderSeries,
  MarketChartEngine,
  MarketChartEngineOptions,
  MarketChartSnapshot,
  MarketChartType,
  MarketCrosshairSnapshot,
  MarketMarker,
  MarketRenderLayer,
  MarketRenderLayerContext,
  MarketScaleMode,
  MarketSessionRange,
  MarketTime,
  OhlcBar,
  VisibleRange,
} from "../core";
import { marketTimeKey } from "../core";
import { IndexedOhlcStore } from "./data-store";
import { LogicalTimeScale } from "./time-scale";
import { PaneLayout } from "./pane-layout";
import { PriceScale } from "./price-scale";
import { RenderScheduler } from "./render-scheduler";

const AXIS_WIDTH = 72;
const TIME_AXIS_HEIGHT = 28;

interface PriceLine { price: number; color: string; label: string }

function formatTime(time: MarketTime, locale?: string, timeZone?: string): string {
  const date = new Date(marketTimeKey(time) * 1000);
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", ...(typeof time === "number" ? { hour: "2-digit", minute: "2-digit" } : {}), timeZone }).format(date);
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius = 3): void {
  context.beginPath(); context.roundRect(x, y, width, height, radius); context.fill();
}

export class FirstPartyMarketChartEngine implements MarketChartEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private store: IndexedOhlcStore;
  private timeScale: LogicalTimeScale;
  private layout: PaneLayout;
  private scales = new Map<string, PriceScale>();
  private scheduler: RenderScheduler;
  private chartType: MarketChartType;
  private scaleMode: MarketScaleMode;
  private showVolume: boolean;
  private markers: MarketMarker[];
  private sessions: MarketSessionRange[];
  private indicatorSeries: IndicatorRenderSeries[] = [];
  private overlays: ChartOverlayState[] = [];
  private consumerLayers: MarketRenderLayer[];
  private priceLines: PriceLine[] = [];
  private overlayMarkers: MarketMarker[] = [];
  private width: number;
  private height: number;
  private crosshair: MarketCrosshairSnapshot | null = null;
  private pointerStart: { x: number; y: number; lastX: number; lastY: number; boundary: number } | null = null;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinchDistance = 0;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  constructor(private container: HTMLElement, private options: MarketChartEngineOptions) {
    this.store = new IndexedOhlcStore(options.data);
    this.width = Math.max(1, container.clientWidth || 1); this.height = Math.max(1, options.height);
    this.timeScale = new LogicalTimeScale(this.store, this.width, AXIS_WIDTH);
    this.layout = new PaneLayout(this.width - AXIS_WIDTH, this.height, TIME_AXIS_HEIGHT);
    this.chartType = options.chartType; this.scaleMode = options.scaleMode; this.showVolume = options.showVolume;
    this.markers = options.markers.slice(); this.sessions = options.extendedSessions?.slice() ?? []; this.consumerLayers = options.renderLayers?.slice() ?? [];
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("role", "img"); this.canvas.setAttribute("aria-label", "Interactive market price chart");
    this.canvas.tabIndex = 0; this.canvas.style.display = "block"; this.canvas.style.width = "100%"; this.canvas.style.height = `${this.height}px`;
    this.canvas.style.touchAction = "pan-y"; this.canvas.style.userSelect = "none";
    this.context = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
    this.scheduler = new RenderScheduler(() => this.render());
    this.bindEvents(); this.reconcilePanes();
    if (options.paneSizes) this.layout.setSizes(options.paneSizes);
    this.resize(this.width, this.height); this.scheduler.invalidate();
  }

  setData(data: OhlcBar[]): void {
    const previousRange = this.getSnapshot().visibleRange; const wasRealtime = this.timeScale.visible.to >= this.store.length - 1.5;
    this.store.replace(data); this.timeScale.setStore(this.store);
    if (wasRealtime || !previousRange) this.timeScale.resetToLatest(); else this.timeScale.setVisibleTimes(previousRange.from, previousRange.to);
    this.crosshair = null; this.invalidate(true);
  }
  appendOrUpdate(bar: OhlcBar): void {
    const visible = this.timeScale.visible; const wasRealtime = visible.to >= this.store.length - 1.5;
    this.store.appendOrUpdate(bar); this.timeScale.setStore(this.store); if (wasRealtime) this.timeScale.scrollToRealtime(); this.invalidate(true);
  }
  setChartType(type: MarketChartType): void { this.chartType = type; this.scheduler.invalidate(); }
  setScaleMode(mode: MarketScaleMode): void { this.scaleMode = mode; this.scales.get("price")?.setMode(mode); this.scheduler.invalidate(); }
  setMarkers(markers: MarketMarker[]): void { this.markers = markers.slice(); this.scheduler.invalidate(); }
  setExtendedSessions(sessions: MarketSessionRange[]): void { this.sessions = sessions.slice(); this.scheduler.invalidate(); }
  setIndicatorSeries(series: IndicatorRenderSeries[]): void { this.indicatorSeries = series; this.reconcilePanes(); this.scheduler.invalidate(); }
  setOverlays(overlays: ChartOverlayState[]): void {
    this.overlays = overlays; this.priceLines = []; this.overlayMarkers = [];
    overlays.filter((overlay) => overlay.visible).forEach((overlay) => {
      const parameters = overlay.parameters;
      const price = typeof parameters.price === "number" ? parameters.price : typeof parameters.averagePrice === "number" ? parameters.averagePrice : null;
      if (price != null) this.priceLines.push({ price, color: typeof parameters.color === "string" ? parameters.color : this.options.theme.text, label: typeof parameters.label === "string" ? parameters.label : overlay.type });
      if (["execution-marker", "session-marker", "replay-cursor"].includes(overlay.type) && parameters.time != null) this.overlayMarkers.push({ id: overlay.id, time: parameters.time as MarketTime, position: overlay.type === "execution-marker" ? "aboveBar" : "belowBar", color: typeof parameters.color === "string" ? parameters.color : this.options.theme.text, text: typeof parameters.label === "string" ? parameters.label : undefined });
    });
    this.scheduler.invalidate();
  }
  setRenderLayers(layers: MarketRenderLayer[]): void { this.consumerLayers = layers.slice(); this.scheduler.invalidate(); }
  setPaneSizes(sizes: Record<string, number>): void { this.layout.setSizes(sizes); this.scheduler.invalidate(); }
  setVolumeVisible(visible: boolean): void { this.showVolume = visible; this.reconcilePanes(); this.scheduler.invalidate(); }
  resize(width: number, height: number): void {
    this.width = Math.max(1, width); this.height = Math.max(1, height);
    const ratio = Math.max(1, globalThis.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * ratio); this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.height = `${this.height}px`; this.timeScale.setWidth(this.width); this.layout.setGeometry(this.width - AXIS_WIDTH, this.height);
    this.scheduler.invalidate();
  }
  fitContent(): void { this.timeScale.fitContent(); this.invalidate(true); }
  scrollToRealtime(): void { this.timeScale.scrollToRealtime(); this.invalidate(true); }
  setVisibleRange(range: VisibleRange): void { this.timeScale.setVisibleTimes(range.from, range.to); this.invalidate(true); }
  setCrosshairPosition(time: MarketTime, price: number): void {
    const x = this.timeScale.timeToCoordinate(time); const y = this.scales.get("price")?.toCoordinate(price); const index = this.store.nearestIndex(time);
    if (x == null || y == null || index < 0) return; this.updateCrosshair(x, y, index, "price");
  }
  clearCrosshairPosition(): void { this.crosshair = null; this.options.onCrosshairMove?.(null); this.options.onCrosshairChange?.(null); this.scheduler.invalidate(); }
  coordinateForTime(time: MarketTime): number | null { return this.timeScale.timeToCoordinate(time); }
  coordinateFor(point: DrawingPoint): { x: number; y: number } | null {
    const x = this.timeScale.timeToCoordinate(point.time); const y = this.scales.get("price")?.toCoordinate(point.price); return x == null || y == null ? null : { x, y };
  }
  pointForCoordinate(coordinate: { x: number; y: number }): DrawingPoint | null {
    const bar = this.store.at(this.timeScale.coordinateToIndex(coordinate.x)); const price = this.scales.get("price")?.fromCoordinate(coordinate.y); return !bar || price == null ? null : { time: bar.time, price };
  }
  getSnapshot(): MarketChartSnapshot {
    const indexes = this.timeScale.visibleIndexes(0); const first = this.store.at(indexes.from); const last = this.store.at(Math.max(indexes.from, indexes.to - 1));
    return { visibleRange: first && last ? { from: first.time, to: last.time } : null, panes: this.layout.panes, scales: Object.fromEntries([...this.scales].map(([id, scale]) => [id, scale.snapshot])), crosshair: this.crosshair ? { ...this.crosshair, coordinates: { ...this.crosshair.coordinates }, values: { ...this.crosshair.values } } : null };
  }
  destroy(): void {
    if (this.destroyed) return; this.destroyed = true; this.scheduler.destroy(); this.unbindEvents();
    if (this.longPressTimer) clearTimeout(this.longPressTimer); this.canvas.remove();
  }

  private reconcilePanes(): void {
    const paneIds = ["price", ...(this.showVolume ? ["volume"] : []), ...new Set(this.indicatorSeries.filter((series) => series.placement === "pane").map((series) => series.paneId))];
    this.layout.setPanes(paneIds);
    paneIds.forEach((id) => { if (!this.scales.has(id)) this.scales.set(id, new PriceScale(id === "price" ? this.scaleMode : "normal")); });
    [...this.scales.keys()].filter((id) => !paneIds.includes(id)).forEach((id) => this.scales.delete(id));
  }

  private invalidate(notifyRange = false): void {
    if (notifyRange) this.options.onVisibleRangeChange?.(this.getSnapshot().visibleRange);
    this.scheduler.invalidate();
  }

  private render(): void {
    const context = this.context; if (!context || this.destroyed) return;
    const ratio = Math.max(1, globalThis.devicePixelRatio || 1); context.setTransform(ratio, 0, 0, ratio, 0, 0); context.clearRect(0, 0, this.width, this.height);
    context.fillStyle = this.options.theme.background; context.fillRect(0, 0, this.width, this.height);
    const indexes = this.timeScale.visibleIndexes(); const visible = this.store.range(indexes.from, indexes.to); const firstVisible = this.store.at(this.timeScale.visibleIndexes(0).from);
    this.configureScales(visible, firstVisible?.close, indexes.from);
    const layerContext = this.layerContext(visible);
    const builtIns: MarketRenderLayer[] = [
      { id: "grid", zIndex: -100, draw: () => this.drawGridAndAxes(context) },
      { id: "sessions", zIndex: -20, paneId: "price", draw: () => this.drawSessions(context) },
      { id: "price-series", zIndex: 0, paneId: "price", draw: () => this.drawPriceSeries(context, indexes.from, visible) },
      { id: "volume", zIndex: 5, paneId: "volume", draw: () => this.drawVolume(context, indexes.from, visible) },
      { id: "indicators", zIndex: 10, draw: () => this.drawIndicators(context, indexes.from, visible.length) },
      { id: "overlays", zIndex: 20, paneId: "price", draw: () => this.drawOverlays(context) },
      { id: "crosshair", zIndex: 100, draw: () => this.drawCrosshair(context) },
    ];
    [...builtIns, ...this.consumerLayers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).forEach((layer) => { context.save(); layer.draw(layerContext); context.restore(); });
  }

  private configureScales(visible: readonly OhlcBar[], anchor: number | undefined, startIndex: number): void {
    const paneById = new Map(this.layout.panes.map((pane) => [pane.id, pane]));
    this.scales.forEach((scale, id) => { const pane = paneById.get(id); if (pane) scale.setGeometry(pane.top + 6, pane.height - 12); });
    const priceValues = visible.flatMap((bar) => [bar.low, bar.high]);
    this.indicatorSeries.filter((series) => series.placement === "overlay").forEach((series) => series.points.slice(startIndex, startIndex + visible.length).forEach((point) => { if (point.value != null) priceValues.push(point.value); }));
    const error = this.scales.get("price")?.autoscale(priceValues, anchor) ?? null; this.options.onError?.(error);
    if (this.showVolume) this.scales.get("volume")?.autoscale([0, ...visible.map((bar) => bar.volume ?? 0)], undefined);
    const paneSeries = new Map<string, IndicatorRenderSeries[]>();
    this.indicatorSeries.filter((series) => series.placement === "pane").forEach((series) => paneSeries.set(series.paneId, [...(paneSeries.get(series.paneId) ?? []), series]));
    paneSeries.forEach((seriesGroup, paneId) => { const values = seriesGroup.flatMap((series) => series.points.slice(startIndex, startIndex + visible.length).filter((point) => point.value != null).map((point) => point.value as number)); const fixedDomain = seriesGroup.find((series) => series.fixedDomain)?.fixedDomain; this.scales.get(paneId)?.autoscale(values, undefined, fixedDomain); });
  }

  private layerContext(visibleData: readonly OhlcBar[]): MarketRenderLayerContext {
    return { visibleData, panes: this.layout.panes, theme: this.options.theme, canvas: this.context!, timeToCoordinate: (time) => this.timeScale.timeToCoordinate(time), priceToCoordinate: (price, paneId = "price") => this.scales.get(paneId)?.toCoordinate(price) ?? null };
  }

  private drawGridAndAxes(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.options.theme.grid; context.lineWidth = 1; context.fillStyle = this.options.theme.text; context.font = "11px ui-sans-serif, system-ui";
    this.layout.panes.forEach((pane) => {
      const scale = this.scales.get(pane.id); if (!scale) return;
      for (let tick = 0; tick < 4; tick += 1) { const y = pane.top + (pane.height * tick) / 4; context.beginPath(); context.moveTo(0, y + 0.5); context.lineTo(this.width - AXIS_WIDTH, y + 0.5); context.stroke(); const transformed = scale.snapshot.maximum - (tick / 4) * (scale.snapshot.maximum - scale.snapshot.minimum); context.fillText(scale.format(transformed), this.width - AXIS_WIDTH + 7, Math.max(pane.top + 12, y + 4)); }
      context.strokeStyle = this.options.theme.border; context.beginPath(); context.moveTo(0, pane.top + pane.height + 0.5); context.lineTo(this.width, pane.top + pane.height + 0.5); context.stroke(); context.strokeStyle = this.options.theme.grid;
    });
    for (let tick = 0; tick <= 6; tick += 1) { const x = ((this.width - AXIS_WIDTH) * tick) / 6; context.beginPath(); context.moveTo(x + 0.5, 0); context.lineTo(x + 0.5, this.height - TIME_AXIS_HEIGHT); context.stroke(); const bar = this.store.at(this.timeScale.coordinateToIndex(x)); if (bar) context.fillText(formatTime(bar.time, this.options.locale, this.options.timeZone), Math.max(2, x - 28), this.height - 9); }
    context.strokeStyle = this.options.theme.border; context.beginPath(); context.moveTo(this.width - AXIS_WIDTH + 0.5, 0); context.lineTo(this.width - AXIS_WIDTH + 0.5, this.height); context.stroke();
  }

  private drawPriceSeries(context: CanvasRenderingContext2D, startIndex: number, visible: readonly OhlcBar[]): void {
    const scale = this.scales.get("price"); if (!scale || !visible.length) return; const spacing = this.timeScale.barSpacing; const bodyWidth = Math.max(1, Math.min(14, spacing * 0.7));
    if (["line", "area", "baseline"].includes(this.chartType)) {
      const points = visible.map((bar, offset) => ({ x: this.timeScale.logicalToCoordinate(startIndex + offset), y: scale.toCoordinate(bar.close), bar })).filter((point): point is { x: number; y: number; bar: OhlcBar } => point.y != null);
      if (!points.length) return; context.beginPath(); points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
      context.strokeStyle = this.options.theme.primary; context.lineWidth = 2; context.stroke();
      if (this.chartType === "area") { context.lineTo(points.at(-1)!.x, this.layout.panes[0].height); context.lineTo(points[0].x, this.layout.panes[0].height); context.closePath(); context.fillStyle = this.options.theme.primary; context.globalAlpha = 0.14; context.fill(); context.globalAlpha = 1; }
      if (this.chartType === "baseline") { const baseline = scale.toCoordinate(visible[0].close); if (baseline != null) { context.strokeStyle = this.options.theme.border; context.setLineDash([4, 4]); context.beginPath(); context.moveTo(0, baseline); context.lineTo(this.width - AXIS_WIDTH, baseline); context.stroke(); context.setLineDash([]); } }
      return;
    }
    visible.forEach((bar, offset) => {
      const x = this.timeScale.logicalToCoordinate(startIndex + offset); const open = scale.toCoordinate(bar.open); const high = scale.toCoordinate(bar.high); const low = scale.toCoordinate(bar.low); const close = scale.toCoordinate(bar.close); if ([open, high, low, close].some((value) => value == null)) return;
      const color = bar.close >= bar.open ? this.options.theme.positive : this.options.theme.negative; context.strokeStyle = color; context.fillStyle = color;
      context.beginPath(); context.moveTo(x + 0.5, high!); context.lineTo(x + 0.5, low!); context.stroke();
      if (this.chartType === "candlestick") context.fillRect(x - bodyWidth / 2, Math.min(open!, close!), bodyWidth, Math.max(1, Math.abs(close! - open!)));
      else { context.beginPath(); context.moveTo(x - bodyWidth / 2, open!); context.lineTo(x, open!); context.moveTo(x, close!); context.lineTo(x + bodyWidth / 2, close!); context.stroke(); }
    });
  }

  private drawVolume(context: CanvasRenderingContext2D, startIndex: number, visible: readonly OhlcBar[]): void {
    if (!this.showVolume) return; const scale = this.scales.get("volume"); const pane = this.layout.panes.find((item) => item.id === "volume"); if (!scale || !pane) return;
    const width = Math.max(1, Math.min(12, this.timeScale.barSpacing * 0.7)); visible.forEach((bar, offset) => { const y = scale.toCoordinate(bar.volume ?? 0); if (y == null) return; context.fillStyle = bar.close >= bar.open ? this.options.theme.positive : this.options.theme.negative; context.globalAlpha = 0.5; context.fillRect(this.timeScale.logicalToCoordinate(startIndex + offset) - width / 2, y, width, pane.top + pane.height - y); context.globalAlpha = 1; });
  }

  private drawIndicators(context: CanvasRenderingContext2D, startIndex: number, visibleLength: number): void {
    this.indicatorSeries.forEach((series) => {
      const scale = this.scales.get(series.placement === "overlay" ? "price" : series.paneId); if (!scale) return;
      const visiblePoints = series.points.slice(startIndex, startIndex + visibleLength); context.strokeStyle = series.color; context.fillStyle = series.color; context.lineWidth = 1.5; context.beginPath(); let started = false;
      visiblePoints.forEach((point, offset) => { if (point.value == null) { started = false; return; } const x = this.timeScale.logicalToCoordinate(startIndex + offset); const y = scale.toCoordinate(point.value); if (y == null) return; if (series.style === "histogram") { const zero = scale.toCoordinate(0) ?? y; context.fillRect(x - Math.max(1, this.timeScale.barSpacing * 0.3), Math.min(y, zero), Math.max(1, this.timeScale.barSpacing * 0.6), Math.abs(zero - y)); } else if (!started) { context.moveTo(x, y); started = true; } else context.lineTo(x, y); });
      if (series.style === "line") context.stroke();
      series.referenceLines?.forEach((line) => { const y = scale.toCoordinate(line.value); if (y == null) return; context.save(); context.strokeStyle = line.color ?? this.options.theme.border; context.setLineDash([4, 4]); context.beginPath(); context.moveTo(0, y); context.lineTo(this.width - AXIS_WIDTH, y); context.stroke(); context.restore(); });
    });
  }

  private drawOverlays(context: CanvasRenderingContext2D): void {
    const scale = this.scales.get("price"); if (!scale) return;
    this.priceLines.forEach((line) => { const y = scale.toCoordinate(line.price); if (y == null) return; context.strokeStyle = line.color; context.setLineDash([5, 4]); context.beginPath(); context.moveTo(0, y); context.lineTo(this.width - AXIS_WIDTH, y); context.stroke(); context.setLineDash([]); context.fillStyle = line.color; context.fillText(line.label, 6, y - 4); });
    [...this.markers, ...this.overlayMarkers].forEach((marker) => { const index = this.store.indexOf(marker.time); const bar = this.store.at(index); if (!bar) return; const x = this.timeScale.logicalToCoordinate(index); const base = marker.position === "belowBar" ? bar.low : marker.position === "aboveBar" ? bar.high : bar.close; const y = scale.toCoordinate(base); if (y == null) return; const offset = marker.position === "belowBar" ? 12 : -12; context.fillStyle = marker.color ?? this.options.theme.text; this.drawMarkerShape(context, marker.shape ?? "circle", x, y + offset); if (marker.text) context.fillText(marker.text, x + 7, y + offset + 4); });
  }

  private drawSessions(context: CanvasRenderingContext2D): void { const pricePane = this.layout.panes.find((pane) => pane.id === "price"); if (!pricePane) return; this.sessions.forEach((session) => { const from = this.timeScale.timeToCoordinate(session.from); const to = this.timeScale.timeToCoordinate(session.to); if (from == null || to == null) return; context.fillStyle = session.color ?? this.options.theme.grid; context.globalAlpha = 0.22; context.fillRect(Math.min(from, to), pricePane.top, Math.abs(to - from), pricePane.height); context.globalAlpha = 1; if (session.label) { context.fillStyle = this.options.theme.text; context.fillText(session.label, Math.min(from, to) + 4, pricePane.top + 14); } }); }

  private drawMarkerShape(context: CanvasRenderingContext2D, shape: NonNullable<MarketMarker["shape"]>, x: number, y: number): void { context.beginPath(); if (shape === "square") context.rect(x - 4, y - 4, 8, 8); else if (shape === "arrowUp") { context.moveTo(x, y - 5); context.lineTo(x + 5, y + 4); context.lineTo(x - 5, y + 4); context.closePath(); } else if (shape === "arrowDown") { context.moveTo(x, y + 5); context.lineTo(x + 5, y - 4); context.lineTo(x - 5, y - 4); context.closePath(); } else context.arc(x, y, 4, 0, Math.PI * 2); context.fill(); }

  private drawCrosshair(context: CanvasRenderingContext2D): void {
    if (!this.crosshair) return; const { x, y } = this.crosshair.coordinates; context.strokeStyle = this.options.theme.text; context.globalAlpha = 0.55; context.setLineDash([3, 3]); context.beginPath(); context.moveTo(x, 0); context.lineTo(x, this.height - TIME_AXIS_HEIGHT); context.moveTo(0, y); context.lineTo(this.width - AXIS_WIDTH, y); context.stroke(); context.setLineDash([]); context.globalAlpha = 1;
    context.fillStyle = this.options.theme.text; roundedRect(context, Math.max(0, Math.min(this.width - AXIS_WIDTH - 96, x - 48)), this.height - TIME_AXIS_HEIGHT + 3, 96, 20); context.fillStyle = this.options.theme.background; context.fillText(formatTime(this.crosshair.time, this.options.locale, this.options.timeZone), Math.max(4, Math.min(this.width - AXIS_WIDTH - 92, x - 44)), this.height - 11);
  }

  private updateCrosshair(x: number, y: number, index = this.timeScale.coordinateToIndex(x), paneId = this.layout.paneAt(y)?.id ?? "price"): void {
    const bar = this.store.at(index); if (!bar) return; const values: Record<string, number | null> = { open: bar.open, high: bar.high, low: bar.low, close: bar.close, volume: bar.volume ?? null };
    this.indicatorSeries.forEach((series) => { values[series.id] = series.points[index]?.value ?? null; });
    this.crosshair = { time: bar.time, bar, paneId, coordinates: { x: this.timeScale.logicalToCoordinate(index), y }, values };
    this.options.onCrosshairMove?.(bar.time); this.options.onCrosshairChange?.(this.crosshair); this.scheduler.invalidate();
  }

  private pointerCoordinates(event: PointerEvent): { x: number; y: number } { const rect = this.canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
  private dispatchLayerPointer(type: "pointerdown" | "pointermove" | "pointerup", event: PointerEvent, point: { x: number; y: number }): boolean {
    const context = this.layerContext(this.store.range(this.timeScale.visibleIndexes().from, this.timeScale.visibleIndexes().to));
    const hit = this.consumerLayers.slice().sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)).find((layer) => layer.hitTest?.(point, context));
    if (!hit?.onPointerEvent) return false; hit.onPointerEvent({ type, x: point.x, y: point.y, sourceEvent: event }, context); return true;
  }

  private handlePointerDown = (event: PointerEvent): void => {
    const point = this.pointerCoordinates(event); if (this.dispatchLayerPointer("pointerdown", event, point)) return;
    this.canvas.setPointerCapture?.(event.pointerId); this.pointers.set(event.pointerId, point); const boundary = this.layout.boundaryAt(point.y);
    this.pointerStart = { ...point, lastX: point.x, lastY: point.y, boundary };
    if (event.pointerType === "touch") this.longPressTimer = setTimeout(() => this.updateCrosshair(point.x, point.y), 450);
  };
  private handlePointerMove = (event: PointerEvent): void => {
    const point = this.pointerCoordinates(event); this.pointers.set(event.pointerId, point); if (this.dispatchLayerPointer("pointermove", event, point)) return;
    if (this.pointers.size === 2) { const [first, second] = [...this.pointers.values()]; const distance = Math.hypot(first.x - second.x, first.y - second.y); if (this.pinchDistance) this.timeScale.zoomAt((first.x + second.x) / 2, this.pinchDistance / distance); this.pinchDistance = distance; this.invalidate(true); return; }
    const start = this.pointerStart; if (start && (event.buttons || event.pointerType === "touch")) { if (Math.hypot(point.x - start.x, point.y - start.y) > 5 && this.longPressTimer) { clearTimeout(this.longPressTimer); this.longPressTimer = null; } const deltaX = point.x - start.lastX; const deltaY = point.y - start.lastY; if (start.boundary >= 0) { const sizes = this.layout.resizeBoundary(start.boundary, deltaY); this.options.onPaneSizesChange?.(sizes); } else this.timeScale.panPixels(deltaX); start.lastX = point.x; start.lastY = point.y; this.invalidate(true); }
    else this.updateCrosshair(point.x, point.y);
  };
  private handlePointerUp = (event: PointerEvent): void => { const point = this.pointerCoordinates(event); this.dispatchLayerPointer("pointerup", event, point); this.pointers.delete(event.pointerId); this.pointerStart = null; this.pinchDistance = 0; if (this.longPressTimer) clearTimeout(this.longPressTimer); this.longPressTimer = null; };
  private handlePointerLeave = (): void => { if (!this.pointerStart) this.clearCrosshairPosition(); };
  private handleWheel = (event: WheelEvent): void => { event.preventDefault(); const point = this.pointerCoordinates(event as unknown as PointerEvent); this.timeScale.zoomAt(point.x, Math.exp(event.deltaY * 0.0015)); this.invalidate(true); };
  private handleDoubleClick = (): void => this.fitContent();
  private handleKeyDown = (event: KeyboardEvent): void => {
    const current = this.crosshair ? this.store.nearestIndex(this.crosshair.time) : this.timeScale.visibleIndexes(0).to - 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); const index = Math.max(0, Math.min(this.store.length - 1, current + (event.key === "ArrowRight" ? 1 : -1))); const bar = this.store.at(index); if (bar) this.updateCrosshair(this.timeScale.logicalToCoordinate(index), this.scales.get("price")?.toCoordinate(bar.close) ?? 0, index); }
    else if (event.key === "+" || event.key === "=") { event.preventDefault(); this.timeScale.zoomAt((this.width - AXIS_WIDTH) / 2, 0.8); this.invalidate(true); }
    else if (event.key === "-") { event.preventDefault(); this.timeScale.zoomAt((this.width - AXIS_WIDTH) / 2, 1.25); this.invalidate(true); }
    else if (event.key === "Home") { event.preventDefault(); const span = this.timeScale.visible.to - this.timeScale.visible.from; const first = this.store.first; const end = this.store.at(Math.min(this.store.length - 1, Math.ceil(span))); if (first && end) this.setVisibleRange({ from: first.time, to: end.time }); }
    else if (event.key === "End") { event.preventDefault(); this.scrollToRealtime(); }
  };

  private bindEvents(): void { this.canvas.addEventListener("pointerdown", this.handlePointerDown); this.canvas.addEventListener("pointermove", this.handlePointerMove); this.canvas.addEventListener("pointerup", this.handlePointerUp); this.canvas.addEventListener("pointercancel", this.handlePointerUp); this.canvas.addEventListener("pointerleave", this.handlePointerLeave); this.canvas.addEventListener("wheel", this.handleWheel, { passive: false }); this.canvas.addEventListener("dblclick", this.handleDoubleClick); this.canvas.addEventListener("keydown", this.handleKeyDown); }
  private unbindEvents(): void { this.canvas.removeEventListener("pointerdown", this.handlePointerDown); this.canvas.removeEventListener("pointermove", this.handlePointerMove); this.canvas.removeEventListener("pointerup", this.handlePointerUp); this.canvas.removeEventListener("pointercancel", this.handlePointerUp); this.canvas.removeEventListener("pointerleave", this.handlePointerLeave); this.canvas.removeEventListener("wheel", this.handleWheel); this.canvas.removeEventListener("dblclick", this.handleDoubleClick); this.canvas.removeEventListener("keydown", this.handleKeyDown); }
}

export function createMarketChartEngine(container: HTMLElement, options: MarketChartEngineOptions): MarketChartEngine {
  return new FirstPartyMarketChartEngine(container, options);
}
