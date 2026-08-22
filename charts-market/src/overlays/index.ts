import type { ChartOverlayDefinition, SerializableParameters } from "../core";

export interface PriceAlertOverlayParameters extends SerializableParameters {
  price: number;
  direction: "crossesAbove" | "crossesBelow";
  label: string | null;
}

export interface OrderOverlayParameters extends SerializableParameters {
  price: number;
  side: "buy" | "sell";
  quantity: number;
  status: string | null;
}

export interface PositionOverlayParameters extends SerializableParameters {
  averagePrice: number;
  quantity: number;
  side: "long" | "short";
}

export interface MarkerOverlayParameters extends SerializableParameters {
  time: number | string;
  label: string | null;
  color: string | null;
}

export const priceAlertOverlay: ChartOverlayDefinition<PriceAlertOverlayParameters> = {
  id: "price-alert", version: 1, label: "Price alert",
  defaultParameters: { price: 0, direction: "crossesAbove", label: null },
};
export const indicatorAlertOverlay: ChartOverlayDefinition<PriceAlertOverlayParameters> = {
  id: "indicator-alert", version: 1, label: "Indicator alert",
  defaultParameters: { price: 0, direction: "crossesAbove", label: null },
};
export const orderLineOverlay: ChartOverlayDefinition<OrderOverlayParameters> = {
  id: "order-line", version: 1, label: "Order line",
  defaultParameters: { price: 0, side: "buy", quantity: 1, status: null },
};
export const positionLineOverlay: ChartOverlayDefinition<PositionOverlayParameters> = {
  id: "position-line", version: 1, label: "Position line",
  defaultParameters: { averagePrice: 0, quantity: 0, side: "long" },
};
export const executionMarkerOverlay: ChartOverlayDefinition<MarkerOverlayParameters> = {
  id: "execution-marker", version: 1, label: "Execution marker", defaultParameters: { time: 0, label: null, color: null },
};
export const replayCursorOverlay: ChartOverlayDefinition<MarkerOverlayParameters> = {
  id: "replay-cursor", version: 1, label: "Replay cursor", defaultParameters: { time: 0, label: "Replay", color: null },
};
export const sessionMarkerOverlay: ChartOverlayDefinition<MarkerOverlayParameters> = {
  id: "session-marker", version: 1, label: "Session marker", defaultParameters: { time: 0, label: null, color: null },
};
export const bracketLineOverlay: ChartOverlayDefinition<OrderOverlayParameters> = {
  id: "bracket-line", version: 1, label: "Bracket line", defaultParameters: { price: 0, side: "sell", quantity: 1, status: null },
};

export const builtInChartOverlays: ChartOverlayDefinition[] = [
  priceAlertOverlay, indicatorAlertOverlay, orderLineOverlay, bracketLineOverlay, positionLineOverlay, executionMarkerOverlay, replayCursorOverlay, sessionMarkerOverlay,
] as ChartOverlayDefinition[];

export type { ChartOverlayDefinition, ChartOverlayState } from "../core";
