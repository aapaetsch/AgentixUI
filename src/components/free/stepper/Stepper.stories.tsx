import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { User, CreditCard, CheckCircle, Settings, Package, Mail } from "lucide-react";

import {
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
} from "./index";
import { Button } from "../button";
import { Input } from "../input";

const meta: Meta<typeof Stepper> = {
  title: "Free/Navigation/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A stepper component for multi-step workflows. Supports linear progression, optional steps, error states, and multiple visual variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "simple"],
      description: "Visual variant of the stepper",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the stepper",
    },
    linear: {
      control: "boolean",
      description: "Whether steps must be completed in order",
    },
    defaultActiveStep: {
      control: "number",
      description: "Default active step (0-indexed)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

/* -------------------------------------------------------------------------------------------------
 * Navigation Buttons Component
 * -----------------------------------------------------------------------------------------------*/

function NavigationButtons() {
  const { goToNext, goToPrevious, canGoNext, canGoPrevious, isFirstStep, isLastStep } =
    useStepperNavigation();

  return (
    <StepperNavigation>
      <Button variant="outline" onClick={goToPrevious} disabled={!canGoPrevious}>
        {isFirstStep ? "Cancel" : "Back"}
      </Button>
      <Button onClick={goToNext} disabled={!canGoNext}>
        {isLastStep ? "Finish" : "Next"}
      </Button>
    </StepperNavigation>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Default Story
 * -----------------------------------------------------------------------------------------------*/

export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={0}>
        <StepperList>
          <StepperItem value="account">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Account</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="profile">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Profile</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="review">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Review</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="account">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create your account</h3>
            <p className="text-muted-foreground text-sm">
              Enter your email and password to get started.
            </p>
            <div className="space-y-2">
              <Input placeholder="Email" type="email" />
              <Input placeholder="Password" type="password" />
            </div>
          </div>
        </StepperContent>
        <StepperContent value="profile">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Complete your profile</h3>
            <p className="text-muted-foreground text-sm">
              Tell us a bit about yourself.
            </p>
            <div className="space-y-2">
              <Input placeholder="Full name" />
              <Input placeholder="Company" />
            </div>
          </div>
        </StepperContent>
        <StepperContent value="review">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review & submit</h3>
            <p className="text-muted-foreground text-sm">
              Review your information before submitting.
            </p>
          </div>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * With Icons
 * -----------------------------------------------------------------------------------------------*/

export const WithIcons: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={1}>
        <StepperList>
          <StepperItem value="user" completed>
            <StepperTrigger>
              <StepperIndicator>
                <User className="size-4" />
              </StepperIndicator>
              <StepperLabel>User Info</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="payment">
            <StepperTrigger>
              <StepperIndicator>
                <CreditCard className="size-4" />
              </StepperIndicator>
              <StepperLabel>Payment</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="confirm">
            <StepperTrigger>
              <StepperIndicator>
                <CheckCircle className="size-4" />
              </StepperIndicator>
              <StepperLabel>Confirm</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="user">
          <p>User information form...</p>
        </StepperContent>
        <StepperContent value="payment">
          <p>Payment details form...</p>
        </StepperContent>
        <StepperContent value="confirm">
          <p>Confirmation page...</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * With Descriptions
 * -----------------------------------------------------------------------------------------------*/

export const WithDescriptions: Story = {
  render: () => (
    <div className="w-[700px]">
      <Stepper defaultActiveStep={0}>
        <StepperList>
          <StepperItem value="details">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel description="Enter your shipping address">
                Shipping Details
              </StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="delivery">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel description="Choose your delivery option">
                Delivery Method
              </StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="payment">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel description="Complete your purchase">
                Payment
              </StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="details">
          <p>Shipping details form...</p>
        </StepperContent>
        <StepperContent value="delivery">
          <p>Delivery options...</p>
        </StepperContent>
        <StepperContent value="payment">
          <p>Payment form...</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Optional Steps
 * -----------------------------------------------------------------------------------------------*/

export const OptionalSteps: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={0}>
        <StepperList>
          <StepperItem value="required1">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Account Setup</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="optional" optional>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Profile Photo</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="required2">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Finish</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="required1">
          <p>Required step 1...</p>
        </StepperContent>
        <StepperContent value="optional">
          <p>Optional step - can be skipped...</p>
        </StepperContent>
        <StepperContent value="required2">
          <p>Final step...</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Error State
 * -----------------------------------------------------------------------------------------------*/

export const ErrorState: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={1}>
        <StepperList>
          <StepperItem value="step1" completed>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 1</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step2" error>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel description="Please fix the errors">
                Step 2
              </StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step3">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 3</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="step1">
          <p>Step 1 content...</p>
        </StepperContent>
        <StepperContent value="step2">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">
              There are errors in this step. Please review and fix them.
            </p>
          </div>
        </StepperContent>
        <StepperContent value="step3">
          <p>Step 3 content...</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Outlined Variant
 * -----------------------------------------------------------------------------------------------*/

export const OutlinedVariant: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={1} variant="outlined">
        <StepperList>
          <StepperItem value="step1" completed>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Completed</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step2">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Current</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step3">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Upcoming</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="step1">
          <p>Step 1 content...</p>
        </StepperContent>
        <StepperContent value="step2">
          <p>Step 2 content...</p>
        </StepperContent>
        <StepperContent value="step3">
          <p>Step 3 content...</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Simple Variant
 * -----------------------------------------------------------------------------------------------*/

export const SimpleVariant: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={0} variant="simple">
        <StepperList>
          <StepperItem value="step1">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 1</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step2">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 2</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step3">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 3</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="step1">
          <p>Step 1 content...</p>
        </StepperContent>
        <StepperContent value="step2">
          <p>Step 2 content...</p>
        </StepperContent>
        <StepperContent value="step3">
          <p>Step 3 content...</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Sizes
 * -----------------------------------------------------------------------------------------------*/

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8 w-[600px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <Stepper defaultActiveStep={1} size="sm">
          <StepperList>
            <StepperItem value="step1" completed>
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 1</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step2">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 2</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step3">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 3</StepperLabel>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
        </Stepper>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium (default)</p>
        <Stepper defaultActiveStep={1} size="md">
          <StepperList>
            <StepperItem value="step1" completed>
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 1</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step2">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 2</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step3">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 3</StepperLabel>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
        </Stepper>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <Stepper defaultActiveStep={1} size="lg">
          <StepperList>
            <StepperItem value="step1" completed>
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 1</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step2">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 2</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step3">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 3</StepperLabel>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
        </Stepper>
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Non-Linear (Clickable Steps)
 * -----------------------------------------------------------------------------------------------*/

export const NonLinear: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={0} linear={false}>
        <StepperList>
          <StepperItem value="step1">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 1</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step2">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 2</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step3">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 3</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="step1">
          <p>Click any step to navigate directly (non-linear mode).</p>
        </StepperContent>
        <StepperContent value="step2">
          <p>Step 2 content - you can jump here from anywhere!</p>
        </StepperContent>
        <StepperContent value="step3">
          <p>Step 3 content - all steps are accessible.</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Controlled
 * -----------------------------------------------------------------------------------------------*/

export const Controlled: Story = {
  render: function ControlledStory() {
    const [activeStep, setActiveStep] = React.useState(0);

    return (
      <div className="w-[600px] space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveStep(0)}
          >
            Go to Step 1
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveStep(1)}
          >
            Go to Step 2
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveStep(2)}
          >
            Go to Step 3
          </Button>
        </div>

        <Stepper
          activeStep={activeStep}
          onStepChange={setActiveStep}
          linear={false}
        >
          <StepperList>
            <StepperItem value="step1">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 1</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step2">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 2</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="step3">
              <StepperTrigger>
                <StepperIndicator />
                <StepperLabel>Step 3</StepperLabel>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
          <StepperContent value="step1">
            <p>Controlled step 1 - Active step: {activeStep}</p>
          </StepperContent>
          <StepperContent value="step2">
            <p>Controlled step 2 - Active step: {activeStep}</p>
          </StepperContent>
          <StepperContent value="step3">
            <p>Controlled step 3 - Active step: {activeStep}</p>
          </StepperContent>
        </Stepper>
      </div>
    );
  },
};

/* -------------------------------------------------------------------------------------------------
 * Multi-Step Form
 * -----------------------------------------------------------------------------------------------*/

export const MultiStepForm: Story = {
  render: function MultiStepFormStory() {
    const [formData, setFormData] = React.useState({
      email: "",
      name: "",
      company: "",
    });

    return (
      <div className="w-[600px]">
        <Stepper defaultActiveStep={0}>
          <StepperList>
            <StepperItem value="account">
              <StepperTrigger>
                <StepperIndicator>
                  <Mail className="size-4" />
                </StepperIndicator>
                <StepperLabel description="Your login credentials">
                  Account
                </StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="profile">
              <StepperTrigger>
                <StepperIndicator>
                  <User className="size-4" />
                </StepperIndicator>
                <StepperLabel description="Tell us about yourself">
                  Profile
                </StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="settings" optional>
              <StepperTrigger>
                <StepperIndicator>
                  <Settings className="size-4" />
                </StepperIndicator>
                <StepperLabel>Preferences</StepperLabel>
              </StepperTrigger>
            </StepperItem>
            <StepperSeparator />
            <StepperItem value="complete">
              <StepperTrigger>
                <StepperIndicator>
                  <CheckCircle className="size-4" />
                </StepperIndicator>
                <StepperLabel>Complete</StepperLabel>
              </StepperTrigger>
            </StepperItem>
          </StepperList>

          <StepperContent value="account">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Setup</h3>
              <Input
                placeholder="Email address"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </StepperContent>

          <StepperContent value="profile">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <Input
                placeholder="Full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                placeholder="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
              />
            </div>
          </StepperContent>

          <StepperContent value="settings">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preferences (Optional)</h3>
              <p className="text-muted-foreground">
                Configure your notification and display preferences.
              </p>
            </div>
          </StepperContent>

          <StepperContent value="complete">
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">All Done!</h3>
              <p className="text-muted-foreground">
                Your account has been created successfully.
              </p>
              <pre className="text-left text-xs bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </StepperContent>

          <NavigationButtons />
        </Stepper>
      </div>
    );
  },
};

/* -------------------------------------------------------------------------------------------------
 * Many Steps
 * -----------------------------------------------------------------------------------------------*/

export const ManySteps: Story = {
  render: () => (
    <div className="w-[800px]">
      <Stepper defaultActiveStep={2} size="sm">
        <StepperList>
          <StepperItem value="step1" completed>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 1</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step2" completed>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 2</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step3">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 3</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step4">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 4</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step5">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 5</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step6">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Step 6</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="step1">
          <p>Step 1 content</p>
        </StepperContent>
        <StepperContent value="step2">
          <p>Step 2 content</p>
        </StepperContent>
        <StepperContent value="step3">
          <p>Step 3 content - current</p>
        </StepperContent>
        <StepperContent value="step4">
          <p>Step 4 content</p>
        </StepperContent>
        <StepperContent value="step5">
          <p>Step 5 content</p>
        </StepperContent>
        <StepperContent value="step6">
          <p>Step 6 content</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Disabled Steps
 * -----------------------------------------------------------------------------------------------*/

export const DisabledSteps: Story = {
  render: () => (
    <div className="w-[600px]">
      <Stepper defaultActiveStep={0} linear={false}>
        <StepperList>
          <StepperItem value="step1">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Available</StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step2" disabled>
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel description="Complete Step 1 first">
                Locked
              </StepperLabel>
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step3">
            <StepperTrigger>
              <StepperIndicator />
              <StepperLabel>Available</StepperLabel>
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="step1">
          <p>Step 1 - you can access step 3 but not step 2</p>
        </StepperContent>
        <StepperContent value="step2">
          <p>Step 2 - disabled</p>
        </StepperContent>
        <StepperContent value="step3">
          <p>Step 3 - accessible</p>
        </StepperContent>
        <NavigationButtons />
      </Stepper>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Indicator Only (No Labels)
 * -----------------------------------------------------------------------------------------------*/

export const IndicatorOnly: Story = {
  render: () => (
    <div className="w-[400px]">
      <Stepper defaultActiveStep={1}>
        <StepperList className="justify-center">
          <StepperItem value="step1" completed>
            <StepperTrigger>
              <StepperIndicator />
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step2">
            <StepperTrigger>
              <StepperIndicator />
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step3">
            <StepperTrigger>
              <StepperIndicator />
            </StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value="step4">
            <StepperTrigger>
              <StepperIndicator />
            </StepperTrigger>
          </StepperItem>
        </StepperList>
        <StepperContent value="step1">
          <p className="text-center">Step 1</p>
        </StepperContent>
        <StepperContent value="step2">
          <p className="text-center">Step 2</p>
        </StepperContent>
        <StepperContent value="step3">
          <p className="text-center">Step 3</p>
        </StepperContent>
        <StepperContent value="step4">
          <p className="text-center">Step 4</p>
        </StepperContent>
        <div className="flex justify-center">
          <NavigationButtons />
        </div>
      </Stepper>
    </div>
  ),
};
