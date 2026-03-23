import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Container } from "./index";
import { Card, CardHeader, CardTitle, CardContent } from "../card";

/**
 * A responsive layout wrapper for page content that provides consistent
 * max-width constraints, padding, and optional centering.
 *
 * ## Features
 * - 6 max-width presets: `sm`, `md`, `lg`, `xl`, `2xl`, `full`
 * - 4 padding options: `none`, `tight`, `normal`, `wide`
 * - Optional centering with `center` prop
 * - MD3 surface container background options
 * - Supports `asChild` for semantic HTML elements
 *
 * ## Usage
 * ```tsx
 * <Container maxWidth="lg" padding="normal" center>
 *   <PageContent />
 * </Container>
 * ```
 */
const meta: Meta<typeof Container> = {
  title: "Free/Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive layout wrapper for page content following MD3 layout guidelines. Provides consistent max-width constraints, responsive padding, and optional centering.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full"],
      description: "Maximum width constraint for the container",
    },
    padding: {
      control: "select",
      options: ["none", "tight", "normal", "wide"],
      description: "Horizontal padding applied to the container",
    },
    center: {
      control: "boolean",
      description: "Whether to center the container horizontally",
    },
    background: {
      control: "select",
      options: ["transparent", "surface", "container", "containerLow", "containerHigh"],
      description: "Background color using MD3 surface container colors",
    },
    asChild: {
      control: "boolean",
      description: "Render as child element for semantic HTML",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

// ============================================================================
// Helper Components
// ============================================================================

const DemoContent = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
    <span className="text-sm text-muted-foreground">{children}</span>
  </div>
);

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-muted/30 min-h-[300px] py-8">{children}</div>
);

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: (args) => (
    <PageWrapper>
      <Container {...args}>
        <DemoContent>Default Container (max-width: 1400px, centered, normal padding)</DemoContent>
      </Container>
    </PageWrapper>
  ),
};

export const WithContent: Story = {
  render: () => (
    <PageWrapper>
      <Container>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Page Title</h1>
          <p className="text-muted-foreground">
            This container provides consistent max-width constraints and padding
            for page-level content. It follows MD3 layout guidelines with responsive
            padding that adapts to screen size.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Description of feature one.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Feature 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Description of feature two.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Feature 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Description of feature three.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </PageWrapper>
  ),
};

// ============================================================================
// Max Width Variants
// ============================================================================

export const MaxWidthVariants: Story = {
  name: "Max Width Variants",
  render: () => (
    <PageWrapper>
      <div className="space-y-4">
        <Container maxWidth="sm">
          <DemoContent>sm (640px)</DemoContent>
        </Container>
        <Container maxWidth="md">
          <DemoContent>md (768px)</DemoContent>
        </Container>
        <Container maxWidth="lg">
          <DemoContent>lg (1024px)</DemoContent>
        </Container>
        <Container maxWidth="xl">
          <DemoContent>xl (1280px)</DemoContent>
        </Container>
        <Container maxWidth="2xl">
          <DemoContent>2xl (1400px) - Default</DemoContent>
        </Container>
        <Container maxWidth="full">
          <DemoContent>full (no constraint)</DemoContent>
        </Container>
      </div>
    </PageWrapper>
  ),
};

// ============================================================================
// Padding Variants
// ============================================================================

