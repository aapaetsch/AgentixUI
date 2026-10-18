"use client";

import * as React from "react";
import {
  applyDashboardGridCommand, dashboardGridColumns, dashboardGridConstraints,
  findDashboardGridInsertion, projectDashboardGridWidth, snapDashboardGridHeight,
  type DashboardGridColumns, type DashboardGridCommand, type DashboardGridInsertion,
  type DashboardGridItem, type DashboardGridWidth,
} from "./layout";

type HandleKind = "move" | "resize";
interface ControllerOptions {
  items: readonly DashboardGridItem[];
  editing: boolean;
  disabled: boolean;
  onItemsChange(items: DashboardGridItem[]): void;
  getItemLabel(item: DashboardGridItem): string;
  onAnnouncement?: (message: string) => void;
}
interface Gesture {
  id: string;
  kind: HandleKind;
  input: "pointer" | "keyboard";
  pointerId?: number;
  handle?: HTMLButtonElement;
  initial: DashboardGridItem;
  fingerprint: string;
  startX: number;
  startY: number;
  rootTop: number;
  x: number;
  y: number;
  active: boolean;
  toIndex: number;
  insertion?: DashboardGridInsertion;
  width: DashboardGridWidth;
  height: number;
}
export interface DashboardGridGestureView {
  id: string;
  kind: HandleKind;
  active: boolean;
  input: Gesture["input"];
  toIndex: number;
  width: DashboardGridWidth;
  height: number;
  ghost: { x: number; y: number };
  marker?: { left: number; top: number; height: number };
}

const fingerprint = (items: readonly DashboardGridItem[]) => JSON.stringify(items.map(({id,width,height})=>[id,width,height]));
const key = (id: string, kind: HandleKind) => JSON.stringify([id,kind]);

