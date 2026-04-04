import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Terminal,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";

import { Alert, AlertTitle, AlertDescription, AlertAction } from "./index";
import { Button } from "../button";

const meta: Meta<typeof Alert> = {
  title: "Free/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Alert is a non-modal notification element for displaying informational messages inline with content.

## Key Differences from Other Notification Components

| Component | Type | Duration | Position | Use Case |
|-----------|------|----------|----------|----------|
| **Alert** | Non-modal, inline | Persistent | In content flow | Status updates, form validation, warnings |
| **Toast** | Non-modal, overlay | Auto-dismisses | Corner of screen | Temporary feedback, confirmations |
| **Dialog** | Modal | Until dismissed | Centered overlay | General confirmations, forms |
| **Alert Dialog** | Modal | Until action | Centered overlay | Critical confirmations requiring response |

## When to Use Alert
- Displaying important information that should remain visible
- Form validation messages
- Status updates that don't require immediate action
- Warnings about current state or configuration
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "success", "warning", "info"],
      description: "The semantic variant of the alert",
    },
    dismissible: {
      control: "boolean",
      description: "Whether the alert can be dismissed",
    },
    showIcon: {
      control: "boolean",
      description: "Whether to show the default variant icon",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// =============================================================================
// Basic Stories
// =============================================================================

/**
 * Default alert with title and description
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components and dependencies to your app using the CLI.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Alert with only a title (no description)
 */
export const TitleOnly: Story = {
  args: {
    children: <AlertTitle>This is an alert with only a title.</AlertTitle>,
  },
};

/**
 * Alert with custom icon
 */
export const WithCustomIcon: Story = {
  args: {
    icon: <Terminal className="size-4" />,
    children: (
      <>
        <AlertTitle>Terminal Command</AlertTitle>
        <AlertDescription>
          Run <code className="font-mono bg-muted px-1 rounded">npm install</code> to install dependencies.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Alert without any icon
 */
export const WithoutIcon: Story = {
  args: {
    showIcon: false,
    children: (
      <>
        <AlertTitle>No Icon Alert</AlertTitle>
        <AlertDescription>
          This alert has no icon for a cleaner look.
        </AlertDescription>
      </>
    ),
  },
};

// =============================================================================
// Variant Stories
// =============================================================================

/**
 * Destructive variant for errors
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Success variant for confirmations
 */
export const Success: Story = {
  args: {
    variant: "success",
    children: (
      <>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Warning variant for cautions
 */
export const Warning: Story = {
  args: {
    variant: "warning",
    children: (
      <>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Your storage is almost full. Consider upgrading your plan.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Info variant for informational messages
 */
export const InfoVariant: Story = {
  args: {
    variant: "info",
    children: (
      <>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          A new version of the application is available. Refresh to update.
        </AlertDescription>
      </>
    ),
  },
};

// =============================================================================
// Interactive Stories
// =============================================================================

/**
 * Dismissible alert that can be closed
 */
export const Dismissible: Story = {
  args: {
    variant: "info",
    dismissible: true,
    onDismiss: () => console.log("Alert dismissed"),
    children: (
      <>
        <AlertTitle>Dismissible Alert</AlertTitle>
        <AlertDescription>
          Click the X button to dismiss this alert.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Alert with action buttons
 */
export const WithActions: Story = {
  args: {
    variant: "warning",
    children: (
      <>
        <AlertTitle>Unsaved Changes</AlertTitle>
        <AlertDescription>
          You have unsaved changes that will be lost if you leave this page.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" colorStyle="outlined">
            Discard
          </Button>
          <Button size="sm">
            Save Changes
          </Button>
        </AlertAction>
      </>
    ),
  },
};

/**
 * Dismissible alert with actions
 */
export const DismissibleWithActions: Story = {
  args: {
    variant: "success",
    dismissible: true,
    children: (
      <>
        <AlertTitle>Payment Successful</AlertTitle>
        <AlertDescription>
          Your order #12345 has been confirmed. You will receive an email shortly.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" colorStyle="outlined">
            View Order
          </Button>
        </AlertAction>
      </>
    ),
  },
};

// =============================================================================
// Content Variations
// =============================================================================

/**
 * Alert with rich content in description
 */
export const RichContent: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <AlertTitle>Unable to process your payment</AlertTitle>
        <AlertDescription>
          <p>Please verify your billing information and try again.</p>
          <ul className="list-inside list-disc text-sm mt-2">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Alert with inline code
 */
export const WithCode: Story = {
  args: {
    icon: <Terminal className="size-4" />,
    children: (
      <>
        <AlertTitle>Installation Required</AlertTitle>
        <AlertDescription>
          Run the following command to install the package:
          <pre className="mt-2 bg-muted p-2 rounded-md font-mono text-xs">
            npm install @agentix/ui
          </pre>
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Long content alert
 */
export const LongContent: Story = {
  args: {
    variant: "info",
    children: (
      <>
        <AlertTitle>Privacy Policy Update</AlertTitle>
        <AlertDescription>
          We have updated our privacy policy to comply with new regulations. 
          The changes include how we collect, store, and process your personal data. 
          We encourage you to review the updated policy to understand how your 
          information is being used and what rights you have regarding your data.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" colorStyle="text">
            Learn More
          </Button>
        </AlertAction>
      </>
    ),
  },
};

// =============================================================================
// All Variants Showcase
// =============================================================================

/**
 * All alert variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-4 w-full max-w-xl">
      <Alert variant="default">
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is the default alert variant.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>
          This is an informational alert.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>
          This is a success alert.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>
          This is a warning alert.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>
          This is a destructive/error alert.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

/**
 * All variants with custom icons
 */
export const CustomIconsShowcase: Story = {
  render: () => (
    <div className="grid gap-4 w-full max-w-xl">
      <Alert variant="default" icon={<Terminal className="size-4" />}>
        <AlertTitle>Terminal</AlertTitle>
        <AlertDescription>
          Command line interface ready.
        </AlertDescription>
      </Alert>
      <Alert variant="info" icon={<Rocket className="size-4" />}>
        <AlertTitle>New Feature</AlertTitle>
        <AlertDescription>
          Check out our latest release features.
        </AlertDescription>
      </Alert>
      <Alert variant="success" icon={<Shield className="size-4" />}>
        <AlertTitle>Secure Connection</AlertTitle>
        <AlertDescription>
          Your connection is encrypted and secure.
        </AlertDescription>
      </Alert>
      <Alert variant="warning" icon={<Zap className="size-4" />}>
        <AlertTitle>Performance Warning</AlertTitle>
        <AlertDescription>
          High CPU usage detected.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

// =============================================================================
// Real-World Examples
// =============================================================================

/**
 * Form validation error
 */
export const FormValidationError: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>There were 2 errors with your submission</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm mt-1">
          <li>Email address is required</li>
          <li>Password must be at least 8 characters</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Subscription expiring warning
 */
export const SubscriptionWarning: Story = {
  render: () => (
    <Alert variant="warning" dismissible>
      <AlertTitle>Your subscription expires in 3 days</AlertTitle>
      <AlertDescription>
        Renew now to avoid interruption of service.
      </AlertDescription>
      <AlertAction>
        <Button size="sm">Renew Now</Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Feature announcement
 */
export const FeatureAnnouncement: Story = {
  render: () => (
    <Alert variant="info" dismissible icon={<Rocket className="size-4" />}>
      <AlertTitle>New: Dark Mode Support</AlertTitle>
      <AlertDescription>
        We've added dark mode! Toggle it in your settings to try it out.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" colorStyle="outlined">
          Go to Settings
        </Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Order confirmation
 */
export const OrderConfirmation: Story = {
  render: () => (
    <Alert variant="success">
      <AlertTitle>Order Confirmed!</AlertTitle>
      <AlertDescription>
        <p>Thank you for your purchase. Order #ORD-2024-1234</p>
        <p className="mt-1 text-xs">
          Estimated delivery: January 15, 2026
        </p>
      </AlertDescription>
      <AlertAction>
        <Button size="sm" colorStyle="outlined">
          Track Order
        </Button>
        <Button size="sm" colorStyle="text">
          View Receipt
        </Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * System maintenance notice
 */
export const MaintenanceNotice: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>Scheduled Maintenance</AlertTitle>
      <AlertDescription>
        The system will be unavailable on January 10, 2026 from 2:00 AM to 4:00 AM EST 
        for scheduled maintenance. Please save your work before this time.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Cookie consent banner style
 */
export const CookieConsent: Story = {
  render: () => (
    <Alert variant="default" showIcon={false}>
      <AlertTitle>We use cookies</AlertTitle>
      <AlertDescription>
        This website uses cookies to ensure you get the best experience. 
        By continuing to use this site, you agree to our use of cookies.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" colorStyle="outlined">
          Customize
        </Button>
        <Button size="sm">
          Accept All
        </Button>
      </AlertAction>
    </Alert>
  ),
};
