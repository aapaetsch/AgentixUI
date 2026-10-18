"use client";

import * as React from "react";
import { GripIcon as Grip, MoveIcon as Move, ResizeIcon as Scaling } from "aapaetsch-icons";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { applyDashboardGridCommand, packDashboardGrid, validateDashboardGridItems, type DashboardGridCommand, type DashboardGridItem, type DashboardGridWidth } from "./layout";
import { useDashboardGridController } from "./use-dashboard-grid";
export * from "./layout";

export interface DashboardGridHandle {
  /** Uses the same controlled constraint/announcement path as edit controls. Ignored outside enabled edit mode. */
  execute(command: DashboardGridCommand): void;
  /** Discard the transient gesture without emitting items. */
  cancel(): void;
}

export interface DashboardGridProps extends Pick<React.HTMLAttributes<HTMLDivElement>, "id" | "className" | "style" | "dir" | "title" | "tabIndex" | "aria-label" | "aria-labelledby" | "aria-describedby"> {
  /** Canonical reading order; at most 24 unique IDs with valid geometry. */
  items: readonly DashboardGridItem[];
  editing: boolean;
  disabled?: boolean;
  /** Geometry/order only. Host owns drafts, opaque settings and persistence. */
  onItemsChange(items: DashboardGridItem[]): void;
  /** Arbitrary content. Keep this callback stable while its data/settings are unchanged. */
  renderItem(item: DashboardGridItem): React.ReactNode;
  /** Human-readable names for handles, tap controls and announcements. */
  getItemLabel(item: DashboardGridItem): string;
  /** Optional host announcement integration; a polite live region is also provided. */
  onAnnouncement?: (message: string) => void;
  [attribute: `data-${string}`]: string | number | boolean | undefined;
}

// Gesture previews change layout every frame. Isolate host content so those frames
// never repeatedly execute its render/data work; browser stories measure this boundary.
const ContentSlot = React.memo(function ContentSlot({item,renderItem}:{item:DashboardGridItem;renderItem:DashboardGridProps["renderItem"]}) {
  return <div className="h-full min-w-0" data-dashboard-grid-content={item.id}>{renderItem(item)}</div>;
}, (previous,next)=>previous.renderItem===next.renderItem&&previous.item.id===next.item.id&&previous.item.width===next.item.width&&previous.item.height===next.item.height);

const targetClass = "h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 touch-none p-0 transition-none focus-visible:ring-2 focus-visible:ring-ring forced-colors:border-[ButtonText] forced-colors:text-[ButtonText]";
const selectClass = "h-11 min-h-[44px] w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring forced-colors:text-[CanvasText]";

function ItemOptions({item,items,label,getItemLabel,disabled,execute}:{item:DashboardGridItem;items:readonly DashboardGridItem[];label:string;getItemLabel:DashboardGridProps["getItemLabel"];disabled:boolean;execute:(command:DashboardGridCommand)=>void}) {
  const [target,setTarget] = React.useState("");
  const [portalStyle,setPortalStyle] = React.useState<React.CSSProperties>({});
  const trigger = React.useRef<HTMLButtonElement>(null);
  const options=items.filter(value=>value.id!==item.id);
  const selected=options.some(value=>value.id===target)?target:options[0]?.id??"";
  const inputId=React.useId();
  const move=(position:"before"|"after")=>{
    const index=options.findIndex(value=>value.id===selected);
    if(index>=0)execute({type:"move",id:item.id,toIndex:index+(position==="after"?1:0)});
  };
  return <Popover onOpenChange={open=>{
    if(!open||!trigger.current)return;
    const style=getComputedStyle(trigger.current),values:Record<string,string>={};
    for(const token of ["--popover","--popover-foreground","--background","--foreground","--primary","--primary-foreground","--muted","--muted-foreground","--border","--input","--ring","--accent","--accent-foreground","--radius"])values[token]=style.getPropertyValue(token);
    setPortalStyle(values as React.CSSProperties);
  }}>
    <PopoverTrigger asChild><Button ref={trigger} type="button" colorStyle="outlined" disabled={disabled} aria-label={`Layout options for ${label}`} className={cn(targetClass,"touch-auto")}><Grip aria-hidden="true" className="size-4"/></Button></PopoverTrigger>
    <PopoverContent aria-label={`Layout options for ${label}`} style={portalStyle} align="end" className="space-y-3 motion-reduce:animate-none motion-reduce:transition-none">
      <p className="break-words text-sm font-medium text-popover-foreground">{label}</p>
      <label htmlFor={`${inputId}-target`} className="block text-sm text-popover-foreground">Relative to</label>
      <select id={`${inputId}-target`} value={selected} onChange={event=>setTarget(event.target.value)} disabled={disabled||!options.length} className={selectClass}>
        {!options.length?<option value="">No other cards</option>:options.map(value=><option key={value.id} value={value.id}>{getItemLabel(value)}</option>)}
      </select>
      <div className="flex gap-2"><Button type="button" colorStyle="outlined" disabled={disabled||!options.length} className="min-h-[44px] flex-1" onClick={()=>move("before")}>Move before</Button><Button type="button" colorStyle="outlined" disabled={disabled||!options.length} className="min-h-[44px] flex-1" onClick={()=>move("after")}>Move after</Button></div>
      <label htmlFor={`${inputId}-width`} className="block text-sm text-popover-foreground">Width</label>
      <select id={`${inputId}-width`} value={item.width} disabled={disabled} onChange={event=>execute({type:"resize",id:item.id,width:Number(event.target.value) as DashboardGridWidth,height:item.height})} className={selectClass}>{[1,2,3,4].map(value=><option key={value} value={value}>{value} of 4 columns</option>)}</select>
      <label htmlFor={`${inputId}-height`} className="block text-sm text-popover-foreground">Height</label>
      <select id={`${inputId}-height`} value={item.height} disabled={disabled} onChange={event=>execute({type:"resize",id:item.id,width:item.width,height:Number(event.target.value)})} className={selectClass}>{Array.from({length:13},(_,i)=>240+i*40).map(value=><option key={value} value={value}>{value} pixels</option>)}</select>
    </PopoverContent>
  </Popover>;
}

