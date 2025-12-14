import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Plus,
  ChevronRight,
  User,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  Truck,
  RotateCcw,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./index";

/**
 * A vertically stacked set of interactive headings that reveal or hide
 * associated content sections.
 *
 * ## Features
 * - Single or multiple expansion modes
 * - Collapsible option for single mode
 * - Custom animated chevron with pivot animation
 * - Support for custom icons with rotation
 * - Three animation presets: smooth (default), bounce, sharp
 * - Size variants for trigger and content
 * - Styling variants: default, bordered, separated
 */
const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      description: "Whether single or multiple items can be open at once",
    },
    collapsible: {
      control: "boolean",
      description: "When type is single, allows closing all items",
    },
    variant: {
      control: "select",
      options: ["default", "bordered", "separated"],
      description: "Visual style variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ============================================================================
// Basic Accordion Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern for accordions.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match your design system.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It uses CSS animations for smooth expand/collapse transitions
          and features a custom animated chevron.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>First Section</AccordionTrigger>
        <AccordionContent>
          Multiple items can be open simultaneously when type is "multiple".
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second Section</AccordionTrigger>
        <AccordionContent>
          Try opening this while keeping the first one open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third Section</AccordionTrigger>
        <AccordionContent>
          All three sections can be expanded at the same time.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-2"
      className="w-[400px]"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Product Information</AccordionTrigger>
        <AccordionContent>
          Our flagship product combines cutting-edge technology with sleek
          design. Built with premium materials for unparalleled performance.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Shipping Details</AccordionTrigger>
        <AccordionContent>
          We offer worldwide shipping through trusted courier partners.
          Standard delivery takes 3-5 business days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Return Policy</AccordionTrigger>
        <AccordionContent>
          We stand behind our products with a comprehensive 30-day return
          policy. If you're not satisfied, return items in original condition.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// ============================================================================
// Custom Icon Stories
// ============================================================================

export const CustomIcon: Story = {
  name: "Custom Icon (Rotates)",
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger icon={<Plus />}>
          Plus icon (rotates to X)
        </AccordionTrigger>
        <AccordionContent>
          When you provide a custom icon, it rotates 180° when the accordion
          opens, similar to the standard shadcn behavior.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger icon={<ChevronRight />}>
          Chevron right (rotates down)
        </AccordionTrigger>
        <AccordionContent>
          You can use any icon from lucide-react or your own custom icons.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger hideChevron>No icon at all</AccordionTrigger>
        <AccordionContent>
          Set hideChevron to remove the indicator entirely.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const AccordionAnimationPresets: Story = {
  name: "Accordion with Animation Presets",
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Smooth (Default)</span>
        <Accordion type="single" collapsible className="w-[400px]">
          <AccordionItem value="item-1">
            <AccordionTrigger chevronAnimation="smooth">
              Smooth animation
            </AccordionTrigger>
            <AccordionContent>
              Uses MD3 standard deceleration curve for a gentle, natural feel.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Bounce</span>
        <Accordion type="single" collapsible className="w-[400px]">
          <AccordionItem value="item-1">
            <AccordionTrigger chevronAnimation="bounce">
              Bounce animation
            </AccordionTrigger>
            <AccordionContent>
              Features a slight overshoot for a playful, energetic feel.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Sharp</span>
        <Accordion type="single" collapsible className="w-[400px]">
          <AccordionItem value="item-1">
            <AccordionTrigger chevronAnimation="sharp">
              Sharp animation
            </AccordionTrigger>
            <AccordionContent>
              Quick and snappy for responsive, precise UI interactions.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};

// ============================================================================
// Variant Stories
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Default
        </span>
        <Accordion
          type="single"
          collapsible
          variant="default"
          className="w-[400px]"
        >
          <AccordionItem value="item-1" variant="default">
            <AccordionTrigger>Default style</AccordionTrigger>
            <AccordionContent>
              Simple bottom border separating items.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" variant="default">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>Content for the second item.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Bordered
        </span>
        <Accordion
          type="single"
          collapsible
          variant="bordered"
          className="w-[400px]"
        >
          <AccordionItem value="item-1" variant="bordered">
            <AccordionTrigger>Bordered style</AccordionTrigger>
            <AccordionContent>
              Contained within a rounded border with dividers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" variant="bordered">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>Content for the second item.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Separated
        </span>
        <Accordion
          type="single"
          collapsible
          variant="separated"
          className="w-[400px]"
        >
          <AccordionItem value="item-1" variant="separated">
            <AccordionTrigger>Separated style</AccordionTrigger>
            <AccordionContent>
              Each item is visually separated with its own border.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" variant="separated">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>Content for the second item.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};

// ============================================================================
// Size Stories
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">Small</span>
        <Accordion type="single" collapsible className="w-[400px]">
          <AccordionItem value="item-1">
            <AccordionTrigger size="sm" chevronSize="sm">
              Small trigger
            </AccordionTrigger>
            <AccordionContent size="sm">
              Compact content for dense UIs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Medium (Default)
        </span>
        <Accordion type="single" collapsible className="w-[400px]">
          <AccordionItem value="item-1">
            <AccordionTrigger size="md" chevronSize="md">
              Medium trigger
            </AccordionTrigger>
            <AccordionContent size="md">
              Standard content size for most use cases.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">Large</span>
        <Accordion type="single" collapsible className="w-[400px]">
          <AccordionItem value="item-1">
            <AccordionTrigger size="lg" chevronSize="lg">
              Large trigger
            </AccordionTrigger>
            <AccordionContent size="lg">
              Larger content for prominent sections.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};

// ============================================================================
// Real World Examples
// ============================================================================

export const FAQExample: Story = {
  name: "FAQ Section",
  render: () => (
    <div className="w-[500px]">
      <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards (Visa, MasterCard, American
            Express), PayPal, and bank transfers. For enterprise customers, we
            also offer invoicing options.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How long does shipping take?</AccordionTrigger>
          <AccordionContent>
            Standard shipping takes 3-5 business days within the continental US.
            Express shipping (1-2 days) is available at checkout for an
            additional fee. International shipping times vary by location.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I return my purchase?</AccordionTrigger>
          <AccordionContent>
            Yes! We offer a 30-day return policy for all unused items in their
            original packaging. Simply initiate a return through your account
            dashboard or contact our support team.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Do you offer wholesale pricing?</AccordionTrigger>
          <AccordionContent>
            Yes, we offer wholesale pricing for orders over 100 units. Please
            contact our sales team at sales@example.com for a custom quote and
            to discuss volume discounts.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const SettingsExample: Story = {
  name: "Settings Panel",
  render: () => (
    <div className="w-[400px]">
      <h2 className="mb-4 text-lg font-semibold">Settings</h2>
      <Accordion type="multiple" variant="separated">
        <AccordionItem value="account" variant="separated">
          <AccordionTrigger icon={<User className="mr-2 size-4" />}>
            <span className="flex items-center gap-2">
              <User className="size-4" />
              Account
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">Manage your account settings and preferences.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Edit profile information</li>
                <li>• Change password</li>
                <li>• Two-factor authentication</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="billing" variant="separated">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <CreditCard className="size-4" />
              Billing
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">Manage your billing and payment methods.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View invoices</li>
                <li>• Update payment method</li>
                <li>• Change subscription plan</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="notifications" variant="separated">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Bell className="size-4" />
              Notifications
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">Configure how you receive notifications.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Email preferences</li>
                <li>• Push notifications</li>
                <li>• SMS alerts</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="security" variant="separated">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Shield className="size-4" />
              Security
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">Protect your account with security features.</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Login history</li>
                <li>• Active sessions</li>
                <li>• Security keys</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const ProductDetailsExample: Story = {
  name: "Product Details",
  render: () => (
    <div className="w-[500px]">
      <Accordion
        type="single"
        collapsible
        variant="bordered"
        defaultValue="description"
      >
        <AccordionItem value="description" variant="bordered">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <FileText className="size-4" />
              Product Description
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm leading-relaxed">
              Experience premium quality with our flagship product. Crafted with
              attention to detail, this item combines innovative design with
              durable materials. Perfect for everyday use, it seamlessly blends
              functionality with aesthetic appeal.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping" variant="bordered">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Truck className="size-4" />
              Shipping Information
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Standard Shipping:</strong> 3-5 business days - Free
              </p>
              <p>
                <strong>Express Shipping:</strong> 1-2 business days - $9.99
              </p>
              <p>
                <strong>International:</strong> 7-14 business days - Calculated
                at checkout
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns" variant="bordered">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <RotateCcw className="size-4" />
              Returns & Exchanges
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>
                We offer a hassle-free 30-day return policy. Items must be
                unused and in original packaging.
              </p>
              <p>
                To initiate a return, visit our Returns Center or contact
                customer support.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="help" variant="bordered">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <HelpCircle className="size-4" />
              Need Help?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>Our customer support team is here to help!</p>
              <p>
                <strong>Email:</strong> support@example.com
              </p>
              <p>
                <strong>Phone:</strong> 1-800-EXAMPLE
              </p>
              <p>
                <strong>Hours:</strong> Mon-Fri 9am-6pm EST
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// ============================================================================
// Controlled Example
// ============================================================================

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState<string | undefined>("item-1");

    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <div className="flex gap-2">
          <button
            onClick={() => setValue("item-1")}
            className={`rounded px-3 py-1 text-sm ${
              value === "item-1"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            Open First
          </button>
          <button
            onClick={() => setValue("item-2")}
            className={`rounded px-3 py-1 text-sm ${
              value === "item-2"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            Open Second
          </button>
          <button
            onClick={() => setValue(undefined)}
            className={`rounded px-3 py-1 text-sm ${
              value === undefined
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            Close All
          </button>
        </div>

        <Accordion
          type="single"
          collapsible
          value={value}
          onValueChange={setValue}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>First Item</AccordionTrigger>
            <AccordionContent>
              This accordion is controlled externally.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second Item</AccordionTrigger>
            <AccordionContent>
              Use the buttons above to control which item is open.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="text-xs text-muted-foreground">
          Current value: {value || "none"}
        </p>
      </div>
    );
  },
};
