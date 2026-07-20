# Label

A styled `<label>` for forms, following the shadcn/ui aesthetic.

## Installation

`Label` is part of `@agentix/ui`:

```sh
import { Label } from "@agentix/ui";
```

## Usage

```tsx
import { Label } from "@agentix/ui";
import { Input } from "@agentix/ui";

<div className="flex flex-col gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

## Disabled peer styling

Place the label *before* the disabled control as a sibling so the
`peer-disabled:*` utilities apply:

```tsx
<div className="flex flex-col gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" disabled />
</div>
```

## Required field

```tsx
<Label>
  Email<span className="text-destructive" aria-hidden="true"> *</span>
  <span className="sr-only">required</span>
</Label>
```

## Props

Extends `React.LabelHTMLAttributes<HTMLLabelElement>`. The `className` prop is
merged with the default styles via `cn()`.