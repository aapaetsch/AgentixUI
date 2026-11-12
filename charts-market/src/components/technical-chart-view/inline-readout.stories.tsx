import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {TechnicalChartView,useTechnicalPaneMenu,technicalChartThemes,type TechnicalChartTheme} from '.';
import {createMarketChartEngine} from '../../engine';
import type {IndicatorRenderSeries,MarketChartEngine,MarketChartEngineFactory,TechnicalChartGeometry} from '../../core';
import type {MarketChartHandle} from '../market-chart';
import {inlineBars,inlineDefinitions,inlineResults,inlineState,inlineStudies} from './inline-readout-fixture';

export default {title:'Market Charts/Board Inline Readout',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
interface DemoProps {theme?:TechnicalChartTheme;width?:number;expanded?:boolean;dense?:boolean;empty?:boolean;legacy?:boolean;warmup?:boolean}
function Card({theme='dark',width,expanded=false,empty=false,legacy=false,warmup=false,index=0}:DemoProps&{index?:number}){
  const [state,setState]=React.useState(()=>inlineState(empty?'none':'all',!empty)),[wide,setWide]=React.useState(expanded),[slot,setSlot]=React.useState(296.7),[variant,setVariant]=React.useState<'normal'|'warmup'|'rejected'>(warmup?'warmup':'normal'),[defaultLegend,setDefaultLegend]=React.useState(legacy),[evidence,setEvidence]=React.useState(false);
  const results=React.useMemo(()=>inlineResults(state,variant),[state,variant]),menu=useTechnicalPaneMenu(),api=React.useRef<MarketChartHandle>(null),engine=React.useRef<MarketChartEngine|null>(null),geometry=React.useRef<TechnicalChartGeometry|null>(null),series=React.useRef<IndicatorRenderSeries[]>([]),counts=React.useRef({states:0,requests:0,geometries:0,financial:0,engines:0});
  const factory=React.useCallback<MarketChartEngineFactory>((host,options)=>{const value=createMarketChartEngine(host,options);engine.current=value;counts.current.engines++;const set=value.setIndicatorSeries.bind(value);value.setIndicatorSeries=next=>{series.current=next;set(next);};return value;},[]);
  React.useEffect(()=>{if(index!==0)return;const target=window as Window&{boardInlineFixture?:unknown};const fixture={api:()=>api.current,proof:()=>({counts:counts.current,geometry:geometry.current,series:series.current.map(item=>({id:item.id,color:item.color,points:item.points})),snapshot:engine.current?.getSnapshot(),state,results,bars:inlineBars})};target.boardInlineFixture=fixture;return()=>{if(target.boardInlineFixture===fixture)delete target.boardInlineFixture;};},[index,state,results]);
  const select=(selection:'none'|'one'|'all')=>setState(value=>({...value,...inlineState(selection,!!value.panes[0].showVolume),viewport:value.viewport}));
  return <article aria-label={`Inline Board card ${index+1}`} className="min-w-0 rounded border border-border" style={{width:wide?'100%':width??430,maxWidth:'100%'}}>
    <div className="flex items-center gap-2 px-2"><button {...menu.getTriggerProps('price')} className="min-h-11 min-w-0 flex-1 text-left text-sm focus-visible:ring-2 focus-visible:ring-ring">SYNTHETIC ▾</button><button className="min-h-11 px-2 text-xs focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setWide(value=>!value)}>{wide?'Compact':'Expand'}</button></div>
    <TechnicalChartView symbol="SYNTHETIC" interval="5m" chartApiRef={api} engineFactory={factory} data={inlineBars} state={state} onStateChange={next=>{counts.current.states++;setState(next);}}
      calculationMode="supplied" calculationIdentity="board-inline" suppliedResults={results} availableIndicators={inlineDefinitions} onCalculationRequest={()=>{counts.current.requests++;}} onRequestFinancials={()=>{counts.current.financial++;}} onGeometryChange={next=>{counts.current.geometries++;geometry.current=next;}}
      paneMenuTrigger="none" paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} theme={theme}
      priceReferences={[{id:'open',price:33,label:'Regular 09:30 ET open · explicit synthetic observation',showAxisLabel:true,lineStyle:'dotted'}]}
      earnings={[{id:'supplied-earnings',time:inlineBars[4].time,barTime:inlineBars[4].time,label:'Supplied synthetic earnings',reportedEps:1.2345}]}
      onRequestSuppliedDetails={()=>setEvidence(true)}
      appearance={{height:wide?516.7:slot,heightMode:'available',minimumPlotHeight:120,legends:wide?'expanded':'compact',studyReadout:defaultLegend?undefined:'inline',suppliedDetails:false,suppliedStatus:'compact',timeZone:'America/New_York',timeline:{scaleControls:'icons'},crosshair:{lineMarker:{visible:true}},badges:{movingAverages:'all-visible'}}}
      features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/>
    <div className="flex flex-wrap gap-1 border-t border-border px-2 text-xs" role="group" aria-label={`Fixture controls ${index+1}`}>
      <button className="min-h-11 px-1" onClick={()=>select('none')}>No averages</button><button className="min-h-11 px-1" onClick={()=>select('one')}>One average</button><button className="min-h-11 px-1" onClick={()=>select('all')}>All averages</button>
      {inlineStudies.map(study=><button key={study.id} className="min-h-11 px-1" onClick={()=>setState(value=>{const next=inlineState('all',!!value.panes[0].showVolume);next.indicators=next.indicators.filter(item=>item.id===study.id);next.panes[0].studyIds=[study.id];return {...value,indicators:next.indicators,panes:next.panes};})}>{study.definitionId.toUpperCase()} {study.period} only</button>)}
      <button className="min-h-11 px-1" onClick={()=>setState(value=>({...value,panes:value.panes.map(pane=>({...pane,showVolume:!pane.showVolume}))}))}>Toggle volume</button>
      <button className="min-h-11 px-1" onClick={()=>setVariant(value=>value==='normal'?'warmup':value==='warmup'?'rejected':'normal')}>Cycle supplied evidence</button>
      <button className="min-h-11 px-1" onClick={()=>setDefaultLegend(value=>!value)}>Toggle default legends</button>
      <button className="min-h-11 px-1" onClick={()=>setSlot(value=>value===296.7?236.4:296.7)}>Resize slot</button>
      <button className="min-h-11 px-1" onClick={()=>setEvidence(value=>!value)}>Complete supplied evidence</button>
    </div>
    {evidence?<section aria-label="Host complete supplied evidence" className="max-h-80 overflow-auto p-2 text-xs"><p>Exact original producer evidence; display chrome never mutates these values.</p><pre className="whitespace-pre-wrap break-all">{JSON.stringify({bars:inlineBars,results},null,2)}</pre></section>:null}
  </article>;
}
function Demo(props:DemoProps){return <div className="min-h-screen bg-background p-2 text-foreground" style={technicalChartThemes[props.theme??'dark']}><p className="mb-2 text-xs">Synthetic supplied observations · no financial calculations · public Board inline readout</p><div className={props.dense?'grid grid-cols-3 gap-2':''}>{Array.from({length:props.dense?3:1},(_,index)=><Card key={index} {...props} index={index}/>)}</div></div>;}
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const Narrow390:Story={render:()=> <Demo width={390}/>};
export const Narrow430:Story={render:()=> <Demo width={430}/>};
export const Expanded:Story={render:()=> <Demo expanded/>};
export const Dense:Story={render:()=> <Demo dense/>};
export const NoReadouts:Story={render:()=> <Demo empty/>};
export const DefaultLegends:Story={render:()=> <Demo legacy/>};
export const Warmup:Story={render:()=> <Demo warmup/>};
