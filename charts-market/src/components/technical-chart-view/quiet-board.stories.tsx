import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {TechnicalChartView,useTechnicalPaneMenu,technicalChartThemes} from '.';
import {createMarketChartEngine} from '../../engine';
import type {IndicatorRenderSeries,MarketChartEngine,MarketChartEngineFactory,MarketTime,TechnicalChartGeometry} from '../../core';
import type {MarketChartHandle} from '../market-chart';
import {inlineDefinitions} from './inline-readout-fixture';
import {sharedAverages,sharedAverageBars,sharedAveragePalette,sharedAverageResults,sharedAverageState,type SharedAverageTheme,type SharedEvidenceCase,type SharedVolumeCase} from './shared-average-legend-fixture';

export default {title:'Market Charts/Quiet Board',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
type QuietEvidenceCase=SharedEvidenceCase|'loading'|'unavailable'|'stale';
interface DemoProps {theme?:SharedAverageTheme;width?:number;dense?:boolean;expanded?:boolean;empty?:boolean;legacy?:boolean;volume?:boolean;initialEvidence?:QuietEvidenceCase}
interface CardProps extends DemoProps {selected:readonly string[];volume:boolean;volumeCase:SharedVolumeCase;evidenceCase:QuietEvidenceCase;index:number}
function Card({theme='dark',selected,volume,volumeCase,evidenceCase,expanded=false,legacy=false,index}:CardProps) {
  const [wide,setWide]=React.useState(expanded),[evidence,setEvidence]=React.useState(false),[allocation,setAllocation]=React.useState(240);
  const [state,setState]=React.useState(()=>sharedAverageState(theme,selected,volume));
  React.useEffect(()=>setState(previous=>({...sharedAverageState(theme,selected,volume),viewport:previous.viewport})),[theme,selected,volume]);
  const bars=React.useMemo(()=>sharedAverageBars(volumeCase),[volumeCase]),results=React.useMemo(()=>{
    const base=sharedAverageResults(state,evidenceCase==='loading'||evidenceCase==='unavailable'||evidenceCase==='stale'?'normal':evidenceCase);
    if(evidenceCase==='stale')return Object.fromEntries(Object.entries(base).map(([id,result])=>[id,result?{...result,stale:true,warning:'Synthetic refresh failed; retained exact source evidence'}:result]));
    if(evidenceCase==='loading'||evidenceCase==='unavailable')return Object.fromEntries(Object.entries(base).map(([id,result])=>[id,result?{...result,status:evidenceCase,warning:evidenceCase==='unavailable'?'Synthetic producer unavailable':undefined}:result]));
    return base;
  },[state,evidenceCase]);
  const menu=useTechnicalPaneMenu(),slot=React.useRef<HTMLDivElement>(null),api=React.useRef<MarketChartHandle>(null),engine=React.useRef<MarketChartEngine|null>(null),geometry=React.useRef<TechnicalChartGeometry|null>(null),series=React.useRef<IndicatorRenderSeries[]>([]);
  const counts=React.useRef({states:0,requests:0,financial:0,engines:0,geometries:0,resizes:0,presentations:0,series:0});
  React.useLayoutEffect(()=>{const element=slot.current;if(!element)return;const measure=()=>{const next=Math.max(1,Math.floor(element.getBoundingClientRect().height));setAllocation(previous=>previous===next?previous:next);};measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect();},[]);
  const factory=React.useCallback<MarketChartEngineFactory>((host,options)=>{
    const value=createMarketChartEngine(host,options);engine.current=value;counts.current.engines++;
    const set=value.setIndicatorSeries.bind(value),resize=value.resize.bind(value),present=value.setPresentation?.bind(value);
    value.setIndicatorSeries=next=>{series.current=next;counts.current.series++;set(next);};
    value.resize=(width,height)=>{counts.current.resizes++;resize(width,height);};
    if(present)value.setPresentation=next=>{counts.current.presentations++;present(next);};
    return value;
  },[]);
  React.useEffect(()=>{if(index!==0)return;const target=window as Window&{quietBoardFixture?:unknown};
    const fixture={api:()=>api.current,coordinate:(time:MarketTime,price:number)=>engine.current?.coordinateFor({time,price}),proof:()=>({counts:{...counts.current},allocation,mode:legacy?'default':wide?'inline':'volume-only',geometry:geometry.current,series:series.current.map(item=>({id:item.id,color:item.color,points:item.points})),snapshot:engine.current?.getSnapshot(),state,results,bars,selected:[...selected],palette:sharedAveragePalette[theme]})};
    target.quietBoardFixture=fixture;return()=>{if(target.quietBoardFixture===fixture)delete target.quietBoardFixture;};
  },[index,state,results,bars,selected,theme,wide,legacy,allocation]);
  return <div className="min-w-0">
    <article aria-label={`Shared-key Board card ${index+1}`} className="flex h-[330px] min-w-0 flex-col rounded border border-border min-[640px]:h-[310px]" style={wide?{height:560}:undefined}>
      <div className="flex min-h-11 shrink-0 items-center gap-2 px-2"><button {...menu.getTriggerProps('price')} className="min-h-11 min-w-0 flex-1 text-left text-sm focus-visible:ring-2 focus-visible:ring-ring">SYNTHETIC ▾</button><button className="min-h-11 px-2 text-xs focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setWide(value=>!value)}>{wide?'Compact':'Expand'}</button></div>
      <div ref={slot} className="min-h-0 min-w-0 flex-1">
        <TechnicalChartView symbol="SYNTHETIC" interval="5m" chartApiRef={api} engineFactory={factory} data={bars} state={state} onStateChange={next=>{counts.current.states++;setState(next);}}
          calculationMode="supplied" calculationIdentity="board-inline" suppliedResults={results} availableIndicators={inlineDefinitions} onCalculationRequest={()=>{counts.current.requests++;}} onRequestFinancials={()=>{counts.current.financial++;}} onGeometryChange={next=>{counts.current.geometries++;geometry.current=next;}}
          paneMenuTrigger="none" paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} theme={theme}
          priceReferences={bars.length?[{id:'open',price:33,label:'Regular 09:30 ET open · explicit synthetic observation',showAxisLabel:true,showPlotLabel:wide||legacy,axisLabel:wide||legacy?undefined:'Open',lineStyle:'dotted',color:'hsl(var(--muted-foreground))'}]:[]}
          earnings={bars[4]?[{id:'supplied-earnings',time:bars[4].time,barTime:bars[4].time,label:'Supplied synthetic earnings',reportedEps:1.2345}]:[]}
          onRequestSuppliedDetails={()=>setEvidence(true)}
          appearance={{height:allocation,heightMode:'available',minimumPlotHeight:120,legends:wide?'expanded':'compact',studyReadout:legacy?undefined:wide?'inline':'volume-only',suppliedDetails:false,suppliedStatus:wide||legacy?'compact':'host',timeZone:'America/New_York',timeline:{scaleControls:'icons'},crosshair:{lineMarker:{visible:true}},badges:{movingAverages:'all-visible'}}}
          features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/>
      </div>
    </article>
    {wide||evidence?<section aria-label={`Host complete supplied evidence ${index+1}`} className="max-h-80 overflow-auto p-2 text-xs"><p>Exact original producer evidence; display chrome does not alter these supplied values.</p><pre className="whitespace-pre-wrap break-all">{JSON.stringify({bars,results},null,2)}</pre></section>:null}
  </div>;
}
function Demo({theme='dark',width,dense=false,empty=false,volume:initialVolume=true,initialEvidence='normal',...props}:DemoProps) {
  const [selected,setSelected]=React.useState(()=>sharedAverages.map(study=>study.id)),[volume,setVolume]=React.useState(initialVolume),[volumeCase,setVolumeCase]=React.useState<SharedVolumeCase>(empty?'empty':'normal'),[evidenceCase,setEvidenceCase]=React.useState<QuietEvidenceCase>(initialEvidence),[legacy,setLegacy]=React.useState(!!props.legacy);
  return <main className="min-h-screen bg-background p-2 text-foreground" style={technicalChartThemes[theme]}>
    <div className="mx-auto min-w-0" style={{width:width??'100%',maxWidth:'100%'}}>
      <p className="mb-2 text-xs">Static synthetic observations · compact cards 310px desktop / 330px narrow · no financial calculations</p>
      <fieldset aria-label="Moving averages" className="mb-2 flex min-w-0 flex-wrap gap-x-3"><legend className="sr-only">Moving averages</legend>{sharedAverages.map(study=><label key={study.id} className="flex min-h-11 items-center gap-1 text-xs"><input type="checkbox" checked={selected.includes(study.id)} onChange={event=>setSelected(previous=>event.target.checked?[...previous,study.id]:previous.filter(id=>id!==study.id))}/><span aria-hidden="true" className="inline-block h-[3px] w-[18px] shrink-0 rounded" style={{background:sharedAveragePalette[theme][study.period]}}/>{study.label}</label>)}</fieldset>
      <div className={dense?'grid min-w-0 grid-cols-1 gap-2 min-[1100px]:grid-cols-3':'min-w-0 max-w-[430px]'}>{Array.from({length:dense?3:1},(_,index)=><Card key={index} {...props} theme={theme} selected={selected} volume={volume} volumeCase={volumeCase} evidenceCase={evidenceCase} legacy={legacy} index={index}/>)}</div>
      <fieldset aria-label="Synthetic fixture controls" className="mt-2 flex min-w-0 flex-wrap items-center gap-2 border-t border-border text-xs"><legend>Local fixture controls</legend>
        <button className="min-h-11 px-1" onClick={()=>setSelected([])}>No averages</button><button className="min-h-11 px-1" onClick={()=>setSelected([sharedAverages[0].id])}>One average</button><button className="min-h-11 px-1" onClick={()=>setSelected(sharedAverages.map(study=>study.id))}>All averages</button><button className="min-h-11 px-1" onClick={()=>setSelected(previous=>[...previous].reverse())}>Reverse selection order</button>
        <label className="flex min-h-11 items-center gap-1"><input type="checkbox" checked={volume} onChange={event=>setVolume(event.target.checked)}/>Volume</label>
        <label>Volume source <select className="min-h-11 bg-background" value={volumeCase} onChange={event=>setVolumeCase(event.target.value as SharedVolumeCase)}>{(['normal','missing','zero','empty'] as const).map(value=><option key={value}>{value}</option>)}</select></label>
        <label>Supplied evidence <select className="min-h-11 bg-background" value={evidenceCase} onChange={event=>setEvidenceCase(event.target.value as QuietEvidenceCase)}>{(['normal','sparse','warmup','partial','rejected','loading','unavailable','stale'] as const).map(value=><option key={value}>{value}</option>)}</select></label>
        <button className="min-h-11 px-1" onClick={()=>setLegacy(value=>!value)}>Toggle default legends</button>
      </fieldset>
    </div>
  </main>;
}
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const Narrow390:Story={render:()=> <Demo width={390}/>};
export const Narrow430:Story={render:()=> <Demo width={430}/>};
export const Dense:Story={render:()=> <Demo dense/>};
export const Expanded:Story={render:()=> <Demo expanded/>};
export const NoBars:Story={render:()=> <Demo empty/>};
export const NoVolume:Story={render:()=> <Demo volume={false}/>};
export const Sparse:Story={render:()=> <Demo initialEvidence="sparse"/>};
export const Warmup:Story={render:()=> <Demo initialEvidence="warmup"/>};
export const Partial:Story={render:()=> <Demo initialEvidence="partial"/>};
export const Rejected:Story={render:()=> <Demo initialEvidence="rejected"/>};
export const DefaultLegends:Story={render:()=> <Demo legacy/>};
