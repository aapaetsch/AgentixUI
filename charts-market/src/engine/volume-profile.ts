import { marketTimeKey } from "../core/validation";
import type {
  OhlcBar,
  VisibleRange,
  VolumeProfileLevel,
  VolumeProfileSource,
  VolumeProfileState,
} from "../core";

export interface VolumeProfileResult {
  rows: VolumeProfileLevel[];
  poc: number | null;
  vah: number | null;
  val: number | null;
  totalVolume: number;
  provenance: "supplied-levels" | "bar-derived-approximation";
  unavailable?: string;
}
export function selectProfileBars(
  bars: readonly OhlcBar[],
  settings: VolumeProfileState,
  visibleRange?: VisibleRange,
): readonly OhlcBar[] {
  const range =
    settings.range === "visible" ? visibleRange : settings.timeRange;
  if (!range) return settings.range === "visible" ? bars : [];
  const from = marketTimeKey(range.from);
  const to = marketTimeKey(range.to);
  // Binary bounds keep visible-window work independent of full history length.
  const bound = (key: number, inclusive: boolean) => {
    let low = 0;
    let high = bars.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (
        marketTimeKey(bars[mid].time) < key ||
        (inclusive && marketTimeKey(bars[mid].time) === key)
      )
        low = mid + 1;
      else high = mid;
    }
    return low;
  };
  return bars.slice(bound(from, false), bound(to, true));
}
/** Uniformly distributes each bar's volume over its high/low range. This is an estimate, never bid/ask data. */
export function calculateVolumeProfile(
  source: VolumeProfileSource,
  settings: VolumeProfileState,
  visibleRange?: VisibleRange,
): VolumeProfileResult {
  const provenance =
    source.kind === "levels" ? "supplied-levels" : "bar-derived-approximation";
  const empty = (unavailable?: string): VolumeProfileResult => ({
    rows: [],
    poc: null,
    vah: null,
    val: null,
    totalVolume: 0,
    provenance,
    unavailable,
  });
  let rows: VolumeProfileLevel[];
  if (source.kind === "levels") {
    if (
      source.levels.some(
        (l) =>
          ![l.priceFrom, l.priceTo, l.upVolume, l.downVolume].every(
            Number.isFinite,
          ) ||
          l.priceTo <= l.priceFrom ||
          l.upVolume < 0 ||
          l.downVolume < 0,
      )
    )
      return empty("Invalid supplied volume levels.");
    rows = source.levels
      .map((l) => ({ ...l }))
      .sort((a, b) => a.priceFrom - b.priceFrom);
    if (rows.some((l, i) => i > 0 && l.priceFrom < rows[i - 1].priceTo))
      return empty("Supplied volume levels must not overlap.");
  } else {
    if (settings.range !== "visible" && !settings.timeRange)
      return empty("Select an explicit session or fixed time range.");
    const bars = selectProfileBars(source.bars, settings, visibleRange);
    if (!bars.length) return empty();
    if (
      bars.some(
        (b) => b.volume == null || !Number.isFinite(b.volume) || b.volume < 0,
      )
    )
      return empty("Volume is unavailable for one or more bars.");
    const minimum = bars.reduce((n, b) => Math.min(n, b.low), Infinity);
    const maximum = bars.reduce((n, b) => Math.max(n, b.high), -Infinity);
    const span = Math.max(
      maximum - minimum,
      settings.tickSize ?? Math.abs(minimum) * 0.001,
      0.000001,
    );
    const rowSetting =
      typeof settings.rows === "number"
        ? settings.rows
        : Math.ceil(
            span / (settings.rows.ticksPerRow * (settings.tickSize ?? 0.01)),
          );
    const count = Math.max(
      1,
      Math.min(1000, Math.round(Number.isFinite(rowSetting) ? rowSetting : 48)),
    );
    const step = span / count;
    rows = Array.from({ length: count }, (_, i) => ({
      priceFrom: minimum + i * step,
      priceTo: minimum + (i + 1) * step,
      upVolume: 0,
      downVolume: 0,
    }));
    bars.forEach((b) => {
      const first = Math.max(
        0,
        Math.min(count - 1, Math.floor((b.low - minimum) / step)),
      );
      const last = Math.min(count - 1, Math.floor((b.high - minimum) / step));
      for (let i = first; i <= last; i++) {
        const fraction =
          b.high === b.low
            ? 1
            : Math.max(
                0,
                Math.min(b.high, rows[i].priceTo) -
                  Math.max(b.low, rows[i].priceFrom),
              ) /
              (b.high - b.low);
        rows[i][b.close >= b.open ? "upVolume" : "downVolume"] +=
          b.volume! * fraction;
      }
    });
  }
  const totals = rows.map((r) => r.upVolume + r.downVolume);
  const totalVolume = totals.reduce((a, b) => a + b, 0);
  if (!totalVolume) return { ...empty(), rows };
  // Tie-break toward the lower price, then expand a contiguous value area from POC.
  const pocIndex = totals.reduce(
    (best, v, i) => (v > totals[best] ? i : best),
    0,
  );
  let low = pocIndex;
  let high = pocIndex;
  let accumulated = totals[pocIndex];
  const target =
    (totalVolume * Math.max(0, Math.min(100, settings.valueAreaPercent))) / 100;
  while (accumulated < target && (low > 0 || high < rows.length - 1)) {
    if (
      high === rows.length - 1 ||
      (low > 0 && totals[low - 1] >= totals[high + 1])
    )
      accumulated += totals[--low];
    else accumulated += totals[++high];
  }
  return {
    rows,
    totalVolume,
    provenance,
    poc: (rows[pocIndex].priceFrom + rows[pocIndex].priceTo) / 2,
    val: rows[low].priceFrom,
    vah: rows[high].priceTo,
  };
}
