# Advanced Components

> Advanced components with complex interactions, state management, or third-party dependencies.

### Implemented

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **FAB** | ✅ Complete | `FAB`, `ExtendedFAB`, `FABMenu` | Material Design floating action buttons |
| **ComboBox** | ✅ Complete | `ComboBox`, `OutlinedComboBox` | Searchable select with virtualization, async loading, MD3 variants |
| **Slider** | ✅ Complete | `Slider` adds lg/xl sizes, circular/knobless handles, value indicators, stop indicators, inset icons, and MD3 animations | Radix Slider |
| **Sheet** | ✅ Complete | `Sheet` with swipe-to-dismiss gestures, spring animations, and snap points | Advanced gesture support for mobile-first UIs |
| **Toast** | ✅ Complete | `ToastProvider`, `useToast`, `toast()`, promise toasts, undo functionality | Promise-based loading states, undo actions, enhanced button variants |
| **Stepper** | ✅ Complete | `Stepper` with vertical orientation, non-linear navigation, inline collapsible content, custom connectors, and async validation | Advanced stepper |
| **Carousel** | ✅ Complete | `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselIndicators`, `CarouselProgress`, `CarouselCounter` | Multiple transition effects (slide/fade/zoom/flip), responsive, autoplay support via embla-carousel |
| **Navigation Submenus** | ✅ Complete | `NavItemWithSubmenu`, `SubmenuItem` | Accordion-based submenus with animated chevrons, nested submenu support, controlled/uncontrolled state |
| **Date Picker** | ✅ Complete | `DatePicker`, `Calendar`, `YearSelector`, `Presets` | Single/range/multiple date selection, min/max constraints, disabled dates, presets, keyboard navigation, date-fns + react-day-picker |
| **Time Picker** | ✅ Complete | `TimePicker`, `InlineTimePicker` | 12h/24h format, scrollable hour/minute/second selectors, minute steps, AM/PM toggle |
| **Date Time Picker** | ✅ Complete | `DateTimePicker` | Combined date+time selection, tabs/side-by-side layouts, integrates DatePicker + TimePicker |
| **Multi-Select** | ✅ Complete | `MultiSelect`, `MultiSelectGroup`, `MultiSelectItem`, `MultiSelectSeparator` | Virtualized multi-select with configurable chip variants/colors, infinite scroll, search filtering, grouped/nested options |
| **Data Table** | ✅ Complete | `DataTable`, `DataTableColumnHeader`, `DataTableToolbar`, `DataTablePagination`, `DataTableRowActions` | Sortable, filterable, paginated, selectable table with virtualization powered by TanStack Table |
| **Scroll Area** | ✅ Complete | `ScrollArea`, `ScrollAreaViewport`, `ScrollBar` | Custom scrollbar container with infinite scroll (auto/manual modes), RTL support, size variants | Radix Scroll Area |

### Planned

