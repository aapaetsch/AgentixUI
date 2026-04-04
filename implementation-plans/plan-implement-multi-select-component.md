## Plan: Multi-Select Component Implementation

Implement a multi-select component that enables users to select multiple items from a dropdown with tag-based display, search filtering with custom filter support, infinite scroll for async loading, virtualization, nested grouping/subgrouping support, and full accessibility compliance. Selected items remain highlighted with optional checkmarks in the dropdown, selection display switches to summary after 10 items, and the component leverages existing patterns (ComboBox, Chip, DatePicker) and `@headlessui/react` primitive following the established project architecture.

### Steps

1. Create `src/components/multi-select/` folder structure with `index.tsx`, `MultiSelect.stories.tsx`, `agents.md`, and `README.md`.

2. Define TypeScript interfaces for component props and options, including:
   - `MultiSelectOption<T>`: `value: T`, `label: string`, `disabled?: boolean`, `icon?: React.ReactNode`, `description?: string`, `group?: string`, `subgroup?: string`
   - `MultiSelectProps<T>`: `value: T[]`, `onValueChange: (values: T[]) => void`, `options: MultiSelectOption<T>[]`, `disabled?: boolean`, `placeholder?: string`, `searchPlaceholder?: string`, `showSelectAll?: boolean`, `showSelectedIcon?: boolean`, `maxVisibleTags?: number` (default: 10), `filterOption?: (option: MultiSelectOption<T>, search: string) => boolean`, `isLoading?: boolean`, `loadMore?: () => Promise<void>`, `hasMore?: boolean`, `customRenderer?: (option: MultiSelectOption<T>) => React.ReactNode`
   - Sub-component props: `MultiSelectTriggerProps`, `MultiSelectValueProps`, `MultiSelectItemProps`, `MultiSelectGroupProps`, `MultiSelectSearchInputProps`

3. Implement the CVA variant system with size variants (xs, sm, md, lg, xl) and visual variants (default, outlined, filled), exporting `multiSelectVariants` (root), `multiSelectTriggerVariants`, `multiSelectItemVariants`, `multiSelectGroupVariants` matching the project's established pattern in existing components.

4. Create the root `MultiSelect` component with controlled/uncontrolled patterns, value state management `T[]`, callbacks `onValueChange`, `onOpenChange`, internal state for search query (`string`), filtered options (`MultiSelectOption<T>[]`), and highlighted index (`number | null`).

5. Implement `MultiSelectTrigger` as a sub-component with click handling, focus management, keyboard navigation support (ArrowUp/Down: navigate items, Enter/Space: open dropdown, Escape: close dropdown, Tab: move focus, Ctrl+A: select all), and proper ARIA attributes (`aria-expanded`, `aria-haspopup="listbox"`, `aria-multiselectable="true"`, `aria-describedby` for error messages).

6. Build `MultiSelectValue` to render selected items as dismissible tags using the existing `Chip` component from `src/components/chip/` with `variant="assist"` or `variant="filter"`, `dismiss` callbacks, and overflow logic:
   - If selected items ≤ `maxVisibleTags` (default 10): display individual tags
   - If selected items > 10: display first 10 tags + "selected [count] more items" indicator

7. Create `MultiSelectContent` wrapper using `@radix-ui/react-popover` for dropdown positioning and focus trap, incorporating animation transitions with Material Design 3 motion tokens: duration `150ms`, easing `cubic-bezier(0.4, 0, 0.2, 1)`, `opacity-0 → opacity-100`, `translate-y-[-4px] → translate-y-0` for open, reversed for close.

8. Implement `MultiSelectSearchInput` with debounced filtering logic (300ms delay using `useCallback` with `setTimeout`), clear button (lucide `X` icon) displayed when search has content, search query state management, and `aria-label` for accessibility.

9. Build `MultiSelectItem` sub-component with hover/focus/active states, disabled state handling, optional checkmark icon (lucide `Check` icon with `size={16}`) displayed when `showSelectedIcon={true}` and item is in selected values, and support for custom item rendering via `customRenderer` prop for complex item layouts.

10. Create `MultiSelectGroup` and `MultiSelectLabel` sub-components for organizing options into logical groups:
    - `MultiSelectGroup`: container with `role="group"`, `aria-labelledby` pointing to label
    - `MultiSelectLabel`: styled heading for group name above group items
    - Support nesting by allowing `MultiSelectGroup` to contain other `MultiSelectGroup` instances (subgroups) with progressive indentation (`pl-4`, `pl-8`, etc.)

