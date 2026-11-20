# OHLC tick-width release

User authorized commit and publication of the reviewed OHLC tick-width changes
on November 19, 2026. Source commit:
`a79be92ccbf4a972c2a587652562f1ec9f461a43`.

Package: `aapaetsch-charts-market@0.1.0-beta.3-ohlc-ticks.20261119.1`.
Adds optional `MarketChartPresentation.bars.tickWidth` through
`TechnicalChartView.appearance`: finite CSS pixels 0.5–5 inclusive. Explicit
open-left and close-right ticks have independent width and flat caps. Omission
retains legacy geometry. Stems, supplied prices, line widths and calculation
identities are unchanged.

The existing frozen archive is promoted unchanged: 766,821 bytes, 76 files.
SHA256: `335aa4c25ef098af67faf38c98efe245bd804fd026c5c45b29b32bc7338e2fe1`.
Integrity:
`sha512-ZfQzMQ3IJHRYoucNtazj9JHjhGcRgmvoTFXVEAGON9TJTn6eGAjK6F7VxihuHd/7Wcg3s0asWNvGr7sJhP34Ew==`.

Exact UI peer remains `0.2.0-beta.3-drawing-portals.1`; icon dependency remains
`0.1.0-beta.0`. Workspace manifests and locks are unchanged. Only the isolated
candidate manifest sets the release version and pins that UI peer.

Verified implementation: 603 market tests/72 files, strict typecheck, scoped
lint, aggregate ESM/CJS/declaration/CSS builds and production Storybook
(1,955 stories/270 docs). Fourteen browser comparisons capture actual Canvas
paths/widths/caps across themes, desktop/narrow, dense views, gaps and wick edges.
Candidate public types, ESM/CJS imports, archive/source bindings and all 76 packed
files pass verification. Tests use installed workspace peers; exact published
peer compatibility/clean-room installs were not rerun for this small follow-up.

The [isolated staging workflow](https://github.com/aapaetsch/AgentixUI/actions/runs/44646413230)
passed at release commit `f143701170798152ba4bff11f7cd5ae4dab2573b` on
`release/ohlc-ticks-20261119`. Registry-staged bytes match the frozen size,
SHA256 and SHA512. Stage ID: `1b60dfae-6211-4324-9b11-d13abe9e42dc`.

The npm automated review passed. Publication is pending final owner security-key
authentication in Chrome.
Public hash/Sigstore/SLSA/tag verification must be recorded before claiming
successful publication. Prior latest/stable tags must remain unchanged; beta
alone will select this release. No rebuild/repack or authentication bypass.

No consumer dependencies/locks/installation or product deployment is part of this
publication. No credentials are created or changed. The unrelated untracked
security report remains excluded. Local detailed evidence:
`.chart-ohlc-tick-validation/publication/`.
