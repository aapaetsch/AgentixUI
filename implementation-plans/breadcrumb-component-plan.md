# Implementation Plan: Breadcrumb Component

This document outlines the implementation plan for adding a Breadcrumb component to the @agentix/ui library, following shadcn/ui patterns and the project's existing component structure.

## TL;DR

The Breadcrumb component will be implemented following shadcn/ui patterns as a compound component with sub-components for each part of the breadcrumb trail. It will include Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, and BreadcrumbEllipsis. The implementation will include responsive behavior with dropdown/drawer support for mobile views and will follow the existing project structure with proper TypeScript interfaces, CVA variants, and accessibility features.

### Steps

1. Create the folder structure at `src/components/breadcrumb/`
2. Implement the Breadcrumb component and sub-components in `src/components/breadcrumb/index.tsx`
   - Include responsive behavior with dropdown for desktop and drawer for mobile
   - Implement BreadcrumbEllipsis component for collapsed states
   - Support custom separators beyond the default slash
3. Create Storybook stories in `src/components/breadcrumb/Breadcrumb.stories.tsx`
4. Write agent documentation in `src/components/breadcrumb/agents.md`
5. Write user documentation in `src/components/breadcrumb/README.md`
6. Export the component in `src/index.ts`
7. Update the roadmap status in `docs/ROADMAP.md`
8. Run the Dev Runner subagent to verify the build and Storybook

### Component Spacing, Sizing, Effects & Animation Guidelines

#### Spacing & Layout
- **Spacing scale:** Use Tailwind spacing scale (1-8) for gap between items
- **Internal padding:** None for breadcrumb container itself
- **External spacing:** Default margin of 1rem top/bottom for separation from other content
- **Layout rules:** Horizontal flex layout with wrap support, items aligned center

#### Sizing
- **Component height/width:** Variable height, full width container
- **Min/max constraints:** No fixed min/max width, items truncate with ellipsis
- **Breakpoint behavior:** Items truncate text on smaller screens, ellipsis for overflow

#### Effects
- **Shadows:** None for base component
- **Borders:** None for base component
- **Blurs / overlays:** None for base component

#### Animation & Transitions
- **Motion guidelines:** None for base component
- **Transition properties:** None for base component
- **Interactive feedback:** Standard focus states for links
- **Open/close motion:** None for base component

### Further Considerations

1. **Dependencies:** Will require lucide-react for default separator icon and dropdown/drawer components
2. **Accessibility:** Must follow aria-current="page" pattern for current page and proper keyboard navigation for dropdown/drawer
3. **Design System Compliance:** Will use existing CSS variables for theming
4. **Browser Support:** Standard React component with no special requirements
5. **Responsive Behavior:** Implementation will include useMediaQuery hook to detect viewport size and switch between dropdown (desktop) and drawer (mobile) for collapsed breadcrumbs
