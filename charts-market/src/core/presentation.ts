/** Runtime presentation only; deliberately outside the version-1 saved document. */
export interface MarketChartPresentation {
  candles?: { bodyRatio?: number; maximumWidth?: number; wickWidth?: number };
  grid?: { horizontal?: boolean; vertical?: boolean; opacity?: number };
  axis?: { fontSize?: number; minimumTickSpacing?: number; timeTickSpacing?: number };
  badges?: { visible?: boolean; lastPrice?: boolean; studyValues?: boolean; style?: "filled" | "outline"; fontSize?: number };
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
  check(value.candles?.bodyRatio,.1,1,"bodyRatio");check(value.candles?.maximumWidth,1,100,"maximumWidth");check(value.candles?.wickWidth,.5,5,"wickWidth");
  check(value.grid?.opacity,0,1,"grid opacity");check(value.axis?.fontSize,9,24,"axis fontSize");check(value.axis?.minimumTickSpacing,24,200,"minimumTickSpacing");check(value.axis?.timeTickSpacing,80,500,"timeTickSpacing");check(value.badges?.fontSize,9,24,"badge fontSize");check(value.crosshair?.lineWidth,.5,5,"crosshair lineWidth");check(value.crosshair?.opacity,0,1,"crosshair opacity");
}
