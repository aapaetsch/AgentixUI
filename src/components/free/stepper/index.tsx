"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Circle, AlertCircle } from "lucide-react";

import { cn } from "../../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Stepper Context
 * -----------------------------------------------------------------------------------------------*/

interface StepData {
  value: string;
  disabled?: boolean;
  optional?: boolean;
  completed?: boolean;
  error?: boolean;
}

interface StepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  linear: boolean;
  orientation: "horizontal";
  variant: "default" | "outlined" | "simple";
  size: "sm" | "md" | "lg";
  steps: Map<string, StepData>;
  stepOrder: string[];
  registerStep: (value: string, data: StepData) => void;
  unregisterStep: (value: string) => void;
  getStepIndex: (value: string) => number;
  isStepCompleted: (index: number) => boolean;
  isStepActive: (index: number) => boolean;
  isStepDisabled: (index: number) => boolean;
  canNavigateTo: (index: number) => boolean;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("Stepper components must be used within a <Stepper>");
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * StepperItem Context (for nested components)
 * -----------------------------------------------------------------------------------------------*/

interface StepperItemContextValue {
  value: string;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  hasError: boolean;
  isOptional: boolean;
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(null);

function useStepperItemContext() {
  const context = React.useContext(StepperItemContext);
  if (!context) {
    throw new Error("StepperItem components must be used within a <StepperItem>");
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Stepper Root
 * -----------------------------------------------------------------------------------------------*/

const stepperVariants = cva("flex w-full", {
  variants: {
    orientation: {
      horizontal: "flex-col",
    },
    size: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
});

export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  /**
   * The current active step (0-indexed). Use for controlled mode.
   */
  activeStep?: number;
  /**
   * The default active step for uncontrolled mode.
   * @default 0
   */
  defaultActiveStep?: number;
  /**
   * Callback when the active step changes.
   */
  onStepChange?: (step: number) => void;
  /**
   * Whether steps must be completed in order.
   * @default true
   */
  linear?: boolean;
  /**
   * Visual variant of the stepper.
   * @default "default"
   */
  variant?: "default" | "outlined" | "simple";
  /**
   * Size of the stepper.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

/**
 * Stepper - Root component for multi-step workflows
 *
 * @example
 * ```tsx
 * <Stepper defaultActiveStep={0}>
 *   <StepperList>
 *     <StepperItem value="step1">
 *       <StepperTrigger>
 *         <StepperIndicator />
 *         <StepperLabel>Step 1</StepperLabel>
 *       </StepperTrigger>
 *     </StepperItem>
 *     <StepperSeparator />
 *     <StepperItem value="step2">
 *       <StepperTrigger>
 *         <StepperIndicator />
 *         <StepperLabel>Step 2</StepperLabel>
 *       </StepperTrigger>
 *     </StepperItem>
 *   </StepperList>
 *   <StepperContent value="step1">Content 1</StepperContent>
 *   <StepperContent value="step2">Content 2</StepperContent>
 * </Stepper>
 * ```
 */
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      activeStep: controlledActiveStep,
      defaultActiveStep = 0,
      onStepChange,
      linear = true,
      orientation = "horizontal",
      variant = "default",
      size = "md",
      children,
      ...props
    },
    ref
  ) => {
    const [internalActiveStep, setInternalActiveStep] = React.useState(defaultActiveStep);
    const [steps] = React.useState<Map<string, StepData>>(() => new Map());
    const [stepOrder, setStepOrder] = React.useState<string[]>([]);

    const isControlled = controlledActiveStep !== undefined;
    const activeStep = isControlled ? controlledActiveStep : internalActiveStep;

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (!isControlled) {
          setInternalActiveStep(step);
        }
        onStepChange?.(step);
      },
      [isControlled, onStepChange]
    );

    const registerStep = React.useCallback((value: string, data: StepData) => {
      steps.set(value, data);
      setStepOrder((prev) => {
        if (!prev.includes(value)) {
          return [...prev, value];
        }
        return prev;
      });
    }, [steps]);

