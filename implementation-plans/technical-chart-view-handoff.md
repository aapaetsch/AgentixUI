# Handoff: Out-of-Box Technical Chart View

**Date:** 2026-09-10  
**Workspace:** `C:\Users\aapae\Documents\Projects\Aidans-React-UI`  
**Package:** `aapaetsch-charts-market` with supporting primitives from `aapaetsch-ui-kit` and `aapaetsch-charts`  
**Status:** Implementation-ready product and engineering brief  
**Source discussion:** Audit of the current chart packages against the supplied dark technical-analysis screenshot  
**Verification baseline:** `npm run test --workspace aapaetsch-charts-market` passes 13 files / 71 tests

This document is the source of truth for building a polished technical-chart surface that can
reproduce the supplied layout and interaction model out of the box. The result should feel as
complete and useful as a professional charting terminal while remaining recognizably part of
the Aapaetsch UI system. It must not copy TradingView branding, proprietary assets, exact icon
arrangements, wording, or pixel geometry.

---

## 0. Executive decision

Build a new composed `TechnicalChartView` on top of the existing `MarketChart` engine. Keep
`MarketChart` as the lower-level embeddable surface and extend its engine contracts only where
the target experience cannot be achieved cleanly through existing render layers.

The finished component must provide, without consumer-authored layout or Canvas code:

- a compact chart header and command surface;
- an optional vertical drawing rail;
- a main candlestick pane with overlay studies;
- a price-aligned visible-range volume profile anchored to the right side;
- independently resizable and groupable study panes;
- persistent pane legends and right-axis value badges;
- an optional bottom range/status bar;
- coherent pan, zoom, crosshair, inspection, scale, and pane interactions;
- light, dark, narrow, fullscreen, loading, empty, and error states;
- a single controlled state model suitable for Web and Electron consumers.

This is not a request for every TradingView indicator or every TradingView chart type. It is a
request for a complete chart-view composition and the rendering/layout capabilities needed to
faithfully create the supplied class of workspace.

---

## 1. Target experience

The reference view contains six coordinated regions:

1. **Application/title strip** — a compact title and window/workspace actions.
2. **Chart command bar** — symbol search, interval, series style, indicators, financial-data
   action, layout preset, chart settings, and contextual actions.
3. **Drawing rail** — vertically grouped pointer, line, measurement, shape, annotation, magnet,
   visibility, lock, and delete actions.
4. **Pane stack** — RSI pane, main price pane, MACD/volume pane, and stochastic pane sharing one
   time scale and crosshair.
5. **Price-axis analysis region** — last-price line/value, moving-average values, alert/order
   lines, event markers, and right-anchored volume-at-price bars.
6. **Range/status bar** — date-range shortcuts, jump/realtime affordances, timezone, scale mode,
   auto-scale state, and current time/status.

The out-of-box story should use this anatomy, but should not reproduce the source screenshot's
exact dimensions or control placement. A recommended Aapaetsch treatment is:

- slightly roomier `2rem` controls and fewer always-visible labels;
- grouped rail actions with separators and tooltips;
- semantic surface elevation instead of identical black/gray bands;
- branded typography, radii, focus rings, positive/negative colors, and motion tokens;
- icon and label choices from Lucide and the existing UI-kit vocabulary;
- responsive collapse into command menus on narrow viewports.

---

## 2. Current reusable foundation

The existing package is a strong base and should not be replaced.

