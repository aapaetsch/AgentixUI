import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {TechnicalChartView,useTechnicalPaneMenu,technicalChartThemes,type TechnicalChartTheme} from '.';
import {boardBars,boardCalendar,boardGaps,boardState} from './board-card-fixture';
import {createMarketChartEngine} from '../../engine';
import type {MarketChartEngine,MarketChartEngineFactory,MarketPriceReference,TechnicalChartViewState} from '../../core';
import type {MarketChartHandle} from '../market-chart';

export default {title:'Market Charts/Price References',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
interface DemoProps {theme?:TechnicalChartTheme;width?:number;axisIcons?:boolean;left?:boolean;log?:boolean;dense?:boolean;register?:boolean}
function CardDemo({theme='dark',width,axisIcons=true,left=false,log=false,dense=false,register=true}:DemoProps){
 const [state,setState]=React.useState<TechnicalChartViewState>(()=>{const value=boardState();value.panes[0]={...value.panes[0],scaleSide:left?'left':'right',minimumSize:56,size:.56};value.scale={mode:log?'logarithmic':'normal',autoScale:true};return value;});
 const [present,setPresent]=React.useState(true),[price,setPrice]=React.useState(25),[height,setHeight]=React.useState(236.7);
 const menu=useTechnicalPaneMenu(),api=React.useRef<MarketChartHandle>(null),engineApi=React.useRef<MarketChartEngine|null>(null),proof=React.useRef({requests:0,financial:0,states:0});
 const probePrice=React.useRef(price);probePrice.current=price;
 const factory=React.useCallback<MarketChartEngineFactory>((host,options)=>{const engine=createMarketChartEngine(host,options);engineApi.current=engine;return engine;},[]);
 const references:MarketPriceReference[]=present?[{id:'regular-open',price,label:'Regular 09:30 ET open · synthetic supplied session',lineStyle:'dotted',color:'hsl(var(--muted-foreground))',showAxisLabel:true}]:[];
 React.useEffect(()=>{if(!register)return;const target=window as Window&{priceReferenceFixture?:unknown};target.priceReferenceFixture={api:()=>api.current,proof:()=>{const engine=engineApi.current,snapshot=engine?.getSnapshot();return {...proof.current,referenceY:engine?.coordinateFor({time:boardBars[0].time,price:probePrice.current})?.y??null,plot:snapshot?.panes.find(p=>p.id==='price'),axis:snapshot?.priceAxis};}};return()=>{delete target.priceReferenceFixture;};},[register]);
 return <div className="min-h-screen bg-background p-2 text-foreground" style={{...technicalChartThemes[theme],width:width??'100%',maxWidth:'100%'}}>
  <p className="mb-2 text-xs">Synthetic supplied reference · consumer selects exact open evidence · no financial/session inference</p>
  <div className={dense?'grid grid-cols-3 gap-2':'max-w-[430px]'}>{Array.from({length:dense?3:1},(_,index)=><article key={index} aria-label={`Reference card ${index+1}`} className="min-w-0 rounded border border-border">
   <button {...menu.getTriggerProps('price')} className="min-h-11 w-full rounded px-2 text-left text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">BB · Supplied reference ▾</button>
   <TechnicalChartView symbol="BB" interval="1D" data={boardBars} state={state} onStateChange={next=>{proof.current.states++;setState(next);}} chartApiRef={index===0?api:undefined} engineFactory={factory}
    calculationMode="supplied" calculationIdentity="supplied-reference" onCalculationRequest={()=>{proof.current.requests++;}} onRequestFinancials={()=>{proof.current.financial++;}}
    priceReferences={references} paneMenuTrigger="none" paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} theme={theme}
    timeAxis={{mode:'calendar',times:boardCalendar}} discontinuities={boardGaps}
    appearance={{height,heightMode:'available',minimumPlotHeight:120,suppliedDetails:false,...(axisIcons?{timeline:{scaleControls:'icons' as const}}:{}),crosshair:{lineMarker:{visible:true}}}}
    features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/>
  </article>)}</div>
  <div className="flex flex-wrap gap-2 text-xs">
   <button className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setPresent(value=>!value)}>Toggle supplied reference</button>
   <button className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setPrice(value=>value===25?35:25)}>Revise supplied price</button>
   <button className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setPrice(NaN)}>Missing evidence</button>
   <button className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setHeight(value=>value===236.7?180.4:236.7)}>Resize slot</button>
   <button className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setState(value=>({...value,scale:value.scale.autoScale?{mode:value.scale.mode,autoScale:false,manualRange:{minimum:value.scale.mode==='logarithmic'?Math.log(30):30,maximum:value.scale.mode==='logarithmic'?Math.log(40):40}}:{mode:value.scale.mode,autoScale:true}}))}>Toggle manual price range</button>
  </div>
 </div>;
}
function Demo(props:DemoProps){return props.dense?<div className="grid grid-cols-3 gap-2">{[0,1,2].map(index=><CardDemo key={index} {...props} dense={false} register={index===0}/>)}</div>:<CardDemo {...props}/>;}
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Midnight:Story={render:()=> <Demo theme="midnight"/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const Axis72Left:Story={render:()=> <Demo axisIcons={false} left/>};
export const Logarithmic:Story={render:()=> <Demo log/>};
export const DenseThreeColumn:Story={render:()=> <Demo dense/>};
