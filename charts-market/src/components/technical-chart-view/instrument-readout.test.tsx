import * as React from 'react';
import {act,cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TechnicalChartView,useTechnicalPaneMenu} from '.';
import type {TechnicalChartInstrumentReadout} from './instrument-readout';
import {instrumentBars,instrumentDefinitions,instrumentObservations,instrumentResults,instrumentState,instrumentTestLogo,originalDecimal} from './instrument-readout-fixture';
import {createMarketChartEngine} from '../../engine';
import {createCalculationRequests,serializeTechnicalChartViewState,type MarketChartEngineFactory,type OhlcBar,type TechnicalChartGeometry} from '../../core';
import type {MarketChartHandle} from '../market-chart';

let width=800,headerHeight=40;
beforeEach(()=>{
  width=800;headerHeight=40;
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockImplementation(()=>width);
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){const height=this.hasAttribute('data-chart-pane-header')?headerHeight:0;return{x:0,y:0,left:0,right:width,top:0,bottom:height,width,height,toJSON(){return {};}};});
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);
});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
type State=ReturnType<typeof instrumentState>;
function Harness({bars=instrumentBars,state=instrumentState(),results=instrumentResults(state,bars),api,factory,requests=()=>{},changed=()=>{},metadata={},enabled=true,geometry}:{bars?:readonly OhlcBar[];state?:State;results?:ReturnType<typeof instrumentResults>;api?:React.Ref<MarketChartHandle>;factory?:MarketChartEngineFactory;requests?:()=>void;changed?:()=>void;metadata?:Partial<TechnicalChartInstrumentReadout>;enabled?:boolean;geometry?:(value:TechnicalChartGeometry)=>void}){
  const menu=useTechnicalPaneMenu();return <><button {...menu.getTriggerProps('price')}>Host pane actions</button><TechnicalChartView chartApiRef={api} engineFactory={factory} symbol="SYNTHETIC" interval="1D" data={bars} dataIdentity="instrument-synthetic" calculationMode="supplied" calculationIdentity="instrument-synthetic" availableIndicators={instrumentDefinitions} suppliedResults={results} state={state} onStateChange={changed} onCalculationRequest={requests}
    instrumentReadout={enabled?{name:'Synthetic Instruments',period:'1D',exchange:'SYNTHETIC XNAS',currency:'USD',logo:{src:instrumentTestLogo},exactValues:{identity:'instrument-synthetic',source:bars,observations:instrumentObservations(bars)},...metadata}:undefined}
    paneMenuTrigger="none" paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} onGeometryChange={geometry}
    appearance={{height:350,legends:'compact',suppliedDetails:false,suppliedStatus:'compact'}} features={{drawingRail:false,footer:false,dataTable:false}}/></>;
}
describe('combined public instrument header',()=>{
  it.each([320,390,800,1440])('renders one non-live OHLC block, supplied identity and inline named studies without legacy keys at %spx',async size=>{
    width=size;const view=render(<Harness/>);await screen.findByRole('listitem',{name:`vol: ${originalDecimal(instrumentBars[7].volume)}`});
    expect(screen.getAllByLabelText('OHLC readout')).toHaveLength(1);expect(screen.getByLabelText('OHLC readout')).toHaveAttribute('aria-description',expect.stringContaining('Last'));
    expect(view.container.querySelector('[data-instrument-readout]')).toHaveAttribute('aria-live','off');
    expect(screen.getByLabelText(`close: ${originalDecimal(instrumentBars[7].close)}`)).toHaveAttribute('title',expect.stringContaining(originalDecimal(instrumentBars[7].close)!));
    expect(screen.getByLabelText('Instrument identity')).toHaveTextContent('Synthetic Instruments1DSYNTHETIC XNASUSD');expect(view.container.querySelector('img')).toHaveAttribute('alt','');
    expect(screen.queryByRole('button',{name:/Legend/})).not.toBeInTheDocument();expect(view.container.textContent).not.toMatch(/Bar volume|Rising bar|Falling bar/);expect(screen.getAllByText('vol',{exact:true})).toHaveLength(1);expect(screen.queryByRole('button',{name:'Add study'})).not.toBeInTheDocument();
  });
  it('synchronizes original OHLC/vol/studies by exact timestamp for public API and keyboard inspection, clearing restores latest',async()=>{
    const api=React.createRef<MarketChartHandle>(),view=render(<Harness api={api}/>);await screen.findByRole('listitem',{name:/vol:/});
    await act(async()=>api.current?.setCrosshairPosition(instrumentBars[0].time,instrumentBars[0].close));expect(await screen.findByRole('listitem',{name:'vol: 0'})).toHaveTextContent('0');expect(screen.getByLabelText(`open: ${originalDecimal(instrumentBars[0].open)}`)).toBeVisible();
    const chart=screen.getByRole('img',{name:'Interactive market price chart'});fireEvent.keyDown(chart,{key:'ArrowRight'});await screen.findByRole('listitem',{name:'vol: No supplied sample / warmup'});expect(screen.getByLabelText(`close: ${originalDecimal(instrumentBars[1].close)}`)).toBeVisible();expect(view.container.querySelector('[aria-live="polite"]')).toHaveTextContent(`close: ${originalDecimal(instrumentBars[1].close)}`);expect(view.container.querySelector('[aria-live="polite"]')).toHaveTextContent('vol: Unavailable');expect(view.container.querySelector('[aria-live="polite"]')).toHaveTextContent('EMA 20');
    await act(async()=>api.current?.clearCrosshairPosition());expect(await screen.findByRole('listitem',{name:`vol: ${originalDecimal(instrumentBars[7].volume)}`})).toBeVisible();
  });
  it('keeps a missing exact observation unavailable instead of borrowing the latest bar and restores idle explicitly',async()=>{
    const api=React.createRef<MarketChartHandle>(),bars=instrumentBars.filter((_,index)=>index!==3);render(<Harness bars={bars} api={api}/>);await screen.findByRole('listitem',{name:/vol:/});
    await act(async()=>api.current?.setCrosshairPosition(instrumentBars[3].time,34));expect(await screen.findByLabelText('close: Unavailable')).toBeVisible();expect(screen.getByLabelText('OHLC readout')).toHaveAttribute('aria-description','Inspection unavailable · no observation');for(const item of screen.getAllByRole('listitem'))expect(item).toHaveTextContent('—');
    await act(async()=>api.current?.clearCrosshairPosition());expect(await screen.findByLabelText(`close: ${originalDecimal(instrumentBars[7].close)}`)).toBeVisible();
  });
  it('metadata, logo and opt-out changes preserve engine, requests, saved state, economic keys and supplied bytes',async()=>{
    const state=instrumentState(),results=instrumentResults(state),factory=vi.fn(createMarketChartEngine),requests=vi.fn(),changed=vi.fn(),saved=serializeTechnicalChartViewState(state),keys=createCalculationRequests('instrument-synthetic','SYNTHETIC','1D',state),bytes=JSON.stringify(results),props={state,results,factory,requests,changed};const view=render(<Harness {...props}/>);await screen.findByRole('listitem',{name:/vol:/});const count=requests.mock.calls.length;
    view.rerender(<Harness {...props} metadata={{name:'Another supplied display name',period:'Daily',exchange:'SYNTHETIC XLON',logo:undefined}}/>);await screen.findByText('Another supplied display name');expect(view.container.querySelector('img')).not.toBeInTheDocument();expect(factory).toHaveBeenCalledTimes(1);expect(requests).toHaveBeenCalledTimes(count);expect(changed).not.toHaveBeenCalled();expect(serializeTechnicalChartViewState(state)).toBe(saved);expect(createCalculationRequests('instrument-synthetic','SYNTHETIC','1D',state)).toEqual(keys);expect(JSON.stringify(results)).toBe(bytes);
    view.rerender(<Harness {...props} enabled={false}/>);expect(await screen.findByRole('button',{name:/^Legend:/})).toBeVisible();expect(view.container.querySelector('[data-instrument-readout]')).not.toBeInTheDocument();view.rerender(<Harness {...props}/>);await screen.findByRole('listitem',{name:/vol:/});expect(factory).toHaveBeenCalledTimes(1);expect(requests).toHaveBeenCalledTimes(count);
  });
  it('retains warning/rejection semantics, complete name focus/hover and public pane-menu focus return',async()=>{
    const state=instrumentState(),name='A fully supplied long company name that remains available to keyboard users',view=render(<Harness state={state} results={instrumentResults(state,instrumentBars,'1D','partial')} metadata={{name}}/>);await screen.findByRole('listitem',{name:'EMA 20: No supplied sample / warmup'});expect(screen.getByLabelText('Supplied calculation status')).toHaveTextContent('Warning');const identity=screen.getByLabelText(new RegExp(name));identity.focus();expect(await screen.findByRole('tooltip')).toHaveTextContent(name);
    const user=userEvent.setup(),trigger=screen.getByRole('button',{name:'Host pane actions'});await user.click(trigger);expect(await screen.findByRole('menu',{name:'SYNTHETIC pane actions'})).toBeVisible();await user.keyboard('{Escape}');await waitFor(()=>expect(trigger).toHaveFocus());
    view.rerender(<Harness state={state} results={instrumentResults(state,instrumentBars,'1D','rejected')}/>);await waitFor(()=>expect(screen.getByLabelText('Supplied calculation status')).toHaveTextContent('Stale response rejected'));expect(screen.getByRole('listitem',{name:'EMA 20: No supplied sample / warmup'})).toHaveTextContent('—');
  });
  it('keeps empty data unavailable and supplied null distinct from valid numeric zero',async()=>{
    const view=render(<Harness bars={[]}/>);await screen.findByLabelText('close: Unavailable');expect(screen.getByLabelText('Instrument identity')).toHaveTextContent('Synthetic Instruments');
    const rows=instrumentObservations();rows[7]={...rows[7],open:null,volume:null};view.rerender(<Harness metadata={{exactValues:{identity:'instrument-synthetic',source:instrumentBars,observations:rows}}}/>);await screen.findByLabelText('open: Unavailable');expect(screen.getByLabelText(`close: ${originalDecimal(instrumentBars[7].close)}`)).toBeVisible();expect(within(screen.getByRole('list')).getByText('vol')).toBeVisible();
  });
  it('keeps a wrapped header inside its pane with real plot space and reports host overflow without mutating saved minima',async()=>{
    width=390;headerHeight=205;const state=instrumentState(true);state.panes[1].size=130;const saved=serializeTechnicalChartViewState(state),api=React.createRef<MarketChartHandle>(),geometry=vi.fn();render(<Harness state={state} api={api} geometry={geometry}/>);await screen.findByLabelText('OHLC readout');await waitFor(()=>expect(geometry.mock.calls.at(-1)?.[0].overflow).toBe(true));
    const snapshot=api.current!.getSnapshot()!;expect(snapshot.panes).toHaveLength(2);for(const pane of snapshot.panes)expect(pane.height-205-(pane.id==='price'?28:10)).toBeGreaterThanOrEqual(48);expect(serializeTechnicalChartViewState(state)).toBe(saved);expect(state.panes.map(p=>p.minimumSize)).toEqual([100,90]);expect(geometry.mock.calls.at(-1)![0].availableHeight).toBe(350);
  });
});
