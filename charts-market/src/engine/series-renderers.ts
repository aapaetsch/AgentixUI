import type { MarketChartType, OhlcBar } from "../core";
import type {
  MarketSeriesRendererContext,
  MarketSeriesRendererDefinition,
} from "../core/engine";
export type {
  MarketSeriesRendererContext,
  MarketSeriesRendererDefinition,
} from "../core/engine";
function drawSeries(
  type: MarketChartType,
  {
    context,
    scale,
    pane,
    visible,
    startIndex,
    barSpacing,
    logicalToCoordinate,
    timeToCoordinate,
    isTimeSegmentContinuous,
    theme,
    presentation,
  }: MarketSeriesRendererContext,
): void {
  if (!visible.length) return;
  const spacing = barSpacing;
  const bodyWidth = Math.max(1, Math.floor(Math.min(presentation?.candles?.maximumWidth ?? 14, spacing * (presentation?.candles?.bodyRatio ?? 0.7))));
  if (["line", "area", "baseline"].includes(type)) {
    const points = visible
      .map((bar, offset) => ({
        x: timeToCoordinate ? timeToCoordinate(bar.time) : logicalToCoordinate(startIndex + offset),
        y: scale.toCoordinate(bar.close),
        bar,
      }))
      .filter(
        (point): point is { x: number; y: number; bar: OhlcBar } =>
          point.y != null && point.x != null && Number.isFinite(point.x) && (isTimeSegmentContinuous?.(point.bar.time, point.bar.time) ?? true),
      );
    if (!points.length) return;
    context.strokeStyle = theme.primary;
    context.fillStyle = theme.primary;
    context.lineWidth = 2;
    const segments: typeof points[] = [];
    points.forEach(point => {
      const segment = segments.at(-1), previous = segment?.at(-1);
      if (!previous || isTimeSegmentContinuous?.(previous.bar.time, point.bar.time) === false) segments.push([point]);
      else segment!.push(point);
    });
    segments.forEach(segment => {
      if (segment.length === 1) { const point = segment[0]; context.fillRect(point.x - 2, point.y - 2, 4, 4); return; }
      context.beginPath();
      segment.forEach((point,index) => index ? context.lineTo(point.x,point.y) : context.moveTo(point.x,point.y));
      context.stroke();
      if (type === "area") {
        context.lineTo(segment.at(-1)!.x, pane.top + pane.height);
        context.lineTo(segment[0].x, pane.top + pane.height);
        context.closePath(); context.globalAlpha = 0.14; context.fill(); context.globalAlpha = 1;
      }
    });
    if (type === "baseline") {
      const baseline = scale.toCoordinate(visible[0].close);
      if (baseline != null) {
        context.strokeStyle = theme.border;
        context.setLineDash([4, 4]);
        context.beginPath();
        context.moveTo(0, baseline);
        context.lineTo((pane.left ?? 0) + pane.width, baseline);
        context.stroke();
        context.setLineDash([]);
      }
    }
    return;
  }
  visible.forEach((bar, offset) => {
    const x = logicalToCoordinate(startIndex + offset);
    if (!Number.isFinite(x) || isTimeSegmentContinuous?.(bar.time, bar.time) === false) return;
    const open = scale.toCoordinate(bar.open);
    const high = scale.toCoordinate(bar.high);
    const low = scale.toCoordinate(bar.low);
    const close = scale.toCoordinate(bar.close);
    if ([open, high, low, close].some((value) => value == null)) return;
    const color = bar.close >= bar.open ? theme.positive : theme.negative;
    context.setLineDash(bar.incomplete ? [3, 3] : []);
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = presentation?.candles?.wickWidth ?? 1;
    context.beginPath();
    context.moveTo(Math.round(x) + 0.5, high!);
    context.lineTo(Math.round(x) + 0.5, low!);
    context.stroke();
    if (
      type === "candlestick" &&
      theme.positive === theme.negative &&
      bar.close >= bar.open || type === "candlestick" && bar.incomplete
    )
      context.strokeRect(
        x - bodyWidth / 2,
        Math.min(open!, close!),
        bodyWidth,
        Math.max(1, Math.abs(close! - open!)),
      );
    else if (type === "candlestick")
      context.fillRect(
        x - bodyWidth / 2,
        Math.min(open!, close!),
        bodyWidth,
        Math.max(1, Math.abs(close! - open!)),
      );
    else {
      context.beginPath();
      context.moveTo(x - bodyWidth / 2, open!);
      context.lineTo(x, open!);
      context.moveTo(x, close!);
      context.lineTo(x + bodyWidth / 2, close!);
      context.stroke();
    }
    context.setLineDash([]);
  });
}
/** Registry preserves the five existing renderers and permits replacement without modifying the engine. */
export const builtInSeriesRenderers: MarketSeriesRendererDefinition[] = (
  ["candlestick", "bar", "line", "area", "baseline"] as MarketChartType[]
).map((id) => ({ id, draw: (context) => drawSeries(id, context) }));
