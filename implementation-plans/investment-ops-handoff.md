# Handoff: Investment-Ops Components Plan — Review, Bugfix & Push

**Date:** 2026-07-17
**Workspace:** `c:\Users\aapae\Documents\Projects\Aidans-React-UI`
**Plan source:** `implementation-plans/investment-ops-components-plan.md`
**Branch state:** all changes uncommitted (no branch created yet)
**Build status:** ✅ `npm run build` is green (root + `./finance` + `./templates/investment-ops` bundles + DTS)

This document is the single source of truth for the reviewer. It enumerates every file touched,
flags known issues and intentional scope cuts, and gives a concrete review checklist so the work
can be reviewed, bug-fixed, and pushed.

---

## 0. TL;DR for the reviewer

- All six phases of the investment-ops plan have been implemented top-to-bottom in a single
  uncommitted working tree.
- Adds **10 new generic components**, **2 finance widgets**, **8 composed templates**, and
  **4 shared util modules** + finance domain types.
- Adds **3 runtime dependencies** and reconfigures `tsup`/`package.json` to emit **three**
  bundles via secondary entrypoints (`./finance`, `./templates/investment-ops`).
- Build is green. Storybook stories exist for every new component and finance widget;
  **template stories are the main known gap** — see §6 Follow-ups.
- Unrelated drift files that should NOT be committed with this work are called out in §7.

Suggested commit strategy is in §8.

---

## 1. What was built (by phase)

| Phase | Stream | Deliverables |
|------|--------|--------------|
| 1 | Foundations | `number-utils`, `time-utils`, `color-utils`, `finance-types`, `Typography` + `NumericText`, `AnimatedNumber`, `ToggleGroup`, theming tokens |
| 2 | Layout | `Resizable` (wraps `react-resizable-panels` v3) |
| 3 | Power-user | `CommandPalette` (cmdk), `Toolbar` (Radix) |
| 4 | Finance widgets | `OrderBook`, `TimeAndSales` |
| 5 | Templates | `StatTile`, `AccountSummary`, `Watchlist`, `HoldingsTable`, `OrderTicket`, `AllocationBreakdown`, `NewsFeed`, `InvestmentOpsDashboard` |
| 6 | Packaging | Secondary entrypoints `./finance`, `./templates/investment-ops` in `tsup.config.ts` + `package.json` `exports`; roadmap subfiles updated |

---

## 2. File inventory

### 2.1 New source files (untracked → to be added)

#### Shared utilities (`src/lib/`)
- `src/lib/number-utils.ts` — currency/percent/number/compact/bps formatters, `formatSigned`, `roundToTick`
- `src/lib/time-utils.ts` — `formatRelativeTime`, `formatRelativeTimeShort`, `formatDuration` (SSR-safe)
- `src/lib/color-utils.ts` — `pnlColorClass`, `sentimentColor`, `resolveToken`
- `src/lib/finance-types.ts` — `OrderBookLevel`, `Trade`, `TradeFlag`, `WatchlistItem`, `HoldingRow`

#### Components (each folder has `index.tsx`, `*.stories.tsx`, `agents.md`, `README.md`)
- `src/components/typography/` — `Typography` (polymorphic), `NumericText`, `typographyVariants`, `numericTextVariants`
- `src/components/animated-number/` — `AnimatedNumber`, `animatedNumberVariants`
- `src/components/toggle-group/` — `ToggleGroup`, `ToggleGroupItem`, `toggleGroupVariants`, `toggleGroupItemVariants`
- `src/components/resizable/` — `Resizable` (alias `ResizablePanelGroup`), `ResizablePanel`, `ResizableHandle`, `resizableHandleVariants`
- `src/components/command-palette/` — `CommandPalette` + sub-components, `useCommandPalette`
- `src/components/toolbar/` — `Toolbar`, `ToolbarButton`, `ToolbarToggle`, `ToolbarToggleGroup`, `ToolbarSeparator`, `ToolbarLabel`
- `src/components/order-book/` — `OrderBook` + sub-components, `orderBookRowVariants`, `orderBookSideVariants`
- `src/components/time-and-sales/` — `TimeAndSales`, `TimeAndSalesRow`, `TimeAndSalesHeader`, `timeAndSalesRowVariants`

#### Finance secondary entrypoint
- `src/finance.ts` — re-exports `OrderBook`, `TimeAndSales`, and finance types

