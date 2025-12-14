import type { Meta, StoryObj } from "@storybook/react";
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
} from "./index";
import { Card, CardHeader, CardContent, CardActions } from "../card";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";
import { Button } from "../button";

/**
 * # Skeleton
 *
 * Loading placeholder components that display animated placeholders while content is loading.
 *
 * ## Features
 * - Multiple shapes: rect, circle, pill, text
 * - Two animation styles: pulse (default), shimmer
 * - Pre-composed variants: SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton, SkeletonInput
 * - Full dark mode support with different colors
 * - Accessible with proper ARIA attributes
 *
 * ## Usage
 * ```tsx
 * // Basic skeleton
 * <Skeleton className="w-32 h-8" />
 *
 * // Text placeholder
 * <SkeletonText lines={3} />
 *
 * // Card placeholder
 * <SkeletonCard showAvatar showActions />
 * ```
 */
const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    shape: {
      control: "select",
      options: ["rect", "circle", "pill", "text"],
      description: "Shape of the skeleton",
    },
    animation: {
      control: "select",
      options: ["pulse", "shimmer", "none"],
      description: "Animation style",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "full", "auto"],
      description: "Height preset",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;
type TextStory = StoryObj<typeof SkeletonText>;
type CardStory = StoryObj<typeof SkeletonCard>;
type AvatarStory = StoryObj<typeof SkeletonAvatar>;
type ButtonStory = StoryObj<typeof SkeletonButton>;
type InputStory = StoryObj<typeof SkeletonInput>;

// ============================================================================
// Basic Skeleton Stories
// ============================================================================

export const Default: Story = {
  args: {
    className: "w-48",
  },
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="rect" className="w-32 h-8" />
        <span className="text-xs text-muted-foreground">rect</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="circle" size="3xl" />
        <span className="text-xs text-muted-foreground">circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="pill" className="w-24 h-8" />
        <span className="text-xs text-muted-foreground">pill</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton shape="text" className="w-48 h-4" />
        <span className="text-xs text-muted-foreground">text</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <div className="flex items-center gap-4">
        <Skeleton size="xs" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">xs</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton size="sm" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">sm</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton size="md" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">md</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton size="lg" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">lg</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton size="xl" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">xl</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton size="2xl" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">2xl</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton size="3xl" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">3xl</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton size="4xl" className="w-full" />
        <span className="text-xs text-muted-foreground w-8">4xl</span>
      </div>
    </div>
  ),
};

// ============================================================================
// Animation Stories
// ============================================================================

export const PulseAnimation: Story = {
  args: {
    animation: "pulse",
    className: "w-48 h-12",
  },
  parameters: {
    docs: {
      description: {
        story: "Default pulse animation with gentle opacity changes.",
      },
    },
  },
};

export const ShimmerAnimation: Story = {
  args: {
    animation: "shimmer",
    className: "w-48 h-12",
  },
  parameters: {
    docs: {
      description: {
        story: "Shimmer animation with a gradient sliding effect.",
      },
    },
  },
};

export const NoAnimation: Story = {
  args: {
    animation: "none",
    className: "w-48 h-12",
  },
  parameters: {
    docs: {
      description: {
        story: "Static skeleton without animation.",
      },
    },
  },
};

export const AnimationComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-64">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Pulse (default)</span>
        <Skeleton animation="pulse" className="w-full h-12" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Shimmer</span>
        <Skeleton animation="shimmer" className="w-full h-12" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">None</span>
        <Skeleton animation="none" className="w-full h-12" />
      </div>
    </div>
  ),
};

// ============================================================================
// SkeletonText Stories
// ============================================================================

export const TextDefault: TextStory = {
  render: () => (
    <div className="w-80">
      <SkeletonText />
    </div>
  ),
};

export const TextLines: TextStory = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">1 line</p>
        <SkeletonText lines={1} />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">3 lines (default)</p>
        <SkeletonText lines={3} />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">5 lines</p>
        <SkeletonText lines={5} />
      </div>
    </div>
  ),
};

export const TextGap: TextStory = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">gap="xs"</p>
        <SkeletonText lines={3} gap="xs" />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">gap="sm" (default)</p>
        <SkeletonText lines={3} gap="sm" />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">gap="md"</p>
        <SkeletonText lines={3} gap="md" />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">gap="lg"</p>
        <SkeletonText lines={3} gap="lg" />
      </div>
    </div>
  ),
};

