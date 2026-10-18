# aapaetsch-ui-kit Component Library Roadmap

TechnicalChartView volume axis follow-up (2026-10-17): ✅ Complete locally — explicit dedicated volume-only panes now use one normal zero-based supplied-unit scale for axis and histogram, independent of the legacy global volume flag. Exact published defect reproduced;47focused tests plus5final volume regressions, typecheck, isolated package build,59-story Storybook and6browser cases pass. Existing overlay, OHLC, supplied/calendar and serializer contracts retained. Product revision fixture passes snapshot/replacement/stale/new-identity pairing. Published refinement.20261017.1 archives remain immutable; exact engine patch is a separately reviewed proposal under .chart-refinement-validation/volume-axis-followup/. No new component or serialized field; no publication or product edit.

Original icons (2026-10-17): ✅ Complete — `aapaetsch-icons@0.1.0-beta.0` provides 158 original rounded-outline icons, typed React/raw SVG delivery, deterministic generation and a searchable Storybook catalog. All 157 legacy names and three type imports are migrated across maintained UI/chart source and stories; root dependency tree and lockfile contain no Lucide package. Local UI/market candidates are `0.2.0-beta.3` / `0.1.0-beta.2`. Independent checks passed 260 tests and all package/Storybook builds; packed React 18/19, Next.js server/client, browser/theme/size and representative axe checks passed. See docs/roadmap/icons.md and docs/evidence/icons-implementation.md. Tracked separately from UI-component counts; nothing published or installed into the portfolio app.

This file is an index to the roadmap subfiles. Open any referenced file below to view that section in full — for LLM use, fetch only the subfile(s) you need.

## Roadmap sections (LLM-friendly references)

- Original Icons Package: `aapaetsch-icons` status and migration
  - FILE: `docs/roadmap/icons.md`

- Overview: short context and summary 
  - FILE: `docs/roadmap/overview.md`
- Components: core/layout/utility lists 
  - FILE: `docs/roadmap/components.md`
- Advanced Components: implemented & planned 
  - FILE: `docs/roadmap/advanced-components.md`
- Charts Package: `aapaetsch-charts` status and public surface
  - FILE: `docs/roadmap/charts.md`
- Market Charts Package: `aapaetsch-charts-market` architecture, features and release gates
  - FILE: `docs/roadmap/charts-market.md`
- Templates: page layouts and application shells 
  - FILE: `docs/roadmap/templates.md`
- Development Phases: phase checklist & progress 
  - FILE: `docs/roadmap/phases.md`
- Guidelines & Notes: complexity criteria and decisions 
  - FILE: `docs/roadmap/guidelines.md`
- Changelog: chronological changes 
  - FILE: `docs/roadmap/changelog.md`
- Toast Research: deep-dive on toast patterns & a11y 
  - FILE: `docs/roadmap/toast-research.md`
- Existing Components Snapshot: compact checklists 
  - FILE: `docs/roadmap/existing-components.md`

---

LLM hint: look for the `FILE:` marker then open that path if you need the full section. Each subfile contains the original content extracted from this roadmap.



TechnicalChartView: ✅ Complete — implementation, 94 market tests, browser/accessibility/performance checks, and independent build/Storybook verification passed. See `docs/roadmap/charts-market.md` for the component checklist and counts.

TechnicalChartView usability refinement: ✅ complete; independent build/Storybook, 94 tests and final production browser verification passed. Earnings, OHLC, VPVR, axis badges and oscillator readability are covered.

TechnicalChartView VPVR density refinement: ✅ complete; the default derived profile now uses 24 broader price rows for larger, more legible bars. All 95 market tests, root typecheck, package build and independent Storybook build passed.

TechnicalChartView supplied-results: ✅ Implementation complete (2026-10-15) — controlled producer studies/profiles/VWAP, zero-formula guards, independent light/dark/midnight portals, UTC ranges, geometric history, compact boards, 110 passing market tests, package typecheck/build and scoped Storybook/browser verification. Existing component count is unchanged. Immutable local candidate/publication review is in .chart-supplied-validation; native CommonJS completion now has a verified, explicit peer-boundary repair; see the CommonJS follow-up below. Publication and product installation remain separate gates.

