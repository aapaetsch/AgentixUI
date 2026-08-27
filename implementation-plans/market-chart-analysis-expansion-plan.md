# Market Charting Expansion — Implementation Plan

## Goal

Expand `@agentix/charts-market` toward the high-value chart-analysis capabilities
users expect from TradingView while preserving the package's current strengths:

1. A first-party Canvas 2D + SVG renderer with no runtime chart-engine dependency.
2. Renderer-neutral, serializable public contracts.
3. Controlled React components whose consumers own data, persistence, alerts, and
   order execution.
4. Incremental streaming performance and accessible non-visual alternatives.

This plan covers four coordinated workstreams:

1. Chart types.
2. Indicators.
3. Drawing tools.
4. Chart analysis workflows.

The target is not literal feature-count parity. The target is a coherent,
extensible analysis surface that delivers the most useful 20% of capabilities
before pursuing long-tail tools.

## Current Baseline

The package currently provides:

- Five price-series modes: candlestick, OHLC bar, line, area, and baseline.
- Seven built-in indicators: SMA, EMA, VWAP, Bollinger Bands, RSI, MACD, and ATR.
- Four drawing tools: horizontal line, vertical line, trend line, and rectangle.
- Volume and indicator panes, crosshair, pan/zoom, four price-scale modes,
  extended-session shading, markers, overlays, and streaming updates.
- Serializable one-to-eight chart workspaces with symbol, interval, visible-range,
  and crosshair synchronization.
- Extension contracts for indicators, drawings, overlays, and custom Canvas layers.

## Scope Boundaries

### In Scope

1. Deterministic client-side transformations of consumer-supplied market data.
2. Built-in renderers, indicators, drawings, comparison tools, measurement tools,
   templates, and analysis-oriented workspace behavior.
3. Stable extension APIs for consumers to add proprietary calculations and tools.
4. Storybook, unit, integration, accessibility, performance, and migration coverage.

### Out of Scope

1. Market-data acquisition, symbol entitlements, and exchange normalization.
2. Cloud persistence, collaboration, social publishing, and public script hosting.
3. Server-side alert evaluation and notification delivery.
4. Broker connections, live execution, and paper-trading account simulation.
5. A Pine-compatible scripting language or in-browser code editor.

Consumers may build those services on top of the contracts introduced here.

## Architectural Decisions

### 1. Separate source data, transformed data, and rendering

The current `MarketChartType` switch directly renders `OhlcBar[]`. That remains
appropriate for classic charts but cannot safely represent every advanced chart.

Introduce three layers:

```text
consumer data -> optional deterministic transform -> display series -> renderer
```

- Classic and cosmetic variants consume OHLC data directly.
- Heikin Ashi and price-based charts use pure, testable transforms.
- Microstructure charts use explicit enriched data contracts instead of adding many
  unrelated optional fields to `OhlcBar`.
- Renderers never fetch or aggregate remote data.

### 2. Replace growing switches with registries

Add registries for series renderers and drawing renderers. Built-ins register through
the same public contracts available to consumers. Preserve the current string unions
as compatibility aliases during the transition.

### 3. Keep saved state declarative

Definitions contain executable behavior; workspace state contains only definition
IDs, versions, parameters, and data-independent instance state. Migrations must retain
unknown extension payloads.

### 4. Preserve controlled ownership

The package may provide optional local convenience hooks, but `MarketChart` continues
to accept controlled indicators, drawings, comparison series, templates, and analysis
settings with intent callbacks.

## Shared Foundation — Phase 0

Complete this phase before advanced chart types or drawings. It should ship as small,
independently reviewable pull requests.

### 0.1 Series and renderer contracts

Add renderer-neutral contracts under `charts-market/src/core/`:

