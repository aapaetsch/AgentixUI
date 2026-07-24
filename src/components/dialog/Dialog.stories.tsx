import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  User,
  Settings,
  CreditCard,
  Mail,
  Lock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Trash2,
  Save,
  X,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPages,
  useDialogPages,
  useResponsiveDialog,
} from "./index";
import { Button } from "../Button";
import { Input } from "../Input";

/**
 * A modal dialog component for displaying content that requires user interaction.
 * Built on Radix UI Dialog primitive with Material Design 3 styling.
 *
 * ## Features
 * - 6 size variants: `xs`, `sm`, `md`, `lg`, `xl`, `full`
 * - 3 position variants: `center`, `top`, `fullscreen`
 * - Multi-page support with slide/fade transitions
 * - Nested dialog support with proper stacking
 * - Responsive fullscreen mode for mobile
 * - Accessible with proper focus management
 * - M3 motion animations for open/close
 *
 * ## Usage
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description</DialogDescription>
 *     </DialogHeader>
 *     <div>Content</div>
 *     <DialogFooter>
 *       <Button>Action</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
const meta: Meta<typeof Dialog> = {
  title: "Overlay/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a basic dialog with a title and description. Click outside
            or press escape to close.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Dialog content goes here. You can put any content inside the dialog.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button colorStyle="ghost">Cancel</Button>
          </DialogClose>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog has no close button. Use the buttons below to close it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button colorStyle="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Confirm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button colorStyle="outlined">{size.toUpperCase()}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size: {size.toUpperCase()}</DialogTitle>
              <DialogDescription>
                This dialog uses the {size} size variant.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                The dialog width is constrained based on the size prop.
                xs: 320px, sm: 400px, md: 500px, lg: 640px, xl: 800px.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

// ============================================================================
// Position Variants
// ============================================================================

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button colorStyle="outlined">Center (Default)</Button>
        </DialogTrigger>
        <DialogContent position="center">
          <DialogHeader>
            <DialogTitle>Centered Dialog</DialogTitle>
            <DialogDescription>
              This dialog is centered on the screen with a zoom animation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button colorStyle="outlined">Top</Button>
        </DialogTrigger>
        <DialogContent position="top">
          <DialogHeader>
            <DialogTitle>Top-Positioned Dialog</DialogTitle>
            <DialogDescription>
              This dialog appears near the top of the screen with a slide-down animation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button colorStyle="outlined">Fullscreen</Button>
        </DialogTrigger>
        <DialogContent position="fullscreen">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <DialogTitle>Fullscreen Dialog</DialogTitle>
              <DialogDescription>
                This dialog covers the entire viewport. Great for mobile or complex content.
              </DialogDescription>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <p className="text-sm text-muted-foreground">
                Content area that can scroll if needed.
              </p>
            </div>
            <div className="border-t p-4">
              <DialogClose asChild>
                <Button className="w-full">Close</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

// ============================================================================
// Responsive Dialog
// ============================================================================

export const ResponsiveFullscreen: Story = {
  name: "Responsive (Fullscreen on Mobile)",
  render: function ResponsiveDemo() {
    const { isMobile, position } = useResponsiveDialog(640);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Current mode: <strong>{isMobile ? "Mobile (Fullscreen)" : "Desktop (Centered)"}</strong>
        </p>
        <p className="text-xs text-muted-foreground">
          Resize the viewport below 640px to see fullscreen mode.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Responsive Dialog</Button>
          </DialogTrigger>
          <DialogContent position={position} size="md">
            {position === "fullscreen" ? (
              <div className="flex h-full flex-col">
                <div className="border-b p-4">
                  <DialogTitle>Responsive Dialog</DialogTitle>
                  <DialogDescription>
                    This dialog automatically switches to fullscreen on mobile devices.
                  </DialogDescription>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <p>Content area</p>
                </div>
                <div className="border-t p-4">
                  <DialogClose asChild>
                    <Button className="w-full">Close</Button>
                  </DialogClose>
                </div>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Responsive Dialog</DialogTitle>
                  <DialogDescription>
                    This dialog automatically switches to fullscreen on mobile devices.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">Content area</p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

// ============================================================================
// Multi-Page Dialog
// ============================================================================

export const MultiPage: Story = {
  name: "Multi-Page Dialog",
  render: function MultiPageDemo() {
    const [open, setOpen] = React.useState(false);
    const { activePage, direction, nextPage, previousPage, isFirstPage, isLastPage, reset } =
      useDialogPages({ totalPages: 3 });

    const pages = [
      {
        id: "personal",
        title: "Personal Info",
        description: "Enter your personal information",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
            </div>
            <Input label="Email" type="email" placeholder="john@example.com" />
          </div>
        ),
      },
      {
        id: "account",
        title: "Account Setup",
        description: "Set up your account credentials",
        content: (
          <div className="space-y-4">
            <Input label="Username" placeholder="johndoe" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input label="Confirm Password" type="password" placeholder="••••••••" />
          </div>
        ),
      },
      {
        id: "review",
        title: "Review & Submit",
        description: "Review your information before submitting",
        content: (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Personal Info</h4>
              <p className="text-sm text-muted-foreground">John Doe - john@example.com</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Account</h4>
              <p className="text-sm text-muted-foreground">Username: johndoe</p>
            </div>
          </div>
        ),
      },
    ];

    const currentPage = pages[activePage as number];

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        reset();
      }
    };

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>Open Multi-Page Dialog</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Step {(activePage as number) + 1} of {pages.length}
            </div>
            <DialogTitle>{currentPage.title}</DialogTitle>
            <DialogDescription>{currentPage.description}</DialogDescription>
          </DialogHeader>
          <DialogPages
            pages={pages}
            activePage={activePage}
            direction={direction}
            transition="slide"
            className="min-h-[200px]"
          />
          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button
              colorStyle="ghost"
              onClick={previousPage}
              disabled={isFirstPage}
            >
              <ChevronLeft className="mr-1 size-4" />
              Back
            </Button>
            {isLastPage ? (
              <DialogClose asChild>
                <Button>
                  <Check className="mr-1 size-4" />
                  Submit
                </Button>
              </DialogClose>
            ) : (
              <Button onClick={nextPage}>
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const MultiPageFade: Story = {
  name: "Multi-Page (Fade Transition)",
  render: function MultiPageFadeDemo() {
    const [open, setOpen] = React.useState(false);
    const { activePage, direction, goToPage, reset } = useDialogPages({ totalPages: 3 });

    const pages = [
      {
        id: "tab1",
        content: (
          <div className="py-4">
            <h3 className="mb-2 font-medium">Tab 1 Content</h3>
            <p className="text-sm text-muted-foreground">
              This is the content for the first tab. Click the tabs above to switch.
            </p>
          </div>
        ),
      },
      {
        id: "tab2",
        content: (
          <div className="py-4">
            <h3 className="mb-2 font-medium">Tab 2 Content</h3>
            <p className="text-sm text-muted-foreground">
              This is the content for the second tab. Uses fade transition.
            </p>
          </div>
        ),
      },
      {
        id: "tab3",
        content: (
          <div className="py-4">
            <h3 className="mb-2 font-medium">Tab 3 Content</h3>
            <p className="text-sm text-muted-foreground">
              This is the content for the third tab.
            </p>
          </div>
        ),
      },
    ];

    return (
      <Dialog open={open} onOpenChange={(newOpen) => { setOpen(newOpen); if (!newOpen) reset(); }}>
        <DialogTrigger asChild>
          <Button>Open Tabbed Dialog</Button>
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Tabbed Content Dialog</DialogTitle>
            <DialogDescription>
              Click tabs to switch content with fade transition.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-1 border-b">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => goToPage(index)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activePage === index
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tab {index + 1}
              </button>
            ))}
          </div>
          <DialogPages
            pages={pages}
            activePage={activePage}
            direction={direction}
            transition="fade"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

// ============================================================================
// Nested Dialogs
// ============================================================================

export const NestedDialogs: Story = {
  name: "Nested Dialogs",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Parent Dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Parent Dialog</DialogTitle>
          <DialogDescription>
            This is the parent dialog. You can open a nested dialog from here.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Nested dialogs maintain proper stacking context and focus management.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button colorStyle="outlined">Open Nested Dialog</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Nested Dialog</DialogTitle>
                <DialogDescription>
                  This is a nested dialog inside the parent.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  You can even open another level!
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button colorStyle="ghost" size="sm" className="mt-2">
                      Open Third Level
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="xs">
                    <DialogHeader>
                      <DialogTitle>Third Level</DialogTitle>
                      <DialogDescription>
                        Three levels deep!
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button size="sm">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close Nested</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button colorStyle="ghost">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ============================================================================
// Confirmation Dialog
// ============================================================================

export const ConfirmationDialog: Story = {
  name: "Confirmation Dialog",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button colorStyle="destructive">
          <Trash2 className="mr-2 size-4" />
          Delete Item
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Item?</DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. This will permanently delete the item
            and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button colorStyle="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button colorStyle="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ============================================================================
// Form Dialog
// ============================================================================

export const FormDialog: Story = {
  name: "Form Dialog",
  render: function FormDialogDemo() {
    const [open, setOpen] = React.useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <User className="mr-2 size-4" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <div className="space-y-4 py-4">
              <Input
                label="Display Name"
                placeholder="Your display name"
                defaultValue="John Doe"
              />
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                defaultValue="john@example.com"
              />
              <Input
                label="Bio"
                placeholder="Tell us about yourself"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" colorStyle="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                <Save className="mr-2 size-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
};

// ============================================================================
// Settings Dialog
// ============================================================================

export const SettingsDialog: Story = {
  name: "Settings Dialog",
  render: function SettingsDialogDemo() {
    const [activeSection, setActiveSection] = React.useState("account");

    const sections = [
      { id: "account", icon: User, label: "Account" },
      { id: "billing", icon: CreditCard, label: "Billing" },
      { id: "notifications", icon: Mail, label: "Notifications" },
      { id: "security", icon: Lock, label: "Security" },
    ];

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button colorStyle="outlined">
            <Settings className="mr-2 size-4" />
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent size="xl" className="max-h-[85vh] overflow-hidden p-0">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-48 shrink-0 border-r bg-muted/30 p-4">
              <DialogTitle className="mb-4 text-base">Settings</DialogTitle>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <section.icon className="size-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <DialogDescription className="sr-only">
                Settings panel
              </DialogDescription>
              <h3 className="mb-4 text-lg font-medium capitalize">
                {activeSection}
              </h3>
              <p className="text-sm text-muted-foreground">
                Content for {activeSection} settings would go here.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
};

// ============================================================================
// Scrollable Content
// ============================================================================

export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Scrollable Dialog</Button>
      </DialogTrigger>
      <DialogContent size="md" className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read and accept the terms below.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[40vh] overflow-y-auto border-y py-4 pr-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="mb-4 text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button colorStyle="ghost">Decline</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ============================================================================
// Controlled Dialog
// ============================================================================

export const Controlled: Story = {
  render: function ControlledDemo() {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Dialog state: <strong>{open ? "Open" : "Closed"}</strong>
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open Dialog</Button>
          <Button colorStyle="outlined" onClick={() => setOpen(false)}>
            Close Dialog
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog&apos;s open state is controlled externally.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

// ============================================================================
// Custom Close Button
// ============================================================================

export const CustomCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent
        closeButton={
          <DialogClose className="absolute right-4 top-4 rounded-full bg-muted p-2 hover:bg-muted/80">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        }
      >
        <DialogHeader>
          <DialogTitle>Custom Close Button</DialogTitle>
          <DialogDescription>
            This dialog has a custom styled close button.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ============================================================================
// Prevent Background Close
// ============================================================================

export const PreventBackgroundClose: Story = {
  name: "Prevent Background Close",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Modal Dialog</Button>
      </DialogTrigger>
      <DialogContent preventBackgroundClose showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Important Action Required</DialogTitle>
          <DialogDescription>
            This dialog cannot be closed by clicking outside or pressing Escape.
            You must explicitly click one of the buttons below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Use <code className="rounded bg-muted px-1 py-0.5">preventBackgroundClose</code> when 
            you need to ensure the user makes an explicit choice before the dialog closes.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button colorStyle="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Confirm Action</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
