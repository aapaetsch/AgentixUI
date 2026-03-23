# Sheet Component - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview
The Sheet component is a slide-out panel that displays content from the edge of the screen. It extends Radix UI's Dialog primitive to create a side panel experience commonly used for navigation menus, settings panels, detail views, and form inputs.

## Props Summary

### Sheet (Root)
- Extends `@radix-ui/react-dialog` Root props
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Callback when open state changes
- `defaultOpen?: boolean` - Uncontrolled default open state
- `modal?: boolean` - Whether to render as modal (default: true)

### SheetContent
- `position?: "top" | "right" | "bottom" | "left"` - Edge from which sheet slides (default: "right")
- `size?: "xs" | "sm" | "md" | "lg" | "xl" | "full"` - Sheet dimensions (default: "md")
- `showCloseButton?: boolean` - Show the X close button (default: true)
- `closeButton?: ReactNode` - Custom close button
- `onCloseClick?: () => void` - Callback when close button clicked
- `preventBackgroundClose?: boolean` - Prevent closing via overlay/Escape (default: false)
- `showHandle?: boolean` - Show drag handle for touch (default: false, only visible for top/bottom)
- `overlayClassName?: string` - Custom overlay styling

### SheetHeader, SheetFooter
- Standard `HTMLDivElement` props

### SheetTitle, SheetDescription, SheetClose, SheetTrigger
- Extend respective Radix Dialog primitive props

## Dependencies
- `@radix-ui/react-dialog` - Core dialog/sheet primitive
- `class-variance-authority` - Variant management
- `lucide-react` - Close icon
- `tailwind-merge` via `cn()` - Class merging

## Styling Decisions

### CVA Variants
1. **Position Variants**: Each position (top, right, bottom, left) has specific:
   - Positioning classes (inset-x-0, inset-y-0, etc.)
   - Border radius on the inner edge only
   - Slide animation direction matching position

2. **Size Variants**: Implemented as compound variants:
   - Right/Left positions: Control width (280px to full)
   - Top/Bottom positions: Control height (200px to full)
   - Responsive sizing on sm/md breakpoints

3. **Handle Variants**: Only visible for top/bottom positions

### Animation Strategy
- Uses Tailwind CSS animate utilities (`animate-in`, `slide-in-from-*`)
- Duration: `--motion-duration-long` (300ms) for smooth slide
- Easing: `--motion-easing-standard` (Material Design 3)

### Z-Index Management
- Base z-index: 50
- Nested sheets increment by 10 per level
- Overlay and content stack correctly

## Maintenance Notes

### Edge Cases Handled
1. **Nested Sheets**: Context-based level tracking ensures proper stacking
2. **Scroll Lock**: Radix handles body scroll locking automatically
3. **Focus Trapping**: Built into Radix Dialog primitive
4. **Keyboard Navigation**: Escape closes sheet (unless `preventBackgroundClose`)

### Known Limitations
1. **Gestures**: Free tier does not include swipe-to-dismiss (see Premium tier)
2. **Snap Points**: Not available in free tier
3. **Custom Animations**: Limited to CSS transitions (Premium uses react-spring)

### Relationship to Premium Tier
The Premium Sheet component (`src/components/premium/sheet`) extends this base implementation with:
- Swipe-to-dismiss gestures via `@use-gesture/react`
- Spring animations via `@react-spring/web`
- Snap points for partial openings
- Velocity-based closing
- Edge-pull gestures

### Testing Considerations
- Test all four position variants
- Test all size variants with each position
- Test nested sheet z-index stacking
- Test `preventBackgroundClose` behavior
- Test scroll behavior with long content
- Verify keyboard navigation (Tab, Escape)

## Related Components
- `Dialog` - Full modal dialog (centered)
- `Popover` - Small floating content
- `Drawer` - Alias for bottom-positioned Sheet


