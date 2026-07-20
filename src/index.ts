// @agentix/ui - Shared Design System
// Export all components from this file

// =============================================================================
// Utilities
// =============================================================================

export { cn } from "./lib/utils";

export {
  // Formatting
  formatDate,
  formatDateRange,
  formatTime,
  formatDateTime,
  DATE_FORMATS,
  // Parsing
  parseDate,
  parseTime,
  // Validation
  validateDate,
  isValidDate,
  isDateInRange,
  // Presets
  getDatePresets,
  getDateRangePresets,
  evaluatePreset,
  // Time helpers
  to12HourFormat,
  to24HourFormat,
  combineDateAndTime,
  extractTime,
  getHoursArray,
  getMinutesArray,
  // Re-exported date-fns functions
  format,
  parse,
  isValid,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isSameDay,
  isSameMonth,
  isSameYear,
  getDay,
  getMonth,
  getYear,
  getHours,
  getMinutes,
  getDaysInMonth,
  setHours,
  setMinutes,
  setMonth,
  setYear,
} from "./lib/date-utils";
export type {
  DateRange,
  TimeValue,
  DatePreset,
  DateValidationError,
  DateValidationErrorType,
  TimeFormat,
  DateFormatOptions,
} from "./lib/date-utils";

// -----------------------------------------------------------------------------
// Finance Utilities
// Shared formatting and theming helpers used across finance surfaces.
// -----------------------------------------------------------------------------

export {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatCompact,
  formatBasisPoints,
  formatSigned,
  roundToTick,
  type NumericFormat,
} from "./lib/number-utils";

export {
  formatRelativeTime,
  formatRelativeTimeShort,
  formatDuration,
} from "./lib/time-utils";

export {
  pnlColorClass,
  sentimentColor,
  resolveToken,
} from "./lib/color-utils";

// -----------------------------------------------------------------------------
// Finance Types
// Shared domain shapes used by finance widgets and composed templates.
// -----------------------------------------------------------------------------

export type {
  OrderBookLevel,
  TradeFlag,
  Trade,
  WatchlistItem,
  HoldingRow,
} from "./lib/finance-types";

// =============================================================================
// COMPONENTS
// Core primitives and shared building blocks.
// =============================================================================

// -----------------------------------------------------------------------------
// Typography
// -----------------------------------------------------------------------------
export {
  Typography,
  NumericText,
  typographyVariants,
  numericTextVariants,
} from "./components/typography";
export type {
  TypographyProps,
  NumericTextProps,
  NumericTextOptions,
} from "./components/typography";

// -----------------------------------------------------------------------------
// TrendIndicator
// -----------------------------------------------------------------------------
export {
  TrendIndicator,
  trendIndicatorVariants,
} from "./components/trend-indicator";
export type {
  TrendIndicatorProps,
  TrendDirection,
} from "./components/trend-indicator";

// -----------------------------------------------------------------------------
// Kbd
// -----------------------------------------------------------------------------
export { Kbd } from "./components/kbd";
export type { KbdProps } from "./components/kbd";

// -----------------------------------------------------------------------------
// VisuallyHidden
// -----------------------------------------------------------------------------
export { VisuallyHidden } from "./components/visually-hidden";
export type { VisuallyHiddenProps } from "./components/visually-hidden";

// -----------------------------------------------------------------------------
// AnimatedNumber
// -----------------------------------------------------------------------------
export {
  AnimatedNumber,
  animatedNumberVariants,
} from "./components/animated-number";
export type { AnimatedNumberProps } from "./components/animated-number";

// -----------------------------------------------------------------------------
// ToggleGroup
// -----------------------------------------------------------------------------
export {
  ToggleGroup,
  ToggleGroupItem,
  toggleGroupVariants,
  toggleGroupItemVariants,
} from "./components/toggle-group";
export type {
  ToggleGroupProps,
  ToggleGroupItemProps,
} from "./components/toggle-group";

// -----------------------------------------------------------------------------
// Resizable
// -----------------------------------------------------------------------------
export {
  Resizable,
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
  resizableHandleVariants,
} from "./components/resizable";
export type {
  ResizableProps,
  ResizablePanelProps,
  ResizableHandleProps,
  LayoutStorage,
  Layout,
  LayoutChangedMeta,
} from "./components/resizable";

