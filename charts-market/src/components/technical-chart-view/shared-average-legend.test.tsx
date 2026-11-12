import * as React from 'react';
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TechnicalChartView,useTechnicalPaneMenu,type TechnicalChartAppearance} from '.';
import {createMarketChartEngine} from '../../engine';
import {createCalculationRequests,serializeTechnicalChartViewState,type IndicatorRenderSeries,type MarketChartEngineFactory,type MarketChartPresentation} from '../../core';
import type {MarketChartHandle} from '../market-chart';
import {inlineDefinitions} from './inline-readout-fixture';
import {sharedAverages,sharedAverageBars,sharedAveragePalette,sharedAverageResults,sharedAverageState,type SharedAverageTheme,type SharedEvidenceCase,type SharedVolumeCase} from './shared-average-legend-fixture';

let width=430;
beforeEach(()=>{
  width=430;
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockImplementation(()=>width);
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){const height=this.hasAttribute('data-chart-pane-header')?16:0;return{x:0,y:0,left:0,right:width,top:0,bottom:height,width,height,toJSON(){return {};}};});
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(text:string)=>({width:text.length*6})},{get:(target,key)=>key in target?target[key as keyof typeof target]:vi.fn()}) as unknown as CanvasRenderingContext2D);
});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function captureEngine(){
  const series=vi.fn<(value:IndicatorRenderSeries[])=>void>(),presentation=vi.fn<(value:MarketChartPresentation)=>void>();
  const factory=vi.fn<MarketChartEngineFactory>((host,options)=>{const engine=createMarketChartEngine(host,options),set=engine.setIndicatorSeries.bind(engine),present=engine.setPresentation?.bind(engine);engine.setIndicatorSeries=value=>{series(value);set(value);};if(present)engine.setPresentation=value=>{presentation(value);present(value);};return engine;});
  return {series,presentation,factory};
}
function Harness({state=sharedAverageState(),volumeCase='normal',mode='volume-only',evidence='normal',api,factory,requests=()=>{},changed=()=>{},financial=()=>{}}:{state?:ReturnType<typeof sharedAverageState>;volumeCase?:SharedVolumeCase;mode?:TechnicalChartAppearance['studyReadout']|'default';evidence?:SharedEvidenceCase;api?:React.Ref<MarketChartHandle>;factory?:MarketChartEngineFactory;requests?:()=>void;changed?:()=>void;financial?:()=>void}){
  const menu=useTechnicalPaneMenu();
  return <><button {...menu.getTriggerProps('price')}>Board title</button><TechnicalChartView symbol="SYNTHETIC" interval="5m" data={sharedAverageBars(volumeCase)} state={state} onStateChange={changed} chartApiRef={api} engineFactory={factory}
    calculationMode="supplied" calculationIdentity="board-inline" suppliedResults={sharedAverageResults(state,evidence)} availableIndicators={inlineDefinitions} onCalculationRequest={requests} onRequestFinancials={financial}
    paneMenuTrigger="none" paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} priceReferences={[{id:'open',price:33,label:'Exact supplied regular open',showAxisLabel:true,lineStyle:'dotted'}]}
    earnings={[{id:'supplied-earnings',time:sharedAverageBars()[4].time,label:'Supplied synthetic earnings',reportedEps:1.2345}]}
    appearance={{height:width<640?266:246,heightMode:'available',legends:'compact',studyReadout:mode==='default'?undefined:mode,suppliedDetails:false,suppliedStatus:'compact',badges:{movingAverages:'all-visible'},crosshair:{lineMarker:{visible:true}}}} features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/></>;
}
describe('public compact volume-only composition',()=>{
  for(const theme of ['light','dark'] as const)for(const selected of [[],[sharedAverages[0].id],sharedAverages.map(study=>study.id)])for(const volumeCase of ['normal','zero','missing','off'] as const)it(`${theme} ${selected.length} averages / ${volumeCase} preserves series and reserves only genuine volume`,async()=>{
    const state=sharedAverageState(theme,selected,volumeCase!=='off'),before=serializeTechnicalChartViewState(state),capture=captureEngine();
    render(<Harness state={state} volumeCase={volumeCase==='off'?'normal':volumeCase} factory={capture.factory}/>);
    await waitFor(()=>expect(capture.series).toHaveBeenCalled());
    const visible=volumeCase==='normal'||volumeCase==='zero';await waitFor(()=>expect(screen.queryAllByRole('listitem')).toHaveLength(visible?1:0));
    if(visible)expect(screen.getByRole('listitem',{name:volumeCase==='zero'?'vol: 0':'vol: 8765432.125'})).toBeVisible();
    expect(screen.queryByRole('button',{name:/Legend|EMA 20|SMA 50|SMA 150|SMA 200/})).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(()=>expect(parseFloat(screen.getByLabelText('OHLC readout').style.top)).toBe(visible?16:0));
    const actual=capture.series.mock.calls.at(-1)![0];expect(actual).toHaveLength(selected.length);
    for(const id of selected){const study=sharedAverages.find(item=>item.id===id)!;const line=actual.find(item=>item.id===`${id}:${study.definitionId}`)!;expect(line.color).toBe(sharedAveragePalette[theme][study.period]);expect(line.points).toEqual(sharedAverageBars().map((bar,index)=>({time:bar.time,value:study.values[index]})));}
    expect(capture.presentation.mock.calls.at(-1)![0].badges?.movingAverages).toBe('all-visible');
    expect(serializeTechnicalChartViewState(state)).toBe(before);expect(screen.getByLabelText('Supplied price references')).toHaveTextContent('Exact supplied regular open: 33');
  });
  it('releases the entire header for empty data without manufacturing vol 0 or study rows',async()=>{
    render(<Harness volumeCase="empty"/>);await screen.findByText('No market data is available for this range.');expect(screen.queryByRole('listitem')).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:/Legend/})).not.toBeInTheDocument();
    const readout=screen.queryByLabelText('OHLC readout');if(readout)expect(parseFloat(readout.style.top)).toBe(0);
  });
  it.each([320,390,430])('keeps zero/missing keyboard inspection and restores latest volume at %spx',async size=>{
    width=size;const api=React.createRef<MarketChartHandle>();render(<Harness api={api}/>);await screen.findByRole('listitem',{name:'vol: 8765432.125'});
    const bars=sharedAverageBars();await act(async()=>api.current?.setCrosshairPosition(bars[0].time,bars[0].close));expect(await screen.findByRole('listitem',{name:'vol: 0'})).toBeVisible();
    fireEvent.keyDown(screen.getByRole('img',{name:'Interactive market price chart'}),{key:'ArrowRight'});
    await waitFor(()=>expect(screen.queryByRole('listitem')).not.toBeInTheDocument());expect(parseFloat(screen.getByLabelText('OHLC readout').style.top)).toBe(0);expect(screen.getByLabelText(`close: ${bars[1].close}`)).toHaveAttribute('title',String(bars[1].close));
    await act(async()=>api.current?.clearCrosshairPosition());expect(await screen.findByRole('listitem',{name:'vol: 8765432.125'})).toBeVisible();
  });
  it('switches expanded/default/compact without altering saved evidence, requests, admitted lines or title focus',async()=>{
    const state=sharedAverageState(),capture=captureEngine(),requests=vi.fn(),changed=vi.fn(),financial=vi.fn(),results=JSON.stringify(sharedAverageResults(state)),saved=serializeTechnicalChartViewState(state),keys=createCalculationRequests('board-inline','SYNTHETIC','5m',state),props={state,...capture,requests,changed,financial};
    const view=render(<Harness {...props}/>);await screen.findByRole('listitem',{name:'vol: 8765432.125'});await waitFor(()=>expect(capture.series).toHaveBeenCalled());const initialSeries=capture.series.mock.calls.at(-1)![0];
    const user=userEvent.setup(),title=screen.getByRole('button',{name:'Board title'});title.focus();await user.keyboard('{Enter}');expect(await screen.findByRole('menu',{name:'SYNTHETIC pane actions'})).toBeVisible();await user.keyboard('{Escape}');await waitFor(()=>expect(title).toHaveFocus());
    const requestCount=requests.mock.calls.length;view.rerender(<Harness {...props} mode="inline"/>);expect(await screen.findAllByRole('listitem')).toHaveLength(5);for(const study of sharedAverages)expect(screen.getByRole('listitem',{name:`${study.definitionId.toUpperCase()} ${study.period}: ${study.values[7]}`})).toBeVisible();
    view.rerender(<Harness {...props} mode="default"/>);expect(await screen.findByRole('button',{name:/^Legend:/})).toBeVisible();await user.click(screen.getByRole('button',{name:/^Legend:/}));expect(await screen.findByRole('dialog')).toBeVisible();
    view.rerender(<Harness {...props}/>);expect(await screen.findByRole('listitem',{name:'vol: 8765432.125'})).toBeVisible();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(capture.factory).toHaveBeenCalledTimes(1);expect(requests).toHaveBeenCalledTimes(requestCount);expect(financial).not.toHaveBeenCalled();expect(changed).not.toHaveBeenCalled();expect(capture.series.mock.calls.at(-1)![0]).toEqual(initialSeries);expect(serializeTechnicalChartViewState(state)).toBe(saved);expect(JSON.stringify(sharedAverageResults(state))).toBe(results);expect(createCalculationRequests('board-inline','SYNTHETIC','5m',state)).toEqual(keys);
  });
  it.each(['warmup','partial','rejected'] as const)('retains %s warnings/admission and exposes exact selected values only when expanded',async evidence=>{
    const capture=captureEngine(),view=render(<Harness evidence={evidence} factory={capture.factory}/>);await screen.findByRole('listitem',{name:'vol: 8765432.125'});expect(screen.queryByRole('listitem',{name:/EMA|SMA/})).not.toBeInTheDocument();expect(screen.getByLabelText('Supplied calculation status')).toHaveTextContent(evidence==='rejected'?'Stale response rejected':'Warning');expect(screen.getByLabelText('Supplied calculation status')).toHaveClass('max-h-16','overflow-y-auto');expect(screen.getByLabelText('Supplied calculation status')).toHaveAttribute('tabindex','0');
    view.rerender(<Harness evidence={evidence} factory={capture.factory} mode="inline"/>);expect(await screen.findAllByRole('listitem')).toHaveLength(5);const name=evidence==='partial'?'EMA 20: 33.123456789':'EMA 20: No supplied sample / warmup';expect(screen.getByRole('listitem',{name})).toHaveAccessibleDescription(expect.stringContaining(evidence==='rejected'?'Last':'warning'));expect(screen.getByLabelText('Supplied calculation status')).toHaveTextContent(evidence==='rejected'?'Stale response rejected':'Warning');expect(screen.getByLabelText('Supplied calculation status')).not.toHaveAttribute('tabindex');expect(screen.getByLabelText('Supplied calculation status')).not.toHaveClass('max-h-16');
  });
});
describe('shared page-key palette and sparse producer observations',()=>{
  it.each(['light','dark'] as const)('%s stroke colors follow periods across reverse order and sparse/null results',async(theme:SharedAverageTheme)=>{
    const selected=sharedAverages.map(study=>study.id),state=sharedAverageState(theme,selected),reversed=sharedAverageState(theme,[...selected].reverse()),capture=captureEngine(),keys=(value:typeof state)=>Object.fromEntries(createCalculationRequests('board-inline','SYNTHETIC','5m',value).map(request=>[request.instanceId,request.requestKey]));
    const view=render(<Harness state={state} factory={capture.factory}/>);await waitFor(()=>expect(capture.series.mock.calls.at(-1)?.[0]).toHaveLength(4));view.rerender(<Harness state={reversed} factory={capture.factory} evidence="sparse"/>);
    await waitFor(()=>expect(capture.series.mock.calls.at(-1)?.[0][0].id).toBe('board-200:sma'));
    for(const study of sharedAverages){const line=capture.series.mock.calls.at(-1)![0].find(item=>item.id===`${study.id}:${study.definitionId}`)!;expect(line.color).toBe(sharedAveragePalette[theme][study.period]);expect(line.points).toHaveLength(6);expect(line.points[0].value).toBeNull();}
    expect(keys(reversed)).toEqual(keys(state));expect(await screen.findAllByRole('listitem')).toHaveLength(1);expect(capture.factory).toHaveBeenCalledTimes(1);
  });
});
