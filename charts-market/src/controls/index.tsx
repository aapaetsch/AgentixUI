"use client";

import * as React from "react";
import { Button, cn } from "aapaetsch-ui-kit";

import type { MarketChartType, MarketScaleMode } from "../core";

const selectClassName = "h-10 rounded-[var(--radius)] border-2 border-border bg-background px-3 text-sm text-foreground outline-none transition-colors hover:bg-accent focus-visible:border-ring";

export interface MarketChartControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string;
  interval?: string;
  chartType: MarketChartType;
  scaleMode: MarketScaleMode;
  intervalOptions?: string[];
  onSymbolChange?: (symbol: string) => void;
  onIntervalChange?: (interval: string) => void;
  onChartTypeChange?: (chartType: MarketChartType) => void;
  onScaleModeChange?: (scaleMode: MarketScaleMode) => void;
  onFitContent?: () => void;
  onScrollToRealtime?: () => void;
}

/** Compact, controlled market-chart toolbar. */
export function MarketChartControls({
  symbol,
  interval,
  chartType,
  scaleMode,
  intervalOptions = ["1m", "5m", "15m", "1h", "1D", "1W"],
  onSymbolChange,
  onIntervalChange,
  onChartTypeChange,
  onScaleModeChange,
  onFitContent,
  onScrollToRealtime,
  className,
  ...props
}: MarketChartControlsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 border-b border-border bg-background p-2", className)} {...props}>
      {symbol != null ? (
        <label className="sr-only">
          Symbol
          <input
            aria-label="Symbol"
            className={cn(selectClassName, "w-28 font-mono font-semibold uppercase")}
            value={symbol}
            onChange={(event) => onSymbolChange?.(event.target.value.toUpperCase())}
          />
        </label>
      ) : null}
      {interval != null ? (
        <select aria-label="Interval" className={selectClassName} value={interval} onChange={(event) => onIntervalChange?.(event.target.value)}>
          {intervalOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : null}
      <select aria-label="Chart type" className={selectClassName} value={chartType} onChange={(event) => onChartTypeChange?.(event.target.value as MarketChartType)}>
        <option value="candlestick">Candles</option><option value="bar">OHLC bars</option><option value="line">Line</option>
        <option value="area">Area</option><option value="baseline">Baseline</option>
      </select>
      <select aria-label="Price scale" className={selectClassName} value={scaleMode} onChange={(event) => onScaleModeChange?.(event.target.value as MarketScaleMode)}>
        <option value="normal">Linear</option><option value="logarithmic">Log</option>
        <option value="percentage">Percent</option><option value="indexedTo100">Indexed to 100</option>
      </select>
      <div className="ml-auto flex items-center gap-1">
        <Button type="button" colorStyle="ghost" size="sm" onClick={onFitContent}>Fit</Button>
        <Button type="button" colorStyle="ghost" size="sm" onClick={onScrollToRealtime}>Realtime</Button>
      </div>
    </div>
  );
}

export type { MarketChartType, MarketScaleMode } from "../core";
