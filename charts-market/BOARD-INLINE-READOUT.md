# Board inline study readout

## Host-owned compact status

Compact Boards with existing discoverable host-expanded source evidence can now use `appearance={{...existingAppearance, studyReadout: 'volume-only', suppliedStatus: 'host', suppliedDetails: false}}`. This explicit policy allocates no supplied-study summary, warning block, Details/evidence action, profile-summary footer, internal status dialog, tab stop or measured chrome. It works independently of selected-average count. Expanded Boards keep `'inline'` and their existing expanded/compact status policy; My Charts omit the option. Do not remove result warnings/evidence from the host's expanded surface.

The option transfers presentation ownership; it never reclassifies partial/null/unavailable/stale/rejected/loading evidence as complete, changes admission/matching, request keys, calculationIdentity, supplied results, saved state or data acquisition. Keep genuine refresh/loading/failure/stale/rejected-update states distinct from study coverage in the existing host evidence and data lifecycle; MarketChart's `loading` and `error` props retain their separate surfaces. The default warning budget and details behavior described below remain unchanged for consumers that omit `'host'`.

Combine with `priceReferences={[{...exactSuppliedReference, showPlotLabel:false, showAxisLabel:true, axisLabel:'Open'}]}` to retain a subtle dotted open line and axis-only caption/price. Keep its complete host-owned label for accessible/hover/focus explanation. No new per-card control is added. Actual plot allocation reclaims the status chrome within the host's310pxdesktop/330pxnarrow cards. See `PRICE-REFERENCES.md` and **Market Charts / Quiet Board**. This additive source/candidate work does not authorize publication or dependency adoption.

`TechnicalChartAppearance.studyReadout?: 'inline' | 'volume-only'` is a runtime presentation opt-in on `TechnicalChartView`, exported from the package root. Use `'volume-only'` for compact Boards with a shared page-level average key and retain `'inline'` for expanded Boards. Existing `'inline'` consumers keep their behavior. Omission preserves the existing full-chart legends, their `Bar volume` title, `Vol` value label, color keys and disclosure. My Charts requires no change.

## Compact shared-key policy

```tsx
appearance={{
  ...existingAppearance,
  studyReadout: expanded ? 'inline' : 'volume-only',
}}
```

`'volume-only'` removes indicator, VWAP, drawing and profile legend names, swatches and numeric entries from the compact readout. It shows only actual supplied bar volume with one lowercase `vol` caption. Finite zero remains `vol 0`. Hidden, missing, null or nonfinite volume and no accepted bars produce no row or disclosure; with the external title menu, their header reserves zero height. Inspection uses the exact inspected bar, never a latest/nearby substitute for an unavailable observation. Clearing inspection restores latest supplied volume.

Selected studies and their supplied points, strokes, right-axis badges, volume histogram, OHLC, daily-open reference, hover dot, earnings, warnings and request identities are unchanged. Expanded charts must use `'inline'` and retain discoverable complete original evidence, provenance and warning/rejection details. Hiding a compact legend does not make partial or rejected results available. No extra per-card status row is introduced. With compact supplied status and details disabled, long critical warnings remain complete in the existing status surface, bounded to 4rem and keyboard-scrollable with visible focus. Positive status has no new tab stop; expanded inline/default warnings retain their existing layout. Hosts must still allocate enough height for their chosen root font and minimum plot.

The page-level checkbox key is host-owned. Portfolio's current factory palette maps 20 EMA to study1, 50 MA to study2, 150 MA to study3 and 200 MA to study4 in each light/dark theme. Use the same period/output/theme/override resolution as the chart adapter, independent of selection order or sparse points. Swatches are decorative line samples beside named native checkboxes. Card sizing remains host-owned; this option requires no height increase.

See **Market Charts / Board Shared Average Legend** for fixed supplied fixtures within 290px desktop / 310px narrow cards, shared checkbox colors, compact/expanded/default policies, volume zero/missing/off/no bars and sparse/null/partial/rejected evidence.

