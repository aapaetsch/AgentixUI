## Plan: Implement Hover Card Component

Create a shadcn/ui-inspired hover card component using Radix UI primitives that displays rich content on hover with smooth transitions and flexible positioning. The component will follow the project's established patterns, providing an accessible, customizable tooltip-like interface for richer content presentation.

### Steps

1. Install dependency `@radix-ui/react-hover-card` if not already present in package.json
2. Create component directory structure at `src/components/hover-card/`
3. Implement `HoverCard` index.tsx with Radix UI `@radix-ui/react-hover-card` primitive, exporting subcomponents: `HoverCardRoot`, `HoverCardTrigger`, `HoverCardContent`, `HoverCardArrow`, and optionally `HoverCardCloseButton`
4. Use `class-variance-authority` (cva) to define size variant system aligning with existing Card component: xs, sm, md (default), lg, xl
5. Configure proper forwardRefs and TypeScript interfaces for all subcomponents with comprehensive JSDoc comments
6. Implement trigger mode control via `triggerMode` prop (`"hover"` | `"click"`) with hover as default, supporting tap-to-open on mobile
7. Implement content scrolling via `maxHeight` prop (`"none"` | `"auto"` | `string`), with internal scroll when set
8. Add prop-based positioning controls (side, align, sideOffset, alignOffset) and delay (openDelay=700ms default, closeDelay=300ms default)
9. Add close button that shows when triggerMode is "click" or on touch devices
10. Ensure accessibility with proper aria attributes, keyboard navigation, and escape-to-close behavior
11. Implement animation and transition states using Radix's data-state attributes (open/closed) with fade, scale, and slide effects
12. Create comprehensive Storybook stories in `hover-card.stories.tsx` showcasing: all size variants, both trigger modes (hover and click), positioning configurations (side/align), scrolling behavior, mobile/touch scenarios, rich content layouts, accessibility examples
13. Write `agents.md` documentation with component context, props summary, styling decisions (including Card size variants alignment), dependencies, and maintenance notes
14. Write human-readable `README.md` with usage examples for both hover and click modes, API documentation for all props including triggerMode and maxHeight, and best practices for when to use hover card vs. tooltip vs. popover
15. Export `HoverCard` component from `src/index.ts` following established export patterns (export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow } from "./components/free/hover-card")
16. Update `docs/ROADMAP.md` to mark hover card component status as complete

### Component Spacing, Sizing, Effects & Animation Guidelines

#### Spacing & Layout
- **Spacing scale:** Use Tailwind's 4px base scale (0.5rem = 8px). Internal padding in multiples of 0.25rem (4px).
- **Internal padding (aligning with Card component):**
  - xs size: `p-3` (0.75rem / 12px for compact content)
  - sm size: `p-3` (0.75rem / 12px for small cards)
  - md size (default): `p-4` (1rem / 16px for standard content)
  - lg size: `p-5` (1.25rem / 20px for large content)
  - xl size: `p-6` (1.5rem / 24px for hero cards)
  - Triggers: Use existing button/interactive spacing or `p-2` (0.5rem / 8px) for custom triggers
- **External spacing:**
  - Default offset from trigger: `sideOffset={4}` (provides 16px gap)
  - Arrow spacing: Auto-calculated by Radix UI
- **Layout rules:**
  - Max content width: `max-w-md` (28rem / 448px) to prevent overly wide cards
  - Min content width: `min-w-[--radix-hover-card-trigger-width]` to match trigger by default
  - Default width: `w-64` (16rem / 256px) for consistency with shadcn
  - Use `text-left` by default for content alignment
  - Responsive: Keep consistent across breakpoints, adjust only if content exceeds screen width

#### Sizing
- **Component height/width:**
  - Content: Auto-height based on content, constrained by max-width
  - Min content width: `min-w-[--radix-hover-card-trigger-width]` to match trigger by default
  - Max content width: `max-w-sm` (24rem / 384px) default, `max-w-lg` (32rem / 512px) large variant
- **Min/max constraints:**
  - Min width: 128px (8rem) to prevent collapsing
  - Max width: 512px (32rem) for large screens
  - Max height: Auto, but consider `max-h-[60vh]` for very long content
- **Breakpoint behavior:**
  - Mobile: Use default positioning, may reduce padding to `p-3` for smaller screens
  - Tablet: Default spacing
  - Desktop: Full spacing and positioning options

