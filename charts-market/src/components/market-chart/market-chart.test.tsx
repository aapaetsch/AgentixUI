import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { MarketChartEngine, MarketCrosshairSnapshot } from "../../core";
import { vwapIndicator } from "../../indicators";
import { MarketChart, type MarketChartHandle } from ".";

function fakeEngine(): MarketChartEngine {
  return {
    setData: vi.fn(), appendOrUpdate: vi.fn(), setChartType: vi.fn(), setScaleMode: vi.fn(), setMarkers: vi.fn(),
    setExtendedSessions: vi.fn(),
    setVolumeVisible: vi.fn(), setIndicatorSeries: vi.fn(), setOverlays: vi.fn(), resize: vi.fn(), fitContent: vi.fn(), scrollToRealtime: vi.fn(), destroy: vi.fn(),
    setRenderLayers: vi.fn(), setPaneSizes: vi.fn(),
    setVisibleRange: vi.fn(), setCrosshairPosition: vi.fn(), clearCrosshairPosition: vi.fn(), coordinateForTime: vi.fn(() => null),
    coordinateFor: vi.fn(() => null), pointForCoordinate: vi.fn(() => null),
    getSnapshot: vi.fn(() => ({ visibleRange: null, panes: [], scales: {}, crosshair: null })),
  };
}

const bars = [{ time: 1, open: 10, high: 12, low: 9, close: 11, volume: 100 }];
const drawing = { id: "level", type: "horizontal-line", version: 1, points: [{ time: 1, price: 11 }], parameters: { color: "#64748b", lineWidth: 1 }, visible: true, locked: false };

describe("MarketChart", () => {
  it("renders an accessible summary and data-table alternative", async () => {
    const engine = fakeEngine();
    render(<MarketChart data={bars} symbol="TEST" engineFactory={() => engine} />);
    await waitFor(() => expect(engine.setData).toHaveBeenCalled());
    expect(screen.getByRole("status")).toHaveTextContent("TEST");
    fireEvent.click(screen.getByRole("button", { name: "View data" }));
    expect(screen.getByRole("table", { name: "Market price data" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /charts by/i })).not.toBeInTheDocument();
  });

  it("exposes high-frequency update and viewport actions", async () => {
    const engine = fakeEngine();
    const ref = React.createRef<MarketChartHandle>();
    render(<MarketChart ref={ref} data={bars} engineFactory={() => engine} />);
    await waitFor(() => expect(engine.setData).toHaveBeenCalled());
    act(() => { ref.current?.appendOrUpdate({ ...bars[0], time: 2, close: 12 }); ref.current?.fitContent(); });
    expect(engine.appendOrUpdate).toHaveBeenCalled();
    expect(engine.fitContent).toHaveBeenCalled();
  });

  it("renders an SSR-safe placeholder without creating an engine while loading", () => {
    const factory = vi.fn(() => fakeEngine());
    render(<MarketChart data={bars} loading engineFactory={factory} />);
    expect(screen.getByLabelText("Loading market chart")).toBeInTheDocument();
    expect(factory).not.toHaveBeenCalled();
  });

  it("overlays the crosshair legend without moving the chart layout", async () => {
    const engine = fakeEngine();
    let emitCrosshair: ((snapshot: MarketCrosshairSnapshot | null) => void) | undefined;
    render(<MarketChart
      data={bars}
      indicators={[{ id: "vwap-1", definition: vwapIndicator, parameters: {}, visible: true }]}
      engineFactory={(_host, options) => { emitCrosshair = options.onCrosshairChange; return engine; }}
    />);
    await waitFor(() => expect(emitCrosshair).toBeDefined());
    act(() => emitCrosshair?.({ time: 1, bar: bars[0], paneId: "price", coordinates: { x: 20, y: 30 }, values: { "vwap-1:vwap": 11 } }));
    const legend = screen.getByLabelText("Pane indicator legend");
    expect(legend).toHaveClass("absolute", "pointer-events-none");
    expect(legend.parentElement).toHaveClass("relative");
  });

  it("keeps new selection state separate from drawing commits", async () => {
    const engine = fakeEngine();
    vi.mocked(engine.coordinateFor).mockImplementation((point) => ({ x: Number(point.time), y: point.price }));
    vi.mocked(engine.pointForCoordinate).mockImplementation((point) => ({ time: point.x, price: point.y }));
    const onSelection = vi.fn(); const onDrawingsChange = vi.fn();
    render(<MarketChart data={bars} drawings={[drawing]} selectedDrawingIds={[]} onSelectedDrawingIdsChange={onSelection} onDrawingsChange={onDrawingsChange} engineFactory={() => engine} />);
    const surface = await screen.findByLabelText("Interactive market chart");
    await waitFor(() => expect(screen.getByLabelText("Chart drawings")).toBeInTheDocument());
    fireEvent.keyDown(surface, { key: "Tab" });
    expect(onSelection).toHaveBeenCalledWith(["level"]);
    expect(onDrawingsChange).not.toHaveBeenCalled();
  });

  it("emits style metadata and invalidates redo after an external rebase", async () => {
    const engine = fakeEngine();
    const metadata = vi.fn();
    function Harness() {
      const [drawings, setDrawings] = React.useState([drawing]);
      return <>
        <button type="button" onClick={() => setDrawings([{ ...drawing, visible: false }])}>External replace</button>
        <MarketChart
          data={bars}
          drawings={drawings}
          selectedDrawingIds={[drawing.id]}
          onDrawingsChange={(next, change) => { metadata(change); setDrawings(next as typeof drawings); }}
          engineFactory={() => engine}
        />
      </>;
    }
    render(<Harness />);
    const width = await screen.findByLabelText("Drawing line width");
    fireEvent.change(width, { target: { value: "2" } });
    expect(metadata).toHaveBeenLastCalledWith(expect.objectContaining({ type: "style", drawingIds: ["level"] }));
    const undo = screen.getByRole("button", { name: "Undo" }); const redo = screen.getByRole("button", { name: "Redo" });
    expect(undo).toBeEnabled(); fireEvent.click(undo); expect(redo).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "External replace" }));
    await waitFor(() => expect(redo).toBeDisabled());
  });
});