    const unregisterStep = React.useCallback((value: string) => {
      steps.delete(value);
      setStepOrder((prev) => prev.filter((v) => v !== value));
    }, [steps]);

    const getStepIndex = React.useCallback(
      (value: string) => stepOrder.indexOf(value),
      [stepOrder]
    );

    const isStepCompleted = React.useCallback(
      (index: number) => {
        const value = stepOrder[index];
        if (!value) return false;
        const stepData = steps.get(value);
        if (stepData?.completed !== undefined) {
          return stepData.completed;
        }
        return index < activeStep;
      },
      [activeStep, stepOrder, steps]
    );

    const isStepActive = React.useCallback(
      (index: number) => index === activeStep,
      [activeStep]
    );

    const isStepDisabled = React.useCallback(
      (index: number) => {
        const value = stepOrder[index];
        if (!value) return true;
        const stepData = steps.get(value);
        return stepData?.disabled ?? false;
      },
      [stepOrder, steps]
    );

    const canNavigateTo = React.useCallback(
      (index: number) => {
        if (!linear) return !isStepDisabled(index);
        // In linear mode, can only go to completed steps or the next uncompleted step
        if (isStepDisabled(index)) return false;
        if (index <= activeStep) return true;
        // Can go to next step if current step is not in error
        return index === activeStep + 1;
      },
      [linear, activeStep, isStepDisabled]
    );

    const contextValue = React.useMemo<StepperContextValue>(
      () => ({
        activeStep,
        setActiveStep,
        linear,
        orientation: orientation ?? "horizontal",
        variant: variant ?? "default",
        size: size ?? "md",
        steps,
        stepOrder,
        registerStep,
        unregisterStep,
        getStepIndex,
        isStepCompleted,
        isStepActive,
        isStepDisabled,
        canNavigateTo,
      }),
      [
        activeStep,
        setActiveStep,
        linear,
        orientation,
        variant,
        size,
        steps,
        stepOrder,
        registerStep,
        unregisterStep,
        getStepIndex,
        isStepCompleted,
        isStepActive,
        isStepDisabled,
        canNavigateTo,
      ]
    );

