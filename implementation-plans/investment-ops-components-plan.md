# Investment Ops Dashboard Components — Implementation Plan

## Goal

Build the missing primitives, finance-specific widgets, shared utilities, and composed templates needed to ship an investment operations dashboard on top of `@agentix/ui`.

This version of the plan is intentionally implementation-oriented. It narrows v1 scope, makes package boundaries explicit, and defines phase exit criteria so work can proceed without ambiguity.

## Scope

### In Scope

1. Reusable UI primitives required for investment-ops layouts.
2. Finance-specific components that justify first-class ownership in the library.
3. Shared formatting and theming utilities used across finance surfaces.
4. Composed investment-ops templates and a showcase dashboard shell.
5. Storybook stories, exports, docs, and roadmap updates for every shipped item.

### Out of Scope

1. Interactive charting implementation.
2. Data transport, WebSocket clients, workers, or backend feed infrastructure.
3. Brokerage or business logic beyond presentational and interaction-layer behavior.

Charting remains a separate library and is integrated only through render slots or passed components.

## Packaging and Export Strategy

The current package exposes only the root entrypoint in `package.json`. This plan should not mix generic UI primitives and domain templates under a single flat export surface.

### Export Rules

1. Generic primitives and generic utilities continue to export from `src/index.ts`.
2. Finance-specific primitives may export from the root only if they are still broadly reusable outside investment apps.
3. Domain templates must export from a secondary entrypoint, not from the root surface.

### Recommended Secondary Entry Points

1. `./finance` for `OrderBook`, `TimeAndSales`, `AnimatedNumber`, finance types, and finance-oriented utilities if desired.
2. `./templates` or `./templates/investment-ops` for composed dashboard blocks and the dashboard shell.

### Packaging Tasks

1. Update `tsup` entry configuration if secondary entrypoints are added.
2. Update `package.json` `exports` for the new entrypoints.
3. Keep CSS exposure unchanged through `./globals.css`.

## Dependency Delta

These additions should be treated as explicit planning tasks, not implicit implementation details.

### Already Present

1. `cmdk`
2. `@tanstack/react-virtual`

### To Add

1. `react-resizable-panels`
2. `@radix-ui/react-toolbar`
3. `@radix-ui/react-toggle-group`

## Shared Contracts

Before component work begins, introduce a small shared finance types layer so templates and widgets do not redefine the same data shapes.

### New Module

`src/lib/finance-types.ts`

### Initial Exports

```typescript
export interface OrderBookLevel {
  price: number;
  size: number;
  total?: number;
}

export type TradeFlag = "block" | "uptick" | "downtick" | "correction";

export interface Trade {
  id: string;
  time: number;
  price: number;
  size: number;
  side: "buy" | "sell" | "unknown";
  flags?: TradeFlag[];
}

export interface WatchlistItem {
  symbol: string;
  last: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export interface HoldingRow {
  symbol: string;
  quantity: number;
  averageCost: number;
  lastPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  weightPercent?: number;
  dayChange?: number;
}
```

The goal is not to finalize the domain model up front. The goal is to prevent shape drift across stories, templates, and future adapters.

## Deliverables

There are 19 planned deliverables across 4 streams.

### Stream 1 — Foundations

1. `src/lib/number-utils.ts`
2. `src/lib/time-utils.ts`
3. `src/lib/color-utils.ts`
4. `src/components/typography/`
5. `src/components/animated-number/`
6. `src/components/toggle-group/`
7. `src/components/resizable/`

### Stream 2 — Power User Primitives

8. `src/components/command-palette/`
9. `src/components/toolbar/`

### Stream 3 — Finance Widgets

10. `src/components/order-book/`
11. `src/components/time-and-sales/`

### Stream 4 — Composed Templates

12. `src/templates/investment-ops/stat-tile.tsx`
13. `src/templates/investment-ops/account-summary.tsx`
14. `src/templates/investment-ops/watchlist.tsx`
15. `src/templates/investment-ops/holdings-table.tsx`
16. `src/templates/investment-ops/order-ticket.tsx`
17. `src/templates/investment-ops/allocation-breakdown.tsx`
18. `src/templates/investment-ops/news-feed.tsx`
19. `src/templates/investment-ops/dashboard-shell.tsx`

## Delivery Rules

Every deliverable must follow the workspace contract in `agents.md`.

### Required Per Primitive Component Folder

1. `index.tsx`
2. `[component-name].stories.tsx`
3. `agents.md`
4. `README.md`

### Required Per Template Folder

1. Component source file
2. Storybook story
3. `README.md`
4. Shared `agents.md` at `src/templates/investment-ops/` and per-block notes only where needed

### Required for All Deliverables

1. Strict TypeScript types
2. `className` override support using `cn()`
3. Theme-token-based styling
4. Light and dark mode coverage
5. Storybook coverage for normal, empty, loading, and high-value states
6. Export wiring
7. Roadmap updates in `docs/ROADMAP.md` subfiles

