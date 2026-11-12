import type {DrawingState, SerializableParameters} from '../core';

export type MarketDrawingStatistic = 'price_range'|'percent_change'|'change_in_pips'|'bars_range'|'date_time_range'|'distance'|'angle';
export type MarketDrawingFinancialStatistic = 'price_range'|'percent_change'|'bars_range'|'date_time_range';
export type MarketDrawingIntervalFamily = 'minutes'|'hours'|'days'|'weeks'|'months';
export type MarketDrawingIntervalRange = {enabled:boolean;min:number;max:number};
export type MarketDrawingText = {
  value:string;color:string;fontSize:number;bold:boolean;italic:boolean;
  verticalAlignment:'top'|'middle'|'bottom';horizontalAlignment:'left'|'center'|'right';
};
/** Optional authored settings. Omission never materializes defaults on selection. */
export type MarketDrawingPresentation = {
  startCap?:'normal'|'arrow';endCap?:'normal'|'arrow';middlePoint?:boolean;priceLabels?:boolean;
  text?:MarketDrawingText;statistics?:MarketDrawingStatistic[];
  statisticsPosition?:'left'|'center'|'right'|'auto';alwaysShowStatistics?:boolean;
  visibility?:Partial<Record<MarketDrawingIntervalFamily,MarketDrawingIntervalRange>>;
};
export type MarketDrawingParameters = SerializableParameters & {
  presentation?:MarketDrawingPresentation;dashStyle?:'solid'|'dashed'|'dotted';extendLeft?:boolean;extendRight?:boolean;
};
export interface MarketDrawingEditorPosition {x:number;y:number}
/** Values are already formatted, exact host evidence. No financial formulas run in the editor. */
export interface MarketDrawingSuppliedStatistics {
  drawingId:string;
  geometryKey:string;
  /** Host's current admitted dataset/result context; values from other contexts are suppressed. */
  contextKey:string;
  values:Partial<Record<MarketDrawingFinancialStatistic,string|null>>;
}
export interface MarketDrawingEditorOptions {
  /** Enable only the active editable instance; inactive opt-ins also hide the legacy selection toolbar. */
  active:boolean;
  /** Fixed viewport CSS pixels; null restores upper-center of this chart. Runtime account-session state only. */
  position?:MarketDrawingEditorPosition|null;
  onPositionChange?:(position:MarketDrawingEditorPosition|null)=>void;
  /** IANA timezone; inherits the chart timezone, then UTC. Ambiguous local times require an explicit offset. */
  timeZone?:string;
  statistics?:readonly MarketDrawingSuppliedStatistics[];
  statisticsContextKey?:string;
  /**
   * Create alert intent for a selected visible horizontal/trend line or rectangle,
   * including locked drawings. Receives only the unchanged opaque drawing ID.
   * The host resolves its current account/listing document, flushes pending saves
   * or explains conflicts, checks final eligibility, and opens its alert inspector.
   * Replace the callback and cancel the editor on listing changes. Never persist
   * callbacks in DrawingState. Omit for the existing disabled coming-later action.
   * This library creates no alert and evaluates no price rule.
   */
  onAlertIntent?:(drawingId:string)=>void;
}
export interface MarketDrawingExactCoordinate {
  drawingId:string;pointIndex:number;price?:string;utcTime?:string;
}
export type MarketEditableDrawing = DrawingState<MarketDrawingParameters>;
