# Readable supplied charts

`TechnicalChartView` owns the legend, pane readouts, status and accessible navigation. Consumers do not need private DOM selectors or duplicate color keys. Existing version-1 documents, calculation request keys, source values and callback identities are unchanged.

```tsx
import {
  TechnicalChartView,
  suppliedStudyDefinitions,
  type TechnicalChartLegendMetadata,
} from 'aapaetsch-charts-market';

const names: TechnicalChartLegendMetadata = {
  drawings: {'session-vwap-instance': {label: 'Session VWAP'}},
  profiles: {'visible-profile-instance': {label: 'Visible-range profile'}},
};

<TechnicalChartView
  symbol="SYNTHETIC"
  interval="5m"
  data={acceptedBars}
  state={controlledState}
  onStateChange={handleStateChange}
  calculationMode="supplied"
  calculationIdentity={acceptedCalculationIdentity}
  suppliedResults={matchingAcceptedResults}
  availableIndicators={suppliedStudyDefinitions}
  legendMetadata={names}
  onRequestSuppliedDetails={openExistingEvidence}
  appearance={{
    height: availableHeight,
    heightMode: 'available',
    minimumPlotHeight: visiblePaneMinimums + 28,
    legends: 'compact',
    suppliedStatus: 'compact',
    navigation: 'integrated',
    grid: {opacity: .3},
    badges: {style: 'outline'},
  }}
  features={{header: false, commands: false, drawingRail: false}}
  rangeShortcuts={[]}
  footerActions={<button onClick={openExactData}>Exact data</button>}
/>;
```

The example names represent existing host instance IDs. None are copied into visible labels. Definitions provide study names, parameters and output labels. Actual colors come from saved instance overrides, definition defaults and scoped theme tokens. Line, histogram and dashed swatches distinguish the rendered primitives. Same-name/same-parameter instances receive bounded ordinal suffixes; request identities never change.

## Visible color mappings

Overlay mappings stay in the price pane; study outputs stay in their own panes. Wide panes show all mappings and may wrap. Narrow panes expose a clearly labeled **Legend** button, a compact primary value and the complete keyboard/touch-accessible legend dialog. Long names use explicit ellipsis with complete names in the dialog. There is no horizontal legend scroller. Wrapped headers are measured and reserve Canvas plot space; measurement is a layout update, not an economic range change.

The legend covers SMA/EMA and duplicate instances, all Bollinger/MACD/RSI/stochastic/ADX outputs, session/anchored VWAP, rising/falling bar volume, and visible/session/anchored profile segments, POC and value-area boundaries. Profile segment colors share the Canvas renderer's defaults and overrides. Bar-derived profile segments explicitly remain **rising/falling bar estimates**, never measured buyer/seller-initiated volume. Total-only and mixed supplied profile rows retain their own mappings. Profiles are range summaries, not crosshair-time observations.

`legendMetadata.drawings[id]` accepts a display label and optional already-supplied `points`. This is useful for an internally rendered drawing whose values the host already has. It does not calculate a drawing. In supplied mode, accepted matching drawing results take priority; an unavailable result never falls back to metadata samples. `legendMetadata.profiles[id]` accepts a display label and producer-owned segment labels when needed. Metadata does not override colors or calculation settings.

Readouts use the last accepted bar's exact timestamp by default, and the active crosshair's exact timestamp during inspection. Missing, null and warmup observations remain unavailable; sparse lines and VWAPs never carry a nearby observation forward. Axis badges remain latest-bar values. Accessible names and the legend dialog retain the full renderer numbers. These are chart display coordinates and can be lossy compared with source Decimal strings. Complete source evidence invokes the existing host callback for exact source evidence; the renderer does not reconstruct it. Binary time lookup keeps pointer work bounded for long histories.

## Labels and automatic domains

`IndicatorDefinition.formatParameters?: (parameters) => string` is an optional, pure display formatter. It receives only saved parameters. Defaults list primitive parameter values after the definition label. `IndicatorDefinition.lines[].label` supplies output names such as `+DI`, `−DI`, `%K`, `Signal` and `Histogram`.

`IndicatorDefinition.automaticDomain` and low-level `IndicatorRenderSeries.automaticDomain` support:

| Field | Default | Behavior |
| --- | --- | --- |
| `includeReferences` | `true` | Union finite visible line values with meaningful reference levels. |
| `padding` | `0.08` | Add this fraction of the span to each end; finite range 0–1. |
| `minimumSpan` | 2% of magnitude; zero uses 1 | Explicit positive span for constant/near-constant observations. |
| `emptyDomain` | `[0, 1]` | Empty/warmup bounds, unioned with references when enabled. |

All visible outputs in a pane share one domain. Offscreen observations do not stretch it. Empty/constant/zero values have explicit nondegenerate bounds. Finite extreme inputs are bounded safely. A supplied `fixedDomain` remains authoritative and ignores automatic policy. RSI and stochastic retain 0–100. Supplied ADX now defaults to automatic visible-value scaling, includes its 25 reference, and has no fixed 0–50 or 0–100 cap. MACD includes its zero reference. These are presentation metadata changes; supplied mode invokes no indicator formulas, runtimes or provider acquisition.

Reference ticks take priority over nearby ordinary labels. Tick precision follows spacing; automatic labels fall back to scientific notation when eight decimal places would merge distinct ticks or round a nonzero value to zero. Scientific precision increases only as needed to distinguish finite tick values. Explicit pane precision remains authoritative. Reference captions, pane separators and outline/filled latest badges use the existing theme. Reference/crosshair label positions reserve badge space; lower-priority badges may be omitted from an overcrowded axis, while complete values remain available through Legend. Price, study and dedicated zero-based volume axes retain independent units and modes. Existing volume-count scaling is preserved.

## Status, navigation and compatibility

Compact supplied status aggregates affected results rather than repeating an opaque ID or one warning per output line. Stale, partial, unavailable, approximate, loading, rejected and warning states remain textual and visible. **Details** retains complete warnings, coverage and provenance. The existing details callback keeps its original fields and object references; additive `rejectedResults` preserves warnings from superseded responses without rendering their values.

`appearance.navigation: 'integrated'` places pan/zoom, Fit/Latest, Auto/Log, timezone and compact supplied status in the existing footer. Small charts use the accessible Navigate menu. `navigationControls` can replace the built-in pan/zoom group with a host's existing common-calendar controls; `footerActions` hosts Exact data in that same strip. Standard footer composition remains the default. Hiding the footer does not hide supplied status. Navigation emits user-origin range intent and does not change drawing history.

`MarketChartPresentation.paneHeaderHeights` is an additive low-level layout control; `TechnicalChartView` measures it automatically. `drawingEvidenceLabels` controls repeated supplied drawing callouts. Compact composite legends suppress those callouts while retaining the visible warning summary and complete evidence in details. Low-level defaults preserve existing callouts. Canvas layers receive an optional `resolveColor` function so scoped CSS-variable overrides match SVG/DOM legend swatches.

Keep the host's atomic accepted-bars/results gate, matching dataset/revision identity, controlled ranges, mounted pane preferences, supplied source evidence and drawing history. Use sufficient `minimumPlotHeight` and host vertical scrolling for open panes rather than compressing them. This candidate does not change providers, persistence, economic units, serializers, root dependencies or the product. Publication and exact artifact/lock adoption require separate approval and real cached product acceptance.