// -----------------------------------------------------------------------------
// CommandPalette
// -----------------------------------------------------------------------------
export {
  CommandPalette,
  CommandPaletteTrigger,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandLoading,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  useCommandPalette,
} from "./components/command-palette";
export type {
  CommandPaletteProps,
  CommandInputProps,
  CommandListProps,
  CommandGroupProps,
  CommandItemProps,
  CommandPaletteTriggerProps,
} from "./components/command-palette";

// -----------------------------------------------------------------------------
// Toolbar
// -----------------------------------------------------------------------------
export {
  Toolbar,
  ToolbarButton,
  ToolbarToggle,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarLabel,
  toolbarVariants,
  toolbarButtonVariants,
} from "./components/toolbar";
export type {
  ToolbarProps,
  ToolbarButtonProps,
  ToolbarToggleProps,
  ToolbarToggleGroupProps,
  ToolbarToggleItemProps,
  ToolbarSeparatorProps,
  ToolbarLabelProps,
} from "./components/toolbar";

// -----------------------------------------------------------------------------
// OrderBook
// -----------------------------------------------------------------------------
export {
  OrderBook,
  OrderBookSide,
  OrderBookRow,
  OrderBookSpread,
  OrderBookHeader,
  OrderBookSkeleton,
  orderBookRowVariants,
  orderBookSideVariants,
} from "./components/order-book";
export type {
  OrderBookProps,
  OrderBookRowProps,
  OrderBookSideProps,
  OrderBookSpreadProps,
} from "./components/order-book";

// -----------------------------------------------------------------------------
// TimeAndSales
// -----------------------------------------------------------------------------
export {
  TimeAndSales,
  TimeAndSalesRow,
  TimeAndSalesHeader,
  timeAndSalesRowVariants,
} from "./components/time-and-sales";
export type {
  TimeAndSalesProps,
  TimeAndSalesRowProps,
} from "./components/time-and-sales";

// =============================================================================
// INVESTMENT-OPS TEMPLATES
// Composed blocks for an investment-ops dashboard. Templates compose
// existing primitives; they MUST NOT become a second primitive system.
// =============================================================================

export {
  StatTile,
  AccountSummary,
  Watchlist,
  HoldingsTable,
  OrderTicket,
  AllocationBreakdown,
  NewsFeed,
  InvestmentOpsDashboard,
} from "./templates/investment-ops";
export type {
  StatTileProps,
  AccountSummaryProps,
  WatchlistProps,
  HoldingsTableProps,
  OrderTicketProps,
  OrderSide,
  OrderType,
  TimeInForce,
  AllocationBreakdownProps,
  BreakdownRow,
  AllocationView,
  NewsFeedProps,
  NewsItem,
  InvestmentOpsDashboardProps,
} from "./templates/investment-ops";

// -----------------------------------------------------------------------------
// Accordion
// -----------------------------------------------------------------------------
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
  chevronSizeVariants,
} from "./components/accordion";
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  ChevronAnimationPreset,
} from "./components/accordion";

// -----------------------------------------------------------------------------
// Alert
// -----------------------------------------------------------------------------
export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertClose,
  AlertAction,
  alertVariants,
  alertTitleVariants,
  alertDescriptionVariants,
  alertCloseVariants,
  alertActionVariants,
} from "./components/alert";
export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
  AlertActionProps,
  AlertVariant,
} from "./components/alert";

// -----------------------------------------------------------------------------
// AlertDialog
// -----------------------------------------------------------------------------
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  alertDialogOverlayVariants,
  alertDialogContentVariants,
  alertDialogHeaderVariants,
  alertDialogFooterVariants,
  alertDialogTitleVariants,
  alertDialogDescriptionVariants,
} from "./components/alert-dialog";
export type {
  AlertDialogProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from "./components/alert-dialog";

// -----------------------------------------------------------------------------
// AnimatedChevron
// -----------------------------------------------------------------------------
export {
  AnimatedChevron,
  animatedChevronVariants,
} from "./components/animated-chevron";
export type {
  AnimatedChevronProps,
  ChevronAnimationPreset as AnimatedChevronAnimationPreset,
  ChevronDirection,
} from "./components/animated-chevron";

// -----------------------------------------------------------------------------
// Avatar
// -----------------------------------------------------------------------------
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarBadge,
  AnimatedAvatar,
  avatarVariants,
  avatarGroupVariants,
  avatarBadgeVariants,
} from "./components/avatar";
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarBadgeProps,
  AnimatedAvatarProps,
} from "./components/avatar";

