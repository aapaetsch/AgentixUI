import type { MarketRenderLayer, VolumeProfileState } from "../core";
import type { VolumeProfileResult } from "./volume-profile";

export interface VolumeProfileHit {
  profileId: string;
  row: VolumeProfileResult["rows"][number];
}
/** Precalculated results are reused for every frame, including crosshair movement. */
export function createVolumeProfileLayer(
  settings: VolumeProfileState,
  result: VolumeProfileResult,
  onInspect?: (hit: VolumeProfileHit) => void,
): MarketRenderLayer {
  let hitBoxes: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    row: VolumeProfileHit["row"];
  }> = [];
  const hit = (p: { x: number; y: number }) =>
    hitBoxes.find(
      (b) =>
        p.x >= b.x &&
        p.x <= b.x + b.width &&
        p.y >= b.y &&
        p.y <= b.y + b.height,
    );
  return {
    id: settings.id,
    paneId: "price",
    zIndex: 15,
    draw({ canvas: c, panes, priceToCoordinate, theme }) {
      hitBoxes = [];
      if (!settings.visible) return;
      const pane = panes.find((p) => p.id === "price");
      if (!pane || pane.height <= 32) return;
      const width =
        (pane.width * Math.max(1, Math.min(50, settings.widthPercent))) / 100;
      const max = result.rows.reduce(
        (v, r) => Math.max(v, r.volume ?? r.upVolume + r.downVolume),
        0,
      );
      if (!max) return;
      result.rows.forEach((row) => {
        const y1 = priceToCoordinate(row.priceTo);
        const y2 = priceToCoordinate(row.priceFrom);
        if (y1 == null || y2 == null) return;
        const barWidth = (width * (row.volume ?? row.upVolume + row.downVolume)) / max;
        const x =
          settings.placement === "right"
            ? (pane.left ?? 0) + pane.width - barWidth
            : (pane.left ?? 0);
        const y = Math.min(y1, y2);
        const height = Math.max(1, Math.abs(y2 - y1) - 1);
        const inArea =
          result.val != null &&
          result.vah != null &&
          row.priceFrom >= result.val &&
          row.priceTo <= result.vah;
        c.globalAlpha =
          (settings.opacity ?? 0.85) *
          (settings.showValueArea && !inArea ? 0.3 : 1);
        const upWidth = settings.splitVolume && row.volume == null
          ? (barWidth * row.upVolume) / (row.upVolume + row.downVolume || 1)
          : barWidth;
        const upColor = settings.upColor ?? "#168ac4";
        const downColor = settings.downColor ?? "#d5a51f";
        const downFirst =
          settings.splitVolume && row.volume == null && settings.placement === "right";
        const firstWidth = downFirst ? barWidth - upWidth : upWidth;
        c.fillStyle = downFirst ? downColor : upColor;
        c.fillRect(x, y, firstWidth, height);
        c.fillStyle = downFirst ? upColor : downColor;
        c.fillRect(x + firstWidth, y, barWidth - firstWidth, height);
        hitBoxes.push({
          x,
          y: Math.max(pane.top, y),
          width: barWidth,
          height: Math.max(
            0,
            Math.min(pane.top + pane.height, y + height) -
              Math.max(pane.top, y),
          ),
          row,
        });
      });
      c.globalAlpha = 1;
      [
        [settings.showPoc, result.poc, "POC"],
        [settings.showValueArea, result.vah, "VAH"],
        [settings.showValueArea, result.val, "VAL"],
      ].forEach(([show, value, label]) => {
        if (!show || typeof value !== "number") return;
        const y = priceToCoordinate(value);
        if (y == null) return;
        c.strokeStyle =
          label === "POC" ? (settings.pocColor ?? "#ef4444") : theme.text;
        c.setLineDash(label === "POC" ? [] : [3, 4]);
        c.beginPath();
        c.moveTo(
          label === "POC"
            ? (pane.left ?? 0)
            : settings.placement === "right"
              ? (pane.left ?? 0) + pane.width - width
              : (pane.left ?? 0),
          y,
        );
        c.lineTo(
          label === "POC"
            ? (pane.left ?? 0) + pane.width
            : settings.placement === "right"
              ? (pane.left ?? 0) + pane.width
              : (pane.left ?? 0) + width,
          y,
        );
        c.stroke();
        c.fillStyle = theme.text;
        c.fillText(
          String(label),
          settings.placement === "right"
            ? (pane.left ?? 0) + pane.width - width - 28
            : (pane.left ?? 0) + width + 3,
          y - 3,
        );
      });
    },
    hitTest: (p) => Boolean(hit(p)),
    onPointerEvent: onInspect
      ? (event) => {
          const box = hit(event);
          if (box) onInspect({ profileId: settings.id, row: box.row });
        }
      : undefined,
  };
}
