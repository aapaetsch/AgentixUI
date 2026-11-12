import * as React from 'react';
import {describe,it,expect,vi,beforeEach} from 'vitest';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {DrawingState,MarketChartEngine} from '../core';
import {DrawingLayer,builtInDrawingTools} from './index';
const epoch=Date.parse('2026-10-28T12:00:00Z')/1000;
const drawing=(patch:Partial<DrawingState>={}):DrawingState=>({id:'a',type:'trend-line',version:1,visible:true,locked:false,points:[{time:epoch,price:100,priceText:'100.000000000000000001',utcTimeText:'2026-10-28T12:00:00.000001Z'},{time:epoch+86400,price:110,priceText:'110.000',utcTimeText:'2026-10-29T12:00:00Z'}],parameters:{color:'#2563eb',lineWidth:1},...patch});
const engine={coordinateFor:(p:{time:number;price:number})=>({x:(p.time-epoch)/86400*60+30,y:180-p.price}),coordinateForTime:(time:number)=>time<epoch||time>epoch+370*86400?null:(time-epoch)/86400*60+30,pointForCoordinate:(p:{x:number;y:number})=>({time:epoch+(p.x-30)/60*86400,price:180-p.y}),logicalForTime:(time:number)=>(time-epoch)/86400,timeForLogical:(value:number)=>value>=0&&value<=370?epoch+value*86400:null,getSnapshot:()=>({visibleRange:{from:epoch,to:epoch+3*86400},panes:[{id:'price',left:0,top:0,width:300,height:200}],timeAxis:{left:0,top:200,width:300,height:28},scales:{},crosshair:null})} as unknown as MarketChartEngine;
const tab=(name:string)=>fireEvent.mouseDown(screen.getByRole('tab',{name}),{button:0,ctrlKey:false});
function renderEditor(item=drawing(),props:Partial<React.ComponentProps<typeof DrawingLayer>>={}) {
  const commit=vi.fn(),selection=vi.fn();const view=render(<DrawingLayer engine={engine} drawings={[item]} selectedDrawingIds={[item.id]} tools={builtInDrawingTools} editor={{active:true}} onDrawingsChange={commit} onSelectedDrawingIdsChange={selection} {...props}/>);return {...view,commit,selection};
}
beforeEach(()=>{vi.stubGlobal('ResizeObserver',class{observe(){}unobserve(){}disconnect(){}});vi.stubGlobal('PointerEvent',class extends MouseEvent{pointerId:number;isPrimary:boolean;constructor(type:string,init:ConstructorParameters<typeof MouseEvent>[1]&{pointerId?:number;isPrimary?:boolean}={}){super(type,init);this.pointerId=init.pointerId??1;this.isPrimary=init.isPrimary??true;}});vi.spyOn(SVGElement.prototype,'getBoundingClientRect').mockReturnValue({x:0,y:0,left:0,top:0,right:300,bottom:228,width:300,height:228,toJSON:()=>({})});});
describe('opt-in single-object drawing editor',()=>{
  it.each(['trend-line','horizontal-line','vertical-line','rectangle'])('selecting %s has one contextual editor and creates no default writes',type=>{
    const item=drawing({type,points:['horizontal-line','vertical-line'].includes(type)?drawing().points.slice(0,1):drawing().points});const {commit}=renderEditor(item);
    expect(screen.getAllByRole('toolbar',{name:`Edit ${type}`})).toHaveLength(1);expect(commit).not.toHaveBeenCalled();
    expect(screen.getByRole('button',{name:'Drawing alerts — coming later'})).toBeDisabled();
    expect(document.querySelector('[data-selected-drawing-timeline]')).toBeTruthy();
  });
  it.each([{active:false},{active:true,selectedDrawingIds:['a','b']},{active:true,hidden:true}])('suppresses inactive/multiple/hidden editor cases',mode=>{
    const props={editor:{active:mode.active},...('selectedDrawingIds'in mode?{selectedDrawingIds:mode.selectedDrawingIds}:{} )};renderEditor(drawing({visible:!('hidden'in mode)}),props);expect(screen.queryByRole('toolbar',{name:/^Edit /})).toBeNull();
  });
  it('keeps locked objects selectable and unlockable while all edit inputs are disabled',()=>{
    const {commit}=renderEditor(drawing({locked:true}));expect(screen.getByRole('button',{name:'Drawing color'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));expect(screen.getByLabelText('Name')).toBeDisabled();expect(screen.getByRole('button',{name:'OK'})).toBeDisabled();fireEvent.click(screen.getByRole('button',{name:'Cancel'}));
    fireEvent.click(screen.getByRole('button',{name:'Unlock drawing'}));expect(commit).toHaveBeenCalledWith([expect.objectContaining({locked:false})],expect.objectContaining({type:'lock'}));
  });
  it('previews a complete settings draft, cancels without writes, and commits one exact decimal edit',()=>{
    const {commit}=renderEditor();fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));expect(screen.getByRole('dialog')).toHaveAccessibleName('Drawing settings — Trend line');fireEvent.change(screen.getByLabelText('Name'),{target:{value:'Private plan'}});expect(screen.getByRole('dialog')).toHaveAccessibleName('Drawing settings — Private plan');tab('Text');fireEvent.change(screen.getByRole('textbox',{name:'Drawing text'}),{target:{value:'<script>plain text</script>'}});
    expect(document.querySelector('[data-drawing-text]')?.textContent).toContain('<script>plain text</script>');expect(document.querySelector('svg script')).toBeNull();expect(commit).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Cancel'}));expect(commit).not.toHaveBeenCalled();expect(document.querySelector('[data-drawing-text]')).toBeNull();
    fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));tab('Coordinates');fireEvent.change(screen.getByLabelText('Price 1'),{target:{value:'100.000000000000000002'}});expect(commit).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'OK'}));expect(commit).toHaveBeenCalledTimes(1);
    const next=commit.mock.calls[0][0][0] as DrawingState;expect(next.points[0]).toMatchObject({price:100,priceText:'100.000000000000000002',utcTimeText:'2026-10-28T12:00:00.000001Z'});expect(next.points[1]).toEqual(drawing().points[1]);expect(next.parameters).not.toHaveProperty('presentation');
  });
  it('does not commit untouched defaults or an out-of-horizon coordinate',()=>{
    const {commit}=renderEditor();fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));fireEvent.click(screen.getByRole('button',{name:'OK'}));expect(commit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));tab('Coordinates');fireEvent.change(screen.getByLabelText('Date and time 1 (UTC)'),{target:{value:'2030-01-01T00:00'}});fireEvent.click(screen.getByRole('button',{name:'OK'}));expect(screen.getByRole('alert')).toHaveTextContent(/ruler/);expect(commit).not.toHaveBeenCalled();
  });
  it('keeps the dialog open when an interval preview hides its drawing and Cancel restores visibility',()=>{
    const {commit}=renderEditor(drawing(),{interval:'1D'});fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));tab('Visibility');fireEvent.click(screen.getByLabelText('Show on days'));expect(screen.getByRole('dialog')).toBeTruthy();expect(document.querySelector('[data-drawing-id="a"]')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Cancel'}));expect(document.querySelector('[data-drawing-id="a"]')).toBeTruthy();expect(commit).not.toHaveBeenCalled();
  });
  it('cancels drafts on selection/external document change and window blur',async()=>{
    const item=drawing(),{commit,rerender}=renderEditor(item);fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));fireEvent.change(screen.getByLabelText('Name'),{target:{value:'Unsaved'}});fireEvent(window,new Event('blur'));await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());expect(commit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));rerender(<DrawingLayer engine={engine} drawings={[{...item,name:'External'}]} selectedDrawingIds={['a']} editor={{active:true}} onDrawingsChange={commit}/>);await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());expect(commit).not.toHaveBeenCalled();
  });
  it('quick color previews once and Apply emits only one final transaction',()=>{
    const {commit}=renderEditor();fireEvent.click(screen.getByRole('button',{name:'Drawing color'}));fireEvent.change(screen.getByLabelText('Quick color'),{target:{value:'#dc2626'}});expect(document.querySelector('[data-drawing-id="a"]')?.getAttribute('stroke')).toBe('#dc2626');expect(commit).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Apply'}));expect(commit).toHaveBeenCalledTimes(1);expect(commit.mock.calls[0][0][0].parameters.color).toBe('#dc2626');
  });
  it('keyboard movement and Reset position are runtime-only and do not edit drawings',()=>{
    const position=vi.fn(),{commit}=renderEditor(drawing(),{editor:{active:true,position:{x:30,y:40},onPositionChange:position}});const handle=screen.getByRole('button',{name:'Move drawing toolbar'});fireEvent.keyDown(handle,{key:'ArrowRight'});expect(position).toHaveBeenLastCalledWith({x:34,y:40});fireEvent.keyDown(handle,{key:'Home'});expect(position).toHaveBeenLastCalledWith(null);expect(commit).not.toHaveBeenCalled();
  });
  it('captures only the toolbar handle, commits position on release and cancels a later drag without a drawing write',()=>{
    const position=vi.fn(),{commit,unmount}=renderEditor(drawing(),{editor:{active:true,position:{x:30,y:40},onPositionChange:position}});
    const handle=screen.getByRole('button',{name:'Move drawing toolbar'});
    const capture=vi.fn(),release=vi.fn();Object.assign(handle,{setPointerCapture:capture,hasPointerCapture:()=>true,releasePointerCapture:release});
    fireEvent.pointerDown(handle,{pointerId:7,clientX:10,clientY:10,button:0});fireEvent.pointerMove(handle,{pointerId:7,clientX:90,clientY:80});
    expect(capture).toHaveBeenCalledWith(7);expect(position).not.toHaveBeenCalled();
    fireEvent.pointerUp(handle,{pointerId:7});expect(position).toHaveBeenLastCalledWith({x:110,y:110});expect(release).toHaveBeenCalledWith(7);
    fireEvent.pointerDown(handle,{pointerId:8,clientX:10,clientY:10,button:0});fireEvent.pointerMove(handle,{pointerId:8,clientX:140,clientY:100});fireEvent.keyDown(handle,{key:'Escape'});
    expect(position).toHaveBeenCalledTimes(1);expect(release).toHaveBeenCalledWith(8);
    fireEvent.pointerDown(handle,{pointerId:9,clientX:10,clientY:10,button:0});unmount();expect(release).toHaveBeenCalledWith(9);expect(commit).not.toHaveBeenCalled();
  });
  it('rejects an exponent and an overlong decimal without committing the dialog',()=>{
    const {commit}=renderEditor();fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));tab('Coordinates');
    for(const value of ['1e2','1.'+'0'.repeat(79)]){fireEvent.change(screen.getByLabelText('Price 1'),{target:{value}});fireEvent.click(screen.getByRole('button',{name:'OK'}));expect(screen.getByRole('alert')).toHaveTextContent(/decimal/);}
    expect(commit).not.toHaveBeenCalled();
  });
  it.each(['Drawing settings','Drawing text'])('returns keyboard focus to %s after cancelling its dialog',async label=>{
    renderEditor();const trigger=screen.getByRole('button',{name:label});trigger.focus();fireEvent.click(trigger);
    await waitFor(()=>expect(screen.getByLabelText('Name')).toHaveFocus());fireEvent.click(screen.getByRole('button',{name:'Cancel'}));
    await waitFor(()=>expect(trigger).toHaveFocus());
  });
  it('returns overflow-opened settings to the connected More trigger',async()=>{
    renderEditor();const more=screen.getByRole('button',{name:'More drawing actions'});more.focus();fireEvent.pointerDown(more,{button:0,ctrlKey:false});
    fireEvent.click(await screen.findByRole('menuitem',{name:'Width'}));await waitFor(()=>expect(screen.getByLabelText('Name')).toHaveFocus());
    fireEvent.click(screen.getByRole('button',{name:'Cancel'}));await waitFor(()=>expect(more).toHaveFocus());
  });
  it('moves the portal into and out of fullscreen even when its clamped position is unchanged',()=>{
    const {commit}=renderEditor(drawing(),{editor:{active:true,position:{x:30,y:40}}});const fullscreen=document.createElement('div');document.body.append(fullscreen);
    try{Object.defineProperty(document,'fullscreenElement',{configurable:true,value:fullscreen});fireEvent(document,new Event('fullscreenchange'));expect(fullscreen.querySelector('[data-drawing-editor="a"]')).toBeTruthy();
      Object.defineProperty(document,'fullscreenElement',{configurable:true,value:null});fireEvent(document,new Event('fullscreenchange'));expect(fullscreen.querySelector('[data-drawing-editor="a"]')).toBeNull();expect(document.body.querySelector('[data-drawing-editor="a"]')).toBeTruthy();expect(commit).not.toHaveBeenCalled();
    }finally{Object.defineProperty(document,'fullscreenElement',{configurable:true,value:null});fullscreen.remove();}
  });
  it.each([
    [-5,-6,false],[-6,-5,false],[5,6,false],[6,5,false],[-5,-5,false],[5,5,false],[1,1,true],[-5,6,true],
  ])('keeps offscreen endpoint labels but paints a span only when the actual %s / %s interval intersects the ruler', (first,second,visible)=>{
    const item=drawing({points:[{time:epoch+Number(first)*86400,price:100},{time:epoch+Number(second)*86400,price:110}]});
    renderEditor(item,{engine:{...engine,coordinateForTime:(time:number)=>(time-epoch)/86400*60+30} as MarketChartEngine});expect(document.querySelectorAll('[data-selected-drawing-timeline] [aria-label^="Anchor "]')).toHaveLength(2);
    expect(Boolean(document.querySelector('[data-selected-timeline-span]'))).toBe(visible);
  });
});

