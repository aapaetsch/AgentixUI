import type { MarketScaleOptions, MarketViewportOptions } from './technical-chart-state';
import type { MarketChartChangeMetadata } from './presentation';

/** Explicit single workspace scroller. No ancestor discovery or host gesture arbitration. */
export interface MarketChartScrollOwner {
  getScrollTop(): number;
  scrollTo(top: number): void;
  /** Optional host deferral: retain this target until its intrinsic-height allocation has committed. */
  restoreScrollTop?(top: number): void;
}
/** Opt-in navigation policy. Omission preserves legacy charts and calendar consumers. */
export interface MarketChartInteractions {
  mode: 'workspace';
  /** Stable presentation dataset/layout-load context, independent of immutable financial result identity. Changing it resets transient geometry. */
  contextKey?: string;
  scrollOwner?: MarketChartScrollOwner;
  /** Compressed coordinates only. Initial/Fit/Latest padding, clamped to 0..150; default 10. */
  rightPaddingBars?: number;
}
/** Temporary transformed display coordinates. Never serialize with financial chart definitions. */
export interface MarketChartInteractionState {
  paneScales?: Readonly<Record<string, MarketScaleOptions>>;
  maximizedPaneId?: string | null;
}
/** An explicit external date/reset request; change id to apply, even if economic bounds are equal. */
export interface MarketViewportCommand {
  id: string | number;
  viewport: MarketViewportOptions;
}
export type MarketChartInteractionChange = (state: MarketChartInteractionState, metadata: MarketChartChangeMetadata) => void;
export function marketRightPadding(value = 10): number { return Number.isFinite(value) ? Math.max(0, Math.min(150, value)) : 10; }
export function validMarketManualRange(range: MarketScaleOptions['manualRange']): boolean {
  return !!range && Number.isFinite(range.minimum) && Number.isFinite(range.maximum) && range.maximum > range.minimum && Number.isFinite(range.maximum - range.minimum) && (range.anchor == null || Number.isFinite(range.anchor));
}