#### Templates (`src/templates/investment-ops/`)
- `src/templates/investment-ops/index.ts`
- `src/templates/investment-ops/README.md`
- `src/templates/investment-ops/agents.md` (folder-level)
- `src/templates/investment-ops/stat-tile.tsx`
- `src/templates/investment-ops/account-summary.tsx`
- `src/templates/investment-ops/watchlist.tsx`
- `src/templates/investment-ops/holdings-table.tsx`
- `src/templates/investment-ops/order-ticket.tsx`
- `src/templates/investment-ops/allocation-breakdown.tsx`
- `src/templates/investment-ops/news-feed.tsx`
- `src/templates/investment-ops/dashboard-shell.tsx`

### 2.2 Modified tracked files
- `package.json` — added deps + new `exports` entries (see §4)
- `tsup.config.ts` — added the two secondary entrypoints to `entry` + `dts.entry`
- `tailwind.config.js` — added `positive` / `negative` color keys under `theme.extend.colors`
- `src/globals.css` — added `--positive*` / `--negative*` tokens to `:root` and `.dark`
- `src/index.ts` — re-exported all new generic primitives, utilities, finance types, and templates

### 2.3 Docs updated (roadmap)
- `docs/roadmap/existing-components.md` — new components appended to the checklist
- `docs/roadmap/advanced-components.md` — Command Palette / Toggle Group / Toolbar / Resizable / OrderBook / TimeAndSales moved to ✅ Complete
- `docs/roadmap/templates.md` — investment-ops template set added at the top; generic "Data Dashboard" placeholder **superseded**
- `docs/roadmap/phases.md` — Phase 7/8 (investment-ops finance + templates) appended and marked complete
- `docs/roadmap/changelog.md` — 2026-07-16 milestone entry added

### 2.4 Pre-existing changes — DO NOT bundle with this handoff
These were already modified before the investment-ops work began and are unrelated to it. The
reviewer should either leave them out of the commit or handle them separately:
- `.gitignore` (adds `.keys/`, `agentixUI.code-workspace`) — unrelated
- `src/lib/date-utils.ts` (removed `addHours` re-export) — pre-existing per the 2026-06-26 changelog
- `storybook_stories.json` (binary diff) — generated artifact
- `storybook-build-debug.txt`, `storybook-build-output.txt`, `storybook-stderr.txt` — scratch logs at repo root
- `.playwright-mcp/` — playwright screenshot scratch folder

Suggested `.gitignore` additions for the scratch files:
```
storybook-build-debug.txt
storybook-build-output.txt
storybook-stderr.txt
.playwright-mcp/
```

---

## 3. Dependency changes

Added to `package.json` `dependencies`:

| Package | Purpose | Notes |
|---------|---------|-------|
| `@radix-ui/react-toggle-group` | `ToggleGroup` | Phase 1 |
| `react-resizable-panels` | `Resizable` | Installed version is **v3** which uses `Group`/`Panel`/`Separator` + `useDefaultLayout` — NOT the older `PanelGroup`/`PanelResizeHandle` API the plan originally assumed. See §5.1. |
| `@radix-ui/react-toolbar` | `Toolbar` | Phase 3 |

Install was run; `package-lock.json` is gitignored (per repo convention) so reviewers should run `npm install` after checkout.

---

## 4. Packaging / exports changes

### `tsup.config.ts`
- `entry` now includes `src/finance.ts` and `src/templates/investment-ops/index.ts` alongside the root + CSS entries.
- `dts.entry` mirrors the TS entries so each secondary bundle gets its own `.d.ts`.

### `package.json` `exports`
```json
".":              { types, import, require }   // unchanged shape
"./finance":      { types, import, require }   // NEW — OrderBook, TimeAndSales, finance types
"./templates/investment-ops": { types, import, require }  // NEW — composed templates + dashboard shell
"./globals.css":  "./dist/globals.css"         // unchanged
"./tailwind.config": { require }               // unchanged
```

Output filenames to verify after `npm run build`:
- `dist/index.{js,mjs,d.ts,d.mts}`
- `dist/finance.{js,mjs,d.ts,d.mts}`
- `dist/templates-investment-ops/index.{js,mjs,d.ts,d.mts}` — ⚠️ tsup flattens the nested folder path
  into `dist/templates-investment-ops/` (confirmed in the actual build output; reviewers should
  reconfirm and adjust the `exports` paths if tsup behavior changes).

