# Publication review — research workspace refinement

Implementation and local validation are complete. **This candidate has not been published or installed in the product.** The separate supplied/calendar releases and DashboardGrid UI-kit release are preserved. This request permits a local candidate; publication and exact product dependency/lock-tree adoption require separate approval.

## Exact immutable candidate

- **aapaetsch-charts-market@0.1.0-beta.1-refinement.20261016.1**, proposed tag **beta**.
- [Package](candidate/sha256-32f73f768ea0897dbd2e283cbc82684aaeae1dd20767b931edde61cc012a925d.tgz): **468374 bytes**, **71 packed files**.
- SHA-256: `32f73f768ea0897dbd2e283cbc82684aaeae1dd20767b931edde61cc012a925d`.
- Integrity: `sha512-/bhM5/i1Tnde5LsCfmlXz7sKFebyl4SpY2QDBiBHKuMpZ3FhdZTvJk7xFSVKcVCHlWwwuzcvYTUf4Cq4+6vsZw==`.
- [Source snapshot](candidate/source-sha256-eaa1f6cce92c6271235616a92998f9fd2689172557239b456d3ef37702a42afa.tgz), **115 inputs**, SHA-256 `eaa1f6cce92c6271235616a92998f9fd2689172557239b456d3ef37702a42afa`.
- [Manifest and complete per-file inventory](candidate/manifest.json), [npm pack result](candidate/npm-pack.json), [consumer checks](consumer-results.json), [contract delta](contract-delta.json), [evidence hashes](artifact-evidence.json), [final audit](final-audit.json).
- Baseline HEAD `9b8cbb69847ac701dc0d99cd545727ccb833a5a6`. The existing dirty source is retained; this is a reviewed source/archive-bound candidate, not a clean commit-built release claim. No commit/push/PR or publication was performed for this refinement.

## Delivered contract and compatibility

Complete examples, defaults/ranges and host responsibilities are in [REFINEMENT.md](../charts-market/REFINEMENT.md) and the packaged copy. The main changes are additive:

| Surface | Added public contract | Compatibility |
|---|---|---|
| TechnicalChartAppearance / MarketChartPresentation | candles bodyRatio/maximumWidth/wickWidth; grid horizontal/vertical/opacity; axis fontSize/minimumTickSpacing/timeTickSpacing; badges visibility/lastPrice/studyValues/style/fontSize; crosshair visibility/width/opacity/dash/colors/labels | Legacy defaults retained; Canvas CSS-pixel measurements. Independent CSS-variable themes remain authoritative. |
| Composite density | suppliedStatus and legends compact/expanded; onRequestSuppliedDetails(TechnicalSuppliedDetails) | Full warning/provenance/coverage/profile summaries retained in a themed details dialog or host callback. Rejected result keys never become valid values. Exact OHLC/study values remain accessible while compact text is formatted. |
| Height | heightMode plot/available, minimumPlotHeight, onGeometryChange(TechnicalChartGeometry) | Plot mode preserves old height semantics. Available mode budgets enabled chrome plus plot through public root measurement. Minimum-height overflow is explicitly reported; no private DOM selectors required. Mobile rail remains reachable with commands hidden. |
| Host bars | dataIdentity, dataRevision(MarketDataRevision), onDataAcceptance(MarketDataAcceptance) | Optional complete authoritative snapshots; old props remain supported. Reject wrong identity, older/equal replacement revisions, invalid/duplicate/unordered bars, retain committed accepted snapshot. Abandoned concurrent renders cannot advance the gate. |
| Supplied results | marketDataCalculationIdentity(baseIdentity, acceptedRevision, dataIdentity) | Revision mode binds request keys to both accepted dataset and revision. Legacy identity unchanged without revision mode. Host supplies all financial values and incomplete/completed flags. |
| Shared drawings | drawingToolIds, drawingCommand with unique ID, onDrawingHistoryChange; MarketDrawingCommand select/style/delete/cancel/undo/redo | Existing rail/history reused. Style-only changes preserve exact anchors/extensions, equivalent key-reordered host documents preserve history. Alerts require callbacks; history and keep-mode controls omit missing handlers. Selected edit controls require the corresponding host callbacks. |
| Imperative access | chartApiRef; MarketChartHandle executeDrawingCommand/getDrawingHistory/resetScale | Forwarded composite ref remains the root DOM element. Existing navigation accepts optional origin metadata. |
| Engine/callbacks | optional setTheme/setPresentation/resetScale; MarketChartChangeMetadata source and gesture; optional snapshot viewport/scale; optional drawing renderer visibleRange | Old custom adapters remain source-compatible; they own optional setter support. First-party adapter retains theme/loading/error instances. Factory/mode replacement restores public viewport/scale/inspection; controlled panes own pane geometry across replacement. |

