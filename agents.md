# Agent Protocol: @aidan/ui

## Identity & Purpose
You are maintaining a shared React UI library using **TypeScript, React, Tailwind CSS, and shadcn/ui**.
**Goal:** Build high-quality, accessible components bundled with `tsup` for consumption in Web and Electron apps.

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.

## Tech Stack & Constraints
* **Core:** React 18+, TypeScript 5+.
* **Styling:** Tailwind CSS (primary), `class-variance-authority` (CVA) for variants.
* **Icons:** `lucide-react` (standard shadcn icon set).
* **Build:** `tsup` (Output: ESM & CJS).
* **Docs:** Storybook.

## Shadcn/ui Docs
- Refer to [shadcn/ui site map](https://https://ui.shadcn.com/llms.txt) for the shadcn documentation site map. From there you can find the specific documentation for your needs.

## Project Structure Rules
All components must reside in: `src/components/[PascalCaseName]/`
Each folder must contain:
1.  `index.tsx`: Component source.
2.  `[Name].stories.tsx`: Storybook stories.
3.  `agents.md`: Component-specific context.

## Design Philosophy
* **Cohesion:** All components must look and feel like they belong together. Consistency in spacing, typography, colors, and interaction patterns is critical.
* **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.
* **Use Cases:** Components should be versatile enough to work well in:
  - Information dashboards displaying readoufs or financial data.
  - E-commerce sites with product listings and checkout flows.
  - Data-heavy applications requiring tables, forms, and filters.
  - Apps designed to be used in both light and dark modes.
  - Apps running in Electron environments.
  - Apps that are companion apps to video games.
  - Apps that are designed for interacting with AI systems.
* **Simplicity:** Avoid over-engineering. Keep components lean, readable, and easy to maintain. Prefer clear, minimal implementations over complex abstractions.

## Styling & Theming Strategy
1.  **No Duplicate CSS:** Never write raw CSS for standard styling. Use Tailwind utility classes.
2.  **Theming:** Use CSS variables defined in `src/globals.css` (e.g., `--primary`, `--muted`).
3.  **Overrides:** All components must accept a `className` prop and merge it using the `cn()` utility (`clsx` + `tailwind-merge`) as the last argument.
4.  **Shadcn:** When adding a shadcn component, copy the code into `src/components/[Name]/index.tsx` and refactor imports to be relative.
5. **REM vs PX:** Prefer `rem` units for spacing, sizing, and typography to ensure scalability with root font size changes. Use `px` only for very specific use cases where exact pixel control is necessary (e.g., borders, shadows).
6. **UI Kit Design Aim:** We are going for a minimalist, modern aesthetic with clean lines, ample whitespace, and a focus on usability. Components should feel light and unobtrusive while still being visually appealing, cohesive and functional.

## Component `agents.md` Requirement
Every component folder **must** have an `agents.md` file using this template:
- **Title:** Component Name.
- **Props:** Brief interface summary.
- **Dependencies:** List (e.g., `@radix-ui/react-slot`).
- **Styling Decisions:** Why specific CVA variants were chosen.
- **Maintenance Notes:** Known edge cases.

## Build & Export
* `src/index.ts` must export all components.
* `src/globals.css` must be the entry point for CSS variables.

## Component Architecture Guidelines

### Modularity Principles
* **Single Responsibility:** Each component should have one clear purpose. If a component does too many things, break it into smaller components.
* **Composition over Inheritance:** Use composition to build complex components from simpler ones rather than creating deep inheritance hierarchies.
* **Controlled Components:** Prefer controlled components that accept values and callbacks as props for better predictability and testability.
* **Component Boundaries:** Keep components focused on their specific domain. Avoid creating components that are too generic or too specific to one use case.

### Props Design
* **Explicit Prop Interfaces:** Define clear TypeScript interfaces for all component props with descriptive JSDoc comments.
* **Prop Defaults:** Use sensible defaults for optional props to improve component usability.
* **Prop Spreading:** Avoid spreading unknown props directly onto DOM elements. Instead, destructure and pass only known attributes.
* **Callback Naming:** Use consistent callback naming patterns (e.g., `onValueChange`, `onOpenChange`) following React conventions.
* **DOM Props Forwarding:** Forward relevant DOM props to the root element (e.g., `id`, `aria-*`, `data-*`, `tabIndex`).

## Maintainability Practices

### Code Organization
* **Logical Grouping:** Group related code together (state, effects, handlers, constants) within components to improve readability.
* **Hook Customization:** Extract reusable logic into custom hooks when it involves state or effects that are used across multiple components.
* **Helper Functions:** Move complex logic or calculations into pure helper functions that are easier to test independently.
* **Type Organization:** Define complex types near where they are used, but export shared types to a central location.

### Component State Management
* **Local State:** Keep state as local as possible. Only lift state up when genuinely needed by multiple components.
* **State Structure:** Structure state to avoid contradictions and ensure consistency. Prefer state structures that prevent impossible states.
* **Effect Dependencies:** Specify accurate dependency arrays for `useEffect` hooks to prevent stale closures and infinite re-renders.
* **Performance Optimization:** Use `React.memo`, `useMemo`, and `useCallback` only when profiling shows a performance benefit, not preemptively.

### Testing & Documentation
* **Storybook Coverage:** Every component must have comprehensive Storybook stories showcasing all variants and key interactions.
* **Accessibility Testing:** Components must be tested for accessibility compliance using tools like axe-core or browser dev tools.
* **Type Safety:** Maintain strict TypeScript settings with no implicit any. Utilize advanced types (unions, generics) where appropriate for better DX.
* **Component API Documentation:** Document public APIs in component comments and maintain updated README files for complex components.