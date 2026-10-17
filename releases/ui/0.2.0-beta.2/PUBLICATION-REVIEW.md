# DashboardGrid publication review

Status: implementation and local validation complete. **Not published and not installed in Portfolio.** The owner-authorized implementation scope ends at this immutable local candidate. Exact publication approval is separate; product exact dependency/lock approval and consumer acceptance follow publication. No financial release is authorized.

## Exact candidate

| Field | Value |
| --- | --- |
| Package | aapaetsch-ui-kit@0.2.0-beta.2 |
| Proposed tag | beta |
| Immutable package | candidate/sha256-20c54619e271fa83ba78b9ecb362abe3aafda15b073650872a506e790eb7c56e.tgz |
| SHA256 | 20c54619e271fa83ba78b9ecb362abe3aafda15b073650872a506e790eb7c56e |
| Integrity | sha512-oS5ig4AWHoWWGryPmbLBCqgLCp5yVQoiBbyKV/mO8JCDvsuwsCGQ5tVAR7OjFo8Lv+H/TAbZgf9/qsUZEo4Kzg== |
| Size | 2350725 bytes |
| Packed inventory | 55 files, individually hashed in candidate/manifest.json |
| Immutable source | candidate/source-sha256-6bb89c468f8e25f103d3ff8bc0006d656a81db8f9341c38214abc29d9bbe3761.tgz |
| Source SHA256 | 6bb89c468f8e25f103d3ff8bc0006d656a81db8f9341c38214abc29d9bbe3761 |
| Source inventory | 657 UI/build/Tailwind-scan inputs, individually hashed |
| Local baseline HEAD | 9b8cbb69847ac701dc0d99cd545727ccb833a5a6 |
| Existing source state | Dirty before this task; preserved and captured by source identity |

The version was already 0.2.0-beta.2; no manifest/lock/version change was made. Fresh registry metadata at preparation showed only 0.2.0-beta.1 published, with latest/beta pointing there; candidate version was unused. Recheck before any approved staging. This is the complete existing UI-kit package plus DashboardGrid, including its pre-existing subpaths, rather than a grid-only package. Review exact inventory/source and preserved dirty baseline before publication. Use the content-addressed tarball directly, with stage-only upload and CI provenance; never rebuild/repack between exact approval and staging. Human npm authentication remains a separate interactive step if required. Future provenance must bind this package SHA and source archive, with public downloaded-byte verification.

No dependencies were added/downloaded, no product install was performed, no local commit/push/PR was made. Existing root build outputs were regenerated with build:ui only. The independently approved calendar publication is separately receipted under .chart-supplied-validation/calendar-gaps/publication; it did not mutate the frozen calendar candidate/review/source.

## Delivered API and ownership

Runtime exports through normal UI-kit root: DashboardGrid, dashboardGridConstraints, validateDashboardGridItems, dashboardGridColumns, projectDashboardGridWidth, packDashboardGrid, applyDashboardGridCommand, snapDashboardGridHeight, findDashboardGridInsertion.

Types: DashboardGridProps, DashboardGridHandle, DashboardGridItem, DashboardGridWidth, DashboardGridColumns, DashboardGridPlacement, DashboardGridCommand, DashboardGridHitRect, DashboardGridInsertion.

Required props: items, editing, onItemsChange, renderItem, getItemLabel. Optional disabled, onAnnouncement, className/style, known root identity/ARIA attributes and data-* attributes. See src/components/dashboard-grid/README.md and docs/dashboard-grid.md for exact declarations and client example. Ref execute(command) shares strict mutation/announcement semantics; ref cancel() discards transient work. Commands use final canonical zero-based insertion indices or exact canonical width/height. Disabled/read mode ignores ref edits. Built-in controls and the polite live region remain available to hosts without their own menus.

Items contain only stable id, canonical width 1/2/3/4, and integer height 240..720 in steps of 40; at most 24 unique nonempty IDs. Invalid controlled geometry and invalid commands throw. The shared pure commit path emits only these fields; product merges opaque settings by ID. No-op commands, measurements and orientation do not emit changes. The engine owns no data, account/provider access, storage, financial formulas, revision/serializer, content configuration, Add/Remove/Duplicate or Save/Cancel. Product owns drafts and failed-save handling. No v1 serializer change is needed.

Sequential four-column row packing has exact 12 CSS-pixel gutters and tallest-card row heights, without backfill. Container content width >=1100 uses four columns, 640..1099 two (canonical 1/2 -> one, 3/4 -> two), and below 640 one. Projection preserves persisted geometry/order. Tablet pointer width changes choose canonical 2/4 when a horizontal step changes; vertical-only changes retain starting canonical width. One-column pointer resizing changes only height. Tap/keyboard paths still expose every width.

