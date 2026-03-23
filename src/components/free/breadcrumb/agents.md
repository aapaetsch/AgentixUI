# Breadcrumb Component - Agent Notes
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Overview

The Breadcrumb component provides a navigation trail that helps users understand their location within a website's hierarchy. It follows shadcn/ui patterns with custom styling and includes a responsive variant that automatically collapses items.

## Props Summary

### Breadcrumb
- `separator`: `ReactNode` - Custom separator element (default: `<ChevronRight />`)
- `className`: `string` - Additional classes for the nav element

### BreadcrumbList
- Standard `<ol>` element props

### BreadcrumbItem
- Standard `<li>` element props

### BreadcrumbLink
- `asChild`: `boolean` - Render as child component using Slot (default: `false`)
- `href`: `string` - Navigation destination
- Standard anchor props

### BreadcrumbPage
- Standard `<span>` element props
- Automatically applies `aria-current="page"`

### BreadcrumbSeparator
- `type`: `"chevron" | "slash" | "arrow" | "dot" | "custom"` - Separator type
- `children`: `ReactNode` - Custom separator content (overrides context)

### BreadcrumbEllipsis
- Standard `<span>` element props

### ResponsiveBreadcrumb
- `items`: `BreadcrumbItem[]` - Array of `{ href?: string, label: string }`
- `itemsToDisplay`: `number` - Number of visible items (default: `3`)
- `breakpoint`: `number` - Mobile/desktop breakpoint in px (default: `768`)
- `drawerTitle`: `string` - Title for mobile drawer (default: `"Navigate to"`)
- `drawerDescription`: `string` - Description for mobile drawer
- `linkComponent`: `ElementType` - Custom link component (default: `"a"`)
- `separator`: `ReactNode` - Custom separator element

## Dependencies

- `@radix-ui/react-slot` - For `asChild` pattern in BreadcrumbLink
- `lucide-react` - ChevronRight and MoreHorizontal icons
- `class-variance-authority` - Variant management
- `../popover` - For desktop dropdown in ResponsiveBreadcrumb
- `../sheet` - For mobile drawer in ResponsiveBreadcrumb
- `../button` - For drawer trigger in ResponsiveBreadcrumb

## Styling Decisions

### Layout
- Uses flexbox with `flex-wrap` for responsive behavior
- Gap of `1.5` (6px) on mobile, `2.5` (10px) on larger screens
- Text size is `sm` (14px) for readability

### Colors
- Links use `text-muted-foreground` with hover to `text-foreground`
- Current page (`BreadcrumbPage`) uses `text-foreground` to stand out
- Separators inherit `text-muted-foreground`

### Separator Variants
Context-based separator allows global separator setting:
- Pass `separator` prop to `<Breadcrumb>` for global separator
- Override individual separators via `<BreadcrumbSeparator>` children

### Focus States
- Links have visible focus ring (`ring-2 ring-ring ring-offset-2`)
- Focus ring uses small border radius for clean appearance

### Truncation
- ResponsiveBreadcrumb applies `max-w-20 truncate` on mobile
- Full width on desktop (`md:max-w-none`)

## Maintenance Notes

### Edge Cases
1. **Empty href**: Items without `href` are treated as current page
2. **Single item**: Shows only the current page, no separator
3. **Short paths**: When `items.length <= itemsToDisplay`, no collapsing occurs
4. **Router integration**: Use `asChild` with router's Link component

### Common Integration Patterns

```tsx
// Basic breadcrumb
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// With Next.js Link
import Link from 'next/link';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/">Home</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    ...
  </BreadcrumbList>
</Breadcrumb>

// Responsive breadcrumb
<ResponsiveBreadcrumb
  items={[
    { href: "/", label: "Home" },
    { href: "/docs", label: "Docs" },
    { label: "Current" }, // No href = current page
  ]}
  linkComponent={Link}
/>

// Custom separator
<Breadcrumb separator={<Slash className="h-4 w-4" />}>
  ...
</Breadcrumb>
```

### Accessibility Compliance
- `<nav>` element with `aria-label="breadcrumb"`
- Ordered list (`<ol>`) for semantic structure
- `aria-current="page"` on current page element
- `aria-hidden="true"` on decorative separators and ellipsis
- Focus management for keyboard navigation
- Screen reader text for ellipsis trigger

### Responsive Behavior
The `useResponsiveBreadcrumb` hook:
- Uses `window.matchMedia` pattern internally via resize listener
- Returns `{ isDesktop: boolean }` based on breakpoint
- Desktop: Shows popover for collapsed items
- Mobile: Shows bottom sheet/drawer for collapsed items

## Related Components
- **Popover** - Used for desktop dropdown in ResponsiveBreadcrumb
- **Sheet** - Used for mobile drawer in ResponsiveBreadcrumb
- **Button** - Used for drawer trigger styling
- **Tabs** - Similar navigation pattern for lateral movement
- **Stepper** - For step-by-step navigation

## Design Tokens Used
- `--muted-foreground` / `--foreground`: Text colors
- `--ring`: Focus ring color
- `--radius`: Border radius (for focus ring)
- `--motion-duration-short`: Transition timing

## File Structure
```
src/components/free/breadcrumb/
├── index.tsx              # Component source
├── Breadcrumb.stories.tsx # Storybook stories
├── README.md              # Developer documentation
└── agents.md              # This file
```


