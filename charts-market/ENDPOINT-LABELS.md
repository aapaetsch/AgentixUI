# Unobscured price and study endpoint boxes

```tsx
appearance={{...existingAppearance, badges: {
  ...existingAppearance.badges,
  visible: true, lastPrice: true, studyValues: true,
  endpointValues: 'all-visible',
}}}
```

`MarketChartPresentation.badges.endpointValues?: 'all-visible'` opts in through
`TechnicalChartView.appearance`, `MarketChart.presentation` or engine
`setPresentation()`. It supersedes the older moving-average-only option.
Omission preserves the existing defaults and compact-board appearance. The
moving-average-only option still works independently.

The shared engine retains price close plus every visible rendered study output:
EMA/SMA, RSI, MACD/signal/histogram, Stoch %K/%D, ADX/+DI/−DI, custom and duplicate
outputs. `lastPrice=false` removes price; `studyValues=false` removes studies;
`visible=false` disables the mode. Hidden/collapsed panes have no boxes.
The options are runtime presentation, outside saved version-1 state and request
keys. Host pane minimums, reorder, collapse, resizing and financial values remain
host-controlled.

## Endpoint and pane coordinates

All boxes use the **last accepted OHLC bar inside the actual visible time window**,
excluding overscan and declared gap interiors. Each study needs an accepted sample
at that exact timestamp. No hover, nearest, previous-nonnull or stale carry-forward
substitutes are used. Price close uses the same timestamp, rather than the global
latest bar. The matching line/histogram endpoint is mapped through that pane's
current scale including its actual top offset, even when RSI is above price.
Historical pan/zoom, fit, live accepted revisions and reorder update the anchors.

Missing, warmup, null, unavailable, mismatched and nonfinite values remain explicit
nonnumeric rows. Matching warning/status and complete source evidence stay in the
existing legend/details and focusable row. Supplied mode invokes no calculation,
runtime or source callbacks. Original source precision/evidence stays host-owned.

## Separate lanes and minimal displacement

The opt-in reserves a right value-label gutter **beside the plot**, followed by the
existing 72 CSS px reference/crosshair lane. Ticks and crosshair readouts cannot
cover the value boxes. The gutter starts at 100 CSS px with the default font and
grows for larger text, bounded to retain plotting space. Its width changes display
geometry only, without changing the logical visible range or price/study values.
Headers/OHLC readouts, pane separators, plot clips and drawing primitives have
separate bounds; full rows stay below pane chrome and above its separator.

Each numeric row starts at its true vertical endpoint coordinate. When all rows fit,
an order-preserving least-squares projection minimizes total squared vertical
movement under pane bounds and minimum row separation. Feasible noncolliding
anchors stay exact; equal values stack symmetrically where bounds permit. Crossing
lines reorder by the current endpoint, with stable source order for equal values.
Color-matched short connectors and endpoint dots identify displaced rows; `↕`
discloses displacement. This is display geometry, never a changed supplied value.

If rows cannot fit, the same gutter becomes a bounded keyboard/touch-scrollable
list with an explicit count. List row positions **are not price coordinates**, and
position connectors are omitted. Every row remains reachable. Fonts are at least
11 CSS px and grow with the requested badge/container font; complete numeric text
wraps at extreme font/viewport ratios instead of clipping or shrinking. Bounded
scientific notation keeps the sign/exponent intact. Full raw renderer precision,+identity/parameters, timestamp and status are in each note's accessible name/title.
Boxes display values only, with matching line-colored outlines. Indicator names
and ordinals are omitted from the visible box; full identity/parameters remain in
the accessible note/title and existing Legend controls. Compact single-line rows
reduce displacement; larger or wrapped values use more vertical room as needed.

Manual scales remain unchanged. Off-scale values show `↑`/`↓`, dashed edge anchors
and explicit above/below-scale semantics. Undefined log values retain their raw
numeric value with `⚠`, no false price connector, and an explanation. In this mode,
nonpositive overlay study values are excluded from log autoscale input so valid
OHLC is not covered by a global error; supplied values are retained. Existing
invalid-OHLC behavior is unchanged. Oscillator scale modes/domains are independent.
Overflow retains off-scale/missing/log state but remains an unpositioned list.
No box can fit a zero-usable-height pane; expand it or use the existing details.

## Integration

Use public presentation and metadata only; never copy the layout, patch Canvas or
measure private renderer DOM in the product. Composite adapters provide human
definition/parameter/output names, duplicate ordinals and matching supplied status.
Low-level `IndicatorRenderSeries.axisLabel` accepts
`{kind: 'moving-average' | 'study', label, shortLabel?, status?}`. Opaque IDs are
internal keys, not normal label text. If omitted, a generic “Study output” identity
is used; low-level hosts should supply readable metadata for custom lines.

`examples/endpoint-boxes.tsx` shows the public opt-in. Synthetic supplied-only stories
are under `Market Charts/Endpoint Alignment`. Scope, executed evidence, limitations
and a separately frozen local candidate are in
`.chart-readability-validation/endpoint-alignment/`. Publication and exact consumer
artifact/complete-lock adoption remain separate approvals.
