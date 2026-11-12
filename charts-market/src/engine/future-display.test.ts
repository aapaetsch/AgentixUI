import {describe,it,expect} from 'vitest';
import {IndexedOhlcStore} from './data-store';
import {LogicalTimeScale} from './time-scale';
import {TimelineTickIndex,formatTimelineInspection} from './time-ticks';
import {marketFutureDisplayEnd,validateMarketTimeGeometry,marketTimeKey,type MarketTimeAxis} from '../core';
const sec=(s:string)=>Date.parse(s)/1000,day=86400;
const bar=(time:number)=>({time,open:100,high:110,low:90,close:105,volume:10});
const policy={convention:'utc-calendar' as const,intervalSeconds:day};
describe('bounded future annotation ruler',()=>{
 it.each([60,day,7*day,30*day])('round-trips exact dates with explicit %ss display slots across three axes',intervalSeconds=>{
  const data=[bar(sec('2026-01-01')),bar(sec('2026-01-02')),bar(sec('2026-01-05'))];
  const axes:MarketTimeAxis[]=[{mode:'compressed'},{mode:'calendar',times:data.map(b=>b.time)},{mode:'utc',domain:{from:data[0].time,to:data[2].time},intervalSeconds}];
  for(const axis of axes){
   const scale=new LogicalTimeScale(new IndexedOhlcStore(data),1000,88);scale.setAxis({...axis,futureDisplay:{...policy,intervalSeconds}});scale.setTimelinePadding(10);
   const future=sec('2027-01-05'),last=scale.timeToLogical(data[2].time)!;
   scale.setLogicalRange({from:last-1,to:scale.timeToLogical(future)!});
   for(const time of [data[2].time,sec('2026-02-28T12:34:56.789Z'),future]){const x=scale.timeToCoordinate(time)!;expect(x).not.toBeNull();expect(marketTimeKey(scale.coordinateToTime(x)!)).toBeCloseTo(time,4);}
   expect(scale.timeToCoordinate(future+1)).toBeNull();expect(scale.visibleTimes()!.to).toBe(data[2].time);
   const anchor=scale.coordinateToTime(400);scale.zoomAt(400,.75);expect(scale.coordinateToTime(400)).toBeCloseTo(Number(anchor),4);
   scale.setWidth(390);const x=scale.timeToCoordinate(sec('2026-03-01'))!;expect(scale.coordinateToTime(x)).toBeCloseTo(sec('2026-03-01'),4);
   expect(scale.coordinateToIndex(x)).toBe(-1);
  }
 });
 it('keeps historical interpolation and saved weekend dates after append and retention',()=>{
  const store=new IndexedOhlcStore([bar(sec('2026-01-01')),bar(sec('2026-01-02'))]),scale=new LogicalTimeScale(store,1000);
  scale.setAxis({mode:'compressed',futureDisplay:policy});const sunday=sec('2026-01-04T12:00Z');
  expect(scale.coordinateToTime(scale.timeToCoordinate(sunday)!)).toBeCloseTo(sunday,5);
  store.appendOrUpdate(bar(sec('2026-01-05')));scale.setStore(store);
  expect(scale.timeToLogical(sunday)).toBeGreaterThan(1);expect(scale.timeToLogical(sunday)).toBeLessThan(2);
  expect(scale.coordinateToTime(scale.timeToCoordinate(sunday)!)).toBeCloseTo(sunday,5);
  store.replace([bar(sec('2026-01-02')),bar(sec('2026-01-05'))]);scale.setStore(store);
  expect(scale.coordinateToTime(scale.timeToCoordinate(sunday)!)).toBeCloseTo(sunday,5);
 });
 it('uses no bar count ceiling and keeps initial/Fit/Latest close to supplied history',()=>{
  const data=Array.from({length:252},(_,i)=>bar(sec('2025-01-01')+i*day)),store=new IndexedOhlcStore(data),scale=new LogicalTimeScale(store,1000);
  scale.setAxis({mode:'compressed',futureDisplay:policy});scale.setTimelinePadding(10);scale.fitContent();expect(scale.visible.to).toBe(261);
  scale.setLogicalRange({from:125,to:616});expect(scale.visible).toEqual({from:125,to:616});expect(scale.visibleTimes()).toEqual({from:data[125].time,to:data[251].time});
  scale.setLogicalRange({from:300,to:600});expect(scale.visibleTimes()).toBeNull();expect(scale.visibleDisplayTimes()).not.toBeNull();expect(scale.visibleIndexes(0)).toEqual({from:252,to:252});
  scale.scrollToRealtime();expect(scale.visible.to).toBe(261);scale.fitContent();expect(scale.visible).toEqual({from:0,to:261});expect(store.toArray()).toEqual(data);
 });
 it('keeps all declared calendar coordinates and exact future earnings unchanged',()=>{
  const data=[bar(sec('2026-01-01')),bar(sec('2026-01-02'))],earnings=sec('2026-02-14T17:04:03Z'),scale=new LogicalTimeScale(new IndexedOhlcStore(data),1000);
  const times=[...data.map(b=>b.time),earnings];scale.setAxis({mode:'calendar',times,futureDisplay:policy});
  expect(scale.timeToLogical(earnings)).toBe(2);expect(scale.coordinateToTime(scale.timeToCoordinate(earnings)!)).toBe(earnings);
  expect(scale.futureDisplayBounds!.time).toBe(earnings);expect(times).toEqual([...data.map(b=>b.time),earnings]);
 });
 it('handles empty/one observations, explicit empty origin and no implicit epoch',()=>{
  const empty=new LogicalTimeScale(new IndexedOhlcStore([]));empty.setAxis({mode:'compressed',futureDisplay:policy});expect(empty.timeToCoordinate(sec('2026-01-01'))).toBeNull();
  empty.setAxis({mode:'compressed',futureDisplay:{...policy,emptyOrigin:'2026-01-01'}});empty.setLogicalRange({from:10,to:30});expect(empty.visibleTimes()).toBeNull();expect(empty.visibleDisplayTimes()).not.toBeNull();
  expect(empty.coordinateToIndex(0)).toBe(-1);
  const one=new LogicalTimeScale(new IndexedOhlcStore([bar(sec('2026-01-01'))]));one.setAxis({mode:'compressed',futureDisplay:policy});expect(one.timeToLogical(sec('2027-01-01'))).toBe(365);
 });
 it('clamps UTC month ends/leap years without local DST or session inference',()=>{
  expect(marketFutureDisplayEnd('2024-02-29')).toBe(sec('2025-02-28'));
  expect(marketFutureDisplayEnd('2026-01-31',1)).toBe(sec('2026-02-28'));
  const scale=new LogicalTimeScale(new IndexedOhlcStore([bar(sec('2026-03-07T12:00Z'))]));scale.setAxis({mode:'compressed',futureDisplay:policy});
  expect(scale.timeToLogical(sec('2026-03-08T12:00Z'))).toBe(1);expect(formatTimelineInspection(sec('2026-03-08T12:00Z'),'en-US','UTC')).toContain('12:00:00');
 });
 it('preserves provider-daily date-only and explicit session-rollup UTC coordinates bytewise',()=>{
  for(const times of [['2024-02-28','2024-02-29','2024-03-01'] as const,[sec('2026-03-06T21:00Z'),sec('2026-03-09T20:00Z'),sec('2026-03-10T20:00Z')]]){
   const data=times.map(time=>({...bar(0),time})),before=JSON.stringify(data),store=new IndexedOhlcStore(data),scale=new LogicalTimeScale(store,1000);
   scale.setAxis({mode:'calendar',times,futureDisplay:policy});scale.setTimelinePadding(10);scale.setLogicalRange({from:0,to:300});
   times.forEach((time,i)=>expect(scale.timeToLogical(time)).toBe(i));const future=marketTimeKey(times.at(-1)!)+180*day;
   expect(scale.coordinateToTime(scale.timeToCoordinate(future)!)).toBeCloseTo(future,4);scale.panPixels(-100);scale.zoomAt(400,.8);
   expect(JSON.stringify(data)).toBe(before);expect(JSON.stringify(store.toArray())).toBe(before);
  }
 });
 it.each([{...policy,intervalSeconds:0},{...policy,horizonMonths:61},{...policy,horizonMonths:1.5},{...policy,emptyOrigin:NaN},{...policy,convention:'sessions'}])('rejects invalid future configuration %#',futureDisplay=>{
  expect(validateMarketTimeGeometry({mode:'compressed',futureDisplay} as MarketTimeAxis)).not.toEqual([]);
 });
 it('plans bounded nonoverlapping future month/year/day ticks on the identical ruler',()=>{
  const a=sec('2026-07-01'),scale=new LogicalTimeScale(new IndexedOhlcStore([bar(a)]),1000,88);scale.setAxis({mode:'compressed',futureDisplay:policy});scale.setLogicalRange({from:90,to:365});
  const bounds=scale.visibleDisplayTimes()!,ticks=new TimelineTickIndex([a],'en-US','America/New_York').plan({presentation:{},from:Number(bounds.from),to:Number(bounds.to),futureFrom:a,left:0,right:912,coordinate:t=>scale.timeToCoordinate(t),measure:s=>s.length*7});
  expect(ticks.some(t=>t.label==='2027')).toBe(true);expect(ticks.every(t=>t.source==='future-display'&&t.x===scale.timeToCoordinate(t.time))).toBe(true);
  for(let i=1;i<ticks.length;i++)expect(ticks[i].left).toBeGreaterThanOrEqual(ticks[i-1].left+ticks[i-1].width+8);
  expect(ticks.length).toBeLessThan(20);
 });
});
