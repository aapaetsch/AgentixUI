"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, AlertCircle } from "lucide-react";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Premium Stepper Context
 * -----------------------------------------------------------------------------------------------*/

interface StepData {
  value: string;
  disabled?: boolean;
  optional?: boolean;
  completed?: boolean;
  error?: boolean;
}

interface PremiumStepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  linear: boolean;
  nonLinear: boolean;
  orientation: "horizontal" | "vertical";
  variant: "default" | "outlined" | "simple";
  size: "sm" | "md" | "lg";
  alternativeLabel: boolean;
  steps: Map<string, StepData>;
  stepOrder: string[];
  registerStep: (value: string, data: StepData) => void;
  unregisterStep: (value: string) => void;
  getStepIndex: (value: string) => number;
  isStepCompleted: (index: number) => boolean;
  isStepActive: (index: number) => boolean;
  isStepDisabled: (index: number) => boolean;
  canNavigateTo: (index: number) => boolean;
  onStepValidate?: (step: number) => Promise<boolean> | boolean;
}

const PremiumStepperContext = React.createContext<PremiumStepperContextValue | null>(null);

function usePremiumStepperContext() {
  const context = React.useContext(PremiumStepperContext);
  if (!context) {
    throw new Error("Premium Stepper components must be used within a <PremiumStepper>");
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Premium StepperItem Context
 * -----------------------------------------------------------------------------------------------*/

interface PremiumStepperItemContextValue {
  value: string;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  hasError: boolean;
  isOptional: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const PremiumStepperItemContext = React.createContext<PremiumStepperItemContextValue | null>(null);

function usePremiumStepperItemContext() {
  const context = React.useContext(PremiumStepperItemContext);
  if (!context) {
    throw new Error("Premium StepperItem components must be used within a <PremiumStepperItem>");
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Premium Stepper Root
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperVariants = cva("flex w-full", {
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-col",
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

export interface PremiumStepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumStepperVariants> {
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
   * Allow any-order navigation (overrides linear).
   * @default false
   */
  nonLinear?: boolean;
  /**
   * Orientation of the stepper.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
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
  /**
   * Place labels below indicators (horizontal only).
   * @default false
   */
  alternativeLabel?: boolean;
  /**
   * Custom connector component.
   */
  connector?: React.ReactNode;
  /**
   * Async validation before advancing steps.
   */
  onStepValidate?: (step: number) => Promise<boolean> | boolean;
}

/**
 * PremiumStepper - Advanced stepper with vertical orientation and non-linear navigation
 *
 * @example
 * ```tsx
 * <PremiumStepper orientation="vertical" nonLinear>
 *   <PremiumStepperItem value="step1">
 *     <PremiumStepperTrigger>
 *       <PremiumStepperIndicator />
 *       <PremiumStepperLabel>Step 1</PremiumStepperLabel>
 *     </PremiumStepperTrigger>
 *     <PremiumStepperContent>
 *       Inline content for step 1
 *     </PremiumStepperContent>
 *   </PremiumStepperItem>
 * </PremiumStepper>
 * ```
 */
const PremiumStepper = React.forwardRef<HTMLDivElement, PremiumStepperProps>(
  (
    {
      className,
      activeStep: controlledActiveStep,
      defaultActiveStep = 0,
      onStepChange,
      linear = true,
      nonLinear = false,
      orientation = "horizontal",
      variant = "default",
      size = "md",
      alternativeLabel = false,
      onStepValidate,
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
      async (step: number) => {
        // Run validation if provided
        if (onStepValidate) {
          const isValid = await onStepValidate(step);
          if (!isValid) return;
        }

        if (!isControlled) {
          setInternalActiveStep(step);
        }
        onStepChange?.(step);
      },
      [isControlled, onStepChange, onStepValidate]
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
        if (nonLinear) return !isStepDisabled(index);
        if (!linear) return !isStepDisabled(index);
        // In linear mode, can only go to completed steps or the next uncompleted step
        if (isStepDisabled(index)) return false;
        if (index <= activeStep) return true;
        // Can go to next step if current step is not in error
        return index === activeStep + 1;
      },
      [linear, nonLinear, activeStep, isStepDisabled]
    );

    const contextValue = React.useMemo<PremiumStepperContextValue>(
      () => ({
        activeStep,
        setActiveStep,
        linear,
        nonLinear,
        orientation,
        variant,
        size,
        alternativeLabel,
        steps,
        stepOrder,
        registerStep,
        unregisterStep,
        getStepIndex,
        isStepCompleted,
        isStepActive,
        isStepDisabled,
        canNavigateTo,
        onStepValidate,
      }),
      [
        activeStep,
        setActiveStep,
        linear,
        nonLinear,
        orientation,
        variant,
        size,
        alternativeLabel,
        steps,
        stepOrder,
        registerStep,
        unregisterStep,
        getStepIndex,
        isStepCompleted,
        isStepActive,
        isStepDisabled,
        canNavigateTo,
        onStepValidate,
      ]
    );

    return (
      <PremiumStepperContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="premium-stepper"
          data-orientation={orientation}
          className={cn(premiumStepperVariants({ orientation, size }), className)}
          {...props}
        >
          {children}
        </div>
      </PremiumStepperContext.Provider>
    );
  }
);
PremiumStepper.displayName = "PremiumStepper";

/* -------------------------------------------------------------------------------------------------
 * Premium StepperList
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperListVariants = cva(
  [
    "flex items-stretch",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "flex-row w-full",
        vertical: "flex-col w-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

export interface PremiumStepperListProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * PremiumStepperList - Container for premium step items
 */
const PremiumStepperList = React.forwardRef<HTMLDivElement, PremiumStepperListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = usePremiumStepperContext();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        data-slot="premium-stepper-list"
        className={cn(premiumStepperListVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PremiumStepperList.displayName = "PremiumStepperList";

/* -------------------------------------------------------------------------------------------------
 * Premium StepperItem
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperItemVariants = cva("flex relative", {
  variants: {
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-col items-start w-full",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface PremiumStepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
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
 * PremiumStepperItem - Individual step container with collapsible content support
 */
const PremiumStepperItem = React.forwardRef<HTMLDivElement, PremiumStepperItemProps>(
  (
    { className, value, disabled, optional, completed, error, children, ...props },
    ref
  ) => {
    const context = usePremiumStepperContext();
    const { registerStep, unregisterStep, getStepIndex, isStepActive, isStepCompleted, isStepDisabled, orientation, stepOrder } = context;

    // Register this step
    React.useEffect(() => {
      registerStep(value, { value, disabled, optional, completed, error });
      return () => unregisterStep(value);
    }, [value, disabled, optional, completed, error, registerStep, unregisterStep]);

    const index = getStepIndex(value);
    const isActive = isStepActive(index);
    const isCompletedStep = completed ?? isStepCompleted(index);
    const isDisabledStep = disabled ?? isStepDisabled(index);

    // For vertical orientation, control collapsible state
    const [isOpen, setIsOpen] = React.useState(isActive);

    React.useEffect(() => {
      if (orientation === "vertical") {
        setIsOpen(isActive);
      }
    }, [isActive, orientation]);

    const itemContextValue = React.useMemo<PremiumStepperItemContextValue>(
      () => ({
        value,
        index,
        isActive,
        isCompleted: isCompletedStep,
        isDisabled: isDisabledStep,
        hasError: error ?? false,
        isOptional: optional ?? false,
        isOpen,
        setIsOpen,
      }),
      [value, index, isActive, isCompletedStep, isDisabledStep, error, optional, isOpen]
    );

    if (orientation === "vertical") {
      // Check if this is the last step to hide the connector line
      const isLastStep = index === stepOrder.length - 1;
      
      return (
        <PremiumStepperItemContext.Provider value={itemContextValue}>
          <CollapsiblePrimitive.Root
            ref={ref}
            open={isOpen}
            onOpenChange={setIsOpen}
            data-slot="premium-stepper-item"
            data-state={isActive ? "active" : isCompletedStep ? "completed" : "inactive"}
            data-disabled={isDisabledStep ? "" : undefined}
            className={cn(premiumStepperItemVariants({ orientation }), className)}
            {...props}
          >
            {/* Vertical connector line that runs through the item */}
            {!isLastStep && (
              <div
                className={cn(
                  "absolute w-[2px]",
                  "transition-colors duration-200",
                  // Position based on size - starts below the indicator with a small gap
                  // Center horizontally on the indicator, start below with 0.5rem gap
                  context.size === "sm" && "left-3 top-8",  // 1.5rem (indicator) + 0.5rem (gap) = 2rem
                  context.size === "md" && "left-4 top-10", // 2rem (indicator) + 0.5rem (gap) = 2.5rem
                  context.size === "lg" && "left-5 top-12", // 2.5rem (indicator) + 0.5rem (gap) = 3rem
                  // Extend to bottom
                  "bottom-0",
                  isCompletedStep ? "bg-primary" : "bg-muted"
                )}
                aria-hidden="true"
              />
            )}
            {children}
          </CollapsiblePrimitive.Root>
        </PremiumStepperItemContext.Provider>
      );
    }

    return (
      <PremiumStepperItemContext.Provider value={itemContextValue}>
        <div
          ref={ref}
          data-slot="premium-stepper-item"
          data-state={isActive ? "active" : isCompletedStep ? "completed" : "inactive"}
          data-disabled={isDisabledStep ? "" : undefined}
          className={cn(premiumStepperItemVariants({ orientation }), className)}
          {...props}
        >
          {children}
        </div>
      </PremiumStepperItemContext.Provider>
    );
  }
);
PremiumStepperItem.displayName = "PremiumStepperItem";

/* -------------------------------------------------------------------------------------------------
 * Premium StepperTrigger
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperTriggerVariants = cva(
  [
    "inline-flex min-h-11 items-center",
    "cursor-pointer select-none touch-manipulation",
    "outline-none",
    "transition-[color,background-color,opacity]",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Focus state
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Hover state
    "hover:opacity-80 active:bg-accent/50",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "gap-2 flex-row",
        vertical: "gap-3 flex-row w-full",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
    },
  }
);

export interface PremiumStepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Use the Radix Slot pattern for custom trigger elements.
   */
  asChild?: boolean;
}

/**
 * PremiumStepperTrigger - Clickable step header with collapsible support
 */
const PremiumStepperTrigger = React.forwardRef<HTMLButtonElement, PremiumStepperTriggerProps>(
  ({ className, asChild, children, onClick, ...props }, ref) => {
    const { setActiveStep, canNavigateTo, size, orientation } = usePremiumStepperContext();
    const { index, isActive, isDisabled, setIsOpen } = usePremiumStepperItemContext();

    const Comp = asChild ? Slot : CollapsiblePrimitive.Trigger;

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled && canNavigateTo(index)) {
        await setActiveStep(index);
        if (orientation === "vertical") {
          setIsOpen(true);
        }
      }
      onClick?.(event);
    };

    return (
      <Comp
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        data-slot="premium-stepper-trigger"
        data-state={isActive ? "active" : "inactive"}
        disabled={isDisabled}
        className={cn(premiumStepperTriggerVariants({ orientation, size }), className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
PremiumStepperTrigger.displayName = "PremiumStepperTrigger";

/* -------------------------------------------------------------------------------------------------
 * Premium StepperIndicator
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperIndicatorVariants = cva(
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
          "bg-muted text-muted-foreground",
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
          "data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
          "data-[error]:bg-destructive data-[error]:text-destructive-foreground",
        ].join(" "),
        outlined: [
          "border-2 border-muted-foreground/50 text-muted-foreground bg-transparent",
          "data-[state=active]:border-primary data-[state=active]:text-primary",
          "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
          "data-[error]:border-destructive data-[error]:text-destructive",
        ].join(" "),
        simple: [
          "bg-transparent text-muted-foreground",
          "data-[state=active]:text-primary data-[state=active]:font-bold",
          "data-[state=completed]:text-primary",
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

export interface PremiumStepperIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

/**
 * PremiumStepperIndicator - Visual step state indicator
 */
const PremiumStepperIndicator = React.forwardRef<HTMLSpanElement, PremiumStepperIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, size } = usePremiumStepperContext();
    const { index, isActive, isCompleted, hasError } = usePremiumStepperItemContext();

    const state = isActive ? "active" : isCompleted ? "completed" : "inactive";

    const renderContent = () => {
      if (children) return children;
      if (hasError) return <AlertCircle className="size-4" />;
      if (isCompleted) return <Check className="size-4" />;
      return index + 1;
    };

    return (
      <span
        ref={ref}
        data-slot="premium-stepper-indicator"
        data-state={state}
        data-error={hasError ? "" : undefined}
        className={cn(premiumStepperIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        {renderContent()}
      </span>
    );
  }
);
PremiumStepperIndicator.displayName = "PremiumStepperIndicator";

/* -------------------------------------------------------------------------------------------------
 * Premium StepperLabel
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperLabelVariants = cva(
  [
    "flex flex-col flex-1",
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

const premiumStepperLabelTitleVariants = cva(
  [
    "font-medium",
    "text-muted-foreground",
    "data-[state=active]:text-foreground",
    "data-[state=completed]:text-foreground",
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

const premiumStepperLabelDescriptionVariants = cva(
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

export interface PremiumStepperLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  description?: React.ReactNode;
}

/**
 * PremiumStepperLabel - Step title and optional description
 */
const PremiumStepperLabel = React.forwardRef<HTMLSpanElement, PremiumStepperLabelProps>(
  ({ className, description, children, ...props }, ref) => {
    const { size } = usePremiumStepperContext();
    const { isActive, isCompleted, hasError, isOptional } = usePremiumStepperItemContext();

    const state = isActive ? "active" : isCompleted ? "completed" : "inactive";

    return (
      <span
        ref={ref}
        data-slot="premium-stepper-label"
        className={cn(premiumStepperLabelVariants({ size }), className)}
        {...props}
      >
        <span
          data-state={state}
          data-error={hasError ? "" : undefined}
          className={premiumStepperLabelTitleVariants({ size })}
        >
          {children}
        </span>
        {(description || isOptional) && (
          <span className={premiumStepperLabelDescriptionVariants({ size })}>
            {description ?? (isOptional ? "Optional" : null)}
          </span>
        )}
      </span>
    );
  }
);
PremiumStepperLabel.displayName = "PremiumStepperLabel";

/* -------------------------------------------------------------------------------------------------
 * Premium StepperConnector (Custom Connector Component)
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperConnectorVariants = cva(
  [
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "flex-1 h-[2px] min-w-8 mx-2",
        vertical: "w-[2px] ml-4 min-h-8 my-2",
      },
      variant: {
        solid: "bg-muted data-[completed]:bg-primary",
        dashed: "border-t-2 border-dashed border-muted data-[completed]:border-primary",
        gradient: [
          "bg-gradient-to-r from-muted to-muted",
          "data-[completed]:from-primary data-[completed]:to-primary",
        ].join(" "),
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "solid",
      animated: false,
    },
  }
);

export interface PremiumStepperConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  completed?: boolean;
  variant?: "solid" | "dashed" | "gradient";
  animated?: boolean;
}

/**
 * PremiumStepperConnector - Custom connector between steps
 */
const PremiumStepperConnector = React.forwardRef<HTMLDivElement, PremiumStepperConnectorProps>(
  ({ className, completed, variant = "solid", animated = false, ...props }, ref) => {
    const { orientation, activeStep, stepOrder, isStepCompleted } = usePremiumStepperContext();

    const separatorRef = React.useRef<HTMLDivElement>(null);
    const [isCompleted, setIsCompleted] = React.useState(completed ?? false);

    React.useEffect(() => {
      if (completed !== undefined) {
        setIsCompleted(completed);
        return;
      }

      const element = separatorRef.current;
      if (!element) return;

      let prevSibling = element.previousElementSibling;
      let index = 0;
      while (prevSibling) {
        if (prevSibling.getAttribute("data-slot") === "premium-stepper-item") {
          index++;
        }
        prevSibling = prevSibling.previousElementSibling;
      }

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
        data-slot="premium-stepper-connector"
        data-completed={isCompleted ? "" : undefined}
        className={cn(
          premiumStepperConnectorVariants({ orientation, variant, animated }),
          className
        )}
        {...props}
      />
    );
  }
);
PremiumStepperConnector.displayName = "PremiumStepperConnector";

/* -------------------------------------------------------------------------------------------------
 * Premium StepperContent
 * -----------------------------------------------------------------------------------------------*/

const premiumStepperContentVariants = cva(
  [
    "overflow-hidden",
    "outline-none",
    "transition-all",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: [
          "data-[state=inactive]:hidden",
          "data-[state=active]:animate-in data-[state=active]:fade-in-0",
        ].join(" "),
        vertical: [
          "w-full",
          "data-[state=closed]:animate-accordion-up",
          "data-[state=open]:animate-accordion-down",
        ].join(" "),
      },
      size: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
    },
  }
);

export interface PremiumStepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The value of the step this content belongs to.
   * For vertical orientation, content is inline and doesn't need a value.
   */
  value?: string;
  /**
   * Keep the content mounted when not active.
   */
  forceMount?: boolean;
  /**
   * Transition duration in milliseconds (vertical only).
   */
  transitionDuration?: number;
}

/**
 * PremiumStepperContent - Step content panel with inline support for vertical orientation
 */
const PremiumStepperContent = React.forwardRef<HTMLDivElement, PremiumStepperContentProps>(
  ({ className, value, forceMount, children, ...props }, ref) => {
    const { activeStep, getStepIndex, size, orientation } = usePremiumStepperContext();
    
    // For vertical orientation with inline content
    if (orientation === "vertical") {
      return (
        <CollapsiblePrimitive.Content
          ref={ref}
          role="tabpanel"
          data-slot="premium-stepper-content"
          data-value={value}
          className={cn(
            premiumStepperContentVariants({ orientation, size }),
            "ml-11", // Indent to align with label
            className
          )}
          {...props}
        >
          <div className="pb-4">{children}</div>
        </CollapsiblePrimitive.Content>
      );
    }

    // For horizontal orientation (external content panels)
    if (!value) {
      console.warn("PremiumStepperContent requires a 'value' prop in horizontal orientation");
      return null;
    }

    const index = getStepIndex(value);
    const isActive = index === activeStep;

    if (!isActive && !forceMount) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-slot="premium-stepper-content"
        data-state={isActive ? "active" : "inactive"}
        data-value={value}
        tabIndex={0}
        className={cn(premiumStepperContentVariants({ orientation, size }), "mt-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PremiumStepperContent.displayName = "PremiumStepperContent";

/* -------------------------------------------------------------------------------------------------
 * usePremiumStepperNavigation Hook
 * -----------------------------------------------------------------------------------------------*/

/**
 * Hook for premium stepper navigation controls with async validation
 */
function usePremiumStepperNavigation() {
  const context = usePremiumStepperContext();
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

  const goToNext = React.useCallback(async () => {
    if (canGoNext) {
      await setActiveStep(activeStep + 1);
    }
  }, [activeStep, canGoNext, setActiveStep]);

  const goToPrevious = React.useCallback(async () => {
    if (canGoPrevious) {
      await setActiveStep(activeStep - 1);
    }
  }, [activeStep, canGoPrevious, setActiveStep]);

  const goToStep = React.useCallback(
    async (step: number) => {
      if (canNavigateTo(step)) {
        await setActiveStep(step);
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
};
