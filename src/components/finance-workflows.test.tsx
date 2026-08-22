import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertRuleEditor } from "./alert-rule-editor";
import { BracketOrderEditor } from "./bracket-order-editor";
import { MarketSessionStatus } from "./market-session-status";
import { ReplayControls } from "./replay-controls";
import { ScreenerFilterBuilder } from "./screener-filter-builder";
import { SymbolSearch } from "./symbol-search";
import { WorkingOrders } from "./working-orders";

describe("controlled finance workflow surfaces", () => {
  it("emits alert rule changes without evaluating the rule", () => {
    const onValueChange = vi.fn();
    render(<AlertRuleEditor value={{ id: "a", symbol: "AAPL", field: "price", operator: "greaterThan", threshold: 200, enabled: true }} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText("Threshold"), { target: { value: "210" } });
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ threshold: 210 }));
  });

  it("adds screener filters from supplied definitions", () => {
    const onFiltersChange = vi.fn();
    render(<ScreenerFilterBuilder definitions={[{ id: "price", label: "Price", type: "number" }]} filters={[]} onFiltersChange={onFiltersChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));
    expect(onFiltersChange).toHaveBeenCalledWith([expect.objectContaining({ field: "price" })]);
  });

  it("emits order, replay and symbol-selection intents", () => {
    const onCancel = vi.fn(); const onPlayingChange = vi.fn(); const onSelect = vi.fn();
    const order = { id: "o", symbol: "AAPL", side: "buy" as const, type: "limit" as const, quantity: 10, filledQuantity: 0, limitPrice: 200, status: "working" as const };
    const { rerender } = render(<WorkingOrders orders={[order]} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" })); expect(onCancel).toHaveBeenCalledWith(order);
    rerender(<ReplayControls current={1} min={0} max={10} playing={false} speed={1} onPlayingChange={onPlayingChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Play" })); expect(onPlayingChange).toHaveBeenCalledWith(true);
    rerender(<SymbolSearch query="AA" results={[{ symbol: "AAPL", name: "Apple" }]} onQueryChange={() => undefined} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("option").querySelector("button")!); expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ symbol: "AAPL" }));
  });

  it("shows calculated bracket risk and semantic session state", () => {
    const { rerender } = render(<BracketOrderEditor locale="en-US" value={{ symbol: "AAPL", side: "buy", quantity: 10, entryPrice: 100, takeProfitPrice: 110, stopLossPrice: 95 }} onValueChange={() => undefined} />);
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    rerender(<MarketSessionStatus state="open" />);
    expect(screen.getByText("Market open")).toBeInTheDocument();
  });
});