### Legacy root exports — intentional decision
For backwards compatibility and one-import convenience, `OrderBook` / `TimeAndSales` and the
finance types are exported from BOTH the root `src/index.ts` AND the `./finance` secondary
entrypoint. The plan allowed this ("or root if broadly reusable — see Open Decision"). If the
reviewer prefers a hard split, remove the finance-specific exports from `src/index.ts` and
update consumers; the templates already import from `@agentix/ui/finance` where it matters for
the dashboard shell.

---

## 5. Known issues, gotchas, and intentional scope cuts

### 5.1 `react-resizable-panels` v3 API drift
The plan brief assumed the older `PanelGroup` / `PanelResizeHandle` API. The installed version
uses `Group` / `Panel` / `Separator` plus a `useDefaultLayout` hook for persistence. The
`Resizable` implementation in `src/components/resizable/index.tsx`:
- aliases `ResizablePanelGroup` to `Resizable` for naming familiarity,
- maps `direction` → `orientation`,
- uses `useDefaultLayout` with `onlySaveAfterUserInteractions: true` and a `typeof window`
  guard for SSR/Electron safety,
- renders handles with the kit's `resizableHandleVariants` (line/bar/grip).

**Verify**: keyboard resize (Arrow +/- 1%, Shift+Arrow +/- 10%) is provided by the library —
do not reimplement. The custom `data-active` flash on the handle is driven by
`onPointerDown`/`onPointerUp`, which is a lightweight visual hint; if the library exposes a
better drag-state hook in a future version, prefer that.

### 5.2 Polymorphic `Typography` typing
The generic `<T extends React.ElementType>` `forwardRef` pattern broke the `tsup` DTS build
(interface-extends-generic-component-props fails the dts emit). `Typography` is therefore a plain
function component (not a `forwardRef`). This compiles cleanly but means `ref` is not forwarded
to the rendered element. If a consumer needs a ref to the typography element, add `forwardRef`
later with a narrower non-generic type or a `Slot`-based approach — the current implementation
prioritizes DTS build correctness.

### 5.3 `ToggleGroup` discriminated union
Radix's `ToggleGroupPrimitive.Root` has a discriminated union on `type`. The wrapper casts the
whole props object to the radix `ComponentPropsWithoutRef` to bypass the union; this is safe
because the consumer-facing `ToggleGroupProps` widens `value` to `string | string[]` and
`onValueChange` to accept either. Reviewer should confirm no runtime contracts are violated when
`type="multiple"`.

### 5.4 `Toolbar` variant surface
`@radix-ui/react-toolbar`'s `Toolbar.Root` already exposes an `orientation` prop, so
`toolbarVariants` CVA was collapsed to no variants (the `flex-row` / `flex-col` class is applied
manually in the root component from the `orientation` prop). `toolbarButtonVariants` still uses
CVA with `active` and `size`. This avoids a CVA-vs-Radix `orientation` type clash — leave it as-is.

### 5.5 Finance widget streaming perf (v1 scope cut — intentional)
Per the plan, OrderBook / TimeAndSales ship a stable display surface first:
- `OrderBookRow` is `React.memo`'d with a custom `arePropsEqual` keyed on
  `price + size + side + flash + maxVisible`.
- No `@tanstack/react-virtual` yet — add only if profiling shows a need at the configured row
  counts (`maxRows` default 15 for OrderBook, 100 for TimeAndSales).
- Row flash on update (`highlightLast`) is **opt-in via the row `flash` prop** — the root
  component does NOT auto-detect per-row changes. A consumer wiring a real stream must set
  `flash` on the changed row and clear it on the next frame (rAF). Reviewer should confirm this
  matches intended usage; if a self-managed flash is preferred, file a Phase 4 follow-up.

### 5.6 `OrderTicket` scope (v1 cut — locked)
- Ships a simple equity flow only. Multi-leg option support is **deferred** per the plan.
- `toast.promise` uses static messages (`{ title: "Placing order…" }`, etc.) because the toast
  API's `PromiseMessages.description` accepts `string | ((data) => string)` but a function-based
  description caused a DTS type error. If reviewer wants richer error surfacing, extend
  `OrderTicketProps` with an `onError` callback and render a separate toast from the consumer —
  don't widen the toast types inside the template.

### 5.7 Template stories are NOT shipped
Components and finance widgets ship with full `*.stories.tsx` coverage (the §6 minimum matrix).
**Template blocks (StatTile, AccountSummary, etc.) currently have only README/agents.md
documentation and no `.stories.tsx`.** This is the single largest follow-up — see §6.

