import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "aapaetsch-ui-kit";
import { TechnicalChartView, technicalChartThemes, type TechnicalChartTheme } from ".";
import type { MarketChartHandle } from "../market-chart";
import { createTechnicalChartViewState, type MarketTime, type OhlcBar } from "../../core";
import type { TechnicalEarningsEvent } from "./earnings";

export default {
  title:"Market Charts/Earnings timeline", component:TechnicalChartView,
  parameters:{layout:"fullscreen", controls:{disable:true}},
} satisfies Meta<typeof TechnicalChartView>;
type Story = StoryObj<typeof TechnicalChartView>;

// Explicit synthetic display calendar. Only the middle coordinates have price rows.
const times = Array.from({length:21}, (_,i) => Date.UTC(2026,9,1+i)/1000);
const bars: readonly OhlcBar[] = times.slice(2,16).map(time => ({time, open:100, high:103, low:98, close:101, volume:1000}));
const fixtureEvents: readonly TechnicalEarningsEvent[] = [
  {id:"first", time:times[0], barTime:times[0], label:"First edge report", session:"before-open", reportedEps:1.23},
  {id:"middle", time:times[10], barTime:times[10], label:"Middle report", reportedEps:1.25},
  {id:"upcoming", time:times[20], barTime:times[20], label:"Upcoming edge report", estimated:true, session:"after-close", estimatedEps:1.3},
  {id:"unanchored", time:times[20]+10*86400, label:"Unanchored future report", estimated:true},
];

function Demo({theme="dark", compact=false}:{theme?:TechnicalChartTheme; compact?:boolean}) {
  const api = React.useRef<MarketChartHandle>(null);
  const [calendar,setCalendar] = React.useState<readonly MarketTime[]>(times);
  const [events,setEvents] = React.useState(fixtureEvents);
  const [height,setHeight] = React.useState(compact?280:540);
  const [state,setState] = React.useState(() => {
    const s = createTechnicalChartViewState("price-only");
    s.panes = s.panes.slice(0,1).map(p => ({...p, showVolume:false, studyIds:[]}));
    s.indicators=[];s.profiles=[];s.drawings=[];
    s.viewport={visibleRange:{from:times[0],to:times[20]}};
    return s;
  });
  const range = (from:number,to:number) => api.current?.setVisibleRange({from:times[from],to:times[to]});
  React.useEffect(() => {
    const target = window as Window & {earningsTimeline?:unknown};
    const fixture = {api:() => api.current, calendar:() => calendar, events:() => events, bars:() => bars, state:() => state};
    target.earningsTimeline=fixture;
    return () => {if(target.earningsTimeline===fixture)delete target.earningsTimeline;};
  },[calendar,events,state]);
  const update = () => {
    const extended=[...times,times[20]+86400,times[20]+2*86400];
    setCalendar(extended);
    setEvents([...fixtureEvents.filter(e=>e.id!=="upcoming"), {...fixtureEvents[2],time:extended[22],barTime:extended[22],label:"Updated upcoming edge report"}]);
    setState(s=>({...s,viewport:{...s.viewport,logicalRange:undefined,visibleRange:{from:extended[0],to:extended[22]}}}));
  };
  return <div className="min-h-screen bg-background p-2 text-foreground" style={{...technicalChartThemes[theme],width:compact?360:"100%",maxWidth:"100%"}}>
    <p className="mb-2 text-xs text-muted-foreground">Synthetic earnings geometry · future calendar coordinate without a price candle</p>
    <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Earnings fixture controls">
      <Button size="xs" onClick={()=>api.current?.fitContent()}>Fit</Button>
      <Button size="xs" onClick={()=>api.current?.scrollToRealtime()}>Latest</Button>
      <Button size="xs" onClick={()=>range(0,12)}>Pan left</Button>
      <Button size="xs" onClick={()=>range(8,20)}>Pan right</Button>
      <Button size="xs" onClick={()=>range(5,15)}>Zoom middle</Button>
      <Button size="xs" onClick={()=>setHeight(h=>h===(compact?280:540)?220:(compact?280:540))}>Resize card</Button>
      <Button size="xs" onClick={update}>Update calendar + earnings</Button>
      <Button size="xs" onClick={()=>setEvents(e=>e.length?[]:fixtureEvents)}>Toggle earnings</Button>
    </div>
    <TechnicalChartView chartApiRef={api} symbol="SYNTHETIC" interval="1D" data={bars} earnings={events}
      timeAxis={{mode:"calendar",times:calendar}} state={state} onStateChange={setState}
      calculationMode="supplied" calculationIdentity="synthetic-earnings-timeline" dataIdentity="synthetic-earnings-timeline"
      theme={theme} appearance={{height,heightMode:"available",minimumPlotHeight:120,legends:"compact",suppliedStatus:"compact"}}
      features={{header:false,commands:false,drawingRail:false,footer:false}} />
  </div>;
}

export const Dark:Story={render:()=> <Demo/>};
export const Light:Story={render:()=> <Demo theme="light"/>};
export const CompactDark:Story={render:()=> <Demo compact/>};
export const CompactLight:Story={render:()=> <Demo compact theme="light"/>};
