// @aidan/ui - Shared Design System
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

// =============================================================================
// FREE TIER COMPONENTS
// Core primitives that form the foundation of any application.
// =============================================================================

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
} from "./components/free/accordion";
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  ChevronAnimationPreset,
} from "./components/free/accordion";

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
} from "./components/free/alert";
export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
  AlertActionProps,
  AlertVariant,
} from "./components/free/alert";

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
} from "./components/free/alert-dialog";
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
} from "./components/free/alert-dialog";

// -----------------------------------------------------------------------------
// AnimatedChevron
// -----------------------------------------------------------------------------
export {
  AnimatedChevron,
  animatedChevronVariants,
} from "./components/free/animated-chevron";
export type {
  AnimatedChevronProps,
  ChevronAnimationPreset as AnimatedChevronAnimationPreset,
  ChevronDirection,
} from "./components/free/animated-chevron";

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
} from "./components/free/avatar";
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarBadgeProps,
  AnimatedAvatarProps,
} from "./components/free/avatar";

// -----------------------------------------------------------------------------
// Badge
// -----------------------------------------------------------------------------
export { Badge, BadgeAnchor, AnimatedBadge, badgeVariants } from "./components/free/badge";
export type { BadgeProps, BadgeAnchorProps, AnimatedBadgeProps } from "./components/free/badge";

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
} from "./components/free/breadcrumb";
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
} from "./components/free/breadcrumb";

// -----------------------------------------------------------------------------
// Button Components
// -----------------------------------------------------------------------------
export { Button, buttonVariants } from "./components/free/button";
export type { ButtonProps } from "./components/free/button";

export { IconButton, iconButtonVariants } from "./components/free/button/icon-button";
export type { IconButtonProps } from "./components/free/button/icon-button";

export { ToggleButton, toggleButtonVariants } from "./components/free/button/toggle-button";
export type { ToggleButtonProps } from "./components/free/button/toggle-button";

export { ToggleIconButton, toggleIconButtonVariants } from "./components/free/button/toggle-icon-button";
export type { ToggleIconButtonProps } from "./components/free/button/toggle-icon-button";

export {
  SplitButton,
  splitButtonVariants,
  splitButtonActionVariants,
  splitButtonTriggerVariants,
  chevronVariants,
} from "./components/free/button/split-button";
export type { SplitButtonProps } from "./components/free/button/split-button";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants, buttonGroupSeparatorVariants } from "./components/free/button/button-group";
export type { ButtonGroupProps, ButtonGroupSeparatorProps, ButtonGroupTextProps } from "./components/free/button/button-group";

export {
  ConnectedButtonGroup,
  ConnectedButtonGroupItem,
  connectedButtonGroupVariants,
  connectedButtonGroupItemVariants,
  useConnectedButtonGroup,
} from "./components/free/button/connected-button-group";
export type {
  ConnectedButtonGroupProps,
  ConnectedButtonGroupItemProps,
} from "./components/free/button/connected-button-group";

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
} from "./components/free/card";
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
} from "./components/free/card";

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
} from "./components/free/chip";
export type {
  ChipProps,
  ChipGroupProps,
} from "./components/free/chip";

// -----------------------------------------------------------------------------
// Checkbox
// -----------------------------------------------------------------------------
export { Checkbox, checkboxVariants } from "./components/free/checkbox";
export type { CheckboxProps } from "./components/free/checkbox";

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
} from "./components/free/dialog";
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
} from "./components/free/dialog";

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
} from "./components/free/input";
export type {
  InputProps,
  OutlinedInputProps,
} from "./components/free/input";

// -----------------------------------------------------------------------------
// InputIncrementor
// -----------------------------------------------------------------------------
export {
  InputIncrementor,
  inputIncrementorContainerVariants,
  inputIncrementorInputVariants,
  inputIncrementorButtonVariants,
} from "./components/free/input-incrementor";
export type { InputIncrementorProps } from "./components/free/input-incrementor";

// -----------------------------------------------------------------------------
// Radio
// -----------------------------------------------------------------------------
export {
  RadioGroup,
  RadioGroupItem,
  radioGroupVariants,
  radioGroupItemVariants,
  radioIndicatorVariants,
} from "./components/free/radio";
export type {
  RadioGroupProps,
  RadioGroupItemProps,
} from "./components/free/radio";

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
} from "./components/free/select";
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
} from "./components/free/select";

