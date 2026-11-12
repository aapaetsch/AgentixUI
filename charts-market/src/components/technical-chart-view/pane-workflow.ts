import type { TechnicalPaneState } from '../../core';
/** Stable pane order; preserve hidden panes in the saved stack. */
export function reorderTechnicalPane(panes: readonly TechnicalPaneState[], id: string, before: string): TechnicalPaneState[] {
  const sorted=[...panes].sort((a,b)=>a.order-b.order),from=sorted.findIndex(p=>p.id===id),to=sorted.findIndex(p=>p.id===before);
  if(from<0||to<0)return [...panes];const [pane]=sorted.splice(from,1);sorted.splice(to,0,pane);return sorted.map((p,order)=>({...p,order}));
}
/** Workspace weights correspond to 100 CSS pixels before surplus space distribution. */
export function resizeTechnicalPane(panes: readonly TechnicalPaneState[], id: string, pixels: number, currentHeight?: number): TechnicalPaneState[] {
  return panes.map(p=>p.id===id&&!p.collapsed?{...p,size:Math.max(.01,Math.min(1000,Math.max(p.minimumSize??48,(currentHeight??p.size*100)+pixels)/100))}:p);
}
