import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {createMarketChartEngine} from './canvas-engine';
import type {MarketChartEngine,MarketChartEngineOptions} from '../core';
const data=[0,10,100,200].map((time,i)=>({time,open:10,high:50,low:1,close:[10,20,40,30][i]})),theme={background:'white',text:'black',border:'gray',grid:'gray',positive:'green',negative:'red',primary:'blue'};
let engine:MarketChartEngine,canvas:HTMLCanvasElement;
beforeEach(()=>{vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(500);vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()})as unknown as CanvasRenderingContext2D);});
afterEach(()=>{engine?.destroy();vi.restoreAllMocks();});
async function create(extra:Partial<MarketChartEngineOptions>={}){const host=document.createElement('div');engine=createMarketChartEngine(host,{data,chartType:'line',height:300,showVolume:false,scaleMode:'normal',markers:[],theme,timeAxis:{mode:'utc',domain:{from:0,to:250},intervalSeconds:10},presentation:{crosshair:{labels:false,lineMarker:{visible:true}}},...extra});canvas=host.querySelector('canvas')!;await new Promise(r=>setTimeout(r,35));}
function hover(x:number,y=140){canvas.dispatchEvent(new MouseEvent('pointermove',{clientX:x,clientY:y,bubbles:true}));}
describe('canvas marker lifecycle',()=>{
 it('uses raw horizontal position on a connected sparse line, keeps exact readouts separate and clears exit/cancel/blur',async()=>{
  await create();const a=engine.coordinateForTime(10)!,b=engine.coordinateForTime(100)!,x=(a+b)/2;hover(x);const first=engine.getSnapshot().lineInspection;expect(first?.source).toBe('interpolated');expect(first?.x).toBeCloseTo(x);expect(engine.getSnapshot().crosshair).toBeNull();hover(x,210);expect(engine.getSnapshot().lineInspection?.y).toBe(first?.y);
  hover(a);expect(engine.getSnapshot().lineInspection?.source).toBe('exact');expect(engine.getSnapshot().crosshair?.bar.close).toBe(20);
  for(const event of ['pointerleave','pointercancel']){canvas.dispatchEvent(new Event(event));expect(engine.getSnapshot().lineInspection).toBeNull();hover(a);}
  window.dispatchEvent(new Event('blur'));expect(engine.getSnapshot().lineInspection).toBeNull();
 });
 it('recomputes accepted revisions, manual/log scales and resize while respecting true gaps and future whitespace',async()=>{
  await create();const x=(engine.coordinateForTime(10)!+engine.coordinateForTime(100)!)/2;hover(x);const old=engine.getSnapshot().lineInspection!.y;
  engine.setData(data.map((b,i)=>i===2?{...b,close:30}:b));await new Promise(r=>setTimeout(r,35));expect(engine.getSnapshot().lineInspection!.y).not.toBe(old);
  engine.setScale?.({mode:'logarithmic',autoScale:false,manualRange:{minimum:Math.log(5),maximum:Math.log(60)}});engine.resize(430,350);await new Promise(r=>setTimeout(r,35));hover((engine.coordinateForTime(10)!+engine.coordinateForTime(100)!)/2);expect(engine.getSnapshot().lineInspection?.source).toBe('interpolated');
  engine.setDiscontinuities?.([{from:10,to:100}]);expect(engine.getSnapshot().lineInspection).toBeNull();hover(engine.coordinateForTime(230)!);expect(engine.getSnapshot().lineInspection).toBeNull();
 });
 it('preserves defaults and clears when line presentation is unavailable',async()=>{
  await create({presentation:{}});hover(engine.coordinateForTime(10)!);expect(engine.getSnapshot().lineInspection).toBeNull();engine.setPresentation?.({crosshair:{lineMarker:{visible:true}}});expect(engine.getSnapshot().lineInspection?.source).toBe('exact');engine.setChartType('candlestick');expect(engine.getSnapshot().lineInspection).toBeNull();
 });
 it('retains a clipped UTC stroke whose accepted bracketing samples lie outside the supplied viewport domain',async()=>{
  await create({data:[data[0],{...data[1],time:300}],timeAxis:{mode:'utc',domain:{from:100,to:200},intervalSeconds:10}});hover(engine.coordinateForTime(150)!);expect(engine.getSnapshot().lineInspection).toMatchObject({source:'interpolated',fromTime:0,toTime:300});
 });
});
