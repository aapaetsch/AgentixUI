# Publication review — inline OHLC card fit

October17,2026. **Implementation and local review complete; candidate unpublished.** Product-owned common calendar fitting remains outside this task. This package fixes OHLC labels appearing above values in narrow cards and includes the prior refinement/calendar APIs.

## Exact new candidate

- **aapaetsch-charts-market@0.1.0-beta.1-refinement.20261017.1**, proposed tag **beta**.
- [Immutable package](candidate/sha256-d6a1bb7f5beea87e33672a0af87d8f0f3b146b1d0f312359c563af44a2f752a1.tgz): **468694 bytes**, **71 files**.
- SHA-256: `d6a1bb7f5beea87e33672a0af87d8f0f3b146b1d0f312359c563af44a2f752a1`.
- Integrity: `sha512-5r2xW2sH80VtUnTaaQzjweeAWOfqtbSIdzCAI/8XZAZ4tQz5E8nLyuUupzfPJy60eGwKWtR0GHFMM3owEOsEvA==`.
- [Immutable source](candidate/source-sha256-e05d5ed196cd27251ea1acd32cd8f4e341142af87a192141cbb95d1583637a11.tgz): **117 inputs**, SHA-256 `e05d5ed196cd27251ea1acd32cd8f4e341142af87a192141cbb95d1583637a11`.
- [Manifest/file hashes](candidate/manifest.json), [pack result](candidate/npm-pack.json), [contract delta](contract-delta.json), [consumer checks](consumer-results.json), [scope audit](scope-audit.json), [final audit](final-audit.json), [evidence hashes](artifact-evidence.json).

Previous refinement candidate `0.1.0-beta.1-refinement.20261016.1` remains untouched (package SHA-256 `32f73f768ea0897dbd2e283cbc82684aaeae1dd20767b931edde61cc012a925d`, source `eaa1f6cce92c6271235616a92998f9fd2689172557239b456d3ef37702a42afa`). All13 preserved package/source/manifest/review artifacts, including calendar and DashboardGrid, match the new task baseline. This new candidate supersedes the previous refinement candidate for adoption review; it does not overwrite it or inherit publication approval.

## Behavior and public mapping

TechnicalChartView no longer switches the OHLC fields to narrow grid columns with flex-column label/value layout. Every field is now an atomic inline, baseline-aligned pair: `O 217.45`, `H 217.45`, `L 216.98`, `C 217.23`. Whole pairs wrap only when necessary. Values may ellipsize within a pair while the exact supplied value remains in its title and accessible label. No data, evidence or supplied-value precision is changed.

Pairs have a maximum half-row width, allowing all four fields in no more than two rows. The overlay is bounded to28Canvas CSS pixels below the existing28px pane legend, clips to the pane boundary and never changes Canvas dimensions. Price/study legend layout remains bounded to its own fixed row. Extremely small host panes can clip the readout; provide enough pane height rather than reaching into private DOM.

| Public surface | Consumer use | Delta |
|---|---|---|
| TechnicalChartView | Inline OHLC is the default at all widths | Behavior fix; no new opt-in prop |
| appearance.legends | Existing expanded/exact or compact display formatting | Unchanged; exact title/aria values retained |
| appearance.height, heightMode, minimumPlotHeight; onGeometryChange | Existing public container budget/geometry | Unchanged; overlay wraps without resizing plot |
| supplied data/revision/request keys | Continue existing controlled host snapshots/results | Unchanged |
| drawing commands/history, theme/scale/viewport/inspection | Continue existing controlled seams | Unchanged |
| timeAxis/discontinuities/withMarketVisibleRange | Product supplies common UTC geometry and explicit gaps | Unchanged; product owns mid-axis/common observed-domain fix |

**158 root runtime exports**, no added/removed names, all seven ESM/CJS entry points pass exact parity. **All22 packed declaration files are byte-identical** to the previous refinement candidate. NodeNext ESM/CJS consumers compile against the actual packed types. Supplied/calendar server-rendered output agrees across ESM/CJS (28172HTML bytes).

