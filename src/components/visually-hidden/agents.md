# VisuallyHidden — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview
`VisuallyHidden` is a small a11y primitive that renders content accessible to screen readers
but hidden from sighted users, with a focus-reveal override so it doubles as a skip-link helper.

## Props
```ts
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType; // default "span"
}
```
All standard HTML attributes are forwarded to the rendered element.

## Dependencies
- `../../lib/utils` — `cn()` for class merging

No Radix dependency — this is intentionally a dependency-free alternative to
`@radix-ui/react-visually-hidden`.

## Styling Decisions
The clip + focus-reveal pattern is driven purely by Tailwind utilities:

- Base (visually clipped, still in a11y tree):
  `absolute w-[1px] h-[1px] overflow-hidden p-0 m-[-1px] border-0
   clip-[rect(0,0,0,0)] whitespace-nowrap`
- Focus reveal (skip-link pattern):
  `focus:absolute focus:w-auto focus:h-auto focus:p-2 focus:m-0
   focus:overflow-visible focus:whitespace-normal focus:clip-auto`

`className` is merged last via `cn()`, so skip-link consumers can append positioning
(`left-4 top-4 z-50`) and visual styling (`bg-background border shadow`) on top of the base.

## Maintenance Notes
- The `as` prop renders via `React.ElementType` cast. Because the element is polymorphic,
  `ref` is typed as `HTMLElement`; component-specific refs still work in practice.
- Do not add `display: none` / `visibility: hidden` utilities — they would remove the
  content from the accessibility tree, defeating the purpose.
- Do not replace the Tailwind clip utilities with Tailwind's `sr-only` helper class if
  you also need focus reveal: `sr-only` pairs with `focus:not-sr-only`, but the explicit
  utility list here is more stable across Tailwind versions and avoids relying on the
  `not-sr-only` variant being registered.