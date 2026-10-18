import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IndexedOhlcStore, LogicalTimeScale, createMarketChartEngine } from ".";
import { builtInSeriesRenderers, type MarketSeriesRendererContext } from "./series-renderers";
import { crossesMarketTimeGap, isMarketTimeInGap, validateMarketTimeGeometry, withMarketVisibleRange, createTechnicalChartViewState, serializeTechnicalChartViewState, parseTechnicalChartViewState, type MarketTimeAxis } from "../core";
import { createSuppliedDrawingRenderers } from "../drawings/supplied-renderers";

const theme = { background:"white", text:"black", border:"gray", grid:"gray", positive:"green", negative:"red", primary:"blue" };
const bar = (time: number) => ({time,open:10,high:12,low:9,close:11,volume:100});
const start = Date.parse("2026-03-06T14:30:00Z") / 1000;
const hour = 3600, day = 86400;
const dense = Array.from({length:9},(_,i)=>bar(start+i*day));
const sparse = [dense[0],dense[3],dense[4],dense[8]];
const axes: MarketTimeAxis[] = [
  {mode:"utc",domain:{from:start,to:start+8*day},intervalSeconds:day},
  {mode:"calendar",times:dense.map(b=>b.time)},
];
afterEach(()=>{ vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("host-owned calendar geometry",()=>{
  it.each(axes)("aligns dense/sparse samples and whitespace in $mode without touching observations",axis=>{
    const store=new IndexedOhlcStore(sparse), a=new LogicalTimeScale(store,1000,100),b=new LogicalTimeScale(new IndexedOhlcStore(dense),1000,100);
    a.setAxis(axis);b.setAxis(axis);
    for (const sample of sparse) expect(a.timeToCoordinate(sample.time)).toBe(b.timeToCoordinate(sample.time));
    const whitespace=start+2*day;
    expect(a.timeToCoordinate(whitespace)).toBe(225);
    expect(a.coordinateToIndex(225)).toBe(-1);
    expect(a.coordinateToTime(225)).toBe(whitespace);
    expect(store.toArray()).toEqual(sparse);expect(store.length).toBe(4);
    expect(a.visibleTimes()).toEqual({from:start,to:start+8*day});
    a.setVisibleTimes(start+day,start+5*day);b.setVisibleTimes(start+day,start+5*day);
    expect(a.timeToCoordinate(start+3*day)).toBe(b.timeToCoordinate(start+3*day));
    a.setWidth(500);expect(a.timeToCoordinate(start+3*day)).toBe(200);
    a.setStore(new IndexedOhlcStore([sparse[1]]));expect(a.visibleTimes()).toEqual({from:start+day,to:start+5*day});
  });
  it("uses UTC seconds through DST/weekends, exact intraday windows and empty windows",()=>{
    const a=new LogicalTimeScale(new IndexedOhlcStore([bar(start),bar(start+3*day-hour)]),800,72);
    a.setAxis({mode:"utc",domain:{from:start,to:start+8*day},intervalSeconds:60});
    a.setVisibleTimes(start+hour,start+2*hour);
    expect(a.visibleTimes()).toEqual({from:start+hour,to:start+2*hour});
    expect(a.visibleIndexes(0)).toEqual({from:1,to:1});
    a.setVisibleTimes(start+hour,start+hour+300);expect(a.visibleTimes()).toEqual({from:start+hour,to:start+hour+300});
    expect(a.shiftTime(start+hour,1)).toBe(start+hour+60);
    a.setVisibleTimes(start+hour,start+hour);expect(a.timeToCoordinate(start+hour)).toBeCloseTo(364);
  });
  it("keeps compressed defaults and version-1 documents, rejects invalid grids",()=>{
    const a=new LogicalTimeScale(new IndexedOhlcStore(sparse),1000,100);
    expect(a.timeToCoordinate(start+3*day)).toBe(300);expect(a.timeToCoordinate(start+day)).toBeNull();
    expect(validateMarketTimeGeometry({mode:"calendar",times:[2,1]})).toHaveLength(1);
    expect(validateMarketTimeGeometry({mode:"utc",domain:{from:1,to:1},intervalSeconds:0})).toHaveLength(1);
    expect(()=>a.setAxis({mode:"calendar",times:[]})).toThrow();
    const viewport=withMarketVisibleRange({logicalRange:{from:2,to:8},rightOffsetBars:28},{from:start,to:start+day});
    expect(viewport.logicalRange).toBeUndefined();expect(viewport.rightOffsetBars).toBe(28);
    const state=createTechnicalChartViewState();expect(parseTechnicalChartViewState(serializeTechnicalChartViewState(state))).toEqual(state);
  });
  it("treats declared intervals as open, without cadence inference",()=>{
    const gaps=[{from:1,to:5}];expect(isMarketTimeInGap(1,gaps)).toBe(false);expect(isMarketTimeInGap(3,gaps)).toBe(true);
    expect(crossesMarketTimeGap(1,5,gaps)).toBe(true);expect(crossesMarketTimeGap(1,5)).toBe(false);
  });
});

describe("discontinuous rendering and inspection",()=>{
  let context: CanvasRenderingContext2D;
  beforeEach(()=>{
    const methods=new Map<PropertyKey,unknown>();context=new Proxy({}, {get:(_target,key)=>{if(!methods.has(key)) methods.set(key,vi.fn());return methods.get(key);},set:(_target,key,value)=>{methods.set(key,value);return true;}}) as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype,"getContext").mockReturnValue(context);
    vi.spyOn(HTMLElement.prototype,"clientWidth","get").mockReturnValue(800);
  });
  it.each(["line","area","baseline"] as const)("breaks %s strokes/fills and displays singleton segments",type=>{
    const visible=[bar(1),bar(2),bar(6),bar(9),bar(10)];
    builtInSeriesRenderers.find(r=>r.id===type)!.draw({context,visible,startIndex:0,barSpacing:50,logicalToCoordinate:i=>i*50,timeToCoordinate:t=>Number(t)*10,isTimeSegmentContinuous:(a,b)=>!crossesMarketTimeGap(a,b,[{from:2,to:6},{from:6,to:9}]),scale:{toCoordinate:v=>v},pane:{id:"price",top:0,height:200,width:500},theme} as MarketSeriesRendererContext);
    expect(context.moveTo).toHaveBeenCalledWith(10,11);expect(context.moveTo).toHaveBeenCalledWith(90,11);
    expect(context.lineTo).not.toHaveBeenCalledWith(60,11);expect(context.fillRect).toHaveBeenCalledWith(58,9,4,4);
    if(type==="area") expect(context.fill).toHaveBeenCalledTimes(2);
  });
  it("aligns sparse studies, clears whitespace inspection and rejects viewport callback echoes",async()=>{
    const host=document.createElement("div"), onCrosshairChange=vi.fn(), onVisibleRangeChange=vi.fn(),onViewportChange=vi.fn();
    const e=createMarketChartEngine(host,{chartType:"line",data:sparse,height:400,showVolume:true,scaleMode:"normal",markers:[],theme,timeAxis:axes[0],discontinuities:[{from:start,to:start+3*day}],viewport:{logicalRange:{from:0,to:1},visibleRange:{from:start,to:start+8*day}},onCrosshairChange,onVisibleRangeChange,onViewportChange});
    e.setIndicatorSeries([{id:"study",paneId:"price",placement:"overlay",style:"line",color:"purple",points:[{time:start+3*day,value:55},{time:start+8*day,value:66}]}]);
    await new Promise(r=>setTimeout(r,40));
    expect(e.getSnapshot().visibleRange).toEqual({from:start,to:start+8*day});
    e.setCrosshairPosition(start+3*day,11);expect(e.getSnapshot().crosshair?.values.study).toBe(55);
    e.setCrosshairPosition(start+2*day,11);expect(e.getSnapshot().crosshair).toBeNull();
    e.setCrosshairPosition(start+3*day,11);
    host.querySelector("canvas")!.dispatchEvent(new MouseEvent("pointermove",{clientX:182,clientY:100}));
    expect(e.getSnapshot().crosshair).toBeNull();expect(onCrosshairChange).toHaveBeenLastCalledWith(null);
    e.setData([sparse[1]]);expect(onVisibleRangeChange).not.toHaveBeenCalled();
    host.querySelector("canvas")!.dispatchEvent(new WheelEvent("wheel",{clientX:300,deltaY:-100,cancelable:true}));
    expect(onViewportChange).toHaveBeenCalledTimes(1);
    const next=onViewportChange.mock.calls[0][0];expect(next.logicalRange).toBeUndefined();
    e.setViewport?.({...next,logicalRange:{from:0,to:1}});e.setData(sparse);
    expect(onViewportChange).toHaveBeenCalledTimes(1);expect(e.getSnapshot().visibleRange).toEqual(next.visibleRange);
    expect(e.pointForCoordinate({x:400,y:100})?.time).toBeTypeOf("number");e.destroy();
  });
  it("breaks supplied VWAP at gaps/nulls and retains singleton values",()=>{
    const renderer=createSuppliedDrawingRenderers(["anchored-vwap"],{v:{kind:"drawing",status:"available",requestKey:"test",provenanceLabel:"host",points:[{time:1,value:10},{time:2,value:11},{time:6,value:12},{time:7,value:null},{time:9,value:13}]}})[0];
    const drawing={id:"v",type:"anchored-vwap",version:1,visible:true,locked:false,parameters:{},points:[]};
    const primitives=renderer.getPrimitives({drawing,points:[],bounds:{width:500,height:300},data:[],resolveRange:()=>[],coordinateFor:p=>({x:Number(p.time)*10,y:p.price}),isTimeSegmentContinuous:(a,b)=>!crossesMarketTimeGap(a,b,[{from:2,to:6}])});
    expect(primitives.filter(p=>p.kind==="path")).toHaveLength(1);expect(primitives.filter(p=>p.kind==="ellipse")).toHaveLength(2);
  });
});