// -----------------------------------------------------------------------------
// Badge
// -----------------------------------------------------------------------------
export { Badge, BadgeAnchor, AnimatedBadge, badgeVariants } from "./components/badge";
export type { BadgeProps, BadgeAnchorProps, AnimatedBadgeProps } from "./components/badge";

// -----------------------------------------------------------------------------
// Breadcrumb
// -----------------------------------------------------------------------------
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  ResponsiveBreadcrumb,
  useResponsiveBreadcrumb,
  breadcrumbVariants,
  breadcrumbListVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbPageVariants,
  breadcrumbSeparatorVariants,
  breadcrumbEllipsisVariants,
} from "./components/breadcrumb";
export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  BreadcrumbItemData,
  ResponsiveBreadcrumbProps,
} from "./components/breadcrumb";

// -----------------------------------------------------------------------------
// Button Components
// -----------------------------------------------------------------------------
export { Button, buttonVariants } from "./components/button";
export type { ButtonProps } from "./components/button";

export { IconButton, iconButtonVariants } from "./components/button/icon-button";
export type { IconButtonProps } from "./components/button/icon-button";

export { ToggleButton, toggleButtonVariants } from "./components/button/toggle-button";
export type { ToggleButtonProps } from "./components/button/toggle-button";

export { ToggleIconButton, toggleIconButtonVariants } from "./components/button/toggle-icon-button";
export type { ToggleIconButtonProps } from "./components/button/toggle-icon-button";

export {
  SplitButton,
  splitButtonVariants,
  splitButtonActionVariants,
  splitButtonTriggerVariants,
  chevronVariants,
} from "./components/button/split-button";
export type { SplitButtonProps } from "./components/button/split-button";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants, buttonGroupSeparatorVariants } from "./components/button/button-group";
export type { ButtonGroupProps, ButtonGroupSeparatorProps, ButtonGroupTextProps } from "./components/button/button-group";

export {
  ConnectedButtonGroup,
  ConnectedButtonGroupItem,
  connectedButtonGroupVariants,
  connectedButtonGroupItemVariants,
  useConnectedButtonGroup,
} from "./components/button/connected-button-group";
export type {
  ConnectedButtonGroupProps,
  ConnectedButtonGroupItemProps,
} from "./components/button/connected-button-group";

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
  CardFooter,
  SwipeableCard,
  ExpandableCard,
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardMediaVariants,
  cardActionsVariants,
  cardFooterVariants,
} from "./components/card";
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardMediaProps,
  CardActionsProps,
  CardFooterProps,
  SwipeableCardProps,
  ExpandableCardProps,
} from "./components/card";

// -----------------------------------------------------------------------------
// Chip
// -----------------------------------------------------------------------------
export {
  Chip,
  ChipGroup,
  chipVariants,
  chipIconVariants,
  chipDismissVariants,
  chipGroupVariants,
} from "./components/chip";
export type {
  ChipProps,
  ChipGroupProps,
} from "./components/chip";

// -----------------------------------------------------------------------------
// Checkbox
// -----------------------------------------------------------------------------
export { Checkbox, checkboxVariants } from "./components/checkbox";
export type { CheckboxProps } from "./components/checkbox";

// -----------------------------------------------------------------------------
// Label
// -----------------------------------------------------------------------------
export { Label } from "./components/label";
export type { LabelProps } from "./components/label";

// -----------------------------------------------------------------------------
// Field
// -----------------------------------------------------------------------------
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "./components/field";
export type {
  FieldProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldContentProps,
} from "./components/field";

