# Plan: Context Menu Component

Implement a context menu component following shadcn/ui patterns and project conventions. The context menu provides a right-click action menu for web and Electron applications, built on Radix UI's ContextMenu primitive with project styling using CVA variants, Tailwind CSS, and MD3 motion tokens. Includes custom positioning API with automatic collision detection as default, pre-configured action presets (file, text editor), icon support with keyboard shortcuts, unbounded submenu support, and configurable close delay.

### Steps

1. Install `@radix-ui/react-context-menu` dependency and add it to [package.json](package.json).

2. Create component directory structure at `src/components/context-menu/` with required files: index.tsx, Context Menu.stories.tsx, agents.md, README.md.

3. Implement base component in [index.tsx](src/components/context-menu/index.tsx) with Radix ContextMenu primitive, defining subcomponents (ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, ContextMenuShortcut). Support custom positioning API (x/y coordinates) with automatic collision detection as default, icon display with left-aligned Lucide icons, right-aligned keyboard shortcuts, unbounded submenu nesting, and configurable close delay (delayClose prop).

4. Create CVA variants for ContextMenuContent (animation states), ContextMenuItem (size, inset, variant), ContextMenuSeparator, ContextMenuLabel, ContextMenuSubTrigger, using MD3 motion tokens and design system values from [src/globals.css](src/globals.css).

5. Apply consistent styling patterns from [popover](src/components/popover/index.tsx), [select](src/components/select/index.tsx), [dialog](src/components/dialog/index.tsx) for animations, shadows (elevation-2), rounded corners (--radius), and transitions (--motion-duration-medium).

6. Storybook stories in [Context Menu.stories.tsx](src/components/context-menu/Context Menu.stories.tsx) covering: basic usage, disabled items, shortcuts, submenus (unbounded depth), checkbox items, radio groups, destructive variant, custom positioning (x/y), close delay variations, pre-configured presets (file actions: copy, paste, delete, rename; text editor actions: cut, copy, paste, select all, find), with Lucide icon patterns (left icon, text center, right shortcut).

7. Write [agents.md](src/components/context-menu/agents.md) documenting props, dependencies, styling decisions, maintenance notes (Radix API, keyboard navigation, z-index layering).

8. Write [README.md](src/components/context-menu/README.md) with usage examples, API documentation, accessibility features, and common patterns.

9. Export components in [src/index.ts](src/index.ts).

10. Update ROADMAP status in [docs/ROADMAP.md](docs/ROADMAP.md) to mark Context Menu as ✅ Complete.

11. Run build and Storybook verification using Dev Runner subagent to ensure no errors, proper exports, and functional stories.

### Component Spacing, Sizing, Effects & Animation Guidelines

#### Spacing & Layout
- **Spacing scale:** Use design tokens: --radius-sm (0.25rem), --radius (0.5rem), --radius-md (0.75rem), aligning with other components.
- **Internal padding:** ContextMenuContent: 0.25rem (2px - 4px gap), ContextMenuItem: py-1.5 pl-2 pr-8 (12px vertical, 8px left, 32px right), ContextMenuLabel: px-2 py-1.5.
- **External spacing:** Content positioned relative to trigger with sideOffset (default 4px from cursor), z-index 50 for proper layering.
- **Layout rules:** ContextMenuContent min-width 8rem, max-width available space, auto-height based on items, aligned to cursor click position.

#### Sizing
- **Component height/width:** Items: height 2rem (32px - md) by default, with py-1.5 + text-sm sizing; Content: auto width (typically 12rem - 16rem), constrained by viewport.
- **Min/max constraints:** Item min-width: 8rem; Content max-width: 80vw to prevent overflow; SubContent min-width: 8rem, max-width: available space.
- **Breakpoint behavior:** Not responsive-specific (context menu scales with viewport), but handles viewport constraints by repositioning based on available space (Radix handles collision detection).

#### Effects
- **Shadows:** Elevation level 2 (--elevation-2: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)) for ContextMenuContent to match overlay components.
- **Borders:** Width: 1px standard; Color token: border (--border); Default radius: --radius (0.5rem); Hover/active: No border change, focus uses outline ring on items.
- **Blurs / overlays:** No background blur for content itself (popover pattern), but inherits from backdrop if needed; SubContent uses same shadow/border pattern.

#### Animation & Transitions
- **Motion guidelines:** Durations: --motion-duration-short (100ms) for hover states, --motion-duration-medium (200ms) for open/close; Easing: --motion-easing-standard (cubic-bezier(0.2, 0, 0, 1)) for all transitions.
- **Transition properties:** CSS properties: opacity (fade-in/fade-out), transform (slide-in-from*, zoom-in-95/zoom-out-95).
- **Interactive feedback:** Hover → background color change to accent (hover:bg-accent), no scale changes; Active → same as hover state; Focus → visible focus ring (focus-visible:ring-2 focus-visible:ring-ring/50) on items.
- **Open/close motion:** Fade + zoom (opacity: 0→1, scale: 0.95→1) combined with directional slide based on position (data-state=open/closed), matching Select/Dialog animations.

### Further Considerations

1. **Dependencies:** Requires `@radix-ui/react-context-menu` installation via npm; uses existing `cn` utility, CVA, and Tailwind; leverages Lucide icons for left-aligned action indicators and right-aligned keyboard shortcuts.

2. **Accessibility:** Radix ContextMenu primitive provides ARIA roles, keyboard navigation (Arrow keys, Enter, Escape), and screen reader announcements; must test focus management and ensure proper `aria-*` attributes are forwarded; submenu navigation should be intuitive with standard arrow key patterns.

3. **Design System Alignment:** Match Popover/Select content styling (border, background, radius, shadow, animations); ensure shortcuts align text-right patterns; destructive variant should use Destructive color token consistent with Button component; icons should be 16px by default using Lucide sizing tokens.

4. **Platform Compatibility:** Works in both web browsers and Electron environments (right-click behavior); ensure z-index stacking doesn't conflict with other overlays (Dialog/Sheet take higher z-index); custom positioning API supports programmatic context menu triggering.

5. **State Management:** Primarily uncontrolled (Radix primitive handles open/close internally); custom positioning API allows controlled x/y coordinate overrides; close delay controlled via `delayClose` prop (0ms by default, configurable).

6. **Pre-configured Presets:** Include documented preset structures for common patterns (file actions: copy, paste, delete, rename, properties; text editor actions: cut, copy, paste, select all, find, replace; navigation actions: back, forward, reload) in README and as Storybook examples.

7. **Submenu Nesting:** Unbounded depth supported by Radix UI; validate performance beyond 3-4 levels in Storybook with large datasets; ensure keyboard navigation remains intuitive across deep nesting.

---
**This is the final implementation plan. All clarifying questions have been addressed. The plan is ready for execution.**