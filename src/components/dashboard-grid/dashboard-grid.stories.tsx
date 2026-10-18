import * as React from "react";
import type {Meta,StoryObj} from "@storybook/react";
import {DashboardGrid,type DashboardGridHandle,type DashboardGridItem} from ".";
import {Button} from "../button";
import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription} from "../dialog";
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem} from "../dropdown-menu";

export default {title:"Layout/DashboardGrid",component:DashboardGrid,parameters:{layout:"fullscreen",controls:{disable:true}}} satisfies Meta<typeof DashboardGrid>;
type Story=StoryObj<typeof DashboardGrid>;
interface Metrics {mounts:Record<string,number>;unmounts:Record<string,number>;renders:Record<string,number>;renderItem:Record<string,number>;dataCallbacks:number;changes:number;announcements:string[];chartPointers:number;chartWheels:number;profiler:number[]}
declare global {interface Window {dashboardGridMetrics:Metrics}}
const names=["Activity","Queue","Notes","Health","Distribution","Timeline","Loading snapshot","Unavailable snapshot"];
const makeItems=(count:number,mixed=false):DashboardGridItem[]=>Array.from({length:count},(_,i)=>({id:`card-${i+1}`,width:mixed?([1,2,1,3,1,4,2,2] as const)[i%8]:1,height:mixed?[240,320,280,400,240,480,240,280][i%8]:240}));
const name=(item:DashboardGridItem)=>`${names[(Number(item.id.split("-")[1])-1)%8]} ${item.id}`;

const DemoCard=React.memo(function DemoCard({id,metrics,long=false}:{id:string;metrics:Metrics;long?:boolean}){
  metrics.renders[id]=(metrics.renders[id]??0)+1;
  const [count,setCount]=React.useState(0),[cursor,setCursor]=React.useState(0);
  React.useEffect(()=>{metrics.mounts[id]=(metrics.mounts[id]??0)+1;metrics.dataCallbacks++;return()=>{metrics.unmounts[id]=(metrics.unmounts[id]??0)+1;};},[id,metrics]);
  // Deliberately nontrivial rendering work: deterministic presentation-only fixture.
  let checksum=0;for(let i=0;i<15000;i++)checksum+=Math.sin(i)*Math.cos(i);
  const label=name({id,width:1,height:240});
  const ordinal=Number(id.split("-")[1]);
  return <article data-demo-card={id} data-checksum={checksum.toFixed(3)} className="flex h-full min-w-0 flex-col gap-2 overflow-auto rounded-lg border border-border bg-card p-4 pt-16 text-card-foreground">
    <h2 className="break-words text-sm font-semibold">{long?`${label}: an unusually long supplied content title that must remain readable inside a narrow card`:label}</h2>
    {ordinal%8===7?<p role="status">Loading supplied content…</p>:ordinal%8===0?<p>Content unavailable. Supplied warning stays visible.</p>:<>
      <svg role="img" aria-label={`Interactive mock chart ${id}`} viewBox="0 0 240 36" className="h-9 w-full shrink-0" onPointerMove={event=>{metrics.chartPointers++;setCursor(Math.round(event.clientX));}} onWheel={event=>{metrics.chartWheels++;event.preventDefault();setCursor(value=>value+1);}}>
        <title>Independent presentation fixture</title><polyline points="0,28 30,20 60,24 90,8 120,12 150,4 180,16 210,8 240,10" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg><output aria-label={`Chart cursor ${id}`} className="text-xs">Cursor {cursor}</output>
    </>}
    <div className="flex flex-wrap gap-2 text-xs">
      <button className="min-h-[44px] rounded border border-input px-2" onClick={()=>setCount(value=>value+1)} aria-label={`Increment ${id}`}>Count {count}</button>
      <a href={`#detail-${id}`} className="inline-flex min-h-[44px] items-center underline">Card link {id}</a>
      <Dialog><DialogTrigger asChild><Button colorStyle="outlined" size="sm" aria-label={`Open details ${id}`}>Details</Button></DialogTrigger><DialogContent><DialogTitle>Content details {id}</DialogTitle><DialogDescription>This dialog belongs to the supplied content, independently of the grid.</DialogDescription><label className="block">Notes<input aria-label={`Dialog note ${id}`} className="w-full rounded border border-input bg-background p-2"/></label></DialogContent></Dialog>
      <DropdownMenu><DropdownMenuTrigger asChild><Button colorStyle="outlined" size="sm" aria-label={`Content menu ${id}`}>Menu</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={()=>setCount(value=>value+1)}>Increment supplied content</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    </div>
  </article>;
});