Dedicated edit handles have 44 CSS-pixel targets, pointer capture and an 8-pixel threshold. Only move/resize handles use touch-action:none. Read mode has no handles/layout pointer listeners or frame/header. Body content stays interactive in edit mode. Move uses a label ghost/insertion marker; resize shows snapped transient geometry. No expensive content render/data callbacks run during previews. Stable keyed siblings preserve instances across reorder/resize; a size commit may rerender its content wrapper. Hosts should keep renderItem stable while captured content is unchanged, update callback identity for changed settings/data, and reserve upper-right room for edit controls.

Move keyboard: Space/Enter starts/commits, arrows choose insertion, Escape cancels. Resize arrows change width by one logical column or height by 40 pixels. Relative-card Move before/after and width/height menus provide tap alternatives. Announcements report label, result and cancellation. Focus follows stable handle ID; DOM/tab order follows canonical order. Escape, pointercancel, capture loss, rotation/container-width change, external geometry, edit exit, disabling and unmount discard transient work; capture/listeners/frames are cleaned up. Edge auto-scroll uses the nearest scrollable ancestor or viewport.

## Styles and module boundaries

Load aapaetsch-ui-kit/globals.css once. No separate grid CSS is required. Token classes use the existing UI theme and primitives; dynamic inline styles describe geometry only. className is merged last. Dark tap portals copy local token variables; forced-colors controls/marker/ghost use system colors; previews have no positional/size animation and respect reduced motion.

Normal root: 662 ESM/CJS exports with exact parity. Existing finance and templates/investment-ops subpaths and conditional server outputs were checked for parity and file existence. Packed CSS is 136201 bytes, SHA256 64b2c08fdac2e885643510b76f8e7b40c7c9d13963a1557274df049136b7d2bd. A production browser harness imported the extracted candidate module and this exact CSS; keyboard reorder/resize, geometry, 44-pixel targets and axe passed.

DashboardGrid must be imported inside a React client boundary. The unchanged server-safe root conditional entrypoint exports 83 existing symbols and deliberately excludes DashboardGrid; a real node --conditions=react-server import passed. Conventional React SSR of DashboardGrid passed for ESM and CommonJS, producing identical 888-byte markup at one column before client measurement. NodeNext strict ESM/CJS consumer compilation passed for all nine public types and runtime names. React/ReactDOM peers remain >=18 <20; verification used the existing installed 19.2.8 pair. No additional React version was installed/tested.

Root tsup already bundles selected Lucide icons under its existing noExternal configuration, with ISC text retained in THIRD_PARTY_NOTICES. Native CJS imports of every packed UI-kit runtime subpath pass. No new Lucide peer repair was introduced by DashboardGrid. Existing dependencies, declared pins, installed versions/licenses and manifest hashes are recorded in candidate/manifest.json. MIT LICENSE, NOTICE and THIRD_PARTY_NOTICES are present and hashed. This is an inventory/unchanged-boundary check, not a new dependency installation or a full dependency security audit.

## Validation

- Required independent Dev Runner: UI typecheck; 75 UI tests across 12 files, including 26 DashboardGrid tests; build:ui; scoped production Storybook with 14 indexed fixtures. No blocking review findings. Logs and results: dev-runner/.
- Pure tests: all canonical width/height combinations, breakpoints, sequential row heights/order, insertion/reorder, strict invalid/duplicate/25th-item rejection, opaque-field exclusion and snapping.
- Component tests: no read-mode layout interception, container/rotation no change, keyboard focus and retained input state, pointer threshold/single commit, every cancellation path and zero remaining fake frames/timers; 20 preview frames without content render callbacks.
- Production browser: all 14 stories mount without page errors, geometry overlap or horizontal overflow; mouse and native CDP touch move/resize at four/two/one columns; tap/subthreshold no-op; canonical tablet vertical preservation; keyboard and relative tap controls, announcements, focus/DOM order; nine cancellation scenarios; nearest-ancestor edge scroll/stop; host failed save. External command cancellation emits only the independent host command, never the abandoned gesture.
- Content isolation: stateful counters, chart pointer/wheel/drag, links, native viewport wheel scrolling, content menus/dialog input and popover focus return work in read/edit mode. Dark tap portal axe passes including contrast. Native read-mode touch-action remains auto.
- Accessibility: WCAG2 A/AA and WCAG2.1 AA axe checks for all 14 fixture states and production packed consumer; ordinary light/dark checks include contrast. Forced-colors structural checks exclude only axe color-contrast for the documented diagnostic below; system-colored control/marker/ghost computed styles and screenshots were checked. Reduced-motion transitions are 0s and animations none. Native pinch synthesis did not change headless viewport scale, so native pinch behavior is not claimed as empirically validated. There is no engine read-mode preventDefault/touch-action override, and scrolling/body interaction checks pass.

