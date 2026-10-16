# Publication review — calendar coordinates and gaps

October 16, 2026. **Implementation and local validation complete. This new candidate is not published.**
The prior supplied-results release and its approvals/artifacts remain preserved.

## Exact candidate for separate approval

- Package: **aapaetsch-charts-market@0.1.0-beta.1-calendar.20261016.1**; proposed npm tag: **beta**.
- [Immutable package](candidate/sha256-30a08c14dfa74d61e9ac38c9168576a1e2f479b8dde75ab34412c4d90814e274.tgz): **432600 bytes**, 70 packed files.
- SHA-256: `30a08c14dfa74d61e9ac38c9168576a1e2f479b8dde75ab34412c4d90814e274`.
- Integrity: `sha512-KffwukirPNT4lVf7l4o4hwwVh9FtYVYy5m7Fk8XxF1Jtu8vSo+3fzt0p1T1JF3R9SwQsWv57dGSjuFbp90QwzA==`.
- [Manifest, inventory and per-file hashes](candidate/manifest.json), [npm pack result](candidate/npm-pack.json), [evidence hashes](artifact-evidence.json).
- [Immutable source snapshot](candidate/source-sha256-66a8f43f8b9a044f99333b4eba1d9955b766d7c2951b9755986a8bda7742f0f0.tgz); SHA-256 `66a8f43f8b9a044f99333b4eba1d9955b766d7c2951b9755986a8bda7742f0f0`.
- Local baseline HEAD: `9b8cbb69847ac701dc0d99cd545727ccb833a5a6`. Existing dirty work was preserved. This is an artifact/source-bound candidate, not a claim of a clean commit-built release.

## Delivered behavior and public contract

Both MarketChart and TechnicalChartView add optional runtime **timeAxis** and **discontinuities** props. Default compressed behavior and its 120-bar initial window are preserved. UTC mode positions elapsed seconds inside an explicit host domain; calendar mode positions a shared host grid and interpolates time geometry between grid entries. Neither creates observations or sessions. Right offsets have no geometric effect in host-controlled modes; desired whitespace belongs in the host domain/grid.

Gaps are explicit open UTC intervals. Price lines/areas, supplied studies and supplied VWAP paths split at gaps; nulls also split supplied paths. Isolated samples remain visible. SVG geometry/handles are clipped across gaps, with a three-CSS-pixel boundary footprint; pointer hits ignore gap interiors. Drawing keyboard nudges use host display units. Study coordinates/inspection match their own UTC times, rather than an OHLC index.

Calendar/UTC range callbacks use inclusive numeric UTC seconds and are independent of observation density. External visibleRange wins over stale logicalRange; withMarketVisibleRange removes that stale field and preserves other options. Controlled calendar/data updates do not emit viewport callbacks, and unchanged ranges are suppressed. Same-instant windows expand to one display unit, clamped to the domain. The host maps its exclusive product ends using supplied bar-start/end metadata; no guessed interval or next-session rule is added.

Exact types, fields, method semantics and adapter example: [CALENDAR-COORDINATES.md](../../charts-market/CALENDAR-COORDINATES.md), also included in the tarball. Root and /core export MarketTimeAxis, MarketTimeGap, validateMarketTimeGeometry, crossesMarketTimeGap, isMarketTimeInGap and withMarketVisibleRange. Engine options accept the same geometry; engine ports add optional setTimeAxis/setDiscontinuities/shiftTime. Renderer contexts add optional time/continuity callbacks. DrawingLayer adds discontinuities; LogicalTimeScale exposes the geometry conversions described in the contract. Custom price renderers must honor the optional continuity callback.

Styles remain **aapaetsch-charts-market/styles.css** plus **aapaetsch-ui-kit/globals.css**. No new public stylesheet/theme token. Status text now explicitly uses CanvasText in forced-colors mode; Dev Runner verified the rule in both generated stylesheets. Version-1 chart state, drawing/clipboard serializers and opaque extension handling are unchanged; runtime axis/gap inputs are reapplied by the host. The product's separate Decimal codec and exact tables/CSV remain host-owned. Supplied request/result mappings and all financial guards remain unchanged.

## Validation and evidence