export const TextLineHeight: TextStory = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">lineHeight="xs"</p>
        <SkeletonText lines={3} lineHeight="xs" />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">lineHeight="md" (default)</p>
        <SkeletonText lines={3} lineHeight="md" />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">lineHeight="xl"</p>
        <SkeletonText lines={3} lineHeight="xl" />
      </div>
    </div>
  ),
};

export const TextLastLineShort: TextStory = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">lastLineShort=true (default)</p>
        <SkeletonText lines={4} lastLineShort={true} />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">lastLineShort=false</p>
        <SkeletonText lines={4} lastLineShort={false} />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">lastLineWidth="40%"</p>
        <SkeletonText lines={4} lastLineWidth="40%" />
      </div>
    </div>
  ),
};

export const TextWithShimmer: TextStory = {
  render: () => (
    <div className="w-80">
      <SkeletonText lines={4} animation="shimmer" />
    </div>
  ),
};

// ============================================================================
// SkeletonCard Stories
// ============================================================================

export const CardDefault: CardStory = {
  render: () => (
    <div className="w-80">
      <SkeletonCard />
    </div>
  ),
};

export const CardWithAvatar: CardStory = {
  render: () => (
    <div className="w-80">
      <SkeletonCard showAvatar />
    </div>
  ),
};

export const CardWithActions: CardStory = {
  render: () => (
    <div className="w-80">
      <SkeletonCard showActions />
    </div>
  ),
};

export const CardFull: CardStory = {
  render: () => (
    <div className="w-80">
      <SkeletonCard showAvatar showActions actionCount={3} />
    </div>
  ),
};

export const CardNoMedia: CardStory = {
  render: () => (
    <div className="w-80">
      <SkeletonCard showMedia={false} showAvatar contentLines={4} />
    </div>
  ),
};

export const CardAspectRatios: CardStory = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="w-64">
        <p className="text-sm text-muted-foreground mb-2">square</p>
        <SkeletonCard mediaAspectRatio="square" contentLines={2} />
      </div>
      <div className="w-64">
        <p className="text-sm text-muted-foreground mb-2">video (default)</p>
        <SkeletonCard mediaAspectRatio="video" contentLines={2} />
      </div>
      <div className="w-64">
        <p className="text-sm text-muted-foreground mb-2">wide</p>
        <SkeletonCard mediaAspectRatio="wide" contentLines={2} />
      </div>
      <div className="w-64">
        <p className="text-sm text-muted-foreground mb-2">tall</p>
        <SkeletonCard mediaAspectRatio="tall" contentLines={2} />
      </div>
    </div>
  ),
};

export const CardSizes: CardStory = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="w-56">
        <p className="text-sm text-muted-foreground mb-2">size="sm"</p>
        <SkeletonCard size="sm" showAvatar contentLines={2} />
      </div>
      <div className="w-72">
        <p className="text-sm text-muted-foreground mb-2">size="md" (default)</p>
        <SkeletonCard size="md" showAvatar contentLines={2} />
      </div>
      <div className="w-80">
        <p className="text-sm text-muted-foreground mb-2">size="lg"</p>
        <SkeletonCard size="lg" showAvatar contentLines={2} />
      </div>
    </div>
  ),
};

export const CardShimmer: CardStory = {
  render: () => (
    <div className="w-80">
      <SkeletonCard animation="shimmer" showAvatar showActions />
    </div>
  ),
};

// ============================================================================
// SkeletonAvatar Stories
// ============================================================================

export const AvatarDefault: AvatarStory = {
  render: () => <SkeletonAvatar />,
};

export const AvatarSizes: AvatarStory = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="xs" />
        <span className="text-xs text-muted-foreground">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="sm" />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="md" />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="lg" />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="xl" />
        <span className="text-xs text-muted-foreground">xl</span>
      </div>
    </div>
  ),
};

export const AvatarShapes: AvatarStory = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="lg" shape="circle" />
        <span className="text-xs text-muted-foreground">circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="lg" shape="square" />
        <span className="text-xs text-muted-foreground">square</span>
      </div>
    </div>
  ),
};

