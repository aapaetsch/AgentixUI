import type { DrawingPoint, IndicatorPoint } from "./extensions";
import type { SerializableParameters, VisibleRange } from "./types";
import type { VolumeProfileResult } from "../engine/volume-profile";
import type { TechnicalChartViewState } from "./technical-chart-state";

export type CalculationMode = "internal" | "supplied";
export interface CalculationRequest {
  kind: "indicator" | "profile" | "drawing";
  instanceId: string;
  /** Echo unchanged in the result. Includes the host identity and input settings. */
  requestKey: string;
  symbol: string;
  interval: string;
  settings: SerializableParameters;
  anchors?: DrawingPoint[];
  dateRange?: VisibleRange;
}
export interface SuppliedResultMetadata {
  requestKey: string;
  status: "loading" | "available" | "partial" | "unavailable";
  provenanceLabel: string;
  approximate?: boolean;
  warning?: string;
  coverageSummary?: string;
  /** A matching result explicitly retained by the host while revalidating. */
  stale?: boolean;
}
export type SuppliedCalculationResult = SuppliedResultMetadata & (
  | { kind: "indicator"; points: IndicatorPoint[] }
  | { kind: "profile"; profile: VolumeProfileResult }
  | { kind: "drawing"; points: Array<{ time: DrawingPoint["time"]; value: number | null }>; derivedValues?: Record<string, string | number | boolean | null> }
);
export type SuppliedCalculationResults = Readonly<Record<string, SuppliedCalculationResult | undefined>>;

/** Stable JSON identity, not a financial formula or persistence codec. */
export function calculationRequestKey(identity: string, input: Omit<CalculationRequest, "requestKey">): string {
  return JSON.stringify([identity, input], (_key, value: unknown) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
      : value);
}
export function matchingSuppliedResult(request: CalculationRequest, results: SuppliedCalculationResults): SuppliedCalculationResult | undefined {
  const result = results[request.instanceId];
  return result?.requestKey === request.requestKey && result.kind === request.kind ? result : undefined;
}
export function suppliedResultRenderable(result: SuppliedCalculationResult | undefined): boolean {
  return result?.status === "available" || result?.status === "partial";
}

/** The host identity MUST change for a revised dataset, source, currency or price basis. */
export function createCalculationRequests(identity: string, symbol: string, interval: string, state: TechnicalChartViewState): CalculationRequest[] {
  const requests: Omit<CalculationRequest, "requestKey">[] = [
    ...state.indicators.filter(item => item.visible).map(item => ({ kind: "indicator" as const, instanceId: item.id, symbol, interval,
      settings: { definitionId: item.definitionId, version: item.version, parameters: item.parameters },
    })),
    ...state.profiles.filter(item => item.visible).map(item => ({ kind: "profile" as const, instanceId: item.id, symbol, interval,
      settings: { range: item.range, rows: item.rows, tickSize: item.tickSize ?? null, valueAreaPercent: item.valueAreaPercent },
      dateRange: item.range === "visible" ? state.viewport.visibleRange : item.timeRange,
    })),
    ...state.drawings.filter(item => item.visible && !["trend-line", "horizontal-line", "vertical-line", "rectangle"].includes(item.type)).map(item => ({
      kind: "drawing" as const, instanceId: item.id, symbol, interval,
      settings: { type: item.type, version: item.version, parameters: item.parameters }, anchors: item.points,
      dateRange: state.viewport.visibleRange,
    })),
  ];
  return requests.map(input => ({ ...input, requestKey: calculationRequestKey(identity, input) }));
}
