"use client";

import * as React from "react";
import { Button, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, cn } from "aapaetsch-ui-kit";
import {
  ArrowDownIcon as ArrowDown,
  ArrowUpIcon as ArrowUp,
  DuplicateIcon as Copy,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  GroupIcon as Group,
  LayersIcon as Layers,
  LockIcon as Lock,
  EditIcon as Pencil,
  TrashIcon as Trash2,
  UngroupIcon as Ungroup,
  UnlockIcon as Unlock,
} from "aapaetsch-icons";
import type { DrawingState } from "../core";

export interface DrawingObjectTreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  drawings: DrawingState[];
  selectedDrawingIds?: string[];
  onSelectedDrawingIdsChange?: (ids: string[]) => void;
  onRename?: (id: string, name: string) => void;
  onReorder?: (id: string, direction: "forward" | "backward" | "front" | "back") => void;
  onToggleVisibility?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onGroup?: (ids: string[]) => void;
  onUngroup?: (ids: string[]) => void;
}

export function DrawingObjectTree({ drawings, selectedDrawingIds = [], onSelectedDrawingIdsChange, onRename, onReorder, onToggleVisibility, onToggleLock, onDuplicate, onDelete, onGroup, onUngroup, className, ...props }: DrawingObjectTreeProps) {
  const [editingId, setEditingId] = React.useState<string>();
  const selected = new Set(selectedDrawingIds);
  const choose = (id: string, modified: boolean) => onSelectedDrawingIdsChange?.(modified ? selected.has(id) ? selectedDrawingIds.filter((item) => item !== id) : [...selectedDrawingIds, id] : [id]);
  return <div className={cn("min-w-56 border-l border-border bg-background text-foreground", className)} aria-label="Drawing object tree" {...props}>
    <div className="flex h-10 items-center justify-between border-b border-border px-3"><span className="text-xs font-semibold">Objects</span><span className="text-[0.6875rem] tabular-nums text-muted-foreground">{drawings.length}</span></div>
    <div role="tree" aria-multiselectable="true" className="max-h-[32rem] overflow-auto p-1">
      {drawings.slice().sort((a, b) => (b.zIndex ?? drawings.indexOf(b)) - (a.zIndex ?? drawings.indexOf(a))).map((drawing) => <ContextMenu key={drawing.id}><ContextMenuTrigger asChild><div role="treeitem" aria-selected={selected.has(drawing.id)} className="group flex min-h-10 items-center gap-1 rounded-[var(--radius-sm)] px-1.5 text-xs hover:bg-muted/70 aria-selected:bg-accent" onClick={(event) => choose(drawing.id, event.ctrlKey || event.metaKey || event.shiftKey)}>
        <Layers className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        {editingId === drawing.id ? <input autoFocus aria-label={`Rename ${drawing.name ?? drawing.type}`} className="h-7 min-w-0 flex-1 rounded border border-border bg-background px-1" defaultValue={drawing.name ?? drawing.type} onBlur={(event) => { onRename?.(drawing.id, event.target.value.trim() || drawing.type); setEditingId(undefined); }} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); if (event.key === "Escape") setEditingId(undefined); }} /> : <button type="button" className="min-w-0 flex-1 truncate text-left" onDoubleClick={() => setEditingId(drawing.id)}>{drawing.name ?? drawing.type}</button>}
        {drawing.groupId ? <span className="max-w-12 truncate text-[0.625rem] text-muted-foreground" title={drawing.groupId}>{drawing.groupId}</span> : null}
        <Button size="xs" iconOnly colorStyle="ghost" aria-label={drawing.visible ? `Hide ${drawing.name ?? drawing.type}` : `Show ${drawing.name ?? drawing.type}`} onClick={(event) => { event.stopPropagation(); onToggleVisibility?.(drawing.id); }}>{drawing.visible ? <Eye /> : <EyeOff />}</Button>
        <Button size="xs" iconOnly colorStyle="ghost" aria-label={drawing.locked ? `Unlock ${drawing.name ?? drawing.type}` : `Lock ${drawing.name ?? drawing.type}`} onClick={(event) => { event.stopPropagation(); onToggleLock?.(drawing.id); }}>{drawing.locked ? <Lock /> : <Unlock />}</Button>
      </div></ContextMenuTrigger><ContextMenuContent><ContextMenuItem icon={<Pencil />} onSelect={() => setEditingId(drawing.id)}>Rename</ContextMenuItem><ContextMenuItem icon={<ArrowUp />} onSelect={() => onReorder?.(drawing.id, "forward")}>Bring forward</ContextMenuItem><ContextMenuItem icon={<ArrowDown />} onSelect={() => onReorder?.(drawing.id, "backward")}>Send backward</ContextMenuItem><ContextMenuItem icon={<Copy />} onSelect={() => onDuplicate?.(drawing.id)}>Duplicate</ContextMenuItem><ContextMenuSeparator />{drawing.groupId ? <ContextMenuItem icon={<Ungroup />} onSelect={() => onUngroup?.([drawing.id])}>Ungroup</ContextMenuItem> : <ContextMenuItem icon={<Group />} disabled={selectedDrawingIds.length < 2} onSelect={() => onGroup?.(selectedDrawingIds)}>Group selected</ContextMenuItem>}<ContextMenuSeparator /><ContextMenuItem icon={<Trash2 />} variant="destructive" onSelect={() => onDelete?.(drawing.id)}>Delete</ContextMenuItem></ContextMenuContent></ContextMenu>)}
      {!drawings.length ? <p className="px-3 py-8 text-center text-xs text-muted-foreground">No drawings</p> : null}
    </div>
  </div>;
}
