import * as React from 'react';
import {describe,it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import type {DrawingRendererContext,DrawingState,MarketChartEngine} from '../core';
import {createSuppliedDrawingRenderers} from './supplied-renderers';
import {hitTestPrimitives} from './geometry';
import {DrawingLayer,DrawingToolbar} from './drawing-layer';
import {trendLineDrawing,horizontalLineDrawing,createDrawingHistory,reduceDrawingHistory} from '.';
const drawing=(parameters:DrawingState['parameters']={},type='trend-line'):DrawingState=>({id:'saved-exact-id',type,version:1,points:[{time:20,price:40},{time:80,price:60}],parameters,visible:true,locked:false});
const context=(d:DrawingState):DrawingRendererContext=>({drawing:d,points:d.points.map(p=>({x:Number(p.time),y:p.price})),bounds:{width:100,height:100},data:[],resolveRange:()=>[],coordinateFor:p=>({x:Number(p.time),y:p.price})});
const primitives=(d:DrawingState)=>createSuppliedDrawingRenderers([d.type],{})[0].getPrimitives(context(d));
afterEach(()=>{cleanup();vi.restoreAllMocks();});
describe('supplied directional trend annotations',()=>{
 for(const reverse of [false,true])for(const [left,right,start,end] of [[false,false,20,80],[true,false,0,80],[false,true,20,100],[true,true,0,100]] as const)it(`left=${left} right=${right} reverse=${reverse}`,()=>{
  const d=drawing({extendLeft:left,extendRight:right});if(reverse)d.points.reverse();const original=JSON.stringify(d);
  const p=primitives(d)[0];expect(p.kind).toBe('line');if(p.kind!=='line')throw Error('line');
  expect(Math.min(p.from.x,p.to.x)).toBe(start);expect(Math.max(p.from.x,p.to.x)).toBe(end);
  expect(hitTestPrimitives({x:(start+end)/2,y:40+((start+end)/2-20)/3},[p],6)).not.toBeNull();
  expect(JSON.stringify(d)).toBe(original);
 });
 it('keeps old segment defaults, actual handles and offscreen endpoints',()=>{
  const d=drawing(),r=createSuppliedDrawingRenderers([d.type],{})[0];expect(primitives(d)[0]).toMatchObject({from:{x:20},to:{x:80}});
  d.points[0].time=-20;d.parameters.extendRight=true;const c=context(d);expect(r.getHandles!(c)[0].position.x).toBe(-20);expect(primitives(d)[0]).toMatchObject({from:{x:0},to:{x:100}});
 });
 it.each([[20,20,40,60],[20,80,40,40],[20,20,40,40]])('handles equal-time/horizontal/coincident anchors %j',(...values)=>{
  const [a,b,c,d]=values,line=drawing({extendLeft:true,extendRight:true});line.points=[{time:a,price:c},{time:b,price:d}];
  expect(primitives(line).length).toBeGreaterThan(0);expect(JSON.stringify(primitives(line))).not.toMatch(/NaN|Infinity|null/);
 });
 it('preserves horizontal legacy full-width, directional rays and selectable both-off marker',()=>{
  for(const [parameters,start,end] of [[{},0,100],[{extendLeft:true,extendRight:false},0,20],[{extendLeft:false,extendRight:true},20,100]] as const){const p=primitives(drawing(parameters,'horizontal-line'))[0];expect(p).toMatchObject({kind:'line',from:{x:start},to:{x:end}});}
  const marker=primitives(drawing({extendLeft:false,extendRight:false},'horizontal-line'));expect(marker[0].kind).toBe('ellipse');expect(hitTestPrimitives({x:20,y:40},marker,6)).not.toBeNull();
 });
 it('serializes booleans and undoes/redoes a single style transaction without replacing anchors/ID',()=>{
  const d=drawing(),next={...d,parameters:{...d.parameters,extendLeft:true,extendRight:false}},initial=createDrawingHistory([d]);
  const h=reduceDrawingHistory(initial,{type:'commit',drawings:[next],metadata:{type:'style',drawingIds:[d.id],transactionId:'one-toggle'}});
  expect(h.past).toHaveLength(1);expect(h.present[0].id).toBe(d.id);expect(h.present[0].points).toEqual(d.points);
  const saved=JSON.parse(JSON.stringify(h.present));expect(saved[0].parameters).toEqual(next.parameters);
  expect(reduceDrawingHistory(h,{type:'undo'}).present).toEqual([d]);expect(reduceDrawingHistory(reduceDrawingHistory(h,{type:'undo'}),{type:'redo'}).present).toEqual([next]);
 });
 it('uses labeled pressed controls on the contextual layer with exactly one style commit',()=>{
  vi.spyOn(SVGElement.prototype,'getBoundingClientRect').mockReturnValue({left:0,top:0,width:400,height:300} as DOMRect);
  const d=drawing(),changed=vi.fn(),api={coordinateFor:(p:{time:number;price:number})=>({x:p.time,y:p.price})} as unknown as MarketChartEngine;
  render(<DrawingLayer engine={api} drawings={[d]} selectedDrawingIds={[d.id]} tools={[trendLineDrawing]} calculationMode="supplied" onDrawingsChange={changed}/>);
  const button=screen.getByRole('button',{name:'Extend left'});expect(button).toHaveAttribute('aria-pressed','false');fireEvent.click(button);
  expect(changed).toHaveBeenCalledTimes(1);expect(changed.mock.calls[0][0][0]).toEqual({...d,parameters:{extendLeft:true}});expect(changed.mock.calls[0][1].type).toBe('style');
 });
 it('does not add extension controls for rectangles, verticals or mixed selections',()=>{
  const cb=vi.fn();const view=render(<DrawingToolbar tools={[trendLineDrawing,horizontalLineDrawing]} selectedDrawings={[drawing({},'vertical-line')]} onStyleCommit={cb} onLineExtensionChange={cb}/>);
  expect(screen.queryByRole('button',{name:'Extend left'})).not.toBeInTheDocument();
  view.rerender(<DrawingToolbar tools={[trendLineDrawing]} selectedDrawings={[drawing(),drawing({},'rectangle')]} onStyleCommit={cb} onLineExtensionChange={cb}/>);expect(screen.queryByRole('button',{name:'Extend left'})).not.toBeInTheDocument();
 });
 it('retains legacy callback payloads and opts standalone line controls into a typed callback',()=>{
  const legacy=vi.fn<(changes:Record<string,string|number>)=>void>(),extensions=vi.fn();
  const view=render(<DrawingToolbar tools={[trendLineDrawing]} selectedDrawing={drawing()} onStyleCommit={legacy}/>);
  expect(screen.queryByRole('button',{name:'Extend right'})).not.toBeInTheDocument();
  view.rerender(<DrawingToolbar tools={[trendLineDrawing]} selectedDrawing={drawing()} onStyleCommit={legacy} onLineExtensionChange={extensions}/>);
  fireEvent.click(screen.getByRole('button',{name:'Extend right'}));expect(extensions).toHaveBeenCalledTimes(1);expect(extensions).toHaveBeenCalledWith({extendLeft:false,extendRight:true});expect(legacy).not.toHaveBeenCalled();
 });
});