11. Implement `MultiSelectSeparator` component with `role="separator"` and `aria-orientation="horizontal"` for visual separation between groups or sections, using `border-b border-border my-2`.

12. Create `MultiSelectSelectAll` helper with styled checkbox (using existing `src/components/checkbox/`) to toggle all visible items in current search results, updating state and triggering `onValueChange`, displayed only when `showSelectAll={true}` and options exist.

13. Add `MultiSelectClearButton` with `X` icon (lucide `X`, `size={14}`) displayed when `value.length > 0`, positioned within trigger area after tags/summary, clearing all selections when clicked, with `aria-label="Clear all selections"`.

14. Integrate `@tanstack/react-virtual` for virtual scrolling support in dropdown content, enabling rendering of only visible items when options exceed 50-100 items, with:
    - Row estimation: `estimateSize={() => 40}` for standard height items
    - Overscan: `overscan={5}` for smooth scrolling
    - Dynamic row sizing for items with descriptions
    - Proper scroll position tracking and restoration on re-opens

15. Add infinite scroll support for async loading with `isLoading`, `hasMore`, `loadMore` props:
    - Loading spinner at bottom using `src/components/spinner/` when `isLoading={true}`
    - Scroll observer using `IntersectionObserver` or `useEffect` on scroll container to detect when user scrolls near bottom (~100px from bottom)
    - Trigger `loadMore()` when bottom reached and `hasMore={true}` and not already loading
    - "Load more" button fallback if IntersectionObserver not available

16. Implement custom filtering logic via `filterOption` prop:
    - Default filter: case-insensitive search in `label`, `description`, and `group` fields
    - Custom filter receives `(option: MultiSelectOption<T>, searchQuery: string) -> boolean`
    - Filter results update dropdown content in real-time (debounced via `MultiSelectSearchInput`)
    - If no filter option provided, use default simple label matching

17. Add validation support with `invalid` boolean, `error` string props, error message display below trigger with text-red-500 styling, `aria-invalid="invalid ? 'true' : 'false'`, `aria-errormessage` pointing to error element, and `aria-describedby` for additional help text.

18. Implement tag dismissal keyboard support:
    - Focus on tag: Tab to tag, Enter/Space to focus tag content
    - Backspace/Delete: remove last selected tag when focus is on search input or trigger
    - Arrow keys: navigate between tags within trigger
    - Maintain selection order: items displayed in order they were selected (not alphabetical)

19. Export all components from `src/components/multi-select/index.tsx`, update `src/index.ts` to export `MultiSelect`, `MultiSelectTrigger`, `MultiSelectValue`, `MultiSelectContent`, `MultiSelectItem`, `MultiSelectGroup`, `MultiSelectLabel`, `MultiSelectSeparator`, `MultiSelectSearchInput`, `MultiSelectSelectAll`, `MultiSelectClearButton`, and update `docs/ROADMAP.md` to track completion milestone.

20. Create comprehensive Storybook stories in `MultiSelect.stories.tsx` covering:
    - All size variants (xs, sm, md, lg, xl)
    - All visual variants (default, outlined, filled)
    - Basic usage with static options
    - Async loading with infinite scroll
    - Virtualization with 100+ options
    - Group and subgroup organization
    - Select all functionality
    - Custom filtering examples
    - Tag display >10 threshold behavior
    - Error/invalid states
    - Disabled states
    - Keyboard navigation demo
    - Accessibility compliance verification (axe-core)

21. Write `agents.md` following the project template:
    - Title: "MultiSelect Component"
    - Props interface summary (T[] values, MultiSelectOption<T>[] options, callbacks, configuration props)
    - Dependencies: `@headlessui/react`, `@radix-ui/react-popover`, `@tanstack/react-virtual`, `lucide-react`, existing Chip and Checkbox components
    - Styling decisions: CVA variants with M3 motion tokens, size alignment with form inputs
    - Maintenance notes: Virtualization threshold at 50 items, debounce at 300ms, infinite scroll observation at 100px from bottom, group nesting depth limit at 3 levels

