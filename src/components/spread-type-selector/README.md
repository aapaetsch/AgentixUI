# SpreadTypeSelector

Pick a multi-leg spread template (`single`, `vertical`, `calendar`, `straddle`,
`strangle`, `iron-condor`, `butterfly`). Pure input — the parent
`MultiLegOrderTicket` maps the chosen template into leg skeletons.

Use `options` to restrict strategies, `labels` or `renderOption` to customize their presentation, and `size`, `disabled`, `ariaLabel`, or `emptyContent` to fit the selector into different ticket surfaces.

## Usage

```tsx
const [spread, setSpread] = useState<SpreadType>("vertical");
<SpreadTypeSelector value={spread} onChange={setSpread} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `SpreadType` | — | Controlled value. |
| `onChange` | `(v: SpreadType) => void` | — | Change callback. Only fired for a *new* selection; clicking the active toggle is a no-op. |
| `options` | `readonly SpreadType[]` | all | Restrict available templates. Empty array renders a `No spreads` placeholder. |
| `disabled` | `boolean` | — | Disable every toggle in the group. |
| `className` | `string` | — | Merged last via `cn()`. |

## Behavior notes

- **Controlled & non-deselectable:** because `value` is controlled and the
  Radix deselect (`""`) is filtered out, clicking the currently-active toggle
  cannot turn it off — the selected template stays `on` with no flicker.
- **Empty state:** `options={[]}` renders a muted inline `No spreads` text node
  instead of the toggle row, so constrained layouts don't collapse.
- **Disabled:** `disabled` is forwarded to the underlying `ToggleGroup`;
  every `ToggleGroupItem` is disabled and pointer events are suppressed.

## Exported types/values

- `SpreadType`, `DEFAULT_SPREAD_OPTIONS`.