describe('selected drawing Create alert intent',()=>{
  const opaqueId='opaque:/ listing B %00  —  007';
  const supplied={calculationMode:'supplied' as const};
  const openMore=async()=>{
    const trigger=screen.getByRole('button',{name:'More drawing actions'});
    fireEvent.pointerDown(trigger,{button:0,ctrlKey:false});
    return trigger;
  };
  it.each(['horizontal-line','trend-line','rectangle'])('emits only the exact %s ID once from each pointer action without document writes',async type=>{
    const onAlertIntent=vi.fn(),item=drawing({id:opaqueId,type,points:type==='horizontal-line'?drawing().points.slice(0,1):drawing().points});
    const before=JSON.stringify(item),{commit,selection}=renderEditor(item,{...supplied,editor:{active:true,onAlertIntent}});
    fireEvent.click(screen.getByRole('button',{name:'Create alert'}));
    expect(onAlertIntent.mock.calls).toEqual([[opaqueId]]);
    await openMore();fireEvent.click(await screen.findByRole('menuitem',{name:'Create alert'}));
    expect(onAlertIntent.mock.calls).toEqual([[opaqueId],[opaqueId]]);
    expect(JSON.stringify(item)).toBe(before);expect(commit).not.toHaveBeenCalled();expect(selection).not.toHaveBeenCalled();
  });
  it('excludes vertical/time-only drawings in both action surfaces with a callback',async()=>{
    const onAlertIntent=vi.fn();renderEditor(drawing({type:'vertical-line',points:drawing().points.slice(0,1)}),{...supplied,editor:{active:true,onAlertIntent}});
    expect(screen.queryByRole('button',{name:/alert/i})).toBeNull();await openMore();
    expect(screen.queryByRole('menuitem',{name:/alert/i})).toBeNull();expect(onAlertIntent).not.toHaveBeenCalled();
  });
  it.each(['horizontal-line','trend-line','rectangle'])('allows locked %s intent without unlocking or changing it',type=>{
    const onAlertIntent=vi.fn(),{commit}=renderEditor(drawing({type,locked:true}),{...supplied,editor:{active:true,onAlertIntent}});
    expect(screen.getByRole('button',{name:'Drawing color'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'Create alert'}));expect(onAlertIntent.mock.calls).toEqual([['a']]);expect(commit).not.toHaveBeenCalled();
  });
  it.each(['Enter',' '])('supports native desktop keyboard activation with %s once and preserves focus',async key=>{
    const user=userEvent.setup(),onAlertIntent=vi.fn();renderEditor(drawing(),{...supplied,editor:{active:true,onAlertIntent}});
    const button=screen.getByRole('button',{name:'Create alert'});button.focus();await user.keyboard(key==='Enter'?'{Enter}':key);
    expect(onAlertIntent.mock.calls).toEqual([['a']]);expect(button).toHaveFocus();
  });
  it('supports keyboard overflow activation, dismissal and connected trigger focus',async()=>{
    const user=userEvent.setup(),onAlertIntent=vi.fn();renderEditor(drawing(),{...supplied,editor:{active:true,onAlertIntent}});
    const more=screen.getByRole('button',{name:'More drawing actions'});more.focus();await user.keyboard('{Enter}');
    const item=await screen.findByRole('menuitem',{name:'Create alert'});item.focus();await user.keyboard('{Enter}');
    expect(onAlertIntent.mock.calls).toEqual([['a']]);await waitFor(()=>expect(more).toHaveFocus());
    await user.keyboard('{Enter}');await screen.findByRole('menuitem',{name:'Create alert'});await user.keyboard('{Escape}');
    await waitFor(()=>expect(more).toHaveFocus());expect(onAlertIntent).toHaveBeenCalledTimes(1);
  });
  it('uses current selection and closes the old overflow before another ID can activate',async()=>{
    const onAlertIntent=vi.fn(),a=drawing(),b=drawing({id:opaqueId,type:'rectangle'}),commit=vi.fn();
    const props={engine,drawings:[a,b],...supplied,editor:{active:true,onAlertIntent},onDrawingsChange:commit};
    const view=render(<DrawingLayer {...props} selectedDrawingIds={['a']}/>);
    await openMore();const oldItem=await screen.findByRole('menuitem',{name:'Create alert'});
    view.rerender(<DrawingLayer {...props} selectedDrawingIds={[opaqueId]}/>);fireEvent.click(oldItem);
    expect(onAlertIntent).not.toHaveBeenCalled();expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(screen.getByRole('button',{name:'Create alert'}));expect(onAlertIntent.mock.calls).toEqual([[opaqueId]]);expect(commit).not.toHaveBeenCalled();
  });
  it('replaces listing callbacks for the same opaque ID and disposes old listing controls',async()=>{
    const first=vi.fn(),second=vi.fn(),item=drawing({id:opaqueId}),commit=vi.fn();
    const props={engine,drawings:[item],selectedDrawingIds:[opaqueId],...supplied,onDrawingsChange:commit};
    const view=render(<DrawingLayer {...props} cancelRevision={1} editor={{active:true,onAlertIntent:first}}/>);
    await openMore();const oldItem=await screen.findByRole('menuitem',{name:'Create alert'});
    view.rerender(<DrawingLayer {...props} cancelRevision={2} editor={{active:true,onAlertIntent:second}}/>);fireEvent.click(oldItem);
    expect(first).not.toHaveBeenCalled();expect(second).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Create alert'}));expect(second.mock.calls).toEqual([[opaqueId]]);
    view.rerender(<DrawingLayer {...props} cancelRevision={2} editor={{active:true,onAlertIntent:first}}/>);
    fireEvent.click(screen.getByRole('button',{name:'Create alert'}));expect(first.mock.calls).toEqual([[opaqueId]]);expect(commit).not.toHaveBeenCalled();
  });
  it.each(['deleted','hidden','cleared','multiple','inactive','disposed'])('removes all live alert controls when %s',async state=>{
    const onAlertIntent=vi.fn(),a=drawing(),b=drawing({id:'b'}),commit=vi.fn();
    const props={engine,drawings:[a,b],selectedDrawingIds:['a'],...supplied,editor:{active:true,onAlertIntent},onDrawingsChange:commit};
    const view=render(<DrawingLayer {...props}/>),oldButton=screen.getByRole('button',{name:'Create alert'});
    await openMore();const oldItem=await screen.findByRole('menuitem',{name:'Create alert'});
    if(state==='disposed')view.unmount();else view.rerender(<DrawingLayer {...props}
      drawings={state==='deleted'?[b]:state==='hidden'?[{...a,visible:false},b]:[a,b]}
      selectedDrawingIds={state==='cleared'?[]:state==='multiple'?['a','b']:['a']}
      editor={{active:state!=='inactive',onAlertIntent}}/>);
    expect(screen.queryByRole('button',{name:'Create alert'})).toBeNull();expect(screen.queryByRole('menuitem',{name:'Create alert'})).toBeNull();
    fireEvent.click(oldButton);fireEvent.click(oldItem);expect(onAlertIntent).not.toHaveBeenCalled();expect(commit).not.toHaveBeenCalled();
  });
  it.each(['trend-line','horizontal-line','vertical-line','rectangle'])('retains disabled no-callback desktop and overflow behavior for %s',async type=>{
    const {commit}=renderEditor(drawing({type}),supplied);
    expect(screen.getByRole('button',{name:'Drawing alerts — coming later'})).toBeDisabled();
    await openMore();expect(await screen.findByRole('menuitem',{name:'Drawing alerts — coming later'})).toHaveAttribute('aria-disabled','true');
    expect(screen.queryByRole('menuitem',{name:'Create alert'})).toBeNull();expect(commit).not.toHaveBeenCalled();
  });
});
