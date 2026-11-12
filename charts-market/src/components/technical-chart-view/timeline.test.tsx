import * as React from 'react';
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TechnicalChartView} from '.';
import type {MarketChartHandle} from '../market-chart';
import {createTechnicalChartViewState} from '../../core';
const data=Array.from({length:40},(_,i)=>({time:Date.UTC(2025,11,1+i)/1000,open:100,high:110,low:90,close:105}));
beforeEach(()=>{
 vi.stubGlobal('ResizeObserver',class{constructor(private cb:ResizeObserverCallback){}observe(target:Element){this.cb([{target,contentRect:{width:430,height:400}} as ResizeObserverEntry],this as unknown as ResizeObserver);}unobserve(){}disconnect(){}});
 vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(430);
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('timeline footer public state',()=>{
 function Harness({api,workspace=true,changed=()=>{}}:{api:React.RefObject<MarketChartHandle|null>;workspace?:boolean;changed?:(type:string)=>void}){
  const [state,setState]=React.useState(()=>{const s=createTechnicalChartViewState('price-only');s.indicators=[];s.profiles=[];s.drawings=[];s.panes=s.panes.slice(0,1).map(p=>({...p,studyIds:[],showVolume:false}));s.viewport={};return s;});
  return <TechnicalChartView chartApiRef={api} symbol="SYNTHETIC" interval="1D" data={data} state={state} onStateChange={(next,m)=>{changed(m.type);setState(next);}}
   calculationMode="supplied" calculationIdentity="synthetic-footer" interactions={workspace?{mode:'workspace'}:undefined} timeAxis={{mode:'calendar',times:data.map(b=>b.time)}}
   appearance={{height:400,timeline:{scaleControls:'icons'}}} features={{header:false,commands:false,drawingRail:false,dataTable:false}} rangeShortcuts={[]} footerActions={<button>Host earnings action</button>}/>;
 }
 it('uses distinct accessible current-state icons after native axis scale/reset and log switching',async()=>{
  const api=React.createRef<MarketChartHandle>(),changed=vi.fn();const view=render(<Harness api={api} changed={changed}/>);
  const auto=await screen.findByRole('button',{name:/Automatic price scale/});await waitFor(()=>expect(api.current?.getSnapshot()?.scales.price).toBeDefined());
  const autoIcon=auto.querySelector('svg')!.innerHTML;
  fireEvent.wheel(view.container.querySelector('canvas')!,{clientX:420,clientY:150,deltaY:35});
  const manual=await screen.findByRole('button',{name:/Manual price scale/});expect(manual).toHaveAttribute('aria-pressed','false');expect(manual.querySelector('svg')!.innerHTML).not.toBe(autoIcon);
  fireEvent.click(manual);await screen.findByRole('button',{name:/Automatic price scale/});
  const linear=screen.getByRole('button',{name:/Linear price scale/}),linearIcon=linear.querySelector('svg')!.innerHTML;fireEvent.click(linear);
  const log=await screen.findByRole('button',{name:/Logarithmic price scale/});expect(log).toHaveAttribute('aria-pressed','true');expect(log.querySelector('svg')!.innerHTML).not.toBe(linearIcon);
  expect(changed.mock.calls.every(([type])=>type==='scale')).toBe(true);expect(screen.getByRole('button',{name:'Host earnings action'})).toBeVisible();
 });
 it('retains the very first logical pan through a nonworkspace controlled offset echo',async()=>{
  const api=React.createRef<MarketChartHandle>(),changed=vi.fn();const view=render(<Harness api={api} workspace={false} changed={changed}/>);
  await waitFor(()=>expect(api.current?.getSnapshot()?.scales.price).toBeDefined());
  const canvas=view.container.querySelector('canvas')!;fireEvent.keyDown(canvas,{key:'ArrowRight',shiftKey:true});const first=api.current!.getSnapshot()!.viewport!.logicalRange;
  await act(()=>new Promise(r=>setTimeout(r,350)));expect(api.current!.getSnapshot()!.viewport!.logicalRange).toEqual(first);expect(first?.from).toBeGreaterThan(0);expect(changed).toHaveBeenCalledWith('viewport');
 });
 it('keeps snapshot observers current without rebuilding the engine',async()=>{
  const api=React.createRef<MarketChartHandle>();render(<Harness api={api}/>);await waitFor(()=>expect(api.current?.getSnapshot()?.priceAxis?.width).toBe(88));
  act(()=>api.current!.resetPaneScale('price'));await screen.findByRole('button',{name:/Automatic price scale/});expect(api.current!.getSnapshot()?.priceAxis?.surfaceWidth).toBe(430);
 });
});