Version1 serialization has no field/version changes and makes a byte-identical round-trip of a prior document with opaque host extensions. Only TechnicalChartView's implementation source changed; engine, financial guards, calendar logic, snapshot acceptance and history implementations remain unchanged.

CSS subpath remains `aapaetsch-charts-market/styles.css`; no new public tokens or stylesheet entry edits. Generated utility CSS changes from SHA-256 `afd519231f659706e53944838ce83d7e9a93547f5246091d7ebcfb895ffad8e3` to `78fb2be5ab652d3dfa33741104dc0379beb7506ad8a8ceddc4b2a8e12e0878b6`. Consumers must use this candidate's CSS with its JavaScript.

## Validation and review

[Required Dev Runner](dev-runner/results.json): package typecheck, **23 focused tests across4files**, ESM/CJS/DTS/DCTS/CSS build, isolated **56-story Storybook /9new card-fit stories** pass. The focused set includes2exact-value/inspection/stale-readout regressions,6composite refinement tests,14supplied-result guards (all financial families and compressed/UTC/calendar modes), and1abandoned-render revision gate test. The new story also passes an explicit standalone TypeScript check (`story-typecheck.log`).

[Browser evidence](browser/results.json): Chrome, **22 recorded cases**, no page errors or audited axe WCAG A/AA findings. DOM geometry assertions verify all four pairs, label/value y alignment, whole-pair wrapping in at most two rows, exact title/aria values, no horizontal overflow, no overlap with pane legends, and no readout intrusion into price/time axes. Coverage:

- All9synthetic stories: Light, Dark, Midnight, fixed320/390px, exact long values, compact long values, four dense board cards, short card.
- Actual320/390CSS-pixel viewports across Light/Dark/Midnight and long values; many-overlay bounded legend plus SMA/ADX layout.
- 200% equivalent layout using720×450CSSviewport/deviceScaleFactor2 across themes and narrow cards. This is emulation, not physical Safari/iPad or browser-UI zoom verification.
- Streaming fixture after theme switch, dock resize, current-bar replacement, append and stale revision: exact inspected readout, viewport, manual scale and economic inspection retained; one engine instance, zero instrumented supplied formulas.

Screenshots and trace are under browser/. Visual inspection confirms a one-line readout for normal320px cards and two inline-pair rows for long exact values. The initial browser harness used incorrect Storybook number IDs; selectors were corrected to the observed `narrow-320`/`narrow-390` IDs. No implementation finding remained after browser checks. No new performance claim is made from screenshots; the previous100k benchmark remains historical context for unchanged engine code.

The earlier refinement's forced-colors authored-color axe diagnostic and physical Safari/iPad limitations remain recorded in its [review](../PUBLICATION-REVIEW.md). This card-fit pass makes no new forced-colors certification claim.

## Scope, license and adoption

MIT LICENSE and existing NOTICE remain packed unchanged. Peer ranges and installed versions are unchanged (UI-kit>=0.2.0-beta.1, lucide-react>=0.474.0, React/DOM>=18<20; tested local UI-kit0.2.0-beta.1, lucide0.474.0, React/DOM19.2.8). The previously approved local Lucide CommonJS boundary remains unchanged; packed native ESM/CJS checks pass. No dependency installation/download or new repair occurred; npm pack ran offline with scripts disabled after the verified build.

Changes are restricted to charts-market/, docs/ROADMAP.md and .chart-refinement-validation/. Root manifests/lock, unrelated source and HEAD remain unchanged. The read-only product adapter changed concurrently while the product task implemented its calendar fitting fix; before/after hashes are recorded. This task performed no product/OpenBB writes, provider calls, database work, source runs, commits/pushes/PRs, publication or cross-chat messages.

Publication requires separate approval of the exact package/source hashes above. Do not rebuild or repack for promotion. Product download/integration additionally requires approval of the exact published artifact and dependency/lock tree; the separate root UI-kit release does not contain these chart changes. Real cached evidence in both accounts remains downstream acceptance.
