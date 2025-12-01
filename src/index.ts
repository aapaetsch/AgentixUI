// @aidan/ui - Shared Design System
// Export all components from this file

// Utilities
export { cn } from "./lib/utils";

// Button Components
export { Button, buttonVariants } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { IconButton, iconButtonVariants } from "./components/Button/IconButton";
export type { IconButtonProps } from "./components/Button/IconButton";

export { ToggleButton, toggleButtonVariants } from "./components/Button/ToggleButton";
export type { ToggleButtonProps } from "./components/Button/ToggleButton";

export { ToggleIconButton, toggleIconButtonVariants } from "./components/Button/ToggleIconButton";
export type { ToggleIconButtonProps } from "./components/Button/ToggleIconButton";

export {
  SplitButton,
  splitButtonVariants,
  splitButtonActionVariants,
  splitButtonTriggerVariants,
  chevronVariants,
} from "./components/Button/SplitButton";
export type { SplitButtonProps } from "./components/Button/SplitButton";

export { ButtonGroup, buttonGroupVariants } from "./components/Button/ButtonGroup";
export type { ButtonGroupProps } from "./components/Button/ButtonGroup";

export {
  ConnectedButtonGroup,
  ConnectedButtonGroupItem,
  connectedButtonGroupVariants,
  connectedButtonGroupItemVariants,
} from "./components/Button/ConnectedButtonGroup";
export type {
  ConnectedButtonGroupProps,
  ConnectedButtonGroupItemProps,
} from "./components/Button/ConnectedButtonGroup";

// FAB Components
export { FAB, fabVariants } from "./components/FAB";
export type { FABProps } from "./components/FAB";
export { ExtendedFAB, extendedFabVariants } from "./components/FAB/ExtendedFAB";
export type { ExtendedFABProps } from "./components/FAB/ExtendedFAB";
export { FABMenu, fabMenuItemVariants } from "./components/FAB/FABMenu";
export type { FABMenuProps, FABMenuItem } from "./components/FAB/FABMenu";

// Spinner
export { Spinner, spinnerVariants } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";

// Checkbox
export { Checkbox, checkboxVariants } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

// Switch
export { Switch, switchTrackVariants, switchThumbVariants } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";

// Badge
export { Badge, BadgeAnchor, AnimatedBadge, badgeVariants } from "./components/Badge";
export type { BadgeProps, BadgeAnchorProps, AnimatedBadgeProps } from "./components/Badge";

// Accordion
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
} from "./components/Accordion";
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  ChevronAnimationPreset,
} from "./components/Accordion";

// AnimatedChevron
export {
  AnimatedChevron,
  animatedChevronVariants,
} from "./components/AnimatedChevron";
export type {
  AnimatedChevronProps,
  ChevronAnimationPreset as AnimatedChevronAnimationPreset,
  ChevronDirection,
} from "./components/AnimatedChevron";

// Select
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
} from "./components/Select";
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
} from "./components/Select";

// Avatar
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
} from "./components/Avatar";
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarBadgeProps,
  AnimatedAvatarProps,
} from "./components/Avatar";

// Textarea
export {
  Textarea,
  TextareaWithCounter,
  textareaVariants,
  textareaContainerVariants,
} from "./components/Textarea";
export type {
  TextareaProps,
  TextareaWithCounterProps,
} from "./components/Textarea";

// Input
export {
  Input,
  OutlinedInput,
  inputVariants,
  inputContainerVariants,
  outlinedContainerVariants,
  floatingLabelVariants,
} from "./components/Input";
export type {
  InputProps,
  OutlinedInputProps,
} from "./components/Input";

// Radio
export {
  RadioGroup,
  RadioGroupItem,
  radioGroupVariants,
  radioGroupItemVariants,
  radioIndicatorVariants,
} from "./components/Radio";
export type {
  RadioGroupProps,
  RadioGroupItemProps,
} from "./components/Radio";

// Tabs
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} from "./components/Tabs";
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "./components/Tabs";

// Tooltip
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
  tooltipContentVariants,
  tooltipArrowVariants,
} from "./components/Tooltip";
export type {
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "./components/Tooltip";

// Card
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
} from "./components/Card";
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
} from "./components/Card";
