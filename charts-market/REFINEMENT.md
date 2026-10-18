# Research workspace refinement

Candidate: `0.1.0-beta.1-refinement.20261017.1`. This renderer release includes the October17 inline OHLC correction and preserves the supplied-results and calendar-coordinate contracts. OHLC labels and values remain inline at every width, wrapping whole pairs within two lines below the legend; exact values remain accessible even when long display values ellipsize. Existing compact legend and available-height controls apply without new public props or saved fields. Import the package CSS after the UI-kit CSS. Runtime geometry, presentation, revision receipts and command mailboxes are deliberately outside the version-1 saved chart document.

```tsx
const chart = React.useRef<MarketChartHandle>(null);
<TechnicalChartView
  chartApiRef={chart}
  symbol={symbol} interval={interval} data={acceptedBars}
  dataIdentity={datasetIdentity}
  dataRevision={{ identity: datasetIdentity, revision: producerRevision }}
  onDataAcceptance={recordReceipt}
  state={state} onStateChange={setChartState}
  calculationMode="supplied" calculationIdentity={calculationIdentity}
  suppliedResults={results} onCalculationRequest={requestFromHost}
  appearance={{
    height: availableHeight, heightMode: "available", minimumPlotHeight: 120,
    suppliedStatus: "compact", legends: "compact",
    candles: { bodyRatio: .72, maximumWidth: 12, wickWidth: 1 },
    grid: { horizontal: true, vertical: true, opacity: .35 },
    axis: { fontSize: 11, minimumTickSpacing: 55, timeTickSpacing: 180 },
    badges: { visible: true, lastPrice: true, studyValues: true, style: "outline" },
    crosshair: { visible: true, opacity: .75, dash: "dashed", labels: true }
  }}
  onGeometryChange={setGeometry}
  drawingToolIds={["trend-line", "horizontal-line", "vertical-line", "rectangle"]}
  drawingCommand={command}
  onDrawingHistoryChange={setHistory}
/>
```

`chartApiRef` exposes the existing chart handle plus `executeDrawingCommand`, `getDrawingHistory` and `resetScale`; the original forwarded `ref` continues to reference the composite root DOM element. `MarketChart` accepts `presentation` directly. Public engine adapters may optionally implement `setTheme`, `setPresentation` and `resetScale`; the built-in Canvas adapter implements them. Custom adapters own equivalent rendering/retention support.

## Appearance and geometry

Defaults preserve prior presentation and expanded status/legends. Numeric settings must be finite: body ratio .1–1, maximum candle width 1–100, wick width .5–5, opacity 0–1, axis/badge font size 9–24, price tick spacing 24–200, time tick spacing 80–500, crosshair width .5–5. These Canvas measurements use CSS pixels, independent of device pixel ratio. Colors inherit each instance's CSS variables; crosshair `color`, `labelBackground`, `labelColor` can override them. Candle width remains bounded by zoom spacing. Badge layout accounts for font height, prioritizes last price, and suppresses badges colliding with inspection labels. Long axis text is clipped with an ellipsis; compact OHLC/study legends format display text only and expose exact values through accessible labels/title and the data table.

Legacy `heightMode: "plot"` assigns `height` to the plot. `"available"` budgets the entire composite root, including enabled header/commands, status, legends/profile summary and footer. ResizeObserver measures public root geometry and adjusts plot height. `onGeometryChange` returns `{width, availableHeight, chromeHeight, plotHeight, overflow}`. A minimum plot height is enforced (default 120); when chrome plus that minimum exceeds the budget, `overflow` is true and the root can exceed the requested height. Hosts should provide an adequate budget or omit optional chrome through `features`; do not inspect private selectors. Host wrappers/margins sit outside this budget. Dock resize changes layout without publishing a new economic viewport.

Compact supplied status still announces partial, unavailable, stale, approximate and warning states. The Details button opens a themed dialog with full warnings, coverage, provenance and profile/derived summaries. An optional `onRequestSuppliedDetails(details)` replaces that dialog; its payload retains matched result objects and all warning fields. A host using this callback must display the evidence accessibly. Superseded request-key payloads stay rejected. The status panel never turns rejected data into a valid result.

## Data revisions and supplied identity

`dataRevision` opts into complete, authoritative host snapshots. `dataIdentity` is the expected dataset identity (composite fallback: `calculationIdentity`). Revisions must be nonnegative safe integers and increase within that identity. Older/equal revisions with a different data reference, mismatched identities and invalid/duplicate/nonascending bars are rejected synchronously, retaining the committed accepted snapshot. An identical reference at the same revision reports `unchanged`; successful commits report `accepted`. A new expected identity starts a new revision sequence. Keep data immutable; in-place mutation cannot be detected reliably. An abandoned concurrent React render does not advance the committed gate.