// -----------------------------------------------------------------------------
// Dialog
// -----------------------------------------------------------------------------
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPages,
  useDialogPages,
  useResponsiveDialog,
  dialogOverlayVariants,
  dialogContentVariants,
  dialogHeaderVariants,
  dialogFooterVariants,
  dialogTitleVariants,
  dialogDescriptionVariants,
  dialogCloseVariants,
} from "./components/dialog";
export type {
  DialogProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
  DialogPage,
  DialogPagesProps,
  DialogTransition,
  UseDialogPagesOptions,
  UseDialogPagesReturn,
} from "./components/dialog";

// -----------------------------------------------------------------------------
// Input
// -----------------------------------------------------------------------------
export {
  Input,
  OutlinedInput,
  inputVariants,
  inputContainerVariants,
  outlinedContainerVariants,
  floatingLabelVariants,
} from "./components/input";
export type {
  InputProps,
  OutlinedInputProps,
} from "./components/input";

// -----------------------------------------------------------------------------
// InputIncrementor
// -----------------------------------------------------------------------------
export {
  InputIncrementor,
  inputIncrementorContainerVariants,
  inputIncrementorInputVariants,
  inputIncrementorButtonVariants,
} from "./components/input-incrementor";
export type { InputIncrementorProps } from "./components/input-incrementor";

// -----------------------------------------------------------------------------
// Radio
// -----------------------------------------------------------------------------
export {
  RadioGroup,
  RadioGroupItem,
  radioGroupVariants,
  radioGroupItemVariants,
  radioIndicatorVariants,
} from "./components/radio";
export type {
  RadioGroupProps,
  RadioGroupItemProps,
} from "./components/radio";

// -----------------------------------------------------------------------------
// Select
// -----------------------------------------------------------------------------
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectSeparatorVariants,
} from "./components/select";
export type {
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectItemProps,
  SelectSeparatorProps,
  SelectScrollUpButtonProps,
  SelectScrollDownButtonProps,
} from "./components/select";

// -----------------------------------------------------------------------------
// Spinner
// -----------------------------------------------------------------------------
export { Spinner, spinnerVariants } from "./components/spinner";
export type { SpinnerProps } from "./components/spinner";

// -----------------------------------------------------------------------------
// Separator
// -----------------------------------------------------------------------------
export { Separator, separatorVariants } from "./components/separator";
export type { SeparatorProps } from "./components/separator";

// -----------------------------------------------------------------------------
// Skeleton
// -----------------------------------------------------------------------------
export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  skeletonVariants,
} from "./components/skeleton";
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCardProps,
  SkeletonAvatarProps,
  SkeletonButtonProps,
  SkeletonInputProps,
} from "./components/skeleton";

// -----------------------------------------------------------------------------
// EmptyState
// -----------------------------------------------------------------------------
export {
  EmptyState,
  emptyStateIconVariants,
  emptyStateTitleVariants,
} from "./components/empty-state";
export type { EmptyStateProps } from "./components/empty-state";

// -----------------------------------------------------------------------------
// Switch
// -----------------------------------------------------------------------------
export { Switch, switchTrackVariants, switchThumbVariants } from "./components/switch";
export type { SwitchProps } from "./components/switch";

// -----------------------------------------------------------------------------
// Tabs
// -----------------------------------------------------------------------------
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} from "./components/tabs";
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "./components/tabs";

// -----------------------------------------------------------------------------
// Textarea
// -----------------------------------------------------------------------------
export {
  Textarea,
  TextareaWithCounter,
  textareaVariants,
  textareaContainerVariants,
} from "./components/textarea";
export type {
  TextareaProps,
  TextareaWithCounterProps,
} from "./components/textarea";

// -----------------------------------------------------------------------------
// Tooltip
// -----------------------------------------------------------------------------
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
  tooltipContentVariants,
  tooltipArrowVariants,
} from "./components/tooltip";
export type {
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "./components/tooltip";

// -----------------------------------------------------------------------------
// Popover
// -----------------------------------------------------------------------------
export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
  PopoverAnchor,
  popoverContentVariants,
  popoverArrowVariants,
} from "./components/popover";
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverAnchorProps,
} from "./components/popover";

