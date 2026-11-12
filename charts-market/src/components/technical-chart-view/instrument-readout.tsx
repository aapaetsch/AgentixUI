import * as React from 'react';
import {cn,Tooltip,TooltipTrigger} from 'aapaetsch-ui-kit';
import {TooltipContent} from './scoped-theme';
import {compactReadoutValue} from './study-presentation';
import {marketTimeKey,type MarketCrosshairSnapshot,type MarketTime,type OhlcBar,type TechnicalPaneState} from '../../core';
import type {StudyLegendGroup} from './study-legend';

/** Original producer text, never a second economic observation or a calculation input. */
export interface TechnicalChartReadoutObservation {
  time:MarketTime;open:string|null;high:string|null;low:string|null;close:string|null;
  volume?:string|null;
  /** Optional original values keyed by complete render-series IDs, e.g. instanceId:outputId. */
  studies?:Readonly<Record<string,string|null>>;
}
/** Additive runtime header composition; all asset authorization and listing identity remain host-owned. */
export interface TechnicalChartInstrumentReadout {
  name?:string;symbol?:string;period?:string;exchange?:string;currency?:string;
  /** Approved root-relative/HTTPS host asset or inline image; no inferred/fallback URL is requested. */
  logo?:{src:string};
  /** Existing host symbol-selection action. Omit for a focusable textual identity. */
  onSelect?:()=>void;
  /** Source must be the identical immutable numeric array supplied to data. */
  exactValues?:{identity:string;revision?:number;source:readonly OhlcBar[];observations:readonly TechnicalChartReadoutObservation[]};
}
export interface InstrumentEvidence {requested:boolean;rows:ReadonlyMap<number,TechnicalChartReadoutObservation|null>}
/** Runtime geometry only: keep wrapped readouts above an actual plot body without changing saved pane sizes. */
export function instrumentPaneDefinitions(panes:TechnicalPaneState[],headers:Readonly<Record<string,number>>,maximizedPaneId?:string|null):TechnicalPaneState[]{
  return panes.map(pane=>({...pane,minimumSize:pane.collapsed&&pane.id!==maximizedPaneId?28:Math.max(pane.minimumSize??0,(headers[pane.id]??0)+(pane.id==='price'?28:10)+48)}));
}
export function instrumentMinimumHeight(panes:TechnicalPaneState[],maximizedPaneId?:string|null):number{
  const visible=panes.filter(pane=>pane.visible!==false),selected=maximizedPaneId&&visible.some(pane=>pane.id===maximizedPaneId)?visible.filter(pane=>pane.id===maximizedPaneId):visible;
  return 28+selected.reduce((total,pane)=>total+(pane.minimumSize??0),0);
}
const fields=['open','high','low','close'] as const;
export const boundedInstrumentText=(value:string|undefined,maximum:number)=>typeof value==='string'&&Array.from(value).length<=maximum?value.trim():'';
export function exactReadoutValue(raw:unknown,projection:number|undefined):string|null {
  if(raw===null)return null;
  return typeof raw==='string'&&raw.length<=128&&/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(raw)&&Number.isFinite(Number(raw))&&Number(raw)===projection?raw:null;
}
export function useInstrumentEvidence(exact:TechnicalChartInstrumentReadout['exactValues'],data:readonly OhlcBar[],identity:string,revision?:number,status?:string):InstrumentEvidence {
  const retained=React.useRef<{source:readonly OhlcBar[];identity:string;revision?:number;evidence:InstrumentEvidence}|null>(null);
  const matches=exact?.source===data&&exact.identity===identity&&exact.revision===revision&&(!status||status==='accepted'||status==='unchanged');
  const evidence=React.useMemo<InstrumentEvidence>(()=>{
    if(!exact)return {requested:false,rows:new Map()};
    if(!matches)return retained.current?.source===data&&retained.current.identity===identity&&retained.current.revision===revision?retained.current.evidence:{requested:true,rows:new Map()};
    const times=new Set(data.map(bar=>marketTimeKey(bar.time))),rows=new Map<number,TechnicalChartReadoutObservation|null>();
    for(const row of exact.observations){const time=marketTimeKey(row.time);if(times.has(time))rows.set(time,rows.has(time)?null:row);}
    return {requested:true,rows};
  },[exact,data,identity,revision,matches]);
  const effect=typeof window==='undefined'?React.useEffect:React.useLayoutEffect;
  effect(()=>{retained.current=matches?{source:data,identity,revision,evidence}:retained.current?.source===data&&retained.current.identity===identity&&retained.current.revision===revision&&exact?retained.current:null;},[exact,data,identity,revision,evidence,matches]);
  return evidence;
}
export function instrumentValue(field:typeof fields[number]|'volume',bar:OhlcBar|undefined,evidence:InstrumentEvidence):string|null {
  if(!bar)return null;
  if(evidence.requested)return exactReadoutValue(evidence.rows.get(marketTimeKey(bar.time))?.[field],bar[field]);
  return bar[field]!=null&&Number.isFinite(bar[field])?String(bar[field]):null;
}
export function applyInstrumentStudyText(groups:StudyLegendGroup[],bar:OhlcBar|undefined,evidence:InstrumentEvidence):StudyLegendGroup[] {
  return groups.map(group=>({...group,lines:group.lines.map(line=>{
    if(group.kind==='bar-volume'){const exact=instrumentValue('volume',bar,evidence);return {...line,...(line.showValue===false?{}:{exactValue:exact,value:exact==null?null:line.value})};}
    const studies=bar?evidence.rows.get(marketTimeKey(bar.time))?.studies:undefined;
    if(!studies)return line;
    const exact=exactReadoutValue(studies[line.id??''],line.value??undefined);
    return {...line,exactValue:exact,value:exact==null?null:line.value};
  })}));
}
function logoSource(src:string|undefined):string|undefined {
  if(!src||src.length>65536)return undefined;
  if(src.startsWith('/')&&!src.startsWith('//')&&!src.includes('\\'))return src;
  if(/^data:image\/(?:png|jpeg|webp|gif|svg\+xml)[;,]/.test(src))return src;
  try{const url=new URL(src);return url.protocol==='https:'&&!url.username&&!url.password?url.href:undefined;}catch{return undefined;}
}
function InstrumentLogo({src}:{src:string}){const[failed,setFailed]=React.useState(false);return failed?null:<img src={src} alt="" aria-hidden="true" width={20} height={20} decoding="async" referrerPolicy="no-referrer" className="size-5 shrink-0 rounded-sm object-contain" onError={()=>setFailed(true)}/>;}
export function instrumentIdentity(value:TechnicalChartInstrumentReadout,symbol:string,interval:string){return {symbol:boundedInstrumentText(value.symbol,40)||boundedInstrumentText(symbol,40),name:boundedInstrumentText(value.name,256)||boundedInstrumentText(value.symbol,40)||boundedInstrumentText(symbol,40),period:boundedInstrumentText(value.period,24)||boundedInstrumentText(interval,24),exchange:boundedInstrumentText(value.exchange,80),currency:boundedInstrumentText(value.currency,16)};}
export function instrumentKeyboardText(value:TechnicalChartInstrumentReadout,symbol:string,interval:string,snapshot:MarketCrosshairSnapshot,evidence:InstrumentEvidence,labels:ReadonlyMap<string,string>):string {
  const identity=instrumentIdentity(value,symbol,interval),base=[identity.name,identity.period,identity.exchange,identity.currency,'Inspect',new Date(marketTimeKey(snapshot.time)*1000).toISOString(),snapshot.bar.incomplete?'Incomplete bar':'',...fields.map(field=>`${field}: ${instrumentValue(field,snapshot.bar,evidence)??'Unavailable'}`),`vol: ${instrumentValue('volume',snapshot.bar,evidence)??'Unavailable'}`];
  for(const[id,label]of labels){const number=snapshot.values[id],raw=evidence.rows.get(marketTimeKey(snapshot.time))?.studies;const exact=raw?exactReadoutValue(raw[id],number??undefined):number!=null&&Number.isFinite(number)?String(number):null;base.push(`${label}: ${exact??'Unavailable'}`);}
  return base.filter(Boolean).join(', ');
}
export function InstrumentReadout({value,symbol,interval,bar,evidence,timeLabel,children,className,narrow=false,actionsWidth=0,leadingWidth=0,locale}:{value:TechnicalChartInstrumentReadout;symbol:string;interval:string;bar:OhlcBar|undefined;evidence:InstrumentEvidence;timeLabel:string;children:React.ReactNode;className?:string;narrow?:boolean;actionsWidth?:number;leadingWidth?:number;locale?:string}){
  const identity=instrumentIdentity(value,symbol,interval),src=logoSource(value.logo?.src),title=[identity.name,identity.symbol,identity.period,identity.exchange,identity.currency].filter(Boolean).join(' · ');
  const identityClass='min-w-0 max-w-[16rem] truncate text-left font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring';
  return <div data-instrument-readout="" aria-live="off" className={cn('min-w-0 flex-1',className)}>
    <div className="flex min-w-0 flex-wrap items-start gap-x-3 gap-y-0">
      <div className="pointer-events-auto inline-flex min-w-0 max-w-full shrink flex-wrap items-center gap-x-1.5 leading-5" style={narrow?{width:'100%',minHeight:actionsWidth||leadingWidth?'2.75rem':undefined,paddingRight:`${actionsWidth/16}rem`,paddingLeft:`${leadingWidth/16}rem`}:undefined} aria-label="Instrument identity">
        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">{src?<InstrumentLogo key={src} src={src}/>:null}
        <Tooltip><TooltipTrigger asChild>{value.onSelect?<button type="button" title={title} aria-label={title} onClick={value.onSelect} className={identityClass}>{identity.name}</button>:<span title={title} aria-label={title} tabIndex={0} className={identityClass}>{identity.name}</span>}</TooltipTrigger><TooltipContent className="max-w-[min(24rem,calc(100vw-1rem))] break-words motion-reduce:!animate-none">{title}</TooltipContent></Tooltip></span>
        {[identity.period,identity.exchange,identity.currency].filter(Boolean).map((text,index)=><span key={index} title={text} className="min-w-0 max-w-full truncate text-muted-foreground">{text}</span>)}
      </div>
      <div aria-label="OHLC readout" aria-description={timeLabel} className={cn("pointer-events-auto min-w-0 max-w-full items-baseline gap-y-0 font-mono leading-5 tabular-nums",narrow?'flex w-full flex-wrap gap-x-1.5':'flex flex-[1_0_auto] flex-wrap gap-x-1.5')}>
        {fields.map(field=>{const exact=instrumentValue(field,bar,evidence),display=exact==null?'—':compactReadoutValue(bar?.[field],locale);return <span key={field} title={`${field}: ${exact??'Unavailable'} · ${timeLabel}`} aria-label={`${field}: ${exact??'Unavailable'}`} className="inline-flex min-w-0 max-w-full items-baseline gap-0.5 whitespace-nowrap"><span className="shrink-0 text-muted-foreground">{field[0].toUpperCase()}</span><span className="min-w-0">{display}</span></span>;})}
        <span className="sr-only">{timeLabel}{bar?.incomplete?' · Incomplete bar':''}</span>
      </div>
    </div>
    {children}
  </div>;
}
