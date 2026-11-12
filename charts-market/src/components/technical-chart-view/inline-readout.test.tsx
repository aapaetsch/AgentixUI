import * as React from 'react';
import {act,cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {TechnicalChartView,useTechnicalPaneMenu} from '.';
import {StudyLegend,type StudyLegendGroup} from './study-legend';
import {MeasuredPaneHeader} from './pane-header';
import {supplementaryLegendGroups} from './legend-groups';
import {inlineBars,inlineDefinitions,inlineResults,inlineState,inlineStudies} from './inline-readout-fixture';
import {createMarketChartEngine} from '../../engine';
import {createCalculationRequests,serializeTechnicalChartViewState,type MarketChartEngineFactory} from '../../core';
import type {MarketChartHandle} from '../market-chart';

let width=430,headerHeight=16;
beforeEach(()=>{
  vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockImplementation(()=>width);
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){const height=this.hasAttribute('data-chart-pane-header')||this.getAttribute('aria-label')==='Visible chart legend'?headerHeight:0;return{x:0,y:0,left:0,right:width,top:0,bottom:height,width,height,toJSON(){return {};}};});
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);
  width=430;headerHeight=16;
});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
const groups=():StudyLegendGroup[]=>[...inlineStudies.map(study=>({id:study.id,label:`${study.definitionId.toUpperCase()} ${study.period}`,lines:[{label:study.definitionId.toUpperCase(),value:study.values[7],color:study.color}]})),...supplementaryLegendGroups(inlineState(),'price',inlineBars[7].time,inlineBars[7],{}, {})];
describe('opt-in inline projection',()=>{
  it.each([200,320,390,430,800])('shows all supplied study values and exactly one lowercase vol without disclosure at %spx',n=>{
    const view=render(<StudyLegend groups={groups()} inline width={n} timeLabel="Inspect explicit observation" showIdentity={false}/>);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);expect(screen.queryByRole('button')).not.toBeInTheDocument();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    for(const study of inlineStudies)expect(screen.getByRole('listitem',{name:`${study.definitionId.toUpperCase()} ${study.period}: ${study.values[7]}`})).toHaveAttribute('title',expect.stringContaining('Inspect explicit observation'));
    expect(screen.getByRole('listitem',{name:'vol: 8765432.125'})).toHaveTextContent(/^vol/);expect(view.container.textContent).not.toMatch(/Bar volume|Rising bar|Falling bar|vol vol|Legend|Vol/);
    expect(screen.getAllByText('vol',{exact:true})).toHaveLength(1);expect(view.container.querySelectorAll('button,[tabindex]')).toHaveLength(0);
  });
  it('keeps exact missing/zero values and status/source metadata without inventing observations or formatting color keys',()=>{
    const items=groups();items[0].lines[0].value=null;items[1].lines[0].value=0;items[0].result={kind:'indicator',requestKey:'supplied',status:'partial',points:[],stale:true,warning:'Coverage gap',provenanceLabel:'Source identity',coverageSummary:'No final sample'};
    render(<StudyLegend groups={items} inline width={320} timeLabel="Inspect" showIdentity/>);
    const missing=screen.getByRole('listitem',{name:'EMA 20: No supplied sample / warmup'});expect(missing).toHaveTextContent('—');expect(missing).toHaveAccessibleDescription(expect.stringContaining('Coverage gap'));expect(missing).toHaveAccessibleDescription(expect.stringContaining('Source identity'));expect(screen.getByRole('listitem',{name:'SMA 50: 0'})).toHaveTextContent('0');
  });
  it('clears an open default dialog on opt-in and restores unchanged default chrome on opt-out',async()=>{
    const props={groups:groups(),width:320,timeLabel:'Last',showIdentity:true};const view=render(<StudyLegend {...props}/>),user=userEvent.setup();await user.click(screen.getByRole('button',{name:/^Legend:/}));expect(await screen.findByRole('dialog')).toBeVisible();
    view.rerender(<StudyLegend {...props} inline/>);expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(screen.queryByRole('button')).not.toBeInTheDocument();view.rerender(<StudyLegend {...props}/>);expect(screen.getByRole('button',{name:/^Legend:/})).toBeVisible();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('does not allocate inline presence for color-only groups; measures natural height and restores legacy minimum on mode change',()=>{
    const heights=vi.fn(),colorOnly:StudyLegendGroup[]=[{id:'key',label:'Color key',lines:[{label:'Rising',color:'#123456',value:null,showValue:false}]}];
    const view=render(<StudyLegend groups={colorOnly} inline width={320} timeLabel="Last" showIdentity onHeightChange={heights}/>);expect(screen.queryByRole('list')).not.toBeInTheDocument();expect(heights).toHaveBeenLastCalledWith(0);
    view.rerender(<StudyLegend groups={groups()} inline width={320} timeLabel="Last" showIdentity onHeightChange={heights}/>);expect(heights).toHaveBeenLastCalledWith(16);
    view.rerender(<StudyLegend groups={groups()} width={320} timeLabel="Last" showIdentity onHeightChange={heights}/>);expect(heights).toHaveBeenLastCalledWith(28);
    const header=vi.fn();view.unmount();const measured=render(<MeasuredPaneHeader hasContent compactReadout onHeightChange={header} label="Readout"><span>vol 1</span></MeasuredPaneHeader>);expect(header).toHaveBeenLastCalledWith(16);expect(screen.getByLabelText('Readout')).not.toHaveClass('min-h-7');measured.rerender(<MeasuredPaneHeader hasContent onHeightChange={header} label="Readout"><span>vol 1</span></MeasuredPaneHeader>);expect(header).toHaveBeenLastCalledWith(28);measured.rerender(<MeasuredPaneHeader hasContent={false} compactReadout onHeightChange={header} label="Readout" children={null}/>);expect(header).toHaveBeenLastCalledWith(0);
  });
});
function Harness({state=inlineState(),inline=true,api,factory,changed=()=>{},results=inlineResults(state),requests=()=>{}}:{state?:ReturnType<typeof inlineState>;inline?:boolean;api?:React.Ref<MarketChartHandle>;factory?:MarketChartEngineFactory;changed?:()=>void;results?:ReturnType<typeof inlineResults>;requests?:()=>void}){
  const menu=useTechnicalPaneMenu();return <><button {...menu.getTriggerProps('price')}>Board title</button><TechnicalChartView symbol="SYNTHETIC" interval="5m" data={inlineBars} state={state} onStateChange={changed} chartApiRef={api} engineFactory={factory} calculationMode="supplied" calculationIdentity="board-inline" suppliedResults={results} availableIndicators={inlineDefinitions} onCalculationRequest={requests}
    paneMenuTrigger="none" paneMenu={menu.paneMenu} onPaneMenuChange={menu.onPaneMenuChange} priceReferences={[{id:'open',price:33,label:'Exact supplied regular open',showAxisLabel:true}]}
    appearance={{height:300,legends:width<540?'compact':'expanded',studyReadout:inline?'inline':undefined,suppliedDetails:false,suppliedStatus:'compact'}} features={{header:false,commands:false,drawingRail:false,footer:false,dataTable:false}}/></>;
}
describe('public Board presentation',()=>{
  for(const size of [320,900])for(const volume of [false,true])for(const selection of ['none','one','all'] as const)it(`${size}px ${selection} studies with volume ${volume} preserves each admitted line`,async()=>{
    width=size;const state=inlineState(selection,volume),setSeries=vi.fn(),factory:MarketChartEngineFactory=(host,options)=>{const engine=createMarketChartEngine(host,options),original=engine.setIndicatorSeries.bind(engine);engine.setIndicatorSeries=series=>{setSeries(series);original(series);};return engine;};
    render(<Harness state={state} factory={factory}/>);await screen.findByLabelText('OHLC readout');await waitFor(()=>expect(setSeries).toHaveBeenCalled());const expected=selection==='none'?[]:selection==='one'?inlineStudies.slice(0,1):inlineStudies;
    await waitFor(()=>expect(screen.queryAllByRole('listitem')).toHaveLength(expected.length+(volume?1:0)));const rendered=setSeries.mock.calls.at(-1)![0];expect(rendered).toHaveLength(expected.length);
    for(const study of expected){expect(screen.getByRole('listitem',{name:`${study.definitionId.toUpperCase()} ${study.period}: ${study.values[7]}`})).toBeVisible();expect(rendered.find((item:{id:string})=>item.id===`${study.id}:${study.definitionId}`).points).toEqual(inlineBars.map((bar,index)=>({time:bar.time,value:study.values[index]})));}
    expect(screen.queryByRole('button',{name:/Legend/})).not.toBeInTheDocument();await waitFor(()=>expect(parseFloat(screen.getByLabelText('OHLC readout').style.top)).toBe(expected.length||volume?16:0));
  });
  it.each(inlineStudies)('keeps individual $definitionId $period admitted in compact and expanded modes',async study=>{
    const state=inlineState();state.indicators=state.indicators.filter(item=>item.id===study.id);state.panes[0].studyIds=[study.id];const view=render(<Harness state={state}/>);expect(await screen.findByRole('listitem',{name:`${study.definitionId.toUpperCase()} ${study.period}: ${study.values[7]}`})).toBeVisible();width=900;view.rerender(<Harness state={state}/>);expect(screen.getByRole('listitem',{name:`${study.definitionId.toUpperCase()} ${study.period}: ${study.values[7]}`})).toBeVisible();
  });
  it('keeps exact crosshair/keyboard volume/OHLC, title actions and full source evidence independent from presentation',async()=>{
    const api=React.createRef<MarketChartHandle>(),changed=vi.fn(),requests=vi.fn(),state=inlineState(),results=inlineResults(state),saved=serializeTechnicalChartViewState(state),keys=createCalculationRequests('board-inline','SYNTHETIC','5m',state),resultBytes=JSON.stringify(results),factory=vi.fn(createMarketChartEngine),props={api,state,results,factory,requests,changed};const view=render(<Harness {...props}/>);
    await screen.findByRole('listitem',{name:'vol: 8765432.125'});await act(async()=>api.current?.setCrosshairPosition(inlineBars[0].time,inlineBars[0].close));expect(await screen.findByRole('listitem',{name:'vol: 0'})).toHaveAttribute('title',expect.stringContaining('Inspect'));const chart=screen.getByRole('img',{name:'Interactive market price chart'});fireEvent.keyDown(chart,{key:'ArrowRight'});expect(await screen.findByRole('listitem',{name:'vol: No supplied sample / warmup'})).toHaveTextContent('—');
    expect(screen.getByLabelText(`close: ${inlineBars[1].close}`)).toHaveAttribute('title',String(inlineBars[1].close));await act(async()=>api.current?.clearCrosshairPosition());expect(await screen.findByRole('listitem',{name:'vol: 8765432.125'})).toBeVisible();
    const user=userEvent.setup(),title=screen.getByRole('button',{name:'Board title'});title.focus();await user.keyboard('{Enter}');expect(await screen.findByRole('menu',{name:'SYNTHETIC pane actions'})).toBeVisible();await user.keyboard('{Escape}');await waitFor(()=>expect(title).toHaveFocus());
    const requestCount=requests.mock.calls.length;view.rerender(<Harness {...props} inline={false}/>);await screen.findByRole('button',{name:/Legend:/});view.rerender(<Harness {...props}/>);await screen.findByRole('listitem',{name:'vol: 8765432.125'});expect(requests).toHaveBeenCalledTimes(requestCount);expect(factory).toHaveBeenCalledTimes(1);expect(serializeTechnicalChartViewState(state)).toBe(saved);expect(JSON.stringify(results)).toBe(resultBytes);expect(createCalculationRequests('board-inline','SYNTHETIC','5m',state)).toEqual(keys);
    expect(screen.getByLabelText('Supplied calculation status')).toHaveTextContent('available');expect(screen.getByLabelText('Supplied price references')).toHaveTextContent('Exact supplied regular open: 33');expect(within(screen.getByRole('list')).queryByRole('button')).not.toBeInTheDocument();
  });
  it('keeps rejected and warmup results unavailable and warning/rejection semantics visible',async()=>{
    const state=inlineState(),view=render(<Harness state={state} results={inlineResults(state,'warmup')}/>);expect(await screen.findByRole('listitem',{name:'SMA 200: No supplied sample / warmup'})).toHaveTextContent('—');expect(screen.getByLabelText('Supplied calculation status')).toHaveTextContent('Warning');view.rerender(<Harness state={state} results={inlineResults(state,'rejected')}/>);await waitFor(()=>expect(screen.getByLabelText('Supplied calculation status')).toHaveTextContent('Stale response rejected'));expect(screen.getByRole('listitem',{name:'EMA 20: No supplied sample / warmup'})).toHaveTextContent('—');
  });
});
