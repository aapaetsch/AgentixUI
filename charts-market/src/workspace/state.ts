import type {
  ChartOverlayState,
  DrawingState,
  JsonValue,
  MarketChartType,
  MarketScaleMode,
  SerializableParameters,
} from "../core";

export type MultiChartPreset = 1 | 2 | 3 | 4 | 6 | 8;

export interface IndicatorInstanceState {
  id: string;
  definitionId: string;
  version: number;
  parameters: SerializableParameters;
  visible: boolean;
  colors?: Record<string, string>;
}

export interface TechnicalChartState {
  id: string;
  symbol: string;
  interval: string;
  chartType: MarketChartType;
  scaleMode: MarketScaleMode;
  indicators: IndicatorInstanceState[];
  drawings: DrawingState[];
  overlays: ChartOverlayState[];
  paneSizes?: Record<string, number>;
  /** Opaque per-plugin state retained across migrations. */
  extensions?: Record<string, JsonValue>;
}

export interface TechnicalWorkspaceStateV1 {
  version: 1;
  layout: "single" | "double" | "quad";
  charts: TechnicalChartState[];
  activeChartId?: string;
  extensions?: Record<string, JsonValue>;
}

export interface TechnicalWorkspaceStateV2 {
  version: 2;
  layout: MultiChartPreset;
  name: string;
  charts: TechnicalChartState[];
  activeChartId?: string;
  synchronized: {
    symbol: boolean;
    interval: boolean;
    visibleRange: boolean;
    crosshair: boolean;
  };
  extensions?: Record<string, JsonValue>;
}

export interface TechnicalWorkspaceState extends Omit<TechnicalWorkspaceStateV2, "version"> {
  version: 3;
  drawingSynchronization: "off" | "same-symbol" | "layout";
}

export type AnyTechnicalWorkspaceState = TechnicalWorkspaceStateV1 | TechnicalWorkspaceStateV2 | TechnicalWorkspaceState;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function migrateWorkspaceState(input: AnyTechnicalWorkspaceState): TechnicalWorkspaceState {
  let state: AnyTechnicalWorkspaceState = input;
  if (state.version === 1) {
    const layouts: Record<TechnicalWorkspaceStateV1["layout"], MultiChartPreset> = { single: 1, double: 2, quad: 4 };
    state = {
      ...state,
      version: 2,
      name: "Imported layout",
      layout: layouts[state.layout],
      synchronized: { symbol: false, interval: false, visibleRange: false, crosshair: false },
    };
  }
  if (state.version === 2) state = { ...state, version: 3, drawingSynchronization: "off" };
  if (state.version !== 3) throw new Error("Unsupported technical workspace version.");
  return state;
}

export function parseWorkspaceState(value: string): TechnicalWorkspaceState {
  const parsed: unknown = JSON.parse(value);
  if (!isRecord(parsed) || (parsed.version !== 1 && parsed.version !== 2 && parsed.version !== 3) || !Array.isArray(parsed.charts)) {
    throw new Error("Invalid technical workspace state.");
  }
  return migrateWorkspaceState(parsed as unknown as AnyTechnicalWorkspaceState);
}

export function serializeWorkspaceState(state: TechnicalWorkspaceState): string {
  return JSON.stringify(state);
}
