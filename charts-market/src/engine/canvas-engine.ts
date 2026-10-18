import { validateMarketPresentation, type MarketChartPresentation, type MarketChartTheme, type MarketChartChangeMetadata } from "../core";
import { builtInSeriesRenderers } from "./series-renderers";
import type {
  MarketScaleOptions,
  MarketViewportOptions,
  TechnicalPaneState,
} from "../core";
import { layoutAxisBadges, type AxisBadge } from "./axis-badges";
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
import { crossesMarketTimeGap, isMarketTimeInGap, validateMarketTimeGeometry, withMarketVisibleRange, type MarketTimeAxis, type MarketTimeGap, marketTimeKey } from "../core";
import { IndexedOhlcStore } from "./data-store";
import { LogicalTimeScale } from "./time-scale";
import { PaneLayout } from "./pane-layout";
import { PriceScale } from "./price-scale";
import { RenderScheduler } from "./render-scheduler";

const AXIS_WIDTH = 72;
const TIME_AXIS_HEIGHT = 28;

interface PriceLine {
  price: number;
  color: string;
  label: string;
}

function formatTime(
  time: MarketTime,
  locale?: string,
  timeZone?: string,
): string {
  const date = new Date(marketTimeKey(time) * 1000);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    ...(typeof time === "number" ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone,
  }).format(date);
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 3,
): void {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

export class FirstPartyMarketChartEngine implements MarketChartEngine {
  private discontinuities: readonly MarketTimeGap[] = [];
  private timeAxisKey = "";
  private lastRangeKey = "";
  private indicatorValues = new Map<string, Map<number, number | null>>();
  private panes?: TechnicalPaneState[];
  private viewport: MarketViewportOptions = {};
  private scaleOptions: MarketScaleOptions = {
    mode: "normal",
    autoScale: true,
  };
  private lastNotifiedBar = -1;
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
  private pointerStart: {
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    boundary: number;
    axis?: "price" | "time";
    shift?: boolean;
  } | null = null;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinchDistance = 0;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  constructor(
    private container: HTMLElement,
    private options: MarketChartEngineOptions,
  ) {
    validateMarketPresentation(options.presentation);
    this.store = new IndexedOhlcStore(options.data);
    this.width = Math.max(1, container.clientWidth || 1);
    this.height = Math.max(1, options.height);
    this.timeScale = new LogicalTimeScale(this.store, this.width, AXIS_WIDTH);
    this.timeScale.setAxis(options.timeAxis);
    this.timeAxisKey = JSON.stringify(options.timeAxis ?? { mode: "compressed" });
    this.discontinuities = options.discontinuities ?? [];
    const geometryErrors = validateMarketTimeGeometry(options.timeAxis, this.discontinuities);
    if (geometryErrors.length) throw new Error(geometryErrors.join(" "));
    this.layout = new PaneLayout(
      this.width - AXIS_WIDTH,
      this.height,
      TIME_AXIS_HEIGHT,
    );
    this.chartType = options.chartType;
    this.scaleMode = options.scaleMode;
    this.showVolume = options.showVolume;
    this.markers = options.markers.slice();
    this.sessions = options.extendedSessions?.slice() ?? [];
    this.consumerLayers = options.renderLayers?.slice() ?? [];
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("role", "img");
    this.canvas.setAttribute("aria-label", "Interactive market price chart");
    this.canvas.tabIndex = 0;
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.canvas.style.height = `${this.height}px`;
    this.canvas.style.touchAction = "pan-y";
    this.canvas.style.userSelect = "none";
    this.context = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
    this.scheduler = new RenderScheduler(() => this.render());
    this.panes = options.panes;
    if (this.panes) this.canvas.style.touchAction = "none";
    this.viewport = options.viewport ?? {};
    this.scaleOptions = options.scale ?? {
      mode: this.scaleMode,
      autoScale: true,
    };
    this.timeScale.setRightOffset(
      this.viewport.rightOffsetBars,
      this.viewport.minimumRightOffsetBars,
      this.viewport.maximumRightOffsetBars,
    );
    this.applyViewport();
    this.lastRangeKey = JSON.stringify(this.timeScale.visibleTimes());
    this.bindEvents();
    this.reconcilePanes();
    if (options.paneSizes) this.layout.setSizes(options.paneSizes);
    this.resize(this.width, this.height);
    this.scheduler.invalidate();
  }

  setTheme(theme: MarketChartTheme): void { this.options.theme = {...theme}; this.badgeColors.clear(); this.scheduler.invalidate(); }
  setPresentation(presentation: MarketChartPresentation): void { validateMarketPresentation(presentation); this.options.presentation=presentation; this.scheduler.invalidate(); }
  setTimeAxis(axis?: MarketTimeAxis): void {
    const key = JSON.stringify(axis ?? { mode: "compressed" });
    if (key === this.timeAxisKey) return;
    const previous=this.timeScale.visibleTimes(),sameMode=JSON.parse(this.timeAxisKey).mode===(axis?.mode??"compressed");
    this.timeScale.setAxis(axis); this.timeAxisKey = key;
    if(sameMode&&previous){this.timeScale.setVisibleTimes(previous.from,previous.to);this.refreshInspection();}else{this.applyViewport();this.clearCrosshairPosition();}this.lastRangeKey=JSON.stringify(this.timeScale.visibleTimes());this.scheduler.invalidate();
  }
  setDiscontinuities(gaps: readonly MarketTimeGap[]): void {
    const errors = validateMarketTimeGeometry(undefined, gaps);
    if (errors.length) throw new Error(errors.join(" "));
    if(JSON.stringify(gaps)===JSON.stringify(this.discontinuities))return;
    this.discontinuities=gaps.slice();this.refreshInspection();this.scheduler.invalidate();
  }
  shiftTime(time: MarketTime, steps: number): MarketTime | null { return this.timeScale.shiftTime(time, steps); }
  private applyViewport(): boolean {
    if (this.timeScale.isCalendar && this.viewport.visibleRange) {
      this.viewport = withMarketVisibleRange(this.viewport, this.viewport.visibleRange);
      this.timeScale.setVisibleTimes(this.viewport.visibleRange!.from, this.viewport.visibleRange!.to);
    } else if (this.viewport.logicalRange) this.timeScale.setLogicalRange(this.viewport.logicalRange);
    else if (this.viewport.visibleRange) this.timeScale.setVisibleTimes(this.viewport.visibleRange.from, this.viewport.visibleRange.to);
    else return false;
    return true;
  }
  private refreshInspection(): void {
    const previous=this.crosshair;if(!previous)return;
    const index=this.store.indexOf(previous.time);
    if(index<0){this.clearCrosshairPosition();return;}
    const x=this.timeScale.timeToCoordinate(previous.time);
    if(x==null){this.clearCrosshairPosition();return;}
    this.lastNotifiedBar=-1;this.updateCrosshair(x,previous.coordinates.y,index,previous.paneId);
  }
  setData(data: OhlcBar[]): void {
    const previousRange=this.timeScale.visibleTimes(),logical=this.timeScale.visible,first=this.store.first?.time,previousLength=this.store.length;
    const wasRealtime=this.timeScale.isRealtime;
    this.store.replace(data);this.timeScale.setStore(this.store);
    if(first!=null&&this.store.first&&marketTimeKey(first)===marketTimeKey(this.store.first.time)) {
      this.timeScale.setLogicalRange(logical);
      if(wasRealtime&&this.store.length>previousLength)this.timeScale.scrollToRealtime();
    }else if(previousRange)this.timeScale.setVisibleTimes(previousRange.from,previousRange.to);
    else if(!this.applyViewport())this.timeScale.resetToLatest();
    this.refreshInspection();this.lastRangeKey=JSON.stringify(this.timeScale.visibleTimes());this.scheduler.invalidate();
  }
  appendOrUpdate(bar: OhlcBar): void {
    const wasRealtime=this.timeScale.isRealtime,previousLength=this.store.length;
    this.store.appendOrUpdate(bar);this.timeScale.setStore(this.store);
    if(wasRealtime&&this.store.length>previousLength)this.timeScale.scrollToRealtime();
    this.refreshInspection();this.lastRangeKey=JSON.stringify(this.timeScale.visibleTimes());this.scheduler.invalidate();
  }
  resetScale():void {this.scaleOptions={mode:this.scaleMode,autoScale:true};this.options.onScaleChange?.(this.scaleOptions,{source:"api"});this.scheduler.invalidate();}
  setChartType(type: MarketChartType): void {
    this.chartType = type;
    this.scheduler.invalidate();
  }
  setScaleMode(mode: MarketScaleMode): void {
    this.scaleMode = mode;
    this.scales.get("price")?.setMode(mode);
    this.scheduler.invalidate();
  }
  setMarkers(markers: MarketMarker[]): void {
    this.markers = markers.slice();
    this.scheduler.invalidate();
  }
  setExtendedSessions(sessions: MarketSessionRange[]): void {
    this.sessions = sessions.slice();
    this.scheduler.invalidate();
  }
  setIndicatorSeries(series: IndicatorRenderSeries[]): void {
    const nextValues = new Map<string, Map<number, number | null>>();
    for(const item of series){const previous=this.indicatorSeries.find(s=>s.id===item.id);nextValues.set(item.id,previous?.points===item.points&&this.indicatorValues.has(item.id)?this.indicatorValues.get(item.id)!:new Map(item.points.map(point=>[marketTimeKey(point.time),point.value])));}
    this.indicatorValues=nextValues;
    const style = getComputedStyle(this.container);
    this.indicatorSeries = series.map((s) => ({
      ...s,
      color: s.color.replace(
        /var\((--[\w-]+)\)/g,
        (_, token: string) =>
          style.getPropertyValue(token).trim() || "215 20% 50%",
      ),
    }));
    if(!this.panes)this.reconcilePanes();this.refreshInspection();
    this.scheduler.invalidate();
  }
  setOverlays(overlays: ChartOverlayState[]): void {
    this.overlays = overlays;
    this.priceLines = [];
    this.overlayMarkers = [];
    overlays
      .filter((overlay) => overlay.visible)
      .forEach((overlay) => {
        const parameters = overlay.parameters;
        const price =
          typeof parameters.price === "number"
            ? parameters.price
            : typeof parameters.averagePrice === "number"
              ? parameters.averagePrice
              : null;
        if (price != null)
          this.priceLines.push({
            price,
            color:
              typeof parameters.color === "string"
                ? parameters.color
                : this.options.theme.text,
            label:
              typeof parameters.label === "string"
                ? parameters.label
                : overlay.type,
          });
        if (
          ["execution-marker", "session-marker", "replay-cursor"].includes(
            overlay.type,
          ) &&
          parameters.time != null
        )
          this.overlayMarkers.push({
            id: overlay.id,
            time: parameters.time as MarketTime,
            position:
              overlay.type === "execution-marker" ? "aboveBar" : "belowBar",
            color:
              typeof parameters.color === "string"
                ? parameters.color
                : this.options.theme.text,
            text:
              typeof parameters.label === "string"
                ? parameters.label
                : undefined,
          });
      });
    this.scheduler.invalidate();
  }
  setRenderLayers(layers: MarketRenderLayer[]): void {
    this.consumerLayers = layers.slice();
    this.scheduler.invalidate();
  }
  setPanes(panes: TechnicalPaneState[]): void {
    this.panes = panes;
    this.reconcilePanes();
    this.scheduler.invalidate();
  }
  setViewport(viewport: MarketViewportOptions): void {
    this.viewport = viewport;
    this.timeScale.setRightOffset(
      viewport.rightOffsetBars,
      viewport.minimumRightOffsetBars,
      viewport.maximumRightOffsetBars,
    );
    this.applyViewport();
    this.lastRangeKey = JSON.stringify(this.timeScale.visibleTimes());
    this.scheduler.invalidate();
  }
  setScale(scale: MarketScaleOptions): void {
    this.scaleOptions = scale;
    this.setScaleMode(scale.mode);
    this.scheduler.invalidate();
  }
  setPaneSizes(sizes: Record<string, number>): void {
    this.layout.setSizes(sizes);
    this.scheduler.invalidate();
  }
  setVolumeVisible(visible: boolean): void {
    this.showVolume = visible;
    this.reconcilePanes();
    this.scheduler.invalidate();
  }
  resize(width: number, height: number): void {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    const ratio = Math.max(1, globalThis.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.height = `${this.height}px`;
    this.timeScale.setWidth(this.width);
    this.layout.setGeometry(this.width - AXIS_WIDTH, this.height);
    this.scheduler.invalidate();
  }
  fitContent(metadata:MarketChartChangeMetadata={source:"api"}): void {
    this.timeScale.fitContent();
    this.invalidate(true,metadata);
  }
  scrollToRealtime(metadata:MarketChartChangeMetadata={source:"api"}): void {
    this.timeScale.scrollToRealtime();
    this.invalidate(true,metadata);
  }
  setVisibleRange(range: VisibleRange,metadata:MarketChartChangeMetadata={source:"api"}): void {
    this.timeScale.setVisibleTimes(range.from, range.to);
    this.invalidate(true,metadata);
  }
  setCrosshairPosition(time: MarketTime, price: number): void {
    const x = this.timeScale.timeToCoordinate(time);
    const y = this.scales.get("price")?.toCoordinate(price);
    const index = this.store.indexOf(time);
    if (x == null || y == null || index < 0) { if (this.timeScale.isCalendar) this.clearCrosshairPosition(); return; }
    this.updateCrosshair(x, y, index, "price");
  }
  clearCrosshairPosition(): void {
    this.crosshair = null;
    this.lastNotifiedBar = -1;
    this.options.onCrosshairMove?.(null);
    this.options.onCrosshairChange?.(null);
    this.scheduler.invalidate();
  }
  coordinateForTime(time: MarketTime): number | null {
    return this.timeScale.timeToCoordinate(time);
  }
  coordinateFor(point: DrawingPoint): { x: number; y: number } | null {
    const x = this.timeScale.timeToCoordinate(point.time);
    const y = this.scales.get("price")?.toCoordinate(point.price);
    return x == null || y == null ? null : { x, y };
  }
  pointForCoordinate(coordinate: {
    x: number;
    y: number;
  }): DrawingPoint | null {
    const time = this.timeScale.coordinateToTime(coordinate.x);
    const price = this.scales.get("price")?.fromCoordinate(coordinate.y);
    return time == null || price == null ? null : { time, price };
  }
  getSnapshot(): MarketChartSnapshot {

    return {
      viewport: {...this.viewport,logicalRange:this.timeScale.isCalendar?undefined:this.timeScale.visible,visibleRange:this.timeScale.visibleTimes()??undefined},
      scale: {...this.scaleOptions,manualRange:this.scaleOptions.manualRange?{...this.scaleOptions.manualRange}:undefined},
      visibleRange: this.timeScale.visibleTimes(),
      panes: this.paneGeometry(),
      scales: Object.fromEntries(
        [...this.scales].map(([id, scale]) => [id, scale.snapshot]),
      ),
      crosshair: this.crosshair
        ? {
            ...this.crosshair,
            coordinates: { ...this.crosshair.coordinates },
            values: { ...this.crosshair.values },
          }
        : null,
    };
  }
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.scheduler.destroy();
    this.unbindEvents();
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.canvas.remove();
  }

  private get plotLeft(): number {
    return this.panes?.some(
      (p) => p.visible !== false && p.scaleSide === "left",
    )
      ? AXIS_WIDTH
      : 0;
  }
  private paneGeometry() {
    return this.layout.panes.map((p) => ({
      ...p,
      left: this.plotLeft,
      width: Math.max(1, p.width - this.plotLeft),
    }));
  }
  private volumePanes() {
    return this.paneGeometry().filter((pane) => this.panes
      ? this.panes.find((definition) => definition.id === pane.id)?.showVolume
      : this.showVolume && pane.id === "volume");
  }
  private hasVolumeAxis(paneId: string): boolean {
    return paneId !== "price" && !this.indicatorSeries.some(
      (series) => series.placement === "pane" && series.paneId === paneId,
    );
  }
  private reconcilePanes(): void {
    this.timeScale.setLeftInset(this.plotLeft);
    const paneIds = this.panes
      ? this.panes
          .filter((p) => p.visible !== false)
          .sort((a, b) => a.order - b.order)
          .map((p) => p.id)
      : [
          "price",
          ...(this.showVolume ? ["volume"] : []),
          ...new Set(
            this.indicatorSeries
              .filter((series) => series.placement === "pane")
              .map((series) => series.paneId),
          ),
        ];
    if (this.panes) this.layout.setDefinitions(this.panes);
    else this.layout.setPanes(paneIds);
    paneIds.forEach((id) => {
      if (!this.scales.has(id))
        this.scales.set(
          id,
          new PriceScale(id === "price" ? this.scaleMode : "normal"),
        );
    });
    [...this.scales.keys()]
      .filter((id) => !paneIds.includes(id))
      .forEach((id) => this.scales.delete(id));
  }

  private invalidate(notifyRange = false, metadata: MarketChartChangeMetadata = {source:"api"}): void {
    const rangeKey = JSON.stringify(this.timeScale.visibleTimes());
    if (rangeKey === this.lastRangeKey) notifyRange = false;
    this.lastRangeKey = rangeKey;
    if (notifyRange)
      this.options.onVisibleRangeChange?.(this.getSnapshot().visibleRange, metadata);
    if (notifyRange)
      this.options.onViewportChange?.({
        ...this.viewport,
        logicalRange: this.timeScale.isCalendar ? undefined : this.timeScale.visible,
        visibleRange: this.getSnapshot().visibleRange ?? undefined,
      }, metadata);
    this.scheduler.invalidate();
  }

  private render(): void {
    const context = this.context;
    if (!context || this.destroyed) return;
    const ratio = Math.max(1, globalThis.devicePixelRatio || 1);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, this.width, this.height);
    context.fillStyle = this.options.theme.background;
    context.fillRect(0, 0, this.width, this.height);
    const indexes = this.timeScale.visibleIndexes();
    const visible = this.store.range(indexes.from, indexes.to);
    const firstVisible = this.store.at(this.timeScale.visibleIndexes(0).from);
    this.configureScales(visible, firstVisible?.close, indexes.from);
    if (this.crosshair)
      this.crosshair.coordinates.x =
        this.timeScale.timeToCoordinate(this.crosshair.time) ??
        this.crosshair.coordinates.x;
    const layerContext = this.layerContext(visible);
    this.options.onSnapshotChange?.(this.getSnapshot());
    const builtIns: MarketRenderLayer[] = [
      { id: "grid", zIndex: -100, draw: () => this.drawGridAndAxes(context) },
      {
        id: "sessions",
        zIndex: -20,
        paneId: "price",
        draw: () => this.drawSessions(context),
      },
      {
        id: "price-series",
        zIndex: 0,
        paneId: "price",
        draw: () => this.drawPriceSeries(context, indexes.from, visible),
      },
      {
        id: "volume",
        zIndex: 5,
        draw: () => this.drawVolume(context, indexes.from, visible),
      },
      {
        id: "indicators",
        zIndex: 10,
        draw: () => this.drawIndicators(context, indexes.from, visible.length),
      },
      {
        id: "overlays",
        zIndex: 20,
        paneId: "price",
        draw: () => this.drawOverlays(context),
      },
      {
        id: "axis-badges",
        zIndex: 90,
        draw: () => this.drawAxisBadges(context),
      },
      { id: "crosshair", zIndex: 100, draw: () => this.drawCrosshair(context) },
    ];
    [...builtIns, ...this.consumerLayers]
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
      .forEach((layer) => {
        context.save();
        const pane = layer.paneId
          ? this.paneGeometry().find((p) => p.id === layer.paneId)
          : undefined;
        if (layer.paneId && !pane) {
          context.restore();
          return;
        }
        if (pane) {
          context.beginPath();
          context.rect(pane.left ?? 0, pane.top, pane.width, pane.height);
          context.clip();
        }
        layer.draw(layerContext);
        context.restore();
      });
  }

  private configureScales(
    visible: readonly OhlcBar[],
    anchor: number | undefined,
    _startIndex: number,
  ): void {
    const paneById = new Map(
      this.paneGeometry().map((pane) => [pane.id, pane]),
    );
    this.scales.forEach((scale, id) => {
      const pane = paneById.get(id);
      if (pane) {
        scale.setGeometry(
          pane.top +
            (this.panes
              ? id === "price"
                ? pane.width < 400
                  ? 60
                  : 52
                : 28
              : 6),
          pane.height -
            (this.panes
              ? id === "price"
                ? pane.width < 400
                  ? 88
                  : 80
                : 38
              : 12),
        );
        scale.setMode(
          id === "price"
            ? this.scaleMode
            : (this.panes?.find((p) => p.id === id)?.scaleMode ?? "normal"),
        );
      }
    });
    const priceValues = visible.flatMap((bar) => [bar.low, bar.high]);
    this.indicatorSeries
      .filter((series) => series.placement === "overlay")
      .forEach((series) =>
        this.visibleStudyPoints(series)
          .forEach((point) => {
            if (point.value != null) priceValues.push(point.value);
          }),
      );
    const error =
      this.scales
        .get("price")
        ?.autoscale(
          priceValues,
          anchor,
          undefined,
          this.panes ? 0.025 : 0.08,
        ) ?? null;
    this.options.onError?.(error);
    if (!this.scaleOptions.autoScale && this.scaleOptions.manualRange)
      this.scales.get("price")?.setRange(this.scaleOptions.manualRange);
    const paneSeries = new Map<string, IndicatorRenderSeries[]>();
    this.indicatorSeries
      .filter((series) => series.placement === "pane")
      .forEach((series) =>
        paneSeries.set(series.paneId, [
          ...(paneSeries.get(series.paneId) ?? []),
          series,
        ]),
      );
    paneSeries.forEach((seriesGroup, paneId) => {
      const values = seriesGroup.flatMap((series) =>
        this.visibleStudyPoints(series)
          .filter((point) => point.value != null)
          .map((point) => point.value as number),
      );
      const fixedDomain = seriesGroup.find(
        (series) => series.fixedDomain,
      )?.fixedDomain;
      this.scales.get(paneId)?.autoscale(values, undefined, fixedDomain);
    });
    // Explicit volume panes are independent of the legacy showVolume switch.
    // Keep their axis and histogram in the same supplied volume units.
    const maximumVolume = visible.reduce((maximum, bar) =>
      Number.isFinite(bar.volume) ? Math.max(maximum, bar.volume ?? 0) : maximum, 0);
    this.volumePanes().forEach((pane) => {
      if (!this.hasVolumeAxis(pane.id)) return;
      const scale = this.scales.get(pane.id);
      scale?.setMode("normal");
      scale?.setRange({minimum: 0, maximum: maximumVolume > 0 ? Math.min(Number.MAX_VALUE, maximumVolume * 1.1) : 1});
    });
  }

  private layerContext(
    visibleData: readonly OhlcBar[],
  ): MarketRenderLayerContext {
    const plotBounds = {
      x: this.plotLeft,
      y: 0,
      width: this.width - AXIS_WIDTH - this.plotLeft,
      height: this.height - TIME_AXIS_HEIGHT,
    };
    const reservedWidth = Math.min(
      plotBounds.width,
      this.timeScale.rightOffsetBars * this.timeScale.barSpacing,
    );
    return {
      plotBounds,
      paneBounds: Object.fromEntries(
        this.paneGeometry().map((p) => [
          p.id,
          { x: p.left ?? 0, y: p.top, width: p.width, height: p.height },
        ]),
      ),
      axisBounds: Object.fromEntries(
        this.paneGeometry().map((p) => [
          p.id,
          {
            x:
              this.panes?.find((d) => d.id === p.id)?.scaleSide === "left"
                ? 0
                : this.width - AXIS_WIDTH,
            y: p.top,
            width: AXIS_WIDTH,
            height: p.height,
          },
        ]),
      ),
      reservedBounds: {
        x: plotBounds.x + plotBounds.width - reservedWidth,
        y: 0,
        width: reservedWidth,
        height: plotBounds.height,
      },
      visibleData,
      panes: this.paneGeometry(),
      theme: this.options.theme,
      canvas: this.context!,
      timeToCoordinate: (time) => this.timeScale.timeToCoordinate(time),
      priceToCoordinate: (price, paneId = "price") =>
        this.scales.get(paneId)?.toCoordinate(price) ?? null,
    };
  }

  private drawGridAndAxes(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.options.theme.grid;
    context.lineWidth = 1;
    context.fillStyle = this.options.theme.text;
    context.font = `${this.options.presentation?.axis?.fontSize ?? 11}px ui-sans-serif, system-ui`;
    this.paneGeometry().forEach((pane) => {
      const scale = this.scales.get(pane.id);
      if (!scale) return;
      const definition = this.panes?.find((p) => p.id === pane.id);
      if (definition?.collapsed) return;
      const axisX =
        definition?.scaleSide === "left" ? 7 : this.width - AXIS_WIDTH + 7;
      const bounded = this.indicatorSeries.find(
        (s) => s.paneId === pane.id && s.fixedDomain,
      );
      const ticks = bounded?.fixedDomain
        ? [
            ...new Set([
              bounded.fixedDomain[0],
              ...(bounded.referenceLines?.map((l) => l.value) ?? []),
              (bounded.fixedDomain[0] + bounded.fixedDomain[1]) / 2,
              bounded.fixedDomain[1],
            ]),
          ].sort((a, b) => a - b)
        : scale.ticks(Math.max(2, Math.floor(pane.height / (this.options.presentation?.axis?.minimumTickSpacing ?? 48))));
      ticks.forEach((value) => {
        const y = scale.toCoordinate(value);
        if (y == null) return;
        context.beginPath();
        context.moveTo(pane.left ?? 0, y + 0.5);
        context.lineTo((pane.left ?? 0) + pane.width, y + 0.5);
        if(this.options.presentation?.grid?.horizontal!==false){context.globalAlpha=this.options.presentation?.grid?.opacity??1;context.stroke();context.globalAlpha=1;}
        this.axisText(context,
          scale.formatPrice(value, bounded ? 0 : (definition?.precision ?? 2)),
          axisX,
          y + 4,
        );
      });
      context.strokeStyle = this.options.theme.border;
      context.beginPath();
      context.moveTo(0, pane.top + pane.height + 0.5);
      context.lineTo(this.width, pane.top + pane.height + 0.5);
      context.stroke();
      context.strokeStyle = this.options.theme.grid;
    });
    const timeTickCount = Math.max(
      1,
      Math.min(12, Math.floor((this.width - AXIS_WIDTH - this.plotLeft) / (this.options.presentation?.axis?.timeTickSpacing ?? 160))),
    );
    let previousLabelEnd=-Infinity;
    for (let tick = 0; tick <= timeTickCount; tick += 1) {
      const x =
        this.plotLeft +
        ((this.width - AXIS_WIDTH - this.plotLeft) * tick) / timeTickCount;
      context.beginPath();
      context.moveTo(x + 0.5, 0);
      context.lineTo(x + 0.5, this.height - TIME_AXIS_HEIGHT);
      if(this.options.presentation?.grid?.vertical!==false){context.globalAlpha=this.options.presentation?.grid?.opacity??1;context.stroke();context.globalAlpha=1;}
      const logical = this.timeScale.coordinateToLogical(x);
      const bar =
        logical > this.store.length - 0.5
          ? undefined
          : this.store.at(this.timeScale.coordinateToIndex(x));
      const tickTime = this.timeScale.isCalendar ? this.timeScale.coordinateToTime(x) : bar?.time;
      if(tickTime!=null){const label=formatTime(tickTime,this.options.locale,this.options.timeZone),labelWidth=(context.measureText(label)?.width??label.length*6);const left=Math.max(this.plotLeft+2,Math.min(this.width-AXIS_WIDTH-labelWidth-2,x-labelWidth/2));if(left>=previousLabelEnd+8){context.fillText(label,left,this.height-9);previousLabelEnd=left+labelWidth;}}
    }
    context.strokeStyle = this.options.theme.border;
    context.beginPath();
    context.moveTo(this.width - AXIS_WIDTH + 0.5, 0);
    context.lineTo(this.width - AXIS_WIDTH + 0.5, this.height);
    context.stroke();
  }

  private drawPriceSeries(
    context: CanvasRenderingContext2D,
    startIndex: number,
    visible: readonly OhlcBar[],
  ): void {
    const scale = this.scales.get("price");
    const pane = this.paneGeometry().find((p) => p.id === "price");
    if (!scale || !pane || this.panes?.find((p) => p.id === "price")?.collapsed)
      return;
    const renderer =
      (this.options.seriesRenderers ?? builtInSeriesRenderers).find(
        (r) => r.id === this.chartType,
      ) ?? builtInSeriesRenderers.find((r) => r.id === this.chartType);
    renderer?.draw({
      context,
      scale,
      pane,
      visible,
      startIndex,
      barSpacing: this.timeScale.barSpacing,
      logicalToCoordinate: (index) => this.timeScale.indexToCoordinate(index),
      timeToCoordinate: time => this.timeScale.timeToCoordinate(time),
      isTimeSegmentContinuous: (a,b) => !crossesMarketTimeGap(a,b,this.discontinuities),
      theme: this.options.theme,
      presentation: this.options.presentation,
    });
  }

  private drawVolume(
    context: CanvasRenderingContext2D,
    startIndex: number,
    visible: readonly OhlcBar[],
  ): void {
    const panes = this.volumePanes();
    panes.forEach((pane) => {
      const maximum = visible.reduce((n, b) => Math.max(n, b.volume ?? 0), 1);
      const scale = this.hasVolumeAxis(pane.id) ? this.scales.get(pane.id) : undefined;
      const baseline = scale?.toCoordinate(0) ?? pane.top + pane.height;
      const width = Math.max(1, Math.min(12, this.timeScale.barSpacing * 0.7));
      context.save();
      context.beginPath();
      context.rect(pane.left ?? 0, pane.top, pane.width, pane.height);
      context.clip();
      visible.forEach((bar, offset) => {
        if (isMarketTimeInGap(bar.time, this.discontinuities)) return;
        if (bar.volume == null || !Number.isFinite(bar.volume) || bar.volume <= 0) return;
        const height =
          scale ? baseline - scale.toCoordinate(bar.volume)! :
          (bar.volume / maximum) * (pane.height - 30) * (pane.id === "volume" ? 0.85 : 0.35);
        context.fillStyle =
          bar.close >= bar.open
            ? this.options.theme.positive
            : this.options.theme.negative;
        context.globalAlpha = 0.25;
        context.fillRect(
          this.timeScale.indexToCoordinate(startIndex + offset) - width / 2,
          baseline - height,
          width,
          height,
        );
      });
      context.restore();
    });
  }

  private visibleStudyPoints(series: IndicatorRenderSeries) {
    const range = this.timeScale.visibleTimes();
    if (!range) return [];
    // Retain adjacent points for clipped strokes. Nulls remain in the sequence.
    const points = series.points;
    const bound = (key: number, after = false) => { let low=0,high=points.length; while(low<high){const mid=(low+high)>>>1, value=marketTimeKey(points[mid].time);if(value<key||after&&value===key)low=mid+1;else high=mid;}return low; };
    const from = bound(marketTimeKey(range.from)), to = bound(marketTimeKey(range.to), true);
    return points.slice(Math.max(0, from-1), Math.min(points.length, to+1));
  }
  private drawIndicators(context: CanvasRenderingContext2D, _startIndex: number, _visibleLength: number): void {
    const shadedPanes = new Set<string>();
    this.indicatorSeries.forEach((series) => {
      const scale = this.scales.get(
        series.placement === "overlay" ? "price" : series.paneId,
      );
      if (!scale) return;
      const pane = this.paneGeometry().find(
        (p) =>
          p.id === (series.placement === "overlay" ? "price" : series.paneId),
      );
      if (!pane || this.panes?.find((p) => p.id === pane.id)?.collapsed) return;
      context.save();
      context.beginPath();
      context.rect(pane.left ?? 0, pane.top, pane.width, pane.height);
      context.clip();
      if (
        !shadedPanes.has(pane.id) &&
        series.referenceLines &&
        series.referenceLines.length >= 2
      ) {
        const y1 = scale.toCoordinate(series.referenceLines[0].value);
        const y2 = scale.toCoordinate(series.referenceLines[1].value);
        if (y1 != null && y2 != null) {
          context.fillStyle = series.color;
          shadedPanes.add(pane.id);
          context.globalAlpha = 0.12;
          context.fillRect(
            pane.left ?? 0,
            Math.min(y1, y2),
            pane.width,
            Math.abs(y2 - y1),
          );
          context.globalAlpha = 1;
        }
      }
      const visiblePoints = this.visibleStudyPoints(series);
      context.strokeStyle = series.color;
      context.fillStyle = series.color;
      context.lineWidth = series.placement === "pane" ? 1.8 : 1.5;
      context.beginPath();
      let started = false;
      let previous: MarketTime | undefined;
      let singleton: {x:number;y:number} | null = null;
      const finishSingleton = () => { if (singleton) context.fillRect(singleton.x-2, singleton.y-2, 4, 4); singleton = null; };
      visiblePoints.forEach((point) => {
        if (point.value == null || isMarketTimeInGap(point.time, this.discontinuities)) {
          finishSingleton(); previous = undefined; started = false;
          return;
        }
        const x = this.timeScale.timeToCoordinate(point.time);
        const y = scale.toCoordinate(point.value);
        if (x == null || y == null) { finishSingleton(); started = false; previous = undefined; return; }
        if (previous != null && crossesMarketTimeGap(previous, point.time, this.discontinuities)) { finishSingleton(); started = false; }
        previous = point.time;
        if (series.style === "histogram") {
          const zero = scale.toCoordinate(0) ?? y;
          context.fillRect(
            x - Math.max(1, this.timeScale.barSpacing * 0.3),
            Math.min(y, zero),
            Math.max(1, this.timeScale.barSpacing * 0.6),
            Math.abs(zero - y),
          );
        } else if (!started) {
          context.moveTo(x, y);
          singleton = {x,y}; started = true;
        } else { singleton = null; context.lineTo(x, y); }
      });
      if (series.style === "line") { finishSingleton(); context.stroke(); }
      series.referenceLines?.forEach((line) => {
        const y = scale.toCoordinate(line.value);
        if (y == null) return;
        context.save();
        context.strokeStyle = line.color ?? this.options.theme.border;
        context.setLineDash([4, 4]);
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(this.width - AXIS_WIDTH, y);
        context.stroke();
        context.restore();
      });
      context.restore();
    });
  }

  private drawOverlays(context: CanvasRenderingContext2D): void {
    const scale = this.scales.get("price");
    if (!scale) return;
    this.priceLines.forEach((line) => {
      const y = scale.toCoordinate(line.price);
      if (y == null) return;
      context.strokeStyle = line.color;
      context.setLineDash([5, 4]);
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(this.width - AXIS_WIDTH, y);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = line.color;
      context.fillText(line.label, 6, y - 4);
    });
    [...this.markers, ...this.overlayMarkers].forEach((marker) => {
      const index = this.store.indexOf(marker.time);
      const bar = this.store.at(index);
      if (!bar) return;
      const x = this.timeScale.indexToCoordinate(index);
      const base =
        marker.position === "belowBar"
          ? bar.low
          : marker.position === "aboveBar"
            ? bar.high
            : bar.close;
      const y = scale.toCoordinate(base);
      if (y == null) return;
      const offset = marker.position === "belowBar" ? 12 : -12;
      context.fillStyle = marker.color ?? this.options.theme.text;
      this.drawMarkerShape(context, marker.shape ?? "circle", x, y + offset);
      if (marker.text) context.fillText(marker.text, x + 7, y + offset + 4);
    });
  }

  private drawSessions(context: CanvasRenderingContext2D): void {
    const pricePane = this.paneGeometry().find((pane) => pane.id === "price");
    if (!pricePane) return;
    this.sessions.forEach((session) => {
      const from = this.timeScale.timeToCoordinate(session.from);
      const to = this.timeScale.timeToCoordinate(session.to);
      if (from == null || to == null) return;
      context.fillStyle = session.color ?? this.options.theme.grid;
      context.globalAlpha = 0.22;
      context.fillRect(
        Math.min(from, to),
        pricePane.top,
        Math.abs(to - from),
        pricePane.height,
      );
      context.globalAlpha = 1;
      if (session.label) {
        context.fillStyle = this.options.theme.text;
        context.fillText(
          session.label,
          Math.min(from, to) + 4,
          pricePane.top + 14,
        );
      }
    });
  }

  private drawMarkerShape(
    context: CanvasRenderingContext2D,
    shape: NonNullable<MarketMarker["shape"]>,
    x: number,
    y: number,
  ): void {
    context.beginPath();
    if (shape === "square") context.rect(x - 4, y - 4, 8, 8);
    else if (shape === "arrowUp") {
      context.moveTo(x, y - 5);
      context.lineTo(x + 5, y + 4);
      context.lineTo(x - 5, y + 4);
      context.closePath();
    } else if (shape === "arrowDown") {
      context.moveTo(x, y + 5);
      context.lineTo(x + 5, y - 4);
      context.lineTo(x - 5, y - 4);
      context.closePath();
    } else context.arc(x, y, 4, 0, Math.PI * 2);
    context.fill();
  }

  private axisText(context:CanvasRenderingContext2D,text:string,x:number,y:number):void {
    const fontSize=Number.parseFloat(context.font)||11,width=AXIS_WIDTH-12;
    context.save();context.beginPath();context.rect(x-2,y-fontSize-2,AXIS_WIDTH-9,fontSize+8);context.clip();
    let label=text;
    if((context.measureText(label)?.width??label.length*6)>width&&/^-?\d+(?:\.\d+)?%?$/.test(text)){
      const percent=text.endsWith("%"),number=Number.parseFloat(text);
      label=new Intl.NumberFormat(this.options.locale,{notation:"compact",maximumSignificantDigits:4}).format(number)+(percent?"%":"");
      if((context.measureText(label)?.width??label.length*6)>width)label=number.toExponential(2)+(percent?"%":"");
    }
    while(label.length>1&&(context.measureText(label)?.width??label.length*6)>width)label=label.slice(0,-2)+"…";
    context.fillText(label,x,y);context.restore();
  }
  private presentationColor(color:string|undefined,fallback:string):string {return color?color.replace(/var\((--[\w-]+)\)/g,(_,token:string)=>getComputedStyle(this.container).getPropertyValue(token).trim()||"215 20% 50%"):fallback;}
  private drawCrosshair(context: CanvasRenderingContext2D): void {
    const appearance=this.options.presentation?.crosshair;if(!this.crosshair||appearance?.visible===false)return;
    const {x,y}=this.crosshair.coordinates;
    context.strokeStyle=this.presentationColor(appearance?.color,this.options.theme.text);context.lineWidth=appearance?.lineWidth??1;context.globalAlpha=appearance?.opacity??.55;
    context.setLineDash(appearance?.dash==="solid"?[]:appearance?.dash==="dotted"?[1,3]:[3,3]);context.beginPath();context.moveTo(x,0);context.lineTo(x,this.height-TIME_AXIS_HEIGHT);context.moveTo(this.plotLeft,y);context.lineTo(this.width-AXIS_WIDTH,y);context.stroke();context.setLineDash([]);context.globalAlpha=1;
    if(appearance?.labels===false)return;
    const background=this.presentationColor(appearance?.labelBackground,this.options.theme.text),foreground=this.presentationColor(appearance?.labelColor,this.options.theme.background);
    context.font=(this.options.presentation?.axis?.fontSize??11)+"px ui-sans-serif, system-ui";
    const label=formatTime(this.crosshair.time,this.options.locale,this.options.timeZone),width=Math.min(this.timeScale.plotWidth,(context.measureText(label)?.width??label.length*6)+12),left=Math.max(this.plotLeft,Math.min(this.width-AXIS_WIDTH-width,x-width/2));
    context.fillStyle=background;roundedRect(context,left,this.height-TIME_AXIS_HEIGHT+3,width,20);context.fillStyle=foreground;context.fillText(label,left+6,this.height-11,width-12);
    const pane=this.paneGeometry().find(p=>p.id===this.crosshair!.paneId),scale=this.scales.get(this.crosshair.paneId),price=scale?.fromCoordinate(y);
    if(pane&&scale&&price!=null){const h=Math.max(18,(this.options.presentation?.axis?.fontSize??11)+7),axisX=this.panes?.find(p=>p.id===pane.id)?.scaleSide==="left"?0:this.width-AXIS_WIDTH,top=Math.max(pane.top+h/2,Math.min(pane.top+pane.height-h/2,y));context.fillStyle=background;context.fillRect(axisX+1,top-h/2,AXIS_WIDTH-1,h);context.fillStyle=foreground;this.axisText(context,scale.formatPrice(price,this.panes?.find(p=>p.id===pane.id)?.precision??2),axisX+7,top+(this.options.presentation?.axis?.fontSize??11)*.35);}
  }

  private updateCrosshair(
    x: number,
    y: number,
    index = this.timeScale.coordinateToIndex(x),
    paneId = this.layout.paneAt(y)?.id ?? "price",
  ): void {
    const bar = this.store.at(index);
    const pointerTime = this.timeScale.coordinateToTime(x);
    if (!bar || isMarketTimeInGap(bar.time, this.discontinuities) || pointerTime != null && isMarketTimeInGap(pointerTime, this.discontinuities)) { this.clearCrosshairPosition(); return; }
    const values: Record<string, number | null> = {
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume ?? null,
    };
    this.indicatorSeries.forEach((series) => {
      values[series.id] = this.indicatorValues.get(series.id)?.get(marketTimeKey(bar.time)) ?? null;
    });
    const previousPaneId = this.crosshair?.paneId;
    this.crosshair = {
      time: bar.time,
      bar,
      paneId,
      coordinates: { x: this.timeScale.indexToCoordinate(index), y },
      values,
    };
    if (this.lastNotifiedBar !== index || previousPaneId !== paneId) {
      this.lastNotifiedBar = index;
      this.options.onCrosshairMove?.(bar.time);
      this.options.onCrosshairChange?.(this.crosshair);
    }
    this.scheduler.invalidate();
  }

  private pointerCoordinates(event: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  private dispatchLayerPointer(
    type: "pointerdown" | "pointermove" | "pointerup",
    event: PointerEvent,
    point: { x: number; y: number },
  ): boolean {
    const context = this.layerContext(
      this.store.range(
        this.timeScale.visibleIndexes().from,
        this.timeScale.visibleIndexes().to,
      ),
    );
    const hit = this.consumerLayers
      .slice()
      .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0))
      .find((layer) => layer.hitTest?.(point, context));
    if (!hit?.onPointerEvent) return false;
    hit.onPointerEvent(
      { type, x: point.x, y: point.y, sourceEvent: event },
      context,
    );
    return true;
  }

  private handlePointerDown = (event: PointerEvent): void => {
    const point = this.pointerCoordinates(event);
    if (this.dispatchLayerPointer("pointerdown", event, point)) return;
    this.canvas.setPointerCapture?.(event.pointerId);
    this.pointers.set(event.pointerId, point);
    const boundary = this.layout.boundaryAt(point.y);
    this.pointerStart = {
      ...point,
      lastX: point.x,
      lastY: point.y,
      boundary,
      axis:
        point.x >= this.width - AXIS_WIDTH || point.x < this.plotLeft
          ? "price"
          : point.y >= this.height - TIME_AXIS_HEIGHT
            ? "time"
            : undefined,
      shift: event.shiftKey,
    };
    if (event.pointerType === "touch")
      this.longPressTimer = setTimeout(
        () => this.updateCrosshair(point.x, point.y),
        450,
      );
  };
  private handlePointerMove = (event: PointerEvent): void => {
    const point = this.pointerCoordinates(event);
    if (this.pointers.has(event.pointerId))
      this.pointers.set(event.pointerId, point);
    if (
      !this.pointerStart &&
      this.dispatchLayerPointer("pointermove", event, point)
    )
      return;
    if (this.pointers.size === 2) {
      const [first, second] = [...this.pointers.values()];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      if (this.pinchDistance)
        this.timeScale.zoomAt(
          (first.x + second.x) / 2,
          this.pinchDistance / distance,
        );
      this.pinchDistance = distance;
      this.invalidate(true,{source:"user",gesture:"pinch"});
      return;
    }
    const start = this.pointerStart;
    if (start && (event.buttons || event.pointerType === "touch")) {
      if (
        Math.hypot(point.x - start.x, point.y - start.y) > 5 &&
        this.longPressTimer
      ) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
      const deltaX = point.x - start.lastX;
      const deltaY = point.y - start.lastY;
      if (start.axis === "price")
        this.adjustPriceScale(deltaY, Boolean(start.shift));
      else if (start.axis === "time")
        this.timeScale.zoomAt(start.x, Math.exp(deltaX * 0.01));
      else if (start.boundary >= 0) {
        const sizes = this.layout.resizeBoundary(start.boundary, deltaY);
        this.options.onPaneSizesChange?.(sizes,{source:"user",gesture:"pane-resize"});
      } else this.timeScale.panPixels(deltaX);
      start.lastX = point.x;
      start.lastY = point.y;
      this.invalidate(start.axis!=="price"&&start.boundary<0,{source:"user",gesture:start.axis==="time"?"time-scale":"pan"});
    } else this.updateCrosshair(point.x, point.y);
  };
  private handlePointerUp = (event: PointerEvent): void => {
    const point = this.pointerCoordinates(event);
    this.dispatchLayerPointer("pointerup", event, point);
    this.pointers.delete(event.pointerId);
    this.pointerStart = null;
    this.pinchDistance = 0;
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.longPressTimer = null;
  };
  private handlePointerLeave = (): void => {
    if (!this.pointerStart && this.viewport.inspection !== "persistent")
      this.clearCrosshairPosition();
  };
  private handleWheel = (event: WheelEvent): void => {
    if(event.ctrlKey||event.metaKey)return;
    event.preventDefault();
    const point = this.pointerCoordinates(event as unknown as PointerEvent);
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?this.height:1);
    this.timeScale.zoomAt(point.x, Math.exp(Math.max(-500,Math.min(500,delta)) * 0.0015));
    this.invalidate(true,{source:"user",gesture:"wheel"});
  };
  private handleDoubleClick = (event: MouseEvent): void => {
    const point = this.pointerCoordinates(event as PointerEvent);
    if (point.x >= this.width - AXIS_WIDTH || point.x < this.plotLeft) {
      this.scaleOptions = { mode: this.scaleMode, autoScale: true };
      this.options.onScaleChange?.(this.scaleOptions,{source:"user",gesture:"reset"});
      this.scheduler.invalidate();
    } else this.fitContent({source:"user",gesture:"reset"});
  };
  private handleKeyDown = (event: KeyboardEvent): void => {
    if(event.ctrlKey||event.metaKey)return;
    const current = this.crosshair
      ? this.store.nearestIndex(this.crosshair.time)
      : this.timeScale.visibleIndexes(0).to - 1;
    if (
      event.shiftKey &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      event.preventDefault();
      this.timeScale.panPixels(event.key === "ArrowLeft" ? 60 : -60);
      this.invalidate(true,{source:"user",gesture:"keyboard"});
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const index = Math.max(
        0,
        Math.min(
          this.store.length - 1,
          current + (event.key === "ArrowRight" ? 1 : -1),
        ),
      );
      const bar = this.store.at(index);
      if (bar) {
        this.updateCrosshair(
          this.timeScale.indexToCoordinate(index),
          this.scales.get("price")?.toCoordinate(bar.close) ?? 0,
          index,
        );
        if (this.crosshair) this.options.onKeyboardInspect?.(this.crosshair);
      }
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      this.timeScale.zoomAt((this.width - AXIS_WIDTH) / 2, 0.8);
      this.invalidate(true,{source:"user",gesture:"keyboard"});
    } else if (event.key === "-") {
      event.preventDefault();
      this.timeScale.zoomAt((this.width - AXIS_WIDTH) / 2, 1.25);
      this.invalidate(true,{source:"user",gesture:"keyboard"});
    } else if (event.key === "Home") {
      event.preventDefault();
      const span = this.timeScale.visible.to - this.timeScale.visible.from;
      const first = this.store.first;
      const end = this.store.at(
        Math.min(this.store.length - 1, Math.ceil(span)),
      );
      if (first && end)
        this.setVisibleRange({ from: first.time, to: end.time },{source:"user",gesture:"keyboard"});
    } else if (event.key === "End") {
      event.preventDefault();
      this.scrollToRealtime({source:"user",gesture:"keyboard"});
    }
  };

  private adjustPriceScale(delta: number, pan: boolean): void {
    const scale = this.scales.get("price");
    if (!scale) return;
    const range = scale.snapshot;
    const span = range.maximum - range.minimum;
    const midpoint = (range.maximum + range.minimum) / 2;
    const nextSpan = span * Math.exp(delta * 0.01);
    const shift = (delta / this.height) * span;
    this.scaleOptions = {
      mode: this.scaleMode,
      autoScale: false,
      manualRange: {
        minimum: pan ? range.minimum + shift : midpoint - nextSpan / 2,
        maximum: pan ? range.maximum + shift : midpoint + nextSpan / 2,
        anchor: range.anchor,
      },
    };
    scale.setRange(this.scaleOptions.manualRange!);
    this.options.onScaleChange?.(this.scaleOptions,{source:"user",gesture:"price-scale"});
  }
  private drawAxisBadges(context: CanvasRenderingContext2D): void {
    if (!this.panes||this.options.presentation?.badges?.visible===false) return;
    context.font = `${this.options.presentation?.badges?.fontSize ?? 11}px ui-sans-serif, system-ui`;
    this.paneGeometry().forEach((pane) => {
      if (this.panes?.find((p) => p.id === pane.id)?.collapsed) return;
      const scale = this.scales.get(pane.id);
      if (!scale) return;
      const badges: AxisBadge[] = [];
      const bar = this.store.latest;
      const precision =
        this.panes?.find((p) => p.id === pane.id)?.precision ?? 2;
      if (pane.id === "price" && bar && this.options.presentation?.badges?.lastPrice!==false) {
        const y = scale.toCoordinate(bar.close);
        if (y != null) {
          badges.push({
            id: "price",
            y,
            text: scale.formatPrice(bar.close, precision),
            color:
              bar.close >= bar.open
                ? this.options.theme.positive
                : this.options.theme.negative,
            priority: 100,
          });
          context.save();
          context.strokeStyle = this.options.theme.primary;
          context.setLineDash([3, 4]);
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo((pane.left ?? 0) + pane.width, y);
          context.stroke();
          context.restore();
        }
      }
      this.indicatorSeries
        .filter(
          (s) => (s.placement === "overlay" ? "price" : s.paneId) === pane.id,
        )
        .forEach((s) => {
          if(this.options.presentation?.badges?.studyValues===false)return;
          const value = s.points.at(-1)?.value;
          if (value == null) return;
          const y = scale.toCoordinate(value);
          if (y != null)
            badges.push({
              id: s.id,
              y,
              text: scale.formatPrice(value, precision),
              color: s.color,
              priority: 10,
            });
        });
      const axisX =
        this.panes?.find((p) => p.id === pane.id)?.scaleSide === "left"
          ? 0
          : (pane.left ?? 0) + pane.width;
      const badgeHeight=Math.max(18,(this.options.presentation?.badges?.fontSize??11)+7);
      layoutAxisBadges(badges, pane.top + 28, pane.height - 28,badgeHeight+1).forEach((b) => {
        if(this.crosshair?.paneId===pane.id&&this.options.presentation?.crosshair?.labels!==false&&this.options.presentation?.crosshair?.visible!==false&&Math.abs(b.y-this.crosshair.coordinates.y)<(badgeHeight+Math.max(18,(this.options.presentation?.axis?.fontSize??11)+7))/2+2)return;
        const outline=this.options.presentation?.badges?.style==="outline";context.fillStyle=outline?this.options.theme.background:b.color;context.fillRect(axisX+1,b.y-badgeHeight/2,AXIS_WIDTH-1,badgeHeight);if(outline){context.strokeStyle=b.color;context.strokeRect(axisX+1,b.y-badgeHeight/2,AXIS_WIDTH-2,badgeHeight);}
        context.fillStyle=outline?this.options.theme.text:this.badgeForeground(b.color);this.axisText(context,b.text,axisX+7,b.y+(this.options.presentation?.badges?.fontSize??11)*.35);
      });
    });
  }
  private badgeColors = new Map<string, string>();
  private badgeForeground(color: string): string {
    const cached = this.badgeColors.get(color);
    if (cached) return cached;
    const sample = document.createElement("canvas").getContext("2d");
    let foreground = this.options.theme.background;
    if (sample) {
      sample.fillStyle = color;
      sample.fillRect(0, 0, 1, 1);
      const pixel = sample.getImageData(0, 0, 1, 1)?.data;
      if (pixel) {
        const rgb = [pixel[0], pixel[1], pixel[2]].map((v) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        const luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
        foreground = luminance > 0.179 ? "#000000" : "#ffffff";
      }
    }
    this.badgeColors.set(color, foreground);
    return foreground;
  }
  private bindEvents(): void {
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointercancel", this.handlePointerUp);
    this.canvas.addEventListener("pointerleave", this.handlePointerLeave);
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false });
    this.canvas.addEventListener("dblclick", this.handleDoubleClick);
    this.canvas.addEventListener("keydown", this.handleKeyDown);
  }
  private unbindEvents(): void {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp);
    this.canvas.removeEventListener("pointerleave", this.handlePointerLeave);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.canvas.removeEventListener("dblclick", this.handleDoubleClick);
    this.canvas.removeEventListener("keydown", this.handleKeyDown);
  }
}

export function createMarketChartEngine(
  container: HTMLElement,
  options: MarketChartEngineOptions,
): MarketChartEngine {
  return new FirstPartyMarketChartEngine(container, options);
}
