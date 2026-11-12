import type {DrawingPoint,DrawingState,MarketTime} from '../core';
import {marketTimeKey} from '../core';
import type {MarketDrawingExactCoordinate,MarketDrawingIntervalFamily,MarketDrawingPresentation,MarketDrawingStatistic,MarketDrawingSuppliedStatistics} from './editor-types';

export const editableDrawingTypes = ['trend-line','horizontal-line','vertical-line','rectangle'] as const;
export const drawingStatistics = ['price_range','percent_change','change_in_pips','bars_range','date_time_range','distance','angle'] as const;
export const statisticLabels:Record<MarketDrawingStatistic,string> = {price_range:'Price range',percent_change:'Percent change',change_in_pips:'Change in pips',bars_range:'Bars range',date_time_range:'Date/time range',distance:'Distance',angle:'Angle'};
export const drawingIntervalLimits:Record<MarketDrawingIntervalFamily,number> = {minutes:59,hours:24,days:366,weeks:52,months:12};
export const drawingPresentation = (drawing:DrawingState):MarketDrawingPresentation => {
  const value=drawing.parameters.presentation;
  return value&&typeof value==='object'&&!Array.isArray(value)?value as MarketDrawingPresentation:{};
};
export function validExactPrice(value:unknown,price?:number):value is string {
  if(typeof value!=='string'||value.length>80||! /^-?(?:0|[1-9][0-9]*)(?:\.\d+)?$/.test(value))return false;
  const number=Number(value);return Number.isFinite(number)&&(price===undefined||number===price);
}
/** Readable numeric-only legacy fallback; never written back unless the user actually edits it. */
export function drawingPriceInputValue(point:DrawingPoint):string {return point.priceText??point.price.toLocaleString('en-US',{useGrouping:false,maximumSignificantDigits:21});}
export function validExactTime(value:unknown,time?:MarketTime):value is string {
  return typeof value==='string'&&/^(?!0000)\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,6})?(?:Z|\+00:00)$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(Date.parse(value)).toISOString().slice(0,19)===value.slice(0,19)&&(time===undefined||Math.abs(Date.parse(value)/1000-marketTimeKey(time))<.001);
}
/** UTC identity at full microsecond precision; raw authored spelling stays in the document. */
export function exactUtcComparisonKey(value:unknown):string|null {
  if(!validExactTime(value))return null;
  const fraction=value.slice(19).match(/^\.(\d+)/)?.[1]??'';
  return `${value.slice(0,19)}.${fraction.padEnd(6,'0')}Z`;
}
/** Preserve exact text only for unchanged coordinates; never carry stale text through a geometry edit. */
export function retainExactCoordinate(previous:DrawingPoint,next:DrawingPoint):DrawingPoint {
  const {priceText:_p,utcTimeText:_t,...geometry}=next;
  return {...geometry,...(previous.price===next.price&&validExactPrice(previous.priceText,previous.price)?{priceText:previous.priceText}:{}),...(marketTimeKey(previous.time)===marketTimeKey(next.time)&&validExactTime(previous.utcTimeText,previous.time)?{utcTimeText:previous.utcTimeText}:{})};
}
export function exactDrawingCoordinates(drawings:readonly DrawingState[]):MarketDrawingExactCoordinate[] {
  return drawings.flatMap(drawing=>drawing.points.flatMap((point,pointIndex)=>{
    const price=validExactPrice(point.priceText,point.price)?point.priceText:undefined,utcTime=validExactTime(point.utcTimeText,point.time)?point.utcTimeText:undefined;
    return price!==undefined||utcTime!==undefined?[{drawingId:drawing.id,pointIndex,...(price===undefined?{}:{price}),...(utcTime===undefined?{}:{utcTime})}]:[];
  }));
}
/** Identity of durable authored geometry, including exact decimals that share one numeric projection. */
export function marketDrawingGeometryKey(drawing:DrawingState):string {
  return JSON.stringify([drawing.type,drawing.points.map(p=>[validExactTime(p.utcTimeText,p.time)?exactUtcComparisonKey(p.utcTimeText):marketTimeKey(p.time),p.price,validExactPrice(p.priceText,p.price)?p.priceText:null])]);
}
export function drawingStatisticValue(stat:MarketDrawingStatistic,drawing:DrawingState,coordinates:readonly ({x:number;y:number}|null)[],supplied:readonly MarketDrawingSuppliedStatistics[],contextKey?:string):string|null {
  const [a,b]=coordinates;
  if(stat==='distance')return a&&b?`${Math.hypot(b.x-a.x,b.y-a.y).toFixed(1)} px`:null;
  if(stat==='angle')return a&&b?`${(Math.atan2(a.y-b.y,b.x-a.x)*180/Math.PI).toFixed(1)}°`:null;
  if(stat==='change_in_pips')return null;
  const result=contextKey?supplied.find(s=>s.contextKey===contextKey&&s.drawingId===drawing.id&&s.geometryKey===marketDrawingGeometryKey(drawing)):undefined;
    const value=result?.values?.[stat];return typeof value==='string'&&value.length<=1024?value:null;
}
/** Unsupported interval families preserve historical visibility; no cadence inference. */
export function drawingVisibleAtInterval(drawing:DrawingState,interval?:string):boolean {
  if(!drawing.visible)return false;
  const match=interval?.match(/^(\d+)(m|h|H|D|d|W|w|M)$/);if(!match)return true;
  const family=({m:'minutes',h:'hours',H:'hours',D:'days',d:'days',W:'weeks',w:'weeks',M:'months'} as const)[match[2] as 'm'];
  const range=drawingPresentation(drawing).visibility?.[family];if(!range)return true;
  const amount=Number(match[1]);return range.enabled&&amount>=range.min&&amount<=range.max;
}
export function validateDrawingEditorDraft(drawing:DrawingState):string|null {
  if(drawing.name!==undefined&&(drawing.name.trim().length<1||Array.from(drawing.name).length>120))return 'Name must contain 1–120 characters.';
  const p=drawingPresentation(drawing),paired=['trend-line','rectangle'].includes(drawing.type);
  if(drawing.parameters.lineWidth!==undefined&&(!Number.isInteger(drawing.parameters.lineWidth)||Number(drawing.parameters.lineWidth)<1||Number(drawing.parameters.lineWidth)>5))return 'Width must be an integer from 1 to 5.';
  if(drawing.parameters.color!==undefined&&!/^#[\da-f]{6}$/i.test(String(drawing.parameters.color)))return 'Choose a six-digit color.';
  if(p.text&&(Array.from(p.text.value).length>2000||!Number.isInteger(p.text.fontSize)||p.text.fontSize<8||p.text.fontSize>48||!/^#[\da-f]{6}$/i.test(p.text.color)))return 'Text must be at most 2000 characters, with font size 8–48 and a valid color.';
  if(!paired&&[p.middlePoint,p.statistics,p.statisticsPosition,p.alwaysShowStatistics].some(v=>v!==undefined))return 'Statistics and midpoint require a paired drawing.';
  if(drawing.type!=='trend-line'&&(p.startCap!==undefined||p.endCap!==undefined))return 'Arrow ends require a trend line.';
  if(drawing.type==='vertical-line'&&p.priceLabels!==undefined)return 'Vertical lines do not have price labels.';
  if(p.statistics&&(new Set(p.statistics).size!==p.statistics.length||p.statistics.some(v=>!drawingStatistics.includes(v))))return 'Select each supported statistic at most once.';
  for(const [family,range]of Object.entries(p.visibility??{})){const max=drawingIntervalLimits[family as MarketDrawingIntervalFamily];if(!max||!range||!Number.isInteger(range.min)||!Number.isInteger(range.max)||range.min<1||range.max>max||range.min>range.max)return 'Interval ranges must be ordered and within their family limits.';}
  for(const point of drawing.points){if(!Number.isFinite(point.price)||!Number.isFinite(marketTimeKey(point.time)))return 'Coordinates must be finite.';if(point.priceText!==undefined&&!validExactPrice(point.priceText,point.price))return 'Price must be a finite decimal string.';if(point.utcTimeText!==undefined&&!validExactTime(point.utcTimeText,point.time))return 'Time must be an unambiguous UTC timestamp.';}
  return null;
}
export function chartTimeZone(value?:string):string {try{new Intl.DateTimeFormat('en',{timeZone:value??'UTC'}).format(0);return value??'UTC';}catch{return 'UTC';}}
export function localDateTime(time:MarketTime,timeZone:string):string {
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:chartTimeZone(timeZone),year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(marketTimeKey(time)*1000);
  const get=(kind:string)=>parts.find(p=>p.type===kind)?.value??'00';return `${get('year').padStart(4,'0')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
}
/** Enumerate actual timezone offsets: gaps produce zero results, folds require an explicit choice. */
export function localTimeCandidates(local:string,timeZone:string):{utcTime:string;offset:string}[] {
  if(!/^(?!0000)\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?$/.test(local))return [];
  const normalized=local.length===16?local+':00':local,wall=Date.parse(normalized+'Z');if(!Number.isFinite(wall))return [];
  const seconds=normalized.slice(0,19),fraction=normalized.slice(19),zone=chartTimeZone(timeZone),offsets=new Set<number>();
  for(const delta of [-48,-24,-12,0,12,24,48]){const at=wall+delta*3600000;const formatted=localDateTime(at/1000,zone);offsets.add(Date.parse(formatted+'Z')-Math.floor(at/1000)*1000);}
  return [...offsets].flatMap(offset=>{const instant=wall-offset;if(localDateTime(instant/1000,zone)!==seconds)return [];const minutes=offset/60000,sign=minutes>=0?'+':'-',absolute=Math.abs(minutes);return [{utcTime:new Date(instant).toISOString().replace('.000Z',fraction?fraction+'Z':'Z'),offset:`UTC${sign}${String(Math.floor(absolute/60)).padStart(2,'0')}:${String(absolute%60).padStart(2,'0')}`}];}).sort((a,b)=>a.utcTime.localeCompare(b.utcTime));
}
