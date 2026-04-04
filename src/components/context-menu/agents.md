# Context Menu - Component Agent Documentation
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Title
ContextMenu - Right-click action menu component

## Props

### ContextMenu
- `children?: React.ReactNode` - Menu content components
- `position?: { x: number; y: number } | null` - Custom x/y coordinates for positioning (overrides automatic mouse position), default: null
- `delayClose?: number` - Delay before closing in milliseconds (0 for immediate), default: 0

### ContextMenuTrigger
- `asChild?: boolean` - Merge props with child element
- All standard HTML button props

### ContextMenuContent
- `sideOffset?: number` - Distance from cursor, default: 4
- `alignOffset?: number` - Offset from alignment axis, default: -4
- `collisionPadding?: number | Padding` - Collision boundary
- All standard Radix Content props

### ContextMenuItem
- `icon?: React.ReactNode` - Left-aligned icon component
- `inset?: boolean` - Adds horizontal padding, default: false
- `variant?: 'default' | 'destructive'` - Visual style, default: 'default'
- All standard Radix Item props

### ContextMenuCheckboxItem
- `checked?: boolean` - Whether checked
- `onCheckedChange?: (checked: boolean) => void` - Checked change callback
- `icon?: React.ReactNode` - Left-aligned icon component
- `inset?: boolean` - Adds horizontal padding
- `variant?: 'default' | 'destructive'` - Visual style
- All standard Radix CheckboxItem props

### ContextMenuRadioGroup
- `value?: string` - Currently selected value
- `onValueChange?: (value: string) => void` - Value change callback
- All standard Radix RadioGroup props

### ContextMenuRadioItem
- `value: string` - Radio button value
- `inset?: boolean` - Adds horizontal padding
- All standard Radix RadioItem props (no icon prop)

### ContextMenuLabel
- `inset?: boolean` - Adds horizontal padding
- All standard Radix Label props

### ContextMenuSeparator
- All standard Radix Separator props (no special props)

### ContextMenuSub
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Open change callback
- All standard Radix Sub props (no special props)

### ContextMenuSubTrigger
- `inset?: boolean` - Adds horizontal padding
- All standard Radix SubTrigger props (no icon prop)

### ContextMenuSubContent
- `sideOffset?: number` - Distance from parent
- `alignOffset?: number` - Offset from alignment axis
- `collisionPadding?: number | Padding` - Collision boundary
- All standard Radix SubContent props

### ContextMenuShortcut
- `className?: string` - Custom classes
- All standard HTML span props

## Dependencies

### Core Dependencies
- `@radix-ui/react-context-menu` - Primitive context menu functionality
- React - Component framework (18+ required as peer)
- React DOM - Rendering (18+ required as peer)

### Internal Dependencies
- `@/lib/utils` - `cn()` utility for className merging
- CVA (`class-variance-authority`) - Variant management

### Icons (Optional)
- Lucide React - Standard project icon set (e.g., Copy, Clipboard, Trash2)

## Styling Decisions

### CVA Variants Rationale

#### Content Variants (`contextMenuContentVariants`)
- **No variant properties** - Single variant simplifies content styling
- **Consistent with Popover/Select** - Matches overlay component patterns
- **Animation states** - Fade + zoom + directional slide using `data-state` and `data-side`
- **Shadow elevation-2** - Matches other overlays (Dialog, Sheet, Popover)
- **z-index: 50** - Consistent layering with other floating content

#### Item Variants (`contextMenuItemVariants`)
- **`inset` variant** - Adds 8px left padding (pl-8) for nested items, matches shadcn/ui
- **`variant` property** - Default and destructive states (destructive uses destructive color token)
- **Interactive feedback** - Hover: background change to accent (`hover:bg-accent`)
- **No scale changes** - Different from Button to avoid janky menu feel
- **Focus ring** - `focus-visible:ring-2 focus-visible:ring-ring/50` for keyboard navigation

#### Separator Variants (`contextMenuSeparatorVariants`)
- **Single variant** - Standard 1px horizontal divider
- **Negative horizontal margin** (`-mx-1`) - Extends to edge of content
- **Vertical margin** (`my-1`) - Spacing between sections

#### Label Variants (`contextMenuLabelVariants`)
- **`inset` variant** - Adds 8px left padding matching text items
- **Small text** (`text-xs`) for non-interactive headers
- **Muted foreground** - Visually distinct from actionable items

#### SubTrigger Variants (`contextMenuSubTriggerVariants`)
- **Similar to Item** - Reuses item styling for consistency
- **Right chevron indicator** - Automatic via Radix SubTrigger
- **`inset` variant** - Matches ContextMenuItem for nested menus

### Design System Alignment