```typescript
export type MarketSeriesKind =
  | "ohlc"
  | "value"
  | "range"
  | "point-and-figure"
  | "market-profile"
  | "footprint";

export interface MarketDisplaySeries<TDatum = unknown> {
  id: string;
  symbol?: string;
  kind: MarketSeriesKind;
  data: readonly TDatum[];
  priceScaleId?: string;
  visible?: boolean;
  color?: string;
}

export interface MarketSeriesRendererDefinition<TDatum = unknown> {
  id: string;
  version: number;
  label: string;
  dataKind: MarketSeriesKind;
  domain(data: readonly TDatum[]): readonly number[];
  draw(context: MarketSeriesRenderContext<TDatum>): void;
  crosshairValues?(datum: TDatum): Record<string, number | null>;
}
```

Implementation requirements:

1. Add a built-in renderer registry and optional consumer renderers.
2. Route existing five chart modes through registry adapters without visual changes.
3. Keep `chartType`, `setChartType()`, and existing `MarketChartProps` working.
4. Add development-time validation for renderer/data-kind mismatches.
5. Do not expose `CanvasRenderingContext2D` in serializable state.

### 0.2 Transform contracts

```typescript
export interface MarketSeriesTransform<TInput, TOutput, TParameters> {
  id: string;
  version: number;
  defaultParameters: TParameters;
  transform(data: readonly TInput[], parameters: TParameters): TOutput[];
  createRuntime?(parameters: TParameters): MarketSeriesTransformRuntime<TInput, TOutput>;
}
```

Requirements:

1. Batch and incremental results must match for the same data.
2. Replacing the current bar may rebuild only the smallest safe tail.
3. Transforms must be pure with deterministic output and no browser dependency.
4. Output points retain source-time provenance where a one-to-one timestamp no longer
   exists.

### 0.3 Richer render primitives

Expand `IndicatorRenderSeries.style` and the shared renderer primitives to support:

- `line`
- `stepLine`
- `histogram`
- `area`
- `band`
- `cloud`
- `markers`
- `columns`

Add fill, opacity, line width/style, marker shape, and positive/negative color metadata.
Avoid indicator-specific conditionals in `canvas-engine.ts`.

### 0.4 Analysis state migration

Create workspace state version 3 with:

- Primary and comparison-series settings.
- Renderer definition ID and version.
- Transform definition ID and parameters.
- Indicator templates and chart visual settings.
- Drawing groups, z-order, and tool metadata.
- Analysis-mode settings such as normalization and comparison scale placement.

Provide sequential `v1 -> v2 -> v3` migrations and preserve unknown extensions.

### Phase 0 Exit Criteria

1. Existing stories render without intentional visual differences.
2. Existing serialized v1 and v2 workspaces migrate successfully.
3. Built-in and consumer-defined renderers coexist.
4. Batch and streaming transform contract tests pass.
5. The 100,000-bar performance gate does not regress by more than 10%.

---

## Workstream A — Chart Types

### Objective

Grow from five chart modes to a focused set of classic, derived-price, and
microstructure charts without forcing incompatible data into `OhlcBar`.

### A1. Classic and cosmetic variants — Priority P0

Implement first because they reuse the current logical-time and price-scale engine.

1. Line with markers.
2. Step line.
3. HLC area.
4. Hollow candles.
5. Volume candles.
6. High-low bars.
7. Columns.

Required supporting settings:

- Up/down/wick/border colors.
- Previous-close versus open/close color basis.
- Bar thickness and candle body width.
- Line interpolation, width, style, and marker visibility.
- Area gradient/fill opacity and baseline configuration.

Do not add each setting directly to `MarketChartProps`. Introduce a serializable
`seriesOptions` object keyed by renderer ID.

### A2. Derived OHLC variants — Priority P0

Implement Heikin Ashi through the transform contract.

Acceptance requirements:

1. Batch and streaming outputs are identical.
2. The transformed crosshair exposes both displayed OHLC and source OHLC.
3. Export and data-table views label transformed values clearly.
4. Indicators explicitly choose source OHLC or displayed OHLC; default to source data
   to prevent an unnoticed behavioral change.

### A3. Price-based chart types — Priority P1

Implement in this order:

1. Range bars.
2. Renko.
3. Line break.
4. Kagi.
5. Point and Figure.

These transforms require explicit parameters and provenance:

- Fixed amount, percentage, ATR, or tick-size box/reversal sizing where applicable.
- Source interval disclosure.
- Synthetic-bar flag and source-time range.
- Rebuild rules when the live source bar changes.

Do not imply that synthetic bars contain executable prices. Add an accessible notice
and metadata flag for consumers that place trading controls beside the chart.

### A4. Microstructure chart types — Priority P2

Add explicit data types before renderers:

```typescript
interface FootprintBar {
  time: MarketTime;
  open: number;
  high: number;
  low: number;
  close: number;
  levels: Array<{ price: number; bidVolume: number; askVolume: number }>;
}

interface MarketProfileBucket {
  sessionId: string;
  price: number;
  volume?: number;
  timePriceOpportunities?: number;
}
```

Then implement:

1. Session volume profile chart.
2. TPO/market profile chart.
3. Volume footprint candles.

Consumers remain responsible for providing exchange-appropriate trade classification,
session boundaries, tick sizes, and volume-at-price data.

### A5. Chart-type controls and documentation

1. Replace the flat native chart-type select with grouped options while retaining a
   compact controlled API.
2. Disable types whose required data kind is unavailable and explain why.
3. Add favorites/recent types only as controlled preference props.
4. Document transform assumptions, especially for synthetic price-based charts.

### Chart-Type Deliverables

- Core series, renderer, transform, and microstructure data contracts.
- Built-in renderer modules under `charts-market/src/series/`.
- Pure transforms under `charts-market/src/transforms/`.
- Updated controls, exports, README, `agents.md`, Storybook, tests, and roadmap.

### Chart-Type Test Gates

1. Golden geometry tests for every renderer.
2. Fixture tests for every transform and parameter mode.
3. Batch/incremental parity tests.
4. Gapped-session, zero-volume, sparse, negative-price, and live-bar replacement cases.
5. Visual stories at narrow/wide widths, light/dark themes, and high DPR.
6. Data-table and current-bar accessibility coverage for transformed charts.

---

## Workstream B — Indicators

### Objective

Expand the built-in catalog while improving the definition system enough to support
bands, clouds, markers, input schemas, templates, and multi-timeframe inputs.

### B1. Indicator contract v2 — Priority P0

Extend `IndicatorDefinition` with additive optional fields:

```typescript
interface IndicatorParameterDefinition {
  id: string;
  label: string;
  type: "number" | "boolean" | "select" | "source" | "timeframe";
  minimum?: number;
  maximum?: number;
  step?: number;
  options?: Array<{ label: string; value: string }>;
}

interface IndicatorDefinitionV2<TParameters> {
  // Existing fields remain.
  category?: "trend" | "momentum" | "volatility" | "volume" | "breadth" | "custom";
  description?: string;
  parametersSchema?: IndicatorParameterDefinition[];
  warmupBars?: (parameters: TParameters) => number;
  requiredInputs?: Array<"open" | "high" | "low" | "close" | "volume">;
  precision?: number;
}
```

Requirements:

1. Generate settings controls from the parameter schema instead of assuming every
   parameter is a numeric input.
2. Validate parameters before calculation and return structured errors.
3. Preserve the existing definition shape for consumers that do not use v2 fields.
4. Make source field (`open`, `high`, `low`, `close`, `hl2`, `hlc3`, `ohlc4`) a shared
   primitive rather than reimplementing it in each indicator.

### B2. Foundational math and high-value catalog — Priority P0

Implement shared rolling helpers first, then indicators in small groups.

#### Trend

- RMA/SMMA.
- WMA.
- Hull Moving Average.
- Donchian Channels.
- Keltner Channels.
- Supertrend.
- Parabolic SAR.
- Ichimoku Cloud.

#### Momentum

- Stochastic.
- Stochastic RSI.
- ADX with +DI/-DI.
- CCI.
- Rate of Change.
- Williams %R.
- Momentum.

#### Volume

- OBV.
- MFI.
- Accumulation/Distribution.
- Chaikin Money Flow.
- Volume oscillator.
- Anchored/session VWAP variants after session primitives exist.

#### Volatility