#### Effects
- **Shadows:**
  - Default: `shadow-lg` with `shadow-black/10` (subtle elevation)
  - Hover state: Unchanged (card already hovered)
  - Focus ring: Focus should show on trigger with `focus:ring-2`, `focus:ring-ring`, `focus:ring-offset-2`
  - Click mode: No shadow change when open
- **Borders:**
  - Border width: `border`
  - Border color: `border-border` (from CSS variables)
  - Border radius (aligning with Card component by size):
    - xs size: `rounded-[var(--radius)]` (default radius, likely 4-6px)
    - sm size: `rounded-[var(--radius-md)]` (medium radius, likely 6-8px)
    - md size (default): `rounded-[var(--radius-md)]` (medium radius)
    - lg size: `rounded-[var(--radius-lg)]` (large radius, likely 8-12px)
    - xl size: `rounded-[var(--radius-xl)]` (extra large radius, likely 12-16px)
  - Arrow color: Should match content border/bg
- **Blurs / overlays:**
  - Background blur: Not applicable (hover cards don't blur backdrop)
  - Opacity: Content uses `bg-background` (opaque)
  - No overlays needed

#### Animation & Transitions
- **Motion guidelines:**
  - Open duration: 150ms
  - Close duration: 100ms
  - Easing: `ease-in-out` for smooth, natural motion
  - Open delay: Default 700ms (configurable via `openDelay` to prevent accidental triggers)
  - Close delay: Default 300ms (configurable via `closeDelay` for seamless interaction)
- **Transition properties:**
  - `opacity` for fade in/out
  - `transform` for scale effect (slight scale-in: 0.95 → 1.0)
  - `translate-y` for slide-in effect (4px)
- **Interactive feedback:**
  - Hover → Card appears at trigger
  - Mouse into card content → Card stays visible while hovering content
  - Mouse exits trigger and card → Card dismisses after closeDelay
  - Focus trigger → Card appears (keyboard accessibility)
  - Press/active → Not applicable (hover card is read-only)
  - Arrow animation: Slight fade and scale synchronized with content
- **Open/close motion:**
  - Open animation: Fade in (0 → 1), scale up (0.95 → 1.0), slide down (translate-y-1 → 0), all over 150ms with ease-in-out
  - Close animation: Fade out (1 → 0), no scale (保持位置), all over 100ms with ease-in-out
  - Use Radix's built-in `data-state="open"` and `data-state="closed"` attributes for CSS transitions

### Further Considerations

1. **Dependencies:** Must add `@radix-ui/react-hover-card` to the package.json if not already installed. Run `npm list @radix-ui/react-hover-card` to check. If not installed, add `npm install @radix-ui/react-hover-card` as step 1.

2. **Accessibility:** Ensure keyboard navigation works—focus on trigger should open the card (especially in hover mode), and Tab should move focus into card content if interactive. Provide appropriate `aria-label` or `aria-describedby` attributes. Verify that:
   - Card dismisses properly on Escape key (especially in click mode)
   - Close button has proper labeling (e.g., `aria-label="Close"`)
   - Focus management in click mode (when opening and closing)
   - Proper ARIA roles for screen readers

3. **Z-index Management:** Hover cards should have a z-index of `50` (matching other overlays like tooltips/popovers) to appear above content. Consider if this conflicts with other components or if variable z-indexing is needed, especially for nested hover cards (which should be avoided).

4. **Click Mode Implementation:**
   - When `triggerMode="click"`, card opens on trigger click and shows a close button (X icon) in the top-right corner
   - Card should close when: close button clicked, Escape key pressed, clicking outside the card
   - Consider implementing a click overlay/backdrop to make dismissing intuitive
   - Close button styling should be subtle (icon-button variant, size="small")
   - Trigger should show hover or active state when card is open in click mode

5. **Mobile/Touch Behavior:**
   - Use CSS media query `@media (hover: none)` to detect touch devices
   - On touch devices, automatically switch to tap-to-open mode (click mode behavior) regardless of `triggerMode` prop
   - Allow override with `forceTriggerMode` prop to explicitly set interaction mode on all devices
   - Consider reducing animation delays on mobile for faster perceived response

6. **MaxHeight and Scrolling:**
   - When `maxHeight` is `"none"` (default), content has no height limit and card grows to fit content
   - When `maxHeight` is `"auto"`, use sensible default like `max-h-[60vh]` to prevent overly tall cards
   - When `maxHeight` is a specific value (e.g., `"300px"`, `"20rem"`), apply that max-height and enable internal scroll
   - Add subtle visual cue (border-bottom or fade) when scroll is present
   - Use smooth scrolling: `overflow-auto`, `scroll-smooth`

7. **Edge Cases:**
   - Very long content: Use `maxHeight` prop to enable internal scrolling (not automatic)
   - Mobile touch devices: Use tap-to-open with close button (see point 5 above)
   - Screen edges: Use Radix's built-in collision detection to prevent clipping
   - Nested triggers: Avoid hover cards within hover cards (document this limitation in README)
   - Rapid hover/exit: The 700ms open delay helps prevent accidental triggers

8. **Performance:**
   - Defer rendering of content until hover/click for heavy components (use Radix's state via `onOpenChange`)
   - Consider memoizing expensive content rendered inside cards using React.memo
   - Test with many hover cards on a page for performance impact
   - In click mode, content can be lazy-loaded when card opens (optional enhancement)

9. **Design System Alignment:**
   - Ensure typography matches global text tokens for consistency
   - Use CSS variables (`--background`, `--foreground`, `--border`, `--muted`, `--popover`, `--popover-foreground`) for theming
   - Match shadows and borders to other overlay components (tooltip, popover, dialog)
   - Align size variants (padding, border radius) with existing Card component: xs/s/m/l/xl

10. **Documentation Needs:**
   - Clear examples of trigger types (text, button, icon) for both hover and click modes
   - Examples of content layouts (basic, rich, with actions)
   - Examples of all size variants (xs, sm, md, lg, xl) showing the effect
   - Guidance on when to use hover card vs. tooltip vs. popover vs. dialog
   - Best practices for accessibility and content length
   - Mobile/touch device behavior explanation
   - Examples of `maxHeight` prop usage with scrolling content

11. **Theming:**
   - Support both light and dark modes through existing CSS variables
   - Use `bg-popover` and `text-popover-foreground` for content background
   - Test color contrast in both modes
   - Ensure arrow color matches content background in both modes
   - All size variant spacing should respect theme scale (rem-based)

12. **Variant Strategy:**
   - Size variants (via `size` prop): xs, sm, md (default), lg, xl - controlling padding and border radius
   - Trigger mode (via `triggerMode` prop): "hover" (default), "click"
   - No additional visual variants needed initially - rely on className prop for custom styling
   - If borderless or elevated shadow variants are requested later, can add via CVA without breaking changes

### Design Decisions (Resolved)

1. **Trigger Behavior:** Component will support both hover and click-to-open modes via a `triggerMode` prop (`"hover"` | `"click"`), with `"hover"` as default. This enables accessibility on mobile devices where hover doesn't exist. When triggered by click, the card will show a close button in the header and close on Escape key or clicking outside.

2. **Size Variants:** Component will align with existing Card component sizing variants: xs, sm, md (default), lg, xl. Padding will match Card component: xs/sm = p-3, md = p-4, lg = p-5, xl = p-6. Border radius will also match: xs = rounded-[var(--radius)], sm/md = rounded-[var(--radius-md)], lg = rounded-[var(--radius-lg)], xl = rounded-[var(--radius-xl)].

3. **Content Scroll Behavior:** Scrolling is optional via `maxHeight` prop (e.g., `"none"`, `"auto"`, or pixel/rem values like `"300px"`). When `maxHeight` is set to `"auto"` or a specific value, content will scroll internally when it exceeds the max-height.

4. **Mobile Behavior:** On touch devices detected via `@media (hover: none)`, the component will automatically switch to tap-to-open mode (similar to click mode) with a close button in the header. Users can also explicitly override this with the `forceTriggerMode` prop.

5. **Animation Default:** The 700ms default open delay is acceptable for now. This default will be configurable via the `openDelay` prop (default: 700ms) and `closeDelay` prop (default: 300ms).

6. **Component Priority:** This is a high-priority component that will be built next, so the implementation should be thorough with comprehensive stories and examples.

---
**This is the final implementation plan.** Proceed with implementation using the detailed specifications above.