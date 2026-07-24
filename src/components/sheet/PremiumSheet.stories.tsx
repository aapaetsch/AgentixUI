import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  PremiumSheet,
  PremiumSheetTrigger,
  PremiumSheetContent,
  PremiumSheetHeader,
  PremiumSheetFooter,
  PremiumSheetTitle,
  PremiumSheetDescription,
  PremiumSheetClose,
} from "./index";
import { Button } from "../button";
import { Separator } from "../separator";

const meta: Meta<typeof PremiumSheet> = {
  title: "Overlay/Sheet",
  component: PremiumSheet,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Premium Sheet extends the base Sheet with advanced gesture support, spring animations, snap points, and enhanced customization. Perfect for mobile-first interfaces that require swipe-to-dismiss functionality and fluid animations.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PremiumSheet>;

// ============================================================================
// Basic Examples
// ============================================================================

/**
 * Default premium sheet with swipe-to-dismiss
 */
export const Default: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Open Premium Sheet</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent>
        <PremiumSheetHeader>
          <PremiumSheetTitle>Premium Sheet</PremiumSheetTitle>
          <PremiumSheetDescription>
            Try swiping this sheet to the right to close it.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            This sheet supports gesture-based interactions. Swipe in the
            direction of the edge to close.
          </p>
        </div>
        <PremiumSheetFooter>
          <PremiumSheetClose asChild>
            <Button variant="outline">Close</Button>
          </PremiumSheetClose>
        </PremiumSheetFooter>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Smooth animation (default) - gentle deceleration
 */
export const AnimationSmooth: Story = {
  name: "Animation: Smooth",
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Smooth Animation</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent animationType="smooth">
        <PremiumSheetHeader>
          <PremiumSheetTitle>Smooth Animation</PremiumSheetTitle>
          <PremiumSheetDescription>
            Default smooth animation with gentle deceleration.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            tension: 200, friction: 26
          </p>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

/**
 * Bounce animation - playful overshoot
 */
export const AnimationBounce: Story = {
  name: "Animation: Bounce",
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Bounce Animation</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent animationType="bounce">
        <PremiumSheetHeader>
          <PremiumSheetTitle>Bounce Animation</PremiumSheetTitle>
          <PremiumSheetDescription>
            Playful bounce animation with overshoot.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            tension: 300, friction: 10
          </p>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

/**
 * Elastic animation - bounces back when pulled
 */
export const AnimationElastic: Story = {
  name: "Animation: Elastic",
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Elastic Animation</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent animationType="elastic">
        <PremiumSheetHeader>
          <PremiumSheetTitle>Elastic Animation</PremiumSheetTitle>
          <PremiumSheetDescription>
            Elastic animation with springy feel.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            tension: 200, friction: 12
          </p>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

/**
 * Stiff animation - quick and snappy
 */
export const AnimationStiff: Story = {
  name: "Animation: Stiff",
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Stiff Animation</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent animationType="stiff">
        <PremiumSheetHeader>
          <PremiumSheetTitle>Stiff Animation</PremiumSheetTitle>
          <PremiumSheetDescription>
            Quick and responsive stiff animation.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            tension: 400, friction: 30
          </p>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

/**
 * Showcase of all animation types
 */
export const AllAnimations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["smooth", "stiff", "bounce", "elastic", "slow", "fast"] as const).map(
        (type) => (
          <PremiumSheet key={type}>
            <PremiumSheetTrigger asChild>
              <Button variant="outline" className="capitalize">
                {type}
              </Button>
            </PremiumSheetTrigger>
            <PremiumSheetContent animationType={type}>
              <PremiumSheetHeader>
                <PremiumSheetTitle className="capitalize">
                  {type} Animation
                </PremiumSheetTitle>
                <PremiumSheetDescription>
                  Try swiping to feel the {type} animation.
                </PremiumSheetDescription>
              </PremiumSheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Swipe right to close this sheet.
                </p>
              </div>
            </PremiumSheetContent>
          </PremiumSheet>
        )
      )}
    </div>
  ),
};

// ============================================================================
// Snap Points
// ============================================================================

/**
 * Bottom sheet with snap points
 */
export const SnapPoints: Story = {
  render: function SnapPointsStory() {
    const [snapIndex, setSnapIndex] = React.useState<number | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Current snap point: {snapIndex !== null ? `${snapIndex}` : "none"}
        </p>
        <PremiumSheet>
          <PremiumSheetTrigger asChild>
            <Button variant="outline">Open with Snap Points</Button>
          </PremiumSheetTrigger>
          <PremiumSheetContent
            position="bottom"
            size="lg"
            showHandle
            snapPoints={[0.25, 0.5, 0.75, 1]}
            defaultSnapPoint={3}
            onSnapPointChange={setSnapIndex}
            animationType="smooth"
          >
            <PremiumSheetHeader>
              <PremiumSheetTitle>Snap Points Demo</PremiumSheetTitle>
              <PremiumSheetDescription>
                Drag the sheet to snap to different positions.
              </PremiumSheetDescription>
            </PremiumSheetHeader>
            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">25% - Peek</h4>
                  <p className="text-sm text-muted-foreground">
                    Just a preview of content
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">50% - Half</h4>
                  <p className="text-sm text-muted-foreground">
                    Show more content
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">75% - Most</h4>
                  <p className="text-sm text-muted-foreground">
                    Almost full view
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">100% - Full</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete expanded view
                  </p>
                </div>
              </div>
            </div>
          </PremiumSheetContent>
        </PremiumSheet>
      </div>
    );
  },
};