22. Write `README.md` documenting:
    - Component overview and use cases
    - Installation and basic usage example
    - API reference for all props
    - Examples: basic, grouped, async-loading, custom-filtering, validation
    - Accessibility features and keyboard shortcuts
    - Performance considerations (virtualization, memoization)
    - Integration patterns with React Hook Form

### Component Spacing, Sizing, Effects & Animation Guidelines

#### Spacing & Layout
- **Spacing scale:** Use Tailwind rem-based spacing: `0` (0rem), `0.5` (0.125rem), `1` (0.25rem), `1.5` (0.375rem), `2` (0.5rem), `2.5` (0.625rem), `3` (0.75rem), `4` (1rem), `6` (1.5rem), `8` (2rem).
- **Internal padding:**
  - Trigger padding by size: xs(`p-1`/4px), sm(`p-2`/8px), md(`p-2.5`/10px), lg(`p-3`/12px), xl(`p-4`/16px)
  - Dropdown items: `py-2 px-3` (8px vertical, 12px horizontal)
  - Group labels: `py-1.5 px-3` (6px vertical, 12px horizontal)
  - Tags within trigger: `py-0.5 px-2` (2px vertical, 8px horizontal)
- **External spacing:**
  - Tags in value display: `gap-1.5` (6px) between adjacent tags
  - Group label to first item: `space-y-0.5` (2px gap)
  - Between groups: `my-2` (8px vertical margin)
  - Select all to first option: `mb-1` (4px margin)
  - Error message below trigger: `mt-1` (4px margin)
- **Layout rules:**
  - Trigger width: `min-w-[200px]` minimum, `w-full` responsive, custom `className` for fixed widths
  - Dropdown width: matches trigger width, `min-w-[220px]` minimum, overrides via `dropdownWidth` prop
  - Tag overflow strategy: after 10 tags, hide + show "selected [N] more items" summary badge
  - Responsive: mobile breakpoint (`<640px`), dropdown max-height `250px` (vs 300px desktop), trigger padding reduced by 2px

#### Sizing
- **Component height:**
  - Trigger height by size variant: xs(`h-6`/24px), sm(`h-8`/32px), md(`h-10`/40px), lg(`h-12`/48px), xl(`h-16`/64px)
  - Dropdown items: `h-10` (40px) for md size, scales proportionally: xs(`h-7`), sm(`h-9`), lg(`h-12`), xl(`h-14`)
  - Items with descriptions: `min-h-[48px]`, `max-h-[72px]` to accommodate multi-line content
  - Tags: `h-6` (24px) fixed for all sizes (uses Chip component sizing)
  - Search input: `h-9` (36px) fixed within dropdown
- **Min/max constraints:**
  - Trigger: `min-w-[200px]`, `max-w-[600px]`
  - Dropdown: `max-h-[300px]`, `min-w-[220px]`
  - Items: `min-h-[32px]` (xs), `min-h-[48px]` (default with icon)
  - Virtual scroll container: fixed height per virtual row estimation `40px`
- **Breakpoint behavior:**
  - Mobile (`<640px`): trigger heights reduce by 2px (xs:22px, sm:30px, md:38px, lg:46px, xl:62px)
  - Mobile dropdown max-height: `250px`
  - Font sizes: mobile scale-down `text-sm` → `text-xs` for labels
  - Tag spacing: mobile `gap-1` (4px) vs desktop `gap-1.5` (6px)
  - Search input padding: mobile `py-1.5` vs desktop `py-2`

#### Effects
- **Shadows:**
  - Trigger default: `shadow-sm` or no shadow (`shadow-none`)
  - Trigger hover: `shadow-sm` subtle elevation
  - Dropdown: `shadow-lg` for elevation above page content
  - Focus ring on trigger: `shadow-[0_0_0_2px] var(--ring-color)`, `ring-offset-2`
  - Item hover: `shadow-sm` with `bg-accent/50`
  - Item active: `shadow-sm` with `bg-accent`
  - Selected item: `shadow-[0_0_0_1px] var(--primary/20)` subtle ring
- **Borders:**
  - Trigger border: `border border-input`, default `border-transparent` on focus, `border-primary` when active open, `border-destructive` on error state
  - Border radius: `rounded-md` (6px) for sm/md/lg, `rounded-sm` (4px) for xs, `rounded-lg` (8px) for xl
  - Item borders: `border-b border-border` separator style or `border-transparent` default
  - Groups: `border-l-2 border-muted/40` left border for visual grouping (optional)
  - Selected item border: `border-l-4 border-primary` indicator (when `showSelectedIcon={false}`)