// -----------------------------------------------------------------------------
// Spinner
// -----------------------------------------------------------------------------
export { Spinner, spinnerVariants } from "./components/free/spinner";
export type { SpinnerProps } from "./components/free/spinner";

// -----------------------------------------------------------------------------
// Separator
// -----------------------------------------------------------------------------
export { Separator, separatorVariants } from "./components/free/separator";
export type { SeparatorProps } from "./components/free/separator";

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
} from "./components/free/skeleton";
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCardProps,
  SkeletonAvatarProps,
  SkeletonButtonProps,
  SkeletonInputProps,
} from "./components/free/skeleton";

// -----------------------------------------------------------------------------
// Switch
// -----------------------------------------------------------------------------
export { Switch, switchTrackVariants, switchThumbVariants } from "./components/free/switch";
export type { SwitchProps } from "./components/free/switch";

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
} from "./components/free/tabs";
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "./components/free/tabs";

// -----------------------------------------------------------------------------
// Textarea
// -----------------------------------------------------------------------------
export {
  Textarea,
  TextareaWithCounter,
  textareaVariants,
  textareaContainerVariants,
} from "./components/free/textarea";
export type {
  TextareaProps,
  TextareaWithCounterProps,
} from "./components/free/textarea";

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
} from "./components/free/tooltip";
export type {
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "./components/free/tooltip";

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
} from "./components/free/popover";
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverAnchorProps,
} from "./components/free/popover";

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
} from "./components/free/hover-card";
export type {
  HoverCardProps,
  HoverCardTriggerProps,
  HoverCardContentProps,
  HoverCardArrowProps,
  HoverCardCloseProps,
} from "./components/free/hover-card";

// -----------------------------------------------------------------------------
// Sheet / Drawer
// -----------------------------------------------------------------------------
export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Drawer,
  sheetOverlayVariants,
  sheetContentVariants,
  sheetHeaderVariants,
  sheetFooterVariants,
  sheetTitleVariants,
  sheetDescriptionVariants,
  sheetHandleVariants,
} from "./components/free/sheet";
export type {
  SheetProps,
  SheetTriggerProps,
  SheetPortalProps,
  SheetOverlayProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
  DrawerProps,
} from "./components/free/sheet";

// -----------------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------------
export {
  Container,
  containerVariants,
} from "./components/free/container";
export type {
  ContainerProps,
} from "./components/free/container";

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
} from "./components/free/context-menu";
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
} from "./components/free/context-menu";

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
} from "./components/free/dropdown-menu";
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
} from "./components/free/dropdown-menu";

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
} from "./components/free/table";
export type { TableProps } from "./components/free/table";

// -----------------------------------------------------------------------------
// Navigation (Navbar, Navrail, Navdrawer)
// -----------------------------------------------------------------------------
export {
  // Context & Provider
  NavigationProvider,
  useNavigation,
  useNavigationOptional,
  // Navbar
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  // Navrail
  Navrail,
  NavrailHeader,
  NavrailContent,
  NavrailFooter,
  NavrailCollapseButton,
  // Navdrawer
  Navdrawer,
  NavdrawerTrigger,
  NavdrawerPortal,
  NavdrawerOverlay,
  NavdrawerContent,
  NavdrawerHeader,
  NavdrawerTitle,
  NavdrawerFooter,
  NavdrawerClose,
  // Shared Components
  NavItem,
  NavSection,
  NavDivider,
  NavBadge,
  // Variants
  navbarVariants,
  navrailVariants,
  navdrawerOverlayVariants,
  navdrawerContentVariants,
  navItemVariants,
  navSectionVariants,
  navSectionHeaderVariants,
  navDividerVariants,
} from "./components/free/navigation";
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
  NavItemProps,
  NavSectionProps,
  NavDividerProps,
  NavBadgeProps,
} from "./components/free/navigation";

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
} from "./components/free/pagination";
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
} from "./components/free/pagination";

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
} from "./components/free/progress";
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
} from "./components/free/progress";

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
} from "./components/free/flex";
export type {
  FlexProps,
  FlexItemProps,
  FlexRowProps,
  FlexColProps,
} from "./components/free/flex";

// -----------------------------------------------------------------------------
// Grid
// -----------------------------------------------------------------------------
export {
  Grid,
  GridItem,
  gridVariants,
  gridItemVariants,
} from "./components/free/grid";
export type {
  GridProps,
  GridItemProps,
} from "./components/free/grid";

