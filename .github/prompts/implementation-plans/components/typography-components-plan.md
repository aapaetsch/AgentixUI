# Plan: Implement Typography Components and Classes

TL;DR — Establish a consistent typographic system (scale, tokens, utilities) and implement composable components (`Heading`, `Text`, `Lead`, `Muted`, `Small`, `Large`, `Prose`) with CVA-driven variants and Storybook coverage. Use Tailwind tokens and existing utilities (`cn`, `cva`, `tailwind-merge`) so components integrate cleanly with current theming and size mappings.

### Steps
1. Audit existing typography folders and conventions referenced in `src/components` and `src/globals.css`.
2. Define token set and add to `tailwind.config.js` (`fontSize`, `lineHeight`, `letterSpacing`, `fontFamily`) and document in `src/globals.css` where helpful.
3. Implement `Text` at [src/components/text/index.tsx](src/components/text/index.tsx) with CVA variants: `size`, `weight`, `variant` (default, muted, lead), and `as` polymorphic prop.
4. Implement `Heading` at [src/components/heading/index.tsx](src/components/heading/index.tsx) with `level` prop (h1..h6) and responsive size mapping.
5. Create semantic wrappers: `Lead`, `Muted`, `Small`, `Large` in their respective folders wrapping `Text` with sensible defaults and docs.
6. Implement `Prose` at [src/components/prose/index.tsx](src/components/prose/index.tsx) to handle long-form content using Tailwind `prose` utilities or a lightweight custom style.
7. Add Storybook stories for each component (`*.stories.tsx`) showing variants, responsive behavior, and accessibility notes.
8. Export components from `src/index.ts` and update any named exports used by other components.
9. Add `README.md` and `agents.md` to each component folder describing props, dependencies, styling decisions, and maintenance notes.
10. Add ARIA guidance and basic tests (Storybook snapshots or unit tests) focused on semantic markup, sizes, and accessible headings order.
11. Update `docs/ROADMAP.md` to move Typography items from Planned to Complete after implementation and verification.

### Component Spacing, Sizing, Effects & Animation Guidelines

#### Spacing & Layout
- Spacing scale: use Tailwind spacing tokens (scale 1–8) mapped to rem: 0.25/0.5/0.75/1/1.5/2/3/4rem.
- Internal padding: text components are inline; `Prose` containers default `py-3` and `px-4` on mobile.
- External spacing: headings `mt-0 mb-2`, paragraphs `mt-0 mb-4`. Encourage `space-y-*` for stacked text blocks.
- Layout rules: `Prose` and article containers should use `max-w-prose` / `max-w-[65ch]` for readable measure.

#### Sizing
- Font scale (base 1rem = 16px):
  - `xs`: 0.75rem (12px)
  - `sm`: 0.875rem (14px)
  - `base`: 1rem (16px) — default
  - `lg`: 1.125rem (18px)
  - `xl`: 1.25rem (20px)
  - `2xl`: 1.5rem (24px)
  - `3xl`: 2rem (32px)
- Min/max constraints: `Prose` max-width `65ch`; headings can be truncated with `truncate` if necessary.
- Breakpoint behavior: scale headings up at `md` and `lg` (e.g., `h1` 3xl → 4xl at `md`). Keep body text stable across breakpoints unless density mode changes.

#### Effects
- Shadows: none for text; use subtle shadows only in containers like cards per project patterns.
- Borders: use `border` token for decorative rules; text should not rely on borders for meaning.
- Focus rings: interactive text elements (links, inline buttons) use theme `ring` token with `ring-2` + `ring-offset-2`.

#### Animation & Transitions
- Motion guidelines: minimal motion. Durations `150ms`–`200ms`; easing `cubic-bezier(.2,.9,.2,1)`.
- Transition properties: `opacity`, `transform`, `box-shadow` for interactive states.
- Interactive feedback: hover → subtle color shift (`opacity-95` or color token change); active → small scale `scale-98`.
- Open/close motion: Not applicable to static text; `Prose` collapse/expand may animate `max-height` + `opacity` if needed with `200ms` ease.

### Further Considerations
1. Tokens & Theming: Prefer defining tokens in `tailwind.config.js` for build-time optimization, optionally mirror critical tokens in `src/globals.css` as CSS variables for runtime theming (dark mode switches).
2. Accessibility: Ensure semantic headings (`<h1>` → `<h6>`), provide examples of logical heading order in stories, and validate color contrast for `muted` and `lead` variants.
3. Integration risk: Adding or renaming Tailwind tokens requires updating existing components; provide backward-compatible alias tokens and a migration note in `README.md`.
4. Dependency note: Use existing utilities (`cn`, `cva`, `tailwind-merge`) for class composition and variant handling. Do not introduce new runtime-class libraries without review.

### Implementation Notes for Developers
- Use a polymorphic `as` prop pattern for `Text` and `Heading` to support custom tags while preserving semantic defaults.
- Prefer small, focused stories demonstrating one dimension (size, weight, color) and a combined story showing real-world layouts.
- Keep components small and composable; prefer composition over large prop surfaces.

### Tests & Verification
- Add Storybook stories per component with accessibility checks noted in the story description.
- Add snapshot tests for each major variant (optional, depending on existing test infra).
- Run `npm run build` and Storybook dev (`npm run storybook`) locally as part of the Dev Runner workflow.

### Roadmap & Deliverables
- Deliver component files in `src/components/[name]/` following project conventions.
- Add `README.md` and `agents.md` for each component folder.
- Update `docs/ROADMAP.md` to reflect completion.

---

This plan is final and ready for implementation. Implementers should follow items in the TODO list and create PRs referencing this plan.