/** Only the current gesture uses scroll/keyboard/orientation listeners or an animation frame. */
export function useDashboardGridController(options: ControllerOptions) {
  const latest = React.useRef(options); latest.current = options;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const cards = React.useRef(new Map<string, HTMLDivElement>());
  const handles = React.useRef(new Map<string, HTMLButtonElement>());
  const width = React.useRef(0);
  const columnsRef = React.useRef<DashboardGridColumns>(1);
  const [columns,setColumns] = React.useState<DashboardGridColumns>(1);
  const gesture = React.useRef<Gesture | null>(null);
  const [view,setView] = React.useState<DashboardGridGestureView | null>(null);
  const [announcement,setAnnouncement] = React.useState({ text:"", sequence:0 });
  const alive = React.useRef(true);
  const frame = React.useRef<number | null>(null);
  const focusFrame = React.useRef<number | null>(null);
  const lastFrame = React.useRef(0);
  const tickRef = React.useRef<(time: number)=>void>(()=>{});
  const pendingFocus = React.useRef<string | null>(null);

  const announce = React.useCallback((text: string) => {
    if (!alive.current) return;
    setAnnouncement(previous=>({text,sequence:previous.sequence+1}));
    latest.current.onAnnouncement?.(text);
  },[]);
  const teardown = React.useCallback((update = true) => {
    const previous = gesture.current; gesture.current = null;
    if (frame.current != null) cancelAnimationFrame(frame.current);
    frame.current = null; lastFrame.current = 0;
    if (previous?.pointerId != null && previous.handle?.hasPointerCapture?.(previous.pointerId)) previous.handle.releasePointerCapture(previous.pointerId);
    if (update && alive.current) setView(null);
  },[]);
  const cancel = React.useCallback((reason = "cancelled") => {
    const current = gesture.current;
    if (!current) return;
    teardown();
    announce(`${latest.current.getItemLabel(current.initial)} ${current.kind} ${reason}; layout unchanged.`);
  },[announce,teardown]);
  const restoreFocus = React.useCallback((id: string) => {
    pendingFocus.current = id;
    if (focusFrame.current != null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(()=>{focusFrame.current=null;handles.current.get(id)?.focus({preventScroll:true});pendingFocus.current=null;});
  },[]);
  const execute = React.useCallback((command: DashboardGridCommand) => {
    const current = latest.current;
    if (!current.editing || current.disabled) return;
    const next = applyDashboardGridCommand(current.items,command);
    if (gesture.current) teardown();
    if (fingerprint(next) === fingerprint(current.items)) return;
    const item = next.find(item=>item.id===command.id)!;
    current.onItemsChange(next);
    announce(command.type === "move"
      ? `${current.getItemLabel(item)} moved to position ${next.findIndex(value=>value.id===item.id)+1} of ${next.length}.`
      : `${current.getItemLabel(item)} resized to width ${item.width} of 4 and height ${item.height} pixels.`);
  },[announce,teardown]);

  React.useLayoutEffect(()=>{
    const root = rootRef.current; if (!root) return;
    const measure = (value: number) => {
      if (width.current && Math.abs(width.current-value)>0.5) cancel("cancelled after container change");
      width.current=value;columnsRef.current=dashboardGridColumns(value);setColumns(columnsRef.current);
    };
    const initial = getComputedStyle(root);
    measure(Math.max(0,root.clientWidth-parseFloat(initial.paddingLeft||"0")-parseFloat(initial.paddingRight||"0")));
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(entries=>{if(entries[0])measure(entries[0].contentRect.width);});
    observer.observe(root);return()=>observer.disconnect();
  },[cancel]);
  React.useLayoutEffect(()=>{
    if (gesture.current && (!options.editing || options.disabled || gesture.current.fingerprint!==fingerprint(options.items))) cancel();
    if (pendingFocus.current) handles.current.get(pendingFocus.current)?.focus({preventScroll:true});
  },[options.items,options.editing,options.disabled,cancel]);
  React.useEffect(()=>{
    alive.current=true;
    return()=>{alive.current=false;teardown(false);if(focusFrame.current!=null)cancelAnimationFrame(focusFrame.current);};
  },[teardown]);
  const hasGesture = view != null;
  React.useEffect(()=>{
    if (!hasGesture) return;
    const escape = (event: KeyboardEvent) => { if(event.key==="Escape"){event.preventDefault();event.stopPropagation();cancel();} };
    const rotate = () => cancel("cancelled after rotation");
    window.addEventListener("keydown",escape,true);window.addEventListener("orientationchange",rotate);
    window.screen.orientation?.addEventListener("change",rotate);
    return()=>{window.removeEventListener("keydown",escape,true);window.removeEventListener("orientationchange",rotate);window.screen.orientation?.removeEventListener("change",rotate);};
  },[hasGesture,cancel]);

  function scrollNearEdge(clientY: number, elapsed: number): void {
    let parent = rootRef.current?.parentElement ?? null;
    while(parent){const overflow=getComputedStyle(parent).overflowY;if(/auto|scroll/.test(overflow)&&parent.scrollHeight>parent.clientHeight)break;parent=parent.parentElement;}
    const scroller=parent ?? document.scrollingElement;
    if(!scroller)return;
    const bounds=parent?.getBoundingClientRect(),top=bounds?.top??0,bottom=bounds?.bottom??window.innerHeight;
    const proximity=clientY<top+48 ? -Math.min(1,(top+48-clientY)/48) : clientY>bottom-48 ? Math.min(1,(clientY-bottom+48)/48) : 0;
    if(proximity)scroller.scrollTop+=proximity*18*elapsed/16.67;
  }
  const updateView = (current: Gesture) => {
    const root = rootRef.current?.getBoundingClientRect(); if (!root) return;
    if(current.input==="keyboard"){const others=latest.current.items.filter(item=>item.id!==current.id);const index=Math.min(current.toIndex,others.length-1);if(index>=0)current.insertion={toIndex:current.toIndex,targetId:others[index].id,position:current.toIndex===others.length?"after":"before"};}
    const target=current.insertion&&cards.current.get(current.insertion.targetId)?.getBoundingClientRect();
    const next: DashboardGridGestureView={id:current.id,kind:current.kind,active:current.active,input:current.input,toIndex:current.toIndex,width:current.width,height:current.height,
      ghost:{x:current.x-root.left,y:current.y-root.top},
      marker:target?{left:(current.insertion!.position==="after"?target.right:target.left)-root.left,top:target.top-root.top,height:target.height}:undefined};
    setView(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
  };
  tickRef.current = time => {
    frame.current=null;
    const current=gesture.current;
    if(!current||current.input!=="pointer")return;
    if(!latest.current.editing||latest.current.disabled||current.fingerprint!==fingerprint(latest.current.items)){cancel();return;}
    const dx=current.x-current.startX,root=rootRef.current;
    if(!root)return;
    const dy=current.y-current.startY+current.rootTop-root.getBoundingClientRect().top;
    if(!current.active&&Math.hypot(dx,dy)<dashboardGridConstraints.activationDistance)return;
    const justActivated=!current.active;current.active=true;
    const elapsed=lastFrame.current?Math.min(32,time-lastFrame.current):16.67;lastFrame.current=time;
    scrollNearEdge(current.y,elapsed);
    if(current.kind==="move"){
      const rects=latest.current.items.filter(item=>item.id!==current.id).flatMap(item=>{const r=cards.current.get(item.id)?.getBoundingClientRect();return r?[{id:item.id,left:r.left,top:r.top,width:r.width,height:r.height}]:[];});
      const insertion=findDashboardGridInsertion(rects,{x:current.x,y:current.y});
      if(insertion){if(current.toIndex!==insertion.toIndex||justActivated)announce(`${latest.current.getItemLabel(current.initial)}, move to position ${insertion.toIndex+1} of ${latest.current.items.length}.`);current.insertion=insertion;current.toIndex=insertion.toIndex;}
    }else{
      const cols=columnsRef.current,unit=(width.current-(cols-1)*12)/cols+12,steps=Math.round(dx/Math.max(1,unit));
      const nextWidth=cols===1||steps===0?current.initial.width:cols===2?(Math.max(1,Math.min(2,projectDashboardGridWidth(current.initial.width,cols)+steps))===1?2:4):Math.max(1,Math.min(4,current.initial.width+steps)) as DashboardGridWidth;
      const height=snapDashboardGridHeight(current.initial.height+dy);
      if(current.width!==nextWidth||current.height!==height||justActivated)announce(`${latest.current.getItemLabel(current.initial)}, preview width ${nextWidth} of 4, height ${height} pixels.`);
      current.width=nextWidth;current.height=height;
    }
    updateView(current);
    frame.current=requestAnimationFrame(tickRef.current);
  };
  const requestFrame = () => { if(frame.current==null)frame.current=requestAnimationFrame(tickRef.current); };
  const begin = (event: React.PointerEvent<HTMLButtonElement>,item: DashboardGridItem,kind: HandleKind) => {
    if(!latest.current.editing||latest.current.disabled||event.button!==0||event.isPrimary===false)return;
    if(gesture.current)cancel();
    event.preventDefault();event.currentTarget.focus({preventScroll:true});
    const rect=rootRef.current!.getBoundingClientRect();
    gesture.current={id:item.id,kind,input:"pointer",pointerId:event.pointerId,handle:event.currentTarget,initial:{...item},fingerprint:fingerprint(latest.current.items),startX:event.clientX,startY:event.clientY,rootTop:rect.top,x:event.clientX,y:event.clientY,active:false,toIndex:latest.current.items.findIndex(value=>value.id===item.id),width:item.width,height:item.height};
    event.currentTarget.setPointerCapture?.(event.pointerId);updateView(gesture.current);
  };
  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current=gesture.current;if(!current||current.pointerId!==event.pointerId)return;
    current.x=event.clientX;current.y=event.clientY;requestFrame();
  };
  const end = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current=gesture.current;if(!current||current.pointerId!==event.pointerId)return;
    current.x=event.clientX;current.y=event.clientY;
    if(frame.current!=null)cancelAnimationFrame(frame.current);tickRef.current(performance.now());
    if(gesture.current!==current)return;
    teardown();
    if(current.active)execute(current.kind==="move"?{type:"move",id:current.id,toIndex:current.toIndex}:{type:"resize",id:current.id,width:current.width,height:current.height});
    else announce(`${latest.current.getItemLabel(current.initial)} unchanged. Use layout options for tap controls.`);
    restoreFocus(key(current.id,current.kind));
  };
  const keyboard = (event: React.KeyboardEvent<HTMLButtonElement>,item: DashboardGridItem,kind: HandleKind) => {
    if(!latest.current.editing||latest.current.disabled)return;
    const current=gesture.current;
    if(kind==="move"&&(event.key===" "||event.key==="Enter")){
      event.preventDefault();
      if(current?.input==="keyboard"&&current.id===item.id){teardown();execute({type:"move",id:item.id,toIndex:current.toIndex});restoreFocus(key(item.id,kind));}
      else {if(current)cancel();const rect=cards.current.get(item.id)!.getBoundingClientRect();gesture.current={id:item.id,kind,input:"keyboard",initial:{...item},fingerprint:fingerprint(latest.current.items),startX:0,startY:0,rootTop:0,x:rect.left,y:rect.top,active:true,toIndex:latest.current.items.findIndex(value=>value.id===item.id),width:item.width,height:item.height};updateView(gesture.current);announce(`${latest.current.getItemLabel(item)} moving. Use arrows, Enter to commit, Escape to cancel.`);}
    }else if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){
      const delta=event.key==="ArrowLeft"||event.key==="ArrowUp"?-1:1;
      if(kind==="move"){
        if(current?.input!=="keyboard"||current.id!==item.id)return;
        event.preventDefault();current.toIndex=Math.max(0,Math.min(latest.current.items.length-1,current.toIndex+delta));updateView(current);announce(`${latest.current.getItemLabel(item)}, position ${current.toIndex+1} of ${latest.current.items.length}.`);
      }else{
        event.preventDefault();
        execute({type:"resize",id:item.id,width:event.key==="ArrowLeft"||event.key==="ArrowRight"?Math.max(1,Math.min(4,item.width+delta)) as DashboardGridWidth:item.width,height:event.key==="ArrowUp"||event.key==="ArrowDown"?snapDashboardGridHeight(item.height+delta*40):item.height});restoreFocus(key(item.id,kind));
      }
    }
  };
  const bindings = (item: DashboardGridItem,kind: HandleKind) => ({
    ref:(element:HTMLButtonElement|null)=>{const id=key(item.id,kind);if(element)handles.current.set(id,element);else handles.current.delete(id);},
    onPointerDown:(event:React.PointerEvent<HTMLButtonElement>)=>begin(event,item,kind),onPointerMove:move,onPointerUp:end,
    onPointerCancel:(event:React.PointerEvent<HTMLButtonElement>)=>{if(gesture.current?.pointerId===event.pointerId)cancel();},onLostPointerCapture:(event:React.PointerEvent<HTMLButtonElement>)=>{if(gesture.current?.input==="pointer"&&gesture.current.pointerId===event.pointerId&&gesture.current.handle===event.currentTarget)cancel();},
    onBlur:()=>{if(gesture.current?.input==="keyboard"&&gesture.current.id===item.id)cancel();},
    onKeyDown:(event:React.KeyboardEvent<HTMLButtonElement>)=>keyboard(event,item,kind),
  });
  return {rootRef,columns,view,execute,cancel,announcement,bindings,cards};
}
