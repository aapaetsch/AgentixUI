# Label

A lightweight, accessible form `Label` component following the shadcn/ui visual
language. Renders a native `<label>` element with consistent typography and
`peer-disabled` styling for use with sibling form controls.

## Props

| Prop        | Type                              | Default | Description                                          |
| ----------- | --------------------------------- | ------- | --------------------------------------------------- |
| `className` | `string`                          | -       | Additional Tailwind classes (merged via `cn()`).     |
| `htmlFor`   | `string`                          | -       | Associates the label with a control by id.          |
| `...rest`   | `React.LabelHTMLAttributes`       | -       | All other native `<label>` attributes are forwarded. |

`LabelProps` is an alias for `React.LabelHTMLAttributes<HTMLLabelElement>`.

## Dependencies

- **None external.** Implemented with a plain `<label>` element to avoid
  introducing a new runtime dependency. `@radix-ui/react-label` is **not** a
  dependency in this workspace's `package.json`; if it is added later, this
  component can be migrated to wrap the Radix primitive without breaking the
  public API.
- `cn()` from `../../lib/utils`.

## Styling Decisions

- Uses the canonical shadcn label utility class:
  `text-sm font-medium leading-none peer-disabled:cursor-not-allowed
  peer-disabled:opacity-70`.
- `peer-disabled:*` variants require the associated control to be a *sibling*
  rendered after the label in the DOM (the standard `peer-` semantics). When
  arranging label/control in different containers, consumers should apply
  disabled styles to the label manually.
- No CVA variants: shadcn's label is intentionally single-variant.

## Maintenance Notes

- `displayName` is set to `"Label"` for React DevTools.
- Component is `forwardRef` so refs can attach to the underlying `<label>`.
- `"use client"` is included for Next.js / RSC compatibility but the component
  is otherwise framework-agnostic.