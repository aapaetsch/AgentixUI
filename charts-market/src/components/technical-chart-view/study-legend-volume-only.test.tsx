import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createTechnicalChartViewState, type OhlcBar} from '../../core';
import {inlineStudyGroups, StudyLegend, type StudyLegendGroup} from './study-legend';
import {supplementaryLegendGroups} from './legend-groups';
import {MeasuredPaneHeader} from './pane-header';

const bar: OhlcBar={time:1,open:10,high:12,low:9,close:11,volume:42};
const volumeGroups=(value:number|null|undefined,enabled=true,hasBar=true)=>{
  const state=createTechnicalChartViewState('price-only');state.panes[0].showVolume=enabled;
  return supplementaryLegendGroups(state,'price',1,hasBar?{...bar,volume:value??undefined}:undefined,{},{});
};
const impostors:StudyLegendGroup[]=['MA','VWAP','profile','drawing'].map((name,index)=>({id:index?'bar-volume:'+name:'bar-volume:price',label:index?'vol':'Bar volume',inlineLabel:'vol',lines:[{label:name,value:999,color:'#123456'}]}));
const props={width:320,timeLabel:'Inspected accepted observation',showIdentity:true};
beforeEach(()=>{vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockReturnValue({x:0,y:0,left:0,top:0,right:320,bottom:16,width:320,height:16,toJSON(){return {};}});});
afterEach(()=>{cleanup();vi.restoreAllMocks();});

describe('semantic volume-only readout projection',()=>{
  it('accepts only the explicit actual bar-volume group, never MA/VWAP/profile/drawing names or IDs',()=>{
    const actual=volumeGroups(42),all=[...impostors,...actual];
    expect(actual[0].kind).toBe('bar-volume');expect(actual[0].lines.filter(line=>line.showValue!==false)).toHaveLength(1);
    expect(inlineStudyGroups(all,true)).toEqual(actual);expect(all).toHaveLength(5);
    const view=render(<StudyLegend {...props} groups={all} volumeOnly/>);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);expect(screen.getByRole('listitem',{name:'vol: 42'})).toHaveAttribute('title',expect.stringContaining(props.timeLabel));
    expect(view.container.textContent).toBe('vol42');expect(view.container.querySelectorAll('button,[tabindex],[data-legend-swatch]')).toHaveLength(0);expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it.each([0,42,1234567.125])('keeps finite supplied volume %s with its exact raw accessible identity',value=>{
    render(<StudyLegend {...props} groups={volumeGroups(value)} volumeOnly/>);
    expect(screen.getByRole('listitem',{name:`vol: ${value}`})).toHaveAttribute('title',expect.stringContaining(`vol: ${value}`));
  });
  it.each([null,undefined,NaN,Infinity,-Infinity])('renders no DOM or positive reservation for unavailable volume %s',value=>{
    const heights=vi.fn(),groups=volumeGroups(value);
    expect(inlineStudyGroups(groups,true)).toEqual([]);
    const view=render(<StudyLegend {...props} groups={[...impostors,...groups]} volumeOnly onHeightChange={heights}/>);
    expect(view.container).toBeEmptyDOMElement();expect(heights).toHaveBeenLastCalledWith(0);expect(heights.mock.calls.every(([n])=>n===0)).toBe(true);
  });
  it.each([{enabled:false,hasBar:true},{enabled:true,hasBar:false}])('allocates nothing for hidden volume or no accepted bar: %j',({enabled,hasBar})=>{
    const groups=volumeGroups(42,enabled,hasBar);expect(inlineStudyGroups(groups,true)).toEqual([]);
    expect(renderToStaticMarkup(<StudyLegend {...props} groups={groups} volumeOnly/>)).toBe('');
  });
  it('does not let a finite color-key line create volume presence',()=>{
    const groups:StudyLegendGroup[]=[{id:'actual',kind:'bar-volume',label:'Bar volume',lines:[{label:'Rising',color:'red',value:100,showValue:false},{label:'Vol',color:'transparent',value:null}]}];
    expect(inlineStudyGroups(groups,true)).toEqual([]);
  });
  it('retains all numeric and missing rows in legacy inline and default disclosures',()=>{
    const groups=[...impostors.map(group=>({...group,id:`study:${group.id}`})),...volumeGroups(undefined)],view=render(<StudyLegend {...props} groups={groups} inline/>);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);expect(screen.getByRole('listitem',{name:'vol: No supplied sample / warmup'})).toBeVisible();
    view.rerender(<StudyLegend {...props} width={900} groups={groups}/>);
    expect(screen.getByRole('button',{name:/^Legend: all 5/})).toBeVisible();expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
  it('closes stale default dialogs on entry and preserves natural/zero/legacy measurements through transitions',()=>{
    const heights=vi.fn(),groups=[...impostors.map(group=>({...group,id:`study:${group.id}`})),...volumeGroups(42)],view=render(<StudyLegend {...props} groups={groups} onHeightChange={heights}/>);
    fireEvent.click(screen.getByRole('button',{name:/^Legend:/}));expect(screen.getByRole('dialog')).toBeVisible();expect(heights).toHaveBeenLastCalledWith(28);
    view.rerender(<StudyLegend {...props} groups={groups} volumeOnly onHeightChange={heights}/>);expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(screen.queryByRole('button')).not.toBeInTheDocument();expect(heights).toHaveBeenLastCalledWith(16);
    view.rerender(<StudyLegend {...props} groups={impostors} volumeOnly onHeightChange={heights}/>);expect(heights).toHaveBeenLastCalledWith(0);expect(screen.queryByRole('list')).not.toBeInTheDocument();
    view.rerender(<StudyLegend {...props} groups={groups} inline onHeightChange={heights}/>);expect(screen.getAllByRole('listitem')).toHaveLength(5);expect(heights).toHaveBeenLastCalledWith(16);
    view.rerender(<StudyLegend {...props} groups={groups} onHeightChange={heights}/>);expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(heights).toHaveBeenLastCalledWith(28);
  });
  it('uses the same projection to remove actual measured header content and restore controls allocation',()=>{
    const height=vi.fn(),available=inlineStudyGroups(volumeGroups(42),true),view=render(<MeasuredPaneHeader hasContent={available.length>0} compactReadout onHeightChange={height} label="Volume header"><StudyLegend {...props} groups={available} volumeOnly/></MeasuredPaneHeader>);
    expect(height).toHaveBeenLastCalledWith(16);
    view.rerender(<MeasuredPaneHeader hasContent={false} compactReadout onHeightChange={height} label="Volume header" children={null}/>);expect(height).toHaveBeenLastCalledWith(0);
    view.rerender(<MeasuredPaneHeader hasContent onHeightChange={height} label="Volume header"><button>Pane actions</button></MeasuredPaneHeader>);expect(height).toHaveBeenLastCalledWith(28);
  });
  it('SSR emits only the supplied numeric volume item and no hidden disclosure or indicator keys',()=>{
    const html=renderToStaticMarkup(<StudyLegend {...props} groups={[...impostors,...volumeGroups(0)]} volumeOnly/>);
    expect(html).toContain('aria-label="vol: 0"');expect(html).not.toMatch(/button|tabindex|data-legend-swatch|Bar volume|999|dialog/);
  });
});
