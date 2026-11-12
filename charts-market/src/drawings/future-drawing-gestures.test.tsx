import * as React from 'react';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {DrawingLayer} from './drawing-layer';
import {trendLineDrawing,type DrawingChangeMetadata} from '.';
import {LogicalTimeScale} from '../engine/time-scale';
import {IndexedOhlcStore} from '../engine/data-store';
import type {DrawingState,MarketChartEngine,DrawingPoint} from '../core';
const day=86400,start=Date.UTC(2026,0,1)/1000;
const data=[start,start+day].map(time=>({time,open:100,high:110,low:90,close:105,volume:1}));
function pointer(type:string,x:number,y:number){const e=new MouseEvent(type,{bubbles:true,cancelable:true,button:0,clientX:x,clientY:y});Object.defineProperties(e,{pointerId:{value:1},isPrimary:{value:true},pointerType:{value:'mouse'}});return e;}
beforeEach(()=>{vi.spyOn(SVGElement.prototype,'getBoundingClientRect').mockReturnValue({left:0,top:0,width:1000,height:400} as DOMRect);});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function fixture(initial:DrawingState[]=[],active=true){
 const scale=new LogicalTimeScale(new IndexedOhlcStore(data),1000,0);scale.setAxis({mode:'compressed',futureDisplay:{convention:'utc-calendar',intervalSeconds:day}});scale.setLogicalRange({from:0,to:366});
 const api={coordinateFor:(p:DrawingPoint)=>{const x=scale.timeToCoordinate(p.time);return x==null?null:{x,y:p.price};},pointForCoordinate:(p:{x:number;y:number})=>{const time=scale.coordinateToTime(p.x);return time==null?null:{time,price:p.y};},shiftTime:(time:DrawingPoint['time'],n:number)=>scale.shiftTime(time,n),getSnapshot:()=>({visibleRange:scale.visibleTimes(),panes:[],scales:{},crosshair:null})} as unknown as MarketChartEngine;
 let drawings=initial;const commits:{drawings:DrawingState[];metadata?:DrawingChangeMetadata}[]=[];
 function Harness(){const [state,setState]=React.useState(initial),[tool,setTool]=React.useState(active?trendLineDrawing:undefined),[selected,setSelected]=React.useState(initial.map(d=>d.id));drawings=state;return <DrawingLayer aria-label="Future drawing layer" futureDisplay engine={api} drawings={state} selectedDrawingIds={selected} onSelectedDrawingIdsChange={setSelected} activeTool={tool} onActiveToolComplete={()=>setTool(undefined)} calculationMode="supplied" interaction={{snapMode:'off'}} tools={[trendLineDrawing]} onDrawingsChange={(next,metadata)=>{commits.push({drawings:next,metadata});setState(next);}}/>;}
 const view=render(<Harness/>);return {api,scale,view,commits,drawings:()=>drawings,layer:screen.getByRole('application')};
}
describe('future drawing editing through the shared coordinate port',()=>{
 it('creates into the future, resizes an actual handle and moves the extended body without changing ID',()=>{
  const f=fixture();fireEvent(f.layer,pointer('pointerdown',0,140));fireEvent(f.layer,pointer('pointermove',600,220));expect(f.commits).toHaveLength(0);fireEvent(f.layer,pointer('pointerup',600,220));
  const original=f.drawings()[0];expect(Number(original.points[1].time)).toBeGreaterThan(data[1].time+200*day);expect(f.commits.filter(c=>c.metadata?.type==='create')).toHaveLength(1);
  fireEvent(f.layer,pointer('pointerdown',600,220));fireEvent(f.layer,pointer('pointermove',700,240));fireEvent(f.layer,pointer('pointerup',700,240));
  expect(f.drawings()[0].id).toBe(original.id);expect(f.drawings()[0].points[0]).toEqual(original.points[0]);expect(Number(f.drawings()[0].points[1].time)).toBeGreaterThan(Number(original.points[1].time));
  fireEvent.click(screen.getByRole('button',{name:'Extend right'}));const styled=f.drawings()[0],p1=f.api.coordinateFor(styled.points[0])!,p2=f.api.coordinateFor(styled.points[1])!;
  const x=850,y=p1.y+(p2.y-p1.y)*(x-p1.x)/(p2.x-p1.x);
  fireEvent(f.layer,pointer('pointerdown',x,y));fireEvent(f.layer,pointer('pointermove',x+10,y+5));fireEvent(f.layer,pointer('pointerup',x+10,y+5));
  expect(f.drawings()[0].id).toBe(original.id);expect(f.drawings()[0].parameters.extendRight).toBe(true);expect(f.commits.filter(c=>c.metadata?.type==='move')).toHaveLength(1);
 });
 it.each(['pointercancel','blur','unmount'] as const)('cancels future draft on %s without committing',kind=>{
  const f=fixture();fireEvent(f.layer,pointer('pointerdown',200,140));fireEvent(f.layer,pointer('pointermove',600,220));
  if(kind==='blur')fireEvent(window,new Event('blur'));else if(kind==='unmount')f.view.unmount();else fireEvent(f.layer,pointer('pointercancel',600,220));
  expect(f.commits).toHaveLength(0);expect(f.drawings()).toEqual([]);
 });
 it('nudges future anchors in declared display slots and refuses fallback beyond the horizon',()=>{
  const d:DrawingState={id:'stable',type:'trend-line',version:1,points:[{time:start+day*365,price:140},{time:start+day*366,price:220}],parameters:{extendLeft:true},visible:true,locked:false};
  const f=fixture([d],false);fireEvent.keyDown(f.layer,{key:'ArrowRight'});
  expect(f.drawings()[0].points[1].time).toBe(d.points[1].time);expect(f.drawings()[0].points[0].time).toBe(d.points[0].time);expect(f.drawings()[0].id).toBe(d.id);
 });
});
