import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  PremiumToastProvider,
  usePremiumToast,
  premiumToast,
  type PremiumToastOptions,
} from "./api";
import { Button } from "../button";
import { Avatar } from "../avatar";
import { Trash2, Send, Download, Upload, Mail, Bell, Save, Loader2, CheckCircle2, XCircle } from "lucide-react";

const meta: Meta = {
  title: "Feedback/Toast",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// ============================================================================
// Story Wrapper
// ============================================================================

function PremiumToastStoryWrapper({ children, maxToasts = 5 }: { children: React.ReactNode; maxToasts?: number }) {
  return (
    <PremiumToastProvider position="bottom-right" maxToasts={maxToasts}>
      {children}
    </PremiumToastProvider>
  );
}

// ============================================================================
// Basic Usage
// ============================================================================

/**
 * Basic premium toast with undo functionality.
 */
export const Default: Story = {
  render: () => (
    <PremiumToastStoryWrapper>
      <DefaultDemo />
    </PremiumToastStoryWrapper>
  ),
};

function DefaultDemo() {
  const { toast } = usePremiumToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: "Item deleted",
          description: "The item has been removed from your list.",
          undo: {
            onUndo: () => console.log("Undo delete"),
          },
        })
      }
    >
      Delete with Undo
    </Button>
  );
}

// ============================================================================
// Promise-based Loading States
// ============================================================================

/**
 * Promise-based toast automatically updates from loading → success/error.
 */
export const PromiseToast: Story = {
  render: () => (
    <PremiumToastStoryWrapper>
      <PromiseDemo />
    </PremiumToastStoryWrapper>
  ),
};

function PromiseDemo() {
  const { toast } = usePremiumToast();

  const handleSuccess = async () => {
    const mockApi = () =>
      new Promise<{ name: string }>((resolve) => {
        setTimeout(() => resolve({ name: "Document.pdf" }), 2000);
      });

    await toast.promise(mockApi(), {
      loading: { title: "Uploading file..." },
      success: { title: "Document.pdf uploaded successfully!" },
      error: { title: "Upload failed" },
    });
  };

  const handleError = async () => {
    const mockApi = () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Network error")), 2000);
      });

    try {
      await toast.promise(mockApi(), {
        loading: { title: "Processing..." },
        success: { title: "Success!" },
        error: { title: "Network error" },
      });
    } catch {
      // Error handled by toast
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleSuccess}>
        <Upload className="size-4 mr-2" />
        Successful Upload
      </Button>
      <Button colorStyle="destructive" onClick={handleError}>
        <Upload className="size-4 mr-2" />
        Failed Upload
      </Button>
    </div>
  );
}

// ============================================================================
// Undo Functionality
// ============================================================================

/**
 * All variants support undo functionality for reversible actions.
 */
export const UndoExamples: Story = {
  render: () => (
    <PremiumToastStoryWrapper>
      <UndoDemo />
    </PremiumToastStoryWrapper>
  ),
};

function UndoDemo() {
  const { toast } = usePremiumToast();
  const [items, setItems] = React.useState(["Item 1", "Item 2", "Item 3"]);

  const deleteItem = (index: number) => {
    const deletedItem = items[index];
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);

    toast.success({
      title: "Item deleted",
      description: `"${deletedItem}" has been removed`,
      undo: {
        label: "Undo",
        onUndo: () => {
          setItems([...items]);
          toast.info({ title: "Deletion undone" });
        },
      },
    });
  };

  return (
    <div className="space-y-4 min-w-[300px]">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
            <span>{item}</span>
            <Button
              size="sm"
              colorStyle="destructive"
              onClick={() => deleteItem(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">All items deleted</p>
      )}
    </div>
  );
}

// ============================================================================
// Custom Button Variants
// ============================================================================

/**
 * Customize action button styles using the colorStyle prop.
 */
export const CustomButtonStyles: Story = {
  render: () => (
    <PremiumToastStoryWrapper>
      <CustomButtonStylesDemo />
    </PremiumToastStoryWrapper>
  ),
};

function CustomButtonStylesDemo() {
  const { toast } = usePremiumToast();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast.success({
            title: "Save successful",
            description: "Your changes have been saved.",
            action: {
              label: "View",
              colorStyle: "filled",
              onClick: () => console.log("View clicked"),
            },
          })
        }
      >
        Filled Button
      </Button>
      <Button
        colorStyle="outlined"
        onClick={() =>
          toast.info({
            title: "Update available",
            description: "A new version is ready to install.",
            action: {
              label: "Update",
              colorStyle: "outlined",
              onClick: () => console.log("Update clicked"),
            },
          })
        }
      >
        Outlined Button
      </Button>
      <Button
        colorStyle="text"
        onClick={() =>
          toast.warning({
            title: "Warning",
            description: "This action cannot be undone.",
            action: {
              label: "Continue",
              colorStyle: "text",
              onClick: () => console.log("Continue clicked"),
            },
          })
        }
      >
        Text Button
      </Button>
    </div>
  );
}

