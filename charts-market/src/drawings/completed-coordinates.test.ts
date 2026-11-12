import {describe,it,expect} from 'vitest';
import type {DrawingState} from '../core';
import {completeDrawingCoordinates} from './completed-coordinates';
const drawing=(id='a',price=100):DrawingState=>({id,type:'trend-line',version:1,visible:true,locked:false,parameters:{},points:[{time:Date.parse('2026-10-28T12:00:00Z')/1000,price}]});
describe('completed authored coordinates',()=>{
  it('preserves provided exact strings and stamps only affected supported completed frames',()=>{
    const exact={...drawing(),points:[{...drawing().points[0],priceText:'100.000000000000000001',utcTimeText:'2026-10-28T12:00:00.000001+00:00'}]},other=drawing('b');
    expect(completeDrawingCoordinates([exact,other],{type:'move',drawingIds:['a']},true)).toEqual([exact,other]);
    const completed=completeDrawingCoordinates([exact,other],{type:'create',drawingIds:['b']},true)!;
    expect(completed[0]).toBe(exact);expect(completed[1].points[0]).toMatchObject({priceText:'100',utcTimeText:'2026-10-28T12:00:00.000Z'});expect(other.points[0].priceText).toBeUndefined();
  });
  it('leaves selection, cancellation, style, opt-out and unrelated objects byte-identical',()=>{
    const original=[drawing()];for(const type of ['selection','cancel','style'])expect(completeDrawingCoordinates(original,{type,drawingIds:['a']},true)).toBe(original);
    expect(completeDrawingCoordinates(original,{type:'create',drawingIds:['a']},false)).toBe(original);expect(completeDrawingCoordinates(original,{type:'move',drawingIds:['other']},true)).toBe(original);
  });
  it.each([1e100,1e-100])('rejects an entire grouped transaction for unrepresentable finite price %s',price=>{
    const original=[drawing(),drawing('b',price)];expect(completeDrawingCoordinates(original,{type:'move',drawingIds:['a','b']},true)).toBeNull();expect(original.every(d=>d.points[0].priceText===undefined)).toBe(true);
  });
  it('rejects unsupported UTC years without partially stamping a group',()=>{
    const original=[drawing(),{...drawing('b'),points:[{time:Date.parse('+010000-01-01T00:00:00Z')/1000,price:100}]}];expect(completeDrawingCoordinates(original,{type:'resize',drawingIds:['a','b']},true)).toBeNull();
  });
});
