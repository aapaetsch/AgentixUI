## Plan: Implement ScrollArea Component with Infinite Scroll Support

Implement a custom scrollbar container component (`ScrollArea`) using Radix UI primitives with optional infinite scroll functionality as prop-based features. This provides consistent, accessible scrolling across browsers and devices with Material Design 3 styling. Component follows shadcn/ui compound pattern with explicit `ScrollBar` components for horizontal/vertical orientations, includes builtin loading indicator with custom render opt-in, auto-trigger and manual "Load more" variants, and RTL support via boolean prop.

### Steps

1. **Create component folder structure** at `src/components/scroll-area/` with files: `index.tsx`, `ScrollArea.stories.tsx`, `agents.md`, and `README.md`

2. **Implement ScrollArea composition** using `@radix-ui/react-scroll-area` primitives with export structure: `ScrollArea`, `ScrollAreaViewport`, `ScrollBar` (with `ScrollBarOrientation`, `ScrollBarVisibility` types), following shadcn/ui compound component pattern where explicit `ScrollBar` components are required for each orientation (horizontal/vertical)

3. **Define CVA variants** for `scrollAreaVariants` with single size option `md` as default (scrollbar width 6px, height 6px); include optional `sm` (4px) and `lg` (8px) for flexibility; include compound variants for scrollbar visibility states (auto/always/scroll/hover)

4. **Add infinite scroll functionality** as prop-based features: implement `infiniteScrollMode` variant prop with values "auto" and "manual"; use `IntersectionObserver` pattern from `multi-select/index.tsx` lines 623-648 for sentinel detection; include builtin loading indicator with `renderLoading` callback prop for custom loading UI

5. **Implement infinite scroll modes**: "auto" mode triggers `onLoadMore` when sentinel intersects viewport with `distanceFromBottom` threshold parameter; "manual" mode shows "Load more" button at bottom that triggers `onLoadMore` on click; both modes support `isLoading` and `hasMore` props for state management

6. **Add RTL support** via `rtl` boolean prop (default `false`) which applies `dir="rtl"` to root element and adjusts horizontal scrollbar direction, following React dir attribute pattern for right-to-left layouts

7. **Create comprehensive Storybook stories** in `ScrollArea.stories.tsx` showcasing: default vertical scroll, default horizontal scroll, both orientations combined, auto-hide scrollbars (visibility="auto"), always-visible scrollbars (visibility="always"), infinite scroll auto mode with async loading, infinite scroll manual mode with "Load more" button, nested scroll areas, custom loading indicator via renderLoading, RTL enabled examples, long content scenarios (100+ items), mobile/touch scenarios

8. **Create agents.md file** following the template in `src/components/button/agents.md`, documenting component composition, props interfaces (including infinite scroll props: `infiniteScrollMode`, `onLoadMore`, `isLoading`, `hasMore`, `distanceFromBottom`, `renderLoading`, `rtl`), styling decisions, maintenance notes, accessibility considerations

9. **Create README.md file** with overview, features list (custom scrollbars, horizontal/vertical, auto-hide, infinite scroll 2 modes, RTL support), installation code, usage examples for all variants and infinite scroll modes, API reference table with prop descriptions, accessibility information, examples section referencing Storybook stories

10. **Export components** from `src/index.ts` by adding: `ScrollArea`, `ScrollAreaViewport`, `ScrollBar`, `type ScrollAreaProps`, `type ScrollBarProps`, following existing export pattern

11. **Update ROADMAP status** in `docs/ROADMAP.md` by changing ScrollArea status appropriately

12. **Test build and Storybook** by calling `Dev Runner` subagent to run `npm run build` and `npm run storybook` commands, verifying no compilation errors and all stories render correctly with infinite scroll functionality working

### Component Spacing, Sizing, Effects & Animation Guidelines

#### Spacing & Layout
- **Spacing scale:** Follow Tailwind's default scale (0.25rem/4px unit), referencing `globals.css` variable tokens
- **Internal padding:** No default padding on ScrollArea root; content container within ScrollAreaViewport gets padding via `p-4` (1rem/16px) in examples
- **External spacing:** No default margins; parent controls spacing via className or wrapper
- **Layout rules:** Width/height controlled by parent via className; ScrollAreaViewport takes full width/height of container; horizontal scroll content uses whitespace-nowrap for preventing line breaks; requires explicit `ScrollBar` components for each orientation (follows shadcn/ui compound pattern)

#### Sizing
- **Component height/width:** Controlled by parent via className (e.g., `h-72`, `w-48` from scroll-area-demo example; `w-96` from horizontal demo)
- **Min/max constraints:** No min constraints; max-height/width set by parent via className; ScrollAreaViewport respects parent dimensions
- **Scrollbar sizing:** Default size variant `md` uses 6px scrollbar width/height; optional `sm` (4px) and `lg` (8px) available via size prop; matches thin scrollbar utility from `time-picker/index.tsx` line 74 pattern
- **Breakpoint behavior:** Inherit responsive sizing from parent via Tailwind breakpoints (sm/md/lg); component itself is responsive-aware through parent sizing

