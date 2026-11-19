# Price-series thickness implementation and release request

Prepared November 18, 2026 against source HEAD
`c8a3ee6bd033a68aba271fb31ef68f41c684eef7` plus the local implementation diff.
This is an implementation review, not publication or consumer-install approval.
The unrelated untracked security report was preserved.

## Public contract

`MarketChartPresentation.line?: {width?: number}` is exported through the package
root and `/core`, and inherited by `TechnicalChartAppearance`. The public
`TechnicalChartView.appearance.line.width` needs no naming adjustment. Range:
finite CSS pixels 0.5–5 inclusive; omitted default: 2. Invalid values throw the
existing presentation-validation error at engine construction/runtime updates.

Built-in line/area/baseline price strokes use the width; isolated observations
use centered squares of side `2 * width`. Default geometry remains 2px/4px.
The baseline reference remains 2px. Existing candle/bar, indicator, drawing and
crosshair-marker controls are independent. No new component/selector is added.
See [API and host mapping](../../charts-market/PRICE-SERIES-THICKNESS.md).

Only presentation scalars and Canvas painting change in production code. Shared
coordinates, supplied gap/session segmentation, pixel transforms, scale logic,
viewport, keyboard interaction, financial calculations and request generation
retain their existing paths. Per-chart persistence belongs to the host.

## Review scope

- Production: `charts-market/src/core/presentation.ts` and
  `charts-market/src/engine/series-renderers.ts`.
- Tests: `charts-market/src/engine/line-width.test.ts` and
  `charts-market/src/components/technical-chart-view/line-width.test.tsx`.
- Stories: `charts-market/src/components/technical-chart-view/line-width.stories.tsx`, nine comparisons covering
  all six line/candle/bar choices, themes, desktop/narrow, density and gaps.
- Documentation/metadata: `charts-market/README.md`, `charts-market/package.json`,
  `charts-market/PRICE-SERIES-THICKNESS.md`,
  `charts-market/src/components/market-chart/README.md`,
  `charts-market/src/components/market-chart/agents.md`,
  `charts-market/src/components/technical-chart-view/README.md`,
  `charts-market/src/components/technical-chart-view/agents.md`, `docs/ROADMAP.md`,
  this review, and `implementation-plans/price-series-thickness-todo.md`.
  Package `files` includes the API document.
- No dependency, package version or lock changes. No consumer writes, downloads,
  publication, push, credential or service changes.

## Release request

After source review, prepare a new immutable version through the existing staged
npm/provenance workflow. Do not publish the unchanged workspace version
`0.1.0-beta.2` as this feature. Freeze exact version, source binding, archive,
hashes/integrity, license/dependency evidence and compatibility verification in
that release review before requesting publication approval. Preserve older
sealed artifacts; do not rebuild approved bytes during promotion.

The current source includes earlier chart features. Its fullscreen portal API
requires coordinated compatible UI/chart versions and a peer minimum guaranteeing
the UI portal capability; the existing broad peer range is insufficient evidence.
See [existing integration requirements](market-feature-releases.md). This small
feature does not resolve or authorize that separate release decision.

Portfolio must separately approve exact published package/resolution/complete
lock, scripts-disabled installation, its per-chart Thin/Thick mapping/save flow
and deployment. No product rollout or physical-device acceptance is claimed.

## Verification

- Independent Dev Runner: 584 market tests in 70 files pass, including 19 new
  width checks. Market strict typecheck and aggregate icons/UI/charts/market
  ESM/CJS/declaration/CSS build pass.
- Storybook production build passes: 1,950 stories and 270 docs, including all
  nine new comparison stories. Package dry-run includes the new API document.
- Scoped ESLint on production changes and new tests passes without diagnostics.
- Installed headless Chrome verified all nine built Storybook comparisons:
  six rendered charts per story, named/focusable Canvas elements, ArrowRight
  keyboard interaction, no page errors or horizontal page overflow. Narrow
  cases use 390px viewport and 2x device scale; desktop uses 1440px and 1x.
  Desktop, narrow and gap screenshots were visually inspected for thickness,
  singleton placement, segmentation and layout.
- Renderer tests record actual Canvas stroke calls at widths 0.5/1/2/3/5,
  omission and device ratios 1/1.5/2/3. Default marker geometry is unchanged;
  supplied time coordinates and gaps are identical. Runtime engine tests retain
  scale coordinates, viewport and inspection with no viewport callback echoes.
- Composite tests preserve supplied request keys, serialized state and drawing
  history, keep one engine, and observe zero fetch/calculate/runtime calls.
- Browser checks cover basic accessible names and keyboard focus/interaction.
  No new axe, physical-device or screen-reader audit is claimed. Existing market
  interaction/data-table tests pass in the full suite.

Build warnings are nonfatal: existing declaration circular reexports, Storybook
sourcemap location diagnostics/large chunks, ambiguous Tailwind easing utilities
and outdated Browserslist data. No dependency update was performed.

Local logs and `browser-results.json` are in `.chart-thickness-validation/`;
screenshots are in `output/playwright/price-thickness-*.png`. These generated
directories are ignored; source/tests/stories above are portable. The local
package dry-run is validation evidence only, not a frozen publishable artifact.

Implementation is complete and ready for source review. Publication readiness
still requires the exact immutable release/peer coordination described above.

November 19: the owner authorized commit and publication. Source is committed and
the immutable candidate uses the existing exact portal-capable UI peer. See
[publication progress and artifact identity](price-series-thickness-publication.md).