| Component | Priority | Description | Dependencies |
|-----------|----------|-------------|--------------|
| **Command Palette** | ✅ Complete | `CommandPalette`, `CommandPaletteTrigger`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandLoading`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `useCommandPalette` | Searchable command menu (⌘K) for power users, Dialog + ScrollArea integration, flat groups, async search support; nested sub-actions deferred per v1 plan | cmdk |
| **Toggle Group** | ✅ Complete | `ToggleGroup`, `ToggleGroupItem`, `toggleGroupVariants`, `toggleGroupItemVariants` | Single/multi segmented control, default/outline variants, xs/sm/md/lg sizes | Radix Toggle Group |
| **Toolbar** | ✅ Complete | `Toolbar`, `ToolbarButton`, `ToolbarToggle`, `ToolbarToggleGroup`, `ToolbarToggleItem`, `ToolbarSeparator`, `ToolbarLabel`, `toolbarVariants`, `toolbarButtonVariants` | Dense action strip, horizontal/vertical orientation, roving tabindex, toggle-group composes Phase 1 `ToggleGroup` | Radix Toolbar |
| **Resizable** | ✅ Complete | `Resizable` (alias `ResizablePanelGroup`), `ResizablePanel`, `ResizableHandle`, `resizableHandleVariants` | Draggable collapsible multi-pane layouts, keyboard resize (Arrow + Shift), `autoSaveId` persistence (SSR-safe), line/bar/grip handle variants | react-resizable-panels |
| **OrderBook** | ✅ Complete | `OrderBook`, `OrderBookSide`, `OrderBookRow`, `OrderBookSpread`, `OrderBookHeader`, `OrderBookSkeleton`, `orderBookRowVariants`, `orderBookSideVariants` | Level-2 depth ladder with bid/ask depth bars + spread; memoized rows; throttled SR summary; exports from `./finance` secondary entrypoint | - |
| **TimeAndSales** | ✅ Complete | `TimeAndSales`, `TimeAndSalesRow`, `TimeAndSalesHeader`, `timeAndSalesRowVariants` | Streaming recent-trades tape, rolling window, autoscroll unless scrolled up, throttled SR summary; exports from `./finance` secondary entrypoint | - |

### Options (Phase J-open) — ✅ Complete

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **OptionSymbolBadge** | ✅ Complete | `OptionSymbolBadge` | Compact `ROOT MM/DD/YY STRIKE{C\|P}` token composing `Badge` (`success`→call, `destructive`→put). |
| **ExpiryBadge** | ✅ Complete | `ExpiryBadge`, `DEFAULT_EXPIRY_THRESHOLDS`, `ExpiryBadgeBand` | Color-graded DTE pill (far/near/imminent/expiring) → `Badge` variants; optional pulse on `<1d`. |
| **GreeksDisplay** | ✅ Complete | `GreeksDisplay`, `DEFAULT_GREEK_GLOSSARY` | Δ/Γ/Θ/ν/ρ cluster via `NumericText` + per-cell glossary `Tooltip`. `grid` \| `inline` layouts. |
| **BreakevenBadges** | ✅ Complete | `BreakevenBadges` | Pill row of breakeven prices via `Badge variant="outline"` + `NumericText`. |
| **PayoffDiagram** | ✅ Complete | `PayoffDiagram`, `payoffContainerVariants` | Inline-SVG hockey-stick payoff curve (line/area), spot marker, breakeven dots, zero baseline. Mirrors `Sparkline` precedent. |
| **GreeksDecayChart** | ✅ Complete | `GreeksDecayChart`, `greeksDecayContainerVariants` | Inline-SVG mini multi-line chart of Δ/Γ/Θ/ν over DTE. Per-Greek Tailwind text-color tokens. |
| **IVChart** | ✅ Complete | `IVChart`, `ivChartContainerVariants` | Inline-SVG IV term-structure (`Sparkline`-like) + ≤~100-cell IV surface heatmap. |
| **StrikesNavigator** | ✅ Complete | `StrikesNavigator`, `strikesNavigatorVariants` | Virtualized strike ladder with ITM/ATM/OTM striping + quick-jump input. Windowed slice. |
| **LegBuilderRow** | ✅ Complete | `LegBuilderRow`, `legBuilderRowVariants` | One reversible Buy/Sell × Call/Put × strike (`ComboBox`) × qty (`InputIncrementor`) row. |
| **SpreadTypeSelector** | ✅ Complete | `SpreadTypeSelector`, `DEFAULT_SPREAD_OPTIONS`, `SpreadType` | Spread template picker (single/vertical/calendar/straddle/strangle/iron-condor/butterfly) composing `ToggleGroup`. |
| **Progress (advanced)** | 🟡 Medium | Complex/segmented determinate progress | - |
| **Collapsible** | 🟢 Low | Expandable section | Radix Collapsible |
| **Menubar** | 🟢 Low | Application menu bar with Electron/desktop enhancements | Radix Menubar |
| **Color Picker** | 🟢 Low | Color selection with advanced variants | - |
| **File Upload** | 🟢 Low | Drag & drop uploads; resumable and advanced flows | - |
| **Rich Text Editor** | 🟢 Low | WYSIWYG editor | Tiptap or Slate |
| **Aspect Ratio** | 🟢 Low | Maintain aspect ratio container | Radix Aspect Ratio |
