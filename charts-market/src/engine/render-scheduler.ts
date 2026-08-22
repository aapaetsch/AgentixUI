export class RenderScheduler {
  private frame: number | null = null;
  constructor(private render: () => void) {}
  invalidate(): void {
    if (this.frame != null) return;
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (callback: (timestamp: number) => void) => globalThis.setTimeout(() => callback(Date.now()), 0) as unknown as number;
    this.frame = raf(() => { this.frame = null; this.render(); });
  }
  destroy(): void {
    if (this.frame == null) return;
    if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(this.frame); else clearTimeout(this.frame);
    this.frame = null;
  }
}
