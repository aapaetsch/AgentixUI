# DropdownMenu Component

## Title
DropdownMenu

## Props
- `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuPortal`, `DropdownMenuGroup`, and `DropdownMenuSub` are thin Radix wrappers for root composition and state management.
- `DropdownMenuContent`: Radix content props with library defaults of `sideOffset=6` and `align="start"`.
- `DropdownMenuItem`: Radix item props plus `icon`, `inset`, and `variant` (`default` or `destructive`).
- `DropdownMenuCheckboxItem`: checkbox item props plus `icon`, `inset`, and `variant`; always reserves leading indicator space.
- `DropdownMenuRadioGroup`: standard Radix radio-group props.
- `DropdownMenuRadioItem`: radio item props plus `inset` and `variant`; always reserves leading indicator space.
- `DropdownMenuLabel`: label props plus `inset` for submenu-style alignment.
- `DropdownMenuSeparator`: standard separator props.
- `DropdownMenuSubTrigger`: submenu trigger props plus `inset` and `variant`; renders the trailing chevron automatically.
- `DropdownMenuSubContent`: submenu panel props with default `sideOffset=8`.
- `DropdownMenuShortcut`: plain `span` props for muted trailing shortcut text.
- Variant helpers are exported as `dropdownMenuContentVariants`, `dropdownMenuItemVariants`, `dropdownMenuLabelVariants`, `dropdownMenuSeparatorVariants`, `dropdownMenuShortcutVariants`, and `dropdownMenuSubTriggerVariants`.

## Dependencies
- `@radix-ui/react-dropdown-menu`
- `class-variance-authority`
- `lucide-react`
- `src/lib/utils.ts`

## Styling Decisions
- Content uses the same popover shell as the other overlay primitives: shared radius tokens, border, surface color, and directional enter and exit motion.
- Item styling is intentionally aligned with `context-menu` so both menu families share hover, focus, destructive, and nested inset behavior.
- Checkbox and radio items force left indicator spacing whether or not an icon is present. That keeps mixed menus visually aligned without extra consumer logic.
- Shortcut text stays small, uppercase, and muted so action labels remain dominant and keyboard hints do not compete for attention.

## Maintenance Notes
- Keep item variants aligned with `context-menu` so the two menu primitives feel like part of the same family.
- Prefer `DropdownMenuTrigger asChild` with the existing `Button` component for consistent focus, sizing, and keyboard affordances.
- `DropdownMenuContent` always renders inside a Radix portal. If placement or stacking behavior changes, test nested submenus and overlay interactions together.
- If icon sizing changes globally, update the shared menu item selector rather than per-story overrides so checkbox, radio, and submenu rows stay aligned.
