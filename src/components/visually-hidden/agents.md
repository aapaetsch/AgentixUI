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
The clip + focus-reveal pattern is driven by Tailwind's documented pair:

- Base (visually clipped, still in a11y tree): `sr-only absolute`
- Focus reveal (skip-link pattern): `focus:not-sr-only focus:absolute
  focus:w-auto focus:h-auto focus:p-2 focus:m-0 focus:overflow-visible
  focus:whitespace-normal`

`className` is merged last via `cn()`, so skip-link consumers can append positioning
(`left-4 top-4 z-50`) and visual styling (`bg-background border shadow`) on top of the base.

## Maintenance Notes
- The `as` prop renders via `React.ElementType`. Because the element is polymorphic,
  `ref` is typed as `HTMLElement`; cast via `as HTMLAnchorElement` for `as="a"` use sites
  that need anchor-specific API access. A full generic refactor is tracked as a future
  improvement.
- Do not add `display: none` / `visibility: hidden` utilities — they would remove the
  content from the accessibility tree, defeating the purpose.
- Use `sr-only` / `focus:not-sr-only` (Tailwind's documented pair). Avoid reinstating
  the legacy `clip-[rect(0,0,0,0)]` / `focus:clip-auto` utilities — the `clip` CSS
  property is not exposed as a Tailwind utility and `clip-auto` is not registered, so
  those classes produce no CSS at build time.