| Capability | Current location | Reuse decision |
|---|---|---|
| Candlestick, OHLC, line, area, baseline rendering | `charts-market/src/engine/canvas-engine.ts` | Reuse and extend through a renderer registry |
| Pan, wheel/pinch zoom, crosshair, keyboard navigation | `charts-market/src/engine/canvas-engine.ts` | Reuse; add axis-specific interactions |
| Resizable synchronized panes | `charts-market/src/engine/pane-layout.ts` | Reuse; add explicit pane definitions and grouping |
| Indicator overlay and pane rendering | `charts-market/src/core/extensions.ts` | Evolve without breaking existing definitions |
| Controlled chart wrapper | `charts-market/src/components/market-chart/index.tsx` | Preserve as the low-level component |
| 37 drawing tools and object management | `charts-market/src/drawings/` | Reuse; add vertical-toolbar presentation |
| Alerts, orders, positions, executions, sessions | `charts-market/src/overlays/` | Reuse; improve axis badges and hit targets |
| Multi-chart layouts and persistence | `charts-market/src/workspace/` | Reuse; add maximize and composed-view support |
| Standalone volume-profile visualization | `charts/src/components/volume-profile/` | Reuse data vocabulary only; do not embed Recharts over Canvas |
| UI controls, menus, tooltips, sheets, command palette | `src/components/` | Compose into chart chrome |

The existing `MarketRenderLayer` contract proves that custom Canvas content can be added. The
out-of-box target nevertheless requires first-party implementations so every consumer does not
have to solve scale alignment, clipping, hit testing, accessibility, and persistence separately.

---

## 3. Confirmed gaps

### 3.1 Price-aligned volume profile

The standalone `aapaetsch-charts` `VolumeProfile` is a separate categorical Recharts chart. It
does not share the market engine's price scale, visible time range, crosshair, clipping, or right
offset. A first-party market-engine volume-profile layer is required.

### 3.2 Reserved right-side analysis space

The current logical time scale draws the latest bar against the chart's right plotting edge.
The target needs a controlled future/right offset so volume-profile bars, labels, and projected
drawings can occupy chart space without obscuring the latest candles.

### 3.3 Explicit pane model and grouping

Today each pane indicator is effectively assigned its own pane and volume uses a dedicated
`volume` pane. The target requires:

- multiple studies in one pane;
- volume bars composited with another study when requested;
- pane ordering, visibility, height, minimum height, and collapse state;
- per-pane scale side and formatting;
- drag-to-reorder or menu-based movement between panes.

### 3.4 Persistent legends and axis badges

The current indicator legend appears as a transient crosshair overlay. The target requires a
persistent status line in every pane, current/crosshair values, study visibility/settings/remove
actions, last-value badges, collision handling, and accessible non-color identification.

### 3.5 Complete chart chrome

The current controls are intentionally basic native inputs. A composed professional view needs
symbol search, interval search/favorites, indicator browser, series menu, settings, layout,
fullscreen/maximize, screenshot/export intent, and responsive overflow behavior.

### 3.6 Axis and viewport interaction

The current engine covers horizontal pan and time zoom. Add:

- price-axis drag scaling;
- price-axis pan/manual range;
- time-axis drag zoom;
- double-click axis reset;
- explicit auto-scale toggle and state;
- right-offset drag/reset;
- go-to-date and range shortcuts;
- persistent inspection/crosshair mode.

### 3.7 Turnkey composition and visual regression story

No current story assembles the full pane stack, drawing rail, volume profile, header, and footer.
The repository therefore cannot presently demonstrate or regression-test the desired experience.

---

## 4. Proposed public component

Add `charts-market/src/components/technical-chart-view/` containing:

1. `index.tsx` — composed public component.
2. `technical-chart-view.stories.tsx` — complete Storybook coverage.
3. `technical-chart-view.test.tsx` — controlled intent and accessibility tests.
4. `agents.md` — component-specific maintenance context.
5. `README.md` — consumer documentation and examples.

Export it from the package root as `TechnicalChartView`. Do not remove or rename `MarketChart`.

Recommended initial API shape:

```tsx
export interface TechnicalChartViewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  symbol: string;
  interval: string;
  data: readonly OhlcBar[];
  state: TechnicalChartViewState;
  onStateChange: (
    next: TechnicalChartViewState,
    metadata: TechnicalChartViewChangeMetadata,
  ) => void;
  symbolSearch?: TechnicalSymbolSearchAdapter;
  intervalOptions?: TechnicalIntervalOption[];
  availableIndicators?: IndicatorDefinition[];
  dataAvailability?: MarketDataAvailability;
  appearance?: Partial<TechnicalChartAppearance>;
  features?: Partial<TechnicalChartFeatures>;
  loading?: boolean;
  error?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  onRequestFullscreen?: () => void;
  onRequestExport?: (request: ChartExportRequest) => void;
  onRequestFinancials?: () => void;
}
```

