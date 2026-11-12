import * as React from 'react';
import {cleanup,render,screen,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TechnicalChartView,type TechnicalChartAppearance} from '.';
import {createMarketChartEngine} from '../../engine';
import {createCalculationRequests,serializeTechnicalChartViewState,type IndicatorRenderSeries,type MarketChartEngineFactory,type SuppliedCalculationResults} from '../../core';
import {inlineDefinitions} from './inline-readout-fixture';
import {sharedAverages,sharedAverageBars,sharedAverageResults,sharedAverageState,type SharedEvidenceCase,type SharedVolumeCase} from './shared-average-legend-fixture';

beforeEach(()=>{
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(390);
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){const height=this.hasAttribute('data-chart-pane-header')?16:0;return{x:0,y:0,left:0,right:390,top:0,bottom:height,width:390,height,toJSON(){return {};}};});
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(text:string)=>({width:text.length*6})},{get:(target,key)=>key in target?target[key as keyof typeof target]:vi.fn()}) as unknown as CanvasRenderingContext2D);
});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function Harness({state=sharedAverageState(),evidence='normal',volume='normal',policy='host',factory,requests=()=>{},changed=()=>{},loading=false,error,results}:{state?:ReturnType<typeof sharedAverageState>;evidence?:SharedEvidenceCase;volume?:SharedVolumeCase;policy?:TechnicalChartAppearance['suppliedStatus'];factory?:MarketChartEngineFactory;requests?:()=>void;changed?:()=>void;loading?:boolean;error?:string;results?:SuppliedCalculationResults}){
  return <TechnicalChartView symbol="SYNTHETIC" interval="5m" state={state} data={sharedAverageBars(volume)} onStateChange={changed} calculationMode="supplied" calculationIdentity="board-inline" availableIndicators={inlineDefinitions} suppliedResults={results??sharedAverageResults(state,evidence)} onCalculationRequest={requests} engineFactory={factory} loading={loading} error={error}
    paneMenuTrigger="none" priceReferences={[{id:'open',price:33,label:'October 25 · 09:30 ET regular-session open · supplied USD 33',showAxisLabel:true,showPlotLabel:false,axisLabel:'Open'}]}
    appearance={{height:286,heightMode:'available',studyReadout:'volume-only',suppliedStatus:policy,badges:{movingAverages:'all-visible'},crosshair:{lineMarker:{visible:true}}}} features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/>;
}
describe('host-owned supplied-study presentation',()=>{
  for(const selected of [[],[sharedAverages[0].id],sharedAverages.map(study=>study.id)])for(const evidence of ['normal','sparse','warmup','partial','rejected'] as const)it(`${selected.length} averages / ${evidence}: no status chrome and unchanged admission`,async()=>{
    const state=sharedAverageState('dark',selected),saved=serializeTechnicalChartViewState(state),results=sharedAverageResults(state,evidence),unchanged=JSON.stringify(results),series=vi.fn<(next:IndicatorRenderSeries[])=>void>();
    const factory:MarketChartEngineFactory=(host,options)=>{const engine=createMarketChartEngine(host,options),set=engine.setIndicatorSeries.bind(engine);engine.setIndicatorSeries=next=>{series(next);set(next);};return engine;};
    render(<Harness state={state} evidence={evidence} factory={factory} results={results}/>);
    await screen.findByRole('listitem',{name:'vol: 8765432.125'});await waitFor(()=>expect(series).toHaveBeenCalled());
    expect(screen.queryByLabelText('Supplied calculation status')).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:/Legend|Details|evidence/i})).not.toBeInTheDocument();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(series.mock.calls.at(-1)![0].length).toBe(selected.length);
    if(evidence==='rejected')expect(series.mock.calls.at(-1)![0].every(line=>line.points.every(point=>point.value==null))).toBe(true);
    expect(serializeTechnicalChartViewState(state)).toBe(saved);expect(JSON.stringify(results)).toBe(unchanged);expect(screen.getByLabelText('Supplied price references')).toHaveTextContent('supplied USD 33: 33');
  });
  it.each(['missing','empty','zero'] as const)('reserves zero status/header chrome for %s volume except genuine zero',async volume=>{
    render(<Harness volume={volume}/>);await waitFor(()=>expect(screen.queryByLabelText('Supplied calculation status')).not.toBeInTheDocument());
    if(volume==='zero')expect(await screen.findByRole('listitem',{name:'vol: 0'})).toBeVisible();else expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    const readout=screen.queryByLabelText('OHLC readout');if(readout)await waitFor(()=>expect(parseFloat(readout.style.top)).toBe(volume==='zero'?16:0));
  });
  it('restores existing compact/default evidence without reconstructing the engine or issuing new requests',async()=>{
    const state=sharedAverageState(),requests=vi.fn(),changed=vi.fn(),factory=vi.fn<MarketChartEngineFactory>((host,options)=>createMarketChartEngine(host,options)),keys=createCalculationRequests('board-inline','SYNTHETIC','5m',state);
    const view=render(<Harness state={state} evidence="rejected" factory={factory} requests={requests} changed={changed}/>);await waitFor(()=>expect(factory).toHaveBeenCalledTimes(1));const count=requests.mock.calls.length;
    view.rerender(<Harness state={state} evidence="rejected" factory={factory} requests={requests} changed={changed} policy="compact"/>);expect(await screen.findByLabelText('Supplied calculation status')).toHaveTextContent('Stale response rejected');expect(screen.getByRole('button',{name:'Supplied calculation details'})).toBeVisible();
    view.rerender(<Harness state={state} evidence="rejected" factory={factory} requests={requests} changed={changed} policy="expanded"/>);expect(await screen.findByLabelText('Supplied calculation status')).toHaveTextContent('Stale response rejected');
    view.rerender(<Harness state={state} evidence="rejected" factory={factory} requests={requests} changed={changed}/>);expect(screen.queryByLabelText('Supplied calculation status')).not.toBeInTheDocument();expect(factory).toHaveBeenCalledTimes(1);expect(requests).toHaveBeenCalledTimes(count);expect(changed).not.toHaveBeenCalled();expect(createCalculationRequests('board-inline','SYNTHETIC','5m',state)).toEqual(keys);
  });
  it('retains real loading and chart error surfaces separately from study coverage',async()=>{
    const view=render(<Harness loading/>);expect(await screen.findByRole('img',{name:'Loading market chart'})).toBeVisible();expect(screen.queryByLabelText('Supplied calculation status')).not.toBeInTheDocument();
    view.rerender(<Harness error="Host data refresh failed; stale bars retained"/>);expect(await screen.findByText('Host data refresh failed; stale bars retained')).toBeVisible();
  });
});
