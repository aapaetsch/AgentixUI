import type {MarketPriceReference} from '../core/types';

/** Copy runtime display input; reject missing evidence instead of deriving a replacement. */
export function acceptedPriceReferences(references: readonly MarketPriceReference[] = []): MarketPriceReference[] {
 const seen=new Set<string>();
 return references.filter(reference=>{
  if(!reference||typeof reference.id!=='string'||!reference.id.trim()||typeof reference.label!=='string'||!reference.label.trim()||!Number.isFinite(reference.price)||(reference.lineStyle!=null&&reference.lineStyle!=='dotted')||seen.has(reference.id))return false;
  seen.add(reference.id);return true;
 }).map(reference=>({...reference}));
}

/** Fit display text only, retaining a whole numeric sign/exponent/unit in a fixed axis lane.
 * Exact source values are independent of this display rounding and remain accessible. */
export function fitReferenceAxisValue(text:string,width:number,fontSize:number,measure:(text:string,fontSize:number)=>number):{text:string;fontSize:number} {
 if(measure(text,fontSize)<=width)return {text,fontSize};
 const percent=text.endsWith('%'),value=Number(percent?text.slice(0,-1):text);
 if(!Number.isFinite(value))return {text,fontSize:Math.max(.1,Math.floor(fontSize*Math.max(1,width)/measure(text,fontSize)*10)/10)};
 const candidates=[text,...[3,2,1,0].map(digits=>value.toExponential(digits)+(percent?'%':''))];
 const fitting=candidates.find(candidate=>measure(candidate,fontSize)<=width);
 if(fitting)return {text:fitting,fontSize};
 const shortest=candidates.reduce((a,b)=>measure(a,fontSize)<=measure(b,fontSize)?a:b);
 return {text:shortest,fontSize:Math.max(.1,Math.floor(fontSize*Math.max(1,width)/measure(shortest,fontSize)*10)/10)};
}
