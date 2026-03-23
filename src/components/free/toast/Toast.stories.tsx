import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  ToastProvider,
  toast,
  useToast,
  type ToastPosition,
} from "./index";
import { Button } from "../button";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";
import { Bell, Download, Mail, Send, Trash2, Upload } from "lucide-react";

const meta: Meta<typeof ToastProvider> = {
  title: "Free/Overlay/Toast",
  component: ToastProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
    duration: {
      control: { type: "number", min: 1000, max: 10000, step: 500 },
    },
    maxToasts: {
      control: { type: "number", min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Helper wrapper for stories
// ============================================================================

function ToastStoryWrapper({
  children,
  position = "bottom-right",
  maxToasts = 5,
}: {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}) {
  return (
    <ToastProvider position={position} maxToasts={maxToasts}>
      <div className="flex min-h-[300px] min-w-[400px] items-center justify-center">
        {children}
      </div>
    </ToastProvider>
  );
}

// ============================================================================
// Basic Toast Stories
// ============================================================================

/**
 * Default toast using the useToast hook - the preferred approach for React components.
 */
export const Default: Story = {
  render: () => (
    <ToastStoryWrapper>
      <DefaultDemo />
    </ToastStoryWrapper>
  ),
};

function DefaultDemo() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Event has been created",
          description: "Monday, January 3rd at 6:00pm",
        });
      }}
    >
      Show Toast
    </Button>
  );
}

/**
 * Using the imperative toast() API - useful outside React components.
 * Note: This still requires ToastProvider to be mounted.
 */
export const ImperativeAPI: Story = {
  render: () => (
    <ToastStoryWrapper>
      <ImperativeDemo />
    </ToastStoryWrapper>
  ),
};

function ImperativeDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground max-w-xs text-center">
        The imperative <code className="bg-muted px-1 rounded">toast()</code>{" "}
        API works anywhere, but requires ToastProvider mounted.
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        <Button
          onClick={() =>
            toast({
              title: "Quick message!",
            })
          }
          colorStyle="outlined"
          size="sm"
        >
          Message Toast
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Detailed Toast",
              description: "With more details",
            })
          }
          colorStyle="outlined"
          size="sm"
        >
          Detailed Toast
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Variant Stories
// ============================================================================

/**
 * All toast variants for different semantic purposes.
 */
export const Variants: Story = {
  render: () => (
    <ToastStoryWrapper>
      <VariantsDemo />
    </ToastStoryWrapper>
  ),
};

function VariantsDemo() {
  const { toast } = useToast();
  
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => toast({ title: "Default notification" })}>
        Default
      </Button>
      <Button
        colorStyle="tonal"
        onClick={() =>
          toast.success({
            title: "Success!",
            description: "Your action was completed successfully.",
          })
        }
      >
        Success
      </Button>
      <Button
        colorStyle="tonal"
        onClick={() =>
          toast.warning({
            title: "Warning!",
            description: "This action requires your attention.",
          })
        }
      >
        Warning
      </Button>
      <Button
        colorStyle="destructive"
        onClick={() =>
          toast.error({
            title: "Error!",
            description: "Something went wrong. Please try again.",
          })
        }
      >
        Error / Destructive
      </Button>
      <Button
        colorStyle="outlined"
        onClick={() =>
          toast.info({
            title: "Information",
            description: "Here's some useful information.",
          })
        }
      >
        Info
      </Button>
    </div>
  );
}

// ============================================================================
// Action Button Stories
// ============================================================================

/**
 * Toast with an action button for user interaction.
 */
export const WithAction: Story = {
  render: () => (
    <ToastStoryWrapper>
      <WithActionDemo />
    </ToastStoryWrapper>
  ),
};

function WithActionDemo() {
  const { toast } = useToast();
  
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast({
            title: "Message sent",
            description: "Your message has been delivered.",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo clicked"),
            },
          })
        }
      >
        Toast with Undo
      </Button>
      <Button
        colorStyle="destructive"
        onClick={() =>
          toast.error({
            title: "Item deleted",
            description: "1 item was moved to trash.",
            action: {
              label: "Restore",
              onClick: () => {
                toast.success({ title: "Item restored!" });
                return false; // Prevent auto-dismiss
              },
            },
          })
        }
      >
        Delete with Restore
      </Button>
    </div>
  );
}