Use one controlled, serializable state value so chart settings do not become dozens of loosely
coordinated props:

```ts
export interface TechnicalChartViewState {
  version: 1;
  chartType: MarketChartType;
  scale: MarketScaleOptions;
  viewport: MarketViewportOptions;
  panes: TechnicalPaneState[];
  indicators: IndicatorInstanceState[];
  profiles: VolumeProfileState[];
  drawings: DrawingState[];
  overlays: ChartOverlayState[];
  selectedDrawingIds: string[];
  activeDrawingTool?: string;
  chrome: TechnicalChartChromeState;
}
```

`onStateChange` metadata must identify granular intents such as `viewport`, `pane-resize`,
`pane-reorder`, `indicator-add`, `profile-settings`, `drawing`, `scale`, and `chrome`. Consumers
need this for persistence, analytics, undo domains, and synchronized workspaces.

Provide a state reducer/helper package so a consumer can adopt the component without writing a
large switch statement:

```ts
const [state, dispatch] = React.useReducer(
  technicalChartViewReducer,
  createTechnicalChartViewState("daily-analysis"),
);

<TechnicalChartView
  symbol="ENS"
  interval="1D"
  data={bars}
  state={state}
  onStateChange={(next) => dispatch({ type: "replace", state: next })}
/>
```

---

## 5. Engine and data-contract work

### 5.1 Renderer registry

Move the hard-coded chart-type branch toward a `MarketSeriesRendererDefinition` registry while
preserving the five existing string values and rendering behavior. This is the seam needed for
future chart types, but implementing every TradingView type is not part of this handoff.

### 5.2 Pane definitions

Add explicit pane state independent of indicator IDs:

```ts
export interface TechnicalPaneState {
  id: string;
  order: number;
  size: number;
  minimumSize?: number;
  collapsed?: boolean;
  scaleSide?: "left" | "right";
  scaleMode?: MarketScaleMode;
  precision?: number;
  studyIds: string[];
  showVolume?: boolean;
}
```

Maintain a compatibility adapter that maps legacy `paneSizes` and indicator placement into the
new pane model. Old consumers must continue to compile and render.

### 5.3 Right offset

Add `rightOffsetBars`, `minimumRightOffsetBars`, and `maximumRightOffsetBars` to viewport state.
Coordinate conversion, visible-range callbacks, hit testing, drawings, crosshair, and time-axis
labels must all use the same adjusted plotting geometry. `fitContent()` must respect the active
offset rather than silently clearing it.

### 5.4 Volume-at-price input

Support two explicit data paths:

```ts
export type VolumeProfileSource =
  | { kind: "derive-from-bars"; bars: readonly OhlcBar[] }
  | { kind: "levels"; levels: readonly VolumeProfileLevel[] };

export interface VolumeProfileLevel {
  priceFrom: number;
  priceTo: number;
  upVolume: number;
  downVolume: number;
}
```

The derived mode is a convenience approximation based on supplied bars and must be labeled as
such. The levels mode is the accurate route for consumers with lower-timeframe or trade-level
volume-at-price data. Never label up/down estimates as bid/ask volume.

### 5.5 Volume-profile state

```ts
export interface VolumeProfileState {
  id: string;
  visible: boolean;
  range: "visible" | "session" | "fixed";
  rows: number | { ticksPerRow: number };
  widthPercent: number;
  placement: "right" | "left";
  valueAreaPercent: number;
  showPoc: boolean;
  showValueArea: boolean;
  splitVolume: boolean;
  opacity?: number;
}
```

The built-in renderer must calculate and expose POC, VAH, VAL, total volume, row boundaries,
and source provenance. Calculations belong in pure functions with fixtures and must not occur
inside React render.

### 5.6 Layer clipping and interaction

