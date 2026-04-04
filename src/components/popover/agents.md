# Popover Component - Agent Notes
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Overview

The Popover component provides a non-modal floating dialog that appears on click. It's built on Radix UI's Popover primitives with custom styling and size variants.

## Props Summary

### PopoverContent
- `size`: `"xs" | "sm" | "md" | "lg" | "xl" | "auto"` - Width variant
- `showArrow`: `boolean` - Whether to display pointing arrow
- `arrow`: `ReactNode` - Custom arrow element
- `side`: `"top" | "right" | "bottom" | "left"` - Preferred position
- `sideOffset`: `number` - Distance from trigger (default: 4)
- `align`: `"start" | "center" | "end"` - Alignment on side

### PopoverArrow
- `size`: `"xs" | "sm" | "md" | "lg" | "xl"` - Arrow size

## Dependencies

- `@radix-ui/react-popover` - Core popover functionality
- `class-variance-authority` - Variant management
- `clsx` + `tailwind-merge` via `cn()` utility

## Styling Decisions

### Size Variants
- **xs (w-40, p-2)**: Compact tooltips/hints
- **sm (w-52, p-3)**: Small info panels
- **md (w-72, p-4)**: Default for most use cases
- **lg (w-80, p-4)**: Forms and detailed content
- **xl (w-96, p-5)**: Rich content/settings panels
- **auto (w-auto, p-4)**: Content-driven width

### Animations
Uses Tailwind's animate utilities with Radix data attributes:
- `data-[state=open/closed]` for enter/exit animations
- `data-[side=*]` for directional slide animations
- Transform origin set via CSS variable for natural scaling

### Arrow Styling
- `fill-popover` matches content background
- Size scales with content size variant
- Positioned automatically by Radix

## Maintenance Notes

### Edge Cases
1. **Collision detection**: Radix handles automatic repositioning when popover would overflow viewport
2. **Portal rendering**: Content renders in portal by default to avoid z-index issues
3. **Nested popovers**: Each needs its own Popover wrapper
4. **Form elements**: Popover content can contain interactive elements without issues

### Common Integration Patterns

```tsx
// Basic usage
<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</Popover>

// Controlled with external state
<Popover open={open} onOpenChange={setOpen}>
  ...
</Popover>

// Custom anchor point
<Popover>
  <PopoverAnchor asChild>
    <div>Anchor here</div>
  </PopoverAnchor>
  <PopoverTrigger>Trigger</PopoverTrigger>
  <PopoverContent side="right">Positioned from anchor</PopoverContent>
</Popover>
```

### Accessibility Compliance
- Focus trapped within popover when open
- Escape closes popover
- Click outside closes popover
- Focus returns to trigger on close
- Proper ARIA dialog attributes

## Related Components
- **Tooltip**: For hover/focus hints (non-interactive)
- **Dialog**: For modal interactions requiring user action
- **Select**: Uses similar dropdown patterns
- **DropdownMenu**: For action menus (use Radix DropdownMenu instead)

## Design Tokens Used
- `--popover` / `--popover-foreground`: Colors
- `--border`: Border styling
- `--radius`: Corner radius
- Animation uses tailwindcss-animate plugin

## File Structure
```
src/components/popover/
├── index.tsx           # Component source
├── Popover.stories.tsx # Storybook stories
├── README.md           # Developer documentation
└── agents.md           # This file
```



