import * as React from 'react';import type {Meta,StoryObj} from '@storybook/react';
import {TechnicalChartView,type TechnicalChartTheme} from '.';import type {MarketChartHandle}from'../market-chart';
import type{MarketChartInteractions,MarketChartInteractionState,MarketChartChangeMetadata,MarketViewportCommand,TechnicalChartGeometry}from'../../core';
import{interactionBars,interactionDefinitions,interactionFixtureState,interactionFixtureResults}from'./interaction-fixtures';
const meta={title:'Market Charts/Workspace Interactions',component:TechnicalChartView,args:{symbol:'SYNTHETIC',interval:'5m',data:interactionBars,state:interactionFixtureState(),onStateChange:()=>{}},parameters:{layout:'fullscreen'}} satisfies Meta<typeof TechnicalChartView>;export default meta;type Story=StoryObj<typeof meta>;
function Chart({owner,theme,compact=false,hiddenAllocation=false,customTheme=false}:{owner:MarketChartInteractions['scrollOwner'];theme:TechnicalChartTheme;compact?:boolean;hiddenAllocation?:boolean;customTheme?:boolean}){
 const[geometry,setGeometry]=React.useState<TechnicalChartGeometry|undefined>(),[pendingRestore,setPendingRestore]=React.useState<number|null>(null);
 const scrollOwner=React.useMemo(()=>owner?{...owner,restoreScrollTop:(top:number)=>setPendingRestore(top)}:undefined,[owner]);
 React.useLayoutEffect(()=>{if(pendingRestore!=null&&geometry?.intrinsicHeight){owner?.scrollTo(pendingRestore);setPendingRestore(null);}},[pendingRestore,geometry,owner]);
 const[state,setState]=React.useState(interactionFixtureState),latest=React.useRef(state);latest.current=state;
 const[interaction,setInteraction]=React.useState<MarketChartInteractionState>({paneScales:{'rsi-duplicate':{mode:'normal',autoScale:false,manualRange:{minimum:-60,maximum:160}}}});
 const[revision,setRevision]=React.useState(1),[snapshot,setSnapshot]=React.useState(''),[events,setEvents]=React.useState<MarketChartChangeMetadata[]>([]),[viewportCommand,setCommand]=React.useState<MarketViewportCommand|undefined>();
 const api=React.useRef<MarketChartHandle>(null),timer=React.useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const interactions=React.useMemo<MarketChartInteractions>(()=>({mode:'workspace',scrollOwner,rightPaddingBars:10}),[scrollOwner]);
 const bars=React.useMemo(()=>interactionBars.map((b,i)=>i===2999?{...b,close:revision%2?101:102}:b),[revision]);
 const results=React.useMemo(()=>interactionFixtureResults(state,revision,bars),[state.indicators,state.profiles,state.drawings,revision,bars]);
 React.useEffect(()=>()=>clearTimeout(timer.current),[]);
 return <div className="min-w-0 space-y-2">
  <div className="flex flex-wrap gap-2 p-2 text-xs"><strong>Static synthetic supplied data · 3,000 bars · no providers</strong><button className="border p-2" onClick={()=>setRevision(n=>n+1)}>Revise accepted current bar</button><button className="border p-2" onClick={()=>setSnapshot(JSON.stringify(api.current?.getSnapshot()))}>Read interaction snapshot</button><button className="border p-2" onClick={()=>setCommand({id:Date.now(),viewport:{visibleRange:{from:interactionBars[1200].time,to:interactionBars[1350].time}}})}>External date selection</button><button className="border p-2" onClick={()=>setState(s=>({...s,panes:s.panes.filter(p=>p.id!==interaction.maximizedPaneId)}))}>Remove focused pane</button></div>
  <div data-public-intrinsic-allocation={hiddenAllocation||undefined} style={{height:hiddenAllocation?(geometry?.intrinsicHeight??680):undefined,overflow:hiddenAllocation?'hidden':undefined}}><div style={hiddenAllocation?{height:'100%',overflow:'hidden'}:undefined}>
  <TechnicalChartView style={{...(hiddenAllocation?{height:'100%'}:{}),...(customTheme?{'--background':'232 30% 10%','--foreground':'45 40% 94%','--primary':'180 65% 58%','--positive':'150 65% 55%','--negative':'350 75% 65%'}:{})} as React.CSSProperties} onGeometryChange={setGeometry} symbol="SYNTHETIC" interval="5m" chartApiRef={api} data={bars} dataIdentity="synthetic-interactions-bars" dataRevision={{identity:'synthetic-interactions-bars',revision}} calculationMode="supplied" calculationIdentity="synthetic-interactions" suppliedResults={results} availableIndicators={interactionDefinitions} state={state} onStateChange={(next,metadata)=>{setEvents(e=>[...e.slice(-9),metadata as MarketChartChangeMetadata]);if(metadata.type==='viewport'){clearTimeout(timer.current);timer.current=setTimeout(()=>setState(s=>({...s,viewport:next.viewport})),300);}else setState(next);}} interactions={interactions} interactionState={interaction} onInteractionStateChange={(next,metadata)=>{setInteraction(next);setEvents(e=>[...e.slice(-9),metadata]);}} viewportCommand={viewportCommand} theme={theme} appearance={{height:compact?460:680,heightMode:'available',minimumPlotHeight:280,legends:'compact',suppliedStatus:'compact',navigation:'integrated',badges:{endpointValues:'all-visible',style:'outline'},candles:{widthMode:'adaptive',gap:2},volume:{widthMode:'adaptive',gap:2}}} features={{header:false,commands:false,drawingRail:true,dataTable:false}} rangeShortcuts={[]}/>
  </div></div>
  <output aria-label="Interaction public geometry" className="block break-all p-2 text-xs">{JSON.stringify(geometry)}</output>
  <output aria-label="Interaction public snapshot" className="block break-all p-2 text-xs">{snapshot}</output><output aria-label="Interaction origins" className="block break-all p-2 text-xs">{JSON.stringify(events)}</output>
 </div>;
}
function Workspace({count=1,width,theme='dark',hiddenAllocation=false,customTheme=false}:{count?:number;width?:number;theme?:TechnicalChartTheme;hiddenAllocation?:boolean;customTheme?:boolean}){
 const scroller=React.useRef<HTMLDivElement>(null),[top,setTop]=React.useState(0);const owner=React.useMemo(()=>({getScrollTop:()=>scroller.current?.scrollTop??0,scrollTo:(value:number)=>{if(scroller.current)scroller.current.scrollTop=value;}}),[]);
 return <div style={{width:width??'100%',maxWidth:'100%'}} className="flex h-screen min-h-0 flex-col bg-background text-foreground"><p className="shrink-0 px-3 py-2 text-sm">Vertical plot touch scrolls this one workspace; gutter always scrolls. Horizontal drag pans. Value axes scale their pane. Header space double-click maximizes; Restore is keyboard reachable.</p><output className="shrink-0" aria-label="Workspace scroll position">{top}</output><div ref={scroller} aria-label="Synthetic chart workspace" className="min-h-0 flex-1 overflow-y-auto pr-6" onScroll={()=>setTop(scroller.current?.scrollTop??0)}><div className={count>1?'grid grid-cols-2 gap-3':'grid grid-cols-1'}>{Array.from({length:count},(_,i)=><Chart key={i} owner={owner} theme={theme} compact={count>1} hiddenAllocation={hiddenAllocation} customTheme={customTheme}/>)}</div></div></div>;
}
export const Single:Story={render:()=> <Workspace/>};
export const Light:Story={render:()=> <Workspace theme="light"/>};
export const Narrow390:Story={render:()=> <Workspace width={390}/>};
export const Narrow320:Story={render:()=> <Workspace width={320}/>};
export const TwoCharts:Story={render:()=> <Workspace count={2}/>};
export const FourCharts:Story={render:()=> <Workspace count={4}/>};

export const HiddenInnerWrappers:Story={render:()=> <Workspace hiddenAllocation/>};

export const CustomTheme:Story={render:()=> <Workspace customTheme/>};
