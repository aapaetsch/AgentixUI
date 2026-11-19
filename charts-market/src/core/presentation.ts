import { marketTimeKey } from './validation';
import type { MarketSessionRange } from './types';
export type { MarketTimeTick } from './types';

export type MarketTimelineRange = 'auto' | '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | 'all';
/** Opt-in display geometry. Never enters calculation requests or saved documents. */
export interface MarketTimelinePresentation {
  /** Visible-span selection by default; independent of candle resolution. */
  range?: MarketTimelineRange;
  /** Supplied session starts/ends. Omission falls back to first/last observation per display day. */
  sessions?: readonly MarketSessionRange[];
  /** Initial/Fit/Latest logical padding, 0..150, default 10. Panning can use up to 150 slots. */
  rightPaddingBars?: number;
  /** Two 44px stateful controls in the actual price-axis lane. Omission retains legacy text controls. */
  scaleControls?: 'icons';
}

/** Runtime presentation only; deliberately outside the version-1 saved document. */
export interface MarketChartPresentation {
  /** Combined price-pane header already contains OHLC; omit the legacy extra readout allocation. */
  ohlcInPaneHeader?:boolean;
  /** Runtime measured pane chrome, in CSS pixels. Does not change saved panes or economic viewports. */
  paneHeaderHeights?: Readonly<Record<string, number>>;
  timeline?: MarketTimelinePresentation;
  /** Supplied drawing evidence callouts; composite compact legends retain evidence in accessible details. Default true. */
  drawingEvidenceLabels?: boolean;
  line?: {
    /** Built-in line/area/baseline price stroke in finite CSS pixels, 0.5..5; default 2.
     * Isolated observations use centered squares with side length twice the width. */
    width?: number;
  };
  candles?: {
    /** Proportional preserves historical ratio/cap defaults. Adaptive uses slot spacing minus gap. */
    widthMode?: 'proportional' | 'adaptive';
    /** Adaptive target gap in CSS pixels, 0..32; default 2. Degrades when slots are too narrow. */
    gap?: number;
    /** Proportional mode only. */
    bodyRatio?: number;
    /** Proportional mode only; adaptive bodies have no legacy maximum-width cap. */
    maximumWidth?: number;
    wickWidth?: number;
  };
  volume?: {
    /** Proportional preserves the historical 0.7 ratio / 12px cap. */
    widthMode?: 'proportional' | 'adaptive';
    /** Adaptive target gap in CSS pixels, 0..32; default 2. Matches equally configured candles. */
    gap?: number;
  };
  grid?: { horizontal?: boolean; vertical?: boolean; opacity?: number };
  axis?: { fontSize?: number; minimumTickSpacing?: number; timeTickSpacing?: number };
  badges?: {
    visible?: boolean; lastPrice?: boolean; studyValues?: boolean; style?: "filled" | "outline"; fontSize?: number;
    /** Opt-in right-axis outlined boxes for every tagged moving average at the visible window endpoint.
     * Stacks with anchors; a bounded scroll region retains overflow. Missing samples stay nonnumeric.
     * Omission preserves latest-overall, priority-suppressed legacy badges. Honors visible/studyValues=false. */
    movingAverages?: 'all-visible';
    /** Opt-in outlined visible-endpoint boxes for price and every rendered study output.
     * Reserves a right gutter separate from reference/crosshair ticks. Per-pane collision
     * placement minimizes squared displacement in endpoint order, with bounded overflow.
     * Supersedes movingAverages; honors visible/lastPrice/studyValues. Defaults unchanged. */
    endpointValues?: 'all-visible';
  };
  crosshair?: { visible?: boolean; lineWidth?: number; opacity?: number; dash?: "solid" | "dashed" | "dotted"; color?: string; labels?: boolean; labelBackground?: string; labelColor?: string;
    /** Opt-in display geometry on the built-in closing-price line, never an interpolated observation. */
    lineMarker?: { visible?: boolean; /** CSS px, 2..8; default 4. */ radius?: number; fill?: string; stroke?: string; /** CSS px, .5..4; default 2. */ strokeWidth?: number };
  };
}
export interface MarketChartChangeMetadata {
  source: "user" | "api" | "data" | "layout";
  phase?: "start" | "change" | "end" | "cancel";
  paneId?: string;
  gesture?: "pan" | "wheel" | "pinch" | "time-scale" | "price-scale" | "pane-resize" | "pane-reorder" | "pane-collapse" | "pane-maximize" | "pane-restore" | "value-scale" | "workspace-scroll" | "inspect" | "keyboard" | "reset";
}
export interface TechnicalChartGeometry {
  width: number;
  availableHeight: number;
  chromeHeight: number;
  /** Resolved available/minimum plot request; legacy field, not the overflowing document extent. */
  plotHeight: number;
  /** Actual engine canvas/pane-stack height, including time axis. Present for workspace interactions. */
  renderedPlotHeight?: number;
  /** Actual rendered plot plus measured public chrome. Allocate the host wrapper from this, while keeping availableHeight input independent. */
  intrinsicHeight?: number;
  overflow: boolean;
}
/** Validate geometry/style scalars without changing any economic value. */
export function validateMarketPresentation(value: MarketChartPresentation = {}): void {
  const check=(v:number|undefined,min:number,max:number,name:string)=>{if(v!=null&&(!Number.isFinite(v)||v<min||v>max))throw Error(`Invalid chart presentation ${name}: expected ${min}..${max}.`);};
  for (const height of Object.values(value.paneHeaderHeights ?? {})) check(height, 0, 1000, 'paneHeaderHeight');
  check(value.line?.width, .5, 5, 'line width');
  check(value.timeline?.rightPaddingBars, 0, 150, 'timeline rightPaddingBars');
  if (value.timeline?.range != null && !['auto','1D','5D','1M','3M','6M','1Y','all'].includes(value.timeline.range)) throw Error('Invalid chart timeline range.');
  if (value.timeline?.scaleControls != null && value.timeline.scaleControls !== 'icons') throw Error('Invalid chart timeline scaleControls.');
  for (const session of value.timeline?.sessions ?? []) {
    const from = marketTimeKey(session.from), to = marketTimeKey(session.to);
    if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) throw Error('Invalid supplied timeline session.');
  }
  check(value.candles?.bodyRatio,.1,1,"bodyRatio");check(value.candles?.maximumWidth,1,100,"maximumWidth");check(value.candles?.wickWidth,.5,5,"wickWidth");
  for (const [name, options] of [['candles', value.candles], ['volume', value.volume]] as const) {
    check(options?.gap, 0, 32, `${name} gap`);
    if (options?.widthMode != null && options.widthMode !== 'proportional' && options.widthMode !== 'adaptive') throw Error(`Invalid chart presentation ${name} widthMode.`);
  }
  if (value.badges?.movingAverages != null && value.badges.movingAverages !== 'all-visible') throw Error('Invalid chart presentation movingAverages.');
  if (value.badges?.endpointValues != null && value.badges.endpointValues !== 'all-visible') throw Error('Invalid chart presentation endpointValues.');
  check(value.grid?.opacity,0,1,"grid opacity");check(value.axis?.fontSize,9,24,"axis fontSize");check(value.axis?.minimumTickSpacing,24,200,"minimumTickSpacing");check(value.axis?.timeTickSpacing,80,500,"timeTickSpacing");check(value.badges?.fontSize,9,24,"badge fontSize");check(value.crosshair?.lineWidth,.5,5,"crosshair lineWidth");check(value.crosshair?.opacity,0,1,"crosshair opacity");
  check(value.crosshair?.lineMarker?.radius,2,8,'lineMarker radius');check(value.crosshair?.lineMarker?.strokeWidth,.5,4,'lineMarker strokeWidth');
}
