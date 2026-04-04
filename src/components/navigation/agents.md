# Navigation Components - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Overview
A comprehensive navigation system with three core components: Navbar, Navrail, and Navdrawer. All components share a unified context (`NavigationProvider`) for consistent state management across the application.

## Component Structure

### NavigationProvider
The root context provider that manages shared navigation state.
# Navigation Components

## Title
Navigation

## Props
- `NavigationProvider`: shared controlled or uncontrolled state for `activeItem`, `collapsed`, and `mobileOpen`.
- `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarActions`: top navigation shell with variant, sticky, bordered, elevated, and mobile-menu options.
- `Navrail`, `NavrailHeader`, `NavrailContent`, `NavrailFooter`, `NavrailCollapseButton`: vertical rail primitives with `variant`, `position`, `collapsible`, and collapsed-state support.
- `Navdrawer`, `NavdrawerTrigger`, `NavdrawerPortal`, `NavdrawerOverlay`, `NavdrawerContent`, `NavdrawerHeader`, `NavdrawerTitle`, `NavdrawerFooter`, `NavdrawerClose`: dialog-backed mobile or temporary drawer primitives with anchor and size variants.
- `NavItem`, `NavSection`, `NavDivider`, `NavBadge`: layout-level shared navigation primitives exported from `layout.tsx`.
- `NavGroup`, `NavItem`, `NavItemWithSubmenu`, `NavSection`, and `SubmenuItem`: animated item system exposed through the unified public API.

## Dependencies
- `@radix-ui/react-dialog` for the drawer overlay and content lifecycle.
- `@radix-ui/react-slot` for `asChild` composition in brand, item, and trigger components.
- `class-variance-authority` for layout, drawer, rail, section, badge, and premium indicator variants.
- `lucide-react` for menu, collapse, close, and submenu affordance icons.
- `src/lib/utils.ts` for `cn()` class merging.
- Internal reuse of `AnimatedChevron` and `Accordion` inside premium submenu items.

## Styling Decisions
- The folder is intentionally split into `layout.tsx` and `items.tsx`. `layout.tsx` owns the structural primitives and baseline nav items; `items.tsx` owns animated premium navigation groups and submenu interactions.
- The root package aliases the premium items as the public `NavGroup`, `NavItem`, `NavItemWithSubmenu`, `NavSection`, and `SubmenuItem` exports in `src/index.ts`. Inside this folder, both the plain layout primitives and premium items still exist separately.
- Navbar, rail, and drawer all use the same motion and surface tokens so applications can combine them without a visual seam when switching between desktop and mobile navigation patterns.
- Premium item indicators are calculated from measured element bounds rather than fixed offsets, which is why the item layer tracks registered elements through context.

## Maintenance Notes
- `useNavigation` throws outside a provider; `useNavigationOptional` does not. Components that must work with or without provider context should use the optional hook pattern already present in the layout primitives.
- There are two `NavItem` concepts in this folder: the plain layout export from `layout.tsx` and the premium animated export from `items.tsx`. The package root intentionally re-exports the premium version under the public `NavItem` name, so changes here must be mirrored in `src/index.ts` if the public API shifts.
- Drawer behavior is tied to Radix Dialog semantics. If overlay, focus management, or portal structure changes, retest keyboard navigation, dismissal, and mobile menu flows together.
- Premium submenu items depend on shared accordion behavior and measured indicator placement. Any change to item padding, border radius, or orientation logic needs Storybook coverage for horizontal groups, vertical groups, and nested submenu cases.
- **NavBadge:** Notification/status badge for nav items



## Advanced Navigation Components