// -----------------------------------------------------------------------------
// HoverCard
// -----------------------------------------------------------------------------
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardClose,
  useHoverCardContext,
  hoverCardContentVariants,
  hoverCardArrowVariants,
} from "./components/hover-card";
export type {
  HoverCardProps,
  HoverCardTriggerProps,
  HoverCardContentProps,
  HoverCardArrowProps,
  HoverCardCloseProps,
} from "./components/hover-card";

// -----------------------------------------------------------------------------
// Sheet / Drawer
// -----------------------------------------------------------------------------
export {
  PremiumSheet as Sheet,
  PremiumSheetTrigger as SheetTrigger,
  PremiumSheetPortal as SheetPortal,
  PremiumSheetContent as SheetContent,
  PremiumSheetHeader as SheetHeader,
  PremiumSheetFooter as SheetFooter,
  PremiumSheetTitle as SheetTitle,
  PremiumSheetDescription as SheetDescription,
  PremiumSheetClose as SheetClose,
  premiumSheetOverlayVariants as sheetOverlayVariants,
  premiumSheetContentVariants as sheetContentVariants,
  premiumSheetHeaderVariants as sheetHeaderVariants,
  premiumSheetFooterVariants as sheetFooterVariants,
  premiumSheetTitleVariants as sheetTitleVariants,
  premiumSheetDescriptionVariants as sheetDescriptionVariants,
  premiumSheetHandleVariants as sheetHandleVariants,
  animationPresets,
} from "./components/sheet";
export type {
  PremiumSheetProps as SheetProps,
  PremiumSheetTriggerProps as SheetTriggerProps,
  PremiumSheetPortalProps as SheetPortalProps,
  PremiumSheetOverlayProps as SheetOverlayProps,
  PremiumSheetContentProps as SheetContentProps,
  PremiumSheetHeaderProps as SheetHeaderProps,
  PremiumSheetFooterProps as SheetFooterProps,
  PremiumSheetTitleProps as SheetTitleProps,
  PremiumSheetDescriptionProps as SheetDescriptionProps,
  PremiumSheetCloseProps as SheetCloseProps,
} from "./components/sheet";

// -----------------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------------
export {
  Container,
  containerVariants,
} from "./components/container";
export type {
  ContainerProps,
} from "./components/container";

// -----------------------------------------------------------------------------
// Context Menu
// -----------------------------------------------------------------------------
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
  contextMenuContentVariants,
  contextMenuItemVariants,
  contextMenuSeparatorVariants,
  contextMenuLabelVariants,
  contextMenuSubTriggerVariants,
  contextMenuShortcutVariants,
} from "./components/context-menu";
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
  ContextMenuShortcutProps,
} from "./components/context-menu";

// -----------------------------------------------------------------------------
// Dropdown Menu
// -----------------------------------------------------------------------------
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
  dropdownMenuSeparatorVariants,
  dropdownMenuShortcutVariants,
  dropdownMenuSubTriggerVariants,
} from "./components/dropdown-menu";
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuPortalProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuGroupProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  DropdownMenuShortcutProps,
} from "./components/dropdown-menu";

// -----------------------------------------------------------------------------
// Table
// -----------------------------------------------------------------------------
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/table";
export type { TableProps } from "./components/table";

