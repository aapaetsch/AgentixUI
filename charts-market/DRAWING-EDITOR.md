# Floating drawing editor and selected timeline

This is an opt-in shared editor for one selected trend line, horizontal line,
vertical line or rectangle. Enable it only on the active editable chart instance.
Omitting `drawingEditor` preserves the existing contextual toolbar; supplying
`{active:false}` hides contextual editors on an inactive instance. Multi-selection
retains shared commands/history without a single-object toolbar. Default and
read-only Board consumers do not need to adopt it.

## Public integration

The package root and `/drawings` export `MarketDrawingEditorOptions`,
`MarketDrawingPresentation`, `MarketDrawingParameters`, `MarketDrawingText`,
`MarketDrawingStatistic`, `MarketDrawingFinancialStatistic`,
`MarketDrawingIntervalFamily`, `MarketDrawingIntervalRange`,
`MarketDrawingEditorPosition`, `MarketDrawingSuppliedStatistics`,
`MarketDrawingExactCoordinate`, `MarketEditableDrawing`, and
`marketDrawingGeometryKey`. Both `MarketChartProps` and
`TechnicalChartViewProps` accept `drawingEditor?: MarketDrawingEditorOptions`.

```ts
interface MarketDrawingEditorOptions {
  active: boolean;
  position?: {x:number; y:number} | null;
  onPositionChange?: (position:{x:number; y:number} | null) => void;
  timeZone?: string;
  statistics?: readonly MarketDrawingSuppliedStatistics[];
  statisticsContextKey?: string;
  onAlertIntent?: (drawingId:string) => void;
}
interface MarketDrawingSuppliedStatistics {
  drawingId: string;
  geometryKey: string;
  contextKey: string;
  values: Partial<Record<
    'price_range'|'percent_change'|'bars_range'|'date_time_range', string|null
  >>;
}
```

The editor timezone inherits the chart timezone, then UTC; a valid IANA override
is optional. Invalid timezone identifiers fall back to UTC. Position is fixed
viewport CSS pixels, independent of drawings/history. Keep it in host
account-session memory; clear it on account change. Null or Home/Reset returns
the toolbar to the upper center of its own chart. Pointer movement is local
until release; arrow keys move 4px, Shift+arrow 20px. Only the handle captures
pointer/touch input. Scroll, resize, visual-viewport changes, fullscreen changes
and chart/panel resize clamp the toolbar to the current visual viewport.

Example host wiring (persistence and supplied values remain host-owned):

```tsx
const [toolbarPosition, setToolbarPosition] =
  React.useState<MarketDrawingEditorPosition|null>(null);

<TechnicalChartView
  state={state}
  onStateChange={(next, metadata) => {
    setState(next);
    if (metadata.drawing && metadata.drawing.type !== 'selection') {
      // Use next.drawings plus metadata.drawing.exactCoordinates in
      // the host's existing validated authored-drawing save transaction.
    }
  }}
  calculationMode="supplied"
  drawingEditor={{
    active: isActiveEditableChart,
    position: toolbarPosition,
    onPositionChange: setToolbarPosition,
    statisticsContextKey: admittedDrawingResultContext,
    statistics: admittedDrawingResults,
  }}
  /* existing data, identity, timeAxis, appearance and interactions props */
/>
```

Use the existing shared drawing commands/handle for undo, redo, duplicate,
delete, lock, hide and explicit cancel. Selection metadata is transient, not an
autosave trigger. Quick color/width/dash changes preview locally and Apply
commits once. Settings Style/Text/Coordinates/Visibility are one draft and one
history entry on changed OK. Untouched OK does not add defaults or a transaction.
The dialog heading identifies the current draft name or friendly drawing type.
Closing returns focus to its connected Settings/Text/More trigger; blur or
disposed instances do not steal focus. A timezone change cancels the old draft
before local date fields can be reused under a different label.
Cancel, Escape, blur, selection/document replacement, explicit shared cancel and
unmount discard drafts and release capture. A shared cancel also clears pending
optimistic acknowledgements. Normal known delayed/out-of-order controlled echoes
retain the latest shared transaction. Unknown external documents/context changes
rebase to the host document. A host rejecting a transaction with identical old
bytes should issue the explicit cancel command before supplying its replacement.

