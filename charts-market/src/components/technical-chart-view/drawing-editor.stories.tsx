import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {Button} from 'aapaetsch-ui-kit';
import {TechnicalChartView} from '.';
import {MarketChart,type MarketChartHandle} from '../market-chart';
import {createTechnicalChartViewState,type DrawingState,type MarketTimeAxis,type TechnicalChartViewChangeMetadata} from '../../core';
import {marketDrawingGeometryKey,type MarketDrawingEditorPosition,type MarketDrawingSuppliedStatistics} from '../../drawings';
import {technicalChartThemes,type TechnicalChartTheme} from './scoped-theme';

const day=86400,first=Date.parse('2026-09-01T12:00:00Z')/1000;
const bars=Array.from({length:58},(_,i)=>({time:first+i*day,open:100+i*.2,high:104+i*.2,low:98+i*.2,close:102+i*.2,volume:1000+i*10}));
const exact=(time:number,price:string)=>({time,price:Number(price),priceText:price,utcTimeText:new Date(time*1000).toISOString()});
const documents:DrawingState[]=[
  {id:'trend',name:'Research plan',type:'trend-line',version:1,visible:true,locked:false,points:[exact(first+20*day,'105.000000000000000001'),exact(first+45*day,'114.000000000000000002')],parameters:{color:'#0891b2',lineWidth:2,presentation:{statistics:['price_range','percent_change','bars_range','date_time_range','distance','angle'],statisticsPosition:'auto'}}},
  {id:'horizontal',name:'Authored support',type:'horizontal-line',version:1,visible:true,locked:false,points:[exact(first+25*day,'103.1234567890123456789')],parameters:{color:'#d97706',lineWidth:1}},
  {id:'vertical',name:'Review date',type:'vertical-line',version:1,visible:true,locked:false,points:[exact(first+35*day,'100')],parameters:{color:'#9333ea',lineWidth:1,dashStyle:'dotted'}},
  {id:'rectangle',name:'Planned zone',type:'rectangle',version:1,visible:true,locked:false,points:[exact(first+40*day,'108.000'),exact(first+65*day,'116.000')],parameters:{color:'#16a34a',lineWidth:1,presentation:{middlePoint:true}}},
];
function initialState(){const state=createTechnicalChartViewState('price-only');state.indicators=[];state.profiles=[];state.drawings=JSON.parse(JSON.stringify(documents));state.selectedDrawingIds=['trend'];state.panes=state.panes.slice(0,1).map(p=>({...p,studyIds:[],showVolume:false}));state.chrome.magnet='off';state.viewport={};return state;}
function Demo({theme='dark',width,active=true,onActivate,delayed=false,axisMode='compressed',timeZone='America/New_York'}:{theme?:TechnicalChartTheme;width?:number;active?:boolean;onActivate?:()=>void;delayed?:boolean;axisMode?:MarketTimeAxis['mode'];timeZone?:string}) {
  const [state,setState]=React.useState(initialState),[position,setPosition]=React.useState<MarketDrawingEditorPosition|null>(null),[commits,setCommits]=React.useState<TechnicalChartViewChangeMetadata[]>([]),[context,setContext]=React.useState('accepted-synthetic-1'),[statistics,setStatistics]=React.useState<MarketDrawingSuppliedStatistics[]>([]),[interval,setInterval]=React.useState('1D');
  const api=React.useRef<MarketChartHandle>(null),pending=React.useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const container=React.useRef<HTMLElement>(null);
  React.useEffect(()=>()=>clearTimeout(pending.current),[]);
  const policy={convention:'utc-calendar' as const,intervalSeconds:day,horizonMonths:12};
  const axis:MarketTimeAxis=axisMode==='compressed'?{mode:'compressed',futureDisplay:policy}:axisMode==='calendar'?{mode:'calendar',times:bars.map(b=>b.time),futureDisplay:policy}:{mode:'utc',domain:{from:first,to:bars.at(-1)!.time},intervalSeconds:day,futureDisplay:policy};
  const supplyStatistics=()=>setStatistics(previous=>previous.length?[]:state.drawings.filter(d=>d.points.length===2).map(d=>({drawingId:d.id,geometryKey:marketDrawingGeometryKey(d),contextKey:context,values:{price_range:'9.000000000000000001 USD · supplied fixture',percent_change:'8.571428571428571429% · supplied fixture',bars_range:'26 supplied observations',date_time_range:'2026-09-21 — 2026-10-16 · supplied fixture'}})));
  const showFuture=()=>api.current?.setViewportCommand({logicalRange:{from:35,to:423}});
  const style:React.CSSProperties={...technicalChartThemes[theme],width:width??'100%',maxWidth:'100%'};
  return <section ref={container} className="min-w-0 bg-background p-2 text-foreground" style={style} onPointerDownCapture={()=>onActivate?.()} onFocusCapture={()=>onActivate?.()}>
    <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Drawing editor fixture controls">{!active?<Button size="sm" onClick={onActivate}>Activate chart</Button>:null}{documents.map(d=><Button key={d.id} size="sm" onClick={()=>setState(s=>({...s,selectedDrawingIds:[d.id]}))}>{d.type==='trend-line'?'Trend':d.type==='horizontal-line'?'Horizontal':d.type==='vertical-line'?'Vertical':'Rectangle'}</Button>)}
      <Button size="sm" onClick={()=>setState(s=>({...s,selectedDrawingIds:['trend','rectangle']}))}>Multi-select</Button>
      <Button size="sm" onClick={()=>setState(s=>({...s,selectedDrawingIds:[]}))}>Clear selection</Button>
      <Button size="sm" onClick={()=>setState(s=>({...s,activeDrawingTool:'trend-line'}))}>Draw trend</Button>
      <Button size="sm" onClick={showFuture}>Future year</Button>
      <Button size="sm" onClick={()=>api.current?.fitContent()}>Fit history</Button>
      <Button size="sm" onClick={()=>{void(document.fullscreenElement?document.exitFullscreen():container.current?.requestFullscreen());}}>Toggle fullscreen</Button>
      <Button size="sm" onClick={()=>api.current?.executeDrawingCommand({type:'undo'})}>Undo</Button>
      <Button size="sm" onClick={()=>api.current?.executeDrawingCommand({type:'redo'})}>Redo</Button>
      <Button size="sm" onClick={supplyStatistics}>{statistics.length?'Clear supplied stats':'Supply exact stats'}</Button>
      <Button size="sm" onClick={()=>setContext(v=>v+'-next')}>New admitted context</Button>
      <label className="flex min-h-11 items-center gap-1 text-xs">Interval<select aria-label="Fixture interval" value={interval} onChange={e=>setInterval(e.target.value)} className="min-h-11 bg-background">{['1m','30m','1h','24h','1D','2W','1M','30s','1tick','range'].map(v=><option key={v}>{v}</option>)}</select></label>
    </div>
    <TechnicalChartView chartApiRef={api} symbol="SYNTHETIC" interval={interval} data={bars} dataIdentity="drawing-editor-synthetic" calculationMode="supplied" calculationIdentity="drawing-editor-synthetic" state={active?state:{...state,selectedDrawingIds:[]}} onStateChange={(next,metadata)=>{
      if(metadata.drawing?.type!=='selection'&&metadata.drawing)setCommits(values=>[...values,metadata]);
      if(delayed&&metadata.drawing?.type!=='selection'&&metadata.drawing){clearTimeout(pending.current);pending.current=setTimeout(()=>setState(next),250);}else setState(next);
    }} timeAxis={axis} interactions={{mode:'workspace',contextKey:'drawing-editor-synthetic'}} drawingToolIds={['trend-line','horizontal-line','vertical-line','rectangle']}
      drawingEditor={{active,position,onPositionChange:setPosition,timeZone,statistics,statisticsContextKey:context}}
      theme={theme} appearance={{height:560,heightMode:'available',minimumPlotHeight:200,timeZone,legends:'compact',suppliedStatus:'host',timeline:{range:'auto',scaleControls:'icons'}}} features={{header:false,commands:false,drawingRail:false,dataTable:false,footer:false}} rangeShortcuts={[]}/>
    <details className="mt-3 text-xs"><summary>Fixture verification</summary><p>Synthetic supplied annotations; no provider or browser financial calculation. Physical device acceptance is separate.</p><output aria-label="Committed drawing transactions">{commits.length}</output><pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all" data-testid="drawing-editor-state">{JSON.stringify({drawings:state.drawings,selected:state.selectedDrawingIds,position,commits,context},null,2)}</pre></details>
  </section>;
}
function Four(){const [active,setActive]=React.useState(0);return <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-2">{[0,1,2,3].map(id=><Demo key={id} theme={id%2?'light':'dark'} active={active===id} onActivate={()=>setActive(id)}/>)}</div>;}
function ObjectTree(){const [drawings,setDrawings]=React.useState(()=>JSON.parse(JSON.stringify(documents)) as DrawingState[]),[selected,setSelected]=React.useState(['trend']);return <MarketChart data={bars} drawings={drawings} selectedDrawingIds={selected} onSelectedDrawingIdsChange={setSelected} onDrawingsChange={setDrawings} drawingEditor={{active:true}} showDrawingToolbar={false} showDrawingObjectTree calculationMode="supplied" timeAxis={{mode:'compressed',futureDisplay:{convention:'utc-calendar',intervalSeconds:day,horizonMonths:12}}} height={560}/>;}
export default {title:'Market Charts/Drawing Editor',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Narrow390:Story={render:()=> <Demo width={390}/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const Calendar:Story={render:()=> <Demo axisMode="calendar"/>};
export const Utc:Story={render:()=> <Demo axisMode="utc"/>};
export const DelayedEcho:Story={render:()=> <Demo delayed/>};
export const FourInstances:Story={render:()=> <Four/>};
export const HiddenRecovery:Story={render:()=> <ObjectTree/>};
