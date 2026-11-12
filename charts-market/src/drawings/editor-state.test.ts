import {describe,it,expect} from 'vitest';
import type {DrawingState,MarketChartEngine} from '../core';
import {createDrawingHistory,reduceDrawingHistory,drawingDocumentsEqual} from './index';
import {drawingVisibleAtInterval,exactDrawingCoordinates,retainExactCoordinate,marketDrawingGeometryKey,drawingStatisticValue,localDateTime,localTimeCandidates,validExactTime,validExactPrice,validateDrawingEditorDraft} from './editor-state';
import {selectedTimelineLayout} from './editor-overlays';
import {clampEditorPosition} from './use-editor-position';
const epoch=Date.parse('2026-10-28T12:00:00Z')/1000;
const drawing=(patch:Partial<DrawingState>={}):DrawingState=>({id:'a',type:'trend-line',version:1,visible:true,locked:false,parameters:{color:'#2563eb',lineWidth:1},points:[{time:epoch,price:100,priceText:'100.000000000000000001',utcTimeText:'2026-10-28T12:00:00.000001Z'},{time:epoch+86400,price:110,priceText:'110.000',utcTimeText:'2026-10-29T12:00:00Z'}],...patch});
describe('lossless drawing editor contracts',()=>{
  it('compares UTC spelling and trailing zeros semantically without losing distinct microseconds',()=>{
    const withTime=(text:string)=>({...drawing(),points:drawing().points.map((point,index)=>index?point:{...point,time:epoch+.123,utcTimeText:text})});
    const a=withTime('2026-10-28T12:00:00.123Z'),b=withTime('2026-10-28T12:00:00.123000+00:00');
    expect(drawingDocumentsEqual([a],[b])).toBe(true);expect(marketDrawingGeometryKey(a)).toBe(marketDrawingGeometryKey(b));
    const c=withTime('2026-10-28T12:00:00.123456Z'),d=withTime('2026-10-28T12:00:00.123457Z');
    expect(drawingDocumentsEqual([c],[d])).toBe(false);expect(marketDrawingGeometryKey(c)).not.toBe(marketDrawingGeometryKey(d));
    expect(a.points[0].utcTimeText).toBe('2026-10-28T12:00:00.123Z');
  });
  it('distinct decimal text with an identical numeric projection remains independently undoable',()=>{
    const original=drawing(),changed={...original,points:original.points.map((p,i)=>i? p:{...p,priceText:'100.000000000000000002'})};
    expect(changed.points[0].price).toBe(original.points[0].price);
    let history=reduceDrawingHistory(createDrawingHistory([original]),{type:'commit',drawings:[changed],metadata:{type:'style',drawingIds:['a']}});
    expect(history.past).toHaveLength(1);expect(exactDrawingCoordinates(history.present)[0].price).toBe('100.000000000000000002');
    history=reduceDrawingHistory(history,{type:'undo'});expect(exactDrawingCoordinates(history.present)[0]).toEqual({drawingId:'a',pointIndex:0,price:'100.000000000000000001',utcTime:'2026-10-28T12:00:00.000001Z'});
    history=reduceDrawingHistory(history,{type:'redo'});expect(exactDrawingCoordinates(history.present)[0].price).toBe('100.000000000000000002');
    expect(marketDrawingGeometryKey(original)).not.toBe(marketDrawingGeometryKey(changed));
  });
  it('geometry edits retain unrelated exact bytes and discard only moved coordinates',()=>{
    const p=drawing().points[0];
    expect(retainExactCoordinate(p,{...p,time:epoch+60})).toEqual({...p,time:epoch+60,utcTimeText:undefined});
    expect(retainExactCoordinate(p,{...p,price:101})).toEqual({...p,price:101,priceText:undefined});
    expect(retainExactCoordinate(p,{time:p.time,price:p.price})).toEqual(p);
  });
  it('price and UTC syntax preserve the private DTO contract and reject invalid calendar dates',()=>{
    expect(validExactTime('2026-10-28T12:00:00.000001+00:00')).toBe(true);
    for(const value of ['2026-10-28T12:00:00+01:00','2026-10-28T12:00:00-00:00','2026-10-28T12:00:00.0000001Z','0000-01-01T00:00:00Z'])expect(validExactTime(value)).toBe(false);
    expect(localTimeCandidates('0000-01-01T00:00','UTC')).toEqual([]);
    for(const value of ['1e2','+2','01','.5','1.','NaN','Infinity','1,000'])expect(validExactPrice(value)).toBe(false);
    expect(validExactPrice('-0.0000001')).toBe(true);expect(validExactTime('2026-02-30T12:00:00Z')).toBe(false);
    expect(validExactTime(drawing().points[0].utcTimeText,epoch)).toBe(true);expect(validExactTime('2026-10-28T12:00:00+00:00')).toBe(true);
  });
  it('financial statistics require both admitted context and exact authored geometry',()=>{
    const original=drawing(),result={drawingId:'a',geometryKey:marketDrawingGeometryKey(original),contextKey:'accepted-7',values:{price_range:'10.000000000000000001',percent_change:'supplied only',bars_range:'2',date_time_range:null}};
    const pixels=[{x:0,y:0},{x:3,y:-4}];
    expect(drawingStatisticValue('price_range',original,pixels,[result],'accepted-7')).toBe('10.000000000000000001');
    expect(drawingStatisticValue('price_range',original,pixels,[result])).toBeNull();
    expect(drawingStatisticValue('price_range',original,pixels,[result],'other-account')).toBeNull();
    expect(drawingStatisticValue('price_range',{...original,points:original.points.map((p,i)=>i?p:{...p,priceText:'100.000000000000000002'})},pixels,[result],'accepted-7')).toBeNull();
    expect(drawingStatisticValue('date_time_range',original,pixels,[result],'accepted-7')).toBeNull();
    expect(drawingStatisticValue('change_in_pips',original,pixels,[result],'accepted-7')).toBeNull();
    expect(drawingStatisticValue('distance',original,pixels,[])).toBe('5.0 px');
    expect(drawingStatisticValue('distance',original,[{x:0,y:0},{x:6,y:-8}],[])).toBe('10.0 px');
  });
  it('absent defaults never create a document/history change',()=>{
    const original=drawing(),history=createDrawingHistory([original]);
    expect(reduceDrawingHistory(history,{type:'commit',drawings:JSON.parse(JSON.stringify([original])),metadata:{type:'style',drawingIds:['a']}})).toBe(history);
    expect(original.parameters).not.toHaveProperty('presentation');
  });
  it.each([['1m',true],['59m',false],['1h',true],['24h',true],['1D',true],['1W',true],['1M',true],['30s',true],['1tick',true],['range',true]])('visibility for %s preserves omission and unsupported families', (interval,visible)=>{
    const item=drawing({parameters:{presentation:{visibility:{minutes:{enabled:true,min:1,max:30}}}}});
    expect(drawingVisibleAtInterval(item,String(interval))).toBe(visible);
  });
  it('checks explicit range bounds, tool applicability and text limits without inventing defaults',()=>{
    expect(validateDrawingEditorDraft(drawing({parameters:{}}))).toBeNull();
    expect(validateDrawingEditorDraft(drawing({parameters:{presentation:{visibility:{days:{enabled:true,min:10,max:2}}}}}))).toContain('Interval');
    expect(validateDrawingEditorDraft(drawing({type:'vertical-line',parameters:{presentation:{priceLabels:true}}}))).toContain('Vertical');
  });
});
describe('timezone/ruler labels and viewport placement',()=>{
  it('formats Unix seconds in the explicit chart timezone',()=>{
    expect(localDateTime(epoch,'UTC')).toBe('2026-10-28T12:00:00');
    expect(localDateTime(epoch,'America/New_York')).toBe('2026-10-28T08:00:00');
  });
  it('rejects spring gaps and exposes both UTC choices for fall folds',()=>{
    expect(localTimeCandidates('2026-03-08T02:30:00','America/New_York')).toEqual([]);
    expect(localTimeCandidates('2026-11-01T01:30:00','America/New_York')).toEqual([{utcTime:'2026-11-01T05:30:00Z',offset:'UTC-04:00'},{utcTime:'2026-11-01T06:30:00Z',offset:'UTC-05:00'}]);
    expect(localTimeCandidates('2026-10-28T08:00:00.125','America/New_York')[0].utcTime).toBe('2026-10-28T12:00:00.125Z');
  });
  it('keeps coincident/reversed/offscreen anchor dates on the real ruler and never expands rays',()=>{
    const engine={coordinateForTime:(time:unknown)=>(Number(time)-epoch)/86400*50+10,getSnapshot:()=>({timeAxis:{left:0,top:200,width:200,height:28,futureFrom:epoch},viewport:{logicalRange:{from:0,to:4}}})} as unknown as MarketChartEngine;
    const original=drawing(),reversed={...original,points:original.points.slice().reverse()};
    const labels=selectedTimelineLayout(reversed,engine,'America/New_York');expect(labels.map(l=>l.pointIndex)).toEqual([1,0]);expect(labels[1].row).toBe(1);expect(labels[1].fullLabel).toContain('(UTC)');
    expect(selectedTimelineLayout({...original,parameters:{extendLeft:true,extendRight:true}},engine)).toEqual(selectedTimelineLayout(original,engine));
    expect(selectedTimelineLayout({...original,points:[original.points[0],original.points[0]]},engine).map(l=>l.row)).toEqual([0,1]);
    expect(selectedTimelineLayout({...original,points:[{time:epoch+10*86400,price:1}]},engine)[0]).toMatchObject({x:200,offscreen:true});
    expect(original.points[0].utcTimeText).toBe('2026-10-28T12:00:00.000001Z');
  });
  it('clamps a fixed toolbar to the visual viewport including keyboard/zoom offsets',()=>{
    expect(clampEditorPosition({x:900,y:800},{width:180,height:52},{left:20,top:40,width:320,height:240})).toEqual({x:152,y:220});
    expect(clampEditorPosition({x:-1,y:-100},{width:500,height:300},{left:0,top:0,width:320,height:200})).toEqual({x:8,y:8});
  });
});
