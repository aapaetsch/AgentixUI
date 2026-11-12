import type { MarketPaneGeometry, TechnicalPaneState } from "../core";

export class PaneLayout {
  private workspace = false;
  setWorkspace(enabled: boolean): void { this.workspace=enabled;this.recalculate(); }
  get contentHeight(): number { return this.geometry.reduce((sum,p)=>sum+p.height,0)+this.axisHeight; }
  private definitions: TechnicalPaneState[] = [];
  setDefinitions(panes: TechnicalPaneState[]): void { this.definitions = panes; this.ids = panes.filter(p => p.visible !== false).sort((a,b) => a.order - b.order).map(p => p.id); this.sizes = Object.fromEntries(panes.map(p => [p.id, p.size])); this.recalculate(); }
  private ids: string[] = ["price"];
  private sizes: Record<string, number> = { price: 3 };
  private geometry: MarketPaneGeometry[] = [];
  constructor(private width = 1, private height = 1, private axisHeight = 28) { this.recalculate(); }
  setGeometry(width: number, height: number): void { this.width = Math.max(1, width); this.height = Math.max(1, height); this.recalculate(); }
  setPanes(ids: string[]): void { this.ids = ids.length ? ids : ["price"]; this.recalculate(); }
  setSizes(sizes: Record<string, number>): void { this.sizes = { ...this.sizes, ...sizes }; this.recalculate(); }
  get panes(): MarketPaneGeometry[] { return this.geometry.map((pane) => ({ ...pane })); }
  get normalizedSizes(): Record<string, number> { const total = this.ids.reduce((sum, id) => sum + Math.max(0.05, this.sizes[id] ?? (id === "price" ? 3 : 1)), 0); return Object.fromEntries(this.ids.map((id) => [id, Math.max(0.05, this.sizes[id] ?? (id === "price" ? 3 : 1)) / total])); }
  paneAt(y: number): MarketPaneGeometry | undefined { return this.geometry.find((pane) => y >= pane.top && y <= pane.top + pane.height); }
  resizeBoundary(index: number, delta: number): Record<string, number> {
    const current = this.geometry[index]; const next = this.geometry[index + 1]; if (!current || !next) return this.normalizedSizes;
    if(this.workspace){
      if(!Number.isFinite(delta)||this.definitions.find(p=>p.id===current.id)?.collapsed||this.definitions.find(p=>p.id===next.id)?.collapsed)return {...this.sizes};
      const aMin=this.definitions.find(p=>p.id===current.id)?.minimumSize??48,bMin=this.definitions.find(p=>p.id===next.id)?.minimumSize??48;
      const a=Math.max(aMin,current.height+delta),b=Math.max(bMin,next.height-(a-current.height));
      this.sizes={...this.sizes,...Object.fromEntries(this.geometry.filter(p=>!this.definitions.find(d=>d.id===p.id)?.collapsed).map(p=>[p.id,Math.max(.01,Math.min(1000,(p.id===current.id?a:p.id===next.id?b:p.height)/100))]))};
      this.recalculate();return {...this.sizes};
    }
    const usable = Math.max(1, this.height - this.axisHeight); const sizes = this.normalizedSizes;
    const normalizedDelta = delta / usable; const total = sizes[current.id] + sizes[next.id];
    const minimum = Math.min(total / 2, (this.definitions.find(p => p.id === current.id)?.minimumSize ?? 48) / usable);
    const nextMinimum = Math.min(total / 2, (this.definitions.find(p => p.id === next.id)?.minimumSize ?? 48) / usable);
    sizes[current.id] = Math.max(minimum, Math.min(total - nextMinimum, sizes[current.id] + normalizedDelta));
    sizes[next.id] = total - sizes[current.id];
    this.sizes = sizes; this.recalculate(); return this.normalizedSizes;
  }
  boundaryAt(y: number, tolerance = 5): number { return this.geometry.findIndex((pane, index) => index < this.geometry.length - 1 && Math.abs(y - (pane.top + pane.height)) <= tolerance); }
  private recalculate(): void {
    if(this.workspace){
      const minima=this.ids.map(id=>{const d=this.definitions.find(p=>p.id===id);return d?.collapsed?28:Math.max(48,d?.minimumSize??48);});
      const heights=this.ids.map((id,i)=>this.definitions.find(p=>p.id===id)?.collapsed?28:Math.max(minima[i],Math.max(.01,Math.min(1000,this.sizes[id]??1))*100));
      const total=heights.reduce((a,b)=>a+b,0),extra=Math.max(0,this.height-this.axisHeight-total),weight=this.ids.reduce((n,id,i)=>n+(this.definitions.find(p=>p.id===id)?.collapsed?0:heights[i]),0);let top=0;
      this.geometry=this.ids.map((id,i)=>{const height=heights[i]+(this.definitions.find(p=>p.id===id)?.collapsed?0:extra*heights[i]/(weight||1));const pane={id,top,height,width:this.width};top+=height;return pane;});return;
    }
    const usable = Math.max(1, this.height - this.axisHeight); const sizes = this.normalizedSizes; let top = 0;
    const minima = this.ids.map(id => { const p = this.definitions.find(p => p.id === id); return p?.collapsed ? 28 : p?.minimumSize ?? 0; });
    const minimumTotal = minima.reduce((a,b) => a+b, 0); const shrink = minimumTotal > usable ? usable / minimumTotal : 1;
    const weight = this.ids.reduce((sum,id) => sum + (this.definitions.find(p => p.id === id)?.collapsed ? 0 : sizes[id]), 0);
    const heights = this.ids.map((id,i) => minima[i] * shrink + (this.definitions.find(p => p.id === id)?.collapsed ? 0 : Math.max(0, usable - minimumTotal) * sizes[id] / (weight || 1)));
    this.geometry = this.ids.map((id, index) => { const height = index === this.ids.length - 1 ? usable - top : heights[index]; const pane = { id, top, height, width: this.width }; top += height; return pane; });
  }
}
