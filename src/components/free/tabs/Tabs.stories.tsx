import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Home,
  User,
  Settings,
  Bell,
  Mail,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Heart,
  Star,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./index";

/**
 * A tabbed interface component following Material Design 3 patterns with shadcn/ui styling options.
 *
 * ## Features
 * - 4 variants: `primary` (MD3), `secondary` (MD3), `pills` (shadcn), `underline` (simple)
 * - 3 sizes: `sm`, `md`, `lg`
 * - Horizontal and vertical orientations
 * - Optional icon support in tab triggers
 * - Animated active indicator (MD3 motion)
 * - Full keyboard navigation
 * - Accessible via Radix UI primitives
 *
 * ## MD3 Specifications
 * - Primary tabs: 48dp height (text only), 64dp with icons, 3dp rounded indicator
 * - Secondary tabs: 48dp height, 2dp indicator
 * - Motion: 200ms standard duration, standard easing
 */
const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of tabs layout",
    },
    defaultValue: {
      control: "text",
      description: "Default active tab value",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password and security settings.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">General Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure general application settings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================================================
// Variants
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[500px]">
      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Primary (MD3)</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="primary">
            <TabsTrigger variant="primary" value="tab1">Overview</TabsTrigger>
            <TabsTrigger variant="primary" value="tab2">Analytics</TabsTrigger>
            <TabsTrigger variant="primary" value="tab3">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Primary tabs content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Secondary (MD3)</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="secondary">
            <TabsTrigger variant="secondary" value="tab1">Overview</TabsTrigger>
            <TabsTrigger variant="secondary" value="tab2">Analytics</TabsTrigger>
            <TabsTrigger variant="secondary" value="tab3">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Secondary tabs content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Pills (shadcn)</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="tab1">Overview</TabsTrigger>
            <TabsTrigger variant="pills" value="tab2">Analytics</TabsTrigger>
            <TabsTrigger variant="pills" value="tab3">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Pills tabs content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Underline</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="underline">
            <TabsTrigger variant="underline" value="tab1">Overview</TabsTrigger>
            <TabsTrigger variant="underline" value="tab2">Analytics</TabsTrigger>
            <TabsTrigger variant="underline" value="tab3">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Underline tabs content</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

export const PrimaryVariant: Story = {
  render: () => (
    <Tabs defaultValue="flights" className="w-[500px]">
      <TabsList variant="primary" size="lg">
        <TabsTrigger variant="primary" size="lg" value="flights">Flights</TabsTrigger>
        <TabsTrigger variant="primary" size="lg" value="trips">Trips</TabsTrigger>
        <TabsTrigger variant="primary" size="lg" value="explore">Explore</TabsTrigger>
      </TabsList>
      <TabsContent value="flights" size="lg">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Search Flights</h3>
          <p className="text-sm text-muted-foreground">
            Find and book flights to your destination.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="trips" size="lg">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Your Trips</h3>
          <p className="text-sm text-muted-foreground">
            View and manage your upcoming trips.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="explore" size="lg">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Explore Destinations</h3>
          <p className="text-sm text-muted-foreground">
            Discover popular travel destinations.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const SecondaryVariant: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList variant="secondary">
        <TabsTrigger variant="secondary" value="overview">Overview</TabsTrigger>
        <TabsTrigger variant="secondary" value="specifications">Specifications</TabsTrigger>
        <TabsTrigger variant="secondary" value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Product Overview</h3>
          <p className="text-sm text-muted-foreground">
            A comprehensive look at this product.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="specifications">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Technical Specifications</h3>
          <p className="text-sm text-muted-foreground">
            Detailed technical specifications.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reviews">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Customer Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Read what customers are saying.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const PillsVariant: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-[400px]">
      <TabsList variant="pills">
        <TabsTrigger variant="pills" value="all">All</TabsTrigger>
        <TabsTrigger variant="pills" value="unread">Unread</TabsTrigger>
        <TabsTrigger variant="pills" value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Showing all messages</p>
        </div>
      </TabsContent>
      <TabsContent value="unread">
        <div className="p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Showing unread messages</p>
        </div>
      </TabsContent>
      <TabsContent value="archived">
        <div className="p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Showing archived messages</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[500px]">
      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Small</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="primary" size="sm">
            <TabsTrigger variant="primary" size="sm" value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger variant="primary" size="sm" value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger variant="primary" size="sm" value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" size="sm">Small tabs content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Medium (Default)</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="primary" size="md">
            <TabsTrigger variant="primary" size="md" value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger variant="primary" size="md" value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger variant="primary" size="md" value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" size="md">Medium tabs content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Large</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="primary" size="lg">
            <TabsTrigger variant="primary" size="lg" value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger variant="primary" size="lg" value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger variant="primary" size="lg" value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" size="lg">Large tabs content</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

// ============================================================================
// With Icons
// ============================================================================

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-[500px]">
      <TabsList variant="primary" size="lg">
        <TabsTrigger variant="primary" size="lg" value="home" icon={<Home />}>
          Home
        </TabsTrigger>
        <TabsTrigger variant="primary" size="lg" value="profile" icon={<User />}>
          Profile
        </TabsTrigger>
        <TabsTrigger variant="primary" size="lg" value="settings" icon={<Settings />}>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" size="lg">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Welcome Home</h3>
          <p className="text-sm text-muted-foreground">
            Your personalized dashboard.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="profile" size="lg">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Your Profile</h3>
          <p className="text-sm text-muted-foreground">
            Manage your personal information.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" size="lg">
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure your preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const IconsAllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[500px]">
      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Primary with Icons</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="primary" size="lg">
            <TabsTrigger variant="primary" size="lg" value="tab1" icon={<Mail />}>Messages</TabsTrigger>
            <TabsTrigger variant="primary" size="lg" value="tab2" icon={<Bell />}>Notifications</TabsTrigger>
            <TabsTrigger variant="primary" size="lg" value="tab3" icon={<Calendar />}>Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Messages content</TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Pills with Icons</h3>
        <Tabs defaultValue="tab1">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="tab1" icon={<FileText />}>Documents</TabsTrigger>
            <TabsTrigger variant="pills" value="tab2" icon={<Image />}>Images</TabsTrigger>
            <TabsTrigger variant="pills" value="tab3" icon={<Video />}>Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Documents content</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-[300px]">
      <TabsList variant="primary">
        <TabsTrigger variant="primary" value="home" icon={<Home />} aria-label="Home" />
        <TabsTrigger variant="primary" value="favorites" icon={<Heart />} aria-label="Favorites" />
        <TabsTrigger variant="primary" value="starred" icon={<Star />} aria-label="Starred" />
        <TabsTrigger variant="primary" value="music" icon={<Music />} aria-label="Music" />
      </TabsList>
      <TabsContent value="home">Home content</TabsContent>
      <TabsContent value="favorites">Favorites content</TabsContent>
      <TabsContent value="starred">Starred content</TabsContent>
      <TabsContent value="music">Music content</TabsContent>
    </Tabs>
  ),
};

// ============================================================================
// Vertical Orientation
// ============================================================================

export const VerticalOrientation: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="w-[500px]">
      <TabsList variant="primary" orientation="vertical" className="w-40">
        <TabsTrigger variant="primary" orientation="vertical" value="general" icon={<Settings />}>
          General
        </TabsTrigger>
        <TabsTrigger variant="primary" orientation="vertical" value="profile" icon={<User />}>
          Profile
        </TabsTrigger>
        <TabsTrigger variant="primary" orientation="vertical" value="notifications" icon={<Bell />}>
          Notifications
        </TabsTrigger>
        <TabsTrigger variant="primary" orientation="vertical" value="security" icon={<Settings />}>
          Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">General Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure general application settings.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="profile" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your profile information.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Choose how you want to be notified.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="security" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">Security Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your security preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalPills: Story = {
  render: () => (
    <Tabs defaultValue="overview" orientation="vertical" className="w-[500px]">
      <TabsList variant="pills" orientation="vertical" className="w-36">
        <TabsTrigger variant="pills" orientation="vertical" value="overview">Overview</TabsTrigger>
        <TabsTrigger variant="pills" orientation="vertical" value="analytics">Analytics</TabsTrigger>
        <TabsTrigger variant="pills" orientation="vertical" value="reports">Reports</TabsTrigger>
        <TabsTrigger variant="pills" orientation="vertical" value="exports">Exports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">Overview</h3>
          <p className="text-sm text-muted-foreground">Dashboard overview</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground">View your analytics</p>
        </div>
      </TabsContent>
      <TabsContent value="reports" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">Reports</h3>
          <p className="text-sm text-muted-foreground">Generate reports</p>
        </div>
      </TabsContent>
      <TabsContent value="exports" className="flex-1">
        <div className="p-4 rounded-lg border h-full">
          <h3 className="font-medium mb-2">Exports</h3>
          <p className="text-sm text-muted-foreground">Export your data</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================================================
// Disabled States
// ============================================================================

export const DisabledTabs: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList variant="primary">
        <TabsTrigger variant="primary" value="active">Active Tab</TabsTrigger>
        <TabsTrigger variant="primary" value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger variant="primary" value="another">Another Tab</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <div className="p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            The middle tab is disabled and cannot be selected.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="another">
        <div className="p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Another tab content.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================================================
// Controlled State
// ============================================================================

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("tab1");

    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <Tabs value={value} onValueChange={setValue}>
          <TabsList variant="primary">
            <TabsTrigger variant="primary" value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger variant="primary" value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger variant="primary" value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
        <p className="text-sm text-muted-foreground">
          Current tab: <strong>{value}</strong>
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setValue("tab1")}
          >
            Go to Tab 1
          </button>
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setValue("tab2")}
          >
            Go to Tab 2
          </button>
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setValue("tab3")}
          >
            Go to Tab 3
          </button>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Real-World Examples
