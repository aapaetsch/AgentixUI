# DropdownMenu Component

## Title
DropdownMenu

## Props
- `DropdownMenu`: standard Radix root props for controlled and uncontrolled open state
- `DropdownMenuTrigger`: standard Radix trigger props, supports `asChild`
- `DropdownMenuContent`: standard Radix content props, default `sideOffset=6`
- `DropdownMenuItem`: standard item props plus `icon`, `inset`, and `variant`
- `DropdownMenuCheckboxItem`: standard checkbox item props plus `icon`, `inset`, and `variant`
- `DropdownMenuRadioItem`: standard radio item props plus `inset` and `variant`
- `DropdownMenuLabel`: standard label props plus `inset`
- `DropdownMenuSubTrigger`: standard sub-trigger props plus `inset` and `variant`
- `DropdownMenuShortcut`: plain span props for right-aligned shortcut text

## Dependencies
- `@radix-ui/react-dropdown-menu`
- `class-variance-authority`
- `lucide-react`
- `src/lib/utils.ts`

## Styling Decisions
- Content uses the same border, popover background, elevation, and motion patterns as the existing overlay components.
- Items reuse the context-menu interaction model: subtle accent hover, destructive emphasis, and optional inset spacing for nested structures.
- Shortcut text is intentionally small and muted so action labels remain visually dominant.

## Maintenance Notes
- Keep item variants aligned with `context-menu` so the two menu primitives feel like part of the same family.
- Prefer `DropdownMenuTrigger asChild` with the existing `Button` component for consistent focus and sizing.
- If icon sizing changes globally, update the shared menu item selector rather than per-story overrides.
