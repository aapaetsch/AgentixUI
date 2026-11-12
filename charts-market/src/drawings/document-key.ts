import type {DrawingState} from '../core';
import {exactUtcComparisonKey,validExactTime} from './editor-state';

/** Semantic comparison only. Never replaces the raw exact text in snapshots or metadata. */
export function drawingDocumentComparisonKey(drawings:readonly DrawingState[]):string {
  const canonical=(value:unknown):unknown=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,canonical(item)])):value;
  return JSON.stringify(canonical(drawings.map(({selected:_selected,...drawing})=>({...drawing,points:drawing.points.map(point=>{
    const instant=validExactTime(point.utcTimeText,point.time)?exactUtcComparisonKey(point.utcTimeText):null;
    return instant?{...point,time:instant,utcTimeText:instant}:point;
  })}))));
}
