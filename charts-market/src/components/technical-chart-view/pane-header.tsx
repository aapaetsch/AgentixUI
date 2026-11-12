import * as React from 'react';
import {cn} from 'aapaetsch-ui-kit';

/** Own the whole header allocation, including controls beside a wrapped legend. */
export function MeasuredPaneHeader({hasContent,compactReadout=false,onHeightChange,children,className,style,label,onDoubleClick}:{
 hasContent:boolean;
 compactReadout?:boolean;
 onHeightChange:(height:number)=>void;
 children:React.ReactNode;
 className?:string;
 style?:React.CSSProperties;
 label:string;
 onDoubleClick?:React.MouseEventHandler<HTMLDivElement>;
}){
 const root=React.useRef<HTMLDivElement>(null),callback=React.useRef(onHeightChange);callback.current=onHeightChange;
 React.useLayoutEffect(()=>{
  const element=root.current;if(!element)return;
  const measure=()=>callback.current(hasContent?Math.max(compactReadout?0:28,Math.ceil(element.getBoundingClientRect().height)):0);
  measure();if(!hasContent||typeof ResizeObserver==='undefined')return;
  const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect();
 },[hasContent,compactReadout]);
 return <div ref={root} data-chart-pane-header="" className={cn(hasContent&&!compactReadout&&'min-h-7',className)} style={style} aria-label={hasContent?label:undefined} onDoubleClick={onDoubleClick}>{children}</div>;
}
