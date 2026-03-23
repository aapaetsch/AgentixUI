# Container
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A responsive layout wrapper for page content that provides consistent max-width constraints, padding, and optional centering following MD3 layout guidelines.

## Components

### Container
Main layout wrapper component with responsive max-width, padding, and centering options.

## Props

### Container Props
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'tight' | 'normal' | 'wide';
  center?: boolean;
  background?: 'transparent' | 'surface' | 'container' | 'containerLow' | 'containerHigh';
  asChild?: boolean;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'2xl'` | Maximum width constraint |
| `padding` | `'none' \| 'tight' \| 'normal' \| 'wide'` | `'normal'` | Horizontal padding |
| `center` | `boolean` | `true` | Center container horizontally |
| `background` | `'transparent' \| 'surface' \| 'container' \| 'containerLow' \| 'containerHigh'` | `'transparent'` | Background using MD3 surface colors |
| `asChild` | `boolean` | `false` | Render as child element for semantic HTML |
| `className` | `string` | - | Additional class names |

## Dependencies

- `@radix-ui/react-slot` - For `asChild` prop support
- `class-variance-authority` - For variant management
- `clsx` + `tailwind-merge` - Via `cn()` utility

## Styling Decisions

### Max Width Breakpoints
| Variant | Value | Use Case |
|---------|-------|----------|
| `sm` | 640px | Narrow dialogs, forms |
| `md` | 768px | Reading content, articles |
| `lg` | 1024px | Standard page layouts |
| `xl` | 1280px | Wide content areas |
| `2xl` | 1400px | Dashboard, data-heavy layouts |
| `full` | none | Full-width sections, heroes |

### Padding Variants
| Variant | Mobile | sm (640px+) | lg (1024px+) | Use Case |
|---------|--------|-------------|--------------|----------|
| `none` | 0 | 0 | 0 | Edge-to-edge content |
| `tight` | 16px | 16px | 16px | Compact layouts |
| `normal` | 16px | 24px | 32px | Standard layouts |
| `wide` | 24px | 32px | 48px | Spacious reading |

### MD3 Layout Guidelines
- Follows MD3 window size class margins (16dp compact, 24dp medium+)
- Uses responsive padding that scales with viewport
- Supports MD3 surface container color hierarchy for backgrounds

### CSS Variables Used
```css
/* MD3 Surface Colors (for background variants) */
--surface                    /* surface background */
--surface-container          /* container background */
--surface-container-low      /* containerLow background */
--surface-container-high     /* containerHigh background */
```

## Usage Examples

### Basic Page Layout
```tsx
<Container>
  <h1>Page Title</h1>
  <p>Page content...</p>
</Container>
```

### Reading Content
```tsx
<Container maxWidth="md" padding="wide">
  <article>
    <h1>Article Title</h1>
    <p>Long form content optimized for reading...</p>
  </article>
</Container>
```

### Full-Width Hero with Nested Container
```tsx
<Container maxWidth="full" padding="none" background="container">
  <Container maxWidth="lg" className="py-16">
    <h1>Hero Title</h1>
  </Container>
</Container>
```

### Semantic HTML
```tsx
<Container asChild>
  <main>
    <h1>Main Content</h1>
  </main>
</Container>
```

## Maintenance Notes

### Edge Cases
- When `maxWidth="full"`, the container has no width constraint
- `padding="none"` removes all horizontal padding - content will touch edges
- Nested containers can create complex spacing - use consistent padding variants
- `asChild` requires a single child element

### Accessibility
- Use `asChild` with semantic elements (`<main>`, `<section>`, `<article>`) for proper landmarks
- Containers are purely visual - no interactive states needed
- Background variants maintain proper color contrast

### Performance
- No JavaScript state or effects - pure CSS layout
- CVA variants are computed at build time
- Minimal DOM footprint (single wrapper element)