## Implementation Order

The order below is intended to reduce coupling and keep each phase independently shippable.

### Phase 1 — Utilities and Numeric Primitives

1. `number-utils`
2. `time-utils`
3. `color-utils`
4. `Typography`
5. `NumericText`
6. `AnimatedNumber`
7. `ToggleGroup`

### Why First

These items unlock nearly every later component and are cheap to validate in isolation.

### Exit Criteria

1. Utilities export from the package cleanly.
2. `NumericText` is used in stories across currency, percent, compact, and signed formats.
3. Positive and negative color tokens exist in `globals.css` and Tailwind config.
4. Build and Storybook pass.

### Phase 2 — Layout Primitive

1. `Resizable`

### Notes

1. Do not combine this with dashboard-shell work in the same PR.
2. Treat persistence as optional v1 behavior behind `autoSaveId`.
3. Guard storage access for non-browser environments.

### Exit Criteria

1. Horizontal and vertical layouts work.
2. Keyboard resizing works.
3. SSR-safe behavior is verified.
4. Build and Storybook pass.

### Phase 3 — Desktop Power-User Primitives

1. `CommandPalette`
2. `Toolbar`

### v1 Scope Cuts

1. Command Palette ships with flat groups, async loading, and configurable shortcut handling.
2. Nested sub-actions are deferred.
3. Toolbar ships with button, toggle, toggle-group integration, separator, and label.
4. Overflow wrapping is sufficient for v1; advanced collapsing logic is deferred.

### Exit Criteria

1. Keyboard navigation is complete.
2. Shortcut registration can be disabled or customized.
3. Stories cover both controlled and uncontrolled usage.
4. Build and Storybook pass.

### Phase 4 — Finance Streaming Widgets

1. `OrderBook`
2. `TimeAndSales`

### v1 Scope Cuts

1. Ship a stable display surface before chasing maximum update-rate optimization.
2. Start with capped row counts and memoized rows.
3. Use `@tanstack/react-virtual` only if profiling shows a clear need for the configured row counts.
4. Optional filters and advanced flash treatments may follow after the base widgets are stable.

### Exit Criteria

1. Stress-test stories exist for synthetic streaming input.
2. Rendering remains smooth at the target story load.
3. Screen readers receive throttled summary announcements rather than per-tick spam.
4. Build and Storybook pass.

### Phase 5 — Composed Templates

1. `StatTile`
2. `AccountSummary`
3. `Watchlist`
4. `HoldingsTable`
5. `OrderTicket`
6. `AllocationBreakdown`
7. `NewsFeed`

### v1 Scope Cuts

1. Templates remain presentational and interaction-focused.
2. Charting integrations use slots only.
3. `OrderTicket` ships first for simple equity orders; multi-leg option flows are deferred.
4. `Watchlist` and `HoldingsTable` use existing table capabilities before introducing new table abstractions.

### Exit Criteria

1. Each block is usable standalone in Storybook.
2. Each block documents its required data shape.
3. Empty, loading, and dense-data states are covered.
4. Build and Storybook pass.

### Phase 6 — Dashboard Shell

1. `InvestmentOpsDashboard`

### Notes

1. This is the integration phase, not the experimentation phase.
2. No new primitives should be invented here unless a blocker is discovered.
3. Left rail, center tabs, and right rail should all be composed from already-shipped items.

### Exit Criteria

1. Full shell renders in Storybook in light and dark mode.
2. Resizable layout, search trigger, and order entry flow all function.
3. No unresolved packaging or export issues remain.
4. Build and Storybook pass.

## Deliverable Specs

The sections below keep the original intent, but tighten each deliverable to a v1 contract.

### 1. Typography and NumericText

**Folder:** `src/components/typography/`

**Purpose:** Standardized text primitives plus finance-grade numeric rendering. `NumericText` is the finance-specific addition to the generic `Typography` primitive; it standardizes right-aligned, tabular, monospace figures with semantic P&L coloring across the whole dashboard.

**Sub-components & Exports**

- `Typography` — polymorphic element (`<p>` / `<span>` / `<div>`) with `variant` (`h1`-`h6`, `subtitle`, `body`, `caption`, `overline`) and `align`.
- `NumericText` — finance-specific numeric renderer.
- Variants: `typographyVariants`, `numericTextVariants` (CVA).

**v1 API**

```typescript
interface TypographyProps<
  T extends React.ElementType = "p"
> extends React.ComponentPropsWithoutRef<T> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
         | "subtitle" | "body" | "caption" | "overline";
  align?: "left" | "center" | "right";
  truncate?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface NumericTextProps {
  value: number;
  format?: "currency" | "percent" | "number" | "compact" | "basisPoints";
  currency?: string;          // ISO code, default "USD"
  signed?: boolean;            // force + on positives (deltas)
  precision?: number;
  colorize?: boolean;         // red/green based on sign
  align?: "left" | "right";
  tabular?: boolean;           // default true
  monospace?: boolean;
  className?: string;
}
```

