# Free Tier Components

> Core primitives that form the foundation of any application. Always free.

### Base Components

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **Button** | ✅ Complete | `Button`, `IconButton`, `ToggleButton`, `ToggleIconButton`, `SplitButton`, `ButtonGroup`, `ConnectedButtonGroup` | Full button system |
| **Input** | ✅ Complete | Text input with icons, validation states, sizes | - |
| **InputIncrementor** | ✅ Complete | `InputIncrementor` with 3 variants (default/embedded/minimal), 3 sizes, min/max/step, precision, custom formatters | Numeric input with +/- buttons |
| **Select** | ✅ Complete | Full Radix-based select with groups, labels, separators | Form control |
| **Switch** | ✅ Complete | Toggle switch with size variants | Basic form control |
| **Checkbox** | ✅ Complete | Single checkbox with indeterminate support | Basic form control |
| **Textarea** | ✅ Complete | Multi-line text input with auto-resize | - |
| **Radio** | ✅ Complete | Radio group with variants | Radix Radio Group |
| **Typography** | 📋 Planned | Headings, paragraphs, prose styling | - |
| **Badge** | ✅ Complete | `Badge`, `BadgeAnchor`, `AnimatedBadge` | Notification badges |
| **Chip** | ✅ Complete | `Chip`, `ChipGroup`, `ClosableChip` | Removable tags, filters, and status chips |
| **Avatar** | ✅ Complete | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarBadge`, `AnimatedAvatar` | User representation |
| **Alert** | ✅ Complete | `Alert`, `AlertTitle`, `AlertDescription`, `AlertClose`, `AlertAction` with 5 variants (default, destructive, success, warning, info) | Inline non-modal notifications |
| **AlertDialog** | ✅ Complete | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel` | Modal confirmation dialogs | Radix Alert Dialog |

### Layout Components

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **Card** | ✅ Complete | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Content container |
| **Container** | ✅ Complete | `Container` with maxWidth, padding, center, background variants | Page wrapper |
| **Grid** | ✅ Complete | `Grid`, `GridItem` with cols (1-12), gap, padding, flow, alignment variants | Layout utility |
| **Flex** | ✅ Complete | `Flex`, `FlexRow`, `FlexCol`, `FlexItem` with direction, wrap, gap, align, justify variants | Layout utility |

### Utility Components

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **Dialog / Modal** | ✅ Complete | Modal with sizes, close button, overlay | Radix Dialog |
| **Popover** | ✅ Complete | Click-triggered floating content | Radix Popover |
| **Context Menu** | ✅ Complete | Right-click action menu with submenus, checkboxes, radios | Radix ContextMenu |
| **Dropdown Menu** | ✅ Complete | Action menu with submenus, checkboxes, radios, and shortcut slots | Radix Dropdown Menu |
| **Tooltip** | ✅ Complete | Hover/focus information popover | Radix Tooltip |
| **HoverCard** | ✅ Complete | `HoverCard`, `HoverCardTrigger`, `HoverCardContent`, `HoverCardArrow`, `HoverCardClose` with size variants (xs-xl), hover/click trigger modes, touch detection, scrollable content | Rich content preview on hover |
| **Tabs** | ✅ Complete | Tab navigation with variants | Radix Tabs |
| **Accordion** | ✅ Complete | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Content disclosure |
| **Table** | ✅ Complete | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption` | Presentational table primitive |
| **Toast / Notification (basic)** | ✅ Complete | `toast()`, `useToast()`, `ToastProvider`, 5 variants, 6 positions, Avatar/Button integration | Store pattern with imperative API |
| **Slider (basic)** | ✅ Complete | `Slider` with xs/sm/md sizes, bar handle, press animation, gap styling, range support | Basic slider with free tier; advanced features (lg/xl sizes, circular/knobless handles, value/stop indicators, inset icons) in Premium |
| **Breadcrumb** | ✅ Complete | `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`, `ResponsiveBreadcrumb`, `useResponsiveBreadcrumb` | Path/hierarchy navigation with custom separators and responsive collapsing |
| **Pagination** | ✅ Complete | `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationFirst`, `PaginationLast`, `PaginationEllipsis`, `PaginationPageSizeSelector`, `ResponsivePagination`, `usePaginationRange()` | Page navigation with smart ellipsis, responsive mobile indicator, size/shape/variant support |
| **Stepper (basic)** | ✅ Complete | `Stepper`, `StepperList`, `StepperItem`, `StepperTrigger`, `StepperIndicator`, `StepperLabel`, `StepperSeparator`, `StepperContent`, `useStepperNavigation()` | Complex/non-linear variants reserved for Premium |
| **Navigation** | ✅ Complete | `NavigationProvider`, `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarActions`, `Navrail`, `NavrailHeader`, `NavrailContent`, `NavrailFooter`, `NavrailCollapseButton`, `Navdrawer`, `NavdrawerContent`, `NavdrawerHeader`, `NavdrawerTitle`, `NavdrawerFooter`, `NavItem`, `NavSection`, `NavDivider`, `NavBadge`, `useNavigation()` | Full navigation system with responsive behavior |
| **Sheet / Drawer (basic)** | ✅ Complete | Slide-out panel with position variants, modal/non-modal modes, basic focus/scroll locking | Core sheet functionality in Free tier |
| **Skeleton** | ✅ Complete | `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonAvatar`, `SkeletonButton`, `SkeletonInput` | Loading placeholders with pulse/shimmer animations |
| **Progress** | ✅ Complete | `LinearProgress`, `CircularProgress`, `SkillBar`, `ProgressGroup`, `valueFormatters` | Horizontal/vertical bars, circular, gradients, indeterminate mode |

### Internal/Utility (Free)

| Component | Status | Notes |
|-----------|--------|-------|
| **AnimatedChevron** | ✅ Complete | Multiple animation presets, used by Accordion |
| **Spinner** | ✅ Complete | Loading indicator, multiple sizes |
| **Separator** | ✅ Complete | Visual divider with orientation, color, and opacity |
