import * as React from 'react';
import type {MarketDrawingEditorOptions,MarketDrawingEditorPosition} from './editor-types';

export function clampEditorPosition(position:MarketDrawingEditorPosition,size:{width:number;height:number},viewport:{left:number;top:number;width:number;height:number}):MarketDrawingEditorPosition {
  const inset=8;
  return {x:Math.max(viewport.left+inset,Math.min(viewport.left+viewport.width-size.width-inset,Number.isFinite(position.x)?position.x:viewport.left+inset)),y:Math.max(viewport.top+inset,Math.min(viewport.top+viewport.height-size.height-inset,Number.isFinite(position.y)?position.y:viewport.top+inset))};
}
export function useEditorPosition(options:MarketDrawingEditorOptions,anchorRef:React.RefObject<Element|null>) {
  const toolbarRef=React.useRef<HTMLDivElement>(null),drag=React.useRef<{pointerId:number;start:MarketDrawingEditorPosition;origin:MarketDrawingEditorPosition;handle:HTMLElement}|null>(null);
  const [position,setPosition]=React.useState<MarketDrawingEditorPosition>({x:8,y:8});
  const [portalContainer,setPortalContainer]=React.useState<Element|null>(()=>typeof document==='undefined'?null:document.fullscreenElement??document.body);
  const positionRef=React.useRef(position);positionRef.current=position;
  const notify=React.useRef(options.onPositionChange);notify.current=options.onPositionChange;
  const measure=React.useCallback(()=>{
    const viewport=window.visualViewport,rect=toolbarRef.current?.getBoundingClientRect();
    return {viewport:{left:viewport?.offsetLeft??0,top:viewport?.offsetTop??0,width:viewport?.width??window.innerWidth,height:viewport?.height??window.innerHeight},size:{width:rect?.width??176,height:rect?.height??52}};
  },[]);
  const clamp=React.useCallback((next:MarketDrawingEditorPosition)=>{const {size,viewport}=measure();return clampEditorPosition(next,size,viewport);},[measure]);
  const initial=React.useCallback(()=>{const rect=anchorRef.current?.getBoundingClientRect(),{size,viewport}=measure();return clamp({x:rect?rect.left+(rect.width-size.width)/2:viewport.left+(viewport.width-size.width)/2,y:rect?rect.top+12:viewport.top+12});},[anchorRef,clamp,measure]);
  const apply=React.useCallback((next:MarketDrawingEditorPosition)=>{positionRef.current=next;setPosition(current=>current.x===next.x&&current.y===next.y?current:next);},[]);
  const cancel=React.useCallback(()=>{const current=drag.current;if(!current)return;drag.current=null;if(current.handle.hasPointerCapture?.(current.pointerId))current.handle.releasePointerCapture(current.pointerId);apply(clamp(current.origin));},[apply,clamp]);
  const controlledX=options.position?.x,controlledY=options.position?.y,controlledMode=options.position===null?'reset':options.position===undefined?'uncontrolled':'position';
  React.useLayoutEffect(()=>{cancel();apply(controlledMode==='position'?clamp({x:controlledX??8,y:controlledY??8}):initial());},[controlledX,controlledY,controlledMode,portalContainer,apply,cancel,clamp,initial]);
  React.useEffect(()=>{
    const resize=()=>apply(clamp(positionRef.current)),blur=()=>cancel(),fullscreen=()=>{cancel();setPortalContainer(document.fullscreenElement??document.body);resize();},viewport=window.visualViewport;
    window.addEventListener('resize',resize);window.addEventListener('scroll',resize,true);window.addEventListener('blur',blur);document.addEventListener('fullscreenchange',fullscreen);viewport?.addEventListener('resize',resize);viewport?.addEventListener('scroll',resize);
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(resize);if(toolbarRef.current)observer?.observe(toolbarRef.current);if(anchorRef.current)observer?.observe(anchorRef.current);
    return()=>{cancel();observer?.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('scroll',resize,true);window.removeEventListener('blur',blur);document.removeEventListener('fullscreenchange',fullscreen);viewport?.removeEventListener('resize',resize);viewport?.removeEventListener('scroll',resize);};
  },[anchorRef,portalContainer,apply,cancel,clamp]);
  const reset=()=>{cancel();apply(initial());notify.current?.(null);};
  const handleProps:React.ButtonHTMLAttributes<HTMLButtonElement>={
    'aria-label':'Move drawing toolbar',title:'Drag toolbar; arrow keys move it; Home resets position',
    onPointerDown:event=>{if(event.button!==0||event.isPrimary===false)return;event.preventDefault();event.stopPropagation();event.currentTarget.focus();drag.current={pointerId:event.pointerId,start:{x:event.clientX,y:event.clientY},origin:positionRef.current,handle:event.currentTarget};event.currentTarget.setPointerCapture?.(event.pointerId);},
    onPointerMove:event=>{const current=drag.current;if(!current||current.pointerId!==event.pointerId)return;event.preventDefault();event.stopPropagation();apply(clamp({x:current.origin.x+event.clientX-current.start.x,y:current.origin.y+event.clientY-current.start.y}));},
    onPointerUp:event=>{const current=drag.current;if(!current||current.pointerId!==event.pointerId)return;event.preventDefault();event.stopPropagation();drag.current=null;if(event.currentTarget.hasPointerCapture?.(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);if(current.origin.x!==positionRef.current.x||current.origin.y!==positionRef.current.y)notify.current?.(positionRef.current);},
    onPointerCancel:cancel,onLostPointerCapture:cancel,
    onKeyDown:event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();cancel();return;}if(event.key==='Home'){event.preventDefault();event.stopPropagation();reset();return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();event.stopPropagation();const step=event.shiftKey?20:4,next=clamp({x:positionRef.current.x+(event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0),y:positionRef.current.y+(event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0)});apply(next);notify.current?.(next);},
  };
  return {toolbarRef,position,handleProps,reset,cancel,portalContainer};
}