Extend render-layer context with explicit plot, pane, axis, and reserved-region bounds. The
volume profile must clip to the price pane, map through the price scale, and expose hit results
for row inspection. It must not prevent candle/drawing interaction outside its own bars.

---

## 6. Out-of-box composition requirements

### Header/command bar

- Symbol search trigger with current symbol and optional exchange metadata.
- Searchable interval picker with consumer-defined options, favorites, and recent values.
- Series-style picker.
- Searchable indicator browser trigger.
- Financial-data intent button, hidden when no callback is supplied.
- Layout/maximize, export, and settings menus.
- Keyboard command integration and responsive overflow menu.

### Vertical drawing rail

- Add `orientation="vertical" | "horizontal"` to `DrawingToolbar`.
- Show configurable favorite tools directly and place the full catalog in a searchable menu.
- Preserve all existing drawing selection, snapping, history, locking, and accessibility behavior.
- On narrow screens, collapse the rail to a floating drawing-tools trigger.

### Pane header/legend

Each pane must have an overlay header that does not consume plot height or shift the Canvas:

- pane/study title and parameters;
- live or crosshair values;
- visible/hidden state;
- settings, move, collapse, and remove actions;
- optional drag handle for reordering;
- accessible text equivalent for every colored series value.

### Axis badges

- Last price and each configured study's latest value.
- Collision avoidance with deterministic priority.
- Matching line/badge colors plus text labels or accessible names.
- Optional countdown supplied by the consumer; the library does not infer market clocks.
- Price, percent, indexed, and log formatting consistent with scale mode.

### Footer

- Consumer-defined range shortcuts.
- Go-to-date, fit-content, and realtime actions.
- Timezone label and menu intent.
- Auto/log/percent/indexed scale controls.
- Optional status and clock slots; no package-owned timer unless explicitly enabled.

### Fullscreen and maximize

`TechnicalChartView` should support a CSS-contained expanded state. Browser fullscreen must be
an emitted intent or an opt-in adapter so Electron and embedded consumers retain control.

---

## 7. Reference Storybook fixture

Create a flagship story named `CompleteTechnicalAnalysis` that proves the component works as a
single import and a single controlled state object.

The fixture should contain:

- dark theme and approximately 150–250 daily OHLCV bars;
- top RSI pane with 30/70 band and value badge;
- main candlestick pane with four moving averages;
- current-price line, symbol status, and three event markers;
- visible-range volume profile on the right with POC and value-area styling;
- MACD and volume sharing one pane;
- stochastic pane with 20/80 band;
- vertical drawing rail with several favorites;
- bottom range/status bar;
- enough right offset to keep the profile distinct from recent candles;
- no copied symbol values, dates, labels, colors, or exact geometry from the source screenshot.

The story must be driven by deterministic fixture data checked into the repository. It must not
fetch market data or rely on a logged-in service.

Also add:

- `Light`
- `NarrowResponsive`
- `FullscreenContained`
- `Loading`
- `Empty`
- `Error`
- `KeyboardNavigation`
- `AccurateProfileLevels`
- `ApproximateProfileFromBars`
- `ReducedMotion`

---

## 8. Accessibility contract

- The Canvas keeps a concise accessible name and description of active symbol, interval, chart
  type, range, and pane count.
- The existing data-table alternative must include active pane-study values and profile summary
  data without creating an unbounded table by default.
- Every toolbar action must have an accessible name, tooltip, visible focus state, and keyboard
  activation.
- Pane separators must expose `role="separator"`, orientation, current value, bounds, and arrow
  key resizing.
- Crosshair inspection must be keyboard reachable and announce values only on deliberate moves;
  it must not flood live regions during pointer movement or streaming updates.
- Positive/negative, selected/unselected, and profile up/down states must never rely on color alone.
- The entire experience must remain usable at 200% zoom and at a `20rem` viewport width.
- Respect reduced motion and high-contrast/forced-color modes.

---

## 9. Performance contract

