import * as React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { MarketChartEngine } from "../../core";
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
});