- Independent [Dev Runner](dev-runner-results.json): **123 market tests across 18 files**, **five peer-boundary tests**, check-only peer verification, typecheck, ESM/CJS/DTS/DCTS/CSS build and scoped production Storybook all pass. The final status-color-only edit was rebuilt/typechecked and browser-validated after the 123-test runtime pass.
- [Calendar regressions](../../charts-market/src/engine/calendar-gaps.test.ts): dense/sparse daily and intraday alignment, whitespace index rejection without store mutation, UTC weekends/DST, empty/same-day windows, resizing, inclusive range round-trips, stale logical bounds, callback echo rejection, price line/area/baseline segmentation and singleton visibility, sparse study inspection, programmatic missing-slot clearing, supplied VWAP null/gap splitting. DrawingLayer has a separate endpoint clipping regression.
- Supplied financial guards run all eight study families, three profiles, both VWAPs, data tables and drawing hit testing under **compressed, UTC and calendar** modes. Producer calculation/createRuntime callbacks throw if called; profile/VWAP/regression/range/position spies remain at zero. Calendar metadata never enters OHLC, volume, study inputs, visibleData, tables or exports.
- [Five calendar stories](browser/results.json), Chrome **155.0.8059.40**: identical same-UTC coordinates across four dense/sparse charts; daily/intraday UTC and grid fixtures; overnight/missing sessions/weekends/DST; singleton observations; fixed same-day bounds; compact/expanded boards; keyboard zoom/pan; stable linked callbacks; geometry create/nudge/delete; independent resize/normalized alignment; unique SVG IDs and light/dark/midnight themes. Touch pan updates the common range. Zero page errors, horizontal overflow or axe WCAG A/AA findings, including narrow, forced colors and reduced motion checks.
- [Fifteen historical supplied stories](legacy-browser/results.json): valid/partial/loading/unavailable/stale/missing-volume, palettes, narrow, forced colors, reduced motion, 200% zoom, four independent charts and compact linked boards. All have zero axe violations/overflow/page errors. [Supplemental](legacy-browser/supplemental.json) checks portaled midnight tokens, picker/table accessibility, keyboard favorite and pointer drawing creation; [touch](legacy-browser/touch-drawing.json) checks drawing creation and handle edits.
- [Packed consumer](consumer-results.json): **155 root exports** have exact native ESM/CommonJS name parity; every JavaScript subpath loads in both formats. Both public type consumers compile with NodeNext. TechnicalChartView server-renders supplied/calendar props in both modes (**28131 HTML bytes** each). Node v22.22.2; no loader override or import-only condition.
- Screenshots and traces are under browser/ and legacy-browser/. Manual visual inspection confirms sparse blank regions and aligned dense/grid coordinates. The initial full-history performance regression, missing-slot programmatic crosshair, endpoint SVG clipping and forced-color status text findings were corrected before this final candidate.

## Artifact, dependencies and scope

MIT LICENSE and NOTICE are included with per-file hashes. Compiled external specifiers: `aapaetsch-ui-kit`, `lucide-react`, `react`, `react/jsx-runtime`. No chart-vendor source/runtime or dependency was added.

| Peer | Manifest range | Tested local version | License |
|---|---|---|---|
| aapaetsch-ui-kit | >=0.2.0-beta.1 | 0.2.0-beta.1 | MIT |
| lucide-react | >=0.474.0 | 0.474.0 | ISC |
| react | >=18.0.0 <20.0.0 | 19.2.8 | MIT |
| react-dom | >=18.0.0 <20.0.0 | 19.2.8 | MIT |

**Existing native CommonJS compatibility condition retained:** the affected lucide-react@0.474.0 artifact requires the previously approved explicit CommonJS boundary repair. The already-installed boundary is unchanged, check-only verification passes, and this package retains the guarded helper without an install hook. A fresh affected installation must run its explicit repair under the consumer's dependency approval. No new repair, install or dependency download occurred in this follow-up.

[Scope audit](scope-audit.json) confirms only charts-market/ and docs/ROADMAP.md source changes, with new evidence under .chart-supplied-validation/calendar-gaps/. Root manifests/lockfile and baseline files are preserved; no deletions. The five read-only product evidence files have unchanged hashes. HEAD remains 9b8cbb69847ac701dc0d99cd545727ccb833a5a6. Prior published artifact SHA-256 **bf213e605fe719e5afc11d141f7d05909157bd6c163c7c3437b2317099f31b48** is unchanged. No product/OpenBB writes, provider calls, databases, financial release, npm download/publication, product installation, commits, pushes, PRs or cross-chat messages were performed by this follow-up.

## Limits and release gate

The host must supply the common domain/grid, observation-free gap interiors, valid producer results and exclusive-end metadata. Grid geometry does not extrapolate beyond the supplied grid. Unobserved times from drawing coordinate conversion are geometry and must not be treated as observations. Pixel endpoint footprints are intentionally retained. Root and peer constraints from the prior supplied release still apply; this candidate does not change product installation policy.

Browser verification used installed headless Chrome and emulated touch/forced colors; hardware touch devices, every browser/Electron version and live assistive-technology sessions were not tested. Axe cannot measure Canvas pixels; visual inspection and renderer regressions supplement it. Canvas palettes are read at engine creation/themeRevision; hosts changing OS forced-colors while an existing canvas remains mounted should refresh themeRevision/remount. Existing nonfatal Storybook source-map/Tailwind/eval/chunk-size warnings remain; the relevant scoped build succeeds.

Proposed publication procedure after approval: stage this exact content-addressed tarball under beta through the provenance-enabled release path; compare the staged download's SHA-256/integrity and signed attestation subject; obtain human npm security-key approval; then verify public bytes, beta tag and provenance. Bind the package, source snapshot and evidence to an immutable GitHub prerelease as in the prior release. Do not rebuild different bytes under this reviewed version. Product installation remains a later gate.

**Separate owner approval of this exact version/hash, proposed beta tag, provenance plan and retained peer compatibility condition is required before publication.** The implementation follow-up expressly excludes publication, product dependency changes and cross-chat messages. Prior release approvals do not authorize this new candidate. Chart Boards can migrate only after its later exact-version/dependency approval.
