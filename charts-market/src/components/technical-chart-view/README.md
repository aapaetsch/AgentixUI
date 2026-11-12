# TechnicalChartView

Floating drawing editor: `drawingEditor?: MarketDrawingEditorOptions` forwards the public active-instance editor to MarketChart. `TechnicalChartViewChangeMetadata.drawing` retains exact-coordinate metadata on authored commits and undo/redo; `{type:'selection'}` remains transient. Keep account-session toolbar position outside saved drawing documents and supply statistics only for matching admitted context/geometry. See [DRAWING-EDITOR.md](../../../DRAWING-EDITOR.md) and packaged [INTERACTIONS.md](../../../INTERACTIONS.md). The nine **Market Charts / Drawing Editor** stories cover themes, 390/320 widths, axis modes, delayed echo, four instances and object-tree recovery.

Quiet compact Boards can opt into `appearance.suppliedStatus='host'` with their existing discoverable expanded evidence surface. It reserves no study-status/profile-summary/details chrome and does not alter data admission, warnings/results or the distinct chart loading/error props. Combine `studyReadout:'volume-only'` with references using `showPlotLabel:false, showAxisLabel:true, axisLabel:'Open'`. Expanded/default policies remain compatible. See [BOARD-INLINE-READOUT.md](../../../BOARD-INLINE-READOUT.md) and [PRICE-REFERENCES.md](../../../PRICE-REFERENCES.md) for ownership and exact API mapping.

For compact Boards with a shared checkbox color key, use `appearance.studyReadout='volume-only'`: only finite supplied bar volume appears, with exactly one lowercase `vol` caption. Zero remains zero; hidden/missing/nonfinite volume or no bars creates no readout or header band with an external title menu. All other legend groups disappear without changing selected series, points, axis badges or evidence. Expanded Boards retain `'inline'` and discoverable complete source evidence. Omitted-option full-chart behavior and warnings remain unchanged. See [BOARD-INLINE-READOUT.md](../../../BOARD-INLINE-READOUT.md).

For compact and expanded Board charts, `appearance.studyReadout='inline'` removes the Legend disclosure and group buttons, shows every visible numeric study output and a single lowercase `vol` caption, and measures natural wrapped height without an empty disclosure band. With an external host title menu, no readouts means zero header height. Internal/workspace controls keep their allocation. Exact supplied values/status/context remain accessible and the host must retain discoverable complete source evidence. Default full-chart legends are unchanged. See [BOARD-INLINE-READOUT.md](../../../BOARD-INLINE-READOUT.md).

`priceReferences?: readonly MarketPriceReference[]` adds supplied display-only dotted levels without reserving a study header or introducing drawing/hit targets. The consumer owns exact source/session selection and atomic data/reference admission. Use an empty array for missing evidence. Optional R-prefixed outlined axis values use shared collision placement; the full supplied label and exact price remain accessible. See [PRICE-REFERENCES.md](../../../PRICE-REFERENCES.md) for the typed API, filtering and lifecycle boundaries.

Default bar-volume values are labeled `Vol` in visible and complete legend mappings with the `Bar volume` title. The optional Board inline surface uses exactly `vol` and omits direction/color-only captions. Supplied numbers, formatting/null handling, direction-color meaning and My Charts defaults remain unchanged.

With `paneMenuTrigger="none"`, a standard-mode pane with no visible study/overlay/volume legend has no empty header reservation; the OHLC readout starts at its normal pane-top inset. The external controlled menu stays mounted and usable. Internal triggers and workspace reorder handles still reserve their real header, as do genuine legends (including unavailable supplied outputs). The complete header is observed as content appears, disappears or wraps, keeping canvas spacing and OHLC offsets consistent. No new prop or saved-state field is required. See **Market Charts / Empty Header** for external-title, dynamic study/volume, internal, workspace, dense, theme and narrow fixtures.

Available-height layout measures natural content and the live canvas-host allocation together. `onGeometryChange` may update host presentation state without requiring memoized appearance objects for correctness. Keep the available slot independent from intrinsic content allocation, and honor reported intrinsic overflow when pane requests exceed it. Stable dimensions do not clear/reallocate the canvas bitmap. Synthetic **Resize Feedback** stories exercise fractional compact slots with an active host geometry callback.

## Host title menu and line inspection

`appearance.suppliedDetails=false` removes compact “Supplied calculation details”
and the host Complete source evidence action. Omission preserves existing behavior, including
the fallback dialog. This option does not hide supplied status: missing identity,
unavailable/warning/rejected-result messages, including supplied profile reasons, and critical availability descriptions
remain visible. Request keys, accepted results and calculation semantics are
unchanged. Use `suppliedStatus:'compact'` for the condensed summary and supply
host-owned data/status actions separately when needed. Changing the option while
the fallback dialog is open closes it.

Use `useTechnicalPaneMenu()` in the host card and spread `getTriggerProps('price')`
onto a native ticker/company-title button. Pass its `paneMenu` and
`onPaneMenuChange` to TechnicalChartView with `paneMenuTrigger="none"` to omit the
inline symbol/chevron. This opens the same pane actions, with Escape/outside
dismissal and focus restored to the title. Direct controlled state is also public:
`TechnicalPaneMenuState = {paneId, anchor:{x,y}, returnFocus?}`; anchor coordinates
are viewport CSS pixels. `undefined` preserves internal menus; `null` closes a
controlled menu. Keep anchor coordinates current if the host moves while open.
The host owns optional background-card activation and must suppress nested controls,
portaled items, selected text, reorder/plot gestures and completed drags. Keep a
native visible title button for Enter/Space and preserve expand/details separately.

