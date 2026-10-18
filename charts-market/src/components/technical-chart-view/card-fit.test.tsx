import * as React from 'react';
import {act,cleanup,render,screen,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {TechnicalChartView} from '.';
import {createTechnicalChartViewState} from '../../core';
import type {MarketChartHandle} from '../market-chart';
beforeEach(()=>{
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(text:string)=>({width:text.length*6})},{get:(target,key)=>key in target?target[key as keyof typeof target]:vi.fn()}) as unknown as CanvasRenderingContext2D);
 vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(320);
});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
const data=[{time:1,open:217.451234567891,high:218,low:216.98,close:217.23},{time:2,open:217.45,high:218,low:216.98,close:217.35,incomplete:true}];
it('retains exact accessible supplied values while compact display follows economic inspection',async()=>{
 const state=createTechnicalChartViewState('price-only'),ref=React.createRef<MarketChartHandle>();
 render(<TechnicalChartView chartApiRef={ref} symbol="MOCK" interval="1D" state={state} onStateChange={()=>{}} data={data} calculationMode="supplied" calculationIdentity="card-fit" appearance={{height:240,legends:'compact'}}/>);
 const readout=await screen.findByLabelText('OHLC readout');expect(readout.querySelector('[aria-label="close: 217.35"]')).toHaveAttribute('title','217.35');
 act(()=>ref.current!.setCrosshairPosition(1,217.23));
 await waitFor(()=>expect(readout.querySelector('[aria-label="open: 217.451234567891"]')).toHaveAttribute('title','217.451234567891'));
 expect(readout.querySelector('[aria-label="open: 217.451234567891"]')).toHaveTextContent('217.45');
 for(const key of ['open','high','low','close'] as const){const pair=readout.querySelector(`[aria-label="${key}: ${data[0][key]}"]`)!;expect(pair.children).toHaveLength(2);expect(pair.children[0]).toHaveTextContent(key[0].toUpperCase());}
});
it('keeps the accepted readout when a host submits an older complete snapshot',async()=>{
 const state=createTechnicalChartViewState('price-only'),props={symbol:'MOCK',interval:'1D',state,onStateChange:()=>{},calculationMode:'supplied' as const,calculationIdentity:'card-fit',dataIdentity:'bars',appearance:{height:240,legends:'compact' as const}};
 const view=render(<TechnicalChartView {...props} data={data} dataRevision={{identity:'bars',revision:2}}/>);
 await screen.findByLabelText('OHLC readout');view.rerender(<TechnicalChartView {...props} data={[data[0]]} dataRevision={{identity:'bars',revision:1}}/>);
 expect(screen.getByLabelText('Bar update status')).toHaveTextContent('superseded');expect(screen.getByLabelText('close: 217.35')).toHaveAttribute('title','217.35');
});
