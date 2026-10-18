import { createCalculationRequests, createTechnicalChartViewState, type SuppliedCalculationResults, type SuppliedResultMetadata, type TechnicalChartViewState } from "../../core";
import { suppliedStudyDefinitions } from "../../indicators";

/** Deterministic presentation fixtures. These numbers are mocks, never financial calculations. */
export const suppliedBars = Array.from({ length: 32 }, (_, index) => ({ time: 1790985600 + index * 86400,
  sessionDate: `2026-10-${String(index % 28 + 1).padStart(2, "0")}`, open: 100, high: 110, low: 90, close: 102, volume: 1000,
  incomplete: index === 31,
}));
export function suppliedFixtureState(compact = false): TechnicalChartViewState {
  const state = createTechnicalChartViewState("price-only");
  state.viewport = { visibleRange: { from: suppliedBars[0].time, to: suppliedBars[31].time }, rightOffsetBars: 0 };
  if (compact) { state.chartType = "line"; state.chrome.drawingRail = false; state.chrome.footer = false; return state; }
  state.indicators = suppliedStudyDefinitions.map(definition => ({ id: definition.id, definitionId: definition.id, version: 1, visible: true, parameters: definition.defaultParameters }));
  state.panes[0].size = 4;
  state.panes[0].studyIds = ["sma", "ema", "bb"];
  state.panes.push({ id: "volume", order: 1, size: 1, showVolume: true, studyIds: [] });
  suppliedStudyDefinitions.filter(definition => definition.placement === "pane").forEach((definition, index) => state.panes.push({ id: definition.id, order: index + 2, size: 1, minimumSize: 64, studyIds: [definition.id] }));
  state.profiles = ["visible", "session", "fixed"].map((range, index) => ({ id: `profile-${range}`, range: range as "visible" | "session" | "fixed", visible: true,
    timeRange: range === "visible" ? undefined : state.viewport.visibleRange, rows: 2, widthPercent: 12 + index * 8, placement: "right", valueAreaPercent: 70, showPoc: true, showValueArea: true, splitVolume: false,
  }));
  state.drawings = ["anchored-vwap", "session-vwap"].map((type, index) => ({ id: type, type, version: 1, points: [{ time: suppliedBars[index].time, price: 101 }], parameters: { source: "hlc3", color: index ? "#d97706" : "#0284c7", lineWidth: 2 }, visible: true, locked: false }));
  state.drawings.push({ id: "trend", type: "trend-line", version: 1, points: [{ time: suppliedBars[5].time, price: 92 }, { time: suppliedBars[24].time, price: 108 }], parameters: { color: "#0284c7", lineWidth: 2 }, visible: true, locked: false });
  return state;
}
export function suppliedFixtureResults(state: TechnicalChartViewState, status: SuppliedResultMetadata["status"] = "available", identity = "mock-v1", stale = false): SuppliedCalculationResults {
  return Object.fromEntries(createCalculationRequests(identity, "MOCK", "1D", state).map(request => {
    const metadata = { requestKey: stale ? "superseded" : request.requestKey, status, provenanceLabel: "Deterministic supplied mock", approximate: request.kind === "profile", coverageSummary: "32 mock UTC bars", warning: status === "partial" ? "Partial coverage: source gap" : status === "unavailable" ? "Producer error: no volume" : undefined };
    if (request.kind === "profile") return [request.instanceId, { ...metadata, kind: "profile", profile: { rows: [{ priceFrom: 98, priceTo: 100, volume: 123.456, upVolume: 0, downVolume: 0 }, { priceFrom: 100, priceTo: 102, volume: 987.654, upVolume: 0, downVolume: 0 }], poc: 101.125, vah: 102.25, val: 98.5, totalVolume: 1111.11, provenance: "bar-derived-approximation" } }];
    if (request.kind === "drawing") return [request.instanceId, { ...metadata, kind: "drawing", points: suppliedBars.map(bar => ({ time: bar.time, value: 103.125 })), derivedValues: { latest: 103.125, method: request.instanceId } }];
    const definition = suppliedStudyDefinitions.find(item => item.id === request.instanceId)!;
    return [request.instanceId, { ...metadata, kind: "indicator", points: suppliedBars.map(bar => ({ time: bar.time, values: Object.fromEntries(definition.lines.map((line, index) => [line.id, definition.placement === "overlay" ? 101.125 + index : 25.125 + index])) })) }];
  }));
}
