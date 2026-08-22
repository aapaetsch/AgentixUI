import { describe, expect, it } from "vitest";

import {
  CorrelationMatrix,
  DrawdownChart,
  EquityCurve,
  ReturnsChart,
  RiskChart,
  RollingMetricChart,
  SignalChart,
  Tearsheet,
  calculateDrawdown,
  correlationCells,
} from "./quant";

describe("quant entrypoint", () => {
  it("exports the complete quantitative chart surface", () => {
    expect([
      CorrelationMatrix,
      DrawdownChart,
      EquityCurve,
      ReturnsChart,
      RiskChart,
      RollingMetricChart,
      SignalChart,
      Tearsheet,
      calculateDrawdown,
      correlationCells,
    ]).not.toContain(undefined);
  });
});
