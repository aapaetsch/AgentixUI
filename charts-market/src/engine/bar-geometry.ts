export interface BarGeometry {left: number; width: number; center: number}

/**
 * Shared CSS-pixel boundaries for candle bodies and volume at one time-scale slot.
 * Preserve the exact timestamp center and fractional edges in both draw passes.
 * When the requested gap cannot fit, prefer one device pixel; below that spacing,
 * use a subpixel slot-width bar rather than overlapping neighboring slots.
 */
export function adaptiveBarGeometry(center: number, slotSpacing: number, gap = 2, pixelRatio = 1): BarGeometry | null {
  if (!Number.isFinite(center) || !Number.isFinite(slotSpacing) || slotSpacing <= 0) return null;
  const ratio = Number.isFinite(pixelRatio) && pixelRatio > 0 ? Math.max(1, pixelRatio) : 1;
  const width = Math.min(slotSpacing, Math.max(1 / ratio, slotSpacing - gap));
  return {left: center - width / 2, width, center};
}
