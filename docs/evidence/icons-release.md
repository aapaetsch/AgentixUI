# Original icon library release

Release source: `4fa6f4407bb8577cfd4ce56055a3e9bacd4e63ec` on `feature-finance-workflows-charts`.
Coordinated release tag: `v0.2.0-beta.3`.

Packages: `aapaetsch-icons@0.1.0-beta.0`, `aapaetsch-ui-kit@0.2.0-beta.3`, `aapaetsch-charts@0.1.0-beta.0`, and `aapaetsch-charts-market@0.1.0-beta.2`. All target the beta dist-tag.

## Validation

Independent Dev Runner repeated lint, all four typechecks, all four builds, and Storybook against the release source. All 265 tests in 44 files passed, including five volume-axis regression cases added since the initial implementation evidence. The release also corrects two case-sensitive Storybook imports. The audit checked 1,944 relative import paths against tracked files.

The refreshed local archives passed the clean React 18 ESM/CommonJS chart/UI consumer; all four SHA-256 values match its results. Icon, UI, and general-chart archives are unchanged from the earlier React 18/19 and Next.js checks. The market archive was rebuilt with the volume-axis fix. Local archive identities are in `icons-artifacts.json`; CI release identities are recorded separately because the Linux checkout normalizes source text and builds independently.

## Publication

[GitHub release workflow](https://github.com/aapaetsch/AgentixUI/actions/runs/39088908976) builds and validates from the immutable tag, freezes archives, saves their integrity evidence, and publishes those exact archives with provenance, icons first.

All Linux checks passed, including Next.js, React 18/19 packed consumers, and Storybook. The initial publication was rejected with npm E403. That historical run remains failed; the later coordinated release completed publication through reviewed staging and promotion.

The CI archives were downloaded and their SHA-256 values independently verified. Their durable identities are in `icons-release-artifacts.json`; the full inventories remain in the workflow artifact `packages-v0.2.0-beta.3` and local `.icon-validation/github-release/`.

The [coordinated release receipt](https://github.com/aapaetsch/AgentixUI/releases/tag/coordinated-candidate-v0.2.0-beta.3) records all four published exact versions, source commit, archive hashes and provenance. Its [successful staging workflow](https://github.com/aapaetsch/AgentixUI/actions/runs/39090364972) promoted the original Linux archives without rebuilding them. Current registry metadata was independently checked: every exact version exists, every SHA-512 integrity matches the frozen CI archive, and all four expose provenance attestations.

One alias follow-up remains: market charts' beta tag points at 0.1.0-beta.1-refinement.20261017.2. Use the selected exact version 0.1.0-beta.2. The other three beta aliases point at this release's selected versions. Stable/latest tags were not moved by these verification steps.

## Portfolio installation

PortfolioTrackAndScreen now pins UI kit 0.2.0-beta.3 and market charts 0.1.0-beta.2. Both installed packages resolve the original icons 0.1.0-beta.0. The unused general-chart package was not added to the application.

The owner separately approved complete lock SHA-256 221e1ab14b31d3dd4348f56554000fa595f7302d71645f6c712bdb2fc493162c and scripts-disabled installation. Actual installed package manifests match those exact versions, and a fresh strict npm-policy verification passes. Product evidence reports frontend typechecking, all 281 core tests, the production build, healthy rebuilt frontend, and both-account desktop/narrow browser acceptance.

Product receipts: E:/Projects/PortfolioTrackAndScreen/dependencies/npm-requests/2026-10-17-coordinated-chart-lock.md and E:/Projects/PortfolioTrackAndScreen/docs/validation/charts/coordinated-release-2026-10-17.md. This adoption does not activate provider acquisition or streaming flags.