Locked drawings remain selectable and unlockable; geometry/style/text edits are
disabled. Hide changes the existing visible flag; recover through the shared
object tree. The default bell is disabled and says “Drawing alerts — coming
later”. An optional host intent callback receives only the drawing ID and
creates no live alert in this library.

## Authored document and private DTO mapping

Public presentation lives under `DrawingState.parameters.presentation`.
Existing `parameters.color`, `lineWidth`, `dashStyle`, `extendLeft` and
`extendRight` stay authoritative. Top-level `name`, `visible` and `locked`
stay top-level. Omission preserves historical behavior and does not materialize
defaults merely through selection or opening settings.

| Private DTO | Shared drawing |
| --- | --- |
| color, width, presentation.line_style | parameters.color, lineWidth, dashStyle |
| extend_left, extend_right | parameters.extendLeft, extendRight |
| name, visible, locked | same top-level fields |
| presentation.start_cap, end_cap | presentation.startCap, endCap (trend only) |
| middle_point, price_labels | middlePoint (paired), priceLabels (except vertical) |
| text.font_size, vertical_alignment, horizontal_alignment | text.fontSize, verticalAlignment, horizontalAlignment |
| statistics_position, always_show_statistics | statisticsPosition, alwaysShowStatistics |
| statistics values; visibility family keys | same values and keys |

Every shared presentation entry in the table is under
`parameters.presentation`. Text also has `value`, six-digit hex `color`,
`bold`, `italic`; fontSize is an integer 8..48, value is plain text of at most
2000 Unicode codepoints. It is rendered as text, never HTML. Name is optional,
1..120 codepoints when supplied. Start/end caps are normal/arrow. Independent
left/right extensions preserve existing trend/horizontal defaults. Paired shapes
support a midpoint, statistics array, left/center/right/auto statisticsPosition,
and alwaysShowStatistics. Vertical lines do not expose price labels.

Statistics enum values are `price_range`, `percent_change`,
`change_in_pips`, `bars_range`, `date_time_range`, `distance`, `angle`.
Visibility is an optional object keyed by minutes/hours/days/weeks/months.
Each explicit range contains `{enabled:boolean,min:number,max:number}`, bounded
respectively to 1..59, 1..24, 1..366, 1..52, 1..12 with min <= max. An omitted
family preserves prior visible behavior. Ticks, seconds and ranges are visibly
unavailable in the editor and preserve historical visibility. Supported runtime
interval strings are positive integer suffix forms m/h/H/d/D/w/W/M. The host
retains strict validation, unknown/null rejection and its explicit DTO mapper;
do not persist an opaque renderer state.

## Exact coordinate edits and history

`DrawingPoint` adds optional `priceText:string` and `utcTimeText:string`.
Seed these from the host's exact authored anchor strings. Numeric `price` and
`time` remain the renderer projection. Price text uses the product's canonical
plain-decimal syntax:

```text
^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$
```

The maximum is 80 characters, with a finite numeric projection; no exponents,
plus sign, commas or noncanonical leading zeros. Two valid decimals projecting
to the same JavaScript number still create distinct history transactions.
Untouched numeric-only legacy anchors also retain their original document.

UTC text is a valid ISO instant ending Z or +00:00, with up to six fractional
digits and years 0001..9999, matching the private datetime DTO. Nonzero and
unknown offsets are rejected. Untouched text retains its original spelling and
microsecond precision. Newly
edited timezone/ruler inputs produce millisecond UTC. Local DST gaps are
rejected, and folds require an explicit UTC offset choice. Inputs outside the
engine's available drawing ruler are rejected. Only changed coordinates replace
their exact text. Completed active opt-in create/move/resize/duplicate/clipboard
transactions stamp missing authored text before history and callbacks: canonical
plain decimal from the coordinate projection, and millisecond UTC. Valid existing
text survives byte-for-byte. Previews, selection, cancellation and opt-out do not
materialize fields. An affected coordinate outside the Decimal/UTC contract rejects
the entire transaction with an accessibility announcement, without a callback or
history entry. This lets undo restore newly authored exact anchors after a later
sub-number-resolution edit. Ruler indices convert
immediately to durable timestamps and are never persisted.