The only new runtime root exports are **acceptMarketDataSnapshot, marketDataCalculationIdentity, validateMarketPresentation**. No runtime exports were removed; **158 root exports** retain exact ESM/CommonJS name parity. All seven JavaScript entry points (root, core, indicators, drawings, overlays, controls, workspace) load in native ESM/CJS. NodeNext .mts and .cts consumers compile with the actual packed declarations; supplied/calendar SSR agrees in both formats (28172 HTML bytes).

Named types include MarketChartPresentation, MarketChartChangeMetadata, TechnicalChartGeometry, MarketDataRevision/Acceptance/Snapshot, TechnicalSuppliedDetails, MarketDrawingCommand/CommandRequest/HistorySnapshot. Exact generated declaration entry hashes are in contract-delta.json; all packed .d.ts/.d.cts and shared declaration chunks are hashed in the manifest.

The version-1 chart document is unchanged: no serialized fields/version added or removed. An existing calendar-release document with an opaque extension makes a byte-identical round-trip through the new serializer. Presentation, revisions, geometry, command mailboxes and callback origins remain runtime-only. Drawing/clipboard and product Decimal codecs are unchanged. Existing UTC/calendar domain and explicit-gap contracts remain independently compatible; compressed right offsets retain their bounds, while host-controlled domains own their whitespace.

CSS remains **aapaetsch-charts-market/styles.css** plus the UI-kit stylesheet. No new public tokens or raw standard styling. CSS source entry is unchanged; new markup changes the generated utility set. Previous CSS SHA-256 `bf015d9afbd3fe80862f8b4eba5491d29f9fd74717c3be16819ac342b91008f2`; candidate CSS SHA-256 `afd519231f659706e53944838ce83d7e9a93547f5246091d7ebcfb895ffad8e3`.

## Review findings and fixes

- Theme/availability previously recreated engines and lost local pane geometry: theme/presentation setters and persistent availability overlays now retain the instance.
- Revisioned supplied keys now include accepted dataset identity as well as revision; stale/out-of-order payloads retain the accepted bars and keys.
- The revision gate commits only after React commits; suspended/abandoned higher revisions cannot supersede committed state.
- Inspection refresh now recomputes its x coordinate from economic time, preventing a shifted screen coordinate from clearing valid gap-boundary inspection.
- Equivalent host object-key order no longer rebases drawing history. Tests assert actual emitted exact anchor values/extensions through style/undo/redo.
- Full-history supplied-line projection and drawing scans were removed from ordinary pointer updates: immutable point/line projections are WeakMap cached, study maps reuse point identity, supplied drawing paths use binary visible slices and cached primitives.
- Wheel deltas normalize line/page units, clamp extreme steps and remain cursor anchored. Ctrl/Meta browser zoom stays uncancelled. Keyboard pane resize now forwards user/gesture origin.
- Numeric axis labels compact/scientific-format before ellipsis. Font-dependent badge spacing avoids study/price badge collisions; crosshair labels take priority. Fixed 72px gutters can compact/clip display text; exact values remain in accessible readouts/tables.
- Narrow compact charts retain a visible rail opener. Shared history buttons independently omit missing handlers; Escape releases captured drafts.
- Visual review caught inherited dark ink in the new dark details portal after an initial animation-time axe false negative. The dialog now explicitly owns foreground color; post-animation screenshot, computed colors and dialog axe check pass.
- Story syntax, keyboard focus timing and duplicate favorite/category menu selectors were corrected during validation. Final technical review has no blocking findings.

## Validation

[Required Dev Runner receipt](dev-runner/results.json) and [technical review](dev-runner/technical-review.json): typecheck, package ESM/CJS/declarations/CSS build and production Storybook **47 stories / 15 refinement stories** pass. **147 full-suite tests across22 files** passed before final small fixes/cache; overlapping final **85 focused tests across12 files**, **6 final composite tests**, direct controls/wheel/recreation validation and **5 peer-boundary tests** cover subsequent changes. These overlapping checks are not a claim of232 distinct tests. Latest package suite contains148 tests after the cache regression was added. Final runtime file hashes match Dev Runner.

[Browser evidence](browser/results.json), [supplement](browser/supplement.json) and screenshots/trace cover 1440×900 single charts, 1920×1080 four independent themes, plain line/candles, SMA/ADX, supplied VWAP/approximate unsplit profile, partial/null warmup, unavailable/stale/mismatched, extreme values, short/tall geometry and streaming revisions. Mouse/touch drawing and keyboard creation/nudge/shared undo/redo, external commands, Escape capture cancellation, price-axis scaling/reset, keyboard pane resize and details metadata all pass. Theme/dock/loading/error and current-bar/append updates retain range/manual scale/inspection and one engine instance; stale/wrong-identity snapshots are rejected. Instrumented supplied study calculate/runtime callbacks remain zero; unit guards additionally spy on all financial profile/drawing families in compressed/UTC/calendar modes. No data is acquired.