// ============================================================================
// Avatar Integration
// ============================================================================

/**
 * Toast with avatar integration for user-related notifications.
 */
export const WithAvatar: Story = {
  render: () => (
    <ToastStoryWrapper>
      <WithAvatarDemo />
    </ToastStoryWrapper>
  ),
};

function WithAvatarDemo() {
  const { toast } = useToast();
  
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast({
            title: "New message from Sarah",
            description: "Hey! Are you available for a quick call?",
            avatar: (
              <Avatar size="sm">
                <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Sarah" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            ),
            action: {
              label: "Reply",
              onClick: () => console.log("Reply clicked"),
            },
          })
        }
      >
        Message Notification
      </Button>
      <Button
        colorStyle="tonal"
        onClick={() =>
          toast.success({
            title: "John liked your post",
            description: '"Great work on the presentation!"',
            avatar: (
              <Avatar size="sm">
                <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="John" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            ),
          })
        }
      >
        Social Notification
      </Button>
    </div>
  );
}

// ============================================================================
// Custom Icon
// ============================================================================

/**
 * Toast with custom icons (overrides variant default).
 */
export const WithCustomIcon: Story = {
  render: () => (
    <ToastStoryWrapper>
      <WithCustomIconDemo />
    </ToastStoryWrapper>
  ),
};

function WithCustomIconDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast({
            title: "Download complete",
            description: "document.pdf was saved to Downloads.",
            icon: <Download className="size-5" />,
          })
        }
      >
        <Download className="size-4 mr-2" />
        Download Complete
      </Button>
      <Button
        colorStyle="tonal"
        onClick={() =>
          toast.success({
            title: "Upload successful",
            description: "3 files uploaded to cloud.",
            icon: <Upload className="size-5" />,
          })
        }
      >
        <Upload className="size-4 mr-2" />
        Upload Success
      </Button>
      <Button
        colorStyle="outlined"
        onClick={() =>
          toast.info({
            title: "New email received",
            description: "From: team@example.com",
            icon: <Mail className="size-5" />,
          })
        }
      >
        <Mail className="size-4 mr-2" />
        New Email
      </Button>
    </div>
  );
}

// ============================================================================
// Positioning
// ============================================================================

/**
 * Toast positioning options - all 6 positions are supported.
 */
export const Positions: Story = {
  render: () => <PositionsDemo />,
};

function PositionsDemo() {
  const positions: ToastPosition[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  const [position, setPosition] = React.useState<ToastPosition>("bottom-right");

  return (
    <ToastProvider position={position}>
      <PositionsDemoInner position={position} setPosition={setPosition} positions={positions} />
    </ToastProvider>
  );
}

function PositionsDemoInner({ position, setPosition, positions }: { position: ToastPosition; setPosition: (pos: ToastPosition) => void; positions: ToastPosition[] }) {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4 min-h-[300px] min-w-[400px] items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Current position: <strong>{position}</strong>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {positions.map((pos) => (
          <Button
            key={pos}
            size="sm"
            colorStyle={position === pos ? "filled" : "outlined"}
            onClick={() => {
              setPosition(pos);
              toast({
                title: `Position: ${pos}`,
                description: "Toast will appear in this corner.",
              });
            }}
          >
            {pos}
          </Button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Duration
// ============================================================================

/**
 * Custom duration - toasts can auto-dismiss or persist indefinitely.
 */
export const CustomDuration: Story = {
  render: () => (
    <ToastStoryWrapper>
      <CustomDurationDemo />
    </ToastStoryWrapper>
  ),
};

function CustomDurationDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast({
            title: "Quick toast",
            description: "Disappears in 2 seconds",
            duration: 2000,
          })
        }
      >
        2 second toast
      </Button>
      <Button
        colorStyle="outlined"
        onClick={() =>
          toast({
            title: "Long toast",
            description: "Stays for 10 seconds",
            duration: 10000,
          })
        }
      >
        10 second toast
      </Button>
      <Button
        colorStyle="tonal"
        onClick={() =>
          toast.warning({
            title: "Persistent toast",
            description: "Must be manually dismissed",
            duration: Infinity,
            dismissible: true,
          })
        }
      >
        Persistent toast
      </Button>
    </div>
  );
}

// ============================================================================
// Dismissible
// ============================================================================

/**
 * Control the dismiss button visibility.
 */
export const DismissControl: Story = {
  render: () => (
    <ToastStoryWrapper>
      <DismissControlDemo />
    </ToastStoryWrapper>
  ),
};

function DismissControlDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast({
            title: "Dismissible toast",
            description: "Has a close button on hover",
            dismissible: true,
          })
        }
      >
        With close button
      </Button>
      <Button
        colorStyle="outlined"
        onClick={() =>
          toast({
            title: "No close button",
            description: "Auto-dismisses after timeout",
            dismissible: false,
          })
        }
      >
        Without close button
      </Button>
    </div>
  );
}