- Standard deviation.
- Historical volatility.
- Average true-range percentage.
- Choppiness Index.

Each indicator must provide batch calculation, incremental runtime where technically
valid, parameter validation, output formatting, and reference values or fixtures.

### B3. Indicator browser and settings — Priority P1

Replace the inline list with composed controls:

1. Searchable indicator browser with categories and favorites.
2. Dedicated settings popover/dialog generated from schema.
3. Visibility, duplicate, remove, reset, move-to-pane, and reorder actions.
4. Per-output color, line style, width, and visibility.
5. Pane height, scale side, precision, and label controls.

All preference state remains controlled or stored in workspace state.

### B4. Indicator templates — Priority P1

Add pure helpers and UI intent for:

- Save current indicators as a named template.
- Apply a template to one chart.
- Apply indicators to all charts.
- Replace versus merge behavior.
- Export/import template JSON with version validation.

Drawing state must not be included in indicator templates.

### B5. Multi-timeframe inputs — Priority P2

Introduce a consumer-supplied resolution provider rather than hidden fetching:

```typescript
interface MarketResolutionProvider {
  getSeries(request: {
    symbol: string;
    interval: string;
    visibleRange?: VisibleRange;
  }): readonly OhlcBar[] | Promise<readonly OhlcBar[]>;
}
```

Requirements:

1. Consumers may alternatively pass preloaded series directly.
2. Define lookahead and incomplete-higher-timeframe-bar behavior explicitly.
3. Cache ownership and cancellation remain consumer-configurable.
4. SSR renders a stable placeholder until required input series are available.

### Indicator Deliverables

- Contract-v2 parameter and output-style types.
- Shared rolling/source/session math helpers.
- Built-in indicator groups and incremental runtimes.
- Indicator browser, settings, templates, and workspace persistence.
- Updated exports, docs, stories, tests, and roadmap.

### Indicator Test Gates

1. Reference fixtures with documented seeding conventions.
2. Batch/incremental equality including replacement of the latest bar.
3. Property tests for bounded indicators and band ordering.
4. Missing/zero volume, flat markets, short warmup, gaps, and invalid parameters.
5. 100,000 bars with 20 visible indicators within the agreed performance budget.
6. Keyboard and screen-reader coverage for the browser and settings UI.

---

## Workstream C — Drawing Tools

### Objective

Replace the current fixed-point/path switch with an extensible drawing runtime, then
ship the technical-analysis, measurement, and annotation tools with the highest value.

### C1. Drawing contract v2 — Priority P0

The existing `requiredPoints` number is insufficient for freehand, polyline, rays,
derived geometry, and text tools. Extend definitions additively:

```typescript
interface DrawingToolDefinitionV2<TParameters> {
  // Existing fields remain for compatibility.
  category?: "trend" | "fibonacci" | "pattern" | "measure" | "shape" | "annotation" | "volume";
  input?:
    | { mode: "fixed"; points: number }
    | { mode: "variable"; minimumPoints: number; maximumPoints?: number }
    | { mode: "freehand" };
  rendererId?: string;
  parametersSchema?: DrawingParameterDefinition[];
}

type DrawingPrimitive =
  | { kind: "line"; from: DrawingPoint; to: DrawingPoint }
  | { kind: "ray"; from: DrawingPoint; through: DrawingPoint }
  | { kind: "polyline"; points: DrawingPoint[]; closed?: boolean }
  | { kind: "ellipse"; bounds: DrawingBounds }
  | { kind: "text"; anchor: DrawingPoint; text: string };

interface DrawingRendererDefinition {
  id: string;
  version: number;
  geometry(context: DrawingGeometryContext): DrawingPrimitive[];
  hitTest(context: DrawingHitTestContext): DrawingHitResult | null;
  handles?(context: DrawingGeometryContext): DrawingHandle[];
  derivedValues?(drawing: DrawingState): Record<string, string | number>;
}
```

Implementation requirements:

1. Keep drawing state and geometry contracts serializable, renderer-neutral, and free
   of React types. The SVG layer converts `DrawingPrimitive` values to elements.
