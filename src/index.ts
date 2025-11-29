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
