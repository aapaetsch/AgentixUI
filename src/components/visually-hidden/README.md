# VisuallyHidden

## Overview
A small accessibility primitive that renders content for screen readers while hiding it
visually. On focus the element reveals itself, so it also works as a skip-link helper.

## Installation
```tsx
import { VisuallyHidden } from "aapaetsch-ui-kit";
```

## Usage
```tsx
{/* Accessible label without a visible label */}
<VisuallyHidden as="label" htmlFor="email">Email address</VisuallyHidden>
<input id="email" type="email" />

{/* Skip to content link (reveals on focus) */}
<VisuallyHidden as="a" href="#main"
  className="left-4 top-4 z-50 rounded-md border bg-background px-4 py-2 shadow-md">
  Skip to content
</VisuallyHidden>
```

## Props
```ts
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType; // default "span"
}
```