**Implementation Notes**

1. Back all formatting through `lib/number-utils.ts` (see Shared Contracts).
2. Default `tabular-nums` on for `NumericText`; monospace optional.
3. Use semantic positive and negative tokens (`text-positive` / `text-negative` / `text-foreground`), not hard-coded finance colors. See Theming Work for token wiring.
4. When `colorize` is on, positive values use `text-positive`, negative `text-negative`, zero `text-foreground`. Never rely on color alone — pair with a visible sign or `aria-label`.

**Stories**

- All `Typography` variants + alignment + truncation.
- `NumericText`: currency, percent, compact, basisPoints, signed deltas, colorized P&L (pos/neg/zero), right-aligned columns, dark mode.

### 2. AnimatedNumber

**Folder:** `src/components/animated-number/`

**Purpose:** Smooth value transitions for KPI tiles and price tickers that roll on update — e.g. portfolio value, day P&L, last-trade price.

**v1 API**

```typescript
interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;   // delegate to number-utils
  duration?: number;                       // ms, default 400
  easing?: (t: number) => number;          // default easeOut
  flashOnChange?: boolean;                // brief bg flash on update
  flashColor?: "positive" | "negative" | "auto";
  reducedMotion?: boolean;                 // respects prefers-reduced-motion by default
  className?: string;
  ariaLabel?: string;                      // a11y: read settled value
}
```

**v1 Contract**

1. Animate between previous and next values via `requestAnimationFrame`; interpolate number, format, render.
2. Respect `prefers-reduced-motion` (jump to final value).
3. Announce only settled values for assistive tech via a throttled `aria-live="polite"` region; never per frame.
4. Optional flash-on-change is allowed, but not required for first ship if it risks complexity. If included, flash via `bg-positive/20` or `bg-negative/20` based on delta direction, cleared on next frame.
5. Cancel animation on unmount; never leak frames.

**Stories**

- Count up / count down across formats (currency, percent, compact).
- Flash positive/negative on update.
- Reduced motion path.
- High-frequency updates (throttled input).

### 3. ToggleGroup

**Folder:** `src/components/toggle-group/`

**Purpose:** Single and multi-select segmented control — timeframe (1D/1W/1M/1Y), order side (buy/sell), chart type, indicator toggles. Semantically correct where `ConnectedButtonGroup` was a workaround.

**Dependencies:** `@radix-ui/react-toggle-group`.

**Sub-components & Exports:** `ToggleGroup`, `ToggleGroupItem`, `toggleGroupVariants`, `toggleGroupItemVariants`.

**v1 API**

```typescript
interface ToggleGroupProps {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<"button"> {
  value: string;
  disabled?: boolean;
  className?: string;
}
```

**v1 Contract**

1. Support `single` and `multiple` modes.
2. Support at least `default` and `outline` variants.
3. Support size variants (`xs`/`sm`/`md`/`lg`) used by the toolbar and templates.

**Styling Decisions**

Connected buttons with shared border; active item `bg-primary text-primary-foreground`, inactive `bg-transparent hover:bg-accent`. Sizes match form input conventions from existing components.

**Stories**

- Single select (timeframe), multi select (indicators).
- All sizes/variants, disabled, controlled/uncontrolled, dark mode.

### 4. Resizable

**Folder:** `src/components/resizable/`

**Purpose:** Draggable, collapsible multi-pane layouts — essential for trading dashboards (chart | order book | watchlist, news | positions | tape). `Flex` / `Grid` cannot do this.

**Dependencies:** `react-resizable-panels` (best keyboard a11y story among options).

**Sub-components & Exports**

- `Resizable` (alias of `ResizablePanelGroup`) — root context provider.
- `ResizablePanel` — individual panel.
- `ResizableHandle` — draggable splitter.
- Variants: `resizableHandleVariants` (CVA).

**v1 API**

```typescript
interface ResizableProps {
  direction: "horizontal" | "vertical";
  className?: string;
  children?: React.ReactNode;
  autoSaveId?: string;       // optional layout persistence (localStorage)
  storage?: PanelGroupStorage; // pluggable storage backend
}

interface ResizablePanelProps {
  id?: string;
  defaultSize?: number;     // percentage
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  order?: number;
  onCollapse?: () => void;
  onExpand?: () => void;
  onResize?: (size: number) => void;
  className?: string;
  children?: React.ReactNode;
}

interface ResizableHandleProps {
  variant?: "line" | "bar" | "grip";
  direction: "horizontal" | "vertical";
  disabled?: boolean;
  onDragging?: (isDragging: boolean) => void;
  className?: string;
}
```

**v1 Contract**

1. Wrap `react-resizable-panels` with library styling and typed props.
2. Provide `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle`.
3. Support optional layout persistence through `autoSaveId`.
4. Do not add an imperative `useResizablePanel` hook until a real consumer needs it.
5. Guard storage access for non-browser environments (Electron SSR, tests).

