import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {TechnicalChartView,type TechnicalChartTheme} from '.';
import {createTechnicalChartViewState,type TechnicalChartGeometry} from '../../core';
import type {MarketChartHandle} from '../market-chart';
export default {title:'Market Charts/Card fit',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
const bars=Array.from({length:32},(_,i)=>({time:1790985600+i*86400,open:217.45,high:217.45,low:216.98,close:217.23,volume:1000,incomplete:i===31}));
function Card({theme='dark',width,height=300,compact=false,long=false}:{theme?:TechnicalChartTheme;width?:number;height?:number;compact?:boolean;long?:boolean}){
 const[state,setState]=React.useState(()=>createTechnicalChartViewState('price-only')),data=React.useMemo(()=>long?bars.map(b=>({...b,open:217.451234567891,high:218.451234567891,low:216.981234567891,close:217.231234567891})):bars,[long]);
 const ref=React.useRef<MarketChartHandle>(null),geometry=React.useRef<TechnicalChartGeometry|null>(null);
 return <div data-card-fit className="min-w-0 p-2" style={{width:width??'100%',maxWidth:'100%'}}>
  <TechnicalChartView chartApiRef={ref} symbol="MOCK" interval="1D" data={data} state={state} onStateChange={setState} calculationMode="supplied" calculationIdentity="card-fit-synthetic" theme={theme} dataAvailability={{status:'synthetic',description:'Deterministic mock values, no acquired data'}} onGeometryChange={value=>{geometry.current=value;}} appearance={{height,heightMode:'available',minimumPlotHeight:120,suppliedStatus:'compact',legends:compact?'compact':'expanded'}} features={{header:false,commands:false,drawingRail:false,footer:false}}/>
  <span className="sr-only">Synthetic card-fit fixture</span>
 </div>;
}
export const WideLight:Story={render:()=> <Card theme="light"/>};
export const WideDark:Story={render:()=> <Card theme="dark"/>};
export const WideMidnight:Story={render:()=> <Card theme="midnight"/>};
export const Narrow320:Story={render:()=> <Card width={320}/>};
export const Narrow390:Story={render:()=> <Card width={390}/>};
export const ExactLongValues:Story={render:()=> <Card width={320} long/>};
export const CompactLongValues:Story={render:()=> <Card width={320} compact long/>};
export const DenseBoards:Story={render:()=> <div className="grid grid-cols-4">{(['light','dark','midnight','dark'] as const).map((theme,index)=><Card key={index} theme={theme} height={260}/>)}</div>};
export const ShortCard:Story={render:()=> <Card width={320} height={180}/>};