2. Route existing four tools through renderer definitions before adding new tools.
3. Support body dragging, point dragging, insertion/removal of variable points, z-order,
   duplicate, group, and multi-select.
4. Separate selection bounds from visible geometry so thin lines remain usable.
5. Add keyboard move/delete, Escape-to-cancel, and focus-visible handles.

### C2. High-value trend and measurement tools — Priority P0

Implement in this order:

1. Ray and extended line.
2. Horizontal ray and cross line.
3. Parallel channel.
4. Price range.
5. Date range.
6. Date-and-price range.
7. Long position and short position tools.
8. Fibonacci retracement.

Measurements must expose calculated values as visible labels and accessible text:
absolute change, percentage change, bars elapsed, elapsed time, risk/reward, entry,
stop, target, and quantity where applicable.

### C3. Shapes and annotations — Priority P1

1. Arrow and arrow marker.
2. Circle and ellipse.
3. Triangle and polyline.
4. Text, note, price note, callout, and price label.
5. Brush and highlighter.

Use a controlled inline editor for text. Do not embed a general rich-text editor.
Freehand data should be simplified with a deterministic point-reduction algorithm and
stored in logical chart coordinates.

### C4. Advanced technical tools — Priority P2

1. Fibonacci extension and time zone.
2. Regression trend channel.
3. Pitchfork family.
4. Anchored VWAP.
5. Fixed-range and anchored volume profile.
6. Basic XABCD, ABCD, triangle, and head-and-shoulders markup tools.

Anchored VWAP and volume-profile tools require consumer-supplied volume and session/tick
metadata. Pattern tools in this phase are manual markup tools, not automatic detection.

### C5. Drawing workflow and settings — Priority P1

Add a categorized toolbar with:

- Search, favorites, and recent tools.
- Keep-drawing mode.
- Weak and strong OHLC magnets.
- Optional snap-to-indicator outputs.
- Lock/hide/remove all commands.
- Object tree with select, rename, reorder, group, visibility, and lock actions.
- Style panel and reusable per-tool defaults/templates.
- Layout-local and consumer-coordinated global synchronization modes.

Do not store drawing defaults in hidden module globals. Accept a preference adapter or
controlled values.

### Drawing Deliverables

- Drawing renderer, hit-test, handle, and input-lifecycle contracts.
- Built-in tool groups under `charts-market/src/drawings/tools/`.
- Toolbar, object tree, settings editor, templates, snapping modes, and grouping.
- Workspace migrations, exports, docs, stories, tests, and roadmap updates.

### Drawing Test Gates

1. Geometry and viewport-clipping unit tests.
2. Pointer, touch, keyboard, selection, multi-select, and undo/redo interaction tests.
3. Pan/zoom/resizing stability and OHLC/indicator snapping tests.
4. Serialization round-trips for every built-in tool.
5. Visual regression stories for selected, locked, hidden, grouped, and edited states.
6. 500 visible drawings without violating the agreed interaction frame budget.

---

## Workstream D — Chart Analysis

### Objective

Turn individual chart capabilities into coherent analysis workflows: comparison,
inspection, templates, navigation, export, and optional automated analysis.

### D1. Multi-symbol comparison — Priority P0

Add controlled comparison series to `MarketChart`:

```typescript
interface ComparisonSeries {
  id: string;
  symbol: string;
  data: readonly OhlcBar[];
  display: "price" | "percentage" | "indexedTo100";
  scale: "shared" | "left" | "right" | "hidden";
  color?: string;
  visible?: boolean;
}
```

Requirements:

1. Align series by timestamp without inventing missing values by default.
2. Support optional previous-value carry-forward as an explicit policy.
3. Expose all visible series in crosshair snapshots and the data window.
4. Allow add/remove/reorder/hide/color actions through controlled callbacks.
5. Support normalized performance comparison and raw-price overlays.
6. Add spread, ratio, and difference derived-series helpers.

### D2. Inspection and measurement — Priority P0

1. Rich data-window panel for OHLCV, comparison values, indicator outputs, and derived
   drawing measurements.
