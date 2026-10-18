import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TechnicalChartView, type TechnicalChartTheme } from ".";
import { createCalculationRequests, createTechnicalChartViewState, marketTimeKey, withMarketVisibleRange, type MarketChartEngine, type MarketChartEngineOptions, type MarketTimeAxis, type OhlcBar, type SuppliedCalculationResults, type VisibleRange } from "../../core";
import { createMarketChartEngine } from "../../engine";
import { suppliedStudyDefinitions } from "../../indicators";

export default { title:"Market Charts/Calendar Gaps", component:TechnicalChartView, parameters:{layout:"fullscreen",controls:{disable:true}} } satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;
// Authored UTC fixture data only. No session inference or financial formulas.
const days = ["2026-03-06T14:30Z","2026-03-07T14:30Z","2026-03-08T13:30Z","2026-03-09T13:30Z","2026-03-10T13:30Z","2026-03-11T13:30Z","2026-03-12T13:30Z","2026-03-13T13:30Z"].map(t=>Date.parse(t)/1000);
const minutes = ["2026-03-06T20:55Z","2026-03-06T21:00Z","2026-03-09T13:30Z","2026-03-09T13:35Z","2026-03-09T13:40Z","2026-03-09T13:45Z","2026-03-09T13:50Z","2026-03-09T13:55Z"].map(t=>Date.parse(t)/1000);
function Card({times,sparse,index,axis,range,onRange,compact,singleton=false}: { times:number[];sparse:boolean;index:number;axis:MarketTimeAxis;range:VisibleRange;onRange:(range:VisibleRange|null)=>void;compact:boolean;singleton?:boolean }) {
  const theme: TechnicalChartTheme = (["light","dark","midnight","light"] as const)[index];
  const data=React.useMemo<OhlcBar[]>(()=>times.flatMap((time,i)=>singleton ? i===3 ? [{time,open:100,high:104,low:97,close:102,volume:100}] : [] : sparse && ![0,3,4,7].includes(i) ? [] : [{time,open:100,high:110,low:90,close:[99,101,104,100,102,106,103,105][i],volume:1000}]),[times,sparse,singleton]);
  const [state,setState]=React.useState(()=>{
    const next=createTechnicalChartViewState("price-only");next.chartType="line";next.profiles=[];
    next.indicators=[{id:"ema",definitionId:"ema",version:1,visible:true,parameters:{period:9}}];next.panes[0].studyIds=["ema"];
    next.drawings=[{id:"trend",type:"trend-line",version:1,visible:true,locked:false,parameters:{color:"#d97706",lineWidth:2},points:[{time:times[0],price:92},{time:times[7],price:108}]},{id:"vwap",type:"anchored-vwap",version:1,visible:true,locked:false,parameters:{color:"#0284c7",lineWidth:2},points:[{time:times[0],price:100}]}];
    next.chrome.favoriteTools=["trend-line","horizontal-line"];return next;
  });
  const controlled={...state,viewport:withMarketVisibleRange(state.viewport,range)};
  const identity=`calendar-fixture-${index}`;
  const results: SuppliedCalculationResults=Object.fromEntries(createCalculationRequests(identity,`MOCK${index}`,"5m",controlled).map(r=>[r.instanceId,{kind:r.kind,requestKey:r.requestKey,status:"available",provenanceLabel:"Supplied mock",points:data.map(bar=>r.kind==="indicator"?{time:bar.time,values:{ema:103}}:{time:bar.time,value:101})}])) as SuppliedCalculationResults;
  const gaps=React.useMemo(()=>sparse && !singleton ? [{from:times[0],to:times[3]},{from:times[4],to:times[7]}] : [],[times,sparse,singleton]);
  const api=React.useRef<MarketChartEngine|null>(null);
  const [coordinates,setCoordinates]=React.useState<unknown>(null);
  const factory=React.useCallback((host:HTMLElement,options:MarketChartEngineOptions)=>{const e=createMarketChartEngine(host,options);api.current=e;return e;},[]);
  React.useEffect(()=>{const timer=setTimeout(()=>setCoordinates({x:times.map(time=>api.current?.coordinateForTime(time)),range:api.current?.getSnapshot().visibleRange,observations:data.length}),180);return()=>clearTimeout(timer);},[times,data,range,compact]);
  return <section data-calendar-card={index} style={{minWidth:0}} aria-label={`${sparse?"Sparse":"Dense"} ${axis.mode} chart ${index+1}`}>
    <p style={{padding:"0.5rem"}}>{sparse?"Sparse":"Dense"} · {axis.mode} · {theme} · {data.length} observations</p>
    <TechnicalChartView timeAxis={axis} discontinuities={gaps} symbol={`MOCK${index}`} interval="5m" data={data} state={controlled} onStateChange={setState} onVisibleRangeChange={onRange} calculationMode="supplied" calculationIdentity={identity} suppliedResults={results} availableIndicators={suppliedStudyDefinitions.map(d=>({...d,calculate:()=>{throw Error("Forbidden calendar fixture calculation");},createRuntime:()=>{throw Error("Forbidden calendar fixture runtime");}}))} theme={theme} engineFactory={factory} appearance={{height:compact?200:440}} features={{header:!compact,commands:!compact,drawingRail:!compact,footer:!compact}} />
    <output aria-label={`Coordinates ${index}`} data-coordinate-evidence={index} style={{fontSize:"0.625rem",overflowWrap:"anywhere"}}>{JSON.stringify(coordinates)}</output>
  </section>;
}
function Board({intraday=false,grid=false,singleton=false}:{intraday?:boolean;grid?:boolean;singleton?:boolean}) {
  const times=intraday?minutes:days;
  const domain=React.useMemo(()=>({from:times[0],to:times[7]}),[times]);
  const axis=React.useMemo<MarketTimeAxis>(()=>grid?{mode:"calendar",times}:{mode:"utc",domain,intervalSeconds:intraday?300:86400},[grid,times,domain,intraday]);
  const [range,setRange]=React.useState(domain),[compact,setCompact]=React.useState(true),[events,setEvents]=React.useState(0);
  const link=React.useCallback((next:VisibleRange|null)=>{if(next)setRange(old=>marketTimeKey(old.from)===marketTimeKey(next.from)&&marketTimeKey(old.to)===marketTimeKey(next.to)?old:next);setEvents(n=>n+1);},[]);
  return <div style={{padding:"0.5rem"}}>
    <button onClick={()=>setCompact(value=>!value)}>Toggle compact boards</button>{" "}
    <button onClick={()=>setRange({from:times[3],to:times[4]})}>Same day window</button>{" "}
    <button onClick={()=>setRange(domain)}>Reset common window</button>
    <p role="status" aria-label="Linked range">{JSON.stringify({range,events})}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"0.5rem"}}>{[0,1,2,3].map(index=><Card key={index} index={index} sparse={index%2===1} singleton={singleton} times={times} axis={axis} range={range} onRange={link} compact={compact}/>)}</div>
  </div>;
}
export const DailyUtc: Story={render:()=> <Board/>};
export const DailyGrid: Story={render:()=> <Board grid/>};
export const IntradayUtc: Story={render:()=> <Board intraday/>};
export const IntradayGrid: Story={render:()=> <Board intraday grid/>};
export const SingleObservations: Story={render:()=> <Board singleton/>};