// ============================================================================
// Multiple Toasts
// ============================================================================

/**
 * Multiple toasts stack and respect maxToasts limit.
 */
export const MultipleToasts: Story = {
  args: {
    maxToasts: 3
  },
  render: (args) => (
    <ToastStoryWrapper maxToasts={args.maxToasts}>
      <MultipleToastsDemo />
    </ToastStoryWrapper>
  ),
};

function MultipleToastsDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4 min-h-[300px] min-w-[400px] items-center justify-center">
      <p className="text-sm text-muted-foreground max-w-xs text-center">
        Max 3 toasts shown. Older ones are hidden when limit reached.
      </p>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            for (let i = 1; i <= 5; i++) {
              setTimeout(() => {
                toast({
                  title: `Notification ${i}`,
                  description: `This is toast number ${i}`,
                });
              }, i * 200);
            }
          }}
        >
          Trigger 5 toasts
        </Button>
        <Button colorStyle="outlined" onClick={() => toast.dismissAll()}>
          Dismiss All
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Promise / Loading Pattern
// ============================================================================

/**
 * Update toast state - useful for async operations.
 */
export const AsyncPattern: Story = {
  render: () => (
    <ToastStoryWrapper>
      <AsyncPatternDemo />
    </ToastStoryWrapper>
  ),
};

function AsyncPatternDemo() {
  const { toast } = useToast();

  const handleAsync = () => {
    const id = toast({
      title: "Uploading...",
      description: "Please wait while we upload your file.",
      duration: Infinity,
      dismissible: false,
    });

    // Simulate async operation
    setTimeout(() => {
      toast.update(id, {
        title: "Upload complete!",
        description: "Your file has been uploaded successfully.",
        variant: "success",
        duration: 3000,
        dismissible: true,
      });
    }, 2000);
  };

  return (
    <Button onClick={handleAsync}>
      <Send className="size-4 mr-2" />
      Start Upload
    </Button>
  );
}

// ============================================================================
// Callbacks
// ============================================================================

/**
 * Toast lifecycle callbacks.
 */
export const Callbacks: Story = {
  render: () => (
    <ToastStoryWrapper>
      <CallbacksDemo />
    </ToastStoryWrapper>
  ),
};

function CallbacksDemo() {
  const { toast } = useToast();
  const [log, setLog] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev.slice(-4), message]);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() =>
          toast({
            title: "Toast with callbacks",
            description: "Check the log below",
            duration: 3000,
            onDismiss: (id) => addLog(`onDismiss: ${id}`),
            onAutoClose: (id) => addLog(`onAutoClose: ${id}`),
          })
        }
      >
        Show Toast
      </Button>
      <div className="text-xs font-mono bg-muted p-2 rounded min-h-[80px]">
        {log.length === 0 ? (
          <span className="text-muted-foreground">Callback log...</span>
        ) : (
          log.map((entry, i) => <div key={i}>{entry}</div>)
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Real-world Examples
// ============================================================================

/**
 * Real-world usage examples.
 */
export const RealWorldExamples: Story = {
  render: () => (
    <ToastStoryWrapper>
      <RealWorldDemo />
    </ToastStoryWrapper>
  ),
};

function RealWorldDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast.success({
            title: "Changes saved",
            description: "Your profile has been updated.",
          })
        }
      >
        Save Profile
      </Button>
      <Button
        colorStyle="destructive"
        onClick={() => {
          const id = toast.error({
            title: "Failed to save",
            description: "Network error. Check your connection.",
            duration: Infinity,
            action: {
              label: "Retry",
              onClick: () => {
                toast.dismiss(id);
                setTimeout(() => {
                  toast.success({ title: "Saved!" });
                }, 500);
              },
            },
          });
        }}
      >
        <Trash2 className="size-4 mr-2" />
        Simulate Error
      </Button>
      <Button
        colorStyle="outlined"
        onClick={() =>
          toast.info({
            title: "New notification",
            description: "You have 3 unread messages.",
            avatar: (
              <div className="relative">
                <Bell className="size-5" />
                <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full" />
              </div>
            ),
            action: {
              label: "View",
              onClick: () => console.log("View notifications"),
            },
          })
        }
      >
        <Bell className="size-4 mr-2" />
        New Notification
      </Button>
    </div>
  );
}

