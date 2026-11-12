import type {MarketChartSnapshot,MarketTime,MarketTimeGap,OhlcBar} from '../core';
import {crossesMarketTimeGap} from '../core/time-axis';
import {marketTimeKey} from '../core/validation';

/** O(log N) geometry lookup on adjacent accepted samples; no economic interpolation. */
export function lineInspectionPoint(store:{length:number;at(index:number):OhlcBar|undefined}, x:number,
  coordinate:(time:MarketTime)=>number|null, priceCoordinate:(price:number)=>number|null,
  gaps:readonly MarketTimeGap[],domain?:{from:MarketTime;to:MarketTime}):MarketChartSnapshot['lineInspection'] {
  let low=0,high=store.length;
  const bound=(key:number,after=false)=>{let a=0,b=store.length;while(a<b){const m=(a+b)>>>1,t=marketTimeKey(store.at(m)!.time);if(t<key||after&&t===key)a=m+1;else b=m;}return a;};
  if(domain){low=bound(marketTimeKey(domain.from));high=bound(marketTimeKey(domain.to),true);}
  const first=low,last=high;
  while(low<high){const middle=(low+high)>>>1,bar=store.at(middle)!,px=coordinate(bar.time);if(px==null||!Number.isFinite(px))return null;if(px<x)low=middle+1;else high=middle;}
  const right=low<last?store.at(low):undefined,left=low>first?store.at(low-1):undefined;
  if(right){const rx=coordinate(right.time),ry=priceCoordinate(right.close);if(rx!=null&&Math.abs(rx-x)<.001&&ry!=null&&Number.isFinite(ry)&&!crossesMarketTimeGap(right.time,right.time,gaps))return{x:rx,y:ry,source:'exact',fromTime:right.time,toTime:right.time};}
  if(!left||!right||crossesMarketTimeGap(left.time,right.time,gaps))return null;
  const lx=coordinate(left.time),rx=coordinate(right.time),ly=priceCoordinate(left.close),ry=priceCoordinate(right.close);
  if(lx==null||rx==null||ly==null||ry==null||![lx,rx,ly,ry].every(Number.isFinite)||rx<=lx||x<lx||x>rx)return null;
  return{x,y:ly+(ry-ly)*(x-lx)/(rx-lx),source:'interpolated',fromTime:left.time,toTime:right.time};
}
