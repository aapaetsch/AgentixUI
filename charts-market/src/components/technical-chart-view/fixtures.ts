import type { OhlcBar, VolumeProfileLevel } from "../../core";

/** Deterministic synthetic daily history; no network or market-data service. */
export function createTechnicalChartFixture(count = 220): OhlcBar[] {
  let previous = 74;
  return Array.from({ length: count }, (_, index) => {
    const open = previous + Math.sin(index * 1.7) * 0.55;
    const close =
      open +
      0.11 +
      Math.sin(index * 0.31) * 0.85 +
      Math.cos(index * 1.3) * 0.45;
    previous = close;
    return {
      time: 1704153600 + index * 86400,
      open,
      close,
      high: Math.max(open, close) + 0.7 + (index % 5) * 0.11,
      low: Math.min(open, close) - 0.6 - (index % 3) * 0.14,
      volume:
        900000 +
        (index % 17) * 61000 +
        Math.round(Math.abs(Math.sin(index * 0.23)) * 1100000),
    };
  });
}
export const technicalChartFixture = createTechnicalChartFixture();
export const accurateProfileFixture: VolumeProfileLevel[] = Array.from(
  { length: 24 },
  (_, index) => ({
    priceFrom: 86 + index * 0.6,
    priceTo: 86 + (index + 1) * 0.6,
    upVolume: 18000 + (12 - Math.abs(index - 12)) * 6000,
    downVolume: 11000 + (10 - Math.min(10, Math.abs(index - 9))) * 4000,
  }),
);
