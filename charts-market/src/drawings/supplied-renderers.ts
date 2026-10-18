import type { DrawingRendererDefinition, DrawingPrimitive, MarketTime, SuppliedCalculationResults } from "../core";
import {marketTimeKey,type VisibleRange} from "../core";
import { defaultDrawingHandles } from "./geometry";
import { builtInDrawingRenderers } from "./renderers";

type SuppliedPoint={time:MarketTime;value:number|null};
const orderedPoints=new WeakMap<readonly SuppliedPoint[],boolean>();
/** Binary visible slice with one observation of overscan on each side; null/gap boundaries remain intact. */
export function visibleSuppliedDrawingPoints(points:readonly SuppliedPoint[],range?:VisibleRange|null):readonly SuppliedPoint[]{
 let ordered=orderedPoints.get(points);if(ordered===undefined){ordered=points.every((p,i)=>Number.isFinite(marketTimeKey(p.time))&&(!i||marketTimeKey(points[i-1].time)<marketTimeKey(p.time)));orderedPoints.set(points,ordered);}
 if(!ordered)return [];if(!range)return points;
 const lower=(key:number)=>{let a=0,b=points.length;while(a<b){const m=(a+b)>>>1;if(marketTimeKey(points[m].time)<key)a=m+1;else b=m;}return a;};
 return points.slice(Math.max(0,lower(marketTimeKey(range.from))-1),Math.min(points.length,lower(marketTimeKey(range.to))+2));
}
/** Only these audited first-party renderers use coordinate geometry alone. */
export const suppliedGeometricDrawingTypes = ["trend-line", "horizontal-line", "vertical-line", "rectangle"] as const;

/** Never delegate to consumer renderers, derived callbacks or financial built-ins. */
export function createSuppliedDrawingRenderers(ids: string[], results: SuppliedCalculationResults): DrawingRendererDefinition[] {
  return [...new Set([...ids, "date-price-range"])].map(id => {
    const geometric = suppliedGeometricDrawingTypes.some(type => type === id)
      ? builtInDrawingRenderers.find(renderer => renderer.id === id) : undefined;
    if (geometric) return geometric;
    const cache=new WeakMap<object,DrawingPrimitive[]>();
    return {
      id,
      getHandles: defaultDrawingHandles,
      getPrimitives(context): DrawingPrimitive[] {
        const cached=cache.get(context);if(cached)return cached;
        const result = results[context.drawing.id];
        const available = result?.kind === "drawing" && (result.status === "available" || result.status === "partial");
        const primitives: DrawingPrimitive[] = [];
        if (available) {
          // Preserve gaps. Connecting across null points would imply unsupplied values.
          let segment: NonNullable<ReturnType<typeof context.coordinateFor>>[] = [];
          let previous: MarketTime | undefined;
          const flush = () => {
            if (segment.length > 1) primitives.push({ id: `supplied-${primitives.length}`, kind: "path", points: segment });
            else if (segment.length === 1) primitives.push({ id: `supplied-${primitives.length}`, kind: "ellipse", cx: segment[0].x, cy: segment[0].y, rx: 2, ry: 2 });
            segment = []; previous = undefined;
          };
          visibleSuppliedDrawingPoints(result.points,context.visibleRange).forEach(point => {
            const coordinate = point.value == null || context.isTimeSegmentContinuous?.(point.time, point.time) === false ? null : context.coordinateFor({ time: point.time, price: point.value });
            if (previous != null && context.isTimeSegmentContinuous?.(previous, point.time) === false) flush();
            if (coordinate) { segment.push(coordinate); previous = point.time; } else flush();
          });
          flush();
        }
        primitives.push({ id: "supplied-status", kind: "multiline-text", at: context.points[0] ?? { x: 8, y: 20 }, background: true,
          lines: available ? [result.provenanceLabel, ...Object.entries(result.derivedValues ?? {}).map(([key, value]) => `${key}: ${value}`)] : ["Calculation unavailable · supplied result required"] });
        cache.set(context,primitives);return primitives;
      },
      derivedValues: context => {
        const result = results[context.drawing.id];
        return result?.kind === "drawing" && (result.status === "available" || result.status === "partial") ? result.derivedValues ?? {} : { available: false };
      },
    };
  });
}