// -----------------------------------------------------------------------------
// Navigation (Navbar, Navrail, Navdrawer)
// -----------------------------------------------------------------------------
export {
  NavigationProvider,
  useNavigation,
  useNavigationOptional,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  Navrail,
  NavrailHeader,
  NavrailContent,
  NavrailFooter,
  NavrailCollapseButton,
  Navdrawer,
  NavdrawerTrigger,
  NavdrawerPortal,
  NavdrawerOverlay,
  NavdrawerContent,
  NavdrawerHeader,
  NavdrawerTitle,
  NavdrawerFooter,
  NavdrawerClose,
  NavDivider,
  NavBadge,
  navbarVariants,
  navrailVariants,
  navdrawerOverlayVariants,
  navdrawerContentVariants,
  navSectionVariants,
  navSectionHeaderVariants,
  navDividerVariants,
} from "./components/navigation/layout";
export {
  PremiumNavGroup as NavGroup,
  PremiumNavItem as NavItem,
  PremiumNavItemWithSubmenu as NavItemWithSubmenu,
  PremiumNavSection as NavSection,
  PremiumSubmenuItem as SubmenuItem,
  premiumNavGroupVariants as navGroupVariants,
  indicatorAnimationVariants,
  premiumNavItemVariants as navItemVariants,
  premiumSubmenuItemVariants as submenuItemVariants,
} from "./components/navigation/items";
export type {
  NavigationProviderProps,
  NavbarProps,
  NavbarBrandProps,
  NavbarContentProps,
  NavbarActionsProps,
  NavrailProps,
  NavrailHeaderProps,
  NavrailContentProps,
  NavrailFooterProps,
  NavrailCollapseButtonProps,
  NavdrawerProps,
  NavdrawerTriggerProps,
  NavdrawerPortalProps,
  NavdrawerOverlayProps,
  NavdrawerContentProps,
  NavdrawerHeaderProps,
  NavdrawerTitleProps,
  NavdrawerFooterProps,
  NavDividerProps,
  NavBadgeProps,
} from "./components/navigation/layout";
export type {
  PremiumNavGroupProps as NavGroupProps,
  PremiumNavItemProps as NavItemProps,
  PremiumNavItemWithSubmenuProps as NavItemWithSubmenuProps,
  PremiumNavSectionProps as NavSectionProps,
  PremiumSubmenuItemProps as SubmenuItemProps,
} from "./components/navigation/items";

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  PaginationPageSizeSelector,
  ResponsivePagination,
  usePaginationRange,
  paginationVariants,
  paginationContentVariants,
  paginationItemVariants,
  paginationLinkVariants,
  paginationEllipsisVariants,
} from "./components/pagination";
export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationFirstProps,
  PaginationLastProps,
  PaginationEllipsisProps,
  PaginationPageSizeSelectorProps,
  ResponsivePaginationProps,
} from "./components/pagination";

// -----------------------------------------------------------------------------
// Progress
// -----------------------------------------------------------------------------
export {
  LinearProgress,
  CircularProgress,
  SkillBar,
  ProgressGroup,
  valueFormatters,
  useAnimatedProgress,
  linearProgressVariants,
  linearProgressBarVariants,
  circularProgressVariants,
  progressGroupGapVariants,
} from "./components/progress";
export type {
  LinearProgressProps,
  CircularProgressProps,
  SkillBarProps,
  ProgressGroupProps,
  ValueFormatter,
  LabelPosition,
  ValuePosition,
  GradientStop,
  ProgressGradient,
  CircularArcType,
  CircularLineCap,
  UseAnimatedProgressOptions,
  UseAnimatedProgressReturn,
} from "./components/progress";

// -----------------------------------------------------------------------------
// Sparkline
// -----------------------------------------------------------------------------
export {
  Sparkline,
  sparklineContainerVariants,
} from "./components/sparkline";
export type {
  SparklineProps,
  SparklineVariant,
} from "./components/sparkline";

// -----------------------------------------------------------------------------
// MiniBars
// -----------------------------------------------------------------------------
export {
  MiniBars,
  miniBarsContainerVariants,
} from "./components/mini-bars";
export type {
  MiniBarsProps,
} from "./components/mini-bars";

// -----------------------------------------------------------------------------
// Gauge
// -----------------------------------------------------------------------------
export {
  Gauge,
  gaugeVariants,
} from "./components/gauge";
export type {
  GaugeProps,
  GaugeVariant,
  GaugeSize,
  GaugeThreshold,
} from "./components/gauge";

// -----------------------------------------------------------------------------
// SegmentedProgress
// -----------------------------------------------------------------------------
export {
  SegmentedProgress,
  segmentedProgressVariants,
} from "./components/segmented-progress";
export type {
  SegmentedProgressProps,
  Segment,
} from "./components/segmented-progress";

// -----------------------------------------------------------------------------
// Flex
// -----------------------------------------------------------------------------
export {
  Flex,
  FlexItem,
  FlexRow,
  FlexCol,
  flexVariants,
  flexItemVariants,
} from "./components/flex";
export type {
  FlexProps,
  FlexItemProps,
  FlexRowProps,
  FlexColProps,
} from "./components/flex";

// -----------------------------------------------------------------------------
// Grid
// -----------------------------------------------------------------------------
export {
  Grid,
  GridItem,
  gridVariants,
  gridItemVariants,
} from "./components/grid";
export type {
  GridProps,
  GridItemProps,
} from "./components/grid";

