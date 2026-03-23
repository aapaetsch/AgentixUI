# Premium Tier Components

> Advanced components with complex interactions, state management, or third-party dependencies.

### Implemented

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **FAB** | ✅ Complete | `FAB`, `ExtendedFAB`, `FABMenu` | Material Design floating action buttons |
| **ComboBox** | ✅ Complete | `ComboBox`, `OutlinedComboBox` | Searchable select with virtualization, async loading, MD3 variants |
| **Slider** | ✅ Complete | `PremiumSlider` extends free tier: lg/xl sizes, circular/knobless handles, value indicators, stop indicators, inset icons, MD3 animations | Radix Slider |
| **Premium Sheet** | ✅ Complete | `PremiumSheet` with swipe-to-dismiss gestures, spring animations, snap points | Advanced gesture support for mobile-first UIs |
| **Premium Toast** | ✅ Complete | `PremiumToastProvider`, `usePremiumToast`, `promise()` toasts, undo functionality | Promise-based loading states, undo actions, enhanced button variants |
| **Premium Stepper** | ✅ Complete | `PremiumStepper` with vertical orientation, non-linear navigation, inline collapsible content, custom connectors, async validation | Advanced stepper |
| **Carousel** | ✅ Complete | `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselIndicators`, `CarouselProgress`, `CarouselCounter` | Multiple transition effects (slide/fade/zoom/flip), responsive, autoplay support via embla-carousel |
| **Navigation Submenus** | ✅ Complete | `PremiumNavItemWithSubmenu`, `PremiumSubmenuItem` | Accordion-based submenus with animated chevrons, nested submenu support, controlled/uncontrolled state |
| **Date Picker** | ✅ Complete | `DatePicker`, `Calendar`, `YearSelector`, `Presets` | Single/range/multiple date selection, min/max constraints, disabled dates, presets, keyboard navigation, date-fns + react-day-picker |
| **Time Picker** | ✅ Complete | `TimePicker`, `InlineTimePicker` | 12h/24h format, scrollable hour/minute/second selectors, minute steps, AM/PM toggle |
| **Date Time Picker** | ✅ Complete | `DateTimePicker` | Combined date+time selection, tabs/side-by-side layouts, integrates DatePicker + TimePicker |
| **Multi-Select** | ✅ Complete | `MultiSelect`, `MultiSelectGroup`, `MultiSelectItem`, `MultiSelectSeparator` | Virtualized multi-select with tags, infinite scroll, search filtering, grouped/nested options |
| **Scroll Area** | ✅ Complete | `ScrollArea`, `ScrollAreaViewport`, `ScrollBar` | Custom scrollbar container with infinite scroll (auto/manual modes), RTL support, size variants | Radix Scroll Area |

### Planned

| Component | Priority | Description | Dependencies |
|-----------|----------|-------------|--------------|
| **Data Table** | 🔴 High | Sortable, filterable, paginated table with virtualization | TanStack Table |
| **Command Palette** | 🟢 Low | Searchable command menu (⌘K) for power users | cmdk |
| **Dropdown Menu** | 🟡 Medium | Dropdown/action menus with complex variants | Radix Dropdown Menu |
| **Progress (advanced)** | 🟡 Medium | Complex/segmented determinate progress | - |
| **Collapsible** | 🟢 Low | Expandable section | Radix Collapsible |
| **Toggle Group** | 🟢 Low | Single/multi toggle selection | Radix Toggle Group |
| **Toolbar** | 🟢 Low | Action toolbar | Radix Toolbar |
| **Menubar** | 🟢 Low | Application menu bar (Electron/desktop enhancements as Premium) | Radix Menubar |
| **Resizable** | 🟢 Low | Resizable panels | react-resizable-panels |
| **Color Picker** | 🟢 Low | Color selection (advanced variants in Premium) | - |
| **File Upload** | 🟢 Low | Drag & drop uploads; advanced/resumable features as Premium | - |
| **Rich Text Editor** | 🟢 Low | WYSIWYG editor | Tiptap or Slate |
| **Aspect Ratio** | 🟢 Low | Maintain aspect ratio container | Radix Aspect Ratio |
