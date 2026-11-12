# Supplied runtime price-reference lines

## Quiet compact axis-only label

At large requested badge fonts, a numeric axis-only value first reduces display precision to whole scientific notation. If even the shortest sign/exponent/unit cannot fit the fixed lane, only that numeric text fits its font to the available width. It never clips an exponent or sign; exact host values and full source labels remain accessible. This fitting is confined to the new short-caption policy.

For compact Boards add `showPlotLabel: false, showAxisLabel: true, axisLabel: 'Open'` to the existing supplied reference. The dotted line remains; only its plot caption disappears. The short caption and price occupy two lines inside the existing72/88px axis lane. Omission keeps the original plot caption and R-prefixed axis value. The full nonempty `label` is still mandatory and should contain the host's exact source, session/date,09:30ET open, currency and price explanation. It remains in the noninteractive accessible reference list and existing focusable chart's accessible description. Hovering the rendered axis badge exposes that full explanation through the native title, without another button or tab stop.

Normal/log axis-only numeric values use the existing compact/scientific value formatter without clipping a sign or exponent; percentage/indexed modes retain the current transformed axis units. Exact raw prices stay accessible. Placement avoids higher-priority price/crosshair/tick badges and engine-owned moving-average boxes. If the lane cannot fit a reference, its badge is omitted by the existing priority policy while evidence remains accessible. No lane/card widening or domain expansion occurs. Session replacement/removal clears both display and descriptions; no missing/open observations are created. See `BOARD-INLINE-READOUT.md` for the matching host-owned status option and **Market Charts / Quiet Board** for310/330px fixtures.

```tsx
import type {MarketPriceReference} from 'aapaetsch-charts-market';
const priceReferences: readonly MarketPriceReference[] = admittedRegularOpen == null ? [] : [{
  id: 'regular-session-open',
  price: admittedRegularOpen,
  label: 'Regular 09:30 ET open · supplied source/session',
  lineStyle: 'dotted',
  color: 'hsl(var(--muted-foreground))',
  showAxisLabel: true,
}];
<TechnicalChartView {...existingProps} priceReferences={priceReferences} />;
```

`TechnicalChartView` and `MarketChart` accept readonly runtime references; the optional engine setter is `setPriceReferences`. Dotted is the default and currently supported line style. `showAxisLabel` defaults false; supplied color defaults to the theme primary. References never change the automatic price domain. They use the existing price-pane coordinates, clipping, theme, CSS-pixel/DPR frame and normal/log/manual scale. Out-of-domain levels are omitted rather than pinned to an edge. No line is shown on an empty observation surface, collapsed/hidden price pane, invalid/nonfinite price, empty ID/label or unsupported style; duplicate IDs keep the first valid entry. Nonpositive logarithmic prices are omitted without invalidating genuine OHLC.

The host owns exact regular09:30ET selection, source/session copy and missing-evidence handling. Use the provider daily open for daily evidence or exact supplied09:30ET bar evidence for intraday; that selection belongs in the consumer. The renderer never infers a session, chooses nearest/premarket/previous-session bars, derives an open, acquires data or manufactures missing evidence. Admit data and references atomically: this input has no source/revision fields and cannot independently verify financial freshness. Explicit levels apply across the current rendered price plot; no time interval is inferred.

References are absent by default. They add no persisted fields, calculation identities/requests, financial callbacks, drawing objects, history, selection, hit tests, pointer handlers or keyboard targets. Existing pan, inspection, time gaps and exact OHLC retain their ownership. A named label accompanies the dotted plot line. Long visible labels are shortened within the plot; full label and exact price remain in a noninteractive accessible description, which notes that supplied levels may be outside the current view. Optional axis values are outlined and R-prefixed, use the actual72/88px left/right axis lane and share collision placement with data badges; last price and crosshair retain their priority. Overcrowded reference axis badges may be omitted, and colliding plot labels may be omitted while the line and accessible evidence remain. References do not become study legends or restore an otherwise empty header.

Changing/removing the array updates the shared engine frame without reconstruction; unmount disposes the existing surface. Alternative engines may omit the optional setter and must implement reference display if desired. Standard compact external-title cards retain the empty-header correction; internal menu triggers, workspace handles and real study/volume/profile/VWAP legends retain measured space. Card height and tick density remain independently configurable through existing public APIs.

Synthetic Price References stories cover three themes,320px,72px left axis,88px right axis,log scale and independent three-card instances, with toggle/revision/missing/manual-range/resize controls. Publication and exact-version consumer adoption require separate decisions.
