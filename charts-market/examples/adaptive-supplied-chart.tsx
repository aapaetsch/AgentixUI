import * as React from 'react';
import {TechnicalChartView, type TechnicalChartViewProps, type MarketChartPresentation} from 'aapaetsch-charts-market';

export const adaptiveWidths = {
  candles: {widthMode: 'adaptive', gap: 2},
  volume: {widthMode: 'adaptive', gap: 2},
} satisfies MarketChartPresentation;

/** Host admits matching bars/results before rendering; use only on the intended noncompact surface. */
export function AdaptiveSuppliedChart({appearance, ...props}: Omit<TechnicalChartViewProps, 'calculationMode'>) {
  return <TechnicalChartView {...props} calculationMode="supplied" appearance={{...appearance,
    candles: {...appearance?.candles, ...adaptiveWidths.candles},
    volume: {...appearance?.volume, ...adaptiveWidths.volume}}}/>;
}
