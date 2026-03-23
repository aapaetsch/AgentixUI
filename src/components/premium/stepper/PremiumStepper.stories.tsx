import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  PremiumStepper,
  PremiumStepperList,
  PremiumStepperItem,
  PremiumStepperTrigger,
  PremiumStepperIndicator,
  PremiumStepperLabel,
  PremiumStepperConnector,
  PremiumStepperContent,
  usePremiumStepperNavigation,
} from "./index";
import { Button } from "../../free/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../free/card";
import { Input } from "../../free/input";
import { Textarea } from "../../free/textarea";
import { User, Mail, CheckCircle, Settings, FileText, CreditCard } from "lucide-react";

const meta: Meta<typeof PremiumStepper> = {
  title: "Premium/Stepper",
  component: PremiumStepper,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Stepper orientation",
    },
    variant: {
      control: "select",
      options: ["default", "outlined", "simple"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    nonLinear: {
      control: "boolean",
      description: "Allow non-linear navigation",
    },
    alternativeLabel: {
      control: "boolean",
      description: "Place labels below indicators (horizontal only)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PremiumStepper>;

/* -------------------------------------------------------------------------------------------------
 * Vertical Orientation (Premium Feature)
 * -----------------------------------------------------------------------------------------------*/

function VerticalStepperDemo() {
  return (
    <PremiumStepper orientation="vertical" defaultActiveStep={0}>
      <PremiumStepperList>
        <PremiumStepperItem value="account">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator>
              <User className="size-4" />
            </PremiumStepperIndicator>
            <PremiumStepperLabel description="Set up your account details">
              Account Information
            </PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>
                  Enter your personal information to create your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="John Doe" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="john@example.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input type="password" placeholder="••••••••" className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector variant="solid" />

        <PremiumStepperItem value="profile">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator>
              <Settings className="size-4" />
            </PremiumStepperIndicator>
            <PremiumStepperLabel description="Customize your profile">
              Profile Setup
            </PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Tell us about yourself and customize your profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea 
                    placeholder="Tell us about yourself..." 
                    className="mt-1" 
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="San Francisco, CA" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input placeholder="https://example.com" className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector variant="solid" />

        <PremiumStepperItem value="review">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator>
              <CheckCircle className="size-4" />
            </PremiumStepperIndicator>
            <PremiumStepperLabel description="Review and confirm">
              Review & Submit
            </PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <Card>
              <CardHeader>
                <CardTitle>Review Your Information</CardTitle>
                <CardDescription>
                  Please review all information before submitting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm text-muted-foreground">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm text-muted-foreground">john@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm text-muted-foreground">San Francisco, CA</span>
                  </div>
                </div>
                <Button className="w-full">Complete Setup</Button>
              </CardContent>
            </Card>
          </PremiumStepperContent>
        </PremiumStepperItem>
      </PremiumStepperList>
    </PremiumStepper>
  );
}

export const Vertical: Story = {
  render: () => <VerticalStepperDemo />,
};

/* -------------------------------------------------------------------------------------------------
 * Non-Linear Navigation
 * -----------------------------------------------------------------------------------------------*/

function NonLinearStepperDemo() {
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 bg-muted/30">
        <p className="text-sm font-medium mb-2">Non-Linear Navigation</p>
        <p className="text-sm text-muted-foreground">
          Click any step to navigate freely. Steps can be completed in any order.
        </p>
      </div>

      <PremiumStepper orientation="vertical" nonLinear defaultActiveStep={0}>
        <PremiumStepperList>
          <PremiumStepperItem value="step1" completed={completedSteps.has(0)}>
            <PremiumStepperTrigger>
              <PremiumStepperIndicator />
              <PremiumStepperLabel>Personal Details</PremiumStepperLabel>
            </PremiumStepperTrigger>
            <PremiumStepperContent>
              <div className="space-y-4">
                <Input placeholder="Full Name" />
                <Input placeholder="Email" type="email" />
                <Button
                  onClick={() => setCompletedSteps(new Set(completedSteps).add(0))}
                >
                  Mark as Complete
                </Button>
              </div>
            </PremiumStepperContent>
          </PremiumStepperItem>

          <PremiumStepperConnector />

          <PremiumStepperItem value="step2" completed={completedSteps.has(1)}>
            <PremiumStepperTrigger>
              <PremiumStepperIndicator />
              <PremiumStepperLabel>Business Information</PremiumStepperLabel>
            </PremiumStepperTrigger>
            <PremiumStepperContent>
              <div className="space-y-4">
                <Input placeholder="Company Name" />
                <Input placeholder="Industry" />
                <Button
                  onClick={() => setCompletedSteps(new Set(completedSteps).add(1))}
                >
                  Mark as Complete
                </Button>
              </div>
            </PremiumStepperContent>
          </PremiumStepperItem>

          <PremiumStepperConnector />

          <PremiumStepperItem value="step3" completed={completedSteps.has(2)}>
            <PremiumStepperTrigger>
              <PremiumStepperIndicator />
              <PremiumStepperLabel>Preferences</PremiumStepperLabel>
            </PremiumStepperTrigger>
            <PremiumStepperContent>
              <div className="space-y-4">
                <Input placeholder="Language" />
                <Input placeholder="Timezone" />
                <Button
                  onClick={() => setCompletedSteps(new Set(completedSteps).add(2))}
                >
                  Mark as Complete
                </Button>
              </div>
            </PremiumStepperContent>
          </PremiumStepperItem>
        </PremiumStepperList>
      </PremiumStepper>
    </div>
  );
}

export const NonLinear: Story = {
  render: () => <NonLinearStepperDemo />,
};

/* -------------------------------------------------------------------------------------------------
 * Async Validation
 * -----------------------------------------------------------------------------------------------*/

function AsyncValidationDemo() {
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const handleStepValidate = async (step: number): Promise<boolean> => {
    setIsValidating(true);
    setValidationError(null);

    // Simulate async validation (API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate validation failure on step 1
    if (step === 1 && Math.random() > 0.5) {
      setValidationError("Validation failed. Please check your inputs.");
      setIsValidating(false);
      return false;
    }

    setIsValidating(false);
    return true;
  };

  return (
    <div className="space-y-4">
      {validationError && (
        <div className="rounded-lg border border-destructive p-4 bg-destructive/10">
          <p className="text-sm font-medium text-destructive">{validationError}</p>
        </div>
      )}

      <PremiumStepper 
        orientation="vertical" 
        defaultActiveStep={0}
        onStepValidate={handleStepValidate}
      >
        <PremiumStepperList>
          <PremiumStepperItem value="step1">
            <PremiumStepperTrigger>
              <PremiumStepperIndicator />
              <PremiumStepperLabel>Step with Validation</PremiumStepperLabel>
            </PremiumStepperTrigger>
            <PremiumStepperContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click next step to trigger async validation.
                </p>
                <Input placeholder="Enter some data..." />
              </div>
            </PremiumStepperContent>
          </PremiumStepperItem>

          <PremiumStepperConnector />

          <PremiumStepperItem value="step2">
            <PremiumStepperTrigger>
              <PremiumStepperIndicator />
              <PremiumStepperLabel>Next Step</PremiumStepperLabel>
            </PremiumStepperTrigger>
            <PremiumStepperContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Validation passed! Continue to the next step.
                </p>
              </div>
            </PremiumStepperContent>
          </PremiumStepperItem>

          <PremiumStepperConnector />

          <PremiumStepperItem value="step3">
            <PremiumStepperTrigger>
              <PremiumStepperIndicator />
              <PremiumStepperLabel>Final Step</PremiumStepperLabel>
            </PremiumStepperTrigger>
            <PremiumStepperContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All validations passed!
                </p>
              </div>
            </PremiumStepperContent>
          </PremiumStepperItem>
        </PremiumStepperList>
      </PremiumStepper>

      {isValidating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Validating...
        </div>
      )}
    </div>
  );
}

export const AsyncValidation: Story = {
  render: () => <AsyncValidationDemo />,
};

/* -------------------------------------------------------------------------------------------------
 * Custom Connectors
 * -----------------------------------------------------------------------------------------------*/

export const CustomConnectors: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Solid Connector</h3>
        <PremiumStepper orientation="vertical" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Completed Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 1</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector variant="solid" />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Active Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 2</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector variant="solid" />
            <PremiumStepperItem value="step3">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Pending Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 3</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dashed Connector</h3>
        <PremiumStepper orientation="vertical" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Completed Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 1</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector variant="dashed" />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Active Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 2</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector variant="dashed" />
            <PremiumStepperItem value="step3">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Pending Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 3</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Gradient Connector</h3>
        <PremiumStepper orientation="vertical" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Completed Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 1</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector variant="gradient" />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Active Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 2</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector variant="gradient" />
            <PremiumStepperItem value="step3">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Pending Step</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Content 3</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Branching Flow
 * -----------------------------------------------------------------------------------------------*/

function BranchingFlowDemo() {
  const [accountType, setAccountType] = React.useState<"personal" | "business" | null>(null);

  return (
    <PremiumStepper orientation="vertical" nonLinear defaultActiveStep={0}>
      <PremiumStepperList>
        <PremiumStepperItem value="account-type">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Choose Account Type</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={accountType === "personal" ? "default" : "outline"}
                  onClick={() => setAccountType("personal")}
                  className="h-24 flex-col"
                >
                  <User className="size-6 mb-2" />
                  Personal
                </Button>
                <Button
                  variant={accountType === "business" ? "default" : "outline"}
                  onClick={() => setAccountType("business")}
                  className="h-24 flex-col"
                >
                  <CreditCard className="size-6 mb-2" />
                  Business
                </Button>
              </div>
            </div>
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector />

        {accountType === "personal" && (
          <>
            <PremiumStepperItem value="personal-details">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Personal Details</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>
                <div className="space-y-4">
                  <Input placeholder="Full Name" />
                  <Input placeholder="Date of Birth" type="date" />
                  <Input placeholder="Phone Number" />
                </div>
              </PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
          </>
        )}

        {accountType === "business" && (
          <>
            <PremiumStepperItem value="business-details">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Business Details</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>
                <div className="space-y-4">
                  <Input placeholder="Company Name" />
                  <Input placeholder="Tax ID" />
                  <Input placeholder="Business Address" />
                </div>
              </PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
          </>
        )}

        {accountType && (
          <PremiumStepperItem value="confirmation">
            <PremiumStepperTrigger>
              <PremiumStepperIndicator />
              <PremiumStepperLabel>Confirmation</PremiumStepperLabel>
            </PremiumStepperTrigger>
            <PremiumStepperContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your {accountType} account is ready to be created!
                </p>
                <Button className="w-full">Create Account</Button>
              </div>
            </PremiumStepperContent>
          </PremiumStepperItem>
        )}
      </PremiumStepperList>
    </PremiumStepper>
  );
}

export const BranchingFlow: Story = {
  render: () => <BranchingFlowDemo />,
};

/* -------------------------------------------------------------------------------------------------
 * All Variants (Vertical)
 * -----------------------------------------------------------------------------------------------*/

export const VerticalVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <PremiumStepper orientation="vertical" variant="default" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Completed</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 1 content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Active</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 2 content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step3">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Pending</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 3 content</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Outlined Variant</h3>
        <PremiumStepper orientation="vertical" variant="outlined" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Completed</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 1 content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Active</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 2 content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step3">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Pending</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 3 content</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Simple Variant</h3>
        <PremiumStepper orientation="vertical" variant="simple" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Completed</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 1 content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Active</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 2 content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step3">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Pending</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Step 3 content</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Sizes
 * -----------------------------------------------------------------------------------------------*/

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small</h3>
        <PremiumStepper orientation="vertical" size="sm" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Step 1</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Small content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Step 2</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Small content</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Medium (Default)</h3>
        <PremiumStepper orientation="vertical" size="md" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Step 1</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Medium content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Step 2</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Medium content</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Large</h3>
        <PremiumStepper orientation="vertical" size="lg" defaultActiveStep={1}>
          <PremiumStepperList>
            <PremiumStepperItem value="step1">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Step 1</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Large content</PremiumStepperContent>
            </PremiumStepperItem>
            <PremiumStepperConnector />
            <PremiumStepperItem value="step2">
              <PremiumStepperTrigger>
                <PremiumStepperIndicator />
                <PremiumStepperLabel>Step 2</PremiumStepperLabel>
              </PremiumStepperTrigger>
              <PremiumStepperContent>Large content</PremiumStepperContent>
            </PremiumStepperItem>
          </PremiumStepperList>
        </PremiumStepper>
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------------------------------
 * Error & Optional States
 * -----------------------------------------------------------------------------------------------*/

export const ErrorAndOptionalStates: Story = {
  render: () => (
    <PremiumStepper orientation="vertical" defaultActiveStep={1}>
      <PremiumStepperList>
        <PremiumStepperItem value="step1" completed>
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Completed Step</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            This step has been completed successfully.
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector />

        <PremiumStepperItem value="step2" error>
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Step with Error</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <div className="rounded-lg border border-destructive p-4 bg-destructive/10">
              <p className="text-sm font-medium text-destructive">
                Please fix the errors before proceeding.
              </p>
            </div>
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector />

        <PremiumStepperItem value="step3" optional>
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Optional Step</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            This step is optional and can be skipped.
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector />

        <PremiumStepperItem value="step4" disabled>
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Disabled Step</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            This step is currently disabled.
          </PremiumStepperContent>
        </PremiumStepperItem>
      </PremiumStepperList>
    </PremiumStepper>
  ),
};
