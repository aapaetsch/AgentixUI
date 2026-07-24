# Field

A flat, composable wrapper for form fields: label, description, control, and
error message. Built on plain React — no context provider, no react-hook-form
dependency.

## Installation

`Field` is part of `@agentix/ui`:

```sh
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@agentix/ui";
```

## Usage

### Basic

```tsx
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
</Field>
```

### With description

```tsx
<Field>
  <FieldContent>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <FieldDescription>We'll only use this for sign-in.</FieldDescription>
  </FieldContent>
  <Input id="email" type="email" />
</Field>
```

### With error

```tsx
<Field isInvalid>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" aria-invalid />
  <FieldError error="Please enter a valid email." />
</Field>
```

### Horizontal layout

```tsx
<Field>
  <div className="flex items-center gap-4">
    <FieldLabel htmlFor="email" className="w-24 shrink-0">Email</FieldLabel>
    <Input id="email" type="email" className="flex-1" />
  </div>
</Field>
```

### A11y wiring (recommended)

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

## Exports

- `Field` — wrapper `<div class="space-y-2">`.
- `FieldLabel` — thin re-export of `Label`.
- `FieldDescription` — `<p class="text-sm text-muted-foreground">`.
- `FieldError` — `<p role="alert" class="text-sm font-medium text-destructive">`.
- `FieldContent` — `<div class="space-y-1">` cluster helper.

See `agents.md` for the full prop reference.