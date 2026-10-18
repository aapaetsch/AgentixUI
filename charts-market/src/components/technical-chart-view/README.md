# TechnicalChartView

Dedicated volume-only panes (`showVolume: true`, outside the price pane and without study series) use the supplied bar volume units on a normal zero-based axis. Axis labels and histogram heights share the same scale; this is not a normalized 0–1 chart. Price-pane or study-pane volume overlays keep the existing small relative overlay, without changing that pane's price/study units. Missing volume draws no bar; an empty/all-zero volume pane has a neutral 0–1 fallback. This correction is local pending a separately reviewed release; the immutable refinement.20261017.1 publication is preserved.

A complete technical-analysis workspace built on the existing `MarketChart` engine. Supply OHLCV and a single controlled state object; the component supplies command menus, drawing tools, grouped panes, persistent legends, value badges, integrated volume profiles and a range/status footer.

```tsx
import * as React from 'react';
import {
  TechnicalChartView,
  createTechnicalChartViewState,
  technicalChartViewReducer,
  type OhlcBar,
} from 'aapaetsch-charts-market';

function Analysis({ bars }: { bars: readonly OhlcBar[] }) {
  const [state, dispatch] = React.useReducer(
    technicalChartViewReducer,
    createTechnicalChartViewState('daily-analysis'),
  );
  return <TechnicalChartView
    symbol="NOVA" interval="1D" data={bars} state={state}
    onStateChange={next => dispatch({ type: 'replace', state: next })}
  />;
}
```

Import `aapaetsch-ui-kit/globals.css` and `aapaetsch-charts-market/styles.css` once in the host application. The UI kit owns theme variables while the market package ships its compiled utilities, so consumers do not need to scan package source with Tailwind. Apply your theme at the application root so portaled menus/dialogs inherit it. Put the view inside a positioned container when using contained maximize.

## State and intent

`createTechnicalChartViewState('daily-analysis')` supplies RSI / price with EMA20 and SMA50/100/150 / MACD plus volume / stochastic, with a visible-range profile and 28 future bars. `price-only` supplies a minimal starting point. Grouping is generic: a pane owns `studyIds`; `showVolume` uses an independent normalized volume overlay so MACD's scale is not distorted by volume units.

State includes chart type, auto/manual price scale, exact logical viewport, panes, serializable indicator instances, profiles, drawings, overlays, selection and chrome. `TechnicalIndicatorInstanceState` extends the same vocabulary as the pre-existing workspace `IndicatorInstanceState` without replacing that export. The definition registry supplies executable indicator code separately.

`onStateChange` identifies viewport, pane-resize, pane-reorder, pane, indicator-add/settings/remove, profile-settings, drawing, scale, chrome and layout intents. Reducer actions include replace, patch, move-pane and resize-pane. `serializeTechnicalChartViewState` / `parseTechnicalChartViewState` preserve JSON extension fields and reject unsupported versions. Storage and undo domains belong to the consumer; drawing gesture undo/redo remains in MarketChart.

Persist viewport callbacks verbatim, including `logicalRange`, for lossless pan/zoom. To intentionally replace the range using timestamps, clear `logicalRange` and set `visibleRange`. `fitContent()` retains the right offset. Pane `minimumSize` is a Canvas CSS-pixel height; `size` is a relative weight. Left scales reserve a shared gutter so all panes retain the same time coordinates.

## Volume profiles

The default bar-derived profile uniformly distributes each bar's volume over its high/low range, assigns it to up/down using close versus open, and visibly identifies the result as an approximation. It never represents bid/ask volume. Missing volume produces an unavailable summary instead of silently undercounting.

Pass `profileSources={{ 'visible-profile': { kind: 'levels', levels } }}` for supplied volume-at-price levels. Levels contain `priceFrom`, `priceTo`, `upVolume` and `downVolume`; they must be finite, nonnegative and nonoverlapping. Their boundaries are preserved rather than rebinned. Consumers must replace supplied levels when their requested range changes; the library cannot infer timestamps from price buckets.

`range: 'fixed' | 'session'` requires an explicit `timeRange`. The package does not infer exchange sessions. Settings support row count or ticks-per-row with `tickSize`, width, placement, opacity, POC, value area and stacked estimates. `calculateVolumeProfile` is pure and exposes row boundaries, total volume, provenance, POC, VAH and VAL. Equal-volume POC ties select the lower price; contiguous value-area expansion also selects the lower adjacent bucket on ties.

## Controls and accessibility

- Symbol and interval remain consumer-owned props with change callbacks. Async symbol adapters receive an AbortSignal; favorites and recent intervals are controlled chrome state.
- Ctrl/Cmd+K opens commands. Canvas arrows inspect, +/- zoom, Home/End navigate. Drag the plot to pan; drag the time axis to zoom; drag the price axis to scale, or Shift-drag to pan vertically. Double-click the price axis restores automatic scaling.
- Pane menus collapse/reorder/remove panes, move the scale side and change precision. Study settings support visibility, parameters, removal and movement between panes. Focusable separators resize with Up/Down.
- Narrow layouts preserve commands through menus and a floating drawing rail. Opening drawing tools does not shift the plot. The data table is bounded to the latest 100 bars and includes visible study values and profile summaries.
- Pointer inspection does not announce every move. Deliberate keyboard inspection has a live announcement. Labels identify series independently of color, and arrow-key inspection does not move the layout.
- `onRequestFullscreen`, `onRequestExport`, `onRequestFinancials` and `onRequestTimezone` are intents. Export requests carry PNG/CSV format, symbol, interval and state; the consumer performs the export. `status`, `clock` and `countdown` are slots with no package-owned timer.

