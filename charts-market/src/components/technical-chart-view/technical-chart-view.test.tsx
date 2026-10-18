import * as React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TechnicalChartView } from ".";
import { createTechnicalChartViewState } from "../../core";
import { technicalChartFixture } from "./fixtures";

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    new Proxy(
      {},
      { get: () => vi.fn() },
    ) as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1000);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("TechnicalChartView controlled intents", () => {
  it("clears old logical coordinates when the right offset changes", async () => {
    const state = createTechnicalChartViewState();
    state.viewport.logicalRange = { from: 100, to: 247 };
    const change = vi.fn();
    render(
      <TechnicalChartView
        symbol="TEST"
        interval="1D"
        data={technicalChartFixture}
        state={state}
        onStateChange={change}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Chart settings" }));
    fireEvent.change(screen.getByRole("slider", { name: /Right offset/ }), {
      target: { value: "50" },
    });
    expect(change.mock.calls.at(-1)?.[0].viewport).toMatchObject({
      rightOffsetBars: 50,
      logicalRange: undefined,
    });
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
  });
  it("renders four pane legends, keyboard separators and explicit profile provenance", async () => {
    render(
      <TechnicalChartView
        symbol="TEST"
        interval="1D"
        data={technicalChartFixture}
        state={createTechnicalChartViewState()}
        onStateChange={() => {}}
      />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("separator")).toHaveLength(3),
    );
    expect(screen.getByLabelText("RSI pane legend")).toBeInTheDocument();
    expect(screen.getByLabelText("MACD pane legend")).toBeInTheDocument();
    expect(screen.getByLabelText("Volume profile summary")).toHaveTextContent(
      "Approximate",
    );
    expect(
      screen.getByRole("toolbar", { name: "Drawing tools" }),
    ).toHaveAttribute("aria-orientation", "vertical");
  });
  it("emits scale and pane resize intents without mutating controlled input", async () => {
    const state = createTechnicalChartViewState();
    const change = vi.fn();
    render(
      <TechnicalChartView
        symbol="TEST"
        interval="1D"
        data={technicalChartFixture}
        state={state}
        onStateChange={change}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle logarithmic scale" }),
    );
    expect(change).toHaveBeenLastCalledWith(
      expect.objectContaining({
        scale: { mode: "logarithmic", autoScale: true },
      }),
      { type: "scale", id: undefined },
    );
    await waitFor(() =>
      expect(screen.getAllByRole("separator")).toHaveLength(3),
    );
    fireEvent.keyDown(screen.getAllByRole("separator")[0], {
      key: "ArrowDown",
    });
    expect(change.mock.calls.at(-1)?.[1].type).toBe("pane-resize");
    expect(state.panes[0].size).toBe(createTechnicalChartViewState().panes[0].size);
  });
  it("provides keyboard command access and host-only financial intent", async () => {
    const financials = vi.fn();
    render(
      <TechnicalChartView
        symbol="TEST"
        interval="1D"
        data={[]}
        state={createTechnicalChartViewState()}
        onStateChange={() => {}}
        onRequestFinancials={financials}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Financial data" }));
    expect(financials).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole("toolbar", { name: "Chart commands" }), {
      key: "k",
      ctrlKey: true,
    });
    await waitFor(() =>
      expect(screen.getByRole("dialog")).toHaveTextContent("Chart commands"),
    );
  });
  it("bounds its accessible table to 100 bars and includes active study/profile data", async () => {
    render(
      <TechnicalChartView
        symbol="TEST"
        interval="1D"
        data={technicalChartFixture}
        state={createTechnicalChartViewState()}
        onStateChange={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "View chart data" }));
    await waitFor(() =>
      expect(screen.getByRole("table")).toHaveTextContent("rsi:rsi"),
    );
    expect(screen.getAllByRole("row")).toHaveLength(101);
    expect(screen.getByRole("table")).toHaveTextContent("POC");
  });
  it("renders loading, error and empty states with original messages", async () => {
    const props = {
      symbol: "TEST",
      interval: "1D",
      data: [],
      state: createTechnicalChartViewState(),
      onStateChange: () => {},
    };
    const view = render(<TechnicalChartView {...props} loading />);
    expect(screen.getByLabelText("Loading market chart")).toBeInTheDocument();
    view.rerender(<TechnicalChartView {...props} error="Offline" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Offline");
    view.rerender(<TechnicalChartView {...props} emptyMessage="No bars" />);
    await waitFor(() =>
      expect(screen.getByText("No bars")).toBeInTheDocument(),
    );
  });
});
