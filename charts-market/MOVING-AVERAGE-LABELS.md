# Moving-average endpoint boxes

For price and all oscillator outputs in a separate non-occluding gutter, use the
newer `badges.endpointValues='all-visible'` option in [ENDPOINT-LABELS.md](./ENDPOINT-LABELS.md).
The moving-average-only mode below remains supported. Collision groups now use
order-preserving least-squares placement to minimize total squared displacement.

Opt in through `TechnicalChartView.appearance`, `MarketChart.presentation` or an existing engine's `setPresentation()`:

```tsx
appearance={{...existingAppearance, badges: {
  ...existingAppearance.badges,
  visible: true, studyValues: true, movingAverages: 'all-visible',
}}}
```

This mode adds right-axis outlined boxes for every **visible, tagged price-overlay moving-average output**. Built-in and supplied SMA/EMA definitions are tagged. A custom `IndicatorDefinition` opts in with `axisLabelKind: 'moving-average'`. Low-level prevalidated `IndicatorRenderSeries` can provide `axisLabel: {kind: 'moving-average', label, shortLabel?, status?}`. Use human-readable definition/parameter/line labels; IDs are never displayed. Composite labels include duplicate ordinals, and accessible row ordinals plus actual line borders distinguish coincident or same-period instances. Hidden/collapsed panes and hidden instances do not produce boxes.

Omission preserves the existing latest-overall, priority-suppressed Canvas badges. `badges.visible=false` or `badges.studyValues=false` disables these boxes too. In this mode moving-average boxes always use an outline, irrespective of the legacy `style` used by other badges. No host pane minimums, saved version-1 fields, request keys, data acquisition or financial calculations are added or changed. Keep compact Chart Boards' existing appearance unless separately approved.

## Exact endpoint policy

The endpoint is the **last accepted OHLC observation whose center is inside the actual visible plot time window**, excluding drawing overscan and host-declared gap interiors. The value must exist at that exact timestamp in the accepted output. There is no nearest sample, previous-nonnull lookup or stale carry-forward. A historical pan therefore labels the earlier line endpoint rather than the newest overall output. Trailing whitespace uses the final accepted visible bar, not an invented timestamp. An empty visible window has no endpoint.

Crosshair/keyboard readouts remain independent inspection values. Pan, zoom, fit, viewport/range setters, resize, theme/presentation changes and accepted current-bar revisions refresh boxes on the existing engine. Missing, warmup, unavailable, rejected/mismatched or nonfinite endpoint samples produce an explicit nonnumeric `— missing` row. Matching supplied status, stale/approximate flags and warning text stay available in the row's accessible label/title and the existing legend/source-evidence controls. No supplied output is repaired. In supplied mode neither `calculate` nor runtime/formula/provider callbacks are used.

## Position, collisions and overflow

Boxes live on the right axis. Their value line shows raw supplied units, with up to eight significant digits (scientific notation for tiny/large magnitudes); full JavaScript display precision, endpoint timestamp, definition/parameters, status and warning are in each focusable note's accessible name and native title. They are renderer display numbers; exact original Decimal/string evidence remains host-owned through existing source-evidence access.

Rows show only values in matching line-colored outlines, with indicator identity/parameters retained in accessible names/titles and existing legends. Rows are at least 20 CSS px tall, increasing with a larger badge font (21px by default). Coincident/close values stack without removal. A visible `↕` marks displacement; colored connectors and dots anchor to the true endpoint position. Right-axis reference ticks, latest-price or crosshair labels cannot suppress a moving-average row; they can be covered where they intersect its box. Use the newer all-output mode for a separate non-occluding gutter. Hover readouts and complete evidence remain available separately. Connectors are presentation geometry, never changed economic values.

When all rows cannot fit (many instances, a tiny pane or a large font), a **bounded, keyboard/touch-scrollable right-axis list** retains every row, with a visible count/scroll heading. To preserve readable numbers beside native scrollbars, this list extends up to 48 CSS px left into the plot, bounded to the chart width (up to 120px total including the normal axis). The list's positions are explicitly **not price coordinates**, and price-position connectors are omitted. Every row remains in the accessible region; some require scrolling. The renderer does not enlarge the pane or reset a manual scale. Collapsed/hidden price panes show no list. On an exceptionally short zero-usable-height pane no overlay can be drawn; expand the pane to access boxes, while source details remain available.

## Off-scale and log values

Manual ranges remain unchanged. Values outside the actual scale domain use an upper/lower edge anchor, a dashed connector and an explicit `↑`/`↓` marker. Tiny-pane geometry alone never marks an in-domain value as off-scale. A nonpositive log-scale value is still disclosed numerically with `⚠` and an accessible “undefined on current scale” explanation, has no false price connector, and is not replaced or forced into a positive domain. In this opt-in mode only, nonpositive tagged MA values are excluded from log autoscale inputs so they cannot blank otherwise valid OHLC data; the actual supplied values and manual range remain intact. Invalid OHLC or other-study log errors keep their existing behavior. Overflow rows retain these markers but remain unpositioned list entries. The same behavior applies after scale/pane changes without changing financial values.

## Integration and verification

Use the public presentation option and metadata only. Do not measure private chart DOM, patch Canvas or copy collision/renderer logic into a host. The shared engine owns a relative surface, outlined DOM notes and SVG connectors. DOM notes are keyboard-focusable; text uses the chart theme foreground and outlines use the actual rendered study colors. Runtime updates preserve row focus and overflow scroll position when possible. Existing pointer navigation stays on the Canvas outside the axis notes/list.

Synthetic supplied-only examples: `Market Charts/Moving Average Axis Boxes`. Fixtures include EMA20/SMA50/150/200, coincident values, sparse/null final samples, unavailable/warmup, duplicate periods, custom definitions/colors/themes, normal/log/manual scales, overflow, narrow widths and revisions. `examples/moving-average-boxes.tsx` demonstrates the public opt-in. Validation receipts, screenshots and the separately sealed candidate live under `.chart-readability-validation/moving-average/`.

This is a local implementation candidate. Publication, exact consumer version/complete-lock approval, installation, deployment and real cached Portfolio acceptance remain separate gates.
