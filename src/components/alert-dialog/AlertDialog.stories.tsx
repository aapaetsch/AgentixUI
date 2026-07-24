import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Trash2,
  LogOut,
  AlertTriangle,
  CreditCard,
  Mail,
  Settings,
  Shield,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./index";
import { Button } from "../button";

const meta: Meta<typeof AlertDialog> = {
  title: "Overlay/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
AlertDialog is a modal dialog that interrupts users with critical content requiring a response.

## Key Differences from Other Components

| Component | Type | Use Case | User Action |
|-----------|------|----------|-------------|
| **AlertDialog** | Modal, blocking | Critical confirmations | Required (confirm/cancel) |
| **Dialog** | Modal | General purpose forms, content | Optional (can be dismissed) |
| **Alert** | Non-modal, inline | Status messages, warnings | None required |
| **Toast** | Non-modal, overlay | Temporary feedback | Optional dismiss |

## When to Use AlertDialog
- Confirming destructive actions (delete, remove)
- Irreversible operations
- Actions with significant consequences
- Required user acknowledgment before proceeding
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

// =============================================================================
// Basic Stories
// =============================================================================

/**
 * Default alert dialog for confirmation
 */
export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="outlined">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Destructive Actions
// =============================================================================

/**
 * Delete confirmation dialog
 */
export const DeleteConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="destructive">
          <Trash2 className="size-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? All of your data will
            be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction colorStyle="destructive">
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Remove item confirmation
 */
export const RemoveItem: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="outlined" size="sm">
          <Trash2 className="size-4 mr-2" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove "Project Alpha" from your workspace?
            This will not delete the project, but you will need to be invited
            again to access it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction colorStyle="destructive">Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Session & Auth
// =============================================================================

/**
 * Logout confirmation
 */
export const LogoutConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="ghost">
          <LogOut className="size-4 mr-2" />
          Log Out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of all devices. Any unsaved changes will be
            lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay Logged In</AlertDialogCancel>
          <AlertDialogAction>Log Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Session expiry warning
 */
export const SessionExpiry: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expiring</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in 5 minutes due to inactivity. Would you
            like to stay logged in?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Log Out Now</AlertDialogCancel>
          <AlertDialogAction>Stay Logged In</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Data & Operations
// =============================================================================

/**
 * Discard changes confirmation
 */
export const DiscardChanges: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="outlined">Close Editor</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes in your document. If you leave now, your
            changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Editing</AlertDialogCancel>
          <AlertDialogAction colorStyle="destructive">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Cancel subscription
 */
export const CancelSubscription: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="outlined">
          <CreditCard className="size-4 mr-2" />
          Cancel Subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            Your subscription will remain active until the end of the current
            billing period (January 31, 2026). After that, you will lose access
            to premium features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction colorStyle="destructive">
            Cancel Subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Warnings & Notices
// =============================================================================

/**
 * Warning before proceeding
 */
export const WarningDialog: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="outlined">
          <AlertTriangle className="size-4 mr-2" />
          Enable Advanced Mode
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-warning" />
            Enable Advanced Mode?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Advanced mode gives you access to experimental features that may be
            unstable. Use at your own risk. You can disable this at any time in
            settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Enable</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Security verification
 */
export const SecurityVerification: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Shield className="size-4 mr-2" />
          Change Security Settings
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Your Identity</AlertDialogTitle>
          <AlertDialogDescription>
            For your security, we need to verify your identity before making
            changes to your security settings. We'll send a verification code to
            your registered email address.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Mail className="size-4 mr-2" />
            Send Verification Code
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Controlled State
// =============================================================================

/**
 * Controlled alert dialog with custom state management
 */
export const ControlledDialog: Story = {
  render: function ControlledDialogStory() {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
      setIsDeleting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsDeleting(false);
      setOpen(false);
    };

    return (
      <>
        <Button colorStyle="destructive" onClick={() => setOpen(true)}>
          <Trash2 className="size-4 mr-2" />
          Delete Project
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "My Project"? This action cannot
                be undone and all associated data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                colorStyle="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
};

// =============================================================================
// Content Variations
// =============================================================================

/**
 * Dialog with long description
 */
export const LongDescription: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="outlined">
          <Settings className="size-4 mr-2" />
          Reset Settings
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset All Settings</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all your personalized settings to their default
            values. This includes:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Theme and appearance preferences</li>
              <li>Notification settings</li>
              <li>Privacy and security options</li>
              <li>Keyboard shortcuts</li>
              <li>Display and accessibility settings</li>
            </ul>
            <p className="mt-2">
              Your account data, projects, and files will not be affected.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Reset Settings</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Simple confirmation without description
 */
export const SimpleConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button colorStyle="outlined">Mark as Complete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark task as complete?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Complete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Multiple Dialogs
// =============================================================================

/**
 * Multiple alert dialogs on the same page
 */
export const MultipleDialogs: Story = {
  render: () => (
    <div className="flex gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button colorStyle="outlined">Edit</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Item</AlertDialogTitle>
            <AlertDialogDescription>
              Make changes to this item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button colorStyle="outlined">Duplicate</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Item</AlertDialogTitle>
            <AlertDialogDescription>
              Create a copy of this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Duplicate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button colorStyle="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction colorStyle="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
};