#### Effects
- **Shadows:** Light shadow on root border only (`border` utility); no elevation changes (scrolling is internal)
- **Borders:** Thin border (1px) around root using `border-border` variable; border-radius controlled via rounded utilities (e.g., `rounded-md`); ScrollBar thumb uses border color tokens for subtle styling
- **Blurs / overlays:** Backdrop blur on ScrollBar in auto-hide mode using `backdrop-blur-sm` from scroll-area-demo; smooth fade-in/out animations for scrollbar visibility transitions; loading indicator uses backdrop blur overlay when active

#### Animation & Transition Properties
- **Motion guidelines:** Follow MD3 motion tokens from `globals.css`: standard duration 200ms (`--motion-duration-medium`), standard easing `cubic-bezier(0.2, 0, 0, 1)` (`--motion-easing-standard`)
- **Transition properties:** ScrollBar visibility transitions use `opacity` and `transform` with 150ms duration; no motion on scroll position (scrolling is user-controlled)
- **Interactive feedback:** Hover state on ScrollBar thumb: slight brightness increase via `hover:bg-border`; no scale or press effects (scrollbar thumb should remain stable); "Load more" button uses standard button hover/active states
- **Open/close motion:** ScrollBar with `visibility="auto"` animates opacity 0.2s ease-in-out on hide (opacity: 0 → 1) and show (opacity: 1 → 0), with subtle scale from 0.95 to 1 when appearing
- **Loading indicator animation:** Builtin loading indicator uses `Spinner` component with rotate animation; custom loading UI via `renderLoading` prop can use any animation pattern

### Further Considerations

1. **Accessibility dependencies:** Radix ScrollArea provides built-in keyboard navigation (arrow keys for scrolling, Home/End for jump to top/bottom) and ARIA attributes (role="scrollbar", aria-valuenow/min/max) automatically; RTL support respects native browser direction handling when `rtl={true}`

2. **Design system consistency:** Custom scrollbar styling via Tailwind scrollbar utilities (`scrollbar-thin`, `scrollbar-thumb-border`, `scrollbar-track-transparent`) referenced in `time-picker/index.tsx` line 74 must be applied for cross-browser consistency; default md size (6px) matches thin scrollbar pattern used in time-picker

3. **Infinite scroll implementation:** Prop-based design following MultiSelect pattern (not separate component); uses `IntersectionObserver` for auto mode; manual mode requires explicit user action; both modes share same state props (`isLoading`, `hasMore`, `onLoadMore`)

4. **Component composition pattern:** Follows shadcn/ui compound component pattern requiring explicit `ScrollBar <orientation />` components; this provides explicit control and avoids orientation detection ambiguity; similar to shadcn scroll-area example with explicit vertical/horizontal ScrollBars

5. **Loading indicator approach:** Builtin loading indicator uses `Spinner` component with backdrop blur overlay; `renderLoading` callback prop allows custom loading UI; fallback to non-infinite scroll mode if no loading UI is needed (simply omit infinite scroll props)

6. **Performance optimization:** Infinite scroll uses `IntersectionObserver` (not scroll event listeners) to avoid jank; component supports virtualization via external libraries if needed (not included in this implementation); sentinel element placed at bottom of scroll viewport for intersection detection

7. **Mobile/touch considerations:** Native mobile scroll behavior preserved; touch momentum scrolling works automatically through Radix primitives; scrollbar auto-hide on touch devices to preserve viewport space; manual mode "Load more" button optimized for mobile tap targets (min 44px height)

8. **Browser compatibility:** Radix ScrollArea handles cross-browser scrollbar differences including WebKit (Safari/Chrome), Gecko (Firefox), and Chromium browsers with fallback styles; CSS scrollbar styling uses vendor prefixes where needed for older browser support

9. **Tiering rationale:** Placed in Premium due to specialized use case (custom scrollbars), dependency on Radix ScrollArea, moderate complexity (infinite scroll adds IntersectionObserver logic, two modes, custom loading support), and RTL support requirements

10. **Future extensibility:** Design allows for virtual scroll hook integration; optional props for `scrollSnapType`, `scrollPadding`, and other native scroll CSS properties can be added later; additional scrollbar variants (e.g., macOS-style, Windows-style) could be added as theme options

---

**This is the final implementation plan.** All clarifying questions have been addressed with the following decisions:

1. Infinite scroll is a prop-based feature within ScrollArea (not a separate component)
2. Follows shadcn/ui pattern requiring explicit ScrollBar components for each orientation
3. Default scrollbar width uses md size (6px) with optional sm (4px) and lg (8px)
4. Includes builtin visual loading indicator (Spinner) with optional custom render via renderLoading callback prop
5. Implements two infinite scroll variants: "auto" (triggers on scroll) and "manual" (requires "Load more" button click)
6. Supports RTL (right-to-left) via rtl boolean prop (default false)