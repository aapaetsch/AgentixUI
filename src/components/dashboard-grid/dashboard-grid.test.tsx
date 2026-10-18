import * as React from "react";
import {act,cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {DashboardGrid,type DashboardGridItem,type DashboardGridHandle} from ".";

const initial:DashboardGridItem[]=[{id:"a",width:1,height:240},{id:"b",width:2,height:280},{id:"c",width:1,height:240}];
const label=(item:DashboardGridItem)=>`Card ${item.id}`;
let observers: Array<{callback:ResizeObserverCallback;target?:Element}>;
let measuredWidth=1200;
function pointer(target:Element,type:string,x:number,y:number,extras:Record<string,unknown>={}) {
  const event=new MouseEvent(type,{bubbles:true,cancelable:true,button:0,clientX:x,clientY:y});
  Object.defineProperties(event,{pointerId:{value:1},isPrimary:{value:true},pointerType:{value:"mouse"},...Object.fromEntries(Object.entries(extras).map(([key,value])=>[key,{value}]))});
  fireEvent(target,event);return event;
}
function setup({editing=true,disabled=false,onChange=vi.fn(),renderItem=(item:DashboardGridItem)=><button>Content {item.id}</button>}={}) {
  const ref=React.createRef<DashboardGridHandle>();
  function Harness({editing:edit=editing,disabled:off=disabled}:{editing?:boolean;disabled?:boolean}){
    const [items,setItems]=React.useState(initial);
    return <DashboardGrid ref={ref} items={items} editing={edit} disabled={off} getItemLabel={label} onItemsChange={next=>{onChange(next);setItems(next);}} renderItem={renderItem}/>;
  }
  const view=render(<Harness/>);return {...view,ref,onChange,Harness};
}
beforeEach(()=>{
  vi.useFakeTimers();measuredWidth=1200;observers=[];
  vi.stubGlobal('requestAnimationFrame',(fn:FrameRequestCallback)=>setTimeout(()=>fn(performance.now()),16));
  vi.stubGlobal('cancelAnimationFrame',(id:number)=>clearTimeout(id));
  vi.stubGlobal('ResizeObserver',class {entry:{callback:ResizeObserverCallback;target?:Element};constructor(callback:ResizeObserverCallback){this.entry={callback};observers.push(this.entry);}observe(target:Element){this.entry.target=target;}unobserve(){}disconnect(){}});
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockImplementation(()=>measuredWidth);
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){const index=initial.findIndex(item=>item.id===this.dataset.dashboardGridItem);const left=index>=0?index*300:0;return {left,top:0,x:left,y:0,right:left+(index>=0?288:1200),bottom:240,width:index>=0?288:1200,height:240,toJSON:()=>({})};});
  HTMLElement.prototype.setPointerCapture=vi.fn();HTMLElement.prototype.hasPointerCapture=vi.fn(()=>true);HTMLElement.prototype.releasePointerCapture=vi.fn();
});
afterEach(()=>{cleanup();vi.clearAllTimers();vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('DashboardGrid controlled interaction',()=>{
  it('leaves read-mode content, pointer/wheel defaults and unknown DOM events untouched',()=>{
    const onChange=vi.fn(),unknown=vi.fn();render(<DashboardGrid items={initial} editing={false} onItemsChange={onChange} renderItem={item=><a href={`#${item.id}`}>{item.id}</a>} getItemLabel={label} {...{onPointerDown:unknown}}/>);
    expect(screen.queryByRole('button',{name:'Move Card a'})).toBeNull();const event=pointer(screen.getByText('a'),'pointerdown',30,100);expect(event.defaultPrevented).toBe(false);expect(unknown).not.toHaveBeenCalled();
    const wheel=new WheelEvent('wheel',{deltaY:100,bubbles:true,cancelable:true});fireEvent(screen.getByText('a'),wheel);expect(wheel.defaultPrevented).toBe(false);expect(onChange).not.toHaveBeenCalled();
  });
  it('does not emit changes on measurement, projection or rotation',()=>{
    const {onChange}=setup();const root=screen.getByRole('list',{name:'Dashboard'});expect(root).toHaveAttribute('data-columns','4');
    const observer=observers.find(value=>value.target===root)!;
    act(()=>observer.callback([{contentRect:{width:800}}] as ResizeObserverEntry[],{} as ResizeObserver));expect(root).toHaveAttribute('data-columns','2');
    act(()=>observer.callback([{contentRect:{width:390}}] as ResizeObserverEntry[],{} as ResizeObserver));expect(root).toHaveAttribute('data-columns','1');
    fireEvent(window,new Event('orientationchange'));expect(onChange).not.toHaveBeenCalled();
  });
  it('keyboard moves, commits once, retains stable content and focused handle',()=>{
    const mounted=vi.fn(),unmounted=vi.fn();function Child({id}:{id:string}){React.useEffect(()=>{mounted(id);return()=>{unmounted(id);};},[id]);return <input aria-label={`Input ${id}`} defaultValue={id}/>;}
    const renderItem=(item:DashboardGridItem)=><Child id={item.id}/>;
    const {onChange}=setup({renderItem});const input=screen.getByLabelText('Input a');fireEvent.change(input,{target:{value:'retained'}});
    const handle=screen.getByRole('button',{name:'Move Card a'});handle.focus();fireEvent.keyDown(handle,{key:' '});fireEvent.keyDown(handle,{key:'ArrowRight'});expect(onChange).not.toHaveBeenCalled();expect(document.querySelector('[data-dashboard-grid-marker]')).not.toBeNull();
    fireEvent.keyDown(handle,{key:'Enter'});act(()=>vi.advanceTimersByTime(20));expect(onChange).toHaveBeenCalledTimes(1);expect(onChange.mock.calls[0][0].map((item:DashboardGridItem)=>item.id)).toEqual(['b','a','c']);expect(screen.getByLabelText('Input a')).toBe(input);expect(input).toHaveValue('retained');expect(handle).toHaveFocus();expect(mounted).toHaveBeenCalledTimes(3);expect(unmounted).not.toHaveBeenCalled();expect(screen.getByRole('status')).toHaveTextContent('position 2 of 3');
  });
  it('keyboard resizes with identical constraints and ignores imperative commands outside enabled edit mode',()=>{
    const {onChange,ref,rerender,Harness}=setup();const handle=screen.getByRole('button',{name:'Resize Card a'});fireEvent.keyDown(handle,{key:'ArrowRight'});fireEvent.keyDown(handle,{key:'ArrowDown'});expect(onChange.mock.calls.at(-1)![0][0]).toEqual({id:'a',width:2,height:280});
    act(()=>ref.current?.execute({type:'resize',id:'a',width:4,height:720}));expect(onChange.mock.calls.at(-1)![0][0].width).toBe(4);
    rerender(<Harness disabled/>);const count=onChange.mock.calls.length;act(()=>ref.current?.execute({type:'move',id:'a',toIndex:2}));expect(onChange).toHaveBeenCalledTimes(count);
    rerender(<Harness editing={false}/>);act(()=>ref.current?.execute({type:'resize',id:'a',width:1,height:240}));expect(onChange).toHaveBeenCalledTimes(count);
  });
  it('taps/subthreshold movement do not mutate; pointer resizing snaps preview and commits once',()=>{
    const {onChange}=setup();const handle=screen.getByRole('button',{name:'Resize Card a'});
    pointer(handle,'pointerdown',100,100);pointer(handle,'pointermove',104,103);act(()=>vi.advanceTimersByTime(20));pointer(handle,'pointerup',104,103);expect(onChange).not.toHaveBeenCalled();
    pointer(handle,'pointerdown',100,100);pointer(handle,'pointermove',400,179);act(()=>vi.advanceTimersByTime(20));expect(onChange).not.toHaveBeenCalled();expect(document.querySelector('[data-preview="resize"]')).toHaveStyle({height:'320px'});pointer(handle,'pointerup',400,179);expect(onChange).toHaveBeenCalledTimes(1);expect(onChange.mock.calls[0][0][0]).toEqual({id:'a',width:2,height:320});expect(HTMLElement.prototype.releasePointerCapture).toHaveBeenCalled();
  });
  it.each(['escape','pointercancel','capture-loss','rotation','measurement','edit-exit','disabled','unmount'])('cancels %s without committing or leaving frames',reason=>{
    const {onChange,rerender,Harness,unmount}=setup();const handle=screen.getByRole('button',{name:'Resize Card a'});pointer(handle,'pointerdown',100,100);pointer(handle,'pointermove',400,180);act(()=>vi.advanceTimersByTime(20));
    if(reason==='escape')fireEvent.keyDown(window,{key:'Escape'});
    else if(reason==='pointercancel')pointer(handle,'pointercancel',400,180);
    else if(reason==='capture-loss')pointer(handle,'lostpointercapture',400,180);
    else if(reason==='rotation')fireEvent(window,new Event('orientationchange'));
    else if(reason==='measurement'){const root=screen.getByRole('list');act(()=>observers.find(value=>value.target===root)!.callback([{contentRect:{width:800}}] as ResizeObserverEntry[],{} as ResizeObserver));}
    else if(reason==='edit-exit')rerender(<Harness editing={false}/>);
    else if(reason==='disabled')rerender(<Harness disabled/>);
    else unmount();
    act(()=>vi.advanceTimersByTime(100));expect(onChange).not.toHaveBeenCalled();expect(document.querySelector('[data-dashboard-grid-preview]')).toBeNull();expect(vi.getTimerCount()).toBe(0);
  });
  it('does not execute expensive content renderers during pointer preview frames',()=>{
    const renderItem=vi.fn((item:DashboardGridItem)=><button>{item.id}</button>);const {onChange}=setup({renderItem});const count=renderItem.mock.calls.length;const handle=screen.getByRole('button',{name:'Resize Card a'});pointer(handle,'pointerdown',100,100);
    for(let n=0;n<20;n++){pointer(handle,'pointermove',100+n*10,100+n*4);act(()=>vi.advanceTimersByTime(16));}
    expect(renderItem).toHaveBeenCalledTimes(count);fireEvent.keyDown(window,{key:'Escape'});expect(onChange).not.toHaveBeenCalled();
  });
});
