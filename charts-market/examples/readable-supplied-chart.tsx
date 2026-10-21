import * as React from 'react';
import {
  TechnicalChartView,
  suppliedStudyDefinitions,
  type TechnicalChartLegendMetadata,
  type TechnicalChartViewProps,
} from 'aapaetsch-charts-market';

/** Public-entrypoint composition. The host admits bars/results atomically before rendering. */
export interface ReadableSuppliedChartProps extends Pick<TechnicalChartViewProps,
  'symbol' | 'interval' | 'data' | 'state' | 'onStateChange' | 'calculationIdentity' | 'suppliedResults' |
  'dataIdentity' | 'dataRevision' | 'onCalculationRequest' | 'onVisibleRangeChange' | 'theme' | 'style' |
  'onRequestSuppliedDetails' | 'navigationControls'> {
  availableHeight: number;
  legendMetadata?: TechnicalChartLegendMetadata;
  availability?: TechnicalChartViewProps['dataAvailability'];
  onExactData?: () => void;
}

export function ReadableSuppliedChart({availableHeight, onExactData, availability, ...props}: ReadableSuppliedChartProps) {
  const minimumPlotHeight = props.state.panes.filter(pane => pane.visible !== false)
    .reduce((sum, pane) => sum + (pane.collapsed ? 28 : pane.minimumSize ?? 64), 28);
  return <TechnicalChartView {...props}
    calculationMode="supplied"
    availableIndicators={suppliedStudyDefinitions}
    dataAvailability={availability}
    appearance={{height: availableHeight, heightMode: 'available', minimumPlotHeight,
      legends: 'compact', suppliedStatus: 'compact', navigation: 'integrated',
      grid: {opacity: .3}, badges: {style: 'outline'}}}
    features={{header: false, commands: false, drawingRail: false}}
    rangeShortcuts={[]}
    footerActions={onExactData ? <button type="button" onClick={onExactData} className="min-h-8 rounded px-2 text-xs focus-visible:outline focus-visible:outline-2">Exact data</button> : undefined}
  />;
}
