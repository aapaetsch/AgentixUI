import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MarketChartEngine } from "../core";
import { DrawingLayer, horizontalLineDrawing, trendLineDrawing } from ".";

const engine = {
  pointForCoordinate: vi.fn(),
  coordinateFor: vi.fn((point) => ({ x: Number(point.time), y: point.price })),
} as unknown as MarketChartEngine;

function pointer(type: string, x: number, y: number, extras: Record<string, unknown> = {}) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y });
  Object.defineProperties(event, {
    pointerId: { value: extras.pointerId ?? 1 },
    isPrimary: { value: true },
    pointerType: { value: extras.pointerType ?? "mouse" },
    altKey: { value: extras.altKey ?? false },
    ctrlKey: { value: extras.ctrlKey ?? false },
    metaKey: { value: extras.metaKey ?? false },
    shiftKey: { value: extras.shiftKey ?? false },
  });
  return event;
}

const trend = (id: string, offset = 0, locked = false) => ({
  id, type: "trend-line", version: 1, points: [{ time: 10 + offset, price: 10 + offset }, { time: 50 + offset, price: 50 + offset }],
  parameters: { color: "#64748b", lineWidth: 1 }, visible: true, locked,
});

describe("DrawingLayer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(SVGElement.prototype, "getBoundingClientRect").mockReturnValue({ x: 0, y: 0, left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200, toJSON: () => ({}) });
    vi.mocked(engine.coordinateFor).mockImplementation((point) => ({ x: Number(point.time), y: point.price }));
    vi.mocked(engine.pointForCoordinate).mockImplementation((coordinate) => ({ time: coordinate.x, price: coordinate.y }));
  });

  it("creates a controlled drawing after the required points", () => {
    const onDrawingsChange = vi.fn();
    vi.mocked(engine.pointForCoordinate).mockReturnValueOnce({ time: 10, price: 20 }).mockReturnValueOnce({ time: 30, price: 40 });
    render(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[]} activeTool={trendLineDrawing} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent(layer, pointer("pointerdown", 10, 20));
    fireEvent(layer, pointer("pointermove", 30, 40));
    expect(onDrawingsChange).not.toHaveBeenCalled();
    fireEvent(layer, pointer("pointerup", 30, 40));
    expect(onDrawingsChange).toHaveBeenCalledWith(
      [expect.objectContaining({ type: "trend-line", points: [{ time: 10, price: 20 }, { time: 30, price: 40 }] })],
      expect.objectContaining({ type: "create" }),
    );
  });

  it("does not emit drawing changes while merely moving over the chart", () => {
    const onDrawingsChange = vi.fn();
    render(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[]} activeTool={trendLineDrawing} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent.pointerMove(layer, { pointerId: 2, clientX: 40, clientY: 50 });
    fireEvent.pointerMove(layer, { pointerId: 2, clientX: 60, clientY: 70 });
    expect(onDrawingsChange).not.toHaveBeenCalled();
  });

  it("does not commit a zero-length two-point drawing", () => {
    const onDrawingsChange = vi.fn();
    vi.mocked(engine.pointForCoordinate).mockReturnValue({ time: 10, price: 20 });
    render(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[]} activeTool={trendLineDrawing} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent(layer, pointer("pointerdown", 10, 20));
    fireEvent(layer, pointer("pointerup", 10, 20));
    expect(onDrawingsChange).not.toHaveBeenCalled();
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
    const layer = screen.getByLabelText("Drawings");
    fireEvent(layer, pointer("pointerdown", 10, 20));
    expect(onDrawingsChange).not.toHaveBeenCalled();
    fireEvent(layer, pointer("pointerup", 10, 20));
    expect(onDrawingsChange).toHaveBeenCalledWith(
      [expect.objectContaining({ type: "horizontal-line", points: [{ time: 10, price: 20 }] })],
      expect.objectContaining({ type: "create" }),
    );
  });

  it("uses final pointer-up coordinates and commits body dragging once", () => {
    const onDrawingsChange = vi.fn();
    const drawing = trend("move");
    render(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[drawing]} tools={[trendLineDrawing]} selectedDrawingIds={[drawing.id]} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent(layer, pointer("pointerdown", 30, 30));
    fireEvent(layer, pointer("pointermove", 35, 35));
    expect(onDrawingsChange).not.toHaveBeenCalled();
    fireEvent(layer, pointer("pointerup", 40, 45));
    expect(onDrawingsChange).toHaveBeenCalledTimes(1);
    expect(onDrawingsChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: "move", points: [{ time: 20, price: 25 }, { time: 60, price: 65 }] }),
    ], expect.objectContaining({ type: "move", drawingIds: ["move"] }));
  });

  it("moves all selected unlocked drawings and leaves locked drawings unchanged", () => {
    const onDrawingsChange = vi.fn();
    const first = trend("first"); const second = trend("second", 20); const locked = trend("locked", 40, true);
    render(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[first, second, locked]} tools={[trendLineDrawing]} selectedDrawingIds={[first.id, second.id, locked.id]} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent(layer, pointer("pointerdown", 20, 20));
    fireEvent(layer, pointer("pointerup", 30, 30));
    const next = onDrawingsChange.mock.calls[0][0];
    expect(next.find((drawing: { id: string }) => drawing.id === "first").points[0]).toEqual({ time: 20, price: 20 });
    expect(next.find((drawing: { id: string }) => drawing.id === "second").points[0]).toEqual({ time: 40, price: 40 });
    expect(next.find((drawing: { id: string }) => drawing.id === "locked").points[0]).toEqual({ time: 50, price: 50 });
  });

  it("edits an endpoint and cancels without a commit on pointer cancellation", () => {
    const onDrawingsChange = vi.fn(); const drawing = trend("resize");
    render(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[drawing]} tools={[trendLineDrawing]} selectedDrawingIds={[drawing.id]} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent(layer, pointer("pointerdown", 10, 10)); fireEvent(layer, pointer("pointermove", 20, 25)); fireEvent(layer, pointer("pointercancel", 20, 25));
    expect(onDrawingsChange).not.toHaveBeenCalled();
  });

  it("supports off, weak, strong, and Alt-bypass snapping", () => {
    vi.mocked(engine.pointForCoordinate).mockReturnValue({ time: 10, price: 50 });
    vi.mocked(engine.coordinateFor).mockImplementation((point) => ({ x: Number(point.time), y: point.price }));
    const bar = { time: 10, open: 10, high: 20, low: 5, close: 15 };
    for (const [snapMode, expected] of [["off", 50], ["weak", 50], ["strong", 20]] as const) {
      const onDrawingsChange = vi.fn();
      const { unmount } = render(<DrawingLayer aria-label={`Drawings ${snapMode}`} engine={engine} data={[bar]} drawings={[]} activeTool={horizontalLineDrawing} interaction={{ snapMode, snapDistance: 2 }} onDrawingsChange={onDrawingsChange} />);
      const layer = screen.getByLabelText(`Drawings ${snapMode}`); fireEvent(layer, pointer("pointerdown", 10, 50)); fireEvent(layer, pointer("pointerup", 10, 50));
      expect(onDrawingsChange.mock.calls[0][0][0].points[0].price).toBe(expected); unmount();
    }
    const bypass = vi.fn(); render(<DrawingLayer aria-label="Bypass" engine={engine} data={[bar]} drawings={[]} activeTool={horizontalLineDrawing} interaction={{ snapMode: "strong" }} onDrawingsChange={bypass} />);
    const layer = screen.getByLabelText("Bypass"); fireEvent(layer, pointer("pointerdown", 10, 50, { altKey: true })); fireEvent(layer, pointer("pointerup", 10, 50, { altKey: true }));
    expect(bypass.mock.calls[0][0][0].points[0].price).toBe(50);
  });

  it("supports keyboard creation, navigation, nudging, duplication, deletion, and locked selection", () => {
    const onDrawingsChange = vi.fn(); const onSelection = vi.fn(); const first = trend("first"); const locked = trend("locked", 30, true);
    const { rerender } = render(<DrawingLayer aria-label="Drawings" engine={engine} data={[{ time: 10, open: 1, high: 2, low: 0, close: 1 }, { time: 11, open: 1, high: 2, low: 0, close: 1 }]} drawings={[first, locked]} tools={[trendLineDrawing]} selectedDrawingIds={[]} onSelectedDrawingIdsChange={onSelection} onDrawingsChange={onDrawingsChange} />);
    const layer = screen.getByLabelText("Drawings");
    fireEvent.keyDown(layer, { key: "Tab" }); expect(onSelection).toHaveBeenLastCalledWith(["first"]);
    rerender(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[first, locked]} tools={[trendLineDrawing]} selectedDrawingIds={[first.id]} onSelectedDrawingIdsChange={onSelection} onDrawingsChange={onDrawingsChange} />);
    fireEvent.keyDown(layer, { key: "ArrowUp" }); expect(onDrawingsChange).toHaveBeenLastCalledWith(expect.any(Array), expect.objectContaining({ type: "move" }));
    fireEvent.keyDown(layer, { key: "d", ctrlKey: true }); expect(onDrawingsChange).toHaveBeenLastCalledWith(expect.any(Array), expect.objectContaining({ type: "duplicate" }));
    fireEvent.keyDown(layer, { key: "Delete" }); expect(onDrawingsChange).toHaveBeenLastCalledWith(expect.any(Array), expect.objectContaining({ type: "delete" }));
    onDrawingsChange.mockClear();
    rerender(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[first, locked]} tools={[trendLineDrawing]} selectedDrawingIds={[locked.id]} onSelectedDrawingIdsChange={onSelection} onDrawingsChange={onDrawingsChange} />);
    fireEvent.keyDown(layer, { key: "ArrowUp" }); expect(onDrawingsChange).not.toHaveBeenCalled();
    rerender(<DrawingLayer aria-label="Drawings" engine={engine} drawings={[]} activeTool={horizontalLineDrawing} onDrawingsChange={onDrawingsChange} />);
    fireEvent.keyDown(layer, { key: "Enter" }); expect(onDrawingsChange).toHaveBeenLastCalledWith(expect.any(Array), expect.objectContaining({ type: "create" }));
  });
});
