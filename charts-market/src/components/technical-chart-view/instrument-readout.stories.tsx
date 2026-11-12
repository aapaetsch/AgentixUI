import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {TechnicalChartView,useTechnicalPaneMenu,technicalChartThemes,type TechnicalChartTheme} from '.';
import {createMarketChartEngine} from '../../engine';
import type {MarketChartEngine,MarketChartEngineFactory,TechnicalChartGeometry} from '../../core';
import type {MarketChartHandle} from '../market-chart';
import {instrumentBars,instrumentDefinitions,instrumentObservations,instrumentResults,instrumentState,instrumentTestLogo} from './instrument-readout-fixture';

export default {title:'Market Charts/Instrument Readout',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
interface DemoProps {theme?:TechnicalChartTheme;width?:number;long?:boolean;logo?:'supplied'|'missing'|'broken';interval?:string;exchange?:string;empty?:boolean;oscillator?:boolean;partial?:boolean;custom?:boolean;gap?:boolean;internal?:boolean;legacy?:'default'|'inline'|'volume-only'}
function Demo({theme='dark',width,long=false,logo='supplied',interval='1D',exchange='SYNTHETIC XNAS',empty=false,oscillator=false,partial=false,custom=false,gap=false,internal=false,legacy}:DemoProps){
  const [state,setState]=React.useState(()=>instrumentState(oscillator)),[logoMode,setLogoMode]=React.useState(logo),[period,setPeriod]=React.useState(interval),[variant,setVariant]=React.useState<'normal'|'partial'|'rejected'>(partial?'partial':'normal'),[height,setHeight]=React.useState(420),[selection,setSelection]=React.useState(0),[proof,setProof]=React.useState<unknown>(null);
  const bars=React.useMemo(()=>empty?[]:gap?instrumentBars.filter((_,index)=>index!==3):instrumentBars,[empty,gap]),observations=React.useMemo(()=>instrumentObservations(bars),[bars]),results=React.useMemo(()=>instrumentResults(state,bars,interval,variant),[state,bars,interval,variant]);
  const api=React.useRef<MarketChartHandle>(null),engine=React.useRef<MarketChartEngine|null>(null),geometry=React.useRef<TechnicalChartGeometry|null>(null),counts=React.useRef({engines:0,requests:0,state:0,geometry:0,financial:0}),menu=useTechnicalPaneMenu();
  const factory=React.useCallback<MarketChartEngineFactory>((host,options)=>{counts.current.engines++;return engine.current=createMarketChartEngine(host,options);},[]);
  const inspect=(index:number)=>api.current?.setCrosshairPosition(instrumentBars[index].time,instrumentBars[index].close);
  const style:React.CSSProperties={...technicalChartThemes[theme],...(custom?{'--background':'195 35% 11%','--foreground':'45 70% 95%','--muted-foreground':'45 25% 78%','--popover':'195 35% 11%','--popover-foreground':'45 70% 95%'}:{}),width:width??'100%',maxWidth:'100%'};
  return <section className="min-w-0 bg-background p-2 text-foreground" style={style} aria-label="Synthetic instrument fixture">
    <p className="mb-2 text-xs">Synthetic supplied instrument · original decimal text · no provider requests or financial formulas</p>
    <div className="mb-1 flex flex-wrap gap-1 text-xs" role="group" aria-label="Public host actions"><button {...menu.getTriggerProps('price')} className="min-h-11 px-2">Pane actions</button><button className="min-h-11 px-2" onClick={()=>setSelection(value=>value+1)}>Objects</button><button className="min-h-11 px-2" onClick={()=>setHeight(value=>value===420?620:420)}>Maximize</button><output aria-label="Host action count">{selection}</output></div>
    <TechnicalChartView chartApiRef={api} engineFactory={factory} symbol="SYNTHETIC" interval={interval} data={bars} dataIdentity="instrument-synthetic" calculationMode="supplied" calculationIdentity="instrument-synthetic" availableIndicators={instrumentDefinitions} suppliedResults={results} state={state} onStateChange={next=>{counts.current.state++;setState(next);}} onCalculationRequest={()=>{counts.current.requests++;}} onRequestFinancials={()=>{counts.current.financial++;}} onGeometryChange={next=>{counts.current.geometry++;geometry.current=next;}}
      instrumentReadout={legacy?undefined:{name:long?'Synthetic International Instrument Systems and Research Corporation with an intentionally long company name':'Synthetic Instruments',symbol:'SYNTHETIC',period,exchange,currency:'USD',logo:logoMode==='missing'?undefined:{src:logoMode==='broken'?'data:image/png;base64,aGVsbG8=':instrumentTestLogo},onSelect:()=>setSelection(value=>value+1),exactValues:{identity:'instrument-synthetic',source:bars,observations}}}
      paneMenuTrigger={internal?'internal':'none'} paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} theme={theme} style={custom?style:undefined}
      timeAxis={gap?{mode:'utc',domain:{from:instrumentBars[0].time,to:instrumentBars[7].time},intervalSeconds:600,futureDisplay:{convention:'utc-calendar',intervalSeconds:600,horizonMonths:1}}:undefined}
      priceReferences={[{id:'open',price:33,label:'Explicit synthetic session Open',showAxisLabel:true}]}
      earnings={[{id:'synthetic-earnings',time:instrumentBars[4].time,barTime:instrumentBars[4].time,label:'Synthetic supplied earnings',reportedEps:1.23}]}
      appearance={{height,heightMode:'available',minimumPlotHeight:120,legends:'compact',studyReadout:legacy==='inline'?'inline':legacy==='volume-only'?'volume-only':undefined,suppliedDetails:false,suppliedStatus:'compact',timeZone:'UTC'}}
      features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/>
    <div className="mt-1 flex flex-wrap gap-1 text-xs" role="group" aria-label="Fixture controls"><button className="min-h-11 px-2" onClick={()=>inspect(0)}>Inspect zero</button><button className="min-h-11 px-2" onClick={()=>inspect(1)}>Inspect missing volume</button><button className="min-h-11 px-2" onClick={()=>inspect(3)}>Inspect exact slot</button><button className="min-h-11 px-2" onClick={()=>api.current?.setCrosshairPosition(Number(instrumentBars[3].time)+300,30)}>Inspect gap</button><button className="min-h-11 px-2" onClick={()=>api.current?.setCrosshairPosition(Number(instrumentBars[7].time)+600,30)}>Inspect future</button><button className="min-h-11 px-2" onClick={()=>api.current?.clearCrosshairPosition()}>Clear inspection</button><button className="min-h-11 px-2" onClick={()=>setLogoMode(value=>value==='supplied'?'missing':value==='missing'?'broken':'supplied')}>Cycle logo</button><button className="min-h-11 px-2" onClick={()=>setPeriod(value=>value===interval?'Daily supplied label':interval)}>Display period label</button><button className="min-h-11 px-2" onClick={()=>setVariant(value=>value==='normal'?'partial':value==='partial'?'rejected':'normal')}>Cycle evidence</button><button className="min-h-11 px-2" onClick={()=>setHeight(value=>value===420?350:420)}>Resize slot</button><button className="min-h-11 px-2" onClick={()=>setProof({counts:counts.current,geometry:geometry.current,snapshot:engine.current?.getSnapshot(),state,observations,results})}>Capture verification</button></div>
    <details className="mt-2 text-xs"><summary>Fixture verification</summary><p>Public APIs only. The following snapshot is explicitly displayed for browser verification.</p><pre data-testid="instrument-verification" className="max-h-96 overflow-auto whitespace-pre-wrap break-all">{JSON.stringify(proof,null,2)}</pre></details>
  </section>;
}
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const CustomTheme:Story={render:()=> <Demo custom/>};
export const LongName:Story={render:()=> <Demo long/>};
export const MissingLogo:Story={render:()=> <Demo logo="missing"/>};
export const BrokenLogo:Story={render:()=> <Demo logo="broken"/>};
export const SameSymbolOtherExchange:Story={render:()=> <Demo exchange="SYNTHETIC XLON"/>};
export const Weekly:Story={render:()=> <Demo interval="1W"/>};
export const Monthly:Story={render:()=> <Demo interval="1M"/>};
export const Intraday:Story={render:()=> <Demo interval="15m"/>};
export const Empty:Story={render:()=> <Demo empty/>};
export const Partial:Story={render:()=> <Demo partial/>};
export const Oscillator:Story={render:()=> <Demo oscillator/>};
export const MissingAndFuture:Story={render:()=> <Demo gap/>};
export const Narrow390:Story={render:()=> <Demo width={390} long/>};
export const Narrow320:Story={render:()=> <Demo width={320} long/>};
export const FourTiles:Story={render:()=> <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-2">{[0,1,2,3].map(index=><Demo key={index} theme={index%2?'light':'dark'} long={index===1} logo={index===2?'missing':'supplied'} interval={['1D','1W','1M','15m'][index]} oscillator={index===3}/>)}</div>};
export const InternalPaneActions:Story={render:()=> <Demo internal/>};
export const DefaultRegression:Story={render:()=> <Demo legacy="default"/>};
export const BoardInlineRegression:Story={render:()=> <Demo legacy="inline"/>};
export const BoardVolumeOnlyRegression:Story={render:()=> <Demo legacy="volume-only"/>};
