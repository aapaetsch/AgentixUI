import * as React from 'react';
import {act,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {beforeEach,describe,expect,it,vi} from 'vitest';
import {MarketChart,type MarketChartHandle} from '.';
import type {DrawingState,MarketChartEngine,MarketChartEngineFactory} from '../../core';
import {marketDrawingGeometryKey} from '../../drawings';
const epoch=Date.parse('2026-10-28T12:00:00Z')/1000;
const initial:DrawingState={id:'exact',type:'trend-line',version:1,visible:true,locked:false,parameters:{color:'#2563eb',lineWidth:1},points:[{time:epoch,price:100,priceText:'100.000000000000000001',utcTimeText:'2026-10-28T12:00:00.000001Z'},{time:epoch+86400,price:110,priceText:'110.000',utcTimeText:'2026-10-29T12:00:00Z'}]};
const bars=[{time:epoch,open:100,high:110,low:90,close:101}];
function fixture(){
  const real={getSnapshot:()=>({visibleRange:{from:epoch,to:epoch+86400},panes:[{id:'price',left:0,top:0,width:300,height:200}],scales:{},crosshair:null}),coordinateFor:(p:{time:number;price:number})=>({x:(p.time-epoch)/86400*60+30,y:180-p.price}),pointForCoordinate:(p:{x:number;y:number})=>({time:epoch+(p.x-30)/60*86400,price:180-p.y}),coordinateForTime:(time:number)=>(time-epoch)/86400*60+30,logicalForTime:(time:number)=>(time-epoch)/86400,timeForLogical:(logical:number)=>epoch+logical*86400};
  const api=new Proxy(real,{get:(object,key)=>key==='then'?undefined:key in object?object[key as keyof typeof object]:vi.fn()}) as unknown as MarketChartEngine;
  const factory:MarketChartEngineFactory=()=>api;return factory;
}
beforeEach(()=>{vi.stubGlobal('ResizeObserver',class{observe(){}unobserve(){}disconnect(){}});vi.spyOn(SVGElement.prototype,'getBoundingClientRect').mockReturnValue({x:0,y:0,left:0,top:0,right:300,bottom:228,width:300,height:228,toJSON:()=>({})});});
describe('public MarketChart exact history and controlled echoes',()=>{
  it.each([false,true])('seeds completed creation/move=%s before a same-Number exact edit and history with normal echoes',async(move)=>{
    const ref=React.createRef<MarketChartHandle>(),change=vi.fn(),factory=fixture();
    function Harness(){
      const [drawings,setDrawings]=React.useState<DrawingState[]>([]),[selected,setSelected]=React.useState<string[]>([]),[tool,setTool]=React.useState<string|undefined>('trend-line');
      return <MarketChart ref={ref} engineFactory={factory} data={bars} drawings={drawings} selectedDrawingIds={selected} onSelectedDrawingIdsChange={setSelected} activeDrawingTool={tool} onActiveDrawingToolChange={setTool} drawingEditor={{active:true}} onDrawingsChange={(next,metadata)=>{change(next,metadata);setDrawings(next.map(drawing=>({...drawing,points:drawing.points.map(point=>({...point,utcTimeText:point.utcTimeText?.replace(/(\.\d{3})Z$/,(_match,fraction:string)=>fraction+'000Z')}))})));}} showDrawingToolbar={false} dataTable="none"/>;
    }
    render(<Harness/>);await screen.findByLabelText('Chart drawings');const surface=screen.getByLabelText('Interactive market chart');
    fireEvent.keyDown(surface,{key:'Enter'});await screen.findByRole('button',{name:'Drawing settings'});
    if(move)fireEvent.keyDown(surface,{key:'ArrowUp'});
    const completed=(change.mock.calls.at(-1)![0] as DrawingState[])[0],original=completed.points[0];
    expect(original.priceText).toBe(String(original.price));expect(original.utcTimeText).toMatch(/\.\d{3}(?:\d{3})?Z$/);
    const exact=original.priceText+(original.priceText!.includes('.')?'000000000000000001':'.000000000000000001');expect(Number(exact)).toBe(original.price);
    fireEvent.click(screen.getByRole('button',{name:'Drawing settings'}));fireEvent.mouseDown(screen.getByRole('tab',{name:'Coordinates'}),{button:0,ctrlKey:false});fireEvent.change(screen.getByLabelText('Price 1'),{target:{value:exact}});fireEvent.click(screen.getByRole('button',{name:'OK'}));
    expect(change.mock.calls.at(-1)![0][0].points[0].priceText).toBe(exact);
    act(()=>ref.current?.executeDrawingCommand({type:'undo'}));const restored=change.mock.calls.at(-1)!;expect(restored[0][0].points[0].priceText).toBe(original.priceText);expect(restored[1].exactCoordinates).toContainEqual(expect.objectContaining({pointIndex:0,price:original.priceText,utcTime:original.utcTimeText}));
    act(()=>ref.current?.executeDrawingCommand({type:'redo'}));expect(change.mock.calls.at(-1)![0][0].points[0].priceText).toBe(exact);
  });
  it('keeps history and raw timestamps through semantically equal UTC server echoes',async()=>{
    const raw='2026-10-28T12:00:00.123Z',original={...initial,points:initial.points.map((point,index)=>index?point:{...point,time:epoch+.123,utcTimeText:raw})};
    const ref=React.createRef<MarketChartHandle>(),change=vi.fn(),props={engineFactory:fixture(),data:bars,drawingEditor:{active:true},selectedDrawingIds:['exact'],onDrawingsChange:change,showDrawingToolbar:false,dataTable:'none' as const};
    const view=render(<MarketChart ref={ref} {...props} drawings={[original]}/>);await screen.findByRole('button',{name:'Drawing settings'});
    act(()=>ref.current?.executeDrawingCommand({type:'style',parameters:{lineWidth:4}}));const latest=change.mock.calls.at(-1)![0] as DrawingState[];
    for(const text of ['2026-10-28T12:00:00.123000Z','2026-10-28T12:00:00.123000+00:00']){
      const echo=latest.map(d=>({...d,points:d.points.map((point,index)=>index?point:{...point,utcTimeText:text})}));expect(marketDrawingGeometryKey(echo[0])).toBe(marketDrawingGeometryKey(latest[0]));view.rerender(<MarketChart ref={ref} {...props} drawings={echo}/>);expect(ref.current?.getDrawingHistory().canUndo).toBe(true);
    }
    act(()=>ref.current?.executeDrawingCommand({type:'undo'}));expect(change.mock.calls.at(-1)![0][0]).toMatchObject({parameters:{lineWidth:1},points:[expect.objectContaining({utcTimeText:raw}),expect.anything()]});
    act(()=>ref.current?.executeDrawingCommand({type:'redo'}));expect(change.mock.calls.at(-1)![0][0]).toMatchObject({parameters:{lineWidth:4},points:[expect.objectContaining({utcTimeText:raw}),expect.anything()]});
  });
  it('preserves legacy +00:00 microseconds through a style commit and exact undo/redo metadata',async()=>{
    const raw='2026-10-28T12:00:00.000001+00:00',original={...initial,points:initial.points.map((point,index)=>index?point:{...point,utcTimeText:raw})};
    const ref=React.createRef<MarketChartHandle>(),change=vi.fn();
    render(<MarketChart ref={ref} engineFactory={fixture()} calculationMode="supplied" data={bars} drawings={[original]} drawingEditor={{active:true}} selectedDrawingIds={['exact']} onDrawingsChange={change} showDrawingToolbar={false} dataTable="none"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Drawing settings'}));fireEvent.change(screen.getByLabelText('Name'),{target:{value:'UTC offset plan'}});fireEvent.click(screen.getByRole('button',{name:'OK'}));
    expect(change).toHaveBeenCalledTimes(1);
    for(const command of [null,'undo','redo'] as const){if(command)act(()=>ref.current?.executeDrawingCommand({type:command}));const [drawings,metadata]=change.mock.calls.at(-1)!;expect(drawings[0].points[0].utcTimeText).toBe(raw);expect(drawings[0].points[1]).toEqual(original.points[1]);expect(metadata.exactCoordinates).toContainEqual(expect.objectContaining({drawingId:'exact',pointIndex:0,utcTime:raw}));}
  });
  it('forwards exact commit/undo/redo metadata even when distinct values share one Number',async()=>{
    const ref=React.createRef<MarketChartHandle>(),change=vi.fn(),factory=fixture();
    render(<MarketChart ref={ref} engineFactory={factory} calculationMode="supplied" data={bars} drawings={[initial]} drawingEditor={{active:true}} selectedDrawingIds={['exact']} onDrawingsChange={change} showDrawingToolbar={false} dataTable="none"/>);
    fireEvent.click(await screen.findByRole('button',{name:'Drawing settings'}));fireEvent.mouseDown(screen.getByRole('tab',{name:'Coordinates'}),{button:0,ctrlKey:false});fireEvent.change(screen.getByLabelText('Price 1'),{target:{value:'100.000000000000000002'}});fireEvent.click(screen.getByRole('button',{name:'OK'}));
    expect(change).toHaveBeenCalledTimes(1);expect(change.mock.calls[0][1].exactCoordinates[0]).toEqual({drawingId:'exact',pointIndex:0,price:'100.000000000000000002',utcTime:'2026-10-28T12:00:00.000001Z'});
    act(()=>ref.current?.executeDrawingCommand({type:'undo'}));expect(change).toHaveBeenLastCalledWith(expect.any(Array),expect.objectContaining({type:'undo',exactCoordinates:expect.arrayContaining([expect.objectContaining({price:'100.000000000000000001'})])}));
    act(()=>ref.current?.executeDrawingCommand({type:'redo'}));expect(change).toHaveBeenLastCalledWith(expect.any(Array),expect.objectContaining({type:'redo',exactCoordinates:expect.arrayContaining([expect.objectContaining({price:'100.000000000000000002'})])}));
    expect(ref.current?.getDrawingHistory()).toMatchObject({canUndo:true,canRedo:false});
  });
  it('retains latest editor geometry through delayed/out-of-order echoes, then rebases a true replacement',async()=>{
    const ref=React.createRef<MarketChartHandle>(),change=vi.fn(),factory=fixture(),props={engineFactory:factory,data:bars,drawingEditor:{active:true},selectedDrawingIds:['exact'],onDrawingsChange:change,showDrawingToolbar:false,dataTable:'none' as const};
    const view=render(<MarketChart ref={ref} {...props} drawings={[initial]}/>);await screen.findByRole('button',{name:'Drawing settings'});
    act(()=>ref.current?.executeDrawingCommand({type:'style',parameters:{lineWidth:4}}));const committed=change.mock.calls[0][0] as DrawingState[];
    view.rerender(<MarketChart ref={ref} {...props} drawings={committed}/>);view.rerender(<MarketChart ref={ref} {...props} drawings={[initial]}/>);
    expect(view.container.querySelector('[data-drawing-id="exact"]')?.getAttribute('stroke-width')).toBe('5');
    view.rerender(<MarketChart ref={ref} {...props} drawings={[{...initial,name:'External replacement',parameters:{...initial.parameters,lineWidth:2}}]}/>);
    await waitFor(()=>expect(ref.current?.getDrawingHistory()).toMatchObject({canUndo:false,canRedo:false}));expect(view.container.querySelector('[data-drawing-id="exact"]')?.getAttribute('stroke-width')).toBe('3');
  });
});
