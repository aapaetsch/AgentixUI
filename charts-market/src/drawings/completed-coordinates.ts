import type {DrawingState} from '../core';
import {marketTimeKey} from '../core';
import {drawingPriceInputValue,editableDrawingTypes,validExactPrice,validExactTime} from './editor-state';

const coordinateTransactions=new Set(['create','move','resize','duplicate','clipboard']);
export const drawingCoordinateCompletionError='Drawing coordinates must fit an 80-character decimal and UTC year 0001–9999.';
/** Seed completed authored frames only; selection, previews, cancellation and opt-out stay untouched. */
export function completeDrawingCoordinates(document:DrawingState[],metadata:{type:string;drawingIds:readonly string[]},enabled:boolean):DrawingState[]|null {
  if(!enabled||!coordinateTransactions.has(metadata.type))return document;
  let changed=false,invalid=false;const ids=new Set(metadata.drawingIds);
  const completed=document.map(drawing=>{
    if(!ids.has(drawing.id)||!editableDrawingTypes.some(type=>type===drawing.type))return drawing;
    const points=drawing.points.map(point=>{
      const fallbackPrice=drawingPriceInputValue({...point,priceText:undefined});
      const price=validExactPrice(point.priceText,point.price)?point.priceText:validExactPrice(fallbackPrice,point.price)?fallbackPrice:undefined;
      const date=new Date(marketTimeKey(point.time)*1000),fallbackTime=Number.isFinite(date.getTime())?date.toISOString():undefined;
      const utcTime=validExactTime(point.utcTimeText,point.time)?point.utcTimeText:validExactTime(fallbackTime,point.time)?fallbackTime:undefined;
      if(price===undefined||utcTime===undefined){invalid=true;return point;}
      if(price===point.priceText&&utcTime===point.utcTimeText)return point;
      const {priceText:_price,utcTimeText:_time,...geometry}=point;
      return {...geometry,...(price===undefined?{}:{priceText:price}),...(utcTime===undefined?{}:{utcTimeText:utcTime})};
    });
    if(points.every((point,index)=>point===drawing.points[index]))return drawing;
    changed=true;return {...drawing,points};
  });
  return invalid?null:changed?completed:document;
}