2. Persistent crosshair/inspection mode.
3. Quick measure gesture independent of saved drawing state.
4. Go-to-date/time action.
5. Visible-range statistics: return, high, low, average, volume, volatility, and bars.
6. Copy value, timestamp, and selected range summary actions.

The accessible data table must include comparison and active-indicator values without
rendering an unbounded number of columns by default.

### D3. Chart settings and templates — Priority P1

Add controlled settings groups:

- Symbol/series appearance.
- Status line and labels.
- Axes, grid, sessions, timezone, and locale.
- Scales and margins.
- Trading overlays and marker visibility.
- Canvas/background appearance.

Add named chart templates containing chart type, visual settings, scale settings, and
optionally indicators. Drawings remain outside chart and indicator templates.

Support `apply to current chart` and `apply to all charts` as emitted intent; consumers
own confirmation and persistence.

### D4. Analysis navigation and command surface — Priority P1

1. Integrate chart actions with the existing command-palette primitives.
2. Add keyboard shortcuts for symbol search, interval search, indicators, drawings,
   replay entry, go-to-date, object tree, and fit/realtime actions.
3. Provide a searchable interval picker supporting consumer-defined intervals.
4. Add maximize-chart and keyboard chart switching to multi-chart layouts.
5. Add synchronization groups instead of only global booleans for symbol, interval,
   visible range, crosshair, and drawings.

### D5. Export and sharing primitives — Priority P1

Provide client-side intent/helpers for:

1. Export visible or full source data as CSV.
2. Export transformed/indicator data with explicit opt-in.
3. Capture a PNG from the chart with optional legends and watermarks.
4. Copy or serialize a portable chart configuration.
5. Generate a stable analysis summary payload for a consumer-owned share service.

No upload, public URL, or cloud storage is included.

### D6. Automated analysis — Priority P2/P3

Ship only after the deterministic manual-analysis surface is stable:

1. Candlestick pattern detection with confidence and provenance.
2. Pivot and support/resistance helpers.
3. Trend-line and channel candidates.
4. Basic chart-pattern detection.
5. Seasonality and fundamental comparison adapters supplied by consumers.

Automated findings must be overlays with inspectable evidence, not irreversible chart
mutations. Label them as heuristic and keep them disabled by default.

### Chart-Analysis Deliverables

- Comparison/derived-series contracts and controls.
- Data window, range statistics, quick measure, and go-to-date.
- Chart settings, templates, keyboard commands, and synchronization groups.
- Export helpers and automated-analysis extension contracts.
- Stories, tests, docs, exports, migrations, and roadmap updates.

### Chart-Analysis Test Gates

1. Timestamp alignment across different sessions and missing-data gaps.
2. Correct normalization, spread, ratio, and difference calculations.
3. Crosshair synchronization and value snapshots across multiple series/panes.
4. Template and workspace migration round-trips.
5. Keyboard-only completion of core analysis tasks.
6. Multi-chart stress story with four charts, three series each, and ten indicators.

---

## Coordinated Delivery Sequence

The workstreams should not be implemented as four isolated branches. Use the following
dependency-aware sequence:

| Phase | Recommended pull requests | Outcome |
|---|---|---|
| 0 | Renderer registry; transform API; richer render primitives; workspace v3 | Stable extension foundation |
| 1 | Classic chart variants; indicator contract v2; drawing renderer v2 | Existing capabilities moved onto extensible contracts |
| 2 | Heikin Ashi; P0 indicators; P0 trend/measurement drawings; comparison series | High-value daily analysis workflow |
| 3 | Indicator browser/templates; drawing settings/object tree; data window/range stats | Discoverable and manageable analysis tools |
| 4 | Price-based charts; shapes/annotations; chart templates/commands/export | Broad chart-analysis coverage |
| 5 | Microstructure charts; multi-timeframe indicators; advanced drawings | Professional market-analysis depth |
| 6 | Automated pattern analysis | Optional heuristic layer |

Each phase must be releasable. Avoid merging an incomplete registry that cannot render
all existing built-ins.