**Styling Decisions**

- Handle `line` variant: `w-px bg-border` default, `bg-primary/40` on hover, `transition-colors`.
- `bar` variant: `w-1.5` with gradient thumb, grows to `w-2` on drag.
- `grip` variant: centered `GripVertical` (lucide) revealed on hover.
- Collapsed handles show a chevron-direction indicator to expand.
- Keyboard: ArrowKeys resize by 1%, Shift+Arrow by 10%.

**Stories**

- Horizontal 3-pane, vertical stacked, collapsible panels, nested groups, persisted layout (`autoSaveId`), controlled collapse, min/max constraints, disabled handle, all handle variants, dark mode.

### 2. AnimatedNumber

**Folder:** `src/components/animated-number/`

**Purpose:** Smooth value transitions for KPI and ticker surfaces.

**v1 Contract**

1. Animate between previous and next values via `requestAnimationFrame`.
2. Respect reduced motion.
3. Announce only settled values for assistive tech.
4. Optional flash-on-change is allowed, but not required for first ship if it risks complexity.

### 3. ToggleGroup

**Folder:** `src/components/toggle-group/`

**Purpose:** Single and multi-select segmented control.

**v1 Contract**

1. Support `single` and `multiple` modes.
2. Support at least `default` and `outline` variants.
3. Support size variants used by toolbar and templates.

### 4. Resizable

**Folder:** `src/components/resizable/`

**Purpose:** Pane layouts for dashboard composition.

**v1 Contract**

1. Wrap `react-resizable-panels` with library styling and typed props.
2. Provide `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle`.
3. Support optional layout persistence through `autoSaveId`.
4. Do not add an imperative hook until a real consumer needs it.

### 5. CommandPalette

**Folder:** `src/components/command-palette/`

**Purpose:** Keyboard-first search and action launcher (⌘K / Ctrl+K). Power-user investment ops: symbol lookup ("AAPL"), switch watchlist, place quick order, jump to account, load chart layout, toggle indicator.

**Dependencies:** `cmdk` (already present, headless, accessible).

**Sub-components & Exports**

- `CommandPalette` — root dialog (overlay + content + animation).
- `CommandPaletteTrigger` — button or shortcut listener (auto-registers ⌘K).
- `CommandInput` — search field with clear button.
- `CommandList` — scrollable results container (uses `ScrollArea`).
- `CommandEmpty` — empty-state fallback.
- `CommandGroup` — labeled section (Symbols / Actions / Recent).
- `CommandItem` — selectable row with icon, label, shortcut hint, optional metadata.
- `CommandSeparator` — divider between groups.
- `CommandLoading` — progress indicator during async search.
- Hook: `useCommandPalette()` for open state + programmatic open/close.

**v1 API**

```typescript
interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  shortcut?: string | false;    // default "cmd+k" / "ctrl+k"
  placeholder?: string;
  emptyMessage?: string;
  filter?: boolean | ((value: string, search: string) => number);
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface CommandItemProps {
  value: string;               // search value (may differ from label)
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  metadata?: React.ReactNode;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
}
```

**v1 Contract**

1. Dialog container, Input, List, Empty state, Group, Item, Separator, Loading state.

**v1 Scope Cuts**

1. Ship with flat groups, async loading, and configurable shortcut handling.
2. Nested sub-actions (e.g., "Load Layout" expanding inline to show layouts) are deferred.

**Styling Decisions**

- Overlay: `bg-black/50 backdrop-blur-sm`; content `max-w-xl` centered toward top, `shadow-lg`.
- Selected item: `bg-accent text-accent-foreground`.
- Group label: `text-xs font-medium text-muted-foreground px-2 py-1.5`.
- Item: `px-2 py-1.5 rounded-md`, icon `mr-2 size-4 text-muted-foreground`, shortcut `ml-auto text-xs text-muted-foreground`.
- Animations: fade + `translateY(-4px → 0)` open, reverse on close (M3 motion tokens).

**Implementation Notes**

