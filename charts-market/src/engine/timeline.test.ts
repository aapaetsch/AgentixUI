import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TimelineTickIndex,formatTimelineInspection} from './time-ticks';
import {IndexedOhlcStore,LogicalTimeScale,createMarketChartEngine} from '.';
import {marketTimeKey,serializeTechnicalChartViewState,createTechnicalChartViewState,type MarketChartEngine,type MarketChartEngineOptions,type MarketTimelinePresentation} from '../core';
const sec=(s:string)=>Date.parse(s)/1000,day=86400;
const bar=(time:number)=>({time,open:100,high:110,low:90,close:105,volume:10});
const theme={background:'white',text:'black',border:'gray',grid:'gray',positive:'green',negative:'red',primary:'blue'};
const measure=(s:string)=>s.length*7;
function plan(times:number[],presentation:MarketTimelinePresentation={},tz='UTC',width=1000){
 const a=times[0],b=times.at(-1)!;
 return new TimelineTickIndex(times,'en-US',tz).plan({presentation,from:a,to:b,left:0,right:width,coordinate:t=>(marketTimeKey(t)-a)/(b-a||1)*width,measure});
}
describe('range-sensitive supplied timeline ticks',()=>{
 it('chooses visible-span labels independently of candle resolution and never prints midnight24',()=>{
  const start=sec('2026-03-09T00:00:00Z'),times=Array.from({length:49},(_,i)=>start+i*1800);
  const ticks=plan(times);expect(ticks.some(t=>t.label==='00:00')).toBe(true);expect(ticks.every(t=>/^\d{2}:(00|30)$/.test(t.label))).toBe(true);
  const daily=Array.from({length:220},(_,i)=>start+i*day),long=plan(daily);expect(long.every(t=>t.kind==='month'||t.kind==='year')).toBe(true);
 });
 it('uses explicit irregular session starts and axis-only noon14 labels across missing observations',()=>{
  const a=sec('2026-03-09T10:10:00Z'),b=sec('2026-03-09T17:00:00Z');
  const ticks=plan([a,b],{range:'5D',sessions:[{id:'irregular',from:a,to:b}]});
  expect(ticks.find(t=>t.kind==='day')).toMatchObject({time:a,label:'9',source:'supplied-session'});
  expect(ticks.filter(t=>t.kind==='clock').map(t=>t.label)).toEqual(['12:00','14:00']);
  expect(plan([a,b],{range:'5D'}).find(t=>t.kind==='day')?.source).toBe('first-observation');
  expect(plan([a,b],{range:'5D',sessions:[]}).filter(t=>t.kind==='clock')).toEqual([]);
 });
 it('falls back to actual first observations, never a missing-price calendar slot',()=>{
  const a=sec('2026-03-09T09:00Z'),times=[a,a+3600,a+7200];
  const ticks=new TimelineTickIndex(times,'en-US','UTC',times.slice(1)).plan({presentation:{range:'5D'},from:a,to:a+7200,left:0,right:1000,coordinate:t=>(marketTimeKey(t)-a)/7200*1000,measure});
  expect(ticks.find(t=>t.kind==='day')).toMatchObject({time:a+3600,source:'first-observation'});
 });
 it('anchors month/year on first supplied observation, with year collision priority',()=>{
  const times=['2025-12-19','2025-12-29','2026-01-05','2026-01-09','2026-02-06'].map(s=>sec(s+'T00:00:00Z'));
  const ticks=plan(times,{range:'3M'},'UTC',100);
  expect(ticks.find(t=>t.kind==='year')).toMatchObject({label:'2026',time:times[2]});
  for(let i=1;i<ticks.length;i++)expect(ticks[i].left).toBeGreaterThanOrEqual(ticks[i-1].left+ticks[i-1].width+8);
  const monthly=plan(times,{range:'6M'});expect(monthly.find(t=>t.label==='Feb')?.time).toBe(times[4]);
 });
 it('uses day numbers for1M and3M but never arbitrary midnight clock suffixes',()=>{
  const times=Array.from({length:90},(_,i)=>sec('2026-01-01T00:00:00Z')+i*day);
  for(const range of ['1M','3M'] as const){const ticks=plan(times,{range},'UTC',4000);expect(ticks.some(t=>t.kind==='day')).toBe(true);expect(ticks.some(t=>t.kind==='clock')).toBe(false);}
 });
 it('honors New York DST and quarter-hour offset timezones without duplicated clocks',()=>{
  for(const [date,tz] of [['2026-11-01T04:00:00Z','America/New_York'],['2026-03-08T05:00:00Z','America/New_York'],['2026-03-08T00:00:00Z','Asia/Kathmandu']]){
   const a=sec(date),times=Array.from({length:25},(_,i)=>a+i*900),ticks=plan(times,{range:'1D'},tz,4000);
   expect(new Set(ticks.map(t=>t.label)).size).toBe(ticks.length);expect(ticks.every(t=>/:(00|30)$/.test(t.label))).toBe(true);
   if(date.includes('03-08')&&tz==='America/New_York')expect(ticks.some(t=>t.label.startsWith('02:'))).toBe(false);
   expect(formatTimelineInspection(a,'en-US',tz)).toMatch(/2026/);
  }
 });
 it('returns finite nonoverlap with unavailable text measurement and sparse/empty inputs',()=>{
  const index=new TimelineTickIndex([sec('2025-12-31T23:30Z'),sec('2026-01-01T00:30Z')],'en-US');
  const ticks=index.plan({presentation:{},from:sec('2025-12-31T23:30Z'),to:sec('2026-01-01T00:30Z'),left:72,right:180,coordinate:t=>72+(marketTimeKey(t)-sec('2025-12-31T23:30Z'))/3600*108,measure:()=>NaN});
  expect(ticks.some(t=>t.label==='2026')).toBe(true);expect(ticks.every(t=>Number.isFinite(t.width)&&t.left>=72&&t.left+t.width<=180)).toBe(true);
  expect(plan([],{})).toEqual([]);expect(plan([sec('2026-01-01')],{range:'6M'}).length).toBeLessThanOrEqual(1);
 });
});
describe('presentation-only blank space',()=>{
 const data=Array.from({length:20},(_,i)=>bar(1000+i*day));
 it.each(['compressed','calendar','utc'] as const)('preserves span/anchor and never invents future time in %s',mode=>{
  const store=new IndexedOhlcStore(data),scale=new LogicalTimeScale(store,1000,88);
  if(mode==='calendar')scale.setAxis({mode,times:data.map(b=>b.time)});if(mode==='utc')scale.setAxis({mode,domain:{from:data[0].time,to:data.at(-1)!.time},intervalSeconds:day});
  scale.setTimelinePadding(10);scale.fitContent();expect(scale.visible.to).toBe(29);
  scale.setLogicalRange({from:10,to:25});const span=scale.visible.to-scale.visible.from;scale.panPixels(-80);expect(scale.visible.to-scale.visible.from).toBeCloseTo(span);
  expect(scale.coordinateToTime(900)).toBeNull();expect(store.toArray()).toEqual(data);
  scale.setLogicalRange({from:2,to:12});const anchor=scale.coordinateToLogical(400);scale.zoomAt(400,.8);expect(scale.coordinateToLogical(400)).toBeCloseTo(anchor);
  scale.setLogicalRange({from:30,to:40});expect(scale.visibleTimes()).toBeNull();expect(scale.visibleDisplayTimes()).toBeNull();
  scale.scrollToRealtime();expect(scale.visible).toEqual({from:19,to:29});
  scale.setLogicalRange({from:0,to:100});scale.scrollToRealtime();expect(scale.visible).toEqual({from:0,to:29});
 });
 it('retains legacy supplied-domain clamp unless opted in',()=>{
  const scale=new LogicalTimeScale(new IndexedOhlcStore(data));scale.setAxis({mode:'calendar',times:data.map(b=>b.time)});scale.panPixels(-10000);expect(scale.visible).toEqual({from:0,to:19});
 });
 it('Latest restores defined padding for one-bar and empty views after a wide zoom',()=>{
  for(const rows of [[],[data[0]]])for(const calendar of [false,true]){const scale=new LogicalTimeScale(new IndexedOhlcStore(rows));if(calendar)scale.setAxis({mode:'calendar',times:[data[0].time]});scale.setTimelinePadding(10);scale.fitContent();const fit=scale.visible;scale.setLogicalRange({from:0,to:100});scale.scrollToRealtime();expect(scale.visible).toEqual(fit);}
 });
});
describe('calendar lifecycle and callbacks',()=>{
 let engine:MarketChartEngine;
 const data=Array.from({length:40},(_,i)=>bar(sec('2025-12-01')+i*day));
 beforeEach(()=>{vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:measure(s)})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()})as unknown as CanvasRenderingContext2D);vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(900);});
 afterEach(()=>{engine?.destroy();vi.restoreAllMocks();});
 const create=(extra:Partial<MarketChartEngineOptions>={})=>{const host=document.createElement('div');engine=createMarketChartEngine(host,{data,chartType:'candlestick',height:400,showVolume:false,scaleMode:'normal',markers:[],theme,interactions:{mode:'workspace'},timeAxis:{mode:'calendar',times:data.map(b=>b.time)},presentation:{timeline:{scaleControls:'icons'}},...extra});return host.querySelector('canvas')!;};
 it('preserves blank logical viewport through300ms/economic echoes, refreshed calendar, data and resize',async()=>{
  const changed=vi.fn();const canvas=create({onViewportChange:changed});
  engine.setViewportCommand?.({logicalRange:{from:30,to:49}});
  canvas.dispatchEvent(new WheelEvent('wheel',{clientX:300,clientY:150,deltaX:80,deltaY:0,cancelable:true}));const echo=changed.mock.calls.at(-1)![0];
  canvas.dispatchEvent(new WheelEvent('wheel',{clientX:300,clientY:150,deltaX:80,deltaY:0,cancelable:true}));const current=engine.getSnapshot().viewport!.logicalRange;
  await new Promise(r=>setTimeout(r,300));engine.setViewport?.({...echo,logicalRange:undefined});expect(engine.getSnapshot().viewport!.logicalRange).toEqual(current);
  engine.setTimeAxis?.({mode:'calendar',times:[...data.map(b=>b.time),data.at(-1)!.time+day]});engine.resize(390,400);engine.setData(data.map(b=>({...b,volume:11})));expect(engine.getSnapshot().viewport!.logicalRange).toEqual(current);
  engine.setViewportCommand?.({visibleRange:{from:data[2].time,to:data[10].time}});const commanded=engine.getSnapshot().viewport!.logicalRange;engine.setViewport?.(echo);expect(engine.getSnapshot().viewport!.logicalRange).toEqual(commanded);
 });
 it('preserves precise supplied future anchors but excludes them from economic data bounds',()=>{
  const future=data.at(-1)!.time+10*day;create({timeAxis:{mode:'calendar',times:[...data.map(b=>b.time),future]}});
  expect(engine.coordinateForTime(future)).not.toBeNull();expect(engine.getSnapshot().visibleRange?.to).toBe(data.at(-1)!.time);
  engine.setViewportCommand?.({logicalRange:{from:41,to:50}});expect(engine.getSnapshot().visibleRange).toBeNull();expect(engine.pointForCoordinate({x:400,y:100})).toBeNull();
 });
 it('publishes real axis/scale state and never emits economic changes for scale/chrome',async()=>{
  const range=vi.fn(),view=vi.fn();create({onVisibleRangeChange:range,onViewportChange:view});await new Promise(r=>setTimeout(r,35));
  expect(engine.getSnapshot().priceAxis).toEqual({left:812,width:88,surfaceWidth:900,side:'right'});
  engine.setInteractionState?.({paneScales:{price:{mode:'normal',autoScale:false,manualRange:{minimum:80,maximum:130}}}});expect(engine.getSnapshot().scale?.autoScale).toBe(false);
  engine.resetPaneScale?.('price');expect(engine.getSnapshot().scale?.autoScale).toBe(true);
  engine.setScale?.({mode:'logarithmic',autoScale:true});engine.setPresentation?.({timeline:{range:'1M',scaleControls:'icons'},grid:{vertical:false}});engine.resize(320,400);
  expect(range).not.toHaveBeenCalled();expect(view).not.toHaveBeenCalled();expect(serializeTechnicalChartViewState(createTechnicalChartViewState())).not.toContain('timeline');
 });
 it('restores cached labels after a fully blank window and an optout round trip',async()=>{
  create();const wait=()=>new Promise(r=>setTimeout(r,35));await wait();const known=engine.getSnapshot().viewport!.logicalRange!,ticks=engine.getSnapshot().timeTicks,scales=engine.getSnapshot().scales;expect(ticks?.length).toBeGreaterThan(0);
  engine.setViewportCommand?.({logicalRange:{from:45,to:55}});await wait();expect(engine.getSnapshot().timeTicks).toEqual([]);expect(engine.getSnapshot().scales).toEqual(scales);
  engine.setViewportCommand?.({logicalRange:known});await wait();expect(engine.getSnapshot().timeTicks).toEqual(ticks);
  engine.setPresentation?.({});await wait();expect(engine.getSnapshot().timeTicks).toBeUndefined();
  engine.setPresentation?.({timeline:{scaleControls:'icons'}});engine.setViewportCommand?.({logicalRange:known});await wait();expect(engine.getSnapshot().timeTicks).toEqual(ticks);
 });
});