- Preserve visible-window rendering and requestAnimationFrame scheduling.
- Recompute visible-range profiles only when data, profile settings, or the settled visible range
  changes; do not recalculate on every crosshair move.
- During continuous pan/zoom, use a cached or coarsened preview and finalize after the gesture.
- Keep pane headers in React but avoid React state updates for every pointer pixel.
- Maintain the existing 100,000-bar baseline.
- Target 60 fps interaction on a contemporary desktop with four panes, five overlay lines, a
  100-row profile, and 100 drawings.
- Add a stress story and a browser performance smoke test; document the test hardware and trace.

---

## 10. Implementation phases

### Phase 1 — State and geometry foundation

- Introduce versioned `TechnicalChartViewState` and reducer helpers.
- Add explicit pane definitions and legacy adapters.
- Add right-offset geometry and scale snapshots.
- Expose plot/axis/reserved bounds to render layers.
- Add unit tests before composing UI.

**Exit:** Existing `MarketChart` stories remain visually stable; new pane/right-offset geometry
has deterministic unit coverage.

### Phase 2 — Integrated volume profile

- Add pure binning/value-area calculations and provenance.
- Add visible, session, and fixed-range profile modes.
- Add Canvas renderer, settings UI, hit testing, accessible summary, and profile fixtures.
- Add approximate and accurate source paths.

**Exit:** A profile remains price-aligned through resize, pan, zoom, log/percent scale changes,
pane resize, and right-offset changes.

### Phase 3 — Pane composition and legends

- Support grouped studies and volume-in-pane.
- Add overlay pane headers, axis badges, collision handling, collapse, move, and reorder.
- Add persistent inspection mode and per-pane formatting.

**Exit:** RSI / price / MACD+volume / stochastic arrangement can be configured entirely through
public state without a consumer-authored render layer.

### Phase 4 — Professional chart chrome

- Implement `TechnicalChartView` using existing UI-kit primitives.
- Add vertical drawing-toolbar orientation.
- Add command bar, responsive overflow, settings surfaces, range/status footer, contained
  maximize, and export/fullscreen intents.
- Integrate command-palette actions and keyboard shortcuts.

**Exit:** The complete reference story is functional at desktop and narrow breakpoints.

### Phase 5 — Verification and release readiness

- Add interaction, accessibility, migration, and performance tests.
- Add screenshot baselines for light/dark/narrow/complete stories.
- Run typecheck, package tests, root build, static Storybook build, and real-browser smoke.
- Update component docs, package README, roadmap status/counts, and changelog.
- Run the required independent Dev Runner verification after implementation.

**Exit:** Every acceptance criterion below passes with evidence recorded in the implementation
PR or completion handoff.

---

## 11. Acceptance criteria

### Functional fidelity

- [ ] One exported `TechnicalChartView` produces the full chart workspace without consumer JSX
      for rails, pane headers, axes, footer, or volume profile.
- [ ] Four-pane RSI / price / MACD+volume / stochastic layout renders and resizes correctly.
- [ ] All panes share one time scale and one synchronized crosshair.
- [ ] The visible-range profile is aligned to the price scale and updates after settled pan/zoom.
- [ ] POC, VAH, and VAL calculations match checked-in fixtures.
- [ ] The latest candles remain readable beside the volume profile using reserved right offset.
- [ ] Overlay studies, price lines, markers, drawings, and profile render with deterministic
      z-order and clipping.
- [ ] Pane legends and right-axis badges show latest and inspected values without layout shift.
- [ ] Mouse, trackpad, touch, and keyboard paths cover pan, zoom, inspect, resize, draw, and reset.
- [ ] State round-trips through versioned serialization with no loss of extension data.

### Visual quality

- [ ] The result has the information density and hierarchy of a professional charting terminal.
- [ ] It uses Aapaetsch tokens, spacing, radii, typography, icons, focus, and motion.
- [ ] It does not use TradingView names, logos, watermarks, proprietary icons, copied wording,
      exact colors, or pixel-for-pixel geometry.