// -----------------------------------------------------------------------------
// Toast
// -----------------------------------------------------------------------------
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toast,
  useToast,
  toastVariants,
  toastViewportVariants,
} from "./components/free/toast";
export type {
  ToastProps,
  ToastViewportProps,
  ToastIconProps,
  ToastProviderProps,
  ToastPosition,
  ToastVariant,
  ToastType,
  ToastOptions,
  ToastState,
  ToastActionConfig,
  ToastActionElement,
  UseToastReturn,
} from "./components/free/toast";

// -----------------------------------------------------------------------------
// Stepper
// -----------------------------------------------------------------------------
export {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperLabel,
  StepperSeparator,
  StepperContent,
  StepperNavigation,
  useStepperNavigation,
  useStepperContext,
  stepperVariants,
  stepperListVariants,
  stepperItemVariants,
  stepperTriggerVariants,
  stepperIndicatorVariants,
  stepperLabelVariants,
  stepperLabelTitleVariants,
  stepperLabelDescriptionVariants,
  stepperSeparatorVariants,
  stepperContentVariants,
} from "./components/free/stepper";
export type {
  StepperProps,
  StepperListProps,
  StepperItemProps,
  StepperTriggerProps,
  StepperIndicatorProps,
  StepperLabelProps,
  StepperSeparatorProps,
  StepperContentProps,
  StepperNavigationProps,
} from "./components/free/stepper";

// =============================================================================
// PREMIUM TIER COMPONENTS
// Advanced components with complex interactions, state management, or
// third-party dependencies.
// =============================================================================

// -----------------------------------------------------------------------------
// FAB (Floating Action Button)
// -----------------------------------------------------------------------------
export { FAB, fabVariants } from "./components/premium/fab";
export type { FABProps } from "./components/premium/fab";
export { ExtendedFAB, extendedFabVariants } from "./components/premium/fab/extended-fab";
export type { ExtendedFABProps } from "./components/premium/fab/extended-fab";
export { FABMenu, fabMenuItemVariants } from "./components/premium/fab/fab-menu";
export type { FABMenuProps, FABMenuItem } from "./components/premium/fab/fab-menu";

// -----------------------------------------------------------------------------
// Premium Toast
// -----------------------------------------------------------------------------
export {
  PremiumToastProvider,
  usePremiumToast,
  premiumToast,
} from "./components/premium/toast";
export type {
  PremiumToastOptions,
  PromiseOptions,
  PromiseMessages,
  ToastPriority,
  PromiseState,
} from "./components/premium/toast";

// -----------------------------------------------------------------------------
// Slider (Free Tier)
// -----------------------------------------------------------------------------
export {
  Slider as FreeSlider,
  sliderVariants as freeSliderVariants,
  sliderTrackVariants as freeSliderTrackVariants,
  sliderRangeVariants as freeSliderRangeVariants,
  sliderThumbVariants as freeSliderThumbVariants,
} from "./components/free/slider";
export type { SliderProps as FreeSliderProps } from "./components/free/slider";

// -----------------------------------------------------------------------------
// Slider (Premium Tier)
// -----------------------------------------------------------------------------
export {
  // Premium Slider component
  PremiumSlider,
  // Premium-specific variants
  premiumSliderVariants,
  premiumSliderTrackVariants,
  premiumSliderRangeVariants,
  premiumSliderThumbVariants,
  SliderThumbCircularVariants,
  sliderThumbCircularStateLayerVariants,
  sliderThumbKnoblessVariants,
  valueIndicatorVariants,
  stopIndicatorVariants,
  insetIconVariants,
  // Backward compatibility aliases
  Slider,
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
} from "./components/premium/slider";
export type { PremiumSliderProps, SliderProps } from "./components/premium/slider";

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
} from "./components/premium/combobox";
export type {
  ComboBoxProps,
  OutlinedComboBoxProps,
  ComboBoxOption,
} from "./components/premium/combobox";