// ============================================================================

export const SettingsPage: Story = {
  name: "Example: Settings Page",
  render: () => (
    <div className="w-[600px] p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <Tabs defaultValue="profile" orientation="vertical">
        <TabsList variant="secondary" orientation="vertical" className="w-44">
          <TabsTrigger variant="secondary" orientation="vertical" value="profile" icon={<User />}>
            Profile
          </TabsTrigger>
          <TabsTrigger variant="secondary" orientation="vertical" value="account" icon={<Settings />}>
            Account
          </TabsTrigger>
          <TabsTrigger variant="secondary" orientation="vertical" value="notifications" icon={<Bell />}>
            Notifications
          </TabsTrigger>
          <TabsTrigger variant="secondary" orientation="vertical" value="billing" icon={<FileText />}>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="flex-1 ml-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile Settings</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <input className="w-full px-3 py-2 border rounded-md" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input className="w-full px-3 py-2 border rounded-md" placeholder="john@example.com" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="account" className="flex-1 ml-4">
          <h3 className="text-lg font-medium">Account Settings</h3>
          <p className="text-muted-foreground">Manage your account preferences.</p>
        </TabsContent>
        <TabsContent value="notifications" className="flex-1 ml-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <p className="text-muted-foreground">Configure your notification settings.</p>
        </TabsContent>
        <TabsContent value="billing" className="flex-1 ml-4">
          <h3 className="text-lg font-medium">Billing Information</h3>
          <p className="text-muted-foreground">Manage your billing and payment methods.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const ProductPage: Story = {
  name: "Example: Product Page",
  render: () => (
    <div className="w-[500px]">
      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
        <span className="text-muted-foreground">Product Image</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">Premium Headphones</h1>
      <p className="text-xl font-semibold text-primary mb-4">$299.99</p>
      <Tabs defaultValue="description">
        <TabsList variant="underline">
          <TabsTrigger variant="underline" value="description">Description</TabsTrigger>
          <TabsTrigger variant="underline" value="specs">Specifications</TabsTrigger>
          <TabsTrigger variant="underline" value="reviews">Reviews (24)</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <p className="text-muted-foreground">
            Experience premium sound quality with our flagship headphones.
            Featuring active noise cancellation, 30-hour battery life, and
            ultra-comfortable ear cushions.
          </p>
        </TabsContent>
        <TabsContent value="specs">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Driver Size</span>
              <span>40mm</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Frequency Response</span>
              <span>20Hz - 20kHz</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Battery Life</span>
              <span>30 hours</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Weight</span>
              <span>250g</span>
            </li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-4 fill-primary text-primary" />
              ))}
              <span className="ml-2 text-sm">4.8 out of 5</span>
            </div>
            <p className="text-sm text-muted-foreground">Based on 24 reviews</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const DashboardTabs: Story = {
  name: "Example: Dashboard",
  render: () => (
    <div className="w-[600px] p-4 bg-muted/30 rounded-lg">
      <Tabs defaultValue="overview">
        <TabsList variant="pills" className="mb-4">
          <TabsTrigger variant="pills" value="overview">Overview</TabsTrigger>
          <TabsTrigger variant="pills" value="analytics">Analytics</TabsTrigger>
          <TabsTrigger variant="pills" value="reports">Reports</TabsTrigger>
          <TabsTrigger variant="pills" value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">$45,231</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground">Subscriptions</p>
              <p className="text-2xl font-bold">+2,350</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">+12,234</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="h-48 bg-background rounded-lg border flex items-center justify-center">
            <span className="text-muted-foreground">Analytics Chart</span>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="h-48 bg-background rounded-lg border flex items-center justify-center">
            <span className="text-muted-foreground">Reports List</span>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="h-48 bg-background rounded-lg border flex items-center justify-center">
            <span className="text-muted-foreground">Notifications Center</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <p className="text-sm text-muted-foreground max-w-md text-center">
        Click tabs to see the animated indicator transition between tabs.
        Try keyboard navigation with arrow keys.
      </p>
      <Tabs defaultValue="tab1" className="w-[500px]">
        <TabsList variant="primary" size="lg">
          <TabsTrigger variant="primary" size="lg" value="tab1" icon={<Home />}>
            Home
          </TabsTrigger>
          <TabsTrigger variant="primary" size="lg" value="tab2" icon={<User />}>
            Profile
          </TabsTrigger>
          <TabsTrigger variant="primary" size="lg" value="tab3" icon={<Settings />}>
            Settings
          </TabsTrigger>
          <TabsTrigger variant="primary" size="lg" value="tab4" icon={<Bell />}>
            Alerts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" size="lg">
          <div className="p-6 rounded-lg border bg-muted/30">
            <h3 className="font-medium mb-2">Welcome Home</h3>
            <p className="text-sm text-muted-foreground">
              This is the home tab with animated indicator transitions.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="tab2" size="lg">
          <div className="p-6 rounded-lg border bg-muted/30">
            <h3 className="font-medium mb-2">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Your profile information and settings.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="tab3" size="lg">
          <div className="p-6 rounded-lg border bg-muted/30">
            <h3 className="font-medium mb-2">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your application preferences.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="tab4" size="lg">
          <div className="p-6 rounded-lg border bg-muted/30">
            <h3 className="font-medium mb-2">Alerts</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your notifications.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