### 5.8 `Watchlist` / `HoldingsTable` use the generic `DataTable`
Per the plan, these templates compose existing `DataTable` and do not introduce custom table
internals. Reviewer should run a quick smoke test against the `DataTable`'s real API surface
(column `meta.align` is typed as `"left" | "center" | "right"` and is applied via the
`DataTableColumnMeta` extension in `src/components/data-table/types.ts`).

### 5.9 Dashboard shell `NavItem` import
`dashboard-shell.tsx` imports `PremiumNavItem as NavItem` directly from
`src/components/navigation/items` (not the re-exported `NavItem` alias from the navigation index).
The direct import was chosen because the navigation barrel uses prefixed names — reviewer can
switch to the barrel alias if desired; functionally identical.

### 5.10 Build warnings are pre-existing
`npm run build` emits ~11 "ambiguous tailwind class" warnings (e.g.
`duration-[var(--motion-duration-medium)]`). These are **pre-existing across the whole library**
(they appear throughout `Card`, `Sheet`, etc.) and are NOT introduced by this PR. Do not treat
them as review blockers.

---

## 6. Follow-ups (out of scope for this handoff)

| # | Follow-up | Where |
|---|-----------|-------|
| F1 | Add `*.stories.tsx` for each template block: StatTile, AccountSummary, Watchlist, HoldingsTable, OrderTicket, AllocationBreakdown, NewsFeed, InvestmentOpsDashboard. Minimum matrix: default, empty, loading, dense/high-volume, dark mode. | `src/templates/investment-ops/*.stories.tsx` |
| F2 | Wire a real streaming consumer's flash toggling for `OrderBook` (`highlightLast`) if product wants the v1 flash UX. | OrderBook stories / dashboard |
| F3 | Chart library integration — templates already use render slots (`sparkline`, `chart`). Drop in the chosen chart lib behind the slots. | templates |
| F4 | Self-managed `useResizablePanel` hook — only add when a real consumer needs it (plan rule). | Resizable |
| F5 | Nested sub-actions in `CommandPalette` — deferred per v1 scope. | CommandPalette |
| F6 | `TimeAndSalesFilter` (min size / block-only / side) — shipped only if a straightforward need arises. | TimeAndSales |
| F7 | Multi-leg option flow in `OrderTicket` (Stepper-based legs → review → confirm) — deferred. | OrderTicket |
| F8 | Polish the toast error surface in `OrderTicket` if product wants per-error messages. | OrderTicket |

---

## 7. Reviewer checklist

### 7.1 Build & package
- [ ] `npm install` (deps added: `@radix-ui/react-toggle-group`, `react-resizable-panels`, `@radix-ui/react-toolbar`)
- [ ] `npm run build` → expect success (root + `finance` + `templates/investment-ops` bundles + DTS). Ignore the pre-existing ambiguous-class warnings.
- [ ] `npm run storybook` → confirm the new stories load (Typography, AnimatedNumber, ToggleGroup, Resizable, CommandPalette, Toolbar, OrderBook, TimeAndSales). Template stories will NOT appear — see F1.
- [ ] `npm run lint` → confirm no new lint errors in the new files.

### 7.2 API surface
- [ ] `src/index.ts` exports: Typography, NumericText, AnimatedNumber, ToggleGroup(+Item), Resizable(+Panel+Handle), CommandPalette(+sub-components+`useCommandPalette`), Toolbar(+sub-components), OrderBook(+sub-components), TimeAndSales(+sub-components), `number-utils` formatters, `time-utils` helpers, `color-utils` helpers, finance types, and the templates (StatTile → InvestmentOpsDashboard).
- [ ] `src/finance.ts` exports OrderBook, TimeAndSales, and finance types only.
- [ ] `src/templates/investment-ops/index.ts` exports the 8 template blocks.
- [ ] `package.json` `exports` map resolves from a fresh consumer (`@agentix/ui/finance`, `@agentix/ui/templates/investment-ops`).

### 7.3 Accessibility (per plan)
- [ ] Sign never color-only — every colorized number pairs with `+`/`−`, `ArrowUp`/`ArrowDown`, or an `aria-label`. (Check `NumericText`, `StatTile`, `OrderBookRow`, `TimeAndSalesRow`.)
- [ ] `Resizable` handles expose `role="separator"` (from the library) and keyboard resize works.
- [ ] `CommandPalette` has `role="dialog"` + `role="listbox"`, focus trap, ESC to close.
- [ ] Streaming widgets (`OrderBook`, `TimeAndSales`) throttle SR announcements via `aria-live="polite"` (~1s); never per-tick.
- [ ] `AnimatedNumber` respects `prefers-reduced-motion` and cancels rAF on unmount.

