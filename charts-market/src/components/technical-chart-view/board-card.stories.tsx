import * as React from 'react';
import type {Meta,StoryObj} from '@storybook/react';
import {TechnicalChartView,useTechnicalPaneMenu,technicalChartThemes,type TechnicalChartTheme} from '.';
import type {MarketChartHandle} from '../market-chart';
import {boardBars,boardCalendar,boardGaps,boardState} from './board-card-fixture';

export default {title:'Market Charts/Board Card',component:TechnicalChartView,parameters:{layout:'fullscreen',controls:{disable:true}}} satisfies Meta<typeof TechnicalChartView>;
type Story=StoryObj<typeof TechnicalChartView>;
function Card({theme='dark',expanded=false,internal=false,index=0,empty=false,noDetails=false}:{theme?:TechnicalChartTheme;expanded?:boolean;internal?:boolean;index?:number;empty?:boolean;noDetails?:boolean}){
 const [state,setState]=React.useState(boardState),[revision,setRevision]=React.useState(0),[wide,setWide]=React.useState(expanded),[allowLog,setAllowLog]=React.useState(false);
 const menu=useTechnicalPaneMenu(),api=React.useRef<MarketChartHandle>(null),title=React.useRef<HTMLButtonElement>(null),down=React.useRef<{x:number;y:number;dragged:boolean}|undefined>(undefined);
 const data=React.useMemo(()=>empty?[]:boardBars.map((b,i)=>revision&&i===2?{...b,close:37}:b),[empty,revision]);
 // Host-owned article/title adapter: chart surface owns its clicks and gestures.
 const open=()=>title.current?.click();
 React.useEffect(()=>{const w=window as Window&{boardCardFixture?:unknown};if(index===0){w.boardCardFixture={api:()=>api.current,bars:()=>data};return()=>{delete w.boardCardFixture;};}},[data,index]);
 return <article aria-label={`Synthetic BB card ${index+1}`} className="min-w-0 rounded-md border border-border bg-background text-foreground" style={technicalChartThemes[theme]}
  onPointerDown={e=>{down.current={x:e.clientX,y:e.clientY,dragged:false};}} onPointerMove={e=>{if(down.current&&Math.hypot(e.clientX-down.current.x,e.clientY-down.current.y)>5)down.current.dragged=true;}}
  onClick={e=>{if(e.target!==e.currentTarget||down.current?.dragged||window.getSelection()?.toString())return;open();}}
  onPointerCancel={()=>{down.current={x:0,y:0,dragged:true};}}>
  <div className="flex min-h-11 items-center gap-2 px-2">
   <button ref={title} {...menu.getTriggerProps('price')} className="min-h-11 min-w-0 flex-1 truncate rounded px-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">BB · Synthetic company {index+1}</button>
   <button type="button" aria-label="Expand card" onClick={()=>setWide(v=>!v)} className="size-11 shrink-0 rounded focus-visible:ring-2 focus-visible:ring-ring">↗</button>
  </div>
  <div onClick={e=>e.stopPropagation()}>
   <TechnicalChartView symbol="BB" interval="5m" chartApiRef={api} data={data} state={state} onStateChange={setState} calculationMode="supplied" calculationIdentity={`synthetic-board-${index}`} dataIdentity={`synthetic-board-${index}`} dataRevision={{identity:`synthetic-board-${index}`,revision}}
    {...(!internal?{paneMenu:menu.paneMenu,onPaneMenuChange:menu.onPaneMenuChange,paneMenuTrigger:'none' as const}:{})} allowLogScale={allowLog}
    theme={theme} interactions={{mode:'workspace',contextKey:`synthetic-board-${index}`}} timeAxis={{mode:'calendar',times:boardCalendar}} discontinuities={boardGaps}
    dataAvailability={noDetails?{status:'Cached',description:'Synthetic retained cache'}:undefined}
    appearance={{height:wide?540:280,heightMode:'available',minimumPlotHeight:100,legends:'compact',suppliedStatus:'compact',suppliedDetails:!noDetails,timeZone:'America/New_York',timeline:{scaleControls:'icons'},crosshair:{labels:false,lineMarker:{visible:true,radius:4}},grid:{opacity:.35}}}
    features={{header:false,commands:false,drawingRail:false,dataTable:false,footer:false}} rangeShortcuts={[]}/>
  </div>
  <div className="flex flex-wrap gap-2 p-2 text-xs"><button type="button" className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>setRevision(r=>r+1)}>Replace revision</button><button type="button" className="min-h-11 rounded px-2 focus-visible:ring-2 focus-visible:ring-ring" aria-pressed={allowLog} onClick={()=>setAllowLog(v=>!v)}>Allow Log</button></div>
 </article>;
}
function Demo({width,theme='dark',expanded=false,internal=false,dense=false,empty=false}:{width?:number;theme?:TechnicalChartTheme;expanded?:boolean;internal?:boolean;dense?:boolean;empty?:boolean}){return <div className="min-h-screen bg-background p-2 text-foreground" style={{...technicalChartThemes[theme],width:width??'100%',maxWidth:'100%'}}><p className="mb-2 text-xs">Synthetic supplied samples · connected gaps inside sessions · explicit weekend break · title opens the shared menu · plot drag stays in the chart</p><div className={dense?'grid grid-cols-3 gap-2':'min-w-0'}>{Array.from({length:dense?3:1},(_,index)=><Card key={index} {...{index,theme,expanded,internal,empty}}/>)}</div></div>;}
export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const Midnight:Story={render:()=> <Demo theme="midnight"/>};
export const Narrow320:Story={render:()=> <Demo width={320}/>};
export const Narrow390:Story={render:()=> <Demo width={390}/>};
export const Narrow430:Story={render:()=> <Demo width={430}/>};
export const DenseThreeColumn:Story={render:()=> <Demo dense/>};
export const Expanded:Story={render:()=> <Demo expanded/>};
export const LegacyInternalTrigger:Story={render:()=> <Demo internal expanded/>};
export const Empty:Story={render:()=> <Demo empty/>};
export const StatusWithoutDetails:Story={render:()=> <div className="max-w-[430px] p-2"><Card noDetails/></div>};
