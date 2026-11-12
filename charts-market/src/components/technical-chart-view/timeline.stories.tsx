import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {Button} from 'aapaetsch-ui-kit';
import {TechnicalChartView,technicalChartThemes,type TechnicalChartTheme} from '.';
import type {MarketChartHandle} from '../market-chart';
import {createTechnicalChartViewState,marketTimeKey,type MarketChartChangeMetadata,type MarketSessionRange,type MarketTime,type MarketTimelineRange,type OhlcBar} from '../../core';

export default {title:'Market Charts/Timeline Controls',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
const sec=(s:string)=>Date.parse(s)/1000;
const sessions:MarketSessionRange[]=[
  {id:'extended',from:sec('2026-03-06T12:00Z'),to:sec('2026-03-06T23:00Z')},
  {id:'dst-monday',from:sec('2026-03-09T13:30Z'),to:sec('2026-03-09T20:00Z')},
  {id:'late-open',from:sec('2026-03-10T14:10Z'),to:sec('2026-03-10T22:00Z')},
  {id:'short-day',from:sec('2026-03-11T13:30Z'),to:sec('2026-03-11T18:00Z')},
];
const candle=(time:number,i:number):OhlcBar=>({time,open:100+Math.sin(i/5),high:103+Math.sin(i/5),low:98+Math.sin(i/5),close:101+Math.sin(i/5),volume:1000+i});
const intraday=sessions.flatMap(s=>Array.from({length:Math.floor((Number(s.to)-Number(s.from))/900)+1},(_,i)=>Number(s.from)+i*900).filter(t=>new Date(t*1000).getUTCMinutes()!==0).map(candle));
const daily=Array.from({length:440},(_,i)=>sec('2025-10-01T00:00Z')+i*86400).filter((_,i)=>i%7!==3&&i%7!==4).map(candle);
const monthly=Array.from({length:60},(_,i)=>Date.UTC(2022+Math.floor(i/12),i%12,5)/1000).map(candle);
const longHistory=Array.from({length:100000},(_,i)=>candle(sec('2025-01-01')+i*300,i));

function Demo({theme='dark',width,compact=false,multi=false,panes=false,weekly=false,month=false,long=false,empty=false,single=false,nonpositive=false}:{theme?:TechnicalChartTheme;width?:number;compact?:boolean;multi?:boolean;panes?:boolean;weekly?:boolean;month?:boolean;long?:boolean;empty?:boolean;single?:boolean;nonpositive?:boolean}){
 const [range,setRange]=React.useState<MarketTimelineRange>(long?'all':month?'6M':weekly?'3M':'5D');
 const [revision,setRevision]=React.useState(0),[extra,setExtra]=React.useState(false);
 const base=React.useMemo(()=>long?longHistory:month?monthly:weekly?daily.filter((_,i)=>i%5===0):range==='1D'?intraday.filter(b=>marketTimeKey(b.time)>=Number(sessions[1].from)&&marketTimeKey(b.time)<=Number(sessions[1].to)):range==='5D'?intraday:range==='1M'?daily.slice(0,22):range==='3M'?daily.slice(0,66):range==='6M'?daily.slice(0,132):daily,[long,month,weekly,range]);
 const data=React.useMemo(()=>empty?[]:single?base.slice(0,1):base.map((b,i)=>({...b,volume:(b.volume??0)+revision,...(nonpositive&&i===base.length-1?{low:-1,close:0}:{})})),[base,revision,empty,single,nonpositive]);
 const [state,setState]=React.useState(()=>{const s=createTechnicalChartViewState('price-only');s.indicators=[];s.profiles=[];s.drawings=[];s.panes=s.panes.slice(0,1).map(p=>({...p,studyIds:[],showVolume:false}));if(panes)s.panes.push({id:'volume',order:1,size:1,minimumSize:100,showVolume:true,studyIds:[],scaleSide:'left'});s.viewport={};return s;});
 const api=React.useRef<MarketChartHandle>(null),timer=React.useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const [origins,setOrigins]=React.useState<MarketChartChangeMetadata[]>([]);
 const times=React.useMemo<readonly MarketTime[]>(()=>{const a=data.map(b=>marketTimeKey(b.time));if(!a.length)return[sec('2026-01-01')];const supplied=(range==='1D'||range==='5D')?sessions.filter(s=>Number(s.to)>=a[0]&&Number(s.from)<=a.at(-1)!).flatMap(s=>[Number(s.from),Number(s.to)]):[];return [...new Set([...a,...supplied,a.at(-1)!+(range==='1D'?900:86400)*(extra?3:1)])].sort((a,b)=>a-b);},[data,extra,range]);
 const selected=(next:MarketTimelineRange)=>{clearTimeout(timer.current);setRange(next);setState(s=>({...s,viewport:{}}));};
 React.useEffect(()=>()=>clearTimeout(timer.current),[]);
 React.useEffect(()=>{const w=window as Window&{timelineFixture?:unknown},fixture={api:()=>api.current,bars:()=>data,state:()=>state,origins:()=>origins,calendar:()=>times};w.timelineFixture=fixture;return()=>{if(w.timelineFixture===fixture)delete w.timelineFixture;};},[data,state,origins,times]);
 return <div className="min-h-screen min-w-0 bg-background p-2 text-foreground" style={{...technicalChartThemes[theme],width:width??'100%',maxWidth:'100%'}}>
  <p className="mb-2 text-xs">Synthetic supplied timeline · no providers · 300ms controlled viewport echoes · {long?'100,000':data.length} observations</p>
  <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Timeline fixture controls">
   {(['1D','5D','1M','3M','6M','all'] as const).map(r=><Button key={r} size="xs" aria-pressed={range===r} onClick={()=>selected(r)}>{r}</Button>)}
   <Button size="xs" onClick={()=>setRevision(r=>r+1)}>Same dataset revision</Button><Button size="xs" onClick={()=>setExtra(v=>!v)}>Update earnings calendar</Button>
   <Button size="xs" onClick={()=>api.current?.setViewportCommand({logicalRange:{from:data.length+1,to:data.length+30}})}>Blank window</Button>
  </div>
  <div className={multi?'grid grid-cols-2 gap-2':'min-w-0'}>
   <TechnicalChartView chartApiRef={api} data={data} symbol="SYNTHETIC" interval={weekly?'1W':month?'1M':'15m'}
    timeAxis={{mode:'calendar',times}} calculationMode="supplied" calculationIdentity="synthetic-timeline" dataIdentity="synthetic-timeline"
    state={state} onStateChange={(next,metadata)=>{if(metadata.type==='viewport'){clearTimeout(timer.current);timer.current=setTimeout(()=>setState(s=>({...s,viewport:next.viewport})),300);}else setState(next);}}
    interactions={{mode:'workspace',contextKey:`synthetic-${range}`}} onVisibleRangeChange={(_,m)=>m&&setOrigins(a=>[...a.slice(-15),m])}
    earnings={data.length?[{id:'future',time:times.at(-1)!,barTime:times.at(-1)!,label:'Supplied upcoming report',estimated:true}]:[]}
    theme={theme} appearance={{height:compact?300:580,minimumPlotHeight:120,heightMode:'available',timeZone:'America/New_York',locale:'en-US',legends:'compact',suppliedStatus:'compact',navigation:'integrated',timeline:{range:'auto',sessions:range==='1D'||range==='5D'?sessions:undefined,scaleControls:'icons'},badges:{endpointValues:'all-visible',style:'outline'}}}
    features={{header:false,commands:false,drawingRail:true,dataTable:false}} rangeShortcuts={[]} footerActions={<span className="min-w-0 break-words text-muted-foreground">Supplied history · host actions stay left</span>}/>
   {multi?<TechnicalChartView data={daily.slice(0,25)} symbol="COMPACT" interval="1D" state={state} onStateChange={()=>{}} calculationMode="supplied" calculationIdentity="synthetic-second" theme={theme} interactions={{mode:'workspace'}} appearance={{height:300,legends:'compact',timeline:{scaleControls:'icons'}}} features={{header:false,commands:false,drawingRail:false,dataTable:false}} rangeShortcuts={[]}/>:null}
  </div>
 </div>;
}
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Narrow390:Story={render:()=> <Demo width={390}/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const Compact:Story={render:()=> <Demo width={390} compact/>};
export const TwoCharts:Story={render:()=> <Demo multi/>};
export const MultiPane:Story={render:()=> <Demo panes/>};
export const Weekly:Story={render:()=> <Demo weekly/>};
export const Monthly:Story={render:()=> <Demo month/>};
export const LongHistory:Story={render:()=> <Demo long/>};
export const Empty:Story={render:()=> <Demo empty/>};
export const Single:Story={render:()=> <Demo single/>};
export const NonpositiveLog:Story={render:()=> <Demo nonpositive/>};
