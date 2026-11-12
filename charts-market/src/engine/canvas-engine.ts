import { marketRightPadding, validMarketManualRange, type MarketChartInteractions, type MarketChartInteractionState } from '../core';
import { WorkspaceGestureController, routeMarketWheel, type InteractionTarget } from './interactions';
import { validateMarketPresentation, type MarketChartPresentation, type MarketChartTheme, type MarketChartChangeMetadata } from "../core";
import { builtInSeriesRenderers } from "./series-renderers";
import type {
  MarketScaleOptions,
  MarketViewportOptions,
  TechnicalPaneState,
} from "../core";
import { layoutAxisBadges, type AxisBadge } from "./axis-badges";
import {automaticStudyDomain, layoutStudyTicks, tickPrecision, studyTickLabels} from './study-scale';
import {adaptiveBarGeometry} from './bar-geometry';
import {MovingAverageAxisLayer, movingAverageValueText, type MovingAverageLabel} from './moving-average-labels';
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
import {TimelineTickIndex, formatTimelineInspection} from './time-ticks';
import { PaneLayout } from "./pane-layout";
import { PriceScale } from "./price-scale";
import { RenderScheduler } from "./render-scheduler";
import {lineInspectionPoint} from './line-inspection';
import {acceptedPriceReferences,fitReferenceAxisValue} from './price-references';
import type {MarketPriceReference} from '../core';

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
  private lastLogicalKey = "";
  private emittedViewports: string[] = [];
  private tickIndex?: TimelineTickIndex;
  private timeTicks: NonNullable<MarketChartSnapshot['timeTicks']> = [];
  private tickPlanKey='';
  private tickPlanPresentation?: MarketChartPresentation['timeline'];
  private get timeline(): boolean { return this.options.presentation?.timeline != null || this.options.timeAxis?.futureDisplay != null; }
  private get priceAxisWidth(): number { return this.options.presentation?.timeline?.scaleControls === 'icons' ? 88 : AXIS_WIDTH; }
  private configureTimeline(): void { this.timeScale.setTimelinePadding(this.timeline ? this.options.presentation?.timeline?.rightPaddingBars ?? 10 : undefined); }
  private interactionState: MarketChartInteractionState = {};
  private gestures?: WorkspaceGestureController;
  private requestedHeight = 1;
  private get workspace(): boolean { return this.options.interactions?.mode === 'workspace'; }
  private get viewportEchoKey(): (value: MarketViewportOptions) => string { return value=>JSON.stringify([value.visibleRange,value.logicalRange]); }

  private indicatorValues = new Map<string, Map<number, number | null>>();
  private panes?: TechnicalPaneState[];
  private viewport: MarketViewportOptions = {};
  private scaleOptions: MarketScaleOptions = {
    mode: "normal",
    autoScale: true,
  };
  private lastNotifiedBar = -1;
  private canvas: HTMLCanvasElement;
  private surface: HTMLDivElement;
  private movingAverageAxis: MovingAverageAxisLayer;
  private endpointAxes = new Map<string, MovingAverageAxisLayer>();
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
  private priceReferences: MarketPriceReference[];
  private referenceBadgeExplanations: Array<{left:number;right:number;top:number;bottom:number;text:string}> = [];
  private sessions: MarketSessionRange[];
  private indicatorSeries: IndicatorRenderSeries[] = [];
  private overlays: ChartOverlayState[] = [];
  private consumerLayers: MarketRenderLayer[];
  private priceLines: PriceLine[] = [];
  private overlayMarkers: MarketMarker[] = [];
  private width: number;
  private height: number;
  private crosshair: MarketCrosshairSnapshot | null = null;
  private inspectionUnavailable=false;
  private futureInspection: MarketChartSnapshot['futureInspection'] = null;
  private linePointer: {x:number;y:number} | null = null;
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
    this.timeScale = new LogicalTimeScale(this.store, this.width, this.axisWidth);
    this.timeScale.setAxis(options.timeAxis);
    this.timeAxisKey = JSON.stringify(options.timeAxis ?? { mode: "compressed" });
    this.discontinuities = options.discontinuities ?? [];
    const geometryErrors = validateMarketTimeGeometry(options.timeAxis, this.discontinuities);
    if (geometryErrors.length) throw new Error(geometryErrors.join(" "));
    this.layout = new PaneLayout(
      this.width - this.axisWidth,
      this.height,
      TIME_AXIS_HEIGHT,
    );
    this.chartType = options.chartType;
    this.scaleMode = options.scaleMode;
    this.showVolume = options.showVolume;
    this.markers = options.markers.slice();
    this.priceReferences = acceptedPriceReferences(options.priceReferences);
    this.sessions = options.extendedSessions?.slice() ?? [];
    this.consumerLayers = options.renderLayers?.slice() ?? [];
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("role", "img");
    this.canvas.setAttribute("aria-label", "Interactive market price chart");
    this.canvas.tabIndex = 0;
    this.describePriceReferences();
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.canvas.style.height = `${this.height}px`;
    this.canvas.style.touchAction = "pan-y";
    this.canvas.style.userSelect = "none";
    this.context = this.canvas.getContext("2d");
    this.surface = document.createElement('div');
    this.surface.className = 'relative w-full';
    this.surface.appendChild(this.canvas);
    this.container.appendChild(this.surface);
    this.movingAverageAxis = new MovingAverageAxisLayer(this.surface);
    this.scheduler = new RenderScheduler(() => this.render());
    this.panes = options.panes;
    if (this.panes) this.canvas.style.touchAction = "none";
    this.viewport = options.viewport ?? {};
    this.configureTimeline();
    this.interactionState=options.interactionState??{};
    if((this.workspace || this.timeline) && !this.timeScale.isCalendar){const padding=this.timeline?options.presentation?.timeline?.rightPaddingBars??10:marketRightPadding(options.interactions?.rightPaddingBars);if(this.workspace)this.timeScale.setWorkspacePadding(padding);this.viewport={...this.viewport,rightOffsetBars:padding,minimumRightOffsetBars:0,maximumRightOffsetBars:150};}
    this.layout.setWorkspace(this.workspace);
    this.scaleOptions = options.scale ?? {
      mode: this.scaleMode,
      autoScale: true,
    };
    this.timeScale.setRightOffset(
      this.viewport.rightOffsetBars,
      this.viewport.minimumRightOffsetBars,
      this.viewport.maximumRightOffsetBars,
    );
    if(!this.applyViewport() && this.timeline)this.timeScale.fitContent();
    this.lastRangeKey = JSON.stringify(this.timeScale.visibleTimes());
    this.configureGestures();
    this.bindEvents();
    this.reconcilePanes();
    if (options.paneSizes) this.layout.setSizes(options.paneSizes);
    this.resize(this.width, this.height);
    this.scheduler.invalidate();
  }

  setInteractions(interactions?: MarketChartInteractions): void {
    const previous=this.options.interactions;
    const unchanged=previous?.mode===interactions?.mode&&previous?.contextKey===interactions?.contextKey&&previous?.rightPaddingBars===interactions?.rightPaddingBars&&previous?.scrollOwner===interactions?.scrollOwner;
    this.options.interactions=interactions;if(unchanged)return;if(this.workspace&&previous?.contextKey!==interactions?.contextKey)this.resetInteractionGeometry();if(!this.workspace)this.timeScale.clearWorkspacePadding();this.layout.setWorkspace(this.workspace);this.configureGestures();
    if(this.workspace && (!previous || previous.rightPaddingBars!==interactions?.rightPaddingBars) && !this.timeScale.isCalendar){this.timeScale.setWorkspacePadding(marketRightPadding(interactions?.rightPaddingBars));this.viewport={...this.viewport,rightOffsetBars:this.timeScale.rightOffsetBars};}
    this.reconcilePanes();this.resize(this.width,this.requestedHeight);
  }
  setInteractionState(state: MarketChartInteractionState): void { this.interactionState={...state};this.reconcilePanes();this.resize(this.width,this.requestedHeight); }
  resetPaneScale(paneId: string, metadata: MarketChartChangeMetadata={source:'api',gesture:'reset',paneId}): void {
    const paneScales={...this.interactionState.paneScales};delete paneScales[paneId];this.interactionState={...this.interactionState,paneScales};
    if(paneId==='price'){this.scaleOptions={mode:this.scaleMode,autoScale:true};this.options.onScaleChange?.(this.scaleOptions,metadata);}
    this.options.onInteractionStateChange?.(this.interactionState,metadata);this.scheduler.invalidate();
  }
  setViewportCommand(viewport: MarketViewportOptions): void {
    // Apply explicit commands even when they match an earlier emission, while
    // retaining acknowledgement history for old host callbacks still in flight.
    if(!viewport.logicalRange&&!viewport.visibleRange)this.timeScale.resetToLatest();
    this.applyViewportOptions(viewport, false);
  }
  resetInteractionGeometry(viewport: MarketViewportOptions={}): void {this.gestures?.cancel();this.emittedViewports=[];this.interactionState={};this.scaleOptions={mode:this.scaleMode,autoScale:true};this.clearCrosshairPosition();this.setViewportCommand(viewport);this.options.onInteractionStateChange?.({}, {source:'data',gesture:'reset',phase:'end'});this.reconcilePanes();this.resize(this.width,this.requestedHeight);}
  setTheme(theme: MarketChartTheme): void { this.options.theme = {...theme}; this.badgeColors.clear(); this.scheduler.invalidate(); }
  setPresentation(presentation: MarketChartPresentation): void { validateMarketPresentation(presentation); this.options.presentation=presentation; this.configureTimeline(); this.resize(this.width, this.workspace?this.requestedHeight:this.height); }
  setTimeAxis(axis?: MarketTimeAxis): void {
    const key = JSON.stringify(axis ?? { mode: "compressed" });
    if (key === this.timeAxisKey) return;
    const previous=this.timeScale.visibleTimes(),logical=this.timeScale.visible,sameMode=JSON.parse(this.timeAxisKey).mode===(axis?.mode??"compressed");
    const anchor=this.timeScale.coordinateToTime(this.plotLeft),oldAnchor=anchor==null?null:this.timeScale.timeToLogical(anchor);
    this.timeScale.setAxis(axis); this.timeAxisKey = key; this.options.timeAxis=axis;
    this.tickIndex=undefined;this.configureTimeline();
    if(sameMode&&this.timeline){const mapped=anchor==null?null:this.timeScale.timeToLogical(anchor),delta=mapped!=null&&oldAnchor!=null?mapped-oldAnchor:0;this.timeScale.setLogicalRange({from:logical.from+delta,to:logical.to+delta});this.refreshInspection();}
    else if(sameMode&&previous){this.timeScale.setVisibleTimes(previous.from,previous.to);this.refreshInspection();}else{this.applyViewport();this.clearCrosshairPosition();}this.lastRangeKey=JSON.stringify(this.timeScale.visibleTimes());this.scheduler.invalidate();
  }
  setDiscontinuities(gaps: readonly MarketTimeGap[]): void {
    const errors = validateMarketTimeGeometry(undefined, gaps);
    if (errors.length) throw new Error(errors.join(" "));
    if(JSON.stringify(gaps)===JSON.stringify(this.discontinuities))return;
    this.discontinuities=gaps.slice();this.refreshInspection();this.scheduler.invalidate();
  }
  shiftTime(time: MarketTime, steps: number): MarketTime | null { return this.timeScale.shiftTime(time, steps); }
  private applyViewport(): boolean {
    if (this.timeScale.isCalendar && !this.timeline && this.viewport.visibleRange) {
      this.viewport = withMarketVisibleRange(this.viewport, this.viewport.visibleRange);
      this.timeScale.setVisibleTimes(this.viewport.visibleRange!.from, this.viewport.visibleRange!.to);
    } else if (this.viewport.logicalRange) this.timeScale.setLogicalRange(this.viewport.logicalRange);
    else if (this.viewport.visibleRange) this.timeScale.setVisibleTimes(this.viewport.visibleRange.from, this.viewport.visibleRange.to);
    else return false;
    return true;
  }
  private refreshInspection(): void {
    if(this.futureInspection){const previous=this.futureInspection,x=this.timeScale.timeToCoordinate(previous.time);if(x==null)this.clearCrosshairPosition();else this.updateCrosshair(x,previous.coordinates.y,undefined,previous.paneId);return;}
    const previous=this.crosshair;if(!previous)return;
    const index=this.store.indexOf(previous.time);
    if(index<0){if(this.options.presentation?.ohlcInPaneHeader)this.setUnavailableInspection();else this.clearCrosshairPosition();return;}
    const x=this.timeScale.timeToCoordinate(previous.time);
    if(x==null){if(this.options.presentation?.ohlcInPaneHeader)this.setUnavailableInspection();else this.clearCrosshairPosition();return;}
    this.lastNotifiedBar=-1;this.updateCrosshair(x,previous.coordinates.y,index,previous.paneId);
  }
  setData(data: OhlcBar[]): void {
    const displayRange=this.timeScale.hasFutureDisplay?this.timeScale.visibleDisplayTimes():null;
    const previousRange=this.timeScale.visibleTimes(),logical=this.timeScale.visible,first=this.store.first?.time,previousLength=this.store.length;
    const wasRealtime=this.timeScale.isRealtime;
    this.store.replace(data);this.timeScale.setStore(this.store);
    this.tickIndex=undefined;
    if(displayRange&&!wasRealtime){
      const before=this.timeScale.timeToLogical(displayRange.from),after=this.timeScale.timeToLogical(displayRange.to);
      if(before!=null&&after!=null)this.timeScale.setLogicalRange({from:before,to:after});
      else this.timeScale.setLogicalRange(logical);
    }else if(first!=null&&this.store.first&&marketTimeKey(first)===marketTimeKey(this.store.first.time)) {
      this.timeScale.setLogicalRange(logical);
      if(wasRealtime&&this.store.length>previousLength)this.timeScale.scrollToRealtime();
    }else if(previousRange)this.timeScale.setVisibleTimes(previousRange.from,previousRange.to);
    else if(!this.applyViewport())this.timeScale.resetToLatest();
    this.refreshInspection();this.lastRangeKey=JSON.stringify(this.timeScale.visibleTimes());this.scheduler.invalidate();
  }
  appendOrUpdate(bar: OhlcBar): void {
    const displayRange=this.timeScale.hasFutureDisplay?this.timeScale.visibleDisplayTimes():null,logical=this.timeScale.visible;
    const wasRealtime=this.timeScale.isRealtime,previousLength=this.store.length;
    this.store.appendOrUpdate(bar);this.timeScale.setStore(this.store);
    this.tickIndex=undefined;
    if(wasRealtime&&this.store.length>previousLength)this.timeScale.scrollToRealtime();
    else if(displayRange){const from=this.timeScale.timeToLogical(displayRange.from),to=this.timeScale.timeToLogical(displayRange.to);if(from!=null&&to!=null)this.timeScale.setLogicalRange({from,to});else if(to!=null)this.timeScale.setLogicalRange({from:to-(logical.to-logical.from),to});}
    this.refreshInspection();this.lastRangeKey=JSON.stringify(this.timeScale.visibleTimes());this.scheduler.invalidate();
  }
  resetScale():void {this.resetPaneScale("price",{source:"api",gesture:"reset",paneId:"price"});}
  setChartType(type: MarketChartType): void {
    this.chartType = type;
    this.scheduler.invalidate();
  }
  setScaleMode(mode: MarketScaleMode): void {
    if(this.workspace&&mode!==this.scaleMode){const paneScales={...this.interactionState.paneScales};delete paneScales.price;this.interactionState={...this.interactionState,paneScales};this.scaleOptions={mode,autoScale:true};this.options.onInteractionStateChange?.(this.interactionState,{source:'api',gesture:'reset',paneId:'price'});}
    this.scaleMode = mode;
    this.scales.get("price")?.setMode(mode);
    this.scheduler.invalidate();
  }
  setMarkers(markers: MarketMarker[]): void {
    this.markers = markers.slice();
    this.scheduler.invalidate();
  }
  setPriceReferences(references: readonly MarketPriceReference[]): void {
    this.priceReferences = acceptedPriceReferences(references);
    this.describePriceReferences();
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
    if(!this.panes){this.reconcilePanes();if(this.workspace)this.resize(this.width,this.requestedHeight);}this.refreshInspection();
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
    this.resize(this.width,this.requestedHeight);
    this.scheduler.invalidate();
  }
  setViewport(viewport: MarketViewportOptions): void {
    this.applyViewportOptions(viewport, true);
  }
  private applyViewportOptions(viewport: MarketViewportOptions, acknowledge: boolean): void {
    if((this.workspace||this.timeline)&&!this.timeScale.isCalendar)viewport={...viewport,rightOffsetBars:this.timeline?this.options.presentation?.timeline?.rightPaddingBars??10:marketRightPadding(this.options.interactions?.rightPaddingBars),minimumRightOffsetBars:0,maximumRightOffsetBars:150};
    if(acknowledge && (this.workspace||this.timeline) && this.emittedViewports.some(key=>key===this.viewportEchoKey(viewport) || (!viewport.logicalRange && JSON.stringify(JSON.parse(key)[0])===JSON.stringify(viewport.visibleRange??null))) && (viewport.rightOffsetBars??this.timeScale.rightOffsetBars)===this.timeScale.rightOffsetBars)return;
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
    this.setScaleMode(scale.mode);
    this.scaleOptions = scale;
    this.scheduler.invalidate();
  }
  setPaneSizes(sizes: Record<string, number>): void {
    this.layout.setSizes(sizes);
    if(this.workspace)this.resize(this.width,this.requestedHeight);
    this.scheduler.invalidate();
  }
  setVolumeVisible(visible: boolean): void {
    this.showVolume = visible;
    this.reconcilePanes();
    if(this.workspace)this.resize(this.width,this.requestedHeight);
    this.scheduler.invalidate();
  }
  resize(width: number, height: number): void {
    this.width = Math.max(1, width);
    this.requestedHeight = Math.max(1,Number.isFinite(height)?height:1);
    this.layout.setGeometry(this.width-this.axisWidth,this.requestedHeight);
    if(this.workspace && this.interactionState.maximizedPaneId)this.reconcilePanes();
    this.height=this.workspace?Math.max(this.requestedHeight,this.layout.contentHeight):this.requestedHeight;
    const ratio = Math.max(1, globalThis.devicePixelRatio || 1);
    // Assigning an identical bitmap size still clears Canvas2D and resets its
    // context. Parent rerenders and ResizeObserver deliveries must not blank it.
    const bitmapWidth=Math.round(this.width*ratio),bitmapHeight=Math.round(this.height*ratio);
    if(this.canvas.width!==bitmapWidth)this.canvas.width=bitmapWidth;
    if(this.canvas.height!==bitmapHeight)this.canvas.height=bitmapHeight;
    if(this.canvas.style.height!==`${this.height}px`)this.canvas.style.height=`${this.height}px`;
    this.timeScale.setWidth(this.width);
    this.timeScale.setRightInset(this.axisWidth);
    if(!this.workspace)this.layout.setGeometry(this.width - this.axisWidth, this.height);
    this.options.onContentHeightChange?.(this.height);
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
    if (x != null && y != null && this.timeScale.hasFutureDisplay && (!this.store.latest || marketTimeKey(time)>marketTimeKey(this.store.latest.time))) {this.updateCrosshair(x,y,-1,"price");return;}
    if (x == null || y == null || index < 0) { if (this.timeScale.isCalendar||this.options.presentation?.ohlcInPaneHeader){this.linePointer=null;this.setUnavailableInspection();} return; }
    this.updateCrosshair(x, y, index, "price");
  }
  clearCrosshairPosition(): void {
    const unavailable=this.inspectionUnavailable;this.inspectionUnavailable=false;
    this.linePointer = null;
    this.futureInspection = null;
    this.crosshair = null;
    this.lastNotifiedBar = -1;
    this.options.onCrosshairMove?.(null);
    this.options.onCrosshairChange?.(null);
    if(unavailable)this.options.onSnapshotChange?.(this.getSnapshot());
    this.scheduler.invalidate();
  }
  coordinateForTime(time: MarketTime): number | null {
    return this.timeScale.timeToCoordinate(time);
  }
  logicalForTime(time: MarketTime): number | null { return this.timeScale.timeToLogical(time); }
  timeForLogical(logical: number): MarketTime | null {
    const maximum=this.timeScale.futureDisplayBounds?.maximum??(this.timeScale.isCalendar?this.timeScale.maximum:this.store.length-1);
    if(!Number.isFinite(logical)||logical<0||logical>maximum)return null;
    return this.timeScale.coordinateToTime(this.timeScale.logicalToCoordinate(logical));
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
      inspectionUnavailable:this.inspectionUnavailable,
      timeAxis: {left:this.plotLeft,top:this.height-TIME_AXIS_HEIGHT,width:this.width-this.axisWidth-this.plotLeft,height:TIME_AXIS_HEIGHT,futureFrom:this.timeScale.futureDisplayBounds?.time},
      futureInspection: this.futureInspection ? {...this.futureInspection,coordinates:{...this.futureInspection.coordinates}} : null,
      lineInspection: this.lineInspection(),
      viewport: {...this.viewport,logicalRange:this.timeScale.isCalendar&&!this.timeline?undefined:this.timeScale.visible,visibleRange:this.timeScale.visibleTimes()??undefined},
      scale: {...(this.interactionState.paneScales?.price??this.scaleOptions),manualRange:(this.interactionState.paneScales?.price??this.scaleOptions).manualRange?{...(this.interactionState.paneScales?.price??this.scaleOptions).manualRange!}:undefined},
      priceAxis: {left:this.panes?.find(p=>p.id==='price')?.scaleSide==='left'?0:this.rightScaleX,width:this.priceAxisWidth,surfaceWidth:this.width,side:this.panes?.find(p=>p.id==='price')?.scaleSide==='left'?'left':'right'},
      timeTicks: this.timeline ? this.timeTicks.map(t=>({...t})) : undefined,
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
    this.linePointer = null;
    this.scheduler.destroy();
    this.gestures?.cancel();
    this.unbindEvents();
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.movingAverageAxis.destroy();
    this.endpointAxes.forEach(layer => layer.destroy());
    this.surface.remove();
  }

  private paneCollapsed(id: string): boolean {return this.workspace&&this.interactionState.maximizedPaneId===id?false:!!this.panes?.find(p=>p.id===id)?.collapsed;}
  private get allEndpointValues(): boolean { return this.options.presentation?.badges?.endpointValues === 'all-visible' && this.options.presentation.badges.visible !== false; }
  private get endpointFontSize(): number { return Math.max(11, this.options.presentation?.badges?.fontSize ?? 11) * Math.max(1, (Number.parseFloat(getComputedStyle(this.container).fontSize) || 16) / 16); }
  private get endpointGutterWidth(): number { return this.allEndpointValues ? Math.ceil(Math.max(40, Math.min(Math.max(96, this.endpointFontSize * 6.5 + 28), this.width - this.priceAxisWidth - this.plotLeft - 48))) : 0; }
  private get axisWidth(): number { return this.priceAxisWidth + this.endpointGutterWidth; }
  private get rightScaleX(): number { return this.width - this.priceAxisWidth; }
  private get plotLeft(): number {
    return this.panes?.some(
      (p) => p.visible !== false && p.scaleSide === "left",
    )
      ? this.priceAxisWidth
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
    if (this.panes) {
      const focused=this.workspace?this.panes.find(p=>p.id===this.interactionState.maximizedPaneId&&p.visible!==false):undefined;
      this.layout.setDefinitions(focused?[{...focused,collapsed:false,size:Math.max(.01,(this.requestedHeight-TIME_AXIS_HEIGHT)/100)}]:this.panes);
    }
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

  private invalidate(notifyRange = false, metadata: MarketChartChangeMetadata = {source:'api'}): void {
    const range=this.timeScale.visibleTimes(),rangeKey=JSON.stringify(range),logicalKey=JSON.stringify(this.timeScale.visible);
    const economicChanged=rangeKey!==this.lastRangeKey,logicalChanged=logicalKey!==this.lastLogicalKey;
    this.lastRangeKey=rangeKey;this.lastLogicalKey=logicalKey;
    if(notifyRange && economicChanged && (!(this.workspace||this.timeline) || range))this.options.onVisibleRangeChange?.(range,metadata);
    if(notifyRange && (this.workspace||this.timeline?logicalChanged:economicChanged)){
      const viewport={...this.viewport,logicalRange:this.timeScale.isCalendar&&!this.timeline?undefined:this.timeScale.visible,visibleRange:range??undefined};
      this.emittedViewports.push(this.viewportEchoKey(viewport));if(this.emittedViewports.length>256)this.emittedViewports.shift();
      this.options.onViewportChange?.(viewport,metadata);
    }
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
    if(this.futureInspection){const x=this.timeScale.timeToCoordinate(this.futureInspection.time);if(x!=null)this.futureInspection.coordinates.x=x;}
    if (this.crosshair)
      this.crosshair.coordinates.x =
        this.timeScale.timeToCoordinate(this.crosshair.time) ??
        this.crosshair.coordinates.x;
    const layerContext = this.layerContext(visible);
    this.resolveTimeTicks(context);
    this.options.onSnapshotChange?.(this.getSnapshot());
    this.drawMovingAverageLabels();
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
      {id:'supplied-price-references',zIndex:15,paneId:'price',draw:()=>this.drawPriceReferences(context)},
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
    this.drawEndpointLabels();
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
        const header = this.options.presentation?.paneHeaderHeights?.[id] ?? 28;
        scale.setGeometry(
          pane.top +
            (this.panes
              ? id === "price"
                ? pane.width < 400
                  ? header + (this.options.presentation?.ohlcInPaneHeader?0:32)
                  : this.options.presentation?.ohlcInPaneHeader?header:this.options.presentation?.paneHeaderHeights?.[id] != null ? header + 32 : header + 24
                : header
              : 6),
          pane.height -
            (this.panes
              ? id === "price"
                ? pane.width < 400
                  ? header + (this.options.presentation?.ohlcInPaneHeader?28:60)
                  : this.options.presentation?.ohlcInPaneHeader?header+28:this.options.presentation?.paneHeaderHeights?.[id] != null ? header + 60 : header + 52
                : header + 10
              : 12),
        );
        scale.setMode(
          id === "price"
            ? this.scaleMode
            : (this.panes?.find((p) => p.id === id)?.scaleMode ?? "normal"),
        );
      }
    });
    // Presentation-only blank space has no new value evidence. Keep the last
    // valid automatic domains (and apply explicit manual changes) while there.
    const exact=this.timeScale.visibleIndexes(0);
    if(this.timeline&&this.store.length>0&&exact.to<=exact.from){
      if(!this.scaleOptions.autoScale&&this.scaleOptions.manualRange)this.scales.get('price')?.setRange(this.scaleOptions.manualRange);
      if(this.workspace)Object.entries(this.interactionState.paneScales??{}).forEach(([id,options])=>{if(!options.autoScale&&validMarketManualRange(options.manualRange)){this.scales.get(id)?.setMode(options.mode);this.scales.get(id)?.setRange(options.manualRange!);}});
      return;
    }
    const priceValues = visible.flatMap((bar) => [bar.low, bar.high]);
    this.indicatorSeries
      .filter((series) => series.placement === "overlay")
      .forEach((series) =>
        this.visibleStudyPoints(series, false)
          .forEach((point) => {
            // A tagged MA that cannot exist on a log axis remains in its explicit
            // unpositioned value box; it must not blank otherwise valid OHLC data.
            const unpositionableMovingAverage = (this.allEndpointValues || this.options.presentation?.badges?.movingAverages === 'all-visible' && series.axisLabel?.kind === 'moving-average') && this.scaleMode === 'logarithmic' && point.value != null && point.value <= 0;
            if (point.value != null && !unpositionableMovingAverage) priceValues.push(point.value);
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
        this.visibleStudyPoints(series, false)
          .filter((point) => point.value != null)
          .map((point) => point.value as number),
      );
      const fixedDomain = seriesGroup.find(
        (series) => series.fixedDomain,
      )?.fixedDomain;
      const references = seriesGroup.flatMap(series => series.referenceLines?.map(line => line.value) ?? []);
      const policy = seriesGroup.find(series => series.automaticDomain)?.automaticDomain;
      this.scales.get(paneId)?.autoscale(values, undefined, fixedDomain ?? automaticStudyDomain(values, references, policy));
    });
    // Explicit volume panes are independent of the legacy showVolume switch.
    // Keep their axis and histogram in the same supplied volume units.
    const maximumVolume = visible.reduce((maximum, bar) =>
      Number.isFinite(bar.volume) ? Math.max(maximum, bar.volume ?? 0) : maximum, 0);
    this.volumePanes().forEach((pane) => {
      if (!this.hasVolumeAxis(pane.id)) return;
      const scale = this.scales.get(pane.id);
      scale?.setMode(this.workspace?(this.panes?.find(p=>p.id===pane.id)?.scaleMode??"normal"):"normal");
      scale?.setRange({minimum: 0, maximum: maximumVolume > 0 ? Math.min(Number.MAX_VALUE, maximumVolume * 1.1) : 1});
    });
    if(this.workspace)Object.entries(this.interactionState.paneScales??{}).forEach(([id,options])=>{if(!options.autoScale && validMarketManualRange(options.manualRange)){const scale=this.scales.get(id);scale?.setMode(options.mode);scale?.setRange(options.manualRange!);}});
  }

  private layerContext(
    visibleData: readonly OhlcBar[],
  ): MarketRenderLayerContext {
    const plotBounds = {
      x: this.plotLeft,
      y: 0,
      width: this.width - this.axisWidth - this.plotLeft,
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
                : this.rightScaleX,
            y: p.top,
            width: this.priceAxisWidth,
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
      resolveColor: color => this.presentationColor(color, this.options.theme.primary),
      canvas: this.context!,
      timeToCoordinate: (time) => this.timeScale.timeToCoordinate(time),
      priceToCoordinate: (price, paneId = "price") =>
        this.scales.get(paneId)?.toCoordinate(price) ?? null,
    };
  }

  private resolveTimeTicks(context: CanvasRenderingContext2D): void {
    if(!this.timeline){this.timeTicks=[];this.tickPlanKey='';return;}
    const bounds=this.timeScale.visibleDisplayTimes();
    if(!bounds){this.timeTicks=[];this.tickPlanKey='';return;}
    const logical=this.timeScale.visible,key=JSON.stringify([logical,this.width,this.axisWidth,this.plotLeft,this.options.presentation?.axis?.fontSize]);
    if(this.tickIndex&&key===this.tickPlanKey&&this.tickPlanPresentation===this.options.presentation?.timeline)return;
    if(!this.tickIndex){const axis=this.options.timeAxis,observations=this.store.toArray().map(b=>b.time);this.tickIndex=new TimelineTickIndex(axis?.mode==='calendar'?axis.times:observations,this.options.locale,this.options.timeZone,observations);}
    this.tickPlanKey=key;this.tickPlanPresentation=this.options.presentation?.timeline;
    context.font=`${this.options.presentation?.axis?.fontSize??11}px ui-monospace, monospace`;
    const a=this.timeScale.timeToLogical(bounds.from),b=this.timeScale.timeToLogical(bounds.to),spanSeconds=a!=null&&b!=null&&b>a?(marketTimeKey(bounds.to)-marketTimeKey(bounds.from))*(logical.to-logical.from)/(b-a):0;
    this.timeTicks=this.tickIndex.plan({presentation:this.options.presentation?.timeline??{},futureFrom:this.timeScale.futureDisplayBounds?.time,from:marketTimeKey(bounds.from),to:marketTimeKey(bounds.to),spanSeconds,left:this.plotLeft,right:this.width-this.axisWidth,coordinate:t=>this.timeScale.timeToCoordinate(t),measure:s=>context.measureText(s)?.width});
  }

  private drawGridAndAxes(context: CanvasRenderingContext2D): void {
    this.referenceTickPositions.clear();
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
        definition?.scaleSide === "left" ? 7 : this.rightScaleX + 7;
      const bounded = this.indicatorSeries.find(
        (s) => s.paneId === pane.id && s.fixedDomain,
      );
      const references = [...new Set(this.indicatorSeries.filter(series => series.placement === 'pane' && series.paneId === pane.id).flatMap(series => series.referenceLines?.map(line => line.value) ?? []))];
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
      const fontSize = this.options.presentation?.axis?.fontSize ?? 11;
      const contentTop = pane.top + (this.options.presentation?.paneHeaderHeights?.[pane.id] ?? 28);
      const placed = layoutStudyTicks(ticks, references, value => scale.toCoordinate(value), contentTop, pane.top + pane.height - 7, Math.max(fontSize + 8, Math.min(this.options.presentation?.axis?.minimumTickSpacing ?? 48, 32)));
      this.referenceTickPositions.set(pane.id, placed.filter(tick => tick.reference).map(tick => tick.y));
      const precision = definition?.precision ?? (pane.id === 'price' ? 2 : bounded ? 0 : tickPrecision(placed.map(tick => tick.value)));
      const automaticLabels = definition?.precision == null && pane.id !== 'price' && !bounded && (scale.mode === 'normal' || scale.mode === 'logarithmic') ? studyTickLabels(placed.map(tick => tick.value)) : undefined;
      placed.forEach(({value, y}, index) => {
        context.beginPath();
        context.moveTo(pane.left ?? 0, y + 0.5);
        context.lineTo((pane.left ?? 0) + pane.width, y + 0.5);
        if(this.options.presentation?.grid?.horizontal!==false){context.globalAlpha=this.options.presentation?.grid?.opacity??1;context.stroke();context.globalAlpha=1;}
        this.axisText(context,
          automaticLabels?.[index] ?? scale.formatPrice(value, precision),
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
      Math.min(12, Math.floor((this.width - this.axisWidth - this.plotLeft) / (this.options.presentation?.axis?.timeTickSpacing ?? 160))),
    );
    let previousLabelEnd=-Infinity;
    if(this.timeline){
      for(const tick of this.timeTicks){
        context.beginPath();context.moveTo(tick.x+.5,0);context.lineTo(tick.x+.5,this.height-TIME_AXIS_HEIGHT);
        if(this.options.presentation?.grid?.vertical!==false){context.globalAlpha=this.options.presentation?.grid?.opacity??1;context.stroke();context.globalAlpha=1;}
        context.fillText(tick.label,tick.left,this.height-9);
      }
    }else for (let tick = 0; tick <= timeTickCount; tick += 1) {
      const x =
        this.plotLeft +
        ((this.width - this.axisWidth - this.plotLeft) * tick) / timeTickCount;
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
      if(tickTime!=null){const label=formatTime(tickTime,this.options.locale,this.options.timeZone),labelWidth=(context.measureText(label)?.width??label.length*6);const left=Math.max(this.plotLeft+2,Math.min(this.width-this.axisWidth-labelWidth-2,x-labelWidth/2));if(left>=previousLabelEnd+8){context.fillText(label,left,this.height-9);previousLabelEnd=left+labelWidth;}}
    }
    context.strokeStyle = this.options.theme.border;
    context.beginPath();
    context.moveTo(this.width - this.axisWidth + 0.5, 0);
    context.lineTo(this.width - this.axisWidth + 0.5, this.height);
    context.stroke();
  }

  private drawPriceSeries(
    context: CanvasRenderingContext2D,
    startIndex: number,
    visible: readonly OhlcBar[],
  ): void {
    const scale = this.scales.get("price");
    const pane = this.paneGeometry().find((p) => p.id === "price");
    if (!scale || !pane || this.paneCollapsed("price"))
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
      pixelRatio: Math.max(1, globalThis.devicePixelRatio || 1),
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
        const center = this.timeScale.indexToCoordinate(startIndex + offset);
        const geometry = this.options.presentation?.volume?.widthMode === 'adaptive'
          ? adaptiveBarGeometry(center, this.timeScale.barSpacing, this.options.presentation.volume.gap, Math.max(1, globalThis.devicePixelRatio || 1))
          : {left: center - width / 2, width, center};
        if (!geometry || !Number.isFinite(center)) return;
        const height =
          scale ? baseline - scale.toCoordinate(bar.volume)! :
          (bar.volume / maximum) * (pane.height - 30) * (pane.id === "volume" ? 0.85 : 0.35);
        context.fillStyle =
          bar.close >= bar.open
            ? this.options.theme.positive
            : this.options.theme.negative;
        context.globalAlpha = 0.25;
        context.fillRect(
          geometry.left,
          baseline - height,
          geometry.width,
          height,
        );
      });
      context.restore();
    });
  }

  private visibleStudyPoints(series: IndicatorRenderSeries, includeAdjacent = true) {
    const range = this.timeScale.visibleTimes();
    if (!range) return [];
    // Retain adjacent points for clipped strokes. Nulls remain in the sequence.
    const points = series.points;
    const bound = (key: number, after = false) => { let low=0,high=points.length; while(low<high){const mid=(low+high)>>>1, value=marketTimeKey(points[mid].time);if(value<key||after&&value===key)low=mid+1;else high=mid;}return low; };
    const from = bound(marketTimeKey(range.from)), to = bound(marketTimeKey(range.to), true);
    return points.slice(Math.max(0, from - (includeAdjacent ? 1 : 0)), Math.min(points.length, to + (includeAdjacent ? 1 : 0)));
  }
  private drawIndicators(context: CanvasRenderingContext2D, _startIndex: number, _visibleLength: number): void {
    const shadedPanes = new Set<string>();
    const drawnReferences = new Set<string>();
    this.indicatorSeries.forEach((series) => {
      const scale = this.scales.get(
        series.placement === "overlay" ? "price" : series.paneId,
      );
      if (!scale) return;
      const pane = this.paneGeometry().find(
        (p) =>
          p.id === (series.placement === "overlay" ? "price" : series.paneId),
      );
      if (!pane || this.paneCollapsed(pane.id)) return;
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
          context.fillStyle = this.presentationColor(series.color, this.options.theme.primary);
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
      context.strokeStyle = this.presentationColor(series.color, this.options.theme.primary);
      context.fillStyle = this.presentationColor(series.color, this.options.theme.primary);
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
        const referenceId = `${pane.id}:${line.value}`;
        if (drawnReferences.has(referenceId)) return;
        drawnReferences.add(referenceId);
        const y = scale.toCoordinate(line.value);
        if (y == null) return;
        context.save();
        context.strokeStyle = this.presentationColor(line.color, this.options.theme.border);
        context.setLineDash([4, 4]);
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(this.width - this.axisWidth, y);
        context.stroke();
        context.restore();
        if (line.label && y >= pane.top + (this.options.presentation?.paneHeaderHeights?.[pane.id] ?? 28) && y <= pane.top + pane.height - 8) {
          context.save();
          context.font = `${this.options.presentation?.axis?.fontSize ?? 11}px ui-sans-serif, system-ui`;
          const maximumWidth = Math.max(0, pane.width - 16);
          let label = `${line.label} ${line.value}`;
          while (label.length > 1 && (context.measureText(label)?.width ?? label.length * 6) > maximumWidth) label = label.slice(0, -2) + '…';
          const labelWidth = context.measureText(label)?.width ?? label.length * 6;
          context.fillStyle = this.options.theme.background;
          const labelY = y - 16 >= pane.top + (this.options.presentation?.paneHeaderHeights?.[pane.id] ?? 28) ? y - 5 : Math.min(pane.top + pane.height - 7, y + 14);
          context.fillRect((pane.left ?? 0) + 6, labelY - 11, labelWidth + 5, 14);
          context.fillStyle = this.options.theme.text;
          context.fillText(label, (pane.left ?? 0) + 8, labelY);
          context.restore();
        }
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
      context.lineTo(this.width - this.axisWidth, y);
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

  private axisText(context:CanvasRenderingContext2D,text:string,x:number,y:number,laneWidth=AXIS_WIDTH):void {
    const fontSize=Number.parseFloat(context.font)||11,width=laneWidth-12;
    context.save();context.beginPath();context.rect(x-2,y-fontSize-2,laneWidth-9,fontSize+8);context.clip();
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
  private lineInspection(): MarketChartSnapshot['lineInspection'] {
    const marker=this.options.presentation?.crosshair?.lineMarker,pointer=this.linePointer,pane=this.paneGeometry().find(p=>p.id==='price'),scale=this.scales.get('price');
    if(!marker?.visible||this.options.presentation?.crosshair?.visible===false||this.chartType!=='line'||!pointer||!pane||!scale||this.paneCollapsed('price')||this.options.seriesRenderers?.some(r=>r.id==='line'))return null;
    if(pointer.x<(pane.left??0)||pointer.x>(pane.left??0)+pane.width||pointer.y<pane.top||pointer.y>pane.top+pane.height)return null;
    const axis=this.options.timeAxis,domain=axis?.mode==='calendar'?{from:axis.times[0],to:axis.times[axis.times.length-1]}:undefined;
    const point=lineInspectionPoint(this.store,pointer.x,t=>this.timeScale.timeToCoordinate(t),p=>scale.toCoordinate(p),this.discontinuities,domain);
    return point&&point.y>=pane.top&&point.y<=pane.top+pane.height?point:null;
  }
  private drawLineInspection(context:CanvasRenderingContext2D):void {
    const point=this.lineInspection(),marker=this.options.presentation?.crosshair?.lineMarker,pane=this.paneGeometry().find(p=>p.id==='price');if(!point||!marker||!pane)return;
    const forced=globalThis.matchMedia?.('(forced-colors: active)').matches;
    context.save();context.beginPath();context.rect(pane.left??0,pane.top,pane.width,pane.height);context.clip();context.setLineDash([]);context.globalAlpha=1;
    context.fillStyle=forced?'CanvasText':this.presentationColor(marker.fill,this.options.theme.primary);context.strokeStyle=forced?'Canvas':this.presentationColor(marker.stroke,this.options.theme.background);context.lineWidth=marker.strokeWidth??2;
    context.beginPath();context.arc(point.x,point.y,marker.radius??4,0,Math.PI*2);context.fill();context.stroke();context.restore();
  }
  private drawCrosshair(context: CanvasRenderingContext2D): void {
    this.drawLineInspection(context);
    const inspection=this.futureInspection??this.crosshair;
    const appearance=this.options.presentation?.crosshair;if(!inspection||appearance?.visible===false)return;
    const {x,y}=inspection.coordinates;
    context.strokeStyle=this.presentationColor(appearance?.color,this.options.theme.text);context.lineWidth=appearance?.lineWidth??1;context.globalAlpha=appearance?.opacity??.55;
    context.setLineDash(appearance?.dash==="solid"?[]:appearance?.dash==="dotted"?[1,3]:[3,3]);context.beginPath();context.moveTo(x,0);context.lineTo(x,this.height-TIME_AXIS_HEIGHT);context.moveTo(this.plotLeft,y);context.lineTo(this.width-this.axisWidth,y);context.stroke();context.setLineDash([]);context.globalAlpha=1;
    if(appearance?.labels===false)return;
    const background=this.presentationColor(appearance?.labelBackground,this.options.theme.text),foreground=this.presentationColor(appearance?.labelColor,this.options.theme.background);
    context.font=(this.options.presentation?.axis?.fontSize??11)+"px ui-sans-serif, system-ui";
    const label=this.futureInspection?formatTimelineInspection(inspection.time,this.options.locale,'UTC')+' · display':this.timeline?formatTimelineInspection(inspection.time,this.options.locale,this.options.timeZone):formatTime(inspection.time,this.options.locale,this.options.timeZone),width=Math.min(this.timeScale.plotWidth,(context.measureText(label)?.width??label.length*6)+12),left=Math.max(this.plotLeft,Math.min(this.width-this.axisWidth-width,x-width/2));
    context.fillStyle=background;roundedRect(context,left,this.height-TIME_AXIS_HEIGHT+3,width,20);context.fillStyle=foreground;context.fillText(label,left+6,this.height-11,width-12);
    const pane=this.paneGeometry().find(p=>p.id===inspection.paneId),scale=this.scales.get(inspection.paneId),price=scale?.fromCoordinate(y);
    if(!this.futureInspection&&pane&&scale&&price!=null){const h=Math.max(18,(this.options.presentation?.axis?.fontSize??11)+7),axisX=this.panes?.find(p=>p.id===pane.id)?.scaleSide==="left"?0:this.rightScaleX,top=Math.max(pane.top+h/2,Math.min(pane.top+pane.height-h/2,y));context.fillStyle=background;context.fillRect(axisX+1,top-h/2,this.priceAxisWidth-1,h);context.fillStyle=foreground;this.axisText(context,scale.formatPrice(price,this.panes?.find(p=>p.id===pane.id)?.precision??2),axisX+7,top+(this.options.presentation?.axis?.fontSize??11)*.35);}
  }

  private updateCrosshair(
    x: number,
    y: number,
    index = this.timeScale.coordinateToIndex(x),
    paneId = this.layout.paneAt(y)?.id ?? "price",
  ): void {
    const wasUnavailable=this.inspectionUnavailable;this.inspectionUnavailable=false;
    if(this.options.presentation?.ohlcInPaneHeader&&!this.timeScale.isCalendar){const logical=this.timeScale.coordinateToLogical(x);if(logical<-.5||logical>this.store.length-.5)index=-1;}
    const bar = this.store.at(index);
    const pointerTime = this.timeScale.coordinateToTime(x);
    if(this.timeScale.hasFutureDisplay&&pointerTime!=null&&(!this.store.latest||marketTimeKey(pointerTime)>marketTimeKey(this.store.latest.time))){
      const entering=!this.futureInspection;
      this.crosshair=null;this.lastNotifiedBar=-1;this.futureInspection={time:pointerTime,coordinates:{x,y},paneId};
      if(entering){this.options.onCrosshairMove?.(null);this.options.onCrosshairChange?.(null);if(this.options.presentation?.ohlcInPaneHeader)this.options.onSnapshotChange?.(this.getSnapshot());}
      this.scheduler.invalidate();return;
    }
    this.futureInspection=null;
    if (!bar || isMarketTimeInGap(bar.time, this.discontinuities) || pointerTime != null && isMarketTimeInGap(pointerTime, this.discontinuities)) {this.inspectionUnavailable=wasUnavailable;this.setUnavailableInspection();return;}
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
    if(wasUnavailable)this.options.onSnapshotChange?.(this.getSnapshot());
    this.scheduler.invalidate();
  }

  private setUnavailableInspection():void {
    const changed=!this.inspectionUnavailable||!!this.crosshair||!!this.futureInspection;
    this.inspectionUnavailable=true;this.crosshair=null;this.futureInspection=null;this.lastNotifiedBar=-1;
    if(changed){this.options.onCrosshairMove?.(null);this.options.onCrosshairChange?.(null);this.options.onSnapshotChange?.(this.getSnapshot());}
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

  private interactionTarget(point: {x:number;y:number}): InteractionTarget {
    if(point.y>=this.height-TIME_AXIS_HEIGHT)return {kind:point.x>=this.plotLeft&&point.x<this.width-this.axisWidth?'time':'gutter'};
    const pane=this.layout.paneAt(point.y);if(!pane)return {kind:'gutter'};
    const definition=this.panes?.find(p=>p.id===pane.id),left=definition?.scaleSide==='left';
    if(left?point.x<this.plotLeft:point.x>=this.rightScaleX)return {kind:'value',paneId:pane.id};
    if(point.x<this.plotLeft||point.x>=this.width-this.axisWidth)return {kind:'gutter'};
    const boundary=this.layout.boundaryAt(point.y);
    if(boundary>=0)return {kind:'separator',boundary,paneId:pane.id};
    if(definition?.collapsed || point.y<pane.top+(this.options.presentation?.paneHeaderHeights?.[pane.id]??28))return {kind:'gutter'};
    return {kind:'plot',paneId:pane.id};
  }
  private configureGestures(): void {
    this.gestures?.cancel();this.gestures=undefined;
    this.canvas.style.touchAction=this.workspace||this.panes?'none':'pan-y';
    if(!this.workspace)return;
    this.gestures=new WorkspaceGestureController({
      hit:point=>this.interactionTarget(point),
      pan:(delta,metadata)=>{this.timeScale.panPixels(delta);this.invalidate(true,metadata);},
      zoom:(x,factor,metadata)=>{this.timeScale.zoomAt(x,factor);this.invalidate(true,metadata);},
      scale:(id,delta,pan,metadata)=>this.adjustPaneScale(id,delta,pan,metadata),
      resize:(boundary,delta,metadata)=>{const sizes=this.layout.resizeBoundary(boundary,delta);this.options.onPaneSizesChange?.(sizes,metadata);this.resize(this.width,this.requestedHeight);},
      inspect:point=>this.updateCrosshair(point.x,point.y),
      capture:id=>{try{this.canvas.setPointerCapture?.(id);}catch{/* Pointer was cancelled by the browser. */}},
      release:id=>{try{if(this.canvas.hasPointerCapture?.(id))this.canvas.releasePointerCapture(id);}catch{/* Capture already released. */}},
      scrollOwner:this.options.interactions?.scrollOwner,
    });
  }
  private handlePointerCancel = (_event: PointerEvent): void => {this.gestures?.cancel();this.handleLegacyCancel();};
  private handleLostCapture = (event: PointerEvent): void => {this.gestures?.lostCapture(event.pointerId);this.handleLegacyCancel();};
  private handleBlur = (): void => {this.gestures?.cancel();this.handleLegacyCancel();};
  private handleLegacyCancel(): void {this.linePointer=null;this.scheduler.invalidate();this.pointerStart=null;this.pointers.clear();this.pinchDistance=0;if(this.longPressTimer)clearTimeout(this.longPressTimer);this.longPressTimer=null;}
  private adjustPaneScale(id: string,delta: number,pan:boolean,metadata:MarketChartChangeMetadata): void {
    const scale=this.scales.get(id),pane=this.layout.panes.find(p=>p.id===id);if(!scale||!pane||!Number.isFinite(delta))return;
    const range=scale.snapshot,span=range.maximum-range.minimum,mid=range.minimum+span/2,nextSpan=Math.max(1e-12,Math.min(1e100,span*Math.exp(Math.max(-500,Math.min(500,delta))*.01))),shift=delta/Math.max(1,pane.height)*span;
    const manualRange={minimum:pan?range.minimum+shift:mid-nextSpan/2,maximum:pan?range.maximum+shift:mid+nextSpan/2,anchor:range.anchor};if(!validMarketManualRange(manualRange))return;
    const next={mode:scale.mode,autoScale:false,manualRange};scale.setRange(manualRange);
    this.interactionState={...this.interactionState,paneScales:{...this.interactionState.paneScales,[id]:next}};
    if(id==='price'){this.scaleOptions=next;this.options.onScaleChange?.(next,metadata);}
    this.options.onInteractionStateChange?.(this.interactionState,metadata);this.scheduler.invalidate();
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if(this.workspace){if(event.button!==0&&event.pointerType!=='touch')return;const point=this.pointerCoordinates(event);if(!this.dispatchLayerPointer('pointerdown',event,point))this.gestures?.down({...point,id:event.pointerId,clientX:event.clientX,clientY:event.clientY,touch:event.pointerType==='touch',shift:event.shiftKey});return;}
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
        point.x >= this.width - this.axisWidth || point.x < this.plotLeft
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
    const referencePoint=this.pointerCoordinates(event);
    const explanation=this.referenceBadgeExplanations.find(box=>referencePoint.x>=box.left&&referencePoint.x<=box.right&&referencePoint.y>=box.top&&referencePoint.y<=box.bottom);
    this.canvas.title=explanation?.text??'';
    this.linePointer=this.pointerCoordinates(event);this.scheduler.invalidate();
    if(this.workspace){const point=this.pointerCoordinates(event);if(!this.gestures?.move({...point,id:event.pointerId,clientX:event.clientX,clientY:event.clientY,touch:event.pointerType==='touch',shift:event.shiftKey})&&!this.dispatchLayerPointer('pointermove',event,point))this.updateCrosshair(point.x,point.y);return;}
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
    if(this.workspace){this.gestures?.up(event.pointerId);this.dispatchLayerPointer('pointerup',event,this.pointerCoordinates(event));return;}
    const point = this.pointerCoordinates(event);
    this.dispatchLayerPointer("pointerup", event, point);
    this.pointers.delete(event.pointerId);
    this.pointerStart = null;
    this.pinchDistance = 0;
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.longPressTimer = null;
  };
  private handlePointerLeave = (): void => {
    this.canvas.removeAttribute('title');
    this.linePointer=null;this.scheduler.invalidate();
    if (!this.pointerStart && this.viewport.inspection !== "persistent")
      this.clearCrosshairPosition();
  };
  private handleWheel = (event: WheelEvent): void => {
    if(event.ctrlKey||event.metaKey)return;
    const point = this.pointerCoordinates(event as unknown as PointerEvent);
    if(this.workspace){
      const target=this.interactionTarget(point);if(target.kind==='gutter'||target.kind==='separator')return;
      event.preventDefault();const route=routeMarketWheel(event,this.height);if(target.kind==='time'&&!event.shiftKey)route.kind='zoom';
      if(target.kind==='value')this.adjustPaneScale(target.paneId!,route.delta*.15,false,{source:'user',gesture:'value-scale',paneId:target.paneId,phase:'end'});
      else if(route.kind==='pan'){this.timeScale.panPixels(-route.delta);this.invalidate(true,{source:'user',gesture:'pan',phase:'end'});}
      else{this.timeScale.zoomAt(point.x,Math.exp(route.delta*.0015));this.invalidate(true,{source:'user',gesture:target.kind==='time'?'time-scale':'wheel',phase:'end'});}return;
    }
    event.preventDefault();
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?this.height:1);
    this.timeScale.zoomAt(point.x, Math.exp(Math.max(-500,Math.min(500,delta)) * 0.0015));
    this.invalidate(true,{source:"user",gesture:"wheel"});
  };
  private handleDoubleClick = (event: MouseEvent): void => {
    const point = this.pointerCoordinates(event as PointerEvent);
    if(this.workspace){const target=this.interactionTarget(point);if(target.kind==='value')this.resetPaneScale(target.paneId!,{source:'user',gesture:'reset',paneId:target.paneId});else if(target.kind==='time')this.fitContent({source:'user',gesture:'reset'});return;}
    if (point.x >= this.width - this.axisWidth || point.x < this.plotLeft) {
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
      this.timeScale.zoomAt((this.width - this.axisWidth) / 2, 0.8);
      this.invalidate(true,{source:"user",gesture:"keyboard"});
    } else if (event.key === "-") {
      event.preventDefault();
      this.timeScale.zoomAt((this.width - this.axisWidth) / 2, 1.25);
      this.invalidate(true,{source:"user",gesture:"keyboard"});
    } else if (event.key === "Home") {
      event.preventDefault();
      if(this.timeline){this.fitContent({source:'user',gesture:'keyboard'});return;}
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
    this.referenceBadgeExplanations=[];
    const dataBadges=!!this.panes&&this.options.presentation?.badges?.visible!==false&&!this.allEndpointValues&&!(this.timeScale.hasFutureDisplay&&!this.timeScale.visibleTimes());
    if (!dataBadges&&!this.priceReferences.some(reference=>reference.showAxisLabel)) return;
    context.font = `${this.options.presentation?.badges?.fontSize ?? 11}px ui-sans-serif, system-ui`;
    this.paneGeometry().forEach((pane) => {
      if (this.paneCollapsed(pane.id)) return;
      const scale = this.scales.get(pane.id);
      if (!scale) return;
      const badges: AxisBadge[] = [];
      const bar = this.store.latest;
      const precision =
        this.panes?.find((p) => p.id === pane.id)?.precision ?? 2;
      if (dataBadges && pane.id === "price" && bar && this.options.presentation?.badges?.lastPrice!==false) {
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
          if(!dataBadges)return;
          if(this.options.presentation?.badges?.studyValues===false)return;
          if (this.options.presentation?.badges?.movingAverages === 'all-visible' && s.axisLabel?.kind === 'moving-average' && pane.id === 'price') return;
          const value = bar ? this.indicatorValues.get(s.id)?.get(marketTimeKey(bar.time)) : null;
          if (value == null) return;
          const y = scale.toCoordinate(value);
          if (y != null)
            badges.push({
              id: s.id,
              y,
              text: scale.formatPrice(value, precision),
              color: this.presentationColor(s.color, this.options.theme.primary),
              priority: 10,
            });
        });
      if(pane.id==='price')this.positionedPriceReferences().forEach(({reference,y})=>{
        if(reference.showAxisLabel){const caption=typeof reference.axisLabel==='string'?reference.axisLabel.trim():'';
          const valueText=caption&&(scale.mode==='normal'||scale.mode==='logarithmic')?movingAverageValueText(reference.price):scale.formatPrice(reference.price,precision);
          badges.push({id:`reference:${reference.id}`,y,text:caption?valueText:`R ${valueText}`,caption:caption||undefined,color:this.referenceColor(reference),priority:5,reference:true});}
      });
      const axisX =
        this.panes?.find((p) => p.id === pane.id)?.scaleSide === "left"
          ? 0
          : (pane.left ?? 0) + pane.width;
      const fontSize=this.options.presentation?.badges?.fontSize??11;
      const badgeHeight=Math.max(18,fontSize+7)+(badges.some(b=>b.caption)?fontSize+2:0);
      const obstacles = (this.referenceTickPositions.get(pane.id) ?? []).map(y => ({y, height: (this.options.presentation?.axis?.fontSize ?? 11) + 8}));
      if (this.crosshair?.paneId === pane.id && this.options.presentation?.crosshair?.labels !== false && this.options.presentation?.crosshair?.visible !== false) obstacles.push({y: this.crosshair.coordinates.y, height: Math.max(18, (this.options.presentation?.axis?.fontSize ?? 11) + 7) + 4});
      const headerHeight = this.options.presentation?.paneHeaderHeights?.[pane.id] ?? 28;
      // Only the additive caption mode participates in this new collision policy.
      if(pane.id==='price'&&badges.some(b=>b.caption)&&this.options.presentation?.badges?.movingAverages==='all-visible'&&!this.allEndpointValues)obstacles.push(...this.movingAverageAxis.occupiedBounds);
      layoutAxisBadges(badges, pane.top + headerHeight, pane.height - headerHeight,badgeHeight+1, obstacles).forEach((b) => {
        const outline=b.reference||this.options.presentation?.badges?.style==="outline",width=b.reference?this.priceAxisWidth:AXIS_WIDTH,badgeAxisX=b.reference?(this.panes?.find(p=>p.id===pane.id)?.scaleSide==='left'?0:this.rightScaleX):axisX;context.fillStyle=outline?this.options.theme.background:b.color;context.fillRect(badgeAxisX+1,b.y-badgeHeight/2,width-1,badgeHeight);if(outline){context.strokeStyle=b.color;context.strokeRect(badgeAxisX+1,b.y-badgeHeight/2,width-2,badgeHeight);}
        context.fillStyle=outline?this.options.theme.text:this.badgeForeground(b.color);
        if(b.caption)this.axisText(context,b.caption,badgeAxisX+7,b.y-3,width);
        if(b.caption){
          context.save();
          const fitted=fitReferenceAxisValue(b.text,width-12,fontSize,(text,size)=>{context.font=`${size}px ui-sans-serif, system-ui`;return context.measureText(text)?.width??text.length*size*.65;});
          context.font=`${fitted.fontSize}px ui-sans-serif, system-ui`;
          this.axisText(context,fitted.text,badgeAxisX+7,b.y+fontSize*.35+(fontSize+2)/2,width);context.restore();
        }else this.axisText(context,b.text,badgeAxisX+7,b.y+fontSize*.35,width);
        if(b.reference){const reference=this.priceReferences.find(reference=>`reference:${reference.id}`===b.id)!;
          this.referenceBadgeExplanations.push({left:badgeAxisX,right:badgeAxisX+width,top:b.y-badgeHeight/2,bottom:b.y+badgeHeight/2,text:`${reference.label}: ${reference.price} (supplied display reference)`});}
      });
    });
  }
  /** Reuse the existing focusable chart for full reference explanations; no new focus stop. */
  private describePriceReferences(): void {
    const description=this.priceReferences.filter(reference=>reference.showPlotLabel===false||typeof reference.axisLabel==='string'&&reference.axisLabel.trim()).map(reference=>`${reference.label}: ${reference.price} (supplied display reference; may be outside the current view)`).join('. ');
    if(description)this.canvas.setAttribute('aria-description',description);else this.canvas.removeAttribute('aria-description');
    this.canvas.removeAttribute('title');
  }
  /** Pure display positioning against the existing domain; references never participate in autoscale. */
  private positionedPriceReferences(): Array<{reference:MarketPriceReference;y:number}> {
    const pane=this.paneGeometry().find(p=>p.id==='price'),scale=this.scales.get('price');
    if(!this.store.length||!pane||!scale||this.paneCollapsed('price'))return [];
    return this.priceReferences.flatMap(reference=>{
      const location=scale.locateValue(reference.price),y=location.coordinate;
      return location.edge==null&&y!=null&&Number.isFinite(y)&&y>=pane.top&&y<=pane.top+pane.height?[{reference,y}]:[];
    });
  }
  private referenceColor(reference:MarketPriceReference):string {
    return typeof matchMedia==='function'&&matchMedia('(forced-colors: active)').matches?this.options.theme.primary:this.presentationColor(reference.color,this.options.theme.primary);
  }
  private drawPriceReferences(context:CanvasRenderingContext2D):void {
    const pane=this.paneGeometry().find(p=>p.id==='price');if(!pane)return;
    const left=pane.left??0,right=left+pane.width,fontSize=this.options.presentation?.axis?.fontSize??11;
    const top=pane.top+(this.options.presentation?.paneHeaderHeights?.price??(this.panes?28:0))+28;
    context.font=`${fontSize}px ui-sans-serif, system-ui`;
    const labels:Array<{top:number;bottom:number}>=[];
    this.positionedPriceReferences().forEach(({reference,y})=>{
      const color=this.referenceColor(reference);context.save();context.strokeStyle=this.options.theme.primary;context.strokeStyle=color;context.lineWidth=1;context.lineCap='round';context.setLineDash([1,3]);context.beginPath();context.moveTo(left,y);context.lineTo(right,y);context.stroke();context.restore();
      if(reference.showPlotLabel===false)return;
      const baseline=y-fontSize-5>=top?y-5:y+fontSize+5;
      if(baseline+3>pane.top+pane.height||baseline-fontSize<top||labels.some(label=>baseline-fontSize<label.bottom+2&&baseline+3>label.top-2))return;
      let text=reference.label.slice(0,160),truncated=text.length<reference.label.length;
      const maximum=Math.max(0,pane.width-16);while(text.length&&(context.measureText(text+(truncated?'…':''))?.width??text.length*6)>maximum){text=text.slice(0,-1);truncated=true;}
      if(!text)return;text+=truncated?'…':'';
      const width=Math.min(maximum,context.measureText(text)?.width??text.length*6);
      context.fillStyle=this.options.theme.background;context.fillRect(left+4,baseline-fontSize-2,width+8,fontSize+5);context.fillStyle=this.options.theme.primary;context.fillStyle=color;context.fillText(text,left+8,baseline);
      labels.push({top:baseline-fontSize-2,bottom:baseline+3});
    });
  }
  private drawMovingAverageLabels(): void {
    const appearance = this.options.presentation?.badges;
    const pane = this.paneGeometry().find(p => p.id === 'price');
    if (this.allEndpointValues || appearance?.movingAverages !== 'all-visible' || appearance.visible === false || appearance.studyValues === false || !pane || this.paneCollapsed('price')) {this.movingAverageAxis.clear(); return;}
    const scale = this.scales.get('price');
    if (!scale) {this.movingAverageAxis.clear(); return;}
    const bounds = this.timeScale.visibleIndexes(0), window = this.timeScale.visible;
    let endpoint: OhlcBar | undefined;
    // visibleIndexes includes adjacent compressed slots for drawing; endpoint boxes do not.
    for (let index = bounds.to - 1; index >= bounds.from; index--) {
      const bar = this.store.at(index); if (!bar) continue;
      const logical = this.timeScale.timeToLogical(bar.time);
      if (logical != null && logical >= window.from && logical <= window.to && !isMarketTimeInGap(bar.time, this.discontinuities)) {endpoint = bar; break;}
    }
    const header = Math.min(pane.height, this.options.presentation?.paneHeaderHeights?.price ?? 28);
    const labels: MovingAverageLabel[] = this.indicatorSeries.filter(series => series.placement === 'overlay' && series.axisLabel?.kind === 'moving-average').map(series => {
      const sample = endpoint ? this.indicatorValues.get(series.id)?.get(marketTimeKey(endpoint.time)) : null;
      const value = sample != null && Number.isFinite(sample) ? sample : null;
      const location = value == null ? {coordinate: null} : scale.locateValue(value);
      return {id: series.id, label: series.axisLabel!.label, shortLabel: series.axisLabel!.shortLabel, color: this.presentationColor(series.color, this.options.theme.primary), value,
        time: endpoint?.time, status: series.axisLabel!.status ?? 'Supplied output', anchorY: location.coordinate, scaleEdge: location.edge ?? 'inside',
        scaleIssue: location.edge === 'undefined' ? this.scaleMode === 'logarithmic' && value != null && value <= 0 ? 'nonpositive log value' : 'value is not representable on current scale' : undefined,
        anchorX: endpoint ? this.timeScale.timeToCoordinate(endpoint.time) : null};
    });
    this.movingAverageAxis.update(labels, {axisX: this.width - this.axisWidth, top: pane.top + header, height: Math.max(0, pane.height - header), width: AXIS_WIDTH, fontSize: appearance.fontSize ?? 11}, this.options.theme);
  }
  private drawEndpointLabels(): void {
    if (!this.allEndpointValues) {this.endpointAxes.forEach(layer => layer.clear()); return;}
    const appearance = this.options.presentation!.badges!;
    const bounds = this.timeScale.visibleIndexes(0), window = this.timeScale.visible;
    let endpoint: OhlcBar | undefined;
    for (let index = bounds.to - 1; index >= bounds.from; index--) {
      const bar = this.store.at(index); if (!bar) continue;
      const logical = this.timeScale.timeToLogical(bar.time);
      if (logical != null && logical >= window.from && logical <= window.to && !isMarketTimeInGap(bar.time, this.discontinuities)) {endpoint = bar; break;}
    }
    const active = new Set<string>();
    this.paneGeometry().forEach(pane => {
      if (this.paneCollapsed(pane.id)) return;
      const scale = this.scales.get(pane.id); if (!scale) return;
      active.add(pane.id);
      const labels: MovingAverageLabel[] = [];
      const make = (id: string, label: string, shortLabel: string | undefined, color: string, sample: number | null | undefined, status: string): MovingAverageLabel => {
        const value = sample != null && Number.isFinite(sample) ? sample : null;
        const location = value == null ? {coordinate: null} : scale.locateValue(value);
        return {id, label, shortLabel, color, value, time: endpoint?.time, status,
          anchorY: location.coordinate, anchorX: endpoint ? this.timeScale.timeToCoordinate(endpoint.time) : null,
          scaleEdge: location.edge ?? 'inside', scaleIssue: location.edge === 'undefined' ? scale.mode === 'logarithmic' && value != null && value <= 0 ? 'nonpositive log value' : 'value is not representable on current scale' : undefined};
      };
      if (pane.id === 'price' && appearance.lastPrice !== false) labels.push(make('price', 'Price close', 'Price', endpoint && endpoint.close >= endpoint.open ? this.options.theme.positive : this.options.theme.negative, endpoint?.close, endpoint?.incomplete ? 'Accepted bar · Incomplete bar' : 'Accepted bar'));
      if (appearance.studyValues !== false) this.indicatorSeries.filter(series => (series.placement === 'overlay' ? 'price' : series.paneId) === pane.id).forEach(series => {
        labels.push(make(series.id, series.axisLabel?.label ?? 'Study output', series.axisLabel?.shortLabel, this.presentationColor(series.color, this.options.theme.primary), endpoint ? this.indicatorValues.get(series.id)?.get(marketTimeKey(endpoint.time)) : null, series.axisLabel?.status ?? 'Accepted output'));
      });
      let layer = this.endpointAxes.get(pane.id);
      if (!layer) {layer = new MovingAverageAxisLayer(this.surface); this.endpointAxes.set(pane.id, layer);}
      const header = this.options.presentation?.paneHeaderHeights?.[pane.id] ?? 28;
      // Price OHLC readout is separate from the measured legend. Keep full rows
      // below it and inside the separator, without moving any scale or source value.
      const top = Math.min(pane.top + pane.height, pane.top + header + (pane.id === 'price'&&!this.options.presentation?.ohlcInPaneHeader ? 34 : 2));
      layer.update(labels, {axisX: this.width - this.axisWidth, top, height: Math.max(0, pane.top + pane.height - 4 - top), width: this.endpointGutterWidth, fontSize: this.endpointFontSize, paneId: pane.id, dedicated: true}, this.options.theme);
    });
    this.endpointAxes.forEach((layer, id) => {if (!active.has(id)) layer.clear();});
  }
  private badgeColors = new Map<string, string>();
  private referenceTickPositions = new Map<string, number[]>();
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
    this.canvas.addEventListener("pointercancel", this.handlePointerCancel);
    this.canvas.addEventListener("lostpointercapture", this.handleLostCapture);
    globalThis.addEventListener("blur",this.handleBlur);
    this.canvas.addEventListener("blur",this.handleBlur);
    this.canvas.addEventListener("pointerleave", this.handlePointerLeave);
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false });
    this.canvas.addEventListener("dblclick", this.handleDoubleClick);
    this.canvas.addEventListener("keydown", this.handleKeyDown);
  }
  private unbindEvents(): void {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointercancel", this.handlePointerCancel);
    this.canvas.removeEventListener("lostpointercapture", this.handleLostCapture);
    globalThis.removeEventListener("blur",this.handleBlur);
    this.canvas.removeEventListener("blur",this.handleBlur);
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
