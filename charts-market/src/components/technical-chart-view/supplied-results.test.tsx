import * as React from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TechnicalChartView } from ".";
import { MarketChart, type MarketChartHandle } from "../market-chart";
import { createCalculationRequests, matchingSuppliedResult, parseTechnicalChartViewState, serializeTechnicalChartViewState, type MarketChartEngine } from "../../core";
import { builtInDrawingTools } from "../../drawings";
import * as calculations from "../../drawings/calculations";
import * as profileCalculations from "../../engine/volume-profile";
import { suppliedStudyDefinitions } from "../../indicators";
import { suppliedBars, suppliedFixtureResults, suppliedFixtureState } from "./supplied-fixtures";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function engine(): MarketChartEngine {
  return {
    setData: vi.fn(), appendOrUpdate: vi.fn(), setChartType: vi.fn(), setScaleMode: vi.fn(), setMarkers: vi.fn(), setExtendedSessions: vi.fn(),
    setVolumeVisible: vi.fn(), setIndicatorSeries: vi.fn(), setOverlays: vi.fn(), resize: vi.fn(), fitContent: vi.fn(), scrollToRealtime: vi.fn(), destroy: vi.fn(),
    setRenderLayers: vi.fn(), setPaneSizes: vi.fn(), setVisibleRange: vi.fn(), setCrosshairPosition: vi.fn(), clearCrosshairPosition: vi.fn(), coordinateForTime: vi.fn(() => 100),
    coordinateFor: vi.fn(point => ({ x: Number(point.time) / 86400 % 400, y: point.price })), pointForCoordinate: vi.fn(point => ({ time: suppliedBars[0].time, price: point.y })),
    getSnapshot: vi.fn(() => ({ visibleRange: null, panes: [], scales: {}, crosshair: null })),
  };
}
describe("supplied calculation boundary", () => {
  it("keeps newly created geometry selected for immediate edit/delete and undo/redo", async () => {
    const api = engine(), factory = () => api;
    function Harness() {
      const [state, setState] = React.useState<ReturnType<typeof suppliedFixtureState>>(() => ({ ...suppliedFixtureState(), activeDrawingTool: "horizontal-line" as string | undefined }));
      return <TechnicalChartView symbol="MOCK" interval="1D" data={suppliedBars} state={state} onStateChange={setState} calculationMode="supplied" calculationIdentity="mock-v1" engineFactory={factory} />;
    }
    const view = render(<Harness />);
    await waitFor(() => expect(api.setData).toHaveBeenCalled());
    const surface = screen.getByLabelText(/^MOCK, 1D,/);
    fireEvent.keyDown(surface, { key: "Enter" });
    expect(screen.getByRole("toolbar", { name: "Actions for horizontal-line" })).toBeInTheDocument();
    expect(view.container.querySelectorAll("[data-drawing-id]")).toHaveLength(4);
    fireEvent.keyDown(surface, { key: "ArrowUp" });
    fireEvent.keyDown(surface, { key: "Delete" });
    expect(view.container.querySelectorAll("[data-drawing-id]")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: /^Undo$/ }));
    expect(view.container.querySelectorAll("[data-drawing-id]")).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: /^Redo$/ }));
    expect(view.container.querySelectorAll("[data-drawing-id]")).toHaveLength(3);
  });
  it.each(["compressed", "utc", "calendar"] as const)("renders all eight families, three profiles and both VWAPs without a single internal calculation on %s, including tables and drawing hit testing", async mode => {
    const formulas = [vi.spyOn(profileCalculations, "calculateVolumeProfile"), ...(["calculateDrawingVwap", "calculateLinearRegression", "calculatePosition", "calculateRangeMeasurement"] as const).map(name => vi.spyOn(calculations, name))];
    const metadata = suppliedStudyDefinitions.map(definition => ({ ...definition, calculate: vi.fn(() => { throw Error("Forbidden calculate"); }), createRuntime: vi.fn(() => { throw Error("Forbidden runtime"); }) }));
    const state = suppliedFixtureState();
    state.drawings.push(...builtInDrawingTools.filter(tool => !state.drawings.some(item => item.type === tool.id)).map(tool => ({ id: `guard-${tool.id}`, type: tool.id, version: 1, visible: true, locked: false, parameters: tool.defaultParameters, points: [{ time: suppliedBars[0].time, price: 99 }, { time: suppliedBars[5].time, price: 103 }, { time: suppliedBars[8].time, price: 101 }] })));
    const api = engine();
    const timeAxis = mode === "utc" ? { mode, domain: { from: suppliedBars[0].time, to: suppliedBars.at(-1)!.time }, intervalSeconds: 86400 } : mode === "calendar" ? { mode, times: suppliedBars.map(bar => bar.time) } : { mode };
    render(<TechnicalChartView timeAxis={timeAxis} discontinuities={[{from:suppliedBars[1].time,to:suppliedBars[4].time}]} symbol="MOCK" interval="1D" data={suppliedBars} state={state} onStateChange={() => {}} availableIndicators={metadata}
      calculationMode="supplied" calculationIdentity="mock-v1" suppliedResults={suppliedFixtureResults(state)} engineFactory={() => api} />);
    await waitFor(() => expect(api.setIndicatorSeries).toHaveBeenCalled());
    expect(vi.mocked(api.setIndicatorSeries).mock.calls.at(-1)![0]).toHaveLength(15);
    expect(screen.getByLabelText("Volume profile summary")).toHaveTextContent("101.125");
    expect(screen.getByLabelText("Volume profile summary")).toHaveTextContent("bar-derived-approximation");
    fireEvent.click(screen.getByRole("button", { name: "View chart data" }));
    expect(screen.getByRole("region", { name: "Chart data tables" })).toHaveTextContent("plus_di");
    expect(screen.getByRole("region", { name: "Chart data tables" })).toHaveTextContent("987.654");
    expect(screen.getByRole("region", { name: "Chart data tables" })).toHaveTextContent("103.125");
    const surface = screen.getByLabelText(/^MOCK, 1D,/);
    fireEvent.pointerMove(surface, { clientX: 10, clientY: 100, pointerId: 1 });
    fireEvent.pointerDown(surface, { clientX: 10, clientY: 100, pointerId: 1, shiftKey: true, button: 0 });
    fireEvent.pointerUp(surface, { pointerId: 1 });
    metadata.forEach(definition => { expect(definition.calculate).not.toHaveBeenCalled(); expect(definition.createRuntime).not.toHaveBeenCalled(); });
    formulas.forEach(formula => expect(formula).not.toHaveBeenCalled());
  });
  it("rejects superseded results synchronously in Canvas inputs, summaries and tables", async () => {
    const state = suppliedFixtureState(), api = engine();
    const props = { symbol: "MOCK", interval: "1D", data: suppliedBars, state, onStateChange: () => {}, calculationMode: "supplied" as const, calculationIdentity: "mock-v1", engineFactory: () => api };
    const view = render(<TechnicalChartView {...props} suppliedResults={suppliedFixtureResults(state)} />);
    await waitFor(() => expect(api.setIndicatorSeries).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "View chart data" }));
    view.rerender(<TechnicalChartView {...props} calculationIdentity="revised-dataset" suppliedResults={suppliedFixtureResults(state)} />);
    expect(screen.getByLabelText("Supplied calculation status")).toHaveTextContent("Stale response rejected");
    expect(screen.queryByLabelText("Volume profile summary")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Chart data tables" })).not.toHaveTextContent("987.654");
    expect(vi.mocked(api.setIndicatorSeries).mock.calls.at(-1)![0]).toEqual([]);
  });
  it("changes request keys for settings, symbol, interval, data identity, profile range and drawing anchors, but not pane resizing", () => {
    const state = suppliedFixtureState();
    const requests = createCalculationRequests("v1", "MOCK", "1D", state);
    const key = (next = state, symbol = "MOCK", interval = "1D", identity = "v1") => createCalculationRequests(identity, symbol, interval, next);
    expect(key({ ...state, panes: state.panes.map(pane => ({ ...pane, size: 8 })) })).toEqual(requests);
    for (const changed of [key(state, "OTHER"), key(state, "MOCK", "1h"), key(state, "MOCK", "1D", "v2")]) expect(changed[0].requestKey).not.toEqual(requests[0].requestKey);
    expect(key({ ...state, indicators: state.indicators.map(item => ({ ...item, parameters: { period: 50 } })) })[0].requestKey).not.toEqual(requests[0].requestKey);
    const changed = key({ ...state, viewport: { visibleRange: { from: 1, to: 2 } }, drawings: state.drawings.map(item => ({ ...item, points: [{ time: 2, price: 10 }] })) });
    for (const request of changed.filter(item => item.kind !== "indicator")) {
      const original = requests.find(item => item.instanceId === request.instanceId)!;
      if (request.kind === "drawing" || request.instanceId === "profile-visible") expect(request.requestKey).not.toEqual(original.requestKey);
    }
  });
  it("emits requests once per identity and keeps historical version-1 serializers unchanged", async () => {
    const state = suppliedFixtureState(), callback = vi.fn(), api = engine();
    const props = { symbol: "MOCK", interval: "1D", data: suppliedBars, state, onStateChange: () => {}, calculationMode: "supplied" as const, calculationIdentity: "mock-v1", engineFactory: () => api };
    const view = render(<TechnicalChartView {...props} onCalculationRequest={callback} />);
    await act(async () => {});
    const count = createCalculationRequests("mock-v1", "MOCK", "1D", state).length;
    expect(callback).toHaveBeenCalledTimes(count);
    view.rerender(<TechnicalChartView {...props} onCalculationRequest={callback} suppliedResults={suppliedFixtureResults(state)} />);
    expect(callback).toHaveBeenCalledTimes(count);
    expect(parseTechnicalChartViewState(serializeTechnicalChartViewState(state))).toEqual(state);
  });
  it.each(["loading", "unavailable", "partial", "available"] as const)("honors %s and preserves supplied warnings/coverage", async status => {
    const state = suppliedFixtureState();
    render(<TechnicalChartView symbol="MOCK" interval="1D" data={suppliedBars} state={state} onStateChange={() => {}} calculationMode="supplied" calculationIdentity="mock-v1" suppliedResults={suppliedFixtureResults(state, status)} engineFactory={() => engine()} />);
    await act(async () => {});
    expect(screen.getByLabelText("Supplied calculation status")).toHaveTextContent(status);
    expect(screen.getByLabelText("Supplied calculation status")).toHaveTextContent("32 mock UTC bars");
    expect(Boolean(screen.queryByLabelText("Volume profile summary"))).toBe(status === "available" || status === "partial");
  });
  it("requires an explicit host identity and rejects kind mismatches", async () => {
    const state = suppliedFixtureState(), results = suppliedFixtureResults(state), request = createCalculationRequests("mock-v1", "MOCK", "1D", state)[0];
    expect(matchingSuppliedResult(request, { [request.instanceId]: { ...results[request.instanceId]!, kind: "drawing", points: [] } })).toBeUndefined();
    render(<TechnicalChartView symbol="MOCK" interval="1D" data={suppliedBars} state={state} onStateChange={() => {}} calculationMode="supplied" suppliedResults={results} engineFactory={() => engine()} />);
    await act(async () => {});
    expect(screen.getByLabelText("Supplied calculation status")).toHaveTextContent("calculationIdentity is required");
    expect(screen.queryByLabelText("Volume profile summary")).not.toBeInTheDocument();
  });
  it("clears existing runtimes when switching to supplied mode and never invokes append calculations", async () => {
    const api = engine(), ref = React.createRef<MarketChartHandle>();
    const append = vi.fn(() => ({ time: 1, values: { sma: 1 } })), reset = vi.fn(() => []), calculate = vi.fn(() => []);
    const definition = { ...suppliedStudyDefinitions[0], calculate, createRuntime: vi.fn(() => ({ reset, appendOrUpdate: append })) };
    const props = { data: suppliedBars, ref, engineFactory: () => api, indicators: [{ id: "sma", definition, parameters: {}, visible: true }] };
    const view = render(<MarketChart {...props} />);
    await waitFor(() => expect(reset).toHaveBeenCalled());
    const createdBeforeSwitch = definition.createRuntime.mock.calls.length;
    view.rerender(<MarketChart {...props} calculationMode="supplied" />);
    await act(async () => {});
    act(() => ref.current?.appendOrUpdate({ ...suppliedBars[31], close: 104 }));
    expect(append).not.toHaveBeenCalled(); expect(calculate).not.toHaveBeenCalled(); expect(definition.createRuntime).toHaveBeenCalledTimes(createdBeforeSwitch);
  });
  it("applies the independent midnight palette to portaled dialog and drawing menus", async () => {
    const state = suppliedFixtureState();
    render(<TechnicalChartView theme="midnight" symbol="MOCK" interval="1D" data={suppliedBars} state={state} onStateChange={() => {}} calculationMode="supplied" calculationIdentity="mock-v1" engineFactory={() => engine()} />);
    await act(async () => {});
    fireEvent.click(screen.getByRole("button", { name: "Chart settings" }));
    expect(screen.getByRole("dialog").style.getPropertyValue("--background")).toBe("240 45% 7%");
  });
});
