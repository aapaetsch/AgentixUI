import * as React from "react";
import type {TechnicalChartGeometry} from "../../core";
export function useChartGeometry(root:React.RefObject<HTMLDivElement|null>,total:number,mode:"plot"|"available",minimum:number,onGeometry?:(geometry:TechnicalChartGeometry)=>void){
 if(!Number.isFinite(total)||total<=0||!Number.isFinite(minimum)||minimum<=0)throw Error("Chart height and minimum plot height must be positive finite CSS pixels.");
 const[height,setHeight]=React.useState(total),current=React.useRef(total);current.current=height;
 const callback=React.useRef(onGeometry);callback.current=onGeometry;
 const previous=React.useRef("");
 React.useLayoutEffect(()=>{const element=root.current;if(!element)return;const measure=()=>{const bounds=element.getBoundingClientRect(),chrome=Math.max(0,bounds.height-current.current),plot=mode==="available"?Math.max(minimum,Math.floor(total-chrome)):total;setHeight(v=>Math.abs(v-plot)>1?plot:v);const value:TechnicalChartGeometry={width:bounds.width,availableHeight:total,chromeHeight:chrome,plotHeight:plot,overflow:mode==="available"&&chrome+plot>total+1};const key=JSON.stringify(value);if(key!==previous.current){previous.current=key;callback.current?.(value);}};measure();if(typeof ResizeObserver==="undefined")return;const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect();},[root,total,mode,minimum]);
 return height;
}
