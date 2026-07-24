# EmptyState

Composite display primitive used to fill a list, grid, or table when there
is no data. Renders a centered stack: optional icon → title → optional
description → optional CTA action, all in muted styling.

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Draw from **Google Material Design** and **Tailwind Catalyst** for spacing,
  hierarchy, and minimal aesthetic.
- Maintain cohesion with sibling primitives like `Skeleton`. Both are
  placeholder-style displays and should feel visually related.

## Props

```typescript
interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon slot. `null`/`false` hides it; `undefined` falls back to lucide `Inbox`. */
  icon?: React.ReactNode;
  /** Title under the icon. @default "Nothing here" */
  title?: React.ReactNode;
  /** Secondary copy under the title. Omitted when not provided. */
  description?: React.ReactNode;
  /** Optional CTA rendered below the description (typically a `Button`). */
  action?: React.ReactNode;
  /** Controls icon size and title typography scale. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Extra classes merged last via `cn()`. */
  className?: string;
}
```

## Dependencies

- `react` — `forwardRef`, `HTMLAttributes`.
- `class-variance-authority` — size variants for icon + title.
- `lucide-react` — default `Inbox` icon.
- `../../lib/utils` — `cn()`.

## Styling Decisions

- **Flat composite API over context provider.** A list/grid empty slot does
  not benefit from sub-component composition, so we expose a flat props
  surface (`icon`, `title`, `description`, `action`). This matches the
  workspace's minimalism principle and avoids premature abstraction.
- **Title typography: rendered as a plain `<h3>`, NOT composed with
  `Typography`.** The existing `Typography` component exposes a fixed
  variant scale (`h1`–`h6`, `body`, `caption`, …) keyed by `variant`, and its
  size/weight pairings did not map cleanly onto the three EmptyState sizes
  (`sm` → `text-base font-medium`, `md` → `text-lg font-medium`, `lg` →
  `text-xl font-medium`). Forcing `Typography` would have required
  overriding its classes anyway, defeating the purpose. A plain `<h3>`
  with a dedicated `emptyStateTitleVariants` CVA function keeps things
  explicit, minimal, and easy to maintain. Documented here per the task
  spec.
- **Description: plain `<p className="text-sm text-muted-foreground">`.**
  Same reasoning — `Typography` would add abstraction without value.
- **Two CVA tables** (`emptyStateIconVariants`, `emptyStateTitleVariants`)
  — one per visual axis (icon size, title size). Both reuse the same
  `size` prop so consumers get a single knob.
- **Spacing.** Outer stack uses `flex flex-col items-center justify-center
  gap-2 p-6 text-center`. Title and description are grouped into a nested
  column flex with `gap-1` for a tighter pair, and the action sits below
  with a `mt-2` to give CTAs breathing room (~`gap-4` equivalent).
- **`null`/`false` icon handling.** Because `React.ReactNode` includes
  `null`, we explicitly check for both `null` and `false` to allow
  consumers to disable the icon slot without rendering anything.
- **Muted aesthetics.** Icon and description use `text-muted-foreground`;
  title uses `text-foreground` for hierarchy. This keeps EmptyState
  unobtrusive per the "minimalist, modern aesthetic" aim in the root
  `agents.md`.

## Maintenance Notes

- If `Typography` later grows a configurable size axis (e.g. a `size`
  prop), revisiting composition with `Typography` would be reasonable;
  until then, prefer the dedicated CVA functions here.
- The `title` default (`"Nothing here"`) is intentional — consumers who
  want no title should pass `title={null}`. This differs from
  `description`, which is conditionally rendered.
- Adding new sizes requires updating both `emptyStateIconVariants` and
  `emptyStateTitleVariants` for visual consistency.