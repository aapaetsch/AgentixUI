import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {Button} from 'aapaetsch-ui-kit';
import {TechnicalChartView,technicalChartThemes,type TechnicalChartTheme} from '.';
import type {MarketChartHandle} from '../market-chart';
import {createTechnicalChartViewState,marketFutureDisplayEnd,type MarketTimeAxis,type OhlcBar,type MarketViewportOptions} from '../../core';
import {trendLineDrawing,horizontalLineDrawing,verticalLineDrawing,rectangleDrawing} from '../../drawings';
const sec=(s:string)=>Date.parse(s)/1000,day=86400;
const tools=[trendLineDrawing,horizontalLineDrawing,verticalLineDrawing,rectangleDrawing];
const candle=(time:number,i:number):OhlcBar=>({time,open:100+Math.sin(i/12)*5,high:108+Math.sin(i/12)*5,low:94+Math.sin(i/12)*5,close:103+Math.sin(i/12)*5,volume:1000+i});
const daily=Array.from({length:365},(_,i)=>sec('2025-01-01')+i*day).filter(t=>![0,6].includes(new Date(t*1000).getUTCDay())).map(candle);
type Resolution='daily'|'weekly'|'monthly'|'intraday'|'empty'|'single';
function Demo({theme='dark',width,axisMode='compressed',resolution='daily'}:{theme?:TechnicalChartTheme;width?:number;axisMode?:MarketTimeAxis['mode'];resolution?:Resolution}){
 const [mode,setMode]=React.useState(axisMode),[cadence,setCadence]=React.useState(resolution),[revision,setRevision]=React.useState(0);
 const intervalSeconds=cadence==='weekly'?7*day:cadence==='monthly'?30*day:cadence==='intraday'?60:day;
 const data=React.useMemo(()=>cadence==='empty'?[]:cadence==='single'?[daily.at(-1)!]:cadence==='weekly'?daily.filter((_,i)=>i%5===0):cadence==='monthly'?Array.from({length:12},(_,i)=>candle(Date.UTC(2025,i,15)/1000,i)):cadence==='intraday'?Array.from({length:240},(_,i)=>candle(sec('2025-12-31T10:00Z')+i*60,i)):revision?[...daily,candle(Number(daily.at(-1)!.time)+2*day,270)]:daily,[cadence,revision]);
 const api=React.useRef<MarketChartHandle>(null),pending=React.useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const [state,setState]=React.useState(()=>{const s=createTechnicalChartViewState('price-only');s.indicators=[];s.profiles=[];s.drawings=[];s.panes=s.panes.slice(0,1).map(p=>({...p,studyIds:[],showVolume:false}));s.chrome.magnet='off';s.viewport={};return s;});
 const [ranges,setRanges]=React.useState<MarketViewportOptions[]>([]),[requestCount,setRequestCount]=React.useState(0);
 const first=Number(data[0]?.time??sec('2025-12-31')),last=Number(data.at(-1)?.time??first),earnings=last+3*day;
 const axis=React.useMemo<MarketTimeAxis>(()=>{
  const futureDisplay={convention:'utc-calendar' as const,intervalSeconds,horizonMonths:12,emptyOrigin:first};
  return mode==='utc'?{mode,domain:{from:first,to:Math.max(first+intervalSeconds,last)},intervalSeconds,futureDisplay}:mode==='calendar'?{mode,times:[...data.map(b=>b.time),earnings],futureDisplay}:{mode,futureDisplay};
 },[mode,intervalSeconds,first,last,data,earnings]);
 const showFuture=(all=false)=>{
  const seam=axis.mode==='calendar'?Number(axis.times.at(-1)):axis.mode==='utc'?Number(axis.domain.to):last;
  const earliest=axis.mode==='calendar'?Number(axis.times[0]):first;
  const fromTime=all?seam+10*intervalSeconds:Math.max(earliest,marketFutureDisplayEnd(last,-6));
  const fromX=api.current?.coordinateForTime(fromTime),toX=api.current?.coordinateForTime(marketFutureDisplayEnd(seam)),snap=api.current?.getSnapshot();
  const r=snap?.viewport?.logicalRange,pane=snap?.panes.find(p=>p.id==='price');
  if(fromX==null||toX==null||!r||!pane?.width)return;
  const logical=(x:number)=>r.from+(x-(pane.left??0))/pane.width*(r.to-r.from);
  api.current?.setViewportCommand({logicalRange:{from:logical(fromX),to:logical(toX)}});
 };
 React.useEffect(()=>()=>clearTimeout(pending.current),[]);
 React.useEffect(()=>{const w=window as Window&{drawingExtensionFixture?:unknown};const fixture={api:()=>api.current,state:()=>state,bars:()=>data,axis:()=>axis,ranges:()=>ranges,requestCount:()=>requestCount};w.drawingExtensionFixture=fixture;return()=>{if(w.drawingExtensionFixture===fixture)delete w.drawingExtensionFixture;};},[state,data,axis,ranges,requestCount]);
 return <div className="min-h-screen min-w-0 bg-background p-2 text-foreground" style={{...technicalChartThemes[theme],width:width??'100%',maxWidth:'100%'}}>
  <p className="mb-2 text-xs text-muted-foreground">Synthetic supplied fixture · UTC calendar display dates are annotation space, never observations</p>
  <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Drawing extension fixture controls">
   <Button size="sm" onClick={()=>setState(s=>({...s,activeDrawingTool:'trend-line'}))}>Draw trend</Button>
   <Button size="sm" onClick={()=>setState(s=>({...s,activeDrawingTool:'horizontal-line'}))}>Draw horizontal</Button>
   <Button size="sm" onClick={()=>showFuture()}>Six months + future year</Button><Button size="sm" onClick={()=>showFuture(true)}>Fully future</Button>
   <Button size="sm" onClick={()=>api.current?.fitContent()}>Fit history</Button><Button size="sm" onClick={()=>api.current?.scrollToRealtime()}>Latest history</Button>
   <Button size="sm" onClick={()=>api.current?.executeDrawingCommand({type:'undo'})}>Undo drawing</Button><Button size="sm" onClick={()=>api.current?.executeDrawingCommand({type:'redo'})}>Redo drawing</Button>
   <Button size="sm" onClick={()=>setRevision(v=>v+1)}>Append supplied observation</Button>
   <label className="flex items-center gap-1 text-xs">Axis<select aria-label="Fixture axis" value={mode} onChange={e=>setMode(e.target.value as MarketTimeAxis['mode'])} className="h-11 bg-background"><option>compressed</option><option>calendar</option><option>utc</option></select></label>
   <label className="flex items-center gap-1 text-xs">Cadence<select aria-label="Fixture cadence" value={cadence} onChange={e=>{clearTimeout(pending.current);setCadence(e.target.value as Resolution);setState(s=>({...s,viewport:{},drawings:[],selectedDrawingIds:[]}));}} className="h-11 bg-background">{(['daily','weekly','monthly','intraday','empty','single'] as const).map(c=><option key={c}>{c}</option>)}</select></label>
  </div>
  <TechnicalChartView chartApiRef={api} data={data} symbol="SYNTHETIC" interval={cadence==='intraday'?'1m':cadence==='weekly'?'1W':cadence==='monthly'?'1M':'1D'}
   state={state} onStateChange={(next,m)=>{if(m.type==='viewport'){clearTimeout(pending.current);pending.current=setTimeout(()=>setState(s=>({...s,viewport:next.viewport})),180);}else setState(next);}}
   timeAxis={axis} calculationMode="supplied" calculationIdentity="synthetic-drawing-extensions" dataIdentity="synthetic-drawing-extensions" onCalculationRequest={()=>setRequestCount(v=>v+1)}
   onVisibleRangeChange={r=>r&&setRanges(v=>[...v.slice(-19),{visibleRange:r}])} drawingToolIds={tools.map(t=>t.id)} interactions={{mode:'workspace',contextKey:`synthetic-${cadence}`}}
   earnings={[{id:'future-earnings',time:earnings,barTime:earnings,label:'Exact supplied future earnings'}]}
   theme={theme} appearance={{height:620,heightMode:'available',minimumPlotHeight:180,locale:'en-US',timeZone:'UTC',legends:'compact',suppliedStatus:'host',timeline:{range:'auto',scaleControls:'icons'},studyReadout:'inline'}}
   features={{header:false,commands:false,drawingRail:false,dataTable:false}} rangeShortcuts={[]}/>
 </div>;
}
export default {title:'Market Charts/Drawing Extensions',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Narrow390:Story={render:()=> <Demo width={390}/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const Calendar:Story={render:()=> <Demo axisMode="calendar"/>};
export const Utc:Story={render:()=> <Demo axisMode="utc"/>};
export const Weekly:Story={render:()=> <Demo resolution="weekly"/>};
export const Monthly:Story={render:()=> <Demo resolution="monthly"/>};
export const Intraday:Story={render:()=> <Demo resolution="intraday"/>};
export const Empty:Story={render:()=> <Demo resolution="empty"/>};
export const Single:Story={render:()=> <Demo resolution="single"/>};