## Complete inline policy

```tsx
<TechnicalChartView
  {...existingSuppliedChartProps}
  paneMenuTrigger="none"
  paneMenu={titleMenu.paneMenu}
  onPaneMenuChange={titleMenu.onPaneMenuChange}
  appearance={{
    ...existingAppearance,
    studyReadout: 'inline',
  }}
/>
```

Keep a visible native host-title trigger from `useTechnicalPaneMenu` and the existing host-expanded exact-source details. This option removes the Legend button, group buttons and legend dialog; it adds no replacement disclosure. Every visible study's numeric outputs remain named, color-matched, noninteractive inline values at every width. Multi-output groups include output names. Missing/warmup/rejected observations stay unavailable; zero remains zero. Color-only direction keys do not consume inline space. Bar-volume numeric readouts have exactly one lowercase `vol` caption, with no `Bar volume`, rising/falling or duplicate volume caption on this surface.

Inline display uses the existing public display formatter. Exact supplied numbers, observation/range context, warning/status and producer/coverage descriptions remain in accessible item names/descriptions and titles. `SuppliedStatus`, rejected warnings, host callbacks/slots and original source evidence are untouched. Keep host-expanded details discoverable, including exact OHLC, raw volume, results, warning/provenance and admission evidence. The presentation option is not permission to hide unavailable/warning state or mutate saved studies to remove chrome.

The complete inline header wraps atomic caption/value pairs and reports its actual height. External-title standard panes have no 28px disclosure minimum in this mode; when there are no numeric readouts they reserve zero. Internal pane triggers and workspace handles retain their existing control allocation. Height changes, mode changes and wrapped rows use the same measured header for OHLC and engine geometry. Product card sizing, including the requested 20px increase, remains host-owned.

Study selection/visibility, producer request keys, financial outputs, data admission, version-1 state, drawings/history, earnings, supplied dotted open references, prices/axis badges, inspection and hover dots keep their existing contracts. This option neither calculates averages nor selects sessions or source observations. All selected lines still need host-admitted matching results. Do not install a local archive or alter package bytes; publication and consumer exact-version/complete-lock/install approval remain separate.

See **Market Charts / Board Inline Readout** for supplied none/one/all 20EMA/50SMA/150SMA/200SMA, volume on/off, compact/expanded, narrow, dense, light/dark, warmup and default-compatibility fixtures. These are explicit synthetic producer observations, not financial/provider acceptance or physical-device evidence.
# Combined My Charts instrument header

`TechnicalChartView.instrumentReadout` opts into a measured price-pane header:
supplied decorative logo, company name, period, exchange/currency, then O/H/L/C.
`vol` and visible named studies follow beneath. Label/value pairs wrap together;
complete source strings remain in accessible text and titles. Company name focus
and hover expose its complete accepted name in the existing themed tooltip.
The separate OHLC row, Legend disclosure and bar-direction color keys are absent.
Other panes use inline named study values. Omission preserves existing defaults
and Board `inline`/`volume-only` behavior.

Visible prices and studies use compact formatting: two decimals for ordinary
values, useful significant digits/scientific notation for tiny values, and concise
volume such as8.77M. Original decimals remain unchanged in accessible names,
titles, keyboard inspection and evidence. OHLC uses tightly spaced natural-width
pairs on one row where they fit, expanding/wrapping for larger values. On narrow
price panes, vol has its own row and the four averages share two
columns/two rows. Controls reserve space beside identity, not throughout the
numeric rows. Wide panes naturally share one line where space permits. This is
display formatting only; it does not change accepted observations or calculations.

