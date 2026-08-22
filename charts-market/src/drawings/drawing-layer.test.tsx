import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { MarketChartEngine } from "../core";
import { DrawingLayer, horizontalLineDrawing, trendLineDrawing } from ".";

const engine = {
  pointForCoordinate: vi.fn(),
  coordinateFor: vi.fn((point) => ({ x: Number(point.time), y: point.price })),
} as unknown as MarketChartEngine;

describe("DrawingLayer", () => {
  it("creates a controlled drawing after the required points", () => {
    const onDrawingsChange = vi.fn();
    vi.mocked(engine.pointForCoordinate).mockReturnValueOnce({ time: 10, price: 20 }).mockReturnValueOnce({ time: 30, price: 40 });
    render(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[]} activeTool={trendLineDrawing} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent.pointerDown(layer, { clientX: 10, clientY: 20 });
    fireEvent.pointerDown(layer, { clientX: 30, clientY: 40 });
    expect(onDrawingsChange).toHaveBeenCalledWith([expect.objectContaining({ type: "trend-line", points: [{ time: 10, price: 20 }, { time: 30, price: 40 }] })]);
  });

  it("snaps drawing points to nearby OHLC values", () => {
    const onDrawingsChange = vi.fn();
    vi.mocked(engine.pointForCoordinate).mockReturnValue({ time: 10, price: 20.25 });
    render(<DrawingLayer
      aria-label="Drawings"
      engine={engine}
      data={[{ time: 10, open: 18, high: 22, low: 17, close: 20, volume: 100 }]}
      drawings={[]}
      activeTool={horizontalLineDrawing}
      onDrawingsChange={onDrawingsChange}
    />);
    fireEvent(screen.getByLabelText("Drawings"), new MouseEvent("pointerdown", {
      bubbles: true,
      clientX: 10,
      clientY: 20,
    }));
    expect(onDrawingsChange).toHaveBeenCalledWith([
      expect.objectContaining({ type: "horizontal-line", points: [{ time: 10, price: 20 }] }),
    ]);
  });
});