Fixtures cover 0/1/8/24 items, arbitrary interactive slots, mixed widths/heights, long titles, loading/unavailable content, read/edit/disabled modes, four/two/one columns, dark/high contrast/reduced motion and host save failure. No real financial/product data is embedded.

## Performance evidence

Windows x64, AMD Ryzen 7 7800X3D 8-Core Processor (16 logical CPUs), Chrome 155.0.8059.40, headless production Storybook, 24 interactive children with deterministic expensive render work. Each gesture drove 70 pointer updates; animation-frame samples are recorded rather than inferred from pointer-event timestamps.

| Gesture | Frame samples | Median interval | p95 interval | Maximum interval |
| --- | ---: | ---: | ---: | ---: |
| Move | 301 | 8.3 ms | 8.4 ms | 8.7 ms |
| Resize | 294 | 8.3 ms | 8.4 ms | 8.5 ms |

For both active-preview and cancellation snapshots: mounts stayed at 24, unmounts at zero, renderItem/render counts and data callbacks stayed unchanged; layout commits stayed zero. The fixture initialized one mock data callback per child. A separate committed reorder retained instances and one pointer commit emitted once; resize commit may render its one resized wrapper. Raw frames, before/active/after counts, machine/browser and profiler samples are in browser/results.json; trace.zip and screenshots are retained. These intervals describe this machine, not a cross-device performance guarantee. No physical iPad/Safari validation is claimed.

## Forced-colors diagnostic and remaining limits

Chrome computed the fixture foreground as rgb(0,0,0) and card background as rgb(255,255,255), with forced-color-adjust:auto; screenshots confirm system colors. Axe color-contrast instead evaluated the original dark-token foreground #f8fafc against the forced white background and reported 1.04:1. The complete original report and computed styles are retained in browser/forced-colors-diagnostic.json. Its rule is excluded only while forced-colors media is active; it remains enabled in normal light/dark and packed-consumer checks. This is a recorded tool limitation, not an unqualified zero-violations claim for that initial report.

Browser touch is CDP emulation in installed Chrome, not physical iPad/Safari. Native pinch synthesis produced no scale change in this environment and remains unverified on hardware. Host rendering/data ownership, SSR client-boundary requirements and edit-overlay space are documented above. No new package dependency was needed. Pre-existing Tailwind ambiguous-easing and Storybook chunk/sourcemap warnings are nonfatal and outside this scope.

## Scope and immutable evidence

Final audit: 657 frozen source inputs and 55 packed entries verified, zero scope violations/deletions, local HEAD unchanged. Existing src/index.ts and docs/ROADMAP.md content is byte-preserved with only additive DashboardGrid sections; src/react-server.ts is unchanged. New writes are confined to src/components/dashboard-grid/, docs/dashboard-grid.md and .dashboard-grid-validation/. Existing manifests/locks, chart source, prior chart package hashes/calendar manifest/review remain unchanged. Generated UI dist matches the packed candidate exactly.

The read-only Portfolio architecture document changed concurrently during the task (before 0d097ace181df2a1943e626c00896d8162a338cbf8732bdb50a85b4738a0ef5a; observed after aefabaa43c02edb4bc93879282c73fbb311fc4db93854602684479343121b08c). This task issued zero product writes; other captured product contract/source files remain at baseline hashes. The independently authorized calendar completion notification was sent to its exact requesting Portfolio chat; no DashboardGrid cross-chat handoff was sent.

Evidence hashes: artifact-evidence.json binds manifest, scope/consumer/final audits, Dev Runner results, browser/supplement/packed-consumer receipts and forced-colors diagnostic. candidate/manifest.json binds every package entry, source input, dependency manifest, license/notice and export map. Do not rerun candidate preparation or rebuild these approved inputs after reviewing this identity; create a new candidate if code changes.

Approval boundary: publication of precisely aapaetsch-ui-kit@0.2.0-beta.2, tag beta, package SHA256 20c54619e271fa83ba78b9ecb362abe3aafda15b073650872a506e790eb7c56e, source SHA256 6bb89c468f8e25f103d3ff8bc0006d656a81db8f9341c38214abc29d9bbe3761, under provenance-enabled staging requires separate explicit owner approval. Product exact dependency/lock installation and acceptance remain separately gated. Until then its existing live layout remains the consumer renderer.