/** Controlled, content-agnostic layout. Read mode has no layout pointer listeners or handles. */
export const DashboardGrid = React.forwardRef<DashboardGridHandle,DashboardGridProps>(function DashboardGrid({items,editing,disabled=false,onItemsChange,renderItem,getItemLabel,onAnnouncement,className,style,id,dir,title,tabIndex,"aria-label":ariaLabel="Dashboard","aria-labelledby":ariaLabelledBy,"aria-describedby":ariaDescribedBy,...dataAttributes},ref) {
  validateDashboardGridItems(items);
  const controller=useDashboardGridController({items,editing,disabled,onItemsChange,getItemLabel,onAnnouncement});
  React.useImperativeHandle(ref,()=>({execute:controller.execute,cancel:()=>controller.cancel()}),[controller.execute,controller.cancel]);
  const instructions=React.useId();
  const preview=controller.view;
  const displayItems=preview?.active&&preview.kind==="resize"?applyDashboardGridCommand(items,{type:"resize",id:preview.id,width:preview.width,height:preview.height}):items;
  const positions=packDashboardGrid(displayItems,controller.columns);
  const activeItem=preview&&items.find(item=>item.id===preview.id);
  const safeDataAttributes=Object.fromEntries(Object.entries(dataAttributes).filter(([name])=>name.startsWith("data-")));
  return <>
    <div {...safeDataAttributes} ref={controller.rootRef} id={id} dir={dir} title={title} tabIndex={tabIndex} role="list" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy} data-dashboard-grid="" data-columns={controller.columns} data-editing={editing} data-disabled={disabled} className={cn("relative grid min-w-0 items-start",className)} style={{...style,gridTemplateColumns:`repeat(${controller.columns}, minmax(0, 1fr))`,gap:12}}>
      {items.map((item,index)=>{
        const position=positions[index],label=getItemLabel(item),active=preview?.id===item.id&&preview.active;
        return <div key={item.id} ref={element=>{if(element)controller.cards.current.set(item.id,element);else controller.cards.current.delete(item.id);}} role="listitem" aria-label={label} aria-posinset={index+1} aria-setsize={items.length} data-dashboard-grid-item={item.id} data-preview={active?preview.kind:undefined} className={cn("relative min-w-0",editing&&"outline outline-1 outline-offset-2 outline-border",active&&"outline-2 outline-primary")} style={{gridColumn:`${position.column+1} / span ${position.span}`,gridRow:position.row+1,height:position.height}}>
          {editing?<div className="absolute right-1 top-1 z-20 flex gap-1 rounded-md bg-background p-1 text-foreground shadow-sm forced-colors:border forced-colors:border-[CanvasText]" role="group" aria-label={`Edit ${label}`}>
            <Button {...(!disabled?controller.bindings(item,"move"): {})} type="button" colorStyle="outlined" disabled={disabled} aria-label={`Move ${label}`} aria-describedby={instructions} aria-pressed={Boolean(active&&preview.kind==="move")} aria-keyshortcuts="Space Enter ArrowLeft ArrowRight ArrowUp ArrowDown Escape" className={cn(targetClass,"cursor-grab active:cursor-grabbing")}><Move aria-hidden="true" className="size-4"/></Button>
            <Button {...(!disabled?controller.bindings(item,"resize"): {})} type="button" colorStyle="outlined" disabled={disabled} aria-label={`Resize ${label}`} aria-describedby={instructions} aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown" className={cn(targetClass,"cursor-nwse-resize")}><Scaling aria-hidden="true" className="size-4"/></Button>
            <ItemOptions item={item} items={items} label={label} getItemLabel={getItemLabel} disabled={disabled} execute={controller.execute}/>
          </div>:null}
          <ContentSlot item={item} renderItem={renderItem}/>
        </div>;
      })}
      {preview?.active&&activeItem?<>
        {preview.kind==="move"&&preview.marker?<div aria-hidden="true" data-dashboard-grid-marker="" className="pointer-events-none absolute z-30 w-1 bg-primary forced-colors:bg-[Highlight]" style={{left:preview.marker.left-2,top:preview.marker.top,height:preview.marker.height}}/>:null}
        <div aria-hidden="true" data-dashboard-grid-preview="" className={cn("pointer-events-none absolute left-0 top-0 z-40 max-w-xs truncate rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-md motion-reduce:transition-none forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",preview.input==="keyboard"&&"sr-only")} style={{transform:`translate(${preview.ghost.x+12}px, ${preview.ghost.y+12}px)`}}>{getItemLabel(activeItem)} · {preview.kind==="move"?`Position ${preview.toIndex+1}`:`${preview.width}/4 × ${preview.height}px`}</div>
      </>:null}
    </div>
    {editing?<p id={instructions} className="sr-only">Move: Space or Enter starts and commits; arrows choose position; Escape cancels. Resize: left/right changes width, up/down changes height by 40 pixels. Layout options provide tap alternatives.</p>:null}
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true"><span key={controller.announcement.sequence}>{controller.announcement.text}</span></div>
  </>;
});
DashboardGrid.displayName="DashboardGrid";