/**
 * Bottom drawer with two snap points (collapsed/expanded)
 */
export const TwoSnapPoints: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        position="bottom"
        size="lg"
        showHandle
        snapPoints={[0.4, 1]}
        defaultSnapPoint={0}
        animationType="bounce"
      >
        <PremiumSheetHeader>
          <PremiumSheetTitle>Expandable Drawer</PremiumSheetTitle>
          <PremiumSheetDescription>
            Drag up to expand, drag down to collapse or close.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="space-y-3">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="rounded-lg border p-3">
                <p className="text-sm">Item {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

// ============================================================================
// Gesture Sensitivity
// ============================================================================

/**
 * Custom gesture sensitivity - easier to close
 */
export const EasyToClose: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Easy to Close</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        gestureSensitivity={{
          velocityThreshold: 0.2,
          distanceThreshold: 0.15,
          enableSwipe: true,
        }}
      >
        <PremiumSheetHeader>
          <PremiumSheetTitle>Easy Close</PremiumSheetTitle>
          <PremiumSheetDescription>
            This sheet requires less effort to close via swipe.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Lower velocity and distance thresholds make it easier to dismiss.
          </p>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

/**
 * Custom gesture sensitivity - harder to close
 */
export const HardToClose: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Hard to Close</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        gestureSensitivity={{
          velocityThreshold: 1.0,
          distanceThreshold: 0.5,
          enableSwipe: true,
        }}
      >
        <PremiumSheetHeader>
          <PremiumSheetTitle>Sticky Sheet</PremiumSheetTitle>
          <PremiumSheetDescription>
            This sheet requires more effort to close via swipe.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Higher thresholds make the sheet stick more. You need to swipe
            faster or further to dismiss.
          </p>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

/**
 * Swipe disabled - button only
 */
export const SwipeDisabled: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Swipe Disabled</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        gestureSensitivity={{
          enableSwipe: false,
        }}
      >
        <PremiumSheetHeader>
          <PremiumSheetTitle>No Swipe</PremiumSheetTitle>
          <PremiumSheetDescription>
            Swipe gestures are disabled. Use the button to close.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            This is useful when the sheet contains scrollable content that
            might conflict with swipe gestures.
          </p>
        </div>
        <PremiumSheetFooter>
          <PremiumSheetClose asChild>
            <Button>Close</Button>
          </PremiumSheetClose>
        </PremiumSheetFooter>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

// ============================================================================
// Position Examples with Gestures
// ============================================================================

/**
 * All positions with swipe gestures
 */
export const AllPositionsWithGestures: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["top", "right", "bottom", "left"] as const).map((position) => (
        <PremiumSheet key={position}>
          <PremiumSheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {position}
            </Button>
          </PremiumSheetTrigger>
          <PremiumSheetContent
            position={position}
            showHandle={position === "top" || position === "bottom"}
            animationType="elastic"
          >
            <PremiumSheetHeader>
              <PremiumSheetTitle className="capitalize">
                {position} Sheet
              </PremiumSheetTitle>
              <PremiumSheetDescription>
                Swipe towards the {position} edge to close.
              </PremiumSheetDescription>
            </PremiumSheetHeader>
            <div className="flex-1 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                This sheet has elastic animation and supports gesture closing.
              </p>
            </div>
          </PremiumSheetContent>
        </PremiumSheet>
      ))}
    </div>
  ),
};