1. Support a configurable shortcut; the consumer binds host-app specific keys (don't hardwire Electron-specific key handling into the component).
2. Use `ScrollArea` for the list body so it matches the rest of the kit.
3. Full keyboard nav, `role="dialog"` + `role="listbox"`, focus trap, ESC to close.

**Stories**

Basic list, grouped (symbols/actions/recent), async search with debounce, custom filter, keyboard shortcut trigger, programmatic open, dark mode. (Nested sub-actions deferred.)

### 6. Toolbar

**Folder:** `src/components/toolbar/`

**Purpose:** Dense horizontal action strip for desktop and data-heavy surfaces — chart toolbar (select candlestick/line/area, timeframe, indicators toggle), table action bars, filter bars. Semantically richer than `ButtonGroup`; handles overflow and keyboard navigation between actions.

**Dependencies:** `@radix-ui/react-toolbar`.

**Sub-components & Exports**

- `Toolbar` — root container.
- `ToolbarButton` — action button (with tooltip on hover).
- `ToolbarToggle` — toggleable button (active state).
- `ToolbarToggleGroup` — single/multi toggle group (see v1 Scope Cuts).
- `ToolbarSeparator` — visual divider.
- `ToolbarLabel` — labeled region within the toolbar.
- Variants: `toolbarVariants`, `toolbarButtonVariants` (CVA).

**v1 API**

```typescript
interface ToolbarProps {
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tooltip?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
}
```

**v1 Contract**

1. Root, Button, Toggle, Separator, Label.
2. For `ToolbarToggleGroup`, if it materially overlaps `ToggleGroup`, prefer composition (wrap `ToggleGroup`) instead of inventing a second state model.

**v1 Scope Cuts**

1. Overflow wrapping is sufficient for v1; advanced collapsing logic (overflow menu) is deferred.

**Styling Decisions**

- Container: `flex gap-0.5 p-1 rounded-md border bg-background`.
- Items: `size-8 rounded` hover `bg-accent`, active `bg-primary text-primary-foreground`.
- Vertical orientation stacks.

**Stories**

- Chart toolbar (candlestick/line/area + timeframe + indicators toggle), table action bar (refresh/export/filter), vertical toolbar, grouped toolbars, overflow wrapping behavior, dark mode.

### 7. OrderBook

**Folder:** `src/components/order-book/`

**Purpose:** Specialized level-2 depth ladder with bid/ask depth bars, spread display, and high-frequency streaming updates. Specialized enough and reused across multiple screens (right rail, standalone L2 view) to warrant a first-class component — not a good fit for `DataTable`'s generic row model due to strict rendering perf requirements.

**Sub-components & Exports**

- `OrderBook` — root container, manages bid/ask rendering and spread.
- `OrderBookSide` — `bid` | `ask` column with depth visualization bars behind rows.
- `OrderBookRow` — price / size / total row (uses `NumericText` + `lib/number-utils`).
- `OrderBookSpread` — center band showing `ask − bid` and percent spread.
- `OrderBookHeader` — column headers (Price / Size / Total).
- `OrderBookSkeleton` — loading placeholder using `Skeleton`.
- Variants: `orderBookRowVariants`, `orderBookSideVariants` (CVA).

**v1 API**

```typescript
interface OrderBookProps {
  bids: OrderBookLevel[];      // sorted desc by price (see finance-types.ts)
  asks: OrderBookLevel[];      // sorted asc by price
  maxRows?: number;            // visible levels per side, default 15
  precision?: number;          // price decimals
  currency?: string;
  highlightLast?: boolean;     // flash last-updated rows
  onLevelClick?: (level: OrderBookLevel, side: "bid" | "ask") => void;
  className?: string;
}
```

**v1 Contract**

1. Bids and asks render in stable sorted order.
2. Spread band renders from top-of-book values.
3. Depth bars scale relative to visible-window depth.
4. Rows use `NumericText`.

**v1 Scope Cuts**

1. Ship a stable display surface before chasing maximum update-rate optimization.
2. Start with capped row counts and memoized rows.
3. Use `@tanstack/react-virtual` only if profiling shows a clear need at the configured row counts.
4. Optional filters and advanced flash treatments may follow after the base widget is stable.

**Styling Decisions**

- Bid price `text-positive`, ask price `text-negative`, monospace throughout.
- Depth bars: absolutely-positioned `div` with `width: %` relative to max depth in visible window; `bg-positive-muted` for bid, `bg-negative-muted` for ask. No re-layout on update.
- Separator band between bid/ask sides: `border-y`.
- Spread band: `text-xs py-1 bg-muted/50`.

**Performance Notes**

1. Memoize rows (`React.memo` with a custom `arePropsEqual` keyed on price+size) before reaching for virtualization.
2. Keep props stable in stories to expose real rerender behavior; do not allocate fresh arrays inside the consumer's render.
3. Row flash: brief `bg-positive/20` / `bg-negative/20` overlay on the row whose `size` changed, cleared on next frame via rAF.
4. Treat thousands-of-updates-per-second as a stretch target, not an entry requirement.
5. Pre-sort upstream and mutate in place in the hot path; avoid per-update allocations.

**Stories**

Static snapshot, high-frequency simulated stream (setInterval pushes), spread display, depth bars, click handler, loading skeleton, custom `maxRows`, empty state, dark mode.

### 8. TimeAndSales

**Folder:** `src/components/time-and-sales/`

**Purpose:** Streaming recent-trades tape (last trades) — time, price, size, side, flags (block, uptick/downtick). High-update-frequency, autoscroll-to-latest, capped visible rows for perf.

**Sub-components & Exports**

- `TimeAndSales` — root, manages streaming + cap + autoscroll.
- `TimeAndSalesRow` — single trade row (time, price, size, side badge, flags).
- `TimeAndSalesHeader` — column labels.
- `TimeAndSalesFilter` — optional control to filter by size min, block-only, side (uses `Select`/`Switch`).
- Variants: `timeAndSalesRowVariants` (CVA).

**v1 API**

```typescript
interface TimeAndSalesProps {
  trades: Trade[];            // see finance-types.ts
  maxRows?: number;           // rolling window, default 100
  autoScroll?: boolean;       // stick to bottom on new trade, default true
  precision?: number;
  onTradeClick?: (trade: Trade) => void;
  className?: string;
}
```

**v1 Contract**

1. Fixed rolling window: drop oldest beyond `maxRows`.
2. Optional autoscroll (stick to bottom on new trade unless user has scrolled up — track `isAtBottom`).
3. Side-aware row treatment (buy/sell/unknown).
4. Click callback for row selection.

**v1 Scope Cuts**

1. Defer advanced filtering if it slows delivery. Ship the `TimeAndSalesFilter` sub-component only if straightforward.
2. Use relative or absolute time formatting consistently within the tape.

**Styling Decisions**

- Compact `text-xs`, right-aligned numerics via `NumericText`, monospace.
- Time via `formatTime` (`lib/date-utils.ts`) or `lib/time-utils.ts` relative — pick one consistently.
- Buy `text-positive`, sell `text-negative`, block trades get a `Badge` variant `secondary` on the right.
- Side color bar on the left edge of the row.
- Row flash: same rAF overlay pattern as `OrderBook` for the newest row.

**Implementation Notes**

1. Rolling window via `useMemo` + slice (or immer) — avoid re-creating the array on stable inputs.
2. Autoscroll: `ScrollArea` ref + `scrollToBottom()` on append unless user scrolled up.
3. Screen reader announcements are throttled (see Accessibility Requirements); never per-tick.

**Stories**

Static list, simulated stream, autoscroll on/off, block trade highlighting, filters, click handler, dark mode, empty/loading.

### 9. Templates

**Folder:** `src/templates/investment-ops/`

**Guiding Rule:** Templates compose. They should not become a second primitive system.

#### 9A. StatTile

Composed from `Card` + `Badge` + `NumericText` + `AnimatedNumber` + chart lib sparkline slot.

```typescript
interface StatTileProps {
  label: string;                 // "Portfolio Value", "Day P&L"
  value: number;
  format?: NumericFormat;
  delta?: number;               // change vs prev period
  deltaFormat?: "absolute" | "percent";
  deltaColorize?: boolean;
  period?: string;              // "1D", "1W", "1M"
  icon?: React.ReactNode;
  sparkline?: React.ReactNode;  // chart lib renders inline (render slot)
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}
```

Layout: `Card` with `CardHeader` (label + period `Badge`) + `CardContent` (value via `AnimatedNumber`, delta row with `lucide` `ArrowUp`/`ArrowDown` colored), optional sparkline `CardMedia` below. Stories: default, delta positive/negative/zero, loading skeleton, with/without sparkline, dark mode.

#### 9B. AccountSummary

Composed from a `Grid` of `StatTile` (9A) instances + `NumericText` + `AnimatedNumber`. Fields: Cash, Equity, Margin used, Buying power, Day P&L, Total P&L, Maintenance excess. Render as 3–4 KPI tiles in a `Grid`. No custom data model beyond a documented prop interface; consumer passes the tile data in. Stories: filled account, low balance / margin warning, loading, dark mode.

#### 9C. Watchlist

Composed from `DataTable` + `Badge` + `NumericText` + `ContextMenu` + chart-lib sparklines + an empty-state (`Card` + `Alert`). Columns: Symbol, Last, Change, Change %, Volume, Sparkline (render slot for chart lib). Row context menu (Add to portfolio / View chart / Remove / Set alert), row selection, loading via `DataTable`'s built-in `Skeleton`. Consumes `WatchlistItem[]` (see `finance-types.ts`); sparkline cell delegates to the chart lib. Stories: populated list, empty, loading, with/without sparkline column, dark mode. **Avoid special table internals unless the generic `DataTable` clearly blocks the use case.**

#### 9D. HoldingsTable

Composed from `DataTable` + `Badge` + `NumericText` + `DropdownMenu` (row actions) + `Tooltip` (P&L breakdown hover). Columns: Symbol, Quantity, Avg Cost, Last, Mkt Value, Unrealized P&L ($ and %), Weight %, Day Change. Colorize P&L via `NumericText colorize`. Row actions dropdown: Sell / Buy more / View history / Tax lots. **Grouping is optional for v1.** Stories: filled positions, empty portfolio, loading, long positions list (virtualization via `DataTable`), dark mode.

#### 9E. OrderTicket

Composed from `Sheet` (right-docked default per Open Decision #4) or `Dialog` variant + `Radio`/`ToggleGroup` (buy/sell) + `InputIncrementor` (quantity) + `Input` (limit price) + `Select` (order type: market/limit/stop/stop-limit) + `Select` (TIF: day/gtc/ioc/fok) + `Button` (submit) + `Alert` (insufficient funds / pattern day trader warning) + `NumericText` (estimated cost, buying power after). Confirmation uses `AlertDialog` → `toast.promise` on submit. **Ship a simple equity flow first; multi-leg option support is explicitly deferred** (a `Stepper`-based legs→review→confirm flow could be added later). Stories: buy market, sell limit, validation errors, insufficient funds, loading submit (toast promise), dark mode.

#### 9F. AllocationBreakdown

Composed from `Card` + `Tabs` (by Sector / Asset Class / Holding) + chart lib (treemap/donut — external) + `DataTable` (breakdown table beside chart). **Keep the visualization chart-agnostic through a slot prop** so the block ships before the chart lib lands. Stories: sector view, asset class view, holding list view, loading, empty, dark mode.

#### 9G. NewsFeed

Composed from `Card` + `Avatar` (source logo) + `Badge` (ticker(s) mentioned) + `Chip` (sentiment: positive/negative/neutral) + `Typography` + `lib/time-utils` relative time. Filterable list (`MultiSelect` for ticker filter, `ToggleGroup` for sentiment); infinite-scroll via `ScrollArea` infinite mode (may be simulated in Storybook if real fetch orchestration is not yet defined); click → opens article in `Dialog` or external link. Stories: populated feed, filtered by ticker, filtered by sentiment, block-trade highlights, empty, loading, dark mode.

#### 9H. DashboardShell

Composed from already-shipped primitives only — this story becomes the integration showcase and regression surface.

Layout (using `Resizable` from Stream 1):

- Left rail: `Navrail` (Watchlists, Portfolios, Screener, News, Alerts, Settings).
- Center: `Tabs` (Overview / Chart / Positions / Activity) — each tab composes the relevant blocks above; chart tab embeds the external chart lib + chart `Toolbar` (6).
- Right rail: `Resizable direction="vertical"` stacking → `OrderBook` (7) + `TimeAndSales` (8) or watchlist depending on mode.
- Top: `Navbar` with global search (`CommandPalette` trigger from 5) + account switcher + theme toggle.
- Floating: `FAB` or `ExtendedFAB` for "Place Order" → opens `OrderTicket` (`Sheet`).

**No new primitives should be invented here unless a blocker is discovered**; left rail, center tabs, and right rail are all composed from already-shipped items. Stories: full shell light mode, full shell dark mode, collapsed panels, order entry flow, search flow.

## Theming Work

Add semantic finance tokens to `src/globals.css` and corresponding Tailwind aliases so utilities like `text-positive` / `bg-negative-muted` work across React and (via `resolveToken` in `lib/color-utils.ts`) canvas-based chart code.

```css
:root {
  --positive: 158 64% 52%;        /* emerald-600 equivalent */
  --negative: 347 77% 50%;        /* rose-600 equivalent */
  --positive-foreground: 0 0% 100%;
  --negative-foreground: 0 0% 100%;
  --positive-muted: 158 64% 52% / 0.15;
  --negative-muted: 347 77% 50% / 0.15;
}
.dark {
  --positive: 152 65% 55%;
  --negative: 346 80% 58%;
  --positive-foreground: 0 0% 100%;
  --negative-foreground: 0 0% 100%;
  --positive-muted: 152 65% 55% / 0.15;
  --negative-muted: 346 80% 58% / 0.15;
}
```

Update `tailwind.config.js` to add matching `positive` / `negative` color keys bound to those CSS variables, so `text-positive`, `bg-negative-muted`, `border-positive`, etc. become first-class utilities.

## Accessibility Requirements

1. Sign must never be communicated by color alone — pair color with a visible `+` / `−` sign, an icon (`ArrowUp` / `ArrowDown`), or an `aria-label`.
2. Keyboard navigation must work for `Resizable`, `CommandPalette`, `Toolbar`, and `ToggleGroup`. `Resizable`: ArrowKeys resize (1%), Shift+Arrow (10%); ARIA `role="separator"` + `aria-orientation`. `CommandPalette`: full keyboard nav, `role="dialog"` + `role="listbox"`, focus trap, ESC to close.
3. Streaming widgets (`OrderBook`, `TimeAndSales`) must not announce every tick individually — provide sr-only summary announcements at a throttled cadence (e.g., every ~1s) via a `aria-live="polite"` region summarizing last/top-of-book.
4. Reduced motion must be respected by `AnimatedNumber` and any flash effects (`prefers-reduced-motion`).
5. `NumericText` exposes its formatted value via `aria-label`; do not rely on visible digits alone for screen readers when colorize is on.

## Performance Requirements

These are acceptance targets for Storybook stress stories, not hard product SLAs.

1. `OrderBook` remains visually responsive under a synthetic high-frequency update story.
2. `TimeAndSales` remains responsive while appending rows at a fixed interval.
3. `AnimatedNumber` cancels animation on unmount and does not leak frames.
4. Templates with tables use existing virtualization support where row counts justify it.

## Storybook Requirements

Every deliverable should include stories for the states that actually de-risk implementation.

### Minimum Story Matrix

1. Default
2. Controlled usage where applicable
3. Empty state
4. Loading state
5. Dark mode
6. Stress or dense-data state where relevant

## Roadmap Updates

As items ship, update the roadmap subfiles, not just the top-level index.

### Required Updates

1. `docs/roadmap/existing-components.md`
2. `docs/roadmap/advanced-components.md`
3. `docs/roadmap/templates.md`
4. `docs/roadmap/phases.md`
5. `docs/roadmap/changelog.md`

### Roadmap Alignment Changes to Make Early

1. Remove the generic `Data Dashboard` placeholder in favor of the investment-ops template set.
2. Raise the effective priority of `Resizable`, `Command Palette`, `Toolbar`, and `Toggle Group` if they are now blockers for a flagship dashboard.

## Templates Placement — RESOLVED

**Decision:** `src/templates/investment-ops/` is the approved home for composed template blocks. No `block-` prefix needed. Implementers establish the directory per the plan, update `docs/roadmap/templates.md` to point at it, and treat the generic `Data Dashboard` placeholder as superseded by this concrete investment-ops set. This decision is final and blocks Open Question #5 from the earlier version of this plan.

## Export Wiring

Each new file adds exports following the existing per-component comment-section pattern.

### Root entrypoint (`src/index.ts`)

Generic primitives and utilities continue to export from the root:

- `Typography`, `NumericText`, `typographyVariants`, `numericTextVariants`
- `AnimatedNumber`
- `ToggleGroup`, `ToggleGroupItem`, `toggleGroupVariants`, `toggleGroupItemVariants`
- `Resizable`, `ResizablePanel`, `ResizableHandle`, `resizableHandleVariants`
- `CommandPalette` (+ sub-components and `useCommandPalette`)
- `Toolbar` (+ sub-components and variants)
- `formatCurrency`, `formatPercent`, `formatNumber`, `formatCompact`, `formatBasisPoints`, `formatSigned`, `roundToTick`, etc. (from `lib/number-utils.ts`)
- `formatRelativeTime`, `formatRelativeTimeShort`, `formatDuration` (from `lib/time-utils.ts`)
- `pnlColorClass`, `sentimentColor`, `resolveToken` (from `lib/color-utils.ts`)
- Finance types from `lib/finance-types.ts` (`OrderBookLevel`, `Trade`, `TradeFlag`, `WatchlistItem`, `HoldingRow`).

### Secondary entrypoints (per Packaging and Export Strategy)

`OrderBook` / `TimeAndSales` export from `./finance` (or root if broadly reusable — see Open Decision). Templates export from `./templates/investment-ops`:

```typescript
// ./templates/investment-ops
export {
  InvestmentOpsDashboard,
  StatTile,
  Watchlist,
  HoldingsTable,
  OrderTicket,
  AccountSummary,
  AllocationBreakdown,
  NewsFeed,
} from "../../templates/investment-ops";
```

Update `tsup.config.ts` and `package.json` `exports` to declare the secondary entrypoints. Keep `./globals.css` as the CSS entrypoint unchanged.

## Open Decisions

These questions should be resolved before the affected phase starts.

1. `react-resizable-panels` remains the preferred resizable dependency unless evaluation uncovers a concrete keyboard or packaging blocker.
2. `cmdk` remains the preferred command palette dependency unless `tsup` or Electron packaging exposes a concrete issue.
3. `OrderBook` and `TimeAndSales` should start without bespoke rendering infrastructure; only optimize after profiling.
4. `OrderTicket` should default to `Sheet` for desktop trading use unless product constraints require a centered dialog.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Chart API is not ready when templates land | Chart-backed template stories stall | Use slot-based chart props so templates ship before the chart library |
| Streaming widgets are over-optimized too early | Delivery slows and complexity rises | Ship a stable capped-row v1 first, then profile |
| Root exports become overloaded with domain code | Package becomes harder to consume and maintain | Use secondary entrypoints for finance and templates |
| Browser-only helpers leak into shared code | SSR/Electron packaging issues | Guard `localStorage`, CSS token reads, and window access |

## Definition of Done

An item is not complete until all of the following are true:

1. Code is implemented.
2. Storybook stories exist for required states.
3. Exports are wired correctly.
4. Docs and `agents.md` files are updated.
5. Roadmap status is updated.
6. Build and Storybook validation pass.

## Summary

This plan now sequences the work as:

1. Utilities and numeric primitives
2. Resizable layout primitive
3. Power-user desktop primitives
4. Finance streaming widgets
5. Composed investment-ops blocks
6. Dashboard shell integration

That order keeps the early phases cheap to validate, prevents domain templates from distorting the core package surface, and gives the dashboard shell a stable base instead of turning it into the place where missing primitives are discovered.