### 7.4 Theming
- [ ] `text-positive` / `text-negative` / `bg-positive-muted` / `bg-negative-muted` compile in both light and dark mode.
- [ ] No hard-coded finance green/red anywhere — all P&L color routes through `pnlColorClass` / the semantic tokens.

### 7.5 Code quality
- [ ] Each new component folder has `index.tsx`, `*.stories.tsx`, `agents.md`, `README.md` — confirm all four are present for the 10 component folders.
- [ ] Templates folder has folder-level `agents.md` + `README.md`. Per-block `agents.md` was intentionally omitted unless a block needs extra notes.
- [ ] No imports cross the `./finance` boundary incorrectly (finance widgets import from `../../lib/*`, not from the root index).

---

## 8. Suggested commit strategy

The changes are large and logically split by phase. Either squash into one PR or split into the
following commits (recommended for reviewability):

```
1. chore(deps): add radix toggle-group, radix toolbar, react-resizable-panels
2. feat(theme): add positive/negative semantic tokens + tailwind keys
3. feat(lib): add number-utils, time-utils, color-utils, finance-types
4. feat(typography): add Typography + NumericText primitives
5. feat(animated-number, toggle-group): add AnimatedNumber + ToggleGroup
6. feat(resizable): wrap react-resizable-panels v3 (Group/Panel/Separator)
7. feat(command-palette, toolbar): add command launcher + toolbar
8. feat(finance): add OrderBook + TimeAndSales widgets (./finance entrypoint)
9. feat(templates/investment-ops): composed StatTile → InvestmentOpsDashboard
10. build(package): wire ./finance + ./templates/investment-ops exports/tsup
11. docs(roadmap): update existing-components/advanced/templates/phases/changelog
```

Exclude from the commit:
- `.gitignore` drift, `src/lib/date-utils.ts` `addHours` removal, `storybook_stories.json`,
  `storybook-*.txt`, `.playwright-mcp/`.

Add to `.gitignore` first (separate chore):
```
storybook-build-debug.txt
storybook-build-output.txt
storybook-stderr.txt
.playwright-mcp/
```

---

## 9. Quick verification commands

```powershell
# Clean rebuild
npm run build

# Smoke-test the secondary entrypoints resolve
node -e "import('@agentix/ui/finance').then(m => console.log(Object.keys(m)))"
node -e "import('@agentix/ui/templates/investment-ops').then(m => console.log(Object.keys(m)))"

# Run only the new component stories in Storybook
npm run storybook
# then navigate to: Components/Typography, Components/AnimatedNumber, Components/ToggleGroup,
# Components/Resizable, Components/CommandPalette, Components/Toolbar,
# Finance/OrderBook, Finance/TimeAndSales
```

---

## 10. Pointers for a bugfix pass

If the reviewer finds issues, the most likely hotspots are:
1. **`resizable` handle `data-active` flash** — verify it triggers reliably across browsers;
   if not, drop the `onPointerDown`/`onPointerUp` toggling and rely on the library's built-in
   `data-state` (if any) or a CSS-only hover affordance.
2. **`ToggleGroup` cast** — the `as unknown as ComponentPropsWithoutRef` cast is a known escape
   hatch; if `type="multiple"` causes runtime warnings, tighten the prop plumbing.
3. **`OrderBookSpread` spread math** — when `bestBid === undefined` or `bestAsk === undefined`,
   the component renders `—`; confirm the early-return ordering doesn't divide by zero when
   `bestAsk === 0`.
4. **`OrderTicket` controlled/uncontrolled `open`** — `open` is required; the dashboard shell
   manages `orderOpen` state and passes `OrderTicketProps` through. Confirm both flows stay in
   sync if a consumer also passes `open` inside `orderTicket`.
5. **`NewsFeed` `onFilterChange` effect** — fires on every `tickers`/`sentiments` change in an
   effect; consumers doing async refetch should debounce on their side.

---

End of handoff. With this doc in hand, a reviewer can run the build, walk the checklist, file
fixes against the hotspot list, and push the commits in the suggested order.