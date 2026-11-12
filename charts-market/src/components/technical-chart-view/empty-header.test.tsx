import * as React from 'react';
import {act,cleanup,render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TechnicalChartView,useTechnicalPaneMenu} from '.';
import {createTechnicalChartViewState,type TechnicalChartViewState} from '../../core';
import {StudyLegend,type StudyLegendGroup} from './study-legend';
import {boardBars,boardState} from './board-card-fixture';

let measuredHeader=28;
const resizeCallbacks=new Set<()=>void>();
beforeEach(()=>{
 vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(430);
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){const height=this.hasAttribute('data-chart-pane-header')||this.getAttribute('aria-label')==='Visible chart legend'?measuredHeader:0;return{x:0,y:0,left:0,right:430,top:0,bottom:height,width:430,height,toJSON(){return {};}};});
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);
 vi.stubGlobal('ResizeObserver',class{targets=new Set<Element>();fire:()=>void;constructor(callback:ResizeObserverCallback){this.fire=()=>callback([...this.targets].map(target=>({target,contentRect:target.getBoundingClientRect()} as ResizeObserverEntry)),this as unknown as ResizeObserver);resizeCallbacks.add(this.fire);}observe(target:Element){this.targets.add(target);}unobserve(target:Element){this.targets.delete(target);}disconnect(){resizeCallbacks.delete(this.fire);this.targets.clear();}});
 measuredHeader=28;
});
afterEach(()=>{cleanup();resizeCallbacks.clear();vi.restoreAllMocks();vi.unstubAllGlobals();});
function Harness({state=boardState(),internal=false,workspace=false}:{state?:TechnicalChartViewState;internal?:boolean;workspace?:boolean}){
 const menu=useTechnicalPaneMenu();return <><button {...menu.getTriggerProps('price')}>External BB title</button><TechnicalChartView symbol="SYNTHETIC" interval="5m" data={boardBars} state={state} onStateChange={()=>{}} calculationMode="supplied" calculationIdentity="header-fixture" {...(!internal?{paneMenu:menu.paneMenu,onPaneMenuChange:menu.onPaneMenuChange,paneMenuTrigger:'none' as const}:{})} interactions={workspace?{mode:'workspace',contextKey:'header-fixture'}:undefined} appearance={{height:280,legends:'compact',suppliedDetails:false}} features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/></>;
}
const ohlcTop=()=>parseFloat(screen.getByLabelText('OHLC readout').style.top);
describe('public composite empty pane header',()=>{
 it('removes the empty external-title band and keeps exact OHLC pairs at the normal pane top',async()=>{
  render(<Harness/>);await screen.findByLabelText('OHLC readout');await waitFor(()=>expect(ohlcTop()).toBe(0));
  expect(screen.queryByLabelText('Visible chart legend')).not.toBeInTheDocument();expect(screen.getByLabelText(`close: ${boardBars.at(-1)!.close}`)).toHaveAttribute('title',String(boardBars.at(-1)!.close));
 });
 it('keeps internal defaults and workspace controls even without legend groups',async()=>{
  const view=render(<Harness internal/>);await screen.findByRole('button',{name:'SYNTHETIC pane actions'});await waitFor(()=>expect(ohlcTop()).toBeGreaterThanOrEqual(28));view.unmount();
  render(<Harness workspace/>);await screen.findByRole('button',{name:'Reorder SYNTHETIC pane'});await waitFor(()=>expect(ohlcTop()).toBeGreaterThanOrEqual(28));
 });
 it('remeasures genuine content and clears stale height through study/visibility/unknown/volume/profile changes',async()=>{
  const view=render(<Harness/>);await screen.findByLabelText('OHLC readout');await waitFor(()=>expect(ohlcTop()).toBe(0));
  const study=boardState();study.indicators=[{id:'one',definitionId:'sma',version:1,visible:true,parameters:{period:5}}];study.panes[0].studyIds=['one'];
  view.rerender(<Harness state={study}/>);await screen.findByRole('button',{name:'Legend: all 1 study and overlay mappings'});await waitFor(()=>expect(ohlcTop()).toBe(28));
  measuredHeader=60;act(()=>resizeCallbacks.forEach(callback=>callback()));await waitFor(()=>expect(ohlcTop()).toBe(60));
  const hidden={...study,indicators:study.indicators.map(item=>({...item,visible:false}))};view.rerender(<Harness state={hidden}/>);await waitFor(()=>expect(ohlcTop()).toBe(0));
  const unknown={...study,indicators:study.indicators.map(item=>({...item,definitionId:'unknown-host-study'}))};view.rerender(<Harness state={unknown}/>);await waitFor(()=>expect(ohlcTop()).toBe(0));
  measuredHeader=28;const volume=boardState();volume.panes[0].showVolume=true;view.rerender(<Harness state={volume}/>);await screen.findByRole('button',{name:'Legend: all 1 study and overlay mappings'});await waitFor(()=>expect(ohlcTop()).toBe(28));
  const profile=boardState();profile.profiles=createTechnicalChartViewState().profiles.slice(0,1);view.rerender(<Harness state={profile}/>);await waitFor(()=>expect(ohlcTop()).toBe(28));
  view.rerender(<Harness/>);await waitFor(()=>expect(ohlcTop()).toBe(0));
 });
 it('retains keyboard external-menu ownership and return focus with an empty header',async()=>{
  const user=userEvent.setup();render(<Harness/>);await screen.findByLabelText('OHLC readout');const title=screen.getByRole('button',{name:'External BB title'});title.focus();await user.keyboard('{Enter}');expect(await screen.findByRole('menu',{name:'SYNTHETIC pane actions'})).toBeVisible();
  await user.keyboard('{Escape}');await waitFor(()=>expect(title).toHaveFocus());await waitFor(()=>expect(ohlcTop()).toBe(0));
 });
});
describe('empty StudyLegend presence',()=>{
 it('reports zero for no groups, measures wrapped content, and closes removed readout dialogs',async()=>{
  const user=userEvent.setup(),height=vi.fn(),groups:StudyLegendGroup[]=[{id:'one',label:'Genuine mapping',lines:[{label:'Value',value:123,color:'#2563eb'}]}];
  const props={width:430,timeLabel:'Last observation',showIdentity:true,onHeightChange:height};const view=render(<StudyLegend {...props} groups={[]}/>);
  expect(screen.queryByLabelText('Visible chart legend')).not.toBeInTheDocument();expect(height).toHaveBeenLastCalledWith(0);
  measuredHeader=60;view.rerender(<StudyLegend {...props} groups={groups}/>);await waitFor(()=>expect(height).toHaveBeenLastCalledWith(60));await user.click(screen.getByRole('button',{name:'Legend: all 1 study and overlay mappings'}));expect(await screen.findByRole('dialog')).toBeVisible();
  view.rerender(<StudyLegend {...props} groups={[]}/>);await waitFor(()=>expect(screen.queryByRole('dialog')).not.toBeInTheDocument());expect(height).toHaveBeenLastCalledWith(0);
  view.rerender(<StudyLegend {...props} groups={groups}/>);expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 });
});
