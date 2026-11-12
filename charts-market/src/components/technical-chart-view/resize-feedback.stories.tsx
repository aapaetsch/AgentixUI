import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import type {TechnicalChartGeometry,TechnicalChartViewState} from '../../core';
import {TechnicalChartView,technicalChartThemes} from '.';
import {boardBars,boardCalendar,boardGaps,boardState} from './board-card-fixture';

export default {title:'Market Charts/Resize Feedback',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
function FixedSlot({width=430}:{width?:number}){
 const [slot,setSlot]=React.useState(236.7),[extra,setExtra]=React.useState(false),[render,setRender]=React.useState(0),[geometry,setGeometry]=React.useState<TechnicalChartGeometry>();
 const events=React.useRef<TechnicalChartGeometry[]>([]),count=React.useRef(0);
 const [state,setState]=React.useState<TechnicalChartViewState>(()=>({...boardState(),panes:boardState().panes.map(p=>({...p,size:.56,minimumSize:56}))}));
 React.useEffect(()=>{const target=window as Window&{resizeFeedbackFixture?:unknown};target.resizeFeedbackFixture={events:()=>events.current,count:()=>count.current};return()=>{delete target.resizeFeedbackFixture;};},[]);
 return <div style={{...technicalChartThemes.dark,width,maxWidth:'100%'}} className="min-h-screen bg-background p-2 text-foreground">
  <p className="mb-2 text-sm">Synthetic compact card · fixed fractional slot · geometry callback updates host state</p>
  <div className="mb-2 flex flex-wrap gap-2 text-xs">
   <button className="min-h-11 rounded border px-2" onClick={()=>setSlot(v=>v===236.7?180.4:236.7)}>Resize slot</button>
   <button className="min-h-11 rounded border px-2" onClick={()=>setExtra(v=>!v)}>Toggle status chrome</button>
   <button className="min-h-11 rounded border px-2" onClick={()=>setRender(v=>v+1)}>Fresh parent props {render}</button>
  </div>
  <div style={{height:slot}} className="border border-border">
   <TechnicalChartView symbol="BB" interval="1D" data={boardBars} state={state} onStateChange={setState}
    calculationMode="supplied" calculationIdentity="resize-feedback" dataIdentity="resize-feedback"
    interactions={{mode:'workspace',contextKey:'resize-feedback'}} timeAxis={{mode:'calendar',times:boardCalendar}} discontinuities={boardGaps}
    onGeometryChange={next=>{count.current++;events.current=[...events.current.slice(-99),next];setGeometry(next);}}
    appearance={{height:slot,heightMode:'available',minimumPlotHeight:120,suppliedStatus:'compact',legends:'compact',timeline:{scaleControls:'icons'},crosshair:{lineMarker:{visible:true}}}}
    features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}
    dataAvailability={extra?{status:'Cached',description:'Synthetic status adds real composite chrome'}:undefined}/>
  </div>
  <output aria-label="Geometry diagnostics" className="mt-2 block break-words font-mono text-xs">{JSON.stringify({callbacks:count.current,slot,...geometry})}</output>
 </div>;
}
export const CompactFractionalSlot:Story={render:()=> <FixedSlot/>};
export const Narrow320:Story={render:()=> <FixedSlot width={320}/>};