`allowLogScale={false}` disables the shared Log menu item, footer button/icon and
settings option without changing incoming host scale state. It is runtime policy,
outside version-1 documents and calculation keys.

For Board line charts opt into `appearance.crosshair.lineMarker={ {visible:true} }`.
Radius is 2..8 CSS px (default4), strokeWidth .5..4 (default2), with optional fill
and stroke colors/tokens. Defaults use primary fill and background outline. A
marker follows the rendered close stroke horizontally regardless of pointer Y;
it uses the actual manual/log/time geometry and never adds a price observation.
`MarketChartSnapshot.lineInspection` exposes display x/y, exact/interpolated source
and bracketing times; exact OHLC/study inspection remains separate. Explicit true
gaps, invalid samples, future whitespace and pointer leave/cancel/blur clear it.
Custom line renderers are excluded because their geometry may differ. See
**Market Charts / Board Card** for compact, expanded, theme and compatibility stories.

Opt in to separate-gutter price and all-study endpoint boxes with `appearance.badges.endpointValues='all-visible'`. Includes oscillator outputs, exact visible endpoints and per-pane collision/overflow semantics; defaults and host pane geometry remain intact. See [ENDPOINT-LABELS.md](../../../ENDPOINT-LABELS.md).

`appearance.badges.movingAverages='all-visible'` retains outlined boxes for every tagged visible moving-average price overlay. Values come from the exact last accepted visible bar; historic pan, missing/null samples, off-scale/log values, connectors and bounded overflow are documented in [MOVING-AVERAGE-LABELS.md](../../../MOVING-AVERAGE-LABELS.md). Defaults and host pane minimums remain unchanged.

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

# Readability follow-up

See [READABILITY.md](../../../READABILITY.md) for visible theme/override-matched study/VWAP/volume/profile legends, exact-time readouts, compact evidence, reference-aware automatic scales and integrated navigation slots. Existing version-1 state and supplied request identities remain unchanged. This local candidate requires separate publication/adoption approval.

# Adaptive candle and volume geometry

Set `appearance.candles` and `appearance.volume` to `{widthMode: 'adaptive', gap: 2}` for matching widths based on the current shared time-scale slots. Omission preserves legacy geometry. See [ADAPTIVE-WIDTHS.md](../../../ADAPTIVE-WIDTHS.md) for proportional precedence, dense zoom, DPI, validation and runtime examples. Appearance changes retain supplied identities, saved documents and shared drawing history.


Workspace interaction props and methods are documented in [INTERACTIONS.md](../../../INTERACTIONS.md). All are opt-in runtime geometry; retain supplied-only calculation and version-1 serialization boundaries.
# Timeline controls

`appearance.timeline` forwards the shared runtime `MarketTimelinePresentation`.
`{range:'auto',sessions,rightPaddingBars:10,scaleControls:'icons'}` enables
visible-span labels, supplied session starts, blank logical right space and
44px Auto/manual + linear/log targets beneath the actual88px price axis.
Read live snapshot scale state after native axis gestures; retain logicalRange
on controlled viewport echoes and use viewportCommand for external dates.
Missing sessions means first/last supplied observation per display day, not an
official market open. No provider, calendar inference or calculation changes.
See ../../../INTERACTIONS.md for exact typed examples/defaults/origins and
**Market Charts / Timeline Controls** for synthetic range/DST/sparse fixtures.



## Future annotation ruler

Pass an opt-in `timeAxis.futureDisplay` with
`{convention:'utc-calendar', intervalSeconds:86400, horizonMonths:12}` for a daily
calendar-time annotation ruler. The engine preserves known coordinates and exact
earnings instants, computes future ticks without a generated bar/session calendar,
and keeps economic bounds on accepted observations. Future OHLC/study/volume
readouts are unavailable; `snapshot.futureInspection` has a date/coordinates and
no financial bar. Empty future views retain the last accepted calculation/profile
range in controlled state while the engine snapshot reports no observations.

Trend/horizontal extension controls, bounded drawing edits, shared history and
keyboard priority are integrated through the public chart path. Keep logical
viewport echoes; use the existing explicit viewport command for new external date
intent. Default consumers remain unchanged without this opt-in. See the package
`INTERACTIONS.md` and `CALENDAR-COORDINATES.md` for types, examples, horizon/UTC
semantics and the separate product/private-persistence adoption gates.

# Compact supplied instrument header

Add `instrumentReadout` for the combined company/logo/period/exchange/OHLC row with
`vol` and named studies beneath. It is runtime presentation only. Optional source,
dataset-identity and accepted-revision bound `exactValues` preserve original
decimal strings without new calculations; missing, gap and future inspections
remain unavailable. Existing public pane-menu/host action APIs compose with it.
See the packaged [BOARD-INLINE-READOUT.md](../../../BOARD-INLINE-READOUT.md) for
types, admission rules, accessibility, metadata bounds and adoption mapping.