```tsx
import {TechnicalChartView,type TechnicalChartInstrumentReadout,
  type TechnicalChartReadoutObservation} from 'aapaetsch-charts-market';

// bars and originalRows are immutable host-owned accepted snapshots.
const header:TechnicalChartInstrumentReadout = {
  name:listing.name, symbol:listing.symbol, period:displayPeriod,
  exchange:listing.exchange, currency:listing.currency,
  logo:approvedAssetPath ? {src:approvedAssetPath} : undefined,
  onSelect:openExistingSymbolPicker,
  exactValues:{identity:dataIdentity, revision:acceptedRevision,
    source:bars, observations:originalRows},
};
<TechnicalChartView {...existingProps} data={bars} dataIdentity={dataIdentity}
  dataRevision={existingRevision} instrumentReadout={header}
  paneMenuTrigger="none" paneMenu={menu.paneMenu}
  onPaneMenuChange={menu.onPaneMenuChange}/>
```

`exactValues` is optional original presentation evidence, never a second plot
dataset. Its `source` must be the identical immutable array passed to `data`;
`identity` matches `dataIdentity` (otherwise `calculationIdentity`, otherwise the
empty string); `revision` matches `dataRevision.revision` when versioned, and is
omitted when unversioned. Admission uses the accepted snapshot/revision, including
rejected update and concurrent-render safeguards. Retained text survives only for
the same committed source, identity and revision. Do not mutate evidence in place.

Each `TechnicalChartReadoutObservation` contains the exact `time`, required
`open/high/low/close: string|null`, optional `volume: string|null` and optional
`studies: Readonly<Record<string,string|null>>`. Study keys are full renderer IDs
such as `instanceId:outputId`. Strings are plain finite decimal text, at most128
characters, whose numeric projection must equal the admitted numeric plot/result
value. The projection check adds no financial calculation. Duplicate timestamps,
missing rows/fields, nulls and mismatched text remain unavailable; zero stays zero.
Missing or unmatched numeric study results cannot be revived by text. Omitted
study text retains admitted numeric study values. Without `exactValues`, the
existing numeric projection is shown without reconstructing producer precision.

Idle uses the latest accepted bar; pointer/API/keyboard inspection uses one exact
accepted observation across OHLC, volume and studies. Active gaps, missing slots
and future display dates show unavailable values; explicit clear restores idle.
Pointer moves do not update a live announcement. Keyboard inspection describes the
same identity, UTC timestamp, original OHLC/volume/study values and incomplete flag
through the existing keyboard-only announcement. Supplied warnings, stale/partial
results, rejected responses and complete evidence remain available as before.

Name/symbol/period/exchange/currency are bounded to256/40/24/80/16 code points.
Invalid/empty names fall back to supplied symbol, then the existing symbol prop.
No identity is inferred from name text. A logo is an approved root-relative HTTPS
host asset or supplied inline image, fixed20×20 and decorative. Missing, invalid
or failed assets collapse with no fallback URL/provider/CDN or fabricated mark.
No price change or percentage is computed or displayed by this opt-in.

Shared header/commands default off in this mode; explicit `features` overrides
remain available. Remove redundant host identity/OHLC text when adopting it. Keep
host Objects/maximize/select actions and `useTechnicalPaneMenu` triggers; no copied
crosshair, private selectors or CSS hiding are needed. Internal pane actions are
reserved44px targets revealed on hover/focus without moving the row; earnings
remain accessible via the pane menu and price-header earnings button. No metadata
enters saved state, calculation requests or financial/result identities. No
dependency/version/install/publication change is part of this API preparation.

Wrapped headers also set runtime-only pane minima: measured header, existing
bottom allowance and at least48CSS pixels of actual plot body, respecting larger
authored minima. Hidden panes are excluded, collapsed panes keep28px, and a
maximized pane uses its own measured minimum. The summed minimum includes the
time axis and may exceed a host height request. `onGeometryChange` reports the
original request, actual plot height and overflow so the host can retain its
existing scrolling. This works in both available-height and plot-height modes;
it never edits saved pane sizes/minima or emits economic calculation changes.

Synthetic **Market Charts / Instrument Readout** stories cover supplied/missing/
broken logos, long names, exchanges, intervals, zero/missing volume, exact decimals,
empty/partial/rejected evidence, future gaps, oscillator panes, four tiles, themes,
320/390 widths and default/Board regressions.
