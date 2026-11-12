import * as React from 'react';
import {act,fireEvent,render,screen} from '@testing-library/react';
import {beforeEach,expect,it,vi} from 'vitest';
import {TechnicalChartView} from '.';
import {createTechnicalChartViewState,type TechnicalChartViewState} from '../../core';
import type {MarketChartHandle} from '../market-chart';
const epoch=Date.parse('2026-10-28T12:00:00Z')/1000,bars=[{time:epoch,open:100,high:110,low:90,close:101},{time:epoch+86400,open:102,high:112,low:92,close:103}];
beforeEach(()=>{
  vi.stubGlobal('ResizeObserver',class{observe(){}unobserve(){}disconnect(){}});
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(430);
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){const height=this.hasAttribute('data-chart-pane-header')?0:560;return{x:0,y:0,left:0,top:0,right:430,bottom:height,width:430,height,toJSON:()=>({})};});
  vi.spyOn(SVGElement.prototype,'getBoundingClientRect').mockReturnValue({x:0,y:0,left:0,top:0,right:430,bottom:560,width:430,height:560,toJSON:()=>({})});
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(text:string)=>({width:text.length*6})},{get:(object,key)=>key in object?object[key as keyof typeof object]:vi.fn()}) as unknown as CanvasRenderingContext2D);
});
it('real composite preserves exact metadata through commit, undo/redo and non-dirty selection',async()=>{
  const ref=React.createRef<MarketChartHandle>(),change=vi.fn();
  function Harness(){const [state,setState]=React.useState<TechnicalChartViewState>(()=>{const s=createTechnicalChartViewState('price-only');s.indicators=[];s.profiles=[];s.panes=s.panes.slice(0,1).map(p=>({...p,studyIds:[],showVolume:false}));s.viewport={};s.drawings=[{id:'exact',type:'trend-line',version:1,visible:true,locked:false,parameters:{color:'#2563eb',lineWidth:1},points:[{time:epoch,price:100,priceText:'100.000000000000000001',utcTimeText:'2026-10-28T12:00:00.000001Z'},{time:epoch+86400,price:110,priceText:'110.000',utcTimeText:'2026-10-29T12:00:00Z'}]}];s.selectedDrawingIds=['exact'];return s;});return <TechnicalChartView chartApiRef={ref} symbol="SYNTHETIC" interval="1D" data={bars} state={state} onStateChange={(next,metadata)=>{change(metadata);setState(next);}} calculationMode="supplied" calculationIdentity="editor-contract" drawingEditor={{active:true}} features={{header:false,commands:false,drawingRail:false,dataTable:false,footer:false}} appearance={{height:560,suppliedStatus:'host',timeline:{range:'auto'}}} timeAxis={{mode:'compressed',futureDisplay:{convention:'utc-calendar',intervalSeconds:86400,horizonMonths:12}}}/>;}
  render(<Harness/>);fireEvent.click(await screen.findByRole('button',{name:'Drawing settings'}));expect(change).not.toHaveBeenCalled();fireEvent.mouseDown(screen.getByRole('tab',{name:'Coordinates'}),{button:0,ctrlKey:false});fireEvent.change(screen.getByLabelText('Price 1'),{target:{value:'100.000000000000000002'}});fireEvent.click(screen.getByRole('button',{name:'OK'}));
  expect(change).toHaveBeenLastCalledWith(expect.objectContaining({type:'drawing',drawing:expect.objectContaining({exactCoordinates:expect.arrayContaining([expect.objectContaining({pointIndex:0,price:'100.000000000000000002',utcTime:'2026-10-28T12:00:00.000001Z'})])})}));
  act(()=>ref.current?.executeDrawingCommand({type:'undo'}));expect(change).toHaveBeenLastCalledWith(expect.objectContaining({drawing:expect.objectContaining({type:'undo',exactCoordinates:expect.arrayContaining([expect.objectContaining({price:'100.000000000000000001'})])})}));
  act(()=>ref.current?.executeDrawingCommand({type:'redo'}));expect(change).toHaveBeenLastCalledWith(expect.objectContaining({drawing:expect.objectContaining({type:'redo',exactCoordinates:expect.arrayContaining([expect.objectContaining({price:'100.000000000000000002'})])})}));
  act(()=>ref.current?.executeDrawingCommand({type:'select',ids:[]}));expect(change).toHaveBeenLastCalledWith(expect.objectContaining({type:'drawing',drawing:{type:'selection',drawingIds:[]}}));
});
