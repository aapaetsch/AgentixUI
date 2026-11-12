import {describe,expect,it} from 'vitest';
import {lineInspectionPoint} from './line-inspection';
import {IndexedOhlcStore} from './data-store';
import {validateMarketPresentation} from '../core';
const rows=[0,10,100,200].map((time,i)=>({time,open:10,high:50,low:1,close:[10,20,40,30][i]}));
const store=new IndexedOhlcStore(rows);
describe('display-only line inspection geometry',()=>{
 it('interpolates rendered coordinates across sparse connected samples without manufacturing an observation',()=>{
  const original=JSON.stringify(rows),point=lineInspectionPoint(store,55,Number,p=>100-p,[]);expect(point).toEqual({x:55,y:70,source:'interpolated',fromTime:10,toTime:100});expect(JSON.stringify(rows)).toBe(original);
  expect(lineInspectionPoint(store,100,Number,p=>100-p,[])?.source).toBe('exact');
 });
 it('follows the log stroke in screen space, independently of pointer price',()=>{
  const coordinate=(p:number)=>200-Math.log(p)*20,point=lineInspectionPoint(store,55,Number,coordinate,[]);expect(point?.y).toBeCloseTo((coordinate(20)+coordinate(40))/2);
 });
 it('respects explicit session breaks, endpoints, future space and invalid adjacent samples',()=>{
  expect(lineInspectionPoint(store,55,Number,p=>p,[{from:10,to:100}])).toBeNull();expect(lineInspectionPoint(store,10,Number,p=>p,[{from:10,to:100}])?.source).toBe('exact');
  for(const x of [-1,201])expect(lineInspectionPoint(store,x,Number,p=>p,[])).toBeNull();
  const invalid=new IndexedOhlcStore(rows.map((b,i)=>i===1?{...b,close:NaN}:b));expect(lineInspectionPoint(invalid,55,Number,p=>p,[])).toBeNull();expect(lineInspectionPoint(store,55,Number,()=>null,[])).toBeNull();
 });
 it('uses logarithmic lookup rather than scanning all history per pointer move',()=>{
  const rows=Array.from({length:100000},(_,time)=>({time,open:1,high:2,low:0,close:1}));let reads=0;
  expect(lineInspectionPoint({length:rows.length,at:i=>{reads++;return rows[i];}},50000.5,Number,p=>p,[])?.source).toBe('interpolated');expect(reads).toBeLessThan(25);
 });
 it('restricts lookup to the supplied mapped domain when accepted history extends outside its calendar',()=>{
  const rows=Array.from({length:100},(_,time)=>({time,open:1,high:2,low:0,close:1})),store=new IndexedOhlcStore(rows),coordinate=(t:import('../core').MarketTime)=>Number(t)<=9?Number(t)*10:null;
  expect(lineInspectionPoint(store,45,coordinate,p=>p,[],{from:0,to:9})).toMatchObject({x:45,source:'interpolated',fromTime:4,toTime:5});
  expect(lineInspectionPoint(store,95,coordinate,p=>p,[],{from:0,to:9})).toBeNull();
 });
 it('bounds marker styling and leaves default visibility opt-in',()=>{
  expect(()=>validateMarketPresentation({crosshair:{lineMarker:{radius:9}}})).toThrow();expect(()=>validateMarketPresentation({crosshair:{lineMarker:{strokeWidth:0}}})).toThrow();expect(()=>validateMarketPresentation({crosshair:{lineMarker:{radius:4,strokeWidth:2}}})).not.toThrow();
 });
});
