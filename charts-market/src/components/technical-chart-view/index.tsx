"use client";
import type {DrawingChangeMetadata,MarketDrawingEditorOptions} from '../../drawings';

import * as React from "react";
import type { MarketChartInteractions, MarketChartInteractionState, MarketChartInteractionChange, MarketViewportCommand } from '../../core';
import {reorderTechnicalPane,resizeTechnicalPane} from './pane-workflow';
import {suppliedLinePoints} from "../../indicators/supplied-points";
import {SuppliedStatus,type TechnicalSuppliedDetails} from "./supplied-status";
export type {TechnicalSuppliedDetails} from "./supplied-status";
import {useChartGeometry} from "./use-chart-geometry";
import {TimelineScaleControls} from './scale-controls';
import type {TechnicalPaneMenuState} from './pane-menu';
export {useTechnicalPaneMenu} from './pane-menu';
export type {TechnicalPaneMenuState} from './pane-menu';
import {studyLabels, studyValueAt} from './study-presentation';
import {indicatorDisplayLabel} from '../../core/indicator-labels';
import {StudyLegend, inlineStudyGroups, type StudyLegendGroup} from './study-legend';
import {MeasuredPaneHeader} from './pane-header';
import {InstrumentReadout,useInstrumentEvidence,applyInstrumentStudyText,instrumentKeyboardText,instrumentPaneDefinitions,instrumentMinimumHeight,type TechnicalChartInstrumentReadout} from './instrument-readout';
export type {TechnicalChartInstrumentReadout,TechnicalChartReadoutObservation} from './instrument-readout';
import {supplementaryLegendGroups, type TechnicalChartLegendMetadata} from './legend-groups';
export type {TechnicalChartLegendMetadata} from './legend-groups';
import {navigateVisibleRange, type ChartNavigationIntent} from './navigation';
import {useMarketDataRevision} from "../market-chart/use-data-revision";
import {marketDataCalculationIdentity,type MarketChartPresentation,type TechnicalChartGeometry,type MarketChartChangeMetadata,type MarketDataRevision,type MarketDataAcceptance} from "../../core";
import type {MarketDrawingCommandRequest,MarketDrawingHistorySnapshot} from "../../drawings";
import { ChartThemeContext, DialogContent, DropdownMenuContent, TooltipContent, technicalChartThemes, type TechnicalChartTheme } from "./scoped-theme";
import { createCalculationRequests, matchingSuppliedResult, suppliedResultRenderable } from "../../core";
import type { MarketTimeAxis, MarketTimeGap, CalculationMode, CalculationRequest, SuppliedCalculationResults } from "../../core";
export { technicalChartThemes } from "./scoped-theme";
export type { TechnicalChartTheme } from "./scoped-theme";
import {
  earningsBarTime,
  earningsDescription,
  earningsPinLeft,
  type TechnicalEarningsEvent,
} from "./earnings";
export type { TechnicalEarningsEvent } from "./earnings";
import {
  Button,
  cn,
  Dialog,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "aapaetsch-ui-kit";
import {
  SearchIcon as Search,
  SlidersHorizontalIcon as SlidersHorizontal,
  MaximizeIcon as Maximize2,
  RestoreIcon as Minimize2,
  DownloadIcon as Download,
  MoreHorizontalIcon as MoreHorizontal,
  PanelLeftIcon as PanelLeft,
  IndicatorsIcon as ChartNoAxesCombined,
  ChevronDownIcon as ChevronDown,
  MagnetIcon as Magnet,
  CrosshairIcon as Crosshair,
  TableIcon as Table2,
  ArrowUpIcon as ArrowUp,
  ArrowDownIcon as ArrowDown,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  CloseIcon as X,
} from "aapaetsch-icons";
import {
  MarketChart,
  type MarketChartHandle,
  type MarketChartProps,
} from "../market-chart";
import { builtInIndicators, suppliedStudyDefinitions } from "../../indicators";
import {
  createTechnicalChartViewState,
  marketTimeKey,
  technicalChartViewReducer,
} from "../../core";
import type {
  IndicatorDefinition,
  IndicatorInstance,
  IndicatorRenderSeries,
  MarketChartSnapshot,
  MarketChartType,
  MarketMarker,
  MarketScaleMode,
  OhlcBar,
  TechnicalChartViewState,
  TechnicalChartViewChangeMetadata,
  TechnicalPaneState,
  VisibleRange,
  VolumeProfileSource,
} from "../../core";
import {
  calculateVolumeProfile,
  type VolumeProfileResult,
} from "../../engine/volume-profile";
import {
  createVolumeProfileLayer,
  type VolumeProfileHit,
} from "../../engine/volume-profile-layer";

export interface TechnicalSymbolSearchResult {
  symbol: string;
  name?: string;
  exchange?: string;
}
export interface TechnicalSymbolSearchAdapter {
  search(
    query: string,
    signal: AbortSignal,
  ): Promise<TechnicalSymbolSearchResult[]>;
}
export interface TechnicalIntervalOption {
  value: string;
  label: string;
}
export interface TechnicalChartAppearance extends MarketChartPresentation {
  /** plot preserves legacy height; available budgets all composite chrome within height. */
  heightMode?:"plot"|"available";
  minimumPlotHeight?:number;
  /** `host` allocates no supplied-study status chrome. The host must expose complete evidence,
   * including loading, failure/stale and rejected updates, through its existing expanded surface.
   * This is presentation only: admission/matching and chart loading/error props stay unchanged. */
  suppliedStatus?:"expanded"|"compact"|"host";
  /** Hide compact supplied-details entry points; retain status, rejected-result and warning semantics. Default true. */
  suppliedDetails?:boolean;
  legends?:"expanded"|"compact";
  /** Board opt-ins: `inline` wraps every numeric study/volume readout without a Legend disclosure;
   * `volume-only` shows only finite supplied bar volume (including zero), omitting all other groups.
   * Missing volume reserves no row in volume-only mode. Caption is exactly `vol`; series/badges stay visible.
   * Host-expanded inline details retain complete source evidence.
   * Omission preserves default full-chart legends; this runtime option never changes saved study evidence. */
  studyReadout?: 'inline' | 'volume-only';
  /** One combined navigation/scale/evidence strip. Legacy composition remains the default. */
  navigation?: "standard" | "integrated";
  height: number;
  title: string;
  locale: string;
  timeZone: string;
}
export interface TechnicalChartFeatures {
  /** Hide both in compact boards; host supplies navigation and exact table access. */
  header: boolean;
  commands: boolean;
  drawingRail: boolean;
  footer: boolean;
  indicators: boolean;
  profiles: boolean;
  dataTable: boolean;
}
export interface MarketDataAvailability {
  status: string;
  description?: string;
}
export interface ChartExportRequest {
  format: "png" | "csv";
  symbol: string;
  interval: string;
  state: TechnicalChartViewState;
}
export interface TechnicalRangeShortcut {
  label: string;
  bars: number;
}
export interface TechnicalChartViewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Controlled runtime access to the existing pane menu; undefined preserves internal behavior. */
  paneMenu?:TechnicalPaneMenuState|null;
  onPaneMenuChange?:(menu:TechnicalPaneMenuState|null)=>void;
  /** Omit compact inline symbol/chevron buttons only when a discoverable host trigger is provided. */
  paneMenuTrigger?:'internal'|'none';
  /** Host policy for all user Log actions. Host still owns incoming controlled scale state. */
  allowLogScale?:boolean;
  /** Host-owned UTC/calendar display geometry. Compressed by default; not serialized. */
  interactions?: MarketChartInteractions;
  interactionState?: MarketChartInteractionState;
  onInteractionStateChange?: MarketChartInteractionChange;
  viewportCommand?: MarketViewportCommand;
  /** Every valid local resize draft, final/end or cancellation. Save may retain the latest draft. */
  onPaneLayoutChange?: (panes: TechnicalPaneState[], metadata: MarketChartChangeMetadata) => void;
  timeAxis?: MarketTimeAxis;
  discontinuities?: readonly MarketTimeGap[];
  /** Defaults to historical internal calculation behavior. */
  calculationMode?: CalculationMode;
  /** Opaque host identity: revise for every dataset/source/currency/price-basis change. Required to render supplied results. */
  calculationIdentity?: string;
  suppliedResults?: SuppliedCalculationResults;
  /** Display-only names/previously supplied drawing values. Never enters request keys or saved documents. */
  legendMetadata?: TechnicalChartLegendMetadata;
  /** Combined company/OHLC header with inline named studies; never saved or included in request identity. */
  instrumentReadout?:TechnicalChartInstrumentReadout;
  onCalculationRequest?: (request: CalculationRequest) => void;
  /** Independent palette, including portaled controls. Custom CSS variables can be passed in style. */
  theme?: TechnicalChartTheme;
  /** Immediate UTC economic range callback; host owns linking/debounce. */
  onVisibleRangeChange?: (range: VisibleRange | null, metadata?:MarketChartChangeMetadata) => void;
  symbol: string;
  interval: string;
  data: readonly OhlcBar[];
  /** Additive chart API; the forwarded ref remains the root DOM element. */
  chartApiRef?:React.Ref<MarketChartHandle>;
  dataIdentity?:string;
  dataRevision?:MarketDataRevision;
  onDataAcceptance?:(receipt:MarketDataAcceptance)=>void;
  onGeometryChange?:(geometry:TechnicalChartGeometry)=>void;
  onRequestSuppliedDetails?:(details:TechnicalSuppliedDetails)=>void;
  drawingToolIds?:readonly string[];
  drawingCommand?:MarketDrawingCommandRequest;
  drawingEditor?:MarketDrawingEditorOptions;
  onDrawingHistoryChange?:(history:MarketDrawingHistorySnapshot)=>void;
  state: TechnicalChartViewState;
  onStateChange(
    next: TechnicalChartViewState,
    metadata: TechnicalChartViewChangeMetadata,
  ): void;
  symbolSearch?: TechnicalSymbolSearchAdapter;
  onSymbolChange?: (symbol: string) => void;
  onIntervalChange?: (interval: string) => void;
  intervalOptions?: TechnicalIntervalOption[];
  availableIndicators?: IndicatorDefinition[];
  /** Supplied levels describe the selected range; the consumer updates them when its range changes. */
  profileSources?: Record<string, VolumeProfileSource>;
  markers?: MarketMarker[];
  /** Exact host-supplied display prices. No session inference, formulas, drawing or saved-state ownership. */
  priceReferences?: MarketChartProps['priceReferences'];
  /** Supplied earnings dates, shown as event pins with accessible report details. */
  earnings?: readonly TechnicalEarningsEvent[];
  dataAvailability?: MarketDataAvailability;
  appearance?: Partial<TechnicalChartAppearance>;
  features?: Partial<TechnicalChartFeatures>;
  rangeShortcuts?: TechnicalRangeShortcut[];
  status?: React.ReactNode;
  clock?: React.ReactNode;
  countdown?: React.ReactNode;
  /** Host-owned pan/zoom controls, inserted in the existing footer without an extra row. */
  navigationControls?: React.ReactNode;
  /** Exact-data or other host actions in the same accessible navigation strip. */
  footerActions?: React.ReactNode;
  loading?: boolean;
  error?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  onRequestFullscreen?: () => void;
  onRequestExport?: (request: ChartExportRequest) => void;
  onRequestFinancials?: () => void;
  onRequestTimezone?: () => void;
  /** Alternative-engine and contract-test seam inherited from MarketChart. */
  engineFactory?: MarketChartProps["engineFactory"];
}

const defaultIntervals: TechnicalIntervalOption[] = [
  { value: "1H", label: "1 hour" },
  { value: "4H", label: "4 hours" },
  { value: "1D", label: "Daily" },
  { value: "1W", label: "Weekly" },
  { value: "1M", label: "Monthly" },
];
const defaultRanges = [
  { label: "1M", bars: 22 },
  { label: "3M", bars: 66 },
  { label: "6M", bars: 132 },
  { label: "1Y", bars: 252 },
];
const emptySuppliedResults: SuppliedCalculationResults = {};
const emptySources: Record<string, VolumeProfileSource> = {};
const emptyMarkers: MarketMarker[] = [];
const emptyEarnings: readonly TechnicalEarningsEvent[] = [];
const inputClass =
  "h-8 min-w-0 rounded-md border border-input bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Action({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="sm"
          colorStyle="ghost"
          className="h-8 shrink-0"
          aria-label={label}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="motion-reduce:animate-none">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

/** A complete controlled technical workspace. Consumers own data, persistence and host-window actions. */
export const TechnicalChartView = React.forwardRef<
  HTMLDivElement,
  TechnicalChartViewProps