// -----------------------------------------------------------------------------
// Toast
// -----------------------------------------------------------------------------
export {
  PremiumToastProvider as ToastProvider,
  ToastViewport,
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  premiumToast as toast,
  usePremiumToast as useToast,
  toastVariants,
  toastViewportVariants,
} from "./components/toast/api";
export type {
  ToastProps,
  ToastViewportProps,
  ToastIconProps,
  ToastPosition,
  ToastVariant,
  ToastType,
  ToastState,
  ToastActionConfig,
  ToastActionElement,
} from "./components/toast/primitives";
export type {
  PremiumToastProviderProps as ToastProviderProps,
  PremiumToastOptions as ToastOptions,
  PromiseOptions,
  PromiseMessages,
  ToastPriority,
  PromiseState,
} from "./components/toast/api";

// -----------------------------------------------------------------------------
// Stepper
// -----------------------------------------------------------------------------
export {
  PremiumStepper as Stepper,
  PremiumStepperList as StepperList,
  PremiumStepperItem as StepperItem,
  PremiumStepperTrigger as StepperTrigger,
  PremiumStepperIndicator as StepperIndicator,
  PremiumStepperLabel as StepperLabel,
  PremiumStepperConnector as StepperConnector,
  PremiumStepperContent as StepperContent,
  usePremiumStepperNavigation as useStepperNavigation,
  usePremiumStepperContext as useStepperContext,
  premiumStepperVariants as stepperVariants,
  premiumStepperListVariants as stepperListVariants,
  premiumStepperItemVariants as stepperItemVariants,
  premiumStepperTriggerVariants as stepperTriggerVariants,
  premiumStepperIndicatorVariants as stepperIndicatorVariants,
  premiumStepperLabelVariants as stepperLabelVariants,
  premiumStepperLabelTitleVariants as stepperLabelTitleVariants,
  premiumStepperLabelDescriptionVariants as stepperLabelDescriptionVariants,
  premiumStepperConnectorVariants as stepperConnectorVariants,
  premiumStepperContentVariants as stepperContentVariants,
} from "./components/stepper";
export type {
  PremiumStepperProps as StepperProps,
  PremiumStepperListProps as StepperListProps,
  PremiumStepperItemProps as StepperItemProps,
  PremiumStepperTriggerProps as StepperTriggerProps,
  PremiumStepperIndicatorProps as StepperIndicatorProps,
  PremiumStepperLabelProps as StepperLabelProps,
  PremiumStepperConnectorProps as StepperConnectorProps,
  PremiumStepperContentProps as StepperContentProps,
} from "./components/stepper";

// =============================================================================
// ADVANCED COMPONENTS
// Components with richer interactions, larger APIs, or extra dependencies.
// =============================================================================

// -----------------------------------------------------------------------------
// FAB (Floating Action Button)
// -----------------------------------------------------------------------------
export { FAB, fabVariants } from "./components/fab";
export type { FABProps } from "./components/fab";
export { ExtendedFAB, extendedFabVariants } from "./components/fab/extended-fab";
export type { ExtendedFABProps } from "./components/fab/extended-fab";
export { FABMenu, fabMenuItemVariants } from "./components/fab/fab-menu";
export type { FABMenuProps, FABMenuItem } from "./components/fab/fab-menu";

// -----------------------------------------------------------------------------
// Slider
// -----------------------------------------------------------------------------
export {
  PremiumSlider as Slider,
  premiumSliderVariants as sliderVariants,
  premiumSliderTrackVariants as sliderTrackVariants,
  premiumSliderRangeVariants as sliderRangeVariants,
  premiumSliderThumbVariants as sliderThumbVariants,
  SliderThumbCircularVariants,
  sliderThumbCircularStateLayerVariants,
  sliderThumbKnoblessVariants,
  valueIndicatorVariants,
  stopIndicatorVariants,
  insetIconVariants,
} from "./components/slider/advanced";
export type { PremiumSliderProps as SliderProps } from "./components/slider/advanced";
export {
  Slider as BasicSlider,
  sliderVariants as basicSliderVariants,
  sliderTrackVariants as basicSliderTrackVariants,
  sliderRangeVariants as basicSliderRangeVariants,
  sliderThumbVariants as basicSliderThumbVariants,
  getGapSize,
} from "./components/slider/basic";
export type { SliderProps as BasicSliderProps } from "./components/slider/basic";

