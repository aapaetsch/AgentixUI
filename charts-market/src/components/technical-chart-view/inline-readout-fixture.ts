import {createCalculationRequests, type SuppliedCalculationResults} from '../../core';
import {suppliedStudyDefinitions} from '../../indicators';
import {boardBars, boardState} from './board-card-fixture';

/** Static synthetic producer observations, not averages calculated by the renderer. */
export const inlineBars = boardBars.map((bar, index) => ({...bar, volume: [0, undefined, 1234567.125, 4000, 5000, 6000, 7000, 8765432.125][index]}));
export const inlineStudies = [
  {id:'board-ema', definitionId:'ema', period:20, color:'#e58c3d', values:[26.125,27.125,28.125,29.125,30.125,31.125,32.125,33.123456789]},
  {id:'board-50', definitionId:'sma', period:50, color:'#22b8cf', values:[25.25,26.25,27.25,28.25,29.25,30.25,31.25,32.234567891]},
  {id:'board-150', definitionId:'sma', period:150, color:'#a78bfa', values:[24.375,25.375,26.375,27.375,28.375,29.375,30.375,31.345678912]},
  {id:'board-200', definitionId:'sma', period:200, color:'#71ab7d', values:[23.5,24.5,25.5,26.5,27.5,28.5,29.5,30.456789123]},
] as const;
export const inlineDefinitions = suppliedStudyDefinitions.filter(definition => definition.id==='sma'||definition.id==='ema');
export function inlineState(selection:'none'|'one'|'all'='all', volume=true) {
  const state=boardState(), selected=selection==='none'?[]:selection==='one'?inlineStudies.slice(0,1):inlineStudies;
  state.indicators=selected.map(study=>({id:study.id,definitionId:study.definitionId,version:1,visible:true,parameters:{period:study.period},colors:{[study.definitionId]:study.color}}));
  state.panes[0]={...state.panes[0],studyIds:selected.map(study=>study.id),showVolume:volume,minimumSize:100};
  return state;
}
export function inlineResults(state:ReturnType<typeof inlineState>, variant:'normal'|'warmup'|'rejected'='normal'):SuppliedCalculationResults {
  return Object.fromEntries(createCalculationRequests('board-inline','SYNTHETIC','5m',state).map(request=>{
    const study=inlineStudies.find(item=>item.id===request.instanceId)!;
    return [request.instanceId,{kind:'indicator',requestKey:variant==='rejected'?'superseded':request.requestKey,status:variant==='normal'?'available':'partial',stale:variant!=='normal',
      warning:variant==='normal'?undefined:'Synthetic supplied coverage warning; exact source evidence remains host-owned.',provenanceLabel:'Static synthetic producer observations',coverageSummary:'Eight explicit observations, no renderer formulas',
      points:inlineBars.map((bar,index)=>({time:bar.time,values:{[study.definitionId]:variant==='warmup'?null:study.values[index]}}))}];
  }));
}
