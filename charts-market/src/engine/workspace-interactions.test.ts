import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {createMarketChartEngine} from '.';
import type {MarketChartEngine,MarketChartEngineOptions,TechnicalPaneState} from '../core';
import {LogicalTimeScale} from './time-scale';import{IndexedOhlcStore}from'./data-store';import{PaneLayout}from'./pane-layout';
const data=Array.from({length:500},(_,i)=>({time:i+1,open:100,high:110,low:90,close:102,volume:1000}));
const theme={background:'white',text:'black',border:'gray',grid:'lightgray',positive:'green',negative:'red',primary:'blue'};
const panes:TechnicalPaneState[]=[{id:'price',order:0,size:4.2,minimumSize:420,studyIds:[]},{id:'rsi',order:1,size:2,minimumSize:200,studyIds:['rsi'],scaleSide:'left'}];
const delay=()=>new Promise(r=>setTimeout(r,35));
describe('workspace engine routing and geometry',()=>{
 let engine:MarketChartEngine;beforeEach(()=>{vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()})as unknown as CanvasRenderingContext2D);vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(900);});afterEach(()=>{engine?.destroy();vi.restoreAllMocks();});
 const create=(extra:Partial<MarketChartEngineOptions>={})=>{const host=document.createElement('div');engine=createMarketChartEngine(host,{data,chartType:'candlestick',height:500,showVolume:false,scaleMode:'normal',theme,markers:[],panes,interactions:{mode:'workspace',rightPaddingBars:10},viewport:{logicalRange:{from:100,to:200}},...extra});engine.setIndicatorSeries([{id:'rsi:rsi',paneId:'rsi',placement:'pane',style:'line',color:'blue',fixedDomain:[0,100],points:data.map(b=>({time:b.time,value:50}))}]);return host.querySelector('canvas')!;};
 it('grows overflowing content and gives each axis only its actual pane on either side',async()=>{
  const ranges=vi.fn(),interaction=vi.fn(),extent=vi.fn();const canvas=create({onVisibleRangeChange:ranges,onInteractionStateChange:interaction,onContentHeightChange:extent});await delay();expect(extent.mock.calls.at(-1)![0]).toBeGreaterThanOrEqual(648);const before=engine.getSnapshot();const rsi=before.panes.find(p=>p.id==='rsi')!;
  canvas.dispatchEvent(new WheelEvent('wheel',{clientX:10,clientY:rsi.top+60,deltaY:60,cancelable:true}));await delay();const after=engine.getSnapshot();expect(after.scales.price).toEqual(before.scales.price);expect(after.scales.rsi.maximum-after.scales.rsi.minimum).not.toBe(100);expect(interaction.mock.calls.at(-1)![1]).toMatchObject({source:'user',gesture:'value-scale',paneId:'rsi'});expect(ranges).not.toHaveBeenCalled();
  canvas.dispatchEvent(new MouseEvent('dblclick',{clientX:10,clientY:rsi.top+60}));await delay();expect(engine.getSnapshot().scales.rsi.minimum).toBe(0);expect(engine.getSnapshot().scales.rsi.maximum).toBe(100);
  canvas.dispatchEvent(new WheelEvent('wheel',{clientX:875,clientY:180,deltaY:-20,cancelable:true}));await delay();expect(engine.getSnapshot().scales.rsi).toEqual(before.scales.rsi);expect(engine.getSnapshot().scales.price).not.toEqual(before.scales.price);
 });
 it('retains logical anchors through delayed controlled echoes, layout/theme and same-dataset revisions',async()=>{
  const view=vi.fn();const canvas=create({onViewportChange:view});await delay();canvas.dispatchEvent(new WheelEvent('wheel',{clientX:300,clientY:180,deltaY:-20,cancelable:true}));const first=view.mock.calls.at(-1)![0];canvas.dispatchEvent(new WheelEvent('wheel',{clientX:300,clientY:180,deltaX:80,deltaY:1,cancelable:true}));const current=engine.getSnapshot().viewport!.logicalRange;
  engine.setViewport?.(first);expect(engine.getSnapshot().viewport!.logicalRange).toEqual(current);engine.setViewport?.({...first,logicalRange:undefined});expect(engine.getSnapshot().viewport!.logicalRange).toEqual(current);
  engine.setTheme?.({...theme,background:'black'});engine.resize(700,500);engine.setData(data.map(b=>b.time===150?{...b,close:105}:b));expect(engine.getSnapshot().viewport!.logicalRange).toEqual(current);
  engine.setViewportCommand?.({visibleRange:{from:20,to:60}});expect(engine.getSnapshot().visibleRange!.from).toBe(20);
  const commanded=engine.getSnapshot().viewport!.logicalRange;
  engine.setViewport?.(first);expect(engine.getSnapshot().viewport!.logicalRange).toEqual(commanded);
  engine.setViewport?.({...first,logicalRange:undefined});expect(engine.getSnapshot().viewport!.logicalRange).toEqual(commanded);
  // A command can intentionally revisit an emitted viewport; acknowledgements cannot.
  engine.setViewportCommand?.(first);expect(engine.getSnapshot().viewport!.logicalRange).toEqual(first.logicalRange);
 });
 it('does not intercept Ctrl/Meta or workspace gutters and routes time axis independently',async()=>{
  const canvas=create();await delay();for(const extra of [{ctrlKey:true},{metaKey:true}]){const e=new WheelEvent('wheel',{clientX:300,clientY:180,deltaY:40,cancelable:true,...extra});canvas.dispatchEvent(e);expect(e.defaultPrevented).toBe(false);}
  const gutter=new WheelEvent('wheel',{clientX:60,clientY:180,deltaY:40,cancelable:true});canvas.dispatchEvent(gutter);expect(gutter.defaultPrevented).toBe(false);
  const before=engine.getSnapshot().viewport!.logicalRange!;canvas.dispatchEvent(new MouseEvent('dblclick',{clientX:300,clientY:canvas.height-10}));expect(engine.getSnapshot().viewport!.logicalRange!.from).toBe(0);expect(engine.getSnapshot().viewport!.logicalRange!.to).toBe(509);expect(before.from).toBeGreaterThan(0);
 });
 it('maximizes temporarily without altering definitions or manual scales; removal restores safely',async()=>{
  const original=JSON.stringify(panes);create({interactionState:{paneScales:{rsi:{mode:'normal',autoScale:false,manualRange:{minimum:-40,maximum:160}}}}});await delay();engine.setInteractionState?.({maximizedPaneId:'rsi',paneScales:{rsi:{mode:'normal',autoScale:false,manualRange:{minimum:-40,maximum:160}}}});await delay();expect(engine.getSnapshot().panes.map(p=>p.id)).toEqual(['rsi']);expect(engine.getSnapshot().scales.rsi.minimum).toBe(-40);engine.setInteractionState?.({});expect(engine.getSnapshot().panes.map(p=>p.id)).toEqual(['price','rsi']);engine.setInteractionState?.({maximizedPaneId:'rsi'});engine.setPanes?.([panes[0]]);expect(engine.getSnapshot().panes.map(p=>p.id)).toEqual(['price']);expect(JSON.stringify(panes)).toBe(original);
 });
});
describe('blank space and minimum-safe workspace geometry',()=>{
 it('Fit/Latest pad ten, panning is bounded by150, and blank space has no observations',()=>{
  const scale=new LogicalTimeScale(new IndexedOhlcStore(data),900);scale.setWorkspacePadding(10);scale.fitContent();expect(scale.visible).toEqual({from:0,to:509});scale.setLogicalRange({from:450,to:550});scale.scrollToRealtime();expect(scale.visible).toEqual({from:409,to:509});scale.panPixels(-1e9);expect(scale.visible.to).toBe(649);expect(scale.coordinateToIndex(800)).toBe(-1);expect(scale.coordinateToTime(800)).toBeNull();scale.setLogicalRange({from:520,to:560});expect(scale.visibleTimes()).toBeNull();
 });
 it('never shrinks supplied pane minimums; separator can grow the content at minimums',()=>{
  const layout=new PaneLayout(800,648);layout.setWorkspace(true);layout.setDefinitions(panes);const before=layout.panes;const sizes=layout.resizeBoundary(0,100);expect(layout.panes[0].height).toBeGreaterThanOrEqual(before[0].height+100);expect(layout.panes[1].height).toBeGreaterThanOrEqual(200);expect(layout.contentHeight).toBeGreaterThanOrEqual(748);expect(sizes.price).toBeCloseTo(5.2);
 });
 it('does not change host calendar domains or create OHLC for zero/one-bar padding',()=>{
  const calendar=new LogicalTimeScale(new IndexedOhlcStore(data.slice(0,1)),900);calendar.setAxis({mode:'calendar',times:[1,2,3]});calendar.setWorkspacePadding(10);calendar.fitContent();expect(calendar.visible).toEqual({from:0,to:2});const empty=new LogicalTimeScale(new IndexedOhlcStore([]),900);empty.setWorkspacePadding(150);expect(empty.visibleTimes()).toBeNull();expect(Number.isFinite(empty.barSpacing)).toBe(true);
 });
});
