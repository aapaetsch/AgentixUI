import type { OhlcBar, SerializableParameters } from "./types";

export interface IndicatorLineDefinition {
  id: string;
  label: string;
  color?: string;
  style?: "line" | "histogram";
}

export interface IndicatorPoint {
  time: OhlcBar["time"];
  values: Record<string, number | null>;
}

export interface IndicatorDefinition<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  version: number;
  label: string;
  placement: "overlay" | "pane";
  defaultParameters: TParameters;
  lines: IndicatorLineDefinition[];
  fixedDomain?: readonly [number, number];
  referenceLines?: Array<{ value: number; label?: string; color?: string }>;
  formatValue?: (value: number) => string;
  createRuntime?: (parameters: TParameters) => IndicatorRuntime;
  calculate(data: readonly OhlcBar[], parameters: TParameters): IndicatorPoint[];
}

export interface IndicatorRuntime {
  reset(data: readonly OhlcBar[]): IndicatorPoint[];
  appendOrUpdate(bar: OhlcBar): IndicatorPoint;
}

export interface IndicatorInstance<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  definition: IndicatorDefinition<TParameters>;
  parameters: TParameters;
  visible: boolean;
  colors?: Record<string, string>;
}

export interface DrawingPoint {
  time: OhlcBar["time"];
  price: number;
}

export interface DrawingState<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  type: string;
  version: number;
  points: DrawingPoint[];
  parameters: TParameters;
  visible: boolean;
  locked: boolean;
  selected?: boolean;
}

export interface DrawingToolDefinition<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  version: number;
  label: string;
  requiredPoints: number;
  defaultParameters: TParameters;
}

export interface ChartOverlayState<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  type: string;
  version: number;
  parameters: TParameters;
  visible: boolean;
}

export interface ChartOverlayDefinition<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  version: number;
  label: string;
  defaultParameters: TParameters;
}