TechnicalChartView CommonJS completion (2026-10-15): ✅ guarded, opt-in repair of the locked lucide-react CJS boundary; native consumer verification and refreshed publication evidence prepared. No dependency version or root lockfile change; component count unchanged.

TechnicalChartView supplied-results publication (2026-10-16): ✅ Published `aapaetsch-charts-market@0.1.0-beta.1-supplied.20261015.1` on [npm under beta](https://www.npmjs.com/package/aapaetsch-charts-market/v/0.1.0-beta.1-supplied.20261015.1) and as an [immutable GitHub prerelease](https://github.com/aapaetsch/AgentixUI/releases/tag/market-candidate-v0.1.0-beta.1-supplied.20261015.1). Stage-only upload, downloaded-byte verification and human security-key approval completed. Public npm download matches reviewed SHA256 `bf213e605fe719e5afc11d141f7d05909157bd6c163c7c3437b2317099f31b48`; registry SLSA provenance signature, workflow identity, subject and commit verified. Portfolio received the exact npm version and integrity to continue migration. Component count unchanged.

TechnicalChartView calendar gaps (2026-10-16): ✅ Implementation complete — additive host-owned UTC/calendar coordinates and discontinuities, independent sparse/dense study coordinates, whitespace inspection, singleton rendering and linked calendar viewports. 123 market tests plus five peer tests, typecheck, package/Storybook builds and 20 browser stories passed; browser checks include themes, four-instance linking, no callback echoes, independent resizing, keyboard/touch, forced colors and reduced motion. Compressed defaults and version-1 serializers retained. Component count unchanged. Local candidate `0.1.0-beta.1-calendar.20261016.1` requires its own publication approval; evidence under `.chart-supplied-validation/calendar-gaps/`.

DashboardGrid (2026-10-16): ✅ Complete — controlled content-agnostic sequential packing, four/two/one-column container projections, edit-only pointer capture/resize/move, keyboard and tap commands, live announcements and cancellation/edge scrolling. All width/height variants, arbitrary content and 14 Storybook states documented. UI typecheck, 75 UI tests (26 DashboardGrid), independent UI build/Storybook and browser/accessibility/performance checks passed. Twenty-four-card preview samples caused no content renders, remounts or data callbacks. See docs/dashboard-grid.md and .dashboard-grid-validation/PUBLICATION-REVIEW.md for exact artifact identity, forced-colors axe diagnostic and browser-emulation limits. One new complete component (+1 to the existing component count); no other component status changed. Local candidate only; publication and product exact dependency/lock acceptance remain separate gates.

TechnicalChartView research refinement (2026-10-16): ✅ Complete — additive runtime presentation, compact supplied evidence/details, total-height geometry, supported shared drawing rail/commands/history and accepted dataset revisions. Theme/loading/error, range/manual scale/inspection/panes and drawing history retention verified; version-1 serializers and supplied-only guards retained. Dev Runner: 147 full-suite tests plus overlapping final focused/composite checks, five peer tests, typecheck, package and 47-story Storybook builds passed. Fifteen new synthetic stories, mouse/touch/keyboard, four themes, narrow/zoom/system modes, five calendar browser regressions and 100k-history benchmark documented under .chart-refinement-validation/. Forced-colors authored-color axe mismatch retained with rendered-system-color diagnostic; physical Safari/iPad remain downstream checks. Exact local refinement candidate requires separate publication/adoption approval. Component count unchanged.

TechnicalChartView inline OHLC card fit (2026-10-17): ✅ Complete — labels and values remain inline/baseline-aligned at every width; whole pairs wrap within two lines below the pane legend, with exact supplied title/aria values and bounded value ellipsis. Existing appearance/geometry controls, version-1 serializers and supplied revision/state guards retained. Dev Runner typecheck,23 focused tests, package build and56-story Storybook pass;22 browser cases verify320/390px, dense boards, Light/Dark/Midnight, long values,200% equivalent layout and streaming retention, with no page errors or audited axe findings. Prior immutable candidates preserved; new exact local candidate requires separate publication/dependency approval. Component count unchanged.
