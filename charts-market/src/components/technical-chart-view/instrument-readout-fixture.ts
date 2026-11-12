import {createCalculationRequests,type OhlcBar,type SuppliedCalculationResults} from '../../core';
import {inlineBars,inlineDefinitions,inlineState,inlineStudies} from './inline-readout-fixture';
import {suppliedStudyDefinitions} from '../../indicators';
import type {TechnicalChartReadoutObservation} from './instrument-readout';

/** Explicit synthetic text supplied by this fixture, never reconstructed by the renderer. */
export const originalDecimal=(value:number|undefined)=>value==null?null:value===0?'0':String(value)+(String(value).includes('.')?'000000000000000001':'.000000000000000001');
export const instrumentBars:OhlcBar[]=inlineBars.map((bar,index)=>({...bar,incomplete:index===inlineBars.length-1}));
export const instrumentDefinitions=[...inlineDefinitions,...suppliedStudyDefinitions.filter(definition=>definition.id==='rsi')];
export function instrumentState(oscillator=false){const state=inlineState();if(oscillator){state.panes[0].size=3;state.indicators.push({id:'instrument-rsi',definitionId:'rsi',version:1,visible:true,parameters:{period:14},colors:{rsi:'#a78bfa'}});state.panes.push({id:'instrument-rsi-pane',studyIds:['instrument-rsi'],showVolume:false,order:1,size:1,minimumSize:90,scaleSide:'right'});}return state;}
const rsiValues=[0,42,45,49,55,50,52,57] as const;
export function instrumentResults(state:ReturnType<typeof instrumentState>,bars:readonly OhlcBar[]=instrumentBars,interval='1D',variant:'normal'|'partial'|'rejected'='normal'):SuppliedCalculationResults {
  return Object.fromEntries(createCalculationRequests('instrument-synthetic','SYNTHETIC',interval,state).map(request=>{
    const study=inlineStudies.find(item=>item.id===request.instanceId),line=study?.definitionId??'rsi';
    return [request.instanceId,{kind:'indicator',requestKey:variant==='rejected'?'superseded':request.requestKey,status:variant==='normal'?'available':'partial',stale:variant==='partial',warning:variant==='normal'?undefined:'Synthetic supplied coverage warning',provenanceLabel:'Explicit synthetic fixture values',points:bars.map(bar=>{const index=instrumentBars.findIndex(item=>item.time===bar.time);return {time:bar.time,values:{[line]:variant==='partial'&&index===7?null:study?.values[index]??rsiValues[index]}};})}];
  }));
}
export function instrumentObservations(bars:readonly OhlcBar[]=instrumentBars):TechnicalChartReadoutObservation[]{return bars.map((bar,index)=>({time:bar.time,open:originalDecimal(bar.open),high:originalDecimal(bar.high),low:originalDecimal(bar.low),close:originalDecimal(bar.close),volume:originalDecimal(bar.volume),studies:{...Object.fromEntries(inlineStudies.map(study=>[`${study.id}:${study.definitionId}`,originalDecimal(study.values[instrumentBars.findIndex(item=>item.time===bar.time)])])),['instrument-rsi:rsi']:originalDecimal(rsiValues[index])}}));}
/** Neutral decorative test asset supplied by the host, not an inferred company mark. */
export const instrumentTestLogo='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#0e7490"/><circle cx="10" cy="10" r="4" fill="white"/></svg>');