// -----------------------------------------------------------------------------
// Premium Sheet
// -----------------------------------------------------------------------------
export {
  PremiumSheet,
  PremiumSheetTrigger,
  PremiumSheetPortal,
  PremiumSheetContent,
  PremiumSheetHeader,
  PremiumSheetFooter,
  PremiumSheetTitle,
  PremiumSheetDescription,
  PremiumSheetClose,
  premiumSheetOverlayVariants,
  premiumSheetContentVariants,
  premiumSheetHeaderVariants,
  premiumSheetFooterVariants,
  premiumSheetTitleVariants,
  premiumSheetDescriptionVariants,
  premiumSheetCloseVariants,
  premiumSheetHandleVariants,
  animationPresets,
} from "./components/premium/sheet";
export type {
  PremiumSheetProps,
  PremiumSheetTriggerProps,
  PremiumSheetPortalProps,
  PremiumSheetOverlayProps,
  PremiumSheetContentProps,
  PremiumSheetHeaderProps,
  PremiumSheetFooterProps,
  PremiumSheetTitleProps,
  PremiumSheetDescriptionProps,
  PremiumSheetCloseProps,
  SheetPosition,
  SheetSize,
  AnimationType,
  SpringConfigOptions,
  GestureSensitivity,
} from "./components/premium/sheet";

// -----------------------------------------------------------------------------
// Premium Stepper
// -----------------------------------------------------------------------------
export {
  PremiumStepper,
  PremiumStepperList,
  PremiumStepperItem,
  PremiumStepperTrigger,
  PremiumStepperIndicator,
  PremiumStepperLabel,
  PremiumStepperConnector,
  PremiumStepperContent,
  usePremiumStepperNavigation,
  usePremiumStepperContext,
  premiumStepperVariants,
  premiumStepperListVariants,
  premiumStepperItemVariants,
  premiumStepperTriggerVariants,
  premiumStepperIndicatorVariants,
  premiumStepperLabelVariants,
  premiumStepperLabelTitleVariants,
  premiumStepperLabelDescriptionVariants,
  premiumStepperConnectorVariants,
  premiumStepperContentVariants,
} from "./components/premium/stepper";
export type {
  PremiumStepperProps,
  PremiumStepperListProps,
  PremiumStepperItemProps,
  PremiumStepperTriggerProps,
  PremiumStepperIndicatorProps,
  PremiumStepperLabelProps,
  PremiumStepperConnectorProps,
  PremiumStepperContentProps,
} from "./components/premium/stepper";

// -----------------------------------------------------------------------------
// Premium Navigation
// -----------------------------------------------------------------------------
export {
  PremiumNavGroup,
  PremiumNavItem,
  PremiumNavItemWithSubmenu,
  PremiumNavSection,
  PremiumSubmenuItem,
  premiumNavGroupVariants,
  indicatorAnimationVariants,
  premiumNavItemVariants,
  premiumSubmenuItemVariants,
} from "./components/premium/navigation";
export type {
  PremiumNavGroupProps,
  PremiumNavItemProps,
  PremiumNavItemWithSubmenuProps,
  PremiumNavSectionProps,
  PremiumSubmenuItemProps,
} from "./components/premium/navigation";

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
} from "./components/premium/carousel";
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
} from "./components/premium/carousel";

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
} from "./components/premium/date-picker";
export type {
  DatePickerProps,
  DatePickerMode,
} from "./components/premium/date-picker";

// -----------------------------------------------------------------------------
// TimePicker
// -----------------------------------------------------------------------------
export {
  TimePicker,
  InlineTimePicker,
  timePickerTriggerVariants,
  timeColumnVariants,
  timeItemVariants,
} from "./components/premium/time-picker";
export type {
  TimePickerProps,
  InlineTimePickerProps,
} from "./components/premium/time-picker";

// -----------------------------------------------------------------------------
// DateTimePicker
// -----------------------------------------------------------------------------
export {
  DateTimePicker,
  dateTimePickerTriggerVariants,
} from "./components/premium/date-time-picker";
export type {
  DateTimePickerProps,
} from "./components/premium/date-time-picker";

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
} from "./components/premium/multi-select";
export type {
  MultiSelectProps,
  MultiSelectOption,
  MultiSelectGroupProps,
  MultiSelectItemProps,
} from "./components/premium/multi-select";

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
} from "./components/premium/data-table";
export type {
  DataTableProps,
  DataTableRowAction,
  DataTableSize,
  DataTableVariant,
} from "./components/premium/data-table";

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
} from "./components/premium/scroll-area";
export type {
  ScrollAreaProps,
  ScrollBarProps,
  ScrollBarOrientation,
  ScrollBarVisibility,
  InfiniteScrollMode,
} from "./components/premium/scroll-area";

// =============================================================================
// PREMIUM TEMPLATES
// Full page layouts and templates for common application patterns.
// =============================================================================

// (No templates implemented yet)