>(function TechnicalChartView(
  {
    paneMenu,onPaneMenuChange,paneMenuTrigger='internal',allowLogScale=true,
    interactions, interactionState:controlledInteractionState, onInteractionStateChange, viewportCommand, onPaneLayoutChange, timeAxis, discontinuities, calculationMode = "internal", calculationIdentity:hostCalculationIdentity, suppliedResults = emptySuppliedResults, legendMetadata, instrumentReadout, onCalculationRequest, theme, onVisibleRangeChange,
    symbol,
    interval,
    data:incomingData, chartApiRef, dataIdentity, dataRevision, onDataAcceptance, onGeometryChange, onRequestSuppliedDetails, drawingToolIds, drawingCommand, drawingEditor, onDrawingHistoryChange,
    state,
    onStateChange,
    symbolSearch,
    onSymbolChange,
    onIntervalChange,
    intervalOptions = defaultIntervals,
    availableIndicators = calculationMode === "supplied" ? suppliedStudyDefinitions : builtInIndicators,
    profileSources = emptySources,
    markers = emptyMarkers,
    priceReferences,
    earnings = emptyEarnings,
    dataAvailability,
    appearance,
    features,
    rangeShortcuts = defaultRanges,
    status,
    clock,
    countdown,
    navigationControls,
    footerActions,
    loading,
    error,
    emptyMessage,
    onRequestFullscreen,
    onRequestExport,
    onRequestFinancials,
    onRequestTimezone,
    engineFactory,
    className,
    id,
    style,
    role,
    tabIndex,
    onKeyDown,
    ...domProps
  },
  forwardedRef,
) {
  const accepted=useMarketDataRevision(incomingData,dataIdentity??hostCalculationIdentity,dataRevision,onDataAcceptance);
  const data=accepted.data;
  const unifiedReadout=instrumentReadout!==undefined;
  const instrumentEvidence=useInstrumentEvidence(instrumentReadout?.exactValues,data,dataIdentity??hostCalculationIdentity??'',accepted.revision,accepted.receipt?.status);
  const calculationIdentity=accepted.revision!=null&&accepted.revision<0?undefined:hostCalculationIdentity&&accepted.revision!=null?marketDataCalculationIdentity(hostCalculationIdentity,accepted.revision,dataIdentity??hostCalculationIdentity):hostCalculationIdentity;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const paneMenuFocus=React.useRef<HTMLElement|undefined>(undefined);
  if(paneMenu?.returnFocus)paneMenuFocus.current=paneMenu.returnFocus;
  const intrinsicContentRef=React.useRef<HTMLDivElement>(null);
  const canvasHostRef=React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<MarketChartHandle>(null);
  const [liveAxis,setLiveAxis]=React.useState<Pick<MarketChartSnapshot,'priceAxis'|'scale'>|null>(null);
  const liveAxisKey=React.useRef('');
  const observeAxis=React.useCallback((snapshot:MarketChartSnapshot)=>{
    const next={priceAxis:snapshot.priceAxis,scale:snapshot.scale},key=JSON.stringify(next);
    if(key!==liveAxisKey.current){liveAxisKey.current=key;setLiveAxis(next);}
  },[]);
  React.useImperativeHandle(chartApiRef,()=>({
    resetPaneScale:(paneId,metadata)=>chartRef.current?.resetPaneScale(paneId,metadata),setViewportCommand:viewport=>chartRef.current?.setViewportCommand(viewport),executeDrawingCommand:command=>chartRef.current?.executeDrawingCommand(command),getDrawingHistory:()=>chartRef.current?.getDrawingHistory()??{canUndo:false,canRedo:false,selectedIds:[],drawingCount:0},resetScale:()=>chartRef.current?.resetScale(),appendOrUpdate:bar=>chartRef.current?.appendOrUpdate(bar),fitContent:metadata=>chartRef.current?.fitContent(metadata),scrollToRealtime:metadata=>chartRef.current?.scrollToRealtime(metadata),setVisibleRange:(range,metadata)=>chartRef.current?.setVisibleRange(range,metadata),setCrosshairPosition:(time,price)=>chartRef.current?.setCrosshairPosition(time,price),clearCrosshairPosition:()=>chartRef.current?.clearCrosshairPosition(),getSnapshot:()=>chartRef.current?.getSnapshot()??null,coordinateForTime:time=>chartRef.current?.coordinateForTime(time)??null,
  }),[]);
  const workspace=interactions?.mode==='workspace';
  const [localInteractionState,setLocalInteractionState]=React.useState<MarketChartInteractionState>({});
  const interactionState=controlledInteractionState??localInteractionState;
  const interactionRef=React.useRef(interactionState);interactionRef.current=interactionState;
  const interactionCallbacks=React.useRef({onInteractionStateChange,onPaneLayoutChange});interactionCallbacks.current={onInteractionStateChange,onPaneLayoutChange};
  const changeInteraction=React.useCallback<MarketChartInteractionChange>((next,metadata)=>{interactionRef.current=next;setLocalInteractionState(next);interactionCallbacks.current.onInteractionStateChange?.(next,metadata);},[]);
  const paneActionRefs=React.useRef(new Map<string,HTMLButtonElement>());
  const pendingScrollRestore=React.useRef<{scrollTop:number;focus:HTMLElement|null}|null>(null);
  const maximizeRestore=React.useRef<{scrollTop:number;focus:HTMLElement|null}|null>(null);
  const paneAcknowledgements=React.useRef<string[]>([]);
  const paneDataset=JSON.stringify([interactions?.contextKey!==undefined?'context':'fallback',interactions?.contextKey??dataIdentity??hostCalculationIdentity,symbol,interval]);
  const priorPaneDataset=React.useRef(paneDataset);
  const previousPaneInput=React.useRef(JSON.stringify(state.panes));
  const [paneDraft,setPaneDraft]=React.useState<TechnicalPaneState[]|null>(null);
  const displayedPanes=paneDraft??state.panes;
  const paneDraftRef=React.useRef(displayedPanes);paneDraftRef.current=displayedPanes;
  const paneGesture=React.useRef<{id:number;kind:'resize'|'reorder';paneId:string;startY:number;panes:TechnicalPaneState[];height:number;target:HTMLElement}|null>(null);
  const [renderedPlotHeight,setRenderedPlotHeight]=React.useState<number|undefined>(undefined);
  const restorePane=React.useCallback((source:MarketChartChangeMetadata['source']='user')=>{
    const restore=maximizeRestore.current;maximizeRestore.current=null;
    changeInteraction({...interactionRef.current,maximizedPaneId:null},{source,gesture:'pane-restore',phase:'end'});
    pendingScrollRestore.current=restore;
  },[changeInteraction]);
  const togglePane=(paneId:string)=>{
    if(interactionRef.current.maximizedPaneId===paneId){restorePane();return;}
    if(!maximizeRestore.current)maximizeRestore.current={scrollTop:interactions?.scrollOwner?.getScrollTop()??0,focus:document.activeElement instanceof HTMLElement?(document.activeElement.closest('[role="menu"]')?paneActionRefs.current.get(paneId)??null:document.activeElement):null};
    changeInteraction({...interactionRef.current,maximizedPaneId:paneId},{source:'user',gesture:'pane-maximize',paneId,phase:'end'});
  };
  React.useEffect(()=>{
    const pending=pendingScrollRestore.current;if(!pending||interactionState.maximizedPaneId)return;
    const snapshot=chartRef.current?.getSnapshot(),bottom=snapshot?.panes.reduce((n,p)=>Math.max(n,p.top+p.height),0)??Infinity;
    if(renderedPlotHeight==null||renderedPlotHeight+1<bottom+28)return;
    const frame=requestAnimationFrame(()=>{pendingScrollRestore.current=null;if(pending.focus?.isConnected)pending.focus.focus({preventScroll:true});else rootRef.current?.querySelector<HTMLButtonElement>('[data-chart-pane-header] button:not(:disabled)')?.focus({preventScroll:true});const owner=interactions?.scrollOwner;if(owner){if(owner.restoreScrollTop)owner.restoreScrollTop(pending.scrollTop);else owner.scrollTo(pending.scrollTop);}});
    return()=>cancelAnimationFrame(frame);
  },[interactionState.maximizedPaneId,renderedPlotHeight,interactions?.scrollOwner,paneDataset]);
  React.useEffect(()=>{if(interactionState.maximizedPaneId&&!state.panes.some(p=>p.id===interactionState.maximizedPaneId&&p.visible!==false))restorePane('data');},[state.panes,interactionState.maximizedPaneId,restorePane]);
  const [earningsOpen, setEarningsOpen] = React.useState(false);
  const earningsTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const earningsEvents = React.useMemo(
    () =>
      earnings
        .filter((event) => Number.isFinite(marketTimeKey(event.time)))
        .map((event) => ({ event, anchor: earningsBarTime(event, data) })),
    [earnings, data],
  );
  const renderedState = React.useRef(state);
  renderedState.current = state;
  const latest = React.useRef({ state, onStateChange });
  latest.current = { state, onStateChange };
  const [mobileToolsOpen, setMobileToolsOpen] = React.useState(false);
  const [narrow, setNarrow] = React.useState(false);
  const [panel, setPanel] = React.useState<
    | "symbol"
    | "interval"
    | "indicators"
    | "settings"
    | "commands"
    | "study"
    | null
  >(null);
  const [query, setQuery] = React.useState("");
  const [studyId, setStudyId] = React.useState<string>();
  const [symbols, setSymbols] = React.useState<TechnicalSymbolSearchResult[]>(
    [],
  );
  const [searchStatus, setSearchStatus] = React.useState("");
  const [internalProfileResults, setProfileResults] = React.useState<
    Record<string, VolumeProfileResult>
  >({});
  const [profileHit, setProfileHit] = React.useState<VolumeProfileHit>();
  const [tableOpen, setTableOpen] = React.useState(false);
  const [paneHeaderHeights, setPaneHeaderHeights] = React.useState<Record<string, number>>({});
  const readoutMaximizedPane=workspace?interactionState.maximizedPaneId:undefined;
  const renderingPanes=React.useMemo(()=>unifiedReadout?instrumentPaneDefinitions(displayedPanes,paneHeaderHeights,readoutMaximizedPane):displayedPanes,[unifiedReadout,displayedPanes,paneHeaderHeights,readoutMaximizedPane]);
  const minimumPlotHeight=Math.max(appearance?.minimumPlotHeight??120,unifiedReadout?instrumentMinimumHeight(renderingPanes,readoutMaximizedPane):0);
  const presentation = React.useMemo(() => ({...appearance,...(unifiedReadout?{ohlcInPaneHeader:true}:{}), drawingEvidenceLabels: appearance?.drawingEvidenceLabels ?? appearance?.legends !== 'compact', paneHeaderHeights}), [appearance, paneHeaderHeights,unifiedReadout]);
  const [jumpDate, setJumpDate] = React.useState("");
  const [settledRange, setSettledRange] = React.useState<
    VisibleRange | undefined
  >(state.viewport.visibleRange);
  const viewportTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const viewportCommandId = viewportCommand?.id;
  React.useEffect(() => {
    if (viewportCommandId !== undefined) {
      clearTimeout(viewportTimer.current);
      viewportTimer.current = undefined;
    }
  }, [viewportCommandId]);
  const available = {
    header: !unifiedReadout,
    commands: !unifiedReadout,
    drawingRail: true,
    footer: true,
    indicators: true,
    profiles: true,
    dataTable: true,
    ...features,
  };
  const height=useChartGeometry(rootRef,appearance?.height??660,appearance?.heightMode??"plot",minimumPlotHeight,onGeometryChange,workspace?renderedPlotHeight:undefined,workspace?intrinsicContentRef:undefined,workspace?canvasHostRef:undefined,unifiedReadout);
  const emit = React.useCallback((
    changes: Partial<TechnicalChartViewState>,
    type: TechnicalChartViewChangeMetadata["type"],
    entityId?: string,
    origin?:MarketChartChangeMetadata,
    drawing?:DrawingChangeMetadata,
  ) => {
    if (type === "viewport") clearTimeout(viewportTimer.current);
    const current = latest.current;
    if (
      !workspace && !appearance?.timeline && !timeAxis?.futureDisplay && changes.viewport &&
      changes.viewport.rightOffsetBars !==
        current.state.viewport.rightOffsetBars
    ) {
      // A new offset preserves the displayed data range, rather than replaying
      // logical coordinates that still contain the previous offset.
      changes = {
        ...changes,
        viewport: { ...changes.viewport, logicalRange: undefined },
      };
    }
    const next = { ...current.state, ...changes };
    latest.current = { ...current, state: next };
    queueMicrotask(() => {
      latest.current = { ...latest.current, state: renderedState.current };
    });
    current.onStateChange(next, { type, id: entityId, ...origin,...(drawing?{drawing}:{}) });
  },[workspace,appearance?.timeline,timeAxis?.futureDisplay]);
  const openPanel = (next: NonNullable<typeof panel>) => {
    setQuery("");
    setPanel(next);
  };
  React.useImperativeHandle(forwardedRef, () => rootRef.current!, []);
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setNarrow(entry.contentRect.width < 768),
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => () => clearTimeout(viewportTimer.current), []);
  React.useEffect(() => {
    if (panel !== "symbol" || !symbolSearch) return;
    const controller = new AbortController();
    setSearchStatus("Searching…");
    const timer = setTimeout(() => {
      void symbolSearch
        .search(query, controller.signal)
        .then((results) => {
          if (!controller.signal.aborted) {
            setSymbols(results);
            setSearchStatus(results.length ? "" : "No symbols found.");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setSearchStatus("Symbol search is unavailable.");
        });
    }, 150);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, panel, symbolSearch]);
  React.useEffect(() => {
    if (calculationMode === "supplied" || !available.profiles) {
      setProfileResults({});
      return;
    }
    const range =
      settledRange ??
      chartRef.current?.getSnapshot()?.visibleRange ??
      undefined;
    const results = Object.fromEntries(
      state.profiles
        .filter((p) => p.visible)
        .map((p) => [
          p.id,
          calculateVolumeProfile(
            profileSources[p.id] ?? { kind: "derive-from-bars", bars: data },
            p,
            range,
          ),
        ]),
    );
    setProfileResults(results);
    setProfileHit(undefined);
  }, [data, state.profiles, profileSources, settledRange, available.profiles, calculationMode]);
  const requestSignature = JSON.stringify(createCalculationRequests(calculationIdentity ?? "", symbol, interval, state));
  const requests = React.useMemo<CalculationRequest[]>(() => JSON.parse(requestSignature), [requestSignature]);
  const requestCallback = React.useRef(onCalculationRequest); requestCallback.current = onCalculationRequest;
  React.useEffect(() => {
    if (calculationMode === "supplied" && calculationIdentity) requests.forEach(request => requestCallback.current?.(request));
  }, [requests, calculationMode, calculationIdentity]);
  const matchedResults = React.useMemo<SuppliedCalculationResults>(() => calculationIdentity ? Object.fromEntries(requests.map(request => [request.instanceId, matchingSuppliedResult(request, suppliedResults)])) : {}, [requests, suppliedResults, calculationIdentity]);
  const profileResults = React.useMemo<Record<string, VolumeProfileResult>>(() => calculationMode === "internal" ? internalProfileResults : Object.fromEntries(
    Object.entries(matchedResults).flatMap(([id, result]) => result?.kind === "profile" && suppliedResultRenderable(result) ? [[id, result.profile]] : []),
  ), [calculationMode, internalProfileResults, matchedResults]);
  const suppliedSeries = React.useMemo<IndicatorRenderSeries[]>(() => {
    const names = studyLabels(state.indicators, availableIndicators);
    return state.indicators.filter(instance => instance.visible).flatMap(instance => {
    const result = matchedResults[instance.id];
    const definition = availableIndicators.find(item => item.id === instance.definitionId);
    if (!definition) return [];
    const renderable = result?.kind === 'indicator' && suppliedResultRenderable(result);
    if (!renderable && appearance?.badges?.endpointValues !== 'all-visible' && (definition.axisLabelKind !== 'moving-average' || appearance?.badges?.movingAverages !== 'all-visible')) return [];
    return definition.lines.map(line => ({ id: `${instance.id}:${line.id}`, paneId: instance.id, placement: definition.placement,
      style: line.style ?? "line", color: instance.colors?.[line.id] ?? line.color ?? "#64748b", fixedDomain: definition.fixedDomain, automaticDomain: definition.automaticDomain, referenceLines: definition.referenceLines, formatValue: definition.formatValue,
      axisLabel: {kind: definition.axisLabelKind === 'moving-average' ? 'moving-average' as const : 'study' as const, label: `${names.get(instance.id)}${definition.lines.length > 1 ? ` · ${line.label}` : ''}`, shortLabel: indicatorDisplayLabel(instance.parameters, {...definition, label: line.label}), status: [result?.status ?? 'Waiting for matching supplied result', result?.stale && 'Stale', result?.approximate && 'Approximate', result?.warning].filter(Boolean).join(' · ')},
      points: renderable && result?.kind === 'indicator' ? suppliedLinePoints(result.points,line.id) : [],
    }));
    });
  }, [state.indicators, availableIndicators, matchedResults, appearance?.badges?.movingAverages, appearance?.badges?.endpointValues]);
  const renderData = React.useMemo(() => Array.from(data), [data]);
  const indicators = React.useMemo<IndicatorInstance[]>(
    () =>
      state.indicators.flatMap((instance) => {
        const definition = availableIndicators.find(
          (d) => d.id === instance.definitionId,
        );
        return definition ? [{ ...instance, definition }] : [];
      }),
    [state.indicators, availableIndicators],
  );
  const layers = React.useMemo(
    () =>
      state.profiles
        .filter((p) => p.visible && profileResults[p.id])
        .map((p) =>
          createVolumeProfileLayer(p, profileResults[p.id], (hit) =>
            setProfileHit((previous) =>
              previous?.profileId === hit.profileId && previous.row === hit.row
                ? previous
                : hit,
            ),
          ),
        ),
    [state.profiles, profileResults],
  );
  const paneSizes = React.useMemo(
    () => Object.fromEntries(displayedPanes.map((p) => [p.id, p.size])),
    [displayedPanes],
  );
  const changePane = (paneId: string, changes: Partial<TechnicalPaneState>) =>
    emit(
      {
        panes: state.panes.map((p) =>
          p.id === paneId ? { ...p, ...changes } : p,
        ),
      },
      "pane",
      paneId,
      {source:"user",gesture:changes.collapsed!=null?"pane-collapse":undefined,phase:"end",paneId},
    );
  const range = (bars: number) => {
    if (!data.length) return;
    chartRef.current?.setVisibleRange({
      from: data[Math.max(0, data.length - bars)].time,
      to: data[data.length - 1].time,
    },{source:"user",gesture:"reset"});
  };
  const addIndicator = (definition: IndicatorDefinition) => {
    const instanceId = `${definition.id}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
    const paneId = definition.placement === "overlay" ? "price" : instanceId;
    const panes = state.panes.some((p) => p.id === paneId)
      ? state.panes.map((p) =>
          p.id === paneId ? { ...p, studyIds: [...p.studyIds, instanceId] } : p,
        )
      : [
          ...state.panes,
          {
            id: paneId,
            order: state.panes.length,
            size: 1,
            minimumSize: 64,
            studyIds: [instanceId],
          },
        ];
    emit(
      {
        panes,
        indicators: [
          ...state.indicators,
          {
            id: instanceId,
            definitionId: definition.id,
            version: definition.version,
            visible: true,
            parameters: { ...definition.defaultParameters },
          },
        ],
      },
      "indicator-add",
      instanceId,
    );
    setPanel(null);
  };
  const removeStudy = (instanceId: string) =>
    emit(
      {
        indicators: state.indicators.filter((i) => i.id !== instanceId),
        panes: state.panes.map((p) => ({
          ...p,
          studyIds: p.studyIds.filter((id) => id !== instanceId),
        })),
      },
      "indicator-remove",
      instanceId,
    );
  const setScaleMode = (mode: MarketScaleMode) => {
    if(mode==='logarithmic'&&!allowLogScale)return;
    if(workspace)chartRef.current?.resetPaneScale("price",{source:"user",gesture:"reset",paneId:"price"});
    emit({ scale: { mode, autoScale: true },panes:state.panes.map(p=>p.id==='price'&&p.scaleMode?{...p,scaleMode:mode}:p) }, "scale",undefined,workspace?{source:"user",gesture:"reset",paneId:"price"}:undefined);
  };
  const maximize = () =>
    emit(
      { chrome: { ...state.chrome, maximized: !state.chrome.maximized } },
      "chrome",
    );
  const exportChart = (format: ChartExportRequest["format"]) =>
    onRequestExport?.({ format, symbol, interval, state });
  const unknownStudies = state.indicators.filter(
    (i) => !availableIndicators.some((d) => d.id === i.definitionId),
  );
  const study = state.indicators.find((i) => i.id === studyId);
  const labels = studyLabels(state.indicators, availableIndicators);
  const labelFor = (instanceId: string) => labels.get(instanceId) ?? 'Unavailable study';
  const requestLabels = Object.fromEntries(requests.map(request => [request.instanceId, request.kind === 'indicator' ? labelFor(request.instanceId) : request.kind === 'profile' ? 'Volume profile' : 'VWAP']));
  const integratedNavigation = appearance?.navigation === 'integrated' && available.footer && state.chrome.footer;
  const iconScales=appearance?.timeline?.scaleControls==='icons';
  const actualScale=liveAxis?.scale??state.scale;
  const toggleAuto=()=>{
    if(workspace&&!actualScale.autoScale){chartRef.current?.resetPaneScale('price',{source:'user',gesture:'reset',paneId:'price',phase:'end'});return;}
    const snapshot=chartRef.current?.getSnapshot()?.scales.price;
    emit({scale:{...actualScale,autoScale:!actualScale.autoScale,manualRange:actualScale.autoScale&&snapshot?{minimum:snapshot.minimum,maximum:snapshot.maximum,anchor:snapshot.anchor}:undefined}},'scale',undefined,{source:'user',gesture:'reset',paneId:'price',phase:'end'});
  };
  const suppliedStatus = calculationMode === 'supplied' && appearance?.suppliedStatus !== 'host' && (requests.length > 0 || !calculationIdentity || appearance?.suppliedStatus === 'compact' && dataAvailability)
    ? <SuppliedStatus showDetails={appearance?.suppliedDetails!==false} boundWarnings={appearance?.studyReadout==='volume-only'} availability={dataAvailability} requests={requests} results={matchedResults} incoming={suppliedResults} missingIdentity={!calculationIdentity} compact={appearance?.suppliedStatus === 'compact'} inline={integratedNavigation} labels={requestLabels} onRequestDetails={onRequestSuppliedDetails}/> : null;
  const navigate = (intent: ChartNavigationIntent) => {
    const next = navigateVisibleRange(chartRef.current?.getSnapshot()?.visibleRange ?? state.viewport.visibleRange, data, timeAxis, intent);
    if (next) chartRef.current?.setVisibleRange(next, {source: 'user', gesture: 'keyboard'});
  };

  const publishPaneDraft=React.useCallback((panes:TechnicalPaneState[],metadata:MarketChartChangeMetadata)=>{
    paneDraftRef.current=panes;setPaneDraft(panes);interactionCallbacks.current.onPaneLayoutChange?.(panes,metadata);
    if(metadata.phase==='end'){paneAcknowledgements.current.push(JSON.stringify(panes));if(paneAcknowledgements.current.length>64)paneAcknowledgements.current.shift();emit({panes},metadata.gesture==='pane-reorder'?'pane-reorder':'pane-resize',metadata.paneId,metadata);}
  },[emit]);
  const cancelPaneGesture=React.useCallback(()=>{
    const gesture=paneGesture.current;if(!gesture)return;paneGesture.current=null;
    publishPaneDraft(gesture.panes,{source:'user',gesture:gesture.kind==='resize'?'pane-resize':'pane-reorder',phase:'cancel',paneId:gesture.paneId});
    try{if(gesture.target.hasPointerCapture(gesture.id))gesture.target.releasePointerCapture(gesture.id);}catch{/* Already released. */}
    setPaneDraft(null);
  },[publishPaneDraft]);
  React.useEffect(()=>{window.addEventListener('blur',cancelPaneGesture);return()=>{window.removeEventListener('blur',cancelPaneGesture);const g=paneGesture.current;paneGesture.current=null;try{if(g?.target.hasPointerCapture(g.id))g.target.releasePointerCapture(g.id);}catch{/* Unmounted. */}};},[cancelPaneGesture]);
  React.useEffect(()=>{
    const datasetChanged=priorPaneDataset.current!==paneDataset;priorPaneDataset.current=paneDataset;
    const incoming=JSON.stringify(state.panes),draft=JSON.stringify(paneDraftRef.current);
    const changed=previousPaneInput.current!==incoming;previousPaneInput.current=incoming;if(!datasetChanged&&!changed)return;
    if(datasetChanged || draft&&incoming!==draft&&!paneAcknowledgements.current.includes(incoming)){cancelPaneGesture();setPaneDraft(null);if(datasetChanged){clearTimeout(viewportTimer.current);viewportTimer.current=undefined;paneAcknowledgements.current=[];maximizeRestore.current=null;pendingScrollRestore.current=null;}}
    else if(draft===incoming&&!paneGesture.current)setPaneDraft(null);
  },[state.panes,paneDataset,cancelPaneGesture]);
  const startPaneGesture=(event:React.PointerEvent<HTMLElement>,kind:'resize'|'reorder',paneId:string,currentHeight:number)=>{
    if(event.button!==0)return;event.preventDefault();event.stopPropagation();event.currentTarget.focus({preventScroll:true});
    paneGesture.current={id:event.pointerId,kind,paneId,startY:event.clientY,panes:paneDraftRef.current,height:currentHeight,target:event.currentTarget};event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePaneGesture=(event:React.PointerEvent<HTMLElement>)=>{
    const g=paneGesture.current;if(!g||g.id!==event.pointerId)return;event.preventDefault();event.stopPropagation();
    if(g.kind==='resize')publishPaneDraft(resizeTechnicalPane(g.panes,g.paneId,event.clientY-g.startY,g.height),{source:'user',gesture:'pane-resize',phase:'change',paneId:g.paneId});
  };
  const endPaneGesture=(event:React.PointerEvent<HTMLElement>)=>{
    const g=paneGesture.current;if(!g||g.id!==event.pointerId)return;event.preventDefault();event.stopPropagation();paneGesture.current=null;
    let panes=paneDraftRef.current;
    if(g.kind==='reorder'){
      const surface=chartRef.current?.getSnapshot(),target=surface?.panes.find(p=>{const bounds=g.target.closest('[data-chart-surface]')?.getBoundingClientRect();const y=event.clientY-(bounds?.top??0);return y>=p.top&&y<=p.top+p.height;});
      if(target)panes=reorderTechnicalPane(g.panes,g.paneId,target.id);
    }
    publishPaneDraft(panes,{source:'user',gesture:g.kind==='resize'?'pane-resize':'pane-reorder',phase:'end',paneId:g.paneId});
    if(g.target.hasPointerCapture(g.id))g.target.releasePointerCapture(g.id);
  };
  const paneHeaders = (
    snapshot: MarketChartSnapshot | null,
    series: IndicatorRenderSeries[],
  ) => (
    <>
      {snapshot?.panes.map((geometry, paneIndex) => {
        const definition = displayedPanes.find((p) => p.id === geometry.id);
        if (!definition) return null;
        const pane=workspace&&interactionState.maximizedPaneId===definition.id?{...definition,collapsed:false}:definition;
        const paneSeries = series.filter(
          (s) => (s.placement === "overlay" ? "price" : s.paneId) === pane.id,
        );
        const paneLabel =
          pane.id === "price"
            ? symbol
            : pane.studyIds.map(labelFor).join(' / ') || (pane.showVolume ? 'Volume' : 'Study pane');
        const futureOnly=!!timeAxis?.futureDisplay&&(!!snapshot.futureInspection||!snapshot.visibleRange);
        const missingInspection=unifiedReadout&&snapshot.inspectionUnavailable===true;
        const noObservation=futureOnly||missingInspection;
        const inspectedBar=noObservation?undefined:snapshot.crosshair?.bar??data.at(-1);
        const inspectedTime = noObservation?snapshot.futureInspection?.time:snapshot.crosshair?.time ?? data.at(-1)?.time;
        const timeLabel = missingInspection?'Inspection unavailable · no observation':futureOnly ? inspectedTime == null ? 'Future display · no observation' : 'Future display · '+new Intl.DateTimeFormat(appearance?.locale,{dateStyle:'medium',timeStyle:'long',timeZone:'UTC'}).format(new Date(marketTimeKey(inspectedTime)*1000)) : inspectedTime == null ? 'No observation' : `${snapshot.crosshair ? 'Inspect' : 'Last'} · ${new Intl.DateTimeFormat(appearance?.locale, {dateStyle: 'medium', timeStyle: 'short', timeZone: appearance?.timeZone ?? 'UTC'}).format(new Date(marketTimeKey(inspectedTime) * 1000))}`;
        let groups: StudyLegendGroup[] = pane.studyIds.flatMap(id => {
          const instance = state.indicators.find(item => item.id === id && item.visible);
          const definition = availableIndicators.find(item => item.id === instance?.definitionId);
          if (!instance || !definition) return [];
          return [{id, label: labelFor(id), result: matchedResults[id], references: definition.referenceLines, lines: definition.lines.map(line => {
            const rendered = paneSeries.find(item => item.id === `${id}:${line.id}`);
            return {id:`${id}:${line.id}`,label: line.label, color: rendered?.color ?? instance.colors?.[line.id] ?? line.color ?? '#64748b', style: rendered?.style ?? line.style ?? 'line', value: noObservation || unifiedReadout&&calculationMode==='supplied'&&!matchedResults[id] ? null : rendered ? snapshot.crosshair ? snapshot.crosshair.values[rendered.id] ?? null : studyValueAt(rendered.points, inspectedTime) : null, formatValue: definition.formatValue};
          })}];
        });
        const volumeOnly=!unifiedReadout&&appearance?.studyReadout==='volume-only';
        const volumeBar=inspectedBar;
        groups.push(...supplementaryLegendGroups(state, pane.id, inspectedTime, volumeBar, matchedResults, profileResults, legendMetadata, calculationMode !== 'supplied'));
        if(noObservation)for(const group of groups)group.lines=group.lines.map(line=>({...line,value:null}));
        if(unifiedReadout){groups=applyInstrumentStudyText(groups,inspectedBar,instrumentEvidence);groups=[...groups.filter(group=>group.kind==='bar-volume'),...groups.filter(group=>group.kind!=='bar-volume')];}
        const inlineReadout=unifiedReadout||volumeOnly||appearance?.studyReadout==='inline';
        const compactReadout=inlineReadout&&!workspace&&paneMenuTrigger==='none';
        const narrowInstrument=unifiedReadout&&pane.id==='price'&&geometry.width<540;
        const headerEarnings=unifiedReadout&&pane.id==='price'&&!pane.collapsed&&earningsEvents.length>0&&!available.header;
        const visibleGroups=inlineReadout?inlineStudyGroups(groups,volumeOnly):groups;
        const hasHeaderContent=workspace||paneMenuTrigger==='internal'||(!pane.collapsed&&(unifiedReadout&&pane.id==='price'||visibleGroups.length>0));
        const minimumHeaderHeight=compactReadout?0:28;
        const headerHeight=hasHeaderContent?Math.max(minimumHeaderHeight,paneHeaderHeights[pane.id]??minimumHeaderHeight):0;
        return (
          <React.Fragment key={pane.id}>
            <MeasuredPaneHeader
              hasContent={hasHeaderContent}
              compactReadout={compactReadout}
              onHeightChange={height=>setPaneHeaderHeights(previous=>previous[pane.id]==null||Math.abs(previous[pane.id]-height)>(compactReadout?0:1)?{...previous,[pane.id]:height}:previous)}
              className={cn("absolute left-2 right-20 z-10 flex min-w-0 items-start gap-1 bg-background/90 text-[0.6875rem]",unifiedReadout&&"group",workspace?"pointer-events-auto":"pointer-events-none")}
              style={{ top: geometry.top, left: (geometry.left ?? 0) + 8, ...(inlineReadout?{right:'auto',width:Math.max(0,geometry.width-16)}:{}) }}
              label={`${paneLabel} pane legend`}
              onDoubleClick={event=>{if(workspace && !(event.target as HTMLElement).closest('button,input,[role="menuitem"]'))togglePane(pane.id);}}
            >
              {workspace?(pane.collapsed?<span aria-hidden="true" className="w-11 shrink-0" />:<button type="button" disabled={!!interactionState.maximizedPaneId} aria-label={`Reorder ${paneLabel} pane`} className={cn("pointer-events-auto relative top-2 z-20 -my-2 flex size-11 shrink-0 touch-none items-center justify-center rounded text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",narrowInstrument&&"absolute left-0 top-0 my-0")} onPointerDown={event=>startPaneGesture(event,'reorder',pane.id,geometry.height)} onPointerMove={movePaneGesture} onPointerUp={endPaneGesture} onPointerCancel={cancelPaneGesture} onLostPointerCapture={cancelPaneGesture} onKeyDown={event=>{if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();const panes=technicalChartViewReducer({...state,panes:displayedPanes},{type:'move-pane',id:pane.id,direction:event.key==='ArrowUp'?-1:1}).panes;publishPaneDraft(panes,{source:'user',gesture:'pane-reorder',phase:'end',paneId:pane.id});}}}><span aria-hidden="true" className={narrowInstrument?undefined:"inline-block -translate-y-2"}>↕</span></button>):null}
              <DropdownMenu open={paneMenu===undefined?undefined:paneMenu?.paneId===pane.id}
                onOpenChange={open=>{if(!open)onPaneMenuChange?.(null);else{const trigger=paneActionRefs.current.get(pane.id),bounds=trigger?.getBoundingClientRect();if(bounds)onPaneMenuChange?.({paneId:pane.id,anchor:{x:bounds.left,y:bounds.bottom},returnFocus:trigger});}}}>
                {paneMenuTrigger==='internal'?<span className={cn(unifiedReadout?'pointer-events-auto order-last inline-flex size-11 shrink-0':'contents',narrowInstrument&&'absolute top-0',unifiedReadout&&pane.collapsed&&'h-7')} style={narrowInstrument?{right:headerEarnings?'2.75rem':0}:undefined}><DropdownMenuTrigger asChild>
                  <Button
                    size="xs"
                    colorStyle="ghost"
                    className={cn("pointer-events-auto h-7 max-w-[45%] shrink-0 bg-background/90 px-1",unifiedReadout&&"order-last size-11 min-w-11 opacity-0 focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100",unifiedReadout&&pane.collapsed&&'h-7')}
                    ref={node=>{if(node)paneActionRefs.current.set(pane.id,node);else paneActionRefs.current.delete(pane.id);}}
                    aria-label={`${paneLabel} pane actions`}
                    style={paneMenu?.paneId===pane.id?{position:'fixed',left:paneMenu.anchor.x,top:paneMenu.anchor.y,width:1,height:1,pointerEvents:'none',opacity:0}:undefined}
                  >
                    {unifiedReadout?<MoreHorizontal className="size-4"/>:<><span className="min-w-0 truncate" title={paneLabel}>{paneLabel}</span><ChevronDown className="size-3 shrink-0"/></>}
                  </Button>
                </DropdownMenuTrigger></span>:paneMenu?.paneId===pane.id?<DropdownMenuTrigger asChild><span aria-hidden="true" tabIndex={-1} style={{position:'fixed',left:paneMenu.anchor.x,top:paneMenu.anchor.y,width:1,height:1,pointerEvents:'none',opacity:0}}/></DropdownMenuTrigger>:null}
                <DropdownMenuContent aria-labelledby={undefined} aria-label={`${paneLabel} pane actions`} className="max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[var(--radix-dropdown-menu-content-available-width)] overflow-y-auto motion-reduce:animate-none" collisionPadding={8}
                  onCloseAutoFocus={event=>{if(paneMenuFocus.current?.isConnected){event.preventDefault();paneMenuFocus.current.focus();paneMenuFocus.current=undefined;}}}>
                  {workspace?<>
                    <DropdownMenuItem onSelect={()=>togglePane(pane.id)}>{interactionState.maximizedPaneId===pane.id?'Restore pane stack':'Maximize pane'}</DropdownMenuItem>
                    <DropdownMenuItem onSelect={()=>chartRef.current?.resetPaneScale(pane.id,{source:'user',gesture:'reset',paneId:pane.id})}>Reset pane scale</DropdownMenuItem>
                    <DropdownMenuItem disabled={!!interactionState.maximizedPaneId} onSelect={()=>publishPaneDraft(resizeTechnicalPane(displayedPanes,pane.id,40,geometry.height),{source:'user',gesture:'pane-resize',phase:'end',paneId:pane.id})}>Grow pane</DropdownMenuItem>
                    <DropdownMenuItem disabled={!!interactionState.maximizedPaneId} onSelect={()=>publishPaneDraft(resizeTechnicalPane(displayedPanes,pane.id,-40,geometry.height),{source:'user',gesture:'pane-resize',phase:'end',paneId:pane.id})}>Shrink pane</DropdownMenuItem>
                  </>:null}
                  <DropdownMenuItem
                    disabled={!!interactionState.maximizedPaneId}
                    onSelect={() =>
                      changePane(pane.id, { collapsed: !pane.collapsed })
                    }
                  >
                    {pane.collapsed ? "Expand pane" : "Collapse pane"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    icon={<ArrowUp />}
                    disabled={paneIndex === 0||!!interactionState.maximizedPaneId}
                    onSelect={() =>
                      onStateChange(
                        technicalChartViewReducer(state, {
                          type: "move-pane",
                          id: pane.id,
                          direction: -1,
                        }),
                        { type: "pane-reorder", id: pane.id,source:"user",gesture:"pane-reorder",phase:"end" },
                      )
                    }
                  >
                    Move pane up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    icon={<ArrowDown />}
                    disabled={paneIndex === snapshot.panes.length - 1||!!interactionState.maximizedPaneId}
                    onSelect={() =>
                      onStateChange(
                        technicalChartViewReducer(state, {
                          type: "move-pane",
                          id: pane.id,
                          direction: 1,
                        }),
                        { type: "pane-reorder", id: pane.id,source:"user",gesture:"pane-reorder",phase:"end" },
                      )
                    }
                  >
                    Move pane down
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      changePane(pane.id, { showVolume: !pane.showVolume })
                    }
                  >
                    {pane.showVolume ? "Hide volume" : "Show volume"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      changePane(pane.id, {
                        scaleSide: pane.scaleSide === "left" ? "right" : "left",
                      })
                    }
                  >
                    Move scale {pane.scaleSide === "left" ? "right" : "left"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      changePane(pane.id, {
                        precision: pane.precision === 4 ? 2 : 4,
                      })
                    }
                  >
                    Use {pane.precision === 4 ? 2 : 4} decimal places
                  </DropdownMenuItem>
                  {pane.id !== "price" ? (
                    <DropdownMenuItem
                      onSelect={() =>
                        emit(
                          {
                            panes: state.panes.filter((p) => p.id !== pane.id),
                            indicators: state.indicators.filter(
                              (i) => !pane.studyIds.includes(i.id),
                            ),
                          },
                          "pane",
                          pane.id,
                        )
                      }
                    >
                      Remove pane and studies
                    </DropdownMenuItem>
                  ) : null}
                  {pane.id === "price" && earningsEvents.length ? (
                    <DropdownMenuItem onSelect={() => setEarningsOpen(true)}>
                      Earnings dates ({earningsEvents.length})
                    </DropdownMenuItem>
                  ) : null}
                  {pane.id==="price"?<DropdownMenuItem onSelect={()=>{chartRef.current?.resetPaneScale("price",{source:"user",gesture:"reset",paneId:"price"});emit({scale:{mode:state.scale.mode,autoScale:true}},"scale",undefined,{source:"user",gesture:"reset"});}}>Reset price scale</DropdownMenuItem>:null}
                  {pane.id==='price'?<DropdownMenuItem disabled={!allowLogScale&&actualScale.mode!=='logarithmic'} onSelect={()=>setScaleMode(actualScale.mode==='logarithmic'?'normal':'logarithmic')}>{actualScale.mode==='logarithmic'?'Use linear scale':'Use logarithmic scale'}</DropdownMenuItem>:null}
                  <DropdownMenuSeparator />
                  {pane.studyIds.map((id) => (
                    <DropdownMenuItem
                      key={id}
                      onSelect={() => {
                        setStudyId(id);
                        openPanel("study");
                      }}
                    >
                      Edit {labelFor(id)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {!pane.collapsed?(instrumentReadout&&pane.id==='price'?<InstrumentReadout value={instrumentReadout} symbol={symbol} interval={interval} bar={inspectedBar} evidence={instrumentEvidence} timeLabel={timeLabel} narrow={narrowInstrument} actionsWidth={(paneMenuTrigger==='internal'?44:0)+(headerEarnings?44:0)} leadingWidth={workspace?44:0} locale={appearance?.locale}><StudyLegend groups={groups} compactValues={unifiedReadout} inline={inlineReadout} volumeOnly={volumeOnly} width={Math.max(80,geometry.width-(unifiedReadout?16:pane.id==='price'?100:90))} locale={appearance?.locale} timeLabel={timeLabel} showIdentity={pane.id === 'price' || pane.studyIds.length > 1}
                  onRequestEvidence={appearance?.suppliedStatus!=='host'&&appearance?.suppliedDetails!==false&&onRequestSuppliedDetails ? () => onRequestSuppliedDetails({requests, results: matchedResults, rejectedResults: Object.fromEntries(requests.filter(request => suppliedResults[request.instanceId] && !matchedResults[request.instanceId]).map(request => [request.instanceId, suppliedResults[request.instanceId]])), missingIdentity: !calculationIdentity, availability: dataAvailability}) : undefined}/></InstrumentReadout>:<StudyLegend groups={groups} compactValues={unifiedReadout} inline={inlineReadout} volumeOnly={volumeOnly} width={Math.max(80,geometry.width-(unifiedReadout?16:pane.id==='price'?100:90))} locale={appearance?.locale} timeLabel={timeLabel} showIdentity={pane.id === 'price' || pane.studyIds.length > 1}
                  onRequestEvidence={appearance?.suppliedStatus!=='host'&&appearance?.suppliedDetails!==false&&onRequestSuppliedDetails ? () => onRequestSuppliedDetails({requests, results: matchedResults, rejectedResults: Object.fromEntries(requests.filter(request => suppliedResults[request.instanceId] && !matchedResults[request.instanceId]).map(request => [request.instanceId, suppliedResults[request.instanceId]])), missingIdentity: !calculationIdentity, availability: dataAvailability}) : undefined}/>):null}
              {headerEarnings?<button type="button" aria-label="Earnings events" className={cn("pointer-events-auto order-last flex size-11 shrink-0 items-center justify-center text-xs focus-visible:ring-2 focus-visible:ring-ring",narrowInstrument&&'absolute right-0 top-0')} onClick={()=>setEarningsOpen(true)}>E</button>:null}
            </MeasuredPaneHeader>
            {pane.id === "price" && !pane.collapsed ? (
              <>
                {!unifiedReadout?<div
                  aria-label="OHLC readout"
                  aria-live="off"
                  className="pointer-events-none absolute right-20 z-10 flex flex-wrap items-baseline gap-x-2 overflow-hidden bg-background/90 font-mono text-[0.6875rem] leading-[0.875rem] tabular-nums"
                  style={{
                    top: geometry.top + headerHeight,
                    left: (geometry.left ?? 0) + 8,
                    ...(inlineReadout?{right:'auto',width:Math.max(0,geometry.width-16)}:{}),
                    maxHeight: Math.max(0,Math.min(28,geometry.height-headerHeight)),
                  }}
                >
                  {(["open", "high", "low", "close"] as const).map((key) => (
                    <span
                      key={key}
                      title={String(inspectedBar?.[key] ?? "—")}
                      aria-label={`${key}: ${inspectedBar?.[key] ?? "unavailable"}`}
                      className="inline-flex min-w-0 max-w-[calc(50%-0.25rem)] items-baseline gap-1 whitespace-nowrap"
                    >
                      <span className="shrink-0 text-muted-foreground">
                        {key[0].toUpperCase()}
                      </span>{" "}
                      <span className="min-w-0 truncate">
                      {appearance?.legends==="compact" ? (inspectedBar?.[key] == null ? "—" : new Intl.NumberFormat(appearance.locale,{notation:"compact",maximumSignificantDigits:5}).format(inspectedBar[key])) : calculationMode === "supplied" ? String(inspectedBar?.[key] ?? "—") : inspectedBar?.[key].toFixed(pane.precision ?? 2) ?? "—"}
                      </span>
                    </span>
                  ))}
                  <span
                    className={cn(
                      "text-muted-foreground",
                      geometry.width < 400 && "sr-only",
                    )}
                  >
                    {futureOnly?"Future display · unavailable":snapshot.crosshair ? "Inspect" : "Last"}{inspectedBar?.incomplete ? " · Incomplete bar" : ""} {!futureOnly&&countdown}
                  </span>
                </div>:null}
                {earningsEvents.map(({ event, anchor }) => {
                  const x =
                    anchor == null
                      ? null
                      : chartRef.current?.coordinateForTime(anchor);
                  const pinLeft = earningsPinLeft(x, geometry);
                  if (pinLeft == null) return null;
                  return (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={earningsDescription(event)}
                          onClick={(click) => {
                            earningsTriggerRef.current = click.currentTarget;
                            setEarningsOpen(true);
                          }}
                          className="pointer-events-auto absolute z-20 flex size-6 items-center justify-center rounded-full border border-violet-400 bg-background text-xs font-semibold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          style={{
                            left: pinLeft,
                            width: 24,
                            height: 24,
                            top: geometry.top + geometry.height - 27,
                          }}
                        >
                          E
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {earningsDescription(event)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </>
            ) : null}
            {paneIndex < snapshot.panes.length - 1 && (!workspace || !pane.collapsed) ? (
              <div
                role="separator"
                tabIndex={0}
                aria-label={`Resize ${paneLabel} pane`}
                aria-orientation="horizontal"
                aria-valuetext={workspace?`${Math.round(geometry.height)} pixels`:undefined}
                aria-valuemin={workspace?(pane.minimumSize??48):5}
                aria-valuemax={workspace?100000:95}
                aria-valuenow={Math.round(
                  workspace?geometry.height:(geometry.height / (height - 28)) * 100,
                )}
                className={cn("absolute right-0 z-20 focus-visible:bg-ring focus-visible:outline-none",workspace?"pointer-events-auto flex size-11 touch-none cursor-row-resize items-center justify-center rounded hover:bg-muted/50 before:block before:h-1 before:w-6 before:rounded before:bg-border":"pointer-events-none left-0 h-1")}
                onPointerDown={workspace?event=>startPaneGesture(event,'resize',pane.id,geometry.height):undefined}
                onPointerMove={workspace?movePaneGesture:undefined} onPointerUp={workspace?endPaneGesture:undefined} onPointerCancel={cancelPaneGesture} onLostPointerCapture={cancelPaneGesture}
                style={{ top: geometry.top + geometry.height - (workspace?22:2) }}
                onKeyDown={(event) => {
                  if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
                  event.preventDefault();
                  if(workspace){publishPaneDraft(resizeTechnicalPane(displayedPanes,pane.id,event.key==='ArrowUp'?-40:40,geometry.height),{source:'user',gesture:'pane-resize',phase:'end',paneId:pane.id});return;}
                  const nextPane = state.panes.find(
                    (p) => p.id === snapshot.panes[paneIndex + 1].id,
                  );
                  if (!nextPane) return;
                  const delta = event.key === "ArrowUp" ? -0.1 : 0.1;
                  if (pane.size + delta < 0.1 || nextPane.size - delta < 0.1)
                    return;
                  emit(
                    {
                      panes: state.panes.map((p) =>
                        p.id === pane.id
                          ? { ...p, size: p.size + delta }
                          : p.id === nextPane.id
                            ? { ...p, size: p.size - delta }
                            : p,
                      ),
                    },
                    "pane-resize",
                    pane.id,
                    {source:"user",gesture:"pane-resize"},
                  );
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
      {profileHit && (calculationMode === "internal" || profileResults[profileHit.profileId]?.rows.includes(profileHit.row)) ? (
        <div className="pointer-events-none absolute bottom-8 right-20 z-10 rounded bg-background/95 px-2 py-1 text-[0.6875rem] shadow-sm">
          {profileHit.row.priceFrom}–{profileHit.row.priceTo} · {profileHit.row.volume != null ? `Volume ${profileHit.row.volume}` : `Up ${profileHit.row.upVolume} / Down ${profileHit.row.downVolume}`}
        </div>
      ) : null}
    </>
  );
  const safeDom = Object.fromEntries(
    Object.entries(domProps).filter(
      ([key]) => key.startsWith("aria-") || key.startsWith("data-"),
    ),
  );
  return (
    <ChartThemeContext.Provider value={{ theme, style: { ...(theme ? technicalChartThemes[theme] : {}), ...style } }}>
    <TooltipProvider delayDuration={300}>
      <Dialog open={earningsOpen} onOpenChange={setEarningsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto" onCloseAutoFocus={(event) => {
          const trigger = earningsTriggerRef.current;
          earningsTriggerRef.current = null;
          if (trigger?.isConnected) {
            event.preventDefault();
            trigger.focus({preventScroll:true});
          }
        }}>
          <DialogTitle>{symbol} earnings</DialogTitle>
          <DialogDescription>
            Supplied announcement dates. Dates beyond the available candles are
            listed as upcoming.
          </DialogDescription>
          <ul className="space-y-4">
            {earningsEvents.map(({ event }) => (
              <li
                key={event.id}
                className="border-b border-border pb-3 text-sm"
              >
                <p className="font-medium">{earningsDescription(event)}</p>
                <p className="mt-1 text-muted-foreground">
                  Reported EPS: {event.reportedEps ?? "—"} · Estimated EPS:{" "}
                  {event.estimatedEps ?? "—"}
                </p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
      <div
        {...safeDom}
        ref={rootRef}
        id={id}
        role={role}
        tabIndex={tabIndex}
        style={{ ...(theme ? technicalChartThemes[theme] : {}), ...style }}
        data-technical-chart-view=""
        data-maximized={state.chrome.maximized || undefined}
        className={cn(
          "relative min-w-0 overflow-hidden rounded-lg border border-border bg-background text-foreground [&_button]:motion-reduce:transition-none",
          state.chrome.maximized &&
            "absolute inset-0 z-40 overflow-auto rounded-none",
          className,
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if(workspace&&event.key==="Escape"&&interactionState.maximizedPaneId&&!panel&&!earningsOpen&&!(event.target as HTMLElement).closest("input,textarea,[contenteditable=true],[role=menu]")){event.preventDefault();restorePane();return;}
          if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
          ) {
            event.preventDefault();
            openPanel("commands");
          }
        }}
      >
        <div ref={intrinsicContentRef} className={workspace?"flow-root min-w-0":"contents"}>
        <div className={cn("flex h-9 items-center justify-between gap-3 border-b border-border bg-muted/25 px-3 text-xs", !available.header && "hidden")}>
          <span className="truncate font-medium tracking-wide">
            {appearance?.title ?? "Technical analysis"}
          </span>
          {earningsEvents.length ? (
            <button
              type="button"
              className="ml-auto shrink-0 rounded px-1 text-xs text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setEarningsOpen(true)}
            >
              Earnings ({earningsEvents.length})
            </button>
          ) : null}
          <span
            className="truncate text-muted-foreground"
            title={dataAvailability?.description}
          >
            {dataAvailability?.status ?? `${data.length.toLocaleString()} bars`}
          </span>
        </div>
        <div
          role="toolbar"
          aria-label="Chart commands"
          className={cn("flex h-11 min-w-0 items-center gap-1 border-b border-border px-2", !available.commands && "hidden")}
        >
          <Action
            label={`Search symbol: ${symbol}`}
            onClick={() => openPanel("symbol")}
            disabled={!onSymbolChange}
          >
            <Search className="size-3.5" />
            <span className="max-w-24 truncate font-semibold">{symbol}</span>
          </Action>
          <Action
            label="Choose interval"
            onClick={() => openPanel("interval")}
            disabled={!onIntervalChange}
          >
            {interval}
            <ChevronDown className="size-3" />
          </Action>
          {!narrow ? (
            <>
              <div className="mx-1 h-5 w-px bg-border" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    colorStyle="ghost"
                    aria-label="Series style"
                  >
                    <ChartNoAxesCombined className="size-4" />
                    <span className="capitalize">{state.chartType}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(
                    [
                      "candlestick",
                      "bar",
                      "line",
                      "area",
                      "baseline",
                    ] as MarketChartType[]
                  ).map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() => emit({ chartType: type }, "layout")}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {available.indicators ? (
                <Action
                  label="Add indicators"
                  onClick={() => openPanel("indicators")}
                >
                  <ChartNoAxesCombined className="size-4" />
                  Studies
                </Action>
              ) : null}
              {onRequestFinancials ? (
                <Action label="Financial data" onClick={onRequestFinancials}>
                  Financials
                </Action>
              ) : null}
            </>
          ) : null}
          <div className="flex-1" />
          {narrow && available.drawingRail ? (
            <Action
              label="Drawing tools"
              iconOnly
              aria-pressed={mobileToolsOpen}
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
            >
              <PanelLeft className="size-4" />
            </Action>
          ) : null}
          <Action
            label="Chart settings"
            iconOnly
            onClick={() => openPanel("settings")}
          >
            <SlidersHorizontal className="size-4" />
          </Action>
          {!narrow ? (
            <Action
              label={
                state.chrome.maximized ? "Restore chart" : "Maximize chart"
              }
              iconOnly
              onClick={maximize}
            >
              {state.chrome.maximized ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </Action>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                colorStyle="ghost"
                iconOnly
                aria-label="More chart actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => openPanel("commands")}>
                All commands · Ctrl/Cmd+K
              </DropdownMenuItem>
              {narrow && available.indicators ? (
                <DropdownMenuItem onSelect={() => openPanel("indicators")}>
                  Add indicators
                </DropdownMenuItem>
              ) : null}
              {onRequestFinancials && narrow ? (
                <DropdownMenuItem onSelect={onRequestFinancials}>
                  Financial data
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onSelect={maximize}>
                {state.chrome.maximized ? "Restore chart" : "Maximize chart"}
              </DropdownMenuItem>
              {onRequestFullscreen ? (
                <DropdownMenuItem onSelect={onRequestFullscreen}>
                  Request fullscreen
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                onSelect={() =>
                  emit(
                    {
                      chrome: {
                        ...state.chrome,
                        drawingRail: !state.chrome.drawingRail,
                      },
                    },
                    "chrome",
                  )
                }
              >
                Toggle drawing tools
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  emit(
                    {
                      chrome: { ...state.chrome, footer: !state.chrome.footer },
                    },
                    "chrome",
                  )
                }
              >
                Toggle status bar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  emit(
                    {
                      ...createTechnicalChartViewState(),
                      drawings: state.drawings,
                      overlays: state.overlays,
                      extensions: state.extensions,
                    },
                    "layout",
                  )
                }
              >
                Daily analysis layout
              </DropdownMenuItem>
              {onRequestExport ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    icon={<Download />}
                    onSelect={() => exportChart("png")}
                  >
                    Export image
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => exportChart("csv")}>
                    Export data
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!available.commands && narrow && available.drawingRail && state.chrome.drawingRail ? (
          <div className="flex min-h-11 items-center border-b border-border px-2">
            <Action label="Drawing tools" aria-pressed={mobileToolsOpen} onClick={()=>setMobileToolsOpen(!mobileToolsOpen)}><PanelLeft className="size-4"/>Drawing tools</Action>
          </div>
        ) : null}
        {unknownStudies.length ? (
          <p role="status" className="px-3 text-xs">
            Unavailable studies:{" "}
            {unknownStudies.map((i) => i.definitionId).join(", ")}. Their saved
            settings are preserved.
          </p>
        ) : null}
        {!integratedNavigation ? suppliedStatus : null}
        {accepted.receipt && ["superseded","identity-mismatch","invalid"].includes(accepted.receipt.status)?<p role="status" aria-label="Bar update status" className="px-3 py-1 text-xs text-foreground">Bar update {accepted.receipt.status}. Last accepted snapshot retained. {accepted.receipt.message}</p>:null}
        {workspace&&interactionState.maximizedPaneId?<Button size="sm" colorStyle="ghost" className="m-1" onClick={()=>restorePane()}>Restore pane stack</Button>:null}
        <MarketChart
          interactions={interactions} interactionState={interactionState} onInteractionStateChange={changeInteraction} viewportCommand={viewportCommand}
          onContentHeightChange={workspace?setRenderedPlotHeight:undefined}
          canvasHostRef={canvasHostRef}
          presentation={presentation}
          drawingToolIds={drawingToolIds}
          drawingCommand={drawingCommand}
          onDrawingHistoryChange={onDrawingHistoryChange}
          timeAxis={timeAxis}
          discontinuities={discontinuities}
          calculationMode={calculationMode}
          suppliedIndicatorSeries={suppliedSeries}
          suppliedDrawingResults={matchedResults}
          themeRevision={JSON.stringify([theme, style])}
          onVisibleRangeChange={onVisibleRangeChange}
          onSnapshotChange={iconScales?observeAxis:undefined}
          ref={chartRef}
          data={renderData}
          dataIdentity={dataIdentity??hostCalculationIdentity??JSON.stringify([symbol,interval])}
          symbol={symbol}
          interval={interval}
          height={height}
          chartType={state.chartType}
          scaleMode={state.scale.mode}
          scale={state.scale}
          viewport={state.viewport}
          panes={renderingPanes}
          paneSizes={paneSizes}
          showVolume={false}
          showControls={false}
          showSummary={false}
          dataTable="none"
          loading={loading}
          error={error}
          emptyMessage={emptyMessage}
          markers={markers}
          priceReferences={priceReferences}
          indicators={indicators}
          overlays={state.overlays}
          renderLayers={layers}
          engineFactory={engineFactory}
          locale={appearance?.locale}
          timeZone={appearance?.timeZone ?? "UTC"}
          className={cn(
            "relative rounded-none border-0",
            available.drawingRail &&
              state.chrome.drawingRail &&
              !narrow &&
              "grid grid-cols-[3rem_minmax(0,1fr)] [&>div[role=toolbar]]:row-span-3",
          )}
          chartDescription={`${symbol}, ${interval}, ${state.chartType}, ${data.length} bars, ${state.panes.filter((p) => p.visible !== false).length} panes. Arrow keys inspect, plus and minus zoom, Home and End navigate.`}
          drawings={state.drawings}
          drawingEditor={drawingEditor}
          selectedDrawingIds={state.selectedDrawingIds}
          activeDrawingTool={state.activeDrawingTool}
          showDrawingToolbar={
            available.drawingRail &&
            state.chrome.drawingRail &&
            (!narrow || mobileToolsOpen)
          }
          drawingToolbarOrientation="vertical"
          drawingToolbarClassName={
            narrow
              ? "absolute left-1 top-1 z-30 max-h-[30rem] overflow-auto rounded border border-border shadow-lg"
              : undefined
          }
          drawingPreferences={{
            favoriteToolIds: state.chrome.favoriteTools,
            keepDrawingMode: state.chrome.keepDrawingMode,
          }}
          drawingInteraction={{ snapMode: state.chrome.magnet }}
          onDrawingsChange={(drawings,metadata) => emit({ drawings }, "drawing",undefined,undefined,metadata)}
          onSelectedDrawingIdsChange={(selectedDrawingIds) =>
            emit({ selectedDrawingIds }, "drawing",undefined,undefined,{type:'selection',drawingIds:selectedDrawingIds})
          }
          onActiveDrawingToolChange={(activeDrawingTool) =>
            emit({ activeDrawingTool }, "drawing")
          }
          onDrawingPreferencesChange={(preferences) =>
            emit(
              {
                chrome: {
                  ...state.chrome,
                  favoriteTools:
                    preferences.favoriteToolIds ?? state.chrome.favoriteTools,
                  keepDrawingMode:
                    preferences.keepDrawingMode ?? state.chrome.keepDrawingMode,
                },
              },
              "chrome",
            )
          }
          onScaleChange={(scale,metadata) => emit({ scale }, "scale",undefined,metadata)}
          onPaneSizesChange={(sizes,metadata) => {
            if(workspace){publishPaneDraft(paneDraftRef.current.map(p=>({...p,size:sizes[p.id]??p.size})),metadata??{source:'user',gesture:'pane-resize',phase:'end'});return;}
            emit(
              {
                panes: state.panes.map((p) => ({
                  ...p,
                  size: sizes[p.id] ?? p.size,
                })),
              },
              "pane-resize",undefined,metadata,
            );
          }}
          onViewportChange={(viewport,metadata) => {
            clearTimeout(viewportTimer.current);
            viewportTimer.current = setTimeout(() => {
              // Empty future presentation must not broaden visible-profile inputs to the whole dataset.
              const futureOnly=!!timeAxis?.futureDisplay&&!viewport.visibleRange;
              const retained=futureOnly?latest.current.state.viewport.visibleRange:viewport.visibleRange;
              const next=futureOnly?{...viewport,visibleRange:retained}:viewport;
              setSettledRange(current=>futureOnly?retained??current:viewport.visibleRange);
              emit({ viewport:next }, "viewport",undefined,metadata);
            }, 140);
          }}
          formatKeyboardInspection={instrumentReadout?snapshot=>instrumentKeyboardText(instrumentReadout,symbol,interval,snapshot,instrumentEvidence,new Map(state.indicators.filter(i=>i.visible).flatMap(i=>availableIndicators.find(d=>d.id===i.definitionId)?.lines.map(line=>[i.id+':'+line.id,labelFor(i.id)+' '+line.label] as const)??[]))):undefined}
          renderSurfaceOverlay={paneHeaders}
        />
        {available.footer && state.chrome.footer ? (
          <div
            className={cn('min-h-10 border-t border-border text-xs',iconScales?'grid items-start':'flex flex-wrap items-center gap-1 px-2 py-1')}
            style={iconScales?{gridTemplateColumns:liveAxis?.priceAxis?.side==='left'?`${Math.max(0,(rootRef.current?.clientWidth??0)-liveAxis.priceAxis.surfaceWidth)}px 88px minmax(0,1fr)`:'minmax(0,1fr) 88px'}:undefined}
            aria-label="Range and status"
          >
            <div className={cn(iconScales?'flex min-w-0 flex-wrap items-center gap-1 px-2 py-1 [overflow-wrap:anywhere]':'contents')} style={iconScales?{gridColumn:liveAxis?.priceAxis?.side==='left'?3:1,gridRow:1}:undefined}>
            {integratedNavigation ? <div className="flex shrink-0 items-center" role="group" aria-label="Chart navigation">
              {navigationControls ?? (narrow ? <DropdownMenu><DropdownMenuTrigger asChild><Button type="button" size="xs" colorStyle="ghost" className="h-8">Navigate<ChevronDown className="size-3"/></Button></DropdownMenuTrigger><DropdownMenuContent>{([['left', 'Pan left'], ['right', 'Pan right'], ['in', 'Zoom in'], ['out', 'Zoom out']] as const).map(([intent, label]) => <DropdownMenuItem key={intent} onSelect={() => navigate(intent)} disabled={!data.length}>{label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu> : <>{([['left', 'Pan left', '←'], ['right', 'Pan right', '→'], ['in', 'Zoom in', '+'], ['out', 'Zoom out', '−']] as const).map(([intent, label, glyph]) => <Action key={intent} label={label} onClick={() => navigate(intent)} disabled={!data.length}>{glyph}</Action>)}</>)}
            </div> : navigationControls}
            {rangeShortcuts.map((shortcut) => (
              <Action
                key={shortcut.label}
                label={`Range ${shortcut.label}`}
                onClick={() => range(shortcut.bars)}
              >
                {shortcut.label}
              </Action>
            ))}
            <Action
              label="Fit content"
              onClick={() => chartRef.current?.fitContent({source:"user",gesture:"reset"})}
            >
              Fit
            </Action>
            <Action
              label="Go to latest bar"
              onClick={() => chartRef.current?.scrollToRealtime({source:"user",gesture:"reset"})}
            >
              Latest
            </Action>
            <div className="flex-1" />
            {!iconScales?<><Action
              label="Toggle automatic scale"
              aria-pressed={state.scale.autoScale}
              onClick={() => {
                if(workspace&&!state.scale.autoScale)chartRef.current?.resetPaneScale("price",{source:"user",gesture:"reset",paneId:"price"});
                const snapshot = chartRef.current?.getSnapshot()?.scales.price;
                emit(
                  {
                    scale: {
                      ...state.scale,
                      autoScale: !state.scale.autoScale,
                      manualRange: snapshot
                        ? {
                            minimum: snapshot.minimum,
                            maximum: snapshot.maximum,
                            anchor: snapshot.anchor,
                          }
                        : state.scale.manualRange,
                    },
                  },
                  "scale",
                );
              }}
            >
              Auto
            </Action>
            <Action
              label="Toggle logarithmic scale"
              disabled={!allowLogScale&&actualScale.mode!=='logarithmic'}
              aria-pressed={actualScale.mode === "logarithmic"}
              onClick={() =>
                setScaleMode(
                  actualScale.mode === "logarithmic" ? "normal" : "logarithmic",
                )
              }
            >
              Log
            </Action></>:null}
            {onRequestTimezone ? (
              <Action label="Choose timezone" onClick={onRequestTimezone}>
                {appearance?.timeZone ?? "UTC"}
              </Action>
            ) : (
              <span className="px-2 text-muted-foreground">
                {appearance?.timeZone ?? "UTC"}
              </span>
            )}
            {available.dataTable ? (
              <Action
                label="View chart data"
                iconOnly
                aria-pressed={tableOpen}
                onClick={() => setTableOpen(!tableOpen)}
              >
                <Table2 className="size-4" />
              </Action>
            ) : null}
            {status}
            {clock}
            {integratedNavigation ? suppliedStatus : null}
            {footerActions}
            </div>
            {iconScales?<div style={{gridColumn:2,gridRow:1,width:liveAxis?.priceAxis?.width??88}}><TimelineScaleControls allowLogScale={allowLogScale} scale={actualScale} onAuto={toggleAuto} onLog={()=>setScaleMode(actualScale.mode==='logarithmic'?'normal':'logarithmic')}/></div>:null}
          </div>
        ) : null}
        {Object.entries(profileResults).length && appearance?.suppliedStatus!=="compact" && appearance?.suppliedStatus!=="host" ? (
          <div
            className="flex flex-wrap gap-x-4 border-t border-border px-3 py-1 text-[0.6875rem] text-muted-foreground"
            aria-label="Volume profile summary"
          >
            {Object.entries(profileResults).map(([id, r]) => (
              <span key={id}>
                {r.provenance === "supplied-levels"
                  ? "Supplied volume levels"
                  : "Approximate volume profile · bar-derived-approximation"}{" "}
                ·{" "}
                {r.unavailable ??
                  `POC ${r.poc ?? "—"} · VAH ${r.vah ?? "—"} · VAL ${r.val ?? "—"} · Volume ${r.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 20 })}`}
              </span>
            ))}
          </div>
        ) : null}
        {tableOpen ? (
          <TechnicalDataTable
            data={data}
            calculationMode={calculationMode}
            suppliedResults={matchedResults}
            indicators={indicators}
            results={profileResults}
          />
        ) : null}
        <Dialog
          open={panel !== null}
          onOpenChange={(open) => {
            if (!open) setPanel(null);
          }}
        >
          <DialogContent
            className={cn(
              "max-h-[85dvh] overflow-auto motion-reduce:animate-none",
              narrow && "max-w-[calc(100%-1rem)]",
            )}
          >
            <DialogTitle>
              {panel === "symbol"
                ? "Find symbol"
                : panel === "interval"
                  ? "Chart interval"
                  : panel === "indicators"
                    ? "Add study"
                    : panel === "study"
                      ? "Study settings"
                      : panel === "commands"
                        ? "Chart commands"
                        : "Chart settings"}
            </DialogTitle>
            <DialogDescription>
              Configure {symbol} · {interval}
            </DialogDescription>
            {["symbol", "interval", "indicators", "commands"].includes(
              panel ?? "",
            ) ? (
              <input
                autoFocus
                className={inputClass}
                aria-label="Search"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            ) : null}
            {panel === "symbol" ? (
              <div className="grid gap-1">
                <p role="status" className="text-xs">
                  {searchStatus}
                </p>
                {symbolSearch ? (
                  symbols.map((result) => (
                    <Button
                      key={result.symbol}
                      colorStyle="ghost"
                      onClick={() => {
                        onSymbolChange?.(result.symbol);
                        setPanel(null);
                      }}
                    >
                      {result.symbol} {result.name} {result.exchange}
                    </Button>
                  ))
                ) : (
                  <Button
                    disabled={!query.trim()}
                    onClick={() => {
                      onSymbolChange?.(query.trim().toUpperCase());
                      setPanel(null);
                    }}
                  >
                    Use {query.toUpperCase() || "symbol"}
                  </Button>
                )}
              </div>
            ) : null}
            {panel === "interval" ? (
              <div className="grid gap-1">
                {intervalOptions
                  .filter((i) =>
                    `${i.label} ${i.value}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .sort(
                    (a, b) =>
                      Number(state.chrome.favoriteIntervals.includes(b.value)) -
                      Number(state.chrome.favoriteIntervals.includes(a.value)),
                  )
                  .map((option) => (
                    <div key={option.value} className="flex items-center">
                      <Button
                        colorStyle="ghost"
                        className="flex-1 justify-start"
                        onClick={() => {
                          onIntervalChange?.(option.value);
                          emit(
                            {
                              chrome: {
                                ...state.chrome,
                                recentIntervals: [
                                  option.value,
                                  ...state.chrome.recentIntervals.filter(
                                    (v) => v !== option.value,
                                  ),
                                ].slice(0, 5),
                              },
                            },
                            "chrome",
                          );
                          setPanel(null);
                        }}
                      >
                        {option.label}{" "}
                        {state.chrome.recentIntervals.includes(option.value)
                          ? "· recent"
                          : ""}
                      </Button>
                      <Button
                        size="xs"
                        colorStyle="ghost"
                        aria-label={`Favorite ${option.label}`}
                        aria-pressed={state.chrome.favoriteIntervals.includes(
                          option.value,
                        )}
                        onClick={() =>
                          emit(
                            {
                              chrome: {
                                ...state.chrome,
                                favoriteIntervals:
                                  state.chrome.favoriteIntervals.includes(
                                    option.value,
                                  )
                                    ? state.chrome.favoriteIntervals.filter(
                                        (v) => v !== option.value,
                                      )
                                    : [
                                        ...state.chrome.favoriteIntervals,
                                        option.value,
                                      ],
                              },
                            },
                            "chrome",
                          )
                        }
                      >
                        {state.chrome.favoriteIntervals.includes(option.value)
                          ? "★"
                          : "☆"}
                      </Button>
                    </div>
                  ))}
              </div>
            ) : null}
            {panel === "indicators" ? (
              <div className="grid gap-1">
                {availableIndicators
                  .filter((d) =>
                    d.label.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((d) => (
                    <Button
                      key={d.id}
                      colorStyle="ghost"
                      className="justify-start"
                      onClick={() => addIndicator(d)}
                    >
                      {d.label}
                    </Button>
                  ))}
              </div>
            ) : null}
            {panel === "commands" ? (
              <div className="grid gap-1">
                {[
                  { label: "Chart settings", run: () => openPanel("settings") },
                  {
                    label: "Add indicators",
                    run: () => openPanel("indicators"),
                    enabled: available.indicators,
                  },
                  {
                    label: "Fit content",
                    run: () => {
                      chartRef.current?.fitContent({source:"user",gesture:"reset"});
                      setPanel(null);
                    },
                  },
                  {
                    label: "Go to latest bar",
                    run: () => {
                      chartRef.current?.scrollToRealtime({source:"user",gesture:"reset"});
                      setPanel(null);
                    },
                  },
                  {
                    label: "Toggle drawing tools",
                    run: () => {
                      emit(
                        {
                          chrome: {
                            ...state.chrome,
                            drawingRail: !state.chrome.drawingRail,
                          },
                        },
                        "chrome",
                      );
                      setPanel(null);
                    },
                  },
                  {
                    label: "View chart data",
                    run: () => {
                      setTableOpen(true);
                      setPanel(null);
                    },
                    enabled: available.dataTable,
                  },
                  {
                    label: "Maximize chart",
                    run: () => {
                      maximize();
                      setPanel(null);
                    },
                  },
                ]
                  .filter(
                    (c) =>
                      c.enabled !== false &&
                      c.label.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((c) => (
                    <Button
                      key={c.label}
                      colorStyle="ghost"
                      className="justify-start"
                      onClick={c.run}
                    >
                      {c.label}
                    </Button>
                  ))}
              </div>
            ) : null}
            {panel === "settings" ? (
              <div className="grid gap-4 text-xs">
                <label className="grid gap-1">
                  Series style
                  <select
                    className={inputClass}
                    value={state.chartType}
                    onChange={(e) =>
                      emit(
                        { chartType: e.target.value as MarketChartType },
                        "layout",
                      )
                    }
                  >
                    {["candlestick", "bar", "line", "area", "baseline"].map(
                      (type) => (
                        <option key={type}>{type}</option>
                      ),
                    )}
                  </select>
                </label>
                <label className="grid gap-1">
                  Price scale
                  <select
                    aria-label="Price scale"
                    className={inputClass}
                    value={state.scale.mode}
                    onChange={(e) =>
                      setScaleMode(e.target.value as MarketScaleMode)
                    }
                  >
                    {(
                      [
                        "normal",
                        "logarithmic",
                        "percentage",
                        "indexedTo100",
                      ] as const
                    ).map((mode) => (
                      <option key={mode} disabled={mode==='logarithmic'&&!allowLogScale}>{mode}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1">
                  Right offset (bars)
                  <input
                    className={inputClass}
                    type="range"
                    min={state.viewport.minimumRightOffsetBars ?? 0}
                    max={state.viewport.maximumRightOffsetBars ?? 150}
                    value={state.viewport.rightOffsetBars ?? 0}
                    onChange={(e) =>
                      emit(
                        {
                          viewport: {
                            ...state.viewport,
                            rightOffsetBars: Number(e.target.value),
                          },
                        },
                        "viewport",
                      )
                    }
                  />
                  <span>{state.viewport.rightOffsetBars ?? 0}</span>
                </label>
                <Button
                  size="sm"
                  colorStyle="ghost"
                  onClick={() =>
                    emit(
                      { viewport: { ...state.viewport, rightOffsetBars: 28 } },
                      "viewport",
                    )
                  }
                >
                  Reset right offset
                </Button>
                <label className="flex items-center gap-2">
                  <Crosshair className="size-4" />
                  <input
                    type="checkbox"
                    checked={state.viewport.inspection === "persistent"}
                    onChange={(e) =>
                      emit(
                        {
                          viewport: {
                            ...state.viewport,
                            inspection: e.target.checked
                              ? "persistent"
                              : "follow",
                          },
                        },
                        "viewport",
                      )
                    }
                  />
                  Keep inspection visible
                </label>
                <label className="flex items-center gap-2">
                  <Magnet className="size-4" />
                  Magnet
                  <select
                    className={inputClass}
                    value={state.chrome.magnet}
                    onChange={(e) =>
                      emit(
                        {
                          chrome: {
                            ...state.chrome,
                            magnet: e.target.value as "off" | "weak" | "strong",
                          },
                        },
                        "chrome",
                      )
                    }
                  >
                    {["off", "weak", "strong"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  <PanelLeft className="size-4" />
                  <input
                    type="checkbox"
                    checked={state.chrome.drawingRail}
                    onChange={(e) =>
                      emit(
                        {
                          chrome: {
                            ...state.chrome,
                            drawingRail: e.target.checked,
                          },
                        },
                        "chrome",
                      )
                    }
                  />
                  Drawing tools
                </label>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const timestamp = Date.parse(jumpDate) / 1000;
                    const index = data.findIndex(
                      (b) => marketTimeKey(b.time) >= timestamp,
                    );
                    if (index >= 0)
                      chartRef.current?.setVisibleRange({
                        from: data[Math.max(0, index - 30)].time,
                        to: data[Math.min(data.length - 1, index + 30)].time,
                      });
                    setPanel(null);
                  }}
                >
                  <input
                    aria-label="Go to date"
                    type="date"
                    className={inputClass}
                    value={jumpDate}
                    onChange={(e) => setJumpDate(e.target.value)}
                  />
                  <Button type="submit" size="sm" disabled={!jumpDate}>
                    Go
                  </Button>
                </form>
                {available.profiles && !state.profiles.length ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      emit(
                        { profiles: createTechnicalChartViewState().profiles },
                        "profile-settings",
                      )
                    }
                  >
                    Add volume profile
                  </Button>
                ) : null}
                {available.profiles
                  ? state.profiles.map((p) => (
                      <fieldset
                        key={p.id}
                        className="grid gap-2 border-t border-border pt-3"
                      >
                        <legend>Volume profile · {p.id}</legend>
                        <label>
                          <input
                            type="checkbox"
                            checked={p.visible}
                            onChange={(e) =>
                              emit(
                                {
                                  profiles: state.profiles.map((item) =>
                                    item.id === p.id
                                      ? { ...item, visible: e.target.checked }
                                      : item,
                                  ),
                                },
                                "profile-settings",
                                p.id,
                              )
                            }
                          />{" "}
                          Visible
                        </label>
                        <label className="grid gap-1">
                          Profile range
                          <select
                            className={inputClass}
                            value={p.range}
                            onChange={(e) =>
                              emit(
                                {
                                  profiles: state.profiles.map((item) =>
                                    item.id === p.id
                                      ? {
                                          ...item,
                                          range: e.target.value as
                                            | "visible"
                                            | "fixed"
                                            | "session",
                                          timeRange:
                                            item.timeRange ?? settledRange,
                                        }
                                      : item,
                                  ),
                                },
                                "profile-settings",
                                p.id,
                              )
                            }
                          >
                            {["visible", "fixed", "session"].map((value) => (
                              <option key={value}>{value}</option>
                            ))}
                          </select>
                        </label>
                        {p.range !== "visible" ? (
                          <>
                            <p>
                              Use explicit start/end dates for the selected
                              range or session.
                            </p>
                            {(["from", "to"] as const).map((key) => (
                              <label key={key} className="grid gap-1">
                                {key === "from" ? "Start date" : "End date"}
                                <input
                                  className={inputClass}
                                  type="date"
                                  value={
                                    p.timeRange
                                      ? new Date(
                                          marketTimeKey(p.timeRange[key]) *
                                            1000,
                                        )
                                          .toISOString()
                                          .slice(0, 10)
                                      : ""
                                  }
                                  onChange={(e) => {
                                    if (!e.target.value) return;
                                    const time =
                                      Date.parse(e.target.value) / 1000;
                                    emit(
                                      {
                                        profiles: state.profiles.map((item) =>
                                          item.id === p.id
                                            ? {
                                                ...item,
                                                timeRange: {
                                                  from:
                                                    item.timeRange?.from ??
                                                    time,
                                                  to:
                                                    item.timeRange?.to ?? time,
                                                  [key]: time,
                                                },
                                              }
                                            : item,
                                        ),
                                      },
                                      "profile-settings",
                                      p.id,
                                    );
                                  }}
                                />
                              </label>
                            ))}
                          </>
                        ) : null}
                        <label className="grid gap-1">
                          Placement
                          <select
                            className={inputClass}
                            value={p.placement}
                            onChange={(e) =>
                              emit(
                                {
                                  profiles: state.profiles.map((item) =>
                                    item.id === p.id
                                      ? {
                                          ...item,
                                          placement: e.target.value as
                                            | "left"
                                            | "right",
                                        }
                                      : item,
                                  ),
                                },
                                "profile-settings",
                                p.id,
                              )
                            }
                          >
                            <option>right</option>
                            <option>left</option>
                          </select>
                        </label>
                        <label className="grid gap-1">
                          Opacity
                          <input
                            type="range"
                            min={0.1}
                            max={1}
                            step={0.05}
                            value={p.opacity ?? 0.65}
                            onChange={(e) =>
                              emit(
                                {
                                  profiles: state.profiles.map((item) =>
                                    item.id === p.id
                                      ? {
                                          ...item,
                                          opacity: Number(e.target.value),
                                        }
                                      : item,
                                  ),
                                },
                                "profile-settings",
                                p.id,
                              )
                            }
                          />
                        </label>
                        {(
                          ["rows", "widthPercent", "valueAreaPercent"] as const
                        ).map((key) => (
                          <label
                            key={key}
                            className="flex items-center justify-between gap-2"
                          >
                            {key === "rows"
                              ? "Rows"
                              : key === "widthPercent"
                                ? "Width (%)"
                                : "Value area (%)"}
                            <input
                              className={cn(inputClass, "w-24")}
                              type="number"
                              min={1}
                              max={
                                key === "rows"
                                  ? 1000
                                  : key === "widthPercent"
                                    ? 50
                                    : 100
                              }
                              value={
                                typeof p[key] === "number"
                                  ? (p[key] as number)
                                  : 24
                              }
                              onChange={(e) =>
                                emit(
                                  {
                                    profiles: state.profiles.map((item) =>
                                      item.id === p.id
                                        ? {
                                            ...item,
                                            [key]: Math.max(
                                              1,
                                              Math.min(
                                                key === "rows"
                                                  ? 1000
                                                  : key === "widthPercent"
                                                    ? 50
                                                    : 100,
                                                Number(e.target.value) || 1,
                                              ),
                                            ),
                                          }
                                        : item,
                                    ),
                                  },
                                  "profile-settings",
                                  p.id,
                                )
                              }
                            />
                          </label>
                        ))}
                        {(
                          ["showPoc", "showValueArea", "splitVolume"] as const
                        ).map((key) => (
                          <label key={key}>
                            <input
                              type="checkbox"
                              checked={p[key]}
                              onChange={(e) =>
                                emit(
                                  {
                                    profiles: state.profiles.map((item) =>
                                      item.id === p.id
                                        ? { ...item, [key]: e.target.checked }
                                        : item,
                                    ),
                                  },
                                  "profile-settings",
                                  p.id,
                                )
                              }
                            />{" "}
                            {key === "showPoc"
                              ? "Point of control"
                              : key === "showValueArea"
                                ? "Value area"
                                : "Split up/down estimates"}
                          </label>
                        ))}
                      </fieldset>
                    ))
                  : null}
              </div>
            ) : null}
            {panel === "study" && study ? (
              <div className="grid gap-3 text-xs">
                <span>{labelFor(study.id)}</span>
                <Button
                  colorStyle="ghost"
                  onClick={() =>
                    emit(
                      {
                        indicators: state.indicators.map((i) =>
                          i.id === study.id ? { ...i, visible: !i.visible } : i,
                        ),
                      },
                      "indicator-settings",
                      study.id,
                    )
                  }
                >
                  {study.visible ? <Eye /> : <EyeOff />}
                  {study.visible ? "Hide study" : "Show study"}
                </Button>
                {Object.entries(study.parameters)
                  .filter(
                    (entry): entry is [string, number] =>
                      typeof entry[1] === "number",
                  )
                  .map(([key, value]) => (
                    <label key={key} className="grid gap-1">
                      {key}
                      <input
                        className={inputClass}
                        type="number"
                        min={1}
                        value={value}
                        onChange={(e) =>
                          emit(
                            {
                              indicators: state.indicators.map((i) =>
                                i.id === study.id
                                  ? {
                                      ...i,
                                      parameters: {
                                        ...i.parameters,
                                        [key]: Math.max(
                                          1,
                                          Number(e.target.value) || 1,
                                        ),
                                      },
                                    }
                                  : i,
                              ),
                            },
                            "indicator-settings",
                            study.id,
                          )
                        }
                      />
                    </label>
                  ))}
                <label className="grid gap-1">
                  Move to pane
                  <select
                    className={inputClass}
                    value={
                      state.panes.find((p) => p.studyIds.includes(study.id))?.id
                    }
                    onChange={(e) =>
                      emit(
                        {
                          panes: state.panes.map((p) => ({
                            ...p,
                            studyIds: [
                              ...p.studyIds.filter((id) => id !== study.id),
                              ...(p.id === e.target.value ? [study.id] : []),
                            ],
                          })),
                        },
                        "pane",
                        study.id,
                      )
                    }
                  >
                    {state.panes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}
                      </option>
                    ))}
                  </select>
                </label>
                <Button
                  colorStyle="ghost"
                  onClick={() => {
                    removeStudy(study.id);
                    setPanel(null);
                  }}
                >
                  <X />
                  Remove study
                </Button>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </TooltipProvider>
    </ChartThemeContext.Provider>
  );
});

