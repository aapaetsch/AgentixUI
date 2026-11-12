import * as React from 'react';
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TechnicalChartView,useTechnicalPaneMenu} from '.';
import {MarketChart,type MarketChartHandle} from '../market-chart';
import {boardBars,boardCalendar,boardGaps,boardState} from './board-card-fixture';
beforeEach(()=>{vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(430);vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function Harness({name='BB title',internal=false,controlledInternal=false,log=false,initialLog=false,api,changed}:{name?:string;internal?:boolean;controlledInternal?:boolean;log?:boolean;initialLog?:boolean;api?:React.Ref<MarketChartHandle>;changed?:(s:ReturnType<typeof boardState>)=>void}){
 const menu=useTechnicalPaneMenu(),[state,setState]=React.useState(()=>{const s=boardState();s.scale.mode=initialLog?'logarithmic':'normal';s.panes[0].scaleMode=s.scale.mode;return s;});
 return <><button {...menu.getTriggerProps('price')}>{name}</button><button>Expand details</button><TechnicalChartView chartApiRef={api} symbol={name} interval="5m" data={boardBars} state={state} onStateChange={s=>{setState(s);changed?.(s);}} calculationMode="supplied" calculationIdentity={name} timeAxis={{mode:'calendar',times:boardCalendar}} discontinuities={boardGaps}
  {...(!internal?{paneMenu:menu.paneMenu,onPaneMenuChange:menu.onPaneMenuChange,paneMenuTrigger:controlledInternal?'internal' as const:'none' as const}:{})} allowLogScale={log} appearance={{height:280,minimumPlotHeight:100,heightMode:'available'}} features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/></>;
}
describe('shared host title menu',()=>{
 it('opens the existing actions by keyboard, honors disabled Log and restores host focus after Escape',async()=>{
  const user=userEvent.setup();render(<Harness/>);const title=screen.getByRole('button',{name:'BB title'});title.focus();await user.keyboard('{Enter}');const menu=await screen.findByRole('menu',{name:'BB title pane actions'});
  expect(screen.queryByRole('button',{name:'BB title pane actions'})).not.toBeInTheDocument();expect(menu).toBeVisible();expect(screen.getByRole('menuitem',{name:'Use logarithmic scale'})).toHaveAttribute('aria-disabled','true');
  await user.keyboard('{Escape}');await waitFor(()=>expect(title).toHaveFocus());expect(title).toHaveAttribute('aria-expanded','false');
  await user.keyboard(' ');await screen.findByRole('menu');await user.click(screen.getByRole('menuitem',{name:'Use 4 decimal places'}));await waitFor(()=>expect(title).toHaveFocus());
  await user.click(title);expect(await screen.findByRole('menuitem',{name:'Use 2 decimal places'})).toBeVisible();
 });
 it('isolates instances and keeps plot and expand clicks from opening a title menu',async()=>{
  const user=userEvent.setup(),view=render(<><Harness name="First"/><Harness name="Second"/></>),first=screen.getByRole('button',{name:'First'});await user.click(screen.getByRole('button',{name:'Second'}));await screen.findByRole('menu',{name:'Second pane actions'});expect(first).toHaveAttribute('aria-expanded','false');
  await user.keyboard('{Escape}');await user.click(screen.getAllByRole('button',{name:'Expand details'})[0]);expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  const canvas=view.container.querySelector('canvas')!;fireEvent.pointerDown(canvas,{clientX:120,clientY:100,buttons:1});fireEvent.pointerMove(canvas,{clientX:220,clientY:100,buttons:1});fireEvent.pointerUp(canvas);fireEvent.click(canvas);expect(screen.queryByRole('menu')).not.toBeInTheDocument();
 });
 it('retains the legacy inline trigger and all shared actions by default',async()=>{
  const user=userEvent.setup();render(<Harness internal log/>);const trigger=await screen.findByRole('button',{name:'BB title pane actions'});await user.click(trigger);expect(await screen.findByRole('menuitem',{name:'Collapse pane'})).toBeVisible();expect(screen.getByRole('menuitem',{name:'Show volume'})).toBeVisible();expect(screen.getByRole('menuitem',{name:'Use logarithmic scale'})).not.toHaveAttribute('aria-disabled');
 });
 it('keeps an inline trigger connected for focus return when the optional menu state is controlled',async()=>{
  const user=userEvent.setup();render(<Harness controlledInternal/>);const trigger=await screen.findByRole('button',{name:'BB title pane actions'});await user.click(trigger);await screen.findByRole('menu');expect(trigger.isConnected).toBe(true);await user.keyboard('{Escape}');await waitFor(()=>expect(trigger).toHaveFocus());expect(trigger).toBeVisible();
 });
 it('updates explicit price pane mode through Log/linear and permits returning from controlled Log under a linear-only policy',async()=>{
  const user=userEvent.setup(),api=React.createRef<MarketChartHandle>(),changed=vi.fn(),view=render(<Harness log api={api} changed={changed}/>),title=screen.getByRole('button',{name:'BB title'});
  await user.click(title);await user.click(await screen.findByRole('menuitem',{name:'Use logarithmic scale'}));await waitFor(()=>expect(api.current?.getSnapshot()?.scales.price.mode).toBe('logarithmic'));expect(changed.mock.calls.at(-1)![0].panes[0].scaleMode).toBe('logarithmic');await user.click(title);expect(await screen.findByRole('menuitem',{name:'Use linear scale'})).toBeVisible();await user.click(screen.getByRole('menuitem',{name:'Use linear scale'}));await waitFor(()=>expect(api.current?.getSnapshot()?.scales.price.mode).toBe('normal'));expect(changed.mock.calls.at(-1)![0].panes[0].scaleMode).toBe('normal');await user.click(title);expect(await screen.findByRole('menuitem',{name:'Use logarithmic scale'})).toBeVisible();await user.keyboard('{Escape}');view.unmount();
  render(<Harness initialLog/>);await user.click(screen.getByRole('button',{name:'BB title'}));const linear=await screen.findByRole('menuitem',{name:'Use linear scale'});expect(linear).not.toHaveAttribute('aria-disabled');await user.click(linear);await user.click(screen.getByRole('button',{name:'BB title'}));expect(await screen.findByRole('menuitem',{name:'Use logarithmic scale'})).toHaveAttribute('aria-disabled','true');
 });
});
describe('disabled table chrome',()=>{
 it('renders no empty controls row for none or always, while toggle controls still work',async()=>{
  const view=render(<MarketChart data={boardBars} dataTable="none" showControls={false} showDrawingToolbar={false}/>);
  expect(view.container.querySelector('div.flex.items-center.justify-between.gap-3.border-t')).toBeNull();expect(screen.queryByText('View data')).not.toBeInTheDocument();
  view.rerender(<MarketChart data={boardBars} dataTable="toggle" showControls={false} showDrawingToolbar={false}/>);fireEvent.click(screen.getByRole('button',{name:'View data'}));expect(screen.getByRole('table',{name:'Market price data'})).toBeVisible();
  view.rerender(<MarketChart data={boardBars} dataTable="always" showControls={false} showDrawingToolbar={false}/>);expect(screen.queryByText('Hide data')).not.toBeInTheDocument();expect(screen.getByRole('table')).toBeVisible();
  await act(async()=>{await new Promise(r=>setTimeout(r,20));});
 });
});
