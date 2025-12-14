// @aidan/ui - Shared Design System
// Export all components from this file

// =============================================================================
// Utilities
// =============================================================================

export { cn } from "./lib/utils";

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

export { ButtonGroup, buttonGroupVariants } from "./components/free/button/button-group";
export type { ButtonGroupProps } from "./components/free/button/button-group";

export {
  ConnectedButtonGroup,
  ConnectedButtonGroupItem,
  connectedButtonGroupVariants,
  connectedButtonGroupItemVariants,
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
// Slider
// -----------------------------------------------------------------------------
export {
  Slider,
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
  SliderThumbCircularVariants,
  sliderThumbCircularStateLayerVariants,
  sliderThumbKnoblessVariants,
  valueIndicatorVariants,
  stopIndicatorVariants,
  insetIconVariants,
} from "./components/premium/slider";
export type { SliderProps } from "./components/premium/slider";

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

// =============================================================================
// PREMIUM TEMPLATES
// Full page layouts and templates for common application patterns.
// =============================================================================

// (No templates implemented yet)