function TechnicalDataTable({
  data,
  indicators,
  results,
  calculationMode, suppliedResults,
}: {
  data: readonly OhlcBar[];
  indicators: IndicatorInstance[];
  results: Record<string, VolumeProfileResult>;
  calculationMode: CalculationMode;
  suppliedResults: SuppliedCalculationResults;
}) {
  const values = React.useMemo(() => {
    const next: Record<string, Record<string, number | null>> = {};
    indicators
      .filter((i) => i.visible)
      .forEach((i) =>
        (calculationMode === "supplied" ? (() => { const result = suppliedResults[i.id]; return result?.kind === "indicator" && suppliedResultRenderable(result) ? result.points : []; })() : i.definition.calculate(data, i.parameters))
          .slice(-100)
          .forEach((p) => {
            next[String(marketTimeKey(p.time))] = {
              ...next[String(marketTimeKey(p.time))],
              ...Object.fromEntries(
                Object.entries(p.values).map(([key, value]) => [
                  `${i.id}:${key}`,
                  value,
                ]),
              ),
            };
          }),
      );
    return next;
  }, [data, indicators, calculationMode, suppliedResults]);
  const columns = indicators
    .filter((i) => i.visible)
    .flatMap((i) => i.definition.lines.map((l) => `${i.id}:${l.id}`));
  return (
    <div className="max-h-72 overflow-auto border-t border-border" tabIndex={0} role="region" aria-label="Chart data tables">
      <table className="w-full text-left text-xs">
        <caption className="p-2 text-left">
          Latest {Math.min(100, data.length)} bars and active studies.{" "}
          {Object.values(results)
            .map(
              (r) =>
                `${r.provenance}: POC ${r.poc}, VAH ${r.vah}, VAL ${r.val}, volume ${r.totalVolume}.`,
            )
            .join(" ")}
        </caption>
        <thead>
          <tr>
            {["Time (UTC)", "Session date", "Incomplete", "Open", "High", "Low", "Close", "Volume", ...columns].map(
              (c) => (
                <th scope="col" className="whitespace-nowrap px-3 py-2" key={c}>
                  {c}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {data.slice(-100).map((b) => (
            <tr key={marketTimeKey(b.time)}>
              <th scope="row" className="whitespace-nowrap px-3 py-1">
                {new Date(marketTimeKey(b.time) * 1000)
                  .toISOString()
                  .replace(".000Z", "Z")}
              </th>
              <td>{b.sessionDate ?? "—"}</td><td>{b.incomplete ? "Incomplete" : "—"}</td>
              {[
                b.open,
                b.high,
                b.low,
                b.close,
                b.volume,
                ...columns.map(
                  (c) => values[String(marketTimeKey(b.time))]?.[c],
                ),
              ].map((value, index) => (
                <td className="px-3 py-1 font-mono" key={index}>
                  {value == null ? "—" : String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {calculationMode === "supplied" ? Object.entries(suppliedResults).map(([id, result]) => {
        if (!result || !suppliedResultRenderable(result)) return null;
        if (result.kind === "profile") return <table key={id} className="w-full text-left text-xs"><caption>{id} · {result.provenanceLabel} · {result.profile.provenance} · {result.approximate ? "Approximate" : ""} · POC {result.profile.poc} · VAH {result.profile.vah} · VAL {result.profile.val} · Volume {result.profile.totalVolume}</caption><thead><tr>{["Price from", "Price to", "Volume", "Up volume", "Down volume"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{result.profile.rows.map((row, index) => <tr key={index}>{[row.priceFrom, row.priceTo, row.volume ?? "—", row.volume == null ? row.upVolume : "—", row.volume == null ? row.downVolume : "—"].map((value, column) => <td key={column}>{String(value)}</td>)}</tr>)}</tbody></table>;
        if (result.kind === "drawing") return <table key={id} className="w-full text-left text-xs"><caption>{id} · {result.provenanceLabel} · {Object.entries(result.derivedValues ?? {}).map(([key, value]) => `${key}: ${value}`).join(" · ")}</caption><thead><tr><th scope="col">UTC time</th><th scope="col">Value</th></tr></thead><tbody>{result.points.map((point, index) => <tr key={index}><th scope="row">{new Date(marketTimeKey(point.time) * 1000).toISOString()}</th><td>{point.value ?? "—"}</td></tr>)}</tbody></table>;
        return null;
      }) : null}
    </div>
  );
}
