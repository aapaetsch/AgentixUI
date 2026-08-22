import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMarketChartEngine } from ".";

const theme = { background: "white", text: "black", border: "gray", grid: "lightgray", positive: "green", negative: "red", primary: "blue" };
const data = [
  { time: 1, open: 10, high: 12, low: 9, close: 11, volume: 100 },
  { time: 2, open: 11, high: 13, low: 10, close: 12, volume: 110 },
];

describe("first-party Canvas engine contract", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(new Proxy({}, { get: () => vi.fn() }) as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(800);
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("creates, updates, snapshots, synchronizes and cleans up without vendor internals", () => {
    const host = document.createElement("div"); const onVisibleRangeChange = vi.fn(); const onCrosshairChange = vi.fn();
    const engine = createMarketChartEngine(host, { chartType: "candlestick", data, height: 400, showVolume: true, scaleMode: "normal", markers: [], theme, onVisibleRangeChange, onCrosshairChange });
    expect(host.querySelector("canvas")).not.toBeNull();
    engine.appendOrUpdate({ ...data[1], time: 3 }); engine.setChartType("area"); engine.setScaleMode("percentage");
    engine.setIndicatorSeries([{ id: "rsi:value", paneId: "rsi", placement: "pane", style: "line", color: "purple", fixedDomain: [0, 100], points: data.map((bar) => ({ time: bar.time, value: 50 })) }]);
    engine.setOverlays([{ id: "alert", type: "price-alert", version: 1, visible: true, parameters: { price: 12 } }]);
    engine.setVisibleRange({ from: 1, to: 2 }); engine.setCrosshairPosition(2, 12);
    expect(engine.getSnapshot().visibleRange).toEqual({ from: 1, to: 2 });
    expect(engine.getSnapshot().panes.map((pane) => pane.id)).toContain("rsi");
    expect(onVisibleRangeChange).toHaveBeenCalled(); expect(onCrosshairChange).toHaveBeenCalled();
    engine.destroy(); expect(host.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("runs consumer render layers through the stable extension contract", async () => {
    const draw = vi.fn(); const host = document.createElement("div");
    const engine = createMarketChartEngine(host, { chartType: "line", data, height: 300, showVolume: false, scaleMode: "normal", markers: [], theme, renderLayers: [{ id: "consumer", draw }] });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(draw).toHaveBeenCalled();
    engine.destroy();
  });

  it("keeps render-layer data bounded for a 100,000-bar history", async () => {
    const visibleLengths: number[] = []; const history = Array.from({ length: 100_000 }, (_, index) => ({ time: index + 1, open: 100, high: 102, low: 99, close: 101, volume: 1000 }));
    const host = document.createElement("div"); const engine = createMarketChartEngine(host, { chartType: "candlestick", data: history, height: 300, showVolume: false, scaleMode: "normal", markers: [], theme, renderLayers: [{ id: "measure", draw: ({ visibleData }) => visibleLengths.push(visibleData.length) }] });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(Math.max(...visibleLengths)).toBeLessThan(130);
    engine.destroy();
  });

  it("handles high-DPI sizing and unified pointer, wheel and keyboard input", () => {
    vi.stubGlobal("devicePixelRatio", 2); const onCrosshairChange = vi.fn(); const onVisibleRangeChange = vi.fn(); const host = document.createElement("div");
    const engine = createMarketChartEngine(host, { chartType: "candlestick", data, height: 400, showVolume: false, scaleMode: "normal", markers: [], theme, onCrosshairChange, onVisibleRangeChange }); const canvas = host.querySelector("canvas")!;
    expect(canvas.width).toBe(1_600); expect(canvas.height).toBe(800);
    canvas.dispatchEvent(new MouseEvent("pointermove", { clientX: 300, clientY: 100, bubbles: true }));
    canvas.dispatchEvent(new WheelEvent("wheel", { clientX: 300, deltaY: -100, cancelable: true }));
    canvas.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    canvas.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(onCrosshairChange).toHaveBeenCalled(); expect(onVisibleRangeChange).toHaveBeenCalled();
    engine.destroy();
  });
});
