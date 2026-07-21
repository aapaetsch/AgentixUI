# StrikesNavigator

Vertical strike ladder with ITM/ATM/OTM striping and a quick-jump input. Used
inside an options chain or multi-leg ticket to pick the focal strike.

## Usage

```tsx
<StrikesNavigator
  strikes={[380, 390, 400, 410, 420]}
  atmStrike={400}
  selectedStrike={400}
  onSelectStrike={setStrike}
/>
```

## Keyboard

Focus a row (Tab to the list, then Tab/Shift+Tab to move between selected
rows). Arrow keys move the selection within the list (wrapping at the ends),
`Home`/`End` jump to the first/last strike, and `Enter`/`Space` confirm the
selection.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strikes` | `number[]` | — | Sorted ascending strikes. |
| `atmStrike` | `number` | — | Spot used for ITM/ATM/OTM classification. |
| `selectedStrike` | `number` | — | Controlled selected strike. |
| `onSelectStrike` | `(s: number) => void` | — | Selection callback. |
| `atmTolerance` | `number` | `0.5` | Distance within which a strike is ATM. |
| `viewportRows` | `number` | `20` | Visible rows before scrolling. |
| `rowHeight` | `number` | `28` | Row height (px). |
| `autoScrollToSelected` | `boolean` | `true` | Scroll selected into view. |
| `className` | `string` | — | Merged last via `cn()`. |

## Notes

- All rows are rendered (no virtualization). Targeted strike lists are short
  (~80 rows); a few hundred rows is still fine in a modern browser.
- `classify` treats `strike < atm` as ITM (call convention). For put-focused
  use, filter the `strikes` array upstream.