## Package and File Layout

Recommended additions:

```text
charts-market/src/
  analysis/
    comparison.ts
    derived-series.ts
    range-statistics.ts
    export.ts
    templates.ts
  series/
    registry.ts
    classic/
    price-based/
    microstructure/
  transforms/
    heikin-ashi.ts
    range.ts
    renko.ts
    line-break.ts
    kagi.ts
    point-and-figure.ts
  indicators/
    math/
    trend/
    momentum/
    volume/
    volatility/
  drawings/
    registry.ts
    tools/
    object-tree.tsx
    settings.tsx
```

Add an `./analysis` entrypoint only when it has a coherent public API. Keep transform
and low-level renderer internals private unless consumers need them for extensions.

Every new React component folder must contain source, Storybook stories, `agents.md`,
and `README.md` according to the repository protocol.

## Compatibility Strategy

1. Treat all existing exported types and methods as supported during the beta expansion.
2. Add optional fields before replacing required fields.
3. Implement compatibility adapters for existing `MarketChartType`,
   `IndicatorDefinition`, and `DrawingToolDefinition` consumers.
4. Deprecate only after the replacement is documented and used by all built-ins.
5. Use versioned definitions and sequential workspace migrations.
6. Preserve unknown renderer, indicator, drawing, and extension state when possible;
   show an unsupported-placeholder state rather than silently deleting it.

## Performance Budgets

Before Phase 1, record baselines in CI. Proposed release gates:

1. 100,000 primary OHLC bars remain interactive.
2. A live update changes only the necessary transformed tail and indicator state.
3. Four synchronized charts with three visible series each remain usable.
4. Twenty indicators do not cause full-history recalculation on append.
5. Five hundred visible drawings maintain pointer interaction within the chosen frame
   budget on the reference CI/browser environment.
6. Expensive microstructure and automated-analysis work can run through a consumer-
   configurable worker adapter; the core package must not create hidden workers.

Record numeric timings rather than relying on subjective “smoothness” assertions.

## Accessibility and Interaction Requirements

1. Every new chart type must provide a meaningful accessible name and data-table form.
2. Synthetic chart data must be identified as transformed.
3. Indicator and comparison values must be available outside color and Canvas pixels.
4. Drawing tools require keyboard cancellation, deletion, movement, and focus indication.
5. Touch targets must meet the project's touch-audit requirements.
6. All animation and replay-adjacent effects respect reduced motion.
7. Color palettes must remain distinguishable in light/dark and common color-vision
   deficiency simulations.

## Documentation Requirements

For every shipped feature:

1. Document its data requirements and calculation convention.
2. State whether it supports incremental updates.
3. State whether it uses source or transformed prices.
4. Include controlled and extension examples.
5. Document persistence/version behavior.
6. Update `docs/roadmap/charts-market.md` from Planned to In Progress or Complete.
7. Add a changelog entry when a phase completes.

## Definition of Done

A phase is complete only when:

1. Public contracts and migrations are documented.
2. Calculations and geometry have deterministic unit coverage.
3. React interactions and accessibility are tested.
4. Storybook covers normal, empty, loading, invalid, dense, light, and dark states.
5. Package exports and declaration builds pass.
6. `npm run test`, `npm run typecheck`, the package build, and Storybook build pass.
7. Browser smoke tests confirm pan/zoom/crosshair/drawing behavior.
8. The Dev Runner verification required by the repository protocol reports no build or
   Storybook errors.
9. The roadmap and relevant component documentation are current.

## Recommended First Milestone

The first milestone should include only:

1. Renderer registry and compatibility adapters.
2. Transform contract and Heikin Ashi.
3. Indicator contract v2 plus Stochastic, ADX/DMI, OBV, Supertrend, and Ichimoku.
4. Drawing renderer v2 plus ray, parallel channel, range measurement, long/short
   position, and Fibonacci retracement.
5. Two comparison series with percentage/indexed normalization.
6. Data window and visible-range statistics.

This milestone materially improves real analysis workflows while proving every new
architectural seam before the long-tail catalog is expanded.
