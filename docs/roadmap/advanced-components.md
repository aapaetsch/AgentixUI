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
| **Command Palette** | 🟢 Low | Searchable command menu (⌘K) for power users | cmdk |
| **Progress (advanced)** | 🟡 Medium | Complex/segmented determinate progress | - |
| **Collapsible** | 🟢 Low | Expandable section | Radix Collapsible |
| **Toggle Group** | 🟢 Low | Single/multi toggle selection | Radix Toggle Group |
| **Toolbar** | 🟢 Low | Action toolbar | Radix Toolbar |
| **Menubar** | 🟢 Low | Application menu bar with Electron/desktop enhancements | Radix Menubar |
| **Resizable** | 🟢 Low | Resizable panels | react-resizable-panels |
| **Color Picker** | 🟢 Low | Color selection with advanced variants | - |
| **File Upload** | 🟢 Low | Drag & drop uploads; resumable and advanced flows | - |
| **Rich Text Editor** | 🟢 Low | WYSIWYG editor | Tiptap or Slate |
| **Aspect Ratio** | 🟢 Low | Maintain aspect ratio container | Radix Aspect Ratio |