Final callbacks include additive
`DrawingChangeMetadata.exactCoordinates?: MarketDrawingExactCoordinate[]`:

```ts
interface MarketDrawingExactCoordinate {
  drawingId:string; pointIndex:number; price?:string; utcTime?:string;
}
```

Undo/redo regenerates this metadata from the restored document. TechnicalChartView
forwards it as `TechnicalChartViewChangeMetadata.drawing`; MarketChart supplies it
as the existing second onDrawingsChange argument. Prefer valid point text or its
matching metadata entry in the private mapper, otherwise use the host's existing
unchanged-anchor comparison and numeric-gesture conversion. Never round-trip all
anchors through numbers simply because one style or coordinate changed.

UTC comparisons normalize Z/+00:00 and trailing fractional zeros lexically at
full microsecond precision. Equivalent server spellings keep history, drafts and
supplied geometry keys stable; .123456 and .123457 remain distinct. Comparison
never rewrites raw snapshots or commit metadata. Object-key ordering is ignored,
while drawing/point/statistic array ordering remains significant.

## Supplied statistics and timeline geometry

The four financial/date/bar statistics are formatted strings supplied by the
host, never calculated here. Admit a result only when its drawingId,
`marketDrawingGeometryKey(drawing)` and nonempty contextKey match the current
drawing and editor.statisticsContextKey. Geometry keys include exact coordinate
text. Clear/reissue results atomically on the host's admitted dataset/result
revision. Do not re-key old financial strings onto new geometry. Geometry drafts,
including invalid coordinate-edit intent, suppress financial results until the
draft ends. Unknown, missing, null or stale values display Unavailable. Distance
and angle alone are CSS-pixel geometry and respond to scale/viewport changes.
Pips remain unavailable until a registered convention exists. Long display
strings may use an ellipsis; the exact supplied text remains in title/ARIA.

`MarketChartEngine.logicalForTime?` and `timeForLogical?` expose the existing
engine ruler. `MarketChartSnapshot.timeAxis?` reports actual surface-local
`{left,top,width,height,futureFrom?}`. Custom engines may omit these additions;
no private DOM selectors or second time scale are used. The selected timeline
uses actual anchor dates, never extended ray ends. Paired anchors form a subtle
span; one-anchor drawings have one marker. Reversed/coincident/colliding anchors
retain distinct labels; offscreen endpoints clamp with direction indicators.
Labels follow pan/zoom/resize. Beyond the engine's known future seam, the
annotation ruler labels explicitly use UTC; historical dates use chart timezone.
These overlays create no bars, financial values, sessions or economic requests.

## Verification and adoption

Storybook **Market Charts / Drawing Editor** contains Dark, Light, Narrow390,
Narrow320, Calendar, Utc, DelayedEcho, FourInstances and HiddenRecovery fixtures.
The fixture's expandable verification output is public synthetic state for
browser checks. No provider or private account is required.

Fullscreen editor surfaces use the paired UI-kit's new optional `portalContainer`
Content API (Dialog, Popover, DropdownMenu and Tooltip). The chart passes a
container only for the active opt-in fullscreen editor; omitted/default consumers
keep body portals. The currently published UI peer lacks this capability. Review
and publish the coordinated UI/chart successors, including an approved chart peer
minimum, before adopting fullscreen support. This local review keeps both existing
workspace versions/manifests unchanged; the dependency change is a later gate.

Implementation evidence, actual test/build/browser results, source/package
hashes, preservation checks and the publication proposal live under
`.chart-drawing-editor-validation/`. Browser emulation does not establish
physical iPad/Safari/trackpad or native-browser-zoom acceptance; see the evidence
for exactly which modes were exercised. The local candidate retains the unchanged
workspace manifest/version. Publication, release-version assignment, exact
consumer dependency/complete-lock/install, private persistence and deployment
acceptance remain separate owner-controlled gates.