- [ ] Light and dark modes both meet contrast requirements.
- [ ] Narrow mode preserves all actions through progressive disclosure.
- [ ] No toolbar, legend, badge, or drawing interaction changes Canvas geometry unexpectedly.

### Quality gates

- [ ] Strict TypeScript and declaration build pass.
- [ ] Existing 71 market-chart tests remain green, with new tests added for all new contracts.
- [ ] Root build and static Storybook build pass.
- [ ] Automated accessibility checks pass on the flagship story.
- [ ] Real-browser smoke covers Chrome/Chromium pointer and keyboard interaction.
- [ ] Performance targets are met or deviations are documented and approved.
- [ ] Dev Runner independently verifies build and Storybook before completion.

---

## 12. Explicit non-goals

- Pixel-for-pixel reproduction of the supplied screenshot.
- TradingView branding, terminology, proprietary icons, or source-code compatibility.
- Every TradingView chart type or indicator.
- Market-data fetching, entitlements, exchange normalization, or lower-timeframe acquisition.
- Broker execution, alert evaluation, or package-owned persistence.
- Claims that bar-derived volume profile represents true bid/ask activity.
- Automatic technical-pattern recognition.

---

## 13. Expected file changes

Likely additions:

```text
charts-market/src/components/technical-chart-view/
charts-market/src/components/volume-profile-layer/
charts-market/src/components/pane-header/
charts-market/src/components/chart-axis-badges/
charts-market/src/core/technical-chart-state.ts
charts-market/src/engine/volume-profile.ts
charts-market/src/engine/series-renderers.ts
```

Likely modifications:

```text
charts-market/src/core/types.ts
charts-market/src/core/extensions.ts
charts-market/src/core/engine.ts
charts-market/src/engine/canvas-engine.ts
charts-market/src/engine/time-scale.ts
charts-market/src/engine/pane-layout.ts
charts-market/src/components/market-chart/index.tsx
charts-market/src/drawings/drawing-layer.tsx
charts-market/src/workspace/index.tsx
charts-market/src/index.ts
charts-market/README.md
docs/roadmap/charts-market.md
docs/roadmap/changelog.md
```

Every new component folder must include source, Storybook stories, `agents.md`, and `README.md`
according to repository policy.

---

## 14. Open product decisions

Resolve these before Phase 4; Phases 1–3 can proceed with defaults:

1. Should the default desktop rail be always visible or user-collapsible?
2. Should `TechnicalChartView` own a contained maximize state, or remain fully controlled?
3. Which actions remain visible at widths below `48rem` versus moving into overflow?
4. Should the default profile use total/up-down stacking or opposing left/right bars?
5. Should the package ship a consumer-neutral clock/status implementation or only slots?
6. Should indicator configuration use a popover on desktop and a sheet on narrow screens?

Recommended defaults: collapsible rail, controlled maximize, compact overflow below `48rem`,
stacked up/down profile, status slots rather than a package clock, and responsive popover/sheet.

---

## 15. Reviewer checklist

- [ ] Confirm the component boundary: composed `TechnicalChartView`, preserved low-level
      `MarketChart`.
- [ ] Confirm accurate and approximate volume-profile inputs are visibly distinguished.
- [ ] Confirm grouped-pane state is generic and does not hard-code RSI/MACD/stochastic.
- [ ] Confirm right offset is part of viewport geometry, not a CSS overlay workaround.
- [ ] Confirm all new state is serializable and migrated.
- [ ] Confirm chart chrome is original and token-driven.
- [ ] Confirm no data fetching, broker action, or persistence leaked into the package.
- [ ] Confirm the flagship story is truly one public component rather than bespoke story layout.
- [ ] Confirm build, Storybook, accessibility, performance, and browser evidence before marking
      the roadmap complete.

---

End of handoff. Completion means a consumer can install `aapaetsch-charts-market`, supply OHLCV
and controlled state, and immediately render a cohesive professional technical-analysis view of
the same functional class as the supplied reference—without writing custom pane layout,
chart chrome, axis labels, or Canvas volume-profile code, and without copying another product's
visual identity.