    return (
      <StepperContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="stepper"
          className={cn(stepperVariants({ orientation, size }), className)}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = "Stepper";

/* -------------------------------------------------------------------------------------------------
 * StepperList
 * -----------------------------------------------------------------------------------------------*/

const stepperListVariants = cva(
  [
    "flex items-center",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "flex-row w-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

export interface StepperListProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * StepperList - Container for step triggers
 */
const StepperList = React.forwardRef<HTMLDivElement, StepperListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useStepperContext();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        data-slot="stepper-list"
        className={cn(stepperListVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StepperList.displayName = "StepperList";

/* -------------------------------------------------------------------------------------------------
 * StepperItem
 * -----------------------------------------------------------------------------------------------*/

const stepperItemVariants = cva("flex items-center", {
  variants: {
    orientation: {
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Unique identifier for this step.
   */
  value: string;
  /**
   * Whether this step is disabled.
   */
  disabled?: boolean;
  /**
   * Whether this step is optional.
   */
  optional?: boolean;
  /**
   * Override the completion state.
   */
  completed?: boolean;
  /**
   * Whether this step has an error.
   */
  error?: boolean;
}

/**
 * StepperItem - Individual step container
 */
const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    { className, value, disabled, optional, completed, error, children, ...props },
    ref
  ) => {
    const context = useStepperContext();
    const { registerStep, unregisterStep, getStepIndex, isStepActive, isStepCompleted, isStepDisabled, orientation } = context;

    // Register this step
    React.useEffect(() => {
      registerStep(value, { value, disabled, optional, completed, error });
      return () => unregisterStep(value);
    }, [value, disabled, optional, completed, error, registerStep, unregisterStep]);

    const index = getStepIndex(value);
    const isActive = isStepActive(index);
    const isCompletedStep = completed ?? isStepCompleted(index);
    const isDisabledStep = disabled ?? isStepDisabled(index);

    const itemContextValue = React.useMemo<StepperItemContextValue>(
      () => ({
        value,
        index,
        isActive,
        isCompleted: isCompletedStep,
        isDisabled: isDisabledStep,
        hasError: error ?? false,
        isOptional: optional ?? false,
      }),
      [value, index, isActive, isCompletedStep, isDisabledStep, error, optional]
    );

    return (
      <StepperItemContext.Provider value={itemContextValue}>
        <div
          ref={ref}
          data-slot="stepper-item"
          data-state={isActive ? "active" : isCompletedStep ? "completed" : "inactive"}
          data-disabled={isDisabledStep ? "" : undefined}
          className={cn(stepperItemVariants({ orientation }), className)}
          {...props}
        >
          {children}
        </div>
      </StepperItemContext.Provider>
    );
  }
);
StepperItem.displayName = "StepperItem";

/* -------------------------------------------------------------------------------------------------
 * StepperTrigger
 * -----------------------------------------------------------------------------------------------*/

const stepperTriggerVariants = cva(
  [
    "inline-flex items-center gap-2",
    "cursor-pointer select-none",
    "outline-none",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Focus state
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Hover state
    "hover:opacity-80",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Use the Radix Slot pattern for custom trigger elements.
   */
  asChild?: boolean;
}

/**
 * StepperTrigger - Clickable step header
 */
const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ className, asChild, children, onClick, ...props }, ref) => {
    const { setActiveStep, canNavigateTo, size } = useStepperContext();
    const { index, isActive, isDisabled } = useStepperItemContext();

    const Comp = asChild ? Slot : "button";

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled && canNavigateTo(index)) {
        setActiveStep(index);
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!isDisabled && canNavigateTo(index)) {
          setActiveStep(index);
        }
      }
    };

    return (
      <Comp
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        data-slot="stepper-trigger"
        data-state={isActive ? "active" : "inactive"}
        disabled={isDisabled}
        className={cn(stepperTriggerVariants({ size }), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
StepperTrigger.displayName = "StepperTrigger";

/* -------------------------------------------------------------------------------------------------
 * StepperIndicator
 * -----------------------------------------------------------------------------------------------*/

const stepperIndicatorVariants = cva(
  [
    "inline-flex items-center justify-center",
    "shrink-0",
    "rounded-full",
    "font-medium",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          // Default: filled circle
          "bg-muted text-muted-foreground",
          // Active state
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
          // Completed state
          "data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
          // Error state
          "data-[error]:bg-destructive data-[error]:text-destructive-foreground",
        ].join(" "),
        outlined: [
          // Outlined: border circle
          "border-2 border-muted-foreground/50 text-muted-foreground bg-transparent",
          // Active state
          "data-[state=active]:border-primary data-[state=active]:text-primary",
          // Completed state
          "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
          // Error state
          "data-[error]:border-destructive data-[error]:text-destructive",
        ].join(" "),
        simple: [
          // Simple: minimal indicator
          "bg-transparent text-muted-foreground",
          // Active state
          "data-[state=active]:text-primary data-[state=active]:font-bold",
          // Completed state
          "data-[state=completed]:text-primary",
          // Error state
          "data-[error]:text-destructive",
        ].join(" "),
      },
      size: {
        sm: "size-6 text-xs",
        md: "size-8 text-sm",
        lg: "size-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface StepperIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Custom content for the indicator (icon or number).
   * If not provided, shows step number or check icon.
   */
  children?: React.ReactNode;
}

/**
 * StepperIndicator - Visual step state indicator (number, check, or error icon)
 */
const StepperIndicator = React.forwardRef<HTMLSpanElement, StepperIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, size } = useStepperContext();
    const { index, isActive, isCompleted, hasError } = useStepperItemContext();

    const state = isActive ? "active" : isCompleted ? "completed" : "inactive";

    // Determine what to render
    const renderContent = () => {
      if (children) return children;
      if (hasError) return <AlertCircle className="size-4" />;
      if (isCompleted) return <Check className="size-4" />;
      return index + 1;
    };

    return (
      <span
        ref={ref}
        data-slot="stepper-indicator"
        data-state={state}
        data-error={hasError ? "" : undefined}
        className={cn(stepperIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        {renderContent()}
      </span>
    );
  }
);
StepperIndicator.displayName = "StepperIndicator";

/* -------------------------------------------------------------------------------------------------
 * StepperLabel
 * -----------------------------------------------------------------------------------------------*/

const stepperLabelVariants = cva(
  [
    "flex flex-col",
    "transition-colors",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "gap-0",
        md: "gap-0.5",
        lg: "gap-1",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const stepperLabelTitleVariants = cva(
  [
    "font-medium",
    "text-muted-foreground",
    // Active state
    "data-[state=active]:text-foreground",
    // Completed state
    "data-[state=completed]:text-foreground",
    // Error state
    "data-[error]:text-destructive",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const stepperLabelDescriptionVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface StepperLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Optional description text shown below the label.
   */
  description?: React.ReactNode;
}

/**
 * StepperLabel - Step title and optional description
 */
const StepperLabel = React.forwardRef<HTMLSpanElement, StepperLabelProps>(
  ({ className, description, children, ...props }, ref) => {
    const { size } = useStepperContext();
    const { isActive, isCompleted, hasError, isOptional } = useStepperItemContext();

    const state = isActive ? "active" : isCompleted ? "completed" : "inactive";

    return (
      <span
        ref={ref}
        data-slot="stepper-label"
        className={cn(stepperLabelVariants({ size }), className)}
        {...props}
      >
        <span
          data-state={state}
          data-error={hasError ? "" : undefined}
          className={stepperLabelTitleVariants({ size })}
        >
          {children}
        </span>
        {(description || isOptional) && (
          <span className={stepperLabelDescriptionVariants({ size })}>
            {description ?? (isOptional ? "Optional" : null)}
          </span>
        )}
      </span>
    );
  }
);
StepperLabel.displayName = "StepperLabel";

/* -------------------------------------------------------------------------------------------------
 * StepperSeparator
 * -----------------------------------------------------------------------------------------------*/

const stepperSeparatorVariants = cva(
  [
    "flex-1",
    "transition-colors",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "h-[2px] min-w-8 mx-2",
      },
      variant: {
        default: "bg-muted data-[completed]:bg-primary",
        outlined: "bg-border data-[completed]:bg-primary",
        simple: "bg-border data-[completed]:bg-primary",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
    },
  }
);

export interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the separator represents a completed transition.
   * If not provided, will be inferred from context.
   */
  completed?: boolean;
}

/**
 * StepperSeparator - Visual connector between steps
 */
const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, completed, ...props }, ref) => {
    const { orientation, variant, activeStep, stepOrder, isStepCompleted } = useStepperContext();

    // Find the index of this separator based on its position in the DOM
    // The separator appears after a StepperItem, so we need to determine
    // which step it follows
    const separatorRef = React.useRef<HTMLDivElement>(null);
    const [isCompleted, setIsCompleted] = React.useState(completed ?? false);

    React.useEffect(() => {
      if (completed !== undefined) {
        setIsCompleted(completed);
        return;
      }

      // Find previous sibling that is a stepper-item to determine position
      const element = separatorRef.current;
      if (!element) return;

      let sibling = element.previousElementSibling;
      let stepCount = 0;
      while (sibling) {
        if (sibling.getAttribute("data-slot") === "stepper-item") {
          stepCount++;
          break;
        }
        sibling = sibling.previousElementSibling;
        if (sibling?.getAttribute("data-slot") === "stepper-item") {
          stepCount++;
        }
      }

      // Count how many stepper-items are before this separator
      let prevSibling = element.previousElementSibling;
      let index = 0;
      while (prevSibling) {
        if (prevSibling.getAttribute("data-slot") === "stepper-item") {
          index++;
        }
        prevSibling = prevSibling.previousElementSibling;
      }

      // Separator is completed if the step before it is completed
      setIsCompleted(index > 0 && isStepCompleted(index - 1));
    }, [completed, activeStep, stepOrder, isStepCompleted]);

    return (
      <div
        ref={(node) => {
          (separatorRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="separator"
        data-slot="stepper-separator"
        data-completed={isCompleted ? "" : undefined}
        className={cn(stepperSeparatorVariants({ orientation, variant }), className)}
        {...props}
      />
    );
  }
);
StepperSeparator.displayName = "StepperSeparator";

/* -------------------------------------------------------------------------------------------------
 * StepperContent
 * -----------------------------------------------------------------------------------------------*/

const stepperContentVariants = cva(
  [
    "outline-none",
    "transition-opacity",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Hidden state
    "data-[state=inactive]:hidden",
    // Visible state
    "data-[state=active]:animate-in data-[state=active]:fade-in-0",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "mt-2 p-2",
        md: "mt-4 p-4",
        lg: "mt-6 p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The value of the step this content belongs to.
   */
  value: string;
  /**
   * Keep the content mounted when not active.
   */
  forceMount?: boolean;
}

/**
 * StepperContent - Step content panel
 */
const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ className, value, forceMount, children, ...props }, ref) => {
    const { activeStep, getStepIndex, size } = useStepperContext();

    const index = getStepIndex(value);
    const isActive = index === activeStep;

    if (!isActive && !forceMount) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-slot="stepper-content"
        data-state={isActive ? "active" : "inactive"}
        data-value={value}
        tabIndex={0}
        className={cn(stepperContentVariants({ size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StepperContent.displayName = "StepperContent";

/* -------------------------------------------------------------------------------------------------
 * StepperNavigation
 * -----------------------------------------------------------------------------------------------*/

export interface StepperNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Render function for navigation buttons.
   */
  children?: React.ReactNode;
}

/**
 * StepperNavigation - Container for navigation buttons
 */
const StepperNavigation = React.forwardRef<HTMLDivElement, StepperNavigationProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="stepper-navigation"
        className={cn("flex items-center gap-2 mt-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StepperNavigation.displayName = "StepperNavigation";

/* -------------------------------------------------------------------------------------------------
 * useStepperNavigation Hook
 * -----------------------------------------------------------------------------------------------*/

/**
 * Hook for stepper navigation controls
 *
 * @example
 * ```tsx
 * const { goToNext, goToPrevious, goToStep, canGoNext, canGoPrevious, isFirstStep, isLastStep } = useStepperNavigation();
 * ```
 */
function useStepperNavigation() {
  const context = useStepperContext();
  const {
    activeStep,
    setActiveStep,
    stepOrder,
    canNavigateTo,
    isStepCompleted,
  } = context;

  const totalSteps = stepOrder.length;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;
  const canGoNext = activeStep < totalSteps - 1 && canNavigateTo(activeStep + 1);
  const canGoPrevious = activeStep > 0 && canNavigateTo(activeStep - 1);

  const goToNext = React.useCallback(() => {
    if (canGoNext) {
      setActiveStep(activeStep + 1);
    }
  }, [activeStep, canGoNext, setActiveStep]);

  const goToPrevious = React.useCallback(() => {
    if (canGoPrevious) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep, canGoPrevious, setActiveStep]);

  const goToStep = React.useCallback(
    (step: number) => {
      if (canNavigateTo(step)) {
        setActiveStep(step);
      }
    },
    [canNavigateTo, setActiveStep]
  );

  return {
    activeStep,
    totalSteps,
    goToNext,
    goToPrevious,
    goToStep,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    isStepCompleted,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

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
};
