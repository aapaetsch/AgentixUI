import * as React from 'react';
import type {TechnicalChartGeometry} from '../../core';
/** Measure natural content separately from a host allocation, avoiding intrinsic-height feedback. */
export function useChartGeometry(root:React.RefObject<HTMLDivElement|null>,total:number,mode:'plot'|'available',minimum:number,onGeometry?:(geometry:TechnicalChartGeometry)=>void,renderedPlotHeight?:number,content?:React.RefObject<HTMLDivElement|null>,plot?:React.RefObject<HTMLDivElement|null>,enforcePlotMinimum=false){
 if(!Number.isFinite(total)||total<=0||!Number.isFinite(minimum)||minimum<=0)throw Error('Chart height and minimum plot height must be positive finite CSS pixels.');
 const[height,setHeight]=React.useState(total),current=React.useRef(total);current.current=height;
 const callback=React.useRef(onGeometry);callback.current=onGeometry;
 const previous=React.useRef('');
 React.useLayoutEffect(()=>{
  const element=root.current;if(!element)return;const natural=content?.current??element;
  const measure=()=>{
   const bounds=element.getBoundingClientRect(),naturalHeight=natural.getBoundingClientRect().height+(natural!==element?Math.max(0,element.offsetHeight-element.clientHeight):0);
   // Both extents must describe the same DOM layout. Engine callbacks may report
   // a new extent before React commits the corresponding host allocation.
   const measuredPlot=plot?.current?.getBoundingClientRect().height??renderedPlotHeight??current.current;
   const chrome=Math.max(0,naturalHeight-measuredPlot),nextPlot=mode==='available'?Math.max(minimum,Math.floor(total-chrome)):enforcePlotMinimum?Math.max(minimum,total):total;
   setHeight(v=>Math.abs(v-nextPlot)>1?nextPlot:v);
   const actualPlot=renderedPlotHeight!=null?measuredPlot:nextPlot;
   const value:TechnicalChartGeometry={width:bounds.width,availableHeight:total,chromeHeight:chrome,plotHeight:nextPlot,...(renderedPlotHeight!=null?{renderedPlotHeight:measuredPlot,intrinsicHeight:chrome+measuredPlot}:{}),overflow:mode==='available'?chrome+actualPlot>total+1:enforcePlotMinimum&&actualPlot>total+1};
   const key=JSON.stringify(value);if(key!==previous.current){previous.current=key;callback.current?.(value);}
  };
  measure();if(typeof ResizeObserver==='undefined')return;const observer=new ResizeObserver(measure);observer.observe(element);if(natural!==element)observer.observe(natural);if(plot?.current)observer.observe(plot.current);return()=>observer.disconnect();
 },[root,total,mode,minimum,renderedPlotHeight,content,plot,enforcePlotMinimum]);
 return height;
}
