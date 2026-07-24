# Field

A flat, composable form-field primitive that groups a label, description,
control, and error message. Loosely follows the shadcn/ui `FormItem` pattern
but exposes a plain-React API with no context provider and no dependency on
`react-hook-form`.

## Props

### `Field`
| Prop          | Type                       | Default | Description                                              |
| ------------- | ------------------------- | ------- | ------------------------------------------------------- |
| `isInvalid`   | `boolean`                 | -       | Toggles `data-invalid="true"` on the wrapper for hooks.  |
| `className`   | `string`                  | -       | Merged via `cn()`.                                       |
| `...rest`     | `HTMLAttributes<HTMLDivElement>` | - | Forwarded to the underlying `<div>`.                    |

### `FieldLabel`
Extends [`LabelProps`](../label/agents.md). A thin re-export of `Label`.

### `FieldDescription`
| Prop          | Type                            | Default | Description                          |
| ------------- | ------------------------------ | ------- | ----------------------------------- |
| `className`   | `string`                       | -       | Merged via `cn()`.                  |
| `...rest`     | `HTMLAttributes<HTMLParagraphElement>` | -  | Forwarded to the `<p>`.             |

### `FieldError`
| Prop          | Type                            | Default | Description                                    |
| ------------- | ------------------------------ | ------- | ---------------------------------------------- |
| `error`       | `string`                       | -       | If set (non-empty), renders this and ignores `children`. |
| `className`   | `string`                       | -       | Merged via `cn()`.                              |
| `children`    | `ReactNode`                    | -       | Rendered only if `error` is empty/undefined.    |
| `...rest`     | `HTMLAttributes<HTMLParagraphElement>` | - | Forwarded to the `<p>` (with `role="alert"`).  |

### `FieldContent`
A tight `<div className="space-y-1">` for clustering label+description above
the control (or any other vertical cluster).

## Dependencies

- No new runtime dependencies. Wraps the workspace's own `Label`.
- `cn()` from `../../lib/utils`.

## Styling Decisions

- `Field` → `space-y-2` (shadcn form spacing).
- `FieldContent` → `space-y-1` (tighter intra-cluster spacing).
- `FieldDescription` → `text-sm text-muted-foreground`.
- `FieldError` → `text-sm font-medium text-destructive` with `role="alert"` so
  screen readers announce errors on appearance.
- `Field` sets `data-invalid="true"` (only when `isInvalid`) — leaving the
  actual aria wiring to the consumer for full control (see below).

## Accessibility (`aria-invalid` propagation)

For v1 this component intentionally does **not** inject `aria-invalid` into the
control itself, because the control is rendered as an unknown child (we have
no portal to forward props through). Consumers should wire `aria-invalid` and
`aria-describedby` themselves:

```tsx
<Field isInvalid={!!error}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input
    id="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
  />
  <FieldError id="email-error" error={error} />
</Field>
```

The `isInvalid` prop on `Field` only adds `data-invalid="true"` for any
CSS-based styling hooks consumers may want (not used by default styles).

## Maintenance Notes

- `FieldError` precedence: a non-empty `error` string always wins over
  `children`. Empty string / `undefined` / `null` renders nothing.
- All sub-components set `displayName` and forward refs to their root
  elements (div / label / p).
- `FieldLabel` is a thin wrapper over `Label` so that styling/usage changes to
  `Label` propagate automatically. The `Label` itself is re-exported from this
  directory for convenience.
- `"use client"` is included for RSC compatibility but the code is framework
  agnostic.