- **Blurs / overlays:**
  - Dropdown backdrop blur: `backdrop-blur-sm` (4px) for glassmorphism effect
  - Glass variant dropdown: `backdrop-blur-md` (8px) with `bg-background/90`
  - Overlay: optional `bg-black/10` (10% opacity) when dropdown is open and overlay enabled
  - Loading spinner overlay: `backdrop-blur-[1px]` with `bg-black/5` over dropdown content

#### Animation & Transitions
- **Motion guidelines:**
  - Use Material Design 3 motion tokens as reference
  - Dropdown open: duration `150ms`, easing `cubic-bezier(0.4, 0, 0.2, 1)` (standard easing)
  - Dropdown close: duration `100ms`, same easing for snappier close
  - Item hover: duration `150ms`, ease-in, for background/elevation changes
  - Tag add: duration `200ms`, ease-out, scale/slide-in animation
  - Tag remove: duration `100ms`, ease-in, scale/fade-out animation
  - Focus ring: duration `200ms`, ease-out, for `ring` expansion
  - Infinite scroll loading: `animate-spin` for spinner, `duration-1000`
- **Transition properties:**
  - Dropdown: `opacity`, `transform` (`scale-95` to `scale-100`), `translate-y` (`-4px` to `0`)
  - Items: `background-color`, `border-color`, `box-shadow`, `transform` (scale: 1.00 to 1.02)
  - Tags: `opacity`, `transform` (scale), `max-width` for expand/collapse
  - Focus ring: `box-shadow`, `ring-color` with `transition-all duration-200`
  - Group expansion (if collapsible): `max-height`, `opacity` (0 to 1)
- **Interactive feedback:**
  - Hover on items: `bg-accent/50`, `scale-[1.02]` slight growth, `transition-all duration-150`
  - Active/pressed: `bg-accent`, `scale-[0.98]` compression, `transition-all duration-100`
  - Focus ring: `ring-2 ring-primary ring-offset-2` with `transition-all duration-200`
  - Tag dismiss button (×): hover `scale-110`, opacity `hover:opacity-70`, `transition-all duration-150`
  - Clear button: hover `bg-muted/80`, scale `scale-110`, `transition-all duration-150`
  - Select all checkbox: standard hover/focus states from existing Checkbox component
  - Dropdown container on open: `shadow-lg`, on close: `shadow-md` (subtle reduction)
- **Open/close motion:**
  - Dropdown opens (trigger click): fade-in (`opacity-0 → 100`) + slide-down (`translate-y-[-4px] → 0`) + scale-up (`scale-95 → 100`)
  - Dropdown closes (blur, escape, selection): reverse animations with faster duration (100ms vs 150ms open)
  - Tags animate in when selected: stagger effect with delay (first at 0ms, subsequent at +50ms intervals up to 5 tags, then batch the rest)
  - Tags animate out on dismissal: individual animations with `scale-95 + opacity-` in `100ms`

### Further Considerations

1. **Performance risks and mitigation**:
   - **Virtualization is mandatory** for datasets with >50 items to avoid rendering all options and causing sluggish scroll. Use `@tanstack/react-virtual` with row estimation `40px` and overscan `5`. Without virtualization, lists of 100+ options cause frame drops and poor scroll performance.
   - **Memoization is critical**: Wrap filtering logic, sorting logic, and computed arrays in `useMemo` to prevent unnecessary re-renders on every keystroke or state change. Wrap callback functions (`onValueChange`, `loadMore`) in `useCallback` to prevent child re-renders.
   - **Debouncing mandatory**: Search input must debounce at 300ms to prevent excessive filtering operations during rapid typing. Without debouncing, a user typing "example" (7 characters) triggers 7 filter operations instead of one, blocking the main thread.
   - **Tag rendering limit**: After 10 tags, switch to summary display to avoid layout thrashing. Rendering 20+ tags causes measurable reflow cost on each keystroke.
   - **IntersectionObserver for infinite scroll**: Use native API with fallback to scroll event listener. Avoid continuous polling; observe a sentinel element at the bottom of the scroll container.