## Verification

The deterministic stories include CompleteTechnicalAnalysis, Light, NarrowResponsive, FullscreenContained, Loading, Empty, Error, KeyboardNavigation, AccurateProfileLevels, ApproximateProfileFromBars, ReducedMotion and Stress. Stress contains 100,000 bars, four panes, 100 drawings and a 100-row profile.

Run `npm run test --workspace aapaetsch-charts-market`, `npm run typecheck`, `npm run build` and `npm run build-storybook`. With Storybook running, `node scripts/technical-chart-browser-smoke.cjs` captures screenshots, WCAG A/AA checks, interactions, hardware information, frame timing and traces. It requires Playwright and axe-core (installed in a Node-resolvable location); `AXE_PATH` can point to an isolated axe install. Evidence is written to `output/technical-chart-verification` and screenshots to `output/playwright`.

Composition follows the existing UI-kit primitives and the official [shadcn menu](https://ui.shadcn.com/docs/components/radix/dropdown-menu) and [dialog](https://ui.shadcn.com/docs/components/radix/dialog) patterns. `MarketChart` remains the lower-level API and legacy independent panes remain supported.

## Earnings and inspection

Pass an optional readonly `earnings` array of `TechnicalEarningsEvent` values. Each has `id` and `time`, with optional `label`, `session` (before-open, after-close, during-session or unknown), `estimated`, `reportedEps` and `estimatedEps`. For example:

```tsx
earnings={[
  { id: "q2", time: "2026-08-06", label: "Q2 earnings", session: "after-close", reportedEps: 1.38, estimatedEps: 1.30 },
  { id: "q3", time: "2026-11-05", label: "Q3 earnings", estimated: true },
]}
```

Historical dates appear as E pins at the foot of the price pane. Hover/focus reveals the date and session; click/Enter opens the earnings list and EPS details. The header Earnings button includes all supplied events, including upcoming announcements outside available candles. Date-only events align to the first candle on/after their UTC date; the tooltip preserves the actual announcement date. Supply an exact `barTime` for intraday/custom-session anchoring. Future dates are not projected onto invented trading sessions. No market data or earnings are fetched by this library.

O/H/L/C stays in a dedicated overlay below the pane legend, follows pointer and keyboard inspection, and returns to the latest bar when follow inspection ends. At every width each label stays inline and baseline-aligned with its value. Whole pairs wrap only when necessary, with a two-line height bound; very long display values ellipsize while titles and accessible labels retain exact supplied values. Existing `appearance.legends="compact"` controls compact display formatting, and `heightMode="available"`/`onGeometryChange` retain the public container budget without a private selector. The readout does not resize the Canvas or extend across a pane boundary; hosts should provide enough pane height for the readout. Legends follow inspection; filled axis badges retain latest series values and use a contrasting black/white foreground.

The daily preset uses taller RSI/stochastic panes, a single shaded threshold band, distinct purple RSI and blue/amber stochastic lines, and fixed-domain endpoint/threshold/midpoint ticks. Explicit technical panes use 2.5% price-range padding; the low-level engine retains its 8% default. Numeric axes choose round tick intervals.

Profiles default to 24 rows, 22% width and 85% opacity. The broader default price ranges produce taller, easier-to-scan bars while explicit `rows` or `ticksPerRow` settings remain unchanged. Blue up-volume abuts the right axis, amber down-volume extends inward, rows outside the value area are muted, and the red POC line spans the plot. Customize `upColor`, `downColor` and `pocColor` in each profile state. These are up/down bar-volume estimates when derived from OHLCV, not measured bid/ask volume.

## Supplied mode

See [SUPPLIED-RESULTS.md](../../../SUPPLIED-RESULTS.md) for the additive public API, producer mappings, styles and publication limitations. Pass calculationMode supplied and calculationIdentity to bypass all browser financial formulas. Default internal behavior remains supported.


Calendar geometry: pass timeAxis and discontinuities to align sparse/dense boards and preserve gap interiors. Use withMarketVisibleRange when linking inclusive bounds; reapply runtime calendar inputs after loading version-1 state. See [the full contract](../../../CALENDAR-COORDINATES.md).
# Research workspace runtime additions

See [REFINEMENT.md](../../../REFINEMENT.md) for the additive appearance/height, compact supplied-details callback, `chartApiRef`, drawing allowlist/commands/history, revisioned snapshot and origin metadata contracts. The forwarded ref remains a DOM ref; version-1 saved chart documents remain unchanged. Full authoritative snapshots are O(N); visible rendering is bounded and supplied mode performs no financial calculation.

