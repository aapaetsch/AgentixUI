import type {OhlcBar, SuppliedCalculationResults} from '../../core';
import {inlineBars, inlineResults, inlineState, inlineStudies} from './inline-readout-fixture';

/** Read-only Portfolio factory-theme samples, keyed by period rather than selection position. */
export const sharedAveragePalette = {
  light: {20:'#2563eb',50:'#9333ea',150:'#b45309',200:'#0891b2'},
  dark: {20:'#60a5fa',50:'#c084fc',150:'#fbbf24',200:'#22d3ee'},
} as const;
export type SharedAverageTheme = keyof typeof sharedAveragePalette;
export type SharedVolumeCase = 'normal' | 'missing' | 'zero' | 'empty';
export type SharedEvidenceCase = 'normal' | 'sparse' | 'warmup' | 'partial' | 'rejected';
export const sharedAverages = inlineStudies.map(study=>({...study,label:`${study.period} ${study.definitionId==='ema'?'EMA':'MA'}`}));
export function sharedAverageState(theme:SharedAverageTheme='dark',selected:readonly string[]=sharedAverages.map(study=>study.id),volume=true) {
  const state=inlineState('all',volume);
  state.indicators=selected.flatMap(id=>{
    const instance=state.indicators.find(item=>item.id===id),study=sharedAverages.find(item=>item.id===id);
    return instance&&study?[{...instance,colors:{[study.definitionId]:sharedAveragePalette[theme][study.period]}}]:[];
  });
  state.panes[0].studyIds=state.indicators.map(study=>study.id);
  return state;
}
export function sharedAverageBars(volume:SharedVolumeCase='normal'):OhlcBar[] {
  if(volume==='empty')return [];
  return inlineBars.map((bar,index)=>({...bar,...(index===inlineBars.length-1&&volume!=='normal'?{volume:volume==='zero'?0:undefined}:{})}));
}
/** Fixed producer observations only. No financial formula is used by this fixture or renderer. */
export function sharedAverageResults(state:ReturnType<typeof sharedAverageState>,variant:SharedEvidenceCase='normal'):SuppliedCalculationResults {
  const results=inlineResults(state,variant==='warmup'||variant==='rejected'?variant:'normal');
  if(variant!=='partial'&&variant!=='sparse')return results;
  return Object.fromEntries(Object.entries(results).map(([id,result])=>[id,result?.kind==='indicator'?{
    ...result,status:'partial',stale:true,warning:'Synthetic supplied coverage warning; original source evidence remains host-owned.',
    points:variant==='sparse'?result.points.filter((_,index)=>index!==2&&index!==5).map((point,index)=>index===0?{...point,values:Object.fromEntries(Object.keys(point.values).map(key=>[key,null]))}:point):result.points,
  }:result]));
}