With revision mode, supplied calculation requests bind to
`marketDataCalculationIdentity(calculationIdentity, acceptedRevision, dataIdentity)`.
Use `onCalculationRequest` request keys as authoritative, or call this public helper when building host-supplied fixtures. Rejected incoming revisions do not generate new request keys. Changing dataset identity at the same revision also changes keys. Without revision mode, prior request identity behavior is unchanged. Host calculations/providers remain outside this package; supplied mode invokes no internal study/profile/drawing formulas.

Replace the same timestamp in the next authoritative snapshot for a current-bar revision; append a distinct timestamp for a new bar. `incomplete` is preserved as supplied. Matching economic history retains logical range/manual price scale/inspection, pane weights, drawing selection/documents and shared undo history. A genuinely appended bar follows the tail only when already at realtime; it preserves the zoom span. Theme and temporary loading/error overlays keep the engine alive. Explicit factory or calculation-mode changes dispose/recreate the adapter, restoring public viewport/scale/inspection; controlled pane state must be supplied to preserve pane geometry across adapter replacement. A new dataset with different first timestamp restores the previous economic range where representable. Missing inspected observations clear inspection rather than inventing a bar.

Full revision snapshots intentionally validate, copy and index history in O(N); they are not an O(1) streaming protocol. Existing `MarketChartHandle.appendOrUpdate` remains the legacy incremental seam and has no revision envelope. Avoid mixing imperative appends with older declarative snapshots. Supplied drawing/study rendering is bounded by the visible range plus adjacent points, with initial ordered-input validation/indexing; sorted immutable supplied points are required. Unordered supplied drawing paths are omitted rather than sorted or financially recomputed. Fit-all views naturally render more visible history.

## Commands and interaction origins

`drawingToolIds` filters the existing shared rail and cancels an active tool that is no longer allowed. Unknown tool IDs do not create controls. Alerts appear only with a real host alert callback. `DrawingToolbar` omits undo/redo/keep-mode controls without their handlers. No host should maintain a second document history.

`drawingCommand={{id: uniqueSequence, command: {type: "undo"}}}` executes each ID once. Commands: `undo`, `redo`, `delete`, `cancel`, `select` with `ids`, and `style` with `parameters`. The same commands are available through the handle. `onDrawingHistoryChange` reports `canUndo`, `canRedo`, `selectedIds`, `drawingCount`; use these for host button disabled state. Style-only operations preserve exact anchor values/extensions. Equivalent controlled host round-trips with different object-key order retain shared history. Escape cancels a draft and releases pointer capture; Ctrl/Cmd-Z and Shift-Ctrl/Cmd-Z work on the chart surface and leave editable inputs alone.

Viewport, scale and pane-size callbacks accept optional `MarketChartChangeMetadata`: `source` (`user`, `api`, `data`, `layout`) and optional `gesture` (`pan`, `wheel`, `pinch`, `time-scale`, `price-scale`, `pane-resize`, `keyboard`, `reset`). Composite state change metadata forwards this origin. Ordinary data/layout reconciliation emits no economic-range callback. Explicit handle navigation defaults to `api`; pass metadata to fit/realtime/setVisibleRange when needed. Wheel zoom is cursor anchored, normalizes line/page deltas and caps extreme steps; touch supports pinch/pan. Ctrl/Cmd browser zoom is preserved. Price-axis double-click and the pane menu restore autoscale.

Existing `rightOffsetBars`, `minimumRightOffsetBars`, `maximumRightOffsetBars` remain controlled viewport settings for compressed geometry. Right padding stays within those bounds; changing padding preserves the displayed economic range. In host-controlled UTC/calendar modes the domain/grid owns whitespace, as documented in CALENDAR-COORDINATES.md; right offsets do not expand that host domain. Explicit open-interval gaps remain independent runtime inputs; no bars, sessions or financial observations are synthesized.

## Compatibility and evidence

All seven JavaScript entry points retain ESM/CJS and declaration outputs; the CSS subpath and peer contracts are unchanged. The saved chart serializer remains version 1 with no added serialized fields. Root workspace manifests/lock files and product code are unchanged by this refinement; the chart workspace version advances without modifying that read-only root lock. MIT LICENSE and existing NOTICE remain included. Physical Safari/iPad behavior and real product/account evidence require downstream verification. Synthetic browser timings measure the local machine and are not universal performance guarantees.

The repository's `.chart-refinement-validation/` contains focused tests, required Dev Runner review/build/Storybook logs, browser/accessibility screenshots, long-history timing/memory evidence, a scope audit and exact frozen package/source manifests. Publication and product lock-tree adoption require separate approval of those exact artifacts.
