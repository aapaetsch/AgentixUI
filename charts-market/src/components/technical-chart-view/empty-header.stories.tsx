import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {createCalculationRequests,type SuppliedCalculationResults,type TechnicalChartGeometry,type TechnicalChartViewState} from '../../core';
import type {MarketChartHandle} from '../market-chart';
import {TechnicalChartView,useTechnicalPaneMenu,technicalChartThemes,type TechnicalChartTheme} from '.';
import {boardBars,boardCalendar,boardGaps,boardState} from './board-card-fixture';

export default {title:'Market Charts/Empty Header',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
function withLegend(state:TechnicalChartViewState,enabled:boolean):TechnicalChartViewState{return {...state,indicators:enabled?[{id:'supplied:sma',definitionId:'sma',version:1,parameters:{period:3},visible:true,colors:{sma:'#22b8cf'}}]:[],panes:state.panes.map(p=>({...p,studyIds:enabled?['supplied:sma']:[],showVolume:enabled}))};}
function Card({theme='dark',internal=false,workspace=false,mixed=false,index=0}:{theme?:TechnicalChartTheme;internal?:boolean;workspace?:boolean;mixed?:boolean;index?:number}){
 const [state,setState]=React.useState<TechnicalChartViewState>(()=>{const s=boardState();s.panes[0]={...s.panes[0],size:.56,minimumSize:56};return withLegend(s,mixed);}),[height,setHeight]=React.useState(236.7),[geometry,setGeometry]=React.useState<TechnicalChartGeometry>();
 const menu=useTechnicalPaneMenu(),api=React.useRef<MarketChartHandle>(null),events=React.useRef<TechnicalChartGeometry[]>([]);
 const shown=state;
 const supplied:SuppliedCalculationResults=Object.fromEntries(createCalculationRequests('empty-header','BB','1D',shown).map(request=>[request.instanceId,{kind:'indicator',requestKey:request.requestKey,status:'available',provenanceLabel:'Synthetic supplied fixture',points:boardBars.map((bar,i)=>({time:bar.time,values:{sma:[27,26,34,33,29,30,28,32][i]}}))}]));
 React.useEffect(()=>{if(index!==0)return;const target=window as Window&{emptyHeaderFixture?:unknown};target.emptyHeaderFixture={api:()=>api.current,events:()=>events.current};return()=>{delete target.emptyHeaderFixture;};},[index]);
 return <article aria-label={`Synthetic card ${index+1}`} className="min-w-0 rounded border border-border bg-background text-foreground" style={technicalChartThemes[theme]}>
  <div className="flex items-center gap-2 px-2"><button {...menu.getTriggerProps('price')} className="min-h-11 min-w-0 flex-1 rounded px-1 text-left text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">BB · Synthetic company ▾</button><span className="text-xs">Host title</span></div>
  <TechnicalChartView chartApiRef={api} symbol="BB" interval="1D" data={boardBars} state={shown} onStateChange={setState}
   calculationMode="supplied" calculationIdentity="empty-header" suppliedResults={supplied} theme={theme}
   paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} paneMenuTrigger={internal?'internal':'none'}
   interactions={workspace?{mode:'workspace',contextKey:'empty-header'}:undefined} timeAxis={{mode:'calendar',times:boardCalendar}} discontinuities={boardGaps}
   appearance={{height,heightMode:'available',minimumPlotHeight:120,legends:'compact',suppliedDetails:false,timeline:{scaleControls:'icons'},crosshair:{lineMarker:{visible:true}}}}
   onGeometryChange={next=>{events.current=[...events.current.slice(-49),next];setGeometry(next);}}
   features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/>
  <div className="flex flex-wrap gap-1 p-1 text-xs"><button type="button" className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setState(s=>withLegend(s,!s.indicators.length&&!s.panes[0].showVolume))}>Toggle study and volume</button><button type="button" className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setHeight(v=>v===236.7?180.4:236.7)}>Resize slot</button></div>
  <output aria-label={`Card ${index+1} geometry`} className="block break-words px-2 pb-2 font-mono text-xs">{JSON.stringify(geometry)}</output>
 </article>;
}
function Demo({theme='dark',width,dense=false,internal=false,workspace=false,mixed=false}:{theme?:TechnicalChartTheme;width?:number;dense?:boolean;internal?:boolean;workspace?:boolean;mixed?:boolean}){return <div className="min-h-screen bg-background p-2 text-foreground" style={{...technicalChartThemes[theme],width:width??'100%',maxWidth:'100%'}}><p className="mb-2 text-xs">Synthetic supplied line · external title menu · empty header collapses · real legends and workspace handles retain space</p><div className={dense?'grid grid-cols-3 gap-2':'max-w-[430px]'}>{Array.from({length:dense?3:1},(_,index)=><Card key={index} {...{theme,index,internal,workspace,mixed}}/>)}</div></div>;}
export const ExternalTitle:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Midnight:Story={render:()=> <Demo theme="midnight"/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const DenseThreeColumn:Story={render:()=> <Demo dense/>};
export const WithStudyAndVolume:Story={render:()=> <Demo mixed/>};
export const InternalTrigger:Story={render:()=> <Demo internal/>};
export const WorkspaceHandles:Story={render:()=> <Demo workspace/>};
