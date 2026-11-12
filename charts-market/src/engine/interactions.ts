import type { MarketChartChangeMetadata, MarketChartScrollOwner } from '../core';

export type InteractionTarget = {kind: 'plot' | 'time' | 'value' | 'separator' | 'gutter'; paneId?: string; boundary?: number};
export interface InteractionPoint {x: number; y: number}
export interface InteractionPointer extends InteractionPoint {clientX?: number; clientY?: number; id: number; touch: boolean; shift?: boolean}
export interface WorkspaceGesturePort {
  hit(point: InteractionPoint): InteractionTarget;
  pan(delta: number, metadata: MarketChartChangeMetadata): void;
  zoom(x: number, factor: number, metadata: MarketChartChangeMetadata): void;
  scale(id: string, delta: number, pan: boolean, metadata: MarketChartChangeMetadata): void;
  resize(boundary: number, delta: number, metadata: MarketChartChangeMetadata): void;
  inspect(point: InteractionPoint): void;
  capture(id: number): void;
  release(id: number): void;
  scrollOwner?: MarketChartScrollOwner;
}
/** Normalize before choosing one owner; ties are vertical, including deltaMode line/page. */
export function routeMarketWheel(event: {deltaX: number; deltaY: number; deltaMode: number; shiftKey?: boolean}, pageHeight: number): {kind: 'pan' | 'zoom'; delta: number} {
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? Math.max(1, pageHeight) : 1;
  const x = Number.isFinite(event.deltaX) ? event.deltaX * unit : 0;
  const y = Number.isFinite(event.deltaY) ? event.deltaY * unit : 0;
  const horizontal = Math.abs(x) > Math.abs(y);
  return {kind: event.shiftKey || horizontal ? 'pan' : 'zoom', delta: Math.max(-1000, Math.min(1000, horizontal ? x : y))};
}

/** Cancellation-safe input ownership, independent of financial data and DOM ancestry. */
export class WorkspaceGestureController {
  private points = new Map<number, InteractionPointer>();
  private captured = new Set<number>();
  private start: (InteractionPointer & {lastX: number; lastY: number; target: InteractionTarget; intent: 'undecided' | 'pan' | 'scroll' | 'inspect' | 'owned'}) | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pinching = false;
  private blocked = false;
  private distance = 0;
  constructor(private port: WorkspaceGesturePort) {}
  private stopTimer(): void { clearTimeout(this.timer); this.timer = undefined; }
  private capture(id: number): void { if (!this.captured.has(id)) {this.captured.add(id); this.port.capture(id);} }
  private release(id: number): void { if (this.captured.delete(id)) this.port.release(id); }
  down(point: InteractionPointer): boolean {
    const target = this.port.hit(point);
    if (target.kind === 'gutter' && (!point.touch || !this.port.scrollOwner)) return false;
    if (this.points.size && (!point.touch || this.start?.target.kind !== 'plot' || target.kind !== 'plot')) return false;
    this.points.set(point.id, point);
    if (this.blocked) return true;
    if (this.points.size === 2) {
      this.stopTimer();
      this.pinching = true;
      this.start = null;
      const [a,b] = [...this.points.values()];
      this.distance = Math.max(1, Math.hypot((a.clientX??a.x)-(b.clientX??b.x),(a.clientY??a.y)-(b.clientY??b.y)));
      this.points.forEach(p => this.capture(p.id));
      return true;
    }
    if (this.points.size > 2) {this.cancel(); this.blocked = true; return true;}
    this.start = {...point, lastX: point.clientX??point.x, lastY: point.clientY??point.y, target, intent: target.kind === 'gutter' ? 'scroll' : point.touch && target.kind === 'plot' ? 'undecided' : 'owned'};
    if (this.start.intent === 'undecided') {
      this.timer = setTimeout(() => {if(this.start?.intent === 'undecided' && this.points.size === 1){this.start.intent = 'inspect';this.port.inspect(point);}},450);
    } else this.capture(point.id);
    return true;
  }
  move(point: InteractionPointer): boolean {
    if (!this.points.has(point.id)) return false;
    this.points.set(point.id, point);
    if (this.blocked) return true;
    if (this.pinching) {
      if (this.points.size !== 2) return true;
      const [a,b] = [...this.points.values()], distance = Math.max(1,Math.hypot((a.clientX??a.x)-(b.clientX??b.x),(a.clientY??a.y)-(b.clientY??b.y)));
      this.port.zoom((a.x+b.x)/2,Math.max(.25,Math.min(4,this.distance/distance)),{source:'user',gesture:'pinch',phase:'change'});
      this.distance = distance;return true;
    }
    const start = this.start;
    if (!start || start.id !== point.id) return true;
    const dx = (point.clientX??point.x)-(start.clientX??start.x), dy = (point.clientY??point.y)-(start.clientY??start.y);
    if (start.intent === 'undecided') {
      if (Math.hypot(dx,dy) < 8) return true;
      this.stopTimer();
      start.intent = Math.abs(dx) > Math.abs(dy) ? 'pan' : 'scroll';
      this.capture(point.id);
    }
    const deltaX = (point.clientX??point.x)-start.lastX, deltaY = (point.clientY??point.y)-start.lastY;
    const metadata: MarketChartChangeMetadata = {source:'user',phase:'change',paneId:start.target.paneId};
    if (start.intent === 'inspect') { if (Math.hypot(dx,dy) >= 8) this.stopTimer(); this.port.inspect(point); }
    else if (start.intent === 'scroll') {
      const owner = this.port.scrollOwner;
      if(owner){const top=owner.getScrollTop();if(Number.isFinite(top))owner.scrollTo(Math.max(0,top-deltaY));}
    } else if (start.target.kind === 'value') this.port.scale(start.target.paneId!,deltaY,!!start.shift,{...metadata,gesture:'value-scale'});
    else if (start.target.kind === 'time') this.port.zoom(start.x,Math.exp(Math.max(-500,Math.min(500,deltaX))*.01),{...metadata,gesture:'time-scale'});
    else if (start.target.kind === 'separator') this.port.resize(start.target.boundary!,deltaY,{...metadata,gesture:'pane-resize'});
    else this.port.pan(deltaX,{...metadata,gesture:'pan'});
    start.lastX=point.clientX??point.x;start.lastY=point.clientY??point.y;return true;
  }
  up(id: number, cancelled = false): void {
    if(!this.points.has(id))return;
    this.stopTimer();
    const start = this.start;
    this.points.delete(id);
    if (start?.id === id && start.target.kind === 'separator') this.port.resize(start.target.boundary!,0,{source:'user',gesture:'pane-resize',phase:cancelled?'cancel':'end',paneId:start.target.paneId});
    if (this.pinching) {this.pinching=false;this.blocked=true;}
    this.start=null;this.release(id);
    if (!this.points.size) {this.blocked=false;this.distance=0;}
  }
  /** Ignore the expected lost-capture notification after our own release. */
  lostCapture(id: number): void {if(this.captured.has(id))this.cancel();}
  cancel(): void {
    this.stopTimer();
    const start=this.start;
    this.start=null;this.pinching=false;this.blocked=false;this.distance=0;this.points.clear();
    if (start?.target.kind==='separator')this.port.resize(start.target.boundary!,0,{source:'user',gesture:'pane-resize',phase:'cancel',paneId:start.target.paneId});
    [...this.captured].forEach(id=>this.release(id));
  }
}
