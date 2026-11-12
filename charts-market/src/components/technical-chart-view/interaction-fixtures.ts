import {createCalculationRequests,createTechnicalChartViewState,marketDataCalculationIdentity,type SuppliedCalculationResults,type TechnicalChartViewState} from '../../core';
import {suppliedStudyDefinitions} from '../../indicators';
/** Static repeating synthetic input patterns; not indicator calculations or market evidence. */
export const interactionBars=Array.from({length:3000},(_,i)=>({time:1790985600+i*300,open:100+[0,1,2,1,0,-1][i%6],high:104,low:96,close:100+[1,2,1,0,-1,0][i%6],volume:1_000_000+i%4*100_000,incomplete:i===2999}));
export const interactionDefinitions=suppliedStudyDefinitions;
export function interactionFixtureState():TechnicalChartViewState {
 const state=createTechnicalChartViewState('price-only');state.viewport={logicalRange:{from:2850,to:3009},rightOffsetBars:0};
 state.panes=[{id:'price',order:0,size:4.2,minimumSize:420,studyIds:['ma-one','ma-two'],showVolume:true},{id:'rsi',order:1,size:2,minimumSize:200,studyIds:['rsi-one'],scaleSide:'left'},{id:'macd',order:2,size:2.4,minimumSize:240,studyIds:['macd-one']},{id:'rsi-duplicate',order:3,size:2,minimumSize:200,studyIds:['rsi-two']}];
 state.indicators=[{id:'ma-one',definitionId:'sma',version:1,parameters:{period:20},visible:true},{id:'ma-two',definitionId:'sma',version:1,parameters:{period:50},visible:true},{id:'rsi-one',definitionId:'rsi',version:1,parameters:{period:14},visible:true},{id:'rsi-two',definitionId:'rsi',version:1,parameters:{period:7},visible:true},{id:'macd-one',definitionId:'macd',version:1,parameters:{fastPeriod:12,slowPeriod:26,signalPeriod:9},visible:true}];
 state.chrome.drawingRail=false;return state;
}
export function interactionFixtureResults(state:TechnicalChartViewState,revision=1,bars=interactionBars):SuppliedCalculationResults {
 const identity=marketDataCalculationIdentity('synthetic-interactions',revision,'synthetic-interactions-bars');
 return Object.fromEntries(createCalculationRequests(identity,'SYNTHETIC','5m',state).filter(r=>r.kind==='indicator').map(request=>{
  const instance=state.indicators.find(i=>i.id===request.instanceId)!,definition=interactionDefinitions.find(d=>d.id===instance.definitionId)!;
  const points=bars.filter((_,i)=>request.instanceId!=='rsi-two'||i%11!==0).map((bar,i)=>({time:bar.time,values:Object.fromEntries(definition.lines.map((line,j)=>[line.id,i<30||i===bars.length-1&&request.instanceId==='rsi-two'?null:instance.definitionId==='sma'?[99,101,100,102][i%4]+j:instance.definitionId==='rsi'?[32,47,68,53][i%4]:[-1.2,.3,1.7,-.4][(i+j)%4]]))}));
  return [request.instanceId,{kind:'indicator',requestKey:request.requestKey,status:'partial',points,warning:'Synthetic sparse study and null warmup — no provider requests.',provenanceLabel:'Static supplied interaction fixture',coverageSummary:'3000 synthetic observations; duplicate/sparse study instances'}];
 }));
}