2. **Accessibility implications**:
   - **Full keyboard navigation required**: Must support Arrow Up/Down to navigate items in dropdown, Enter/Space to select/deselect items, Escape to close dropdown, Tab to exit component (focus moves to next element), Ctrl+A to select all visible items, Backspace/Delete to remove last selected tag when focus is on input. Without these, keyboard-only users cannot complete their workflow.
   - **Screen reader announcements required**: When items are selected/deselected, announce "Option 1 selected, 3 total selected" or "Option 1 deselected, 2 total selected". When dropdown opens/closes, announce "List expanded, 10 items" or "List collapsed". Use `aria-live="polite"` region for these announcements without being disruptive.
   - **WAI-ARIA roles and states**: Root must have `role="listbox"`, `aria-multiselectable="true"`. Each item must have `role="option"`, `aria-selected`. Trigger must have `aria-expanded`, `aria-haspopup="listbox"`. Groups must have `role="group"`, `aria-labelledby`. Labels must link via `aria-labelledby`.
   - **Focus management**: On open, focus moves to search input or first item. On close, focus returns to trigger. On tag dismissal, focus shifts to the next tag or trigger. Prevent focus trap where user cannot exit dropdown. Ensure focus ring is visible and meets 3:1 contrast ratio.
   - **Color contrast**: Ensure text in tags meets 4.5:1 contrast ratio against background. Ensure error text meets 3:1 for large text, 4.5:1 for normal text. Ensure disabled state meets 3:1 contrast.

3. **Design system tradeoffs**:
   - **Size variant alignment**: Multi-select must align with existing form components (Input, Select, ComboBox) for visual consistency. All use the same size scale (xs, sm, md, lg, xl) with matching heights: 24px, 32px, 40px, 48px, 64px. Using different heights would create jarring form layouts.
  - **Tag display using Chip component**: Leverages existing `src/components/chip/` with `variant="assist"` or `variant="filter"` for consistency. However, chip dismiss behavior may need customization (different padding, smaller dismiss button) to fit within trigger. The tradeoff is consistent styling vs custom dismiss UX.
   - **Visual variants decision**: Three variants (default/flat, outlined, filled) match current component patterns. Default uses transparent background with border, outlined emphasizes border with `border-primary`, filled uses solid background with `bg-muted` or `bg-primary`. Each variant has different hover/focus state mappings using CSS variables (`--primary`, `--muted`, `--accent`).
  - **Primitive choice tradeoff**: Using `@headlessui/react` (like existing ComboBox) vs `@radix-ui/react-select`. HeadlessUI offers better search/filter support and simpler API for complex multi-select patterns, but Radix has stronger accessibility primitives out-of-the-box. Consistency with ComboBox (HeadlessUI) was chosen for team familiarity and existing patterns in advanced components.
   - **Group nesting depth limit**: Support for nested subgroups increases complexity (progressive indentation, keyboard navigation, screen reader announcements). Limit to 3 levels maximum to avoid UX confusion. Beyond 3 levels, users struggle to understand hierarchy visually and via screen reader.
   - **Tag display threshold decision**: 10 items was chosen as the default `maxVisibleTags`. Lower threshold (5) is too restrictive for dashboards where users need to see more selections. Higher threshold (15+) causes performance issues and visual clutter. 10 is a reasonable compromise for most use cases with ability to customize.
   - **Selected item visibility decision**: Selected items remain visible in dropdown with checkmark indicator (when `showSelectedIcon={true}`). Alternative (hiding selected items) was rejected because users need to deselect items easily and see which items are already selected. The tradeoff is longer dropdown lists, but this is acceptable because of the search filter and virtualization.
  - **Infinite scroll vs "Load more" button**: Infinite scroll provides better UX for power users (less friction) but is more complex to implement (IntersectionObserver, loading state management, scroll position tracking). "Load more" button is simpler but interrupts flow. Infinite scroll was chosen because the component targets advanced, data-heavy use cases.

### Required Clarifications (one round only)

**This is the final plan.** No further clarifications are needed based on your answers:
- ✅ Grouping and subgrouping: Supported via `MultiSelectGroup` with nested capability
- ✅ Selected items visibility: Remain highlighted with optional checkmark icon via `showSelectedIcon` prop
- ✅ Tag reordering: Not supported (selection order follows click order)
- ✅ Async loading: Infinite scroll (auto-load on scroll) with IntersectionObserver
- ✅ Tag display threshold: 10 items before switching to summary ("selected [N] more items")
- ✅ Custom filters: Supported via `filterOption` prop for flexible matching logic