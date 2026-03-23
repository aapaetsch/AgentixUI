# Grid Component
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Overview
A flexible CSS Grid layout container with preset column counts (1-12), gap, and padding options. Includes `GridItem` sub-component for precise item placement.

## Props

### Grid
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1-12 \| "none"` | `1` | Column count preset |
| `gap` | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | `"md"` | Gap between items |
| `gapX` / `gapY` | Same as gap | - | Independent horizontal/vertical gap |
| `padding` | Same as gap | - | Container padding |
| `paddingX` / `paddingY` | Same as gap | - | Independent padding |
| `flow` | `"row" \| "col" \| "dense" \| "row-dense" \| "col-dense"` | - | Grid auto flow |
| `alignItems` | `"start" \| "center" \| "end" \| "stretch" \| "baseline"` | - | Vertical item alignment |
| `justifyItems` | `"start" \| "center" \| "end" \| "stretch"` | - | Horizontal item alignment |
| `asChild` | `boolean` | `false` | Render as child element |

### GridItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colSpan` | `1-12 \| "full" \| "auto"` | - | Column span |
| `rowSpan` | `1-6 \| "full" \| "auto"` | - | Row span |
| `colStart` / `colEnd` | `1-13 \| "auto"` | - | Column position |
| `rowStart` / `rowEnd` | `1-7 \| "auto"` | - | Row position |
| `alignSelf` | `"auto" \| "start" \| "center" \| "end" \| "stretch" \| "baseline"` | - | Override vertical alignment |
| `justifySelf` | `"auto" \| "start" \| "center" \| "end" \| "stretch"` | - | Override horizontal alignment |
| `padding` | Same as Grid padding | - | Item-specific padding |
| `paddingX` / `paddingY` | Same as padding | - | Independent item padding |
| `order` | `"first" \| "last" \| "none" \| 1-12` | - | Item order |

## Dependencies
- `@radix-ui/react-slot` - For `asChild` polymorphic rendering
- `class-variance-authority` - CVA for variant management
- `clsx` + `tailwind-merge` - For `cn()` utility

## Styling Decisions

### Column Presets (1-12)
Uses Tailwind's built-in `grid-cols-1` through `grid-cols-12` for type-safe column counts. Arbitrary values beyond 12 are supported via `className` prop using Tailwind's arbitrary value syntax: `grid-cols-[repeat(13,minmax(0,1fr))]`.

### Gap/Padding Scale
Uses consistent size scale matching other components:
- `none` → 0
- `xs` → 0.25rem (Tailwind `gap-1`)
- `sm` → 0.5rem (Tailwind `gap-2`)
- `md` → 1rem (Tailwind `gap-4`) - **default**
- `lg` → 1.5rem (Tailwind `gap-6`)
- `xl` → 2rem (Tailwind `gap-8`)
- `2xl` → 2.5rem (Tailwind `gap-10`)
- `3xl` → 3rem (Tailwind `gap-12`)

### Independent Spacing
Both Grid and GridItem support independent X/Y spacing:
- `gapX` / `gapY` for horizontal/vertical gaps
- `paddingX` / `paddingY` for horizontal/vertical padding
This allows layouts like horizontal card carousels with tight vertical spacing.

### Responsive Design
Responsive layouts are achieved via `className` prop using Tailwind breakpoints:
```tsx
<Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-4">
```
This approach was chosen over object syntax props (e.g., `cols={{ base: 1, sm: 2 }}`) for consistency with Tailwind patterns and reduced bundle size.

## Maintenance Notes

### Arbitrary Values
For column counts beyond 12, users must use Tailwind arbitrary value syntax in `className`. Consider documenting common patterns:
```tsx
// 13 columns
className="grid-cols-[repeat(13,minmax(0,1fr))]"
// Auto-fill with min 200px
className="grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
```

### GridItem Independence
GridItem has its own padding props separate from Grid. This allows fine-grained control but could be confusing. Document clearly that GridItem padding is applied to the item wrapper, not the Grid's gap.

### Flow Variants
Dense flow variants (`dense`, `row-dense`, `col-dense`) can cause visual reordering that may impact accessibility. Document that screen reader order follows DOM order, not visual order.

## File Structure
```
src/components/free/grid/
├── index.tsx          # Grid and GridItem components
├── Grid.stories.tsx   # Storybook stories
├── agents.md          # This file
└── README.md          # Human documentation
```