320/390px horizontal overflow checks pass. Touch pan/pinch/creation/host undo-redo and reduced motion pass in Chromium emulation. 200% zoom uses a half CSS viewport with deviceScaleFactor2 to verify equivalent layout; native Ctrl/Meta zoom pass-through is separately tested. This is not a physical browser-UI zoom or Safari/iPad claim.

Normal-mode WCAG A/AA axe checks and final details dialog have zero findings. Forced colors retains one **color-contrast authored-color diagnostic**: axe reports authored #f8fafc on white while computed/rendered enabled controls use automatic black system ink on white. Raw finding, computed-color evidence and screenshot are preserved in browser/forced-colors-diagnostic.json/.png and the main results. This exception is recorded rather than reported as an unqualified zero-violation forced-colors audit.

[Five calendar browser regressions](calendar-browser/results.json) pass after refinement: sparse/dense UTC/grid alignment, gaps/singletons, linked inclusive windows, no callback echoes, independent resize/themes, keyboard geometry and touch pan, with no page errors. Existing calendar/supplied unit guards retain all family/no-formula checks. Browser screenshot visual inspection confirms compact/readable axes and the corrected dialog.

## Long-history measurement

[Raw dataset/machine/sample/timing/memory evidence](benchmark.json). AMD Ryzen 7 7800X3D 8-Core Processor, 16 logical CPUs, win32 10.0.26200, Chrome 155.0.8059.40, Node v22.22.2. Synthetic 100,000 bars, 200,000 supplied study input points projected to four lines, 100,000 supplied drawing points, two profile rows. Visible-tail window about135 slots, 1440×900. No financial formulas/provider calls. Headless timings describe this local run only.

| Operation | Samples | Median | p95 |
|---|---:|---:|---:|
| Crosshair frame interval | 140 | 16.70ms | 16.80ms |
| Pan frame interval | 140 | 16.70ms | 16.80ms |
| Wheel frame interval | 140 | 16.70ms | 16.80ms |
| Full100k snapshot current-bar revision, ingestion to next frame | 20 | 61.50ms | 90.50ms |
| Full snapshot append | 10 | 58.60ms | 95.40ms |
| Legacy incremental engine replacement synchronous task | 100 | 0.00ms | 0.10ms |

Pointer dispatch tasks were roughly0.1ms median; frame intervals include vsync scheduling. The incremental row excludes full snapshot validation/React/render latency and is not directly comparable to authoritative snapshot latency. Full snapshots intentionally remain O(N); use bounded host batches/update cadence where needed. Fit-all100k was 206.90ms to scheduled frame and is reported separately from bounded viewport interaction.

GC retained JS heap: cold 63.11MiB, after3warmups 127.24MiB, after33updates 127.54MiB, final 127.78MiB. Warm-to-final growth 0.54MiB; navigation/disposal returned to 0.95MiB. Initial warmup retains current/alternate snapshots and derived display projections; the warm samples are stable in this bounded run, not a proof about indefinite sessions. Engine count remained1 with zero reconstruction during updates. Final two UI-only dialog/origin fixes do not alter measured engine/cache paths.

## Dependencies, license and scope

MIT LICENSE and existing NOTICE are included with hashes. No chart vendor or runtime dependency added. External specifiers: aapaetsch-ui-kit, lucide-react, react, react/jsx-runtime.

| Peer | Manifest range | Tested installed version | License |
|---|---|---|---|
| aapaetsch-ui-kit | >=0.2.0-beta.1 | 0.2.0-beta.1 | MIT |
| lucide-react | >=0.474.0 | 0.474.0 | ISC |
| react | >=18.0.0 <20.0.0 | 19.2.8 | MIT |
| react-dom | >=18.0.0 <20.0.0 | 19.2.8 | MIT |

The installed UI workspace retains its pre-existing beta.1 manifest; no peer was downloaded/installed. The separately frozen/published UI-kit beta.2 artifact is independently reviewed. Existing lucide-react0.474.0 native CommonJS boundary repair is unchanged, with check-only verification and five tests passing. A fresh affected consumer installation still needs the previously approved explicit guarded repair; no install hook/new repair was added.

[Scope audit](scope-audit.json) confirms changes only in charts-market/, docs/ROADMAP.md and this validation directory for refinement, with no new files outside that allowlist. Root manifests/lock, unrelated source and HEAD are unchanged. Seven preserved prior artifacts plus both prior source archives verify unchanged. Separately authorized DashboardGrid publication receipts live in their own publication directory. No refinement publication, product integration, OpenBB/provider/database operations, downloads or cross-chat messages were performed.

The product component/adapter hashes remain unchanged. Two read-only product documents changed concurrently outside this task; both before/after hashes are retained, so this review does not falsely claim every product evidence file stayed static. This task performed no product writes. Real cached evidence in both accounts, physical Safari/iPad and financial release gates remain downstream responsibilities.

Approval, if granted later, must name the package and source hashes above. Do not rebuild/repack for publication; promote these exact archives through the established provenance/staged publication process. Product artifact/tree approval remains a separate gate.