// ============================================================================
// SkeletonButton Stories
// ============================================================================

export const ButtonDefault: ButtonStory = {
  render: () => <SkeletonButton />,
};

export const ButtonSizes: ButtonStory = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="xs" />
        <span className="text-xs text-muted-foreground">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="sm" />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="md" />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="lg" />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="xl" />
        <span className="text-xs text-muted-foreground">xl</span>
      </div>
    </div>
  ),
};

export const ButtonIconOnly: ButtonStory = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="sm" iconOnly />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="md" iconOnly />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton size="lg" iconOnly />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  ),
};

export const ButtonShapes: ButtonStory = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton shape="rect" />
        <span className="text-xs text-muted-foreground">rect</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton shape="round" />
        <span className="text-xs text-muted-foreground">round</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonButton shape="round" iconOnly />
        <span className="text-xs text-muted-foreground">round icon</span>
      </div>
    </div>
  ),
};

// ============================================================================
// SkeletonInput Stories
// ============================================================================

export const InputDefault: InputStory = {
  render: () => (
    <div className="w-64">
      <SkeletonInput />
    </div>
  ),
};

export const InputWithLabel: InputStory = {
  render: () => (
    <div className="w-64">
      <SkeletonInput showLabel />
    </div>
  ),
};

export const InputSizes: InputStory = {
  render: () => (
    <div className="flex flex-col gap-6 w-64">
      <div>
        <p className="text-sm text-muted-foreground mb-2">size="sm"</p>
        <SkeletonInput size="sm" showLabel />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">size="md" (default)</p>
        <SkeletonInput size="md" showLabel />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">size="lg"</p>
        <SkeletonInput size="lg" showLabel />
      </div>
    </div>
  ),
};

// ============================================================================
// Real-World Use Cases
// ============================================================================

export const ProfileCard: Story = {
  name: "Use Case: Profile Card",
  render: () => (
    <Card className="w-80">
      <CardHeader className="flex flex-row items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <SkeletonText lines={3} />
      </CardContent>
      <CardActions>
        <SkeletonButton size="sm" />
        <SkeletonButton size="sm" />
      </CardActions>
    </Card>
  ),
};

export const ArticleList: Story = {
  name: "Use Case: Article List",
  render: () => (
    <div className="space-y-4 w-96">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="w-24 h-24 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <SkeletonText lines={2} lineHeight="sm" />
            <div className="flex items-center gap-2 pt-2">
              <SkeletonAvatar size="xs" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FormLoading: Story = {
  name: "Use Case: Form Loading",
  render: () => (
    <div className="space-y-6 w-80 p-6 border rounded-lg">
      <SkeletonInput showLabel />
      <SkeletonInput showLabel />
      <SkeletonInput showLabel />
      <div className="flex justify-end gap-2 pt-4">
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </div>
  ),
};

export const CommentList: Story = {
  name: "Use Case: Comment List",
  render: () => (
    <div className="space-y-6 w-96">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <SkeletonText lines={2} lineHeight="sm" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const DashboardStats: Story = {
  name: "Use Case: Dashboard Stats",
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-96">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  ),
};

export const ProductGrid: Story = {
  name: "Use Case: Product Grid",
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[500px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="w-full aspect-square" animation="shimmer" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <SkeletonButton size="sm" className="w-full" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TableRows: Story = {
  name: "Use Case: Table Rows",
  render: () => (
    <div className="border rounded-lg overflow-hidden w-[500px]">
      <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      ))}
    </div>
  ),
};

// ============================================================================
// Comparison: Loading vs Loaded State
// ============================================================================

export const LoadingVsLoaded: Story = {
  name: "Comparison: Loading vs Loaded",
  render: () => (
    <div className="flex gap-8">
      {/* Loading State */}
      <div className="w-80">
        <p className="text-sm font-medium mb-4 text-muted-foreground">Loading</p>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <SkeletonAvatar size="lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <SkeletonText lines={3} />
          </CardContent>
        </Card>
      </div>

      {/* Loaded State */}
      <div className="w-80">
        <p className="text-sm font-medium mb-4 text-muted-foreground">Loaded</p>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar size="lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">John Doe</h3>
              <p className="text-sm text-muted-foreground">Developer</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