**Spacing & Layout:**
- Content gap: 0.25rem (4px) via class structure
- Item padding: py-1.5 pl-2 pr-8 (12px vertical, 8px left, 32px right for shortcut space)
- Default radius: `--radius` (0.5rem) from globals.css
- Border: 1px using `--border` token

**Motion:**
- Open/Close duration: `--motion-duration-medium` (200ms)
- Hover duration: `--motion-duration-short` (100ms)
- Easing: `--motion-easing-standard` (cubic-bezier(0.2, 0, 0, 1))
- Animation: Fade + zoom + directional slide based on position

**Colors & Tokens:**
- Background: `--popover` token (light/dark mode support)
- Foreground: `--popover-foreground` token
- Accent hover: `bg-accent` token
- Destructive: `--destructive` token (red color for dangerous actions)

**Shadows:**
- Elevation level 2: `--elevation-2` (0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))

**Typography:**
- Items: `text-sm` (14px)
- Labels: `text-xs` (12px)
- Shortcuts: `text-xs` (12px)
- Font weight: `font-semibold` for labels only

## Maintenance Notes

### Radix UI API Details

**Positioning:**
- Automatic collision detection via `collisionPadding` and `sideOffset`
- No custom positioning implementation in V1 - relies on Radix's automatic positioning
- Custom `position` prop prepared for future programmatic triggering (currently unused)

**State Management:**
- Uncontrolled default (Radix manages open/close internally)
- Controlled state via `open` and `onOpenChange` props on Root/Sub components
- No custom context needed (unlike Select with AnimatedChevron)

**Keyboard Navigation:**
- Arrow Up/Down: Navigate items
- Arrow Right: Open submenu
- Arrow Left: Close submenu
- Enter/Space: Select item
- Escape: Close menu
- Focus trap within menu

**Z-Index Layering:**
- Content: z-50 (standard for overlays)
- Submenus: Same z-50, handled by Radix portal placement
- Dialog/Sheet: Higher z-index (handled by their own layers)

### Known Edge Cases

**1. Submenu Nesting Depth:**
- Issue: Unbounded nesting can exceed viewport
- Mitigation: Radix automatically repositions to prevent clipping
- Testing: Validated to 3 levels in Storybook, deeper not tested

**2. Mobile Touch Devices:**
- Issue: Context menus primarily mouse-triggered (right-click)
- Mitigation: Long-press on mobile triggers context menu (browser behavior)
- Note: Touch-specific styling not implemented in V1

**3. Custom Positioning API:**
- Issue: `position` prop defined but not implemented
- Status: Prepared for future programmatic triggering
- Workaround: Use Radix's automatic positioning

**4. Close Delay:**
- Issue: `delayClose` prop defined but not implemented
- Status: Immediate close by default (0ms)
- Note: Would require custom timeout wrapper

**5. Icon Support:**
- ContextMenuItem: Supports `icon` prop (left-aligned)
- ContextMenuItem with shortcut: Shortcut via `ContextMenuShortcut` component (right-aligned)
- ContextMenuCheckboxItem: Supports `icon` prop (left of checkbox)
- ContextMenuRadioItem: Does NOT support `icon` prop (uses Dot indicator)
- ContextMenuSubTrigger: Does NOT support `icon` prop (chevron added automatically)

**6. Shortcut Display:**
- Must use `ContextMenuShortcut` component as child of Item/CheckboxItem
- Automatically positioned `ml-auto` (margin-left: auto)
- Styled: `text-xs tracking-widest text-muted-foreground`

**7. Accessibility:**
- ARIA roles: `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `menuitemradio`
- Focus management: Automatic by Radix
- Screen reader announcements: Built-in to Radix primitive
- Test with: axe-core, browser dev tools accessibility inspector

### Performance Considerations

**Portal Usage:**
- ContextMenuContent renders in portal to avoid z-index conflicts
- All submenus render in portals via ContextMenuSubContent

**Animation Performance:**
- Transforms (zoom, slide) use GPU acceleration
- Opacity transitions performant
- No layout thrashing (avoid reflow during open/close)

**Large Menus:**
- Consider virtual scrolling for menus with 50+ items
- Radix supports this via `collisionPadding` but not implemented in V1

## Future Enhancements

**V2 Considerations:**
- Implement custom positioning API (trigger menu programmatically)
- Implement close delay (`delayClose` prop)
- Add keyboard shortcut component with auto-detection (e.g., display "Ctrl+C" instead of "⌘C" on Windows)
- Max-height with scrolling for large menus
- Mobile touch improvements (long-press feedback, touch-friendly hit areas)
- Animation presets (slide-in, scale-up, fade) matching Premium components
- Context menu presets as exported utilities (file actions, text editor actions, etc.)


