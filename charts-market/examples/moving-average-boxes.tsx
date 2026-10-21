import {TechnicalChartView, type TechnicalChartViewProps} from 'aapaetsch-charts-market';

/** The host supplies matching result keys/values and retains exact evidence and source ownership. */
export function MovingAverageChart(props: TechnicalChartViewProps) {
  return <TechnicalChartView {...props} calculationMode="supplied" appearance={{...props.appearance,
    badges: {...props.appearance?.badges, visible: true, studyValues: true, movingAverages: 'all-visible'},
  }}/>;
}
