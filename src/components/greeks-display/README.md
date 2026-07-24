# GreeksDisplay

Renders an option's Greeks — Δ, Γ, Θ, ν, ρ — in a compact grid or inline row.

Each Greek is a `Tooltip`-wrapped label + a `NumericText` value. Omitted fields
are dropped, so the layout adapts to whatever subset of Greeks you have.

## Usage

```tsx
<GreeksDisplay greeks={{ delta: 0.42, theta: -3.2 }} colorize />

<GreeksDisplay greeks={position.greeks} layout="inline" signed colorize />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `greeks` | `Greeks` | — | The Greeks to render. |
| `layout` | `"grid" \| "inline"` | `"grid"` | Display density. |
| `signed` | `boolean` | `false` | Force +/- on positives. |
| `colorize` | `boolean` | `false` | Apply sign-based coloring. |
| `showTooltips` | `boolean` | `true` | Wrap labels in glossary tooltips. |
| `glossary` | `Partial<Record<keyof Greeks, ReactNode>>` | — | Override glossary text. |
| `className` | `string` | — | Merged last via `cn()`. |

## Accessibility

Each Greek label carries an `sr-only` semantic name (`Delta`, `Gamma`, …)
before the visible Greek letter, since screen readers announce `Δ`/`Γ`
inconsistently. Inline cells are wrapped in a `role="group"` span with an
`aria-label` of the Greek name. Tooltip triggers are keyboard-focusable
(Radix `TooltipTrigger` adds `tabindex={0}` to the non-focusable `<span>`
trigger). Sign is never conveyed by color alone — `NumericText` always sets
an `aria-label` and, when `signed`, a visible `+` prefix.

## Behavior notes

- Omitted fields (`null`/`undefined`) are dropped; `0` values are rendered.
- With `layout="inline"`, each label/value pair is bound in an `inline-flex`
  cell, so multiple Greeks read as `Δ 0.42 · Γ 0.0312 · …` (separated by the
  outer gap) rather than running together.
- Empty `greeks` renders an em-dash (`—`).