export const PaddingVariants: Story = {
  name: "Padding Variants",
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2 px-4">padding="none"</p>
        <div className="bg-muted/30">
          <Container maxWidth="lg" padding="none">
            <DemoContent>No padding - edge to edge content</DemoContent>
          </Container>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2 px-4">padding="tight"</p>
        <div className="bg-muted/30">
          <Container maxWidth="lg" padding="tight">
            <DemoContent>Tight padding (1rem / 16px)</DemoContent>
          </Container>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2 px-4">padding="normal" (default)</p>
        <div className="bg-muted/30">
          <Container maxWidth="lg" padding="normal">
            <DemoContent>Normal responsive padding (1rem → 2rem)</DemoContent>
          </Container>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2 px-4">padding="wide"</p>
        <div className="bg-muted/30">
          <Container maxWidth="lg" padding="wide">
            <DemoContent>Wide responsive padding (1.5rem → 3rem)</DemoContent>
          </Container>
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// Centering
// ============================================================================

export const Centering: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2 px-4">center=true (default)</p>
        <div className="bg-muted/30 py-4">
          <Container maxWidth="md" center>
            <DemoContent>Centered container</DemoContent>
          </Container>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2 px-4">center=false</p>
        <div className="bg-muted/30 py-4">
          <Container maxWidth="md" center={false}>
            <DemoContent>Left-aligned container</DemoContent>
          </Container>
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// Background Variants
// ============================================================================

export const BackgroundVariants: Story = {
  name: "Background Variants",
  render: () => (
    <div className="space-y-4 py-8">
      <Container maxWidth="lg" background="transparent">
        <div className="p-4 rounded-lg border border-dashed border-border">
          <p className="text-sm">transparent (default) - No background</p>
        </div>
      </Container>
      <Container maxWidth="lg" background="surface" className="py-4">
        <div className="p-4 rounded-lg">
          <p className="text-sm">surface - Uses --surface color</p>
        </div>
      </Container>
      <Container maxWidth="lg" background="containerLow" className="py-4">
        <div className="p-4 rounded-lg">
          <p className="text-sm">containerLow - Uses --surface-container-low</p>
        </div>
      </Container>
      <Container maxWidth="lg" background="container" className="py-4">
        <div className="p-4 rounded-lg">
          <p className="text-sm">container - Uses --surface-container</p>
        </div>
      </Container>
      <Container maxWidth="lg" background="containerHigh" className="py-4">
        <div className="p-4 rounded-lg">
          <p className="text-sm">containerHigh - Uses --surface-container-high</p>
        </div>
      </Container>
    </div>
  ),
};

// ============================================================================
// Semantic HTML with asChild
// ============================================================================

export const SemanticHTML: Story = {
  name: "Semantic HTML (asChild)",
  render: () => (
    <PageWrapper>
      <Container asChild>
        <main>
          <h1 className="text-2xl font-bold mb-4">Main Content</h1>
          <p className="text-muted-foreground mb-6">
            Using <code className="px-1 py-0.5 bg-muted rounded text-sm">asChild</code> allows 
            the Container to render as a semantic HTML element like{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-sm">&lt;main&gt;</code>,{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-sm">&lt;section&gt;</code>, or{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-sm">&lt;article&gt;</code>.
          </p>
          <DemoContent>This container renders as a &lt;main&gt; element</DemoContent>
        </main>
      </Container>
    </PageWrapper>
  ),
};

// ============================================================================
// Reading Content Layout
// ============================================================================

export const ReadingLayout: Story = {
  name: "Reading Content Layout",
  render: () => (
    <PageWrapper>
      <Container maxWidth="md" padding="wide">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-4">Article Title</h1>
          <p className="text-muted-foreground text-lg mb-6">
            A narrow container with wide padding is ideal for long-form reading content
            like blog posts, documentation, or articles.
          </p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>
          <p className="text-muted-foreground">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </article>
      </Container>
    </PageWrapper>
  ),
};

// ============================================================================
// Dashboard Layout
// ============================================================================

export const DashboardLayout: Story = {
  name: "Dashboard Layout",
  render: () => (
    <PageWrapper>
      <Container maxWidth="2xl" padding="normal">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-secondary rounded-md">Filter</button>
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">
                Add New
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Revenue", "Users", "Orders", "Conversion"].map((metric) => (
              <Card key={metric}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$12,345</p>
                  <p className="text-xs text-green-600">+12.5% from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <DemoContent>Chart or table content would go here</DemoContent>
            </CardContent>
          </Card>
        </div>
      </Container>
    </PageWrapper>
  ),
};

// ============================================================================
// Nested Containers
// ============================================================================

export const NestedContainers: Story = {
  name: "Nested Containers",
  render: () => (
    <div className="space-y-0">
      {/* Full width hero */}
      <Container maxWidth="full" padding="none" background="containerLow" className="py-16">
        <Container maxWidth="lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Hero Section</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Full-width background with centered content using nested containers
            </p>
          </div>
        </Container>
      </Container>
      
      {/* Content section */}
      <Container maxWidth="lg" className="py-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Content Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Left Column</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Content in a narrower container for the main page body.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Right Column</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Grid layouts work great inside containers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
      
      {/* CTA section */}
      <Container maxWidth="full" padding="none" background="container" className="py-12">
        <Container maxWidth="md" className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Call to Action</h2>
          <p className="text-muted-foreground mb-6">
            Another full-width section with centered narrow content.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
            Get Started
          </button>
        </Container>
      </Container>
    </div>
  ),
};

// ============================================================================
// Responsive Behavior
// ============================================================================

export const ResponsiveBehavior: Story = {
  name: "Responsive Behavior",
  parameters: {
    docs: {
      description: {
        story:
          "Resize the viewport to see how the container adapts. Padding scales responsively while the max-width constrains content on larger screens.",
      },
    },
  },
  render: () => (
    <PageWrapper>
      <Container maxWidth="xl" padding="normal">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Responsive Container</h2>
          <p className="text-muted-foreground">
            This container uses <code className="px-1 py-0.5 bg-muted rounded text-sm">padding="normal"</code> which
            applies responsive padding:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Mobile: 1rem (16px) padding</li>
            <li>sm breakpoint (640px+): 1.5rem (24px) padding</li>
            <li>lg breakpoint (1024px+): 2rem (32px) padding</li>
          </ul>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-primary/50">{i}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </PageWrapper>
  ),
};