// -----------------------------------------------------------------------------
// ComboBox
// -----------------------------------------------------------------------------
export {
  ComboBox,
  OutlinedComboBox,
  ComboBoxLabel,
  ComboBoxDescription,
  ComboBoxField,
  comboboxInputVariants,
  comboboxButtonVariants,
  comboboxOutlinedContainerVariants,
  comboboxFloatingLabelVariants,
  comboboxOptionsVariants,
  comboboxOptionVariants,
} from "./components/combobox";
export type {
  ComboBoxProps,
  OutlinedComboBoxProps,
  ComboBoxOption,
} from "./components/combobox";

// -----------------------------------------------------------------------------
// Carousel
// -----------------------------------------------------------------------------
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
  CarouselProgress,
  CarouselCounter,
  useCarousel,
  carouselVariants,
  carouselContentVariants,
  carouselItemVariants,
  carouselIndicatorVariants,
} from "./components/carousel";
export type {
  CarouselApi,
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselPreviousProps,
  CarouselNextProps,
  CarouselIndicatorsProps,
  CarouselProgressProps,
  CarouselCounterProps,
} from "./components/carousel";

// -----------------------------------------------------------------------------
// DatePicker
// -----------------------------------------------------------------------------
export {
  DatePicker,
  Calendar,
  YearSelector,
  Presets,
  useDatePickerContext,
  datePickerTriggerVariants,
  datePickerContentVariants,
} from "./components/date-picker";
export type {
  DatePickerProps,
  DatePickerMode,
} from "./components/date-picker";

// -----------------------------------------------------------------------------
// TimePicker
// -----------------------------------------------------------------------------
export {
  TimePicker,
  InlineTimePicker,
  timePickerTriggerVariants,
  timeColumnVariants,
  timeItemVariants,
} from "./components/time-picker";
export type {
  TimePickerProps,
  InlineTimePickerProps,
} from "./components/time-picker";

// -----------------------------------------------------------------------------
// DateTimePicker
// -----------------------------------------------------------------------------
export {
  DateTimePicker,
  dateTimePickerTriggerVariants,
} from "./components/date-time-picker";
export type {
  DateTimePickerProps,
} from "./components/date-time-picker";

// -----------------------------------------------------------------------------
// MultiSelect
// -----------------------------------------------------------------------------
export {
  MultiSelect,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
  useMultiSelectContext,
  multiSelectVariants,
  multiSelectTriggerVariants,
  multiSelectContentVariants,
  multiSelectItemVariants,
  multiSelectGroupVariants,
  multiSelectLabelVariants,
  multiSelectSearchInputVariants,
} from "./components/multi-select";
export type {
  MultiSelectProps,
  MultiSelectOption,
  MultiSelectGroupProps,
  MultiSelectItemProps,
} from "./components/multi-select";

// -----------------------------------------------------------------------------
// DataTable
// -----------------------------------------------------------------------------
export {
  DataTable,
  DataTableColumnHeader,
  DataTableToolbar,
  DataTablePagination,
  DataTableRowActions,
  dataTableSurfaceVariants,
} from "./components/data-table";
export type {
  DataTableProps,
  DataTableRowAction,
  DataTableSize,
  DataTableVariant,
} from "./components/data-table";

// -----------------------------------------------------------------------------
// ScrollArea
// -----------------------------------------------------------------------------
export {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
  scrollAreaVariants,
  scrollBarVariants,
  scrollBarThumbVariants,
  loadingContainerVariants,
  useScrollAreaContext,
} from "./components/scroll-area";
export type {
  ScrollAreaProps,
  ScrollBarProps,
  ScrollBarOrientation,
  ScrollBarVisibility,
  InfiniteScrollMode,
} from "./components/scroll-area";

// =============================================================================
// PREMIUM TEMPLATES
// Full page layouts and templates for common application patterns.
// =============================================================================

// (No templates implemented yet)
