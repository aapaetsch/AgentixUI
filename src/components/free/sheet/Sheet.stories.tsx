import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./index";
import { Button } from "../button";
import { Input } from "../input";
import { Separator } from "../separator";

const meta: Meta<typeof Sheet> = {
  title: "Free/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A Sheet is a slide-out panel that displays content from the edge of the screen. It extends the Dialog component to display content that complements the main content of the screen. Use Sheets for navigation menus, settings panels, detail views, or form inputs that don't require a full page transition.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

// ============================================================================
// Basic Examples
// ============================================================================

/**
 * Default sheet configuration with right positioning
 */
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 flex-1 overflow-auto px-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Input id="bio" defaultValue="Software developer" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// ============================================================================
// Position Variants
// ============================================================================

/**
 * Sheet appearing from the left edge - ideal for navigation menus
 */
export const LeftPosition: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent position="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Browse through the application sections.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 flex-1 px-6 py-4">
          {["Dashboard", "Profile", "Settings", "Messages", "Analytics", "Help"].map(
            (item) => (
              <Button key={item} variant="ghost" className="justify-start">
                {item}
              </Button>
            )
          )}
        </nav>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet appearing from the top - ideal for notifications or quick actions
 */
export const TopPosition: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent position="top" showHandle>
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Frequently used actions at your fingertips.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 px-6 py-4">
          <Button variant="secondary">New Document</Button>
          <Button variant="secondary">Upload File</Button>
          <Button variant="secondary">Share</Button>
          <Button variant="secondary">Export</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet appearing from the bottom (Drawer style) - ideal for mobile interactions
 */
export const BottomPosition: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet (Drawer)</Button>
      </SheetTrigger>
      <SheetContent position="bottom" showHandle>
        <SheetHeader>
          <SheetTitle>Share Document</SheetTitle>
          <SheetDescription>
            Choose how you want to share this document.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-6 py-4">
          <Button variant="ghost" className="justify-start gap-3">
            <span className="size-4">📧</span>
            Share via Email
          </Button>
          <Button variant="ghost" className="justify-start gap-3">
            <span className="size-4">🔗</span>
            Copy Link
          </Button>
          <Button variant="ghost" className="justify-start gap-3">
            <span className="size-4">💬</span>
            Share to Slack
          </Button>
          <Separator className="my-2" />
          <Button variant="ghost" className="justify-start gap-3 text-destructive">
            <span className="size-4">🗑️</span>
            Delete
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * Extra small sheet - minimal content
 */
export const SizeXS: Story = {
  name: "Size: Extra Small",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">XS Sheet</Button>
      </SheetTrigger>
      <SheetContent size="xs">
        <SheetHeader>
          <SheetTitle>Quick Note</SheetTitle>
        </SheetHeader>
        <div className="px-6 py-4">
          <p className="text-sm text-muted-foreground">
            A compact sheet for minimal content.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Small sheet
 */
export const SizeSM: Story = {
  name: "Size: Small",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">SM Sheet</Button>
      </SheetTrigger>
      <SheetContent size="sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Adjust your preferences</SheetDescription>
        </SheetHeader>
        <div className="px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Small sheet content area.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Large sheet - more content space
 */
export const SizeLG: Story = {
  name: "Size: Large",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">LG Sheet</Button>
      </SheetTrigger>
      <SheetContent size="lg">
        <SheetHeader>
          <SheetTitle>Document Preview</SheetTitle>
          <SheetDescription>
            Preview and edit your document in this larger panel.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="rounded-lg border bg-muted/50 p-4 min-h-[200px]">
            <p className="text-sm text-muted-foreground">
              Large sheet with more content space for complex layouts.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Extra large sheet
 */
export const SizeXL: Story = {
  name: "Size: Extra Large",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">XL Sheet</Button>
      </SheetTrigger>
      <SheetContent size="xl">
        <SheetHeader>
          <SheetTitle>Data Editor</SheetTitle>
          <SheetDescription>
            Edit complex data with plenty of room.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Section {i}</h4>
                <p className="text-sm text-muted-foreground">
                  Content for section {i} in the extra large sheet.
                </p>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Full-width sheet
 */
export const SizeFull: Story = {
  name: "Size: Full",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Full Sheet</Button>
      </SheetTrigger>
      <SheetContent size="full">
        <SheetHeader>
          <SheetTitle>Full Screen Editor</SheetTitle>
          <SheetDescription>
            A full-width sheet for immersive experiences.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="rounded-lg border bg-muted/50 p-8 min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Full-width content area
            </p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Exit</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// ============================================================================
// All Positions Showcase
// ============================================================================

/**
 * Showcase of all position variants
 */
export const AllPositions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["top", "right", "bottom", "left"] as const).map((position) => (
        <Sheet key={position}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {position}
            </Button>
          </SheetTrigger>
          <SheetContent
            position={position}
            showHandle={position === "top" || position === "bottom"}
          >
            <SheetHeader>
              <SheetTitle className="capitalize">{position} Sheet</SheetTitle>
              <SheetDescription>
                This sheet slides in from the {position}.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Content for the {position} positioned sheet.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

// ============================================================================
// Advanced Examples
// ============================================================================

/**
 * Sheet without close button - requires explicit action
 */
export const NoCloseButton: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (No X Button)</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Confirm Action</SheetTitle>
          <SheetDescription>
            This sheet requires an explicit action to close.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            You must click one of the buttons below to close this sheet.
          </p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Confirm</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet with prevent background close - modal-like behavior
 */
export const PreventBackgroundClose: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (Prevent Background Close)</Button>
      </SheetTrigger>
      <SheetContent preventBackgroundClose>
        <SheetHeader>
          <SheetTitle>Important Form</SheetTitle>
          <SheetDescription>
            Clicking outside or pressing Escape won&apos;t close this sheet.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-6 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="required-field" className="text-sm font-medium">
                Required Field
              </label>
              <Input id="required-field" placeholder="Enter value..." />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Submit</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet with scrollable content
 */
export const ScrollableContent: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (Scrollable)</Button>
      </SheetTrigger>
      <SheetContent size="sm">
        <SheetHeader>
          <SheetTitle>Long Content</SheetTitle>
          <SheetDescription>
            This sheet demonstrates scrollable content handling.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <h4 className="font-medium mb-1">Item {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  This is content item number {i + 1}. Scroll down to see more.
                </p>
              </div>
            ))}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Nested sheets demonstration
 */
export const NestedSheets: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open First Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>First Sheet</SheetTitle>
          <SheetDescription>
            This is the first sheet. You can open another sheet from here.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-6 py-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button>Open Nested Sheet</Button>
            </SheetTrigger>
            <SheetContent size="sm">
              <SheetHeader>
                <SheetTitle>Nested Sheet</SheetTitle>
                <SheetDescription>
                  This sheet is nested inside the first sheet.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Nested sheet content with proper z-index stacking.
                </p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close Nested</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close First</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Controlled sheet state
 */
export const Controlled: Story = {
  render: function ControlledSheet() {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Sheet is {open ? "open" : "closed"}
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open Sheet</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close Sheet
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Controlled Sheet</SheetTitle>
              <SheetDescription>
                This sheet&apos;s open state is controlled externally.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                The sheet can be opened and closed using external buttons.
              </p>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  },
};

/**
 * Sheet with custom overlay styling
 */
export const CustomOverlay: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (Custom Overlay)</Button>
      </SheetTrigger>
      <SheetContent overlayClassName="bg-primary/30 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle>Custom Overlay</SheetTitle>
          <SheetDescription>
            This sheet has a custom overlay with different colors and blur.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Notice the custom overlay styling behind this sheet.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
