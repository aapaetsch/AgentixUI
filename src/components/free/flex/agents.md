# Flex Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Title
Flex - Flexible container and item components for building layouts

## Components
- `Flex` - Base flex container with full direction control
- `FlexRow` - Convenience component for horizontal layouts (row direction)
- `FlexCol` - Convenience component for vertical layouts (column direction)
- `FlexItem` - Flex item with grow, shrink, basis, and order control

## Props
- `FlexProps`: Extends HTMLAttributes<HTMLDivElement> with flex container properties
  - `direction`: Flex direction ('row', 'row-reverse', 'col', 'col-reverse')
  - `wrap`: Flex wrap behavior ('nowrap', 'wrap', 'wrap-reverse')
  - `justify`: Justify content ('start', 'end', 'center', 'between', 'around', 'evenly')
  - `align`: Align items ('start', 'end', 'center', 'baseline', 'stretch')
  - `alignContent`: Align content for wrapped lines ('start', 'end', 'center', 'between', 'around', 'evenly', 'stretch')
  - `gap`: Gap between flex items (0-32 scale)
  - `gapX`: Horizontal gap between flex items (0-32 scale) - useful for different X/Y spacing in wrapped layouts
  - `gapY`: Vertical gap between flex items (0-32 scale) - useful for different X/Y spacing in wrapped layouts
  - `inline`: If true, renders as inline-flex instead of flex
  - Flex item props: `grow`, `shrink`, `basis`, `alignSelf`, `order` for nesting

- `FlexRowProps`: Extends FlexProps (without direction) - includes all flex item props
  - `reverse`: If true, uses row-reverse direction
  - Inherits all FlexProps including gap, gapX, gapY, and flex item props

- `FlexColProps`: Extends FlexProps (without direction) - includes all flex item props
  - `reverse`: If true, uses col-reverse direction
  - Inherits all FlexProps including gap, gapX, gapY, and flex item props

- `FlexItemProps`: Extends HTMLAttributes<HTMLDivElement> with flex item properties
  - `grow`: Flex grow factor (0-5)
  - `shrink`: Flex shrink factor (0-5)
  - `basis`: Flex basis ('auto', 'full', 'fit', 'min', 'max', fractions)
  - `alignSelf`: Align self ('auto', 'start', 'end', 'center', 'baseline', 'stretch')
  - `order`: Order of the flex item ('first', 'last', 'none', 1-12)
  - `inline`: If true, renders as span instead of div

## Dependencies
- `class-variance-authority` - Variant management
- `../../../lib/utils` - `cn()` utility

## Styling Decisions
- Used CVA for comprehensive variant management following existing patterns
- Included all major flexbox properties as component props for better readability
- Used Tailwind's spacing scale for gap values (0-32) for consistency
- Added `gapX` and `gapY` for granular control of horizontal/vertical spacing in wrapped layouts
- Added inline option to support inline-flex use cases
- Followed the same pattern as other components with defaultVariants for sensible defaults
- Used descriptive prop names that match CSS property names for easy understanding
- Created FlexRow and FlexCol convenience components for common use cases

## Maintenance Notes
- Keep variant options in sync with Tailwind's flexbox utility classes
- Ensure gap scale matches project's spacing system
- Consider adding responsive variants if needed in future
- Basis fractions follow Tailwind's standard sizing options
- FlexRow and FlexCol are thin wrappers over Flex for DX convenience
- All Flex components (Flex, FlexRow, FlexCol) support flex item props for nesting
- FlexItem is still available for non-flex children that need flex item control


