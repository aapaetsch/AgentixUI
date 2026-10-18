# Original icon library release

Release source: `4fa6f4407bb8577cfd4ce56055a3e9bacd4e63ec` on `feature-finance-workflows-charts`.
Coordinated release tag: `v0.2.0-beta.3`.

Packages: `aapaetsch-icons@0.1.0-beta.0`, `aapaetsch-ui-kit@0.2.0-beta.3`, `aapaetsch-charts@0.1.0-beta.0`, and `aapaetsch-charts-market@0.1.0-beta.2`. All target the beta dist-tag.

## Validation

Independent Dev Runner repeated lint, all four typechecks, all four builds, and Storybook against the release source. All 265 tests in 44 files passed, including five volume-axis regression cases added since the initial implementation evidence. The release also corrects two case-sensitive Storybook imports. The audit checked 1,944 relative import paths against tracked files.

The refreshed local archives passed the clean React 18 ESM/CommonJS chart/UI consumer; all four SHA-256 values match its results. Icon, UI, and general-chart archives are unchanged from the earlier React 18/19 and Next.js checks. The market archive was rebuilt with the volume-axis fix. Local archive identities are in `icons-artifacts.json`; CI release identities are recorded separately because the Linux checkout normalizes source text and builds independently.

## Publication

[GitHub release workflow](https://github.com/aapaetsch/AgentixUI/actions/runs/39088908976) builds and validates from the immutable tag, freezes archives, saves their integrity evidence, and publishes those exact archives with provenance, icons first.

All Linux checks passed, including Next.js, React 18/19 packed consumers, and Storybook. The first publication (`aapaetsch-icons`) was rejected by npm with `E403: You may not perform that action with these credentials`. Subsequent publication steps were skipped; no release package was published. Provenance signing succeeded before the registry rejected the write.

The CI archives were downloaded and their SHA-256 values independently verified. Their durable identities are in `icons-release-artifacts.json`; the full inventories remain in the workflow artifact `packages-v0.2.0-beta.3` and local `.icon-validation/github-release/`.

Resume by privately updating the repository's `NPM_TOKEN` secret with a credential authorized to publish these packages, then rerunning the failed release job. Do not put a token in source, evidence, or chat. After publication, compare registry integrity against the archived CI identities before preparing the product lock.

## Portfolio installation

Installation is being coordinated with the active PortfolioTrackAndScreen chart work. Its live manifest and approved lock remain unchanged. Its dependency policy requires separate approval of the resulting exact lock hash before installation. A proposed dependency record or downloaded archive does not imply that installation has happened. Registry publication must succeed before that exact registry lock can be resolved.