// ============================================================================
// Real-world Examples
// ============================================================================

/**
 * Real-world usage patterns combining promise toasts and undo.
 */
export const RealWorldExamples: Story = {
  render: () => (
    <PremiumToastStoryWrapper>
      <RealWorldDemo />
    </PremiumToastStoryWrapper>
  ),
};

function RealWorldDemo() {
  const { toast } = usePremiumToast();
  const [savedData, setSavedData] = React.useState<any>(null);

  const handleSaveWithUndo = () => {
    const previousData = savedData;
    const newData = { timestamp: Date.now(), value: Math.random() };
    setSavedData(newData);

    toast.success({
      title: "Changes saved",
      description: "Your settings have been updated.",
      undo: {
        onUndo: () => {
          setSavedData(previousData);
          toast.info({ title: "Changes reverted" });
        },
      },
    });
  };

  const handleAsyncSave = async () => {
    const mockApi = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          setSavedData({ timestamp: Date.now(), value: Math.random() });
          resolve({ success: true });
        }, 2000);
      });

    await toast.promise(mockApi(), {
      loading: {
        title: "Saving changes...",
        description: "Please wait",
      },
      success: {
        title: "Saved successfully!",
        description: "Your changes are now live.",
      },
      error: {
        title: "Failed to save",
        description: "Please try again later.",
      },
    });
  };

  const handleDelete = async () => {
    const previousData = savedData;
    
    const mockApi = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          setSavedData(null);
          resolve({ success: true });
        }, 1500);
      });

    await toast.promise(mockApi(), {
      loading: {
        title: "Deleting...",
      },
      success: {
        title: "Deleted successfully",
        undo: {
          onUndo: () => {
            setSavedData(previousData);
            toast.info({ title: "Deletion cancelled" });
          },
        },
      },
      error: {
        title: "Failed to delete",
      },
    });
  };

  return (
    <div className="space-y-4 min-w-[300px]">
      <div className="p-4 bg-muted rounded">
        <p className="text-sm font-medium mb-2">Current Data:</p>
        <pre className="text-xs">{savedData ? JSON.stringify(savedData, null, 2) : "No data"}</pre>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleSaveWithUndo}>
          <Save className="size-4 mr-2" />
          Quick Save (with undo)
        </Button>
        <Button colorStyle="outlined" onClick={handleAsyncSave}>
          <Upload className="size-4 mr-2" />
          Async Save (promise)
        </Button>
        <Button
          colorStyle="destructive"
          onClick={handleDelete}
          disabled={!savedData}
        >
          <Trash2 className="size-4 mr-2" />
          Delete (promise + undo)
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Imperative API
// ============================================================================

/**
 * Premium toast can be used imperatively outside React components.
 */
export const ImperativeAPI: Story = {
  render: () => (
    <PremiumToastStoryWrapper>
      <PremiumImperativeDemo />
    </PremiumToastStoryWrapper>
  ),
};

function PremiumImperativeDemo() {
  const { toast } = usePremiumToast();

  return (
    <div className="flex flex-col gap-2 min-w-[300px]">
      <Button
        onClick={() =>
          toast.success({
            title: "Imperative toast",
            description: "Created outside component",
            undo: {
              onUndo: () => console.log("Undo clicked"),
            },
          })
        }
      >
        Imperative Toast
      </Button>
      <Button
        colorStyle="outlined"
        onClick={async () => {
          const mockApi = () =>
            new Promise((resolve) => setTimeout(resolve, 2000));

          await toast.promise(mockApi(), {
            loading: { title: "Processing..." },
            success: { title: "Complete!" },
            error: { title: "Failed!" },
          });
        }}
      >
        Imperative Promise
      </Button>
    </div>
  );
}

// ============================================================================
// Multiple Actions with Undo
// ============================================================================

/**
 * Combining custom action with undo functionality.
 */
export const MultipleActionsWithUndo: Story = {
  render: () => (
    <PremiumToastStoryWrapper>
      <MultipleActionsDemo />
    </PremiumToastStoryWrapper>
  ),
};

function MultipleActionsDemo() {
  const { toast } = usePremiumToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: "Message sent",
          description: "Your message has been delivered.",
          undo: {
            label: "Undo",
            onUndo: () => console.log("Message unsent"),
          },
          action: {
            label: "View",
            colorStyle: "tonal",
            onClick: () => console.log("View message"),
          },
        })
      }
    >
      Send with View & Undo
    </Button>
  );
}
