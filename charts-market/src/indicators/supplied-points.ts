import type {IndicatorPoint,IndicatorRenderSeries} from '../core';
const projections=new WeakMap<readonly IndicatorPoint[],Map<string,IndicatorRenderSeries['points']>>();
/** Presentation projection only. Immutable producer points retain their identity across viewport requests. */
export function suppliedLinePoints(points:readonly IndicatorPoint[],line:string):IndicatorRenderSeries['points']{
 let lines=projections.get(points);if(!lines){lines=new Map();projections.set(points,lines);}
 let projected=lines.get(line);if(!projected){projected=points.map(point=>({time:point.time,value:point.values[line]??null}));lines.set(line,projected);}
 return projected;
}
