# Selected drawing Create alert action

This guide describes the shared source API. A later publication receipt records
`aapaetsch-charts-market@0.1.0-beta.3-drawing-alert-action.20261030.1` on
November 1, 2026; see the [release records](../docs/evidence/market-feature-releases.md).
The local candidate details below describe the original implementation delivery.
Consumer installation and product adoption are separate from publication.

The existing public `MarketDrawingEditorOptions.onAlertIntent?: (drawingId: string)
=> void` is preserved. With a callback, the toolbar button and overflow menu item
use **Create alert** for one selected visible horizontal line, trend line or
rectangle. Vertical lines offer no action. Locked price drawings can request an
intent without being unlocked. Omission retains the existing disabled **Drawing
alerts — coming later** availability on both surfaces, including vertical lines.

Native button and existing Radix menu activation provide pointer/Enter/Space
access. Existing focus return, Escape dismissal, dragging, clamping and responsive
overflow are reused. No new event listeners or asynchronous callback work are added.

The selected ID is opaque and forwarded unchanged as the sole argument. The host
resolves it in its current account/listing saved document, flushes pending saves
or explains conflicts, checks final eligibility and opens its inspector. Replace
the callback and invalidate old editor controls through the existing chart context
or cancellation revision on listing changes, especially when IDs can repeat. The
renderer cannot identify a listing or prove a saved revision from an ID alone.

No price formulas, alert storage, provider/source calls, credential access or
notifications are introduced. Callbacks remain runtime options, never DrawingState.

Validation and exact candidate identity are recorded under
`.chart-drawing-alert-action-validation/`. `candidate.json` will bind the initial
HEAD, final source snapshot, local build files and reviewed delta by SHA-256. The
working checkout already contains other unpublished changes; the candidate records
that full source context and must not be treated as a release of this small delta
alone. The package version is deliberately unchanged pending separate review.
