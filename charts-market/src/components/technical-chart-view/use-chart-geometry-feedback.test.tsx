import * as React from 'react';
import {act,cleanup,render,screen} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {useChartGeometry} from './use-chart-geometry';
import type {TechnicalChartGeometry} from '../../core';

let natural=300,livePlot=236.7;
const observers=new Set<()=>void>();
function Harness({reported=120,total=300,mode='available',minimum=120,onGeometry}:{reported?:number;total?:number;mode?:'plot'|'available';minimum?:number;onGeometry?:(geometry:TechnicalChartGeometry)=>void}){
 const root=React.useRef<HTMLDivElement>(null),content=React.useRef<HTMLDivElement>(null),plot=React.useRef<HTMLDivElement>(null);
 const height=Reflect.apply(useChartGeometry,undefined,[root,total,mode,minimum,onGeometry,reported,content,plot]) as number;
 return <div ref={root} data-testid="root"><div ref={content} data-testid="natural"><div ref={plot} data-testid="plot"/></div><output>{height}</output></div>;
}
beforeEach(()=>{
 natural=300;livePlot=236.7;
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return {width:430,height:this.dataset.testid==='plot'?livePlot:natural,x:0,y:0,left:0,right:430,top:0,bottom:0,toJSON(){return {};}};});
 vi.stubGlobal('ResizeObserver',class{callback:()=>void;constructor(callback:()=>void){this.callback=callback;observers.add(callback);}observe(){}unobserve(){}disconnect(){observers.delete(this.callback);}});
});
afterEach(()=>{cleanup();observers.clear();vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('coherent available-height DOM measurements',()=>{
 it('ignores an out-of-phase reported canvas height and remains stable across fresh callback/props',()=>{
  const first=vi.fn(),second=vi.fn();const view=render(<Harness reported={120} onGeometry={first}/>);
  expect(screen.getByRole('status').textContent).toBe('236');
  expect(first).toHaveBeenLastCalledWith(expect.objectContaining({chromeHeight:63.30000000000001,plotHeight:236,renderedPlotHeight:236.7,intrinsicHeight:300}));
  view.rerender(<Harness reported={237} onGeometry={second}/>);act(()=>observers.forEach(fn=>fn()));
  expect(screen.getByRole('status').textContent).toBe('236');expect(second).not.toHaveBeenCalled();
  natural=320;act(()=>observers.forEach(fn=>fn()));expect(screen.getByRole('status').textContent).toBe('216');expect(second).toHaveBeenLastCalledWith(expect.objectContaining({plotHeight:216,chromeHeight:83.30000000000001}));
 });
 it('reports intrinsic overflow at minimum and preserves plot-mode height',()=>{
  natural=340;livePlot=280;const onGeometry=vi.fn();const view=render(<Harness total={200} minimum={160} reported={120} onGeometry={onGeometry}/>);
  expect(screen.getByRole('status').textContent).toBe('160');expect(onGeometry).toHaveBeenLastCalledWith(expect.objectContaining({chromeHeight:60,plotHeight:160,renderedPlotHeight:280,intrinsicHeight:340,overflow:true}));
  view.rerender(<Harness total={200} minimum={160} reported={120} mode="plot" onGeometry={onGeometry}/>);expect(screen.getByRole('status').textContent).toBe('200');expect(onGeometry).toHaveBeenLastCalledWith(expect.objectContaining({plotHeight:200,overflow:false}));
 });
});
