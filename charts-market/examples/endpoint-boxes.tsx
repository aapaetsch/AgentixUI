import {TechnicalChartView, type TechnicalChartViewProps} from 'aapaetsch-charts-market';

/** Keep host panes, accepted results and exact source evidence; renderer owns all label geometry. */
export function EndpointChart(props: TechnicalChartViewProps) {
  return <TechnicalChartView {...props} calculationMode="supplied" appearance={{...props.appearance,
    badges: {...props.appearance?.badges, visible: true, lastPrice: true, studyValues: true, endpointValues: 'all-visible'},
  }}/>;
}
