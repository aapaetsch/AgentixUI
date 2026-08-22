import type { MarketPaneGeometry } from "../core";

export class PaneLayout {
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
    const usable = Math.max(1, this.height - this.axisHeight); const sizes = this.normalizedSizes;
    const normalizedDelta = delta / usable; const minimum = 48 / usable;
    sizes[current.id] = Math.max(minimum, sizes[current.id] + normalizedDelta);
    sizes[next.id] = Math.max(minimum, sizes[next.id] - normalizedDelta);
    this.sizes = sizes; this.recalculate(); return this.normalizedSizes;
  }
  boundaryAt(y: number, tolerance = 5): number { return this.geometry.findIndex((pane, index) => index < this.geometry.length - 1 && Math.abs(y - (pane.top + pane.height)) <= tolerance); }
  private recalculate(): void {
    const usable = Math.max(1, this.height - this.axisHeight); const sizes = this.normalizedSizes; let top = 0;
    this.geometry = this.ids.map((id, index) => { const height = index === this.ids.length - 1 ? usable - top : usable * sizes[id]; const pane = { id, top, height, width: this.width }; top += height; return pane; });
  }
}
