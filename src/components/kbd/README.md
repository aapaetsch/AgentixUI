# Kbd

## Overview
Renders an inline `<kbd>` element with the standard shadcn keyboard styling — small rounded
border, subtle background, mono font, and muted text.

## Installation
```tsx
import { Kbd } from "aapaetsch-ui-kit";
```

## Usage
```tsx
<Kbd>⌘</Kbd>

{/* Multi-key combo */}
<span className="flex items-center gap-1">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</span>

{/* Inline className overrides */}
<Kbd className="bg-transparent border-dashed">⌘</Kbd>
```

## Props
```ts
interface KbdProps extends React.HTMLAttributes<HTMLElement> {}
```
All standard `HTMLElement` attributes are forwarded to the rendered `<kbd>`.