function Demo({count=8,mixed=false,initialEditing=true,disabled=false,width=1200,dark=false,long=false,saveFailure=false,scroll=false}:{count?:number;mixed?:boolean;initialEditing?:boolean;disabled?:boolean;width?:number;dark?:boolean;long?:boolean;saveFailure?:boolean;scroll?:boolean}){
  const [items,setItems]=React.useState(()=>makeItems(count,mixed)),[editing,setEditing]=React.useState(initialEditing),[off,setOff]=React.useState(disabled),[container,setContainer]=React.useState(width),[mounted,setMounted]=React.useState(true),[failure,setFailure]=React.useState(false);
  const metrics=React.useRef<Metrics>({mounts:{},unmounts:{},renders:{},renderItem:{},dataCallbacks:0,changes:0,announcements:[],chartPointers:0,chartWheels:0,profiler:[]}).current;
  const api=React.useRef<DashboardGridHandle>(null);
  React.useEffect(()=>{window.dashboardGridMetrics=metrics;},[metrics]);
  const renderItem=React.useCallback((item:DashboardGridItem)=>{metrics.renderItem[item.id]=(metrics.renderItem[item.id]??0)+1;return <DemoCard id={item.id} metrics={metrics} long={long}/>;},[metrics,long]);
  return <div className={dark?"dark":""} style={{minHeight:"100vh"}}>
    <div className="space-y-3 bg-background p-4 text-foreground">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Host layout controls">
        <Button colorStyle="outlined" onClick={()=>setEditing(value=>!value)}>Toggle editing</Button>
        <Button colorStyle="outlined" onClick={()=>setOff(value=>!value)}>Toggle disabled</Button>
        <Button colorStyle="outlined" onClick={()=>setContainer(1200)}>Four columns</Button><Button colorStyle="outlined" onClick={()=>setContainer(900)}>Two columns</Button><Button colorStyle="outlined" onClick={()=>setContainer(500)}>One column</Button>
        <Button colorStyle="outlined" onClick={()=>setMounted(value=>!value)}>Toggle grid mount</Button>
        <Button colorStyle="outlined" onClick={()=>setItems(makeItems(count,mixed))}>Reset layout</Button>
        <Button colorStyle="outlined" disabled={off} onClick={()=>saveFailure?setFailure(true):setEditing(false)}>Host save</Button>
        <Button colorStyle="outlined" onClick={()=>{if(items.length)api.current?.execute({type:"move",id:items[0].id,toIndex:items.length-1});}}>Host move first to end</Button>
      </div>
      {failure?<p role="alert">Host save failed. Draft remains editable; no persistence is owned by the grid.</p>:null}
      <output aria-label="Canonical layout" className="block break-all text-xs" data-layout-output="">{JSON.stringify(items)}</output>
      <div data-scroll-container="" style={{maxHeight:scroll?700:undefined,overflowY:scroll?"auto":undefined}}>
        <div data-demo-container="" style={{width:container,maxWidth:"100%"}}>
          {mounted?<React.Profiler id="dashboard-grid" onRender={(_id,_phase,duration)=>metrics.profiler.push(duration)}><DashboardGrid ref={api} items={items} editing={editing} disabled={off} getItemLabel={name} renderItem={renderItem} onAnnouncement={message=>metrics.announcements.push(message)} onItemsChange={next=>{metrics.changes++;setItems(next);}} aria-label="Example dashboard"/></React.Profiler>:<p>Grid unmounted by host.</p>}
        </div>
      </div>
      <a href="#outside" className="inline-block min-h-[44px] underline">Outside grid link</a>
      <div style={{height:scroll?900:100}} aria-hidden="true"/>
    </div>
  </div>;
}
export const ArbitraryContent:Story={render:()=> <Demo/>};
export const ReadOnly:Story={render:()=> <Demo initialEditing={false}/>};
export const Disabled:Story={render:()=> <Demo disabled/>};
export const Empty:Story={render:()=> <Demo count={0}/>};
export const Single:Story={render:()=> <Demo count={1}/>};
export const TwentyFour:Story={render:()=> <Demo count={24} scroll/>};
export const MixedGeometry:Story={render:()=> <Demo mixed/>};
export const LongTitles:Story={render:()=> <Demo long/>};
export const TwoColumns:Story={render:()=> <Demo width={900} mixed/>};
export const OneColumn:Story={render:()=> <Demo width={500} mixed/>};
export const Dark:Story={render:()=> <Demo dark/>};
export const SaveFailure:Story={render:()=> <Demo saveFailure/>};
export const ReducedMotion:Story={render:()=> <Demo/>};
export const HighContrast:Story={render:()=> <Demo dark/>};