// ============================================================================
// Toast vs Snackbar Types
// ============================================================================

/**
 * Toast type="toast" allows interactive buttons (up to 2 actions).
 * Toast type="snackbar" is information-only with no action buttons.
 */
export const ToastVsSnackbar: Story = {
  render: () => (
    <ToastStoryWrapper>
      <ToastVsSnackbarDemo />
    </ToastStoryWrapper>
  ),
};

function ToastVsSnackbarDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Type: "toast" (Interactive)</h4>
        <p className="text-xs text-muted-foreground">
          Supports action buttons for user interaction (max 2)
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() =>
              toast({
                type: "toast",
                title: "File uploaded",
                description: "document.pdf is now available",
                action: {
                  label: "View",
                  onClick: () => console.log("View file"),
                },
              })
            }
            size="sm"
          >
            Single Action
          </Button>
          <Button
            onClick={() =>
              toast({
                type: "toast",
                title: "New message",
                description: "From: john@example.com",
                action: {
                  label: "Reply",
                  onClick: () => console.log("Reply"),
                },
                secondaryAction: {
                  label: "Archive",
                  onClick: () => console.log("Archive"),
                },
              })
            }
            size="sm"
            colorStyle="outlined"
          >
            Two Actions
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Type: "snackbar" (Info-only)</h4>
        <p className="text-xs text-muted-foreground">
          No action buttons, only displays information
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() =>
              toast({
                type: "snackbar",
                title: "Connection restored",
                description: "You are now back online",
                variant: "success",
              })
            }
            size="sm"
            colorStyle="tonal"
          >
            Info Snackbar
          </Button>
          <Button
            onClick={() =>
              toast({
                type: "snackbar",
                title: "Settings synced",
                variant: "default",
                // Action will be ignored for snackbar type
                action: {
                  label: "This won't show",
                  onClick: () => {},
                },
              })
            }
            size="sm"
            colorStyle="outlined"
          >
            Snackbar (ignores actions)
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Scoped Toast Demonstration
// ============================================================================

/**
 * Each ToastProvider creates its own isolated toast context.
 * Toasts triggered in one story won't appear in other stories.
 */
export const ScopedToasts: Story = {
  render: () => (
    <div className="flex gap-4 min-h-[400px]">
      <ToastProvider position="bottom-left">
        <div className="border rounded-lg p-4 flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Left Zone</h4>
          <p className="text-xs text-muted-foreground">
            Toasts appear bottom-left
          </p>
          <ScopedDemo label="Left" />
        </div>
      </ToastProvider>

      <ToastProvider position="bottom-right">
        <div className="border rounded-lg p-4 flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Right Zone</h4>
          <p className="text-xs text-muted-foreground">
            Toasts appear bottom-right
          </p>
          <ScopedDemo label="Right" />
        </div>
      </ToastProvider>
    </div>
  ),
};

function ScopedDemo({ label }: { label: string }) {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast.success({
            title: `${label} Zone Toast`,
            description: "Only visible in this zone",
          })
        }
        size="sm"
      >
        Show Toast
      </Button>
      <Button
        onClick={() =>
          toast({
            type: "snackbar",
            title: `${label} Snackbar`,
            variant: "info",
          })
        }
        size="sm"
        colorStyle="outlined"
      >
        Show Snackbar
      </Button>
    </div>
  );
}