// ============================================================================
// Custom Spring Config
// ============================================================================

/**
 * Custom spring configuration
 */
export const CustomSpring: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Custom Spring</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        springConfig={{
          tension: 150,
          friction: 8,
          mass: 1.5,
        }}
      >
        <PremiumSheetHeader>
          <PremiumSheetTitle>Custom Spring Physics</PremiumSheetTitle>
          <PremiumSheetDescription>
            Using custom tension, friction, and mass values.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>tension: 150 (lower = slower)</p>
            <p>friction: 8 (lower = more bouncy)</p>
            <p>mass: 1.5 (higher = more inertia)</p>
          </div>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

// ============================================================================
// Mobile-Style Examples
// ============================================================================

/**
 * Mobile action sheet style
 */
export const MobileActionSheet: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Open Actions</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        position="bottom"
        size="sm"
        showHandle
        animationType="stiff"
        showCloseButton={false}
      >
        <div className="pt-2">
          <div className="flex flex-col gap-1 px-2">
            <Button variant="ghost" className="justify-start gap-3 h-12">
              <span className="text-lg">📷</span>
              Take Photo
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12">
              <span className="text-lg">🖼️</span>
              Choose from Library
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12">
              <span className="text-lg">📁</span>
              Browse Files
            </Button>
            <Separator className="my-2" />
            <PremiumSheetClose asChild>
              <Button variant="ghost" className="justify-start gap-3 h-12 text-muted-foreground">
                Cancel
              </Button>
            </PremiumSheetClose>
          </div>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

/**
 * Music player style bottom sheet
 */
export const MusicPlayerSheet: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Now Playing</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        position="bottom"
        size="lg"
        showHandle
        snapPoints={[0.15, 0.6, 1]}
        defaultSnapPoint={1}
        animationType="smooth"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center px-6 py-4">
          {/* Album Art */}
          <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mb-6 flex items-center justify-center">
            <span className="text-6xl">🎵</span>
          </div>

          {/* Track Info */}
          <h3 className="text-lg font-semibold">Song Title</h3>
          <p className="text-sm text-muted-foreground mb-6">Artist Name</p>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-muted rounded-full mb-2">
            <div className="w-1/3 h-full bg-primary rounded-full" />
          </div>
          <div className="w-full flex justify-between text-xs text-muted-foreground mb-6">
            <span>1:23</span>
            <span>3:45</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon">
              ⏮️
            </Button>
            <Button variant="default" size="icon" className="h-14 w-14 rounded-full">
              ▶️
            </Button>
            <Button variant="ghost" size="icon">
              ⏭️
            </Button>
          </div>
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};

// ============================================================================
// Nested Premium Sheets
// ============================================================================

/**
 * Nested premium sheets with gestures
 */
export const NestedPremiumSheets: Story = {
  render: () => (
    <PremiumSheet>
      <PremiumSheetTrigger asChild>
        <Button variant="outline">Open First</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent animationType="smooth">
        <PremiumSheetHeader>
          <PremiumSheetTitle>First Sheet</PremiumSheetTitle>
          <PremiumSheetDescription>
            This is the first sheet with gesture support.
          </PremiumSheetDescription>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          <PremiumSheet>
            <PremiumSheetTrigger asChild>
              <Button>Open Second Sheet</Button>
            </PremiumSheetTrigger>
            <PremiumSheetContent size="sm" animationType="bounce">
              <PremiumSheetHeader>
                <PremiumSheetTitle>Second Sheet</PremiumSheetTitle>
                <PremiumSheetDescription>
                  Nested sheet with bounce animation.
                </PremiumSheetDescription>
              </PremiumSheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Both sheets can be swiped to dismiss independently.
                </p>
              </div>
            </PremiumSheetContent>
          </PremiumSheet>
        </div>
        <PremiumSheetFooter>
          <PremiumSheetClose asChild>
            <Button variant="outline">Close</Button>
          </PremiumSheetClose>
        </PremiumSheetFooter>
      </PremiumSheetContent>
    </PremiumSheet>
  ),
};
