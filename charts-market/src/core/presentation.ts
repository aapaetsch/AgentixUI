/** Runtime presentation only; deliberately outside the version-1 saved document. */
export interface MarketChartPresentation {
  /** Runtime measured pane chrome, in CSS pixels. Does not change saved panes or economic viewports. */
  paneHeaderHeights?: Readonly<Record<string, number>>;
  /** Supplied drawing evidence callouts; composite compact legends retain evidence in accessible details. Default true. */
  drawingEvidenceLabels?: boolean;
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
  crosshair?: { visible?: boolean; lineWidth?: number; opacity?: number; dash?: "solid" | "dashed" | "dotted"; color?: string; labels?: boolean; labelBackground?: string; labelColor?: string };
}
export interface MarketChartChangeMetadata {
  source: "user" | "api" | "data" | "layout";
  gesture?: "pan" | "wheel" | "pinch" | "time-scale" | "price-scale" | "pane-resize" | "keyboard" | "reset";
}
export interface TechnicalChartGeometry {
  width: number;
  availableHeight: number;
  chromeHeight: number;
  plotHeight: number;
  overflow: boolean;
}
/** Validate geometry/style scalars without changing any economic value. */
export function validateMarketPresentation(value: MarketChartPresentation = {}): void {
  const check=(v:number|undefined,min:number,max:number,name:string)=>{if(v!=null&&(!Number.isFinite(v)||v<min||v>max))throw Error(`Invalid chart presentation ${name}: expected ${min}..${max}.`);};
  for (const height of Object.values(value.paneHeaderHeights ?? {})) check(height, 0, 1000, 'paneHeaderHeight');
  check(value.candles?.bodyRatio,.1,1,"bodyRatio");check(value.candles?.maximumWidth,1,100,"maximumWidth");check(value.candles?.wickWidth,.5,5,"wickWidth");
  for (const [name, options] of [['candles', value.candles], ['volume', value.volume]] as const) {
    check(options?.gap, 0, 32, `${name} gap`);
    if (options?.widthMode != null && options.widthMode !== 'proportional' && options.widthMode !== 'adaptive') throw Error(`Invalid chart presentation ${name} widthMode.`);
  }
  if (value.badges?.movingAverages != null && value.badges.movingAverages !== 'all-visible') throw Error('Invalid chart presentation movingAverages.');
  if (value.badges?.endpointValues != null && value.badges.endpointValues !== 'all-visible') throw Error('Invalid chart presentation endpointValues.');
  check(value.grid?.opacity,0,1,"grid opacity");check(value.axis?.fontSize,9,24,"axis fontSize");check(value.axis?.minimumTickSpacing,24,200,"minimumTickSpacing");check(value.axis?.timeTickSpacing,80,500,"timeTickSpacing");check(value.badges?.fontSize,9,24,"badge fontSize");check(value.crosshair?.lineWidth,.5,5,"crosshair lineWidth");check(value.crosshair?.opacity,0,1,"crosshair opacity");
}
