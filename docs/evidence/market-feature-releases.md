# Market-chart source and release records

This repository contains the integrated source for workspace interactions, timeline controls, future drawing coordinates, compact chart layouts, instrument readouts, the floating drawing editor, and drawing-alert intents. Shared UI portal destinations support the fullscreen editor.

## Recorded publications

These are historical records copied from the local publication receipts on November 12, 2026. They have not been reverified against the registry as part of organizing these commits. Tags and consumer adoption may have changed since the receipt dates.

| Feature | Recorded package version | Verification date (UTC) | Receipt |
| --- | --- | --- | --- |
| Compact instrument/OHLC readout | `aapaetsch-charts-market@0.1.0-beta.3-instrument-readout.1` | October 29, 2026 | [Publication receipt](market-instrument-readout-publication.json) |
| Selected drawing Create alert action | `aapaetsch-charts-market@0.1.0-beta.3-drawing-alert-action.20261030.1` | November 1, 2026 | [Publication receipt](market-drawing-alert-publication.json) |

The receipts retain archive hashes, integrity values, provenance commits, and workflow URLs. Their isolated release branches differ from the source feature branch. Workspace versions were deliberately unchanged by those publication tasks; do not interpret the local manifest version as the published feature inventory. See also the earlier [endpoint release](endpoint-release.md).

## Integration requirements

Fullscreen drawing controls require the coordinated UI kit's optional `portalContainer` API on DialogContent, PopoverContent, DropdownMenuContent, and TooltipContent. The current chart peer range alone does not guarantee that capability. A future release must assign compatible UI/chart versions and a peer minimum that guarantees this API, then rebuild and verify its release artifacts. This source organization does not publish packages or change dependencies, versions, or locks.

Hosts own data acquisition, persistence, supplied-result identity/freshness, scroll containers, account context, and final alert eligibility. Hiding built-in supplied-result status requires equivalent discoverable host evidence. No package publication proves consumer installation or product acceptance.

## Source verification

The November 12 source review passed 565 market-chart tests in 68 files, chart and UI typechecks, the aggregate library build, and the Storybook production build. Scoped lint reported no errors and four hook warnings; stories excluded by the existing lint configuration were not linted. Storybook built 1,941 stories and 270 docs. No fresh browser interaction, physical-device, or screen-reader acceptance is claimed by this review.

## Local validation artifacts

`.chart-*-validation/` directories contain historical snapshots, copied dependencies, builds, browser captures, logs, and candidate archives. They remain on the original machine and are ignored by Git. Older roadmap entries retain these paths as local evidence references, not files promised in a fresh clone. Portable publication receipts are tracked here; large archives and detailed local evidence are not source dependencies. Do not delete or overwrite sealed local artifacts when cleaning generated output.
